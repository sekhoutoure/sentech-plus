import { createSlice } from '@reduxjs/toolkit'

const siteSettingsSlice = createSlice({
    name: 'siteSettings',
    initialState: {
        siteName: "SenTech Plus",
        slogan: "Smart Accessories & High-Tech Products",
        email: "contact@sentechplus.com",
        phone: "+1-212-456-7890",
        address: "794 Francisco Street, San Francisco, CA 94102",
        currencySymbol: "$",
        banner: {
            enabled: true,
            text: "✨ Obtenez 20% de réduction sur votre première commande !",
            buttonText: "Profiter de l'offre",
            couponCode: "NEW20"
        },
        hero: {
            title: "Des accessoires intelligents pour sublimer votre quotidien.",
            subtitle: "Découvrez notre collection exclusive d'écouteurs, montres et enceintes connectées.",
            ctaText: "Acheter maintenant"
        }
    },
    reducers: {
        updateSiteSettings: (state, action) => {
            return { ...state, ...action.payload }
        },
        updateBannerSettings: (state, action) => {
            state.banner = { ...state.banner, ...action.payload }
        },
        updateHeroSettings: (state, action) => {
            state.hero = { ...state.hero, ...action.payload }
        }
    }
})

export const { updateSiteSettings, updateBannerSettings, updateHeroSettings } = siteSettingsSlice.actions
export default siteSettingsSlice.reducer
