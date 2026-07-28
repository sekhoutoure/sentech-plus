import { createSlice } from '@reduxjs/toolkit'


const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        addRating: (state, action) => {
            const { userId, productId } = action.payload
            // ✅ Déduplication : un utilisateur ne peut noter un produit qu'une seule fois
            const existingIndex = state.ratings.findIndex(
                r => r.userId === userId && r.productId === productId
            )
            if (existingIndex !== -1) {
                // Mettre à jour l'avis existant
                state.ratings[existingIndex] = { ...state.ratings[existingIndex], ...action.payload }
            } else {
                state.ratings.push({ ...action.payload, createdAt: new Date().toISOString() })
            }
        },
    }
})

export const { addRating } = ratingSlice.actions

export default ratingSlice.reducer