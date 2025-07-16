"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Bell,
  Menu,
  Search,
  Plus,
  TrendingUp,
  Users,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Share,
  MoreVertical,
  Filter,
  Calendar,
} from "lucide-react"

export default function MobileDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showMenu, setShowMenu] = useState(false)

  const stats = [
    { label: "Projects", value: "24", change: "+12%", trend: "up", color: "emerald" },
    { label: "Users", value: "1.4K", change: "+24%", trend: "up", color: "cyan" },
    { label: "Data", value: "2.4TB", change: "+18%", trend: "up", color: "purple" },
    { label: "Revenue", value: "$52K", change: "-3%", trend: "down", color: "pink" },
  ]

  const recentProjects = [
    {
      name: "Sales Analytics Q4",
      status: "Active",
      progress: 85,
      team: 4,
      updated: "2h ago",
      color: "emerald",
    },
    {
      name: "Customer Insights",
      status: "Review",
      progress: 92,
      team: 6,
      updated: "4h ago",
      color: "cyan",
    },
    {
      name: "Market Research",
      status: "Planning",
      progress: 35,
      team: 3,
      updated: "1d ago",
      color: "purple",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setShowMenu(!showMenu)} className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome back, Alex</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600"></div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, data..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{stat.label}</span>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                </div>
                <div className="text-xl font-bold mb-1">{stat.value}</div>
                <div className={`text-xs ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
          <Button variant="outline" className="border-white/20 whitespace-nowrap">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-white/20 whitespace-nowrap">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </section>

      {/* Mobile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 text-xs">
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white/10 text-xs">
            Projects
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10 text-xs">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Touch to expand chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: "Dashboard created", time: "2h ago", user: "Alex Johnson" },
                { action: "Data sync completed", time: "4h ago", user: "System" },
                { action: "Report generated", time: "6h ago", user: "Sarah Chen" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {recentProjects.map((project, index) => (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        className={`bg-${project.color}-500/10 text-${project.color}-400 border-${project.color}-500/20 text-xs`}
                      >
                        {project.status}
                      </Badge>
                      <span className="text-xs text-gray-400">{project.updated}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r from-${project.color}-500 to-${project.color}-400 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{project.team} members</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="p-2">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { metric: "Conversion Rate", value: "3.2%", change: "+0.4%", trend: "up" },
                { metric: "Avg Session", value: "4m 32s", change: "+12s", trend: "up" },
                { metric: "Bounce Rate", value: "24.1%", change: "-2.1%", trend: "down" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm text-white font-medium">{item.metric}</p>
                    <p className="text-lg font-bold text-white">{item.value}</p>
                  </div>
                  <div className={`text-right ${item.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {item.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 mb-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mb-1" />
                    )}
                    <p className="text-xs">{item.change}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mobile Navigation Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md">
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" onClick={() => setShowMenu(false)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { name: "Dashboard", icon: BarChart3, href: "/mobile/dashboard" },
                { name: "Projects", icon: Database, href: "/mobile/projects" },
                { name: "Analytics", icon: TrendingUp, href: "/mobile/analytics" },
                { name: "Team", icon: Users, href: "/mobile/team" },
                { name: "Calendar", icon: Calendar, href: "/mobile/calendar" },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto"
                    onClick={() => setShowMenu(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="text-lg">{item.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 p-4">
        <div className="flex justify-around">
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Database, label: "Projects" },
            { icon: TrendingUp, label: "Analytics" },
            { icon: Users, label: "Team" },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <Button
                key={index}
                variant="ghost"
                className={`flex flex-col items-center space-y-1 p-2 ${
                  item.active ? "text-purple-400" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Bottom Padding for Fixed Navigation */}
      <div className="h-20"></div>
    </div>
  )
}
