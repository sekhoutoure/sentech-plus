import { createSlice } from '@reduxjs/toolkit'

// ✅ État initial vide — le catalogue est chargé depuis l'API ou localStorage (StoreProvider)
// Ne jamais initialiser avec des données dummy : elles alourdissent le bundle client
const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        status: 'idle', // 'idle' | 'loading' | 'loaded' | 'error'
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
            state.status = 'loaded'
        },
        addProduct: (state, action) => {
            const newProduct = {
                id: `prod_${Date.now()}`,
                createdAt: new Date().toISOString(),
                rating: [],
                ...action.payload
            }
            state.list.unshift(newProduct)
        },
        updateProduct: (state, action) => {
            const index = state.list.findIndex(p => p.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...action.payload }
            }
        },
        deleteProduct: (state, action) => {
            state.list = state.list.filter(p => p.id !== action.payload)
        },
        clearProduct: (state) => {
            state.list = []
            state.status = 'idle'
        }
    }
})

export const { setProduct, addProduct, updateProduct, deleteProduct, clearProduct } = productSlice.actions

export default productSlice.reducer