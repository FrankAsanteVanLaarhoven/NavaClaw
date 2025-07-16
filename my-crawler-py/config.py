"""
Configuration management for the distributed crawler.

This module handles configuration for database connections, Redis settings,
and other system-wide configuration options.
"""

import os
from typing import Optional
from dataclasses import dataclass

@dataclass
class DatabaseConfig:
    """Database configuration settings."""
    host: str = "localhost"
    port: int = 5432
    database: str = "my_crawler"
    username: str = "postgres"
    password: str = "postgres"
    pool_size: int = 10
    max_overflow: int = 20
    echo: bool = False
    
    @classmethod
    def from_env(cls) -> 'DatabaseConfig':
        """Create database config from environment variables."""
        return cls(
            host=os.getenv('DB_HOST', 'localhost'),
            port=int(os.getenv('DB_PORT', '5432')),
            database=os.getenv('DB_NAME', 'my_crawler'),
            username=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres'),
            pool_size=int(os.getenv('DB_POOL_SIZE', '10')),
            max_overflow=int(os.getenv('DB_MAX_OVERFLOW', '20')),
            echo=os.getenv('DB_ECHO', 'false').lower() == 'true'
        )

@dataclass
class RedisConfig:
    """Redis configuration settings."""
    host: str = "localhost"
    port: int = 6379
    database: int = 0
    password: Optional[str] = None
    ssl: bool = False
    max_connections: int = 20
    
    @classmethod
    def from_env(cls) -> 'RedisConfig':
        """Create Redis config from environment variables."""
        return cls(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', '6379')),
            database=int(os.getenv('REDIS_DB', '0')),
            password=os.getenv('REDIS_PASSWORD'),
            ssl=os.getenv('REDIS_SSL', 'false').lower() == 'true',
            max_connections=int(os.getenv('REDIS_MAX_CONNECTIONS', '20'))
        )

@dataclass
class CrawlerConfig:
    """Crawler-specific configuration settings."""
    max_workers: int = 4
    max_concurrent_tasks: int = 10
    task_timeout: int = 300  # seconds
    retry_attempts: int = 3
    retry_delay: int = 5  # seconds
    default_delay: float = 1.0  # seconds between requests
    user_agent: str = "My-Crawler/1.0"
    
    @classmethod
    def from_env(cls) -> 'CrawlerConfig':
        """Create crawler config from environment variables."""
        return cls(
            max_workers=int(os.getenv('CRAWLER_MAX_WORKERS', '4')),
            max_concurrent_tasks=int(os.getenv('CRAWLER_MAX_CONCURRENT_TASKS', '10')),
            task_timeout=int(os.getenv('CRAWLER_TASK_TIMEOUT', '300')),
            retry_attempts=int(os.getenv('CRAWLER_RETRY_ATTEMPTS', '3')),
            retry_delay=int(os.getenv('CRAWLER_RETRY_DELAY', '5')),
            default_delay=float(os.getenv('CRAWLER_DEFAULT_DELAY', '1.0')),
            user_agent=os.getenv('CRAWLER_USER_AGENT', 'My-Crawler/1.0')
        )

@dataclass
class Config:
    """Main configuration class."""
    database: DatabaseConfig
    redis: RedisConfig
    crawler: CrawlerConfig
    debug: bool = False
    log_level: str = "INFO"
    
    @classmethod
    def from_env(cls) -> 'Config':
        """Create config from environment variables."""
        return cls(
            database=DatabaseConfig.from_env(),
            redis=RedisConfig.from_env(),
            crawler=CrawlerConfig.from_env(),
            debug=os.getenv('DEBUG', 'false').lower() == 'true',
            log_level=os.getenv('LOG_LEVEL', 'INFO')
        )
    
    def get_database_url(self) -> str:
        """Get SQLAlchemy database URL."""
        return (
            f"postgresql://{self.database.username}:{self.database.password}"
            f"@{self.database.host}:{self.database.port}/{self.database.database}"
        )
    
    def get_redis_url(self) -> str:
        """Get Redis connection URL."""
        auth_part = f":{self.redis.password}@" if self.redis.password else ""
        protocol = "rediss" if self.redis.ssl else "redis"
        return f"{protocol}://{auth_part}{self.redis.host}:{self.redis.port}/{self.redis.database}"

# Global configuration instance
config = Config.from_env() 