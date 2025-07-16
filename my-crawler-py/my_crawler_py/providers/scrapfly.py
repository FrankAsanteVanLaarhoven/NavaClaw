#!/usr/bin/env python3
"""
ScrapFly Provider Implementation
High-performance web scraping with 99% success rate and AI integration.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional, List
from .base import CrawlerProvider, CrawlRequest, CrawlResponse, ProviderType


class ScrapFlyProvider(CrawlerProvider):
    """ScrapFly API provider for high-performance web scraping."""
    
    def __init__(self, api_key: str, country: str = "us", **kwargs):
        super().__init__(api_key=api_key, **kwargs)
        self.base_url = "https://api.scrapfly.io/api/v1"
        self.country = country
        self.session = None
    
    def _get_provider_type(self) -> ProviderType:
        return ProviderType.SCRAPFLY
    
    def _get_capabilities(self) -> Dict[str, bool]:
        return {
            "javascript": True,
            "screenshots": True,
            "pdf": True,
            "proxy_rotation": True,
            "anti_bot": True,
            "geolocation": True,
            "batch_processing": True,
            "ai_integration": True
        }
    
    async def _get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session."""
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession(
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
            )
        return self.session
    
    async def fetch(self, request: CrawlRequest) -> CrawlResponse:
        """Fetch content using ScrapFly API."""
        await self.validate_request(request)
        
        session = await self._get_session()
        
        # Prepare ScrapFly API payload
        payload = {
            "url": request.url,
            "country": self.country,
            "asp": True,  # Anti-scraping protection
            "render_js": request.javascript,
            "wait_for": request.wait_for,
            "screenshot": request.screenshot,
            "pdf": request.pdf,
            "timeout": request.timeout * 1000,  # Convert to milliseconds
            "retry": request.retry_count
        }
        
        # Add custom headers if provided
        if request.headers:
            payload["headers"] = request.headers
        
        # Add cookies if provided
        if request.cookies:
            payload["cookies"] = request.cookies
        
        try:
            async with session.post(f"{self.base_url}/scrape", json=payload) as response:
                data = await response.json()
                
                if response.status != 200:
                    return CrawlResponse(
                        url=request.url,
                        status_code=response.status,
                        content="",
                        headers={},
                        cookies={},
                        metadata={},
                        error=f"ScrapFly API error: {data.get('message', 'Unknown error')}",
                        provider=self.provider_type
                    )
                
                # Extract response data
                result = data.get("result", {})
                
                return CrawlResponse(
                    url=request.url,
                    status_code=result.get("status_code", 0),
                    content=result.get("content", ""),
                    headers=result.get("headers", {}),
                    cookies=result.get("cookies", {}),
                    metadata={
                        "scrapfly_id": data.get("id"),
                        "country": result.get("country"),
                        "asp": result.get("asp"),
                        "render_js": result.get("render_js"),
                        "screenshot": result.get("screenshot"),
                        "pdf": result.get("pdf"),
                        "response_time": result.get("response_time"),
                        "cost": data.get("cost", 0)
                    },
                    screenshot=result.get("screenshot_data"),
                    pdf=result.get("pdf_data"),
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
                error=f"ScrapFly request failed: {str(e)}",
                provider=self.provider_type
            )
    
    async def batch_fetch(self, requests: List[CrawlRequest]) -> List[CrawlResponse]:
        """Fetch multiple URLs in batch using ScrapFly."""
        # ScrapFly supports batch processing
        session = await self._get_session()
        
        # Prepare batch payload
        batch_payload = {
            "urls": [req.url for req in requests],
            "country": self.country,
            "asp": True,
            "render_js": True,
            "timeout": 30000  # 30 seconds default
        }
        
        try:
            async with session.post(f"{self.base_url}/scrape/batch", json=batch_payload) as response:
                data = await response.json()
                
                if response.status != 200:
                    # Return error responses for all requests
                    return [
                        CrawlResponse(
                            url=req.url,
                            status_code=response.status,
                            content="",
                            headers={},
                            cookies={},
                            metadata={},
                            error=f"Batch request failed: {data.get('message', 'Unknown error')}",
                            provider=self.provider_type
                        )
                        for req in requests
                    ]
                
                # Process batch results
                results = []
                batch_results = data.get("results", [])
                
                for i, req in enumerate(requests):
                    if i < len(batch_results):
                        result = batch_results[i]
                        results.append(CrawlResponse(
                            url=req.url,
                            status_code=result.get("status_code", 0),
                            content=result.get("content", ""),
                            headers=result.get("headers", {}),
                            cookies=result.get("cookies", {}),
                            metadata={
                                "scrapfly_id": result.get("id"),
                                "country": result.get("country"),
                                "asp": result.get("asp"),
                                "response_time": result.get("response_time")
                            },
                            provider=self.provider_type
                        ))
                    else:
                        results.append(CrawlResponse(
                            url=req.url,
                            status_code=0,
                            content="",
                            headers={},
                            cookies={},
                            metadata={},
                            error="No result in batch response",
                            provider=self.provider_type
                        ))
                
                return results
                
        except Exception as e:
            # Return error responses for all requests
            return [
                CrawlResponse(
                    url=req.url,
                    status_code=0,
                    content="",
                    headers={},
                    cookies={},
                    metadata={},
                    error=f"Batch request failed: {str(e)}",
                    provider=self.provider_type
                )
                for req in requests
            ]
    
    def get_cost_estimate(self, request: CrawlRequest) -> float:
        """Estimate cost for ScrapFly request."""
        # ScrapFly pricing: $0.28 per 1000 requests
        base_cost = 0.00028  # Cost per request
        
        # Add costs for additional features
        if request.screenshot:
            base_cost += 0.0001  # Additional cost for screenshots
        if request.pdf:
            base_cost += 0.0002  # Additional cost for PDF
        
        return base_cost
    
    def get_rate_limits(self) -> Dict[str, Any]:
        """Get ScrapFly rate limits."""
        return {
            "requests_per_minute": 1000,
            "requests_per_hour": 50000,
            "requests_per_day": 1000000,
            "concurrent_requests": 100,
            "cost_per_request": 0.00028
        }
    
    async def health_check(self) -> bool:
        """Check ScrapFly API health."""
        try:
            session = await self._get_session()
            async with session.get(f"{self.base_url}/account") as response:
                return response.status == 200
        except Exception:
            return False
    
    async def close(self):
        """Close the aiohttp session."""
        if self.session and not self.session.closed:
            await self.session.close() 