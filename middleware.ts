import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const session = request.auth;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role || 'user';

  // 1. Protection et redirection basées sur les rôles
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');
  const isAdminRoute = pathname.startsWith('/admin');
  const isSellerRoute = pathname.startsWith('/seller') || pathname.startsWith('/store');
  const isUserDashboardRoute =
    pathname.startsWith('/profile') || pathname.startsWith('/orders') || pathname.startsWith('/user');

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.nextUrl));
      if (role === 'seller') return NextResponse.redirect(new URL('/store', request.nextUrl));
      return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }
  }

  if (isSellerRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'seller' && role !== 'admin') {
      return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }
  }

  if (isUserDashboardRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.nextUrl);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protection Anti-CSRF pour les mutations API
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (origin) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host && !host?.includes('localhost') && !host?.includes('127.0.0.1')) {
          return NextResponse.json(
            { success: false, message: 'Échec de la validation CSRF : Origine non autorisée.' },
            { status: 403 }
          );
        }
      } catch (e) {
        return NextResponse.json(
          { success: false, message: 'Échec de la validation CSRF : En-tête Origine invalide.' },
          { status: 400 }
        );
      }
    }
  }

  // 3. En-têtes de sécurité
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://*.google-analytics.com; script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://*.google-analytics.com; connect-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.doubleclick.net; frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://*.doubleclick.net; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https: https://www.googletagmanager.com https://www.google-analytics.com https://stats.g.doubleclick.net; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
  );

  return response;
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
