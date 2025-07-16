"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
// Remove this line:
// import { format } from "date-fns"
import { ArrowRight, CalendarIcon, Clock, Users, Video, CheckCircle, Play, Sparkles } from "lucide-react"

const demoTypes = [
  {
    name: "Platform Overview",
    duration: "30 minutes",
    description: "Complete walkthrough of all platform features and capabilities",
    icon: Video,
    color: "cyan",
  },
  {
    name: "Industry-Specific Demo",
    duration: "45 minutes",
    description: "Customized demo focused on your industry's specific use cases",
    icon: Users,
    color: "purple",
  },
  {
    name: "Technical Deep Dive",
    duration: "60 minutes",
    description: "In-depth technical discussion with our engineering team",
    icon: Sparkles,
    color: "emerald",
  },
]

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

export default function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState("Platform Overview")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    role: "",
    teamSize: "",
    industry: "",
    useCase: "",
    questions: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-500/10 text-purple-400 border-purple-500/20">Schedule Demo</Badge>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            See Our Platform
            <br />
            in Action
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Get a personalized demo tailored to your specific needs and use cases. Our experts will show you how to
            transform your data into actionable insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Video className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">Live Demo</div>
              <div className="text-gray-400 text-sm">Interactive walkthrough</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">Expert Guide</div>
              <div className="text-gray-400 text-sm">Dedicated solution expert</div>
            </div>
            <div className="p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-2">Customized</div>
              <div className="text-gray-400 text-sm">Tailored to your needs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Booking Form */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Demo Selection */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Choose Your Demo Type</h2>

              <div className="space-y-4 mb-8">
                {demoTypes.map((demo) => {
                  const Icon = demo.icon
                  const isSelected = selectedDemo === demo.name

                  return (
                    <Card
                      key={demo.name}
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-br from-${demo.color}-500/20 to-${demo.color}-600/20 border-${demo.color}-400/50`
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => setSelectedDemo(demo.name)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${demo.color}-500/20 to-${demo.color}-600/20 flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-6 h-6 text-${demo.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white">{demo.name}</h3>
                              <Badge
                                className={`bg-${demo.color}-500/10 text-${demo.color}-400 border-${demo.color}-500/20`}
                              >
                                {demo.duration}
                              </Badge>
                            </div>
                            <p className="text-gray-400">{demo.description}</p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? `bg-${demo.color}-400 border-${demo.color}-400` : "border-gray-400"
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Date and Time Selection */}
              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-4 block text-lg font-semibold">Select Date & Time</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-900 border-white/20">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>

                    <Select onValueChange={setSelectedTime}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Form */}
            <div>
              <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Your Information</CardTitle>
                  <p className="text-gray-400">Help us prepare a personalized demo for you</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white mb-2 block">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white mb-2 block">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Work Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter work email"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company" className="text-white mb-2 block">
                        Company *
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white mb-2 block">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role" className="text-white mb-2 block">
                        Your Role
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select role" />
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
                          <SelectValue placeholder="Select size" />
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

                  <div>
                    <Label htmlFor="industry" className="text-white mb-2 block">
                      Industry
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail & E-commerce</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="energy">Energy & Utilities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="useCase" className="text-white mb-2 block">
                      Primary Use Case
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("useCase", value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bi">Business Intelligence</SelectItem>
                        <SelectItem value="ml">Machine Learning</SelectItem>
                        <SelectItem value="customer">Customer Analytics</SelectItem>
                        <SelectItem value="financial">Financial Analytics</SelectItem>
                        <SelectItem value="operational">Operational Analytics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="questions" className="text-white mb-2 block">
                      Questions or Specific Topics
                    </Label>
                    <Textarea
                      id="questions"
                      value={formData.questions}
                      onChange={(e) => handleInputChange("questions", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Any specific questions or topics you'd like us to cover?"
                      rows={3}
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white py-3"
                    disabled={
                      !selectedDate ||
                      !selectedTime ||
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.email ||
                      !formData.company
                    }
                  >
                    Schedule Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <p className="text-gray-400 text-sm text-center">
                    You'll receive a calendar invitation with meeting details within 24 hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">What to Expect</h2>
            <p className="text-xl text-gray-400">Here's what we'll cover during your personalized demo session</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center mb-6">
                  <Play className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Live Platform Demo</h3>
                <p className="text-gray-400 mb-4">
                  See our platform in action with real data and use cases relevant to your industry.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Interactive dashboard creation</li>
                  <li>• Data connection and integration</li>
                  <li>• Advanced analytics features</li>
                  <li>• Collaboration tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Q&A Session</h3>
                <p className="text-gray-400 mb-4">
                  Get answers to your specific questions and discuss your unique requirements.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Technical architecture discussion</li>
                  <li>• Integration possibilities</li>
                  <li>• Pricing and implementation</li>
                  <li>• Next steps and timeline</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
