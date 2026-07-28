import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let redisClient: Redis | null = null;
let rateLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  rateLimiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds per IP
    analytics: true,
    prefix: 'ratelimit:auth',
  });
}

export const redis = redisClient;

export async function checkRateLimit(identifier: string): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!rateLimiter) {
    // Graceful fallback for local development if Upstash env vars are not set
    return { success: true };
  }

  try {
    const result = await rateLimiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    return { success: true }; // Fail-open in case Redis is temporarily down
  }
}
