#!/usr/bin/env python3
"""
Authenticated Web Crawler

This module extends the basic crawler with authentication capabilities
for crawling freemium and paid websites. It integrates with the AuthManager
to handle login, session management, and anti-bot detection avoidance.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from pathlib import Path
import json
import time
import random

# Import existing crawler components
from .main import FullSiteSourceExtractor
from .auth_manager import AuthManager, login_to_site

# Import Playwright components
from playwright.async_api import BrowserContext, Page
from playwright.async_api import TimeoutError as PlaywrightTimeoutError

logger = logging.getLogger(__name__)


class AuthenticatedCrawler:
    """
    Enhanced crawler with authentication capabilities for freemium and paid sites.
    
    Features:
    - Automatic login and session management
    - Cookie persistence and reuse
    - Proxy rotation and user-agent spoofing
    - Rate limiting and anti-bot avoidance
    - Support for 2FA/MFA
    - Paywall detection and handling
    """
    
    def __init__(self,
                 auth_manager: Optional[AuthManager] = None,
                 session_dir: str = "crawler_sessions",
                 proxy_list: Optional[List[str]] = None,
                 user_agents: Optional[List[str]] = None,
                 encryption_key: Optional[str] = None):
        """
        Initialize the authenticated crawler.
        
        Args:
            auth_manager: Pre-configured AuthManager instance
            session_dir: Directory for session storage
            proxy_list: List of proxy URLs
            user_agents: List of user agent strings
            encryption_key: Encryption key for session data
        """
        self.auth_manager = auth_manager or AuthManager(
            session_dir=session_dir,
            proxy_list=proxy_list,
            user_agents=user_agents,
            encryption_key=encryption_key
        )
        
        self.active_contexts: Dict[str, BrowserContext] = {}
        self.site_configs: Dict[str, Dict] = {}
        
        # Load site configurations
        self._load_site_configs()
    
    def _load_site_configs(self):
        """Load predefined configurations for common sites."""
        config_file = Path(__file__).parent / "site_configs.json"
        if config_file.exists():
            try:
                with open(config_file, 'r') as f:
                    self.site_configs = json.load(f)
                logger.info(f"Loaded {len(self.site_configs)} site configurations")
            except Exception as e:
                logger.warning(f"Failed to load site configs: {e}")
    
    def add_site_config(self, 
                       site_name: str,
                       login_url: str,
                       username_selector: str = "input[name='username'], input[name='email']",
                       password_selector: str = "input[name='password']",
                       submit_selector: str = "button[type='submit']",
                       success_url: Optional[str] = None,
                       success_selector: Optional[str] = None,
                       rate_limit: int = 60,
                       **kwargs):
        """
        Add configuration for a specific site.
        
        Args:
            site_name: Name to identify the site
            login_url: URL of the login page
            username_selector: CSS selector for username field
            password_selector: CSS selector for password field
            submit_selector: CSS selector for submit button
            success_url: URL to wait for after successful login
            success_selector: CSS selector to wait for after successful login
            rate_limit: Requests per minute for this site
            **kwargs: Additional configuration options
        """
        config = {
            "login_url": login_url,
            "username_selector": username_selector,
            "password_selector": password_selector,
            "submit_selector": submit_selector,
            "success_url": success_url,
            "success_selector": success_selector,
            "rate_limit": rate_limit,
            **kwargs
        }
        
        self.site_configs[site_name] = config
        
        # Set rate limit
        domain = self._extract_domain(login_url)
        self.auth_manager.set_rate_limit(domain, rate_limit)
        
        logger.info(f"Added configuration for {site_name}")
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL."""
        from urllib.parse import urlparse
        return urlparse(url).netloc
    
    async def login_to_site(self,
                           site_name: str,
                           username: str,
                           password: str,
                           force_new_login: bool = False,
                           headless: bool = True) -> Optional[BrowserContext]:
        """
        Login to a specific site using stored configuration.
        
        Args:
            site_name: Name of the site (must have config)
            username: Username/email
            password: Password
            force_new_login: Force new login even if session exists
            headless: Run browser in headless mode
        
        Returns:
            Browser context with authenticated session, or None if failed
        """
        if site_name not in self.site_configs:
            raise ValueError(f"No configuration found for site: {site_name}")
        
        config = self.site_configs[site_name]
        
        # Create browser context
        context = await self.auth_manager.create_browser_context(headless=headless)
        
        try:
            # Try to load existing session first (unless forced)
            if not force_new_login:
                if await self.auth_manager.load_session(context, site_name):
                    logger.info(f"Loaded existing session for {site_name}")
                    self.active_contexts[site_name] = context
                    return context
            
            # Perform login
            success = await self.auth_manager.login_with_form(
                context=context,
                login_url=config["login_url"],
                username=username,
                password=password,
                username_selector=config["username_selector"],
                password_selector=config["password_selector"],
                submit_selector=config["submit_selector"],
                wait_for_url=config.get("success_url"),
                wait_for_selector=config.get("success_selector")
            )
            
            if success:
                # Save the session
                await self.auth_manager.save_session(context, site_name)
                self.active_contexts[site_name] = context
                logger.info(f"Login successful for {site_name}")
                return context
            else:
                await context.close()
                logger.error(f"Login failed for {site_name}")
                return None
                
        except Exception as e:
            logger.error(f"Login failed for {site_name}: {e}")
            await context.close()
            return None
    
    async def crawl_with_auth(self,
                             site_name: str,
                             start_urls: List[str],
                             username: str,
                             password: str,
                             max_pages: int = 100,
                             depth: int = 3,
                             force_login: bool = False,
                             headless: bool = True,
                             **kwargs) -> Dict[str, Any]:
        """
        Crawl a site that requires authentication.
        
        Args:
            site_name: Name of the site (must have config)
            start_urls: List of URLs to start crawling from
            username: Username for login
            password: Password for login
            max_pages: Maximum number of pages to crawl
            depth: Maximum crawl depth
            force_login: Force new login
            headless: Run browser in headless mode
            **kwargs: Additional crawling options
        
        Returns:
            Crawl results with extracted data
        """
        # Login first
        context = await self.login_to_site(
            site_name, username, password, force_login, headless
        )
        
        if not context:
            return {"error": "Failed to authenticate"}
        
        try:
            # Use the authenticated context for crawling
            results = await self._crawl_authenticated_site(
                context, start_urls, max_pages, depth, **kwargs
            )
            
            return results
            
        finally:
            # Don't close context here as it might be reused
            pass
    
    async def _crawl_authenticated_site(self,
                                      context: BrowserContext,
                                      start_urls: List[str],
                                      max_pages: int,
                                      depth: int,
                                      **kwargs) -> Dict[str, Any]:
        """
        Crawl an authenticated site using the provided context.
        
        Args:
            context: Authenticated browser context
            start_urls: URLs to start crawling from
            max_pages: Maximum pages to crawl
            depth: Maximum crawl depth
            **kwargs: Additional options
        
        Returns:
            Crawl results
        """
        results = {
            "pages": [],
            "errors": [],
            "stats": {
                "total_pages": 0,
                "successful_pages": 0,
                "failed_pages": 0,
                "start_time": time.time()
            }
        }
        
        visited_urls = set()
        urls_to_visit = [(url, 0) for url in start_urls]  # (url, depth)
        
        while urls_to_visit and len(results["pages"]) < max_pages:
            current_url, current_depth = urls_to_visit.pop(0)
            
            if current_url in visited_urls or current_depth > depth:
                continue
            
            visited_urls.add(current_url)
            
            try:
                # Rate limiting
                domain = self._extract_domain(current_url)
                await self.auth_manager.rate_limit_wait(domain)
                
                # Crawl the page
                page_data = await self._crawl_single_page(context, current_url)
                
                if page_data:
                    results["pages"].append(page_data)
                    results["stats"]["successful_pages"] += 1
                    
                    # Extract links for next level
                    if current_depth < depth:
                        links = page_data.get("links", [])
                        for link in links:
                            if link not in visited_urls:
                                urls_to_visit.append((link, current_depth + 1))
                else:
                    results["stats"]["failed_pages"] += 1
                
                results["stats"]["total_pages"] += 1
                
            except Exception as e:
                logger.error(f"Error crawling {current_url}: {e}")
                results["errors"].append({
                    "url": current_url,
                    "error": str(e)
                })
                results["stats"]["failed_pages"] += 1
        
        results["stats"]["end_time"] = time.time()
        results["stats"]["duration"] = results["stats"]["end_time"] - results["stats"]["start_time"]
        
        return results
    
    async def _crawl_single_page(self, context: BrowserContext, url: str) -> Optional[Dict[str, Any]]:
        """
        Crawl a single page using the authenticated context.
        
        Args:
            context: Authenticated browser context
            url: URL to crawl
        
        Returns:
            Page data or None if failed
        """
        try:
            page = await context.new_page()
            
            # Navigate to the page
            await page.goto(url, wait_until="networkidle", timeout=30000)
            
            # Check for paywall or access restrictions
            if await self._detect_paywall(page):
                logger.warning(f"Paywall detected on {url}")
                await page.close()
                return None
            
            # Extract page content
            page_data = await self._extract_page_content(page, url)
            
            await page.close()
            return page_data
            
        except PlaywrightTimeoutError:
            logger.warning(f"Timeout loading {url}")
            return None
        except Exception as e:
            logger.error(f"Error crawling {url}: {e}")
            return None
    
    async def _detect_paywall(self, page: Page) -> bool:
        """
        Detect if a page has a paywall or access restriction.
        
        Args:
            page: Playwright page object
        
        Returns:
            True if paywall detected, False otherwise
        """
        paywall_indicators = [
            "subscribe",
            "premium",
            "paywall",
            "access denied",
            "upgrade",
            "membership required",
            "sign up",
            "login required"
        ]
        
        try:
            # Check page title
            title = await page.title()
            title_lower = title.lower()
            
            for indicator in paywall_indicators:
                if indicator in title_lower:
                    return True
            
            # Check page content
            content = await page.content()
            content_lower = content.lower()
            
            for indicator in paywall_indicators:
                if indicator in content_lower:
                    return True
            
            # Check for common paywall selectors
            paywall_selectors = [
                ".paywall",
                ".premium-content",
                ".subscribe-overlay",
                ".access-denied",
                "[data-paywall]"
            ]
            
            for selector in paywall_selectors:
                try:
                    element = await page.query_selector(selector)
                    if element:
                        return True
                except:
                    pass
            
            return False
            
        except Exception as e:
            logger.warning(f"Error detecting paywall: {e}")
            return False
    
    async def _extract_page_content(self, page: Page, url: str) -> Dict[str, Any]:
        """
        Extract content from a page.
        
        Args:
            page: Playwright page object
            url: Page URL
        
        Returns:
            Extracted page data
        """
        try:
            # Basic page info
            title = await page.title()
            
            # Extract text content
            text_content = await page.evaluate("""
                () => {
                    // Remove script and style elements
                    const scripts = document.querySelectorAll('script, style');
                    scripts.forEach(el => el.remove());
                    
                    // Get text content
                    return document.body ? document.body.innerText : '';
                }
            """)
            
            # Extract links
            links = await page.evaluate("""
                () => {
                    const links = Array.from(document.querySelectorAll('a[href]'));
                    return links.map(link => link.href).filter(href => href.startsWith('http'));
                }
            """)
            
            # Extract meta tags
            meta_tags = await page.evaluate("""
                () => {
                    const metas = document.querySelectorAll('meta');
                    const metaData = {};
                    metas.forEach(meta => {
                        const name = meta.getAttribute('name') || meta.getAttribute('property');
                        const content = meta.getAttribute('content');
                        if (name && content) {
                            metaData[name] = content;
                        }
                    });
                    return metaData;
                }
            """)
            
            # Extract structured data (JSON-LD)
            structured_data = await page.evaluate("""
                () => {
                    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
                    return Array.from(scripts).map(script => {
                        try {
                            return JSON.parse(script.textContent);
                        } catch (e) {
                            return null;
                        }
                    }).filter(data => data !== null);
                }
            """)
            
            return {
                "url": url,
                "title": title,
                "text_content": text_content,
                "links": links,
                "meta_tags": meta_tags,
                "structured_data": structured_data,
                "crawled_at": time.time()
            }
            
        except Exception as e:
            logger.error(f"Error extracting content from {url}: {e}")
            return {
                "url": url,
                "error": str(e),
                "crawled_at": time.time()
            }
    
    async def close_all_contexts(self):
        """Close all active browser contexts."""
        for site_name, context in self.active_contexts.items():
            try:
                await context.close()
                logger.info(f"Closed context for {site_name}")
            except Exception as e:
                logger.error(f"Error closing context for {site_name}: {e}")
        
        self.active_contexts.clear()
    
    def get_session_info(self, site_name: str) -> Optional[Dict]:
        """Get information about a saved session."""
        return self.auth_manager.get_session_info(site_name)
    
    def list_sessions(self) -> List[Dict]:
        """List all saved sessions."""
        return self.auth_manager.list_sessions()
    
    def delete_session(self, site_name: str) -> bool:
        """Delete a saved session."""
        return self.auth_manager.delete_session(site_name)
    
    def export_cookies(self, site_name: str, format: str = "json") -> str:
        """Export cookies for a site."""
        return self.auth_manager.export_cookies_to_file(site_name, format)


