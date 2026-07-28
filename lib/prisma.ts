import { PrismaClient } from '@prisma/client'

// ✅ Singleton PrismaClient — évite les connexions multiples en développement (hot-reload)
// En production, chaque instance serverless a son propre client.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
