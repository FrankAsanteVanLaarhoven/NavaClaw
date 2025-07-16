#!/usr/bin/env python3
"""
Advanced Anti-Detection System
Provides Bright Data-like stealth capabilities with browser fingerprinting and behavioral patterns.
"""

import asyncio
import random
import time
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from datetime import datetime, timezone
import logging
import json
import hashlib
from pathlib import Path
import platform
import subprocess
import re

logger = logging.getLogger(__name__)

@dataclass
class BrowserProfile:
    """Browser profile for anti-detection."""
    user_agent: str
    screen_resolution: Tuple[int, int]
    color_depth: int
    timezone: str
    language: str
    platform: str
    webgl_vendor: str
    webgl_renderer: str
    canvas_fingerprint: str
    audio_fingerprint: str
    fonts: List[str]
    plugins: List[str]
    mime_types: List[str]
    hardware_concurrency: int
    device_memory: int
    connection_type: str
    battery_level: Optional[float] = None
    battery_charging: Optional[bool] = None

@dataclass
class BehavioralPattern:
    """Behavioral pattern for human-like interaction."""
    mouse_movement_pattern: List[Tuple[int, int]]
    scroll_pattern: List[int]
    click_pattern: List[Tuple[int, int]]
    typing_speed: Tuple[float, float]  # (min_delay, max_delay)
    page_load_wait: Tuple[float, float]  # (min_wait, max_wait)
    session_duration: Tuple[float, float]  # (min_duration, max_duration)