# Predefined site configurations
DEFAULT_SITE_CONFIGS = {
    "linkedin": {
        "login_url": "https://www.linkedin.com/login",
        "username_selector": "input[name='session_key']",
        "password_selector": "input[name='session_password']",
        "submit_selector": "button[type='submit']",
        "success_url": "https://www.linkedin.com/feed/",
        "rate_limit": 30
    },
    "github": {
        "login_url": "https://github.com/login",
        "username_selector": "input[name='login']",
        "password_selector": "input[name='password']",
        "submit_selector": "input[name='commit']",
        "success_url": "https://github.com/",
        "rate_limit": 60
    },
    "twitter": {
        "login_url": "https://twitter.com/i/flow/login",
        "username_selector": "input[autocomplete='username']",
        "password_selector": "input[name='password']",
        "submit_selector": "div[data-testid='LoginForm_Login_Button']",
        "success_url": "https://twitter.com/home",
        "rate_limit": 30
    },
    "medium": {
        "login_url": "https://medium.com/m/signin",
        "username_selector": "input[name='email']",
        "password_selector": "input[name='password']",
        "submit_selector": "button[type='submit']",
        "success_url": "https://medium.com/",
        "rate_limit": 60
    }
}


# Example usage
async def example_authenticated_crawl():
    """Example of authenticated crawling."""
    
    # Initialize crawler
    crawler = AuthenticatedCrawler(
        session_dir="authenticated_sessions",
        proxy_list=[
            "http://proxy1:8080",
            "http://proxy2:8080"
        ]
    )
    
    # Add site configuration
    crawler.add_site_config(
        site_name="example_site",
        login_url="https://example.com/login",
        username_selector="input[name='username']",
        password_selector="input[name='password']",
        submit_selector="button[type='submit']",
        success_url="https://example.com/dashboard",
        rate_limit=30
    )
    
    # Crawl with authentication
    results = await crawler.crawl_with_auth(
        site_name="example_site",
        start_urls=["https://example.com/protected-content"],
        username="your_username",
        password="your_password",
        max_pages=50,
        depth=2,
        headless=True
    )
    
    print(f"Crawled {len(results['pages'])} pages")
    print(f"Errors: {len(results['errors'])}")
    
    # Close all contexts
    await crawler.close_all_contexts()


if __name__ == "__main__":
    # Run example
    asyncio.run(example_authenticated_crawl()) 