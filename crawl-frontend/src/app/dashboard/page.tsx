"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  CreditCard,
  Database,
  FileText,
  Grid,
  LayoutDashboard,
  LineChart,
  Plus,
  Search,
  Settings,
  Users,
  Brain,
  CuboidIcon as Cube,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
} from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-black text-white">
        <Sidebar className="border-r border-white/10">
          <SidebarHeader className="border-b border-white/10 p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">InsightsAI</h2>
                <p className="text-xs text-gray-400">Enterprise Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/visualization">
                        <Cube className="h-5 w-5" />
                        <span>Visualization</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/ai-ml">
                        <Brain className="h-5 w-5" />
                        <span>AI & ML</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/metaverse">
                        <Globe className="h-5 w-5" />
                        <span>Metaverse</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/notebook">
                        <FileText className="h-5 w-5" />
                        <span>Notebook</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Analytics</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/reports">
                        <FileText className="h-5 w-5" />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/metrics">
                        <BarChart3 className="h-5 w-5" />
                        <span>Metrics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/forecasts">
                        <LineChart className="h-5 w-5" />
                        <span>Forecasts</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/projects">
                        <Grid className="h-5 w-5" />
                        <span>Projects</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/team">
                        <Users className="h-5 w-5" />
                        <span>Team</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/dashboard/calendar">
                        <Calendar className="h-5 w-5" />
                        <span>Calendar</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-white/10 p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/auth/signin">
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-black">
          {/* Header */}
          <header className="border-b border-white/10 bg-black/90 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-bold">Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="rounded-full bg-white/5 pl-10 pr-4 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                  />
                </div>
                <Button variant="outline" size="icon" className="rounded-full border-white/10">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600"></div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">Alex Johnson</p>
                    <p className="text-xs text-gray-400">Enterprise Admin</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl space-y-8">
              {/* Welcome Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, Alex</h2>
                  <p className="text-gray-400">Here's what's happening with your projects today.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-white/10">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">24</div>
                        <div className="flex items-center text-xs text-emerald-400">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          <span>12% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Grid className="h-6 w-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">1,429</div>
                        <div className="flex items-center text-xs text-emerald-400">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          <span>24% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-cyan-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Data Processed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">2.4 TB</div>
                        <div className="flex items-center text-xs text-emerald-400">
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                          <span>18% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Database className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">$52,489</div>
                        <div className="flex items-center text-xs text-red-400">
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                          <span>3% from last month</span>
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-pink-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs Section */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="data-[state=active]:bg-white/10">
                    Projects
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="bg-white/5 border-white/10 lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription className="text-gray-400">
                          Monthly performance metrics across all projects
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 w-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-lg border border-white/10 flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                            <p className="text-gray-400">Performance Chart Visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle>Project Status</CardTitle>
                        <CardDescription className="text-gray-400">
                          Current status of active projects
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full bg-emerald-400 mr-2"></div>
                                <span className="text-sm">Completed</span>
                              </div>\
