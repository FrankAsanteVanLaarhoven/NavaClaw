"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  Cloud,
  Zap,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
  Shield,
  Globe,
  Server,
  Smartphone,
} from "lucide-react"

export default function DataConnectorsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [connectors, setConnectors] = useState([
    {
      id: 1,
      name: "PostgreSQL Production",
      type: "Database",
      status: "connected",
      lastSync: "2 minutes ago",
      records: "2.4M",
      health: 98,
      icon: Database,
      color: "emerald",
    },
    {
      id: 2,
      name: "Salesforce CRM",
      type: "SaaS",
      status: "connected",
      lastSync: "5 minutes ago",
      records: "847K",
      health: 95,
      icon: Cloud,
      color: "cyan",
    },
    {
      id: 3,
      name: "AWS S3 Data Lake",
      type: "Cloud Storage",
      status: "syncing",
      lastSync: "Syncing...",
      records: "12.8M",
      health: 87,
      icon: Server,
      color: "purple",
    },
    {
      id: 4,
      name: "Google Analytics",
      type: "Analytics",
      status: "error",
      lastSync: "2 hours ago",
      records: "1.2M",
      health: 45,
      icon: Globe,
      color: "red",
    },
    {
      id: 5,
      name: "Stripe Payments",
      type: "Financial",
      status: "connected",
      lastSync: "1 minute ago",
      records: "156K",
      health: 99,
      icon: Zap,
      color: "orange",
    },
  ])

  const availableConnectors = [
    {
      name: "MongoDB",
      category: "Database",
      description: "Connect to MongoDB collections and documents",
      icon: Database,
      popular: true,
    },
    {
      name: "Snowflake",
      category: "Data Warehouse",
      description: "Enterprise data warehouse integration",
      icon: Cloud,
      popular: true,
    },
    {
      name: "HubSpot",
      category: "CRM",
      description: "Marketing and sales data integration",
      icon: Globe,
      popular: false,
    },
    {
      name: "Shopify",
      category: "E-commerce",
      description: "E-commerce platform data sync",
      icon: Smartphone,
      popular: true,
    },
    {
      name: "Tableau",
      category: "BI Tool",
      description: "Business intelligence data source",
      icon: Activity,
      popular: false,
    },
    {
      name: "Microsoft SQL Server",
      category: "Database",
      description: "Enterprise database connectivity",
      icon: Database,
      popular: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-emerald-400"
      case "syncing":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return CheckCircle
      case "syncing":
        return Clock
      case "error":
        return AlertCircle
      default:
        return Clock
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Data Connectors</h1>
            <p className="text-gray-400">Manage your data sources and real-time integrations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All
            </Button>
            <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400">
              <Plus className="mr-2 h-4 w-4" />
              Add Connector
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Connectors</p>
                  <p className="text-2xl font-bold text-white">5</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Database className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Records</p>
                  <p className="text-2xl font-bold text-white">17.4M</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Data Transferred</p>
                  <p className="text-2xl font-bold text-white">2.8 TB</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Health Score</p>
                  <p className="text-2xl font-bold text-white">94%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20">
              Active Connectors
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-cyan-500/20">
              Connector Marketplace
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-cyan-500/20">
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Connected Data Sources</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage and monitor your active data connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {connectors.map((connector) => {
                        const Icon = connector.icon
                        const StatusIcon = getStatusIcon(connector.status)

                        return (
                          <div
                            key={connector.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-12 h-12 rounded-lg bg-${connector.color}-500/20 flex items-center justify-center`}
                              >
                                <Icon className={`w-6 h-6 text-${connector.color}-400`} />
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{connector.name}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <span>{connector.type}</span>
                                  <span>•</span>
                                  <span>{connector.records} records</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <StatusIcon className={`w-4 h-4 ${getStatusColor(connector.status)}`} />
                                  <span className={`text-sm capitalize ${getStatusColor(connector.status)}`}>
                                    {connector.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">{connector.lastSync}</div>
                              </div>

                              <div className="w-16">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-400">Health</span>
                                  <span className="text-xs text-white">{connector.health}%</span>
                                </div>
                                <Progress value={connector.health} className="h-2" />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/5 border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Real-time Activity</CardTitle>
                    <CardDescription className="text-gray-400">Live data synchronization status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          source: "PostgreSQL Production",
                          action: "Data sync completed",
                          time: "2 min ago",
                          status: "success",
                        },
                        {
                          source: "Salesforce CRM",
                          action: "New records imported",
                          time: "5 min ago",
                          status: "success",
                        },
                        {
                          source: "AWS S3 Data Lake",
                          action: "Sync in progress",
                          time: "Now",
                          status: "progress",
                        },
                        {
                          source: "Google Analytics",
                          action: "Connection failed",
                          time: "2 hrs ago",
                          status: "error",
                        },
                        {
                          source: "Stripe Payments",
                          action: "Real-time update",
                          time: "1 min ago",
                          status: "success",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.status === "success"
                                ? "bg-emerald-400"
                                : activity.status === "progress"
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{activity.source}</p>
                            <p className="text-xs text-gray-400">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription className="text-gray-400">Common connector operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync All Sources
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Export Configuration
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        Global Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Audit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Available Connectors</CardTitle>
                    <CardDescription className="text-gray-400">
                      Browse and install new data source connectors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {availableConnectors.map((connector, index) => {
                        const Icon = connector.icon

                        return (
                          <div
                            key={index}
                            className="p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                  <Icon className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-white">{connector.name}</h3>
                                  <p className="text-sm text-gray-400">{connector.category}</p>
                                </div>
                              </div>
                              {connector.popular && (
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Popular</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-300 mb-4">{connector.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <CheckCircle className="w-3 h-3" />
                                <span>Real-time sync</span>
                              </div>
                              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400">
                                Install
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/5 border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: "Databases", count: 12 },
                        { name: "Cloud Storage", count: 8 },
                        { name: "CRM Systems", count: 6 },
                        { name: "Analytics", count: 9 },
                        { name: "E-commerce", count: 5 },
                        { name: "Financial", count: 7 },
                        { name: "Marketing", count: 4 },
                        { name: "Social Media", count: 3 },
                      ].map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <span className="text-sm text-white">{category.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Custom Connector</CardTitle>
                    <CardDescription className="text-gray-400">
                      Need a specific integration? Build your own.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-300">
                        Use our SDK to create custom connectors for your unique data sources.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full border-white/20 text-white">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Documentation
                        </Button>
                        <Button className="w-full bg-purple-500 hover:bg-purple-400">
                          <Plus className="mr-2 h-4 w-4" />
                          Start Building
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time performance monitoring across all connectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="h-64 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg border border-white/10 flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-cyan-400 mx-auto mb-3" />
                        <p className="text-gray-400">Performance Chart</p>
                        <p className="text-sm text-gray-500">Real-time metrics visualization</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold text-emerald-400">99.2%</div>
                        <div className="text-sm text-gray-400">Uptime</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold text-cyan-400">1.2s</div>
                        <div className="text-sm text-gray-400">Avg Response</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold text-purple-400">847K</div>
                        <div className="text-sm text-gray-400">Records/Hour</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold text-orange-400">0.02%</div>
                        <div className="text-sm text-gray-400">Error Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-gray-400">Monitor connector health and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {connectors.map((connector, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                connector.health > 90
                                  ? "bg-emerald-400"
                                  : connector.health > 70
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                              }`}
                            ></div>
                            <span className="text-sm text-white">{connector.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20">
                              <Progress value={connector.health} className="h-2" />
                            </div>
                            <span className="text-sm text-gray-400 w-10">{connector.health}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <h4 className="font-medium text-white mb-3">Recent Alerts</h4>
                      <div className="space-y-3">
                        {[
                          {
                            type: "warning",
                            message: "Google Analytics connection unstable",
                            time: "2 hours ago",
                          },
                          {
                            type: "info",
                            message: "AWS S3 sync completed successfully",
                            time: "4 hours ago",
                          },
                          {
                            type: "success",
                            message: "All connectors health check passed",
                            time: "6 hours ago",
                          },
                        ].map((alert, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                alert.type === "warning"
                                  ? "bg-yellow-400"
                                  : alert.type === "info"
                                    ? "bg-cyan-400"
                                    : "bg-emerald-400"
                              }`}
                            ></div>
                            <div>
                              <p className="text-sm text-white">{alert.message}</p>
                              <p className="text-xs text-gray-500">{alert.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1 border-white/20 text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure Alerts
                      </Button>
                      <Button className="flex-1 bg-cyan-500 hover:bg-cyan-400">
                        <Activity className="mr-2 h-4 w-4" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
