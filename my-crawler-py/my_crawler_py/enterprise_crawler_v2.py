#!/usr/bin/env python3
"""
Enterprise Crawler V2 - Bright Data-like Capabilities
Advanced web crawler with proxy management, anti-detection, and distributed processing.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime, timezone
import json
from pathlib import Path
import time
import random

from .providers import (
    CrawlRequest, CrawlResponse, ProviderType,
    get_provider, create_provider, get_best_provider
)
from .proxy_manager import ProxyManager, ProxyType, get_proxy_session, rotate_proxy_session
from .anti_detection import AntiDetectionManager, get_anti_detection_session, get_random_browser_profile
from .enhanced_extraction import EnhancedDataExtractor
from .tech_stack_analyzer import TechStackAnalyzer
from .distributed_crawler import DistributedCrawler
from .job_queue import CrawlJob, TaskPriority

logger = logging.getLogger(__name__)

@dataclass
class EnterpriseCrawlConfig:
    """Configuration for enterprise crawling."""
    # Provider settings
    provider_type: ProviderType = ProviderType.BRIGHTDATA
    provider_config: Dict[str, Any] = field(default_factory=dict)
    
    # Proxy settings
    proxy_type: ProxyType = ProxyType.DATACENTER
    proxy_country: str = "us"
    proxy_city: Optional[str] = None
    enable_proxy_rotation: bool = True
    max_proxy_requests: int = 1000
    
    # Anti-detection settings
    enable_anti_detection: bool = True
    browser_profile: Optional[str] = None
    behavioral_pattern: Optional[str] = None
    enable_human_behavior: bool = True
    
    # Extraction settings
    extraction_layers: List[str] = field(default_factory=lambda: [
        "meta", "network", "ocr", "ast", "storage", "ui_components"
    ])
    enable_tech_stack_analysis: bool = True
    enable_rag_analysis: bool = True
    
    # Performance settings
    max_concurrent: int = 10
    request_delay: float = 1.0
    timeout: int = 30
    retry_count: int = 3
    
    # Output settings
    output_dir: Optional[str] = None
    enable_reports: bool = True
    enable_screenshots: bool = True
    enable_pdf: bool = False

@dataclass
class EnterpriseCrawlResult:
    """Result of enterprise crawling operation."""
    url: str
    status_code: int
    content: str
    extraction_data: Dict[str, Any]
    tech_stack_data: Optional[Dict[str, Any]] = None
    proxy_info: Optional[Dict[str, Any]] = None
    anti_detection_info: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

class EnterpriseCrawlerV2:
    """Enhanced enterprise crawler with Bright Data-like capabilities."""
    
    def __init__(self, config: EnterpriseCrawlConfig):
        self.config = config
        self.proxy_manager = ProxyManager()
        self.anti_detection_manager = AntiDetectionManager()
        self.enhanced_extractor = EnhancedDataExtractor(config.output_dir)
        self.tech_stack_analyzer = TechStackAnalyzer()
        self.distributed_crawler = DistributedCrawler()
        
        # Initialize provider
        self.provider = self._initialize_provider()
        
        # Session tracking
        self.current_proxy_session = None
        self.current_anti_detection_session = None
        self.session_start_time = None
        
        # Statistics
        self.stats = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "proxy_rotations": 0,
            "session_rotations": 0,
            "extraction_layers": {},
            "tech_stack_detections": 0
        }
    
    def _initialize_provider(self):
        """Initialize the crawling provider."""
        if self.config.provider_type == ProviderType.BRIGHTDATA:
            return create_provider(
                ProviderType.BRIGHTDATA,
                username=self.config.provider_config.get("username"),
                password=self.config.provider_config.get("password"),
                proxy_type=self.config.proxy_type.value,
                country=self.config.proxy_country,
                city=self.config.proxy_city
            )
        else:
            return create_provider(self.config.provider_type, **self.config.provider_config)
    
    async def start_session(self):
        """Start a new crawling session with proxy and anti-detection."""
        # Start proxy session
        if self.config.enable_proxy_rotation:
            self.current_proxy_session = await get_proxy_session(
                proxy_type=self.config.proxy_type,
                country=self.config.proxy_country,
                city=self.config.proxy_city
            )
            logger.info(f"Started proxy session: {self.current_proxy_session.session_id}")
        
        # Start anti-detection session
        if self.config.enable_anti_detection:
            self.current_anti_detection_session = get_anti_detection_session(
                profile_name=self.config.browser_profile,
                pattern_name=self.config.behavioral_pattern
            )
            logger.info(f"Started anti-detection session: {self.current_anti_detection_session}")
        
        self.session_start_time = datetime.now(timezone.utc)
    
    async def rotate_session(self):
        """Rotate the current session."""
        if self.current_proxy_session:
            self.current_proxy_session = await rotate_proxy_session(
                self.current_proxy_session.session_id
            )
            self.stats["proxy_rotations"] += 1
            logger.info("Rotated proxy session")
        
        if self.current_anti_detection_session:
            self.current_anti_detection_session = get_anti_detection_session()
            self.stats["session_rotations"] += 1
            logger.info("Rotated anti-detection session")
    
    async def crawl_single_url(self, url: str) -> EnterpriseCrawlResult:
        """Crawl a single URL with all enterprise features."""
        start_time = time.time()
        
        try:
            # Ensure session is active
            if not self.current_proxy_session and self.config.enable_proxy_rotation:
                await self.start_session()
            
            # Create crawl request
            request = CrawlRequest(
                url=url,
                provider=self.config.provider_type,
                options={
                    "proxy_session": self.current_proxy_session.session_id if self.current_proxy_session else None,
                    "anti_detection_session": self.current_anti_detection_session,
                    "enable_human_behavior": self.config.enable_human_behavior
                },
                timeout=self.config.timeout,
                retry_count=self.config.retry_count,
                javascript=True,
                screenshot=self.config.enable_screenshots,
                pdf=self.config.enable_pdf
            )
            
            # Add anti-detection headers if enabled
            if self.config.enable_anti_detection:
                profile_name, profile = get_random_browser_profile()
                request.headers = self.anti_detection_manager.get_session_headers(profile)
            
            # Perform the crawl
            response = await self.provider.fetch(request)
            
            # Update statistics
            self.stats["total_requests"] += 1
            response_time = time.time() - start_time
            
            if response.error:
                self.stats["failed_requests"] += 1
                return EnterpriseCrawlResult(
                    url=url,
                    status_code=response.status_code,
                    content="",
                    extraction_data={},
                    error=response.error
                )
            
            self.stats["successful_requests"] += 1
            
            # Enhanced data extraction
            extraction_data = await self._perform_enhanced_extraction(url, response)
            
            # Tech stack analysis
            tech_stack_data = None
            if self.config.enable_tech_stack_analysis:
                tech_stack_data = await self._perform_tech_stack_analysis(url, response, extraction_data)
            
            # Update proxy session statistics
            if self.current_proxy_session:
                await self.proxy_manager.update_session_status(
                    self.current_proxy_session.session_id,
                    success=True,
                    response_time=response_time
                )
            
            return EnterpriseCrawlResult(
                url=url,
                status_code=response.status_code,
                content=response.content,
                extraction_data=extraction_data,
                tech_stack_data=tech_stack_data,
                proxy_info=self._get_proxy_info(),
                anti_detection_info=self._get_anti_detection_info(),
                metadata=response.metadata
            )
            
        except Exception as e:
            self.stats["failed_requests"] += 1
            logger.error(f"Error crawling {url}: {e}")
            
            # Update proxy session statistics
            if self.current_proxy_session:
                await self.proxy_manager.update_session_status(
                    self.current_proxy_session.session_id,
                    success=False,
                    response_time=time.time() - start_time
                )
            
            return EnterpriseCrawlResult(
                url=url,
                status_code=0,
                content="",
                extraction_data={},
                error=str(e)
            )
    
    async def _perform_enhanced_extraction(self, url: str, response: CrawlResponse) -> Dict[str, Any]:
        """Perform enhanced data extraction."""
        extraction_data = {}
        
        for layer in self.config.extraction_layers:
            try:
                if layer == "meta":
                    # Meta tags extraction
                    extraction_data["meta"] = await self.enhanced_extractor.extract_meta_tags_from_content(
                        response.content, url
                    )
                
                elif layer == "network":
                    # Network traffic analysis
                    extraction_data["network"] = {
                        "request_count": len(response.metadata.get("requests", [])),
                        "response_count": len(response.metadata.get("responses", [])),
                        "domains": list(set([
                            urlparse(req["url"]).netloc 
                            for req in response.metadata.get("requests", [])
                        ]))
                    }
                
                elif layer == "storage":
                    # Storage extraction
                    extraction_data["storage"] = response.metadata.get("storage", {})
                
                elif layer == "ui_components":
                    # UI components extraction
                    extraction_data["ui_components"] = await self.enhanced_extractor.extract_ui_components_from_content(
                        response.content, url
                    )
                
                # Track extraction layer usage
                self.stats["extraction_layers"][layer] = self.stats["extraction_layers"].get(layer, 0) + 1
                
            except Exception as e:
                logger.warning(f"Error in {layer} extraction: {e}")
                extraction_data[layer] = {"error": str(e)}
        
        return extraction_data
    
    async def _perform_tech_stack_analysis(self, url: str, response: CrawlResponse, extraction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform tech stack analysis."""
        try:
            # Create temporary data structure for analysis
            temp_data = {
                "url": url,
                "content": response.content,
                "extraction": {
                    "basic": {
                        "scripts": extraction_data.get("ui_components", {}).get("scripts", []),
                        "stylesheets": extraction_data.get("ui_components", {}).get("stylesheets", []),
                        "meta_tags": extraction_data.get("meta", {}).get("seo", {})
                    }
                }
            }
            
            # Analyze tech stack
            tech_stack = self.tech_stack_analyzer.analyze_single_crawl_data(temp_data)
            self.stats["tech_stack_detections"] += 1
            
            return tech_stack
            
        except Exception as e:
            logger.warning(f"Error in tech stack analysis: {e}")
            return {"error": str(e)}
    
    def _get_proxy_info(self) -> Optional[Dict[str, Any]]:
        """Get current proxy session information."""
        if not self.current_proxy_session:
            return None
        
        return self.proxy_manager.get_session_info(self.current_proxy_session.session_id)
    
    def _get_anti_detection_info(self) -> Optional[Dict[str, Any]]:
        """Get current anti-detection session information."""
        if not self.current_anti_detection_session:
            return None
        
        return self.anti_detection_manager.get_session_info()
    
    async def crawl_urls(self, urls: List[str]) -> List[EnterpriseCrawlResult]:
        """Crawl multiple URLs with enterprise features."""
        results = []
        
        # Start session
        await self.start_session()
        
        # Process URLs with concurrency control
        semaphore = asyncio.Semaphore(self.config.max_concurrent)
        
        async def crawl_with_semaphore(url: str) -> EnterpriseCrawlResult:
            async with semaphore:
                result = await self.crawl_single_url(url)
                
                # Add delay between requests
                if self.config.request_delay > 0:
                    await asyncio.sleep(self.config.request_delay)
                
                return result
        
        # Create tasks
        tasks = [crawl_with_semaphore(url) for url in urls]
        
        # Execute with progress tracking
        for i, task in enumerate(asyncio.as_completed(tasks)):
            result = await task
            results.append(result)
            
            # Log progress
            if (i + 1) % 10 == 0:
                logger.info(f"Processed {i + 1}/{len(urls)} URLs")
            
            # Check if session rotation is needed
            if self.config.enable_proxy_rotation and self.current_proxy_session:
                session_info = self._get_proxy_info()
                if session_info and session_info["request_count"] >= self.config.max_proxy_requests:
                    await self.rotate_session()
        
        return results
    
    async def create_distributed_job(self, name: str, urls: List[str], 
                                   description: str = "") -> str:
        """Create a distributed crawling job."""
        # Create job
        job = await self.distributed_crawler.create_job(
            name=name,
            description=description,
            config={
                "enterprise_config": self.config.__dict__,
                "extraction_layers": self.config.extraction_layers,
                "enable_tech_stack_analysis": self.config.enable_tech_stack_analysis
            }
        )
        
        # Add URL tasks
        for url in urls:
            await self.distributed_crawler.add_url_task(
                job=job,
                url=url,
                priority=TaskPriority.NORMAL,
                metadata={
                    "enterprise_crawler": True,
                    "proxy_type": self.config.proxy_type.value,
                    "anti_detection": self.config.enable_anti_detection
                }
            )
        
        # Submit job
        job_id = await self.distributed_crawler.submit_job(job)
        logger.info(f"Created distributed job {job_id} with {len(urls)} URLs")
        
        return job_id
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get comprehensive statistics."""
        return {
            **self.stats,
            "proxy_manager_stats": self.proxy_manager.get_statistics(),
            "session_info": {
                "proxy_session": self._get_proxy_info(),
                "anti_detection_session": self._get_anti_detection_info()
            },
            "config": {
                "provider_type": self.config.provider_type.value,
                "proxy_type": self.config.proxy_type.value,
                "enable_anti_detection": self.config.enable_anti_detection,
                "extraction_layers": self.config.extraction_layers
            }
        }
    
    async def generate_report(self, results: List[EnterpriseCrawlResult], 
                            output_file: Optional[str] = None) -> str:
        """Generate comprehensive enterprise report."""
        if not self.config.enable_reports:
            return ""
        
        # Prepare report data
        report_data = {
            "summary": {
                "total_urls": len(results),
                "successful_crawls": len([r for r in results if not r.error]),
                "failed_crawls": len([r for r in results if r.error]),
                "success_rate": len([r for r in results if not r.error]) / len(results) if results else 0
            },
            "statistics": self.get_statistics(),
            "results": [
                {
                    "url": result.url,
                    "status_code": result.status_code,
                    "has_error": bool(result.error),
                    "error": result.error,
                    "extraction_layers": list(result.extraction_data.keys()),
                    "has_tech_stack": bool(result.tech_stack_data),
                    "timestamp": result.timestamp.isoformat()
                }
                for result in results
            ],
            "tech_stack_summary": self._generate_tech_stack_summary(results),
            "proxy_performance": self._generate_proxy_performance_summary(results)
        }
        
        # Generate markdown report
        markdown_report = self._generate_markdown_report(report_data)
        
        # Save report
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(markdown_report)
            logger.info(f"Saved enterprise report to {output_file}")
        
        return markdown_report
    
    def _generate_tech_stack_summary(self, results: List[EnterpriseCrawlResult]) -> Dict[str, Any]:
        """Generate tech stack summary from results."""
        tech_stacks = {}
        
        for result in results:
            if result.tech_stack_data and "frontend" in result.tech_stack_data:
                frontend = result.tech_stack_data["frontend"]
                for category, items in frontend.items():
                    if isinstance(items, list):
                        for item in items:
                            tech_stacks[item] = tech_stacks.get(item, 0) + 1
        
        return {
            "total_detections": len(tech_stacks),
            "most_common": sorted(tech_stacks.items(), key=lambda x: x[1], reverse=True)[:10]
        }
    
    def _generate_proxy_performance_summary(self, results: List[EnterpriseCrawlResult]) -> Dict[str, Any]:
        """Generate proxy performance summary."""
        proxy_sessions = {}
        
        for result in results:
            if result.proxy_info:
                session_id = result.proxy_info["session_id"]
                if session_id not in proxy_sessions:
                    proxy_sessions[session_id] = {
                        "requests": 0,
                        "successes": 0,
                        "failures": 0
                    }
                
                proxy_sessions[session_id]["requests"] += 1
                if not result.error:
                    proxy_sessions[session_id]["successes"] += 1
                else:
                    proxy_sessions[session_id]["failures"] += 1
        
        return {
            "total_sessions": len(proxy_sessions),
            "session_performance": proxy_sessions
        }
    
    def _generate_markdown_report(self, report_data: Dict[str, Any]) -> str:
        """Generate markdown report."""
        report = f"""# Enterprise Crawler Report

