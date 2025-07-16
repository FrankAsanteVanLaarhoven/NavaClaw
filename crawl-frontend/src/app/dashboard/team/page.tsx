"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  Settings,
  Crown,
  MessageSquare,
  FileText,
  BarChart3,
  Video,
  Mail,
  MoreHorizontal,
  UserPlus,
  Edit,
  Eye,
  Share,
  Activity,
  Zap,
} from "lucide-react"

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState("members")
  const [searchQuery, setSearchQuery] = useState("")

  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@company.com",
      role: "Admin",
      department: "Data Science",
      avatar: "/placeholder.svg?height=40&width=40&text=AJ",
      status: "online",
      lastActive: "Now",
      projects: 8,
      permissions: ["admin", "create", "edit", "delete"],
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "Data Analyst",
      department: "Analytics",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      status: "online",
      lastActive: "5 min ago",
      projects: 12,
      permissions: ["create", "edit"],
      joinDate: "2023-02-20",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      email: "michael.r@company.com",
      role: "ML Engineer",
      department: "AI/ML",
      avatar: "/placeholder.svg?height=40&width=40&text=MR",
      status: "away",
      lastActive: "2 hours ago",
      projects: 6,
      permissions: ["create", "edit"],
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      role: "Product Manager",
      department: "Product",
      avatar: "/placeholder.svg?height=40&width=40&text=ED",
      status: "offline",
      lastActive: "1 day ago",
      projects: 4,
      permissions: ["view", "comment"],
      joinDate: "2023-04-05",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.kim@company.com",
      role: "Data Engineer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40&text=DK",
      status: "online",
      lastActive: "Now",
      projects: 9,
      permissions: ["create", "edit"],
      joinDate: "2023-01-30",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Chen",
      action: "created a new dashboard",
      target: "Q4 Sales Performance",
      time: "2 minutes ago",
      type: "create",
    },
    {
      id: 2,
      user: "Michael Rodriguez",
      action: "updated ML model",
      target: "Customer Segmentation",
      time: "15 minutes ago",
      type: "update",
    },
    {
      id: 3,
      user: "Emily Davis",
      action: "commented on",
      target: "Financial Forecast Dashboard",
      time: "1 hour ago",
      type: "comment",
    },
    {
      id: 4,
      user: "David Kim",
      action: "shared project",
      target: "Real-time Analytics Pipeline",
      time: "3 hours ago",
      type: "share",
    },
    {
      id: 5,
      user: "Alex Johnson",
      action: "invited new member",
      target: "Lisa Wang",
      time: "5 hours ago",
      type: "invite",
    },
  ]

  const projects = [
    {
      id: 1,
      name: "Q4 Sales Dashboard",
      description: "Comprehensive sales analytics for Q4 performance review",
      members: 4,
      status: "active",
      progress: 85,
      dueDate: "2024-01-15",
      owner: "Sarah Chen",
    },
    {
      id: 2,
      name: "Customer Segmentation ML",
      description: "Machine learning model for customer behavior analysis",
      members: 3,
      status: "active",
      progress: 60,
      dueDate: "2024-01-30",
      owner: "Michael Rodriguez",
    },
    {
      id: 3,
      name: "Financial Forecasting",
      description: "Predictive analytics for financial planning and budgeting",
      members: 5,
      status: "review",
      progress: 95,
      dueDate: "2024-01-10",
      owner: "Alex Johnson",
    },
    {
      id: 4,
      name: "Real-time Monitoring",
      description: "Live data monitoring and alerting system",
      members: 2,
      status: "planning",
      progress: 25,
      dueDate: "2024-02-15",
      owner: "David Kim",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-400"
      case "away":
        return "bg-yellow-400"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return Crown
      case "Data Analyst":
        return BarChart3
      case "ML Engineer":
        return Zap
      case "Product Manager":
        return Users
      case "Data Engineer":
        return Settings
      default:
        return Users
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Management</h1>
            <p className="text-gray-400">Manage team members, permissions, and collaboration</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="mr-2 h-4 w-4" />
              Team Settings
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Members</p>
                  <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-white">{projects.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Online Now</p>
                  <p className="text-2xl font-bold text-white">
                    {teamMembers.filter((m) => m.status === "online").length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Collaboration</p>
                  <p className="text-2xl font-bold text-white">94%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20">
            <TabsTrigger value="members" className="data-[state=active]:bg-purple-500/20">
              Team Members
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500/20">
              Projects
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-purple-500/20">
              Activity
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-purple-500/20">
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Team Members</CardTitle>
                        <CardDescription className="text-gray-400">
                          Manage your team members and their roles
                        </CardDescription>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search members..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-64"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredMembers.map((member) => {
                        const RoleIcon = getRoleIcon(member.role)

                        return (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${getStatusColor(member.status)}`}
                                ></div>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium text-white">{member.name}</h3>
                                  <RoleIcon className="w-4 h-4 text-purple-400" />
                                  {member.role === "Admin" && <Crown className="w-4 h-4 text-yellow-400" />}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <span>{member.role}</span>
                                  <span>•</span>
                                  <span>{member.department}</span>
                                  <span>•</span>
                                  <span>{member.projects} projects</span>
                                </div>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-sm text-white capitalize">{member.status}</div>
                                <div className="text-xs text-gray-500">{member.lastActive}</div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <Mail className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <Edit className="w-4 h-4" />
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
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start bg-purple-500 hover:bg-purple-400">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite New Member
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <Video className="mr-2 h-4 w-4" />
                        Start Team Meeting
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <Share className="mr-2 h-4 w-4" />
                        Share Workspace
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/20 text-white">
                        <Settings className="mr-2 h-4 w-4" />
                        Team Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Team Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Departments</span>
                        <span className="text-sm text-white">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Avg Projects per Member</span>
                        <span className="text-sm text-white">7.8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Team Collaboration Score</span>
                        <span className="text-sm text-emerald-400">94%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Active This Week</span>
                        <span className="text-sm text-white">100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Team Projects</CardTitle>
                <CardDescription className="text-gray-400">
                  Collaborative projects and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-6 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-white mb-1">{project.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Owner: {project.owner}</span>
                            <span>•</span>
                            <span>Due: {project.dueDate}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            project.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : project.status === "review"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-gray-500/20 text-gray-400"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm text-white">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">{project.members} members</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Share className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-400">
                      Latest team activities and collaboration events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              activity.type === "create"
                                ? "bg-emerald-400"
                                : activity.type === "update"
                                  ? "bg-cyan-400"
                                  : activity.type === "comment"
                                    ? "bg-purple-400"
                                    : activity.type === "share"
                                      ? "bg-orange-400"
                                      : "bg-yellow-400"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              <span className="font-medium">{activity.user}</span>{" "}
                              <span className="text-gray-400">{activity.action}</span>{" "}
                              <span className="font-medium">{activity.target}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/5 border-white/10 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white">Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Today</span>
                        <span className="text-sm text-white">12 activities</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">This Week</span>
                        <span className="text-sm text-white">89 activities</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Most Active</span>
                        <span className="text-sm text-emerald-400">Sarah Chen</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Peak Hours</span>
                        <span className="text-sm text-white">2-4 PM</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Team Standup",
                          time: "Tomorrow 9:00 AM",
                          type: "meeting",
                        },
                        {
                          title: "Q4 Review Deadline",
                          time: "Jan 15, 2024",
                          type: "deadline",
                        },
                        {
                          title: "ML Model Demo",
                          time: "Jan 20, 2024",
                          type: "presentation",
                        },
                      ].map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              event.type === "meeting"
                                ? "bg-cyan-400"
                                : event.type === "deadline"
                                  ? "bg-red-400"
                                  : "bg-purple-400"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm text-white">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-8">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Role & Permission Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure roles and permissions for team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        role: "Admin",
                        description: "Full access to all features and settings",
                        permissions: ["Create", "Read", "Update", "Delete", "Manage Users", "System Settings"],
                        members: 1,
                        color: "text-yellow-400",
                        icon: Crown,
                      },
                      {
                        role: "Editor",
                        description: "Can create and edit content, limited admin access",
                        permissions: ["Create", "Read", "Update", "Share", "Comment"],
                        members: 3,
                        color: "text-purple-400",
                        icon: Edit,
                      },
                      {
                        role: "Viewer",
                        description: "Read-only access with commenting capabilities",
                        permissions: ["Read", "Comment", "Export"],
                        members: 1,
                        color: "text-cyan-400",
                        icon: Eye,
                      },
                    ].map((role, index) => {
                      const Icon = role.icon

                      return (
                        <div key={index} className="p-6 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center space-x-3 mb-4">
                            <Icon className={`w-6 h-6 ${role.color}`} />
                            <div>
                              <h3 className="font-medium text-white">{role.role}</h3>
                              <p className="text-sm text-gray-400">{role.members} members</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-4">{role.description}</p>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-white">Permissions:</h4>
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.map((permission, permIndex) => (
                                <Badge
                                  key={permIndex}
                                  variant="outline"
                                  className="text-xs border-white/20 text-gray-300"
                                >
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4 border-white/20 text-white hover:bg-white/10"
                          >
                            Edit Role
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Member Permissions</h3>
                    <div className="space-y-4">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-white">{member.name}</h4>
                              <p className="text-sm text-gray-400">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-wrap gap-2">
                              {member.permissions.map((permission, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-emerald-500/30 text-emerald-400"
                                >
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
