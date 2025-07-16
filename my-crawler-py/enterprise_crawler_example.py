#!/usr/bin/env python3
"""
Enterprise Crawler Example - Bright Data-like Capabilities
Demonstrates advanced web crawling with proxy management, anti-detection, and enterprise features.
"""

import asyncio
import logging
import os
from typing import List, Dict, Any
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import our enterprise crawler components
from my_crawler_py.enterprise_crawler_v2 import (
    EnterpriseCrawlerV2, EnterpriseCrawlConfig, EnterpriseCrawlResult,
    create_enterprise_crawler, crawl_enterprise_urls
)
from my_crawler_py.providers import ProviderType
from my_crawler_py.proxy_manager import ProxyType, ProxyConfig, proxy_manager
from my_crawler_py.anti_detection import anti_detection_manager

async def setup_proxy_configuration():
    """Set up proxy configuration for demonstration."""
    logger.info("Setting up proxy configuration...")
    
    # Add sample proxy configurations (replace with your actual proxy credentials)
    proxy_configs = [
        ProxyConfig(
            host="brd.superproxy.io",
            port=22225,
            username="your-username",  # Replace with actual username
            password="your-password",  # Replace with actual password
            proxy_type=ProxyType.DATACENTER,
            country="us",
            max_requests=1000
        ),
        ProxyConfig(
            host="brd.superproxy.io",
            port=22225,
            username="your-username",  # Replace with actual username
            password="your-password",  # Replace with actual password
            proxy_type=ProxyType.RESIDENTIAL,
            country="us",
            city="new-york",
            max_requests=500
        ),
        ProxyConfig(
            host="brd.superproxy.io",
            port=22225,
            username="your-username",  # Replace with actual username
            password="your-password",  # Replace with actual password
            proxy_type=ProxyType.ISP,
            country="us",
            max_requests=200
        )
    ]
    
    for config in proxy_configs:
        proxy_manager.add_proxy_config(config)
    
    logger.info(f"Added {len(proxy_configs)} proxy configurations")

async def demonstrate_proxy_management():
    """Demonstrate proxy management capabilities."""
    logger.info("=== Proxy Management Demonstration ===")
    
    # Create different types of proxy sessions
    datacenter_session = await proxy_manager.create_session(
        proxy_type=ProxyType.DATACENTER,
        country="us"
    )
    logger.info(f"Created datacenter session: {datacenter_session.session_id}")
    
    residential_session = await proxy_manager.create_session(
        proxy_type=ProxyType.RESIDENTIAL,
        country="us",
        city="new-york"
    )
    logger.info(f"Created residential session: {residential_session.session_id}")
    
    # Get session information
    session_info = proxy_manager.get_session_info(datacenter_session.session_id)
    logger.info(f"Session info: {session_info}")
    
    # Rotate session
    new_session = await proxy_manager.rotate_session(datacenter_session.session_id)
    logger.info(f"Rotated to new session: {new_session.session_id}")
    
    # Get statistics
    stats = proxy_manager.get_statistics()
    logger.info(f"Proxy manager statistics: {stats}")

async def demonstrate_anti_detection():
    """Demonstrate anti-detection capabilities."""
    logger.info("=== Anti-Detection Demonstration ===")
    
    # Start anti-detection session
    session_id = anti_detection_manager.start_session(
        profile_name="chrome_windows",
        pattern_name="casual_user"
    )
    logger.info(f"Started anti-detection session: {session_id}")
    
    # Get random browser profile
    profile_name, profile = anti_detection_manager.get_random_profile()
    logger.info(f"Selected browser profile: {profile_name}")
    
    # Get session headers
    headers = anti_detection_manager.get_session_headers(profile)
    logger.info(f"Generated headers: {list(headers.keys())}")
    
    # Get fingerprint evasion data
    evasion_data = anti_detection_manager.get_fingerprint_evasion(profile)
    logger.info(f"Fingerprint evasion data: {evasion_data}")
    
    # Get session information
    session_info = anti_detection_manager.get_session_info()
    logger.info(f"Anti-detection session info: {session_info}")

async def demonstrate_enterprise_crawling():
    """Demonstrate enterprise crawling capabilities."""
    logger.info("=== Enterprise Crawling Demonstration ===")
    
    # Sample URLs to crawl
    urls = [
        "https://example.com",
        "https://httpbin.org/headers",
        "https://httpbin.org/ip",
        "https://httpbin.org/user-agent"
    ]
    
    # Create enterprise crawler configuration
    config = EnterpriseCrawlConfig(
        provider_type=ProviderType.PLAYWRIGHT,  # Use Playwright for demonstration
        proxy_type=ProxyType.DATACENTER,
        proxy_country="us",
        enable_proxy_rotation=True,
        enable_anti_detection=True,
        browser_profile="chrome_windows",
        behavioral_pattern="casual_user",
        enable_human_behavior=True,
        extraction_layers=["meta", "network", "ui_components"],
        enable_tech_stack_analysis=True,
        max_concurrent=2,
        request_delay=2.0,
        timeout=30,
        enable_reports=True,
        enable_screenshots=True
    )
    
    # Create enterprise crawler
    crawler = EnterpriseCrawlerV2(config)
    
    # Crawl URLs
    logger.info(f"Starting enterprise crawl of {len(urls)} URLs...")
    results = await crawler.crawl_urls(urls)
    
    # Analyze results
    successful_crawls = [r for r in results if not r.error]
    failed_crawls = [r for r in results if r.error]
    
    logger.info(f"Successful crawls: {len(successful_crawls)}")
    logger.info(f"Failed crawls: {len(failed_crawls)}")
    
    # Show detailed results
    for result in results:
        status = "✅" if not result.error else "❌"
        logger.info(f"{status} {result.url} (Status: {result.status_code})")
        
        if result.extraction_data:
            logger.info(f"  Extraction layers: {list(result.extraction_data.keys())}")
        
        if result.tech_stack_data:
            logger.info(f"  Tech stack detected: {bool(result.tech_stack_data)}")
        
        if result.proxy_info:
            logger.info(f"  Proxy session: {result.proxy_info['session_id']}")
    
    # Generate report
    report = await crawler.generate_report(results, "enterprise_crawl_report.md")
    logger.info("Generated enterprise crawl report")
    
    # Get statistics
    stats = crawler.get_statistics()
    logger.info(f"Enterprise crawler statistics: {stats}")
    
    return results

