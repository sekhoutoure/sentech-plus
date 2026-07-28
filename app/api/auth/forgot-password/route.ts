import { NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/validators/authValidators';
import { AuthService } from '@/services/authService';
import { checkRateLimit } from '@/lib/redis';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`forgot-password:${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Trop de demandes. Veuillez patienter.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = forgotPasswordSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Adresse email invalide.', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await AuthService.forgotPassword(validation.data.email);

    return NextResponse.json({
      success: true,
      message: 'Si cette adresse existe, un email de réinitialisation vous a été envoyé.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur lors de la demande.' },
      { status: 500 }
    );
  }
}
