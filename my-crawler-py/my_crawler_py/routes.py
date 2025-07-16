from crawlee.crawlers import PlaywrightCrawlingContext
from crawlee.router import Router
from .crawler_with_logging import log_crawl_result
from .advanced_extraction import AdvancedDataExtractor
from .enhanced_extraction import EnhancedDataExtractor
from .compliance import ComplianceManager, PrivacyController

router = Router[PlaywrightCrawlingContext]()


@router.default_handler
async def default_handler(context: PlaywrightCrawlingContext) -> None:
    """Enhanced request handler with advanced extraction, compliance, and privacy controls."""
    url = context.request.url
    retries = context.request.retry_count
    
    try:
        context.log.info(f'Processing {url} with enhanced extraction and compliance...')
        
        # Initialize compliance and privacy controls
        compliance_manager = ComplianceManager()
        privacy_controller = PrivacyController(compliance_manager)
        
        # Process crawl request with privacy controls
        subject_id = privacy_controller.process_crawl_request(
            url=url,
            user_id="system",
            ip_address=context.request.headers.get("x-forwarded-for"),
            user_agent=context.request.headers.get("user-agent")
        )
        
        # Initialize enhanced data extractor
        extractor = EnhancedDataExtractor()
        
        # Wait for page to fully load
        await context.page.wait_for_load_state('networkidle')
        
        # Extract comprehensive enhanced data
        extracted_data = await extractor.extract_enhanced_page_data(context.page, url)
        
        # Anonymize data for privacy compliance
        anonymized_data = privacy_controller.anonymize_crawl_data(extracted_data)
        
        # Save enhanced data to organized file structure
        saved_files = await extractor.save_enhanced_data(url, anonymized_data)
        
        # Basic data for Crawlee
        title = await context.page.query_selector('title')
        title_text = await title.inner_text() if title else None
        
        await context.push_data(
            {
                'url': context.request.loaded_url,
                'title': title_text,
                'data_subject_id': subject_id,
                'compliance_status': 'gdpr_ccpa_compliant',
                'extracted_files': saved_files,
                'meta_tags_count': len(anonymized_data['meta_tags'].get('seo', {})) + 
                                 len(anonymized_data['meta_tags'].get('social', {})),
                'network_requests': anonymized_data['network_traffic']['summary']['total_requests'],
                'ocr_images': len(anonymized_data['ocr_analysis'].get('images', [])),
                'ast_functions': len(anonymized_data['ast_analysis']['javascript'].get('functions', [])),
                'privacy_controls': {
                    'data_anonymized': True,
                    'retention_policy_applied': True,
                    'audit_trail_maintained': True
                }
            }
        )

        # Enqueue links for further crawling
        await context.enqueue_links()
        
        # Log successful processing with enhanced metrics
        await log_crawl_result(url, "success", None, retries)
        
        context.log.info(f'Enhanced extraction complete for {url}. Files saved: {list(saved_files.keys())}')
        
    except Exception as e:
        error_msg = str(e)
        context.log.error(f'Error processing {url}: {error_msg}')
        # Log error with retry count
        await log_crawl_result(url, "error", error_msg, retries)
        raise
