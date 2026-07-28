import { addressDummyData } from '@/assets/assets'
import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [addressDummyData],
    },
    reducers: {
        addAddress: (state, action) => {
            const newAddress = {
                id: `addr_${Date.now()}`,
                ...action.payload
            }
            state.list.push(newAddress)
        },
        updateAddress: (state, action) => {
            const { id, ...updates } = action.payload
            const index = state.list.findIndex(a => a.id === id)
            if (index !== -1) {
                state.list[index] = { ...state.list[index], ...updates }
            }
        },
        deleteAddress: (state, action) => {
            state.list = state.list.filter(a => a.id !== action.payload)
        },
    }
})

export const { addAddress, updateAddress, deleteAddress } = addressSlice.actions

export default addressSlice.reducer