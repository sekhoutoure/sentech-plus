import { NextResponse } from 'next/server';
import { registerSchema } from '@/validators/authValidators';
import { AuthService } from '@/services/authService';
import { checkRateLimit } from '@/lib/redis';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`register:${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Trop de requêtes. Veuillez réessayer ultérieurement.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = registerSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Données invalides',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await AuthService.register(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès ! Un email de confirmation vous a été envoyé.',
        data: user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Une erreur est survenue lors de l inscription.' },
      { status: 400 }
    );
  }
}
