"""
Distributed Crawler API Server

This server provides REST API endpoints for managing distributed crawling jobs
using PostgreSQL for persistence and Redis for distributed queueing.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import logging
from datetime import datetime

# Import our distributed crawler components
from my_crawler_py.distributed_crawler import distributed_crawler
from my_crawler_py.job_queue import TaskStatus, TaskPriority
from my_crawler_py.db import init_database, check_database_connection
from my_crawler_py.redis_queue import check_redis_connection, get_queue_stats

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Distributed Crawler API",
    description="API for managing distributed web crawling jobs",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class JobCreateRequest(BaseModel):
    name: str
    description: str = ""
    config: Dict[str, Any] = {}
    user_id: Optional[str] = None

class JobResponse(BaseModel):
    job_id: str
    name: str
    description: str
    status: str
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    running_tasks: int
    pending_tasks: int

class TaskCreateRequest(BaseModel):
    url: Optional[str] = None
    urls: Optional[List[str]] = None
    input_path: Optional[str] = None
    task_type: Optional[str] = None
    priority: int = 2  # TaskPriority.NORMAL
    metadata: Dict[str, Any] = {}

class TaskResponse(BaseModel):
    task_id: str
    url: str
    task_type: str
    status: str
    priority: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class JobResultsResponse(BaseModel):
    job_id: str
    name: str
    status: str
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    summary: Dict[str, Any]
    tasks: List[TaskResponse]

# Health check endpoint
@app.get("/health")
async def health_check():
    """Check system health."""
    db_healthy = check_database_connection()
    redis_healthy = check_redis_connection()
    
    return {
        "status": "healthy" if db_healthy and redis_healthy else "unhealthy",
        "database": "connected" if db_healthy else "disconnected",
        "redis": "connected" if redis_healthy else "disconnected",
        "timestamp": datetime.utcnow().isoformat()
    }

# Job management endpoints
@app.post("/jobs", response_model=JobResponse)
async def create_job(request: JobCreateRequest):
    """Create a new crawl job."""
    try:
        job = await distributed_crawler.create_job(
            name=request.name,
            description=request.description,
            config=request.config,
            user_id=request.user_id
        )
        
        return JobResponse(
            job_id=job.job_id,
            name=job.name,
            description=job.description,
            status=job.status.value,
            created_at=job.created_at,
            total_tasks=len(job.tasks),
            completed_tasks=0,
            failed_tasks=0,
            running_tasks=0,
            pending_tasks=len(job.tasks)
        )
    except Exception as e:
        logger.error(f"Failed to create job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs", response_model=List[JobResponse])
async def list_jobs(
    user_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50
):
    """List all jobs with optional filtering."""
    try:
        # Convert status string to enum
        status_enum = None
        if status:
            try:
                status_enum = TaskStatus(status)
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid status: {status}")
        
        jobs = await distributed_crawler.list_jobs(user_id, status_enum, limit)
        
        job_responses = []
        for job in jobs:
            completed_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.COMPLETED)
            failed_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.FAILED)
            running_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.RUNNING)
            pending_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.PENDING)
            
            job_responses.append(JobResponse(
                job_id=job.job_id,
                name=job.name,
                description=job.description,
                status=job.status.value,
                created_at=job.created_at,
                started_at=job.started_at,
                completed_at=job.completed_at,
                total_tasks=len(job.tasks),
                completed_tasks=completed_tasks,
                failed_tasks=failed_tasks,
                running_tasks=running_tasks,
                pending_tasks=pending_tasks
            ))
        
        return job_responses
    except Exception as e:
        logger.error(f"Failed to list jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """Get a specific job by ID."""
    try:
        job = await distributed_crawler.get_job_status(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        completed_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.COMPLETED)
        failed_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.FAILED)
        running_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.RUNNING)
        pending_tasks = sum(1 for t in job.tasks if t.status == TaskStatus.PENDING)
        
        return JobResponse(
            job_id=job.job_id,
            name=job.name,
            description=job.description,
            status=job.status.value,
            created_at=job.created_at,
            started_at=job.started_at,
            completed_at=job.completed_at,
            total_tasks=len(job.tasks),
            completed_tasks=completed_tasks,
            failed_tasks=failed_tasks,
            running_tasks=running_tasks,
            pending_tasks=pending_tasks
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/jobs/{job_id}/tasks")
async def add_task(job_id: str, request: TaskCreateRequest):
    """Add a task to an existing job."""
    try:
        job = await distributed_crawler.get_job_status(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Determine task type and add appropriate task
        if request.url:
            task = await distributed_crawler.add_url_task(
                job=job,
                url=request.url,
                priority=TaskPriority(request.priority),
                metadata=request.metadata
            )
        elif request.urls:
            task = await distributed_crawler.add_batch_task(
                job=job,
                urls=request.urls,
                priority=TaskPriority(request.priority),
                metadata=request.metadata
            )
        elif request.input_path:
            task = await distributed_crawler.add_offline_task(
                job=job,
                input_path=request.input_path,
                priority=TaskPriority(request.priority),
                metadata=request.metadata
            )
        else:
            raise HTTPException(status_code=400, detail="Must provide url, urls, or input_path")
        
        return {"task_id": task.task_id, "message": "Task added successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to add task to job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/jobs/{job_id}/submit")
async def submit_job(job_id: str):
    """Submit a job for execution."""
    try:
        job = await distributed_crawler.get_job_status(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        if not job.tasks:
            raise HTTPException(status_code=400, detail="Job has no tasks to submit")
        
        submitted_job_id = await distributed_crawler.submit_job(job)
        return {"job_id": submitted_job_id, "message": "Job submitted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to submit job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/jobs/{job_id}")
async def cancel_job(job_id: str):
    """Cancel a running job."""
    try:
        success = await distributed_crawler.cancel_job(job_id)
        if not success:
            raise HTTPException(status_code=404, detail="Job not found or could not be cancelled")
        
        return {"message": "Job cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to cancel job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs/{job_id}/results", response_model=JobResultsResponse)
async def get_job_results(job_id: str):
    """Get detailed results for a completed job."""
    try:
        results = await distributed_crawler.get_job_results(job_id)
        if not results:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Convert tasks to TaskResponse objects
        tasks = []
        for task_data in results["tasks"]:
            tasks.append(TaskResponse(
                task_id=task_data["task_id"],
                url=task_data["url"],
                task_type=task_data["task_type"],
                status=task_data["status"],
                priority=task_data["priority"],
                created_at=datetime.fromisoformat(task_data["created_at"]),
                started_at=datetime.fromisoformat(task_data["started_at"]) if task_data["started_at"] else None,
                completed_at=datetime.fromisoformat(task_data["completed_at"]) if task_data["completed_at"] else None,
                result=task_data["result"],
                error=task_data["error"]
            ))
        
        return JobResultsResponse(
            job_id=results["job_id"],
            name=results["name"],
            status=results["status"],
            total_tasks=results["total_tasks"],
            completed_tasks=results["completed_tasks"],
            failed_tasks=results["failed_tasks"],
            summary=results["summary"],
            tasks=tasks
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get results for job {job_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# System monitoring endpoints
@app.get("/stats")
async def get_system_stats():
    """Get system statistics."""
    try:
        queue_stats = get_queue_stats()
        
        return {
            "queue": queue_stats,
            "database": {
                "connected": check_database_connection()
            },
            "redis": {
                "connected": check_redis_connection()
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get system stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the system on startup."""
    logger.info("Starting Distributed Crawler API Server...")
    
    # Check database connection
    if not check_database_connection():
        logger.error("Database connection failed!")
        raise RuntimeError("Cannot connect to database")
    
    # Check Redis connection
    if not check_redis_connection():
        logger.error("Redis connection failed!")
        raise RuntimeError("Cannot connect to Redis")
    
    logger.info("All connections established successfully!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 