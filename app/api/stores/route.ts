import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"
import { filterAllowedFields } from "@/lib/security"

export async function GET(request: NextRequest) {
    // 🔐 Seul un admin peut voir toutes les boutiques
    // Pour un appel public (page vitrine), filtrer uniquement les boutiques approuvées
    const authError = requireAdmin(request)
    const stores = await db.getStores()
    
    if (authError) {
        // Not admin, return only approved stores
        const approvedStores = stores.filter((store: any) => store.status === 'approved')
        return secureApiResponse({ success: true, stores: approvedStores })
    }
    
    return secureApiResponse({ success: true, stores })
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // ✅ Filtrage des champs autorisés pour créer une boutique
        const allowedFields = ['userId', 'name', 'username', 'email', 'contact', 'logo', 'description', 'address']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        // ✅ Champs obligatoires
        if (!sanitizedBody.name || !sanitizedBody.email || !sanitizedBody.username) {
            return secureApiResponse({ success: false, message: "Champs requis: name, email, username" }, 400)
        }

        const store = await db.createStore(sanitizedBody)
        return secureApiResponse({ success: true, store }, 201)
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
