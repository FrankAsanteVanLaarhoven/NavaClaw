"""
Task Executors for Distributed Crawling

This module provides concrete implementations of TaskExecutor for different
types of crawling tasks including offline crawling, URL crawling, and more.
"""

import asyncio
import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional
from concurrent.futures import ThreadPoolExecutor

from .job_queue import TaskExecutor, CrawlTask
from .offline_crawler import OfflineCrawler

logger = logging.getLogger(__name__)


class OfflineCrawlExecutor(TaskExecutor):
    """Executor for offline crawling tasks"""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def can_execute(self, task: CrawlTask) -> bool:
        """Check if this executor can handle the task"""
        return task.task_type == "offline_crawl"
    
    async def execute_task(self, task: CrawlTask) -> Dict[str, Any]:
        """Execute an offline crawl task"""
        config = task.config
        input_path = config.get('input_path')
        output_dir = config.get('output_dir')
        depth = config.get('depth', 3)
        
        if not input_path:
            raise ValueError("input_path is required for offline crawl")
        
        logger.info(f"Starting offline crawl for {input_path}")
        
        # Run the offline crawler in a thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            self.executor,
            self._run_offline_crawl,
            input_path,
            output_dir,
            depth
        )
        
        return result
    
    def _run_offline_crawl(self, input_path: str, output_dir: Optional[str], depth: int) -> Dict[str, Any]:
        """Run offline crawler in a separate thread"""
        try:
            crawler = OfflineCrawler(input_path, output_dir, depth)
            results = crawler.crawl()
            
            return {
                'success': True,
                'results': results,
                'input_path': input_path,
                'output_dir': str(crawler.output_dir),
                'total_files': results['metadata']['total_files'],
                'processed_files': results['metadata']['processed_files']
            }
            
        except Exception as e:
            logger.error(f"Offline crawl failed for {input_path}: {e}")
            return {
                'success': False,
                'error': str(e),
                'input_path': input_path
            }


