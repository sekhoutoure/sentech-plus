import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAdmin, requireAuth } from '@/lib/api-guard'
import { storeSchema } from '@/lib/validations'

// GET /api/stores — Liste des boutiques
// Admin : toutes. Utilisateur : sa boutique seulement.
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

    // Vérifier admin
    const adminError = await requireAdmin(request)

    if (adminError) {
        // Pas admin → vérifier si utilisateur connecté souhaitant voir sa boutique
        const { session, error: authError } = await requireAuth()
        if (authError) return authError

        const store = await db.getStoreByUserId(session.user.id)
        return secureApiResponse({ success: true, store: store || null })
    }

    // Admin : toutes les boutiques paginées
    const result = await db.getStores(page, limit)
    return secureApiResponse({ success: true, ...result })
}

// POST /api/stores — Créer une boutique (utilisateur connecté)
export async function POST(request: NextRequest) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const body = await request.json()

        // Validation Zod
        const parsed = storeSchema.safeParse(body)
        if (!parsed.success) {
            return secureApiResponse({
                success: false,
                message: parsed.error.issues[0]?.message || 'Données invalides.',
                errors: parsed.error.flatten().fieldErrors,
            }, 400)
        }

        // Vérifier si l'utilisateur a déjà une boutique
        const existing = await db.getStoreByUserId(session.user.id)
        if (existing) {
            return secureApiResponse({ success: false, message: 'Vous avez déjà une boutique.' }, 409)
        }

        const { name, username, description, email, contact, address } = parsed.data
        const logo = body.logo || ''

        const store = await db.createStore({
            name,
            username,
            description,
            email,
            contact,
            address,
            logo,
            user: { connect: { id: session.user.id } },
        })

        return secureApiResponse({ success: true, store }, 201)
    } catch (error: any) {
        if (error.code === 'P2002') {
            return secureApiResponse({ success: false, message: 'Ce nom d\'utilisateur de boutique est déjà pris.' }, 409)
        }
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
