#!/usr/bin/env python3
"""
Authenticated Crawler CLI

Command-line interface for crawling freemium and paid websites
with automatic authentication and session management.
"""

import asyncio
import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List, Optional
import logging

# Add the project root to Python path
sys.path.insert(0, str(Path(__file__).parent))

from my_crawler_py.authenticated_crawler import AuthenticatedCrawler
from my_crawler_py.auth_manager import AuthManager

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AuthenticatedCrawlerCLI:
    """Command-line interface for authenticated crawling."""
    
    def __init__(self):
        self.crawler = None
        self.auth_manager = None
    
    def setup_crawler(self, 
                     session_dir: str = "crawler_sessions",
                     proxy_list: Optional[List[str]] = None,
                     encryption_key: Optional[str] = None):
        """Initialize the crawler with configuration."""
        self.auth_manager = AuthManager(
            session_dir=session_dir,
            proxy_list=proxy_list,
            encryption_key=encryption_key
        )
        
        self.crawler = AuthenticatedCrawler(
            auth_manager=self.auth_manager,
            session_dir=session_dir
        )
    
    async def add_site_config(self, args):
        """Add configuration for a new site."""
        if not self.crawler:
            self.setup_crawler()
        
        self.crawler.add_site_config(
            site_name=args.site_name,
            login_url=args.login_url,
            username_selector=args.username_selector,
            password_selector=args.password_selector,
            submit_selector=args.submit_selector,
            success_url=args.success_url,
            success_selector=args.success_selector,
            rate_limit=args.rate_limit
        )
        
        print(f"✅ Added configuration for site: {args.site_name}")
    
    async def login(self, args):
        """Login to a site and save session."""
        if not self.crawler:
            self.setup_crawler()
        
        # Get credentials
        username = args.username or input("Username/Email: ")
        password = args.password or input("Password: ")
        
        print(f"🔐 Logging into {args.site_name}...")
        
        context = await self.crawler.login_to_site(
            site_name=args.site_name,
            username=username,
            password=password,
            force_new_login=args.force,
            headless=not args.show_browser
        )
        
        if context:
            print(f"✅ Login successful for {args.site_name}")
            await context.close()
        else:
            print(f"❌ Login failed for {args.site_name}")
            sys.exit(1)
    
    async def crawl(self, args):
        """Crawl a site with authentication."""
        if not self.crawler:
            self.setup_crawler()
        
        # Get credentials
        username = args.username or input("Username/Email: ")
        password = args.password or input("Password: ")
        
        print(f"🕷️  Starting authenticated crawl of {args.site_name}...")
        print(f"   URLs: {args.urls}")
        print(f"   Max pages: {args.max_pages}")
        print(f"   Depth: {args.depth}")
        
        results = await self.crawler.crawl_with_auth(
            site_name=args.site_name,
            start_urls=args.urls,
            username=username,
            password=password,
            max_pages=args.max_pages,
            depth=args.depth,
            force_login=args.force_login,
            headless=not args.show_browser
        )
        
        if "error" in results:
            print(f"❌ Crawl failed: {results['error']}")
            sys.exit(1)
        
        # Save results
        output_file = args.output or f"{args.site_name}_crawl_results.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # Print summary
        stats = results["stats"]
        print(f"\n📊 Crawl Summary:")
        print(f"   Total pages: {stats['total_pages']}")
        print(f"   Successful: {stats['successful_pages']}")
        print(f"   Failed: {stats['failed_pages']}")
        print(f"   Duration: {stats['duration']:.2f} seconds")
        print(f"   Results saved to: {output_file}")
        
        if results["errors"]:
            print(f"\n⚠️  Errors encountered:")
            for error in results["errors"][:5]:  # Show first 5 errors
                print(f"   {error['url']}: {error['error']}")
            if len(results["errors"]) > 5:
                print(f"   ... and {len(results['errors']) - 5} more errors")
    
    async def list_sessions(self, args):
        """List all saved sessions."""
        if not self.crawler:
            self.setup_crawler()
        
        sessions = self.crawler.list_sessions()
        
        if not sessions:
            print("No saved sessions found.")
            return
        
        print(f"📋 Saved Sessions ({len(sessions)}):")
        print("-" * 80)
        
        for session in sessions:
            print(f"Site: {session['site_name']}")
            print(f"  Created: {session['created_at']}")
            print(f"  Last used: {session['last_used']}")
            print(f"  Cookies: {session['cookie_count']}")
            if session['metadata']:
                print(f"  Metadata: {session['metadata']}")
            print()
    
    async def delete_session(self, args):
        """Delete a saved session."""
        if not self.crawler:
            self.setup_crawler()
        
        if self.crawler.delete_session(args.site_name):
            print(f"✅ Deleted session for {args.site_name}")
        else:
            print(f"❌ Session not found for {args.site_name}")
    
    async def export_cookies(self, args):
        """Export cookies for a site."""
        if not self.crawler:
            self.setup_crawler()
        
        try:
            file_path = self.crawler.export_cookies(args.site_name, args.format)
            print(f"✅ Cookies exported to: {file_path}")
        except ValueError as e:
            print(f"❌ {e}")
        except Exception as e:
            print(f"❌ Export failed: {e}")
    
    async def test_login(self, args):
        """Test login to a site without crawling."""
        if not self.crawler:
            self.setup_crawler()
        
        # Get credentials
        username = args.username or input("Username/Email: ")
        password = args.password or input("Password: ")
        
        print(f"🧪 Testing login for {args.site_name}...")
        
        context = await self.crawler.login_to_site(
            site_name=args.site_name,
            username=username,
            password=password,
            force_new_login=True,
            headless=False  # Show browser for testing
        )
        
        if context:
            print(f"✅ Login test successful!")
            
            # Test navigation to a protected page
            if args.test_url:
                print(f"🧪 Testing access to: {args.test_url}")
                try:
                    page = await context.new_page()
                    await page.goto(args.test_url, wait_until="networkidle")
                    
                    # Check if we can access the content
                    title = await page.title()
                    print(f"✅ Successfully accessed page: {title}")
                    
                    await page.close()
                except Exception as e:
                    print(f"⚠️  Could not access test URL: {e}")
            
            await context.close()
        else:
            print(f"❌ Login test failed!")
            sys.exit(1)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Authenticated Web Crawler CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Add a new site configuration
  python authenticated_crawler_cli.py add-config --site-name linkedin \\
    --login-url "https://www.linkedin.com/login" \\
    --username-selector "input[name='session_key']" \\
    --password-selector "input[name='session_password']"

  # Login to a site
  python authenticated_crawler_cli.py login --site-name linkedin

  # Crawl a site with authentication
  python authenticated_crawler_cli.py crawl --site-name linkedin \\
    --urls "https://linkedin.com/company/example" \\
    --max-pages 50 --depth 2

  # Test login without crawling
  python authenticated_crawler_cli.py test-login --site-name linkedin \\
    --test-url "https://linkedin.com/feed/"

  # List saved sessions
  python authenticated_crawler_cli.py list-sessions

  # Export cookies
  python authenticated_crawler_cli.py export-cookies --site-name linkedin
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Add site configuration
    add_config_parser = subparsers.add_parser('add-config', help='Add site configuration')
    add_config_parser.add_argument('--site-name', required=True, help='Site name')
    add_config_parser.add_argument('--login-url', required=True, help='Login page URL')
    add_config_parser.add_argument('--username-selector', default="input[name='username'], input[name='email']", help='Username field selector')
    add_config_parser.add_argument('--password-selector', default="input[name='password']", help='Password field selector')
    add_config_parser.add_argument('--submit-selector', default="button[type='submit']", help='Submit button selector')
    add_config_parser.add_argument('--success-url', help='URL to wait for after login')
    add_config_parser.add_argument('--success-selector', help='Selector to wait for after login')
    add_config_parser.add_argument('--rate-limit', type=int, default=60, help='Requests per minute')
    
    # Login
    login_parser = subparsers.add_parser('login', help='Login to a site')
    login_parser.add_argument('--site-name', required=True, help='Site name')
    login_parser.add_argument('--username', help='Username/email')
    login_parser.add_argument('--password', help='Password')
    login_parser.add_argument('--force', action='store_true', help='Force new login')
    login_parser.add_argument('--show-browser', action='store_true', help='Show browser window')
    
    # Crawl
    crawl_parser = subparsers.add_parser('crawl', help='Crawl with authentication')
    crawl_parser.add_argument('--site-name', required=True, help='Site name')
    crawl_parser.add_argument('--urls', nargs='+', required=True, help='Starting URLs')
    crawl_parser.add_argument('--username', help='Username/email')
    crawl_parser.add_argument('--password', help='Password')
    crawl_parser.add_argument('--max-pages', type=int, default=100, help='Maximum pages to crawl')
    crawl_parser.add_argument('--depth', type=int, default=3, help='Maximum crawl depth')
    crawl_parser.add_argument('--force-login', action='store_true', help='Force new login')
    crawl_parser.add_argument('--show-browser', action='store_true', help='Show browser window')
    crawl_parser.add_argument('--output', help='Output file path')
    
    # Test login
    test_parser = subparsers.add_parser('test-login', help='Test login without crawling')
    test_parser.add_argument('--site-name', required=True, help='Site name')
    test_parser.add_argument('--username', help='Username/email')
    test_parser.add_argument('--password', help='Password')
    test_parser.add_argument('--test-url', help='URL to test access after login')
    
    # List sessions
    list_parser = subparsers.add_parser('list-sessions', help='List saved sessions')
    
    # Delete session
    delete_parser = subparsers.add_parser('delete-session', help='Delete saved session')
    delete_parser.add_argument('--site-name', required=True, help='Site name')
    
    # Export cookies
    export_parser = subparsers.add_parser('export-cookies', help='Export cookies')
    export_parser.add_argument('--site-name', required=True, help='Site name')
    export_parser.add_argument('--format', choices=['json', 'txt', 'netscape'], default='json', help='Export format')
    
    # Global options
    parser.add_argument('--session-dir', default='crawler_sessions', help='Session directory')
    parser.add_argument('--proxy-list', nargs='+', help='List of proxy URLs')
    parser.add_argument('--encryption-key', help='Encryption key for sessions')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Create CLI instance
    cli = AuthenticatedCrawlerCLI()
    
    # Setup crawler with global options
    cli.setup_crawler(
        session_dir=args.session_dir,
        proxy_list=args.proxy_list,
        encryption_key=args.encryption_key
    )
    
    # Run command
    try:
        if args.command == 'add-config':
            asyncio.run(cli.add_site_config(args))
        elif args.command == 'login':
            asyncio.run(cli.login(args))
        elif args.command == 'crawl':
            asyncio.run(cli.crawl(args))
        elif args.command == 'test-login':
            asyncio.run(cli.test_login(args))
        elif args.command == 'list-sessions':
            asyncio.run(cli.list_sessions(args))
        elif args.command == 'delete-session':
            asyncio.run(cli.delete_session(args))
        elif args.command == 'export-cookies':
            asyncio.run(cli.export_cookies(args))
    
    except KeyboardInterrupt:
        print("\n⚠️  Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
    finally:
        # Clean up
        if cli.crawler:
            asyncio.run(cli.crawler.close_all_contexts())


if __name__ == "__main__":
    main() 