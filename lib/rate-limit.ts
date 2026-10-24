import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  maxRequests: number; // Maximum allowed requests
  windowMs: number;    // Window size in milliseconds
}

// In-memory rate limiting store (keyed by IP/identifier + route prefix)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    });
  }, 60000);
}

/**
 * Extract client IP safely from request headers
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Can contain multiple IPs: "client, proxy1, proxy2"
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Common preset configurations
 */
export const RATE_LIMIT_PRESETS = {
  // Strictest: Authentication & Signups (Prevents credential brute-force)
  AUTH: { maxRequests: 10, windowMs: 60 * 1000 },

  // Strict: AI / Resource-Intensive endpoints (Protects against runaway AI bills)
  AI_HEAVY: { maxRequests: 10, windowMs: 60 * 1000 },

  // Moderate: State Mutations (Creating products, placing orders)
  WRITE: { maxRequests: 25, windowMs: 60 * 1000 },

  // Standard: Read queries (Catalog list, inquiries, db status)
  READ: { maxRequests: 100, windowMs: 60 * 1000 },
};

/**
 * Rate limit checker for Next.js App Router API routes
 * Returns null if allowed, or a 429 NextResponse if rate limit exceeded
 */
export function applyRateLimit(
  req: Request,
  category: keyof typeof RATE_LIMIT_PRESETS = "READ",
  customKey?: string
): NextResponse | null {
  const config: RateLimitConfig = RATE_LIMIT_PRESETS[category] || RATE_LIMIT_PRESETS.READ;
  const ip = getClientIp(req);
  const key = `${category}:${customKey || ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return null;
  }

  // Existing window
  record.count += 1;

  if (record.count > config.maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded. Please wait a moment before sending more requests to protect store resources.",
        retryAfter: `${retryAfterSec}s`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(record.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}
