import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Supabase PostgreSQL database...')

  // 1. Create or upsert Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'contact@sentechplus.com' },
    update: {},
    create: {
      id: 'user_admin_sentech',
      name: 'SenTech Admin',
      email: 'contact@sentechplus.com',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'admin',
    },
  })

  // 2. Create or upsert Store
  const store = await prisma.store.upsert({
    where: { username: 'sentech' },
    update: {},
    create: {
      id: 'store_sentech_official',
      userId: adminUser.id,
      name: 'SenTech Official',
      username: 'sentech',
      email: 'contact@sentechplus.com',
      contact: '+1-212-456-7890',
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      description: 'Boutique officielle SenTech Plus pour accessoires intelligents et produits high-tech.',
      address: '794 Francisco Street, San Francisco, CA 94102',
      status: 'approved',
      isActive: true,
    },
  })

  // 3. Create initial Coupons
  await prisma.coupon.upsert({
    where: { code: 'NEW20' },
    update: {},
    create: {
      code: 'NEW20',
      description: '20% de réduction sur la première commande',
      discount: 20,
      forNewUser: true,
      forMember: false,
      isPublic: true,
      expiresAt: new Date('2030-01-01'),
    },
  })

  await prisma.coupon.upsert({
    where: { code: 'SENTECH10' },
    update: {},
    create: {
      code: 'SENTECH10',
      description: '10% de réduction membre Plus',
      discount: 10,
      forNewUser: false,
      forMember: true,
      isPublic: true,
      expiresAt: new Date('2030-01-01'),
    },
  })

  // 4. Create initial Products
  const sampleProducts = [
    {
      id: 'prod_1',
      name: 'Modern table lamp',
      description: 'Modern table lamp with a sleek design. It is perfect for any room. Made of high-quality materials with a soft ambient glow.',
      mrp: 40,
      price: 29,
      images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
      category: 'Décoration',
      storeId: store.id,
      inStock: true,
    },
    {
      id: 'prod_2',
      name: 'Smart speaker gray',
      description: 'Smart speaker with high-fidelity acoustic sound, voice assistant, and seamless Bluetooth 5.3 connectivity.',
      mrp: 50,
      price: 29,
      images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600'],
      category: 'Enceintes',
      storeId: store.id,
      inStock: true,
    },
    {
      id: 'prod_3',
      name: 'Smart watch white',
      description: 'Fitness smartwatch with AMOLED display, heart rate monitor, sleep tracking, and 7-day battery life.',
      mrp: 60,
      price: 29,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
      category: 'Montres',
      storeId: store.id,
      inStock: true,
    },
    {
      id: 'prod_4',
      name: 'Wireless headphones Pro',
      description: 'Over-ear active noise cancelling headphones with BoomX spatial audio and 50 hours playtime.',
      mrp: 70,
      price: 49,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
      category: 'Casques',
      storeId: store.id,
      inStock: true,
    },
    {
      id: 'prod_5',
      name: 'Écouteurs True Wireless',
      description: 'Ergonomic in-ear wireless earbuds with low latency gaming mode and IPX5 water resistance.',
      mrp: 49,
      price: 29,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
      category: 'Écouteurs',
      storeId: store.id,
      inStock: true,
    },
    {
      id: 'prod_6',
      name: 'Souris Gaming Ergonomique',
      description: 'Ultra-lightweight wireless gaming mouse with 26K DPI optical sensor and RGB lighting.',
      mrp: 59,
      price: 39,
      images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600'],
      category: 'Souris',
      storeId: store.id,
      inStock: true,
    },
  ]

  for (const prod of sampleProducts) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: prod,
    })
  }

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
