'use server'

/**
 * In-memory rate limiter for server actions.
 * 
 * Sliding window approach using a Map. Suitable for single-instance
 * deployments (o2switch). For multi-instance, migrate to Redis.
 * 
 * SECURITY: This module is server-only ('use server' directive).
 */

type RateLimitCategory = 'auth' | 'checkout' | 'upload' | 'admin' | 'newsletter'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

interface RateLimitEntry {
  count: number
  firstRequestAt: number
}

const RATE_LIMITS: Record<RateLimitCategory, RateLimitConfig> = {
  auth:       { windowMs: 15 * 60 * 1000, maxRequests: 10  },  // 10 req / 15 min
  checkout:   { windowMs: 5  * 60 * 1000, maxRequests: 5   },  // 5 req / 5 min
  upload:     { windowMs: 5  * 60 * 1000, maxRequests: 15  },  // 15 req / 5 min
  admin:      { windowMs: 5  * 60 * 1000, maxRequests: 30  },  // 30 req / 5 min
  newsletter: { windowMs: 60 * 60 * 1000, maxRequests: 3   },  // 3 req / 1h
}

// Global in-memory store — survives HMR in dev but resets on full restart
const store = new Map<string, RateLimitEntry>()

// Periodic cleanup to prevent memory leaks (every 10 minutes)
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 10 * 60 * 1000

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const maxWindowMs = Math.max(...Object.values(RATE_LIMITS).map(r => r.windowMs))
  for (const [key, entry] of store.entries()) {
    if (now - entry.firstRequestAt > maxWindowMs) {
      store.delete(key)
    }
  }
}

/**
 * Check if a request is within the rate limit.
 * 
 * @param identifier - Unique key for the requester (user ID, email, or IP hash)
 * @param category - Rate limit category to apply
 * @returns Object with `allowed` boolean and optional `retryAfterMs`
 * 
 * @example
 * ```ts
 * const limit = await checkRateLimit(user.id, 'auth')
 * if (!limit.allowed) {
 *   return { error: 'Trop de tentatives. Réessayez plus tard.' }
 * }
 * ```
 */
export async function checkRateLimit(
  identifier: string,
  category: RateLimitCategory
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  cleanup()

  const config = RATE_LIMITS[category]
  const key = `${category}:${identifier}`
  const now = Date.now()
  const entry = store.get(key)

  // No previous requests — allow and start tracking
  if (!entry) {
    store.set(key, { count: 1, firstRequestAt: now })
    return { allowed: true }
  }

  // Window has expired — reset
  if (now - entry.firstRequestAt > config.windowMs) {
    store.set(key, { count: 1, firstRequestAt: now })
    return { allowed: true }
  }

  // Within window — check count
  if (entry.count >= config.maxRequests) {
    const retryAfterMs = config.windowMs - (now - entry.firstRequestAt)
    return { allowed: false, retryAfterMs }
  }

  // Within limits — increment
  entry.count++
  return { allowed: true }
}
