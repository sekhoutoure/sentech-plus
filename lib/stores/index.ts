// ─── Zustand Stores — SenTechPLUS ────────────────────────────────────────────
// Point d'entrée unique pour tous les stores.
// Import depuis ici pour bénéficier du tree-shaking optimal.
// ─────────────────────────────────────────────────────────────────────────────
export { useProductStore } from './productStore'
export type { Product } from './productStore'

export { useCartStore } from './cartStore'

export { useAddressStore } from './addressStore'
export type { Address } from './addressStore'

export { useRatingStore } from './ratingStore'
export type { Rating } from './ratingStore'

export { useWishlistStore } from './wishlistStore'

export { useCompareStore } from './compareStore'

export { useSiteSettingsStore } from './siteSettingsStore'

export { useUserStore } from './userStore'
export type { User } from './userStore'
