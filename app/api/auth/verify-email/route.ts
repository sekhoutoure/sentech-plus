import { NextResponse } from 'next/server';
import { verifyEmailSchema } from '@/validators/authValidators';
import { AuthService } from '@/services/authService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = verifyEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Jeton de vérification manquant.' },
        { status: 400 }
      );
    }

    await AuthService.verifyEmail(validation.data.token);

    return NextResponse.json({
      success: true,
      message: 'Email vérifié avec succès !',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Échec de la vérification.' },
      { status: 400 }
    );
  }
}
