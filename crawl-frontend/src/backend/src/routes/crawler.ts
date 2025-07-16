import express from "express"
import { Request, Response } from "express"
import axios from "axios"

const router = express.Router()

// Configuration for the Python crawler backend
const CRAWLER_BASE_URL = process.env.CRAWLER_BACKEND_URL || "http://localhost:8000"

// Health check for crawler backend
router.get("/health", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${CRAWLER_BASE_URL}/health`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Crawler backend is not available",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Start a new crawl
router.post("/start", async (req: Request, res: Response) => {
  try {
    const { url, mode, options } = req.body
    
    const response = await axios.post(`${CRAWLER_BASE_URL}/crawl`, {
      url,
      mode: mode || "enhanced",
      options: options || {
        maxDepth: 3,
        extractSource: true,
        includeOCR: true,
        includeAST: true,
        includeNetwork: true,
        compliance: true,
      }
    })
    
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to start crawl",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Get crawl status
router.get("/status/:crawlId", async (req: Request, res: Response) => {
  try {
    const { crawlId } = req.params
    const response = await axios.get(`${CRAWLER_BASE_URL}/status/${crawlId}`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to get crawl status",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Get crawl results
router.get("/results/:crawlId", async (req: Request, res: Response) => {
  try {
    const { crawlId } = req.params
    const response = await axios.get(`${CRAWLER_BASE_URL}/results/${crawlId}`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to get crawl results",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Get crawl statistics
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${CRAWLER_BASE_URL}/stats`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to get crawl statistics",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Get crawl history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${CRAWLER_BASE_URL}/history`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to get crawl history",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Stop a crawl
router.post("/stop/:crawlId", async (req: Request, res: Response) => {
  try {
    const { crawlId } = req.params
    const response = await axios.post(`${CRAWLER_BASE_URL}/stop/${crawlId}`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to stop crawl",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Export crawl data
router.get("/export/:crawlId/:format", async (req: Request, res: Response) => {
  try {
    const { crawlId, format } = req.params
    const response = await axios.get(`${CRAWLER_BASE_URL}/export/${crawlId}/${format}`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to export crawl data",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Tech stack analysis
router.post("/analyze-tech-stack", async (req: Request, res: Response) => {
  try {
    const { url } = req.body
    const response = await axios.post(`${CRAWLER_BASE_URL}/analyze-tech-stack`, { url })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to analyze tech stack",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

// Full site source extraction
router.post("/extract-source", async (req: Request, res: Response) => {
  try {
    const { url, options } = req.body
    const response = await axios.post(`${CRAWLER_BASE_URL}/extract-source`, { 
      url, 
      options: options || {} 
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: "Failed to extract source",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
})

export { router as crawlerRouter } 