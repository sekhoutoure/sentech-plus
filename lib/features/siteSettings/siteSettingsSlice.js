import { createSlice } from '@reduxjs/toolkit'

const siteSettingsSlice = createSlice({
    name: 'siteSettings',
    initialState: {
        siteName: "SenTech Plus",
        slogan: "La technologie qui simplifie votre quotidien.",
        email: "contact@sentechplus.sn",
        phone: "+221 77 000 00 00",
        address: "Avenue Cheikh Anta Diop, Dakar, Sénégal",
        currencySymbol: " FCFA",
        banner: {
            enabled: true,
            text: "🎉 Jusqu'à 20% de réduction sur votre première commande !",
            buttonText: "Profiter de l'offre",
            couponCode: "NEW20"
        },
        hero: {
            title: "Des accessoires intelligents pour simplifier votre quotidien.",
            subtitle: "Découvrez notre sélection de gadgets, accessoires et équipements high-tech soigneusement sélectionnés pour vous.",
            ctaText: "Acheter maintenant →",
            secondaryCtaText: "Découvrir le catalogue"
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
