import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// ============================================================
// ✅ db.ts — Interface Prisma avec gestion d'erreurs sécurisée
// ============================================================

export const db = {
  // ─────────────────────────────────────────────
  // Products
  // ─────────────────────────────────────────────
  getProducts: async (category?: string, search?: string, storeId?: string) => {
    try {
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
      return await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })
    } catch (e) {
      console.error("Prisma getProducts error:", e)
      return []
    }
  },

  getProductById: async (id: string) => {
    try {
      return await prisma.product.findUnique({ where: { id } })
    } catch (e) {
      console.error("Prisma getProductById error:", e)
      return null
    }
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
    try {
      return await prisma.order.findMany({
        include: { orderItems: true },
        orderBy: { createdAt: 'desc' },
      })
    } catch (e) {
      console.error("Prisma getOrders error:", e)
      return []
    }
  },

  getOrderById: async (id: string) => {
    try {
      return await prisma.order.findUnique({
        where: { id },
        include: { orderItems: true },
      })
    } catch (e) {
      console.error("Prisma getOrderById error:", e)
      return null
    }
  },

  getOrdersByUserId: async (userId: string) => {
    try {
      return await prisma.order.findMany({
        where: { userId },
        include: { orderItems: true },
        orderBy: { createdAt: 'desc' },
      })
    } catch (e) {
      console.error("Prisma getOrdersByUserId error:", e)
      return []
    }
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
    try {
      return await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    } catch (e) {
      console.error("Prisma getCoupons error:", e)
      return []
    }
  },

  validateCoupon: async (code: string) => {
    try {
      return await prisma.coupon.findFirst({
        where: {
          code: { equals: code.toUpperCase() },
          isPublic: true,
          expiresAt: { gte: new Date() },
        },
      })
    } catch (e) {
      console.error("Prisma validateCoupon error:", e)
      return null
    }
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
    try {
      return await prisma.store.findMany({ orderBy: { createdAt: 'desc' } })
    } catch (e) {
      console.error("Prisma getStores error:", e)
      return []
    }
  },

  getStoreByUsername: async (username: string) => {
    try {
      return await prisma.store.findUnique({ where: { username } })
    } catch (e) {
      console.error("Prisma getStoreByUsername error:", e)
      return null
    }
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
  // Site Settings
  // ─────────────────────────────────────────────
  getSettings: async () => {
    return {
      siteName: 'SenTech Plus',
      slogan: 'Smart Accessories & High-Tech Products',
      email: 'contact@sentechplus.sn',
      phone: '+221 77 000 00 00',
      address: 'Avenue Cheikh Anta Diop, Fann, Dakar, Sénégal',
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
    return newSettings
  },
}
