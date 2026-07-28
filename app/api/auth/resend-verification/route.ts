import { NextResponse } from 'next/server';
import { resendVerificationSchema } from '@/validators/authValidators';
import { AuthService } from '@/services/authService';
import { checkRateLimit } from '@/lib/redis';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`resend:${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Veuillez attendre quelques minutes avant de demander un nouvel email.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = resendVerificationSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Email invalide.' },
        { status: 400 }
      );
    }

    await AuthService.resendVerificationEmail(validation.data.email);

    return NextResponse.json({
      success: true,
      message: 'Un nouvel email de confirmation a été envoyé si le compte existe.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur lors de l envoi.' },
      { status: 400 }
    );
  }
}
