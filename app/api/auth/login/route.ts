import { NextResponse } from 'next/server';
import { signIn } from '@/auth';
import { loginSchema } from '@/validators/authValidators';
import { checkRateLimit } from '@/lib/redis';
import { sanitizeObject } from '@/lib/sanitize';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`login:${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Trop de tentatives. Veuillez réessayer dans quelques instants.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = loginSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Champs d authentification invalides.',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const res = await signIn('credentials', {
      email: validation.data.email,
      password: validation.data.password,
      redirect: false,
    });

    if (res?.error) {
      return NextResponse.json(
        { success: false, message: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: validation.data.email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, role: true, image: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie !',
      data: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.image,
          }
        : undefined,
    });
  } catch (error: any) {
    if (error.type === 'CredentialsSignin') {
      return NextResponse.json(
        { success: false, message: 'Adresse email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Échec de l authentification.' },
      { status: 500 }
    );
  }
}
