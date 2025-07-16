#!/usr/bin/env python3
"""
Provider Factory
Manages different crawling providers and their configurations.
"""

from typing import Dict, Any, Optional
from .base import CrawlerProvider, ProviderType
from .scrapfly import ScrapFlyProvider
from .playwright import PlaywrightProvider
from .perplexity import PerplexityProvider
from .brightdata import BrightDataProvider


class ProviderFactory:
    """Factory for creating and managing crawler providers."""
    
    def __init__(self):
        self._providers: Dict[str, CrawlerProvider] = {}
        self._configs: Dict[str, Dict[str, Any]] = {}
    
    def register_provider(self, name: str, provider: CrawlerProvider, config: Dict[str, Any] = None):
        """Register a provider with optional configuration."""
        self._providers[name] = provider
        self._configs[name] = config or {}
    
    def get_provider(self, name: str) -> Optional[CrawlerProvider]:
        """Get a registered provider by name."""
        return self._providers.get(name)
    
    def create_provider(self, provider_type: ProviderType, **kwargs) -> CrawlerProvider:
        """Create a new provider instance."""
        if provider_type == ProviderType.SCRAPFLY:
            api_key = kwargs.get("api_key")
            if not api_key:
                raise ValueError("ScrapFly provider requires api_key")
            return ScrapFlyProvider(api_key=api_key, **kwargs)
        
        elif provider_type == ProviderType.PLAYWRIGHT:
            return PlaywrightProvider(**kwargs)
        
        elif provider_type == ProviderType.PERPLEXITY:
            api_key = kwargs.get("api_key")
            if not api_key:
                raise ValueError("Perplexity provider requires api_key")
            return PerplexityProvider(api_key=api_key, **kwargs)
        
        elif provider_type == ProviderType.BRIGHTDATA:
            username = kwargs.get("username")
            password = kwargs.get("password")
            if not username or not password:
                raise ValueError("Bright Data provider requires username and password")
            return BrightDataProvider(username=username, password=password, **kwargs)
        
        else:
            raise ValueError(f"Unsupported provider type: {provider_type}")
    
    def get_provider_info(self, name: str) -> Dict[str, Any]:
        """Get information about a registered provider."""
        provider = self._providers.get(name)
        if not provider:
            return {}
        
        return {
            "name": name,
            "type": provider.provider_type.value,
            "capabilities": provider._get_capabilities(),
            "rate_limits": provider.get_rate_limits(),
            "config": self._configs.get(name, {})
        }
    
    def list_providers(self) -> Dict[str, Dict[str, Any]]:
        """List all registered providers with their information."""
        return {
            name: self.get_provider_info(name)
            for name in self._providers.keys()
        }
    
    def get_best_provider(self, requirements: Dict[str, Any]) -> Optional[str]:
        """Get the best provider based on requirements."""
        best_provider = None
        best_score = 0
        
        for name, provider in self._providers.items():
            score = self._calculate_provider_score(provider, requirements)
            if score > best_score:
                best_score = score
                best_provider = name
        
        return best_provider
    
    def _calculate_provider_score(self, provider: CrawlerProvider, requirements: Dict[str, Any]) -> float:
        """Calculate how well a provider matches the requirements."""
        score = 0
        capabilities = provider._get_capabilities()
        
        # Check capability requirements
        if requirements.get("javascript") and capabilities.get("javascript"):
            score += 10
        if requirements.get("screenshots") and capabilities.get("screenshots"):
            score += 5
        if requirements.get("ai_integration") and capabilities.get("ai_integration"):
            score += 15
        if requirements.get("anti_bot") and capabilities.get("anti_bot"):
            score += 8
        if requirements.get("batch_processing") and capabilities.get("batch_processing"):
            score += 5
        
        # Check cost requirements
        max_cost = requirements.get("max_cost_per_request")
        if max_cost:
            rate_limits = provider.get_rate_limits()
            cost_per_request = rate_limits.get("cost_per_request", float('inf'))
            if cost_per_request <= max_cost:
                score += 10
            else:
                score -= 20  # Penalty for expensive providers
        
        # Check rate limit requirements
        min_requests_per_minute = requirements.get("min_requests_per_minute")
        if min_requests_per_minute:
            rate_limits = provider.get_rate_limits()
            requests_per_minute = rate_limits.get("requests_per_minute", 0)
            if requests_per_minute >= min_requests_per_minute:
                score += 5
            else:
                score -= 10
        
        return score
    
    async def health_check_all(self) -> Dict[str, bool]:
        """Check health of all registered providers."""
        health_status = {}
        
        for name, provider in self._providers.items():
            try:
                health_status[name] = await provider.health_check()
            except Exception:
                health_status[name] = False
        
        return health_status
    
    async def close_all(self):
        """Close all registered providers."""
        for provider in self._providers.values():
            try:
                await provider.close()
            except Exception:
                pass  # Ignore errors during cleanup


# Global provider factory instance
provider_factory = ProviderFactory()


def get_provider(name: str) -> Optional[CrawlerProvider]:
    """Get a provider by name from the global factory."""
    return provider_factory.get_provider(name)


def create_provider(provider_type: ProviderType, **kwargs) -> CrawlerProvider:
    """Create a new provider instance using the global factory."""
    return provider_factory.create_provider(provider_type, **kwargs)


def register_provider(name: str, provider: CrawlerProvider, config: Dict[str, Any] = None):
    """Register a provider with the global factory."""
    provider_factory.register_provider(name, provider, config)


def get_best_provider(requirements: Dict[str, Any]) -> Optional[str]:
    """Get the best provider based on requirements using the global factory."""
    return provider_factory.get_best_provider(requirements)


async def health_check_all() -> Dict[str, bool]:
    """Check health of all providers using the global factory."""
    return await provider_factory.health_check_all()


async def close_all_providers():
    """Close all providers using the global factory."""
    await provider_factory.close_all() 