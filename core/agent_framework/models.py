"""
NAVACLAW-AI — Multi-Model LLM Router
Ported from Agent Zero's models.py.
Author: Frank Van Laarhoven

Supports:
- Multiple LLM providers via litellm (OpenAI, Anthropic, Google, Ollama, etc.)
- Rate limiting with API key round-robin
- Streaming with reasoning/thinking tag processing
- Separate model configs for chat, utility, browser, embeddings
"""

import asyncio
import logging
import os
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Awaitable, Callable, Dict, List, Optional

logger = logging.getLogger("navaclaw.models")


# ─── Model Configuration ─────────────────────────────────────────

class ModelType(Enum):
    CHAT = "chat"
    EMBEDDING = "embedding"
    BROWSER = "browser"
    UTILITY = "utility"


@dataclass
class ModelConfig:
    """Configuration for a single model endpoint."""
    name: str
    provider: str = "openai"
    model_type: ModelType = ModelType.CHAT
    api_base: str = ""
    ctx_length: int = 128000
    limit_requests: int = 0
    limit_input: int = 0
    limit_output: int = 0
    vision: bool = False
    kwargs: Dict[str, Any] = field(default_factory=dict)
    
    def build_kwargs(self) -> dict:
        """Build kwargs for the LLM provider."""
        kw = dict(self.kwargs)
        if self.api_base:
            kw["api_base"] = self.api_base
        api_key = self._get_api_key()
        if api_key:
            kw["api_key"] = api_key
        return kw
    
    def _get_api_key(self) -> Optional[str]:
        """Get API key from environment, supporting round-robin for multiple keys."""
        env_map = {
            "openai": "OPENAI_API_KEY",
            "anthropic": "ANTHROPIC_API_KEY",
            "google": "GOOGLE_API_KEY",
            "groq": "GROQ_API_KEY",
            "together": "TOGETHER_API_KEY",
            "openrouter": "OPENROUTER_API_KEY",
            "deepseek": "DEEPSEEK_API_KEY",
            "mistral": "MISTRAL_API_KEY",
        }
        env_name = env_map.get(self.provider.lower(), f"{self.provider.upper()}_API_KEY")
        keys_str = os.environ.get(env_name, "")
        if not keys_str:
            return None
        
        # Support comma-separated keys for round-robin
        keys = [k.strip() for k in keys_str.split(",") if k.strip()]
        if not keys:
            return None
        
        # Round-robin selection
        idx = _api_key_counters.get(env_name, 0) % len(keys)
        _api_key_counters[env_name] = idx + 1
        return keys[idx]

    @property
    def full_name(self) -> str:
        """Provider/Model identifier for litellm."""
        if self.provider.lower() in ("openai", ""):
            return self.name
        return f"{self.provider}/{self.name}"


# Round-robin counters
_api_key_counters: Dict[str, int] = {}


# ─── Rate Limiter ─────────────────────────────────────────────────

class RateLimiter:
    """Token bucket rate limiter per model endpoint."""
    
    def __init__(self, requests_per_min: int = 0, input_per_min: int = 0, output_per_min: int = 0):
        self.requests_per_min = requests_per_min
        self.input_per_min = input_per_min
        self.output_per_min = output_per_min
        self._request_count = 0
        self._last_reset = asyncio.get_event_loop().time() if asyncio.get_event_loop().is_running() else 0
    
    async def acquire(self) -> None:
        """Wait if rate limit would be exceeded."""
        if self.requests_per_min <= 0:
            return
        
        now = asyncio.get_event_loop().time()
        if now - self._last_reset >= 60:
            self._request_count = 0
            self._last_reset = now
        
        if self._request_count >= self.requests_per_min:
            wait_time = 60 - (now - self._last_reset)
            if wait_time > 0:
                logger.info(f"Rate limited, waiting {wait_time:.1f}s")
                await asyncio.sleep(wait_time)
                self._request_count = 0
                self._last_reset = asyncio.get_event_loop().time()
        
        self._request_count += 1


_rate_limiters: Dict[str, RateLimiter] = {}


def get_rate_limiter(config: ModelConfig) -> RateLimiter:
    key = f"{config.provider}:{config.name}"
    if key not in _rate_limiters:
        _rate_limiters[key] = RateLimiter(
            requests_per_min=config.limit_requests,
            input_per_min=config.limit_input,
            output_per_min=config.limit_output,
        )
    return _rate_limiters[key]


# ─── Chat Generation Result ──────────────────────────────────────

