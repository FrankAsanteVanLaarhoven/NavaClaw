import { NextRequest, NextResponse } from 'next/server'

// Mock data for testing
let mockStats = {
  totalUrls: 0,
  successful: 0,
  failed: 0,
  pending: 0,
  averageTime: 0,
  dataExtracted: {
    metaTags: 0,
    images: 0,
    links: 0,
    apiEndpoints: 0,
    ocrResults: 0,
    astFunctions: 0,
  },
}

let mockHistory: any[] = []
let isCrawlRunning = false

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, mode, options } = body

    // Simulate crawl processing
    isCrawlRunning = true
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update mock stats
    mockStats.totalUrls += Math.floor(Math.random() * 50) + 10
    mockStats.successful += Math.floor(Math.random() * 40) + 8
    mockStats.failed += Math.floor(Math.random() * 5) + 1
    mockStats.dataExtracted.metaTags += Math.floor(Math.random() * 20) + 5
    mockStats.dataExtracted.images += Math.floor(Math.random() * 30) + 10
    mockStats.dataExtracted.links += Math.floor(Math.random() * 100) + 20
    mockStats.dataExtracted.apiEndpoints += Math.floor(Math.random() * 5) + 1
    mockStats.dataExtracted.ocrResults += Math.floor(Math.random() * 10) + 2
    mockStats.dataExtracted.astFunctions += Math.floor(Math.random() * 15) + 3

    // Add to history
    const result = {
      url,
      status: 'success' as const,
      data: {
        mode,
        options,
        extractedData: {
          metaTags: mockStats.dataExtracted.metaTags,
          images: mockStats.dataExtracted.images,
          links: mockStats.dataExtracted.links,
          apiEndpoints: mockStats.dataExtracted.apiEndpoints,
          ocrResults: mockStats.dataExtracted.ocrResults,
          astFunctions: mockStats.dataExtracted.astFunctions,
        }
      },
      files: [
        `/Users/frankvanlaarhoven/Desktop/AdvancedCrawlerData/${url.replace(/[^a-zA-Z0-9]/g, '_')}/crawl_results.json`,
        `/Users/frankvanlaarhoven/Desktop/AdvancedCrawlerData/${url.replace(/[^a-zA-Z0-9]/g, '_')}/crawl_report.md`,
        `/Users/frankvanlaarhoven/Desktop/AdvancedCrawlerData/${url.replace(/[^a-zA-Z0-9]/g, '_')}/meta_tags.json`,
      ],
      timestamp: new Date().toISOString(),
    }

    mockHistory.unshift(result)
    isCrawlRunning = false

    return NextResponse.json(result)
  } catch (error) {
    isCrawlRunning = false
    return NextResponse.json(
      { error: 'Crawl failed', status: 'error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = request.nextUrl.pathname

  if (path.includes('/stats')) {
    return NextResponse.json(mockStats)
  }

  if (path.includes('/history')) {
    return NextResponse.json(mockHistory)
  }

  if (path.includes('/status')) {
    return NextResponse.json({
      isRunning: isCrawlRunning,
      currentStats: mockStats
    })
  }

  return NextResponse.json({ message: 'Crawler API endpoint' })
} 