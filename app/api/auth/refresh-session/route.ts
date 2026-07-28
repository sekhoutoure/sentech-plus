import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Aucune session active' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Session rafraîchie avec succès',
      data: session.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors du rafraîchissement de la session' },
      { status: 500 }
    );
  }
}
