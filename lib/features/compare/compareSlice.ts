import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CompareState {
  items: string[] // Liste des IDs de produits comparés (Max 3)
}

const getInitialItems = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem('sentech_compare_items')
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    return []
  }
}

const initialState: CompareState = {
  items: getInitialItems(),
}

export const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload
      const index = state.items.indexOf(productId)
      if (index >= 0) {
        state.items.splice(index, 1)
      } else {
        if (state.items.length >= 3) {
          state.items.shift() // Garder maximum 3 éléments en supprimant le plus ancien
        }
        state.items.push(productId)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('sentech_compare_items', JSON.stringify(state.items))
      }
    },
    removeFromCompare: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter(id => id !== action.payload.productId)
      if (typeof window !== 'undefined') {
        localStorage.setItem('sentech_compare_items', JSON.stringify(state.items))
      }
    },
    clearCompare: (state) => {
      state.items = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sentech_compare_items')
      }
    },
  },
})

export const { toggleCompare, removeFromCompare, clearCompare } = compareSlice.actions
export default compareSlice.reducer
