import { NextRequest } from 'next/server'
import { db } from "@/lib/db"
import { secureApiResponse, requireAdmin } from "@/lib/api-guard"
import { filterAllowedFields } from "@/lib/security"

export async function GET(request: NextRequest) {
    // Les paramètres publics sont accessibles à tous (nom du site, devise, etc.)
    const settings = await db.getSettings()
    return secureApiResponse({ success: true, settings })
}

export async function POST(request: NextRequest) {
    // 🔐 Seul un admin peut modifier les paramètres du site
    const authError = requireAdmin(request)
    if (authError) return authError

    try {
        const body = await request.json()

        // ✅ Filtrage strict : on n'autorise que les clés connues
        const allowedFields = ['siteName', 'slogan', 'email', 'phone', 'address', 'currencySymbol', 'banner', 'hero']
        const sanitizedBody = filterAllowedFields(body, allowedFields)

        const settings = await db.updateSettings(sanitizedBody)
        return secureApiResponse({ success: true, settings })
    } catch (error: any) {
        return secureApiResponse({ success: false, message: error.message }, 400)
    }
}