async def demonstrate_convenience_functions():
    """Demonstrate convenience functions."""
    logger.info("=== Convenience Functions Demonstration ===")
    
    urls = [
        "https://httpbin.org/headers",
        "https://httpbin.org/ip"
    ]
    
    # Use convenience function for quick crawling
    results = await crawl_enterprise_urls(
        urls=urls,
        provider_type=ProviderType.PLAYWRIGHT,
        proxy_type=ProxyType.DATACENTER,
        enable_anti_detection=True,
        max_concurrent=2,
        request_delay=1.0
    )
    
    logger.info(f"Convenience function processed {len(results)} URLs")
    for result in results:
        status = "✅" if not result.error else "❌"
        logger.info(f"{status} {result.url}")

async def demonstrate_distributed_crawling():
    """Demonstrate distributed crawling capabilities."""
    logger.info("=== Distributed Crawling Demonstration ===")
    
    # Create enterprise crawler
    config = EnterpriseCrawlConfig(
        provider_type=ProviderType.PLAYWRIGHT,
        proxy_type=ProxyType.DATACENTER,
        enable_anti_detection=True
    )
    crawler = EnterpriseCrawlerV2(config)
    
    # Sample URLs for distributed job
    urls = [
        "https://httpbin.org/headers",
        "https://httpbin.org/ip",
        "https://httpbin.org/user-agent",
        "https://httpbin.org/delay/1"
    ]
    
    # Create distributed job
    job_id = await crawler.create_distributed_job(
        name="Enterprise Demo Job",
        urls=urls,
        description="Demonstration of distributed enterprise crawling"
    )
    
    logger.info(f"Created distributed job: {job_id}")
    
    # Get job status
    job_status = await crawler.distributed_crawler.get_job_status(job_id)
    if job_status:
        logger.info(f"Job status: {job_status.status}")
        logger.info(f"Job tasks: {len(job_status.tasks)}")

async def demonstrate_advanced_features():
    """Demonstrate advanced features beyond Bright Data."""
    logger.info("=== Advanced Features Demonstration ===")
    
    # Create crawler with advanced configuration
    config = EnterpriseCrawlConfig(
        provider_type=ProviderType.PLAYWRIGHT,
        proxy_type=ProxyType.DATACENTER,
        enable_anti_detection=True,
        extraction_layers=["meta", "network", "ocr", "ast", "storage", "ui_components"],
        enable_tech_stack_analysis=True,
        enable_rag_analysis=True,
        max_concurrent=3,
        request_delay=1.0,
        enable_screenshots=True,
        enable_pdf=False
    )
    
    crawler = EnterpriseCrawlerV2(config)
    
    # Crawl a single URL with all features
    url = "https://httpbin.org/html"
    result = await crawler.crawl_single_url(url)
    
    logger.info(f"Crawled {url} with advanced features")
    logger.info(f"Status: {result.status_code}")
    logger.info(f"Extraction layers: {list(result.extraction_data.keys())}")
    logger.info(f"Tech stack analysis: {bool(result.tech_stack_data)}")
    logger.info(f"Proxy info: {bool(result.proxy_info)}")
    logger.info(f"Anti-detection info: {bool(result.anti_detection_info)}")

async def main():
    """Main demonstration function."""
    logger.info("🚀 Starting Enterprise Crawler V2 Demonstration")
    logger.info("=" * 60)
    
    try:
        # Set up proxy configuration
        await setup_proxy_configuration()
        
        # Demonstrate proxy management
        await demonstrate_proxy_management()
        
        # Demonstrate anti-detection
        await demonstrate_anti_detection()
        
        # Demonstrate enterprise crawling
        await demonstrate_enterprise_crawling()
        
        # Demonstrate convenience functions
        await demonstrate_convenience_functions()
        
        # Demonstrate distributed crawling
        await demonstrate_distributed_crawling()
        
        # Demonstrate advanced features
        await demonstrate_advanced_features()
        
        logger.info("=" * 60)
        logger.info("✅ Enterprise Crawler V2 Demonstration Completed Successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error during demonstration: {e}")
        raise

if __name__ == "__main__":
    # Run the demonstration
    asyncio.run(main()) 