#!/usr/bin/env python3
"""
Utility script to convert crawl reports to markdown tables for professional reporting.
Usage: python export_to_markdown.py [--input crawl_report.csv] [--output report.md]
"""

import argparse
import sys
import pandas as pd
from pathlib import Path


def csv_to_markdown_table(csv_file: str, output_file: str = None) -> str:
    """
    Convert CSV crawl report to markdown table format.
    
    Args:
        csv_file: Path to the CSV file
        output_file: Optional output file path. If None, prints to stdout
    
    Returns:
        Markdown table as string
    """
    try:
        # Read CSV file
        df = pd.read_csv(csv_file)
        
        # Generate markdown table
        markdown_table = df.to_markdown(index=False, tablefmt="grid")
        
        # Add header and metadata
        timestamp = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
        header = f"# Crawl Report\n\n*Generated on: {timestamp}*\n\n"
        footer = f"\n\n---\n*Report generated from: {csv_file}*"
        
        full_report = header + markdown_table + footer
        
        # Output to file or stdout
        if output_file:
            with open(output_file, 'w') as f:
                f.write(full_report)
            print(f"Markdown report saved to: {output_file}")
        else:
            print(full_report)
            
        return full_report
        
    except FileNotFoundError:
        print(f"Error: CSV file '{csv_file}' not found.", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error converting CSV to markdown: {e}", file=sys.stderr)
        return None


def main():
    parser = argparse.ArgumentParser(
        description="Convert crawl report CSV to markdown table for professional reporting"
    )
    parser.add_argument(
        "--input", "-i",
        default="crawl_report.csv",
        help="Input CSV file (default: crawl_report.csv)"
    )
    parser.add_argument(
        "--output", "-o",
        help="Output markdown file (default: prints to stdout)"
    )
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not Path(args.input).exists():
        print(f"Error: Input file '{args.input}' not found.", file=sys.stderr)
        print("Please run the crawler first to generate crawl_report.csv", file=sys.stderr)
        sys.exit(1)
    
    # Convert to markdown
    result = csv_to_markdown_table(args.input, args.output)
    
    if result is None:
        sys.exit(1)


if __name__ == "__main__":
    main() 