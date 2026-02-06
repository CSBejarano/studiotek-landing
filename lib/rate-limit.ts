import { NextRequest } from 'next/server';

// ============================================================================
// In-Memory Rate Limiter (Sliding Window)
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries (every 60s)
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now >= entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 60_000);
  // Allow process to exit without waiting for this interval
  if (cleanupInterval && typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
    cleanupInterval.unref();
  }
}

startCleanup();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given IP address.
 * @param ip - Client IP address
 * @param limit - Maximum number of requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 */
export function rateLimit(ip: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // No existing entry or window expired - create new window
  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitMap.set(ip, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  // Within window - increment count
  entry.count += 1;

  if (entry.count > limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract client IP from a NextRequest.
 * Checks x-forwarded-for, x-real-ip, and falls back to '127.0.0.1'.
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  return '127.0.0.1';
}
