#!/usr/bin/env python3
"""
Distributed Crawler CLI

Command-line interface for managing distributed crawling operations.
"""

import asyncio
import argparse
import json
import logging
import sys
from pathlib import Path
from typing import List, Optional

from my_crawler_py.distributed_crawler import DistributedCrawlerCLI, DistributedCrawler
from my_crawler_py.job_queue import TaskStatus

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DistributedCrawlerCLI:
    """Enhanced CLI for distributed crawling"""
    
    def __init__(self):
        self.crawler = None
    
    async def start(self, num_workers: int = 2, max_concurrent: int = 2):
        """Start the distributed crawler"""
        self.crawler = DistributedCrawler(
            num_workers=num_workers,
            max_concurrent_per_worker=max_concurrent,
            auto_start_workers=True
        )
        print(f"✅ Started distributed crawler with {num_workers} workers")
    
    async def stop(self):
        """Stop the distributed crawler"""
        if self.crawler:
            await self.crawler.stop_workers()
            print("🛑 Stopped distributed crawler")
    
    async def status(self):
        """Show system status"""
        if not self.crawler:
            print("❌ Distributed crawler not running")
            return
        
        stats = self.crawler.get_system_stats()
        print("\n📊 System Status:")
        print(f"  Workers: {stats['num_workers']} (started: {stats['workers_started']})")
        print(f"  Max concurrent per worker: {stats['max_concurrent_per_worker']}")
        print(f"  Available executors: {', '.join(stats['available_executors'])}")
        print(f"  Timestamp: {stats['timestamp']}")
    
    async def crawl_offline(self, input_path: str, output_dir: Optional[str] = None, depth: int = 3):
        """Execute offline crawl"""
        if not self.crawler:
            await self.start()
        
        try:
            print(f"🔄 Starting offline crawl of: {input_path}")
            
            job = await self.crawler.create_offline_crawl_job(
                input_path=input_path,
                output_dir=output_dir,
                depth=depth
            )
            
            job_id = await self.crawler.submit_job(job)
            print(f"📝 Submitted job: {job_id}")
            
            # Monitor progress
            await self._monitor_job_progress(job_id)
            
        except Exception as e:
            print(f"❌ Error during offline crawl: {e}")
            logger.error(f"Offline crawl failed: {e}")
    
    async def crawl_urls(self, urls: List[str], max_depth: int = 2, max_pages: int = 100, delay: float = 1.0):
        """Execute URL crawl"""
        if not self.crawler:
            await self.start()
        
        try:
            print(f"🔄 Starting URL crawl of {len(urls)} URLs")
            
            job = await self.crawler.create_url_crawl_job(
                urls=urls,
                max_depth=max_depth,
                max_pages=max_pages,
                delay=delay
            )
            
            job_id = await self.crawler.submit_job(job)
            print(f"📝 Submitted job: {job_id}")
            
            # Monitor progress
            await self._monitor_job_progress(job_id)
            
        except Exception as e:
            print(f"❌ Error during URL crawl: {e}")
            logger.error(f"URL crawl failed: {e}")
    
    async def crawl_batch(self, config_file: str):
        """Execute batch crawl from config file"""
        if not self.crawler:
            await self.start()
        
        try:
            print(f"🔄 Starting batch crawl from config: {config_file}")
            
            # Load config
            with open(config_file, 'r') as f:
                config = json.load(f)
            
            job = await self.crawler.create_batch_crawl_job(
                batch_configs=config.get('batch_configs', []),
                name=config.get('name'),
                description=config.get('description')
            )
            
            job_id = await self.crawler.submit_job(job)
            print(f"📝 Submitted job: {job_id}")
            
            # Monitor progress
            await self._monitor_job_progress(job_id)
            
        except Exception as e:
            print(f"❌ Error during batch crawl: {e}")
            logger.error(f"Batch crawl failed: {e}")
    
    async def list_jobs(self, status_filter: Optional[str] = None):
        """List all jobs"""
        if not self.crawler:
            print("❌ Distributed crawler not running")
            return
        
        try:
            jobs = await self.crawler.list_jobs(
                status_filter=TaskStatus(status_filter) if status_filter else None
            )
            
            if not jobs:
                print("📋 No jobs found")
                return
            
            print(f"\n📋 Jobs ({len(jobs)} total):")
            for job in jobs:
                print(f"  {job['job_id'][:8]} - {job['name']} ({job['status']})")
                
        except Exception as e:
            print(f"❌ Error listing jobs: {e}")
    
    async def get_job_status(self, job_id: str):
        """Get status of a specific job"""
        if not self.crawler:
            print("❌ Distributed crawler not running")
            return
        
        try:
            job = await self.crawler.get_job_status(job_id)
            if not job:
                print(f"❌ Job {job_id} not found")
                return
            
            print(f"\n📊 Job Status: {job_id}")
            print(f"  Name: {job.name}")
            print(f"  Type: {job.job_type}")
            print(f"  Status: {job.status.value}")
            print(f"  Progress: {job.completed_tasks}/{job.total_tasks} tasks")
            print(f"  Created: {job.created_at}")
            
            if job.started_at:
                print(f"  Started: {job.started_at}")
            if job.completed_at:
                print(f"  Completed: {job.completed_at}")
                
        except Exception as e:
            print(f"❌ Error getting job status: {e}")
    
    async def get_job_results(self, job_id: str, output_file: Optional[str] = None):
        """Get results of a completed job"""
        if not self.crawler:
            print("❌ Distributed crawler not running")
            return
        
        try:
            results = await self.crawler.get_job_results(job_id)
            if not results:
                print(f"❌ Results for job {job_id} not found")
                return
            
            if output_file:
                # Save results to file
                with open(output_file, 'w') as f:
                    json.dump(results, f, indent=2, default=str)
                print(f"💾 Results saved to: {output_file}")
            else:
                # Print summary
                print(f"\n📊 Job Results: {job_id}")
                print(f"  Name: {results['job_name']}")
                print(f"  Status: {results['status']}")
                print(f"  Tasks: {results['completed_tasks']}/{results['total_tasks']} completed")
                print(f"  Failed: {results['failed_tasks']}")
                
                if results.get('summary'):
                    print(f"  Summary: {results['summary']}")
                
        except Exception as e:
            print(f"❌ Error getting job results: {e}")
    
    async def cancel_job(self, job_id: str):
        """Cancel a running job"""
        if not self.crawler:
            print("❌ Distributed crawler not running")
            return
        
        try:
            success = await self.crawler.cancel_job(job_id)
            if success:
                print(f"✅ Job {job_id} cancelled successfully")
            else:
                print(f"❌ Failed to cancel job {job_id}")
                
        except Exception as e:
            print(f"❌ Error cancelling job: {e}")
    
    async def _monitor_job_progress(self, job_id: str):
        """Monitor job progress with real-time updates"""
        print(f"\n📈 Monitoring job progress: {job_id}")
        
        while True:
            try:
                job = await self.crawler.get_job_status(job_id)
                if not job:
                    print("❌ Job not found")
                    break
                
                if job.status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
                    progress = 100.0
                    print(f"\n✅ Job completed: {job.status.value}")
                    break
                
                # Calculate progress
                if job.total_tasks > 0:
                    progress = (job.completed_tasks + job.failed_tasks) / job.total_tasks * 100
                else:
                    progress = 0.0
                
                # Create progress bar
                bar_length = 30
                filled_length = int(bar_length * progress / 100)
                bar = '█' * filled_length + '░' * (bar_length - filled_length)
                
                print(f"\r📊 Progress: [{bar}] {progress:.1f}% ({job.completed_tasks}/{job.total_tasks} tasks)", end='', flush=True)
                
                await asyncio.sleep(2)
                
            except Exception as e:
                print(f"\n❌ Error monitoring job: {e}")
                break


