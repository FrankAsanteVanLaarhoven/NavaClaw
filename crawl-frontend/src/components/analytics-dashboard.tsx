"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Activity, 
  FileText, 
  History, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  Globe,
  Clock,
  Zap
} from "lucide-react"
import { motion } from "motion/react"
import { CrawlersSection } from "@/components/sections/crawlers-section"
import { ReportsSection } from "@/components/sections/reports-section"
import { HistorySection } from "@/components/sections/history-section"
import { SettingsSection } from "@/components/sections/settings-section"
import { CrawlerControl } from "@/components/crawler-control"

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
}

interface MetricCard {
  id: string
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: number
  color: string
}

interface ChartData {
  name: string
  value: number
}

const navigation: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" />, isActive: true },
  { id: "crawlers", label: "Crawlers", icon: <Activity className="w-5 h-5" /> },
  { id: "reports", label: "Reports", icon: <FileText className="w-5 h-5" /> },
  { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
]

const metrics: MetricCard[] = [
  {
    id: "pages",
    title: "Pages Crawled",
    value: "15,203",
    description: "Total pages processed",
    icon: <Globe className="w-6 h-6" />,
    trend: 12.5,
    color: "text-accent-primary"
  },
  {
    id: "crawlers",
    title: "Active Crawlers",
    value: "452",
    description: "Currently running",
    icon: <Activity className="w-6 h-6" />,
    trend: 8.2,
    color: "text-accent-secondary"
  },
  {
    id: "errors",
    title: "Crawl Errors",
    value: "37",
    description: "Requires attention",
    icon: <AlertCircle className="w-6 h-6" />,
    trend: -15.3,
    color: "text-error"
  }
]

const chartData: ChartData[] = [
  { name: "00:00", value: 124 },
  { name: "04:00", value: 268 },
  { name: "08:00", value: 445 },
  { name: "12:00", value: 623 },
  { name: "16:00", value: 578 },
  { name: "20:00", value: 432 },
  { name: "24:00", value: 356 }
]

const NetworkVisualization = () => {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute inset-0">
        {/* Connection lines */}
        <motion.line
          key={`line-1-${animationKey}`}
          x1="80" y1="60" x2="160" y2="120"
          stroke="rgb(20, 184, 166)"
          strokeWidth="2"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.line
          key={`line-2-${animationKey}`}
          x1="160" y1="120" x2="240" y2="80"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
        />
        <motion.line
          key={`line-3-${animationKey}`}
          x1="240" y1="80" x2="320" y2="140"
          stroke="rgb(20, 184, 166)"
          strokeWidth="2"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
        />
        <motion.line
          key={`line-4-${animationKey}`}
          x1="160" y1="120" x2="200" y2="160"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.9, ease: "easeInOut" }}
        />

        {/* Nodes */}
        <motion.circle
          cx="80" cy="60" r="8"
          fill="rgb(20, 184, 166)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.circle
          cx="160" cy="120" r="12"
          fill="rgb(99, 102, 241)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.circle
          cx="240" cy="80" r="10"
          fill="rgb(20, 184, 166)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.circle
          cx="320" cy="140" r="8"
          fill="rgb(99, 102, 241)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.circle
          cx="200" cy="160" r="6"
          fill="rgb(20, 184, 166)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-2">Website Links</h3>
          <p className="text-white/80 text-sm">Real-time network analysis</p>
        </div>
      </div>
    </div>
  )
}

const SimpleChart = ({ data, color, title }: { data: ChartData[], color: string, title: string }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-32">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-8 rounded-t"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              />
              <span className="text-xs mt-1 text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                        <div className={`p-3 rounded-full bg-accent-primary/10 ${metric.color}`}>
                          {metric.icon}
                        </div>
                      </div>
                      {metric.trend && (
                        <div className="flex items-center mt-2">
                          <TrendingUp className={`w-4 h-4 mr-1 ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={`text-sm ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.trend > 0 ? '+' : ''}{metric.trend}%
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Crawler Control Integration */}
            <CrawlerControl />

            {/* Charts and Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleChart 
                data={chartData} 
                color="rgb(20, 184, 166)" 
                title="Crawl Activity (24h)" 
              />
              <NetworkVisualization />
            </div>
          </div>
        )
      case "crawlers":
        return <CrawlersSection />
      case "reports":
        return <ReportsSection />
      case "history":
        return <HistorySection />
      case "settings":
        return <SettingsSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-secondary to-background-primary">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control your web crawling operations</p>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-card rounded-lg p-1">
            {navigation.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => handleNavigation(item.id)}
                className="flex items-center space-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  )
}