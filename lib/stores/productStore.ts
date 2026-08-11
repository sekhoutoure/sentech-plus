import { create } from 'zustand'
import { productDummyData } from '@/assets/assets'

export interface Product {
    id: string
    name: string
    price: number
    originalPrice?: number
    category?: string
    description?: string
    images?: string[]
    image?: string
    salesCount?: number
    rating?: any[]
    stock?: number
    variants?: any[]
    storeId?: string
    storeName?: string
    createdAt?: string
    [key: string]: any
}

interface ProductStore {
    list: Product[]
    status: 'idle' | 'loading' | 'loaded' | 'error'
    setProduct: (products: Product[]) => void
    addProduct: (product: Partial<Product>) => void
    updateProduct: (product: Partial<Product> & { id: string }) => void
    deleteProduct: (id: string) => void
    clearProduct: () => void
}

export const useProductStore = create<ProductStore>((set) => ({
    list: (productDummyData as unknown) as Product[],
    status: 'loaded',
    setProduct: (products) => set({ list: products, status: 'loaded' }),
    addProduct: (product) => set((state) => ({
        list: [{ id: `prod_${Date.now()}`, createdAt: new Date().toISOString(), rating: [], ...product } as Product, ...state.list]
    })),
    updateProduct: (product) => set((state) => ({
        list: state.list.map(p => p.id === product.id ? { ...p, ...product } : p)
    })),
    deleteProduct: (id) => set((state) => ({
        list: state.list.filter(p => p.id !== id)
    })),
    clearProduct: () => set({ list: [], status: 'idle' }),
}))