class URLCrawlExecutor(TaskExecutor):
    """Executor for URL crawling tasks"""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=4)
    
    def can_execute(self, task: CrawlTask) -> bool:
        """Check if this executor can handle the task"""
        return task.task_type == "url_crawl"
    
    async def execute_task(self, task: CrawlTask) -> Dict[str, Any]:
        """Execute a URL crawl task"""
        config = task.config
        url = config.get('url')
        
        if not url:
            raise ValueError("url is required for URL crawl")
        
        logger.info(f"Starting URL crawl for {url}")
        
        # Run the URL crawler in a thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            self.executor,
            self._run_url_crawl,
            url,
            config
        )
        
        return result
    
    def _run_url_crawl(self, url: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run URL crawler in a separate thread"""
        try:
            # Import here to avoid circular imports
            from .main import WebCrawler
            
            crawler = WebCrawler()
            
            # Configure crawler based on config
            max_depth = config.get('max_depth', 2)
            max_pages = config.get('max_pages', 100)
            delay = config.get('delay', 1)
            
            # Perform the crawl
            results = crawler.crawl_website(
                url=url,
                max_depth=max_depth,
                max_pages=max_pages,
                delay=delay
            )
            
            return {
                'success': True,
                'url': url,
                'results': results,
                'pages_crawled': len(results.get('pages', [])),
                'links_found': len(results.get('links', []))
            }
            
        except Exception as e:
            logger.error(f"URL crawl failed for {url}: {e}")
            return {
                'success': False,
                'error': str(e),
                'url': url
            }


class BatchCrawlExecutor(TaskExecutor):
    """Executor for batch crawling tasks"""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def can_execute(self, task: CrawlTask) -> bool:
        """Check if this executor can handle the task"""
        return task.task_type == "batch_crawl"
    
    async def execute_task(self, task: CrawlTask) -> Dict[str, Any]:
        """Execute a batch crawl task"""
        config = task.config
        batch_type = config.get('batch_type', 'urls')
        
        logger.info(f"Starting batch crawl of type: {batch_type}")
        
        # Run the batch crawler in a thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            self.executor,
            self._run_batch_crawl,
            config
        )
        
        return result
    
    def _run_batch_crawl(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run batch crawler in a separate thread"""
        try:
            batch_type = config.get('batch_type', 'urls')
            
            if batch_type == 'urls':
                return self._run_url_batch(config)
            elif batch_type == 'files':
                return self._run_file_batch(config)
            else:
                raise ValueError(f"Unknown batch type: {batch_type}")
                
        except Exception as e:
            logger.error(f"Batch crawl failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'batch_type': config.get('batch_type')
            }
    
    def _run_url_batch(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run batch URL crawling"""
        urls = config.get('urls', [])
        results = []
        
        for url in urls:
            try:
                # Import here to avoid circular imports
                from .main import WebCrawler
                
                crawler = WebCrawler()
                result = crawler.crawl_website(
                    url=url,
                    max_depth=config.get('max_depth', 1),
                    max_pages=config.get('max_pages_per_url', 10),
                    delay=config.get('delay', 1)
                )
                
                results.append({
                    'url': url,
                    'success': True,
                    'pages_crawled': len(result.get('pages', [])),
                    'result': result
                })
                
            except Exception as e:
                results.append({
                    'url': url,
                    'success': False,
                    'error': str(e)
                })
        
        return {
            'success': True,
            'batch_type': 'urls',
            'total_urls': len(urls),
            'successful_urls': sum(1 for r in results if r['success']),
            'failed_urls': sum(1 for r in results if not r['success']),
            'results': results
        }
    
    def _run_file_batch(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run batch file processing"""
        file_paths = config.get('file_paths', [])
        results = []
        
        for file_path in file_paths:
            try:
                crawler = OfflineCrawler(file_path)
                result = crawler.crawl()
                
                results.append({
                    'file_path': file_path,
                    'success': True,
                    'result': result
                })
                
            except Exception as e:
                results.append({
                    'file_path': file_path,
                    'success': False,
                    'error': str(e)
                })
        
        return {
            'success': True,
            'batch_type': 'files',
            'total_files': len(file_paths),
            'successful_files': sum(1 for r in results if r['success']),
            'failed_files': sum(1 for r in results if not r['success']),
            'results': results
        }


class APICrawlExecutor(TaskExecutor):
    """Executor for API crawling tasks"""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def can_execute(self, task: CrawlTask) -> bool:
        """Check if this executor can handle the task"""
        return task.task_type == "api_crawl"
    
    async def execute_task(self, task: CrawlTask) -> Dict[str, Any]:
        """Execute an API crawl task"""
        config = task.config
        api_url = config.get('api_url')
        
        if not api_url:
            raise ValueError("api_url is required for API crawl")
        
        logger.info(f"Starting API crawl for {api_url}")
        
        # Run the API crawler in a thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            self.executor,
            self._run_api_crawl,
            config
        )
        
        return result
    
    def _run_api_crawl(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run API crawler in a separate thread"""
        try:
            import requests
            import json
            
            api_url = config.get('api_url')
            method = config.get('method', 'GET')
            headers = config.get('headers', {})
            params = config.get('params', {})
            data = config.get('data')
            
            # Make the API request
            if method.upper() == 'GET':
                response = requests.get(api_url, headers=headers, params=params)
            elif method.upper() == 'POST':
                response = requests.post(api_url, headers=headers, json=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            
            # Parse response
            try:
                result_data = response.json()
            except json.JSONDecodeError:
                result_data = response.text
            
            return {
                'success': True,
                'api_url': api_url,
                'method': method,
                'status_code': response.status_code,
                'response_headers': dict(response.headers),
                'data': result_data,
                'response_size': len(response.content)
            }
            
        except Exception as e:
            logger.error(f"API crawl failed for {config.get('api_url')}: {e}")
            return {
                'success': False,
                'error': str(e),
                'api_url': config.get('api_url')
            }


class CustomCrawlExecutor(TaskExecutor):
    """Executor for custom crawling tasks"""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=2)
    
    def can_execute(self, task: CrawlTask) -> bool:
        """Check if this executor can handle the task"""
        return task.task_type == "custom_crawl"
    
    async def execute_task(self, task: CrawlTask) -> Dict[str, Any]:
        """Execute a custom crawl task"""
        config = task.config
        custom_type = config.get('custom_type')
        
        if not custom_type:
            raise ValueError("custom_type is required for custom crawl")
        
        logger.info(f"Starting custom crawl of type: {custom_type}")
        
        # Run the custom crawler in a thread pool
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            self.executor,
            self._run_custom_crawl,
            config
        )
        
        return result
    
    def _run_custom_crawl(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Run custom crawler in a separate thread"""
        try:
            custom_type = config.get('custom_type')
            
            # This is a placeholder for custom crawl implementations
            # In a real implementation, you would have specific logic for each custom type
            
            if custom_type == 'example_custom':
                # Example custom crawl logic
                return {
                    'success': True,
                    'custom_type': custom_type,
                    'result': f"Custom crawl completed for {custom_type}",
                    'timestamp': time.time()
                }
            else:
                raise ValueError(f"Unknown custom crawl type: {custom_type}")
                
        except Exception as e:
            logger.error(f"Custom crawl failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'custom_type': config.get('custom_type')
            }


# Factory function to create executors
def create_executors() -> List[TaskExecutor]:
    """Create and return all available task executors"""
    return [
        OfflineCrawlExecutor(),
        URLCrawlExecutor(),
        BatchCrawlExecutor(),
        APICrawlExecutor(),
        CustomCrawlExecutor()
    ]


# Executor registry for dynamic loading
class ExecutorRegistry:
    """Registry for managing task executors"""
    
    def __init__(self):
        self.executors: Dict[str, TaskExecutor] = {}
    
    def register_executor(self, name: str, executor: TaskExecutor):
        """Register a new executor"""
        self.executors[name] = executor
        logger.info(f"Registered executor: {name}")
    
    def get_executor(self, name: str) -> Optional[TaskExecutor]:
        """Get executor by name"""
        return self.executors.get(name)
    
    def get_executors_for_task(self, task: CrawlTask) -> List[TaskExecutor]:
        """Get all executors that can handle a specific task"""
        return [
            executor for executor in self.executors.values()
            if executor.can_execute(task)
        ]
    
    def list_executors(self) -> List[str]:
        """List all registered executor names"""
        return list(self.executors.keys())


# Global executor registry
executor_registry = ExecutorRegistry()

# Register default executors
for executor in create_executors():
    executor_registry.register_executor(executor.__class__.__name__, executor)

def get_task_executor(task_type: str) -> Optional[TaskExecutor]:
    """Get the appropriate task executor for a given task type."""
    # Create a dummy task to check which executor can handle it
    dummy_task = CrawlTask(task_type=task_type)
    
    # Find executors that can handle this task type
    suitable_executors = executor_registry.get_executors_for_task(dummy_task)
    
    if suitable_executors:
        return suitable_executors[0]  # Return the first suitable executor
    else:
        logger.warning(f"No executor found for task type: {task_type}")
        return None 