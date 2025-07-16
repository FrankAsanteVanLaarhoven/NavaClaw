#!/usr/bin/env python3
"""
Batch URL Processor for Large-Scale Crawl Operations
Includes ML integration, scheduling, and enterprise features.
"""

import asyncio
import json
import csv
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any, Set
import argparse
import sys
import logging
from dataclasses import dataclass, asdict
import hashlib
import yaml
from concurrent.futures import ThreadPoolExecutor
import schedule
import time
import threading
from urllib.parse import urlparse
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import numpy as np


@dataclass
class CrawlJob:
    """Represents a crawl job with metadata."""
    url: str
    priority: int = 1
    scheduled_time: Optional[datetime] = None
    retry_count: int = 0
    max_retries: int = 3
    status: str = "pending"
    created_at: datetime = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)


class MLDataClassifier:
    """ML-based data classification and prioritization."""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.cluster_model = KMeans(n_clusters=5, random_state=42)
        self.is_trained = False
    
    def extract_features(self, crawl_data: List[Dict]) -> List[str]:
        """Extract text features from crawl data."""
        features = []
        for data in crawl_data:
            # Combine various text fields
            text_parts = []
            
            # Meta tags
            meta_tags = data.get('meta_tags', {})
            text_parts.extend(meta_tags.get('seo', {}).values())
            text_parts.extend(meta_tags.get('social', {}).values())
            
            # Page content
            page_info = data.get('metadata', {}).get('page_info', {})
            text_parts.append(page_info.get('title', ''))
            
            # Technology stack
            ui_source = data.get('ui_source', {})
            techs = ui_source.get('technologies', {})
            detected_techs = [tech for tech, detected in techs.items() if detected]
            text_parts.extend(detected_techs)
            
            # API endpoints
            api_data = data.get('api_discovery', {})
            text_parts.extend(api_data.get('rest_apis', []))
            text_parts.extend(api_data.get('graphql_endpoints', []))
            
            features.append(' '.join(text_parts))
        
        return features
    
    def train(self, crawl_data: List[Dict]):
        """Train the ML model on crawl data."""
        if not crawl_data:
            return
        
        features = self.extract_features(crawl_data)
        if not features:
            return
        
        # Vectorize features
        X = self.vectorizer.fit_transform(features)
        
        # Cluster the data
        self.cluster_model.fit(X)
        self.is_trained = True
    
    def classify_url(self, url: str, domain_info: Dict = None) -> Dict[str, Any]:
        """Classify a URL based on domain and available information."""
        classification = {
            'priority_score': 1.0,
            'category': 'general',
            'confidence': 0.5,
            'recommended_actions': []
        }
        
        # Domain-based classification
        parsed_url = urlparse(url)
        domain = parsed_url.netloc.lower()
        
        # E-commerce detection
        ecommerce_keywords = ['shop', 'store', 'cart', 'buy', 'product', 'checkout']
        if any(keyword in domain for keyword in ecommerce_keywords):
            classification['category'] = 'ecommerce'
            classification['priority_score'] = 0.8
            classification['recommended_actions'].append('extract_product_data')
        
        # Social media detection
        social_keywords = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube']
        if any(keyword in domain for keyword in social_keywords):
            classification['category'] = 'social_media'
            classification['priority_score'] = 0.9
            classification['recommended_actions'].append('monitor_engagement')
        
        # News/media detection
        news_keywords = ['news', 'blog', 'article', 'media', 'press']
        if any(keyword in domain for keyword in news_keywords):
            classification['category'] = 'news_media'
            classification['priority_score'] = 0.7
            classification['recommended_actions'].append('extract_content')
        
        # API/documentation detection
        api_keywords = ['api', 'docs', 'documentation', 'developer']
        if any(keyword in domain for keyword in api_keywords):
            classification['category'] = 'api_docs'
            classification['priority_score'] = 0.6
            classification['recommended_actions'].append('extract_api_specs')
        
        return classification


