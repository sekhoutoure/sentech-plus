import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin } from '@/lib/api-guard'
import { z } from 'zod'

const couponSchema = z.object({
    code: z.string().min(2).max(20).toUpperCase(),
    description: z.string().min(5, 'Description obligatoire.'),
    discount: z.number().min(1).max(100, 'La réduction doit être entre 1 et 100.'),
    forNewUser: z.boolean().default(false),
    forMember: z.boolean().default(false),
    isPublic: z.boolean().default(true),
    expiresAt: z.string().datetime({ message: 'Date d\'expiration invalide (ISO 8601 attendu).' }),
})

// GET /api/coupons — Liste des coupons (admin uniquement)
export async function GET(request: NextRequest) {
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const coupons = await db.getCoupons()
        return secureApiResponse({ success: true, coupons })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}

// POST /api/coupons — Créer un coupon (admin uniquement)
export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const body = await request.json()

        const parsed = couponSchema.safeParse(body)
        if (!parsed.success) {
            return secureApiResponse({
                success: false,
                message: parsed.error.issues[0]?.message || 'Données invalides.',
                errors: parsed.error.flatten().fieldErrors,
            }, 400)
        }

        const { expiresAt, ...rest } = parsed.data
        const coupon = await db.addCoupon({
            ...rest,
            expiresAt: new Date(expiresAt),
        })

        return secureApiResponse({ success: true, coupon }, 201)
    } catch (error: any) {
        // Conflit code unique
        if (error.code === 'P2002') {
            return secureApiResponse({ success: false, message: 'Ce code coupon existe déjà.' }, 409)
        }
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
