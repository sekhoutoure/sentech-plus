import { NextResponse } from 'next/server';
import { auth, signOut } from '@/auth';
import { UserService } from '@/services/userService';

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé.' },
        { status: 401 }
      );
    }

    await UserService.deleteAccount(session.user.id);
    await signOut({ redirect: false });

    return NextResponse.json({
      success: true,
      message: 'Votre compte a été supprimé avec succès.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Échec de la suppression du compte.' },
      { status: 500 }
    );
  }
}
