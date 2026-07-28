import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Veuillez saisir votre e-mail et mot de passe.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Aucun compte trouvé avec cet e-mail.' },
        { status: 404 }
      )
    }

    // Verify password if hashed password exists
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