class RBACManager:
    """Role-Based Access Control for enterprise features."""
    
    def __init__(self):
        self.roles = {
            'admin': {
                'permissions': ['read', 'write', 'delete', 'schedule', 'configure'],
                'data_access': ['all']
            },
            'analyst': {
                'permissions': ['read', 'write'],
                'data_access': ['crawl_data', 'reports']
            },
            'viewer': {
                'permissions': ['read'],
                'data_access': ['reports']
            }
        }
        self.users = {}
    
    def add_user(self, username: str, role: str, email: str = None):
        """Add a user with specified role."""
        if role not in self.roles:
            raise ValueError(f"Invalid role: {role}")
        
        self.users[username] = {
            'role': role,
            'email': email,
            'created_at': datetime.now(timezone.utc),
            'last_login': None
        }
    
    def check_permission(self, username: str, permission: str, data_type: str = None) -> bool:
        """Check if user has permission for specific action."""
        if username not in self.users:
            return False
        
        user_role = self.users[username]['role']
        role_permissions = self.roles[user_role]['permissions']
        role_data_access = self.roles[user_role]['data_access']
        
        # Check permission
        if permission not in role_permissions:
            return False
        
        # Check data access if specified
        if data_type and 'all' not in role_data_access and data_type not in role_data_access:
            return False
        
        return True


class AuditLogger:
    """Compliance and security audit logging."""
    
    def __init__(self, log_file: str = "audit.log"):
        self.log_file = Path(log_file)
        self.log_file.parent.mkdir(exist_ok=True)
        
        # Set up logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(self.log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def log_action(self, user: str, action: str, resource: str, details: Dict = None):
        """Log user actions for audit purposes."""
        log_entry = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'user': user,
            'action': action,
            'resource': resource,
            'details': details or {},
            'ip_address': '127.0.0.1',  # In production, get from request
            'user_agent': 'AdvancedCrawler/1.0'
        }
        
        self.logger.info(f"AUDIT: {json.dumps(log_entry)}")
    
    def log_data_access(self, user: str, data_type: str, data_id: str):
        """Log data access for GDPR/CCPA compliance."""
        self.log_action(user, 'data_access', data_type, {
            'data_id': data_id,
            'compliance': 'gdpr_ccpa'
        })
    
    def log_data_deletion(self, user: str, data_type: str, data_id: str):
        """Log data deletion for compliance."""
        self.log_action(user, 'data_deletion', data_type, {
            'data_id': data_id,
            'compliance': 'gdpr_right_to_be_forgotten'
        })


