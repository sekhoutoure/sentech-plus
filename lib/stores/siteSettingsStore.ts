import { create } from 'zustand'

interface SiteSettingsStore {
    siteName: string
    slogan: string
    email: string
    phone: string
    address: string
    currencySymbol: string
    whatsappUrl?: string
    [key: string]: any
    banner: {
        enabled: boolean
        text: string
        buttonText: string
        couponCode: string
    }
    hero: {
        title: string
        subtitle: string
        ctaText: string
        secondaryCtaText: string
    }
    updateSiteSettings: (settings: Partial<Omit<SiteSettingsStore, 'updateSiteSettings' | 'updateBannerSettings' | 'updateHeroSettings'>>) => void
    updateBannerSettings: (banner: Partial<SiteSettingsStore['banner']>) => void
    updateHeroSettings: (hero: Partial<SiteSettingsStore['hero']>) => void
}

export const useSiteSettingsStore = create<SiteSettingsStore>((set) => ({
    siteName: 'SenTech Plus',
    slogan: 'La technologie qui simplifie votre quotidien.',
    email: 'contact@sentechplus.sn',
    phone: '+221 77 000 00 00',
    address: 'Avenue Cheikh Anta Diop, Dakar, Sénégal',
    currencySymbol: ' FCFA',
    banner: {
        enabled: true,
        text: "🎉 Jusqu'à 20% de réduction sur votre première commande !",
        buttonText: "Profiter de l'offre",
        couponCode: 'NEW20',
    },
    hero: {
        title: 'Des accessoires intelligents pour simplifier votre quotidien.',
        subtitle: 'Découvrez notre sélection de gadgets, accessoires et équipements high-tech soigneusement sélectionnés pour vous.',
        ctaText: 'Acheter maintenant →',
        secondaryCtaText: 'Découvrir le catalogue',
    },
    updateSiteSettings: (settings) => set((state) => ({ ...state, ...settings })),
    updateBannerSettings: (banner) => set((state) => ({ banner: { ...state.banner, ...banner } })),
    updateHeroSettings: (hero) => set((state) => ({ hero: { ...state.hero, ...hero } })),
}))