class AntiDetectionManager:
    """Advanced anti-detection manager with Bright Data-like capabilities."""
    
    def __init__(self, profiles_file: Optional[str] = None):
        self.profiles_file = profiles_file
        self.browser_profiles: Dict[str, BrowserProfile] = {}
        self.behavioral_patterns: Dict[str, BehavioralPattern] = {}
        self.current_session: Optional[str] = None
        self.session_start_time: Optional[datetime] = None
        
        # Load profiles
        if profiles_file:
            self.load_profiles(profiles_file)
        else:
            self._generate_default_profiles()
    
    def _generate_default_profiles(self):
        """Generate default browser profiles."""
        profiles = {
            "chrome_windows": BrowserProfile(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                screen_resolution=(1920, 1080),
                color_depth=24,
                timezone="America/New_York",
                language="en-US,en;q=0.9",
                platform="Win32",
                webgl_vendor="Google Inc. (Intel)",
                webgl_renderer="ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)",
                canvas_fingerprint="canvas_fingerprint_1",
                audio_fingerprint="audio_fingerprint_1",
                fonts=["Arial", "Calibri", "Times New Roman", "Verdana"],
                plugins=["Chrome PDF Plugin", "Chrome PDF Viewer", "Native Client"],
                mime_types=["application/pdf", "application/x-google-chrome-pdf"],
                hardware_concurrency=8,
                device_memory=8,
                connection_type="4g"
            ),
            "chrome_mac": BrowserProfile(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                screen_resolution=(1440, 900),
                color_depth=24,
                timezone="America/Los_Angeles",
                language="en-US,en;q=0.9",
                platform="MacIntel",
                webgl_vendor="Apple Inc.",
                webgl_renderer="Apple M1 Pro",
                canvas_fingerprint="canvas_fingerprint_2",
                audio_fingerprint="audio_fingerprint_2",
                fonts=["Helvetica", "Arial", "Times", "Courier"],
                plugins=["Chrome PDF Plugin", "Chrome PDF Viewer", "Native Client"],
                mime_types=["application/pdf", "application/x-google-chrome-pdf"],
                hardware_concurrency=10,
                device_memory=16,
                connection_type="wifi"
            ),
            "firefox_windows": BrowserProfile(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                screen_resolution=(1920, 1080),
                color_depth=24,
                timezone="America/Chicago",
                language="en-US,en;q=0.5",
                platform="Win32",
                webgl_vendor="Mesa/X.org",
                webgl_renderer="Mesa Intel(R) UHD Graphics 620 (CFL GT2)",
                canvas_fingerprint="canvas_fingerprint_3",
                audio_fingerprint="audio_fingerprint_3",
                fonts=["Arial", "Calibri", "Times New Roman", "Verdana"],
                plugins=["PDF Viewer", "WebAuth"],
                mime_types=["application/pdf", "application/x-pdf"],
                hardware_concurrency=8,
                device_memory=8,
                connection_type="4g"
            )
        }
        
        self.browser_profiles.update(profiles)
        
        # Generate behavioral patterns
        self._generate_behavioral_patterns()
    
    def _generate_behavioral_patterns(self):
        """Generate behavioral patterns for human-like interaction."""
        patterns = {
            "casual_user": BehavioralPattern(
                mouse_movement_pattern=[(100, 200), (300, 150), (500, 300), (700, 250)],
                scroll_pattern=[100, 200, 150, 300, 100],
                click_pattern=[(200, 300), (400, 200), (600, 400)],
                typing_speed=(0.1, 0.3),
                page_load_wait=(2.0, 5.0),
                session_duration=(300.0, 900.0)  # 5-15 minutes
            ),
            "power_user": BehavioralPattern(
                mouse_movement_pattern=[(50, 100), (200, 50), (400, 200), (600, 150)],
                scroll_pattern=[200, 300, 250, 400, 200],
                click_pattern=[(150, 250), (350, 150), (550, 350)],
                typing_speed=(0.05, 0.15),
                page_load_wait=(1.0, 3.0),
                session_duration=(600.0, 1800.0)  # 10-30 minutes
            ),
            "mobile_user": BehavioralPattern(
                mouse_movement_pattern=[(50, 100), (150, 200), (250, 150)],
                scroll_pattern=[50, 100, 75, 150, 50],
                click_pattern=[(100, 200), (200, 150), (300, 250)],
                typing_speed=(0.2, 0.5),
                page_load_wait=(3.0, 8.0),
                session_duration=(120.0, 600.0)  # 2-10 minutes
            )
        }
        
        self.behavioral_patterns.update(patterns)
    
    def load_profiles(self, profiles_file: str):
        """Load browser profiles from file."""
        try:
            with open(profiles_file, 'r') as f:
                data = json.load(f)
            
            # Load browser profiles
            for name, profile_data in data.get("browser_profiles", {}).items():
                profile = BrowserProfile(
                    user_agent=profile_data["user_agent"],
                    screen_resolution=tuple(profile_data["screen_resolution"]),
                    color_depth=profile_data["color_depth"],
                    timezone=profile_data["timezone"],
                    language=profile_data["language"],
                    platform=profile_data["platform"],
                    webgl_vendor=profile_data["webgl_vendor"],
                    webgl_renderer=profile_data["webgl_renderer"],
                    canvas_fingerprint=profile_data["canvas_fingerprint"],
                    audio_fingerprint=profile_data["audio_fingerprint"],
                    fonts=profile_data["fonts"],
                    plugins=profile_data["plugins"],
                    mime_types=profile_data["mime_types"],
                    hardware_concurrency=profile_data["hardware_concurrency"],
                    device_memory=profile_data["device_memory"],
                    connection_type=profile_data["connection_type"]
                )
                self.browser_profiles[name] = profile
            
            logger.info(f"Loaded {len(self.browser_profiles)} browser profiles")
            
        except Exception as e:
            logger.error(f"Failed to load profiles: {e}")
            self._generate_default_profiles()
    
    def get_random_profile(self) -> Tuple[str, BrowserProfile]:
        """Get a random browser profile."""
        profile_name = random.choice(list(self.browser_profiles.keys()))
        return profile_name, self.browser_profiles[profile_name]
    
    def get_random_behavioral_pattern(self) -> Tuple[str, BehavioralPattern]:
        """Get a random behavioral pattern."""
        pattern_name = random.choice(list(self.behavioral_patterns.keys()))
        return pattern_name, self.behavioral_patterns[pattern_name]
    
    def start_session(self, profile_name: Optional[str] = None, pattern_name: Optional[str] = None):
        """Start a new anti-detection session."""
        if not profile_name:
            profile_name, _ = self.get_random_profile()
        if not pattern_name:
            pattern_name, _ = self.get_random_behavioral_pattern()
        
        self.current_session = f"{profile_name}_{pattern_name}_{int(time.time())}"
        self.session_start_time = datetime.now(timezone.utc)
        
        logger.info(f"Started anti-detection session: {self.current_session}")
        return self.current_session
    
    def get_session_headers(self, profile: BrowserProfile) -> Dict[str, str]:
        """Get headers based on browser profile."""
        headers = {
            'User-Agent': profile.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': profile.language,
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        }
        
        return headers
    
    async def simulate_human_behavior(self, page, pattern: BehavioralPattern):
        """Simulate human-like behavior on the page."""
        try:
            # Random mouse movements
            for x, y in pattern.mouse_movement_pattern:
                await page.mouse.move(x + random.randint(-20, 20), y + random.randint(-20, 20))
                await asyncio.sleep(random.uniform(0.1, 0.3))
            
            # Random scrolling
            for scroll_amount in pattern.scroll_pattern:
                await page.mouse.wheel(0, scroll_amount + random.randint(-50, 50))
                await asyncio.sleep(random.uniform(0.5, 1.5))
            
            # Random clicks
            for x, y in pattern.click_pattern:
                await page.mouse.click(x + random.randint(-10, 10), y + random.randint(-10, 10))
                await asyncio.sleep(random.uniform(0.2, 0.8))
            
        except Exception as e:
            logger.warning(f"Error simulating human behavior: {e}")
    
    def inject_stealth_scripts(self, page) -> str:
        """Inject stealth scripts to bypass detection."""
        stealth_script = """
        // Override common detection methods
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
        
        // Override plugins
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
        
        // Override languages
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
        
        // Override chrome runtime
        window.chrome = {
            runtime: {},
        };
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
        
        // Override webdriver
        delete Object.getPrototypeOf(navigator).webdriver;
        
        // Override automation
        Object.defineProperty(navigator, 'automation', {
            get: () => undefined,
        });
        
        // Override connection
        Object.defineProperty(navigator, 'connection', {
            get: () => ({
                effectiveType: '4g',
                rtt: 50,
                downlink: 10,
                saveData: false
            }),
        });
        
        // Override hardware concurrency
        Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: () => 8,
        });
        
        // Override device memory
        Object.defineProperty(navigator, 'deviceMemory', {
            get: () => 8,
        });
        
        // Override platform
        Object.defineProperty(navigator, 'platform', {
            get: () => 'Win32',
        });
        
        // Override vendor
        Object.defineProperty(navigator, 'vendor', {
            get: () => 'Google Inc.',
        });
        
        // Override user agent
        Object.defineProperty(navigator, 'userAgent', {
            get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });
        
        // Override canvas fingerprinting
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args) {
            const context = originalGetContext.call(this, type, ...args);
            if (type === '2d') {
                const originalFillText = context.fillText;
                context.fillText = function(...args) {
                    return originalFillText.apply(this, args);
                };
            }
            return context;
        };
        
        // Override webgl fingerprinting
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 37445) {
                return 'Intel Inc.';
            }
            if (parameter === 37446) {
                return 'Intel Iris OpenGL Engine';
            }
            return getParameter.call(this, parameter);
        };
        
        // Override audio fingerprinting
        const originalGetChannelData = AudioBuffer.prototype.getChannelData;
        AudioBuffer.prototype.getChannelData = function(channel) {
            const data = originalGetChannelData.call(this, channel);
            const newData = new Float32Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = data[i] + (Math.random() * 0.0001);
            }
            return newData;
        };
        
        // Override battery API
        if (navigator.getBattery) {
            navigator.getBattery = () => Promise.resolve({
                charging: true,
                chargingTime: 0,
                dischargingTime: Infinity,
                level: 0.8
            });
        }
        
        // Override geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition = (success) => {
                success({
                    coords: {
                        latitude: 40.7128,
                        longitude: -74.0060,
                        accuracy: 100
                    }
                });
            };
        }
        
        // Override timezone
        Object.defineProperty(Intl, 'DateTimeFormat', {
            get: () => function(locale, options) {
                return {
                    resolvedOptions: () => ({
                        timeZone: 'America/New_York'
                    })
                };
            }
        });
        """
        
        return stealth_script
    
    def get_fingerprint_evasion(self, profile: BrowserProfile) -> Dict[str, Any]:
        """Get fingerprint evasion data."""
        return {
            "screen": {
                "width": profile.screen_resolution[0],
                "height": profile.screen_resolution[1],
                "colorDepth": profile.color_depth,
                "pixelDepth": profile.color_depth
            },
            "navigator": {
                "userAgent": profile.user_agent,
                "language": profile.language.split(',')[0],
                "languages": profile.language.split(','),
                "platform": profile.platform,
                "hardwareConcurrency": profile.hardware_concurrency,
                "deviceMemory": profile.device_memory,
                "connection": {
                    "effectiveType": profile.connection_type,
                    "rtt": random.randint(30, 100),
                    "downlink": random.uniform(5, 20),
                    "saveData": False
                }
            },
            "webgl": {
                "vendor": profile.webgl_vendor,
                "renderer": profile.webgl_renderer
            },
            "timezone": profile.timezone,
            "plugins": profile.plugins,
            "mimeTypes": profile.mime_types,
            "fonts": profile.fonts
        }
    
    def should_rotate_session(self, session_duration: float, pattern: BehavioralPattern) -> bool:
        """Check if session should be rotated based on behavioral pattern."""
        max_duration = pattern.session_duration[1]
        return session_duration > max_duration
    
    def get_session_info(self) -> Optional[Dict[str, Any]]:
        """Get current session information."""
        if not self.current_session or not self.session_start_time:
            return None
        
        session_duration = (datetime.now(timezone.utc) - self.session_start_time).total_seconds()
        
        return {
            "session_id": self.current_session,
            "start_time": self.session_start_time.isoformat(),
            "duration": session_duration,
            "profile": self.current_session.split('_')[0],
            "pattern": self.current_session.split('_')[1]
        }
    
    def export_profiles(self, output_file: str):
        """Export current profiles to file."""
        data = {
            "browser_profiles": {
                name: {
                    "user_agent": profile.user_agent,
                    "screen_resolution": list(profile.screen_resolution),
                    "color_depth": profile.color_depth,
                    "timezone": profile.timezone,
                    "language": profile.language,
                    "platform": profile.platform,
                    "webgl_vendor": profile.webgl_vendor,
                    "webgl_renderer": profile.webgl_renderer,
                    "canvas_fingerprint": profile.canvas_fingerprint,
                    "audio_fingerprint": profile.audio_fingerprint,
                    "fonts": profile.fonts,
                    "plugins": profile.plugins,
                    "mime_types": profile.mime_types,
                    "hardware_concurrency": profile.hardware_concurrency,
                    "device_memory": profile.device_memory,
                    "connection_type": profile.connection_type
                }
                for name, profile in self.browser_profiles.items()
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Exported profiles to {output_file}")

# Global anti-detection manager instance
anti_detection_manager = AntiDetectionManager()

def get_anti_detection_session(profile_name: Optional[str] = None, 
                              pattern_name: Optional[str] = None) -> str:
    """Get an anti-detection session using the global manager."""
    return anti_detection_manager.start_session(profile_name, pattern_name)

def get_random_browser_profile() -> Tuple[str, BrowserProfile]:
    """Get a random browser profile using the global manager."""
    return anti_detection_manager.get_random_profile() 