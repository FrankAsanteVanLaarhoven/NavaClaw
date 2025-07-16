"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Play, 
  Square, 
  Download, 
  Settings, 
  BarChart3, 
  Code, 
  Eye, 
  Database,
  Globe,
  FileText,
  Zap,
  Shield,
  Camera,
  Network,
  Code2
} from "lucide-react"
import { crawlerService, CrawlRequest, CrawlResult, CrawlStats } from "@/lib/crawler-service"
import { toast } from "sonner"

export function CrawlerControl() {
  const [url, setUrl] = useState("")
  const [mode, setMode] = useState<"basic" | "enhanced" | "full_site" | "deep">("enhanced")
  const [isRunning, setIsRunning] = useState(false)
  const [currentResult, setCurrentResult] = useState<CrawlResult | null>(null)
  const [stats, setStats] = useState<CrawlStats | null>(null)
  const [history, setHistory] = useState<CrawlResult[]>([])
  const [options, setOptions] = useState({
    maxDepth: 3,
    extractSource: true,
    includeOCR: true,
    includeAST: true,
    includeNetwork: true,
    compliance: true,
  })

  useEffect(() => {
    loadStats()
    loadHistory()
    const interval = setInterval(loadStats, 5000) // Refresh stats every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const statsData = await crawlerService.getCrawlStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const loadHistory = async () => {
    try {
      const historyData = await crawlerService.getCrawlHistory()
      setHistory(historyData)
    } catch (error) {
      console.error("Failed to load history:", error)
    }
  }

  const handleStartCrawl = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    setIsRunning(true)
    setCurrentResult(null)

    try {
      const request: CrawlRequest = {
        url: url.trim(),
        mode,
        options,
      }

      const result = await crawlerService.startCrawl(request)
      setCurrentResult(result)
      
      if (result.status === "success") {
        toast.success("Crawl completed successfully!")
        loadStats()
        loadHistory()
      } else {
        toast.error(`Crawl failed: ${result.error}`)
      }
    } catch (error) {
      toast.error(`Crawl error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleStopCrawl = async () => {
    try {
      await crawlerService.stopCrawl()
      setIsRunning(false)
      toast.info("Crawl stopped")
    } catch (error) {
      toast.error("Failed to stop crawl")
    }
  }

  const handleExport = async (format: "json" | "csv" | "markdown") => {
    try {
      const data = await crawlerService.exportResults(format)
      const blob = new Blob([data], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `crawl-results.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleTechStackAnalysis = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    try {
      const analysis = await crawlerService.analyzeTechStack(url.trim())
      toast.success("Tech stack analysis completed!")
      console.log("Tech stack analysis:", analysis)
    } catch (error) {
      toast.error(`Tech stack analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleSourceExtraction = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
    }

    try {
      const extraction = await crawlerService.extractSourceCode(url.trim())
      toast.success("Source code extraction completed!")
      console.log("Source extraction:", extraction)
    } catch (error) {
      toast.error(`Source extraction failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Crawler Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Web Crawler Control
          </CardTitle>
          <CardDescription>
            Advanced web crawling with enhanced data extraction, OCR, AST analysis, and compliance features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Target URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isRunning}
              />
              <Button
                onClick={handleStartCrawl}
                disabled={isRunning || !url.trim()}
                className="min-w-[120px]"
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Crawl
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Crawl Mode Selection */}
          <div className="space-y-2">
            <Label>Crawl Mode</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "basic", label: "Basic", icon: Eye },
                { value: "enhanced", label: "Enhanced", icon: Zap },
                { value: "full_site", label: "Full Site", icon: Globe },
                { value: "deep", label: "Deep", icon: Database },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={mode === value ? "default" : "outline"}
                  onClick={() => setMode(value as any)}
                  disabled={isRunning}
                  className="justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <Tabs defaultValue="options" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDepth">Max Depth</Label>
                  <Input
                    id="maxDepth"
                    type="number"
                    min="1"
                    max="10"
                    value={options.maxDepth}
                    onChange={(e) => setOptions({ ...options, maxDepth: parseInt(e.target.value) })}
                    disabled={isRunning}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "extractSource", label: "Extract Source Code", icon: Code },
                  { key: "includeOCR", label: "OCR Analysis", icon: Camera },
                  { key: "includeAST", label: "AST Parsing", icon: Code2 },
                  { key: "includeNetwork", label: "Network Traffic", icon: Network },
                  { key: "compliance", label: "GDPR/CCPA Compliance", icon: Shield },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={options[key as keyof typeof options] as boolean}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, [key]: checked })
                      }
                      disabled={isRunning}
                    />
                    <Label htmlFor={key} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleTechStackAnalysis}
                  disabled={isRunning || !url.trim()}
                  variant="outline"
                  className="justify-start"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Tech Stack
                </Button>
                <Button
                  onClick={handleSourceExtraction}
                  disabled={isRunning || !url.trim()}
                  variant="outline"
                  className="justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Extract Source Code
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleExport("json")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  onClick={() => handleExport("csv")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button
                  onClick={() => handleExport("markdown")}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export MD
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Current Status */}
      {currentResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Crawl Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">URL:</span>
                <span className="text-sm text-muted-foreground">{currentResult.url}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={currentResult.status === "success" ? "default" : "destructive"}>
                  {currentResult.status}
                </Badge>
              </div>
              {currentResult.error && (
                <Alert>
                  <AlertDescription>{currentResult.error}</AlertDescription>
                </Alert>
              )}
              {currentResult.files && currentResult.files.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Generated Files:</span>
                  <div className="mt-2 space-y-1">
                    {currentResult.files.map((file, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Crawl Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalUrls}</div>
                <div className="text-sm text-muted-foreground">Total URLs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Meta Tags Extracted</span>
                <span className="font-medium">{stats.dataExtracted.metaTags}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Images Found</span>
                <span className="font-medium">{stats.dataExtracted.images}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Links Discovered</span>
                <span className="font-medium">{stats.dataExtracted.links}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>API Endpoints</span>
                <span className="font-medium">{stats.dataExtracted.apiEndpoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>OCR Results</span>
                <span className="font-medium">{stats.dataExtracted.ocrResults}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>AST Functions</span>
                <span className="font-medium">{stats.dataExtracted.astFunctions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Crawls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(0, 5).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{result.url}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={result.status === "success" ? "default" : "destructive"}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 