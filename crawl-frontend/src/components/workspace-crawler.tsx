"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Globe, 
  Play, 
  Square, 
  Download, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Database,
  Code,
  FileText
} from "lucide-react"
import { 
  crawlerService, 
  CrawlRequest, 
  CrawlResult, 
  CrawlStats, 
  CrawlHistory,
  formatCrawlTime,
  getCrawlProgress,
  getCrawlStatusColor
} from "@/lib/crawler-service"

export default function WorkspaceCrawler() {
  const [url, setUrl] = useState("")
  const [mode, setMode] = useState<"basic" | "enhanced" | "full_site" | "deep">("enhanced")
  const [isLoading, setIsLoading] = useState(false)
  const [currentCrawl, setCurrentCrawl] = useState<CrawlResult | null>(null)
  const [crawlHistory, setCrawlHistory] = useState<CrawlHistory[]>([])
  const [stats, setStats] = useState<CrawlStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCrawlHistory()
    loadStats()
  }, [])

  const loadCrawlHistory = async () => {
    try {
      const history = await crawlerService.getCrawlHistory()
      setCrawlHistory(history)
    } catch (error) {
      console.error("Failed to load crawl history:", error)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await crawlerService.getCrawlStats()
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const startCrawl = async () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const request: CrawlRequest = {
        url: url.trim(),
        mode,
        options: {
          maxDepth: mode === "deep" ? 5 : 3,
          extractSource: mode === "full_site" || mode === "enhanced",
          includeOCR: mode === "enhanced",
          includeAST: mode === "enhanced",
          includeNetwork: mode === "enhanced",
          compliance: true,
        }
      }

      const result = await crawlerService.startCrawl(request)
      setCurrentCrawl(result)

      // Start polling for updates
      crawlerService.pollCrawlStatus(result.id, (updatedResult) => {
        setCurrentCrawl(updatedResult)
        if (updatedResult.status !== "running") {
          loadCrawlHistory()
          loadStats()
        }
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to start crawl")
    } finally {
      setIsLoading(false)
    }
  }

  const stopCrawl = async () => {
    if (!currentCrawl) return

    try {
      await crawlerService.stopCrawl(currentCrawl.id)
      setCurrentCrawl(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to stop crawl")
    }
  }

  const exportResults = async (format: "json" | "csv" | "markdown") => {
    if (!currentCrawl) return

    try {
      const data = await crawlerService.exportCrawlData(currentCrawl.id, format)
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `crawl-${currentCrawl.id}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to export results")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "stopped":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Web Crawler</h2>
          <p className="text-gray-400">Extract and analyze web data with advanced crawling capabilities</p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-cyan-400" />
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
            {stats?.activeCrawls || 0} Active
          </Badge>
        </div>
      </div>

      {/* Crawl Configuration */}
      <Card className="bg-black/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Start New Crawl</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="url" className="text-white">Target URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-black/50 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="mode" className="text-white">Crawl Mode</Label>
              <Select value={mode} onValueChange={(value: any) => setMode(value)}>
                <SelectTrigger className="bg-black/50 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Crawl</SelectItem>
                  <SelectItem value="enhanced">Enhanced (OCR, AST, Network)</SelectItem>
                  <SelectItem value="full_site">Full Site Source</SelectItem>
                  <SelectItem value="deep">Deep Crawl (5 levels)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={startCrawl}
              disabled={isLoading || !url.trim()}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? "Starting..." : "Start Crawl"}
            </Button>
            {currentCrawl && currentCrawl.status === "running" && (
              <Button onClick={stopCrawl} variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                <Square className="h-4 w-4 mr-2" />
                Stop Crawl
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Crawl Status */}
      {currentCrawl && (
        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {getStatusIcon(currentCrawl.status)}
              Current Crawl: {currentCrawl.url}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{currentCrawl.totalUrls}</p>
                <p className="text-sm text-gray-400">Total URLs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{currentCrawl.successful}</p>
                <p className="text-sm text-gray-400">Successful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{currentCrawl.failed}</p>
                <p className="text-sm text-gray-400">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-500">{getCrawlProgress(currentCrawl)}%</p>
                <p className="text-sm text-gray-400">Progress</p>
              </div>
            </div>

            <Progress value={getCrawlProgress(currentCrawl)} className="h-2" />

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Started: {new Date(currentCrawl.startTime).toLocaleString()}</span>
              {currentCrawl.endTime && (
                <span>Duration: {formatCrawlTime(currentCrawl.startTime, currentCrawl.endTime)}</span>
              )}
            </div>

            {currentCrawl.status === "completed" && (
              <div className="flex gap-2">
                <Button onClick={() => exportResults("json")} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button onClick={() => exportResults("csv")} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={() => exportResults("markdown")} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Markdown
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Statistics and History */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/50 border-white/10">
          <TabsTrigger value="stats" className="text-white">Statistics</TabsTrigger>
          <TabsTrigger value="history" className="text-white">History</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black/50 border-white/10">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.totalCrawls}</p>
                  <p className="text-sm text-gray-400">Total Crawls</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-white/10">
                <CardContent className="p-4 text-center">
                  <Database className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.completedCrawls}</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-white/10">
                <CardContent className="p-4 text-center">
                  <Code className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stats.totalUrlsCrawled}</p>
                  <p className="text-sm text-gray-400">URLs Crawled</p>
                </CardContent>
              </Card>
              <Card className="bg-black/50 border-white/10">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{Math.round(stats.averageCrawlTime)}s</p>
                  <p className="text-sm text-gray-400">Avg Time</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-2">
            {crawlHistory.map((crawl) => (
              <Card key={crawl.id} className="bg-black/50 border-white/10 hover:border-cyan-500/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(crawl.status)}
                      <div>
                        <p className="font-medium text-white">{crawl.url}</p>
                        <p className="text-sm text-gray-400">
                          {crawl.successful + crawl.failed} URLs • {formatCrawlTime(crawl.startTime, crawl.endTime)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getCrawlStatusColor(crawl.status)}>
                      {crawl.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 