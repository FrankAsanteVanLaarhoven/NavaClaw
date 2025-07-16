"""
Distributed Crawling Manager

This module provides a high-level interface for managing distributed crawling operations,
including job creation, worker management, and result aggregation.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import uuid

from .job_queue import (
    CrawlJob, CrawlTask, TaskStatus, TaskPriority, 
    PersistentJobQueue, job_queue
)
from .task_executors import get_task_executor

logger = logging.getLogger(__name__)

class DistributedCrawler:
    """
    Distributed crawler that manages jobs across multiple workers using
    PostgreSQL for persistence and Redis for distributed queueing.
    """
    
    def __init__(self):
        self.job_queue = job_queue
        self.logger = logging.getLogger(__name__)
    
    async def create_job(self, name: str, description: str = "", 
                        config: Dict[str, Any] = None, 
                        user_id: Optional[str] = None) -> CrawlJob:
        """
        Create a new crawl job.
        
        Args:
            name: Job name
            description: Job description
            config: Job configuration
            user_id: Optional user ID
            
        Returns:
            Created CrawlJob instance
        """
        job = CrawlJob(
            name=name,
            description=description,
            config=config or {},
            user_id=user_id
        )
        
        self.logger.info(f"Created job {job.job_id}: {name}")
        return job
    
    async def add_url_task(self, job: CrawlJob, url: str, 
                          priority: TaskPriority = TaskPriority.NORMAL,
                          metadata: Dict[str, Any] = None) -> CrawlTask:
        """
        Add a URL crawling task to a job.
        
        Args:
            job: The job to add the task to
            url: URL to crawl
            priority: Task priority
            metadata: Additional task metadata
            
        Returns:
            Created CrawlTask instance
        """
        task = CrawlTask(
            url=url,
            task_type="url",
            priority=priority,
            metadata=metadata or {}
        )
        
        job.tasks.append(task)
        self.logger.info(f"Added URL task {task.task_id} to job {job.job_id}")
        return task
    
    async def add_batch_task(self, job: CrawlJob, urls: List[str],
                           priority: TaskPriority = TaskPriority.NORMAL,
                           metadata: Dict[str, Any] = None) -> CrawlTask:
        """
        Add a batch crawling task to a job.
        
        Args:
            job: The job to add the task to
            urls: List of URLs to crawl
            priority: Task priority
            metadata: Additional task metadata
            
        Returns:
            Created CrawlTask instance
        """
        task = CrawlTask(
            url=",".join(urls),  # Store URLs as comma-separated string
            task_type="batch",
            priority=priority,
            metadata={
                **(metadata or {}),
                "urls": urls,
                "url_count": len(urls)
            }
        )
        
        job.tasks.append(task)
        self.logger.info(f"Added batch task {task.task_id} with {len(urls)} URLs to job {job.job_id}")
        return task
    
    async def add_offline_task(self, job: CrawlJob, input_path: str,
                             priority: TaskPriority = TaskPriority.NORMAL,
                             metadata: Dict[str, Any] = None) -> CrawlTask:
        """
        Add an offline crawling task to a job.
        
        Args:
            job: The job to add the task to
            input_path: Path to directory or zip file
            priority: Task priority
            metadata: Additional task metadata
            
        Returns:
            Created CrawlTask instance
        """
        task = CrawlTask(
            url=input_path,  # Use url field for input path
            task_type="offline",
            priority=priority,
            metadata={
                **(metadata or {}),
                "input_path": input_path
            }
        )
        
        job.tasks.append(task)
        self.logger.info(f"Added offline task {task.task_id} for {input_path} to job {job.job_id}")
        return task
    
    async def submit_job(self, job: CrawlJob) -> str:
        """
        Submit a job for execution.
        
        Args:
            job: The job to submit
            
        Returns:
            Job ID
        """
        try:
            # Store job in PostgreSQL
            job_id = await self.job_queue.create_job(job)
            
            # Submit tasks to Redis queue
            for task in job.tasks:
                await self.job_queue.submit_to_redis_queue(task)
            
            self.logger.info(f"Submitted job {job_id} with {len(job.tasks)} tasks")
            return job_id
            
        except Exception as e:
            self.logger.error(f"Failed to submit job {job.job_id}: {e}")
            raise
    
    async def get_job_status(self, job_id: str) -> Optional[CrawlJob]:
        """
        Get job status and progress.
        
        Args:
            job_id: Job ID to check
            
        Returns:
            CrawlJob instance with current status
        """
        return await self.job_queue.get_job(job_id)
    
    async def list_jobs(self, user_id: Optional[str] = None,
                       status: Optional[TaskStatus] = None,
                       limit: int = 50) -> List[CrawlJob]:
        """
        List jobs with optional filtering.
        
        Args:
            user_id: Filter by user ID
            status: Filter by job status
            limit: Maximum number of jobs to return
            
        Returns:
            List of CrawlJob instances
        """
        return await self.job_queue.list_jobs(user_id, status, limit)
    
    async def cancel_job(self, job_id: str) -> bool:
        """
        Cancel a running job.
        
        Args:
            job_id: Job ID to cancel
            
        Returns:
            True if job was cancelled successfully
        """
        try:
            # Update job status
            success = await self.job_queue.update_job_status(job_id, TaskStatus.CANCELLED)
            
            if success:
                self.logger.info(f"Cancelled job {job_id}")
            else:
                self.logger.warning(f"Failed to cancel job {job_id}")
            
            return success
            
        except Exception as e:
            self.logger.error(f"Error cancelling job {job_id}: {e}")
            return False
    
    async def get_job_results(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Get aggregated results for a completed job.
        
        Args:
            job_id: Job ID to get results for
            
        Returns:
            Dictionary with job results and summary
        """
        job = await self.job_queue.get_job(job_id)
        if not job:
            return None
        
        # Aggregate results from all tasks
        results = {
            "job_id": job.job_id,
            "name": job.name,
            "description": job.description,
            "status": job.status.value,
            "created_at": job.created_at.isoformat(),
            "started_at": job.started_at.isoformat() if job.started_at else None,
            "completed_at": job.completed_at.isoformat() if job.completed_at else None,
            "total_tasks": len(job.tasks),
            "completed_tasks": sum(1 for t in job.tasks if t.status == TaskStatus.COMPLETED),
            "failed_tasks": sum(1 for t in job.tasks if t.status == TaskStatus.FAILED),
            "running_tasks": sum(1 for t in job.tasks if t.status == TaskStatus.RUNNING),
            "pending_tasks": sum(1 for t in job.tasks if t.status == TaskStatus.PENDING),
            "tasks": [],
            "summary": {}
        }
        
        # Add task results
        for task in job.tasks:
            task_result = {
                "task_id": task.task_id,
                "url": task.url,
                "task_type": task.task_type,
                "status": task.status.value,
                "priority": task.priority.value,
                "created_at": task.created_at.isoformat(),
                "started_at": task.started_at.isoformat() if task.started_at else None,
                "completed_at": task.completed_at.isoformat() if task.completed_at else None,
                "result": task.result,
                "error": task.error,
                "metadata": task.metadata
            }
            results["tasks"].append(task_result)
        
        # Generate summary
        if results["completed_tasks"] > 0:
            results["summary"] = self._generate_job_summary(job)
        
        return results
    
    def _generate_job_summary(self, job: CrawlJob) -> Dict[str, Any]:
        """
        Generate a summary of job results.
        
        Args:
            job: The job to summarize
            
        Returns:
            Summary dictionary
        """
        completed_tasks = [t for t in job.tasks if t.status == TaskStatus.COMPLETED]
        
        summary = {
            "total_urls_crawled": 0,
            "total_data_extracted": 0,
            "average_response_time": 0,
            "success_rate": len(completed_tasks) / len(job.tasks) if job.tasks else 0,
            "task_type_breakdown": {},
            "errors": []
        }
        
        response_times = []
        
        for task in completed_tasks:
            if task.result:
                # Count URLs
                if task.task_type == "url":
                    summary["total_urls_crawled"] += 1
                elif task.task_type == "batch":
                    urls = task.metadata.get("urls", [])
                    summary["total_urls_crawled"] += len(urls)
                
                # Count data extracted
                if "extracted_data" in task.result:
                    summary["total_data_extracted"] += len(task.result["extracted_data"])
                
                # Response time
                if "response_time" in task.result:
                    response_times.append(task.result["response_time"])
            
            # Collect errors
            if task.error:
                summary["errors"].append({
                    "task_id": task.task_id,
                    "error": task.error
                })
            
            # Task type breakdown
            task_type = task.task_type
            summary["task_type_breakdown"][task_type] = summary["task_type_breakdown"].get(task_type, 0) + 1
        
        # Calculate average response time
        if response_times:
            summary["average_response_time"] = sum(response_times) / len(response_times)
        
        return summary

