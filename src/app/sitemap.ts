import { products } from '@/lib/products';
import type { MetadataRoute } from 'next';

const BLOG_IDS = [
  'technologie-gan',
  'prolonger-batterie-smartphone',
  'choisir-ecouteurs-sans-fil',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE = 'https://sentechplus.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/boutique`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/nouveautes`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/promotions`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/favoris`, lastModified: now, changeFrequency: 'never', priority: 0.3 },
    { url: `${BASE}/panier`, lastModified: now, changeFrequency: 'never', priority: 0.3 },
    { url: `${BASE}/compte`, lastModified: now, changeFrequency: 'never', priority: 0.3 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_IDS.map(id => ({
    url: `${BASE}/blog/${id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map(product => ({
    url: `${BASE}/produit/${product.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: product.isBestSeller ? 0.9 : product.isNew ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...productRoutes];
}

