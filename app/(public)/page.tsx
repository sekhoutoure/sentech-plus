'use client'
import PremiumHero from "@/components/PremiumHero";
import BestSelling from "@/components/BestSelling";
import PromoBanner from "@/components/PromoBanner";
import LatestProducts from "@/components/LatestProducts";
import OurSpecs from "@/components/OurSpec";
import Newsletter from "@/components/Newsletter";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
    return (
        <div className="bg-[#FCFCFC] min-h-screen space-y-6 sm:space-y-12 lg:space-y-16">
            {/* 1. HERO (Compact sur mobile 200-250px, sans cartes secondaires) */}
            <PremiumHero />

            {/* 3. MEILLEURES VENTES */}
            <BestSelling />

            {/* 4. OFFRES DU MOMENT */}
            <PromoBanner />

            {/* 5. NOUVEAUTÉS */}
            <LatestProducts />

            {/* 6. POURQUOI SENTECH PLUS (Grille 2x2 sur mobile) */}
            <OurSpecs />

            {/* 7. NEWSLETTER (Compact VIP) */}
            <Newsletter />

            {/* 8. WHATSAPP BUTTON */}
            <WhatsAppButton />
        </div>
    );
}
