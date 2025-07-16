# Distributed Crawler Setup Guide

This guide explains how to set up and use the distributed crawling system with PostgreSQL persistence and Redis queueing.

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis 6+
- Poetry (for dependency management)

## Installation

1. **Install dependencies:**
   ```bash
   poetry install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database and Redis settings
   ```

3. **Initialize the database:**
   ```bash
   poetry run python init_database.py
   ```

## Configuration

### Database Configuration

The system uses PostgreSQL for persistent storage of jobs and results. Configure the following environment variables:

```bash
DB_HOST=localhost          # PostgreSQL host
DB_PORT=5432              # PostgreSQL port
DB_NAME=my_crawler        # Database name
DB_USER=postgres          # Database username
DB_PASSWORD=postgres      # Database password
DB_POOL_SIZE=10          # Connection pool size
DB_MAX_OVERFLOW=20       # Max overflow connections
DB_ECHO=false            # SQL query logging
```

### Redis Configuration

Redis is used for distributed task queueing. Configure the following environment variables:

```bash
REDIS_HOST=localhost      # Redis host
REDIS_PORT=6379          # Redis port
REDIS_DB=0               # Redis database number
REDIS_PASSWORD=          # Redis password (if any)
REDIS_SSL=false          # Use SSL connection
REDIS_MAX_CONNECTIONS=20 # Max Redis connections
```

### Crawler Configuration

```bash
CRAWLER_MAX_WORKERS=4           # Number of worker processes
CRAWLER_MAX_CONCURRENT_TASKS=10 # Max concurrent tasks per worker
CRAWLER_TASK_TIMEOUT=300        # Task timeout in seconds
CRAWLER_RETRY_ATTEMPTS=3        # Number of retry attempts
CRAWLER_RETRY_DELAY=5           # Delay between retries
CRAWLER_DEFAULT_DELAY=1.0       # Default delay between requests
CRAWLER_USER_AGENT=My-Crawler/1.0 # User agent string
```

## Usage

### Basic Usage

```python
from my_crawler_py.distributed_crawler import distributed_crawler
from my_crawler_py.job_queue import TaskPriority

# Create a job
job = await distributed_crawler.create_job(
    name="Example Crawl Job",
    description="Crawling example.com",
    user_id="user123"
)

# Add URL tasks
await distributed_crawler.add_url_task(
    job=job,
    url="https://example.com",
    priority=TaskPriority.NORMAL
)

# Add batch tasks
await distributed_crawler.add_batch_task(
    job=job,
    urls=["https://example.com/page1", "https://example.com/page2"],
    priority=TaskPriority.HIGH
)

# Add offline tasks
await distributed_crawler.add_offline_task(
    job=job,
    input_path="/path/to/website/files",
    priority=TaskPriority.LOW
)

# Submit the job
job_id = await distributed_crawler.submit_job(job)
print(f"Job submitted with ID: {job_id}")

# Check job status
job_status = await distributed_crawler.get_job_status(job_id)
print(f"Job status: {job_status.status}")

# Get job results
results = await distributed_crawler.get_job_results(job_id)
print(f"Completed tasks: {results['completed_tasks']}")
```

### Using the CLI

The distributed crawler includes a command-line interface:

```bash
# Start the distributed crawler
poetry run python distributed_crawler_cli.py

# Create a job
curl -X POST http://localhost:8000/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Job",
    "description": "Testing the distributed crawler",
    "config": {}
  }'

# Add tasks to a job
curl -X POST http://localhost:8000/jobs/{job_id}/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "task_type": "url",
    "priority": 2
  }'

# Submit a job
curl -X POST http://localhost:8000/jobs/{job_id}/submit

# Get job status
curl http://localhost:8000/jobs/{job_id}

# List all jobs
curl http://localhost:8000/jobs
```

### Running Workers

To process tasks, you need to run worker processes:

```bash
# Start RQ worker
poetry run rq worker crawl_jobs

# Or start multiple workers
poetry run rq worker crawl_jobs --workers 4
```

