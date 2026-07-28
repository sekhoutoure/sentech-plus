import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"
import { filterAllowedFields } from "@/lib/security"

export async function GET(request, { params }) {
    const { id } = await params
    const product = db.getProductById(id)
    if (!product) {
        return secureApiResponse({ success: false, message: "Produit non trouvé" }, 404)
    }
    return secureApiResponse({ success: true, product })
}

export async function PUT(request, { params }) {
    // 🔐 Vérification de l'authentification admin
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        const { id } = await params
        const body = await request.json()

        // ✅ Filtrage strict des champs autorisés
        const allowedFields = ['name', 'description', 'price', 'mrp', 'images', 'category', 'storeId', 'inStock']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        const updated = db.updateProduct(id, sanitizedBody)
        if (!updated) {
            return secureApiResponse({ success: false, message: "Produit non trouvé" }, 404)
        }
        return secureApiResponse({ success: true, product: updated })
    } catch (error) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

export async function DELETE(request, { params }) {
    // 🔐 Vérification de l'authentification admin
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    const deleted = db.deleteProduct(id)
    if (!deleted) {
        return secureApiResponse({ success: false, message: "Produit non trouvé" }, 404)
    }
    return secureApiResponse({ success: true, message: "Produit supprimé avec succès" })
}
