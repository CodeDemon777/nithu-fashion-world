import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Security headers to enforce on all routes
const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /_next (Next.js internals)
     * 2. /images (static assets)
     * 3. /favicon.ico, sitemap.xml, robots.txt (static files)
     */
    "/((?!_next/static|_next/image|images|favicon.ico).*)",
  ],
};
