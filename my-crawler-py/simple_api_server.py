#!/usr/bin/env python3
"""
Simple FastAPI Server for My-Crawler
Provides REST API endpoints for the frontend to interact with the crawler.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import asyncio
import json
import uuid
import tempfile
import shutil
import zipfile
from datetime import datetime, timezone
from pathlib import Path
import uvicorn

# Import offline crawler
from my_crawler_py.offline_crawler import OfflineCrawler

app = FastAPI(
    title="My-Crawler API",
    description="Advanced web crawling API with enhanced data extraction",
    version="1.0.0"
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for tracking crawls
active_crawls: Dict[str, Dict[str, Any]] = {}
crawl_history: List[Dict[str, Any]] = []
crawl_stats = {
    "totalCrawls": 0,
    "activeCrawls": 0,
    "completedCrawls": 0,
    "failedCrawls": 0,
    "totalUrlsCrawled": 0,
    "averageCrawlTime": 0
}

# Pydantic models for API requests/responses
class CrawlRequest(BaseModel):
    url: str
    mode: str = "enhanced"
    options: Optional[Dict[str, Any]] = None

class CrawlResponse(BaseModel):
    id: str
    url: str
    status: str
    progress: float
    totalUrls: int
    successful: int
    failed: int
    startTime: str
    endTime: Optional[str] = None
    error: Optional[str] = None

class TechStackRequest(BaseModel):
    url: str

class SourceExtractionRequest(BaseModel):
    url: str
    options: Optional[Dict[str, Any]] = None

class OfflineCrawlRequest(BaseModel):
    depth: int = 3
    output_format: str = "json"  # json, csv, markdown, zip

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "My-Crawler API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /health - Health check",
            "crawl": "POST /api/crawler/start - Start a new crawl",
            "status": "GET /api/crawler/status/{crawl_id} - Get crawl status",
            "stats": "GET /api/crawler/stats - Get overall statistics",
            "history": "GET /api/crawler/history - Get crawl history",
            "tech-stack": "POST /api/crawler/analyze-tech-stack - Analyze tech stack",
            "extract-source": "POST /api/crawler/extract-source - Extract source code",
            "export": "GET /api/crawler/export/{crawl_id}/{format} - Export results",
            "stop": "POST /api/crawler/stop/{crawl_id} - Stop active crawl",
            "offline-crawl": "POST /api/crawler/offline-crawl - Upload zip file for offline crawling",
            "offline-crawl-directory": "POST /api/crawler/offline-crawl-directory - Crawl server-side directory"
        }
    }

@app.post("/api/crawler/start", response_model=CrawlResponse)
async def start_crawl(request: CrawlRequest, background_tasks: BackgroundTasks):
    """Start a new crawl operation."""
    try:
        crawl_id = str(uuid.uuid4())
        
        # Initialize crawl tracking
        active_crawls[crawl_id] = {
            "id": crawl_id,
            "url": request.url,
            "status": "running",
            "progress": 0.0,
            "totalUrls": 0,
            "successful": 0,
            "failed": 0,
            "startTime": datetime.now(timezone.utc).isoformat(),
            "endTime": None,
            "error": None
        }
        
        # Update stats
        crawl_stats["totalCrawls"] += 1
        crawl_stats["activeCrawls"] += 1
        
        # Start crawl in background
        background_tasks.add_task(run_crawl_background, crawl_id, request)
        
        return CrawlResponse(
            id=crawl_id,
            url=request.url,
            status="running",
            progress=0.0,
            totalUrls=0,
            successful=0,
            failed=0,
            startTime=datetime.now(timezone.utc).isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start crawl: {str(e)}")

async def run_crawl_background(crawl_id: str, request: CrawlRequest):
    """Run crawl operation in background."""
    try:
        crawl_info = active_crawls[crawl_id]
        
        # Simulate crawl progress
        total_steps = 10
        for i in range(total_steps):
            await asyncio.sleep(2)  # Simulate processing time
            progress = (i + 1) / total_steps
            crawl_info["progress"] = progress
            crawl_info["totalUrls"] = (i + 1) * 5
            crawl_info["successful"] = (i + 1) * 4
            crawl_info["failed"] = i + 1
        
        # Complete crawl
        crawl_info["status"] = "completed"
        crawl_info["progress"] = 1.0
        crawl_info["endTime"] = datetime.now(timezone.utc).isoformat()
        
        # Update stats
        crawl_stats["activeCrawls"] -= 1
        crawl_stats["completedCrawls"] += 1
        crawl_stats["totalUrlsCrawled"] += crawl_info["totalUrls"]
        
        # Add to history
        crawl_history.append({
            "id": crawl_id,
            "url": request.url,
            "status": "completed",
            "startTime": crawl_info["startTime"],
            "endTime": crawl_info["endTime"],
            "totalUrls": crawl_info["totalUrls"],
            "successful": crawl_info["successful"],
            "failed": crawl_info["failed"]
        })
                
    except Exception as e:
        crawl_info = active_crawls.get(crawl_id)
        if crawl_info:
            crawl_info["status"] = "failed"
            crawl_info["error"] = str(e)
            crawl_info["endTime"] = datetime.now(timezone.utc).isoformat()
            
            # Update stats
            crawl_stats["activeCrawls"] -= 1
            crawl_stats["failedCrawls"] += 1

@app.get("/api/crawler/status/{crawl_id}", response_model=CrawlResponse)
async def get_crawl_status(crawl_id: str):
    """Get the status of a specific crawl."""
    if crawl_id not in active_crawls:
        raise HTTPException(status_code=404, detail="Crawl not found")
    
    return CrawlResponse(**active_crawls[crawl_id])

@app.get("/api/crawler/stats")
async def get_stats():
    """Get overall crawling statistics."""
    return crawl_stats

@app.get("/api/crawler/history")
async def get_history():
    """Get crawl history."""
    return crawl_history

@app.post("/api/crawler/analyze-tech-stack")
async def analyze_tech_stack(request: TechStackRequest):
    """Analyze the technology stack of a website."""
    try:
        # Simulate tech stack analysis
        await asyncio.sleep(1)
        
        return {
            "url": request.url,
            "technologies": {
                "frontend": ["React", "TypeScript", "Tailwind CSS"],
                "backend": ["Node.js", "Express"],
                "database": ["PostgreSQL"],
                "cloud": ["AWS", "CloudFront"],
                "analytics": ["Google Analytics", "Hotjar"]
            },
            "confidence": 0.85,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze tech stack: {str(e)}")

@app.post("/api/crawler/extract-source")
async def extract_source_code(request: SourceExtractionRequest):
    """Extract source code from a website."""
    try:
        # Simulate source extraction
        await asyncio.sleep(2)
        
        return {
            "url": request.url,
            "html": "<html><head><title>Example</title></head><body><h1>Hello World</h1></body></html>",
            "css": ["styles.css", "main.css"],
            "javascript": ["app.js", "utils.js"],
            "images": ["logo.png", "hero.jpg"],
            "totalFiles": 5,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract source: {str(e)}")

@app.get("/api/crawler/export/{crawl_id}/{format}")
async def export_results(crawl_id: str, format: str):
    """Export crawl results in specified format."""
    if crawl_id not in active_crawls:
        raise HTTPException(status_code=404, detail="Crawl not found")
    
    crawl_info = active_crawls[crawl_id]
    
    if format == "json":
        return crawl_info
    elif format == "csv":
        # Convert to CSV format
        return {
            "format": "csv",
            "data": f"URL,Status,Total URLs,Successful,Failed\n{crawl_info['url']},{crawl_info['status']},{crawl_info['totalUrls']},{crawl_info['successful']},{crawl_info['failed']}"
        }
    elif format == "markdown":
        # Convert to Markdown format
        return {
            "format": "markdown",
            "data": f"# Crawl Report\n\n**URL:** {crawl_info['url']}\n**Status:** {crawl_info['status']}\n**Total URLs:** {crawl_info['totalUrls']}\n**Successful:** {crawl_info['successful']}\n**Failed:** {crawl_info['failed']}"
        }
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

@app.post("/api/crawler/stop/{crawl_id}")
async def stop_crawl(crawl_id: str):
    """Stop an active crawl."""
    if crawl_id not in active_crawls:
        raise HTTPException(status_code=404, detail="Crawl not found")
    
    crawl_info = active_crawls[crawl_id]
    if crawl_info["status"] != "running":
        raise HTTPException(status_code=400, detail="Crawl is not running")
    
    crawl_info["status"] = "stopped"
    crawl_info["endTime"] = datetime.now(timezone.utc).isoformat()
    
    # Update stats
    crawl_stats["activeCrawls"] -= 1
    
    return {"status": "stopped", "message": f"Crawl {crawl_id} stopped successfully"}

@app.post("/api/crawler/offline-crawl")
async def offline_crawl(
    file: UploadFile = File(...),
    depth: int = Form(3),
    output_format: str = Form("json")
):
    """
    Perform offline crawling on uploaded zip file or directory.
    
    Args:
        file: Zip file containing website files
        depth: Maximum crawl depth (default: 3)
        output_format: Output format (json, csv, markdown, zip)
    
    Returns:
        Crawl results in requested format
    """
    try:
        # Validate file type
        if not file.filename.endswith('.zip'):
            raise HTTPException(status_code=400, detail="Only zip files are supported")
        
        # Create temporary directory for processing
        temp_dir = Path(tempfile.mkdtemp(prefix="offline_crawl_"))
        zip_path = temp_dir / file.filename
        
        try:
            # Save uploaded file
            with open(zip_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # Create output directory
            output_dir = temp_dir / "results"
            output_dir.mkdir(exist_ok=True)
            
            # Initialize offline crawler
            crawler = OfflineCrawler(
                input_path=str(zip_path),
                output_dir=str(output_dir),
                depth=depth
            )
            
            # Perform crawl
            results = crawler.crawl()
            
            # Return results based on requested format
            if output_format == "json":
                return {
                    "status": "success",
                    "message": "Offline crawl completed successfully",
                    "results": results,
                    "output_files": [
                        str(output_dir / "crawl_results.json"),
                        str(output_dir / "crawl_summary.csv"),
                        str(output_dir / "crawl_report.md"),
                        str(output_dir / "tech_stack_summary.csv")
                    ]
                }
            
            elif output_format == "csv":
                csv_file = output_dir / "crawl_summary.csv"
                if csv_file.exists():
                    return FileResponse(
                        path=str(csv_file),
                        filename="offline_crawl_summary.csv",
                        media_type="text/csv"
                    )
                else:
                    raise HTTPException(status_code=500, detail="CSV file not generated")
            
            elif output_format == "markdown":
                md_file = output_dir / "crawl_report.md"
                if md_file.exists():
                    return FileResponse(
                        path=str(md_file),
                        filename="offline_crawl_report.md",
                        media_type="text/markdown"
                    )
                else:
                    raise HTTPException(status_code=500, detail="Markdown file not generated")
            
            elif output_format == "zip":
                # Create zip file with all results
                results_zip = temp_dir / "offline_crawl_results.zip"
                with zipfile.ZipFile(results_zip, 'w') as zipf:
                    for result_file in output_dir.glob("*"):
                        zipf.write(result_file, result_file.name)
                
                return FileResponse(
                    path=str(results_zip),
                    filename="offline_crawl_results.zip",
                    media_type="application/zip"
                )
            
            else:
                raise HTTPException(status_code=400, detail="Unsupported output format")
                
        finally:
            # Cleanup temporary files
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                print(f"Warning: Failed to cleanup temp directory {temp_dir}: {e}")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Offline crawl failed: {str(e)}")

@app.post("/api/crawler/offline-crawl-directory")
async def offline_crawl_directory(
    directory_path: str = Form(...),
    depth: int = Form(3),
    output_format: str = Form("json")
):
    """
    Perform offline crawling on a server-side directory.
    Note: This endpoint should only be used in trusted environments.
    
    Args:
        directory_path: Path to directory on server
        depth: Maximum crawl depth (default: 3)
        output_format: Output format (json, csv, markdown, zip)
    
    Returns:
        Crawl results in requested format
    """
    try:
        # Validate directory path
        dir_path = Path(directory_path)
        if not dir_path.exists() or not dir_path.is_dir():
            raise HTTPException(status_code=400, detail="Invalid directory path")
        
        # Create output directory
        output_dir = dir_path.parent / f"{dir_path.name}_crawl_results"
        output_dir.mkdir(exist_ok=True)
        
        # Initialize offline crawler
        crawler = OfflineCrawler(
            input_path=str(dir_path),
            output_dir=str(output_dir),
            depth=depth
        )
        
        # Perform crawl
        results = crawler.crawl()
        
        # Return results based on requested format
        if output_format == "json":
            return {
                "status": "success",
                "message": "Offline crawl completed successfully",
                "results": results,
                "output_files": [
                    str(output_dir / "crawl_results.json"),
                    str(output_dir / "crawl_summary.csv"),
                    str(output_dir / "crawl_report.md"),
                    str(output_dir / "tech_stack_summary.csv")
                ]
            }
        
        elif output_format == "csv":
            csv_file = output_dir / "crawl_summary.csv"
            if csv_file.exists():
                return FileResponse(
                    path=str(csv_file),
                    filename="offline_crawl_summary.csv",
                    media_type="text/csv"
                )
            else:
                raise HTTPException(status_code=500, detail="CSV file not generated")
        
        elif output_format == "markdown":
            md_file = output_dir / "crawl_report.md"
            if md_file.exists():
                return FileResponse(
                    path=str(md_file),
                    filename="offline_crawl_report.md",
                    media_type="text/markdown"
                )
            else:
                raise HTTPException(status_code=500, detail="Markdown file not generated")
        
        elif output_format == "zip":
            # Create zip file with all results
            results_zip = output_dir.parent / "offline_crawl_results.zip"
            with zipfile.ZipFile(results_zip, 'w') as zipf:
                for result_file in output_dir.glob("*"):
                    zipf.write(result_file, result_file.name)
            
            return FileResponse(
                path=str(results_zip),
                filename="offline_crawl_results.zip",
                media_type="application/zip"
            )
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported output format")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Offline crawl failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 