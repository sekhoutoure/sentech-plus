import { NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/validators/authValidators';
import { AuthService } from '@/services/authService';
import { checkRateLimit } from '@/lib/redis';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(`reset-password:${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Trop de requêtes. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = resetPasswordSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Informations invalides.', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await AuthService.resetPassword(validation.data);

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès ! Vous pouvez maintenant vous connecter.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Échec de la réinitialisation.' },
      { status: 400 }
    );
  }
}
