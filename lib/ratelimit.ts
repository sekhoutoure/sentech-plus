import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Upstash Redis Rate Limiter: 10 requests per 1 minute (60s)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

let authRateLimiter: Ratelimit | null = null

if (redisUrl && redisToken) {
  try {
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    authRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: true,
      prefix: 'sentech-plus-auth-limit',
    })
  } catch (e) {
    console.warn('Upstash Redis RateLimiter initialization warning:', e)
  }
}

export async function checkAuthRateLimit(identifier: string) {
  if (!authRateLimiter) {
    return { success: true, remaining: 10, limit: 10, reset: 0 }
  }

  try {
    const result = await authRateLimiter.limit(identifier)
    return result
  } catch (err) {
    console.error('Rate limit error:', err)
    return { success: true, remaining: 10, limit: 10, reset: 0 }
  }
}
