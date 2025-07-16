#!/usr/bin/env python3
"""
Abstract Base Class for Crawler Providers
Defines the interface that all crawling providers must implement.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum


class ProviderType(Enum):
    """Supported provider types."""
    SCRAPFLY = "scrapfly"
    PLAYWRIGHT = "playwright"
    PERPLEXITY = "perplexity"
    BRIGHTDATA = "brightdata"


@dataclass
class CrawlRequest:
    """Standardized crawl request."""
    url: str
    provider: ProviderType
    options: Dict[str, Any]
    user_agent: Optional[str] = None
    proxy: Optional[str] = None
    timeout: int = 30
    retry_count: int = 3
    headers: Optional[Dict[str, str]] = None
    cookies: Optional[Dict[str, str]] = None
    javascript: bool = True
    wait_for: Optional[str] = None
    screenshot: bool = False
    pdf: bool = False


@dataclass
class CrawlResponse:
    """Standardized crawl response."""
    url: str
    status_code: int
    content: str
    headers: Dict[str, str]
    cookies: Dict[str, str]
    metadata: Dict[str, Any]
    screenshot: Optional[bytes] = None
    pdf: Optional[bytes] = None
    error: Optional[str] = None
    provider: ProviderType = None
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc)


class CrawlerProvider(ABC):
    """Abstract base class for all crawler providers."""
    
    def __init__(self, api_key: Optional[str] = None, **kwargs):
        self.api_key = api_key
        self.config = kwargs
        self.provider_type = self._get_provider_type()
    
    @abstractmethod
    def _get_provider_type(self) -> ProviderType:
        """Return the provider type."""
        pass
    
    @abstractmethod
    async def fetch(self, request: CrawlRequest) -> CrawlResponse:
        """Fetch content from the given URL."""
        pass
    
    @abstractmethod
    async def batch_fetch(self, requests: List[CrawlRequest]) -> List[CrawlResponse]:
        """Fetch multiple URLs in batch."""
        pass
    
    @abstractmethod
    def get_cost_estimate(self, request: CrawlRequest) -> float:
        """Estimate the cost for this request."""
        pass
    
    @abstractmethod
    def get_rate_limits(self) -> Dict[str, Any]:
        """Get current rate limits and quotas."""
        pass
    
    async def validate_request(self, request: CrawlRequest) -> bool:
        """Validate if the request can be processed."""
        # Basic validation - can be overridden by providers
        if not request.url or not request.url.startswith(('http://', 'https://')):
            raise ValueError("Invalid URL provided")
        return True
    
    def get_provider_info(self) -> Dict[str, Any]:
        """Get provider information and capabilities."""
        return {
            "type": self.provider_type.value,
            "name": self.__class__.__name__,
            "capabilities": self._get_capabilities(),
            "rate_limits": self.get_rate_limits()
        }
    
    @abstractmethod
    def _get_capabilities(self) -> Dict[str, bool]:
        """Get provider capabilities."""
        pass
    
    async def health_check(self) -> bool:
        """Check if the provider is healthy and available."""
        try:
            # Simple health check - can be overridden
            return True
        except Exception:
            return False 