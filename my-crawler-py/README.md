# my-crawler-py

Professional web crawler with comprehensive logging, audit trails, and structured output for transparency and client communication.

## Features

- **Structured Logging**: Every crawl attempt is logged with URL, status, error details, and retry counts
- **Multiple Output Formats**: JSON (for audit/reproducibility) and CSV (for client sharing)
- **Professional Reporting**: Convert crawl results to markdown tables for non-technical stakeholders
- **Reproducible Workflows**: Fully scriptable and version-controlled pipeline

## Quick Start

### Prerequisites

Ensure you have [Poetry](https://python-poetry.org/) installed:

```sh
pipx install poetry
```

### Installation

```sh
poetry install
poetry run python -m playwright install --with-deps
```

### Running the Crawler

Use the automated script for complete setup and execution:

```sh
./run_crawler.sh
```

Or run manually:

```sh
poetry run python -m my_crawler_py.main
```

## Professional Workflow

### 1. Data Collection & Logging

The crawler automatically generates structured outputs:

- **`crawl_report.json`**: Complete audit trail with timestamps
- **`crawl_report.csv`**: Client-friendly format for spreadsheets

### 2. Data Processing & Transformation

Use shell utilities for additional processing:

```sh
# Filter successful crawls
jq '[.[] | select(.status == "success")]' crawl_report.json

# Count errors by type
jq 'group_by(.error) | map({error: .[0].error, count: length})' crawl_report.json
```

### 3. Professional Reporting

Convert crawl results to markdown tables for stakeholders:

```sh
# Generate markdown report
python export_to_markdown.py

# Save to file
python export_to_markdown.py --output report.md

# Use custom input
python export_to_markdown.py --input custom_report.csv --output client_report.md
```

### 4. Complete Pipeline Example

```sh
# Run crawler with full logging
./run_crawler.sh

# Generate professional report
python export_to_markdown.py --output client_report.md

# Share with stakeholders
cat client_report.md
```

## Output Formats

### JSON Structure (crawl_report.json)
```json
[
  {
    "url": "https://example.com/page",
    "status": "success|error",
    "error": "Error message or null",
    "retries": 0,
    "timestamp": "2025-07-15T17:00:45.641823Z"
  }
]
```

### CSV Structure (crawl_report.csv)
Standard CSV format with headers: `url,status,error,retries,timestamp`

### Markdown Report
Professional table format with metadata and timestamps for easy sharing.

## Audit & Transparency

- **Reproducibility**: All crawl parameters and results are logged
- **Error Tracking**: Detailed error information with retry counts
- **Timestamps**: UTC timestamps for all operations
- **Version Control**: All scripts and configurations are version-controlled

## Customization

- Modify `routes.py` to change crawl behavior
- Update `main.py` to adjust crawl parameters
- Extend `crawler_with_logging.py` for additional logging fields

