'use client'
import PremiumHero from "@/components/PremiumHero"
import PopularCategories from "@/components/PopularCategories"
import BestSelling from "@/components/BestSelling"
import PromoBanner from "@/components/PromoBanner"
import LatestProducts from "@/components/LatestProducts"
import OurSpecs from "@/components/OurSpec"
import Newsletter from "@/components/Newsletter"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Home() {
    return (
        <div className="bg-[#F6F9FD] min-h-screen space-y-4 sm:space-y-8 lg:space-y-10">
            {/* 1. HERO (Soft gradient light high-tech) */}
            <PremiumHero />

            {/* 2. CATÉGORIES POPULAIRES (Grille 6 cartes / 2 cols mobile) */}
            <PopularCategories />

            {/* 3. MEILLEURES VENTES */}
            <BestSelling />

            {/* 4. OFFRES DU MOMENT */}
            <PromoBanner />

            {/* 5. NOUVEAUTÉS */}
            <LatestProducts />

            {/* 6. POURQUOI SENTECHPLUS (4 Engagements 2x2 mobile) */}
            <OurSpecs />

            {/* 7. NEWSLETTER (VIP Light Card) */}
            <Newsletter />

            {/* 8. WHATSAPP BUTTON (Circular 52px mobile above dock) */}
            <WhatsAppButton />
        </div>
    )
}
