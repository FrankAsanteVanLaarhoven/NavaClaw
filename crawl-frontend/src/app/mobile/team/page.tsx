"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Plus,
  MoreVertical,
  Users,
  MessageCircle,
  Video,
  Mail,
  Calendar,
  Clock,
  ServerIcon as Online,
  UserPlus,
  Settings,
} from "lucide-react"

export default function MobileTeam() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("members")

  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Product Manager",
      email: "alex@company.com",
      avatar: "AJ",
      status: "online",
      lastSeen: "now",
      projects: 5,
      color: "purple",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Data Scientist",
      email: "sarah@company.com",
      avatar: "SC",
      status: "online",
      lastSeen: "5m ago",
      projects: 3,
      color: "cyan",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      role: "Frontend Developer",
      email: "mike@company.com",
      avatar: "MR",
      status: "away",
      lastSeen: "1h ago",
      projects: 4,
      color: "emerald",
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "UX Designer",
      email: "emily@company.com",
      avatar: "ED",
      status: "offline",
      lastSeen: "2h ago",
      projects: 2,
      color: "orange",
    },
    {
      id: 5,
      name: "David Kim",
      role: "Backend Developer",
      email: "david@company.com",
      avatar: "DK",
      status: "online",
      lastSeen: "now",
      projects: 6,
      color: "pink",
    },
  ]

  const recentActivity = [
    {
      user: "Sarah Chen",
      action: "completed task in Sales Analytics",
      time: "2m ago",
      avatar: "SC",
      color: "cyan",
    },
    {
      user: "Mike Rodriguez",
      action: "updated dashboard design",
      time: "15m ago",
      avatar: "MR",
      color: "emerald",
    },
    {
      user: "Emily Davis",
      action: "shared new wireframes",
      time: "1h ago",
      avatar: "ED",
      color: "orange",
    },
    {
      user: "David Kim",
      action: "deployed API updates",
      time: "2h ago",
      avatar: "DK",
      color: "pink",
    },
  ]

  const upcomingMeetings = [
    {
      title: "Daily Standup",
      time: "9:00 AM",
      attendees: 5,
      type: "video",
    },
    {
      title: "Sprint Planning",
      time: "2:00 PM",
      attendees: 8,
      type: "video",
    },
    {
      title: "Design Review",
      time: "4:00 PM",
      attendees: 3,
      type: "video",
    },
  ]

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
              <h1 className="text-lg font-bold">Team</h1>
              <p className="text-xs text-gray-400">{teamMembers.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-5 h-5" />
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>
      </header>

      {/* Team Stats */}
      <section className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{teamMembers.length}</p>
              <p className="text-xs text-gray-400">Members</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Online className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{teamMembers.filter((m) => m.status === "online").length}</p>
              <p className="text-xs text-gray-400">Online</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{upcomingMeetings.length}</p>
              <p className="text-xs text-gray-400">Meetings</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="members" className="data-[state=active]:bg-white/10 text-xs">
              Members
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white/10 text-xs">
              Activity
            </TabsTrigger>
            <TabsTrigger value="meetings" className="data-[state=active]:bg-white/10 text-xs">
              Meetings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-3">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-${member.color}-500 to-${member.color}-600 flex items-center justify-center text-white font-semibold`}
                      >
                        {member.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                          member.status === "online"
                            ? "bg-emerald-500"
                            : member.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                        }`}
                      ></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white text-sm">{member.name}</h3>
                        <Button variant="ghost" size="sm" className="p-1">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{member.role}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {member.projects} projects • Last seen {member.lastSeen}
                        </p>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="p-1">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-3">
            {recentActivity.map((activity, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br from-${activity.color}-500 to-${activity.color}-600 flex items-center justify-center text-white font-semibold text-sm`}
                    >
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="meetings" className="space-y-3">
            {upcomingMeetings.map((meeting, index) => (
              <Card key={index} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{meeting.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{meeting.time}</span>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                      {meeting.attendees} people
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-xs">
                      <Video className="w-3 h-3 mr-1" />
                      Join
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/20 text-xs">
                      <Calendar className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </section>

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
