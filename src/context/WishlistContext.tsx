'use client';

import { createContext, useContext, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Product } from '@/lib/products';

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sentech-wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => setItems(parsed), 0);
      }
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage:', e);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem('sentech-wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [items]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === product.id);
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  }, []);

  // O(1) lookup using Set
  const wishlistIds = useMemo(() => new Set(items.map(i => i.id)), [items]);
  const isInWishlist = useCallback((productId: string) => wishlistIds.has(productId), [wishlistIds]);
  const clearWishlist = useCallback(() => setItems([]), []);
  const count = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, clearWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
