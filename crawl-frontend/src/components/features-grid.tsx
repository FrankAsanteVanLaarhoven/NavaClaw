"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Workflow, BarChart3, Layers, Zap, Users, Lock, Palette, Code } from "lucide-react"

const features = [
  {
    icon: Workflow,
    title: "Automated Data Pipelines",
    description: "AI-powered ETL/ELT with schema inference and real-time processing",
    color: "cyan",
  },
  {
    icon: BarChart3,
    title: "Advanced Visualizations",
    description: "Interactive dashboards with drag-and-drop builder and real-time collaboration",
    color: "purple",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description: "Microservices-based platform with open APIs and seamless integrations",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Real-time Analytics",
    description: "Stream processing and instant insights with sub-second query response",
    color: "yellow",
  },
  {
    icon: Users,
    title: "Collaborative Workspaces",
    description: "Multi-user editing, commenting, and version control for team productivity",
    color: "blue",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "End-to-end encryption, RBAC, and compliance with global standards",
    color: "red",
  },
  {
    icon: Palette,
    title: "Modern UI/UX",
    description: "Animated, responsive interface with accessibility and internationalization",
    color: "pink",
  },
  {
    icon: Code,
    title: "Developer Tools",
    description: "Integrated code editors, APIs, SDKs, and marketplace for extensions",
    color: "orange",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Platform Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to transform data into actionable business insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 backdrop-blur-sm group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