def create_sample_config():
    """Create a sample batch crawl configuration file"""
    config = {
        "name": "Sample Batch Crawl",
        "description": "Example batch crawl configuration",
        "batch_configs": [
            {
                "type": "url_crawl",
                "urls": ["https://example.com", "https://example.org"],
                "max_depth": 2,
                "max_pages": 50,
                "priority": 2
            },
            {
                "type": "offline_crawl",
                "input_path": "/path/to/website/files",
                "output_dir": "/path/to/results",
                "depth": 3,
                "priority": 1
            }
        ]
    }
    
    config_file = "sample_batch_config.json"
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"📝 Created sample configuration: {config_file}")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description="Distributed Crawler CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Start distributed crawler
  python distributed_crawler_cli.py start --workers 4

  # Crawl offline files
  python distributed_crawler_cli.py crawl-offline /path/to/files --depth 3

  # Crawl URLs
  python distributed_crawler_cli.py crawl-urls https://example.com https://example.org

  # Monitor job progress
  python distributed_crawler_cli.py status
  python distributed_crawler_cli.py job-status <job_id>

  # Get job results
  python distributed_crawler_cli.py job-results <job_id> --output results.json
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Start command
    start_parser = subparsers.add_parser('start', help='Start distributed crawler')
    start_parser.add_argument('--workers', type=int, default=2, help='Number of workers')
    start_parser.add_argument('--max-concurrent', type=int, default=2, help='Max concurrent tasks per worker')
    
    # Stop command
    subparsers.add_parser('stop', help='Stop distributed crawler')
    
    # Status command
    subparsers.add_parser('status', help='Show system status')
    
    # Crawl offline command
    offline_parser = subparsers.add_parser('crawl-offline', help='Crawl offline files')
    offline_parser.add_argument('input_path', help='Input path (directory or zip file)')
    offline_parser.add_argument('--output-dir', help='Output directory')
    offline_parser.add_argument('--depth', type=int, default=3, help='Crawl depth')
    
    # Crawl URLs command
    urls_parser = subparsers.add_parser('crawl-urls', help='Crawl URLs')
    urls_parser.add_argument('urls', nargs='+', help='URLs to crawl')
    urls_parser.add_argument('--max-depth', type=int, default=2, help='Maximum crawl depth')
    urls_parser.add_argument('--max-pages', type=int, default=100, help='Maximum pages per URL')
    urls_parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests')
    
    # Crawl batch command
    batch_parser = subparsers.add_parser('crawl-batch', help='Crawl using batch configuration')
    batch_parser.add_argument('config_file', help='Batch configuration file')
    
    # List jobs command
    list_parser = subparsers.add_parser('list-jobs', help='List all jobs')
    list_parser.add_argument('--status', help='Filter by status (pending, running, completed, failed)')
    
    # Job status command
    job_status_parser = subparsers.add_parser('job-status', help='Get job status')
    job_status_parser.add_argument('job_id', help='Job ID')
    
    # Job results command
    job_results_parser = subparsers.add_parser('job-results', help='Get job results')
    job_results_parser.add_argument('job_id', help='Job ID')
    job_results_parser.add_argument('--output', help='Output file for results')
    
    # Cancel job command
    cancel_parser = subparsers.add_parser('cancel-job', help='Cancel a job')
    cancel_parser.add_argument('job_id', help='Job ID')
    
    # Create sample config command
    subparsers.add_parser('create-sample-config', help='Create sample batch configuration file')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Create CLI instance
    cli = DistributedCrawlerCLI()
    
    async def run_command():
        try:
            if args.command == 'start':
                await cli.start(args.workers, args.max_concurrent)
                
            elif args.command == 'stop':
                await cli.stop()
                
            elif args.command == 'status':
                await cli.status()
                
            elif args.command == 'crawl-offline':
                await cli.crawl_offline(args.input_path, args.output_dir, args.depth)
                
            elif args.command == 'crawl-urls':
                await cli.crawl_urls(args.urls, args.max_depth, args.max_pages, args.delay)
                
            elif args.command == 'crawl-batch':
                await cli.crawl_batch(args.config_file)
                
            elif args.command == 'list-jobs':
                await cli.list_jobs(args.status)
                
            elif args.command == 'job-status':
                await cli.get_job_status(args.job_id)
                
            elif args.command == 'job-results':
                await cli.get_job_results(args.job_id, args.output)
                
            elif args.command == 'cancel-job':
                await cli.cancel_job(args.job_id)
                
            elif args.command == 'create-sample-config':
                create_sample_config()
                
        except KeyboardInterrupt:
            print("\n🛑 Interrupted by user")
            await cli.stop()
        except Exception as e:
            print(f"❌ Error: {e}")
            logger.error(f"CLI error: {e}")
        finally:
            await cli.stop()
    
    # Run the command
    asyncio.run(run_command())


if __name__ == "__main__":
    main() 