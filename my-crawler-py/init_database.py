#!/usr/bin/env python3
"""
Database initialization script for My-Crawler.

This script sets up the PostgreSQL database and creates all necessary tables
for the distributed crawling system.
"""

import sys
import os
import logging
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from my_crawler_py.db import init_database, check_database_connection
from config import config

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """Initialize the database."""
    logger.info("Starting database initialization...")
    
    # Check database connection
    logger.info("Checking database connection...")
    if not check_database_connection():
        logger.error("Cannot connect to database. Please check your configuration:")
        logger.error(f"  Host: {config.database.host}")
        logger.error(f"  Port: {config.database.port}")
        logger.error(f"  Database: {config.database.database}")
        logger.error(f"  Username: {config.database.username}")
        sys.exit(1)
    
    logger.info("Database connection successful!")
    
    # Initialize database tables
    logger.info("Creating database tables...")
    try:
        init_database()
        logger.info("Database initialization completed successfully!")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        sys.exit(1)
    
    # Verify tables were created
    logger.info("Verifying table creation...")
    try:
        from sqlalchemy import inspect
        from my_crawler_py.db import engine
        
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        expected_tables = ['crawl_jobs', 'crawl_results']
        for table in expected_tables:
            if table in tables:
                logger.info(f"✓ Table '{table}' created successfully")
            else:
                logger.error(f"✗ Table '{table}' was not created")
                sys.exit(1)
        
        logger.info("All tables verified successfully!")
        
    except Exception as e:
        logger.error(f"Failed to verify tables: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 