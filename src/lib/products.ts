export type Category = string;

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  isPromo: boolean;
  brand: string;
  description: string;
  features: string[];
  delivery: string;
  warranty: string;
  badge?: string;
}

export const categories: { name: string; icon: string; slug: string }[] = [];

export const products: Product[] = [];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getBestSellers(): Product[] {
  return products.filter(p => p.isBestSeller);
}

export function getNewProducts(): Product[] {
  return products.filter(p => p.isNew);
}

export function getPromoProducts(): Product[] {
  return products.filter(p => p.isPromo);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}
