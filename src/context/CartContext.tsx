'use client';

import { createContext, useContext, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Product } from '@/lib/products';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sentech-cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => setItems(parsed), 0);
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
    hydrated.current = true;
  }, []);

  // Save to localStorage whenever items change, but only after hydration
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem('sentech-cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stockCount);
        return prev.map(i => i.id === product.id ? { ...i, quantity: newQty } : i);
      }
      const safeQty = Math.min(quantity, product.stockCount);
      return [...prev, { ...product, quantity: safeQty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== productId));
    } else {
      setItems(prev => prev.map(i => {
        if (i.id !== productId) return i;
        const safeQty = Math.min(quantity, i.stockCount);
        return { ...i, quantity: safeQty };
      }));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback((productId: string) =>
    items.some(i => i.id === productId), [items]);

  const getItemQuantity = useCallback((productId: string) =>
    items.find(i => i.id === productId)?.quantity ?? 0, [items]);

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      clearCart, isInCart, getItemQuantity, totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
