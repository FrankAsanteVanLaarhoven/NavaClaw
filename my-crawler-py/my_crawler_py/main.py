from camoufox import AsyncNewBrowser
from typing_extensions import override
import asyncio
import json
from datetime import datetime, timezone
import sys

from crawlee._utils.context import ensure_context
from crawlee.browsers import PlaywrightBrowserPlugin, PlaywrightBrowserController, BrowserPool
from crawlee.crawlers import PlaywrightCrawler
from crawlee.http_clients import HttpxHttpClient
from .routes import router
from .crawler_with_logging import log_crawl_result, export_crawl_report, export_crawl_report_csv
from .full_site_source_extractor import FullSiteSourceExtractor

class CamoufoxPlugin(PlaywrightBrowserPlugin):
    """Example browser plugin that uses Camoufox Browser, but otherwise keeps the functionality of
    PlaywrightBrowserPlugin."""

    @ensure_context
    @override
    async def new_browser(self) -> PlaywrightBrowserController:
        if not self._playwright:
            raise RuntimeError('Playwright browser plugin is not initialized.')

        return PlaywrightBrowserController(
            browser=await AsyncNewBrowser(self._playwright, headless=True),
            max_open_pages_per_browser=1,  #  Increase, if camoufox can handle it in your usecase.
            header_generator=None,  #  This turns off the crawlee header_generation. Camoufox has its own.
        )


async def main() -> None:
    """The crawler entry point."""
    mode = None
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()

    if mode == "extract_source":
        # Full site source extractor mode
        extractor = FullSiteSourceExtractor()
        await extractor.run_full_site_extraction(
            start_urls=[
                'https://httpbin.org',  # Reliable test site with some dynamic content
            ]
        )
        return

    crawler = PlaywrightCrawler(
        max_requests_per_crawl=10,
        request_handler=router,
        browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
    )

    try:
        await crawler.run(
            [
                'https://crawler.dev',
            ]
        )
        # Log successful completion
        await log_crawl_result("https://crawler.dev", "success", None, 0)
    except Exception as e:
        # Log any errors during crawl
        await log_crawl_result("https://crawler.dev", "error", str(e), 0)
        raise
    finally:
        # Export crawl report for transparency
        await export_crawl_report()
        await export_crawl_report_csv()
