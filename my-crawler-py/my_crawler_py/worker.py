#!/usr/bin/env python3
"""
Worker module for processing distributed crawling jobs.
This runs in a separate container and processes jobs from the Redis queue.
"""

import os
import sys
import time
import logging
from typing import Dict, Any
import signal

from redis import Redis
from rq import Worker, Queue, Connection
from rq.worker import HerokuWorker as Worker

from .config import get_config
from .db import get_db_session, Job, Task
from .distributed_crawler import DistributedCrawler
from .job_queue import JobQueue

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CrawlerWorker:
    """Worker class for processing crawling jobs."""
    
    def __init__(self):
        self.config = get_config()
        self.redis_client = Redis.from_url(self.config.redis_url)
        self.job_queue = JobQueue()
        self.crawler = DistributedCrawler()
        
    def process_job(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single crawling job."""
        try:
            logger.info(f"Processing job: {job_data.get('job_id')}")
            
            # Update job status to running
            with get_db_session() as session:
                job = session.query(Job).filter(Job.id == job_data['job_id']).first()
                if not job:
                    raise ValueError(f"Job {job_data['job_id']} not found")
                
                job.status = 'running'
                job.started_at = time.time()
                session.commit()
            
            # Execute the crawling job
            result = self.crawler.execute_job(job_data)
            
            # Update job status to completed
            with get_db_session() as session:
                job = session.query(Job).filter(Job.id == job_data['job_id']).first()
                job.status = 'completed'
                job.completed_at = time.time()
                job.job_metadata = result
                session.commit()
            
            logger.info(f"Job {job_data['job_id']} completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error processing job {job_data.get('job_id')}: {str(e)}")
            
            # Update job status to failed
            try:
                with get_db_session() as session:
                    job = session.query(Job).filter(Job.id == job_data['job_id']).first()
                    if job:
                        job.status = 'failed'
                        job.error_message = str(e)
                        session.commit()
            except Exception as db_error:
                logger.error(f"Error updating job status: {str(db_error)}")
            
            raise
    
    def process_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single crawling task."""
        try:
            logger.info(f"Processing task: {task_data.get('task_id')}")
            
            # Update task status to running
            with get_db_session() as session:
                task = session.query(Task).filter(Task.id == task_data['task_id']).first()
                if not task:
                    raise ValueError(f"Task {task_data['task_id']} not found")
                
                task.status = 'running'
                task.started_at = time.time()
                session.commit()
            
            # Execute the crawling task
            result = self.crawler.execute_task(task_data)
            
            # Update task status to completed
            with get_db_session() as session:
                task = session.query(Task).filter(Task.id == task_data['task_id']).first()
                task.status = 'completed'
                task.completed_at = time.time()
                task.result_data = result
                session.commit()
            
            logger.info(f"Task {task_data['task_id']} completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error processing task {task_data.get('task_id')}: {str(e)}")
            
            # Update task status to failed
            try:
                with get_db_session() as session:
                    task = session.query(Task).filter(Task.id == task_data['task_id']).first()
                    if task:
                        task.status = 'failed'
                        task.error_message = str(e)
                        task.retry_count += 1
                        session.commit()
            except Exception as db_error:
                logger.error(f"Error updating task status: {str(db_error)}")
            
            raise

def main():
    """Main worker function."""
    config = get_config()
    
    # Set up Redis connection
    redis_client = Redis.from_url(config.redis_url)
    
    # Create queues
    job_queue = Queue('crawler_jobs', connection=redis_client)
    task_queue = Queue('crawler_tasks', connection=redis_client)
    
    # Create worker instance
    worker = CrawlerWorker()
    
    # Set up signal handlers for graceful shutdown
    def signal_handler(signum, frame):
        logger.info("Received shutdown signal, stopping worker...")
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info("Starting crawler worker...")
    logger.info(f"Redis URL: {config.redis_url}")
    logger.info(f"Database URL: {config.database_url}")
    
    try:
        # Start the worker
        with Connection(redis_client):
            worker_instance = Worker([job_queue, task_queue])
            worker_instance.work()
    except KeyboardInterrupt:
        logger.info("Worker stopped by user")
    except Exception as e:
        logger.error(f"Worker error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 