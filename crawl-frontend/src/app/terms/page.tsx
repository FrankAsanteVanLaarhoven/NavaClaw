"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Legal</Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-400">Last updated: December 6, 2024</p>
        </div>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using InsightsAI's platform and services, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                InsightsAI provides a comprehensive data analytics and artificial intelligence platform that enables
                organizations to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Connect and integrate data from multiple sources</li>
                <li>Create interactive dashboards and visualizations</li>
                <li>Apply machine learning and AI models to data</li>
                <li>Collaborate on data analysis projects</li>
                <li>Generate automated insights and reports</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To access certain features of our service, you must register for an account. When you register, you
                agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Privacy and Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We take data privacy and security seriously. Our commitments include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>End-to-end encryption of all data in transit and at rest</li>
                <li>Compliance with GDPR, CCPA, and other privacy regulations</li>
                <li>Regular security audits and penetration testing</li>
                <li>SOC 2 Type II certification</li>
                <li>Data residency options for enterprise customers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You agree not to use the service to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or attempt to gain unauthorized access</li>
                <li>Use the service for competitive analysis or reverse engineering</li>
                <li>Share account credentials with unauthorized users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Subscription and Billing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Our subscription terms include:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Subscriptions are billed monthly or annually in advance</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>You may cancel your subscription at any time</li>
                <li>Price changes will be communicated 30 days in advance</li>
                <li>Enterprise customers may have custom billing terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                The InsightsAI platform, including all software, algorithms, and documentation, is protected by
                intellectual property laws. You retain ownership of your data, while we retain ownership of our platform
                and any improvements made to it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Service Level Agreement</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We commit to providing:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>99.9% uptime for our platform</li>
                <li>24/7 monitoring and support</li>
                <li>Scheduled maintenance windows with advance notice</li>
                <li>Disaster recovery and backup procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, InsightsAI shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, your access to the service will
                cease, and we will provide you with the ability to export your data for a period of 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via
                email or through our platform. Continued use of the service after such modifications constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white">Email: legal@insightsai.com</p>
                <p className="text-white">Address: 123 Data Street, Analytics City, AC 12345</p>
                <p className="text-white">Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
