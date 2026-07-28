import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

export async function POST() {
  try {
    await signOut({ redirect: false });
    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la déconnexion.' },
      { status: 500 }
    );
  }
}
