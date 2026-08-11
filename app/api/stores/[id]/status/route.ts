import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin } from '@/lib/api-guard'

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'suspended']

// PUT /api/stores/[id]/status — Changer le statut d'une boutique (admin)
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

        const store = await db.getStoreById(id)
        if (!store) {
            return secureApiResponse({ success: false, message: 'Boutique introuvable.' }, 404)
        }

        const updated = await db.updateStoreStatus(id, status)
        return secureApiResponse({ success: true, store: updated })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
