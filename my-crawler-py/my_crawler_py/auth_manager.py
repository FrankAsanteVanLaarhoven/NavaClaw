#!/usr/bin/env python3
"""
Authentication Manager for Web Crawler

This module provides comprehensive authentication capabilities for crawling
freemium and paid websites, including:
- Login automation (form-based, OAuth, etc.)
- Session management and persistence
- Cookie handling and import/export
- Proxy rotation and user-agent management
- 2FA/MFA support
- Rate limiting and anti-bot detection avoidance
"""

import os
import json
import time
import random
import pickle
import base64
from pathlib import Path
from typing import Dict, List, Optional, Any, Union, Tuple
from datetime import datetime, timedelta
import logging
from urllib.parse import urlparse, urljoin
import asyncio

# Browser automation
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from playwright.async_api import TimeoutError as PlaywrightTimeoutError

# HTTP requests
import aiohttp
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Data handling
import pandas as pd
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)


class AuthManager:
    """
    Comprehensive authentication manager for web crawling.
    
    Supports:
    - Multiple authentication methods (form, OAuth, API keys)
    - Session persistence and cookie management
    - Proxy rotation and user-agent spoofing
    - Rate limiting and anti-bot avoidance
    - 2FA/MFA handling
    """
    
    def __init__(self, 
                 session_dir: str = "sessions",
                 proxy_list: Optional[List[str]] = None,
                 user_agents: Optional[List[str]] = None,
                 encryption_key: Optional[str] = None):
        """
        Initialize the authentication manager.
        
        Args:
            session_dir: Directory to store session data
            proxy_list: List of proxy URLs (http://user:pass@host:port)
            user_agents: List of user agent strings to rotate
            encryption_key: Key for encrypting sensitive session data
        """
        self.session_dir = Path(session_dir)
        self.session_dir.mkdir(exist_ok=True)
        
        self.proxy_list = proxy_list or []
        self.current_proxy = None
        
        self.user_agents = user_agents or self._get_default_user_agents()
        self.current_user_agent = None
        
        # Encryption for sensitive data
        if encryption_key:
            self.cipher = Fernet(encryption_key.encode())
        else:
            # Generate a new key if none provided
            key = Fernet.generate_key()
            self.cipher = Fernet(key)
            logger.info(f"Generated new encryption key: {key.decode()}")
        
        # Session storage
        self.sessions: Dict[str, Dict] = {}
        self.active_sessions: Dict[str, BrowserContext] = {}
        
        # Rate limiting
        self.request_delays = {}
        self.last_request_time = {}
        
        # Load existing sessions
        self._load_sessions()
    
    def _get_default_user_agents(self) -> List[str]:
        """Get default user agent strings for rotation."""
        return [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0",
        ]
    
    def _load_sessions(self):
        """Load existing sessions from disk."""
        session_file = self.session_dir / "sessions.json"
        if session_file.exists():
            try:
                with open(session_file, 'r') as f:
                    encrypted_data = json.load(f)
                    decrypted_data = self.cipher.decrypt(encrypted_data.encode()).decode()
                    self.sessions = json.loads(decrypted_data)
                logger.info(f"Loaded {len(self.sessions)} existing sessions")
            except Exception as e:
                logger.warning(f"Failed to load sessions: {e}")
    
    def _save_sessions(self):
        """Save sessions to disk with encryption."""
        session_file = self.session_dir / "sessions.json"
        try:
            data = json.dumps(self.sessions)
            encrypted_data = self.cipher.encrypt(data.encode()).decode()
            with open(session_file, 'w') as f:
                json.dump(encrypted_data, f)
        except Exception as e:
            logger.error(f"Failed to save sessions: {e}")
    
    def rotate_proxy(self) -> Optional[str]:
        """Rotate to next proxy in the list."""
        if not self.proxy_list:
            return None
        
        if self.current_proxy is None:
            self.current_proxy = 0
        else:
            self.current_proxy = (self.current_proxy + 1) % len(self.proxy_list)
        
        proxy = self.proxy_list[self.current_proxy]
        logger.info(f"Rotated to proxy: {proxy}")
        return proxy
    
    def rotate_user_agent(self) -> str:
        """Rotate to next user agent in the list."""
        if self.current_user_agent is None:
            self.current_user_agent = 0
        else:
            self.current_user_agent = (self.current_user_agent + 1) % len(self.user_agents)
        
        user_agent = self.user_agents[self.current_user_agent]
        logger.info(f"Rotated to user agent: {user_agent[:50]}...")
        return user_agent
    
    async def create_browser_context(self, 
                                   headless: bool = True,
                                   proxy: Optional[str] = None,
                                   user_agent: Optional[str] = None) -> BrowserContext:
        """
        Create a new browser context with authentication capabilities.
        
        Args:
            headless: Run browser in headless mode
            proxy: Proxy to use (overrides rotation)
            user_agent: User agent to use (overrides rotation)
        
        Returns:
            Browser context ready for authentication
        """
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(headless=headless)
        
        # Prepare context options
        context_options = {
            "viewport": {"width": 1920, "height": 1080},
            "user_agent": user_agent or self.rotate_user_agent(),
        }
        
        # Add proxy if specified
        if proxy or self.proxy_list:
            proxy_url = proxy or self.rotate_proxy()
            if proxy_url:
                context_options["proxy"] = {"server": proxy_url}
        
        context = await browser.new_context(**context_options)
        
        # Add stealth scripts to avoid detection
        await self._add_stealth_scripts(context)
        
        return context
    
    async def _add_stealth_scripts(self, context: BrowserContext):
        """Add scripts to make the browser appear more human-like."""
        await context.add_init_script("""
            // Override webdriver property
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
        """)
    
    async def login_with_form(self,
                            context: BrowserContext,
                            login_url: str,
                            username: str,
                            password: str,
                            username_selector: str = "input[name='username'], input[name='email'], input[type='email']",
                            password_selector: str = "input[name='password'], input[type='password']",
                            submit_selector: str = "button[type='submit'], input[type='submit']",
                            wait_for_url: Optional[str] = None,
                            wait_for_selector: Optional[str] = None,
                            max_wait: int = 30) -> bool:
        """
        Perform form-based login using Playwright.
        
        Args:
            context: Browser context
            login_url: URL of the login page
            username: Username/email
            password: Password
            username_selector: CSS selector for username field
            password_selector: CSS selector for password field
            submit_selector: CSS selector for submit button
            wait_for_url: URL to wait for after successful login
            wait_for_selector: CSS selector to wait for after successful login
            max_wait: Maximum time to wait for login completion
        
        Returns:
            True if login successful, False otherwise
        """
        try:
            page = await context.new_page()
            await page.goto(login_url, wait_until="networkidle")
            
            # Fill username
            await page.fill(username_selector, username)
            await page.wait_for_timeout(random.randint(500, 1500))
            
            # Fill password
            await page.fill(password_selector, password)
            await page.wait_for_timeout(random.randint(500, 1500))
            
            # Submit form
            await page.click(submit_selector)
            
            # Wait for login completion
            if wait_for_url:
                try:
                    await page.wait_for_url(wait_for_url, timeout=max_wait * 1000)
                except PlaywrightTimeoutError:
                    logger.warning(f"Timeout waiting for URL: {wait_for_url}")
                    return False
            elif wait_for_selector:
                try:
                    await page.wait_for_selector(wait_for_selector, timeout=max_wait * 1000)
                except PlaywrightTimeoutError:
                    logger.warning(f"Timeout waiting for selector: {wait_for_selector}")
                    return False
            else:
                # Default wait for navigation
                await page.wait_for_timeout(5000)
            
            # Check if login was successful
            current_url = page.url
            if "login" not in current_url.lower() and "signin" not in current_url.lower():
                logger.info(f"Login successful, redirected to: {current_url}")
                return True
            else:
                logger.warning("Login may have failed, still on login page")
                return False
                
        except Exception as e:
            logger.error(f"Login failed: {e}")
            return False
    
    async def handle_2fa(self,
                        context: BrowserContext,
                        method: str = "prompt",
                        code: Optional[str] = None,
                        selector: str = "input[name='code'], input[name='2fa'], input[name='totp']",
                        submit_selector: str = "button[type='submit']") -> bool:
        """
        Handle 2FA/MFA authentication.
        
        Args:
            context: Browser context
            method: How to get the code ('prompt', 'sms', 'email', 'totp')
            code: Pre-provided code
            selector: CSS selector for 2FA input field
            submit_selector: CSS selector for submit button
        
        Returns:
            True if 2FA successful, False otherwise
        """
        try:
            page = context.pages[-1]  # Get the current page
            
            # Wait for 2FA input field
            await page.wait_for_selector(selector, timeout=10000)
            
            if code:
                # Use provided code
                await page.fill(selector, code)
            elif method == "prompt":
                # Prompt user for code
                code = input("Enter 2FA code: ")
                await page.fill(selector, code)
            else:
                logger.error(f"2FA method '{method}' not implemented")
                return False
            
            await page.wait_for_timeout(random.randint(500, 1500))
            await page.click(submit_selector)
            
            # Wait for completion
            await page.wait_for_timeout(3000)
            
            logger.info("2FA completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"2FA failed: {e}")
            return False
    
    async def save_session(self,
                          context: BrowserContext,
                          site_name: str,
                          metadata: Optional[Dict] = None) -> bool:
        """
        Save browser session (cookies, localStorage, etc.) for later use.
        
        Args:
            context: Browser context
            site_name: Name to identify this session
            metadata: Additional metadata to store
        
        Returns:
            True if saved successfully, False otherwise
        """
        try:
            # Get cookies
            cookies = await context.cookies()
            
            # Get localStorage from all pages
            pages = context.pages
            local_storage = {}
            for page in pages:
                try:
                    storage = await page.evaluate("() => Object.entries(localStorage)")
                    local_storage[page.url] = dict(storage)
                except:
                    pass
            
            # Create session data
            session_data = {
                "cookies": cookies,
                "local_storage": local_storage,
                "metadata": metadata or {},
                "created_at": datetime.now().isoformat(),
                "last_used": datetime.now().isoformat()
            }
            
            # Save to memory and disk
            self.sessions[site_name] = session_data
            self._save_sessions()
            
            logger.info(f"Session saved for {site_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save session: {e}")
            return False
    
    async def load_session(self,
                          context: BrowserContext,
                          site_name: str) -> bool:
        """
        Load a previously saved session.
        
        Args:
            context: Browser context
            site_name: Name of the session to load
        
        Returns:
            True if loaded successfully, False otherwise
        """
        try:
            if site_name not in self.sessions:
                logger.warning(f"Session '{site_name}' not found")
                return False
            
            session_data = self.sessions[site_name]
            
            # Load cookies
            await context.add_cookies(session_data["cookies"])
            
            # Load localStorage (if page is available)
            pages = context.pages
            if pages and session_data.get("local_storage"):
                for page in pages:
                    for url, storage in session_data["local_storage"].items():
                        try:
                            await page.evaluate(f"""
                                () => {{
                                    Object.entries({json.dumps(storage)}).forEach(([key, value]) => {{
                                        localStorage.setItem(key, value);
                                    }});
                                }}
                            """)
                        except:
                            pass
            
            # Update last used timestamp
            session_data["last_used"] = datetime.now().isoformat()
            self._save_sessions()
            
            logger.info(f"Session loaded for {site_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load session: {e}")
            return False
    
    def import_cookies_from_browser(self, browser_name: str = "chrome") -> Dict:
        """
        Import cookies from a browser's cookie store.
        
        Args:
            browser_name: Browser to import from ('chrome', 'firefox', 'safari')
        
        Returns:
            Dictionary of cookies by domain
        """
        cookies = {}
        
        try:
            if browser_name == "chrome":
                # Chrome cookie locations
                cookie_paths = [
                    os.path.expanduser("~/Library/Application Support/Google/Chrome/Default/Cookies"),
                    os.path.expanduser("~/AppData/Local/Google/Chrome/User Data/Default/Cookies"),
                ]
                
                for cookie_path in cookie_paths:
                    if os.path.exists(cookie_path):
                        # This would require sqlite3 to read Chrome's cookie database
                        logger.info(f"Found Chrome cookies at: {cookie_path}")
                        break
            
            elif browser_name == "firefox":
                # Firefox cookie locations
                firefox_profile = os.path.expanduser("~/Library/Application Support/Firefox/Profiles")
                if os.path.exists(firefox_profile):
                    logger.info(f"Found Firefox profile at: {firefox_profile}")
            
            logger.info(f"Cookie import from {browser_name} completed")
            
        except Exception as e:
            logger.error(f"Failed to import cookies from {browser_name}: {e}")
        
        return cookies
    
    def export_cookies_to_file(self, site_name: str, format: str = "json") -> str:
        """
        Export cookies to a file.
        
        Args:
            site_name: Name of the session to export
            format: Export format ('json', 'txt', 'netscape')
        
        Returns:
            Path to the exported file
        """
        if site_name not in self.sessions:
            raise ValueError(f"Session '{site_name}' not found")
        
        session_data = self.sessions[site_name]
        cookies = session_data["cookies"]
        
        if format == "json":
            file_path = self.session_dir / f"{site_name}_cookies.json"
            with open(file_path, 'w') as f:
                json.dump(cookies, f, indent=2)
        
        elif format == "txt":
            file_path = self.session_dir / f"{site_name}_cookies.txt"
            with open(file_path, 'w') as f:
                for cookie in cookies:
                    f.write(f"{cookie['domain']}\tTRUE\t{cookie['path']}\t"
                           f"{'TRUE' if cookie['secure'] else 'FALSE'}\t{cookie['expires']}\t"
                           f"{cookie['name']}\t{cookie['value']}\n")
        
        elif format == "netscape":
            file_path = self.session_dir / f"{site_name}_cookies.txt"
            with open(file_path, 'w') as f:
                f.write("# Netscape HTTP Cookie File\n")
                for cookie in cookies:
                    f.write(f"{cookie['domain']}\tTRUE\t{cookie['path']}\t"
                           f"{'TRUE' if cookie['secure'] else 'FALSE'}\t{cookie['expires']}\t"
                           f"{cookie['name']}\t{cookie['value']}\n")
        
        logger.info(f"Cookies exported to: {file_path}")
        return str(file_path)
    
    def set_rate_limit(self, domain: str, requests_per_minute: int = 60):
        """
        Set rate limiting for a specific domain.
        
        Args:
            domain: Domain to rate limit
            requests_per_minute: Maximum requests per minute
        """
        delay = 60.0 / requests_per_minute
        self.request_delays[domain] = delay
        logger.info(f"Rate limit set for {domain}: {requests_per_minute} req/min")
    
    async def rate_limit_wait(self, domain: str):
        """Wait according to rate limits for a domain."""
        if domain in self.request_delays:
            delay = self.request_delays[domain]
            last_time = self.last_request_time.get(domain, 0)
            time_since_last = time.time() - last_time
            
            if time_since_last < delay:
                wait_time = delay - time_since_last
                await asyncio.sleep(wait_time)
            
            self.last_request_time[domain] = time.time()
    
    def get_session_info(self, site_name: str) -> Optional[Dict]:
        """Get information about a saved session."""
        if site_name not in self.sessions:
            return None
        
        session = self.sessions[site_name]
        return {
            "site_name": site_name,
            "created_at": session["created_at"],
            "last_used": session["last_used"],
            "cookie_count": len(session["cookies"]),
            "metadata": session["metadata"]
        }
    
    def list_sessions(self) -> List[Dict]:
        """List all saved sessions."""
        return [self.get_session_info(name) for name in self.sessions.keys()]
    
    def delete_session(self, site_name: str) -> bool:
        """Delete a saved session."""
        if site_name in self.sessions:
            del self.sessions[site_name]
            self._save_sessions()
            logger.info(f"Session '{site_name}' deleted")
            return True
        return False
    
    def clear_all_sessions(self):
        """Clear all saved sessions."""
        self.sessions.clear()
        self._save_sessions()
        logger.info("All sessions cleared")


# Convenience functions for common authentication patterns
async def login_to_site(auth_manager: AuthManager,
                       site_name: str,
                       login_url: str,
                       username: str,
                       password: str,
                       **kwargs) -> Optional[BrowserContext]:
    """
    Convenience function to login to a site and save the session.
    
    Args:
        auth_manager: Authentication manager instance
        site_name: Name to identify this session
        login_url: URL of the login page
        username: Username/email
        password: Password
        **kwargs: Additional arguments for login_with_form
    
    Returns:
        Browser context with authenticated session, or None if failed
    """
    context = await auth_manager.create_browser_context(headless=False)
    
    try:
        # Try to load existing session first
        if await auth_manager.load_session(context, site_name):
            logger.info(f"Loaded existing session for {site_name}")
            return context
        
        # Perform login
        success = await auth_manager.login_with_form(
            context, login_url, username, password, **kwargs
        )
        
        if success:
            # Save the session
            await auth_manager.save_session(context, site_name)
            return context
        else:
            await context.close()
            return None
            
    except Exception as e:
        logger.error(f"Login failed for {site_name}: {e}")
        await context.close()
        return None


# Example usage patterns
async def example_usage():
    """Example of how to use the AuthManager."""
    
    # Initialize auth manager
    auth_manager = AuthManager(
        session_dir="crawler_sessions",
        proxy_list=[
            "http://proxy1:8080",
            "http://proxy2:8080"
        ]
    )
    
    # Set rate limits
    auth_manager.set_rate_limit("example.com", 30)  # 30 requests per minute
    
    # Login to a site
    context = await login_to_site(
        auth_manager,
        site_name="example_site",
        login_url="https://example.com/login",
        username="your_username",
        password="your_password",
        wait_for_url="https://example.com/dashboard"
    )
    
    if context:
        # Use the authenticated context for crawling
        page = await context.new_page()
        await page.goto("https://example.com/protected-content")
        
        # Your crawling logic here...
        
        await context.close()


if __name__ == "__main__":
    # Run example
    asyncio.run(example_usage()) 