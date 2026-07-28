import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"

const VALID_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export async function PUT(request: NextRequest, { params }: any) {
    // 🔐 Seul un admin peut modifier le statut d'une commande
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        const { id } = await params
        const { status } = await request.json()

        // ✅ Validation de la valeur du statut
        if (!status || !VALID_STATUSES.includes(status)) {
            return secureApiResponse({
                success: false,
                message: `Statut invalide. Valeurs acceptées: ${VALID_STATUSES.join(', ')}`
            }, 400)
        }

        const updatedOrder = await db.updateOrderStatus(id, status)
        if (!updatedOrder) {
            return secureApiResponse({ success: false, message: "Commande non trouvée" }, 404)
        }
        return secureApiResponse({ success: true, order: updatedOrder })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
