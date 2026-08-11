import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, verifyOrigin, requireAdmin } from '@/lib/api-guard'
import { filterAllowedFields } from '@/lib/security'
import { productSchema } from '@/lib/validations'

// GET /api/products — Liste des produits avec filtres et pagination
export async function GET(request: NextRequest) {
    try {
        verifyOrigin(request)
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const storeId = searchParams.get('storeId')
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))

        const result = await db.getProducts(category, search, storeId, page, limit)
        return secureApiResponse({ success: true, ...result })
    } catch (error) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}

// POST /api/products — Créer un produit (admin uniquement)
export async function POST(request: NextRequest) {
    const authError = await requireAdmin(request)
    if (authError) return authError

    try {
        verifyOrigin(request)
        const body = await request.json()

        // ✅ Validation Zod
        const parsed = productSchema.safeParse({
            ...body,
            price: parseFloat(body.price),
            mrp: body.mrp ? parseFloat(body.mrp) : undefined,
        })

        if (!parsed.success) {
            return secureApiResponse({
                success: false,
                message: parsed.error.issues[0]?.message || 'Données invalides.',
                errors: parsed.error.flatten().fieldErrors,
            }, 400)
        }

        // ✅ Filtrage des champs autorisés (prévention Mass Assignment)
        const allowedFields = ['name', 'description', 'price', 'mrp', 'images', 'category', 'storeId', 'inStock']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        const price = parseFloat(sanitizedBody.price)
        const mrp = parseFloat(sanitizedBody.mrp)

        if (isNaN(price) || price <= 0) {
            return secureApiResponse({ success: false, message: "Champ 'price' invalide." }, 400)
        }
        if (!isNaN(mrp) && mrp < price) {
            return secureApiResponse({ success: false, message: "Le MRP doit être >= au prix." }, 400)
        }

        if (!sanitizedBody.storeId) {
            return secureApiResponse({ success: false, message: "storeId requis." }, 400)
        }

        const product = await db.addProduct({
            ...sanitizedBody,
            price,
            mrp: isNaN(mrp) ? price : mrp,
            store: { connect: { id: sanitizedBody.storeId } },
        })

        return secureApiResponse({ success: true, product }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
