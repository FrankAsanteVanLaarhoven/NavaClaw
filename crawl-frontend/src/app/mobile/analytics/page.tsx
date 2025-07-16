"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  DollarSign,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Share,
  Filter,
} from "lucide-react"

export default function MobileAnalytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [activeChart, setActiveChart] = useState("overview")

  const metrics = [
    {
      title: "Total Revenue",
      value: "$124,592",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Active Users",
      value: "8,429",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "cyan",
    },
    {
      title: "Page Views",
      value: "45,231",
      change: "-2.4%",
      trend: "down",
      icon: Eye,
      color: "purple",
    },
    {
      title: "Avg. Session",
      value: "4m 32s",
      change: "+15.3%",
      trend: "up",
      icon: Clock,
      color: "orange",
    },
  ]

  const timeRanges = [
    { id: "24h", label: "24h" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "90d", label: "90d" },
  ]

  const topPages = [
    { page: "/dashboard", views: "12,543", change: "+5.2%" },
    { page: "/analytics", views: "8,921", change: "+12.1%" },
    { page: "/projects", views: "6,432", change: "-2.3%" },
    { page: "/settings", views: "3,211", change: "+8.7%" },
  ]

  const deviceBreakdown = [
    { device: "Mobile", percentage: 68, color: "cyan" },
    { device: "Desktop", percentage: 28, color: "purple" },
    { device: "Tablet", percentage: 4, color: "emerald" },
  ]

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Analytics</h1>
              <p className="text-xs text-gray-400">Real-time insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {timeRanges.map((range) => (
              <Button
                key={range.id}
                variant={timeRange === range.id ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.id)}
                className={`whitespace-nowrap ${
                  timeRange === range.id ? "bg-purple-600 text-white" : "border-white/20 text-gray-300"
                }`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Key Metrics */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${metric.color}-400`} />
                    </div>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">{metric.title}</p>
                    <p className="text-lg font-bold text-white">{metric.value}</p>
                    <p className={`text-xs ${metric.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                      {metric.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Charts Section */}
      <section className="px-4">
        <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="traffic" className="data-[state=active]:bg-white/10 text-xs">
              Traffic
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-white/10 text-xs">
              Devices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Chart */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Revenue Trend</CardTitle>
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Revenue chart visualization</p>
                    <p className="text-xs text-gray-500 mt-1">Touch to interact</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">User growth chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            {/* Top Pages */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Top Pages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{page.page}</p>
                      <p className="text-xs text-gray-400">{page.views} views</p>
                    </div>
                    <div className={`text-xs ${page.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                      {page.change}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { source: "Direct", percentage: 45, color: "emerald" },
                    { source: "Search", percentage: 32, color: "cyan" },
                    { source: "Social", percentage: 15, color: "purple" },
                    { source: "Referral", percentage: 8, color: "orange" },
                  ].map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{source.source}</span>
                        <span className="text-white">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`bg-${source.color}-500 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            {/* Device Breakdown */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg border border-white/10 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <PieChart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Device distribution</p>
                    </div>
                  </div>

                  {deviceBreakdown.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-${device.color}-500`}></div>
                        <span className="text-sm text-white">{device.device}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{device.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { metric: "Page Load Time", value: "1.2s", status: "good" },
                  { metric: "First Paint", value: "0.8s", status: "good" },
                  { metric: "Time to Interactive", value: "2.1s", status: "warning" },
                  { metric: "Cumulative Layout Shift", value: "0.05", status: "good" },
                ].map((perf, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-sm text-gray-300">{perf.metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{perf.value}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          perf.status === "good"
                            ? "bg-emerald-500"
                            : perf.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
