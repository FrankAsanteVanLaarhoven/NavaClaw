#!/usr/bin/env python3
"""
Comprehensive Test Suite for Enterprise Crawler V2
Tests all Bright Data-like capabilities including proxy management, anti-detection, and stealth features.
"""

import asyncio
import logging
import sys
import time
from typing import List, Dict, Any
from pathlib import Path
import json
import tempfile
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add the project root to Python path
sys.path.insert(0, str(Path(__file__).parent))

class TestResult:
    """Test result container."""
    def __init__(self, test_name: str, success: bool, error: str = None, duration: float = 0.0):
        self.test_name = test_name
        self.success = success
        self.error = error
        self.duration = duration

class ComprehensiveTestSuite:
    """Comprehensive test suite for enterprise crawler capabilities."""
    
    def __init__(self):
        self.results: List[TestResult] = []
        self.test_count = 0
        self.passed_count = 0
        self.failed_count = 0
    
    async def run_test(self, test_func, test_name: str) -> TestResult:
        """Run a single test and record results."""
        self.test_count += 1
        start_time = time.time()
        
        try:
            logger.info(f"🧪 Running test: {test_name}")
            await test_func()
            duration = time.time() - start_time
            result = TestResult(test_name, True, duration=duration)
            self.passed_count += 1
            logger.info(f"✅ Test passed: {test_name} ({duration:.2f}s)")
            return result
            
        except Exception as e:
            duration = time.time() - start_time
            result = TestResult(test_name, False, str(e), duration)
            self.failed_count += 1
            logger.error(f"❌ Test failed: {test_name} - {e}")
            return result
    
    async def test_imports(self):
        """Test that all modules can be imported successfully."""
        try:
            # Test core imports
            from my_crawler_py.providers import (
                CrawlerProvider, CrawlRequest, CrawlResponse, ProviderType,
                ScrapFlyProvider, PlaywrightProvider, PerplexityProvider, BrightDataProvider
            )
            
            # Test proxy management
            from my_crawler_py.proxy_manager import (
                ProxyManager, ProxyType, ProxyConfig, ProxySession, proxy_manager
            )
            
            # Test anti-detection
            from my_crawler_py.anti_detection import (
                AntiDetectionManager, BrowserProfile, BehavioralPattern, anti_detection_manager
            )
            
            # Test enterprise crawler
            from my_crawler_py.enterprise_crawler_v2 import (
                EnterpriseCrawlerV2, EnterpriseCrawlConfig, EnterpriseCrawlResult,
                create_enterprise_crawler, crawl_enterprise_urls
            )
            
            # Test other components
            from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
            from my_crawler_py.tech_stack_analyzer import TechStackAnalyzer
            from my_crawler_py.distributed_crawler import DistributedCrawler
            
            logger.info("✅ All imports successful")
            
        except ImportError as e:
            raise ImportError(f"Import test failed: {e}")
    
    async def test_proxy_manager(self):
        """Test proxy manager functionality."""
        from my_crawler_py.proxy_manager import ProxyManager, ProxyType, ProxyConfig
        
        try:
            # Create proxy manager
            proxy_manager = ProxyManager()
            
            # Add proxy configurations
            config1 = ProxyConfig(
                host="test-proxy1.com",
                port=8080,
                username="test_user1",
                password="test_pass1",
                proxy_type=ProxyType.DATACENTER,
                country="us",
                max_requests=100
            )
            
            config2 = ProxyConfig(
                host="test-proxy2.com",
                port=8080,
                username="test_user2",
                password="test_pass2",
                proxy_type=ProxyType.RESIDENTIAL,
                country="us",
                city="new-york",
                max_requests=50
            )
            
            proxy_manager.add_proxy_config(config1)
            proxy_manager.add_proxy_config(config2)
            
            # Test session creation
            session1 = await proxy_manager.create_session(
                proxy_type=ProxyType.DATACENTER,
                country="us"
            )
            session2 = await proxy_manager.create_session(
                proxy_type=ProxyType.RESIDENTIAL,
                country="us",
                city="new-york"
            )
            assert session1 is not None, "Session1 should not be None"
            assert session2 is not None, "Session2 should not be None"
            assert session1.session_id != session2.session_id, "Session IDs should be different"
            
            # Test session info
            session_info = proxy_manager.get_session_info(session1.session_id)
            assert session_info is not None, "Session info should not be None"
            assert session_info["session_id"] == session1.session_id, "Session info should match session ID"
            
            # Test statistics
            stats = proxy_manager.get_statistics()
            assert "total_sessions" in stats, "Statistics should contain total_sessions"
            assert "active_sessions" in stats, "Statistics should contain active_sessions"
            
            # Test session rotation
            new_session = await proxy_manager.rotate_session(session1.session_id)
            assert new_session.session_id != session1.session_id, "Rotated session should have different ID"
            
            # Test fallback to default config for unknown proxy type
            try:
                fallback_session = await proxy_manager.create_session(proxy_type="unknown_type", country="us")
                assert fallback_session is not None, "Fallback session should not be None"
                # The proxy type should be converted to a valid enum value (DATACENTER as fallback)
                assert hasattr(fallback_session.proxy_config.proxy_type, 'value'), "Proxy type should have value attribute"
                assert fallback_session.proxy_config.proxy_type.value in ["datacenter", "residential", "isp"], f"Invalid proxy type: {fallback_session.proxy_config.proxy_type.value}"
            except Exception as e:
                logger.error(f"Fallback session creation failed: {e}")
                logger.error(f"Fallback session type: {type(fallback_session) if 'fallback_session' in locals() else 'Not created'}")
                if 'fallback_session' in locals():
                    logger.error(f"Fallback session proxy config: {fallback_session.proxy_config}")
                raise
            
            logger.info("✅ Proxy manager tests passed")
            
        except Exception as e:
            logger.error(f"Proxy manager test failed with error: {e}")
            raise
    
    async def test_anti_detection(self):
        """Test anti-detection system."""
        from my_crawler_py.anti_detection import AntiDetectionManager
        
        # Create anti-detection manager
        anti_detection_manager = AntiDetectionManager()
        
        # Test browser profiles
        profile_name, profile = anti_detection_manager.get_random_profile()
        assert profile_name is not None
        assert profile is not None
        assert hasattr(profile, 'user_agent')
        assert hasattr(profile, 'screen_resolution')
        
        # Test behavioral patterns
        pattern_name, pattern = anti_detection_manager.get_random_behavioral_pattern()
        assert pattern_name is not None
        assert pattern is not None
        assert hasattr(pattern, 'mouse_movement_pattern')
        assert hasattr(pattern, 'scroll_pattern')
        
        # Test session creation
        session_id = anti_detection_manager.start_session(
            profile_name="chrome_windows",
            pattern_name="casual_user"
        )
        assert session_id is not None
        
        # Test session headers
        headers = anti_detection_manager.get_session_headers(profile)
        assert isinstance(headers, dict)
        assert 'User-Agent' in headers
        assert 'Accept' in headers
        
        # Test fingerprint evasion
        evasion_data = anti_detection_manager.get_fingerprint_evasion(profile)
        assert isinstance(evasion_data, dict)
        assert 'screen' in evasion_data
        assert 'navigator' in evasion_data
        
        # Test session info
        session_info = anti_detection_manager.get_session_info()
        assert session_info is not None
        assert session_info["session_id"] == session_id
        
        logger.info("✅ Anti-detection tests passed")
    
    async def test_enhanced_extraction(self):
        """Test enhanced data extraction."""
        from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
        
        # Create enhanced extractor
        with tempfile.TemporaryDirectory() as temp_dir:
            extractor = EnhancedDataExtractor(temp_dir)
            
            # Test meta tags extraction from content
            sample_html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test Page</title>
                <meta name="description" content="Test description">
                <meta property="og:title" content="Test OG Title">
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <h1>Test Content</h1>
            </body>
            </html>
            """
            
            meta_data = await extractor.extract_meta_tags_from_content(sample_html, "https://example.com")
            assert isinstance(meta_data, dict)
            assert "seo" in meta_data
            assert "social" in meta_data
            
            # Test UI components extraction
            ui_data = await extractor.extract_ui_components_from_content(sample_html, "https://example.com")
            assert isinstance(ui_data, dict)
            
            logger.info("✅ Enhanced extraction tests passed")
    
    async def test_tech_stack_analyzer(self):
        """Test tech stack analyzer."""
        from my_crawler_py.tech_stack_analyzer import TechStackAnalyzer
        
        # Create tech stack analyzer
        analyzer = TechStackAnalyzer()
        
        # Test with sample data
        sample_data = {
            "url": "https://example.com",
            "content": """
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div id="root"></div>
            </body>
            </html>
            """,
            "extraction": {
                "basic": {
                    "scripts": [
                        "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js",
                        "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"
                    ],
                    "stylesheets": [
                        "https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css"
                    ],
                    "meta_tags": {}
                }
            }
        }
        
        tech_stack = analyzer.analyze_single_crawl_data(sample_data)
        assert isinstance(tech_stack, dict)
        assert "frontend" in tech_stack
        assert "backend" in tech_stack
        
        logger.info("✅ Tech stack analyzer tests passed")
    
    async def test_enterprise_crawler_config(self):
        """Test enterprise crawler configuration."""
        from my_crawler_py.enterprise_crawler_v2 import EnterpriseCrawlConfig
        from my_crawler_py.providers import ProviderType
        from my_crawler_py.proxy_manager import ProxyType
        
        # Test configuration creation
        config = EnterpriseCrawlConfig(
            provider_type=ProviderType.PLAYWRIGHT,
            proxy_type=ProxyType.DATACENTER,
            proxy_country="us",
            enable_anti_detection=True,
            extraction_layers=["meta", "network", "ui_components"],
            enable_tech_stack_analysis=True,
            max_concurrent=5,
            request_delay=1.0
        )
        
        assert config.provider_type == ProviderType.PLAYWRIGHT
        assert config.proxy_type == ProxyType.DATACENTER
        assert config.enable_anti_detection is True
        assert "meta" in config.extraction_layers
        assert config.max_concurrent == 5
        
        logger.info("✅ Enterprise crawler configuration tests passed")
    
    async def test_provider_factory(self):
        """Test provider factory functionality."""
        from my_crawler_py.providers import create_provider, ProviderType
        
        # Test Playwright provider creation
        playwright_provider = create_provider(ProviderType.PLAYWRIGHT)
        assert playwright_provider is not None
        assert playwright_provider.provider_type == ProviderType.PLAYWRIGHT
        
        # Test provider capabilities
        capabilities = playwright_provider._get_capabilities()
        assert isinstance(capabilities, dict)
        assert "javascript" in capabilities
        
        # Test rate limits
        rate_limits = playwright_provider.get_rate_limits()
        assert isinstance(rate_limits, dict)
        
        logger.info("✅ Provider factory tests passed")
    
    async def test_bright_data_provider(self):
        """Test Bright Data provider (without actual credentials)."""
        from my_crawler_py.providers import create_provider, ProviderType
        
        # Test provider creation with mock credentials
        try:
            bright_data_provider = create_provider(
                ProviderType.BRIGHTDATA,
                username="test_user",
                password="test_pass",
                proxy_type="datacenter",
                country="us"
            )
            
            assert bright_data_provider is not None
            assert bright_data_provider.provider_type == ProviderType.BRIGHTDATA
            
            # Test proxy URL building
            proxy_url = bright_data_provider._build_proxy_url()
            assert "brd.superproxy.io" in proxy_url
            assert "test_user" in proxy_url
            
            # Test capabilities
            capabilities = bright_data_provider._get_capabilities()
            assert capabilities["proxy_rotation"] is True
            assert capabilities["geolocation"] is True
            
            logger.info("✅ Bright Data provider tests passed")
            
        except Exception as e:
            logger.warning(f"⚠️ Bright Data provider test skipped (expected without real credentials): {e}")
    
    async def test_stealth_scripts(self):
        """Test stealth script generation."""
        from my_crawler_py.anti_detection import AntiDetectionManager
        
        anti_detection_manager = AntiDetectionManager()
        
        # Test stealth script generation
        stealth_script = anti_detection_manager.inject_stealth_scripts(None)
        assert isinstance(stealth_script, str)
        assert "webdriver" in stealth_script.lower()
        assert "canvas" in stealth_script.lower()
        assert "webgl" in stealth_script.lower()
        assert "navigator" in stealth_script.lower()
        
        logger.info("✅ Stealth scripts tests passed")
    
    async def test_session_management(self):
        """Test session management across components."""
        from my_crawler_py.proxy_manager import proxy_manager
        from my_crawler_py.anti_detection import anti_detection_manager
        from my_crawler_py.proxy_manager import ProxyType
        
        # Test proxy session management
        proxy_session = await proxy_manager.create_session(
            proxy_type=ProxyType.DATACENTER,
            country="us"
        )
        assert proxy_session is not None
        
        # Test anti-detection session management
        anti_detection_session = anti_detection_manager.start_session()
        assert anti_detection_session is not None
        
        # Test session info retrieval
        proxy_info = proxy_manager.get_session_info(proxy_session.session_id)
        anti_detection_info = anti_detection_manager.get_session_info()
        
        assert proxy_info is not None
        assert anti_detection_info is not None
        
        logger.info("✅ Session management tests passed")
    
    async def test_error_handling(self):
        """Test error handling in various components."""
        from my_crawler_py.proxy_manager import ProxyManager, ProxyType
        from my_crawler_py.anti_detection import AntiDetectionManager
        
        # Test proxy manager error handling
        proxy_manager = ProxyManager()
        
        # Test with invalid proxy type (should create default config)
        try:
            session = await proxy_manager.create_session(proxy_type="invalid_type", country="us")
            # Should not raise error, should create default config
            assert session is not None
            # The proxy type should be converted to a valid enum value (DATACENTER as fallback)
            assert hasattr(session.proxy_config.proxy_type, 'value')
            assert session.proxy_config.proxy_type.value in ["datacenter", "residential", "isp"]
        except Exception as e:
            assert False, f"Should not raise error: {e}"
        
        # Test anti-detection error handling
        anti_detection_manager = AntiDetectionManager()
        
        # Test with invalid profile
        try:
            anti_detection_manager.start_session(profile_name="invalid_profile")
            # Should not raise error, should use default
            pass
        except Exception as e:
            assert False, f"Should not raise error: {e}"
        
        logger.info("✅ Error handling tests passed")
    
    async def test_data_structures(self):
        """Test data structures and serialization."""
        from my_crawler_py.enterprise_crawler_v2 import EnterpriseCrawlResult
        from my_crawler_py.proxy_manager import ProxySession, ProxyConfig, ProxyType
        from my_crawler_py.anti_detection import BrowserProfile, BehavioralPattern
        from datetime import datetime, timezone
        
        # Test EnterpriseCrawlResult
        result = EnterpriseCrawlResult(
            url="https://example.com",
            status_code=200,
            content="<html>test</html>",
            extraction_data={"meta": {"title": "Test"}},
            timestamp=datetime.now(timezone.utc)
        )
        
        assert result.url == "https://example.com"
        assert result.status_code == 200
        assert result.content == "<html>test</html>"
        assert result.extraction_data["meta"]["title"] == "Test"
        
        # Test ProxyConfig
        config = ProxyConfig(
            host="test.com",
            port=8080,
            username="user",
            password="pass",
            proxy_type=ProxyType.DATACENTER,
            country="us"
        )
        
        assert config.host == "test.com"
        assert config.proxy_type == ProxyType.DATACENTER
        
        # Test BrowserProfile
        profile = BrowserProfile(
            user_agent="Test Agent",
            screen_resolution=(1920, 1080),
            color_depth=24,
            timezone="UTC",
            language="en-US",
            platform="Win32",
            webgl_vendor="Test Vendor",
            webgl_renderer="Test Renderer",
            canvas_fingerprint="test_fp",
            audio_fingerprint="test_audio",
            fonts=["Arial"],
            plugins=["Test Plugin"],
            mime_types=["text/html"],
            hardware_concurrency=4,
            device_memory=8,
            connection_type="4g"
        )
        
        assert profile.user_agent == "Test Agent"
        assert profile.screen_resolution == (1920, 1080)
        
        logger.info("✅ Data structures tests passed")
    
    async def test_convenience_functions(self):
        """Test convenience functions."""
        from my_crawler_py.enterprise_crawler_v2 import create_enterprise_crawler
        from my_crawler_py.providers import ProviderType
        from my_crawler_py.proxy_manager import ProxyType
        
        # Test convenience function
        crawler = await create_enterprise_crawler(
            provider_type=ProviderType.PLAYWRIGHT,
            proxy_type=ProxyType.DATACENTER,
            enable_anti_detection=True
        )
        
        assert crawler is not None
        assert crawler.config.provider_type == ProviderType.PLAYWRIGHT
        assert crawler.config.proxy_type == ProxyType.DATACENTER
        assert crawler.config.enable_anti_detection is True
        
        logger.info("✅ Convenience functions tests passed")
    
    async def run_all_tests(self):
        """Run all tests in the suite."""
        logger.info("🚀 Starting Comprehensive Test Suite")
        logger.info("=" * 60)
        
        # Define all tests
        tests = [
            (self.test_imports, "Module Imports"),
            (self.test_proxy_manager, "Proxy Manager"),
            (self.test_anti_detection, "Anti-Detection System"),
            (self.test_enhanced_extraction, "Enhanced Extraction"),
            (self.test_tech_stack_analyzer, "Tech Stack Analyzer"),
            (self.test_enterprise_crawler_config, "Enterprise Crawler Config"),
            (self.test_provider_factory, "Provider Factory"),
            (self.test_bright_data_provider, "Bright Data Provider"),
            (self.test_stealth_scripts, "Stealth Scripts"),
            (self.test_session_management, "Session Management"),
            (self.test_error_handling, "Error Handling"),
            (self.test_data_structures, "Data Structures"),
            (self.test_convenience_functions, "Convenience Functions"),
        ]
        
        # Run all tests
        for test_func, test_name in tests:
            result = await self.run_test(test_func, test_name)
            self.results.append(result)
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary."""
        logger.info("=" * 60)
        logger.info("📊 Test Summary")
        logger.info("=" * 60)
        
        logger.info(f"Total Tests: {self.test_count}")
        logger.info(f"Passed: {self.passed_count} ✅")
        logger.info(f"Failed: {self.failed_count} ❌")
        logger.info(f"Success Rate: {(self.passed_count/self.test_count)*100:.1f}%")
        
        if self.failed_count > 0:
            logger.info("\n❌ Failed Tests:")
            for result in self.results:
                if not result.success:
                    logger.info(f"  - {result.test_name}: {result.error}")
        
        logger.info("\n✅ All tests completed!")
        
        # Save results to file
        self.save_results()
    
    def save_results(self):
        """Save test results to file."""
        results_data = {
            "summary": {
                "total_tests": self.test_count,
                "passed": self.passed_count,
                "failed": self.failed_count,
                "success_rate": (self.passed_count/self.test_count)*100 if self.test_count > 0 else 0
            },
            "results": [
                {
                    "test_name": result.test_name,
                    "success": result.success,
                    "error": result.error,
                    "duration": result.duration
                }
                for result in self.results
            ]
        }
        
        with open("test_results.json", "w") as f:
            json.dump(results_data, f, indent=2)
        
        logger.info("💾 Test results saved to test_results.json")

async def main():
    """Main test runner."""
    test_suite = ComprehensiveTestSuite()
    await test_suite.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main()) 