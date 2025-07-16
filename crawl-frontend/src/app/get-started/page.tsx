"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { ArrowRight, CheckCircle, Users, Building, Zap, Shield } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: 1,
    title: "Account Setup",
    description: "Create your account and choose your plan",
    icon: Users,
    color: "cyan",
  },
  {
    number: 2,
    title: "Data Connection",
    description: "Connect your data sources and configure pipelines",
    icon: Zap,
    color: "purple",
  },
  {
    number: 3,
    title: "Dashboard Creation",
    description: "Build your first dashboard and start analyzing",
    icon: Building,
    color: "emerald",
  },
  {
    number: 4,
    title: "Team Collaboration",
    description: "Invite team members and set up permissions",
    icon: Shield,
    color: "orange",
  },
]

const plans = [
  {
    name: "Starter",
    price: "$99/month",
    description: "Perfect for small teams",
    features: ["Up to 5 users", "10GB storage", "Basic dashboards"],
    color: "cyan",
    popular: false,
  },
  {
    name: "Professional",
    price: "$299/month",
    description: "Advanced features for growing teams",
    features: ["Up to 25 users", "100GB storage", "Advanced analytics"],
    color: "purple",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-scale solution",
    features: ["Unlimited users", "Unlimited storage", "Custom features"],
    color: "emerald",
    popular: false,
  },
]

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState("Professional")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    role: "",
    teamSize: "",
    useCase: "",
    agreeToTerms: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Get Started</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Start Your Journey
            <br />
            to Data Excellence
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Get up and running in minutes with our guided onboarding process. No technical expertise required.
          </p>

          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? `bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/20 border-2 border-${step.color}-400`
                          : "bg-gray-800 border-2 border-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      <Icon className={`w-8 h-8 ${isActive ? `text-${step.color}-400` : "text-gray-500"}`} />
                    )}
                  </div>
                  <div className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-500"}`}>
                    Step {step.number}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Onboarding Form */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white mb-2">{steps[currentStep - 1].title}</CardTitle>
              <p className="text-gray-400 text-lg">{steps[currentStep - 1].description}</p>
            </CardHeader>

            <CardContent className="p-8">
              {/* Step 1: Account Setup */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-white mb-2 block">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white mb-2 block">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Work Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter your work email"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company" className="text-white mb-2 block">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white mb-2 block">
                        Phone (Optional)
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="role" className="text-white mb-2 block">
                        Your Role
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ceo">CEO/Founder</SelectItem>
                          <SelectItem value="cto">CTO</SelectItem>
                          <SelectItem value="data-scientist">Data Scientist</SelectItem>
                          <SelectItem value="analyst">Business Analyst</SelectItem>
                          <SelectItem value="engineer">Data Engineer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="teamSize" className="text-white mb-2 block">
                        Team Size
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("teamSize", value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 people</SelectItem>
                          <SelectItem value="11-50">11-50 people</SelectItem>
                          <SelectItem value="51-200">51-200 people</SelectItem>
                          <SelectItem value="201-1000">201-1000 people</SelectItem>
                          <SelectItem value="1000+">1000+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-gray-300 text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 2: Plan Selection */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Choose Your Plan</h3>
                    <p className="text-gray-400">Start with a 14-day free trial, no credit card required</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card
                        key={plan.name}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedPlan === plan.name
                            ? `bg-gradient-to-br from-${plan.color}-500/20 to-${plan.color}-600/20 border-${plan.color}-400/50`
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                        onClick={() => setSelectedPlan(plan.name)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                              Most Popular
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="text-center">
                          <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                          <div className="text-2xl font-bold text-cyan-400 mb-2">{plan.price}</div>
                          <p className="text-gray-400 text-sm">{plan.description}</p>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-2">
                            {plan.features.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <CheckCircle className={`w-4 h-4 text-${plan.color}-400`} />
                                <span className="text-gray-300 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Use Case */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">What's Your Primary Use Case?</h3>
                    <p className="text-gray-400">Help us customize your experience</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Business Intelligence & Reporting",
                      "Predictive Analytics & ML",
                      "Customer Analytics",
                      "Financial Analytics",
                      "Operational Analytics",
                      "Marketing Analytics",
                      "Product Analytics",
                      "Other",
                    ].map((useCase) => (
                      <Card
                        key={useCase}
                        className={`cursor-pointer transition-all duration-300 ${
                          formData.useCase === useCase
                            ? "bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-cyan-400/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                        onClick={() => handleInputChange("useCase", useCase)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                formData.useCase === useCase ? "bg-cyan-400 border-cyan-400" : "border-gray-400"
                              }`}
                            />
                            <span className="text-white">{useCase}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="text-center space-y-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4">You're All Set!</h3>
                    <p className="text-xl text-gray-400 mb-8">
                      Your account has been created and your free trial is ready to begin.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">What's Next?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-cyan-400 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">Connect Your Data</div>
                          <div className="text-gray-400 text-sm">Link your databases and data sources</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-400 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">Build Dashboards</div>
                          <div className="text-gray-400 text-sm">Create your first analytics dashboard</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-400 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">Invite Your Team</div>
                          <div className="text-gray-400 text-sm">Collaborate with team members</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-4"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white"
                  >
                    {currentStep === 3 ? "Complete Setup" : "Continue"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
