import { handlers } from '@/auth'

// ✅ Route handler Next.js App Router pour Auth.js v5
// Gère toutes les routes /api/auth/* (signIn, signOut, session, csrf, etc.)
export const { GET, POST } = handlers
