# Authenticated Web Crawling

This guide explains how to use the authenticated crawling capabilities for scraping freemium and paid websites that require login credentials.

## Features

- **Automatic Login**: Form-based authentication with configurable selectors
- **Session Management**: Persistent sessions with encrypted storage
- **Cookie Handling**: Import/export cookies in multiple formats
- **Proxy Rotation**: Support for multiple proxy servers
- **User-Agent Rotation**: Automatic user-agent spoofing
- **Rate Limiting**: Configurable rate limits per domain
- **2FA/MFA Support**: Handle two-factor authentication
- **Paywall Detection**: Automatic detection of access restrictions
- **Anti-Bot Avoidance**: Stealth techniques to avoid detection

## Installation

### Prerequisites

1. **Playwright**: Install Playwright browsers
```bash
playwright install chromium
```

2. **Dependencies**: Install required packages
```bash
pip install playwright cryptography aiohttp requests
```

### Setup

1. **Clone the repository** (if not already done)
```bash
git clone <repository-url>
cd my-crawler-py
```

2. **Install dependencies**
```bash
poetry install
```

## Quick Start

### 1. Add Site Configuration

First, configure the login details for your target site:

```bash
python authenticated_crawler_cli.py add-config \
  --site-name linkedin \
  --login-url "https://www.linkedin.com/login" \
  --username-selector "input[name='session_key']" \
  --password-selector "input[name='session_password']" \
  --submit-selector "button[type='submit']" \
  --success-url "https://www.linkedin.com/feed/" \
  --rate-limit 30
```

### 2. Test Login

Test the login configuration:

```bash
python authenticated_crawler_cli.py test-login \
  --site-name linkedin \
  --test-url "https://linkedin.com/feed/"
```

### 3. Crawl with Authentication

Start crawling with your credentials:

```bash
python authenticated_crawler_cli.py crawl \
  --site-name linkedin \
  --urls "https://linkedin.com/company/example" \
  --max-pages 50 \
  --depth 2 \
  --output linkedin_results.json
```

## Configuration

### Site Configuration

Each site requires a configuration with the following parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `site_name` | Unique identifier for the site | `linkedin` |
| `login_url` | URL of the login page | `https://linkedin.com/login` |
| `username_selector` | CSS selector for username field | `input[name='session_key']` |
| `password_selector` | CSS selector for password field | `input[name='session_password']` |
| `submit_selector` | CSS selector for submit button | `button[type='submit']` |
| `success_url` | URL to wait for after login | `https://linkedin.com/feed/` |
| `success_selector` | CSS selector to wait for after login | `.dashboard` |
| `rate_limit` | Requests per minute | `30` |

### Pre-configured Sites

The crawler includes configurations for common sites:

- **LinkedIn**: Professional networking
- **GitHub**: Code repositories
- **Twitter**: Social media
- **Medium**: Blogging platform

### Advanced Configuration

#### Proxy Setup

```bash
python authenticated_crawler_cli.py crawl \
  --site-name linkedin \
  --urls "https://linkedin.com/company/example" \
  --proxy-list "http://proxy1:8080" "http://proxy2:8080" \
  --max-pages 50
```

#### Custom Session Directory

```bash
python authenticated_crawler_cli.py crawl \
  --site-name linkedin \
  --urls "https://linkedin.com/company/example" \
  --session-dir "/path/to/sessions" \
  --max-pages 50
```

#### Encryption Key

```bash
python authenticated_crawler_cli.py crawl \
  --site-name linkedin \
  --urls "https://linkedin.com/company/example" \
  --encryption-key "your-secret-key" \
  --max-pages 50
```

## Usage Examples

### LinkedIn Crawling

```bash
# Add LinkedIn configuration
python authenticated_crawler_cli.py add-config \
  --site-name linkedin \
  --login-url "https://www.linkedin.com/login" \
  --username-selector "input[name='session_key']" \
  --password-selector "input[name='session_password']" \
  --submit-selector "button[type='submit']" \
  --success-url "https://www.linkedin.com/feed/" \
  --rate-limit 30

# Crawl company pages
python authenticated_crawler_cli.py crawl \
  --site-name linkedin \
  --urls "https://linkedin.com/company/microsoft" \
  --max-pages 100 \
  --depth 3 \
  --output microsoft_linkedin.json
```

### GitHub Crawling

