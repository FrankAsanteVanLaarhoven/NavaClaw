"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const industries = [
  "Aerospace & Aviation",
  "Automotive",
  "Construction & Real Estate",
  "Energy & Renewables",
  "Financial Services & Banking",
  "Government & Security",
  "Healthcare & Lifesciences",
  "Insurance",
  "Logistics",
  "Manufacturing",
  "Retail & E-commerce",
  "Technology & Software",
]

export function IndustriesSection() {
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null)

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-8 text-white">
              Solving complex problems across
              <span className="block text-cyan-400">all industries</span>
              <span className="block text-white">in days, not years.</span>
            </h2>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Our platform adapts to your industry's unique challenges, providing specialized analytics and AI solutions
              that drive real business outcomes.
            </p>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <div className="text-gray-300">
                <div className="font-semibold">AI-Powered Solutions</div>
                <div className="text-sm text-gray-500">Tailored for your industry</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {industries.map((industry, index) => (
              <Card
                key={industry}
                className={`bg-black/30 border-white/10 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                  hoveredIndustry === industry
                    ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-400/50"
                    : ""
                }`}
                onMouseEnter={() => setHoveredIndustry(industry)}
                onMouseLeave={() => setHoveredIndustry(null)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-cyan-400 font-mono text-sm w-8">{String(index + 1).padStart(2, "0")}</span>
                      <span
                        className={`text-lg font-medium transition-colors duration-300 ${
                          hoveredIndustry === industry ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {industry}
                      </span>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        hoveredIndustry === industry ? "bg-cyan-400 scale-150" : "bg-gray-600"
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
