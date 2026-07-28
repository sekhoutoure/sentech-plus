import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Aucune session active found.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Session récupérée avec succès.',
      data: session.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération de la session.' },
      { status: 500 }
    );
  }
}
