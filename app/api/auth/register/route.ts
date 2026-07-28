import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Veuillez saisir une adresse e-mail et un mot de passe.' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Un compte existe déjà avec cette adresse e-mail.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const assignedRole = role === 'admin' ? 'admin' : role === 'seller' ? 'seller' : 'user'

    // Create user in Supabase PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
      },
    })

    // Remove sensitive data
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
