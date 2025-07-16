# DataMinerAI - Advanced Web Crawling & Analytics Platform

A comprehensive web crawling and analytics platform built with Next.js, TypeScript, Python FastAPI, and advanced AI integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Poetry (Python package manager)
- npm or yarn

### Installation & Setup

1. **Clone and navigate to the project:**
```bash
cd /Users/frankvanlaarhoven/Desktop/dataminerAI
```

2. **Install Frontend Dependencies:**
```bash
cd crawl-frontend
npm install
```

3. **Install Backend Dependencies:**
```bash
cd src/backend
npm install
```

4. **Install Python Dependencies:**
```bash
cd ../../my-crawler-py
poetry install
```

### Running the Application

#### Option 1: Use the Startup Scripts

**Start all services:**
```bash
./start_all.sh
```

**Start services individually:**
```bash
./start_frontend.sh    # Frontend on port 3000
./start_backend.sh     # Node.js backend on port 3001  
./start_python.sh      # Python FastAPI on port 8000
```

#### Option 2: Manual Startup

1. **Start Python FastAPI Server:**
```bash
cd my-crawler-py
poetry run python api_server.py
```

2. **Start Node.js Backend:**
```bash
cd crawl-frontend/src/backend
npm run dev
```

3. **Start Next.js Frontend:**
```bash
cd crawl-frontend
npm run dev
```

## 🌐 Access Points

- **Frontend (InsightsAI):** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Python API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 🏗️ Architecture

### Frontend (Next.js + TypeScript)
- **Location:** `crawl-frontend/`
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS + shadcn/ui
- **Features:**
  - Modern landing page with AI-powered insights
  - Dashboard with real-time analytics
  - Workspace for web crawling projects
  - DataBricks-style notebook interface
  - Advanced data visualization

### Backend (Node.js + Express + TypeScript)
- **Location:** `crawl-frontend/src/backend/`
- **Framework:** Express.js with TypeScript
- **Features:**
  - API proxy to Python FastAPI
  - User authentication (mock)
  - Dashboard analytics
  - AI integration endpoints
  - Connector management

### Python Crawler (FastAPI)
- **Location:** `my-crawler-py/`
- **Framework:** FastAPI with async support
- **Features:**
  - Advanced web crawling with multiple strategies
  - Tech stack detection
  - Content extraction and analysis
  - JSON/CSV export capabilities
  - Markdown report generation
  - Enterprise-grade logging

## 🔧 Key Features

### Web Crawling
- **Multi-strategy crawling:** Basic, deep, and source extraction modes
- **Tech stack detection:** Identifies frameworks, libraries, and technologies
- **Content extraction:** Intelligent text, image, and link extraction
- **Rate limiting:** Configurable delays and respect for robots.txt
- **Export formats:** JSON, CSV, and Markdown reports

### AI Integration
- **OpenAI GPT-4/3.5:** Advanced text analysis and insights
- **Anthropic Claude:** Content summarization and analysis
- **Real-time processing:** Live data analysis during crawls
- **Custom prompts:** Configurable AI analysis templates

### Data Management
- **Real-time dashboard:** Live crawl monitoring and analytics
- **Data visualization:** Charts, graphs, and interactive displays
- **Export capabilities:** Multiple format support
- **Storage options:** Local file system and database integration

### User Interface
- **Modern design:** Clean, responsive interface
- **Dark/light mode:** Theme switching capability
- **Real-time updates:** Live data streaming
- **Mobile responsive:** Works on all device sizes

## 📁 Project Structure

```
dataminerAI/
├── crawl-frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── backend/        # Node.js backend API
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── my-crawler-py/          # Python FastAPI crawler
│   ├── my_crawler_py/      # Core crawler modules
│   ├── api_server.py       # FastAPI server
│   ├── pyproject.toml      # Python dependencies
│   └── poetry.lock         # Locked dependencies
├── start_all.sh           # Startup script for all services
├── start_frontend.sh      # Frontend startup script
├── start_backend.sh       # Backend startup script
├── start_python.sh        # Python startup script
└── README.md              # This file
```

## 🚀 Usage Examples

### Basic Web Crawl
```bash
curl -X POST http://localhost:8000/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "max_pages": 10,
    "strategy": "basic"
  }'
```

### Tech Stack Analysis
```bash
curl -X POST http://localhost:8000/analyze-tech-stack \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

### AI-Powered Insights
```bash
curl -X POST http://localhost:3001/ai/insights \
  -H "Content-Type: application/json" \
  -d '{
    "data": "your crawl data here",
    "analysis_type": "content_summary"
  }'
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective directories:

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000
```

**Backend (.env):**
```env
PORT=3001
PYTHON_API_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

**Python (.env):**
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
CRAWL_DELAY=1
MAX_CONCURRENT_REQUESTS=5
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:** Ensure ports 3000, 3001, and 8000 are available
2. **Python dependencies:** Run `poetry install` in the Python directory
3. **Node modules:** Run `npm install` in both frontend and backend directories
4. **TypeScript errors:** Check for proper type definitions and imports

### Logs
- **Frontend:** Check browser console and terminal output
- **Backend:** Check terminal output in backend directory
- **Python:** Check terminal output in Python directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation at http://localhost:8000/docs
3. Check the console logs for error messages

---

**DataMinerAI** - Advanced Web Crawling & Analytics Platform
Built with Next.js, TypeScript, Python FastAPI, and AI integration 