import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

// ============================================================
// ✅ db.ts — Interface Prisma complète avec gestion d'erreurs
// ============================================================

export const db = {

  // ─────────────────────────────────────────────
  // Products
  // ─────────────────────────────────────────────
  getProducts: async (
    category?: string | null,
    search?: string | null,
    storeId?: string | null,
    page = 1,
    limit = 20
  ) => {
    try {
      const where: Prisma.ProductWhereInput = {}
      if (category && category !== 'Tous') {
        where.category = { equals: category, mode: 'insensitive' }
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }
      if (storeId) {
        where.storeId = storeId
      }

      const skip = (page - 1) * limit
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: { store: { select: { name: true, username: true, logo: true } } },
        }),
        prisma.product.count({ where }),
      ])

      return { products, total, page, limit, totalPages: Math.ceil(total / limit) }
    } catch (e) {
      console.error('Prisma getProducts error:', e)
      return { products: [], total: 0, page, limit, totalPages: 0 }
    }
  },

  getProductById: async (id: string) => {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: {
          store: { select: { id: true, name: true, username: true, logo: true, contact: true } },
          rating: {
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    } catch (e) {
      console.error('Prisma getProductById error:', e)
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
  // Ratings
  // ─────────────────────────────────────────────
  getRatingsByProduct: async (productId: string) => {
    try {
      return await prisma.rating.findMany({
        where: { productId },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      })
    } catch (e) {
      console.error('Prisma getRatingsByProduct error:', e)
      return []
    }
  },

  addRating: async (data: {
    rating: number
    review: string
    userId: string
    productId: string
    orderId: string
  }) => {
    return prisma.rating.create({ data })
  },

  deleteRating: async (id: string) => {
    await prisma.rating.delete({ where: { id } })
    return true
  },

  // ─────────────────────────────────────────────
  // Orders
  // ─────────────────────────────────────────────
  getOrders: async (page = 1, limit = 20) => {
    try {
      const skip = (page - 1) * limit
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          include: {
            orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
            user: { select: { id: true, name: true, email: true } },
            address: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.order.count(),
      ])
      return { orders, total, page, limit, totalPages: Math.ceil(total / limit) }
    } catch (e) {
      console.error('Prisma getOrders error:', e)
      return { orders: [], total: 0, page, limit, totalPages: 0 }
    }
  },

  getOrderById: async (id: string) => {
    try {
      return await prisma.order.findUnique({
        where: { id },
        include: {
          orderItems: { include: { product: { select: { id: true, name: true, images: true, price: true } } } },
          user: { select: { id: true, name: true, email: true } },
          address: true,
        },
      })
    } catch (e) {
      console.error('Prisma getOrderById error:', e)
      return null
    }
  },

  getOrdersByUserId: async (userId: string, page = 1, limit = 20) => {
    try {
      const skip = (page - 1) * limit
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { userId },
          include: {
            orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
            address: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.order.count({ where: { userId } }),
      ])
      return { orders, total, page, limit, totalPages: Math.ceil(total / limit) }
    } catch (e) {
      console.error('Prisma getOrdersByUserId error:', e)
      return { orders: [], total: 0, page, limit, totalPages: 0 }
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
      data: { status: status as any },
    })
  },

  // ─────────────────────────────────────────────
  // Coupons
  // ─────────────────────────────────────────────
  getCoupons: async () => {
    try {
      return await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    } catch (e) {
      console.error('Prisma getCoupons error:', e)
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
      console.error('Prisma validateCoupon error:', e)
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
  getStores: async (page = 1, limit = 20) => {
    try {
      const skip = (page - 1) * limit
      const [stores, total] = await Promise.all([
        prisma.store.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          include: { user: { select: { id: true, name: true, email: true } } },
        }),
        prisma.store.count(),
      ])
      return { stores, total, page, limit, totalPages: Math.ceil(total / limit) }
    } catch (e) {
      console.error('Prisma getStores error:', e)
      return { stores: [], total: 0, page, limit, totalPages: 0 }
    }
  },

  getStoreById: async (id: string) => {
    try {
      return await prisma.store.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          Product: { orderBy: { createdAt: 'desc' } },
        },
      })
    } catch (e) {
      console.error('Prisma getStoreById error:', e)
      return null
    }
  },

  getStoreByUsername: async (username: string) => {
    try {
      return await prisma.store.findUnique({
        where: { username },
        include: { Product: { orderBy: { createdAt: 'desc' } } },
      })
    } catch (e) {
      console.error('Prisma getStoreByUsername error:', e)
      return null
    }
  },

  getStoreByUserId: async (userId: string) => {
    try {
      return await prisma.store.findUnique({ where: { userId } })
    } catch (e) {
      console.error('Prisma getStoreByUserId error:', e)
      return null
    }
  },

  createStore: async (data: Prisma.StoreCreateInput) => {
    return prisma.store.create({ data })
  },

  updateStore: async (id: string, data: Prisma.StoreUpdateInput) => {
    return prisma.store.update({ where: { id }, data })
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
  // Addresses
  // ─────────────────────────────────────────────
  getAddressesByUserId: async (userId: string) => {
    try {
      return await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    } catch (e) {
      console.error('Prisma getAddressesByUserId error:', e)
      return []
    }
  },

  getAddressById: async (id: string) => {
    try {
      return await prisma.address.findUnique({ where: { id } })
    } catch (e) {
      console.error('Prisma getAddressById error:', e)
      return null
    }
  },

  createAddress: async (data: {
    userId: string
    name: string
    email: string
    street: string
    city: string
    state: string
    zip: string
    country: string
    phone: string
  }) => {
    return prisma.address.create({ data })
  },

  deleteAddress: async (id: string) => {
    await prisma.address.delete({ where: { id } })
    return true
  },

  // ─────────────────────────────────────────────
  // Site Settings (statiques pour l'instant)
  // ─────────────────────────────────────────────
  getSettings: async () => {
    return {
      siteName: 'SenTech Plus',
      slogan: 'Smart Accessories & High-Tech Products',
      email: 'contact@sentechplus.sn',
      phone: '+221 77 000 00 00',
      address: 'Avenue Cheikh Anta Diop, Fann, Dakar, Sénégal',
      currencySymbol: 'FCFA',
      whatsapp: '+221770000000',
      banner: {
        enabled: false,
        text: '✨ Obtenez 20% de réduction sur votre première commande !',
        buttonText: "Profiter de l'offre",
        couponCode: 'NEW20',
      },
    }
  },

  updateSettings: async (newSettings: object) => {
    // À connecter à une table Settings Prisma si persistance nécessaire
    return newSettings
  },
}
