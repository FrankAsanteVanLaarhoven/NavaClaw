"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Shield, BarChart3, Brain, Workflow, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const solutionCategories = [
  {
    title: "Business Intelligence & Analytics",
    description: "Transform raw data into actionable business insights with advanced analytics and visualization tools",
    icon: BarChart3,
    color: "cyan",
    solutions: [
      {
        name: "Real-time Dashboards",
        description: "Interactive dashboards with live data updates and collaborative features",
        features: ["Drag & Drop Builder", "Real-time Updates", "Custom Visualizations", "Mobile Responsive"],
      },
      {
        name: "Predictive Analytics",
        description: "Forecast trends and outcomes using advanced machine learning algorithms",
        features: ["Time Series Forecasting", "Anomaly Detection", "Risk Assessment", "Scenario Planning"],
      },
      {
        name: "Self-Service Analytics",
        description: "Empower business users to create their own reports and analyses",
        features: ["No-Code Interface", "Natural Language Queries", "Automated Insights", "Data Storytelling"],
      },
    ],
  },
  {
    title: "Artificial Intelligence & Machine Learning",
    description: "Deploy production-ready AI models with automated training, deployment, and monitoring",
    icon: Brain,
    color: "purple",
    solutions: [
      {
        name: "AutoML Platform",
        description: "Automated machine learning pipeline for model development and deployment",
        features: ["Automated Feature Engineering", "Model Selection", "Hyperparameter Tuning", "A/B Testing"],
      },
      {
        name: "NLP & Text Analytics",
        description: "Extract insights from unstructured text data using advanced NLP techniques",
        features: ["Sentiment Analysis", "Entity Recognition", "Document Classification", "Language Translation"],
      },
      {
        name: "Computer Vision",
        description: "Analyze and understand visual content with state-of-the-art computer vision models",
        features: ["Object Detection", "Image Classification", "OCR", "Video Analytics"],
      },
    ],
  },
  {
    title: "Data Engineering & Integration",
    description: "Build robust data pipelines and integrate data from multiple sources seamlessly",
    icon: Workflow,
    color: "emerald",
    solutions: [
      {
        name: "Data Pipeline Automation",
        description: "Automated ETL/ELT pipelines with monitoring and error handling",
        features: ["Visual Pipeline Builder", "Error Recovery", "Data Quality Checks", "Scheduling"],
      },
      {
        name: "Real-time Data Streaming",
        description: "Process and analyze data streams in real-time with low latency",
        features: ["Stream Processing", "Event-driven Architecture", "Scalable Infrastructure", "Fault Tolerance"],
      },
      {
        name: "Data Governance",
        description: "Ensure data quality, lineage, and compliance across your organization",
        features: ["Data Lineage Tracking", "Quality Monitoring", "Access Control", "Compliance Reporting"],
      },
    ],
  },
  {
    title: "Customer Analytics & Personalization",
    description: "Understand customer behavior and deliver personalized experiences at scale",
    icon: Users,
    color: "orange",
    solutions: [
      {
        name: "Customer 360",
        description: "Unified view of customer data across all touchpoints and channels",
        features: ["Identity Resolution", "Journey Mapping", "Behavioral Analytics", "Segmentation"],
      },
      {
        name: "Recommendation Engine",
        description: "AI-powered recommendations to increase engagement and conversion",
        features: ["Collaborative Filtering", "Content-based Filtering", "Real-time Recommendations", "A/B Testing"],
      },
      {
        name: "Churn Prediction",
        description: "Identify at-risk customers and take proactive retention actions",
        features: ["Risk Scoring", "Early Warning System", "Retention Campaigns", "ROI Tracking"],
      },
    ],
  },
  {
    title: "Financial Analytics & Risk Management",
    description: "Advanced financial modeling, risk assessment, and regulatory compliance solutions",
    icon: TrendingUp,
    color: "blue",
    solutions: [
      {
        name: "Risk Analytics",
        description: "Comprehensive risk assessment and management across all business areas",
        features: ["Credit Risk Modeling", "Market Risk Analysis", "Operational Risk", "Stress Testing"],
      },
      {
        name: "Fraud Detection",
        description: "Real-time fraud detection using machine learning and behavioral analytics",
        features: ["Anomaly Detection", "Pattern Recognition", "Real-time Scoring", "Case Management"],
      },
      {
        name: "Regulatory Reporting",
        description: "Automated compliance reporting for financial regulations",
        features: ["Basel III/IV", "IFRS 9", "CCAR/DFAST", "Audit Trail"],
      },
    ],
  },
  {
    title: "Cybersecurity & Threat Intelligence",
    description: "Protect your organization with AI-powered security analytics and threat detection",
    icon: Shield,
    color: "red",
    solutions: [
      {
        name: "Security Analytics",
        description: "Advanced threat detection using behavioral analytics and machine learning",
        features: ["UEBA", "Threat Hunting", "Incident Response", "Forensic Analysis"],
      },
      {
        name: "Vulnerability Management",
        description: "Continuous vulnerability assessment and risk prioritization",
        features: ["Asset Discovery", "Risk Scoring", "Patch Management", "Compliance Tracking"],
      },
      {
        name: "Security Orchestration",
        description: "Automated security workflows and incident response procedures",
        features: ["Playbook Automation", "Case Management", "Integration Hub", "Response Metrics"],
      },
    ],
  },
]

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/20">Solutions Overview</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Solutions for Every
            <br />
            Business Challenge
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            From business intelligence to AI-powered automation, our comprehensive solution suite addresses the most
            complex data and analytics challenges across industries.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-24">
            {solutionCategories.map((category, categoryIndex) => {
              const Icon = category.icon

              return (
                <div key={category.title}>
                  {/* Category Header */}
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20 flex items-center justify-center mr-4`}
                      >
                        <Icon className={`w-8 h-8 text-${category.color}-400`} />
                      </div>
                      <div className="text-left">
                        <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                        <p className={`text-${category.color}-400`}>Solution Category</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">{category.description}</p>
                  </div>

                  {/* Solutions Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {category.solutions.map((solution, solutionIndex) => (
                      <Card
                        key={solution.name}
                        className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm group"
                      >
                        <CardHeader>
                          <CardTitle className="text-white group-hover:text-cyan-300 transition-colors duration-300">
                            {solution.name}
                          </CardTitle>
                          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            {solution.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-6">
                            {solution.features.map((feature) => (
                              <div key={feature} className="flex items-center space-x-3">
                                <CheckCircle className={`w-4 h-4 text-${category.color}-400 flex-shrink-0`} />
                                <span className="text-gray-300 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <Link href="/get-started">
                            <Button
                              variant="outline"
                              className="w-full border-white/20 text-white hover:bg-white/10 group-hover:border-cyan-400/50 group-hover:text-cyan-300 transition-all duration-300"
                            >
                              Learn More
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Our solutions are designed to work together seamlessly, giving you the flexibility to start small and scale
            as your needs grow.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
