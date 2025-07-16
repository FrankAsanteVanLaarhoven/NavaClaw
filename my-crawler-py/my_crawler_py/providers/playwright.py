#!/usr/bin/env python3
"""
Playwright Provider Implementation
Local browser automation with full JavaScript support.
"""

import asyncio
from typing import Dict, Any, Optional, List
from playwright.async_api import async_playwright, Page, Browser
from .base import CrawlerProvider, CrawlRequest, CrawlResponse, ProviderType


class PlaywrightProvider(CrawlerProvider):
    """Playwright provider for local browser automation."""
    
    def __init__(self, headless: bool = True, browser_type: str = "chromium", **kwargs):
        super().__init__(**kwargs)
        self.headless = headless
        self.browser_type = browser_type
        self.playwright = None
        self.browser = None
    
    def _get_provider_type(self) -> ProviderType:
        return ProviderType.PLAYWRIGHT
    
    def _get_capabilities(self) -> Dict[str, bool]:
        return {
            "javascript": True,
            "screenshots": True,
            "pdf": True,
            "proxy_rotation": False,  # Requires manual setup
            "anti_bot": False,  # Basic stealth only
            "geolocation": False,  # Requires manual setup
            "batch_processing": True,
            "ai_integration": False
        }
    
    async def _get_browser(self) -> Browser:
        """Get or create browser instance."""
        if self.playwright is None:
            self.playwright = await async_playwright().start()
        
        if self.browser is None or self.browser.is_closed():
            if self.browser_type == "chromium":
                self.browser = await self.playwright.chromium.launch(headless=self.headless)
            elif self.browser_type == "firefox":
                self.browser = await self.playwright.firefox.launch(headless=self.headless)
            elif self.browser_type == "webkit":
                self.browser = await self.playwright.webkit.launch(headless=self.headless)
            else:
                raise ValueError(f"Unsupported browser type: {self.browser_type}")
        
        return self.browser
    
    async def fetch(self, request: CrawlRequest) -> CrawlResponse:
        """Fetch content using Playwright."""
        await self.validate_request(request)
        
        browser = await self._get_browser()
        page = await browser.new_page()
        
        try:
            # Set user agent if provided
            if request.user_agent:
                await page.set_extra_http_headers({"User-Agent": request.user_agent})
            
            # Set custom headers if provided
            if request.headers:
                await page.set_extra_http_headers(request.headers)
            
            # Set cookies if provided
            if request.cookies:
                await page.context.add_cookies([
                    {"name": k, "value": v, "url": request.url}
                    for k, v in request.cookies.items()
                ])
            
            # Navigate to URL
            response = await page.goto(
                request.url,
                wait_until="networkidle",
                timeout=request.timeout * 1000
            )
            
            # Wait for specific element if provided
            if request.wait_for:
                await page.wait_for_selector(request.wait_for, timeout=request.timeout * 1000)
            
            # Get page content
            content = await page.content()
            
            # Get response headers
            headers = {}
            if response:
                headers = dict(response.headers)
            
            # Get cookies
            cookies = {}
            for cookie in await page.context.cookies():
                cookies[cookie["name"]] = cookie["value"]
            
            # Take screenshot if requested
            screenshot = None
            if request.screenshot:
                screenshot = await page.screenshot(full_page=True)
            
            # Generate PDF if requested
            pdf = None
            if request.pdf:
                pdf = await page.pdf()
            
            # Get page metadata
            metadata = {
                "title": await page.title(),
                "url": page.url,
                "viewport": await page.evaluate("() => ({ width: window.innerWidth, height: window.innerHeight })"),
                "user_agent": await page.evaluate("navigator.userAgent"),
                "browser_type": self.browser_type,
                "headless": self.headless
            }
            
            return CrawlResponse(
                url=request.url,
                status_code=response.status if response else 0,
                content=content,
                headers=headers,
                cookies=cookies,
                metadata=metadata,
                screenshot=screenshot,
                pdf=pdf,
                provider=self.provider_type
            )
            
        except Exception as e:
            return CrawlResponse(
                url=request.url,
                status_code=0,
                content="",
                headers={},
                cookies={},
                metadata={},
                error=f"Playwright request failed: {str(e)}",
                provider=self.provider_type
            )
        finally:
            await page.close()
    
    async def batch_fetch(self, requests: List[CrawlRequest]) -> List[CrawlResponse]:
        """Fetch multiple URLs in batch using Playwright."""
        # Process requests concurrently with semaphore to limit concurrent pages
        semaphore = asyncio.Semaphore(5)  # Limit to 5 concurrent pages
        
        async def fetch_with_semaphore(req: CrawlRequest) -> CrawlResponse:
            async with semaphore:
                return await self.fetch(req)
        
        # Create tasks for all requests
        tasks = [fetch_with_semaphore(req) for req in requests]
        
        # Execute all tasks concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Convert exceptions to error responses
        responses = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                responses.append(CrawlResponse(
                    url=requests[i].url,
                    status_code=0,
                    content="",
                    headers={},
                    cookies={},
                    metadata={},
                    error=f"Batch request failed: {str(result)}",
                    provider=self.provider_type
                ))
            else:
                responses.append(result)
        
        return responses
    
    def get_cost_estimate(self, request: CrawlRequest) -> float:
        """Estimate cost for Playwright request (local, so minimal cost)."""
        # Playwright is local, so cost is minimal (just compute resources)
        base_cost = 0.00001  # Very low cost for local processing
        
        # Add costs for additional features
        if request.screenshot:
            base_cost += 0.00001  # Additional storage cost
        if request.pdf:
            base_cost += 0.00001  # Additional processing cost
        
        return base_cost
    
    def get_rate_limits(self) -> Dict[str, Any]:
        """Get Playwright rate limits (local processing)."""
        return {
            "requests_per_minute": 100,  # Limited by local resources
            "requests_per_hour": 5000,
            "requests_per_day": 100000,
            "concurrent_requests": 5,  # Limited by memory/CPU
            "cost_per_request": 0.00001
        }
    
    async def health_check(self) -> bool:
        """Check if Playwright is available."""
        try:
            browser = await self._get_browser()
            page = await browser.new_page()
            await page.goto("data:text/html,<html><body>test</body></html>")
            await page.close()
            return True
        except Exception:
            return False
    
    async def close(self):
        """Close Playwright browser and context."""
        if self.browser and not self.browser.is_closed():
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop() 