"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Users,
  Calendar,
  Clock,
  Eye,
  Share,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

export default function MobileProjects() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  const projects = [
    {
      id: 1,
      name: "Sales Analytics Q4",
      description: "Comprehensive sales performance analysis for Q4 2024",
      status: "Active",
      priority: "High",
      progress: 85,
      team: 4,
      dueDate: "Dec 15",
      lastUpdate: "2h ago",
      color: "emerald",
      starred: true,
    },
    {
      id: 2,
      name: "Customer Insights Dashboard",
      description: "Real-time customer behavior analytics and segmentation",
      status: "Review",
      priority: "Medium",
      progress: 92,
      team: 6,
      dueDate: "Dec 20",
      lastUpdate: "4h ago",
      color: "cyan",
      starred: false,
    },
    {
      id: 3,
      name: "Market Research Analysis",
      description: "Competitive analysis and market positioning study",
      status: "Planning",
      priority: "Low",
      progress: 35,
      team: 3,
      dueDate: "Jan 10",
      lastUpdate: "1d ago",
      color: "purple",
      starred: true,
    },
    {
      id: 4,
      name: "Financial Forecasting Model",
      description: "Predictive financial modeling for 2025 planning",
      status: "Active",
      priority: "High",
      progress: 67,
      team: 5,
      dueDate: "Dec 30",
      lastUpdate: "6h ago",
      color: "orange",
      starred: false,
    },
  ]

  const filters = [
    { id: "all", label: "All", count: projects.length },
    { id: "active", label: "Active", count: projects.filter((p) => p.status === "Active").length },
    { id: "review", label: "Review", count: projects.filter((p) => p.status === "Review").length },
    { id: "planning", label: "Planning", count: projects.filter((p) => p.status === "Planning").length },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || project.status.toLowerCase() === activeFilter
    return matchesSearch && matchesFilter
  })

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
              <h1 className="text-lg font-bold">Projects</h1>
              <p className="text-xs text-gray-400">{filteredProjects.length} projects</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Filter className="w-5 h-5" />
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={`whitespace-nowrap ${
                  activeFilter === filter.id ? "bg-purple-600 text-white" : "border-white/20 text-gray-300"
                }`}
              >
                {filter.label} ({filter.count})
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Projects List */}
      <div className="p-4 space-y-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="bg-white/5 border-white/10 overflow-hidden">
            <CardContent className="p-0">
              {/* Project Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{project.name}</h3>
                      {project.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{project.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`bg-${project.color}-500/10 text-${project.color}-400 border-${project.color}-500/20 text-xs`}
                      >
                        {project.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`border-white/20 text-xs ${
                          project.priority === "High"
                            ? "text-red-400"
                            : project.priority === "Medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
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
              </div>

              {/* Project Details */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400">Team</p>
                    <p className="text-sm font-semibold text-white">{project.team}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400">Due</p>
                    <p className="text-sm font-semibold text-white">{project.dueDate}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400">Updated</p>
                    <p className="text-sm font-semibold text-white">{project.lastUpdate}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 border-white/20 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-white/20 text-xs">
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-white/20 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
