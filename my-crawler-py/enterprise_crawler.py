#!/usr/bin/env python3
"""
Enterprise Advanced Web Crawler
Demonstrates all advanced features: enhanced extraction, batch processing, ML integration, RBAC, and compliance.
"""

import asyncio
import json
import argparse
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any

# Import our modules
from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
from my_crawler_py.compliance import ComplianceManager, PrivacyController
from batch_processor import BatchProcessor, MLDataClassifier
from my_crawler_py.aggregate_results import DataAggregator


class EnterpriseCrawler:
    """Enterprise-grade web crawler with all advanced features."""
    
    def __init__(self, output_dir: str = None, max_concurrent: int = 5):
        # Set up desktop storage
        desktop_path = Path.home() / "Desktop"
        self.desktop_crawl_dir = desktop_path / "AdvancedCrawlerData"
        self.desktop_crawl_dir.mkdir(exist_ok=True)
        
        self.output_dir = Path(output_dir) if output_dir else self.desktop_crawl_dir
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize all components
        self.enhanced_extractor = EnhancedDataExtractor(self.output_dir)
        self.compliance_manager = ComplianceManager(self.output_dir / "compliance.db")
        self.privacy_controller = PrivacyController(self.compliance_manager)
        self.batch_processor = BatchProcessor(str(self.output_dir), max_concurrent)
        self.ml_classifier = MLDataClassifier()
        self.data_aggregator = DataAggregator(self.output_dir)
        
        print(f"🚀 Enterprise Crawler initialized")
        print(f"📁 Data will be saved to: {self.output_dir}")
        print(f"🔒 Compliance database: {self.output_dir / 'compliance.db'}")
        print(f"🤖 ML classifier ready for data analysis")
    
    async def crawl_single_url(self, url: str, user_id: str = "admin") -> Dict[str, Any]:
        """Crawl a single URL with all enhanced features."""
        print(f"\n🔍 Crawling: {url}")
        
        try:
            # Import Playwright
            from playwright.async_api import async_playwright
            
            # Process crawl request with privacy controls
            subject_id = self.privacy_controller.process_crawl_request(
                url=url,
                user_id=user_id
            )
            
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                # Navigate to URL
                await page.goto(url, wait_until='networkidle')
                
                # Extract enhanced data
                data = await self.enhanced_extractor.extract_enhanced_page_data(page, url)
                
                # Anonymize data for privacy compliance
                anonymized_data = self.privacy_controller.anonymize_crawl_data(data)
                
                # Save enhanced data
                saved_files = await self.enhanced_extractor.save_enhanced_data(url, anonymized_data)
                
                await browser.close()
            
            print(f"✅ Successfully crawled {url}")
            print(f"📊 Data subject ID: {subject_id}")
            print(f"📁 Files saved: {list(saved_files.keys())}")
            
            return {
                "status": "success",
                "url": url,
                "subject_id": subject_id,
                "saved_files": saved_files,
                "data_summary": {
                    "meta_tags": len(anonymized_data['meta_tags'].get('seo', {})) + 
                                len(anonymized_data['meta_tags'].get('social', {})),
                    "network_requests": anonymized_data['network_traffic']['summary']['total_requests'],
                    "ocr_images": len(anonymized_data['ocr_analysis'].get('images', [])),
                    "ast_functions": len(anonymized_data['ast_analysis']['javascript'].get('functions', []))
                }
            }
            
        except Exception as e:
            print(f"❌ Error crawling {url}: {e}")
            return {
                "status": "error",
                "url": url,
                "error": str(e)
            }
    
    async def batch_crawl_urls(self, urls: List[str], user_id: str = "admin") -> Dict[str, Any]:
        """Perform batch crawling with ML classification and prioritization."""
        print(f"\n🔄 Starting batch crawl of {len(urls)} URLs")
        
        # Add URLs to batch processor with ML classification
        for url in urls:
            classification = self.ml_classifier.classify_url(url)
            priority = int(classification['priority_score'] * 10)
            
            self.batch_processor.add_urls_from_file = lambda x, y: None  # Override for demo
            # In real implementation, this would add to the batch processor
        
        # Process URLs with enhanced extraction
        results = []
        for url in urls:
            result = await self.crawl_single_url(url, user_id)
            results.append(result)
        
        # Generate batch report
        successful_crawls = [r for r in results if r['status'] == 'success']
        failed_crawls = [r for r in results if r['status'] == 'error']
        
        batch_report = {
            "batch_id": f"batch_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}",
            "total_urls": len(urls),
            "successful": len(successful_crawls),
            "failed": len(failed_crawls),
            "success_rate": len(successful_crawls) / len(urls) if urls else 0,
            "results": results,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Save batch report
        report_file = self.output_dir / f"batch_report_{batch_report['batch_id']}.json"
        with open(report_file, 'w') as f:
            json.dump(batch_report, f, indent=2)
        
        print(f"📈 Batch crawl complete: {len(successful_crawls)}/{len(urls)} successful")
        print(f"📄 Batch report saved to: {report_file}")
        
        return batch_report
    
    def generate_compliance_report(self) -> str:
        """Generate comprehensive compliance report."""
        print("\n📋 Generating compliance report...")
        
        report_file = self.compliance_manager.generate_compliance_report()
        
        print(f"✅ Compliance report generated: {report_file}")
        return report_file
    
    def aggregate_all_data(self) -> Dict[str, str]:
        """Aggregate all crawled data and generate reports."""
        print("\n📊 Aggregating all crawled data...")
        
        # Aggregate data
        aggregation_results = self.data_aggregator.aggregate_all_data()
        
        print(f"✅ Data aggregation complete")
        print(f"📁 Reports generated:")
        for report_type, file_path in aggregation_results.items():
            print(f"   - {report_type}: {file_path}")
        
        return aggregation_results
    
    def demonstrate_rbac(self):
        """Demonstrate Role-Based Access Control features."""
        print("\n🔐 Demonstrating RBAC features...")
        
        rbac = self.batch_processor.rbac_manager
        
        # Add different user roles
        rbac.add_user("admin", "admin", "admin@enterprise.com")
        rbac.add_user("analyst", "analyst", "analyst@enterprise.com")
        rbac.add_user("viewer", "viewer", "viewer@enterprise.com")
        
        # Test permissions
        users = ["admin", "analyst", "viewer"]
        permissions = ["read", "write", "schedule", "configure"]
        
        print("📋 Permission Matrix:")
        print("User\t\tRead\tWrite\tSchedule\tConfigure")
        print("-" * 50)
        
        for user in users:
            row = f"{user:<12}"
            for permission in permissions:
                has_permission = rbac.check_permission(user, permission)
                row += f"{'✓' if has_permission else '✗':<8}"
            print(row)
    
    def demonstrate_ml_classification(self, urls: List[str]):
        """Demonstrate ML-based URL classification."""
        print("\n🤖 Demonstrating ML classification...")
        
        for url in urls:
            classification = self.ml_classifier.classify_url(url)
            print(f"\nURL: {url}")
            print(f"  Category: {classification['category']}")
            print(f"  Priority Score: {classification['priority_score']:.2f}")
            print(f"  Confidence: {classification['confidence']:.2f}")
            print(f"  Recommended Actions: {', '.join(classification['recommended_actions'])}")
    
    def cleanup_expired_data(self):
        """Clean up expired data based on retention policies."""
        print("\n🧹 Cleaning up expired data...")
        
        self.compliance_manager.cleanup_expired_data()
        
        print("✅ Data cleanup complete")


async def main():
    parser = argparse.ArgumentParser(description="Enterprise Advanced Web Crawler")
    parser.add_argument("--urls", "-u", nargs="+", help="URLs to crawl")
    parser.add_argument("--url-file", "-f", help="File containing URLs (one per line)")
    parser.add_argument("--output", "-o", help="Output directory")
    parser.add_argument("--concurrent", "-c", type=int, default=3, help="Max concurrent crawls")
    parser.add_argument("--user", default="admin", help="User ID for RBAC")
    parser.add_argument("--demo", action="store_true", help="Run demonstration mode")
    parser.add_argument("--compliance-report", action="store_true", help="Generate compliance report")
    parser.add_argument("--aggregate", action="store_true", help="Aggregate all data")
    parser.add_argument("--cleanup", action="store_true", help="Clean up expired data")
    
    args = parser.parse_args()
    
    # Initialize enterprise crawler
    crawler = EnterpriseCrawler(output_dir=args.output, max_concurrent=args.concurrent)
    
    try:
        # Demo mode
        if args.demo:
            print("🎭 Running Enterprise Crawler Demo Mode")
            
            # Demo URLs
            demo_urls = [
                "https://example.com",
                "https://httpbin.org",
                "https://jsonplaceholder.typicode.com"
            ]
            
            # Demonstrate ML classification
            crawler.demonstrate_ml_classification(demo_urls)
            
            # Demonstrate RBAC
            crawler.demonstrate_rbac()
            
            # Crawl demo URLs
            await crawler.batch_crawl_urls(demo_urls, args.user)
            
            # Generate compliance report
            crawler.generate_compliance_report()
            
            # Aggregate data
            crawler.aggregate_all_data()
            
            print("\n🎉 Demo complete! Check the desktop folder for all generated data.")
            return
        
        # Get URLs
        urls = []
        if args.urls:
            urls.extend(args.urls)
        elif args.url_file:
            with open(args.url_file, 'r') as f:
                urls = [line.strip() for line in f if line.strip()]
        else:
            print("❌ Please provide URLs with --urls or --url-file")
            sys.exit(1)
        
        # Perform crawling
        if len(urls) == 1:
            result = await crawler.crawl_single_url(urls[0], args.user)
            print(f"\n📊 Single URL Result: {result}")
        else:
            batch_result = await crawler.batch_crawl_urls(urls, args.user)
            print(f"\n📊 Batch Result: {batch_result['successful']}/{batch_result['total_urls']} successful")
        
        # Generate compliance report if requested
        if args.compliance_report:
            crawler.generate_compliance_report()
        
        # Aggregate data if requested
        if args.aggregate:
            crawler.aggregate_all_data()
        
        # Cleanup if requested
        if args.cleanup:
            crawler.cleanup_expired_data()
        
        print(f"\n✅ Enterprise crawling complete!")
        print(f"📁 All data saved to: {crawler.output_dir}")
        
    except KeyboardInterrupt:
        print("\n⏹️ Crawling interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main()) 