class ChatResult:
    """Accumulated streaming response with thinking tag processing."""
    
    THINKING_TAGS = [
        ("<think>", "</think>"),
        ("<thinking>", "</thinking>"),
        ("<reasoning>", "</reasoning>"),
    ]
    
    def __init__(self):
        self.response = ""
        self.reasoning = ""
        self.is_thinking = False
        self._buffer = ""
    
    def add_chunk(self, response_delta: str = "", reasoning_delta: str = "") -> None:
        """Process a streaming chunk, detecting thinking tags."""
        if reasoning_delta:
            self.reasoning += reasoning_delta
            return
        
        if not response_delta:
            return
        
        self._buffer += response_delta
        self._process_thinking_tags()
    
    def _process_thinking_tags(self) -> None:
        """Detect and separate thinking content from response content."""
        text = self._buffer
        
        for open_tag, close_tag in self.THINKING_TAGS:
            if open_tag in text:
                before, _, after = text.partition(open_tag)
                self.response += before
                
                if close_tag in after:
                    thinking, _, remaining = after.partition(close_tag)
                    self.reasoning += thinking
                    self._buffer = remaining
                    self.is_thinking = False
                    return
                else:
                    self.reasoning += after
                    self._buffer = ""
                    self.is_thinking = True
                    return
            
            if self.is_thinking:
                if close_tag in text:
                    thinking, _, remaining = text.partition(close_tag)
                    self.reasoning += thinking
                    self._buffer = remaining
                    self.is_thinking = False
                    return
                else:
                    self.reasoning += text
                    self._buffer = ""
                    return
        
        # No thinking tags — everything is response
        self.response += self._buffer
        self._buffer = ""
    
    def finalize(self) -> tuple:
        """Finalize and return (response, reasoning)."""
        if self._buffer:
            if self.is_thinking:
                self.reasoning += self._buffer
            else:
                self.response += self._buffer
            self._buffer = ""
        return self.response.strip(), self.reasoning.strip()


# ─── LLM Router ──────────────────────────────────────────────────

class LLMRouter:
    """
    Universal LLM router using litellm.
    Handles provider abstraction, rate limiting, streaming, and error recovery.
    """
    
    def __init__(self, config: ModelConfig):
        self.config = config
        self.rate_limiter = get_rate_limiter(config)
    
    async def chat(
        self,
        messages: List[dict],
        stream: bool = True,
        response_callback: Optional[Callable[[str, str], Awaitable[None]]] = None,
        reasoning_callback: Optional[Callable[[str, str], Awaitable[None]]] = None,
    ) -> str:
        """
        Send messages to the configured LLM and return the response.
        Supports streaming with optional callbacks for response and reasoning.
        """
        try:
            import litellm
        except ImportError:
            logger.warning("litellm not installed — using stub response")
            return self._stub_response(messages)
        
        await self.rate_limiter.acquire()
        
        kwargs = self.config.build_kwargs()
        model_name = self.config.full_name
        
        result = ChatResult()
        
        try:
            if stream:
                response = await litellm.acompletion(
                    model=model_name,
                    messages=messages,
                    stream=True,
                    **kwargs,
                )
                
                async for chunk in response:
                    delta = chunk.choices[0].delta if chunk.choices else None
                    if delta:
                        content = getattr(delta, "content", "") or ""
                        reasoning = getattr(delta, "reasoning_content", "") or ""
                        
                        result.add_chunk(response_delta=content, reasoning_delta=reasoning)
                        
                        if content and response_callback:
                            await response_callback(content, result.response)
                        if reasoning and reasoning_callback:
                            await reasoning_callback(reasoning, result.reasoning)
            else:
                response = await litellm.acompletion(
                    model=model_name,
                    messages=messages,
                    stream=False,
                    **kwargs,
                )
                content = response.choices[0].message.content or ""
                result.add_chunk(response_delta=content)
            
            final_response, final_reasoning = result.finalize()
            return final_response
            
        except Exception as e:
            logger.error(f"LLM call failed: {e}", exc_info=True)
            raise
    
    def _stub_response(self, messages: List[dict]) -> str:
        """Stub for when litellm isn't available (development mode)."""
        last_user = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"),
            "No message",
        )
        return f"[NAVACLAW-AI Stub] Received: {last_user[:100]}"
    
    async def embed(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts."""
        try:
            import litellm
            response = await litellm.aembedding(
                model=self.config.full_name,
                input=texts,
                **self.config.build_kwargs(),
            )
            return [d["embedding"] for d in response.data]
        except ImportError:
            logger.warning("litellm not installed — returning zero embeddings")
            return [[0.0] * 384 for _ in texts]
        except Exception as e:
            logger.error(f"Embedding failed: {e}", exc_info=True)
            raise
