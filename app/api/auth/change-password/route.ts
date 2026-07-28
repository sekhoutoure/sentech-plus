import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { changePasswordSchema } from '@/validators/authValidators';
import { AuthService } from '@/services/authService';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const sanitizedBody = sanitizeObject(body);
    const validation = changePasswordSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Champs invalides.', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await AuthService.changePassword(session.user.id, validation.data);

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été modifié avec succès.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Échec du changement de mot de passe.' },
      { status: 400 }
    );
  }
}
