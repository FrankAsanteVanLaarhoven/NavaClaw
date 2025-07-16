#!/usr/bin/env python3
"""
Bright Data Provider
Integrates Bright Data's proxy network with advanced capabilities.
"""

import asyncio
import aiohttp
import json
import base64
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
import logging
from urllib.parse import urlparse

from .base import CrawlerProvider, CrawlRequest, CrawlResponse, ProviderType

logger = logging.getLogger(__name__)

class BrightDataProvider(CrawlerProvider):
    """Bright Data provider with advanced proxy capabilities."""
    
    def __init__(self, 
                 username: str = None,
                 password: str = None,
                 proxy_type: str = "datacenter",  # datacenter, residential, isp
                 country: str = "us",
                 city: str = None,
                 session_id: str = None,
                 **kwargs):
        super().__init__(**kwargs)
        self.username = username
        self.password = password
        self.proxy_type = proxy_type
        self.country = country
        self.city = city
        self.session_id = session_id or f"session_{datetime.now().timestamp()}"
        self.base_url = "https://brd.superproxy.io:22225"
        
    def _get_provider_type(self) -> ProviderType:
        return ProviderType.BRIGHTDATA
    
    def _build_proxy_url(self) -> str:
        """Build proxy URL based on configuration."""
        if self.proxy_type == "datacenter":
            return f"http://{self.username}-country-{self.country}-session-{self.session_id}:{self.password}@brd.superproxy.io:22225"
        elif self.proxy_type == "residential":
            city_part = f"-city-{self.city}" if self.city else ""
            return f"http://{self.username}-country-{self.country}{city_part}-session-{self.session_id}:{self.password}@brd.superproxy.io:22225"
        elif self.proxy_type == "isp":
            return f"http://{self.username}-country-{self.country}-session-{self.session_id}:{self.password}@brd.superproxy.io:22225"
        else:
            raise ValueError(f"Unsupported proxy type: {self.proxy_type}")
    
    async def fetch(self, request: CrawlRequest) -> CrawlResponse:
        """Fetch content using Bright Data proxy."""
        try:
            proxy_url = self._build_proxy_url()
            
            # Prepare headers
            headers = {
                'User-Agent': request.user_agent or 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            
            if request.headers:
                headers.update(request.headers)
            
            # Prepare cookies
            cookies = request.cookies or {}
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    request.url,
                    proxy=proxy_url,
                    headers=headers,
                    cookies=cookies,
                    timeout=aiohttp.ClientTimeout(total=request.timeout),
                    ssl=False
                ) as response:
                    content = await response.text()
                    
                    return CrawlResponse(
                        url=request.url,
                        status_code=response.status,
                        content=content,
                        headers=dict(response.headers),
                        cookies=dict(response.cookies),
                        metadata={
                            "proxy_type": self.proxy_type,
                            "country": self.country,
                            "city": self.city,
                            "session_id": self.session_id,
                            "brightdata_proxy": True
                        },
                        provider=self.provider_type,
                        timestamp=datetime.now(timezone.utc)
                    )
                    
        except Exception as e:
            logger.error(f"Bright Data fetch error: {e}")
            return CrawlResponse(
                url=request.url,
                status_code=0,
                content="",
                headers={},
                cookies={},
                metadata={"error": str(e)},
                error=str(e),
                provider=self.provider_type,
                timestamp=datetime.now(timezone.utc)
            )
    
    async def batch_fetch(self, requests: List[CrawlRequest]) -> List[CrawlResponse]:
        """Fetch multiple URLs in batch."""
        tasks = [self.fetch(req) for req in requests]
        return await asyncio.gather(*tasks, return_exceptions=True)
    
    def get_cost_estimate(self, request: CrawlRequest) -> float:
        """Estimate cost based on Bright Data pricing."""
        # Bright Data pricing varies by proxy type
        base_costs = {
            "datacenter": 0.001,  # per request
            "residential": 0.01,   # per request
            "isp": 0.05           # per request
        }
        return base_costs.get(self.proxy_type, 0.001)
    
    def get_rate_limits(self) -> Dict[str, Any]:
        """Get Bright Data rate limits."""
        return {
            "requests_per_minute": 1000,
            "concurrent_connections": 100,
            "proxy_type": self.proxy_type,
            "country": self.country
        }
    
    def _get_capabilities(self) -> Dict[str, bool]:
        """Get Bright Data capabilities."""
        return {
            "javascript": True,
            "screenshots": False,  # Requires additional setup
            "pdf": False,
            "proxy_rotation": True,
            "geolocation": True,
            "session_management": True,
            "anti_detection": True,
            "residential_proxies": True,
            "datacenter_proxies": True,
            "isp_proxies": True
        }
    
    async def create_session(self, session_id: str = None) -> str:
        """Create a new session for consistent IP."""
        if session_id:
            self.session_id = session_id
        else:
            self.session_id = f"session_{datetime.now().timestamp()}"
        return self.session_id
    
    async def rotate_session(self) -> str:
        """Rotate to a new session."""
        return await self.create_session()
    
    def get_geolocation_info(self) -> Dict[str, Any]:
        """Get current geolocation information."""
        return {
            "country": self.country,
            "city": self.city,
            "proxy_type": self.proxy_type,
            "session_id": self.session_id
        } 