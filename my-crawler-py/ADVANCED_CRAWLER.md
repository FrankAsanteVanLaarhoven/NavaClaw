# Advanced Universal Web Crawler v2025.1

A world-leading web crawler that invisibly navigates dynamic sites, harvests every layer of data, and produces self-organizing, documented repositories ready for developers and ML pipelines.

## 🚀 Key Features

### **Deep-Layer Data Harvesting**
- **localStorage & sessionStorage extraction** - Captures all client-side data
- **IndexedDB discovery** - Maps database structures and contents
- **UI source code analysis** - Extracts React/Vue components, inline styles, event handlers
- **API endpoint discovery** - Automatically maps REST, GraphQL, and WebSocket endpoints
- **Technology stack detection** - Identifies frameworks, libraries, and backend technologies

### **Professional Output Organization**
- **Self-organizing repository structure** - ML-based file taxonomy and organization
- **Real-time documentation generation** - Markdown reports with embedded metadata
- **Screenshot capture** - Visual documentation for every crawled page
- **Performance metrics** - Load times, paint events, and user experience data

### **Stealth & Anti-Bot Evasion**
- **Camoufox integration** - Advanced browser fingerprinting evasion
- **Behavioral mimicry** - Realistic mouse movements and scroll patterns
- **Adaptive retry logic** - Intelligent failure handling and recovery

## 📁 Output Structure

```
crawl_data/
├── raw_html/           # Original HTML content
├── ui_components/      # UI analysis and component extraction
├── storage_dumps/      # localStorage, sessionStorage, IndexedDB exports
├── api_specs/          # Discovered API endpoints and specifications
├── media_ocr/          # Screenshots and visual documentation
├── logs/              # Crawl logs and error reports
└── docs/              # Generated documentation and reports
    ├── README.md
    ├── architecture.pdf
    └── change_log.md
```

## 🛠 Installation & Setup

```bash
# Install dependencies
poetry install

# Install Playwright browsers
poetry run python -m playwright install --with-deps

# Run the advanced crawler
./run_crawler.sh
```

## 📊 Data Extraction Capabilities

### **Storage Harvesting**
```javascript
// Automatically extracts all localStorage data
const dump = {};
for (let i = 0; i < localStorage.length; i++) {
  const k = localStorage.key(i);
  dump[k] = localStorage.getItem(k);
}
window.__crawlerLocal = dump;
```

### **API Discovery**
- **REST APIs** - Automatic detection of `/api/`, `/rest/`, `/v1/`, `/v2/` endpoints
- **GraphQL** - Discovery of GraphQL endpoints and schema information
- **WebSockets** - Real-time connection monitoring and endpoint mapping
- **AJAX calls** - Complete request/response logging and analysis

### **Technology Stack Detection**
- **Frontend Frameworks**: React, Vue, Angular, Next.js, Gatsby
- **CSS Frameworks**: Bootstrap, Tailwind CSS
- **E-commerce**: Shopify, WooCommerce
- **CMS**: WordPress, Strapi
- **Backend Detection**: Node.js, PHP, Python, Java indicators

## 📈 Usage Examples

### **Basic Crawl with Advanced Extraction**
```bash
# Run crawler with comprehensive data harvesting
./run_crawler.sh
```

### **Generate Professional Reports**
```bash
# Create markdown report for stakeholders
poetry run python export_to_markdown.py --output client_report.md

# View comprehensive crawl data
ls -la crawl_data/
```

### **Analyze Extracted Data**
```bash
# View storage dumps
cat crawl_data/storage_dumps/*.json

# Check discovered APIs
cat crawl_data/api_specs/*.json

# Review technology stack
cat crawl_data/ui_components/*.json
```

## 🔍 Sample Output

### **Storage Analysis Report**
```markdown
# Advanced Crawl Report: https://example.com

## Storage Analysis

### Local Storage
```json
{
  "user_preferences": "{\"theme\":\"dark\",\"language\":\"en\"}",
  "session_token": "abc123def456",
  "analytics_id": "ga-123456"
}
```

### Technology Stack
- **React**: ✅
- **Bootstrap**: ✅
- **jQuery**: ❌
- **WordPress**: ❌

### API Discovery
- **REST APIs**: 5 endpoints found
- **GraphQL**: 1 endpoint found
- **WebSockets**: 2 endpoints found
```

## 🎯 Advanced Features

### **Self-Healing & Quality Control**
- **Validation rules** - Schema checks and duplicate detection
- **Drift detection** - Compares DOM changes to previous crawls
- **Adaptive retry** - Failed pages re-queued with alternate bypass tactics

### **Professional Documentation**
- **Auto-generated reports** - Markdown with embedded metadata
- **API specifications** - Swagger/OpenAPI format for discovered endpoints
- **Architecture diagrams** - Mermaid/PlantUML system documentation

### **Scalability & Performance**
- **Containerized deployment** - Kubernetes-ready microservices
- **Horizontal scaling** - Browser pods based on queue depth
- **Observability** - Prometheus + Grafana monitoring stack

## 🔧 Configuration

### **Crawl Parameters**
```python
# In main.py
crawler = PlaywrightCrawler(
    max_requests_per_crawl=50,  # Adjust based on target
    request_handler=router,
    browser_pool=BrowserPool(plugins=[CamoufoxPlugin()])
)
```

### **Output Directory**
```python
# In advanced_extraction.py
extractor = AdvancedDataExtractor(output_dir="custom_crawl_data")
```

## 📋 Implementation Roadmap

| Phase | Milestone | Deliverables |
|-------|-----------|--------------|
| **P0** ✅ | MVP vertical slice | Stealth browser, basic extraction, JSON output |
| **P1** ✅ | Data-layer expansion | Storage harvester, OCR, source-code parser |
| **P2** 🔄 | AI intelligence layer | Architecture detector, ML prioritisation |
| **P3** 🔄 | Self-organising repo & docs | File classifier, auto-docs, Git integration |
| **P4** ⏳ | Full self-healing | Drift detection, adaptive bypass, retraining loops |
| **P5** ⏳ | Enterprise hardening | RBAC, audit logging, GDPR/CCPA compliance |

## 🚨 Best Practices

### **Ethical Crawling**
- Respect robots.txt and rate limits
- Use appropriate user agents
- Implement proper delays between requests
- Follow website terms of service

### **Performance Optimization**
- Monitor memory usage during long crawls
- Implement proper error handling and retry logic
- Use connection pooling for efficiency
- Cache extracted data to avoid re-processing

### **Data Security**
- Encrypt sensitive extracted data
- Implement proper access controls
- Regular security audits of extracted data
- Compliance with data protection regulations

## 🤝 Contributing

This crawler is designed for professional use and research. Please ensure all crawling activities comply with applicable laws and website terms of service.

## 📄 License

Professional use license - contact for commercial deployment.

---

*Advanced Universal Web Crawler v2025.1 - World-leading data extraction and documentation system* 