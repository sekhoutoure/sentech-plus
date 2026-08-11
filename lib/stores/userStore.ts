import { create } from 'zustand'

export interface User {
    id: string
    name: string
    email: string
    role: 'user' | 'admin' | 'seller'
    avatar?: string
}

interface UserStore {
    isLoggedIn: boolean
    user: User | null
    login: (payload: Partial<User> & { email: string }) => void
    logout: () => void
    setUserRole: (role: User['role']) => void
}

export const useUserStore = create<UserStore>((set) => ({
    isLoggedIn: false,
    user: null,
    login: (payload) => set({
        isLoggedIn: true,
        user: {
            id: `usr_${Date.now()}`,
            name: payload.name || 'Utilisateur SenTech',
            email: payload.email,
            role: payload.role || 'user',
            avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        }
    }),
    logout: () => set({ isLoggedIn: false, user: null }),
    setUserRole: (role) => set((state) => state.user ? { user: { ...state.user, role } } : state),
}))