```bash
# Add GitHub configuration
python authenticated_crawler_cli.py add-config \
  --site-name github \
  --login-url "https://github.com/login" \
  --username-selector "input[name='login']" \
  --password-selector "input[name='password']" \
  --submit-selector "input[name='commit']" \
  --success-url "https://github.com/" \
  --rate-limit 60

# Crawl repositories
python authenticated_crawler_cli.py crawl \
  --site-name github \
  --urls "https://github.com/microsoft/vscode" \
  --max-pages 50 \
  --depth 2 \
  --output vscode_github.json
```

### Custom Site Configuration

For a custom site, you'll need to inspect the login form:

1. **Open Developer Tools** in your browser
2. **Navigate to the login page**
3. **Inspect the form elements**:
   - Username/email field
   - Password field
   - Submit button
4. **Note the selectors** (id, name, or CSS selectors)

Example for a custom site:

```bash
python authenticated_crawler_cli.py add-config \
  --site-name mycustomsite \
  --login-url "https://mycustomsite.com/login" \
  --username-selector "#email" \
  --password-selector "#password" \
  --submit-selector ".login-btn" \
  --success-url "https://mycustomsite.com/dashboard" \
  --rate-limit 45
```

## Session Management

### List Saved Sessions

```bash
python authenticated_crawler_cli.py list-sessions
```

### Delete Session

```bash
python authenticated_crawler_cli.py delete-session --site-name linkedin
```

### Export Cookies

```bash
# Export as JSON
python authenticated_crawler_cli.py export-cookies --site-name linkedin --format json

# Export as Netscape format (for wget/curl)
python authenticated_crawler_cli.py export-cookies --site-name linkedin --format netscape

# Export as plain text
python authenticated_crawler_cli.py export-cookies --site-name linkedin --format txt
```

## Advanced Features

### 2FA/MFA Support

The crawler can handle two-factor authentication:

```python
from my_crawler_py.auth_manager import AuthManager

auth_manager = AuthManager()

# Handle 2FA with prompt
await auth_manager.handle_2fa(context, method="prompt")

# Handle 2FA with provided code
await auth_manager.handle_2fa(context, method="prompt", code="123456")
```

### Rate Limiting

Set custom rate limits for different domains:

```python
auth_manager = AuthManager()

# Set rate limit for LinkedIn (30 requests per minute)
auth_manager.set_rate_limit("linkedin.com", 30)

# Set rate limit for GitHub (60 requests per minute)
auth_manager.set_rate_limit("github.com", 60)
```

### Proxy Rotation

Use multiple proxies to avoid IP-based restrictions:

```python
auth_manager = AuthManager(
    proxy_list=[
        "http://proxy1:8080",
        "http://proxy2:8080",
        "http://proxy3:8080"
    ]
)
```

### User-Agent Rotation

The crawler automatically rotates user agents, but you can customize:

```python
custom_user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
]

auth_manager = AuthManager(user_agents=custom_user_agents)
```

## Programmatic Usage

### Basic Usage

```python
import asyncio
from my_crawler_py.authenticated_crawler import AuthenticatedCrawler

async def main():
    # Initialize crawler
    crawler = AuthenticatedCrawler(
        session_dir="my_sessions",
        proxy_list=["http://proxy1:8080"]
    )
    
    # Add site configuration
    crawler.add_site_config(
        site_name="example_site",
        login_url="https://example.com/login",
        username_selector="input[name='username']",
        password_selector="input[name='password']",
        submit_selector="button[type='submit']",
        success_url="https://example.com/dashboard",
        rate_limit=30
    )
    
    # Crawl with authentication
    results = await crawler.crawl_with_auth(
        site_name="example_site",
        start_urls=["https://example.com/protected-content"],
        username="your_username",
        password="your_password",
        max_pages=50,
        depth=2
    )
    
    print(f"Crawled {len(results['pages'])} pages")
    
    # Clean up
    await crawler.close_all_contexts()

asyncio.run(main())
```

### Advanced Usage

