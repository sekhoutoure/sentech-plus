import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// ============================================================
// ✅ db.ts — Interface Prisma remplaçant db.js in-memory
// Même API publique que l'ancien db.js pour minimiser les
// changements dans les routes API existantes.
// ============================================================

export const db = {
  // ─────────────────────────────────────────────
  // Products
  // ─────────────────────────────────────────────
  getProducts: async (category?: string, search?: string, storeId?: string) => {
    const where: Prisma.ProductWhereInput = {}
    if (category && category !== 'Tous') {
      where.category = { equals: category, mode: 'insensitive' }
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }
    if (storeId) {
      where.storeId = storeId
    }
    return prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  },

  getProductById: async (id: string) => {
    return prisma.product.findUnique({ where: { id } })
  },

  addProduct: async (data: Prisma.ProductCreateInput) => {
    return prisma.product.create({ data })
  },

  updateProduct: async (id: string, data: Prisma.ProductUpdateInput) => {
    return prisma.product.update({ where: { id }, data })
  },

  deleteProduct: async (id: string) => {
    await prisma.product.delete({ where: { id } })
    return true
  },

  // ─────────────────────────────────────────────
  // Orders
  // ─────────────────────────────────────────────
  getOrders: async () => {
    return prisma.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  getOrderById: async (id: string) => {
    return prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    })
  },

  getOrdersByUserId: async (userId: string) => {
    return prisma.order.findMany({
      where: { userId },
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' },
    })
  },

  createOrder: async (data: {
    userId: string
    storeId: string
    addressId: string
    paymentMethod: 'COD' | 'STRIPE'
    isCouponUsed: boolean
    coupon?: object
    total: number
    orderItems: { productId: string; quantity: number; price: number }[]
  }) => {
    const { orderItems, ...orderData } = data
    return prisma.order.create({
      data: {
        ...orderData,
        coupon: orderData.coupon ?? {},
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: true },
    })
  },

  updateOrderStatus: async (id: string, status: string) => {
    return prisma.order.update({
      where: { id },
      data: { status: status as Prisma.EnumOrderStatusFilter['equals'] },
    })
  },

  // ─────────────────────────────────────────────
  // Coupons
  // ─────────────────────────────────────────────
  getCoupons: async () => {
    return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  },

  validateCoupon: async (code: string) => {
    return prisma.coupon.findFirst({
      where: {
        code: { equals: code.toUpperCase() },
        isPublic: true,
        expiresAt: { gte: new Date() },
      },
    })
  },

  addCoupon: async (data: Prisma.CouponCreateInput) => {
    return prisma.coupon.create({ data })
  },

  deleteCoupon: async (code: string) => {
    await prisma.coupon.delete({ where: { code: code.toUpperCase() } })
    return true
  },

  // ─────────────────────────────────────────────
  // Stores
  // ─────────────────────────────────────────────
  getStores: async () => {
    return prisma.store.findMany({ orderBy: { createdAt: 'desc' } })
  },

  getStoreByUsername: async (username: string) => {
    return prisma.store.findUnique({ where: { username } })
  },

  createStore: async (data: Prisma.StoreCreateInput) => {
    return prisma.store.create({ data })
  },

  deleteStore: async (id: string) => {
    await prisma.store.delete({ where: { id } })
    return true
  },

  updateStoreStatus: async (id: string, status: string) => {
    return prisma.store.update({
      where: { id },
      data: {
        status,
        isActive: status === 'approved',
      },
    })
  },

  // ─────────────────────────────────────────────
  // Site Settings (clé unique "global")
  // ─────────────────────────────────────────────
  getSettings: async () => {
    // On utilise un enregistrement JSON libre dans Prisma via une table settings
    // Pour l'instant, on retourne les valeurs par défaut si non configuré
    return {
      siteName: 'SenTech Plus',
      slogan: 'Smart Accessories & High-Tech Products',
      email: 'contact@sentechplus.com',
      phone: '+1-212-456-7890',
      address: '794 Francisco Street, San Francisco, CA 94102',
      currencySymbol: '$',
      banner: {
        enabled: true,
        text: '✨ Obtenez 20% de réduction sur votre première commande !',
        buttonText: "Profiter de l'offre",
        couponCode: 'NEW20',
      },
    }
  },

  updateSettings: async (newSettings: object) => {
    // À implémenter avec un modèle Settings dédié en BDD
    return newSettings
  },
}
