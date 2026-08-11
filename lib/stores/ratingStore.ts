import { create } from 'zustand'

export interface Rating {
    userId: string
    productId: string
    score: number
    comment?: string
    createdAt?: string
    [key: string]: any
}

interface RatingStore {
    ratings: Rating[]
    addRating: (rating: Rating) => void
}

export const useRatingStore = create<RatingStore>((set) => ({
    ratings: [],
    addRating: (rating) => set((state) => {
        const existingIndex = state.ratings.findIndex(
            r => r.userId === rating.userId && r.productId === rating.productId
        )
        if (existingIndex !== -1) {
            const newRatings = [...state.ratings]
            newRatings[existingIndex] = { ...newRatings[existingIndex], ...rating }
            return { ratings: newRatings }
        }
        return { ratings: [...state.ratings, { ...rating, createdAt: new Date().toISOString() }] }
    }),
}))
