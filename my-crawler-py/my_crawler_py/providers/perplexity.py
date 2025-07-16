#!/usr/bin/env python3
"""
Perplexity Provider Implementation
AI-powered content analysis and web search capabilities.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional, List
from .base import CrawlerProvider, CrawlRequest, CrawlResponse, ProviderType


class PerplexityProvider(CrawlerProvider):
    """Perplexity API provider for AI-powered content analysis."""
    
    def __init__(self, api_key: str, model: str = "llama-3.1-sonar-small-128k-online", **kwargs):
        super().__init__(api_key=api_key, **kwargs)
        self.base_url = "https://api.perplexity.ai"
        self.model = model
        self.session = None
    
    def _get_provider_type(self) -> ProviderType:
        return ProviderType.PERPLEXITY
    
    def _get_capabilities(self) -> Dict[str, bool]:
        return {
            "javascript": False,  # Perplexity doesn't execute JS
            "screenshots": False,
            "pdf": False,
            "proxy_rotation": False,
            "anti_bot": True,  # Built-in anti-bot protection
            "geolocation": False,
            "batch_processing": False,  # Not supported by Perplexity
            "ai_integration": True,  # Primary capability
            "web_search": True,
            "content_analysis": True,
            "summarization": True
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
        """Fetch content using Perplexity API with AI analysis."""
        await self.validate_request(request)
        
        session = await self._get_session()
        
        # Prepare Perplexity API payload for web search and analysis
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a web content analyzer. Extract and analyze the content from the provided URL. Provide structured information including title, main content, key insights, and metadata."
                },
                {
                    "role": "user",
                    "content": f"Analyze the content from this URL: {request.url}. Provide a comprehensive analysis including the main content, key information, and any notable features."
                }
            ],
            "max_tokens": 4000,
            "temperature": 0.1,
            "top_p": 0.9,
            "search_domain": "web"
        }
        
        try:
            async with session.post(f"{self.base_url}/chat/completions", json=payload) as response:
                data = await response.json()
                
                if response.status != 200:
                    return CrawlResponse(
                        url=request.url,
                        status_code=response.status,
                        content="",
                        headers={},
                        cookies={},
                        metadata={},
                        error=f"Perplexity API error: {data.get('error', {}).get('message', 'Unknown error')}",
                        provider=self.provider_type
                    )
                
                # Extract AI analysis from response
                ai_content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                # Get usage information
                usage = data.get("usage", {})
                
                return CrawlResponse(
                    url=request.url,
                    status_code=200,
                    content=ai_content,
                    headers={"Content-Type": "application/json"},
                    cookies={},
                    metadata={
                        "model": self.model,
                        "tokens_used": usage.get("total_tokens", 0),
                        "prompt_tokens": usage.get("prompt_tokens", 0),
                        "completion_tokens": usage.get("completion_tokens", 0),
                        "ai_analysis": True,
                        "search_domain": "web"
                    },
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
                error=f"Perplexity request failed: {str(e)}",
                provider=self.provider_type
            )
    
    async def batch_fetch(self, requests: List[CrawlRequest]) -> List[CrawlResponse]:
        """Fetch multiple URLs in batch using Perplexity (sequential due to API limitations)."""
        # Perplexity doesn't support true batch processing, so we'll process sequentially
        # but with rate limiting to avoid hitting API limits
        results = []
        
        for request in requests:
            # Add delay between requests to respect rate limits
            if results:  # Skip delay for first request
                await asyncio.sleep(1)  # 1 second delay between requests
            
            result = await self.fetch(request)
            results.append(result)
        
        return results
    
    async def search_and_analyze(self, query: str, focus_url: Optional[str] = None) -> CrawlResponse:
        """Perform web search and AI analysis on a query."""
        session = await self._get_session()
        
        # Prepare search payload
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a web search and analysis assistant. Search the web for the given query and provide comprehensive, accurate information."
                },
                {
                    "role": "user",
                    "content": query
                }
            ],
            "max_tokens": 4000,
            "temperature": 0.1,
            "top_p": 0.9,
            "search_domain": "web"
        }
        
        # Add focus URL if provided
        if focus_url:
            payload["messages"][1]["content"] += f"\n\nFocus on information from: {focus_url}"
        
        try:
            async with session.post(f"{self.base_url}/chat/completions", json=payload) as response:
                data = await response.json()
                
                if response.status != 200:
                    return CrawlResponse(
                        url=f"search:{query}",
                        status_code=response.status,
                        content="",
                        headers={},
                        cookies={},
                        metadata={},
                        error=f"Perplexity search error: {data.get('error', {}).get('message', 'Unknown error')}",
                        provider=self.provider_type
                    )
                
                # Extract AI analysis from response
                ai_content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                # Get usage information
                usage = data.get("usage", {})
                
                return CrawlResponse(
                    url=f"search:{query}",
                    status_code=200,
                    content=ai_content,
                    headers={"Content-Type": "application/json"},
                    cookies={},
                    metadata={
                        "model": self.model,
                        "tokens_used": usage.get("total_tokens", 0),
                        "prompt_tokens": usage.get("prompt_tokens", 0),
                        "completion_tokens": usage.get("completion_tokens", 0),
                        "ai_analysis": True,
                        "search_query": query,
                        "focus_url": focus_url,
                        "search_domain": "web"
                    },
                    provider=self.provider_type
                )
                
        except Exception as e:
            return CrawlResponse(
                url=f"search:{query}",
                status_code=0,
                content="",
                headers={},
                cookies={},
                metadata={},
                error=f"Perplexity search failed: {str(e)}",
                provider=self.provider_type
            )
    
    def get_cost_estimate(self, request: CrawlRequest) -> float:
        """Estimate cost for Perplexity request."""
        # Perplexity pricing: $15 per 1000 requests
        base_cost = 0.015  # Cost per request
        
        # Additional cost for longer responses (more tokens)
        estimated_tokens = 2000  # Conservative estimate
        token_cost = (estimated_tokens / 1000) * 0.005  # $0.005 per 1000 tokens
        
        return base_cost + token_cost
    
    def get_rate_limits(self) -> Dict[str, Any]:
        """Get Perplexity rate limits."""
        return {
            "requests_per_minute": 10,  # Conservative limit
            "requests_per_hour": 500,
            "requests_per_day": 10000,
            "concurrent_requests": 1,  # Sequential processing recommended
            "cost_per_request": 0.015,
            "max_tokens_per_request": 4000
        }
    
    async def health_check(self) -> bool:
        """Check Perplexity API health."""
        try:
            session = await self._get_session()
            # Simple test query
            test_payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": "Hello"}],
                "max_tokens": 10
            }
            async with session.post(f"{self.base_url}/chat/completions", json=test_payload) as response:
                return response.status == 200
        except Exception:
            return False
    
    async def close(self):
        """Close the aiohttp session."""
        if self.session and not self.session.closed:
            await self.session.close() 