# Global distributed crawler instance
distributed_crawler = DistributedCrawler()


# Convenience functions for common operations
async def crawl_offline(input_path: str,
                       output_dir: Optional[str] = None,
                       depth: int = 3,
                       num_workers: int = 2) -> Dict[str, Any]:
    """
    Convenience function for offline crawling.
    
    Args:
        input_path: Path to directory or zip file
        output_dir: Output directory
        depth: Crawl depth
        num_workers: Number of workers
        
    Returns:
        Crawl results
    """
    crawler = DistributedCrawler()
    
    try:
        job = await crawler.create_job(
            name=f"Offline Crawl: {uuid.uuid4()}",
            description=f"Offline crawl of {input_path}",
            config={"input_path": input_path, "output_dir": output_dir, "depth": depth}
        )
        
        # Add offline task
        await crawler.add_offline_task(job, input_path)
        
        job_id = await crawler.submit_job(job)
        completed_job = await distributed_crawler.get_job_status(job_id) # Wait for completion
        
        return await distributed_crawler.get_job_results(job_id)
        
    finally:
        # No explicit stop_workers needed here as job_queue handles persistence
        pass


async def crawl_urls(urls: List[str],
                    max_depth: int = 2,
                    max_pages: int = 100,
                    delay: float = 1.0,
                    num_workers: int = 2) -> Dict[str, Any]:
    """
    Convenience function for URL crawling.
    
    Args:
        urls: List of URLs to crawl
        max_depth: Maximum crawl depth
        max_pages: Maximum pages per URL
        delay: Delay between requests
        num_workers: Number of workers
        
    Returns:
        Crawl results
    """
    crawler = DistributedCrawler()
    
    try:
        job = await crawler.create_job(
            name=f"URL Crawl: {uuid.uuid4()}",
            description=f"Crawl {len(urls)} URLs",
            config={"urls": urls, "max_depth": max_depth, "max_pages": max_pages, "delay": delay}
        )
        
        # Add URL tasks
        for url in urls:
            await crawler.add_url_task(job, url)
        
        job_id = await crawler.submit_job(job)
        completed_job = await distributed_crawler.get_job_status(job_id) # Wait for completion
        
        return await distributed_crawler.get_job_results(job_id)
        
    finally:
        # No explicit stop_workers needed here as job_queue handles persistence
        pass


