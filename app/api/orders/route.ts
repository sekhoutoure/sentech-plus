import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin, requireAuth } from '@/lib/api-guard'
import { filterAllowedFields } from '@/lib/security'
import { z } from 'zod'

const orderSchema = z.object({
    storeId: z.string().min(1, 'storeId requis.'),
    addressId: z.string().min(1, 'addressId requis.'),
    paymentMethod: z.enum(['COD', 'STRIPE']),
    isCouponUsed: z.boolean().optional().default(false),
    coupon: z.object({ code: z.string() }).optional(),
    orderItems: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
    })).min(1, 'La commande doit contenir au moins un article.'),
})

// GET /api/orders — Liste des commandes
// - Admin : toutes les commandes (paginées)
// - Utilisateur connecté : ses propres commandes
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

    // 🔐 Vérification de la session
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    const isAdmin = session.user.role === 'admin'

    if (isAdmin) {
        // Admin → toutes les commandes
        const result = await db.getOrders(page, limit)
        return secureApiResponse({ success: true, ...result })
    } else {
        // Utilisateur → seulement ses commandes
        const result = await db.getOrdersByUserId(session.user.id, page, limit)
        return secureApiResponse({ success: true, ...result })
    }
}

// POST /api/orders — Créer une commande (utilisateur connecté)
export async function POST(request: NextRequest) {
    // 🔐 L'utilisateur doit être authentifié
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const body = await request.json()

        // ✅ Validation Zod
        const parsed = orderSchema.safeParse(body)
        if (!parsed.success) {
            return secureApiResponse({
                success: false,
                message: parsed.error.issues[0]?.message || 'Données invalides.',
                errors: parsed.error.flatten().fieldErrors,
            }, 400)
        }

        const { storeId, addressId, paymentMethod, isCouponUsed, coupon, orderItems } = parsed.data

        // ✅ Vérifier que l'adresse appartient bien à l'utilisateur authentifié
        const address = await db.getAddressById(addressId)
        if (!address || address.userId !== session.user.id) {
            return secureApiResponse({ success: false, message: 'Adresse invalide ou non autorisée.' }, 403)
        }

        // ✅ Recalcul du total côté serveur (anti-manipulation de prix)
        let serverTotal = 0
        const resolvedItems: { productId: string; quantity: number; price: number }[] = []

        for (const item of orderItems) {
            const product = await db.getProductById(item.productId)
            if (!product) {
                return secureApiResponse({ success: false, message: `Produit introuvable: ${item.productId}` }, 400)
            }
            if (!product.inStock) {
                return secureApiResponse({ success: false, message: `Produit hors stock: ${product.name}` }, 400)
            }
            serverTotal += product.price * item.quantity
            resolvedItems.push({ productId: item.productId, quantity: item.quantity, price: product.price })
        }

        // ✅ Appliquer coupon si présent (vérifié côté serveur)
        let appliedCoupon: object | undefined
        if (isCouponUsed && coupon?.code) {
            const validCoupon = await db.validateCoupon(coupon.code)
            if (validCoupon) {
                serverTotal = serverTotal * (1 - validCoupon.discount / 100)
                appliedCoupon = { code: validCoupon.code, discount: validCoupon.discount }
            }
        }

        const order = await db.createOrder({
            userId: session.user.id, // Toujours depuis la session (pas depuis le body)
            storeId,
            addressId,
            paymentMethod,
            isCouponUsed: !!appliedCoupon,
            coupon: appliedCoupon,
            total: parseFloat(serverTotal.toFixed(2)),
            orderItems: resolvedItems,
        })

        return secureApiResponse({ success: true, order }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
