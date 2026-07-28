import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, verifyOrigin, requireAdmin } from "@/lib/api-guard"
import { filterAllowedFields } from "@/lib/security"

export async function GET(request: NextRequest) {
    try {
        verifyOrigin(request);
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        const products = await db.getProducts(category, search)
        return secureApiResponse({ success: true, products })
    } catch (error) {
        return secureApiResponse({ success: false, message: "Erreur serveur" }, 500)
    }
}

export async function POST(request: NextRequest) {
    // 🔐 Vérification de l'authentification admin
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        verifyOrigin(request);
        const body = await request.json()

        // ✅ Filtrage strict des champs autorisés (prévention Mass Assignment)
        const allowedFields = ['name', 'description', 'price', 'mrp', 'images', 'category', 'storeId', 'inStock']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        // ✅ Validation des types critiques
        if (!sanitizedBody.name || typeof sanitizedBody.name !== 'string') {
            return secureApiResponse({ success: false, message: "Champ 'name' requis et doit être une chaîne" }, 400)
        }
        const price = parseFloat(sanitizedBody.price)
        const mrp = parseFloat(sanitizedBody.mrp)
        if (isNaN(price) || price <= 0) {
            return secureApiResponse({ success: false, message: "Champ 'price' invalide" }, 400)
        }
        if (isNaN(mrp) || mrp < price) {
            return secureApiResponse({ success: false, message: "Champ 'mrp' invalide (doit être >= price)" }, 400)
        }

        const product = await db.addProduct({ ...sanitizedBody, price, mrp })
        return secureApiResponse({ success: true, product }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
