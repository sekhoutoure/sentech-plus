import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [], // Array of productIds
    },
    reducers: {
        toggleWishlist: (state, action) => {
            const { productId } = action.payload
            const index = state.items.indexOf(productId)
            if (index >= 0) {
                state.items.splice(index, 1)
            } else {
                state.items.push(productId)
            }
        },
    }
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
