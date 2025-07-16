import json
from datetime import datetime, timezone
import asyncio
import csv
import os
from pathlib import Path

CRAWL_LOG_FILE = "crawl_results.json"

def load_crawl_results():
    """Load existing crawl results from disk."""
    if os.path.exists(CRAWL_LOG_FILE):
        try:
            with open(CRAWL_LOG_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_crawl_results(results):
    """Save crawl results to disk."""
    with open(CRAWL_LOG_FILE, 'w') as f:
        json.dump(results, f, indent=2)

async def log_crawl_result(url, status, error, retries):
    """Log crawl result and persist to disk immediately."""
    result = {
        "url": url,
        "status": status,
        "error": error,
        "retries": retries,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    # Load existing results and append new one
    crawl_results = load_crawl_results()
    crawl_results.append(result)
    
    # Save back to disk immediately
    save_crawl_results(crawl_results)

async def export_crawl_report():
    """Export all crawl results to JSON file for transparency."""
    crawl_results = load_crawl_results()
    with open("crawl_report.json", "w") as f:
        json.dump(crawl_results, f, indent=2)
    print("Crawl report exported to crawl_report.json")

async def export_crawl_report_csv():
    """Export all crawl results to CSV file for transparency and client sharing."""
    crawl_results = load_crawl_results()
    if not crawl_results:
        print("No crawl results to export.")
        return
    keys = crawl_results[0].keys()
    with open("crawl_report.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(crawl_results)
    print("Crawl report exported to crawl_report.csv")

async def run_crawl():
    # Simulate real crawl outcomes for audit/logging
    await log_crawl_result("https://example.com/page1", "success", None, 0)
    await log_crawl_result("https://example.com/page2", "error", "TimeoutError", 2)
    await log_crawl_result("https://example.com/page3", "success", None, 1)

    # Export all outcomes for transparency
    await export_crawl_report()
    await export_crawl_report_csv()

if __name__ == "__main__":
    asyncio.run(run_crawl()) 