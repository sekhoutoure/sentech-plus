import type { Metadata } from 'next';
import { products, getProductById } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

// Generate static routes for all products at build time
export function generateStaticParams() {
  return products.map(product => ({ id: product.id }));
}

// Generate SEO metadata per product
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Produit introuvable',
      description: 'Ce produit n\'existe pas ou a été supprimé.',
    };
  }

  return {
    title: `${product.name} | ${product.category}`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, ${product.brand}, accessoires high-tech, SenTech Plus`,
    openGraph: {
      title: `${product.name} — ${formatPriceStatic(product.price)}`,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

function formatPriceStatic(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