# CLI interface for distributed crawling
class DistributedCrawlerCLI:
    """Command-line interface for distributed crawling"""
    
    def __init__(self):
        self.crawler = None
    
    async def start(self, num_workers: int = 2):
        """Start the distributed crawler"""
        self.crawler = DistributedCrawler()
        # No explicit start_workers needed here as job_queue handles worker management
        print(f"Distributed crawler started (using PersistentJobQueue)")
    
    async def stop(self):
        """Stop the distributed crawler"""
        if self.crawler:
            # No explicit stop_workers needed here as job_queue handles worker management
            print("Distributed crawler stopped (using PersistentJobQueue)")
    
    async def create_job(self, name: str, description: str = "", 
                        config: Dict[str, Any] = None, 
                        user_id: Optional[str] = None):
        """Create a new job via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            job = await self.crawler.create_job(
                name=name,
                description=description,
                config=config,
                user_id=user_id
            )
            print(f"Created job: {job.job_id}")
        except Exception as e:
            print(f"Error creating job: {e}")
    
    async def add_task(self, job_id: str, url: Optional[str] = None, 
                       urls: Optional[List[str]] = None, 
                       input_path: Optional[str] = None,
                       task_type: Optional[str] = None,
                       priority: Optional[TaskPriority] = None,
                       metadata: Optional[Dict[str, Any]] = None):
        """Add a task to an existing job via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            job = await self.crawler.get_job_status(job_id)
            if not job:
                print(f"Job {job_id} not found.")
                return
            
            if url:
                await self.crawler.add_url_task(job, url, priority=priority)
            elif urls:
                await self.crawler.add_batch_task(job, urls, priority=priority)
            elif input_path:
                await self.crawler.add_offline_task(job, input_path, priority=priority)
            else:
                print("No URL, URLs, or input_path provided for task.")
                return
            
            print(f"Added task {job.tasks[-1].task_id} to job {job_id}")
        except Exception as e:
            print(f"Error adding task to job {job_id}: {e}")
    
    async def submit_job(self, job_id: str):
        """Submit a job for execution via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            job = await self.crawler.get_job_status(job_id)
            if not job:
                print(f"Job {job_id} not found.")
                return
            
            if job.status == TaskStatus.PENDING:
                print(f"Job {job_id} is already pending. No action needed.")
                return
            
            await self.crawler.submit_job(job)
            print(f"Submitted job {job_id} for execution.")
            
            # Monitor progress
            while True:
                job_status = await self.crawler.get_job_status(job_id)
                if job_status.status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
                    break
                
                progress = (job_status.completed_tasks + job_status.failed_tasks) / job_status.total_tasks * 100
                print(f"Progress: {progress:.1f}% ({job_status.completed_tasks}/{job_status.total_tasks} tasks)")
                await asyncio.sleep(2)
            
            results = await self.crawler.get_job_results(job_id)
            print(f"Job completed: {job_status.status.value}")
            print(f"Results saved to: {results.get('summary', {}).get('output_dir', 'Unknown')}")
            
        except Exception as e:
            print(f"Error during job execution: {e}")
    
    async def get_job_status(self, job_id: str):
        """Get job status via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            job_status = await self.crawler.get_job_status(job_id)
            if not job_status:
                print(f"Job {job_id} not found.")
                return
            
            print(f"Job {job_id} status: {job_status.status.value}")
            print(f"Total tasks: {job_status.total_tasks}")
            print(f"Completed tasks: {job_status.completed_tasks}")
            print(f"Failed tasks: {job_status.failed_tasks}")
            print(f"Running tasks: {job_status.running_tasks}")
            print(f"Pending tasks: {job_status.pending_tasks}")
            
        except Exception as e:
            print(f"Error getting job status for {job_id}: {e}")
    
    async def list_jobs(self, user_id: Optional[str] = None,
                       status: Optional[TaskStatus] = None,
                       limit: int = 50):
        """List jobs via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            jobs = await self.crawler.list_jobs(user_id, status, limit)
            if not jobs:
                print("No jobs found.")
                return
            
            print("\n--- Job List ---")
            for job in jobs:
                print(f"Job ID: {job.job_id}")
                print(f"Name: {job.name}")
                print(f"Description: {job.description}")
                print(f"Status: {job.status.value}")
                print(f"Created at: {job.created_at}")
                print(f"Total tasks: {len(job.tasks)}")
                print("-" * 20)
            
        except Exception as e:
            print(f"Error listing jobs: {e}")
    
    async def cancel_job(self, job_id: str):
        """Cancel a job via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            success = await self.crawler.cancel_job(job_id)
            if success:
                print(f"Job {job_id} cancelled.")
            else:
                print(f"Job {job_id} not found or failed to cancel.")
        except Exception as e:
            print(f"Error cancelling job {job_id}: {e}")
    
    async def get_job_results(self, job_id: str):
        """Get job results via CLI"""
        if not self.crawler:
            await self.start()
        
        try:
            results = await self.crawler.get_job_results(job_id)
            if not results:
                print(f"No results found for job {job_id}.")
                return
            
            print("\n--- Job Results ---")
            print(f"Job ID: {results['job_id']}")
            print(f"Name: {results['name']}")
            print(f"Description: {results['description']}")
            print(f"Status: {results['status']}")
            print(f"Created at: {results['created_at']}")
            print(f"Completed at: {results['completed_at']}")
            print(f"Total tasks: {results['total_tasks']}")
            print(f"Completed tasks: {results['completed_tasks']}")
            print(f"Failed tasks: {results['failed_tasks']}")
            print(f"Running tasks: {results['running_tasks']}")
            print(f"Pending tasks: {results['pending_tasks']}")
            
            print("\n--- Task Results ---")
            for task in results['tasks']:
                print(f"Task ID: {task['task_id']}")
                print(f"URL: {task['url']}")
                print(f"Type: {task['task_type']}")
                print(f"Status: {task['status']}")
                print(f"Priority: {task['priority']}")
                print(f"Created at: {task['created_at']}")
                print(f"Started at: {task['started_at']}")
                print(f"Completed at: {task['completed_at']}")
                print(f"Result: {task['result']}")
                print(f"Error: {task['error']}")
                print(f"Metadata: {task['metadata']}")
                print("-" * 20)
            
            print("\n--- Job Summary ---")
            print(results['summary'])
            
        except Exception as e:
            print(f"Error getting job results for {job_id}: {e}")
    
    async def cleanup_completed_jobs(self, older_than_days: int = 7) -> int:
        """
        Clean up completed jobs older than specified days.
        
        Args:
            older_than_days: Remove jobs completed more than this many days ago
            
        Returns:
            Number of jobs cleaned up
        """
        # This is a placeholder for cleanup functionality
        # In a real implementation, you'd implement job cleanup logic
        logger.info(f"Cleanup requested for jobs older than {older_than_days} days")
        return 0
    
    def get_system_stats(self) -> Dict[str, Any]:
        """
        Get system statistics.
        
        Returns:
            Dictionary with system statistics
        """
        # This is a simplified implementation for PersistentJobQueue
        # In a real distributed system, this would query the job store
        return {
            'workers_started': False, # No direct workers in this model
            'num_workers': 0,
            'max_concurrent_per_worker': 0,
            'available_executors': [],
            'timestamp': datetime.now().isoformat()
        }


