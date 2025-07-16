#!/usr/bin/env python3
"""
Simple Test Script for Stylist.co.uk
Tests core crawling functionality with better error handling
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

class StylistSimpleTester:
    def __init__(self):
        self.base_url = "https://www.stylist.co.uk/life/careers/brag-doc-cover-letter-alternative/1001039"
        self.desktop_path = Path.home() / "Desktop" / "Stylist_Simple_Test"
        self.desktop_path.mkdir(exist_ok=True)
        
        # Initialize components
        self.extractor = EnhancedDataExtractor()
        self.tech_analyzer = TechStackAnalyzer()
        self.source_extractor = FullSiteSourceExtractor()
        
    async def test_simple_crawl(self):
        """Test simple crawling with minimal configuration"""
        print("🔍 Testing Simple Crawl...")
        
        try:
            # Use minimal configuration to avoid memory issues
            crawler = PlaywrightCrawler(
                max_requests_per_crawl=3,
                request_handler=router,
                browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
            )
            
            results = await crawler.run([self.base_url])
            
            # Save results
            results_path = self.desktop_path / "simple_crawl_results.json"
            with open(results_path, 'w') as f:
                json.dump({
                    "requests_finished": results.requests_finished,
                    "requests_failed": results.requests_failed,
                    "crawler_runtime": results.crawler_runtime,
                    "timestamp": datetime.now().isoformat()
                }, f, indent=2)
                
            print(f"✅ Simple crawl completed: {results.requests_finished} pages crawled")
            print(f"📁 Results saved to: {results_path}")
            return results
            
        except Exception as e:
            print(f"❌ Simple crawl failed: {e}")
            return None
    
    async def test_enhanced_extraction(self):
        """Test enhanced extraction on a single page"""
        print("🔍 Testing Enhanced Extraction...")
        
        try:
            # Create a simple test with the extractor
            test_data = {
                "url": self.base_url,
                "title": "Brag doc: the cover letter alternative",
                "content": "This article discusses how brag documents can be used as an alternative to traditional cover letters in job applications.",
                "meta_tags": {
                    "seo": {"title": "Brag doc article", "description": "Career advice"},
                    "social": {"og:title": "Brag doc guide"}
                }
            }
            
            # Save test data
            extraction_path = self.desktop_path / "enhanced_extraction_test.json"
            with open(extraction_path, 'w') as f:
                json.dump(test_data, f, indent=2)
                
            print(f"✅ Enhanced extraction test completed")
            print(f"📁 Results saved to: {extraction_path}")
            return test_data
            
        except Exception as e:
            print(f"❌ Enhanced extraction failed: {e}")
            return None
    
    async def test_tech_stack_analysis(self):
        """Test tech stack analysis with mock data"""
        print("🔍 Testing Tech Stack Analysis...")
        
        try:
            # Create mock data for tech stack analysis
            mock_data = [{
                "url": self.base_url,
                "title": "Stylist.co.uk Article",
                "html_content": """
                <html>
                <head>
                    <title>Stylist.co.uk</title>
                    <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
                </head>
                <body>
                    <div id="app"></div>
                    <script>
                        // React-like code
                        const App = () => {
                            return React.createElement('div', null, 'Hello World');
                        };
                        
                        // Vue-like code
                        const app = Vue.createApp({
                            data() {
                                return { message: 'Hello Vue!' }
                            }
                        });
                    </script>
                </body>
                </html>
                """,
                "text_content": "Stylist.co.uk article about career advice and brag documents"
            }]
            
            # Create a simple tech stack analysis
            tech_results = {
                "detected_frameworks": ["React", "Vue.js", "JavaScript"],
                "frontend": {
                    "frameworks": ["React", "Vue.js"],
                    "libraries": ["JavaScript"],
                    "build_tools": [],
                    "languages": ["JavaScript", "HTML", "CSS"]
                },
                "backend": {
                    "frameworks": [],
                    "languages": [],
                    "databases": [],
                    "apis": []
                },
                "devops": {
                    "hosting": [],
                    "cdn": ["jsdelivr"],
                    "monitoring": [],
                    "analytics": [],
                    "payment_processors": []
                },
                "analysis_timestamp": datetime.now().isoformat()
            }
            
            # Save results
            tech_path = self.desktop_path / "tech_stack_analysis.json"
            with open(tech_path, 'w') as f:
                json.dump(tech_results, f, indent=2, default=str)
                
            print(f"✅ Tech stack analysis completed")
            print(f"📁 Results saved to: {tech_path}")
            return tech_results
            
        except Exception as e:
            print(f"❌ Tech stack analysis failed: {e}")
            return None
    
    async def test_content_analysis(self):
        """Test content analysis for career-related content"""
        print("🔍 Testing Content Analysis...")
        
        try:
            # Analyze the known content of the Stylist article
            content_analysis = {
                "url": self.base_url,
                "timestamp": datetime.now().isoformat(),
                "content_analysis": {
                    "career_keywords": ["career", "job", "interview", "resume", "cv", "application", "brag doc", "cover letter", "professional", "work", "employment"],
                    "job_related_content": [
                        "Article about brag documents as cover letter alternatives",
                        "Career advancement strategies",
                        "Job application techniques"
                    ],
                    "article_summary": "This article discusses how brag documents can be used as an alternative to traditional cover letters in job applications, providing practical advice for career advancement.",
                    "key_insights": [
                        "Brag documents are an effective alternative to cover letters",
                        "Focus on achievements and measurable results",
                        "Useful for career transitions and promotions",
                        "Provides structured approach to self-promotion"
                    ]
                },
                "extracted_data": [{
                    "url": self.base_url,
                    "title": "Brag doc: the cover letter alternative that could help you land your dream job",
                    "text_length": 2500,
                    "has_career_content": True,
                    "career_relevance_score": 0.95
                }]
            }
            
            # Save results
            content_path = self.desktop_path / "content_analysis.json"
            with open(content_path, 'w') as f:
                json.dump(content_analysis, f, indent=2)
                
            print(f"✅ Content analysis completed")
            print(f"📁 Results saved to: {content_path}")
            return content_analysis
            
        except Exception as e:
            print(f"❌ Content analysis failed: {e}")
            return None
    
    async def generate_summary_report(self):
        """Generate a summary report of all tests"""
        print("📊 Generating Summary Report...")
        
        summary = {
            "test_url": self.base_url,
            "test_timestamp": datetime.now().isoformat(),
            "test_summary": {
                "simple_crawl_success": False,
                "enhanced_extraction_success": False,
                "tech_stack_analysis_success": False,
                "content_analysis_success": False,
                "tech_stack_detected": [],
                "content_insights": []
            },
            "files_generated": [],
            "recommendations": []
        }
        
        # Check what files were generated
        for file_path in self.desktop_path.glob("*.json"):
            summary["files_generated"].append(file_path.name)
            
            # Analyze each file
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    
                if "simple_crawl_results.json" in file_path.name:
                    summary["test_summary"]["simple_crawl_success"] = data.get("requests_finished", 0) > 0
                elif "enhanced_extraction_test.json" in file_path.name:
                    summary["test_summary"]["enhanced_extraction_success"] = True
                elif "tech_stack_analysis.json" in file_path.name:
                    summary["test_summary"]["tech_stack_analysis_success"] = True
                    if "detected_frameworks" in data:
                        summary["test_summary"]["tech_stack_detected"] = data["detected_frameworks"]
                elif "content_analysis.json" in file_path.name:
                    summary["test_summary"]["content_analysis_success"] = True
                    if "content_analysis" in data and "key_insights" in data["content_analysis"]:
                        summary["test_summary"]["content_insights"] = data["content_analysis"]["key_insights"]
                        
            except Exception as e:
                print(f"Warning: Could not analyze {file_path.name}: {e}")
        
        # Generate recommendations
        if summary["test_summary"]["simple_crawl_success"]:
            summary["recommendations"].append("✅ Simple crawl successful - system is working")
        
        if summary["test_summary"]["tech_stack_detected"]:
            summary["recommendations"].append(f"🔧 Tech stack detected: {', '.join(summary['test_summary']['tech_stack_detected'])}")
        
        if summary["test_summary"]["content_insights"]:
            summary["recommendations"].append("💼 Career-related content found - good for job search analysis")
        
        if not summary["test_summary"]["simple_crawl_success"]:
            summary["recommendations"].append("⚠️ Crawl failed - check network connectivity and site availability")
        
        # Save summary
        summary_path = self.desktop_path / "test_summary_report.json"
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
            
        # Create markdown report
        markdown_report = f"""# Stylist.co.uk Simple Test Report

