import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"

const VALID_STORE_STATUSES = ["pending", "approved", "rejected"]

export async function PUT(request: NextRequest, { params }: any) {
    const authError = requireAdmin(request)
    if (authError) return authError
    try {
        const { id } = await params
        const { status } = await request.json()
        if (!status || !VALID_STORE_STATUSES.includes(status)) {
            return secureApiResponse({ success: false, message: "Statut invalide. Valeurs: pending, approved, rejected" }, 400)
        }
        const store = await db.updateStoreStatus(id, status)
        if (!store) return secureApiResponse({ success: false, message: "Boutique introuvable" }, 404)
        return secureApiResponse({ success: true, store })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

export async function DELETE(request: NextRequest, { params }: any) {
    const authError = requireAdmin(request)
    if (authError) return authError
    try {
        const { id } = await params
        const success = await db.deleteStore(id)
        if (!success) {
            return secureApiResponse({ success: false, message: "Boutique introuvable" }, 404)
        }
        return secureApiResponse({ success: true, message: `Boutique ${id} supprimée` })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
