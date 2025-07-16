"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plane,
  Car,
  Building,
  Zap,
  DollarSign,
  Heart,
  Factory,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

const industries = [
  {
    name: "Aerospace & Aviation",
    icon: Plane,
    color: "cyan",
    description: "Optimize flight operations, maintenance scheduling, and passenger experience with advanced analytics",
    challenges: [
      "Flight delay prediction and optimization",
      "Predictive maintenance for aircraft",
      "Fuel consumption optimization",
      "Passenger flow management",
    ],
    solutions: [
      "Real-time operational dashboards",
      "Predictive maintenance analytics",
      "Route optimization algorithms",
      "Customer experience analytics",
    ],
    caseStudy: "Reduced flight delays by 35% and maintenance costs by 28%",
  },
  {
    name: "Automotive",
    icon: Car,
    color: "purple",
    description: "Drive innovation in manufacturing, supply chain, and connected vehicle technologies",
    challenges: [
      "Supply chain disruption management",
      "Quality control and defect prediction",
      "Connected vehicle data analysis",
      "Customer behavior insights",
    ],
    solutions: [
      "Supply chain visibility platform",
      "Quality analytics and prediction",
      "IoT data processing for connected cars",
      "Customer journey optimization",
    ],
    caseStudy: "Improved manufacturing efficiency by 42% and reduced defects by 60%",
  },
  {
    name: "Construction & Real Estate",
    icon: Building,
    color: "emerald",
    description: "Transform project management, risk assessment, and property valuation with data-driven insights",
    challenges: [
      "Project timeline and cost overruns",
      "Safety incident prevention",
      "Property valuation accuracy",
      "Resource allocation optimization",
    ],
    solutions: [
      "Project analytics and forecasting",
      "Safety monitoring and prediction",
      "Automated property valuation models",
      "Resource optimization algorithms",
    ],
    caseStudy: "Reduced project overruns by 30% and improved safety scores by 45%",
  },
  {
    name: "Energy & Renewables",
    icon: Zap,
    color: "yellow",
    description: "Optimize energy production, distribution, and consumption with intelligent grid management",
    challenges: [
      "Grid stability and load balancing",
      "Renewable energy forecasting",
      "Equipment failure prediction",
      "Energy consumption optimization",
    ],
    solutions: [
      "Smart grid analytics platform",
      "Weather-based energy forecasting",
      "Predictive maintenance for turbines",
      "Demand response optimization",
    ],
    caseStudy: "Increased renewable energy efficiency by 25% and reduced downtime by 40%",
  },
  {
    name: "Financial Services & Banking",
    icon: DollarSign,
    color: "blue",
    description: "Enhance risk management, fraud detection, and customer experience in financial services",
    challenges: [
      "Real-time fraud detection",
      "Credit risk assessment",
      "Regulatory compliance reporting",
      "Customer churn prediction",
    ],
    solutions: [
      "AI-powered fraud detection system",
      "Advanced credit scoring models",
      "Automated compliance reporting",
      "Customer analytics platform",
    ],
    caseStudy: "Reduced fraud losses by 65% and improved loan approval accuracy by 38%",
  },
  {
    name: "Healthcare & Life Sciences",
    icon: Heart,
    color: "red",
    description: "Accelerate drug discovery, improve patient outcomes, and optimize healthcare operations",
    challenges: [
      "Drug discovery and development",
      "Patient outcome prediction",
      "Clinical trial optimization",
      "Healthcare resource allocation",
    ],
    solutions: [
      "AI-driven drug discovery platform",
      "Predictive patient analytics",
      "Clinical trial matching algorithms",
      "Hospital operations optimization",
    ],
    caseStudy: "Accelerated drug discovery by 50% and improved patient outcomes by 32%",
  },
  {
    name: "Manufacturing",
    icon: Factory,
    color: "orange",
    description: "Optimize production processes, quality control, and supply chain management",
    challenges: [
      "Production line optimization",
      "Quality defect prediction",
      "Supply chain visibility",
      "Equipment maintenance scheduling",
    ],
    solutions: [
      "Smart manufacturing analytics",
      "Computer vision quality control",
      "Supply chain optimization platform",
      "Predictive maintenance system",
    ],
    caseStudy: "Increased production efficiency by 35% and reduced quality defects by 55%",
  },
  {
    name: "Retail & E-commerce",
    icon: ShoppingCart,
    color: "pink",
    description: "Personalize customer experiences, optimize inventory, and maximize revenue",
    challenges: ["Inventory optimization", "Customer personalization", "Price optimization", "Demand forecasting"],
    solutions: [
      "Intelligent inventory management",
      "AI-powered recommendation engine",
      "Dynamic pricing algorithms",
      "Demand prediction models",
    ],
    caseStudy: "Increased sales by 28% and reduced inventory costs by 22%",
  },
]

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Industry Solutions</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
            Solving Complex Problems
            <br />
            Across All Industries
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Our platform adapts to your industry's unique challenges, providing specialized analytics and AI solutions
            that drive measurable business outcomes in days, not years.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400 text-sm">Enterprise Clients</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <CheckCircle className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">30 Days</div>
              <div className="text-gray-400 text-sm">Average Time to Value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {industries.map((industry, index) => {
              const Icon = industry.icon

              return (
                <Card
                  key={industry.name}
                  className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-sm group"
                >
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${industry.color}-500/20 to-${industry.color}-600/20 flex items-center justify-center mr-4`}
                      >
                        <Icon className={`w-6 h-6 text-${industry.color}-400`} />
                      </div>
                      <div>
                        <CardTitle className="text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {industry.name}
                        </CardTitle>
                        <Badge
                          className={`bg-${industry.color}-500/10 text-${industry.color}-400 border-${industry.color}-500/20 mt-1`}
                        >
                          Industry Focus
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {industry.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Key Challenges</h4>
                      <div className="space-y-2">
                        {industry.challenges.map((challenge) => (
                          <div key={challenge} className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{challenge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Our Solutions</h4>
                      <div className="space-y-2">
                        {industry.solutions.map((solution) => (
                          <div key={solution} className="flex items-start space-x-3">
                            <CheckCircle className={`w-4 h-4 text-${industry.color}-400 mt-0.5 flex-shrink-0`} />
                            <span className="text-gray-300 text-sm">{solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg bg-${industry.color}-500/10 border border-${industry.color}-500/20`}
                    >
                      <h4 className={`text-${industry.color}-400 font-semibold mb-2`}>Success Story</h4>
                      <p className="text-gray-300 text-sm">{industry.caseStudy}</p>
                    </div>

                    <Link href="/get-started">
                      <Button
                        className={`w-full bg-gradient-to-r from-${industry.color}-500 to-${industry.color}-600 hover:from-${industry.color}-400 hover:to-${industry.color}-500 text-white`}
                      >
                        Explore Solutions
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Don't See Your Industry?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Our platform is designed to adapt to any industry's unique challenges. Let's discuss how we can solve your
            specific use cases.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/demo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white px-8 py-4"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/get-started">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
