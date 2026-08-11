import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin } from '@/lib/api-guard'

// DELETE /api/coupons/[code] — Supprimer un coupon (admin)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const { code } = await params

        if (!code || code.trim() === '') {
            return secureApiResponse({ success: false, message: 'Code coupon invalide.' }, 400)
        }

        await db.deleteCoupon(code)
        return secureApiResponse({ success: true, message: `Coupon "${code.toUpperCase()}" supprimé.` })
    } catch (error: any) {
        if (error.code === 'P2025') {
            return secureApiResponse({ success: false, message: 'Coupon introuvable.' }, 404)
        }
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// GET /api/coupons/[code] — Valider un coupon (public — utilisé au checkout)
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params

        if (!code || code.trim() === '') {
            return secureApiResponse({ success: false, message: 'Code coupon invalide.' }, 400)
        }

        const coupon = await db.validateCoupon(code)

        if (!coupon) {
            return secureApiResponse({ success: false, message: 'Coupon invalide ou expiré.' }, 404)
        }

        // Ne retourner que les infos utiles au frontend (pas createdAt etc.)
        return secureApiResponse({
            success: true,
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discount: coupon.discount,
                forNewUser: coupon.forNewUser,
                forMember: coupon.forMember,
                expiresAt: coupon.expiresAt,
            },
        })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}
