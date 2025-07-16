"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Brain, Shield, Globe } from "lucide-react"

const platforms = [
  {
    name: "AIP",
    description: "AI-Powered Intelligence Platform",
    icon: Brain,
    color: "cyan",
    features: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics"],
  },
  {
    name: "Foundry",
    description: "Data Integration & Analytics",
    icon: Database,
    color: "purple",
    features: ["ETL/ELT Pipelines", "Real-time Processing", "Data Governance", "Schema Inference"],
  },
  {
    name: "Gotham",
    description: "Enterprise Security & Compliance",
    icon: Shield,
    color: "emerald",
    features: ["End-to-end Encryption", "RBAC", "Audit Trails", "GDPR Compliance"],
  },
  {
    name: "Apollo",
    description: "Global Deployment & Scaling",
    icon: Globe,
    color: "orange",
    features: ["Multi-cloud", "Auto-scaling", "Edge Computing", "Global CDN"],
  },
]

export function PlatformOverview() {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Our Platforms
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Modular, open, and scalable architecture designed for enterprise-grade analytics and AI deployment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platforms.map((platform) => {
            const Icon = platform.icon
            const isHovered = hoveredPlatform === platform.name

            return (
              <Card
                key={platform.name}
                className={`bg-black/50 border-white/10 hover:border-${platform.color}-400/50 transition-all duration-500 transform hover:scale-105 cursor-pointer backdrop-blur-sm ${
                  isHovered ? "shadow-2xl shadow-" + platform.color + "-500/20" : ""
                }`}
                onMouseEnter={() => setHoveredPlatform(platform.name)}
                onMouseLeave={() => setHoveredPlatform(null)}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br from-${platform.color}-500/20 to-${platform.color}-600/20 flex items-center justify-center mb-6 transition-all duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    <Icon className={`w-8 h-8 text-${platform.color}-400`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{platform.name}</h3>
                  <p className="text-gray-400 mb-6">{platform.description}</p>

                  <div className="space-y-2">
                    {platform.features.map((feature, index) => (
                      <div
                        key={feature}
                        className={`text-sm text-gray-500 transition-all duration-300 ${
                          isHovered ? "text-gray-300 translate-x-2" : ""
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        • {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
