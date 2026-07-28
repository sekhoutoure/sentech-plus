import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin, rateLimit, logAuditEvent } from "@/lib/api-guard"

export async function GET(request: NextRequest) {
    // 🔐 La liste complète des coupons est réservée aux admins
    const authError = requireAdmin(request)
    if (authError) return authError

    const coupons = await db.getCoupons()
    return secureApiResponse({ success: true, coupons })
}

// POST public : valider un code promo
export async function POST(request: NextRequest) {
    const rateLimitError = await rateLimit(request);
    if (rateLimitError) {
        logAuditEvent('RATE_LIMIT_EXCEEDED', { endpoint: '/api/coupons', method: 'POST' });
        return rateLimitError;
    }

    try {
        const { code } = await request.json()
        logAuditEvent('COUPON_VALIDATION_ATTEMPT', { code });

        if (!code || typeof code !== 'string' || code.trim().length === 0) {
            return secureApiResponse({ success: false, message: "Code promo requis" }, 400)
        }

        const sanitizedCode = code.trim().toUpperCase()
        const coupon = await db.validateCoupon(sanitizedCode)

        if (!coupon) {
            return secureApiResponse({ success: false, message: "Code promo invalide ou expiré" }, 404)
        }

        return secureApiResponse({
            success: true,
            coupon: {
                code: coupon.code,
                discount: coupon.discount,
                description: coupon.description
            }
        })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// PUT admin : créer un nouveau coupon
export async function PUT(request: NextRequest) {
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        const body = await request.json()
        const { code, discount, description, forNewUser, forMember, expiresAt } = body

        if (!code || !discount) {
            return secureApiResponse({ success: false, message: "code et discount sont requis" }, 400)
        }
        if (Number(discount) < 1 || Number(discount) > 100) {
            return secureApiResponse({ success: false, message: "discount doit être entre 1 et 100" }, 400)
        }

        const coupon = await db.addCoupon({
            code: String(code).toUpperCase().trim(),
            discount: Number(discount),
            description: description || '',
            forNewUser: !!forNewUser,
            forMember: !!forMember,
            isPublic: true,
            expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
        })
        return secureApiResponse({ success: true, coupon }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// DELETE admin : supprimer un coupon par code
export async function DELETE(request: NextRequest) {
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        const { code } = await request.json()
        if (!code) {
            return secureApiResponse({ success: false, message: "code requis" }, 400)
        }
        const deleted = await db.deleteCoupon(code)
        if (!deleted) {
            return secureApiResponse({ success: false, message: "Coupon introuvable" }, 404)
        }
        return secureApiResponse({ success: true, message: `Coupon ${code} supprimé` })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
