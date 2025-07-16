"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Zap,
  Database,
  MessageSquare,
  Cpu,
  Eye,
  Settings,
  Play,
  Sparkles,
  Bot,
  FileText,
  Network,
  Activity,
} from "lucide-react"

export default function AIMLPage() {
  const [activeModel, setActiveModel] = useState("automl")

  const aiModels = [
    {
      id: "automl",
      name: "AutoML Studio",
      description: "No-code automated machine learning platform",
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      features: ["Automated feature engineering", "Model selection", "Hyperparameter tuning"],
      accuracy: 94,
      status: "Live",
    },
    {
      id: "rag",
      name: "RAG Systems",
      description: "Retrieval-Augmented Generation for enhanced AI responses",
      icon: Database,
      color: "from-green-500 to-emerald-500",
      features: ["Document retrieval", "Context injection", "Real-time updates"],
      accuracy: 97,
      status: "Live",
    },
    {
      id: "cag",
      name: "CAG Networks",
      description: "Context-Aware Generation with multi-modal integration",
      icon: Network,
      color: "from-purple-500 to-pink-500",
      features: ["Multi-modal inputs", "Dynamic adaptation", "Context preservation"],
      accuracy: 96,
      status: "Beta",
    },
    {
      id: "neural-search",
      name: "Neural Architecture Search",
      description: "AI-designed neural networks for optimal performance",
      icon: Cpu,
      color: "from-orange-500 to-red-500",
      features: ["Architecture optimization", "Performance tuning", "Resource efficiency"],
      accuracy: 98,
      status: "Live",
    },
  ]

  const modelLibrary = [
    { name: "GPT-4 Turbo", type: "Language", status: "Active", usage: "89%" },
    { name: "DALL-E 3", type: "Image Generation", status: "Active", usage: "76%" },
    { name: "Claude 3 Opus", type: "Reasoning", status: "Active", usage: "92%" },
    { name: "Whisper v3", type: "Speech", status: "Active", usage: "84%" },
    { name: "LLaMA 2", type: "Open Source", status: "Available", usage: "67%" },
    { name: "Stable Diffusion XL", type: "Image", status: "Available", usage: "71%" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              Advanced AI/ML Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-green-400 to-blue-400 bg-clip-text text-transparent">
              AI/ML Platform
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive AI/ML platform with RAG systems, CAG networks, AutoML studio, and neural architecture
              search. Build, train, and deploy world-class AI models.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400"
              >
                <Play className="w-5 h-5 mr-2" />
                Launch Platform
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Bot className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI/ML Models */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Advanced AI/ML Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiModels.map((model) => {
              const IconComponent = model.icon
              return (
                <Card
                  key={model.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveModel(model.id)}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${model.color} flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{model.name}</CardTitle>
                      <Badge variant={model.status === "Live" ? "default" : "secondary"}>{model.status}</Badge>
                    </div>
                    <CardDescription className="text-gray-400">{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Accuracy</span>
                          <span className="text-green-400">{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-2" />
                      </div>
                      <ul className="space-y-2">
                        {model.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-300">
                            <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* RAG & CAG Deep Dive */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">RAG & CAG Technologies</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* RAG Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-6 h-6 mr-2 text-green-400" />
                  Retrieval-Augmented Generation (RAG)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enhanced AI responses through intelligent document retrieval and context injection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-400" />
                      <span className="text-white">Document Processing</span>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Vector Database</span>
                    </div>
                    <Badge className="bg-blue-500">Optimized</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Context Injection</span>
                    </div>
                    <Badge className="bg-purple-500">Real-time</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Retrieval Accuracy</span>
                    <span className="text-green-400">97.3%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* CAG Section */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Network className="w-6 h-6 mr-2 text-purple-400" />
                  Context-Aware Generation (CAG)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Dynamic response adaptation with multi-modal integration and context preservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Multi-modal Input</span>
                    </div>
                    <Badge className="bg-purple-500">Advanced</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-pink-400" />
                      <span className="text-white">Context Adaptation</span>
                    </div>
                    <Badge className="bg-pink-500">Dynamic</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      <span className="text-white">Response Optimization</span>
                    </div>
                    <Badge className="bg-cyan-500">AI-Powered</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Context Preservation</span>
                    <span className="text-purple-400">96.1%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Model Library */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Advanced Model Library</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modelLibrary.map((model, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{model.name}</CardTitle>
                    <Badge variant={model.status === "Active" ? "default" : "secondary"}>{model.status}</Badge>
                  </div>
                  <CardDescription className="text-gray-400">{model.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Usage</span>
                      <span className="text-cyan-400">{model.usage}</span>
                    </div>
                    <Progress value={Number.parseInt(model.usage)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Advanced AI?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the future of AI/ML with RAG, CAG, and comprehensive model management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Building
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Settings className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
