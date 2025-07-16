#!/usr/bin/env python3
"""
FastAPI Server for My-Crawler
Provides REST API endpoints for the frontend to interact with the crawler.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import asyncio
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
import uvicorn

# Import your crawler modules
from my_crawler_py.main import main as run_crawler
from my_crawler_py.enhanced_extraction import EnhancedDataExtractor
from my_crawler_py.full_site_source_extractor import FullSiteSourceExtractor
from my_crawler_py.tech_stack_analyzer import TechStackAnalyzer
from my_crawler_py.compliance import ComplianceManager, PrivacyController

app = FastAPI(
    title="My-Crawler API",
    description="Advanced web crawling API with enhanced data extraction",
    version="1.0.0"
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for tracking crawls
active_crawls: Dict[str, Dict[str, Any]] = {}
crawl_history: List[Dict[str, Any]] = []
crawl_stats = {
    "totalUrls": 0,
    "successful": 0,
    "failed": 0,
    "pending": 0,
    "averageTime": 0,
    "dataExtracted": {
        "metaTags": 0,
        "images": 0,
        "links": 0,
        "apiEndpoints": 0,
        "ocrResults": 0,
        "astFunctions": 0,
    }
}

# Pydantic models for API requests/responses
class CrawlRequest(BaseModel):
    url: str
    mode: str = "enhanced"
    options: Optional[Dict[str, Any]] = None

class CrawlResponse(BaseModel):
    crawl_id: str
    status: str
    message: str
    timestamp: str

class CrawlStatus(BaseModel):
    crawl_id: str
    status: str
    progress: float
    current_url: Optional[str] = None
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class TechStackRequest(BaseModel):
    url: str

class SourceExtractionRequest(BaseModel):
    url: str

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "My-Crawler API",
        "version": "1.0.0",
        "endpoints": {
            "crawl": "POST /crawl - Start a new crawl",
            "status": "GET /status/{crawl_id} - Get crawl status",
            "stats": "GET /stats - Get overall statistics",
            "history": "GET /history - Get crawl history",
            "tech-stack": "POST /analyze-tech-stack - Analyze tech stack",
            "extract-source": "POST /extract-source - Extract source code",
            "export": "GET /export - Export results",
            "stop": "POST /stop - Stop active crawl"
        }
    }

@app.post("/crawl", response_model=CrawlResponse)
async def start_crawl(request: CrawlRequest, background_tasks: BackgroundTasks):
    """Start a new crawl operation."""
    try:
        crawl_id = str(uuid.uuid4())
        
        # Initialize crawl tracking
        active_crawls[crawl_id] = {
            "id": crawl_id,
            "url": request.url,
            "mode": request.mode,
            "options": request.options or {},
            "status": "running",
            "progress": 0.0,
            "start_time": datetime.now(timezone.utc).isoformat(),
            "current_url": None,
            "results": None,
            "error": None
        }
        
        # Add to history
        crawl_history.append({
            "crawl_id": crawl_id,
            "url": request.url,
            "mode": request.mode,
            "status": "started",
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        # Start crawl in background
        background_tasks.add_task(run_crawl_background, crawl_id, request)
        
        return CrawlResponse(
            crawl_id=crawl_id,
            status="started",
            message=f"Crawl started for {request.url}",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start crawl: {str(e)}")

async def run_crawl_background(crawl_id: str, request: CrawlRequest):
    """Run crawl operation in background."""
    try:
        crawl_info = active_crawls[crawl_id]
        
        # Update status
        crawl_info["status"] = "running"
        crawl_info["progress"] = 0.1
        
        # Initialize enhanced extractor
        extractor = EnhancedDataExtractor()
        
        # Simulate crawl progress
        for i in range(10):
            await asyncio.sleep(1)  # Simulate processing time
            crawl_info["progress"] = (i + 1) * 0.1
            crawl_info["current_url"] = f"Processing step {i + 1}"
        
        # Extract data (simplified for demo)
        extracted_data = {
            "url": request.url,
            "mode": request.mode,
            "meta_tags": {"seo": {}, "social": {}},
            "images": [],
            "links": [],
            "api_endpoints": [],
            "ocr_results": [],
            "ast_functions": [],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Update crawl info
        crawl_info["status"] = "completed"
        crawl_info["progress"] = 1.0
        crawl_info["results"] = extracted_data
        
        # Update stats
        crawl_stats["totalUrls"] += 1
        crawl_stats["successful"] += 1
        crawl_stats["dataExtracted"]["metaTags"] += len(extracted_data["meta_tags"].get("seo", {}))
        crawl_stats["dataExtracted"]["images"] += len(extracted_data["images"])
        crawl_stats["dataExtracted"]["links"] += len(extracted_data["links"])
        crawl_stats["dataExtracted"]["apiEndpoints"] += len(extracted_data["api_endpoints"])
        crawl_stats["dataExtracted"]["ocrResults"] += len(extracted_data["ocr_results"])
        crawl_stats["dataExtracted"]["astFunctions"] += len(extracted_data["ast_functions"])
        
        # Update history
        for entry in crawl_history:
            if entry["crawl_id"] == crawl_id:
                entry["status"] = "completed"
                entry["results"] = extracted_data
                break
                
    except Exception as e:
        crawl_info = active_crawls.get(crawl_id)
        if crawl_info:
            crawl_info["status"] = "failed"
            crawl_info["error"] = str(e)
        
        crawl_stats["failed"] += 1
        
        # Update history
        for entry in crawl_history:
            if entry["crawl_id"] == crawl_id:
                entry["status"] = "failed"
                entry["error"] = str(e)
                break

@app.get("/status/{crawl_id}", response_model=CrawlStatus)
async def get_crawl_status(crawl_id: str):
    """Get status of a specific crawl."""
    if crawl_id not in active_crawls:
        raise HTTPException(status_code=404, detail="Crawl not found")
    
    crawl_info = active_crawls[crawl_id]
    
    return CrawlStatus(
        crawl_id=crawl_id,
        status=crawl_info["status"],
        progress=crawl_info["progress"],
        current_url=crawl_info["current_url"],
        results=crawl_info["results"],
        error=crawl_info["error"]
    )

@app.get("/stats")
async def get_stats():
    """Get overall crawl statistics."""
    return crawl_stats

@app.get("/history")
async def get_history():
    """Get crawl history."""
    return crawl_history

@app.post("/analyze-tech-stack")
async def analyze_tech_stack(request: TechStackRequest):
    """Analyze technology stack of a website."""
    try:
        # Initialize tech stack analyzer
        analyzer = TechStackAnalyzer()
        
        # Analyze the URL
        analysis = await analyzer.analyze_tech_stack(request.url)
        
        return {
            "url": request.url,
            "analysis": analysis,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tech stack analysis failed: {str(e)}")

@app.post("/extract-source")
async def extract_source_code(request: SourceExtractionRequest):
    """Extract source code from a website."""
    try:
        # Initialize source extractor
        extractor = FullSiteSourceExtractor()
        
        # Extract source code
        results = await extractor.run_full_site_extraction([request.url])
        
        return {
            "url": request.url,
            "extraction_results": results,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Source extraction failed: {str(e)}")

@app.get("/export")
async def export_results(format: str = "json"):
    """Export crawl results."""
    try:
        if format == "json":
            return {
                "crawl_history": crawl_history,
                "stats": crawl_stats,
                "exported_at": datetime.now(timezone.utc).isoformat()
            }
        elif format == "csv":
            # Convert to CSV format
            csv_data = "url,mode,status,timestamp\n"
            for entry in crawl_history:
                csv_data += f"{entry['url']},{entry['mode']},{entry['status']},{entry['timestamp']}\n"
            return {"csv_data": csv_data}
        elif format == "markdown":
            # Convert to Markdown format
            md_data = "# Crawl Results\n\n"
            md_data += f"## Statistics\n- Total URLs: {crawl_stats['totalUrls']}\n"
            md_data += f"- Successful: {crawl_stats['successful']}\n"
            md_data += f"- Failed: {crawl_stats['failed']}\n\n"
            md_data += "## Recent Crawls\n\n"
            for entry in crawl_history[:10]:
                md_data += f"- **{entry['url']}** ({entry['status']}) - {entry['timestamp']}\n"
            return {"markdown_data": md_data}
        else:
            raise HTTPException(status_code=400, detail="Unsupported format")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@app.post("/stop")
async def stop_crawl():
    """Stop all active crawls."""
    try:
        stopped_count = 0
        for crawl_id, crawl_info in active_crawls.items():
            if crawl_info["status"] == "running":
                crawl_info["status"] = "stopped"
                stopped_count += 1
        
        return {
            "message": f"Stopped {stopped_count} active crawls",
            "stopped_count": stopped_count,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stop crawls: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 