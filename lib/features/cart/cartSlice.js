import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        itemCount: 0,  // ✅ Renommé pour clarté — c'est un COMPTEUR d'articles, pas un prix
        cartItems: {},
        isDrawerOpen: false,
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.itemCount += 1
            state.isDrawerOpen = true
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId] && state.cartItems[productId] > 0) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
                state.itemCount = Math.max(0, state.itemCount - 1)
            }
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            const qty = state.cartItems[productId] || 0
            state.itemCount = Math.max(0, state.itemCount - qty)
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.itemCount = 0
        },
        openDrawer: (state) => {
            state.isDrawerOpen = true
        },
        closeDrawer: (state) => {
            state.isDrawerOpen = false
        },
        toggleDrawer: (state) => {
            state.isDrawerOpen = !state.isDrawerOpen
        }
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, openDrawer, closeDrawer, toggleDrawer } = cartSlice.actions

export default cartSlice.reducer