## Summary
- **Total URLs**: {report_data['summary']['total_urls']}
- **Successful Crawls**: {report_data['summary']['successful_crawls']}
- **Failed Crawls**: {report_data['summary']['failed_crawls']}
- **Success Rate**: {report_data['summary']['success_rate']:.2%}

## Statistics
- **Total Requests**: {report_data['statistics']['total_requests']}
- **Proxy Rotations**: {report_data['statistics']['proxy_rotations']}
- **Session Rotations**: {report_data['statistics']['session_rotations']}

## Tech Stack Summary
- **Total Detections**: {report_data['tech_stack_summary']['total_detections']}
- **Most Common Technologies**:
"""
        
        for tech, count in report_data['tech_stack_summary']['most_common']:
            report += f"  - {tech}: {count} occurrences\n"
        
        report += f"""
## Proxy Performance
- **Total Sessions**: {report_data['proxy_performance']['total_sessions']}

## Results
"""
        
        for result in report_data['results']:
            status = "✅" if not result['has_error'] else "❌"
            report += f"- {status} {result['url']} (Status: {result['status_code']})\n"
        
        return report

# Convenience functions
async def create_enterprise_crawler(
    provider_type: ProviderType = ProviderType.BRIGHTDATA,
    proxy_type: ProxyType = ProxyType.DATACENTER,
    enable_anti_detection: bool = True,
    **kwargs
) -> EnterpriseCrawlerV2:
    """Create an enterprise crawler with default configuration."""
    config = EnterpriseCrawlConfig(
        provider_type=provider_type,
        proxy_type=proxy_type,
        enable_anti_detection=enable_anti_detection,
        **kwargs
    )
    return EnterpriseCrawlerV2(config)

async def crawl_enterprise_urls(
    urls: List[str],
    provider_type: ProviderType = ProviderType.BRIGHTDATA,
    proxy_type: ProxyType = ProxyType.DATACENTER,
    enable_anti_detection: bool = True,
    **kwargs
) -> List[EnterpriseCrawlResult]:
    """Convenience function to crawl URLs with enterprise features."""
    crawler = await create_enterprise_crawler(
        provider_type=provider_type,
        proxy_type=proxy_type,
        enable_anti_detection=enable_anti_detection,
        **kwargs
    )
    return await crawler.crawl_urls(urls) 