## Architecture

### Components

1. **PersistentJobQueue**: Manages job persistence in PostgreSQL
2. **Redis Queue**: Handles distributed task queueing
3. **Task Executors**: Execute different types of crawl tasks
4. **DistributedCrawler**: High-level interface for job management
5. **API Server**: REST API for job management

### Data Flow

1. **Job Creation**: Jobs are created and stored in PostgreSQL
2. **Task Submission**: Tasks are submitted to Redis queue
3. **Worker Processing**: Workers pick up tasks from Redis queue
4. **Task Execution**: Tasks are executed by appropriate executors
5. **Result Storage**: Results are stored back in PostgreSQL
6. **Status Updates**: Job and task statuses are updated in real-time

### Database Schema

#### crawl_jobs table
- `id`: Primary key
- `job_id`: Unique job identifier
- `status`: Job status (pending, running, completed, failed, cancelled)
- `created_at`: Job creation timestamp
- `updated_at`: Last update timestamp
- `started_at`: Job start timestamp
- `completed_at`: Job completion timestamp
- `config`: Job configuration (JSON)
- `metadata`: Job metadata (JSON)
- `user_id`: User identifier

#### crawl_results table
- `id`: Primary key
- `task_id`: Unique task identifier
- `job_id`: Associated job identifier
- `url`: URL or input path
- `task_type`: Task type (url, batch, offline)
- `status`: Task status
- `priority`: Task priority
- `created_at`: Task creation timestamp
- `updated_at`: Last update timestamp
- `started_at`: Task start timestamp
- `completed_at`: Task completion timestamp
- `result`: Task results (JSON)
- `error`: Error message (if any)
- `metadata`: Task metadata (JSON)

## Monitoring

### Queue Monitoring

```python
from my_crawler_py.redis_queue import get_queue_stats

# Get queue statistics
stats = get_queue_stats()
print(f"Queue length: {stats['queue_length']}")
print(f"Active workers: {stats['workers']}")
```

### Database Monitoring

```python
from my_crawler_py.db import check_database_connection

# Check database health
if check_database_connection():
    print("Database connection is healthy")
else:
    print("Database connection failed")
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Redis Connection Failed**
   - Check Redis is running
   - Verify Redis configuration in `.env`
   - Check Redis authentication

3. **Tasks Not Processing**
   - Ensure RQ workers are running
   - Check Redis queue for pending tasks
   - Verify task executors are properly configured

4. **Memory Issues**
   - Reduce `CRAWLER_MAX_CONCURRENT_TASKS`
   - Increase `CRAWLER_TASK_TIMEOUT`
   - Monitor worker memory usage

### Logging

Enable debug logging by setting:
```bash
DEBUG=true
LOG_LEVEL=DEBUG
```

## Performance Tuning

### Database Tuning
- Increase `DB_POOL_SIZE` for high concurrency
- Use connection pooling
- Add database indexes for frequently queried columns

### Redis Tuning
- Increase `REDIS_MAX_CONNECTIONS` for high load
- Use Redis clustering for large deployments
- Monitor Redis memory usage

### Worker Tuning
- Adjust `CRAWLER_MAX_WORKERS` based on CPU cores
- Tune `CRAWLER_MAX_CONCURRENT_TASKS` based on memory
- Use appropriate task timeouts

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

2. **Redis Security**
   - Set strong Redis passwords
   - Use Redis ACLs
   - Enable Redis SSL

3. **Network Security**
   - Use firewalls to restrict access
   - Enable HTTPS for API endpoints
   - Implement proper authentication

## Scaling

### Horizontal Scaling
- Run multiple worker processes
- Use Redis clustering
- Distribute workers across machines

### Vertical Scaling
- Increase database resources
- Add more Redis memory
- Use faster storage for results

### Load Balancing
- Use load balancers for API endpoints
- Distribute database read replicas
- Implement Redis sentinel for high availability 