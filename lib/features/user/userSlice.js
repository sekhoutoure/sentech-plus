import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false, // L'utilisateur doit se connecter explicitement
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true
            state.user = {
                id: `usr_${Date.now()}`,
                name: action.payload.name || 'Utilisateur SenTech',
                email: action.payload.email,
                role: action.payload.role || 'user',
                avatar: action.payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
            }
        },
        logout: (state) => {
            state.isLoggedIn = false
            state.user = null
        },
        setUserRole: (state, action) => {
            if (state.user) {
                state.user.role = action.payload
            }
        }
    }
})

export const { login, logout, setUserRole } = userSlice.actions
export default userSlice.reducer
