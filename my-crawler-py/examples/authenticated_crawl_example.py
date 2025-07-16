#!/usr/bin/env python3
"""
Authenticated Crawling Example

This example demonstrates how to use the authenticated crawler
to scrape content from sites that require login credentials.
"""

import asyncio
import json
import sys
from pathlib import Path

# Add the project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from my_crawler_py.authenticated_crawler import AuthenticatedCrawler
from my_crawler_py.auth_manager import AuthManager


async def linkedin_example():
    """Example: Crawl LinkedIn company pages with authentication."""
    
    print("🔗 LinkedIn Crawling Example")
    print("=" * 50)
    
    # Initialize crawler
    crawler = AuthenticatedCrawler(
        session_dir="example_sessions",
        proxy_list=[],  # Add your proxies here if needed
    )
    
    # Add LinkedIn configuration
    crawler.add_site_config(
        site_name="linkedin",
        login_url="https://www.linkedin.com/login",
        username_selector="input[name='session_key']",
        password_selector="input[name='session_password']",
        submit_selector="button[type='submit']",
        success_url="https://www.linkedin.com/feed/",
        rate_limit=30  # Conservative rate limit
    )
    
    # Get credentials (in production, use environment variables)
    username = input("LinkedIn Email: ")
    password = input("LinkedIn Password: ")
    
    # Companies to crawl
    companies = [
        "https://linkedin.com/company/microsoft",
        "https://linkedin.com/company/google",
        "https://linkedin.com/company/apple"
    ]
    
    print(f"\n🕷️  Starting LinkedIn crawl...")
    print(f"   Companies: {len(companies)}")
    print(f"   Max pages per company: 20")
    print(f"   Depth: 2")
    
    results = await crawler.crawl_with_auth(
        site_name="linkedin",
        start_urls=companies,
        username=username,
        password=password,
        max_pages=60,  # 20 pages per company
        depth=2,
        headless=True
    )
    
    if "error" in results:
        print(f"❌ Crawl failed: {results['error']}")
        return
    
    # Save results
    output_file = "linkedin_companies_results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Print summary
    stats = results["stats"]
    print(f"\n📊 LinkedIn Crawl Summary:")
    print(f"   Total pages: {stats['total_pages']}")
    print(f"   Successful: {stats['successful_pages']}")
    print(f"   Failed: {stats['failed_pages']}")
    print(f"   Duration: {stats['duration']:.2f} seconds")
    print(f"   Results saved to: {output_file}")
    
    # Show sample data
    if results["pages"]:
        print(f"\n📄 Sample Page Data:")
        sample_page = results["pages"][0]
        print(f"   URL: {sample_page['url']}")
        print(f"   Title: {sample_page['title']}")
        print(f"   Text length: {len(sample_page.get('text_content', ''))} characters")
        print(f"   Links found: {len(sample_page.get('links', []))}")
    
    # Clean up
    await crawler.close_all_contexts()


async def github_example():
    """Example: Crawl GitHub repositories with authentication."""
    
    print("\n🐙 GitHub Crawling Example")
    print("=" * 50)
    
    # Initialize crawler
    crawler = AuthenticatedCrawler(
        session_dir="example_sessions",
    )
    
    # Add GitHub configuration
    crawler.add_site_config(
        site_name="github",
        login_url="https://github.com/login",
        username_selector="input[name='login']",
        password_selector="input[name='password']",
        submit_selector="input[name='commit']",
        success_url="https://github.com/",
        rate_limit=60
    )
    
    # Get credentials
    username = input("GitHub Username: ")
    password = input("GitHub Password: ")
    
    # Repositories to crawl
    repositories = [
        "https://github.com/microsoft/vscode",
        "https://github.com/facebook/react",
        "https://github.com/tensorflow/tensorflow"
    ]
    
    print(f"\n🕷️  Starting GitHub crawl...")
    print(f"   Repositories: {len(repositories)}")
    print(f"   Max pages per repo: 15")
    print(f"   Depth: 2")
    
    results = await crawler.crawl_with_auth(
        site_name="github",
        start_urls=repositories,
        username=username,
        password=password,
        max_pages=45,  # 15 pages per repository
        depth=2,
        headless=True
    )
    
    if "error" in results:
        print(f"❌ Crawl failed: {results['error']}")
        return
    
    # Save results
    output_file = "github_repos_results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Print summary
    stats = results["stats"]
    print(f"\n📊 GitHub Crawl Summary:")
    print(f"   Total pages: {stats['total_pages']}")
    print(f"   Successful: {stats['successful_pages']}")
    print(f"   Failed: {stats['failed_pages']}")
    print(f"   Duration: {stats['duration']:.2f} seconds")
    print(f"   Results saved to: {output_file}")
    
    # Clean up
    await crawler.close_all_contexts()


