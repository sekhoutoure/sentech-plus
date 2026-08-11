import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, verifyOrigin } from '@/lib/api-guard'

// GET /api/products/[id] — Fiche produit publique
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        verifyOrigin(request)
        const { id } = await params

        if (!id || typeof id !== 'string') {
            return secureApiResponse({ success: false, message: 'ID produit invalide.' }, 400)
        }

        const product = await db.getProductById(id)

        if (!product) {
            return secureApiResponse({ success: false, message: 'Produit introuvable.' }, 404)
        }

        return secureApiResponse({ success: true, product })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}

// PUT /api/products/[id] — Modifier un produit (admin)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { requireAdmin } = await import('@/lib/api-guard')
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const { id } = await params
        const body = await request.json()

        const { filterAllowedFields } = await import('@/lib/security')
        const allowedFields = ['name', 'description', 'price', 'mrp', 'images', 'category', 'inStock']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        // Valider les prix si fournis
        if (sanitizedBody.price !== undefined) {
            const price = parseFloat(sanitizedBody.price)
            if (isNaN(price) || price <= 0) {
                return secureApiResponse({ success: false, message: "Champ 'price' invalide." }, 400)
            }
            sanitizedBody.price = price
        }
        if (sanitizedBody.mrp !== undefined) {
            const mrp = parseFloat(sanitizedBody.mrp)
            if (isNaN(mrp)) {
                return secureApiResponse({ success: false, message: "Champ 'mrp' invalide." }, 400)
            }
            sanitizedBody.mrp = mrp
        }

        const existing = await db.getProductById(id)
        if (!existing) {
            return secureApiResponse({ success: false, message: 'Produit introuvable.' }, 404)
        }

        const updated = await db.updateProduct(id, sanitizedBody)
        return secureApiResponse({ success: true, product: updated })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}

// DELETE /api/products/[id] — Supprimer un produit (admin)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { requireAdmin } = await import('@/lib/api-guard')
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        const { id } = await params

        const existing = await db.getProductById(id)
        if (!existing) {
            return secureApiResponse({ success: false, message: 'Produit introuvable.' }, 404)
        }

        await db.deleteProduct(id)
        return secureApiResponse({ success: true, message: 'Produit supprimé avec succès.' })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
