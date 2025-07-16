# 🕷️ My-Crawler Frontend Integration

A comprehensive web crawling platform that integrates your advanced Python crawler with a modern React/Next.js frontend.

## 🚀 Quick Start

### 1. Start the Frontend
```bash
cd /Users/frankvanlaarhoven/Desktop/crawl-frontend
npm run dev
```
Frontend will be available at: **http://localhost:3001**

### 2. Start the Python Backend
```bash
cd /Users/frankvanlaarhoven/my-crawler/my-crawler-py
./start_api_server.sh
```
Backend API will be available at: **http://localhost:8000**

## 🎯 Features

### Dashboard (`http://localhost:3001/#dashboard`)
- **Real-time Crawler Control**: Start, stop, and monitor crawls
- **Advanced Configuration**: Multiple crawl modes and options
- **Live Statistics**: Real-time monitoring of crawl progress
- **Export Capabilities**: JSON, CSV, and Markdown export
- **Tech Stack Analysis**: Analyze website technologies
- **Source Code Extraction**: Extract full site source code

### Workspace (`http://localhost:3001/workspace`)
- **Project Management**: Create and manage crawling projects
- **Real-time Monitoring**: Live logs and progress tracking
- **Advanced Analytics**: Comprehensive statistics and reporting
- **Export Functions**: Multiple format exports
- **System Logs**: Detailed logging and debugging

## 🔧 Crawl Modes

### 1. Basic Mode
- Simple page extraction
- Basic meta tags and links
- Fast processing

### 2. Enhanced Mode (Default)
- Advanced data extraction
- OCR analysis for images
- AST parsing for JavaScript
- Network traffic monitoring
- GDPR/CCPA compliance

### 3. Full Site Mode
- Complete site crawling
- Source code extraction
- All assets downloaded
- Architecture analysis

### 4. Deep Mode
- Multi-depth crawling
- Comprehensive analysis
- Maximum data extraction
- Full compliance features

## 🛠️ Advanced Features

### Data Extraction
- **Meta Tags**: SEO and social media tags
- **Images**: OCR analysis and metadata
- **Links**: Internal and external link discovery
- **API Endpoints**: API discovery and documentation
- **JavaScript**: AST parsing and function analysis
- **Network Traffic**: Request/response monitoring

### Compliance & Privacy
- **GDPR Compliance**: Data anonymization
- **CCPA Compliance**: Privacy controls
- **Audit Logging**: Complete audit trails
- **Data Retention**: Configurable retention policies

### Export Formats
- **JSON**: Structured data export
- **CSV**: Tabular data export
- **Markdown**: Human-readable reports

## 📊 API Endpoints

### Core Endpoints
- `POST /crawl` - Start a new crawl
- `GET /status/{crawl_id}` - Get crawl status
- `GET /stats` - Get overall statistics
- `GET /history` - Get crawl history

### Analysis Endpoints
- `POST /analyze-tech-stack` - Analyze technology stack
- `POST /extract-source` - Extract source code

### Export Endpoints
- `GET /export?format=json` - Export as JSON
- `GET /export?format=csv` - Export as CSV
- `GET /export?format=markdown` - Export as Markdown

### Control Endpoints
- `POST /stop` - Stop active crawls

## 🎨 UI Components

### Crawler Control
- URL input with validation
- Mode selection (Basic, Enhanced, Full Site, Deep)
- Advanced options configuration
- Real-time status display
- Export functionality

### Project Management
- Project creation and configuration
- Project status tracking
- Real-time monitoring
- Comprehensive logging

### Analytics Dashboard
- Live statistics
- Progress visualization
- Network activity monitoring
- Performance metrics

## 🔄 Integration Flow

1. **Frontend Request**: User initiates crawl from UI
2. **API Communication**: Frontend sends request to Python backend
3. **Background Processing**: Python crawler processes in background
4. **Status Polling**: Frontend polls for status updates
5. **Real-time Updates**: UI updates with live progress
6. **Results Display**: Final results shown in dashboard/workspace

## 📁 File Structure

```
crawl-frontend/
├── src/
│   ├── components/
│   │   ├── crawler-control.tsx      # Main crawler UI
│   │   ├── workspace-crawler.tsx    # Workspace interface
│   │   └── analytics-dashboard.tsx  # Dashboard integration
│   ├── lib/
│   │   └── crawler-service.ts       # API communication
│   └── app/
│       ├── page.tsx                 # Main page
│       └── workspace/
│           └── page.tsx             # Workspace page

my-crawler-py/
├── api_server.py                    # FastAPI backend
├── start_api_server.sh             # Startup script
├── my_crawler_py/
│   ├── main.py                      # Core crawler
│   ├── enhanced_extraction.py       # Advanced extraction
│   ├── full_site_source_extractor.py # Source extraction
│   ├── tech_stack_analyzer.py       # Tech analysis
│   └── compliance.py                # Compliance features
└── pyproject.toml                   # Dependencies
```

## 🚀 Usage Examples

### Basic Crawl
1. Go to Dashboard
2. Enter URL (e.g., `https://example.com`)
3. Select "Enhanced" mode
4. Click "Start Crawl"
5. Monitor progress in real-time

### Advanced Project
1. Go to Workspace
2. Click "New Project"
3. Configure advanced options:
   - Max Depth: 3
   - Enable OCR Analysis
   - Enable AST Parsing
   - Enable Network Traffic
   - Enable Compliance
4. Create and start project
5. Monitor in real-time

### Tech Stack Analysis
1. Enter URL in crawler control
2. Click "Analyze Tech Stack"
3. View detailed technology analysis

### Source Code Extraction
1. Enter URL in crawler control
2. Click "Extract Source Code"
3. Download complete source code

## 🔧 Configuration

### Frontend Configuration
- Update `src/lib/crawler-service.ts` to change backend URL
- Modify components for custom UI
- Add new features in components

### Backend Configuration
- Update `api_server.py` for new endpoints
- Modify crawler behavior in Python modules
- Add new extraction features

## 🐛 Troubleshooting

### Frontend Issues
- Check if frontend is running on port 3001
- Verify API service is connecting to backend
- Check browser console for errors

### Backend Issues
- Ensure Python dependencies are installed
- Check if backend is running on port 8000
- Verify CORS settings for frontend communication

### Integration Issues
- Check network connectivity between frontend and backend
- Verify API endpoint responses
- Check browser network tab for failed requests

## 🔮 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Multiple users working on same project
- **Advanced Analytics**: Machine learning insights
- **Cloud Integration**: AWS/GCP deployment
- **Mobile App**: React Native mobile interface
- **API Marketplace**: Third-party integrations

### Customization Options
- **Custom Extractors**: Add domain-specific extraction
- **Workflow Automation**: Automated crawl scheduling
- **Data Pipeline**: Integration with data warehouses
- **Custom Reports**: Personalized reporting templates

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at `http://localhost:8000/docs`
3. Check browser console and network tab
4. Review Python backend logs

## 🎉 Success!

Your advanced web crawling platform is now fully integrated and ready to use! 

**Access Points:**
- **Dashboard**: http://localhost:3001/#dashboard
- **Workspace**: http://localhost:3001/workspace
- **API Docs**: http://localhost:8000/docs

Happy crawling! 🕷️✨ 