async def custom_site_example():
    """Example: Crawl a custom site with authentication."""
    
    print("\n🌐 Custom Site Crawling Example")
    print("=" * 50)
    
    # Initialize crawler
    crawler = AuthenticatedCrawler(
        session_dir="example_sessions",
    )
    
    # Get site configuration from user
    print("Enter your custom site configuration:")
    site_name = input("Site name (e.g., mysite): ")
    login_url = input("Login URL: ")
    username_selector = input("Username selector (default: input[name='username']): ") or "input[name='username']"
    password_selector = input("Password selector (default: input[name='password']): ") or "input[name='password']"
    submit_selector = input("Submit selector (default: button[type='submit']): ") or "button[type='submit']"
    success_url = input("Success URL (optional): ") or None
    
    # Add custom site configuration
    crawler.add_site_config(
        site_name=site_name,
        login_url=login_url,
        username_selector=username_selector,
        password_selector=password_selector,
        submit_selector=submit_selector,
        success_url=success_url,
        rate_limit=30
    )
    
    # Get credentials
    username = input("Username/Email: ")
    password = input("Password: ")
    
    # URLs to crawl
    urls_input = input("URLs to crawl (comma-separated): ")
    urls = [url.strip() for url in urls_input.split(",")]
    
    max_pages = int(input("Max pages to crawl (default: 20): ") or "20")
    depth = int(input("Crawl depth (default: 2): ") or "2")
    
    print(f"\n🕷️  Starting custom site crawl...")
    print(f"   Site: {site_name}")
    print(f"   URLs: {len(urls)}")
    print(f"   Max pages: {max_pages}")
    print(f"   Depth: {depth}")
    
    results = await crawler.crawl_with_auth(
        site_name=site_name,
        start_urls=urls,
        username=username,
        password=password,
        max_pages=max_pages,
        depth=depth,
        headless=True
    )
    
    if "error" in results:
        print(f"❌ Crawl failed: {results['error']}")
        return
    
    # Save results
    output_file = f"{site_name}_results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Print summary
    stats = results["stats"]
    print(f"\n📊 Custom Site Crawl Summary:")
    print(f"   Total pages: {stats['total_pages']}")
    print(f"   Successful: {stats['successful_pages']}")
    print(f"   Failed: {stats['failed_pages']}")
    print(f"   Duration: {stats['duration']:.2f} seconds")
    print(f"   Results saved to: {output_file}")
    
    # Clean up
    await crawler.close_all_contexts()


async def session_management_example():
    """Example: Demonstrate session management features."""
    
    print("\n🔐 Session Management Example")
    print("=" * 50)
    
    # Initialize crawler
    crawler = AuthenticatedCrawler(
        session_dir="example_sessions",
    )
    
    # List existing sessions
    sessions = crawler.list_sessions()
    
    if sessions:
        print("📋 Existing Sessions:")
        for session in sessions:
            print(f"   - {session['site_name']} (created: {session['created_at']})")
    else:
        print("No existing sessions found.")
    
    # Add a test configuration
    crawler.add_site_config(
        site_name="test_site",
        login_url="https://httpbin.org/basic-auth/user/passwd",
        username_selector="input[name='username']",
        password_selector="input[name='password']",
        submit_selector="button[type='submit']",
        rate_limit=60
    )
    
    print("\n✅ Added test site configuration")
    print("💡 Use the CLI to manage sessions:")
    print("   python authenticated_crawler_cli.py list-sessions")
    print("   python authenticated_crawler_cli.py delete-session --site-name test_site")
    print("   python authenticated_crawler_cli.py export-cookies --site-name test_site")


async def main():
    """Main example runner."""
    
    print("🚀 Authenticated Crawling Examples")
    print("=" * 60)
    print("This example demonstrates authenticated crawling capabilities.")
    print("Choose an example to run:")
    print("1. LinkedIn company crawling")
    print("2. GitHub repository crawling")
    print("3. Custom site crawling")
    print("4. Session management demo")
    print("5. Run all examples")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    try:
        if choice == "1":
            await linkedin_example()
        elif choice == "2":
            await github_example()
        elif choice == "3":
            await custom_site_example()
        elif choice == "4":
            await session_management_example()
        elif choice == "5":
            await session_management_example()
            await linkedin_example()
            await github_example()
        else:
            print("Invalid choice. Please run the script again.")
            return
        
        print("\n✅ Example completed successfully!")
        print("\n📚 Next steps:")
        print("   - Check the generated JSON files for crawl results")
        print("   - Review the session directory for saved sessions")
        print("   - Try the CLI tool for more advanced usage")
        print("   - Read AUTHENTICATED_CRAWLING.md for detailed documentation")
        
    except KeyboardInterrupt:
        print("\n⚠️  Example cancelled by user")
    except Exception as e:
        print(f"\n❌ Example failed: {e}")
        print("💡 Make sure you have:")
        print("   - Installed all dependencies: pip install playwright cryptography")
        print("   - Installed Playwright browsers: playwright install chromium")
        print("   - Valid credentials for the target sites")


if __name__ == "__main__":
    asyncio.run(main()) 