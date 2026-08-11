import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin, requireAuth } from '@/lib/api-guard'

// GET /api/stores/[id] — Détail d'une boutique
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const store = await db.getStoreById(id)

        if (!store) {
            return secureApiResponse({ success: false, message: 'Boutique introuvable.' }, 404)
        }

        return secureApiResponse({ success: true, store })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}

// PUT /api/stores/[id] — Modifier une boutique (propriétaire ou admin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const { id } = await params
        const body = await request.json()

        const store = await db.getStoreById(id)
        if (!store) {
            return secureApiResponse({ success: false, message: 'Boutique introuvable.' }, 404)
        }

        // 🔐 Seul le propriétaire ou un admin peut modifier
        const isOwner = store.userId === session.user.id
        const isAdmin = session.user.role === 'admin'

        if (!isOwner && !isAdmin) {
            return secureApiResponse({ success: false, message: 'Accès non autorisé.' }, 403)
        }

        // Admin peut modifier le statut aussi
        const allowedFields = isAdmin
            ? ['name', 'description', 'email', 'contact', 'address', 'logo', 'status', 'isActive']
            : ['name', 'description', 'email', 'contact', 'address', 'logo']

        const { filterAllowedFields } = await import('@/lib/security')
        const sanitized = filterAllowedFields(body, allowedFields)

        const updated = await db.updateStore(id, sanitized)
        return secureApiResponse({ success: true, store: updated })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// DELETE /api/stores/[id] — Supprimer une boutique (admin uniquement)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const { id } = await params

        const store = await db.getStoreById(id)
        if (!store) {
            return secureApiResponse({ success: false, message: 'Boutique introuvable.' }, 404)
        }

        await db.deleteStore(id)
        return secureApiResponse({ success: true, message: 'Boutique supprimée avec succès.' })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
