import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validations'
import { checkAuthRateLimit } from '@/lib/ratelimit'

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (10 requests / minute)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'anonymous-ip'
    const rateLimit = await checkAuthRateLimit(`register_${ip}`)

    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trop de tentatives d’inscription. Limite de 10 requêtes/minute atteinte. Veuillez réessayer dans une minute.' 
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
    const validationResult = registerSchema.safeParse(body)

    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || 'Données d’inscription invalides.'
      return NextResponse.json(
        { success: false, message: errorMessage, errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }


    const { name, email, password, role } = validationResult.data

    // 3. Existing User Check in Supabase PostgreSQL
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Un compte existe déjà avec cette adresse e-mail.' },
        { status: 400 }
      )
    }

    // 4. Secure Password Hashing
    const hashedPassword = await bcrypt.hash(password, 10)

    // 5. Database Insertion
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    })

    const { password: _, ...userData } = user

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès !',
      user: userData,
    })
  } catch (error: any) {
    console.error('Registration API error:', error)
    return NextResponse.json(
      { success: false, message: 'Une erreur interne est survenue lors de l’inscription.' },
      { status: 500 }
    )
  }
}
