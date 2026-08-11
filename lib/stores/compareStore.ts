import { create } from 'zustand'

interface CompareStore {
    items: string[] // Max 3 product IDs
    toggleCompare: (productId: string) => void
    removeFromCompare: (productId: string) => void
    clearCompare: () => void
    isInCompare: (productId: string) => boolean
}

const getInitialItems = (): string[] => {
    if (typeof window === 'undefined') return []
    try {
        const saved = localStorage.getItem('sentech_compare_items')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const saveToStorage = (items: string[]) => {
    if (typeof window === 'undefined') return
    try {
        if (items.length === 0) {
            localStorage.removeItem('sentech_compare_items')
        } else {
            localStorage.setItem('sentech_compare_items', JSON.stringify(items))
        }
    } catch {}
}

export const useCompareStore = create<CompareStore>((set, get) => ({
    items: getInitialItems(),
    toggleCompare: (productId) => set((state) => {
        const index = state.items.indexOf(productId)
        let newItems: string[]
        if (index >= 0) {
            newItems = state.items.filter(id => id !== productId)
        } else {
            newItems = state.items.length >= 3
                ? [...state.items.slice(1), productId]
                : [...state.items, productId]
        }
        saveToStorage(newItems)
        return { items: newItems }
    }),
    removeFromCompare: (productId) => set((state) => {
        const newItems = state.items.filter(id => id !== productId)
        saveToStorage(newItems)
        return { items: newItems }
    }),
    clearCompare: () => {
        saveToStorage([])
        set({ items: [] })
    },
    isInCompare: (productId) => get().items.includes(productId),
}))
