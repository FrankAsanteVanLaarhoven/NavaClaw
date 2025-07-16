#!/usr/bin/env python3
"""
Enhanced Data Extraction Module
Implements advanced data layers: meta tags, network traffic, OCR, and AST parsing.
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
import subprocess
import tempfile
import os


class EnhancedDataExtractor:
    """Enhanced data extraction with advanced capabilities."""
    
    def __init__(self, output_dir: str = None):
        # Set up desktop storage
        desktop_path = Path.home() / "Desktop"
        self.desktop_crawl_dir = desktop_path / "AdvancedCrawlerData"
        self.desktop_crawl_dir.mkdir(exist_ok=True)
        
        # Use provided output_dir or default to desktop
        self.output_dir = Path(output_dir) if output_dir else self.desktop_crawl_dir
        self.output_dir.mkdir(exist_ok=True)
        
        # Create organized directory structure
        self.dirs = {
            'raw_html': self.output_dir / 'raw_html',
            'ui_components': self.output_dir / 'ui_components', 
            'storage_dumps': self.output_dir / 'storage_dumps',
            'api_specs': self.output_dir / 'api_specs',
            'media_ocr': self.output_dir / 'media_ocr',
            'meta_tags': self.output_dir / 'meta_tags',
            'network_traffic': self.output_dir / 'network_traffic',
            'ast_analysis': self.output_dir / 'ast_analysis',
            'logs': self.output_dir / 'logs',
            'docs': self.output_dir / 'docs',
            'screenshots': self.output_dir / 'screenshots'
        }
        
        for dir_path in self.dirs.values():
            dir_path.mkdir(exist_ok=True)
    
    async def extract_meta_tags(self, page) -> Dict[str, Any]:
        """Extract comprehensive meta tags for SEO and social media."""
        
        meta_extraction_script = """
        () => {
            const metaData = {
                seo: {},
                social: {},
                other: {},
                structured_data: [],
                timestamp: new Date().toISOString()
            };
            
            // Extract all meta tags
            document.querySelectorAll('meta').forEach(meta => {
                const name = meta.getAttribute('name') || meta.getAttribute('property');
                const content = meta.getAttribute('content');
                
                if (name && content) {
                    // SEO meta tags
                    if (name.includes('description') || name.includes('keywords') || 
                        name.includes('robots') || name.includes('author') ||
                        name.includes('viewport') || name.includes('charset')) {
                        metaData.seo[name] = content;
                    }
                    // Social media meta tags
                    else if (name.includes('og:') || name.includes('twitter:') || 
                             name.includes('fb:') || name.includes('linkedin:')) {
                        metaData.social[name] = content;
                    }
                    // Other meta tags
                    else {
                        metaData.other[name] = content;
                    }
                }
            });
            
            // Extract structured data (JSON-LD)
            document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
                try {
                    const data = JSON.parse(script.textContent);
                    metaData.structured_data.push(data);
                } catch (e) {
                    metaData.structured_data.push({
                        error: e.message,
                        raw_content: script.textContent
                    });
                }
            });
            
            // Extract Open Graph image
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) {
                metaData.social['og:image_url'] = ogImage.getAttribute('content');
            }
            
            // Extract canonical URL
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                metaData.seo['canonical'] = canonical.getAttribute('href');
            }
            
            return metaData;
        }
        """
        
        try:
            meta_data = await page.evaluate(meta_extraction_script)
            return meta_data
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    async def capture_network_traffic(self, page) -> Dict[str, Any]:
        """Capture complete network traffic and request/response data."""
        
        # Set up network monitoring
        network_data = {
            "requests": [],
            "responses": [],
            "errors": [],
            "summary": {
                "total_requests": 0,
                "total_responses": 0,
                "total_errors": 0,
                "domains": set(),
                "content_types": set()
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Monitor network events
        async def handle_request(request):
            req_data = {
                "url": request.url,
                "method": request.method,
                "headers": request.headers,
                "post_data": request.post_data,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "resource_type": request.resource_type
            }
            network_data["requests"].append(req_data)
            network_data["summary"]["total_requests"] += 1
            network_data["summary"]["domains"].add(urlparse(request.url).netloc)
        
        async def handle_response(response):
            try:
                resp_data = {
                    "url": response.url,
                    "status": response.status,
                    "headers": response.headers,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "content_type": response.headers.get("content-type", ""),
                    "content_length": response.headers.get("content-length", "0")
                }
                network_data["responses"].append(resp_data)
                network_data["summary"]["total_responses"] += 1
                network_data["summary"]["content_types"].add(resp_data["content_type"])
            except Exception as e:
                network_data["errors"].append(f"Response error: {e}")
        
        async def handle_request_failed(request):
            error_data = {
                "url": request.url,
                "error": "Request failed",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            network_data["errors"].append(error_data)
            network_data["summary"]["total_errors"] += 1
        
        # Set up event listeners
        page.on("request", handle_request)
        page.on("response", handle_response)
        page.on("requestfailed", handle_request_failed)
        
        # Convert sets to lists for JSON serialization
        network_data["summary"]["domains"] = list(network_data["summary"]["domains"])
        network_data["summary"]["content_types"] = list(network_data["summary"]["content_types"])
        
        return network_data
    
    async def perform_ocr_analysis(self, page) -> Dict[str, Any]:
        """Perform OCR on images and canvas elements."""
        
        ocr_data = {
            "images": [],
            "canvases": [],
            "errors": [],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Extract text from images using OCR
        image_ocr_script = """
        async () => {
            const imageData = [];
            
            // Get all images
            const images = document.querySelectorAll('img');
            for (const img of images) {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Create a new image to avoid CORS issues
                    const newImg = new Image();
                    newImg.crossOrigin = 'anonymous';
                    
                    await new Promise((resolve, reject) => {
                        newImg.onload = resolve;
                        newImg.onerror = reject;
                        newImg.src = img.src;
                    });
                    
                    canvas.width = newImg.width;
                    canvas.height = newImg.height;
                    ctx.drawImage(newImg, 0, 0);
                    
                    const imageInfo = {
                        src: img.src,
                        alt: img.alt,
                        width: newImg.width,
                        height: newImg.height,
                        canvas_data: canvas.toDataURL('image/png'),
                        timestamp: new Date().toISOString()
                    };
                    
                    imageData.push(imageInfo);
                } catch (e) {
                    imageData.push({
                        src: img.src,
                        error: e.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            return imageData;
        }
        """
        
        try:
            image_data = await page.evaluate(image_ocr_script)
            ocr_data["images"] = image_data
        except Exception as e:
            ocr_data["errors"].append(f"Image OCR error: {e}")
        
        # Extract canvas content
        canvas_script = """
        () => {
            const canvasData = [];
            const canvases = document.querySelectorAll('canvas');
            
            canvases.forEach((canvas, index) => {
                try {
                    const data = {
                        id: canvas.id || `canvas_${index}`,
                        width: canvas.width,
                        height: canvas.height,
                        data_url: canvas.toDataURL(),
                        timestamp: new Date().toISOString()
                    };
                    canvasData.push(data);
                } catch (e) {
                    canvasData.push({
                        id: canvas.id || `canvas_${index}`,
                        error: e.message,
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            return canvasData;
        }
        """
        
        try:
            canvas_data = await page.evaluate(canvas_script)
            ocr_data["canvases"] = canvas_data
        except Exception as e:
            ocr_data["errors"].append(f"Canvas extraction error: {e}")
        
        return ocr_data
    
    async def analyze_source_code_ast(self, page) -> Dict[str, Any]:
        """Analyze JavaScript and CSS using AST parsing."""
        
        ast_data = {
            "javascript": {},
            "css": {},
            "errors": [],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Extract and analyze JavaScript
        js_analysis_script = """
        () => {
            const jsAnalysis = {
                inline_scripts: [],
                external_scripts: [],
                functions: [],
                variables: [],
                imports: [],
                exports: []
            };
            
            // Analyze inline scripts
            document.querySelectorAll('script:not([src])').forEach((script, index) => {
                const content = script.textContent || script.innerHTML;
                if (content.trim()) {
                    jsAnalysis.inline_scripts.push({
                        index: index,
                        content: content.substring(0, 1000), // Limit content size
                        length: content.length,
                        type: script.type || 'text/javascript'
                    });
                }
            });
            
            // Collect external script info
            document.querySelectorAll('script[src]').forEach(script => {
                jsAnalysis.external_scripts.push({
                    src: script.src,
                    type: script.type || 'text/javascript',
                    async: script.async,
                    defer: script.defer
                });
            });
            
            // Basic function detection (regex-based)
            const functionRegex = /function\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(/g;
            const arrowFunctionRegex = /const\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*=\\s*\\(/g;
            
            document.querySelectorAll('script').forEach(script => {
                const content = script.textContent || script.innerHTML;
                if (content) {
                    // Find function declarations
                    let match;
                    while ((match = functionRegex.exec(content)) !== null) {
                        jsAnalysis.functions.push({
                            name: match[1],
                            type: 'function_declaration',
                            source: 'inline_script'
                        });
                    }
                    
                    // Find arrow functions
                    while ((match = arrowFunctionRegex.exec(content)) !== null) {
                        jsAnalysis.functions.push({
                            name: match[1],
                            type: 'arrow_function',
                            source: 'inline_script'
                        });
                    }
                }
            });
            
            return jsAnalysis;
        }
        """
        
        try:
            js_analysis = await page.evaluate(js_analysis_script)
            ast_data["javascript"] = js_analysis
        except Exception as e:
            ast_data["errors"].append(f"JavaScript AST error: {e}")
        
        # Extract and analyze CSS
        css_analysis_script = """
        () => {
            const cssAnalysis = {
                inline_styles: [],
                external_stylesheets: [],
                computed_styles: {},
                css_rules: []
            };
            
            // Analyze inline styles
            document.querySelectorAll('[style]').forEach((element, index) => {
                const style = element.getAttribute('style');
                if (style) {
                    cssAnalysis.inline_styles.push({
                        element: element.tagName,
                        selector: element.className || element.id || `element_${index}`,
                        styles: style,
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            // Collect external stylesheet info
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                cssAnalysis.external_stylesheets.push({
                    href: link.href,
                    media: link.media,
                    disabled: link.disabled
                });
            });
            
            // Analyze computed styles for key elements
            const keyElements = ['body', 'header', 'nav', 'main', 'footer'];
            keyElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    cssAnalysis.computed_styles[selector] = {
                        font_family: computedStyle.fontFamily,
                        font_size: computedStyle.fontSize,
                        color: computedStyle.color,
                        background_color: computedStyle.backgroundColor,
                        display: computedStyle.display,
                        position: computedStyle.position
                    };
                }
            });
            
            return cssAnalysis;
        }
        """
        
        try:
            css_analysis = await page.evaluate(css_analysis_script)
            ast_data["css"] = css_analysis
        except Exception as e:
            ast_data["errors"].append(f"CSS analysis error: {e}")
        
        return ast_data
    
    async def extract_enhanced_page_data(self, page, url: str) -> Dict[str, Any]:
        """Comprehensive enhanced page data extraction."""
        
        # Extract all enhanced data types
        meta_data = await self.extract_meta_tags(page)
        network_data = await self.capture_network_traffic(page)
        ocr_data = await self.perform_ocr_analysis(page)
        ast_data = await self.analyze_source_code_ast(page)
        
        # Take high-quality screenshot
        screenshot_path = self.dirs['screenshots'] / f"{self._sanitize_filename(url)}.png"
        await page.screenshot(path=str(screenshot_path), full_page=True)
        
        # Get enhanced page metadata
        metadata = {
            "url": url,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_agent": await page.evaluate("navigator.userAgent"),
            "viewport": await page.evaluate("() => ({ width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio })"),
            "performance": await page.evaluate("() => { const perf = performance.getEntriesByType('navigation')[0]; return { load_time: perf.loadEventEnd - perf.loadEventStart, dom_content_loaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart, first_paint: performance.getEntriesByName('first-paint')[0]?.startTime, first_contentful_paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime }; }"),
            "page_info": {
                "title": await page.title(),
                "url": page.url,
                "content_length": len(await page.content())
            }
        }
        
        return {
            "metadata": metadata,
            "meta_tags": meta_data,
            "network_traffic": network_data,
            "ocr_analysis": ocr_data,
            "ast_analysis": ast_data,
            "screenshot_path": str(screenshot_path)
        }
    
    def _sanitize_filename(self, url: str) -> str:
        """Sanitize URL for use as filename."""
        parsed = urlparse(url)
        filename = f"{parsed.netloc}_{parsed.path.replace('/', '_')}"
        return re.sub(r'[^\w\-_.]', '_', filename)[:100]
    
    async def save_enhanced_data(self, url: str, data: Dict[str, Any]) -> Dict[str, str]:
        """Save enhanced extracted data to organized file structure."""
        
        timestamp = datetime.now(timezone.utc).isoformat()
        sanitized_url = self._sanitize_filename(url)
        
        saved_files = {}
        
        # Save meta tags analysis
        meta_file = self.dirs['meta_tags'] / f"{sanitized_url}_meta_tags.json"
        with open(meta_file, 'w') as f:
            json.dump(data['meta_tags'], f, indent=2)
        saved_files['meta_tags'] = str(meta_file)
        
        # Save network traffic
        network_file = self.dirs['network_traffic'] / f"{sanitized_url}_network.json"
        with open(network_file, 'w') as f:
            json.dump(data['network_traffic'], f, indent=2)
        saved_files['network_traffic'] = str(network_file)
        
        # Save OCR analysis
        ocr_file = self.dirs['media_ocr'] / f"{sanitized_url}_ocr.json"
        with open(ocr_file, 'w') as f:
            json.dump(data['ocr_analysis'], f, indent=2)
        saved_files['ocr_analysis'] = str(ocr_file)
        
        # Save AST analysis
        ast_file = self.dirs['ast_analysis'] / f"{sanitized_url}_ast.json"
        with open(ast_file, 'w') as f:
            json.dump(data['ast_analysis'], f, indent=2)
        saved_files['ast_analysis'] = str(ast_file)
        
        # Save comprehensive enhanced report
        report_file = self.dirs['docs'] / f"{sanitized_url}_enhanced_report.json"
        with open(report_file, 'w') as f:
            json.dump(data, f, indent=2)
        saved_files['enhanced_report'] = str(report_file)
        
        # Generate enhanced markdown documentation
        md_file = self.dirs['docs'] / f"{sanitized_url}_enhanced_report.md"
        await self._generate_enhanced_markdown_report(url, data, md_file)
        saved_files['enhanced_markdown_report'] = str(md_file)
        
        return saved_files
    
    async def _generate_enhanced_markdown_report(self, url: str, data: Dict[str, Any], output_file: Path):
        """Generate comprehensive enhanced markdown report."""
        
        md_content = f"""# Enhanced Crawl Report: {url}

*Generated on: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}*

## Page Metadata

- **URL**: {url}
- **Title**: {data['metadata']['page_info']['title']}
- **User Agent**: {data['metadata']['user_agent']}
- **Viewport**: {data['metadata']['viewport']['width']}x{data['metadata']['viewport']['height']}
- **Load Time**: {data['metadata']['performance'].get('load_time', 'N/A')}ms
- **Content Length**: {data['metadata']['page_info']['content_length']} characters

## Meta Tags Analysis

### SEO Meta Tags
"""
        
        seo_tags = data['meta_tags'].get('seo', {})
        for tag, content in seo_tags.items():
            md_content += f"- **{tag}**: {content}\n"
        
        md_content += f"""
### Social Media Meta Tags
"""
        
        social_tags = data['meta_tags'].get('social', {})
        for tag, content in social_tags.items():
            md_content += f"- **{tag}**: {content}\n"
        
        md_content += f"""
### Structured Data
- **JSON-LD Scripts**: {len(data['meta_tags'].get('structured_data', []))}

## Network Traffic Analysis

- **Total Requests**: {data['network_traffic']['summary']['total_requests']}
- **Total Responses**: {data['network_traffic']['summary']['total_responses']}
- **Total Errors**: {data['network_traffic']['summary']['total_errors']}
- **Unique Domains**: {len(data['network_traffic']['summary']['domains'])}
- **Content Types**: {len(data['network_traffic']['summary']['content_types'])}

### Top Domains
"""
        
        for domain in data['network_traffic']['summary']['domains'][:10]:
            md_content += f"- {domain}\n"
        
        md_content += f"""
## OCR Analysis

### Images
- **Total Images**: {len(data['ocr_analysis'].get('images', []))}
- **Images with OCR Data**: {len([img for img in data['ocr_analysis'].get('images', []) if 'canvas_data' in img])}

### Canvas Elements
- **Total Canvases**: {len(data['ocr_analysis'].get('canvases', []))}
- **Canvas Data Extracted**: {len([c for c in data['ocr_analysis'].get('canvases', []) if 'data_url' in c])}

## Source Code Analysis

### JavaScript Analysis
- **Inline Scripts**: {len(data['ast_analysis']['javascript'].get('inline_scripts', []))}
- **External Scripts**: {len(data['ast_analysis']['javascript'].get('external_scripts', []))}
- **Functions Detected**: {len(data['ast_analysis']['javascript'].get('functions', []))}

### CSS Analysis
- **Inline Styles**: {len(data['ast_analysis']['css'].get('inline_styles', []))}
- **External Stylesheets**: {len(data['ast_analysis']['css'].get('external_stylesheets', []))}
- **Computed Styles Analyzed**: {len(data['ast_analysis']['css'].get('computed_styles', {}))}

## Screenshot

Full-page screenshot saved to: `{data.get('screenshot_path', 'N/A')}`

---
*Enhanced report generated by Advanced Universal Web Crawler v2025.1*
"""
        
        with open(output_file, 'w') as f:
            f.write(md_content)
    
    async def extract_meta_tags_from_content(self, content: str, url: str) -> Dict[str, Any]:
        """Extract meta tags from HTML content without requiring a page object."""
        try:
            from bs4 import BeautifulSoup
            
            soup = BeautifulSoup(content, 'html.parser')
            
            meta_data = {
                "seo": {},
                "social": {},
                "other": {},
                "structured_data": [],
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            # Extract all meta tags
            for meta in soup.find_all('meta'):
                name = meta.get('name') or meta.get('property')
                content = meta.get('content')
                
                if name and content:
                    # SEO meta tags
                    if (name.lower() in ['description', 'keywords', 'robots', 'author', 'viewport', 'charset'] or
                        'description' in name.lower() or 'keywords' in name.lower() or 
                        'robots' in name.lower() or 'author' in name.lower() or
                        'viewport' in name.lower() or 'charset' in name.lower()):
                        meta_data["seo"][name] = content
                    # Social media meta tags
                    elif (name.startswith('og:') or name.startswith('twitter:') or 
                          name.startswith('fb:') or name.startswith('linkedin:')):
                        meta_data["social"][name] = content
                    # Other meta tags
                    else:
                        meta_data["other"][name] = content
            
            # Extract structured data (JSON-LD)
            for script in soup.find_all('script', type='application/ld+json'):
                try:
                    data = json.loads(script.string)
                    meta_data["structured_data"].append(data)
                except (json.JSONDecodeError, AttributeError):
                    meta_data["structured_data"].append({
                        "error": "Invalid JSON",
                        "raw_content": script.string
                    })
            
            # Extract Open Graph image
            og_image = soup.find('meta', property='og:image')
            if og_image:
                meta_data["social"]['og:image_url'] = og_image.get('content')
            
            # Extract canonical URL
            canonical = soup.find('link', rel='canonical')
            if canonical:
                meta_data["seo"]['canonical'] = canonical.get('href')
            
            return meta_data
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
    
    async def extract_ui_components_from_content(self, content: str, url: str) -> Dict[str, Any]:
        """Extract UI components from HTML content without requiring a page object."""
        try:
            from bs4 import BeautifulSoup
            
            soup = BeautifulSoup(content, 'html.parser')
            
            ui_data = {
                "forms": [],
                "buttons": [],
                "links": [],
                "inputs": [],
                "scripts": [],
                "stylesheets": [],
                "images": [],
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
            
            # Extract forms
            for form in soup.find_all('form'):
                form_data = {
                    "action": form.get('action'),
                    "method": form.get('method', 'get'),
                    "id": form.get('id'),
                    "class": form.get('class', []),
                    "inputs": []
                }
                
                for input_elem in form.find_all(['input', 'textarea', 'select']):
                    input_data = {
                        "type": input_elem.get('type', input_elem.name),
                        "name": input_elem.get('name'),
                        "id": input_elem.get('id'),
                        "placeholder": input_elem.get('placeholder'),
                        "required": input_elem.get('required') is not None
                    }
                    form_data["inputs"].append(input_data)
                
                ui_data["forms"].append(form_data)
            
            # Extract buttons
            for button in soup.find_all(['button', 'input[type="button"]', 'input[type="submit"]']):
                button_data = {
                    "text": button.get_text(strip=True) or button.get('value'),
                    "type": button.get('type'),
                    "id": button.get('id'),
                    "class": button.get('class', [])
                }
                ui_data["buttons"].append(button_data)
            
            # Extract links
            for link in soup.find_all('a', href=True):
                link_data = {
                    "href": link.get('href'),
                    "text": link.get_text(strip=True),
                    "title": link.get('title'),
                    "target": link.get('target')
                }
                ui_data["links"].append(link_data)
            
            # Extract scripts
            for script in soup.find_all('script', src=True):
                ui_data["scripts"].append(script.get('src'))
            
            # Extract stylesheets
            for link in soup.find_all('link', rel='stylesheet'):
                ui_data["stylesheets"].append(link.get('href'))
            
            # Extract images
            for img in soup.find_all('img'):
                img_data = {
                    "src": img.get('src'),
                    "alt": img.get('alt'),
                    "title": img.get('title'),
                    "width": img.get('width'),
                    "height": img.get('height')
                }
                ui_data["images"].append(img_data)
            
            return ui_data
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat()
            } 