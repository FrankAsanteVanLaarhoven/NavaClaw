"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-8">
          <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of organizations already using our platform to drive business value through advanced
            analytics and AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-400/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">Start Free Trial</h3>
              <p className="text-gray-300 mb-6">
                Get started in minutes with our self-service platform. No credit card required.
              </p>
              <Link href="/get-started" className="w-full">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-white w-full">
                  Try for Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-400/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-400 font-bold text-lg">AI</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Enterprise Demo</h3>
              <p className="text-gray-300 mb-6">
                See how our platform can solve your specific use cases with a personalized demo.
              </p>
              <Link href="/demo" className="w-full">
                <Button
                  variant="outline"
                  className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 w-full"
                >
                  Schedule Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  )
}
