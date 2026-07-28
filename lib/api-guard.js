import { NextResponse } from 'next/server';

/**
 * ✅ Middleware d'authentification Admin.
 * Vérifie le header `x-admin-key` de la requête.
 * Retourne une réponse 401 si la clé est absente ou incorrecte.
 * 
 * Utilisation dans une route :
 *   const authError = requireAdmin(request)
 *   if (authError) return authError
 */
export const requireAdmin = (request) => {
    const adminKey = request.headers.get('x-admin-key');
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    if (!expectedKey) {
        console.error('[SECURITY] ADMIN_SECRET_KEY non définie dans .env.local !');
        return NextResponse.json(
            { success: false, message: 'Configuration serveur incorrecte' },
            { status: 500 }
        );
    }

    if (!adminKey || adminKey !== expectedKey) {
        return NextResponse.json(
            { success: false, message: 'Accès non autorisé. Clé admin invalide.' },
            { status: 401 }
        );
    }

    // Clé valide : null signifie "aucune erreur, continuer"
    return null;
};

/**
 * ✅ Nettoie récursivement un objet pour retirer les clés sensibles.
 * Empêche que des données comme "password" ou "token" transitent vers le client.
 */
export const stripSensitiveInfo = (data) => {
    if (!data) return data;

    if (Array.isArray(data)) {
        return data.map(stripSensitiveInfo);
    }

    if (typeof data === 'object' && data !== null) {
        const cleanObj = {};
        const sensitiveKeys = ['password', 'token', 'secret', 'hash', 'salt', 'key'];

        for (const [key, value] of Object.entries(data)) {
            if (!sensitiveKeys.includes(key.toLowerCase())) {
                cleanObj[key] = stripSensitiveInfo(value);
            }
        }
        return cleanObj;
    }

    return data;
};

/**
 * ✅ Wrapper sécurisé pour toutes les réponses API.
 * Assainit les données sensibles et ajoute les en-têtes de sécurité standards.
 */
export const secureApiResponse = (data, status = 200) => {
    const sanitizedData = stripSensitiveInfo(data);

    return NextResponse.json(sanitizedData, {
        status,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
        }
    });
};

/**
 * ✅ Vérifie l'origine de la requête (actif uniquement en production).
 * En dev local, toutes les origines sont autorisées (Postman, tests, etc.).
 */
export const verifyOrigin = (request) => {
    if (process.env.NODE_ENV !== 'production') return true;

    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    if (origin || referer) {
        const source = origin || referer;
        try {
            const parsedUrl = new URL(source);
            const isAllowed = parsedUrl.host === host || parsedUrl.hostname === 'localhost';
            if (!isAllowed) {
                throw new Error(`Origine non autorisée: ${source}`);
            }
        } catch (e) {
            throw new Error(`URL malformée ou origine non autorisée: ${source}`);
        }
    }

    return true;
};

/**
 * ✅ Limiteur de requêtes en mémoire (Rate Limiting).
 */
const rateLimitMap = new Map();

export const rateLimit = (request) => {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown-ip';
    const method = request.method;
    
    const limit = method === 'GET' ? 100 : 20;
    const windowMs = 60 * 1000;
    
    const key = `${ip}-${method}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > entry.resetTime) {
        entry.count = 1;
        entry.resetTime = now + windowMs;
    } else {
        entry.count++;
    }
    
    rateLimitMap.set(key, entry);
    
    if (entry.count > limit) {
        return NextResponse.json(
            { success: false, message: 'Too Many Requests' },
            { status: 429, headers: { 'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString() } }
        );
    }
    
    return null;
};

/**
 * ✅ Log d'audit des actions de sécurité.
 */
export const logAuditEvent = (action, details) => {
    const event = {
        timestamp: new Date().toISOString(),
        action,
        ...details
    };
    console.log(JSON.stringify(event));
};
