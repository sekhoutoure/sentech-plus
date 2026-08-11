import { create } from 'zustand'

interface CartItems {
    [productId: string]: number
}

interface CartStore {
    itemCount: number
    cartItems: CartItems
    isDrawerOpen: boolean
    addToCart: (productId: string) => void
    removeFromCart: (productId: string) => void
    deleteItemFromCart: (productId: string) => void
    clearCart: () => void
    openDrawer: () => void
    closeDrawer: () => void
    toggleDrawer: () => void
}

export const useCartStore = create<CartStore>((set) => ({
    itemCount: 0,
    cartItems: {},
    isDrawerOpen: false,

    addToCart: (productId) => set((state) => {
        const newItems = { ...state.cartItems }
        newItems[productId] = (newItems[productId] || 0) + 1
        return { cartItems: newItems, itemCount: state.itemCount + 1, isDrawerOpen: true }
    }),

    removeFromCart: (productId) => set((state) => {
        const newItems = { ...state.cartItems }
        if (newItems[productId] && newItems[productId] > 0) {
            newItems[productId]--
            if (newItems[productId] === 0) delete newItems[productId]
            return { cartItems: newItems, itemCount: Math.max(0, state.itemCount - 1) }
        }
        return state
    }),

    deleteItemFromCart: (productId) => set((state) => {
        const newItems = { ...state.cartItems }
        const qty = newItems[productId] || 0
        delete newItems[productId]
        return { cartItems: newItems, itemCount: Math.max(0, state.itemCount - qty) }
    }),

    clearCart: () => set({ cartItems: {}, itemCount: 0 }),
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),
    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}))
