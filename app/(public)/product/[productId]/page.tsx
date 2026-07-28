import { db } from "@/lib/db";
import ProductPageClient from "./ProductPageClient";
import JsonLd from "@/components/seo/JsonLd";
import { getProductSchema, getBreadcrumbSchema, SITE_CONFIG } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
    const { productId } = await params;
    const product = await db.getProductById(productId);
    
    if (!product) {
        return {
            title: 'Produit introuvable - SenTech Plus',
            description: 'Ce produit n\'existe pas ou n\'est plus disponible.',
            robots: { index: false, follow: false },
        };
    }
    
    const canonicalUrl = `${SITE_CONFIG.baseUrl}/product/${product.id}`;
    const productTitle = `${product.name} - Acheter au Sénégal | SenTech Plus`;
    const productDesc = product.description 
        ? `${product.description.substring(0, 150)}... Commandez au Sénégal avec livraison express 24h à Dakar.`
        : `Achetez ${product.name} au meilleur prix chez SenTech Plus Dakar. Garantie & livraison rapide partout au Sénégal.`;

    const imageUrl = product.images && product.images.length > 0 
        ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as any)?.src)
        : `${SITE_CONFIG.baseUrl}/og-image.jpg`;

    return {
        title: productTitle,
        description: productDesc,
        keywords: [
            product.name,
            `${product.name} Sénégal`,
            `${product.name} Dakar`,
            `${product.category} Sénégal`,
            'accessoires high-tech Sénégal',
            'livraison dakar high tech',
        ],
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: productTitle,
            description: productDesc,
            url: canonicalUrl,
            siteName: SITE_CONFIG.name,
            locale: 'fr_SN',
            type: 'website',
            images: [{ url: imageUrl, alt: product.name }],
        },
        twitter: {
            card: 'summary_large_image',
            title: productTitle,
            description: productDesc,
            images: [imageUrl],
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const product = await db.getProductById(productId);

    if (!product) {
        return <ProductPageClient />;
    }

    const breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Boutique', url: '/shop' },
        { name: product.category || 'High-Tech', url: `/shop?category=${encodeURIComponent(product.category || '')}` },
        { name: product.name, url: `/product/${product.id}` },
    ];

    return (
        <>
            <JsonLd data={[getProductSchema(product), getBreadcrumbSchema(breadcrumbs)]} />
            <ProductPageClient />
        </>
    );
}