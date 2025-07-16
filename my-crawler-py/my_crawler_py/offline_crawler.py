#!/usr/bin/env python3
"""
Offline Crawler Module

This module provides offline crawling capabilities for local directories and zip files.
It supports all advanced features including multi-layer extraction, tech stack analysis,
and multiple output formats (JSON, CSV, Markdown).

Usage:
    python -m my_crawler_py.offline_crawler --input <directory_or_zip> [options]
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
from urllib.parse import urlparse, urljoin

# Import crawler components
from .tech_stack_analyzer import TechStackAnalyzer
from .enhanced_extraction import EnhancedDataExtractor
from .advanced_extraction import AdvancedDataExtractor
from .full_site_source_extractor import FullSiteSourceExtractor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class OfflineCrawler:
    """
    Offline crawler for processing local directories and zip files.
    """
    
    def __init__(self, input_path: str, output_dir: str = None, depth: int = 3):
        """
        Initialize the offline crawler.
        
        Args:
            input_path: Path to directory or zip file
            output_dir: Directory to save results (defaults to input_path + '_results')
            depth: Crawl depth for nested directories
        """
        self.input_path = Path(input_path)
        self.depth = depth
        
        if output_dir:
            self.output_dir = Path(output_dir)
        else:
            self.output_dir = self.input_path.parent / f"{self.input_path.stem}_results"
        
        # Create output directory
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize analyzers and extractors
        self.tech_analyzer = TechStackAnalyzer()
        self.enhanced_extractor = EnhancedDataExtractor()
        self.advanced_extractor = AdvancedDataExtractor()
        self.source_extractor = FullSiteSourceExtractor()
        
        # Results storage
        self.results = {
            'metadata': {
                'input_path': str(self.input_path),
                'output_dir': str(self.output_dir),
                'crawl_date': datetime.now().isoformat(),
                'total_files': 0,
                'processed_files': 0,
                'errors': []
            },
            'files': [],
            'tech_stack': {},
            'extracted_content': {},
            'source_code': {},
            'summary': {}
        }
    
    def extract_zip(self, zip_path: Path) -> Path:
        """
        Extract zip file to temporary directory.
        
        Args:
            zip_path: Path to zip file
            
        Returns:
            Path to extracted directory
        """
        temp_dir = Path(tempfile.mkdtemp(prefix="offline_crawl_"))
        
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)
            
            logger.info(f"Extracted {zip_path} to {temp_dir}")
            return temp_dir
            
        except Exception as e:
            logger.error(f"Failed to extract {zip_path}: {e}")
            raise
    
    def get_file_list(self, directory: Path, max_depth: int = None) -> List[Path]:
        """
        Get list of files to process from directory.
        
        Args:
            directory: Directory to scan
            max_depth: Maximum depth to scan (None for unlimited)
            
        Returns:
            List of file paths
        """
        files = []
        depth = max_depth or self.depth
        
        for root, dirs, filenames in os.walk(directory):
            current_depth = root.replace(str(directory), '').count(os.sep)
            if current_depth > depth:
                continue
                
            for filename in filenames:
                file_path = Path(root) / filename
                if self._should_process_file(file_path):
                    files.append(file_path)
        
        return files
    
    def _should_process_file(self, file_path: Path) -> bool:
        """
        Check if file should be processed.
        
        Args:
            file_path: Path to file
            
        Returns:
            True if file should be processed
        """
        # Skip hidden files and system files
        if file_path.name.startswith('.'):
            return False
        
        # Skip common non-content files
        skip_extensions = {
            '.exe', '.dll', '.so', '.dylib', '.bin', '.obj', '.o',
            '.pyc', '.pyo', '__pycache__', '.git', '.svn',
            '.DS_Store', 'Thumbs.db', '.tmp', '.temp'
        }
        
        if file_path.suffix.lower() in skip_extensions:
            return False
        
        # Skip large files (> 10MB)
        try:
            if file_path.stat().st_size > 10 * 1024 * 1024:
                return False
        except OSError:
            return False
        
        return True
    
    def process_file(self, file_path: Path, base_dir: Path) -> Dict[str, Any]:
        """
        Process a single file and extract information.
        
        Args:
            file_path: Path to file
            base_dir: Base directory for relative paths
            
        Returns:
            Dictionary with file information and extracted content
        """
        try:
            relative_path = file_path.relative_to(base_dir)
            
            file_info = {
                'path': str(relative_path),
                'absolute_path': str(file_path),
                'size': file_path.stat().st_size,
                'modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                'extension': file_path.suffix.lower(),
                'content_type': self._get_content_type(file_path),
                'extracted_content': {},
                'tech_stack_info': {},
                'source_code': {},
                'errors': []
            }
            
            # Read file content
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                file_info['content'] = content[:10000]  # Limit content size
            except Exception as e:
                file_info['errors'].append(f"Failed to read file: {e}")
                return file_info
            
            # Extract content based on file type
            if file_path.suffix.lower() in ['.html', '.htm']:
                file_info['extracted_content'] = self._extract_html_content(content, str(relative_path))
                file_info['tech_stack_info'] = self._analyze_tech_stack(content, str(relative_path))
            
            elif file_path.suffix.lower() in ['.js', '.ts', '.jsx', '.tsx']:
                file_info['source_code'] = self._extract_source_code(content, str(relative_path))
                file_info['tech_stack_info'] = self._analyze_tech_stack(content, str(relative_path))
            
            elif file_path.suffix.lower() in ['.css', '.scss', '.sass', '.less']:
                file_info['source_code'] = self._extract_source_code(content, str(relative_path))
            
            elif file_path.suffix.lower() in ['.py', '.java', '.cpp', '.c', '.php', '.rb', '.go']:
                file_info['source_code'] = self._extract_source_code(content, str(relative_path))
            
            elif file_path.suffix.lower() in ['.json', '.xml', '.yaml', '.yml', '.toml']:
                file_info['extracted_content'] = self._extract_structured_content(content, str(relative_path))
            
            elif file_path.suffix.lower() in ['.md', '.txt', '.rst']:
                file_info['extracted_content'] = self._extract_text_content(content, str(relative_path))
            
            return file_info
            
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return {
                'path': str(file_path),
                'errors': [str(e)]
            }
    
    def _get_content_type(self, file_path: Path) -> str:
        """Get content type based on file extension."""
        content_types = {
            '.html': 'text/html',
            '.htm': 'text/html',
            '.js': 'application/javascript',
            '.ts': 'application/typescript',
            '.jsx': 'application/javascript',
            '.tsx': 'application/typescript',
            '.css': 'text/css',
            '.scss': 'text/css',
            '.sass': 'text/css',
            '.less': 'text/css',
            '.py': 'text/x-python',
            '.java': 'text/x-java-source',
            '.cpp': 'text/x-c++src',
            '.c': 'text/x-csrc',
            '.php': 'text/x-php',
            '.rb': 'text/x-ruby',
            '.go': 'text/x-go',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.yaml': 'text/yaml',
            '.yml': 'text/yaml',
            '.toml': 'text/toml',
            '.md': 'text/markdown',
            '.txt': 'text/plain',
            '.rst': 'text/restructuredtext'
        }
        return content_types.get(file_path.suffix.lower(), 'application/octet-stream')
    
    def _extract_html_content(self, content: str, file_path: str) -> Dict[str, Any]:
        """Extract content from HTML files."""
        try:
            return self.enhanced_extractor.extract_from_html(content, file_path)
        except Exception as e:
            logger.error(f"Error extracting HTML content from {file_path}: {e}")
            return {'error': str(e)}
    
    def _extract_source_code(self, content: str, file_path: str) -> Dict[str, Any]:
        """Extract information from source code files."""
        try:
            return self.source_extractor.extract_source_info(content, file_path)
        except Exception as e:
            logger.error(f"Error extracting source code from {file_path}: {e}")
            return {'error': str(e)}
    
    def _extract_structured_content(self, content: str, file_path: str) -> Dict[str, Any]:
        """Extract content from structured files (JSON, XML, etc.)."""
        try:
            if file_path.endswith('.json'):
                return {'json_data': json.loads(content)}
            elif file_path.endswith(('.yaml', '.yml')):
                import yaml
                return {'yaml_data': yaml.safe_load(content)}
            elif file_path.endswith('.xml'):
                import xml.etree.ElementTree as ET
                root = ET.fromstring(content)
                return {'xml_data': self._xml_to_dict(root)}
            else:
                return {'raw_content': content[:1000]}
        except Exception as e:
            logger.error(f"Error extracting structured content from {file_path}: {e}")
            return {'error': str(e)}
    
    def _extract_text_content(self, content: str, file_path: str) -> Dict[str, Any]:
        """Extract content from text files."""
        try:
            return {
                'text_content': content,
                'word_count': len(content.split()),
                'line_count': len(content.splitlines())
            }
        except Exception as e:
            logger.error(f"Error extracting text content from {file_path}: {e}")
            return {'error': str(e)}
    
    def _analyze_tech_stack(self, content: str, file_path: str) -> Dict[str, Any]:
        """Analyze tech stack from file content."""
        try:
            return self.tech_analyzer.analyze_content(content, file_path)
        except Exception as e:
            logger.error(f"Error analyzing tech stack for {file_path}: {e}")
            return {'error': str(e)}
    
    def _xml_to_dict(self, element) -> Dict[str, Any]:
        """Convert XML element to dictionary."""
        result = {}
        for child in element:
            if len(child) == 0:
                result[child.tag] = child.text
            else:
                result[child.tag] = self._xml_to_dict(child)
        return result
    
    def crawl(self) -> Dict[str, Any]:
        """
        Perform the offline crawl.
        
        Returns:
            Dictionary with crawl results
        """
        logger.info(f"Starting offline crawl of {self.input_path}")
        
        # Determine input type and extract if needed
        if self.input_path.is_file() and self.input_path.suffix.lower() == '.zip':
            temp_dir = self.extract_zip(self.input_path)
            base_dir = temp_dir
            cleanup_needed = True
        elif self.input_path.is_dir():
            base_dir = self.input_path
            cleanup_needed = False
        else:
            raise ValueError(f"Input path must be a directory or zip file: {self.input_path}")
        
        try:
            # Get list of files to process
            files = self.get_file_list(base_dir)
            self.results['metadata']['total_files'] = len(files)
            
            logger.info(f"Found {len(files)} files to process")
            
            # Process each file
            for i, file_path in enumerate(files, 1):
                logger.info(f"Processing file {i}/{len(files)}: {file_path.name}")
                
                file_result = self.process_file(file_path, base_dir)
                self.results['files'].append(file_result)
                self.results['metadata']['processed_files'] += 1
                
                # Update progress
                if i % 10 == 0:
                    logger.info(f"Progress: {i}/{len(files)} files processed")
            
            # Generate summary and tech stack analysis
            self._generate_summary()
            self._analyze_overall_tech_stack()
            
            # Save results
            self._save_results()
            
            logger.info(f"Offline crawl completed. Results saved to {self.output_dir}")
            return self.results
            
        finally:
            # Cleanup temporary directory if needed
            if cleanup_needed:
                shutil.rmtree(temp_dir)
                logger.info(f"Cleaned up temporary directory: {temp_dir}")
    
    def _generate_summary(self):
        """Generate summary statistics."""
        files = self.results['files']
        
        # File type statistics
        file_types = {}
        total_size = 0
        error_count = 0
        
        for file_info in files:
            ext = file_info.get('extension', 'unknown')
            file_types[ext] = file_types.get(ext, 0) + 1
            total_size += file_info.get('size', 0)
            
            if file_info.get('errors'):
                error_count += 1
        
        self.results['summary'] = {
            'total_files': len(files),
            'file_types': file_types,
            'total_size_bytes': total_size,
            'total_size_mb': round(total_size / (1024 * 1024), 2),
            'error_count': error_count,
            'success_rate': round((len(files) - error_count) / len(files) * 100, 2) if files else 0
        }
    
    def _analyze_overall_tech_stack(self):
        """Analyze overall tech stack from all files."""
        tech_stack_data = {}
        
        for file_info in self.results['files']:
            tech_info = file_info.get('tech_stack_info', {})
            if tech_info and not tech_info.get('error'):
                for tech, info in tech_info.items():
                    if tech not in tech_stack_data:
                        tech_stack_data[tech] = {'count': 0, 'files': []}
                    tech_stack_data[tech]['count'] += 1
                    tech_stack_data[tech]['files'].append(file_info['path'])
        
        self.results['tech_stack'] = tech_stack_data
    
    def _save_results(self):
        """Save results in multiple formats."""
        # Save JSON results
        json_path = self.output_dir / 'crawl_results.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        # Save CSV summary
        csv_path = self.output_dir / 'crawl_summary.csv'
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['File Path', 'Size (bytes)', 'Extension', 'Content Type', 'Error Count'])
            for file_info in self.results['files']:
                writer.writerow([
                    file_info.get('path', ''),
                    file_info.get('size', 0),
                    file_info.get('extension', ''),
                    file_info.get('content_type', ''),
                    len(file_info.get('errors', []))
                ])
        
        # Save Markdown report
        md_path = self.output_dir / 'crawl_report.md'
        self._generate_markdown_report(md_path)
        
        # Save tech stack summary
        tech_csv_path = self.output_dir / 'tech_stack_summary.csv'
        with open(tech_csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Technology', 'File Count', 'Files'])
            for tech, info in self.results['tech_stack'].items():
                writer.writerow([tech, info['count'], '; '.join(info['files'][:5])])  # Show first 5 files
        
        logger.info(f"Results saved to {self.output_dir}")
    
    def _generate_markdown_report(self, output_path: Path):
        """Generate a comprehensive markdown report."""
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("# Offline Crawl Report\n\n")
            
            # Metadata
            f.write("## Crawl Metadata\n\n")
            metadata = self.results['metadata']
            f.write(f"- **Input Path:** {metadata['input_path']}\n")
            f.write(f"- **Output Directory:** {metadata['output_dir']}\n")
            f.write(f"- **Crawl Date:** {metadata['crawl_date']}\n")
            f.write(f"- **Total Files:** {metadata['total_files']}\n")
            f.write(f"- **Processed Files:** {metadata['processed_files']}\n\n")
            
            # Summary
            f.write("## Summary\n\n")
            summary = self.results['summary']
            f.write(f"- **Total Files:** {summary['total_files']}\n")
            f.write(f"- **Total Size:** {summary['total_size_mb']} MB\n")
            f.write(f"- **Success Rate:** {summary['success_rate']}%\n")
            f.write(f"- **Error Count:** {summary['error_count']}\n\n")
            
            # File types
            f.write("## File Types\n\n")
            for ext, count in sorted(summary['file_types'].items(), key=lambda x: x[1], reverse=True):
                f.write(f"- **{ext}:** {count} files\n")
            f.write("\n")
            
            # Tech stack
            f.write("## Technology Stack\n\n")
            for tech, info in sorted(self.results['tech_stack'].items(), key=lambda x: x[1]['count'], reverse=True):
                f.write(f"- **{tech}:** {info['count']} files\n")
            f.write("\n")
            
            # Errors
            if metadata['errors']:
                f.write("## Errors\n\n")
                for error in metadata['errors']:
                    f.write(f"- {error}\n")
                f.write("\n")
            
            # File details
            f.write("## File Details\n\n")
            for file_info in self.results['files'][:20]:  # Show first 20 files
                f.write(f"### {file_info['path']}\n")
                f.write(f"- **Size:** {file_info.get('size', 0)} bytes\n")
                f.write(f"- **Type:** {file_info.get('content_type', 'unknown')}\n")
                if file_info.get('errors'):
                    f.write(f"- **Errors:** {len(file_info['errors'])}\n")
                f.write("\n")


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(description='Offline Web Crawler')
    parser.add_argument('--input', '-i', required=True, help='Input directory or zip file')
    parser.add_argument('--output', '-o', help='Output directory (default: input_results)')
    parser.add_argument('--depth', '-d', type=int, default=3, help='Maximum crawl depth (default: 3)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    try:
        crawler = OfflineCrawler(args.input, args.output, args.depth)
        results = crawler.crawl()
        
        print(f"\nOffline crawl completed successfully!")
        print(f"Results saved to: {crawler.output_dir}")
        print(f"Files processed: {results['metadata']['processed_files']}")
        print(f"Success rate: {results['summary']['success_rate']}%")
        
    except Exception as e:
        logger.error(f"Crawl failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main() 