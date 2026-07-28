import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/lib/validations'
import { checkAuthRateLimit } from '@/lib/ratelimit'

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (10 requests / minute)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'anonymous-ip'
    const rateLimit = await checkAuthRateLimit(`login_${ip}`)

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trop de tentatives de connexion. Limite de 10 requêtes/minute atteinte pour des raisons de sécurité. Veuillez réessayer dans une minute.' 
        },
        { 
          status: 429, 
          headers: { 
            'X-RateLimit-Limit': '10', 
            'X-RateLimit-Remaining': '0' 
          } 
        }
      )
    }

    // 2. Body Parsing & Server-Side Zod Validation
    const body = await req.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || 'Identifiants invalides.'
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      )
    }


    const { email, password } = validationResult.data

    // 3. User Lookup in Supabase PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Aucun compte trouvé avec cet e-mail.' },
        { status: 404 }
      )
    }

    // 4. Password Hash Verification
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Mot de passe incorrect.' },
          { status: 401 }
        )
      }
    }

    const { password: _, ...userData } = user

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie !',
      user: userData,
    })
  } catch (error: any) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la connexion.' },
      { status: 500 }
    )
  }
}