class BatchProcessor:
    """Main batch processing system."""
    
    def __init__(self, output_dir: str = None, max_concurrent: int = 5):
        # Set up desktop storage
        desktop_path = Path.home() / "Desktop"
        self.desktop_crawl_dir = desktop_path / "AdvancedCrawlerData"
        self.desktop_crawl_dir.mkdir(exist_ok=True)
        
        self.output_dir = Path(output_dir) if output_dir else self.desktop_crawl_dir
        self.output_dir.mkdir(exist_ok=True)
        
        self.max_concurrent = max_concurrent
        self.jobs: List[CrawlJob] = []
        self.completed_jobs: List[CrawlJob] = []
        self.failed_jobs: List[CrawlJob] = []
        
        # Initialize components
        self.ml_classifier = MLDataClassifier()
        self.rbac_manager = RBACManager()
        self.audit_logger = AuditLogger(self.output_dir / "audit.log")
        
        # Set up default admin user
        self.rbac_manager.add_user('admin', 'admin', 'admin@crawler.com')
        
        # Job queue and processing
        self.job_queue = asyncio.Queue()
        self.processing = False
        self.scheduler_thread = None
    
    def add_urls_from_file(self, file_path: str, user: str = 'admin'):
        """Add URLs from a file (CSV, TXT, or JSON)."""
        if not self.rbac_manager.check_permission(user, 'write'):
            raise PermissionError(f"User {user} does not have write permission")
        
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        urls = []
        
        if file_path.suffix.lower() == '.csv':
            with open(file_path, 'r') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if 'url' in row:
                        urls.append(row['url'])
        elif file_path.suffix.lower() == '.json':
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    urls = data
                elif isinstance(data, dict) and 'urls' in data:
                    urls = data['urls']
        else:  # Assume TXT file with one URL per line
            with open(file_path, 'r') as f:
                urls = [line.strip() for line in f if line.strip()]
        
        # Add jobs with ML classification
        for url in urls:
            classification = self.ml_classifier.classify_url(url)
            priority = int(classification['priority_score'] * 10)
            
            job = CrawlJob(
                url=url,
                priority=priority
            )
            self.jobs.append(job)
        
        self.audit_logger.log_action(user, 'add_urls', 'batch_processor', {
            'file_path': str(file_path),
            'urls_added': len(urls)
        })
        
        return len(urls)
    
    def schedule_job(self, url: str, scheduled_time: datetime, user: str = 'admin'):
        """Schedule a crawl job for later execution."""
        if not self.rbac_manager.check_permission(user, 'schedule'):
            raise PermissionError(f"User {user} does not have schedule permission")
        
        job = CrawlJob(
            url=url,
            scheduled_time=scheduled_time
        )
        self.jobs.append(job)
        
        self.audit_logger.log_action(user, 'schedule_job', 'batch_processor', {
            'url': url,
            'scheduled_time': scheduled_time.isoformat()
        })
    
    def start_scheduler(self):
        """Start the job scheduler in a separate thread."""
        def run_scheduler():
            while self.processing:
                schedule.run_pending()
                time.sleep(1)
        
        self.processing = True
        self.scheduler_thread = threading.Thread(target=run_scheduler)
        self.scheduler_thread.start()
    
    def stop_scheduler(self):
        """Stop the job scheduler."""
        self.processing = False
        if self.scheduler_thread:
            self.scheduler_thread.join()
    
    async def process_jobs(self):
        """Process all pending jobs."""
        # Sort jobs by priority
        self.jobs.sort(key=lambda x: x.priority, reverse=True)
        
        # Create tasks for concurrent processing
        tasks = []
        semaphore = asyncio.Semaphore(self.max_concurrent)
        
        for job in self.jobs:
            if job.status == "pending":
                task = asyncio.create_task(self._process_job_with_semaphore(job, semaphore))
                tasks.append(task)
        
        # Wait for all tasks to complete
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _process_job_with_semaphore(self, job: CrawlJob, semaphore: asyncio.Semaphore):
        """Process a job with concurrency control."""
        async with semaphore:
            await self._process_single_job(job)
    
    async def _process_single_job(self, job: CrawlJob):
        """Process a single crawl job."""
        try:
            job.status = "processing"
            
            # Import here to avoid circular imports
            from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
            from playwright.async_api import async_playwright
            
            extractor = EnhancedDataExtractor()
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                # Navigate to URL
                await page.goto(job.url, wait_until='networkidle')
                
                # Extract enhanced data
                data = await extractor.extract_enhanced_page_data(page, job.url)
                
                # Save data
                saved_files = await extractor.save_enhanced_data(job.url, data)
                
                await browser.close()
            
            job.status = "completed"
            job.completed_at = datetime.now(timezone.utc)
            self.completed_jobs.append(job)
            
            # Log successful completion
            self.audit_logger.log_action('system', 'job_completed', 'batch_processor', {
                'url': job.url,
                'files_saved': list(saved_files.keys())
            })
            
        except Exception as e:
            job.status = "failed"
            job.error_message = str(e)
            job.retry_count += 1
            
            if job.retry_count < job.max_retries:
                job.status = "pending"
                self.jobs.append(job)  # Re-queue for retry
            else:
                self.failed_jobs.append(job)
            
            # Log failure
            self.audit_logger.log_action('system', 'job_failed', 'batch_processor', {
                'url': job.url,
                'error': str(e),
                'retry_count': job.retry_count
            })
    
    def export_results(self, format: str = 'json', user: str = 'admin') -> str:
        """Export batch processing results."""
        if not self.rbac_manager.check_permission(user, 'read', 'reports'):
            raise PermissionError(f"User {user} does not have read permission for reports")
        
        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
        
        if format.lower() == 'json':
            output_file = self.output_dir / f"batch_results_{timestamp}.json"
            results = {
                'metadata': {
                    'generated_at': datetime.now(timezone.utc).isoformat(),
                    'total_jobs': len(self.jobs) + len(self.completed_jobs) + len(self.failed_jobs),
                    'completed_jobs': len(self.completed_jobs),
                    'failed_jobs': len(self.failed_jobs)
                },
                'completed_jobs': [asdict(job) for job in self.completed_jobs],
                'failed_jobs': [asdict(job) for job in self.failed_jobs]
            }
            
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2)
        
        elif format.lower() == 'csv':
            output_file = self.output_dir / f"batch_results_{timestamp}.csv"
            
            all_jobs = self.completed_jobs + self.failed_jobs
            if all_jobs:
                df = pd.DataFrame([asdict(job) for job in all_jobs])
                df.to_csv(output_file, index=False)
        
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        # Log export action
        self.audit_logger.log_action(user, 'export_results', 'batch_processor', {
            'format': format,
            'output_file': str(output_file)
        })
        
        return str(output_file)
    
    def get_statistics(self, user: str = 'admin') -> Dict[str, Any]:
        """Get batch processing statistics."""
        if not self.rbac_manager.check_permission(user, 'read'):
            raise PermissionError(f"User {user} does not have read permission")
        
        total_jobs = len(self.jobs) + len(self.completed_jobs) + len(self.failed_jobs)
        
        stats = {
            'total_jobs': total_jobs,
            'pending_jobs': len([j for j in self.jobs if j.status == 'pending']),
            'processing_jobs': len([j for j in self.jobs if j.status == 'processing']),
            'completed_jobs': len(self.completed_jobs),
            'failed_jobs': len(self.failed_jobs),
            'success_rate': len(self.completed_jobs) / total_jobs if total_jobs > 0 else 0,
            'average_priority': sum(j.priority for j in self.completed_jobs) / len(self.completed_jobs) if self.completed_jobs else 0
        }
        
        return stats


