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

export const products: Product[] = [
  {
    id: 'samsung-buds-3-pro',
    name: 'Samsung Galaxy Buds3 Pro',
    category: 'Écouteurs Bluetooth',
    price: 95000,
    oldPrice: 120000,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'],
    rating: 4.9,
    reviews: 142,
    inStock: true,
    stockCount: 15,
    isNew: true,
    isBestSeller: true,
    isPromo: true,
    brand: 'Samsung',
    description: 'Écouteurs sans fil avec réduction de bruit active intelligente ANC et son Hi-Fi 24-bit.',
    features: ['Réduction de bruit ANC 33dB', 'Autonomie 30h avec boîtier', 'Résistant à l\'eau IPX7'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 12 mois',
    badge: '-21%'
  },
  {
    id: 'anker-gan-65w',
    name: 'Anker 735 Chargeur Rapide GaN 65W',
    category: 'Chargeurs Rapides',
    price: 25000,
    oldPrice: 32000,
    discount: 22,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'],
    rating: 4.8,
    reviews: 98,
    inStock: true,
    stockCount: 22,
    isNew: false,
    isBestSeller: true,
    isPromo: true,
    brand: 'Anker',
    description: 'Chargeur mural 3 ports (2 USB-C + 1 USB-A) avec technologie GaN III ultra-rapide.',
    features: ['Recharge iPhone & Macbook 65W', 'Taille ultra-compacte', 'Protection contre la surchauffe MultiProtect'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 12 mois',
    badge: 'BEST-SELLER'
  },
  {
    id: 'anker-powercore-20k',
    name: 'Anker PowerBank PowerCore 20 000mAh',
    category: 'Batteries Externes',
    price: 34000,
    oldPrice: 42000,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80'],
    rating: 4.9,
    reviews: 215,
    inStock: true,
    stockCount: 18,
    isNew: false,
    isBestSeller: true,
    isPromo: false,
    brand: 'Anker',
    description: 'Batterie externe haute capacité 20 000mAh avec recharge rapide PowerIQ 20W.',
    features: ['5 recharges complètes pour smartphone', 'Recharge simultanée 2 appareils', 'Indicateur LED'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 12 mois',
    badge: 'POPULAIRE'
  },
  {
    id: 'apple-watch-se-2',
    name: 'Apple Watch SE (2ème Gen) GPS 44mm',
    category: 'Montres Connectées',
    price: 185000,
    oldPrice: 215000,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'],
    rating: 5.0,
    reviews: 86,
    inStock: true,
    stockCount: 8,
    isNew: true,
    isBestSeller: true,
    isPromo: true,
    brand: 'Apple',
    description: 'Montre connectée avec écran Retina, suivi d\'activité, détection des accidents et notifications cardiaques.',
    features: ['Étanche jusqu\'à 50m', 'Autonomie 18h', 'Suivi du sommeil & du rythme cardiaque'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 12 mois',
    badge: 'OFFICIEL'
  },
  {
    id: 'baseus-braided-cable-100w',
    name: 'Câble Baseus USB-C vers USB-C 100W 2m',
    category: 'Câbles Premium',
    price: 8500,
    oldPrice: 12000,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'],
    rating: 4.7,
    reviews: 64,
    inStock: true,
    stockCount: 45,
    isNew: true,
    isBestSeller: false,
    isPromo: true,
    brand: 'Baseus',
    description: 'Câble tressé en nylon renforcé 100W Power Delivery pour smartphones et ordinateurs portables.',
    features: ['E-Mark chip intégré', 'Nylon tressé résistant', 'Transfert données 480Mbps'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 6 mois',
    badge: 'TOP VENTE'
  },
  {
    id: 'ugreen-magsafe-car-mount',
    name: 'Support Téléphone Voiture MagSafe Ugreen',
    category: 'Supports Téléphone',
    price: 14500,
    oldPrice: 18000,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&auto=format&fit=crop&q=80'],
    rating: 4.8,
    reviews: 52,
    inStock: true,
    stockCount: 20,
    isNew: true,
    isBestSeller: false,
    isPromo: false,
    brand: 'Ugreen',
    description: 'Support magnétique de grille d\'aération avec aimants N52 ultra-puissants.',
    features: ['Orientation 360°', 'MagSafe compatible iPhone 12/13/14/15/16', 'Fixation grille sécurisée'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 6 mois',
    badge: 'NOUVEAU'
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Casque Réduction de Bruit',
    category: 'Écouteurs Bluetooth',
    price: 245000,
    oldPrice: 280000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'],
    rating: 5.0,
    reviews: 190,
    inStock: true,
    stockCount: 6,
    isNew: false,
    isBestSeller: true,
    isPromo: true,
    brand: 'Sony',
    description: 'Casque circum-aural haute résolution avec la meilleure réduction de bruit du marché.',
    features: ['Autonomie 30h', 'Processeur V1 + QN1', 'Commandes tactiles intuitives'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 12 mois',
    badge: 'PREMIUM'
  },
  {
    id: 'logitech-g502-hero',
    name: 'Logitech G502 HERO Souris Gaming 25600 DPI',
    category: 'Gaming',
    price: 38000,
    oldPrice: 48000,
    discount: 21,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'],
    rating: 4.9,
    reviews: 110,
    inStock: true,
    stockCount: 12,
    isNew: true,
    isBestSeller: true,
    isPromo: true,
    brand: 'Logitech',
    description: 'Souris gaming filaire haute précision avec capteur HERO 25K et 11 boutons programmables.',
    features: ['Capteur HERO 25K', 'Poids ajustables 5x3.6g', 'Éclairage RGB LIGHTSYNC'],
    delivery: 'Livraison 24h à Dakar',
    warranty: 'Garantie 12 mois',
    badge: 'GAMING'
  }
];

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
