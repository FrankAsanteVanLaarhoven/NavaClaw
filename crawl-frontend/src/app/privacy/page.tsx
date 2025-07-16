"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Privacy</Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-400">Last updated: December 6, 2024</p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-400/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-300 text-sm">Full compliance with European privacy regulations</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-400/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-gray-300 text-sm">Your data is encrypted in transit and at rest</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-400/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No Data Selling</h3>
              <p className="text-gray-300 text-sm">We never sell or share your data with third parties</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-400/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Data Ownership</h3>
              <p className="text-gray-300 text-sm">You retain full ownership and control of your data</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, use our services,
                or contact us for support.
              </p>

              <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Name, email address, and contact information</li>
                <li>Company name and role</li>
                <li>Billing and payment information</li>
                <li>Profile preferences and settings</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Platform usage patterns and feature interactions</li>
                <li>Dashboard and report creation activities</li>
                <li>API usage and integration patterns</li>
                <li>Performance and error logs</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Your Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Data you upload, import, or connect to our platform</li>
                <li>Dashboards, reports, and visualizations you create</li>
                <li>Comments, annotations, and collaboration data</li>
                <li>Custom configurations and settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide and operate the InsightsAI platform</li>
                <li>Process your data and generate insights</li>
                <li>Communicate with you about your account and our services</li>
                <li>Provide customer support and technical assistance</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Security and Protection</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement comprehensive security measures to protect your data:
              </p>

              <h3 className="text-lg font-semibold text-white mb-3">Technical Safeguards</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Multi-factor authentication (MFA)</li>
                <li>Regular security audits and penetration testing</li>
                <li>SOC 2 Type II compliance</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Operational Safeguards</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Role-based access controls (RBAC)</li>
                <li>Employee background checks and security training</li>
                <li>Incident response and breach notification procedures</li>
                <li>Regular backup and disaster recovery testing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the
                following limited circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>
                  <strong>Service Providers:</strong> Trusted third parties who assist in operating our platform
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                </li>
                <li>
                  <strong>Consent:</strong> When you explicitly consent to sharing
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have several rights regarding your personal information:
              </p>

              <h3 className="text-lg font-semibold text-white mb-3">Access and Portability</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Request a copy of your personal information</li>
                <li>Export your data in standard formats</li>
                <li>Access your account information and settings</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Correction and Deletion</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Update or correct your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Withdraw consent for data processing</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mb-3">Communication Preferences</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Opt out of marketing communications</li>
                <li>Control notification settings</li>
                <li>Manage cookie preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                We may transfer your information to countries other than your own. When we do, we ensure appropriate
                safeguards are in place, including Standard Contractual Clauses approved by the European Commission and
                adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We retain your information for as long as necessary to provide our services and comply with legal
                obligations:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Account information: Until account deletion plus 30 days</li>
                <li>Usage data: 2 years for analytics and improvement</li>
                <li>Your data: Until you delete it or close your account</li>
                <li>Legal compliance: As required by applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for children under 16 years of age. We do not knowingly collect personal
                information from children under 16. If we become aware that we have collected such information, we will
                take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and sending you an email notification. We encourage you to review
                this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white mb-2">
                  <strong>Data Protection Officer</strong>
                </p>
                <p className="text-white">Email: privacy@insightsai.com</p>
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
