import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAuth } from '@/lib/api-guard'

// DELETE /api/addresses/[id] — Supprimer une adresse (propriétaire uniquement)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const { id } = await params

        const address = await db.getAddressById(id)
        if (!address) {
            return secureApiResponse({ success: false, message: 'Adresse introuvable.' }, 404)
        }

        // 🔐 Seul le propriétaire peut supprimer son adresse
        if (address.userId !== session.user.id) {
            return secureApiResponse({ success: false, message: 'Accès non autorisé.' }, 403)
        }

        await db.deleteAddress(id)
        return secureApiResponse({ success: true, message: 'Adresse supprimée.' })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// GET /api/addresses/[id] — Récupérer une adresse spécifique (propriétaire)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const { id } = await params

        const address = await db.getAddressById(id)
        if (!address) {
            return secureApiResponse({ success: false, message: 'Adresse introuvable.' }, 404)
        }

        if (address.userId !== session.user.id && session.user.role !== 'admin') {
            return secureApiResponse({ success: false, message: 'Accès non autorisé.' }, 403)
        }

        return secureApiResponse({ success: true, address })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}
