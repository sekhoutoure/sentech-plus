import { create } from 'zustand'

interface WishlistStore {
    items: string[] // Array of productIds
    toggleWishlist: (productId: string) => void
    isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
    items: [],
    toggleWishlist: (productId) => set((state) => {
        const index = state.items.indexOf(productId)
        if (index >= 0) {
            return { items: state.items.filter(id => id !== productId) }
        }
        return { items: [...state.items, productId] }
    }),
    isInWishlist: (productId) => get().items.includes(productId),
}))
