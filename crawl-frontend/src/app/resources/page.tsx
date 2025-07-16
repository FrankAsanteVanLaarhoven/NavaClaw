"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Video,
  FileText,
  Code,
  Users,
  MessageCircle,
  Download,
  ExternalLink,
  Search,
  ArrowRight,
  Play,
  Calendar,
  Clock,
} from "lucide-react"
import Link from "next/link"

const resourceCategories = [
  {
    title: "Documentation",
    icon: BookOpen,
    color: "cyan",
    description: "Comprehensive guides and API documentation",
    resources: [
      {
        title: "Getting Started Guide",
        description: "Complete setup and onboarding guide for new users",
        type: "Guide",
        readTime: "15 min read",
        link: "/docs/getting-started",
      },
      {
        title: "API Reference",
        description: "Complete API documentation with examples and SDKs",
        type: "API Docs",
        readTime: "Reference",
        link: "/docs/api",
      },
      {
        title: "Platform Architecture",
        description: "Deep dive into our platform's technical architecture",
        type: "Technical",
        readTime: "25 min read",
        link: "/docs/architecture",
      },
      {
        title: "Security & Compliance",
        description: "Security features, compliance standards, and best practices",
        type: "Security",
        readTime: "20 min read",
        link: "/docs/security",
      },
    ],
  },
  {
    title: "Video Tutorials",
    icon: Video,
    color: "purple",
    description: "Step-by-step video guides and webinars",
    resources: [
      {
        title: "Platform Overview Demo",
        description: "Complete walkthrough of all platform features and capabilities",
        type: "Demo",
        readTime: "45 min",
        link: "/videos/platform-overview",
      },
      {
        title: "Building Your First Dashboard",
        description: "Hands-on tutorial for creating interactive dashboards",
        type: "Tutorial",
        readTime: "30 min",
        link: "/videos/first-dashboard",
      },
      {
        title: "Advanced Analytics Techniques",
        description: "Master advanced analytics and machine learning features",
        type: "Advanced",
        readTime: "60 min",
        link: "/videos/advanced-analytics",
      },
      {
        title: "Integration Best Practices",
        description: "Learn how to integrate with external systems effectively",
        type: "Best Practices",
        readTime: "40 min",
        link: "/videos/integration",
      },
    ],
  },
  {
    title: "Case Studies & Whitepapers",
    icon: FileText,
    color: "emerald",
    description: "Real-world success stories and industry insights",
    resources: [
      {
        title: "Fortune 500 Digital Transformation",
        description: "How a major retailer transformed their analytics capabilities",
        type: "Case Study",
        readTime: "12 min read",
        link: "/resources/case-study-retail",
      },
      {
        title: "The Future of Enterprise Analytics",
        description: "Industry trends and predictions for the next decade",
        type: "Whitepaper",
        readTime: "18 min read",
        link: "/resources/future-analytics",
      },
      {
        title: "ROI of Data-Driven Decision Making",
        description: "Quantifying the business impact of advanced analytics",
        type: "Research",
        readTime: "15 min read",
        link: "/resources/roi-study",
      },
      {
        title: "Healthcare Analytics Success Story",
        description: "Improving patient outcomes through predictive analytics",
        type: "Case Study",
        readTime: "10 min read",
        link: "/resources/healthcare-case-study",
      },
    ],
  },
  {
    title: "Developer Resources",
    icon: Code,
    color: "orange",
    description: "SDKs, code samples, and developer tools",
    resources: [
      {
        title: "Python SDK",
        description: "Official Python SDK with comprehensive examples",
        type: "SDK",
        readTime: "Download",
        link: "/developers/python-sdk",
      },
      {
        title: "JavaScript SDK",
        description: "Client-side JavaScript SDK for web applications",
        type: "SDK",
        readTime: "Download",
        link: "/developers/js-sdk",
      },
      {
        title: "Code Examples Repository",
        description: "Collection of code samples and integration examples",
        type: "Examples",
        readTime: "Browse",
        link: "/developers/examples",
      },
      {
        title: "Webhook Integration Guide",
        description: "Complete guide to setting up and using webhooks",
        type: "Integration",
        readTime: "20 min read",
        link: "/developers/webhooks",
      },
    ],
  },
]

const upcomingEvents = [
  {
    title: "Advanced Analytics Masterclass",
    date: "Dec 15, 2024",
    time: "2:00 PM EST",
    type: "Webinar",
    description: "Deep dive into advanced analytics techniques and best practices",
  },
  {
    title: "Platform Roadmap Q1 2025",
    date: "Jan 10, 2025",
    time: "1:00 PM EST",
    type: "Product Update",
    description: "Upcoming features and platform enhancements",
  },
  {
    title: "Customer Success Stories",
    date: "Jan 25, 2025",
    time: "3:00 PM EST",
    type: "Case Study",
    description: "Real customer implementations and lessons learned",
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Knowledge Center</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Everything You Need
            <br />
            to Succeed
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Comprehensive documentation, tutorials, case studies, and developer resources to help you get the most out
            of our platform.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search documentation, tutorials, and resources..."
              className="pl-12 pr-4 py-4 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-lg text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {resourceCategories.map((category) => {
              const Icon = category.icon

              return (
                <div key={category.title}>
                  {/* Category Header */}
                  <div className="flex items-center mb-12">
                    <div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20 flex items-center justify-center mr-6`}
                    >
                      <Icon className={`w-8 h-8 text-${category.color}-400`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                      <p className="text-gray-400 text-lg">{category.description}</p>
                    </div>
                  </div>

                  {/* Resources Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.resources.map((resource) => (
                      <Card
                        key={resource.title}
                        className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm group"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              className={`bg-${category.color}-500/10 text-${category.color}-400 border-${category.color}-500/20`}
                            >
                              {resource.type}
                            </Badge>
                            {category.title === "Video Tutorials" && (
                              <Play className={`w-4 h-4 text-${category.color}-400`} />
                            )}
                            {category.title === "Developer Resources" && (
                              <Download className={`w-4 h-4 text-${category.color}-400`} />
                            )}
                          </div>
                          <CardTitle className="text-white group-hover:text-cyan-300 transition-colors duration-300 text-lg">
                            {resource.title}
                          </CardTitle>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 text-sm">
                            {resource.description}
                          </p>
                        </CardHeader>

                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-gray-500 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>{resource.readTime}</span>
                            </div>
                            <Link href={resource.link}>
                              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-0">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Upcoming Events</h2>
            <p className="text-xl text-gray-400">Join our webinars, product updates, and community events</p>
          </div>

          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <Card
                key={event.title}
                className="bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-cyan-400 font-bold text-lg">{event.date.split(",")[0]}</div>
                        <div className="text-gray-400 text-sm">{event.date.split(",")[1]}</div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">{event.type}</Badge>
                        </div>
                        <p className="text-gray-400 mb-2">{event.description}</p>
                        <div className="flex items-center space-x-4 text-gray-500 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white">
                      Register
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Join Our Community</h2>
          <p className="text-xl text-gray-400 mb-12">
            Connect with other users, share knowledge, and get help from our community and support team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Community Forum</h3>
                <p className="text-gray-400 mb-6">Ask questions, share solutions, and connect with other users</p>
                <Link href="/community">
                  <Button variant="outline" className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10">
                    Join Forum
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
                <p className="text-gray-400 mb-6">Get help from our expert support team anytime</p>
                <Link href="/support">
                  <Button variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Code className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Developer Hub</h3>
                <p className="text-gray-400 mb-6">Access APIs, SDKs, and developer resources</p>
                <Link href="/developers">
                  <Button variant="outline" className="border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/10">
                    Explore APIs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
