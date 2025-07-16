"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CuboidIcon as Cube, Brain, Eye, Zap, Globe, Palette, Sparkles, Play, Settings, Download } from "lucide-react"
import Link from "next/link"

export default function VisualizationPage() {
  const [activeDemo, setActiveDemo] = useState("3d-sculpture")

  const visualizationTypes = [
    {
      id: "3d-sculpture",
      name: "3D Data Sculptures",
      description: "Transform complex datasets into interactive 3D sculptures",
      icon: Cube,
      color: "from-blue-500 to-cyan-500",
      features: ["Real-time rendering", "Interactive exploration", "Multi-dimensional data"],
      status: "Live",
    },
    {
      id: "neural-viz",
      name: "Neural Network Visualization",
      description: "Explore AI model architectures in immersive 3D space",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      features: ["Layer visualization", "Weight mapping", "Gradient flow"],
      status: "Live",
    },
    {
      id: "holographic",
      name: "Holographic Projections",
      description: "Project data as holograms for immersive analysis",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
      features: ["AR/VR support", "Gesture control", "Spatial audio"],
      status: "Beta",
    },
    {
      id: "digital-twin",
      name: "Digital Twin Environments",
      description: "Real-time digital replicas of physical systems",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      features: ["IoT integration", "Real-time sync", "Predictive modeling"],
      status: "Live",
    },
  ]

  const themes = [
    { name: "Palantir Light", preview: "bg-gray-100", active: true },
    { name: "Framer Dark", preview: "bg-gray-900", active: false },
    { name: "Neon Cyber", preview: "bg-gradient-to-r from-cyan-500 to-purple-500", active: false },
    { name: "Minimal White", preview: "bg-white border", active: false },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
              Revolutionary Visualization
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Visualization Studio
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform data into stunning 3D sculptures, explore neural networks in immersive space, and create
              holographic projections that revolutionize how you understand information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/visualization/studio">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Launch Studio
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Eye className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visualization Types */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Revolutionary Visualization Types</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {visualizationTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <Card
                  key={type.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveDemo(type.id)}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{type.name}</CardTitle>
                      <Badge variant={type.status === "Live" ? "default" : "secondary"}>{type.status}</Badge>
                    </div>
                    <CardDescription className="text-gray-400">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Interactive Visualization Demo</h2>
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              {visualizationTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="data-[state=active]:bg-cyan-500">
                  {type.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            {visualizationTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="mt-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <type.icon className="w-6 h-6 mr-2" />
                      {type.name} Demo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center mb-6">
                      <div className="text-center">
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-4 animate-pulse`}
                        >
                          <type.icon className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-gray-400">Interactive {type.name} Demo</p>
                        <p className="text-sm text-gray-500 mt-2">Click to explore in full screen</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Rendering Quality</span>
                          <span className="text-cyan-400">8K Ultra</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Frame Rate</span>
                          <span className="text-green-400">120 FPS</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Latency</span>
                          <span className="text-yellow-400">&lt;20ms</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Theming Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Revolutionary Theming Engine</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Aesthetic Excellence</h3>
              <p className="text-gray-300 mb-6">
                Switch seamlessly between Palantir's clean light theme and Framer's sophisticated dark theme. Our
                revolutionary theming engine provides granular control over every visual element.
              </p>
              <div className="space-y-4">
                {themes.map((theme, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded ${theme.preview}`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{theme.name}</div>
                    </div>
                    {theme.active && <Badge className="bg-cyan-500">Active</Badge>}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Theme Customization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Primary Color</span>
                    <div className="w-8 h-8 rounded bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Background</span>
                    <div className="w-8 h-8 rounded bg-black border border-white/20"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Accent</span>
                    <div className="w-8 h-8 rounded bg-cyan-400"></div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize Theme
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Data?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the future of data visualization with our revolutionary platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/visualization/studio">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-5 h-5 mr-2" />
              Download SDK
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
