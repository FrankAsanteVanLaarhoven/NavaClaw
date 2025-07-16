"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { CheckCircle, X, ArrowRight, Zap, Users, Headphones, Star, Building } from "lucide-react"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started with data analytics",
    monthlyPrice: 99,
    yearlyPrice: 990,
    color: "cyan",
    popular: false,
    features: [
      { name: "Up to 5 users", included: true },
      { name: "10GB data storage", included: true },
      { name: "Basic dashboards", included: true },
      { name: "Standard connectors", included: true },
      { name: "Email support", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Custom integrations", included: false },
      { name: "Priority support", included: false },
      { name: "SSO & RBAC", included: false },
    ],
  },
  {
    name: "Professional",
    description: "Advanced features for growing businesses and teams",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    color: "purple",
    popular: true,
    features: [
      { name: "Up to 25 users", included: true },
      { name: "100GB data storage", included: true },
      { name: "Advanced dashboards", included: true },
      { name: "All connectors", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: true },
      { name: "API access", included: true },
      { name: "SSO & RBAC", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "Full-scale solution for large organizations",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    color: "emerald",
    popular: false,
    features: [
      { name: "Unlimited users", included: true },
      { name: "Unlimited data storage", included: true },
      { name: "Custom dashboards", included: true },
      { name: "All connectors + custom", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom integrations", included: true },
      { name: "Full API access", included: true },
      { name: "SSO & RBAC", included: true },
    ],
  },
]

const addOns = [
  {
    name: "Additional Storage",
    description: "Extra data storage beyond your plan limits",
    price: "$0.10/GB/month",
    icon: Building,
  },
  {
    name: "Premium Support",
    description: "Dedicated customer success manager",
    price: "$500/month",
    icon: Headphones,
  },
  {
    name: "Custom Training",
    description: "Personalized training sessions for your team",
    price: "$2,000/session",
    icon: Users,
  },
  {
    name: "Professional Services",
    description: "Implementation and consulting services",
    price: "Custom pricing",
    icon: Star,
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/20">Transparent Pricing</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Simple, Transparent
            <br />
            Pricing for Everyone
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            No hidden fees, no vendor lock-in. Choose the plan that fits your needs and scale as you grow. All plans
            include our core analytics platform.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isYearly ? "text-white" : "text-gray-400"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-purple-500" />
            <span className={`text-lg ${isYearly ? "text-white" : "text-gray-400"}`}>
              Yearly
              <Badge className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Save 17%</Badge>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  plan.popular ? "border-purple-500/50 shadow-2xl shadow-purple-500/20" : "hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/20 flex items-center justify-center mx-auto mb-4`}
                  >
                    {plan.name === "Starter" && <Zap className={`w-8 h-8 text-${plan.color}-400`} />}
                    {plan.name === "Professional" && <Users className={`w-8 h-8 text-${plan.color}-400`} />}
                    {plan.name === "Enterprise" && <Building className={`w-8 h-8 text-${plan.color}-400`} />}
                  </div>

                  <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white mb-2">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-lg text-gray-400 font-normal">/{isYearly ? "year" : "month"}</span>
                    </div>
                    {isYearly && (
                      <div className="text-sm text-emerald-400">
                        Save ${plan.monthlyPrice * 12 - plan.yearlyPrice} per year
                      </div>
                    )}
                  </div>

                  <Link href="/get-started">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"
                          : `bg-gradient-to-r from-${plan.color}-500 to-${plan.color}-600 hover:from-${plan.color}-400 hover:to-${plan.color}-500`
                      } text-white`}
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature.name} className="flex items-center space-x-3">
                        {feature.included ? (
                          <CheckCircle className={`w-5 h-5 text-${plan.color}-400 flex-shrink-0`} />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`${feature.included ? "text-gray-300" : "text-gray-500"}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Add-ons & Services</h2>
            <p className="text-xl text-gray-400">Enhance your plan with additional services and support options</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addOns.map((addon) => {
              const Icon = addon.icon

              return (
                <Card
                  key={addon.name}
                  className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{addon.name}</h3>
                        <p className="text-gray-400 mb-3">{addon.description}</p>
                        <div className="text-cyan-400 font-semibold">{addon.price}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Can I change my plan at any time?</h3>
                <p className="text-gray-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll
                  prorate any billing adjustments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Is there a free trial available?</h3>
                <p className="text-gray-400">
                  Yes, we offer a 14-day free trial with full access to Professional plan features. No credit card
                  required to get started.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-400">
                  We accept all major credit cards, ACH transfers, and wire transfers for Enterprise customers. All
                  payments are processed securely through our payment partners.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Do you offer custom enterprise pricing?</h3>
                <p className="text-gray-400">
                  Yes, we offer custom pricing for large enterprises with specific requirements. Contact our sales team
                  to discuss volume discounts and custom features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Start your free trial today and see how our platform can transform your data into actionable insights.
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
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
