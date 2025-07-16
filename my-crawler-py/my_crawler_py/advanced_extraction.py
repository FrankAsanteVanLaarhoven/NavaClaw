#!/usr/bin/env python3
"""
Advanced Universal Web Crawler - Data Extraction Module
Implements deep-layer data harvesting for localStorage, UI source code, and system architecture discovery.
"""

import json
import asyncio
import base64
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any
import re
from urllib.parse import urlparse, urljoin
import yaml


class AdvancedDataExtractor:
    """Advanced data extraction system for comprehensive web harvesting."""
    
    def __init__(self, output_dir: str = "crawl_data"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Create organized directory structure
        self.dirs = {
            'raw_html': self.output_dir / 'raw_html',
            'ui_components': self.output_dir / 'ui_components', 
            'storage_dumps': self.output_dir / 'storage_dumps',
            'api_specs': self.output_dir / 'api_specs',
            'media_ocr': self.output_dir / 'media_ocr',
            'logs': self.output_dir / 'logs',
            'docs': self.output_dir / 'docs'
        }
        
        for dir_path in self.dirs.values():
            dir_path.mkdir(exist_ok=True)
    
    async def extract_local_storage(self, page) -> Dict[str, Any]:
        """Extract localStorage, sessionStorage, and IndexedDB data."""
        
        # JavaScript to extract all storage data
        storage_script = """
        () => {
            const storageDump = {
                localStorage: {},
                sessionStorage: {},
                cookies: document.cookie,
                indexedDB: null,
                timestamp: new Date().toISOString()
            };
            
            // Extract localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                try {
                    storageDump.localStorage[key] = localStorage.getItem(key);
                } catch (e) {
                    storageDump.localStorage[key] = `[Error: ${e.message}]`;
                }
            }
            
            // Extract sessionStorage
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                try {
                    storageDump.sessionStorage[key] = sessionStorage.getItem(key);
                } catch (e) {
                    storageDump.sessionStorage[key] = `[Error: ${e.message}]`;
                }
            }
            
            // Try to extract IndexedDB info (basic) - without async/await
            try {
                if (window.indexedDB && window.indexedDB.databases) {
                    storageDump.indexedDB = {
                        available: true,
                        note: "IndexedDB.databases() requires async context"
                    };
                } else {
                    storageDump.indexedDB = {
                        available: false,
                        error: "IndexedDB.databases() not supported"
                    };
                }
            } catch (e) {
                storageDump.indexedDB = {
                    error: e.message,
                    available: false
                };
            }
            
            return storageDump;
        }
        """
        
        try:
            storage_data = await page.evaluate(storage_script)
            return storage_data
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    async def extract_ui_source_code(self, page, url: str) -> Dict[str, Any]:
        """Extract UI source code, components, and dependencies."""
        
        # Get page source and metadata
        html_content = await page.content()
        title = await page.title()
        
        # Extract CSS and JS dependencies
        dependencies_script = """
        const deps = {
            scripts: [],
            stylesheets: [],
            images: [],
            fonts: [],
            external_domains: new Set()
        };
        
        // Extract script sources
        document.querySelectorAll('script[src]').forEach(script => {
            deps.scripts.push(script.src);
            deps.external_domains.add(new URL(script.src).hostname);
        });
        
        // Extract stylesheet sources
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            deps.stylesheets.push(link.href);
            deps.external_domains.add(new URL(link.href).hostname);
        });
        
        // Extract image sources
        document.querySelectorAll('img[src]').forEach(img => {
            deps.images.push(img.src);
            deps.external_domains.add(new URL(img.src).hostname);
        });
        
        // Extract font sources
        document.querySelectorAll('link[rel="preload"][as="font"]').forEach(font => {
            deps.fonts.push(font.href);
            deps.external_domains.add(new URL(font.href).hostname);
        });
        
        return {
            scripts: deps.scripts,
            stylesheets: deps.stylesheets,
            images: deps.images,
            fonts: deps.fonts,
            external_domains: Array.from(deps.external_domains)
        };
        """
        
        try:
            dependencies = await page.evaluate(dependencies_script)
        except Exception as e:
            dependencies = {"error": str(e)}
        
        # Detect framework/technology
        framework_detection_script = """
        const tech = {
            react: !!window.React || !!document.querySelector('[data-reactroot]'),
            vue: !!window.Vue || !!document.querySelector('[data-v-]'),
            angular: !!window.angular || !!document.querySelector('[ng-]'),
            jquery: !!window.jQuery,
            bootstrap: !!document.querySelector('.bootstrap') || !!document.querySelector('[class*="col-"]'),
            tailwind: !!document.querySelector('[class*="tw-"]') || !!document.querySelector('[class*="bg-"]'),
            nextjs: !!window.__NEXT_DATA__,
            gatsby: !!window.__GATSBY__,
            wordpress: !!window.wp || !!document.querySelector('[class*="wp-"]'),
            shopify: !!window.Shopify || !!document.querySelector('[class*="shopify-"]')
        };
        
        return tech;
        """
        
        try:
            technologies = await page.evaluate(framework_detection_script)
        except Exception as e:
            technologies = {"error": str(e)}
        
        return {
            "url": url,
            "title": title,
            "html_length": len(html_content),
            "dependencies": dependencies,
            "technologies": technologies,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    
    async def discover_api_endpoints(self, page) -> Dict[str, Any]:
        """Discover API endpoints and system architecture."""
        
        # Monitor network requests to discover APIs
        api_discovery_script = """
        const apiEndpoints = {
            rest_apis: new Set(),
            graphql_endpoints: new Set(),
            websocket_endpoints: new Set(),
            ajax_calls: []
        };
        
        // Override fetch to capture API calls
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string') {
                if (url.includes('/api/') || url.includes('/rest/') || url.includes('/v1/') || url.includes('/v2/')) {
                    apiEndpoints.rest_apis.add(url);
                }
                if (url.includes('/graphql') || url.includes('/gql')) {
                    apiEndpoints.graphql_endpoints.add(url);
                }
            }
            return originalFetch.apply(this, args);
        };
        
        // Override XMLHttpRequest to capture AJAX calls
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string') {
                if (url.includes('/api/') || url.includes('/rest/') || url.includes('/v1/') || url.includes('/v2/')) {
                    apiEndpoints.rest_apis.add(url);
                }
                if (url.includes('/graphql') || url.includes('/gql')) {
                    apiEndpoints.graphql_endpoints.add(url);
                }
                
                apiEndpoints.ajax_calls.push({
                    method: method,
                    url: url,
                    timestamp: new Date().toISOString()
                });
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };
        
        // Check for WebSocket connections
        if (window.WebSocket) {
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(url, ...args) {
                apiEndpoints.websocket_endpoints.add(url);
                return new originalWebSocket(url, ...args);
            };
        }
        
        return {
            rest_apis: Array.from(apiEndpoints.rest_apis),
            graphql_endpoints: Array.from(apiEndpoints.graphql_endpoints),
            websocket_endpoints: Array.from(apiEndpoints.websocket_endpoints),
            ajax_calls: apiEndpoints.ajax_calls
        };
        """
        
        try:
            # Inject the monitoring script
            await page.evaluate(api_discovery_script)
            
            # Wait a bit for potential API calls
            await asyncio.sleep(2)
            
            # Get discovered endpoints
            endpoints = await page.evaluate("""
                return {
                    rest_apis: Array.from(window.apiEndpoints?.rest_apis || []),
                    graphql_endpoints: Array.from(window.apiEndpoints?.graphql_endpoints || []),
                    websocket_endpoints: Array.from(window.apiEndpoints?.websocket_endpoints || []),
                    ajax_calls: window.apiEndpoints?.ajax_calls || []
                };
            """)
            
            return endpoints
        except Exception as e:
            return {"error": str(e)}
    
    async def extract_page_data(self, page, url: str) -> Dict[str, Any]:
        """Comprehensive page data extraction."""
        
        # Extract all data types
        storage_data = await self.extract_local_storage(page)
        ui_data = await self.extract_ui_source_code(page, url)
        api_data = await self.discover_api_endpoints(page)
        
        # Take screenshot
        screenshot_path = self.dirs['media_ocr'] / f"{self._sanitize_filename(url)}.png"
        await page.screenshot(path=str(screenshot_path))
        
        # Get page metadata
        metadata = {
            "url": url,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_agent": await page.evaluate("navigator.userAgent"),
            "viewport": await page.evaluate("() => ({ width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio })"),
            "performance": await page.evaluate("() => { const perf = performance.getEntriesByType('navigation')[0]; return { load_time: perf.loadEventEnd - perf.loadEventStart, dom_content_loaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart, first_paint: performance.getEntriesByName('first-paint')[0]?.startTime, first_contentful_paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime }; }")
        }
        
        return {
            "metadata": metadata,
            "storage": storage_data,
            "ui_source": ui_data,
            "api_discovery": api_data,
            "screenshot_path": str(screenshot_path)
        }
    
    def _sanitize_filename(self, url: str) -> str:
        """Sanitize URL for use as filename."""
        parsed = urlparse(url)
        filename = f"{parsed.netloc}_{parsed.path.replace('/', '_')}"
        return re.sub(r'[^\w\-_.]', '_', filename)[:100]
    
    async def save_extracted_data(self, url: str, data: Dict[str, Any]) -> Dict[str, str]:
        """Save extracted data to organized file structure."""
        
        timestamp = datetime.now(timezone.utc).isoformat()
        sanitized_url = self._sanitize_filename(url)
        
        saved_files = {}
        
        # Save storage dump
        storage_file = self.dirs['storage_dumps'] / f"{sanitized_url}_storage.json"
        with open(storage_file, 'w') as f:
            json.dump(data['storage'], f, indent=2)
        saved_files['storage'] = str(storage_file)
        
        # Save UI source analysis
        ui_file = self.dirs['ui_components'] / f"{sanitized_url}_ui_analysis.json"
        with open(ui_file, 'w') as f:
            json.dump(data['ui_source'], f, indent=2)
        saved_files['ui_analysis'] = str(ui_file)
        
        # Save API discovery
        api_file = self.dirs['api_specs'] / f"{sanitized_url}_api_discovery.json"
        with open(api_file, 'w') as f:
            json.dump(data['api_discovery'], f, indent=2)
        saved_files['api_discovery'] = str(api_file)
        
        # Save comprehensive report
        report_file = self.dirs['docs'] / f"{sanitized_url}_comprehensive_report.json"
        with open(report_file, 'w') as f:
            json.dump(data, f, indent=2)
        saved_files['comprehensive_report'] = str(report_file)
        
        # Generate markdown documentation
        md_file = self.dirs['docs'] / f"{sanitized_url}_report.md"
        await self._generate_markdown_report(url, data, md_file)
        saved_files['markdown_report'] = str(md_file)
        
        return saved_files
    
    async def _generate_markdown_report(self, url: str, data: Dict[str, Any], output_file: Path):
        """Generate comprehensive markdown report."""
        
        md_content = f"""# Advanced Crawl Report: {url}

*Generated on: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}*

## Page Metadata

- **URL**: {url}
- **Title**: {data['ui_source'].get('title', 'N/A')}
- **User Agent**: {data['metadata']['user_agent']}
- **Viewport**: {data['metadata']['viewport']['width']}x{data['metadata']['viewport']['height']}
- **Load Time**: {data['metadata']['performance'].get('load_time', 'N/A')}ms

## Storage Analysis

### Local Storage
```json
{json.dumps(data['storage'].get('localStorage', {}), indent=2)}
```

### Session Storage
```json
{json.dumps(data['storage'].get('sessionStorage', {}), indent=2)}
```

### Cookies
```
{data['storage'].get('cookies', 'N/A')}
```

## Technology Stack

"""
        
        tech = data['ui_source'].get('technologies', {})
        for tech_name, detected in tech.items():
            if isinstance(detected, bool):
                md_content += f"- **{tech_name.title()}**: {'✅' if detected else '❌'}\n"
        
        md_content += f"""
## Dependencies

### Scripts ({len(data['ui_source'].get('dependencies', {}).get('scripts', []))})
"""
        
        for script in data['ui_source'].get('dependencies', {}).get('scripts', [])[:10]:
            md_content += f"- {script}\n"
        
        if len(data['ui_source'].get('dependencies', {}).get('scripts', [])) > 10:
            md_content += f"- ... and {len(data['ui_source'].get('dependencies', {}).get('scripts', [])) - 10} more\n"
        
        md_content += f"""
### Stylesheets ({len(data['ui_source'].get('dependencies', {}).get('stylesheets', []))})
"""
        
        for stylesheet in data['ui_source'].get('dependencies', {}).get('stylesheets', [])[:10]:
            md_content += f"- {stylesheet}\n"
        
        md_content += f"""
## API Discovery

### REST APIs ({len(data['api_discovery'].get('rest_apis', []))})
"""
        
        for api in data['api_discovery'].get('rest_apis', []):
            md_content += f"- `{api}`\n"
        
        md_content += f"""
### GraphQL Endpoints ({len(data['api_discovery'].get('graphql_endpoints', []))})
"""
        
        for gql in data['api_discovery'].get('graphql_endpoints', []):
            md_content += f"- `{gql}`\n"
        
        md_content += f"""
### WebSocket Endpoints ({len(data['api_discovery'].get('websocket_endpoints', []))})
"""
        
        for ws in data['api_discovery'].get('websocket_endpoints', []):
            md_content += f"- `{ws}`\n"
        
        md_content += f"""
## Screenshot

Screenshot saved to: `{data.get('screenshot_path', 'N/A')}`

---
*Report generated by Advanced Universal Web Crawler v2025.1*
"""
        
        with open(output_file, 'w') as f:
            f.write(md_content) 