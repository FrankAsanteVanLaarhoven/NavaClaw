"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, ChevronDown, Globe, FileText } from "lucide-react"

const navItems = [
  { name: "Platform", href: "/platform" },
  {
    name: "Services",
    href: "#",
    submenu: [
      { name: "Web Crawler", href: "/workspace", icon: <Globe className="h-4 w-4" /> },
      { name: "Data Notebook", href: "/notebook", icon: <FileText className="h-4 w-4" /> },
      { name: "Visualization Studio", href: "/visualization" },
      { name: "AI/ML Platform", href: "/ai-ml" },
      { name: "Metaverse Analytics", href: "/metaverse" },
      { name: "Solutions", href: "/solutions" },
    ],
  },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Workspace", href: "/workspace" },
  { name: "Industries", href: "/industries" },
  { name: "Resources", href: "/resources" },
  { name: "Pricing", href: "/pricing" },
  {
    name: "Mobile",
    href: "#",
    submenu: [
      { name: "Mobile Dashboard", href: "/mobile/dashboard" },
      { name: "Mobile Projects", href: "/mobile/projects" },
      { name: "Mobile Analytics", href: "/mobile/analytics" },
      { name: "Mobile Team", href: "/mobile/team" },
    ],
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">InsightsAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div className="relative">
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                            onClick={() => setServicesOpen(false)}
                          >
                            {subItem.icon && <span className="text-cyan-400">{subItem.icon}</span>}
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors duration-200 ${
                      pathname === item.href ? "text-cyan-400 font-medium" : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/workspace">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white">
                <Globe className="h-4 w-4 mr-2" />
                Start Crawling
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div>
                      <div className="px-4 py-2 text-gray-300 font-medium">{item.name}</div>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="flex items-center space-x-2 px-8 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.icon && <span className="text-cyan-400">{subItem.icon}</span>}
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`transition-colors duration-200 px-4 py-2 block ${
                        pathname === item.href ? "text-cyan-400 font-medium" : "text-gray-300 hover:text-white"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-white/10">
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-300 hover:text-white justify-start w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/workspace">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white justify-start w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    Start Crawling
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
