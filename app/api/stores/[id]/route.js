import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"

const VALID_STORE_STATUSES = ["pending", "approved", "rejected"]

export async function PUT(request, { params }) {
    const authError = requireAdmin(request)
    if (authError) return authError
    try {
        const { id } = await params
        const { status } = await request.json()
        if (!status || !VALID_STORE_STATUSES.includes(status)) {
            return secureApiResponse({ success: false, message: "Statut invalide. Valeurs: pending, approved, rejected" }, 400)
        }
        const store = db.updateStoreStatus(id, status)
        if (!store) return secureApiResponse({ success: false, message: "Boutique introuvable" }, 404)
        return secureApiResponse({ success: true, store })
    } catch (error) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

export async function DELETE(request, { params }) {
    const authError = requireAdmin(request)
    if (authError) return authError
    try {
        const { id } = await params
        const success = db.deleteStore(id)
        if (!success) {
            return secureApiResponse({ success: false, message: "Boutique introuvable" }, 404)
        }
        return secureApiResponse({ success: true, message: `Boutique ${id} supprimée` })
    } catch (error) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}