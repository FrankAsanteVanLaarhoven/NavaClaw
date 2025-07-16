#!/usr/bin/env python3
"""
Advanced Proxy Manager
Provides Bright Data-like capabilities with proxy rotation, session management, and anti-detection.
"""

import asyncio
import random
import time
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
import logging
from enum import Enum
import json
from pathlib import Path

logger = logging.getLogger(__name__)

class ProxyType(Enum):
    """Supported proxy types."""
    DATACENTER = "datacenter"
    RESIDENTIAL = "residential"
    ISP = "isp"
    MOBILE = "mobile"
    ROTATING = "rotating"

class ProxyStatus(Enum):
    """Proxy status."""
    ACTIVE = "active"
    FAILED = "failed"
    RATE_LIMITED = "rate_limited"
    BLOCKED = "blocked"
    UNKNOWN = "unknown"

@dataclass
class ProxyConfig:
    """Proxy configuration."""
    host: str
    port: int
    username: str
    password: str
    proxy_type: ProxyType
    country: str = "us"
    city: Optional[str] = None
    session_id: Optional[str] = None
    max_requests: int = 1000
    timeout: int = 30
    retry_count: int = 3

@dataclass
class ProxySession:
    """Proxy session information."""
    session_id: str
    proxy_config: ProxyConfig
    created_at: datetime
    request_count: int = 0
    last_used: Optional[datetime] = None
    status: ProxyStatus = ProxyStatus.ACTIVE
    success_rate: float = 1.0
    avg_response_time: float = 0.0