```python
import asyncio
from my_crawler_py.auth_manager import AuthManager
from my_crawler_py.authenticated_crawler import AuthenticatedCrawler

async def advanced_crawl():
    # Create auth manager with advanced settings
    auth_manager = AuthManager(
        session_dir="advanced_sessions",
        proxy_list=[
            "http://proxy1:8080",
            "http://proxy2:8080"
        ],
        encryption_key="your-secret-key"
    )
    
    # Set rate limits
    auth_manager.set_rate_limit("linkedin.com", 30)
    auth_manager.set_rate_limit("github.com", 60)
    
    # Create crawler
    crawler = AuthenticatedCrawler(auth_manager=auth_manager)
    
    # Add multiple site configurations
    crawler.add_site_config(
        site_name="linkedin",
        login_url="https://www.linkedin.com/login",
        username_selector="input[name='session_key']",
        password_selector="input[name='session_password']",
        submit_selector="button[type='submit']",
        success_url="https://www.linkedin.com/feed/",
        rate_limit=30
    )
    
    # Crawl multiple sites
    sites_to_crawl = [
        {
            "site_name": "linkedin",
            "urls": ["https://linkedin.com/company/microsoft"],
            "username": "your_linkedin_email",
            "password": "your_linkedin_password"
        }
    ]
    
    all_results = {}
    
    for site in sites_to_crawl:
        print(f"Crawling {site['site_name']}...")
        
        results = await crawler.crawl_with_auth(
            site_name=site["site_name"],
            start_urls=site["urls"],
            username=site["username"],
            password=site["password"],
            max_pages=100,
            depth=3,
            headless=True
        )
        
        all_results[site["site_name"]] = results
    
    # Save all results
    import json
    with open("all_crawl_results.json", "w") as f:
        json.dump(all_results, f, indent=2)
    
    # Clean up
    await crawler.close_all_contexts()

asyncio.run(advanced_crawl())
```

## Troubleshooting

### Common Issues

#### 1. Login Fails

**Problem**: Login process fails or times out

**Solutions**:
- Check selectors are correct
- Verify login URL is accessible
- Try with `--show-browser` to see what's happening
- Check for CAPTCHA or 2FA requirements

```bash
python authenticated_crawler_cli.py test-login \
  --site-name yoursite \
  --show-browser
```

#### 2. Session Expires

**Problem**: Sessions become invalid after some time

**Solutions**:
- Use `--force` flag to create new session
- Check if site has changed login process
- Verify cookies are being saved correctly

```bash
python authenticated_crawler_cli.py login \
  --site-name yoursite \
  --force
```

#### 3. Rate Limiting

**Problem**: Getting blocked or rate limited

**Solutions**:
- Reduce rate limit in site configuration
- Use proxy rotation
- Increase delays between requests

```bash
python authenticated_crawler_cli.py add-config \
  --site-name yoursite \
  --rate-limit 10 \
  # ... other config
```

#### 4. Paywall Detection

**Problem**: Crawler stops at paywall pages

**Solutions**:
- Verify login was successful
- Check if subscription is required
- Try different starting URLs

### Debug Mode

Enable debug logging for troubleshooting:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Manual Testing

Test login manually before crawling:

```bash
python authenticated_crawler_cli.py test-login \
  --site-name yoursite \
  --show-browser \
  --test-url "https://yoursite.com/protected-page"
```

## Security Considerations

### Credential Storage

- Credentials are not stored on disk
- Sessions are encrypted using Fernet encryption
- Use environment variables for sensitive data

### Rate Limiting

- Always respect site rate limits
- Use reasonable delays between requests
- Monitor for blocking or CAPTCHA challenges

### Legal Compliance

- Check site terms of service
- Respect robots.txt
- Only crawl publicly accessible content
- Consider site-specific usage policies

## Best Practices

### 1. Start Small

Begin with a small number of pages to test your configuration:

```bash
python authenticated_crawler_cli.py crawl \
  --site-name yoursite \
  --urls "https://yoursite.com/test-page" \
  --max-pages 5 \
  --depth 1
```

### 2. Use Appropriate Rate Limits

Set conservative rate limits to avoid detection:

```bash
python authenticated_crawler_cli.py add-config \
  --site-name yoursite \
  --rate-limit 30  # 30 requests per minute
```

### 3. Monitor Sessions

Regularly check session status:

```bash
python authenticated_crawler_cli.py list-sessions
```

### 4. Backup Results

Save crawl results regularly:

```bash
python authenticated_crawler_cli.py crawl \
  --site-name yoursite \
  --urls "https://yoursite.com/content" \
  --output "results_$(date +%Y%m%d).json"
```

### 5. Handle Errors Gracefully

The crawler automatically handles many errors, but monitor the output:

```bash
python authenticated_crawler_cli.py crawl \
  --site-name yoursite \
  --urls "https://yoursite.com/content" \
  2>&1 | tee crawl.log
```

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Test with `--show-browser` to see what's happening
4. Verify site configuration is correct

## Legal Notice

This tool is for educational and research purposes. Always:

- Respect website terms of service
- Follow robots.txt guidelines
- Use reasonable rate limits
- Only access publicly available content
- Comply with applicable laws and regulations

The authors are not responsible for misuse of this tool. 