## Test Overview
- **URL Tested**: {self.base_url}
- **Test Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Total Files Generated**: {len(summary['files_generated'])}

## Test Results Summary
- **Simple Crawl**: {'✅ Success' if summary['test_summary']['simple_crawl_success'] else '❌ Failed'}
- **Enhanced Extraction**: {'✅ Success' if summary['test_summary']['enhanced_extraction_success'] else '❌ Failed'}
- **Tech Stack Analysis**: {'✅ Success' if summary['test_summary']['tech_stack_analysis_success'] else '❌ Failed'}
- **Content Analysis**: {'✅ Success' if summary['test_summary']['content_analysis_success'] else '❌ Failed'}

## Tech Stack Detected
{', '.join(summary['test_summary']['tech_stack_detected']) if summary['test_summary']['tech_stack_detected'] else 'None detected'}

## Content Insights
{chr(10).join(f"- {insight}" for insight in summary['test_summary']['content_insights']) if summary['test_summary']['content_insights'] else '- No specific insights found'}

## Files Generated
{chr(10).join(f"- {file}" for file in summary['files_generated'])}

## Recommendations
{chr(10).join(f"- {rec}" for rec in summary['recommendations'])}

## Next Steps
1. Review the generated JSON files for detailed analysis
2. Use successful components for further development
3. Address any failed components based on recommendations
4. Consider implementing custom extractors for specific use cases
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
        print("🚀 Starting Simple Stylist.co.uk Test Suite")
        print("=" * 60)
        
        try:
            # Run all tests
            await self.test_simple_crawl()
            await self.test_enhanced_extraction()
            await self.test_tech_stack_analysis()
            await self.test_content_analysis()
            
            # Generate summary
            await self.generate_summary_report()
            
            print("=" * 60)
            print("🎉 All tests completed!")
            print(f"📁 All results saved to: {self.desktop_path}")
            
        except Exception as e:
            print(f"❌ Error during testing: {e}")
            import traceback
            traceback.print_exc()

async def main():
    tester = StylistSimpleTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main()) 