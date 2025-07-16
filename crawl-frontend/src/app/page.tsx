"use client"

import { useState } from "react"
import Link from "next/link"
import HeroWithGlobe from "@/components/hero-with-3d-globe"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import CollaborationInterface from "@/components/collaboration-interface"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotebookPen, Globe, BarChart3, Database, Users, Zap, Layers } from "lucide-react"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<'hero' | 'dashboard' | 'collaboration'>('hero')

  const handleSectionChange = (section: 'hero' | 'dashboard' | 'collaboration') => {
    setActiveSection(section)
  }

  const crawlerFeatures = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Advanced Web Crawling",
      description: "Extract data from any website with our powerful crawling engine"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Extraction",
      description: "Get structured data, images, and source code from crawled sites"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Tech Stack Analysis",
      description: "Detect frameworks, libraries, and technologies used by websites"
    },
    {
      icon: <NotebookPen className="h-6 w-6" />,
      title: "Data Notebook",
      description: "Analyze crawled data with Python, SQL, and visualization tools"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Work together with your team in real-time collaborative environment"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Processing",
      description: "Process and analyze data in real-time as it's being crawled"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section - Always visible as entry point */}
      <section id="hero" className={activeSection === 'hero' ? 'block' : 'hidden'}>
        <HeroWithGlobe />
        
        {/* Crawler Feature Section */}
        <div className="relative z-10 bg-black/50 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Advanced Web Crawling & Data Analysis
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Extract, analyze, and visualize web data with our integrated crawling platform. 
                From simple data extraction to complex tech stack analysis.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {crawlerFeatures.map((feature, index) => (
                <Card key={index} className="bg-black/50 border-white/10 hover:border-cyan-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleSectionChange('dashboard')}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </button>
              <Link href="/workspace">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Start Crawling
                </Button>
              </Link>
              <Link href="/notebook">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <NotebookPen className="h-5 w-5" />
                  Open Notebook
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className={activeSection === 'dashboard' ? 'block' : 'hidden'}>
        <AnalyticsDashboard />
        <div className="absolute top-8 right-8 z-50 space-x-4">
          <button
            onClick={() => handleSectionChange('hero')}
            className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Back to Hero
          </button>
          <button
            onClick={() => handleSectionChange('collaboration')}
            className="bg-[#14b8a6] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0f9488] transition-colors"
          >
            View Collaboration
          </button>
          <Link href="/workspace">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Globe className="h-4 w-4 mr-2" />
              Start Crawling
            </Button>
          </Link>
        </div>
      </section>

      {/* Collaboration Section */}
      <section id="collaboration" className={activeSection === 'collaboration' ? 'block' : 'hidden'}>
        <CollaborationInterface />
        <div className="absolute top-8 right-8 z-50 space-x-4">
          <button
            onClick={() => handleSectionChange('dashboard')}
            className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => handleSectionChange('hero')}
            className="bg-[#14b8a6] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0f9488] transition-colors"
          >
            Back to Hero
          </button>
          <Link href="/workspace">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              <Globe className="h-4 w-4 mr-2" />
              Start Crawling
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Always visible */}
      <div className={activeSection === 'hero' ? 'block' : 'hidden'}>
        <Footer />
      </div>
    </div>
  )
}
