import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin, requireAuth } from '@/lib/api-guard'

const VALID_STATUSES = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

// GET /api/orders/[id] — Détail d'une commande
// Accessible par le propriétaire de la commande ou un admin
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const { id } = await params
        const order = await db.getOrderById(id)

        if (!order) {
            return secureApiResponse({ success: false, message: 'Commande introuvable.' }, 404)
        }

        // 🔐 Seul le propriétaire ou un admin peut voir la commande
        const isOwner = order.userId === session.user.id
        const isAdmin = session.user.role === 'admin'

        if (!isOwner && !isAdmin) {
            return secureApiResponse({ success: false, message: 'Accès non autorisé.' }, 403)
        }

        return secureApiResponse({ success: true, order })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// PUT /api/orders/[id] — Modifier le statut (admin uniquement)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const { id } = await params
        const { status } = await request.json()

        if (!status || !VALID_STATUSES.includes(status)) {
            return secureApiResponse({
                success: false,
                message: `Statut invalide. Valeurs acceptées: ${VALID_STATUSES.join(', ')}`,
            }, 400)
        }

        const order = await db.getOrderById(id)
        if (!order) {
            return secureApiResponse({ success: false, message: 'Commande introuvable.' }, 404)
        }

        const updatedOrder = await db.updateOrderStatus(id, status)
        return secureApiResponse({ success: true, order: updatedOrder })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
