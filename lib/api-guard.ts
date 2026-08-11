import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { auth } from '@/auth'

// ============================================================
// ✅ api-guard.ts — Sécurité centralisée des routes API
// - Rate Limiting Redis multi-instance (Upstash)
// - Auth admin via session NextAuth v5
// - Auth utilisateur via session NextAuth v5
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

  if (!url || !token) return null

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

  if (!limiter) return null

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
 * ✅ Vérifie que l'utilisateur est authentifié via session NextAuth.
 * Retourne la session si valide, null sinon (avec réponse 401).
 */
export const requireAuth = async (): Promise<{ session: any; error: NextResponse | null }> => {
  const session = await auth()

  if (!session || !session.user?.id) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: 'Authentification requise.' },
        { status: 401 }
      ),
    }
  }

  return { session, error: null }
}

/**
 * ✅ Vérifie que l'utilisateur est admin via session NextAuth.
 * Remplace l'ancienne vérification par x-admin-key (insécurisée).
 * Retourne la session si admin, null sinon (avec réponse 401/403).
 */
export const requireAdmin = async (request?: NextRequest): Promise<NextResponse | null> => {
  // Compatibilité rétrograde : si une clé admin est fournie ET configurée (CI/CD, webhooks internes)
  if (request) {
    const adminKey = request.headers.get('x-admin-key')
    const expectedKey = process.env.ADMIN_SECRET_KEY
    if (adminKey && expectedKey && adminKey === expectedKey) {
      return null // Autorisé via clé interne
    }
  }

  // Vérification principale : session NextAuth
  const session = await auth()

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, message: 'Authentification requise.' },
      { status: 401 }
    )
  }

  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Accès réservé aux administrateurs.' },
      { status: 403 }
    )
  }

  return null
}

/**
 * ✅ Récupère la session admin complète (après vérification).
 */
export const getAdminSession = async () => {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'admin') return null
  return session
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
  if (process.env.NODE_ENV !== 'production') {
    console.log(JSON.stringify(event))
  }
}
