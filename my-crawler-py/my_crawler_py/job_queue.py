"""
Job Queue Foundation for Distributed Crawling

This module provides the foundation for distributed crawling with:
- Task abstraction and serialization
- Job queue management
- Worker coordination
- Result storage and retrieval
- Progress tracking and monitoring
"""

import asyncio
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import json
import logging

# Import our new database and Redis modules
from .db import get_db_session, CrawlJobModel, CrawlResultModel, JobStatus
from .redis_queue import crawl_queue

logger = logging.getLogger(__name__)

class TaskStatus(Enum):
    """Status of a crawl task."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class TaskPriority(Enum):
    """Priority levels for crawl tasks."""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    URGENT = 4

@dataclass
class CrawlTask:
    """Represents a single crawl task within a job."""
    task_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    url: str = ""
    task_type: str = "url"  # url, batch, api, offline
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.NORMAL
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class CrawlJob:
    """Represents a crawl job containing multiple tasks."""
    job_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.NORMAL
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tasks: List[CrawlTask] = field(default_factory=list)
    config: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
    user_id: Optional[str] = None

class PersistentJobQueue:
    """Job queue with PostgreSQL persistence and Redis distributed queueing."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def create_job(self, job: CrawlJob) -> str:
        """Create a new crawl job and store it in PostgreSQL."""
        try:
            with get_db_session() as session:
                # Create job record
                job_model = CrawlJobModel(
                    job_id=job.job_id,
                    status=JobStatus.pending,
                    created_at=job.created_at,
                    config=job.config,
                    job_metadata=job.metadata,
                    user_id=job.user_id
                )
                session.add(job_model)
                
                # Create task records
                for task in job.tasks:
                    task_model = CrawlResultModel(
                        task_id=task.task_id,
                        job_id=job.job_id,
                        url=task.url,
                        task_type=task.task_type,
                        status=task.status.value,
                        priority=task.priority.value,
                        created_at=task.created_at,
                        task_metadata=task.metadata
                    )
                    session.add(task_model)
                
                session.commit()
                self.logger.info(f"Created job {job.job_id} with {len(job.tasks)} tasks")
                return job.job_id
                
        except Exception as e:
            self.logger.error(f"Failed to create job {job.job_id}: {e}")
            raise
    
    async def get_job(self, job_id: str) -> Optional[CrawlJob]:
        """Retrieve a job from PostgreSQL."""
        try:
            with get_db_session() as session:
                job_model = session.query(CrawlJobModel).filter(
                    CrawlJobModel.job_id == job_id
                ).first()
                
                if not job_model:
                    return None
                
                # Get tasks for this job
                task_models = session.query(CrawlResultModel).filter(
                    CrawlResultModel.job_id == job_id
                ).all()
                
                # Convert to CrawlJob
                job = CrawlJob(
                    job_id=job_model.job_id,
                    status=TaskStatus(job_model.status.value),
                    created_at=job_model.created_at,
                    config=job_model.config,
                    metadata=job_model.job_metadata,
                    user_id=job_model.user_id
                )
                
                # Convert tasks
                for task_model in task_models:
                    task = CrawlTask(
                        task_id=task_model.task_id,
                        url=task_model.url,
                        task_type=task_model.task_type,
                        status=TaskStatus(task_model.status),
                        priority=TaskPriority(task_model.priority),
                        created_at=task_model.created_at,
                        started_at=task_model.started_at,
                        completed_at=task_model.completed_at,
                        result=task_model.result,
                        error=task_model.error,
                        metadata=task_model.task_metadata
                    )
                    job.tasks.append(task)
                
                return job
                
        except Exception as e:
            self.logger.error(f"Failed to get job {job_id}: {e}")
            return None
    
    async def update_job_status(self, job_id: str, status: TaskStatus) -> bool:
        """Update job status in PostgreSQL."""
        try:
            with get_db_session() as session:
                job_model = session.query(CrawlJobModel).filter(
                    CrawlJobModel.job_id == job_id
                ).first()
                
                if not job_model:
                    return False
                
                job_model.status = JobStatus(status.value)
                job_model.updated_at = datetime.utcnow()
                
                if status == TaskStatus.RUNNING and not job_model.started_at:
                    job_model.started_at = datetime.utcnow()
                elif status in [TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED]:
                    job_model.completed_at = datetime.utcnow()
                
                session.commit()
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to update job status {job_id}: {e}")
            return False
    
    async def update_task_status(self, task_id: str, status: TaskStatus, 
                                result: Optional[Dict] = None, error: Optional[str] = None) -> bool:
        """Update task status in PostgreSQL."""
        try:
            with get_db_session() as session:
                task_model = session.query(CrawlResultModel).filter(
                    CrawlResultModel.task_id == task_id
                ).first()
                
                if not task_model:
                    return False
                
                task_model.status = status.value
                task_model.updated_at = datetime.utcnow()
                
                if status == TaskStatus.RUNNING and not task_model.started_at:
                    task_model.started_at = datetime.utcnow()
                elif status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
                    task_model.completed_at = datetime.utcnow()
                
                if result is not None:
                    task_model.result = result
                if error is not None:
                    task_model.error = error
                
                session.commit()
                return True
                
        except Exception as e:
            self.logger.error(f"Failed to update task status {task_id}: {e}")
            return False
    
    async def get_pending_tasks(self, limit: int = 10) -> List[CrawlTask]:
        """Get pending tasks from PostgreSQL, ordered by priority and creation time."""
        try:
            with get_db_session() as session:
                task_models = session.query(CrawlResultModel).filter(
                    CrawlResultModel.status == TaskStatus.PENDING.value
                ).order_by(
                    CrawlResultModel.priority.desc(),
                    CrawlResultModel.created_at.asc()
                ).limit(limit).all()
                
                tasks = []
                for task_model in task_models:
                    task = CrawlTask(
                        task_id=task_model.task_id,
                        url=task_model.url,
                        task_type=task_model.task_type,
                        status=TaskStatus(task_model.status),
                        priority=TaskPriority(task_model.priority),
                        created_at=task_model.created_at,
                        metadata=task_model.task_metadata
                    )
                    tasks.append(task)
                
                return tasks
                
        except Exception as e:
            self.logger.error(f"Failed to get pending tasks: {e}")
            return []
    
    async def list_jobs(self, user_id: Optional[str] = None, 
                       status: Optional[TaskStatus] = None, 
                       limit: int = 50) -> List[CrawlJob]:
        """List jobs from PostgreSQL with optional filtering."""
        try:
            with get_db_session() as session:
                query = session.query(CrawlJobModel)
                
                if user_id:
                    query = query.filter(CrawlJobModel.user_id == user_id)
                if status:
                    query = query.filter(CrawlJobModel.status == JobStatus(status.value))
                
                job_models = query.order_by(
                    CrawlJobModel.created_at.desc()
                ).limit(limit).all()
                
                jobs = []
                for job_model in job_models:
                    job = CrawlJob(
                        job_id=job_model.job_id,
                        status=TaskStatus(job_model.status.value),
                        created_at=job_model.created_at,
                        config=job_model.config,
                        metadata=job_model.job_metadata,
                        user_id=job_model.user_id
                    )
                    jobs.append(job)
                
                return jobs
                
        except Exception as e:
            self.logger.error(f"Failed to list jobs: {e}")
            return []
    
    async def submit_to_redis_queue(self, task: CrawlTask) -> bool:
        """Submit a task to Redis queue for distributed processing."""
        try:
            # Serialize task for Redis
            task_data = {
                'task_id': task.task_id,
                'url': task.url,
                'task_type': task.task_type,
                'priority': task.priority.value,
                'metadata': task.metadata
            }
            
            # Add to Redis queue
            job = crawl_queue.enqueue(
                'my_crawler_py.task_executors.process_task',
                task_data,
                job_id=task.task_id,
                priority=task.priority.value
            )
            
            self.logger.info(f"Submitted task {task.task_id} to Redis queue")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to submit task {task.task_id} to Redis: {e}")
            return False