# Example usage and testing
async def example_usage():
    """Example usage of the distributed crawler"""
    
    # Create distributed crawler
    cli = DistributedCrawlerCLI()
    
    try:
        # Example 1: Offline crawl
        print("Starting offline crawl...")
        await cli.create_job(
            name="Offline Crawl Example",
            description="Example offline crawl of a website",
            config={"input_path": "/path/to/website/files", "output_dir": "/path/to/results", "depth": 3}
        )
        
        await cli.add_task(
            job_id=cli.crawler.job_queue.last_job.job_id, # Get the last created job ID
            input_path="/path/to/website/files",
            task_type="offline"
        )
        
        await cli.submit_job(cli.crawler.job_queue.last_job.job_id)
        print(f"Submitted offline crawl job: {cli.crawler.job_queue.last_job.job_id}")
        
        # Wait for completion
        await cli.get_job_status(cli.crawler.job_queue.last_job.job_id) # Monitor progress
        
        results = await cli.get_job_results(cli.crawler.job_queue.last_job.job_id)
        print(f"Job completed: {results['status']}")
        print(f"Results saved to: {results.get('summary', {}).get('output_dir', 'Unknown')}")
        
        # Example 2: URL crawl
        print("\nStarting URL crawl...")
        await cli.create_job(
            name="URL Crawl Example",
            description="Example URL crawl of multiple websites",
            config={"urls": ["https://example.com", "https://example.org"], "max_depth": 2, "max_pages": 50}
        )
        
        await cli.add_task(
            job_id=cli.crawler.job_queue.last_job.job_id, # Get the last created job ID
            urls=["https://example.com", "https://example.org"],
            task_type="url"
        )
        
        await cli.submit_job(cli.crawler.job_queue.last_job.job_id)
        print(f"Submitted URL crawl job: {cli.crawler.job_queue.last_job.job_id}")
        
        # Wait for completion
        await cli.get_job_status(cli.crawler.job_queue.last_job.job_id) # Monitor progress
        
        results = await cli.get_job_results(cli.crawler.job_queue.last_job.job_id)
        print(f"URL crawl completed: {results['completed_tasks']} tasks")
        
    finally:
        await cli.stop()


if __name__ == "__main__":
    # Run example usage
    asyncio.run(example_usage()) 