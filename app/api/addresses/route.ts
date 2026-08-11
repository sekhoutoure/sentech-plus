import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { secureApiResponse, requireAuth } from '@/lib/api-guard'
import { addressSchema } from '@/lib/validations'

// GET /api/addresses — Adresses de l'utilisateur connecté
export async function GET(request: NextRequest) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const addresses = await db.getAddressesByUserId(session.user.id)
        return secureApiResponse({ success: true, addresses })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: 'Erreur serveur.' }, 500)
    }
}

// POST /api/addresses — Créer une adresse pour l'utilisateur connecté
export async function POST(request: NextRequest) {
    const { session, error: authError } = await requireAuth()
    if (authError) return authError

    try {
        const body = await request.json()

        const parsed = addressSchema.safeParse(body)
        if (!parsed.success) {
            return secureApiResponse({
                success: false,
                message: parsed.error.issues[0]?.message || 'Données invalides.',
                errors: parsed.error.flatten().fieldErrors,
            }, 400)
        }

        const { name, email, street, city, state, country, phone } = parsed.data
        const zip = body.zip || ''

        const address = await db.createAddress({
            userId: session.user.id, // Toujours depuis la session
            name,
            email,
            street,
            city,
            state,
            zip,
            country,
            phone,
        })

        return secureApiResponse({ success: true, address }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
