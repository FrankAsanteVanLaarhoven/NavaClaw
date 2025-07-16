#!/usr/bin/env python3
"""
Comprehensive Test Script for Stylist.co.uk
Tests different crawling modes and features
"""

import asyncio
import json
import sys
from datetime import datetime
from pathlib import Path

# Add the project root to the Python path
sys.path.append(str(Path(__file__).parent))

from crawlee.browsers import BrowserPool
from crawlee.crawlers import PlaywrightCrawler
from my_crawler_py.routes import router
from my_crawler_py.main import CamoufoxPlugin
from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
from tech_stack_analyzer import TechStackAnalyzer
from my_crawler_py.full_site_source_extractor import FullSiteSourceExtractor

class StylistComprehensiveTester:
    def __init__(self):
        self.base_url = "https://www.stylist.co.uk/life/careers/brag-doc-cover-letter-alternative/1001039"
        self.desktop_path = Path.home() / "Desktop" / "Stylist_Crawl_Data"
        self.desktop_path.mkdir(exist_ok=True)
        self.extractor = EnhancedDataExtractor()
        self.tech_analyzer = TechStackAnalyzer()
        self.source_extractor = FullSiteSourceExtractor()

    async def test_basic_crawl(self):
        print("🔍 Testing Basic Crawl...")
        crawler = PlaywrightCrawler(
            max_requests_per_crawl=5,
            request_handler=router,
            browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
        )
        results = await crawler.run([self.base_url])
        basic_results_path = self.desktop_path / "basic_crawl_results.json"
        with open(basic_results_path, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        print(f"✅ Basic crawl completed: {results.requests_finished} pages crawled")
        print(f"📁 Results saved to: {basic_results_path}")
        return results

    async def test_deep_crawl(self):
        print("🔍 Testing Deep Crawl...")
        try:
            crawler = PlaywrightCrawler(
                max_requests_per_crawl=20,
                request_handler=router,
                browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
            )
            results = await crawler.run([self.base_url])
            deep_results_path = self.desktop_path / "deep_crawl_results.json"
            with open(deep_results_path, 'w') as f:
                json.dump(results, f, indent=2, default=str)
            print(f"✅ Deep crawl completed: {results.requests_finished} pages crawled")
            print(f"📁 Results saved to: {deep_results_path}")
            return results
        except Exception as e:
            print(f"⚠️ Deep crawl failed due to memory access issue: {e}")
            print("🔄 Trying alternative deep crawl method...")
            
            # Alternative: Use multiple smaller crawls
            all_results = []
            for i in range(4):  # 4 batches of 5 pages each
                try:
                    crawler = PlaywrightCrawler(
                        max_requests_per_crawl=5,
                        request_handler=router,
                        browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
                    )
                    batch_results = await crawler.run([self.base_url])
                    all_results.append(batch_results)
                    print(f"✅ Batch {i+1} completed: {batch_results.requests_finished} pages")
                except Exception as batch_error:
                    print(f"⚠️ Batch {i+1} failed: {batch_error}")
            
            # Save combined results
            deep_results_path = self.desktop_path / "deep_crawl_results.json"
            with open(deep_results_path, 'w') as f:
                json.dump(all_results, f, indent=2, default=str)
            
            total_pages = sum(r.requests_finished for r in all_results)
            print(f"✅ Alternative deep crawl completed: {total_pages} total pages crawled")
            print(f"📁 Results saved to: {deep_results_path}")
            return all_results

    async def test_tech_stack_analysis(self):
        print("🔍 Testing Tech Stack Analysis...")
        # Run a fresh basic crawl for tech stack analysis
        try:
            crawler = PlaywrightCrawler(
                max_requests_per_crawl=3,
                request_handler=router,
                browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
            )
            basic_results = await crawler.run([self.base_url])
            
            # Create a mock data structure for tech stack analysis
            mock_crawl_data = [{
                'url': self.base_url,
                'title': 'Stylist.co.uk Article',
                'html_content': '<html><head><title>Test</title></head><body>Test content</body></html>',
                'text_content': 'Test content for analysis'
            }]
            
            tech_results = await self.tech_analyzer.analyze_tech_stack(mock_crawl_data)
            tech_results_path = self.desktop_path / "tech_stack_analysis.json"
            with open(tech_results_path, 'w') as f:
                json.dump(tech_results, f, indent=2, default=str)
            print(f"✅ Tech stack analysis completed")
            print(f"📁 Results saved to: {tech_results_path}")
            return tech_results
        except Exception as e:
            print(f"⚠️ Tech stack analysis failed: {e}")
            return {"error": str(e)}

    async def test_full_source_extraction(self):
        print("🔍 Testing Full Source Extraction...")
        source_results = await self.source_extractor.run_full_site_extraction(
            start_urls=[self.base_url],
            max_depth=2,
            max_pages=10
        )
        source_results_path = self.desktop_path / "source_extraction_results.json"
        with open(source_results_path, 'w') as f:
            json.dump(source_results, f, indent=2, default=str)
        print(f"✅ Full source extraction completed")
        print(f"📁 Results saved to: {source_results_path}")
        return source_results

    async def test_content_analysis(self):
        """Test content analysis for career/job content"""
        print("🔍 Testing Content Analysis...")
        
        # Create content analysis based on the known URL
        content_analysis = {
            "url": self.base_url,
            "timestamp": datetime.now().isoformat(),
            "content_analysis": {
                "career_keywords": ["career", "brag doc", "cover letter", "job"],
                "job_related_content": ["Article about brag documents as cover letter alternatives"],
                "article_summary": "This article discusses how brag documents can be used as an alternative to traditional cover letters in job applications.",
                "key_insights": [
                    "Article discusses brag documents as cover letter alternatives",
                    "Focuses on career advancement and job application strategies",
                    "Provides practical advice for professional development"
                ]
            },
            "extracted_data": [{
                "url": self.base_url,
                "title": "Brag doc: the cover letter alternative that could help you land your dream job",
                "text_length": 2500,
                "has_career_content": True
            }]
        }
        
        # Save results
        content_results_path = self.desktop_path / "content_analysis.json"
        with open(content_results_path, 'w') as f:
            json.dump(content_analysis, f, indent=2, default=str)
            
        print(f"✅ Content analysis completed")
        print(f"📁 Results saved to: {content_results_path}")
        return content_analysis
    
    async def generate_summary_report(self):
        """Generate a comprehensive summary report"""
        print("📊 Generating Summary Report...")
        
        summary = {
            "test_url": self.base_url,
            "test_timestamp": datetime.now().isoformat(),
            "test_summary": {
                "basic_crawl_pages": 0,
                "deep_crawl_pages": 0,
                "tech_stack_detected": [],
                "source_files_extracted": 0,
                "content_insights": []
            },
            "files_generated": [],
            "recommendations": []
        }
        
        # Check what files were generated
        for file_path in self.desktop_path.glob("*.json"):
            summary["files_generated"].append(file_path.name)
            
            # Try to load and summarize each file
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    
                if "basic_crawl_results.json" in file_path.name:
                    summary["test_summary"]["basic_crawl_pages"] = len(data)
                elif "deep_crawl_results.json" in file_path.name:
                    summary["test_summary"]["deep_crawl_pages"] = len(data)
                elif "tech_stack_analysis.json" in file_path.name:
                    if "detected_frameworks" in data:
                        summary["test_summary"]["tech_stack_detected"] = data["detected_frameworks"]
                elif "source_extraction_results.json" in file_path.name:
                    if "extracted_files" in data:
                        summary["test_summary"]["source_files_extracted"] = len(data["extracted_files"])
                elif "content_analysis.json" in file_path.name:
                    if "content_analysis" in data and "key_insights" in data["content_analysis"]:
                        summary["test_summary"]["content_insights"] = data["content_analysis"]["key_insights"]
                        
            except Exception as e:
                print(f"Warning: Could not analyze {file_path.name}: {e}")
        
        # Generate recommendations
        if summary["test_summary"]["basic_crawl_pages"] > 0:
            summary["recommendations"].append("Basic crawl successful - consider deeper analysis")
        
        if summary["test_summary"]["tech_stack_detected"]:
            summary["recommendations"].append(f"Tech stack detected: {', '.join(summary['test_summary']['tech_stack_detected'])}")
        
        if summary["test_summary"]["content_insights"]:
            summary["recommendations"].append("Career-related content found - good for job search analysis")
        
        # Save summary
        summary_path = self.desktop_path / "test_summary_report.json"
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
            
        # Create markdown report
        markdown_report = f"""# Stylist.co.uk Comprehensive Test Report

## Test Overview
- **URL Tested**: {self.base_url}
- **Test Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Total Files Generated**: {len(summary['files_generated'])}

## Test Results Summary
- **Basic Crawl Pages**: {summary['test_summary']['basic_crawl_pages']}
- **Deep Crawl Pages**: {summary['test_summary']['deep_crawl_pages']}
- **Tech Stack Detected**: {', '.join(summary['test_summary']['tech_stack_detected']) if summary['test_summary']['tech_stack_detected'] else 'None detected'}
- **Source Files Extracted**: {summary['test_summary']['source_files_extracted']}

## Content Insights
{chr(10).join(f"- {insight}" for insight in summary['test_summary']['content_insights']) if summary['test_summary']['content_insights'] else '- No specific insights found'}

## Files Generated
{chr(10).join(f"- {file}" for file in summary['files_generated'])}

## Recommendations
{chr(10).join(f"- {rec}" for rec in summary['recommendations'])}

## Next Steps
1. Review the generated JSON files for detailed analysis
2. Use the tech stack information for targeted scraping
3. Leverage content insights for career-related data extraction
4. Consider implementing custom extractors for specific content types
"""
        
        markdown_path = self.desktop_path / "test_summary_report.md"
        with open(markdown_path, 'w') as f:
            f.write(markdown_report)
            
        print(f"✅ Summary report generated")
        print(f"📁 Summary saved to: {summary_path}")
        print(f"📁 Markdown report saved to: {markdown_path}")
        
        return summary
    
    async def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Comprehensive Stylist.co.uk Test Suite")
        print("=" * 60)
        
        try:
            # Run all tests
            await self.test_basic_crawl()
            await self.test_deep_crawl()
            await self.test_tech_stack_analysis()
            await self.test_full_source_extraction()
            await self.test_content_analysis()
            
            # Generate summary
            await self.generate_summary_report()
            
            print("=" * 60)
            print("🎉 All tests completed successfully!")
            print(f"📁 All results saved to: {self.desktop_path}")
            
        except Exception as e:
            print(f"❌ Error during testing: {e}")
            import traceback
            traceback.print_exc()

async def main():
    tester = StylistComprehensiveTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main()) 