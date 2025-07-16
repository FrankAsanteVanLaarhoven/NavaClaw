"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Eye,
  Headphones,
  Hand,
  Users,
  Zap,
  Play,
  Settings,
  Sparkles,
  VolumeX,
  Gamepad2,
  Monitor,
  Smartphone,
  Glasses,
} from "lucide-react"

export default function MetaversePage() {
  const [selectedExperience, setSelectedExperience] = useState("observatory")

  const experiences = [
    {
      id: "observatory",
      name: "Data Observatory",
      description: "360° immersive data environments with spatial navigation",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      features: ["360° visualization", "Spatial navigation", "Multi-user collaboration"],
      participants: 1247,
    },
    {
      id: "neural-maze",
      name: "Neural Network Maze",
      description: "Navigate through AI model architectures in 3D space",
      icon: Eye,
      color: "from-purple-500 to-pink-500",
      features: ["Interactive exploration", "Layer visualization", "Real-time training"],
      participants: 892,
    },
    {
      id: "digital-twin",
      name: "Digital Twin World",
      description: "Complete virtual replicas of physical systems",
      icon: Monitor,
      color: "from-green-500 to-emerald-500",
      features: ["Real-time sync", "IoT integration", "Predictive modeling"],
      participants: 2156,
    },
    {
      id: "collaborative",
      name: "Collaborative Workspaces",
      description: "Multi-user VR environments for team analysis",
      icon: Users,
      color: "from-orange-500 to-red-500",
      features: ["Team collaboration", "Shared workspaces", "Voice communication"],
      participants: 634,
    },
  ]

  const devices = [
    { name: "Meta Quest 3", compatibility: 98, status: "Optimized" },
    { name: "Apple Vision Pro", compatibility: 95, status: "Native" },
    { name: "HTC Vive Pro", compatibility: 92, status: "Supported" },
    { name: "Pico 4", compatibility: 88, status: "Compatible" },
    { name: "Varjo Aero", compatibility: 94, status: "Professional" },
    { name: "Magic Leap 2", compatibility: 85, status: "AR Ready" },
  ]

  const specs = [
    { metric: "Resolution", value: "8K per eye", status: "excellent" },
    { metric: "Frame Rate", value: "120 FPS", status: "excellent" },
    { metric: "Latency", value: "<20ms", status: "excellent" },
    { metric: "Field of View", value: "210°", status: "good" },
    { metric: "Tracking Accuracy", value: "Sub-millimeter", status: "excellent" },
    { metric: "Audio Quality", value: "Spatial 360°", status: "excellent" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white">Immersive Analytics</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Metaverse Analytics
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Step inside your data with immersive VR environments, holographic projections, and collaborative digital
              twin worlds. Experience analytics like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"
              >
                <Play className="w-5 h-5 mr-2" />
                Enter Metaverse
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Glasses className="w-5 h-5 mr-2" />
                Try AR Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive Experiences */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Immersive Data Experiences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experiences.map((experience) => {
              const IconComponent = experience.icon
              return (
                <Card
                  key={experience.id}
                  className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedExperience(experience.id)}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${experience.color} flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{experience.name}</CardTitle>
                    <CardDescription className="text-gray-400">{experience.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Active Users</span>
                        <span className="text-cyan-400">{experience.participants.toLocaleString()}</span>
                      </div>
                      <ul className="space-y-2">
                        {experience.features.map((feature, index) => (
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

      {/* Technical Specifications */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Technical Excellence</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-cyan-400" />
                Performance Specifications
              </h3>
              <div className="space-y-6">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{spec.metric}</div>
                      <div className="text-sm text-gray-400">{spec.value}</div>
                    </div>
                    <Badge
                      className={
                        spec.status === "excellent"
                          ? "bg-green-500"
                          : spec.status === "good"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }
                    >
                      {spec.status === "excellent" ? "Excellent" : spec.status === "good" ? "Good" : "Standard"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <Headphones className="w-6 h-6 mr-2 text-purple-400" />
                Device Compatibility
              </h3>
              <div className="space-y-4">
                {devices.map((device, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-white">{device.name}</div>
                        <Badge
                          variant={
                            device.status === "Optimized" || device.status === "Native" ? "default" : "secondary"
                          }
                        >
                          {device.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Compatibility</span>
                          <span className="text-cyan-400">{device.compatibility}%</span>
                        </div>
                        <Progress value={device.compatibility} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Revolutionary Interaction Methods</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 text-center">
              <CardHeader>
                <Hand className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <CardTitle className="text-white">Gesture Control</CardTitle>
                <CardDescription className="text-gray-400">
                  Natural hand tracking and gesture-based interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Accuracy</span>
                    <span className="text-green-400">99.2%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-center">
              <CardHeader>
                <VolumeX className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <CardTitle className="text-white">Voice Commands</CardTitle>
                <CardDescription className="text-gray-400">
                  Natural language interface with spatial audio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Recognition</span>
                    <span className="text-green-400">97.8%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-center">
              <CardHeader>
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <CardTitle className="text-white">Haptic Feedback</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced haptic feedback for immersive interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Precision</span>
                    <span className="text-green-400">95.5%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Enter the Future?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience data analytics in immersive virtual environments with cutting-edge VR/AR technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Experience
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Smartphone className="w-5 h-5 mr-2" />
              Mobile AR Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
