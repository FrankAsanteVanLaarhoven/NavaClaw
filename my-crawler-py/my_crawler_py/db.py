from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON, Enum, Text, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import enum
import logging

# Import configuration
from config import config

Base = declarative_base()

class JobStatus(enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"

class CrawlJobModel(Base):
    __tablename__ = "crawl_jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(String, unique=True, nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.pending)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    config = Column(JSON, nullable=True)
    job_metadata = Column(JSON, nullable=True)  # Renamed from metadata
    user_id = Column(String, nullable=True)

class CrawlResultModel(Base):
    __tablename__ = "crawl_results"
    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, unique=True, nullable=False)
    job_id = Column(String, nullable=False, index=True)
    url = Column(Text, nullable=True)
    task_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="pending")
    priority = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    task_metadata = Column(JSON, nullable=True)  # Renamed from metadata

# Create database engine
engine = create_engine(
    config.get_database_url(),
    pool_size=config.database.pool_size,
    max_overflow=config.database.max_overflow,
    echo=config.database.echo
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db_session() -> Session:
    """Get a database session."""
    return SessionLocal()

def init_database():
    """Initialize the database by creating all tables."""
    try:
        Base.metadata.create_all(bind=engine)
        logging.info("Database tables created successfully")
    except Exception as e:
        logging.error(f"Failed to create database tables: {e}")
        raise

def check_database_connection() -> bool:
    """Check if database connection is working."""
    try:
        with get_db_session() as session:
            session.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logging.error(f"Database connection failed: {e}")
        return False 