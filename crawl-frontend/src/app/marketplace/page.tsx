"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Star,
  Download,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Eye,
  MessageSquare,
  Code,
  Crown,
  Shield,
  Heart,
  ExternalLink,
  Play,
  ShoppingCart,
  ImageIcon,
} from "lucide-react"

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("models")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const aiModels = [
    {
      id: 1,
      name: "GPT-4 Turbo Enhanced",
      description: "Advanced language model optimized for business intelligence and data analysis",
      category: "Language Models",
      provider: "OpenAI",
      rating: 4.9,
      downloads: "2.4M",
      price: "$0.03/1K tokens",
      tags: ["NLP", "Analysis", "Business"],
      featured: true,
      verified: true,
      icon: Brain,
    },
    {
      id: 2,
      name: "Claude 3 Opus Analytics",
      description: "Specialized version of Claude 3 for complex data reasoning and insights",
      category: "Language Models",
      provider: "Anthropic",
      rating: 4.8,
      downloads: "1.8M",
      price: "$0.025/1K tokens",
      tags: ["Reasoning", "Analytics", "Safety"],
      featured: true,
      verified: true,
      icon: Brain,
    },
    {
      id: 3,
      name: "DALL-E 3 Business",
      description: "Enterprise-grade image generation for presentations and marketing materials",
      category: "Image Generation",
      provider: "OpenAI",
      rating: 4.7,
      downloads: "956K",
      price: "$0.08/image",
      tags: ["Images", "Creative", "Marketing"],
      featured: false,
      verified: true,
      icon: ImageIcon,
    },
    {
      id: 4,
      name: "Whisper Enterprise",
      description: "Speech-to-text model optimized for business meetings and transcription",
      category: "Speech Recognition",
      provider: "OpenAI",
      rating: 4.6,
      downloads: "743K",
      price: "$0.006/minute",
      tags: ["Speech", "Transcription", "Meetings"],
      featured: false,
      verified: true,
      icon: MessageSquare,
    },
    {
      id: 5,
      name: "LLaMA 2 Fine-tuned",
      description: "Open-source model fine-tuned for financial data analysis and forecasting",
      category: "Language Models",
      provider: "Meta",
      rating: 4.5,
      downloads: "1.2M",
      price: "Free",
      tags: ["Open Source", "Finance", "Forecasting"],
      featured: false,
      verified: false,
      icon: Brain,
    },
    {
      id: 6,
      name: "CodeT5+ Enhanced",
      description: "Code generation and analysis model for software development workflows",
      category: "Code Generation",
      provider: "Salesforce",
      rating: 4.4,
      downloads: "567K",
      price: "$0.02/1K tokens",
      tags: ["Code", "Development", "Automation"],
      featured: false,
      verified: true,
      icon: Code,
    },
  ]

  const templates = [
    {
      id: 1,
      name: "Financial Dashboard Template",
      description: "Complete dashboard template for financial KPIs and metrics visualization",
      category: "Dashboards",
      creator: "InsightsAI Team",
      rating: 4.9,
      downloads: "15.2K",
      price: "Free",
      tags: ["Finance", "KPIs", "Charts"],
      featured: true,
      preview: "/placeholder.svg?height=200&width=300&text=Financial+Dashboard",
    },
    {
      id: 2,
      name: "Sales Analytics Workflow",
      description: "End-to-end sales analytics with predictive modeling and forecasting",
      category: "Workflows",
      creator: "DataViz Pro",
      rating: 4.8,
      downloads: "12.7K",
      price: "$29",
      tags: ["Sales", "Predictive", "Workflow"],
      featured: true,
      preview: "/placeholder.svg?height=200&width=300&text=Sales+Analytics",
    },
    {
      id: 3,
      name: "Customer Segmentation Kit",
      description: "ML-powered customer segmentation with visualization components",
      category: "ML Templates",
      creator: "AI Solutions Inc",
      rating: 4.7,
      downloads: "8.9K",
      price: "$49",
      tags: ["ML", "Segmentation", "Customers"],
      featured: false,
      preview: "/placeholder.svg?height=200&width=300&text=Customer+Segmentation",
    },
    {
      id: 4,
      name: "Real-time Monitoring Setup",
      description: "Complete monitoring dashboard for real-time data streams and alerts",
      category: "Monitoring",
      creator: "MonitorPro",
      rating: 4.6,
      downloads: "6.3K",
      price: "$19",
      tags: ["Real-time", "Monitoring", "Alerts"],
      featured: false,
      preview: "/placeholder.svg?height=200&width=300&text=Monitoring+Dashboard",
    },
  ]

  const categories = [
    { id: "all", name: "All Categories", count: 156 },
    { id: "language", name: "Language Models", count: 42 },
    { id: "image", name: "Image Generation", count: 28 },
    { id: "speech", name: "Speech & Audio", count: 19 },
    { id: "code", name: "Code Generation", count: 23 },
    { id: "analytics", name: "Analytics", count: 31 },
    { id: "vision", name: "Computer Vision", count: 13 },
  ]

  const filteredModels = aiModels.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || model.category.toLowerCase().includes(selectedCategory.toLowerCase())

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white">AI Marketplace</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Models & Templates
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover, deploy, and integrate cutting-edge AI models and visualization templates. Accelerate your projects
            with our curated marketplace of AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search models and templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
              <TabsTrigger value="models" className="data-[state=active]:bg-purple-500/20">
                AI Models
              </TabsTrigger>
              <TabsTrigger value="templates" className="data-[state=active]:bg-purple-500/20">
                Templates
              </TabsTrigger>
              <TabsTrigger value="trending" className="data-[state=active]:bg-purple-500/20">
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/5 border-white/10 mb-6">
                    <CardHeader>
                      <CardTitle className="text-white">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full text-left p-2 rounded-md transition-colors ${
                              selectedCategory === category.id
                                ? "bg-purple-500/20 text-purple-400"
                                : "hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{category.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {category.count}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Featured Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "OpenAI", models: 12, verified: true },
                          { name: "Anthropic", models: 8, verified: true },
                          { name: "Meta", models: 6, verified: true },
                          { name: "Google", models: 9, verified: true },
                          { name: "Salesforce", models: 4, verified: true },
                        ].map((provider, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"></div>
                              <span className="text-sm text-white">{provider.name}</span>
                              {provider.verified && <Shield className="w-3 h-3 text-emerald-400" />}
                            </div>
                            <span className="text-xs text-gray-400">{provider.models} models</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">AI Models</h2>
                      <p className="text-gray-400">{filteredModels.length} models available</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm">
                        <option>Sort by Popularity</option>
                        <option>Sort by Rating</option>
                        <option>Sort by Price</option>
                        <option>Sort by Recent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredModels.map((model) => {
                      const Icon = model.icon

                      return (
                        <Card
                          key={model.id}
                          className={`bg-white/5 border-white/10 hover:bg-white/10 transition-colors ${
                            model.featured ? "ring-2 ring-purple-500/50" : ""
                          }`}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                                  <Icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <CardTitle className="text-white">{model.name}</CardTitle>
                                    {model.featured && <Crown className="w-4 h-4 text-yellow-400" />}
                                    {model.verified && <Shield className="w-4 h-4 text-emerald-400" />}
                                  </div>
                                  <p className="text-sm text-gray-400">{model.provider}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-white">{model.rating}</span>
                                </div>
                                <p className="text-xs text-gray-400">{model.downloads} downloads</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 mb-4">{model.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {model.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-purple-500/30 text-purple-400"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-white">{model.price}</span>
                                {model.price !== "Free" && <span className="text-sm text-gray-400 ml-1">per use</span>}
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="border-white/20 text-white">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                                <Button size="sm" className="bg-purple-500 hover:bg-purple-400">
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Deploy
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Template Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {[
                          { name: "Dashboards", count: 24 },
                          { name: "Workflows", count: 18 },
                          { name: "ML Templates", count: 15 },
                          { name: "Monitoring", count: 12 },
                          { name: "Reports", count: 9 },
                          { name: "Visualizations", count: 21 },
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
                </div>

                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Templates & Workflows</h2>
                      <p className="text-gray-400">{templates.length} templates available</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`bg-white/5 border-white/10 hover:bg-white/10 transition-colors ${
                          template.featured ? "ring-2 ring-cyan-500/50" : ""
                        }`}
                      >
                        <CardHeader>
                          <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg mb-4 overflow-hidden">
                            <img
                              src={template.preview || "/placeholder.svg"}
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <CardTitle className="text-white">{template.name}</CardTitle>
                                {template.featured && <Crown className="w-4 h-4 text-yellow-400" />}
                              </div>
                              <p className="text-sm text-gray-400">{template.creator}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-white">{template.rating}</span>
                              </div>
                              <p className="text-xs text-gray-400">{template.downloads} downloads</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 mb-4">{template.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {template.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-white">{template.price}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="border-white/20 text-white">
                                <Play className="w-4 h-4 mr-1" />
                                Demo
                              </Button>
                              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400">
                                <Download className="w-4 h-4 mr-1" />
                                Install
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-8">
              <div className="space-y-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Trending This Week</CardTitle>
                    <CardDescription className="text-gray-400">
                      Most popular AI models and templates this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Most Downloaded</h3>
                            <p className="text-sm text-gray-400">GPT-4 Turbo Enhanced</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">+342%</div>
                        <p className="text-sm text-gray-400">vs last week</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <Star className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Highest Rated</h3>
                            <p className="text-sm text-gray-400">Financial Dashboard Template</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-400">4.9★</div>
                        <p className="text-sm text-gray-400">average rating</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">Fastest Growing</h3>
                            <p className="text-sm text-gray-400">Claude 3 Opus Analytics</p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-400">+156%</div>
                        <p className="text-sm text-gray-400">growth rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Popular Categories</CardTitle>
                      <CardDescription className="text-gray-400">Most active categories this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Language Models", growth: "+45%", downloads: "2.1M" },
                          { name: "Image Generation", growth: "+38%", downloads: "1.8M" },
                          { name: "Analytics Templates", growth: "+29%", downloads: "956K" },
                          { name: "Code Generation", growth: "+22%", downloads: "743K" },
                          { name: "Speech Recognition", growth: "+18%", downloads: "567K" },
                        ].map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{category.name}</div>
                              <div className="text-sm text-gray-400">{category.downloads} downloads</div>
                            </div>
                            <div className="text-emerald-400 font-medium">{category.growth}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Community Favorites</CardTitle>
                      <CardDescription className="text-gray-400">Most liked and shared this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Financial Dashboard Template", likes: "1.2K", shares: "342" },
                          { name: "GPT-4 Turbo Enhanced", likes: "987", shares: "289" },
                          { name: "Sales Analytics Workflow", likes: "756", shares: "198" },
                          { name: "Claude 3 Opus Analytics", likes: "643", shares: "156" },
                          { name: "Customer Segmentation Kit", likes: "521", shares: "134" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{item.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ExternalLink className="w-4 h-4" />
                                <span>{item.shares}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
