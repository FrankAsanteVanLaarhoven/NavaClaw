# Offline Crawler Documentation

The Offline Crawler provides comprehensive analysis capabilities for local directories and zip files, supporting all the advanced features of the web crawler including multi-layer extraction, tech stack analysis, and multiple output formats.

## Features

- **Directory & Zip Support**: Process local directories or zip files containing website files
- **Multi-Format Output**: Generate results in JSON, CSV, Markdown, or downloadable zip archives
- **Tech Stack Analysis**: Detect technologies, frameworks, and libraries used
- **Content Extraction**: Extract structured content from HTML, CSS, JavaScript, and other file types
- **Source Code Analysis**: Analyze source code files for patterns and dependencies
- **Comprehensive Reporting**: Generate detailed reports with statistics and insights
- **CLI & API Support**: Use via command line or REST API endpoints

## Installation

The offline crawler is included with the main crawler package. Ensure all dependencies are installed:

```bash
cd my-crawler-py
poetry install
```

## Usage

### Command Line Interface

#### Basic Usage

```bash
# Crawl a local directory
python offline_crawler_cli.py --input /path/to/website --output results

# Crawl a zip file
python offline_crawler_cli.py --input website.zip --depth 5 --verbose

# Generate specific output format
python offline_crawler_cli.py --input /path/to/website --output results --format csv
```

#### Command Line Options

- `--input, -i`: Input directory or zip file (required)
- `--output, -o`: Output directory (default: input_results)
- `--depth, -d`: Maximum crawl depth (default: 3)
- `--format, -f`: Output format: json, csv, markdown, zip, all (default: all)
- `--verbose, -v`: Verbose logging
- `--quiet, -q`: Suppress progress output
- `--max-file-size`: Maximum file size in MB (default: 10)

#### Examples

```bash
# Quick analysis of a website directory
python offline_crawler_cli.py -i ./my-website -o ./analysis

# Deep analysis of a zip file with verbose output
python offline_crawler_cli.py -i website-backup.zip -d 10 -v -o deep-analysis

# Generate only CSV summary
python offline_crawler_cli.py -i ./project -f csv -o summary

# Quiet mode for batch processing
python offline_crawler_cli.py -i ./sites/*.zip -q -o batch-results
```

### Python Module Usage

```python
from my_crawler_py.offline_crawler import OfflineCrawler

# Initialize crawler
crawler = OfflineCrawler(
    input_path="/path/to/website",
    output_dir="/path/to/results",
    depth=3
)

# Perform crawl
results = crawler.crawl()

# Access results
print(f"Files processed: {results['metadata']['processed_files']}")
print(f"Success rate: {results['summary']['success_rate']}%")
print(f"Tech stack: {list(results['tech_stack'].keys())}")
```

### API Endpoints

#### Upload Zip File for Offline Crawling

**Endpoint**: `POST /api/crawler/offline-crawl`

**Parameters**:
- `file`: Zip file upload (required)
- `depth`: Maximum crawl depth (default: 3)
- `output_format`: Output format (json, csv, markdown, zip)

**Example**:
```bash
curl -X POST "http://localhost:8000/api/crawler/offline-crawl" \
  -F "file=@website.zip" \
  -F "depth=5" \
  -F "output_format=json"
```

#### Crawl Server-Side Directory

**Endpoint**: `POST /api/crawler/offline-crawl-directory`

**Parameters**:
- `directory_path`: Path to directory on server (required)
- `depth`: Maximum crawl depth (default: 3)
- `output_format`: Output format (json, csv, markdown, zip)

**Example**:
```bash
curl -X POST "http://localhost:8000/api/crawler/offline-crawl-directory" \
  -F "directory_path=/var/www/website" \
  -F "depth=3" \
  -F "output_format=zip"
```

## Output Formats

### JSON Output

Comprehensive structured data including:
- File metadata and statistics
- Extracted content from HTML files
- Tech stack analysis results
- Source code analysis
- Summary statistics

```json
{
  "metadata": {
    "input_path": "/path/to/website",
    "output_dir": "/path/to/results",
    "crawl_date": "2024-01-15T10:30:00",
    "total_files": 150,
    "processed_files": 145,
    "errors": []
  },
  "files": [
    {
      "path": "index.html",
      "size": 2048,
      "extension": ".html",
      "content_type": "text/html",
      "extracted_content": {
        "title": "My Website",
        "headings": ["Welcome", "About", "Contact"],
        "links": ["/about", "/contact"],
        "images": ["logo.png", "hero.jpg"]
      },
      "tech_stack_info": {
        "react": {"confidence": 0.9, "version": "18.0.0"},
        "bootstrap": {"confidence": 0.8, "version": "5.0.0"}
      }
    }
  ],
  "tech_stack": {
    "react": {"count": 15, "files": ["index.html", "app.js"]},
    "bootstrap": {"count": 8, "files": ["styles.css", "index.html"]}
  },
  "summary": {
    "total_files": 150,
    "file_types": {".html": 25, ".js": 30, ".css": 20},
    "total_size_mb": 2.5,
    "success_rate": 96.7
  }
}
```

