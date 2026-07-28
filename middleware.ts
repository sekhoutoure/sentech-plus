import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// ✅ Middleware Edge-compatible NextAuth
export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
