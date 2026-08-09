import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: session.user,
      user: session.user,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      authenticated: false,
      user: null,
    }, { status: 200 });
  }
}
