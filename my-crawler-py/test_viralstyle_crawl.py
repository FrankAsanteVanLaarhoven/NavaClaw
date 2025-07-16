#!/usr/bin/env python3
"""
ViralStyle.com Comprehensive Crawl Test
Tests our enterprise-grade universal web crawler with all features.
"""

import asyncio
import json
import time
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

# Import our enterprise components
from my_crawler_py.providers import CrawlRequest, ProviderType, create_provider, get_best_provider
from my_crawler_py.providers.provider_factory import register_provider
from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
from my_crawler_py.compliance import ComplianceManager
from my_crawler_py.rag.pipeline import RAGConfig, RAGPipeline


class ViralStyleCrawler:
    """Comprehensive crawler for ViralStyle.com testing."""
    
    def __init__(self):
        self.results = []
        self.start_time = time.time()
        self.output_dir = Path("viralstyle_crawl_results")
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize providers
        self.setup_providers()
        
        # Initialize enhanced extraction
        self.extractor = EnhancedDataExtractor()
        
        # Initialize compliance
        self.compliance = ComplianceManager()
        
        # Initialize RAG (if OpenAI key available)
        self.rag = None
        self.setup_rag()
    
    def setup_providers(self):
        """Setup all available providers."""
        print("🔧 Setting up providers...")
        
        # Create providers
        playwright_provider = create_provider(ProviderType.PLAYWRIGHT, headless=True)
        
        # Register providers
        register_provider("playwright", playwright_provider, {"type": "local"})
        
        print("✅ Providers setup complete")
    
    def setup_rag(self):
        """Setup RAG pipeline if OpenAI key is available."""
        try:
            import os
            openai_key = os.getenv("OPENAI_API_KEY")
            if openai_key:
                config = RAGConfig(
                    llm_model="gpt-3.5-turbo",
                    embedding_model="text-embedding-ada-002",
                    vector_store_type="chroma",
                    vector_store_path="./viralstyle_vector_store"
                )
                self.rag = RAGPipeline(config, openai_key)
                print("✅ RAG pipeline initialized")
            else:
                print("⚠️  OpenAI API key not found, RAG disabled")
        except Exception as e:
            print(f"⚠️  RAG setup failed: {e}")
    
    async def crawl_viralstyle(self):
        """Main crawl function for ViralStyle.com."""
        print("🚀 Starting ViralStyle.com comprehensive crawl...")
        
                # Define URLs to crawl - using more reliable URLs
        urls = [
            "https://viralstyle.com/",
            "https://viralstyle.com/shop",
            "https://viralstyle.com/designs",
            "https://viralstyle.com/help",
            "https://viralstyle.com/terms"
        ]
        
        # Get best provider
        provider_name = get_best_provider({
            "javascript": True,
            "screenshots": True,
            "anti_bot": False,
            "max_cost_per_request": 0.01
        })
        
        if not provider_name:
            provider_name = "playwright"  # Fallback to local provider
        
        print(f"🎯 Using provider: {provider_name}")
        
        # Crawl each URL
        for url in urls:
            print(f"\n📡 Crawling: {url}")
            await self.crawl_single_url(url, provider_name)
        
        # Generate comprehensive report
        await self.generate_report()
        
        print(f"\n✅ Crawl completed in {time.time() - self.start_time:.2f} seconds")
    
    async def crawl_single_url(self, url: str, provider_name: str):
        """Crawl a single URL with all extraction layers."""
        try:
            # Create crawl request
            request = CrawlRequest(
                url=url,
                provider=ProviderType.PLAYWRIGHT,
                options={},
                javascript=True,
                screenshot=True,
                timeout=60,
                wait_for="body",  # Wait for body to load
                retry_count=2
            )
            
            # Get provider and crawl
            provider = create_provider(ProviderType.PLAYWRIGHT, headless=True)
            response = await provider.fetch(request)
            
            if response.error:
                print(f"❌ Error crawling {url}: {response.error}")
                return
            
            print(f"✅ Successfully crawled {url} (Status: {response.status_code})")
            
            # Enhanced extraction
            extraction_result = await self.extract_data(response)
            
            # Add to results
            result = {
                "url": url,
                "timestamp": datetime.now().isoformat(),
                "status_code": response.status_code,
                "provider": provider_name,
                "content_length": len(response.content),
                "headers_count": len(response.headers),
                "cookies_count": len(response.cookies),
                "extraction": extraction_result,
                "metadata": response.metadata
            }
            
            self.results.append(result)
            
            # Add to RAG if available
            if self.rag:
                try:
                    await self.rag.add_crawl_response(response)
                    print(f"📚 Added to RAG vector store")
                except Exception as e:
                    print(f"⚠️  RAG addition failed: {e}")
            
            # Save individual result
            self.save_individual_result(url, result)
            
        except Exception as e:
            print(f"❌ Exception crawling {url}: {e}")
    
    async def extract_data(self, response) -> Dict[str, Any]:
        """Extract comprehensive data from response."""
        print("🔍 Performing enhanced extraction...")
        
        extraction_result = {}
        
        try:
            # Basic extraction
            extraction_result["basic"] = {
                "title": self.extract_title(response.content),
                "meta_tags": self.extract_meta_tags(response.content),
                "links": self.extract_links(response.content),
                "images": self.extract_images(response.content)
            }
            
            # Enhanced extraction using our module
            # Note: Enhanced extraction requires Playwright page object, not raw response
            # For now, we'll skip enhanced extraction in this test and focus on basic extraction
            enhanced_data = {
                "note": "Enhanced extraction requires Playwright page object. Skipped in this test.",
                "timestamp": datetime.now().isoformat()
            }
            
            extraction_result["enhanced"] = enhanced_data
            
            print(f"✅ Extracted {len(extraction_result['basic']['links'])} links, {len(extraction_result['basic']['images'])} images")
            
        except Exception as e:
            print(f"⚠️  Extraction error: {e}")
            extraction_result["error"] = str(e)
        
        return extraction_result
    
    def extract_title(self, content: str) -> str:
        """Extract page title."""
        try:
            from bs4 import BeautifulSoup
            # Handle both string and bytes content
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
            # Handle both string and bytes content
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
            # Handle both string and bytes content
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
            
            return list(set(links))  # Remove duplicates
        except Exception as e:
            print(f"Links extraction error: {e}")
            return []
    
    def extract_images(self, content: str) -> List[str]:
        """Extract all images."""
        try:
            from bs4 import BeautifulSoup
            # Handle both string and bytes content
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
            
            return list(set(images))  # Remove duplicates
        except Exception as e:
            print(f"Images extraction error: {e}")
            return []
    
    def save_individual_result(self, url: str, result: Dict[str, Any]):
        """Save individual crawl result."""
        # Create safe filename
        safe_url = url.replace('https://', '').replace('http://', '').replace('/', '_').replace('?', '_').replace('&', '_')
        filename = f"{safe_url}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        filepath = self.output_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved individual result: {filename}")
    
    async def generate_report(self):
        """Generate comprehensive report."""
        print("\n📊 Generating comprehensive report...")
        
        # Create summary
        summary = {
            "crawl_info": {
                "total_urls": len(self.results),
                "successful_crawls": len([r for r in self.results if r["status_code"] == 200]),
                "failed_crawls": len([r for r in self.results if r["status_code"] != 200]),
                "total_content_size": sum(r["content_length"] for r in self.results),
                "crawl_duration": time.time() - self.start_time,
                "timestamp": datetime.now().isoformat()
            },
            "extraction_summary": {
                "total_links": sum(len(r["extraction"]["basic"]["links"]) for r in self.results),
                "total_images": sum(len(r["extraction"]["basic"]["images"]) for r in self.results),
                "total_meta_tags": sum(len(r["extraction"]["basic"]["meta_tags"]) for r in self.results)
            },
            "results": self.results
        }
        
        # Save comprehensive report
        report_file = self.output_dir / "comprehensive_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)
        
        # Generate markdown report
        await self.generate_markdown_report(summary)
        
        # Generate CSV report
        await self.generate_csv_report(summary)
        
        print(f"📄 Reports saved to: {self.output_dir}")
    
    async def generate_markdown_report(self, summary: Dict[str, Any]):
        """Generate markdown report."""
        report_file = self.output_dir / "viralstyle_report.md"
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("# ViralStyle.com Crawl Report\n\n")
            f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            # Crawl Summary
            f.write("## Crawl Summary\n\n")
            f.write(f"- **Total URLs Crawled:** {summary['crawl_info']['total_urls']}\n")
            f.write(f"- **Successful Crawls:** {summary['crawl_info']['successful_crawls']}\n")
            f.write(f"- **Failed Crawls:** {summary['crawl_info']['failed_crawls']}\n")
            f.write(f"- **Total Content Size:** {summary['crawl_info']['total_content_size']:,} bytes\n")
            f.write(f"- **Crawl Duration:** {summary['crawl_info']['crawl_duration']:.2f} seconds\n\n")
            
            # Extraction Summary
            f.write("## Extraction Summary\n\n")
            f.write(f"- **Total Links Found:** {summary['extraction_summary']['total_links']}\n")
            f.write(f"- **Total Images Found:** {summary['extraction_summary']['total_images']}\n")
            f.write(f"- **Total Meta Tags:** {summary['extraction_summary']['total_meta_tags']}\n\n")
            
            # Detailed Results
            f.write("## Detailed Results\n\n")
            for result in summary['results']:
                f.write(f"### {result['url']}\n\n")
                f.write(f"- **Status Code:** {result['status_code']}\n")
                f.write(f"- **Provider:** {result['provider']}\n")
                f.write(f"- **Content Length:** {result['content_length']:,} bytes\n")
                f.write(f"- **Links:** {len(result['extraction']['basic']['links'])}\n")
                f.write(f"- **Images:** {len(result['extraction']['basic']['images'])}\n")
                f.write(f"- **Meta Tags:** {len(result['extraction']['basic']['meta_tags'])}\n")
                f.write(f"- **Title:** {result['extraction']['basic']['title']}\n\n")
                
                # Show some links
                if result['extraction']['basic']['links']:
                    f.write("**Sample Links:**\n")
                    for link in result['extraction']['basic']['links'][:5]:
                        f.write(f"- {link}\n")
                    f.write("\n")
    
    async def generate_csv_report(self, summary: Dict[str, Any]):
        """Generate CSV report."""
        import csv
        
        report_file = self.output_dir / "viralstyle_report.csv"
        
        with open(report_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # Header
            writer.writerow([
                'URL', 'Status Code', 'Provider', 'Content Length', 
                'Links Count', 'Images Count', 'Meta Tags Count', 'Title'
            ])
            
            # Data
            for result in summary['results']:
                writer.writerow([
                    result['url'],
                    result['status_code'],
                    result['provider'],
                    result['content_length'],
                    len(result['extraction']['basic']['links']),
                    len(result['extraction']['basic']['images']),
                    len(result['extraction']['basic']['meta_tags']),
                    result['extraction']['basic']['title']
                ])


async def main():
    """Main function to run the ViralStyle crawl test."""
    print("🎯 ViralStyle.com Enterprise Crawler Test")
    print("=" * 50)
    
    crawler = ViralStyleCrawler()
    await crawler.crawl_viralstyle()
    
    print("\n🎉 Test completed! Check the 'viralstyle_crawl_results' directory for detailed reports.")


if __name__ == "__main__":
    asyncio.run(main()) 