class ProxyManager:
    """Advanced proxy manager with Bright Data-like capabilities."""
    
    def __init__(self, 
                 config_file: Optional[str] = None,
                 max_sessions: int = 100,
                 session_timeout: int = 3600,
                 rotation_strategy: str = "round_robin"):
        self.config_file = config_file
        self.max_sessions = max_sessions
        self.session_timeout = session_timeout
        self.rotation_strategy = rotation_strategy
        
        # Session management
        self.sessions: Dict[str, ProxySession] = {}
        self.active_sessions: List[str] = []
        self.failed_sessions: List[str] = []
        
        # Proxy pools by type and location
        self.proxy_pools: Dict[str, List[ProxyConfig]] = {
            "datacenter": [],
            "residential": [],
            "isp": [],
            "mobile": [],
            "rotating": []
        }
        
        # Statistics
        self.stats = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "proxy_rotations": 0,
            "session_creations": 0
        }
        
        # Load configuration
        if config_file:
            self.load_config(config_file)
    
    def load_config(self, config_file: str):
        """Load proxy configuration from file."""
        try:
            with open(config_file, 'r') as f:
                config_data = json.load(f)
            
            # Load proxy pools
            for proxy_type, proxies in config_data.get("proxy_pools", {}).items():
                for proxy_config in proxies:
                    config = ProxyConfig(
                        host=proxy_config["host"],
                        port=proxy_config["port"],
                        username=proxy_config["username"],
                        password=proxy_config["password"],
                        proxy_type=ProxyType(proxy_config["type"]),
                        country=proxy_config.get("country", "us"),
                        city=proxy_config.get("city"),
                        max_requests=proxy_config.get("max_requests", 1000),
                        timeout=proxy_config.get("timeout", 30)
                    )
                    self.proxy_pools[proxy_type].append(config)
            
            logger.info(f"Loaded {sum(len(pool) for pool in self.proxy_pools.values())} proxy configurations")
            
        except Exception as e:
            logger.error(f"Failed to load proxy config: {e}")
    
    def add_proxy_config(self, config: ProxyConfig):
        """Add a proxy configuration to the appropriate pool."""
        self.proxy_pools[config.proxy_type.value].append(config)
        logger.info(f"Added {config.proxy_type.value} proxy for {config.country}")
    
    async def create_session(self, 
                           proxy_type: ProxyType = ProxyType.DATACENTER,
                           country: str = "us",
                           city: Optional[str] = None,
                           session_id: Optional[str] = None) -> ProxySession:
        """Create a new proxy session."""
        if len(self.sessions) >= self.max_sessions:
            await self._cleanup_old_sessions()
        
        # Handle string proxy type
        if isinstance(proxy_type, str):
            proxy_type_str = proxy_type
        else:
            proxy_type_str = proxy_type.value
        
        # Ensure the proxy type exists in the pools
        if proxy_type_str not in self.proxy_pools:
            logger.warning(f"Proxy type '{proxy_type_str}' not found in pools, adding empty pool")
            self.proxy_pools[proxy_type_str] = []
        
        # Find available proxy config
        available_configs = [
            config for config in self.proxy_pools[proxy_type_str]
            if config.country == country and (not city or config.city == city)
        ]
        
        if not available_configs:
            # Fallback to any proxy of the requested type
            available_configs = self.proxy_pools[proxy_type_str]
        
        if not available_configs:
            # Create a default config if none exist
            if isinstance(proxy_type, str):
                try:
                    default_proxy_type = ProxyType(proxy_type)
                except ValueError:
                    # If the proxy type string is not a valid enum value, use DATACENTER as fallback
                    default_proxy_type = ProxyType.DATACENTER
            else:
                default_proxy_type = proxy_type
                
            default_config = ProxyConfig(
                host="default-proxy.com",
                port=8080,
                username="default_user",
                password="default_pass",
                proxy_type=default_proxy_type,
                country=country,
                city=city,
                max_requests=1000
            )
            available_configs = [default_config]
        
        # Select proxy config
        config = random.choice(available_configs)
        
        # Generate session ID
        if not session_id:
            if isinstance(proxy_type, str):
                session_id = f"{proxy_type}_{country}_{int(time.time())}_{random.randint(1000, 9999)}"
            else:
                session_id = f"{proxy_type.value}_{country}_{int(time.time())}_{random.randint(1000, 9999)}"
        
        # Create session
        session = ProxySession(
            session_id=session_id,
            proxy_config=config,
            created_at=datetime.now(timezone.utc)
        )
        
        self.sessions[session_id] = session
        self.active_sessions.append(session_id)
        self.stats["session_creations"] += 1
        
        if isinstance(proxy_type, str):
            logger.info(f"Created session {session_id} with {proxy_type} proxy")
        else:
            logger.info(f"Created session {session_id} with {proxy_type.value} proxy")
        return session
    
    async def get_session(self, 
                         proxy_type: ProxyType = ProxyType.DATACENTER,
                         country: str = "us",
                         city: Optional[str] = None,
                         force_new: bool = False) -> ProxySession:
        """Get an available session."""
        if force_new:
            return await self.create_session(proxy_type, country, city)
        
        # Find existing active session
        for session_id in self.active_sessions:
            session = self.sessions[session_id]
            if (session.proxy_config.proxy_type == proxy_type and
                session.proxy_config.country == country and
                (not city or session.proxy_config.city == city) and
                session.status == ProxyStatus.ACTIVE and
                session.request_count < session.proxy_config.max_requests):
                return session
        
        # Create new session if none available
        return await self.create_session(proxy_type, country, city)
    
    async def rotate_session(self, session_id: str) -> ProxySession:
        """Rotate to a new session."""
        old_session = self.sessions.get(session_id)
        if not old_session:
            raise ValueError(f"Session {session_id} not found")
        
        # Create new session with same parameters
        new_session = await self.create_session(
            proxy_type=old_session.proxy_config.proxy_type,
            country=old_session.proxy_config.country,
            city=old_session.proxy_config.city
        )
        
        # Mark old session as inactive
        old_session.status = ProxyStatus.FAILED
        if session_id in self.active_sessions:
            self.active_sessions.remove(session_id)
        
        self.stats["proxy_rotations"] += 1
        logger.info(f"Rotated from session {session_id} to {new_session.session_id}")
        
        return new_session
    
    async def update_session_status(self, session_id: str, success: bool, response_time: float):
        """Update session statistics."""
        session = self.sessions.get(session_id)
        if not session:
            return
        
        session.request_count += 1
        session.last_used = datetime.now(timezone.utc)
        
        # Update statistics
        self.stats["total_requests"] += 1
        if success:
            self.stats["successful_requests"] += 1
        else:
            self.stats["failed_requests"] += 1
        
        # Update session success rate
        if session.request_count == 1:
            session.success_rate = 1.0 if success else 0.0
            session.avg_response_time = response_time
        else:
            # Exponential moving average
            alpha = 0.1
            session.success_rate = (alpha * (1.0 if success else 0.0) + 
                                  (1 - alpha) * session.success_rate)
            session.avg_response_time = (alpha * response_time + 
                                       (1 - alpha) * session.avg_response_time)
        
        # Check if session should be marked as failed
        if session.success_rate < 0.5 and session.request_count > 10:
            session.status = ProxyStatus.FAILED
            if session_id in self.active_sessions:
                self.active_sessions.remove(session_id)
                self.failed_sessions.append(session_id)
            logger.warning(f"Session {session_id} marked as failed (success rate: {session.success_rate:.2f})")
    
    async def _cleanup_old_sessions(self):
        """Clean up old sessions."""
        current_time = datetime.now(timezone.utc)
        sessions_to_remove = []
        
        for session_id, session in self.sessions.items():
            # Remove sessions older than timeout
            if (current_time - session.created_at).total_seconds() > self.session_timeout:
                sessions_to_remove.append(session_id)
            # Remove failed sessions older than 1 hour
            elif (session.status == ProxyStatus.FAILED and 
                  (current_time - session.last_used).total_seconds() > 3600):
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.sessions[session_id]
            if session_id in self.active_sessions:
                self.active_sessions.remove(session_id)
            if session_id in self.failed_sessions:
                self.failed_sessions.remove(session_id)
        
        if sessions_to_remove:
            logger.info(f"Cleaned up {len(sessions_to_remove)} old sessions")
    
    def get_session_info(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed session information."""
        session = self.sessions.get(session_id)
        if not session:
            return None
        
        return {
            "session_id": session.session_id,
            "proxy_type": session.proxy_config.proxy_type.value,
            "country": session.proxy_config.country,
            "city": session.proxy_config.city,
            "created_at": session.created_at.isoformat(),
            "last_used": session.last_used.isoformat() if session.last_used else None,
            "request_count": session.request_count,
            "status": session.status.value,
            "success_rate": session.success_rate,
            "avg_response_time": session.avg_response_time
        }
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get proxy manager statistics."""
        return {
            **self.stats,
            "active_sessions": len(self.active_sessions),
            "total_sessions": len(self.sessions),
            "failed_sessions": len(self.failed_sessions),
            "proxy_pools": {
                proxy_type: len(configs) for proxy_type, configs in self.proxy_pools.items()
            }
        }
    
    async def health_check(self) -> Dict[str, bool]:
        """Check health of all active sessions."""
        health_status = {}
        
        for session_id in self.active_sessions:
            session = self.sessions[session_id]
            health_status[session_id] = session.status == ProxyStatus.ACTIVE
        
        return health_status
    
    def export_config(self, output_file: str):
        """Export current configuration to file."""
        config_data = {
            "proxy_pools": {
                proxy_type: [
                    {
                        "host": config.host,
                        "port": config.port,
                        "username": config.username,
                        "password": config.password,
                        "type": config.proxy_type.value,
                        "country": config.country,
                        "city": config.city,
                        "max_requests": config.max_requests,
                        "timeout": config.timeout
                    }
                    for config in configs
                ]
                for proxy_type, configs in self.proxy_pools.items()
            },
            "statistics": self.get_statistics()
        }
        
        with open(output_file, 'w') as f:
            json.dump(config_data, f, indent=2)
        
        logger.info(f"Exported configuration to {output_file}")

# Global proxy manager instance
proxy_manager = ProxyManager()

async def get_proxy_session(proxy_type: ProxyType = ProxyType.DATACENTER,
                           country: str = "us",
                           city: Optional[str] = None) -> ProxySession:
    """Get a proxy session using the global manager."""
    return await proxy_manager.get_session(proxy_type, country, city)

async def rotate_proxy_session(session_id: str) -> ProxySession:
    """Rotate a proxy session using the global manager."""
    return await proxy_manager.rotate_session(session_id) 