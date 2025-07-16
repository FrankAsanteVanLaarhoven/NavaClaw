"use client"

import { Facebook, Linkedin, Twitter, Globe } from "lucide-react"

const footerLinks = {
  Product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "API", href: "#" },
    { name: "Documentation", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  Resources: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Guides", href: "#" },
  ],
  Support: [
    { name: "Contact", href: "#" },
    { name: "Status", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "LinkedIn", href: "#", icon: Linkedin },
]

export default function Footer() {
  return (
    <footer className="bg-[color:var(--color-background-primary)] border-t border-[color:var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-accent-primary)]">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[color:var(--color-text-primary)]">
                Web Crawler
              </span>
            </div>
            <p className="text-base text-[color:var(--color-text-secondary)] max-w-md">
              Powerful web scraping and data extraction tools for developers and businesses.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)] tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks.Product.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)] tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks.Company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)] tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks.Resources.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)] tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-6 space-y-4">
                  {footerLinks.Support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-base text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-[color:var(--color-border)] pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-base text-[color:var(--color-text-secondary)]">
              &copy; {new Date().getFullYear()} Web Crawler. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <a
                href="#"
                className="text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-accent-primary)] transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}