class TaskExecutor:
    """Executes crawl tasks with proper error handling and logging."""
    
    def __init__(self, worker_id: str = None):
        self.worker_id = worker_id or str(uuid.uuid4())
        self.logger = logging.getLogger(__name__)
        self.running_tasks: Dict[str, asyncio.Task] = {}
    
    async def execute_task(self, task: CrawlTask, crawler_func) -> Dict[str, Any]:
        """Execute a single crawl task."""
        try:
            self.logger.info(f"Worker {self.worker_id} starting task {task.task_id}")
            
            # Update task status to running
            task.status = TaskStatus.RUNNING
            task.started_at = datetime.utcnow()
            
            # Execute the crawl
            result = await crawler_func(task.url, task.metadata)
            
            # Update task status to completed
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.utcnow()
            task.result = result
            
            self.logger.info(f"Worker {self.worker_id} completed task {task.task_id}")
            return result
            
        except Exception as e:
            self.logger.error(f"Worker {self.worker_id} failed task {task.task_id}: {e}")
            
            # Update task status to failed
            task.status = TaskStatus.FAILED
            task.completed_at = datetime.utcnow()
            task.error = str(e)
            
            raise
    
    async def execute_job(self, job: CrawlJob, crawler_func, max_concurrent: int = 5) -> Dict[str, Any]:
        """Execute all tasks in a job with concurrency control."""
        try:
            self.logger.info(f"Worker {self.worker_id} starting job {job.job_id}")
            
            # Update job status to running
            job.status = TaskStatus.RUNNING
            job.started_at = datetime.utcnow()
            
            # Execute tasks with concurrency control
            semaphore = asyncio.Semaphore(max_concurrent)
            
            async def execute_with_semaphore(task):
                async with semaphore:
                    return await self.execute_task(task, crawler_func)
            
            # Create tasks for all pending tasks
            tasks = [
                execute_with_semaphore(task) 
                for task in job.tasks 
                if task.status == TaskStatus.PENDING
            ]
            
            # Execute all tasks concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            successful_results = []
            failed_results = []
            
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    failed_results.append({
                        'task_id': job.tasks[i].task_id,
                        'error': str(result)
                    })
                else:
                    successful_results.append(result)
            
            # Update job status
            if failed_results:
                job.status = TaskStatus.FAILED
            else:
                job.status = TaskStatus.COMPLETED
            
            job.completed_at = datetime.utcnow()
            
            self.logger.info(f"Worker {self.worker_id} completed job {job.job_id}")
            
            return {
                'job_id': job.job_id,
                'status': job.status.value,
                'successful_results': successful_results,
                'failed_results': failed_results,
                'total_tasks': len(job.tasks),
                'successful_tasks': len(successful_results),
                'failed_tasks': len(failed_results)
            }
            
        except Exception as e:
            self.logger.error(f"Worker {self.worker_id} failed job {job.job_id}: {e}")
            job.status = TaskStatus.FAILED
            job.completed_at = datetime.utcnow()
            raise

# Global job queue instance
job_queue = PersistentJobQueue() 