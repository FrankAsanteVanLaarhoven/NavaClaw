import redis
from rq import Queue
import logging

# Import configuration
from config import config

# Redis connection
redis_conn = redis.Redis(
    host=config.redis.host,
    port=config.redis.port,
    db=config.redis.database,
    password=config.redis.password,
    ssl=config.redis.ssl,
    max_connections=config.redis.max_connections,
    decode_responses=True
)

# RQ queue for crawl jobs
crawl_queue = Queue('crawl_jobs', connection=redis_conn)

def check_redis_connection() -> bool:
    """Check if Redis connection is working."""
    try:
        redis_conn.ping()
        return True
    except Exception as e:
        logging.error(f"Redis connection failed: {e}")
        return False

def get_queue_stats() -> dict:
    """Get queue statistics."""
    try:
        return {
            'queue_length': len(crawl_queue),
            'workers': len(crawl_queue.workers),
            'job_ids': list(crawl_queue.job_ids),
            'connection_info': {
                'host': config.redis.host,
                'port': config.redis.port,
                'database': config.redis.database
            }
        }
    except Exception as e:
        logging.error(f"Failed to get queue stats: {e}")
        return {} 