### CSV Output

Tabular data for easy analysis:
- File summary with paths, sizes, and error counts
- Tech stack summary with file counts
- Structured for spreadsheet analysis

### Markdown Output

Human-readable report including:
- Crawl metadata and summary
- File type statistics
- Technology stack overview
- Error details
- File details (first 20 files)

### Zip Archive

Complete results package containing:
- `crawl_results.json`: Full structured data
- `crawl_summary.csv`: File summary
- `crawl_report.md`: Human-readable report
- `tech_stack_summary.csv`: Technology analysis

## File Type Support

The offline crawler processes various file types:

### Web Files
- **HTML**: Content extraction, tech stack analysis
- **CSS**: Source code analysis, framework detection
- **JavaScript/TypeScript**: Source code analysis, dependency detection
- **JSX/TSX**: React component analysis

### Source Code
- **Python**: Code analysis, dependency detection
- **Java**: Source code analysis
- **C/C++**: Code analysis
- **PHP**: Web framework detection
- **Ruby**: Framework analysis
- **Go**: Package analysis

### Configuration Files
- **JSON**: Structured data extraction
- **XML**: Configuration analysis
- **YAML**: Configuration parsing
- **TOML**: Configuration analysis

### Documentation
- **Markdown**: Content extraction
- **Text**: Basic text analysis
- **RST**: Documentation analysis

## Tech Stack Detection

The crawler detects various technologies:

### Frontend Frameworks
- React, Vue, Angular, Svelte
- Bootstrap, Tailwind CSS, Material-UI
- jQuery, Lodash, Moment.js

### Backend Technologies
- Node.js, Express, FastAPI, Django
- PHP, Laravel, Symfony
- Ruby on Rails, Sinatra
- Java Spring, .NET Core

### Build Tools
- Webpack, Vite, Rollup
- Babel, TypeScript
- ESLint, Prettier

### Analytics & Monitoring
- Google Analytics, Hotjar
- Sentry, LogRocket
- New Relic, DataDog

## Performance Considerations

### File Size Limits
- Default maximum file size: 10MB
- Configurable via `--max-file-size` parameter
- Large files are skipped to maintain performance

### Memory Usage
- Content is limited to first 10KB per file
- Temporary files are cleaned up automatically
- Results are streamed to disk to minimize memory usage

### Processing Speed
- Parallel processing for large directories
- Progress reporting every 10 files
- Estimated processing time based on file count

## Error Handling

The crawler handles various error scenarios:

- **File Access Errors**: Logged and skipped
- **Corrupted Files**: Error details captured
- **Encoding Issues**: UTF-8 fallback with error logging
- **Large Files**: Skipped with size limit warnings
- **Invalid Content**: Graceful degradation with error reporting

## Integration Examples

### Batch Processing

```bash
#!/bin/bash
# Process multiple websites
for zipfile in websites/*.zip; do
    echo "Processing $zipfile..."
    python offline_crawler_cli.py -i "$zipfile" -o "results/$(basename "$zipfile" .zip)" -q
done
```

### API Integration

```python
import requests

def analyze_website_zip(zip_path, api_url="http://localhost:8000"):
    with open(zip_path, 'rb') as f:
        response = requests.post(
            f"{api_url}/api/crawler/offline-crawl",
            files={'file': f},
            data={'depth': 3, 'output_format': 'json'}
        )
    return response.json()

# Usage
results = analyze_website_zip('website.zip')
print(f"Tech stack: {list(results['results']['tech_stack'].keys())}")
```

### Custom Analysis

```python
from my_crawler_py.offline_crawler import OfflineCrawler

class CustomOfflineCrawler(OfflineCrawler):
    def process_file(self, file_path, base_dir):
        # Custom file processing logic
        result = super().process_file(file_path, base_dir)
        
        # Add custom analysis
        if file_path.suffix == '.html':
            result['custom_analysis'] = self.analyze_custom_patterns(result['content'])
        
        return result
    
    def analyze_custom_patterns(self, content):
        # Custom pattern analysis
        return {'patterns_found': len(content.split())}

# Usage
crawler = CustomOfflineCrawler('/path/to/website')
results = crawler.crawl()
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed with `poetry install`
2. **Permission Errors**: Check file/directory permissions
3. **Memory Issues**: Reduce `--max-file-size` or use `--depth` to limit processing
4. **Encoding Errors**: Files with non-UTF-8 encoding are handled gracefully

### Debug Mode

Use verbose logging for detailed information:

```bash
python offline_crawler_cli.py -i ./website -v
```

### Performance Optimization

- Use `--depth` to limit directory traversal
- Set appropriate `--max-file-size` for your use case
- Use `--quiet` for batch processing to reduce I/O

## API Documentation

For complete API documentation, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs with verbose mode
3. Ensure all dependencies are properly installed
4. Verify file permissions and paths 