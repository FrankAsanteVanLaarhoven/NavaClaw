import asyncio
from pathlib import Path
from typing import List, Set, Dict, Optional
import aiohttp
import os
import re
import json
from urllib.parse import urlparse, urljoin
from playwright.async_api import async_playwright, Page

class FullSiteSourceExtractor:
    """
    Crawls all reachable URLs, downloads and organizes all frontend code/assets, and generates an architecture report.
    Enhanced for dynamic sites with JavaScript rendering, SPAs, and interactive content.
    """
    def __init__(self, output_dir: str = None, dynamic_mode: bool = True, max_depth: int = 3):
        self.output_dir = Path(output_dir) if output_dir else Path.home() / "Desktop" / "FullSiteSourceExtracted"
        self.output_dir.mkdir(exist_ok=True, parents=True)
        self.dynamic_mode = dynamic_mode
        self.max_depth = max_depth
        self.asset_dirs = {
            'html': self.output_dir / 'html',
            'js': self.output_dir / 'js',
            'css': self.output_dir / 'css',
            'images': self.output_dir / 'images',
            'fonts': self.output_dir / 'fonts',
            'assets': self.output_dir / 'assets',
            'api_endpoints': self.output_dir / 'api_endpoints',
            'dynamic_content': self.output_dir / 'dynamic_content',
        }
        for d in self.asset_dirs.values():
            d.mkdir(exist_ok=True)
        self.visited: Set[str] = set()
        self.asset_map: Dict[str, str] = {}
        self.site_structure: Dict[str, Dict] = {}
        self.api_endpoints: Set[str] = set()
        self.dynamic_routes: Set[str] = set()

    async def run_full_site_extraction(self, start_urls: List[str]):
        print(f"[Extractor] Starting full site source extraction for: {start_urls}")
        print(f"[Extractor] Dynamic mode: {'Enabled' if self.dynamic_mode else 'Disabled'}")
        print(f"[Extractor] Max depth: {self.max_depth}")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Set up network monitoring for API discovery
            if self.dynamic_mode:
                await self.setup_network_monitoring(page)
            
            for url in start_urls:
                await self.crawl_site(page, url, urlparse(url).netloc)
            
            await browser.close()
        
        await self.generate_architecture_report()
        print(f"[Extractor] Extraction complete. Data saved to {self.output_dir}")

    async def setup_network_monitoring(self, page: Page):
        """Set up network monitoring to discover API endpoints and dynamic content."""
        async def handle_request(request):
            url = request.url
            if any(api_pattern in url.lower() for api_pattern in ['/api/', '/graphql', '/rest/', '/ajax/', '/json']):
                self.api_endpoints.add(url)
                print(f"[Extractor] Discovered API endpoint: {url}")
        
        async def handle_response(response):
            if response.status == 200:
                content_type = response.headers.get('content-type', '')
                if 'application/json' in content_type:
                    try:
                        data = await response.json()
                        # Save API responses for analysis
                        endpoint_name = self.sanitize_filename(response.url)
                        api_file = self.asset_dirs['api_endpoints'] / f"{endpoint_name}.json"
                        with open(api_file, 'w') as f:
                            json.dump(data, f, indent=2)
                    except:
                        pass
        
        page.on("request", handle_request)
        page.on("response", handle_response)

    async def crawl_site(self, page: Page, start_url: str, domain: str):
        to_visit = [(start_url, 0)]
        while to_visit:
            url, depth = to_visit.pop(0)
            if url in self.visited or depth > self.max_depth:
                continue
            print(f"[Extractor] Crawling: {url} (depth: {depth})")
            self.visited.add(url)
            
            try:
                # Navigate and wait for dynamic content
                await page.goto(url, wait_until='networkidle', timeout=30000)
                
                # Handle dynamic content if enabled
                if self.dynamic_mode:
                    await self.handle_dynamic_content(page, url)
                
                # Extract content and assets
                html = await page.content()
                html_path = self.save_html(url, html)
                assets = await self.extract_assets(page, url)
                
                self.site_structure[url] = {
                    'html': str(html_path),
                    'assets': assets,
                    'depth': depth,
                    'dynamic_content_handled': self.dynamic_mode
                }
                
                # Discover new links (including dynamically generated ones)
                links = await self.discover_links(page, domain)
                for link in links:
                    if link not in self.visited:
                        to_visit.append((link, depth + 1))
                        
            except Exception as e:
                print(f"[Extractor] Error crawling {url}: {e}")

    async def handle_dynamic_content(self, page: Page, url: str):
        """Handle dynamic content like infinite scroll, lazy loading, and interactive elements."""
        print(f"[Extractor] Handling dynamic content for: {url}")
        
        # Wait for any lazy-loaded content
        await page.wait_for_timeout(2000)
        
        # Handle infinite scroll (scroll to bottom multiple times)
        for i in range(3):
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(1000)
        
        # Look for and click "Load More" buttons
        load_more_selectors = [
            'button:has-text("Load More")',
            'button:has-text("Show More")',
            'a:has-text("Load More")',
            '[data-load-more]',
            '.load-more',
            '.show-more'
        ]
        
        for selector in load_more_selectors:
            try:
                buttons = await page.query_selector_all(selector)
                for button in buttons[:2]:  # Limit to first 2 buttons
                    await button.click()
                    await page.wait_for_timeout(2000)
                    print(f"[Extractor] Clicked load more button: {selector}")
            except:
                continue
        
        # Handle modal/popup content
        modal_selectors = [
            '[data-modal]',
            '.modal',
            '.popup',
            '[role="dialog"]'
        ]
        
        for selector in modal_selectors:
            try:
                modals = await page.query_selector_all(selector)
                for modal in modals[:1]:  # Limit to first modal
                    await modal.click()
                    await page.wait_for_timeout(1000)
                    print(f"[Extractor] Interacted with modal: {selector}")
            except:
                continue

    async def discover_links(self, page: Page, domain: str) -> List[str]:
        """Discover links including dynamically generated ones."""
        # Get all links from the current page
        links = await page.eval_on_selector_all('a[href]', 'els => els.map(e => e.href)')
        
        # Also look for JavaScript-generated links
        js_links = await page.evaluate("""
            () => {
                const links = new Set();
                // Look for links in data attributes
                document.querySelectorAll('[data-href], [data-url], [data-link]').forEach(el => {
                    const href = el.dataset.href || el.dataset.url || el.dataset.link;
                    if (href) links.add(href);
                });
                // Look for links in JavaScript variables
                if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props) {
                    // Next.js routing
                    Object.keys(window.__NEXT_DATA__.props).forEach(key => {
                        if (key.includes('page') || key.includes('route')) {
                            links.add('/' + key);
                        }
                    });
                }
                return Array.from(links);
            }
        """)
        
        all_links = links + js_links
        domain_links = []
        
        for link in all_links:
            try:
                parsed = urlparse(link)
                if parsed.netloc == domain and link not in self.visited:
                    domain_links.append(link)
            except:
                continue
        
        return list(set(domain_links))  # Remove duplicates

    def save_html(self, url: str, html: str) -> Path:
        fname = self.sanitize_filename(url) + '.html'
        path = self.asset_dirs['html'] / fname
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        return path

    async def extract_assets(self, page: Page, base_url: str) -> Dict[str, List[str]]:
        assets = {'js': [], 'css': [], 'images': [], 'fonts': [], 'assets': []}
        
        # Extract all script sources (including dynamically loaded ones)
        scripts = await page.eval_on_selector_all('script[src]', 'els => els.map(e => e.src)')
        for src in scripts:
            local = await self.download_asset(src, 'js', base_url)
            if local:
                assets['js'].append(local)
        
        # Extract stylesheets
        styles = await page.eval_on_selector_all('link[rel="stylesheet"]', 'els => els.map(e => e.href)')
        for href in styles:
            local = await self.download_asset(href, 'css', base_url)
            if local:
                assets['css'].append(local)
        
        # Extract images (including lazy-loaded ones)
        imgs = await page.eval_on_selector_all('img[src], img[data-src]', 'els => els.map(e => e.src || e.dataset.src)')
        for src in imgs:
            local = await self.download_asset(src, 'images', base_url)
            if local:
                assets['images'].append(local)
        
        # Extract fonts
        fonts = await page.eval_on_selector_all('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"]', 'els => els.map(e => e.href)')
        for href in fonts:
            local = await self.download_asset(href, 'fonts', base_url)
            if local:
                assets['fonts'].append(local)
        
        # Extract other assets
        links = await page.eval_on_selector_all('link[href]', 'els => els.map(e => e.href)')
        for href in links:
            if any(href.endswith(ext) for ext in ['.ico', '.json', '.webmanifest', '.xml']):
                local = await self.download_asset(href, 'assets', base_url)
                if local:
                    assets['assets'].append(local)
        
        return assets

    async def download_asset(self, url: str, asset_type: str, base_url: str) -> str:
        if not url or not url.startswith(('http://', 'https://')):
            url = urljoin(base_url, url)
        fname = self.sanitize_filename(url)
        ext = os.path.splitext(urlparse(url).path)[1]
        if not ext:
            ext = '.' + asset_type
        local_path = self.asset_dirs[asset_type] / (fname + ext)
        if local_path.exists():
            return str(local_path)
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=20) as resp:
                    if resp.status == 200:
                        data = await resp.read()
                        with open(local_path, 'wb') as f:
                            f.write(data)
                        return str(local_path)
        except Exception as e:
            print(f"[Extractor] Failed to download {url}: {e}")
        return ''

    def sanitize_filename(self, url: str) -> str:
        return re.sub(r'[^a-zA-Z0-9_-]', '_', urlparse(url).path.strip('/')) or 'index'

    async def generate_architecture_report(self):
        report = {
            'site_structure': self.site_structure,
            'assets': {k: [str(p) for p in d.iterdir()] for k, d in self.asset_dirs.items()},
            'api_endpoints': list(self.api_endpoints),
            'dynamic_routes': list(self.dynamic_routes),
            'summary': {
                'total_pages': len(self.site_structure),
                'total_assets': sum(len(files) for files in self.site_structure.values()),
                'api_endpoints_discovered': len(self.api_endpoints),
                'dynamic_mode_enabled': self.dynamic_mode,
                'max_depth': self.max_depth,
                'output_dir': str(self.output_dir)
            }
        }
        
        # Enhanced framework/tech detection
        frameworks = await self.detect_frameworks()
        report['detected_frameworks'] = frameworks
        
        # Save JSON and markdown
        with open(self.output_dir / 'architecture_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        with open(self.output_dir / 'architecture_report.md', 'w') as f:
            f.write(self.generate_markdown_report(report))

    async def detect_frameworks(self) -> Dict[str, bool]:
        """Enhanced framework detection for dynamic sites."""
        frameworks = {
            'vue': False, 'react': False, 'angular': False, 'svelte': False,
            'nextjs': False, 'gatsby': False, 'nuxt': False, 'webpack': False,
            'vite': False, 'typescript': False, 'jquery': False, 'bootstrap': False
        }
        
        for url, info in self.site_structure.items():
            html_path = info.get('html')
            if html_path and os.path.exists(html_path):
                with open(html_path, 'r', encoding='utf-8') as f:
                    html = f.read().lower()
                    
                    # Framework detection patterns
                    if 'vue' in html or 'data-v-' in html:
                        frameworks['vue'] = True
                    if 'react' in html or 'data-reactroot' in html:
                        frameworks['react'] = True
                    if 'angular' in html or 'ng-' in html:
                        frameworks['angular'] = True
                    if 'svelte' in html:
                        frameworks['svelte'] = True
                    if 'next' in html or '__next' in html:
                        frameworks['nextjs'] = True
                    if 'gatsby' in html:
                        frameworks['gatsby'] = True
                    if 'nuxt' in html:
                        frameworks['nuxt'] = True
                    if 'webpack' in html:
                        frameworks['webpack'] = True
                    if 'vite' in html:
                        frameworks['vite'] = True
                    if 'typescript' in html or '.ts' in html:
                        frameworks['typescript'] = True
                    if 'jquery' in html or '$(' in html:
                        frameworks['jquery'] = True
                    if 'bootstrap' in html:
                        frameworks['bootstrap'] = True
        
        return frameworks

    def generate_markdown_report(self, report: dict) -> str:
        md = f"# 🏗️ Full Site Architecture Report\n\n"
        md += f"**Total Pages:** {report['summary']['total_pages']}\n"
        md += f"**Dynamic Mode:** {'Enabled' if report['summary']['dynamic_mode_enabled'] else 'Disabled'}\n"
        md += f"**Max Depth:** {report['summary']['max_depth']}\n"
        md += f"**API Endpoints Discovered:** {report['summary']['api_endpoints_discovered']}\n\n"
        
        # Detected frameworks
        frameworks = report.get('detected_frameworks', {})
        detected = [k for k, v in frameworks.items() if v]
        md += f"**Detected Frameworks:** {', '.join(detected) if detected else 'None'}\n\n"
        
        md += f"## Site Structure\n\n"
        for url, info in report['site_structure'].items():
            md += f"- [{url}]({info['html']}) (depth: {info['depth']})\n"
        
        md += f"\n## Asset Summary\n"
        for k, files in report['assets'].items():
            md += f"- {k}: {len(files)} files\n"
        
        if report.get('api_endpoints'):
            md += f"\n## API Endpoints Discovered\n"
            for endpoint in report['api_endpoints'][:10]:  # Show first 10
                md += f"- {endpoint}\n"
        
        return md 