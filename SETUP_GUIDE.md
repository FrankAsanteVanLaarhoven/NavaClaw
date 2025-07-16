# DataMinerAI - Quick Setup Guide

## 🚀 Getting Started

Your DataMinerAI platform has been successfully saved to `/Users/frankvanlaarhoven/Desktop/dataminerAI/`

### Quick Start (Recommended)

1. **Navigate to the project:**
```bash
cd /Users/frankvanlaarhoven/Desktop/dataminerAI
```

2. **Install all dependencies:**
```bash
npm run install:all
```

3. **Start all services:**
```bash
npm start
```

That's it! Your platform will be available at:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001  
- **Python API:** http://localhost:8000

### Individual Service Management

**Start services individually:**
```bash
npm run start:python    # Python FastAPI server
npm run start:backend   # Node.js backend
npm run start:frontend  # Next.js frontend
```

**Check service status:**
```bash
npm run status
```

**Stop all services:**
```bash
npm run stop
```

### Manual Installation (if needed)

If the quick start doesn't work, install dependencies manually:

```bash
# Frontend dependencies
cd crawl-frontend
npm install

# Backend dependencies  
cd src/backend
npm install

# Python dependencies
cd ../../my-crawler-py
poetry install
```

### Troubleshooting

1. **Port conflicts:** Make sure ports 3000, 3001, and 8000 are available
2. **Python issues:** Ensure Poetry is installed and Python 3.9+ is available
3. **Node.js issues:** Ensure Node.js 18+ is installed
4. **Permission issues:** Make sure scripts are executable (`chmod +x *.sh`)

### Project Structure

```
dataminerAI/
├── crawl-frontend/     # Next.js frontend application
├── my-crawler-py/      # Python FastAPI crawler
├── start_all.sh       # Start all services
├── stop_all.sh        # Stop all services
├── status.sh          # Check service status
├── package.json       # Root package management
└── README.md          # Comprehensive documentation
```

### Next Steps

1. Open http://localhost:3000 to access the InsightsAI platform
2. Explore the dashboard, workspace, and notebook features
3. Try crawling a website using the workspace interface
4. Check the API documentation at http://localhost:8000/docs

---

**DataMinerAI** - Advanced Web Crawling & Analytics Platform
Built with Next.js, TypeScript, Python FastAPI, and AI integration 