def main():
    parser = argparse.ArgumentParser(description="Batch URL Processor for Advanced Crawler")
    parser.add_argument("--urls", "-u", help="File containing URLs to process")
    parser.add_argument("--output", "-o", help="Output directory")
    parser.add_argument("--concurrent", "-c", type=int, default=5, help="Max concurrent jobs")
    parser.add_argument("--user", default="admin", help="User for RBAC")
    parser.add_argument("--export", "-e", choices=['json', 'csv'], help="Export results format")
    
    args = parser.parse_args()
    
    # Initialize batch processor
    processor = BatchProcessor(output_dir=args.output, max_concurrent=args.concurrent)
    
    try:
        # Add URLs if provided
        if args.urls:
            urls_added = processor.add_urls_from_file(args.urls, args.user)
            print(f"Added {urls_added} URLs to processing queue")
        
        # Process jobs
        if processor.jobs:
            print(f"Processing {len(processor.jobs)} jobs...")
            asyncio.run(processor.process_jobs())
        
        # Export results if requested
        if args.export:
            output_file = processor.export_results(args.export, args.user)
            print(f"Results exported to: {output_file}")
        
        # Show statistics
        stats = processor.get_statistics(args.user)
        print(f"\nBatch Processing Statistics:")
        print(f"- Total Jobs: {stats['total_jobs']}")
        print(f"- Completed: {stats['completed_jobs']}")
        print(f"- Failed: {stats['failed_jobs']}")
        print(f"- Success Rate: {stats['success_rate']:.2%}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 