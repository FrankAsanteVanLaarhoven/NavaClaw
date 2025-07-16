#!/usr/bin/env python3
"""
Offline Crawler CLI

Standalone command-line interface for offline crawling of local directories and zip files.
This script can be run directly without importing the module.

Usage:
    python offline_crawler_cli.py --input <directory_or_zip> [options]
"""

import os
import sys
import json
import csv
import zipfile
import tempfile
import shutil
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
import logging

# Add the current directory to Python path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import crawler components
from my_crawler_py.offline_crawler import OfflineCrawler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Offline Web Crawler - Analyze local directories and zip files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Crawl a local directory
  python offline_crawler_cli.py --input /path/to/website --output results
  
  # Crawl a zip file
  python offline_crawler_cli.py --input website.zip --depth 5 --verbose
  
  # Generate CSV output
  python offline_crawler_cli.py --input /path/to/website --output results --format csv
  
  # Generate all output formats
  python offline_crawler_cli.py --input website.zip --output results --format all
        """
    )
    
    parser.add_argument(
        '--input', '-i', 
        required=True, 
        help='Input directory or zip file to crawl'
    )
    
    parser.add_argument(
        '--output', '-o', 
        help='Output directory (default: input_results)'
    )
    
    parser.add_argument(
        '--depth', '-d', 
        type=int, 
        default=3, 
        help='Maximum crawl depth (default: 3)'
    )
    
    parser.add_argument(
        '--format', '-f',
        choices=['json', 'csv', 'markdown', 'zip', 'all'],
        default='all',
        help='Output format (default: all)'
    )
    
    parser.add_argument(
        '--verbose', '-v', 
        action='store_true', 
        help='Verbose logging'
    )
    
    parser.add_argument(
        '--quiet', '-q',
        action='store_true',
        help='Suppress progress output'
    )
    
    parser.add_argument(
        '--max-file-size',
        type=int,
        default=10,
        help='Maximum file size in MB (default: 10)'
    )
    
    args = parser.parse_args()
    
    # Configure logging
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    elif args.quiet:
        logging.getLogger().setLevel(logging.WARNING)
    
    try:
        # Validate input path
        input_path = Path(args.input)
        if not input_path.exists():
            logger.error(f"Input path does not exist: {input_path}")
            sys.exit(1)
        
        if not (input_path.is_dir() or (input_path.is_file() and input_path.suffix.lower() == '.zip')):
            logger.error(f"Input must be a directory or zip file: {input_path}")
            sys.exit(1)
        
        # Create output directory
        if args.output:
            output_dir = Path(args.output)
        else:
            output_dir = input_path.parent / f"{input_path.stem}_results"
        
        output_dir.mkdir(exist_ok=True)
        
        logger.info(f"Starting offline crawl of {input_path}")
        logger.info(f"Output directory: {output_dir}")
        logger.info(f"Crawl depth: {args.depth}")
        logger.info(f"Output format: {args.format}")
        
        # Initialize crawler
        crawler = OfflineCrawler(
            input_path=str(input_path),
            output_dir=str(output_dir),
            depth=args.depth
        )
        
        # Perform crawl
        start_time = datetime.now()
        results = crawler.crawl()
        end_time = datetime.now()
        
        # Calculate duration
        duration = end_time - start_time
        
        # Print summary
        print("\n" + "="*60)
        print("OFFLINE CRAWL COMPLETED SUCCESSFULLY")
        print("="*60)
        print(f"Input: {input_path}")
        print(f"Output: {output_dir}")
        print(f"Duration: {duration}")
        print(f"Files processed: {results['metadata']['processed_files']}")
        print(f"Success rate: {results['summary']['success_rate']}%")
        print(f"Total size: {results['summary']['total_size_mb']} MB")
        
        # Print file type summary
        print("\nFile Types:")
        for ext, count in sorted(results['summary']['file_types'].items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"  {ext}: {count} files")
        
        # Print tech stack summary
        if results['tech_stack']:
            print("\nTechnology Stack:")
            for tech, info in sorted(results['tech_stack'].items(), key=lambda x: x[1]['count'], reverse=True)[:10]:
                print(f"  {tech}: {info['count']} files")
        
        # Print output files
        print("\nOutput Files:")
        output_files = [
            output_dir / "crawl_results.json",
            output_dir / "crawl_summary.csv", 
            output_dir / "crawl_report.md",
            output_dir / "tech_stack_summary.csv"
        ]
        
        for file_path in output_files:
            if file_path.exists():
                size = file_path.stat().st_size
                print(f"  {file_path.name}: {size} bytes")
        
        print("\nResults saved successfully!")
        
    except KeyboardInterrupt:
        logger.info("Crawl interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Crawl failed: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main() 