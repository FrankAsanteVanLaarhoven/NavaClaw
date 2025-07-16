"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, Brain, Shield, Globe, ArrowRight, CheckCircle, Zap, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

const platforms = [
  {
    name: "AIP",
    fullName: "AI-Powered Intelligence Platform",
    description: "Transform your data with cutting-edge AI and machine learning capabilities",
    icon: Brain,
    color: "cyan",
    features: [
      "Advanced Machine Learning Models",
      "Natural Language Processing",
      "Computer Vision & Image Recognition",
      "Predictive Analytics & Forecasting",
      "Automated Model Training & Deployment",
      "Real-time Inference Engine",
    ],
    useCases: [
      "Customer Behavior Prediction",
      "Fraud Detection & Prevention",
      "Content Analysis & Moderation",
      "Demand Forecasting",
    ],
    pricing: "Starting at $99/month",
  },
  {
    name: "Foundry",
    fullName: "Data Integration & Analytics Engine",
    description: "Unify, process, and analyze data from any source with enterprise-grade reliability",
    icon: Database,
    color: "purple",
    features: [
      "Universal Data Connectors",
      "Real-time ETL/ELT Pipelines",
      "Automated Schema Inference",
      "Data Quality & Governance",
      "Stream Processing Engine",
      "Data Lineage Tracking",
    ],
    useCases: ["Data Warehouse Modernization", "Real-time Analytics", "Data Lake Management", "Compliance Reporting"],
    pricing: "Starting at $199/month",
  },
  {
    name: "Gotham",
    fullName: "Enterprise Security & Compliance",
    description: "Ensure data security, privacy, and regulatory compliance across your organization",
    icon: Shield,
    color: "emerald",
    features: [
      "End-to-end Encryption",
      "Role-based Access Control",
      "Audit Trail & Monitoring",
      "GDPR & CCPA Compliance",
      "Data Masking & Anonymization",
      "Security Incident Response",
    ],
    useCases: ["Regulatory Compliance", "Data Privacy Management", "Security Monitoring", "Risk Assessment"],
    pricing: "Starting at $299/month",
  },
  {
    name: "Apollo",
    fullName: "Global Deployment & Scaling",
    description: "Deploy and scale your analytics infrastructure globally with zero downtime",
    icon: Globe,
    color: "orange",
    features: [
      "Multi-cloud Deployment",
      "Auto-scaling Infrastructure",
      "Edge Computing Support",
      "Global CDN Integration",
      "Load Balancing & Failover",
      "Performance Monitoring",
    ],
    useCases: ["Global Application Deployment", "High Availability Systems", "Edge Analytics", "Disaster Recovery"],
    pricing: "Starting at $399/month",
  },
]

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Platform Overview</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Four Platforms.
            <br />
            Infinite Possibilities.
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-4xl mx-auto">
            Our modular platform architecture gives you the flexibility to choose the components that best fit your
            needs, while maintaining seamless integration across all systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">10x</div>
              <div className="text-gray-400 text-sm">Faster Deployment</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400 text-sm">Enterprise Clients</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime SLA</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Database className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">1PB+</div>
              <div className="text-gray-400 text-sm">Data Processed Daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Details */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {platforms.map((platform, index) => {
              const Icon = platform.icon
              const isEven = index % 2 === 0

              return (
                <div
                  key={platform.name}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
                >
                  <div className={isEven ? "" : "lg:col-start-2"}>
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br from-${platform.color}-500/20 to-${platform.color}-600/20 flex items-center justify-center mr-4`}
                      >
                        <Icon className={`w-8 h-8 text-${platform.color}-400`} />
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold text-white">{platform.name}</h2>
                        <p className={`text-${platform.color}-400 font-medium`}>{platform.fullName}</p>
                      </div>
                    </div>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">{platform.description}</p>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {platform.features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-3">
                            <CheckCircle className={`w-5 h-5 text-${platform.color}-400 flex-shrink-0`} />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <div className="text-2xl font-bold text-white">{platform.pricing}</div>
                        <div className="text-gray-400">per organization</div>
                      </div>
                      <Link href="/get-started">
                        <Button
                          className={`bg-gradient-to-r from-${platform.color}-500 to-${platform.color}-600 hover:from-${platform.color}-400 hover:to-${platform.color}-500 text-white`}
                        >
                          Get Started
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className={isEven ? "" : "lg:col-start-1"}>
                    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Common Use Cases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {platform.useCases.map((useCase, idx) => (
                            <div key={useCase} className="flex items-start space-x-3">
                              <div
                                className={`w-6 h-6 rounded-full bg-${platform.color}-500/20 flex items-center justify-center flex-shrink-0 mt-0.5`}
                              >
                                <span className={`text-${platform.color}-400 text-sm font-bold`}>{idx + 1}</span>
                              </div>
                              <div>
                                <div className="text-white font-medium">{useCase}</div>
                                <div className="text-gray-400 text-sm">Enterprise-ready solution</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Seamless Integration Across All Platforms</h2>
          <p className="text-xl text-gray-400 mb-12">
            Mix and match platforms to create the perfect solution for your organization. All platforms work together
            seamlessly with unified APIs and shared data models.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-4"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
                Schedule a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
