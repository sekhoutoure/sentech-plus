import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/seo";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_CONFIG.baseUrl;

    // Static pages
    const staticPages = [
        { route: '', priority: 1.0, changeFrequency: 'daily' },
        { route: '/shop', priority: 0.9, changeFrequency: 'daily' },
        { route: '/about', priority: 0.7, changeFrequency: 'monthly' },
        { route: '/contact', priority: 0.7, changeFrequency: 'monthly' },
        { route: '/pricing', priority: 0.6, changeFrequency: 'monthly' },
        { route: '/create-store', priority: 0.6, changeFrequency: 'monthly' },
        { route: '/cart', priority: 0.5, changeFrequency: 'always' },
        { route: '/wishlist', priority: 0.5, changeFrequency: 'always' },
        { route: '/orders', priority: 0.5, changeFrequency: 'always' },
    ];

    const staticRoutes: MetadataRoute.Sitemap = staticPages.map((item) => ({
        url: `${baseUrl}${item.route}`,
        lastModified: new Date(),
        changeFrequency: item.changeFrequency as 'daily' | 'monthly' | 'always',
        priority: item.priority,
    }));

    // Dynamic Category routes
    const categories = ["Casques", "Enceintes", "Montres", "Écouteurs", "Souris", "Décoration"];
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${baseUrl}/shop?category=${encodeURIComponent(cat)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    // Dynamic Product routes from Supabase PostgreSQL
    let products: any[] = [];
    try {
        const result = await db.getProducts(null, null, null, 1, 1000);
        products = result.products || [];
    } catch {
        products = [];
    }

    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
