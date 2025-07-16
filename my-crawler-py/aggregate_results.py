#!/usr/bin/env python3
"""
Advanced Crawler Results Aggregator
Analyzes all crawl data and generates comprehensive summary reports.
"""

import json
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Any
import argparse
import sys


class CrawlResultsAggregator:
    """Aggregates and analyzes crawl results from the advanced crawler."""
    
    def __init__(self, crawl_data_dir: str = "crawl_data"):
        self.crawl_data_dir = Path(crawl_data_dir)
        self.results = {
            'pages': [],
            'technologies': {},
            'apis': {},
            'storage': {},
            'performance': {},
            'errors': []
        }
    
    def load_all_data(self) -> Dict[str, Any]:
        """Load all crawl data from the organized directory structure."""
        
        if not self.crawl_data_dir.exists():
            print(f"Error: Crawl data directory '{self.crawl_data_dir}' not found.")
            return {}
        
        # Load comprehensive reports
        docs_dir = self.crawl_data_dir / 'docs'
        if docs_dir.exists():
            for report_file in docs_dir.glob('*_comprehensive_report.json'):
                try:
                    with open(report_file, 'r') as f:
                        data = json.load(f)
                        self.results['pages'].append(data)
                except Exception as e:
                    self.results['errors'].append(f"Error loading {report_file}: {e}")
        
        # Load storage dumps
        storage_dir = self.crawl_data_dir / 'storage_dumps'
        if storage_dir.exists():
            for storage_file in storage_dir.glob('*_storage.json'):
                try:
                    with open(storage_file, 'r') as f:
                        data = json.load(f)
                        url = storage_file.stem.replace('_storage', '')
                        self.results['storage'][url] = data
                except Exception as e:
                    self.results['errors'].append(f"Error loading {storage_file}: {e}")
        
        # Load API specifications
        api_dir = self.crawl_data_dir / 'api_specs'
        if api_dir.exists():
            for api_file in api_dir.glob('*_api_discovery.json'):
                try:
                    with open(api_file, 'r') as f:
                        data = json.load(f)
                        url = api_file.stem.replace('_api_discovery', '')
                        self.results['apis'][url] = data
                except Exception as e:
                    self.results['errors'].append(f"Error loading {api_file}: {e}")
        
        # Load UI analysis
        ui_dir = self.crawl_data_dir / 'ui_components'
        if ui_dir.exists():
            for ui_file in ui_dir.glob('*_ui_analysis.json'):
                try:
                    with open(ui_file, 'r') as f:
                        data = json.load(f)
                        url = ui_file.stem.replace('_ui_analysis', '')
                        if 'technologies' in data:
                            for tech, detected in data['technologies'].items():
                                if isinstance(detected, bool):
                                    if tech not in self.results['technologies']:
                                        self.results['technologies'][tech] = {'detected': 0, 'total': 0}
                                    self.results['technologies'][tech]['total'] += 1
                                    if detected:
                                        self.results['technologies'][tech]['detected'] += 1
                except Exception as e:
                    self.results['errors'].append(f"Error loading {ui_file}: {e}")
        
        return self.results
    
    def generate_summary_report(self) -> str:
        """Generate a comprehensive summary report."""
        
        if not self.results['pages']:
            return "No crawl data found to analyze."
        
        report = f"""# Advanced Crawler Summary Report

*Generated on: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}*

## Overview

- **Total Pages Crawled**: {len(self.results['pages'])}
- **Successful Extractions**: {len([p for p in self.results['pages'] if 'error' not in p.get('storage', {})])}
- **Failed Extractions**: {len([p for p in self.results['pages'] if 'error' in p.get('storage', {})])}

## Pages Analyzed

"""
        
        for page in self.results['pages']:
            url = page.get('metadata', {}).get('url', 'Unknown URL')
            title = page.get('ui_source', {}).get('title', 'No title')
            load_time = page.get('metadata', {}).get('performance', {}).get('load_time', 'N/A')
            
            report += f"- **{url}**\n"
            report += f"  - Title: {title}\n"
            report += f"  - Load Time: {load_time}ms\n"
            
            # Add technology stack
            techs = page.get('ui_source', {}).get('technologies', {})
            detected_techs = [tech for tech, detected in techs.items() if isinstance(detected, bool) and detected]
            if detected_techs:
                report += f"  - Technologies: {', '.join(detected_techs)}\n"
            
            # Add API count
            api_data = page.get('api_discovery', {})
            rest_count = len(api_data.get('rest_apis', []))
            gql_count = len(api_data.get('graphql_endpoints', []))
            ws_count = len(api_data.get('websocket_endpoints', []))
            
            if rest_count or gql_count or ws_count:
                report += f"  - APIs: {rest_count} REST, {gql_count} GraphQL, {ws_count} WebSocket\n"
            
            report += "\n"
        
        # Technology Stack Summary
        if self.results['technologies']:
            report += "## Technology Stack Analysis\n\n"
            report += "| Technology | Detected | Total Pages | Detection Rate |\n"
            report += "|------------|----------|-------------|----------------|\n"
            
            for tech, stats in self.results['technologies'].items():
                rate = (stats['detected'] / stats['total'] * 100) if stats['total'] > 0 else 0
                report += f"| {tech.title()} | {stats['detected']} | {stats['total']} | {rate:.1f}% |\n"
            
            report += "\n"
        
        # API Discovery Summary
        all_rest_apis = set()
        all_graphql_apis = set()
        all_websocket_apis = set()
        
        for page in self.results['pages']:
            api_data = page.get('api_discovery', {})
            all_rest_apis.update(api_data.get('rest_apis', []))
            all_graphql_apis.update(api_data.get('graphql_endpoints', []))
            all_websocket_apis.update(api_data.get('websocket_endpoints', []))
        
        if all_rest_apis or all_graphql_apis or all_websocket_apis:
            report += "## API Discovery Summary\n\n"
            
            if all_rest_apis:
                report += f"### REST APIs ({len(all_rest_apis)})\n"
                for api in sorted(all_rest_apis):
                    report += f"- `{api}`\n"
                report += "\n"
            
            if all_graphql_apis:
                report += f"### GraphQL Endpoints ({len(all_graphql_apis)})\n"
                for api in sorted(all_graphql_apis):
                    report += f"- `{api}`\n"
                report += "\n"
            
            if all_websocket_apis:
                report += f"### WebSocket Endpoints ({len(all_websocket_apis)})\n"
                for api in sorted(all_websocket_apis):
                    report += f"- `{api}`\n"
                report += "\n"
        
        # Storage Analysis
        storage_summary = self._analyze_storage()
        if storage_summary:
            report += "## Storage Analysis\n\n"
            report += storage_summary
            report += "\n"
        
        # Performance Analysis
        performance_summary = self._analyze_performance()
        if performance_summary:
            report += "## Performance Analysis\n\n"
            report += performance_summary
            report += "\n"
        
        # Errors Summary
        if self.results['errors']:
            report += "## Errors Encountered\n\n"
            for error in self.results['errors']:
                report += f"- {error}\n"
            report += "\n"
        
        report += "---\n*Report generated by Advanced Universal Web Crawler v2025.1*"
        
        return report
    
    def _analyze_storage(self) -> str:
        """Analyze storage data across all pages."""
        
        total_local_storage = 0
        total_session_storage = 0
        storage_errors = 0
        
        for url, storage_data in self.results['storage'].items():
            if 'error' in storage_data:
                storage_errors += 1
                continue
            
            total_local_storage += len(storage_data.get('localStorage', {}))
            total_session_storage += len(storage_data.get('sessionStorage', {}))
        
        if total_local_storage == 0 and total_session_storage == 0 and storage_errors == 0:
            return ""
        
        summary = f"- **Total localStorage items**: {total_local_storage}\n"
        summary += f"- **Total sessionStorage items**: {total_session_storage}\n"
        summary += f"- **Storage extraction errors**: {storage_errors}\n"
        
        return summary
    
    def _analyze_performance(self) -> str:
        """Analyze performance data across all pages."""
        
        load_times = []
        dom_content_loaded_times = []
        
        for page in self.results['pages']:
            perf = page.get('metadata', {}).get('performance', {})
            
            if 'load_time' in perf and perf['load_time'] is not None:
                load_times.append(perf['load_time'])
            
            if 'dom_content_loaded' in perf and perf['dom_content_loaded'] is not None:
                dom_content_loaded_times.append(perf['dom_content_loaded'])
        
        if not load_times and not dom_content_loaded_times:
            return ""
        
        summary = ""
        
        if load_times:
            avg_load = sum(load_times) / len(load_times)
            min_load = min(load_times)
            max_load = max(load_times)
            summary += f"- **Load Time**: Avg {avg_load:.1f}ms, Min {min_load:.1f}ms, Max {max_load:.1f}ms\n"
        
        if dom_content_loaded_times:
            avg_dom = sum(dom_content_loaded_times) / len(dom_content_loaded_times)
            min_dom = min(dom_content_loaded_times)
            max_dom = max(dom_content_loaded_times)
            summary += f"- **DOM Content Loaded**: Avg {avg_dom:.1f}ms, Min {min_dom:.1f}ms, Max {max_dom:.1f}ms\n"
        
        return summary
    
    def generate_csv_summary(self, output_file: str = "crawl_summary.csv") -> str:
        """Generate a CSV summary of all crawl data."""
        
        if not self.results['pages']:
            return "No data to export."
        
        # Prepare data for CSV
        csv_data = []
        
        for page in self.results['pages']:
            metadata = page.get('metadata', {})
            ui_source = page.get('ui_source', {})
            api_discovery = page.get('api_discovery', {})
            storage = page.get('storage', {})
            
            # Extract technologies
            techs = ui_source.get('technologies', {})
            detected_techs = [tech for tech, detected in techs.items() if isinstance(detected, bool) and detected]
            
            row = {
                'url': metadata.get('url', ''),
                'title': ui_source.get('title', ''),
                'load_time_ms': metadata.get('performance', {}).get('load_time', ''),
                'technologies': ', '.join(detected_techs),
                'rest_apis_count': len(api_discovery.get('rest_apis', [])),
                'graphql_endpoints_count': len(api_discovery.get('graphql_endpoints', [])),
                'websocket_endpoints_count': len(api_discovery.get('websocket_endpoints', [])),
                'local_storage_items': len(storage.get('localStorage', {})),
                'session_storage_items': len(storage.get('sessionStorage', {})),
                'has_storage_error': 'error' in storage,
                'timestamp': metadata.get('timestamp', '')
            }
            
            csv_data.append(row)
        
        # Create DataFrame and save
        df = pd.DataFrame(csv_data)
        df.to_csv(output_file, index=False)
        
        return f"CSV summary saved to {output_file}"
    
    def generate_json_summary(self, output_file: str = "crawl_summary.json") -> str:
        """Generate a JSON summary of all crawl data."""
        
        summary = {
            'metadata': {
                'generated_at': datetime.now(timezone.utc).isoformat(),
                'total_pages': len(self.results['pages']),
                'crawl_data_directory': str(self.crawl_data_dir)
            },
            'summary': {
                'technologies': self.results['technologies'],
                'total_rest_apis': sum(len(page.get('api_discovery', {}).get('rest_apis', [])) for page in self.results['pages']),
                'total_graphql_endpoints': sum(len(page.get('api_discovery', {}).get('graphql_endpoints', [])) for page in self.results['pages']),
                'total_websocket_endpoints': sum(len(page.get('api_discovery', {}).get('websocket_endpoints', [])) for page in self.results['pages']),
                'total_storage_errors': len([p for p in self.results['pages'] if 'error' in p.get('storage', {})])
            },
            'pages': self.results['pages'],
            'errors': self.results['errors']
        }
        
        with open(output_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        return f"JSON summary saved to {output_file}"


def main():
    parser = argparse.ArgumentParser(description="Aggregate and analyze advanced crawler results")
    parser.add_argument(
        "--input", "-i",
        default="crawl_data",
        help="Input crawl data directory (default: crawl_data)"
    )
    parser.add_argument(
        "--output", "-o",
        default="crawl_summary_report.md",
        help="Output markdown report file (default: crawl_summary_report.md)"
    )
    parser.add_argument(
        "--csv", "-c",
        help="Generate CSV summary (optional)"
    )
    parser.add_argument(
        "--json", "-j",
        help="Generate JSON summary (optional)"
    )
    
    args = parser.parse_args()
    
    # Initialize aggregator
    aggregator = CrawlResultsAggregator(args.input)
    
    # Load all data
    print("Loading crawl data...")
    aggregator.load_all_data()
    
    if not aggregator.results['pages']:
        print("No crawl data found. Please run the crawler first.")
        sys.exit(1)
    
    # Generate summary report
    print("Generating summary report...")
    summary_report = aggregator.generate_summary_report()
    
    with open(args.output, 'w') as f:
        f.write(summary_report)
    
    print(f"Summary report saved to: {args.output}")
    
    # Generate CSV if requested
    if args.csv:
        csv_result = aggregator.generate_csv_summary(args.csv)
        print(csv_result)
    
    # Generate JSON if requested
    if args.json:
        json_result = aggregator.generate_json_summary(args.json)
        print(json_result)
    
    # Print summary to console
    print(f"\nCrawl Analysis Complete!")
    print(f"- Pages analyzed: {len(aggregator.results['pages'])}")
    print(f"- Technologies detected: {len(aggregator.results['technologies'])}")
    print(f"- Errors encountered: {len(aggregator.results['errors'])}")


if __name__ == "__main__":
    main() 