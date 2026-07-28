import type { NextAuthConfig } from 'next-auth'

// ✅ Configuration Edge-compatible sans PrismaAdapter pour middleware.ts
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname

      const isOnAdmin = pathname.startsWith('/admin')
      const isOnStore = pathname.startsWith('/store') && pathname !== '/create-store'
      const isOnOrders = pathname === '/orders'

      if (isOnAdmin || isOnStore || isOnOrders) {
        if (isLoggedIn) return true
        return false // Redirige automatiquement vers la page signIn (/)
      }
      return true
    },
  },
}
