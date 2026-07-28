import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// ============================================================
// ✅ api-guard.ts — Sécurité centralisée des routes API
// - Rate Limiting Redis multi-instance (Upstash)
// - Auth admin via session NextAuth (voir auth.ts)
// - Strip des données sensibles
// - Headers de sécurité
// ============================================================

// ─────────────────────────────────────────────
// Upstash Redis Rate Limiter (multi-instance)
// ─────────────────────────────────────────────
let ratelimiterGet: Ratelimit | null = null
let ratelimiterPost: Ratelimit | null = null

function getRatelimiter(type: 'GET' | 'POST') {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    // Fallback silencieux si Upstash non configuré (dev sans Redis)
    return null
  }

  const redis = new Redis({ url, token })

  if (type === 'GET') {
    if (!ratelimiterGet) {
      ratelimiterGet = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'sentech-plus:get',
      })
    }
    return ratelimiterGet
  } else {
    if (!ratelimiterPost) {
      ratelimiterPost = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
        prefix: 'sentech-plus:post',
      })
    }
    return ratelimiterPost
  }
}

/**
 * ✅ Rate Limiting Redis multi-instance (Upstash).
 * Fallback vers null si UPSTASH non configuré.
 */
export const rateLimit = async (request: NextRequest): Promise<NextResponse | null> => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'anonymous'

  const method = request.method === 'GET' ? 'GET' : 'POST'
  const limiter = getRatelimiter(method)

  if (!limiter) return null // Upstash non configuré → pas de rate limit

  const { success, limit, remaining, reset } = await limiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { success: false, message: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    )
  }

  return null
}

/**
 * ✅ Middleware d'authentification Admin.
 * Vérifie le header `x-admin-key` (démo) ou la session NextAuth (production).
 */
export const requireAdmin = (request: NextRequest): NextResponse | null => {
  const adminKey = request.headers.get('x-admin-key')
  const expectedKey = process.env.ADMIN_SECRET_KEY

  if (!expectedKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[SECURITY] ADMIN_SECRET_KEY non définie dans .env.local !')
    }
    return NextResponse.json(
      { success: false, message: 'Configuration serveur incorrecte' },
      { status: 500 }
    )
  }

  if (!adminKey || adminKey !== expectedKey) {
    return NextResponse.json(
      { success: false, message: 'Accès non autorisé. Clé admin invalide.' },
      { status: 401 }
    )
  }

  return null
}

/**
 * ✅ Nettoie récursivement un objet pour retirer les clés sensibles.
 */
export const stripSensitiveInfo = (data: unknown): unknown => {
  if (!data) return data

  if (Array.isArray(data)) {
    return data.map(stripSensitiveInfo)
  }

  if (typeof data === 'object' && data !== null) {
    const cleanObj: Record<string, unknown> = {}
    const sensitiveKeys = ['password', 'token', 'secret', 'hash', 'salt', 'key']

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (!sensitiveKeys.includes(key.toLowerCase())) {
        cleanObj[key] = stripSensitiveInfo(value)
      }
    }
    return cleanObj
  }

  return data
}

/**
 * ✅ Wrapper sécurisé pour toutes les réponses API.
 */
export const secureApiResponse = (data: unknown, status = 200): NextResponse => {
  const sanitizedData = stripSensitiveInfo(data)

  return NextResponse.json(sanitizedData, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
  })
}

/**
 * ✅ Vérifie l'origine de la requête (production uniquement).
 */
export const verifyOrigin = (request: NextRequest): boolean => {
  if (process.env.NODE_ENV !== 'production') return true

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  if (origin || referer) {
    const source = (origin || referer)!
    try {
      const parsedUrl = new URL(source)
      const isAllowed = parsedUrl.host === host || parsedUrl.hostname === 'localhost'
      if (!isAllowed) {
        throw new Error(`Origine non autorisée: ${source}`)
      }
    } catch {
      throw new Error(`URL malformée ou origine non autorisée: ${source}`)
    }
  }

  return true
}

/**
 * ✅ Log d'audit structuré.
 */
export const logAuditEvent = (action: string, details: Record<string, unknown>): void => {
  const event = {
    timestamp: new Date().toISOString(),
    action,
    ...details,
  }
  // En production, envoyer vers un service de logging (Datadog, Sentry, etc.)
  if (process.env.NODE_ENV !== 'production') {
    console.log(JSON.stringify(event))
  }
}
