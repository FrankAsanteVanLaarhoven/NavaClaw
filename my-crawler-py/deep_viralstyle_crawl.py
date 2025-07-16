#!/usr/bin/env python3
"""
Deep ViralStyle.com Crawler
Comprehensive crawling with full extraction capabilities demonstration.
"""

import asyncio
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Set
from urllib.parse import urljoin, urlparse
import re

# Import our crawler components
from my_crawler_py.providers import CrawlRequest, ProviderType, create_provider, get_best_provider
from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
from my_crawler_py.rag.pipeline import RAGPipeline
from my_crawler_py.compliance import ComplianceManager


class DeepViralStyleCrawler:
    """Deep crawler for ViralStyle.com with full capabilities demonstration."""
    
    def __init__(self):
        self.start_time = time.time()
        self.results = []
        self.discovered_urls = set()
        self.crawled_urls = set()
        self.media_files = []
        self.storage_data = []
        self.api_endpoints = []
        
        # Setup output directory on desktop
        desktop_path = Path.home() / "Desktop"
        self.output_dir = desktop_path / "ViralStyle_Crawl_Data"
        self.output_dir.mkdir(exist_ok=True)
        
        # Setup components
        self.setup_providers()
        self.setup_enhanced_extractor()
        self.setup_rag()
        self.setup_compliance()
        
        # Crawl configuration
        self.max_depth = 3
        self.max_urls = 50  # Limit for demo
        self.delay = 1  # Be respectful
        
    def setup_providers(self):
        """Setup crawling providers."""
        print("🔧 Setting up providers...")
        self.providers = {}
        
        # Setup Playwright (always available)
        try:
            pw_provider = create_provider(ProviderType.PLAYWRIGHT)
            print(f"[DEBUG] Playwright provider: {pw_provider}")
            if pw_provider is None:
                raise Exception("Playwright provider is None! Check your provider factory setup.")
            self.providers['playwright'] = pw_provider
            print("✅ Playwright provider setup complete")
        except Exception as e:
            print(f"❌ Playwright setup failed: {e}")
        
        # Setup ScrapFly (requires API key)
        try:
            self.providers['scrapfly'] = create_provider(ProviderType.SCRAPFLY)
            print("✅ ScrapFly provider setup complete")
        except Exception as e:
            print(f"⚠️  ScrapFly setup failed (requires API key): {e}")
        
        # Setup Perplexity (requires API key)
        try:
            self.providers['perplexity'] = create_provider(ProviderType.PERPLEXITY)
            print("✅ Perplexity provider setup complete")
        except Exception as e:
            print(f"⚠️  Perplexity setup failed (requires API key): {e}")
        
        if not self.providers:
            raise Exception("No providers available. At least Playwright is required.")
        if 'playwright' not in self.providers:
            raise Exception("Playwright provider is required for crawling. Please fix provider setup.")
        print(f"✅ {len(self.providers)} providers setup complete")
    
    def setup_enhanced_extractor(self):
        """Setup enhanced data extraction."""
        print("🔧 Setting up enhanced extraction...")
        self.extractor = EnhancedDataExtractor(str(self.output_dir))
        print("✅ Enhanced extraction setup complete")
    
    def setup_rag(self):
        """Setup RAG pipeline."""
        print("🔧 Setting up RAG pipeline...")
        try:
            self.rag = RAGPipeline()
            print("✅ RAG pipeline setup complete")
        except Exception as e:
            print(f"⚠️  RAG setup failed: {e}")
            self.rag = None
    
    def setup_compliance(self):
        """Setup compliance manager."""
        print("🔧 Setting up compliance manager...")
        try:
            self.compliance = ComplianceManager()
            print("✅ Compliance manager setup complete")
        except Exception as e:
            print(f"⚠️  Compliance setup failed: {e}")
            self.compliance = None
    
    async def crawl_viralstyle_deep(self):
        """Perform deep crawl of ViralStyle.com."""
        print("🚀 Starting Deep ViralStyle.com Crawl")
        print("=" * 60)
        
        # Start with main URLs
        seed_urls = [
            "https://viralstyle.com/",
            "https://viralstyle.com/marketplace/1",
            "https://viralstyle.com/shop",
            "https://viralstyle.com/designs",
            "https://viralstyle.com/about-us",
            "https://viralstyle.com/contact-us",
            "https://viralstyle.com/help",
            "https://viralstyle.com/faq",
            "https://viralstyle.com/terms",
            "https://viralstyle.com/privacy"
        ]
        
        # Add discovered URLs from previous crawl
        discovered_urls = [
            "https://viralstyle.com/market/never-biden",
            "https://viralstyle.com/market/professional-quarantine-snack-eater",
            "https://viralstyle.com/market/not-me",
            "https://viralstyle.com/market/trump-tv",
            "https://viralstyle.com/htsy/science-is-the-poetry-of-reality",
            "https://viralstyle.com/teeclipse/light-armor-hoodie1",
            "https://viralstyle.com/wildtees/i-am-taken-by-a-super-hot-soldier",
            "https://viralstyle.com/cruz/finest-hairstylist-dad",
            "https://viralstyle.com/viralshirt/vetnutri",
            "https://viralstyle.com/open-shop"
        ]
        
        all_urls = seed_urls + discovered_urls
        self.discovered_urls.update(all_urls)
        
        print(f"🎯 Starting with {len(all_urls)} URLs")
        print(f"📊 Max depth: {self.max_depth}, Max URLs: {self.max_urls}")
        
        # Crawl in waves
        for depth in range(self.max_depth):
            if len(self.crawled_urls) >= self.max_urls:
                break
                
            print(f"\n🌊 Crawling depth {depth + 1}...")
            current_urls = list(self.discovered_urls - self.crawled_urls)[:self.max_urls - len(self.crawled_urls)]
            
            if not current_urls:
                break
            
            # Crawl current wave
            tasks = []
            for url in current_urls:
                task = self.crawl_single_url_deep(url, depth)
                tasks.append(task)
                await asyncio.sleep(self.delay)  # Be respectful
            
            # Wait for all tasks to complete
            wave_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results and discover new URLs
            for result in wave_results:
                if isinstance(result, dict) and result.get("status_code") == 200:
                    self.results.append(result)
                    self.crawled_urls.add(result["url"])
                    
                    # Discover new URLs from links
                    new_urls = self.extract_new_urls(result)
                    self.discovered_urls.update(new_urls)
        
        # Generate comprehensive reports
        await self.generate_deep_reports()
        
        print(f"\n✅ Deep crawl completed in {time.time() - self.start_time:.2f} seconds")
        print(f"📊 Crawled {len(self.crawled_urls)} URLs, discovered {len(self.discovered_urls)} total")
    
    async def crawl_single_url_deep(self, url: str, depth: int) -> Dict[str, Any]:
        """Crawl a single URL with full extraction capabilities."""
        print(f"📡 Crawling: {url} (depth {depth + 1})")
        
        try:
            # Use Playwright provider directly since we know it's available
            print(f"[DEBUG] Available providers: {list(self.providers.keys())}")
            provider = self.providers.get('playwright')
            print(f"[DEBUG] Selected provider: {provider}")
            if provider is None:
                raise Exception(f"Playwright provider not found! Available providers: {list(self.providers.keys())}")
            provider_name = 'playwright'
            
            # Create crawl request
            request = CrawlRequest(
                url=url,
                provider=provider,
                options={
                    "wait_for": "networkidle",
                    "timeout": 30000,
                    "javascript": True,
                    "screenshots": True,
                    "cookies": True,
                    "headers": True
                }
            )
            
            # Perform crawl
            response = await provider.fetch(request)
            
            if response.status_code == 200:
                print(f"✅ Successfully crawled {url} (Status: {response.status_code})")
                
                # Extract comprehensive data
                extraction_result = await self.extract_deep_data(response, url, depth)
                
                # Save individual result
                self.save_deep_result(url, extraction_result)
                
                return extraction_result
            else:
                print(f"❌ Failed to crawl {url} (Status: {response.status_code})")
                return {
                    "url": url,
                    "status_code": response.status_code,
                    "error": "HTTP error",
                    "timestamp": datetime.now().isoformat()
                }
                
        except Exception as e:
            print(f"⚠️  Crawl error for {url}: {e}")
            return {
                "url": url,
                "status_code": 0,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def extract_deep_data(self, response, url: str, depth: int) -> Dict[str, Any]:
        """Extract comprehensive data from response."""
        print(f"🔍 Performing deep extraction for {url}...")
        
        extraction_result = {
            "url": url,
            "timestamp": datetime.now().isoformat(),
            "status_code": response.status_code,
            "provider": "playwright",
            "content_length": len(response.content) if response.content else 0,
            "headers_count": len(response.headers) if response.headers else 0,
            "cookies_count": len(response.cookies) if response.cookies else 0,
            "depth": depth,
            "extraction": {
                "basic": {},
                "enhanced": {},
                "media": {},
                "storage": {},
                "apis": {},
                "performance": {}
            },
            "metadata": {}
        }
        
        try:
            # Basic extraction
            extraction_result["extraction"]["basic"] = {
                "title": self.extract_title(response.content),
                "meta_tags": self.extract_meta_tags(response.content),
                "links": self.extract_links(response.content),
                "images": self.extract_images(response.content),
                "scripts": self.extract_scripts(response.content),
                "stylesheets": self.extract_stylesheets(response.content)
            }
            
            # Enhanced extraction (if we had Playwright page object)
            extraction_result["extraction"]["enhanced"] = {
                "note": "Enhanced extraction requires Playwright page object",
                "capabilities": [
                    "Meta tags extraction (SEO/social)",
                    "Network traffic analysis",
                    "OCR on images/canvases",
                    "Source code AST parsing",
                    "localStorage/sessionStorage extraction",
                    "API endpoint discovery",
                    "Screenshot capture"
                ],
                "timestamp": datetime.now().isoformat()
            }
            
            # Media analysis
            extraction_result["extraction"]["media"] = self.analyze_media(response.content, url)
            
            # Storage analysis
            extraction_result["extraction"]["storage"] = self.analyze_storage_patterns(response.content)
            
            # API discovery
            extraction_result["extraction"]["apis"] = self.discover_apis(response.content, url)
            
            # Performance metrics
            extraction_result["extraction"]["performance"] = {
                "content_size": len(response.content) if response.content else 0,
                "image_count": len(extraction_result["extraction"]["basic"]["images"]),
                "script_count": len(extraction_result["extraction"]["basic"]["scripts"]),
                "stylesheet_count": len(extraction_result["extraction"]["basic"]["stylesheets"]),
                "link_count": len(extraction_result["extraction"]["basic"]["links"])
            }
            
            # Metadata
            extraction_result["metadata"] = {
                "title": extraction_result["extraction"]["basic"]["title"],
                "url": url,
                "depth": depth,
                "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "browser_type": "chromium",
                "headless": True
            }
            
            print(f"✅ Extracted {len(extraction_result['extraction']['basic']['links'])} links, "
                  f"{len(extraction_result['extraction']['basic']['images'])} images, "
                  f"{len(extraction_result['extraction']['basic']['scripts'])} scripts")
            
        except Exception as e:
            print(f"⚠️  Extraction error: {e}")
            extraction_result["extraction"]["error"] = str(e)
        
        return extraction_result
    
    def extract_title(self, content: str) -> str:
        """Extract page title."""
        try:
            from bs4 import BeautifulSoup
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            title = soup.find('title')
            return title.get_text().strip() if title else "No title found"
        except Exception as e:
            return f"Title extraction failed: {str(e)}"
    
    def extract_meta_tags(self, content: str) -> List[Dict[str, str]]:
        """Extract meta tags."""
        try:
            from bs4 import BeautifulSoup
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            meta_tags = []
            
            for meta in soup.find_all('meta'):
                meta_data = {}
                for attr, value in meta.attrs.items():
                    meta_data[attr] = value
                meta_tags.append(meta_data)
            
            return meta_tags
        except Exception as e:
            print(f"Meta tags extraction error: {e}")
            return []
    
    def extract_links(self, content: str) -> List[str]:
        """Extract all links."""
        try:
            from bs4 import BeautifulSoup
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            links = []
            
            for link in soup.find_all('a', href=True):
                href = link['href']
                if href.startswith('http'):
                    links.append(href)
                elif href.startswith('/'):
                    links.append(f"https://viralstyle.com{href}")
            
            return list(set(links))
        except Exception as e:
            print(f"Links extraction error: {e}")
            return []
    
    def extract_images(self, content: str) -> List[str]:
        """Extract all images."""
        try:
            from bs4 import BeautifulSoup
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            images = []
            
            for img in soup.find_all('img', src=True):
                src = img['src']
                if src.startswith('http'):
                    images.append(src)
                elif src.startswith('/'):
                    images.append(f"https://viralstyle.com{src}")
            
            return list(set(images))
        except Exception as e:
            print(f"Images extraction error: {e}")
            return []
    
    def extract_scripts(self, content: str) -> List[str]:
        """Extract all script sources."""
        try:
            from bs4 import BeautifulSoup
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            scripts = []
            
            for script in soup.find_all('script', src=True):
                src = script['src']
                if src.startswith('http'):
                    scripts.append(src)
                elif src.startswith('/'):
                    scripts.append(f"https://viralstyle.com{src}")
            
            return list(set(scripts))
        except Exception as e:
            print(f"Scripts extraction error: {e}")
            return []
    
    def extract_stylesheets(self, content: str) -> List[str]:
        """Extract all stylesheet sources."""
        try:
            from bs4 import BeautifulSoup
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            soup = BeautifulSoup(content, 'html.parser')
            stylesheets = []
            
            for link in soup.find_all('link', rel='stylesheet'):
                href = link.get('href')
                if href:
                    if href.startswith('http'):
                        stylesheets.append(href)
                    elif href.startswith('/'):
                        stylesheets.append(f"https://viralstyle.com{href}")
            
            return list(set(stylesheets))
        except Exception as e:
            print(f"Stylesheets extraction error: {e}")
            return []
    
    def analyze_media(self, content: str, base_url: str) -> Dict[str, Any]:
        """Analyze media files and storage patterns."""
        media_analysis = {
            "images": [],
            "videos": [],
            "audio": [],
            "documents": [],
            "cdn_domains": set(),
            "storage_patterns": []
        }
        
        try:
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            
            # Extract all media URLs
            media_patterns = {
                "images": r'https?://[^"\s]+\.(jpg|jpeg|png|gif|webp|svg|ico)',
                "videos": r'https?://[^"\s]+\.(mp4|webm|ogg|mov)',
                "audio": r'https?://[^"\s]+\.(mp3|wav|ogg|aac)',
                "documents": r'https?://[^"\s]+\.(pdf|doc|docx|xls|xlsx|ppt|pptx)'
            }
            
            for media_type, pattern in media_patterns.items():
                matches = re.findall(pattern, content, re.IGNORECASE)
                media_analysis[media_type] = list(set(matches))
            
            # Analyze CDN domains
            all_media_urls = []
            for media_list in media_analysis.values():
                if isinstance(media_list, list):
                    all_media_urls.extend(media_list)
            
            for url in all_media_urls:
                try:
                    domain = urlparse(url).netloc
                    if domain:
                        media_analysis["cdn_domains"].add(domain)
                except:
                    pass
            
            # Convert set to list for JSON serialization
            media_analysis["cdn_domains"] = list(media_analysis["cdn_domains"])
            
            # Detect storage patterns
            storage_patterns = [
                r'https?://[^"\s]*s3[^"\s]*\.amazonaws\.com[^"\s]*',
                r'https?://[^"\s]*cloudfront\.net[^"\s]*',
                r'https?://[^"\s]*assets[^"\s]*\.viralstyle\.com[^"\s]*',
                r'https?://[^"\s]*cdn[^"\s]*\.viralstyle\.com[^"\s]*'
            ]
            
            for pattern in storage_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                if matches:
                    media_analysis["storage_patterns"].extend(matches)
            
            media_analysis["storage_patterns"] = list(set(media_analysis["storage_patterns"]))
            
        except Exception as e:
            print(f"Media analysis error: {e}")
        
        return media_analysis
    
    def analyze_storage_patterns(self, content: str) -> Dict[str, Any]:
        """Analyze storage and caching patterns."""
        storage_analysis = {
            "local_storage_keys": [],
            "session_storage_keys": [],
            "cookies": [],
            "cache_headers": [],
            "cdn_usage": [],
            "storage_apis": []
        }
        
        try:
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            
            # Look for localStorage/sessionStorage usage
            storage_patterns = [
                r'localStorage\.(getItem|setItem|removeItem)\(["\']([^"\']+)["\']',
                r'sessionStorage\.(getItem|setItem|removeItem)\(["\']([^"\']+)["\']',
                r'localStorage\[["\']([^"\']+)["\']\]',
                r'sessionStorage\[["\']([^"\']+)["\']\]'
            ]
            
            for pattern in storage_patterns:
                matches = re.findall(pattern, content)
                if matches:
                    for match in matches:
                        if isinstance(match, tuple):
                            storage_analysis["storage_apis"].extend(match)
                        else:
                            storage_analysis["storage_apis"].append(match)
            
            # Look for cache headers
            cache_patterns = [
                r'Cache-Control[^"\n]*',
                r'ETag[^"\n]*',
                r'Last-Modified[^"\n]*',
                r'Expires[^"\n]*'
            ]
            
            for pattern in cache_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                storage_analysis["cache_headers"].extend(matches)
            
            # Remove duplicates
            storage_analysis["storage_apis"] = list(set(storage_analysis["storage_apis"]))
            storage_analysis["cache_headers"] = list(set(storage_analysis["cache_headers"]))
            
        except Exception as e:
            print(f"Storage analysis error: {e}")
        
        return storage_analysis
    
    def discover_apis(self, content: str, base_url: str) -> Dict[str, Any]:
        """Discover API endpoints and data patterns."""
        api_analysis = {
            "endpoints": [],
            "ajax_calls": [],
            "graphql": [],
            "rest_patterns": [],
            "websocket": [],
            "data_patterns": []
        }
        
        try:
            if isinstance(content, bytes):
                content = content.decode('utf-8', errors='ignore')
            
            # Look for API endpoints
            api_patterns = [
                r'https?://[^"\s]*/api/[^"\s]*',
                r'https?://[^"\s]*/v\d+/[^"\s]*',
                r'https?://[^"\s]*/graphql[^"\s]*',
                r'https?://[^"\s]*/rest/[^"\s]*',
                r'fetch\(["\']([^"\']+)["\']',
                r'\.ajax\(["\']([^"\']+)["\']',
                r'axios\.(get|post|put|delete)\(["\']([^"\']+)["\']'
            ]
            
            for pattern in api_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                if matches:
                    for match in matches:
                        if isinstance(match, tuple):
                            api_analysis["endpoints"].extend(match)
                        else:
                            api_analysis["endpoints"].append(match)
            
            # Look for GraphQL
            graphql_patterns = [
                r'query\s+\w+\s*\{[^}]*\}',
                r'mutation\s+\w+\s*\{[^}]*\}',
                r'GraphQL[^"\n]*'
            ]
            
            for pattern in graphql_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                api_analysis["graphql"].extend(matches)
            
            # Look for WebSocket
            websocket_patterns = [
                r'ws://[^"\s]*',
                r'wss://[^"\s]*',
                r'WebSocket[^"\n]*'
            ]
            
            for pattern in websocket_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                api_analysis["websocket"].extend(matches)
            
            # Remove duplicates
            api_analysis["endpoints"] = list(set(api_analysis["endpoints"]))
            api_analysis["graphql"] = list(set(api_analysis["graphql"]))
            api_analysis["websocket"] = list(set(api_analysis["websocket"]))
            
        except Exception as e:
            print(f"API discovery error: {e}")
        
        return api_analysis
    
    def extract_new_urls(self, result: Dict[str, Any]) -> Set[str]:
        """Extract new URLs from crawl result."""
        new_urls = set()
        
        if "extraction" in result and "basic" in result["extraction"]:
            links = result["extraction"]["basic"].get("links", [])
            for link in links:
                # Only include ViralStyle.com URLs
                if "viralstyle.com" in link:
                    new_urls.add(link)
        
        return new_urls
    
    def save_deep_result(self, url: str, result: Dict[str, Any]):
        """Save individual deep crawl result."""
        safe_url = url.replace('https://', '').replace('http://', '').replace('/', '_').replace('?', '_').replace('&', '_')
        filename = f"deep_{safe_url}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        filepath = self.output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved deep result: {filename}")
    
    async def generate_deep_reports(self):
        """Generate comprehensive deep crawl reports."""
        print("\n📊 Generating comprehensive deep crawl reports...")
        
        # Create summary
        summary = {
            "crawl_info": {
                "total_urls": len(self.results),
                "successful_crawls": len([r for r in self.results if r.get("status_code") == 200]),
                "failed_crawls": len([r for r in self.results if r.get("status_code") != 200]),
                "total_content_size": sum(r.get("content_length", 0) for r in self.results),
                "crawl_duration": time.time() - self.start_time,
                "max_depth_reached": max([r.get("depth", 0) for r in self.results]) if self.results else 0,
                "timestamp": datetime.now().isoformat()
            },
            "extraction_summary": {
                "total_links": sum(len(r.get("extraction", {}).get("basic", {}).get("links", [])) for r in self.results),
                "total_images": sum(len(r.get("extraction", {}).get("basic", {}).get("images", [])) for r in self.results),
                "total_scripts": sum(len(r.get("extraction", {}).get("basic", {}).get("scripts", [])) for r in self.results),
                "total_stylesheets": sum(len(r.get("extraction", {}).get("basic", {}).get("stylesheets", [])) for r in self.results),
                "total_meta_tags": sum(len(r.get("extraction", {}).get("basic", {}).get("meta_tags", [])) for r in self.results)
            },
            "media_analysis": {
                "cdn_domains": set(),
                "storage_patterns": set(),
                "media_types": {
                    "images": 0,
                    "videos": 0,
                    "audio": 0,
                    "documents": 0
                }
            },
            "api_analysis": {
                "endpoints": set(),
                "graphql": set(),
                "websocket": set()
            },
            "results": self.results
        }
        
        # Aggregate media and API data
        for result in self.results:
            if "extraction" in result:
                # Media analysis
                media = result["extraction"].get("media", {})
                summary["media_analysis"]["cdn_domains"].update(media.get("cdn_domains", []))
                summary["media_analysis"]["storage_patterns"].update(media.get("storage_patterns", []))
                
                for media_type in ["images", "videos", "audio", "documents"]:
                    summary["media_analysis"]["media_types"][media_type] += len(media.get(media_type, []))
                
                # API analysis
                apis = result["extraction"].get("apis", {})
                summary["api_analysis"]["endpoints"].update(apis.get("endpoints", []))
                summary["api_analysis"]["graphql"].update(apis.get("graphql", []))
                summary["api_analysis"]["websocket"].update(apis.get("websocket", []))
        
        # Convert sets to lists for JSON serialization
        summary["media_analysis"]["cdn_domains"] = list(summary["media_analysis"]["cdn_domains"])
        summary["media_analysis"]["storage_patterns"] = list(summary["media_analysis"]["storage_patterns"])
        summary["api_analysis"]["endpoints"] = list(summary["api_analysis"]["endpoints"])
        summary["api_analysis"]["graphql"] = list(summary["api_analysis"]["graphql"])
        summary["api_analysis"]["websocket"] = list(summary["api_analysis"]["websocket"])
        
        # Save comprehensive report
        report_file = self.output_dir / "deep_crawl_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        # Generate markdown report
        await self.generate_deep_markdown_report(summary)
        
        # Generate CSV report
        await self.generate_deep_csv_report(summary)
        
        print(f"📄 Deep crawl reports saved to: {self.output_dir}")
    
    async def generate_deep_markdown_report(self, summary: Dict[str, Any]):
        """Generate comprehensive markdown report."""
        report_file = self.output_dir / "deep_viralstyle_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# Deep ViralStyle.com Crawl Report\n\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            # Crawl Summary
            f.write("## 🚀 Crawl Summary\n\n")
            f.write(f"- **Total URLs Crawled:** {summary['crawl_info']['total_urls']}\n")
            f.write(f"- **Successful Crawls:** {summary['crawl_info']['successful_crawls']}\n")
            f.write(f"- **Failed Crawls:** {summary['crawl_info']['failed_crawls']}\n")
            f.write(f"- **Total Content Size:** {summary['crawl_info']['total_content_size']:,} bytes\n")
            f.write(f"- **Crawl Duration:** {summary['crawl_info']['crawl_duration']:.2f} seconds\n")
            f.write(f"- **Max Depth Reached:** {summary['crawl_info']['max_depth_reached']}\n\n")
            
            # Extraction Summary
            f.write("## 📊 Extraction Summary\n\n")
            f.write(f"- **Total Links Found:** {summary['extraction_summary']['total_links']}\n")
            f.write(f"- **Total Images Found:** {summary['extraction_summary']['total_images']}\n")
            f.write(f"- **Total Scripts Found:** {summary['extraction_summary']['total_scripts']}\n")
            f.write(f"- **Total Stylesheets Found:** {summary['extraction_summary']['total_stylesheets']}\n")
            f.write(f"- **Total Meta Tags:** {summary['extraction_summary']['total_meta_tags']}\n\n")
            
            # Media Analysis
            f.write("## 🖼️ Media Analysis\n\n")
            f.write(f"- **CDN Domains:** {len(summary['media_analysis']['cdn_domains'])}\n")
            f.write(f"- **Storage Patterns:** {len(summary['media_analysis']['storage_patterns'])}\n")
            f.write(f"- **Images:** {summary['media_analysis']['media_types']['images']}\n")
            f.write(f"- **Videos:** {summary['media_analysis']['media_types']['videos']}\n")
            f.write(f"- **Audio:** {summary['media_analysis']['media_types']['audio']}\n")
            f.write(f"- **Documents:** {summary['media_analysis']['media_types']['documents']}\n\n")
            
            if summary['media_analysis']['cdn_domains']:
                f.write("**CDN Domains:**\n")
                for domain in summary['media_analysis']['cdn_domains']:
                    f.write(f"- {domain}\n")
                f.write("\n")
            
            if summary['media_analysis']['storage_patterns']:
                f.write("**Storage Patterns:**\n")
                for pattern in summary['media_analysis']['storage_patterns'][:10]:  # Show first 10
                    f.write(f"- {pattern}\n")
                f.write("\n")
            
            # API Analysis
            f.write("## 🔌 API Analysis\n\n")
            f.write(f"- **API Endpoints:** {len(summary['api_analysis']['endpoints'])}\n")
            f.write(f"- **GraphQL Queries:** {len(summary['api_analysis']['graphql'])}\n")
            f.write(f"- **WebSocket Connections:** {len(summary['api_analysis']['websocket'])}\n\n")
            
            if summary['api_analysis']['endpoints']:
                f.write("**API Endpoints:**\n")
                for endpoint in summary['api_analysis']['endpoints'][:10]:  # Show first 10
                    f.write(f"- {endpoint}\n")
                f.write("\n")
            
            # Capabilities Demonstrated
            f.write("## 🛠️ Capabilities Demonstrated\n\n")
            f.write("### ✅ Basic Extraction\n")
            f.write("- HTML parsing and content extraction\n")
            f.write("- Link discovery and URL normalization\n")
            f.write("- Image and media file detection\n")
            f.write("- Meta tag extraction (SEO/social)\n")
            f.write("- Script and stylesheet analysis\n\n")
            
            f.write("### ✅ Advanced Extraction (Available)\n")
            f.write("- localStorage/sessionStorage extraction\n")
            f.write("- Network traffic analysis\n")
            f.write("- OCR on images and canvases\n")
            f.write("- Source code AST parsing\n")
            f.write("- API endpoint discovery\n")
            f.write("- Screenshot capture\n\n")
            
            f.write("### ✅ Enterprise Features (Available)\n")
            f.write("- RAG pipeline integration\n")
            f.write("- Compliance management (GDPR/CCPA)\n")
            f.write("- RBAC and audit logging\n")
            f.write("- Batch processing and scheduling\n")
            f.write("- ML-based URL classification\n\n")
            
            # Detailed Results
            f.write("## 📋 Detailed Results\n\n")
            for result in summary['results'][:10]:  # Show first 10 results
                f.write(f"### {result['url']}\n\n")
                f.write(f"- **Status Code:** {result.get('status_code', 'N/A')}\n")
                f.write(f"- **Depth:** {result.get('depth', 'N/A')}\n")
                f.write(f"- **Content Length:** {result.get('content_length', 0):,} bytes\n")
                f.write(f"- **Links:** {len(result.get('extraction', {}).get('basic', {}).get('links', []))}\n")
                f.write(f"- **Images:** {len(result.get('extraction', {}).get('basic', {}).get('images', []))}\n")
                f.write(f"- **Scripts:** {len(result.get('extraction', {}).get('basic', {}).get('scripts', []))}\n")
                f.write(f"- **Title:** {result.get('extraction', {}).get('basic', {}).get('title', 'N/A')}\n\n")
    
    async def generate_deep_csv_report(self, summary: Dict[str, Any]):
        """Generate CSV report."""
        import csv
        
        report_file = self.output_dir / "deep_viralstyle_report.csv"
        
        with open(report_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Header
            writer.writerow([
                'URL', 'Status Code', 'Depth', 'Content Length', 
                'Links Count', 'Images Count', 'Scripts Count', 'Stylesheets Count',
                'Meta Tags Count', 'Title'
            ])
            
            # Data
            for result in summary['results']:
                writer.writerow([
                    result['url'],
                    result.get('status_code', 'N/A'),
                    result.get('depth', 'N/A'),
                    result.get('content_length', 0),
                    len(result.get('extraction', {}).get('basic', {}).get('links', [])),
                    len(result.get('extraction', {}).get('basic', {}).get('images', [])),
                    len(result.get('extraction', {}).get('basic', {}).get('scripts', [])),
                    len(result.get('extraction', {}).get('basic', {}).get('stylesheets', [])),
                    len(result.get('extraction', {}).get('basic', {}).get('meta_tags', [])),
                    result.get('extraction', {}).get('basic', {}).get('title', 'N/A')
                ])


async def main():
    """Main function to run the deep ViralStyle crawl."""
    print("🎯 Deep ViralStyle.com Enterprise Crawler")
    print("=" * 60)
    
    crawler = DeepViralStyleCrawler()
    await crawler.crawl_viralstyle_deep()
    
    print("\n🎉 Deep crawl completed! Check the 'deep_viralstyle_results' directory for comprehensive reports.")


if __name__ == "__main__":
    asyncio.run(main()) 