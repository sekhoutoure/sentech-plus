import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"
import { filterAllowedFields } from "@/lib/security"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
        // ⚠️ WARNING: DEMO ONLY! In production, verify the session token to ensure
        // the requested userId matches the currently authenticated user!
        if (typeof userId !== 'string' || userId.trim() === '') {
            return secureApiResponse({ success: false, message: "userId invalide" }, 400)
        }
        // ✅ Un utilisateur peut voir SES propres commandes sans clé admin
        const orders = await db.getOrdersByUserId(userId)
        return secureApiResponse({ success: true, orders })
    }

    // 🔐 Sans userId, la liste complète est réservée aux admins
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        const orders = await db.getOrders()
        return secureApiResponse({ success: true, orders })
    } catch (error) {
        return secureApiResponse({ success: false, message: "Erreur serveur" }, 500)
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // ✅ Filtrage des champs autorisés
        const allowedFields = ['userId', 'storeId', 'addressId', 'paymentMethod', 'isCouponUsed', 'coupon', 'orderItems']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        // ✅ Recalcul du total côté serveur (prévention de la manipulation de prix)
        // On vérifie chaque article via la base de données (le client ne peut pas tricher)
        let serverTotal = 0
        if (Array.isArray(sanitizedBody.orderItems) && sanitizedBody.orderItems.length > 0) {
            for (const item of sanitizedBody.orderItems) {
                const product = await db.getProductById(item.productId)
                if (!product) {
                    return secureApiResponse({ success: false, message: `Produit introuvable: ${item.productId}` }, 400)
                }
                const qty = parseInt(item.quantity)
                if (isNaN(qty) || qty <= 0) {
                    return secureApiResponse({ success: false, message: "Quantité invalide" }, 400)
                }
                serverTotal += product.price * qty
            }
        } else {
            return secureApiResponse({ success: false, message: "La commande doit contenir au moins un article" }, 400)
        }

        // Appliquer la réduction coupon si présente (vérifiée côté serveur)
        if (sanitizedBody.isCouponUsed && sanitizedBody.coupon?.code) {
            const validCoupon = await db.validateCoupon(sanitizedBody.coupon.code)
            if (validCoupon) {
                serverTotal = serverTotal * (1 - validCoupon.discount / 100)
            }
        }

        const order = await db.createOrder({ ...sanitizedBody, total: parseFloat(serverTotal.toFixed(2)) })
        return secureApiResponse({ success: true, order }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
