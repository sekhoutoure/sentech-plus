import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin, requireAuth } from '@/lib/api-guard'
import { z } from 'zod'

const ratingSchema = z.object({
    rating: z.number().int().min(1).max(5),
    review: z.string().min(5, 'L\'avis doit contenir au moins 5 caractères.').max(1000),
    productId: z.string().min(1),
    orderId: z.string().min(1),
})

// GET /api/ratings?productId=... — Avis d'un produit (public)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
        return secureApiResponse({ success: false, message: 'productId requis.' }, 400)
    }

    try {
        const ratings = await db.getRatingsByProduct(productId)
        return secureApiResponse({ success: true, ratings })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}

// POST /api/ratings — Soumettre un avis (utilisateur connecté)
export async function POST(request: NextRequest) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const body = await request.json()

        const parsed = ratingSchema.safeParse(body)
        if (!parsed.success) {
            return secureApiResponse({
                success: false,
                message: parsed.error.issues[0]?.message || 'Données invalides.',
                errors: parsed.error.flatten().fieldErrors,
            }, 400)
        }

        const { rating, review, productId, orderId } = parsed.data

        // Vérifier que le produit existe
        const product = await db.getProductById(productId)
        if (!product) {
            return secureApiResponse({ success: false, message: 'Produit introuvable.' }, 404)
        }

        const newRating = await db.addRating({
            rating,
            review,
            productId,
            orderId,
            userId: session.user.id, // Depuis la session
        })

        return secureApiResponse({ success: true, rating: newRating }, 201)
    } catch (error: any) {
        if (error.code === 'P2002') {
            return secureApiResponse({ success: false, message: 'Vous avez déjà laissé un avis pour ce produit.' }, 409)
        }
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
