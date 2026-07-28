import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role || 'user';
      const pathname = nextUrl.pathname;

      // Protected route rules
      const isAuthRoute = pathname.startsWith('/login') || 
                          pathname.startsWith('/register') || 
                          pathname.startsWith('/forgot-password') || 
                          pathname.startsWith('/reset-password');
      
      const isAdminRoute = pathname.startsWith('/admin');
      const isSellerRoute = pathname.startsWith('/seller');
      const isUserDashboardRoute = pathname.startsWith('/user') || pathname.startsWith('/profile');

      if (isAuthRoute) {
        if (isLoggedIn) {
          // Redirect logged in users away from auth pages to their respective dashboards
          if (role === 'admin') return Response.redirect(new URL('/admin', nextUrl));
          if (role === 'seller') return Response.redirect(new URL('/seller', nextUrl));
          return Response.redirect(new URL('/user', nextUrl));
        }
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn) return false; // redirect to login
        if (role !== 'admin') return Response.redirect(new URL('/user', nextUrl));
        return true;
      }

      if (isSellerRoute) {
        if (!isLoggedIn) return false;
        if (role !== 'seller' && role !== 'admin') return Response.redirect(new URL('/user', nextUrl));
        return true;
      }

      if (isUserDashboardRoute) {
        if (!isLoggedIn) return false;
        return true;
      }

      return true;
    },
  },
  providers: [], // Added in auth.ts
} satisfies NextAuthConfig;
