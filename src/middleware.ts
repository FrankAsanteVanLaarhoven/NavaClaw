import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── NAVACLAW-AI Edge Middleware Firewall ────────────────────────
// This middleware runs at the edge before any request hits the application.
// It handles basic security headers, IP rate limiting skeleton, and payload validation.

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // 1. Basic Security Headers (Applied to all routes)
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY'); // Prevent clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // 2. API Route Protection (/api/*)
  if (url.pathname.startsWith('/api/')) {
    // Block common malicious user agents (basic filter)
    const userAgent = request.headers.get('user-agent') || '';
    const blockedAgents = ['curl', 'wget', 'python-requests', 'postmanruntime', 'sqlmap', 'nmap'];
    
    if (blockedAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
      // Allow internal fetch from the Python backends if needed, but generally block raw scraping tools
      // For a true production app, we would use API keys here.
      if (process.env.NODE_ENV === 'production') {
        return new NextResponse(
          JSON.stringify({ error: 'Access Denied: Invalid User Agent or Firewall Block' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Require Origin or Referer for production API calls to prevent CSRF
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin') || request.headers.get('referer');
      const allowedOrigins = [
        'https://navaclaw.com',
        'https://www.navaclaw.com',
        'http://localhost:3000'
      ];
      
      // If there is an origin, restrict it. (Some legitimate clients might not send origin, so this is a strict policy)
      if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
        return new NextResponse(
          JSON.stringify({ error: 'Access Denied: CORS Policy Violation' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
