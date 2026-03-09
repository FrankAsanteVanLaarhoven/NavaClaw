import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import '../styles/globals.css'

// Premium font stack inspired by enterprise design systems
const fontSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const fontDisplay = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['400','500','600','700'], display: 'swap' })
const fontMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400','500','600'], display: 'swap' })

export const metadata: Metadata = {
  title: 'NAVACLAW-AI — Ephemeral UI Super-Agent',
  description: 'SOTA ephemeral UI platform that generates interfaces on demand. Voice, gesture, and intent-driven. Zero-UI agentic system.',
  keywords: ['AI', 'ephemeral UI', 'zero-UI', 'agent zero', 'voice interface', 'gesture control', 'agentic AI', 'NAVACLAW'],
  authors: [{ name: 'Frank Van Laarhoven' }],
  creator: 'Frank Van Laarhoven',
  publisher: 'NAVACLAW-AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NAVACLAW-AI — Ephemeral UI Super-Agent',
    description: 'SOTA ephemeral UI platform that generates interfaces on demand. Voice, gesture, and intent-driven.',
    url: 'http://localhost:3000',
    siteName: 'NAVACLAW-AI',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NAVACLAW-AI — Ephemeral UI Super-Agent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAVACLAW-AI — Ephemeral UI Super-Agent',
    description: 'SOTA ephemeral UI platform that generates interfaces on demand. Voice, gesture, and intent-driven.',
    images: ['/images/twitter-image.png'],
    creator: '@navaclaw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased bg-black text-zinc-300`}
      >
        <div className="relative min-h-screen selection:bg-emerald-500/10 selection:text-emerald-300">
          {/* Palantir-grade ambient glow — no purple, pure monochrome */}
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(800px_400px_at_50%_-200px,rgba(16,185,129,0.04),transparent_70%)]" />
          {children}
        </div>
      </body>
    </html>
  )
} 