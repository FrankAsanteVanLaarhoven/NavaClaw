import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory store for rate limiting (Note: In a multi-instance production environment, this should use Redis)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_DURATION = 60000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per IP per minute

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Route specific protections
  if (request.nextUrl.pathname.startsWith('/api')) {
    // 1. Rate Limiting
    const userRecord = rateLimit.get(ip);
    
    if (!userRecord || (now - userRecord.timestamp) > RATE_LIMIT_DURATION) {
      rateLimit.set(ip, { count: 1, timestamp: now });
    } else {
      userRecord.count++;
      if (userRecord.count > MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ error: 'Too many requests, please try again later.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // 2. Basic Payload Inspection (prevent ingestion attacks)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 5242880) { // 5MB limit for API requests
       return new NextResponse(
          JSON.stringify({ error: 'Payload too large.' }),
          { status: 413, headers: { 'Content-Type': 'application/json' } }
        );
    }
  }

  // Add security headers to the response
  const response = NextResponse.next();
  
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
