'use client'
import PremiumHero from "@/components/PremiumHero";
import PremiumCollections from "@/components/PremiumCollections";
import LatestProducts from "@/components/LatestProducts";
import BestSelling from "@/components/BestSelling";
import PromoBanner from "@/components/PromoBanner";
import OurSpecs from "@/components/OurSpec";
import Newsletter from "@/components/Newsletter";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
    return (
        <div className="bg-[#FCFCFC] min-h-screen">
            {/* 1. HERO (70% main card, 30% secondary cards) */}
            <PremiumHero />

            {/* 2. CATÉGORIES / COLLECTIONS (Clean 6 cards with 1 strong main image each) */}
            <PremiumCollections />

            {/* 3. NOUVEAUTÉS (Max 4 cards per row, spacious grid) */}
            <LatestProducts />

            {/* 4. MEILLEURES VENTES */}
            <BestSelling />

            {/* 5. PROMOTION (Impactful banner with 3 floating products) */}
            <PromoBanner />

            {/* 6. AVANTAGES (Pourquoi SenTech Plus) */}
            <OurSpecs />

            {/* 7. NEWSLETTER (Single large composition) */}
            <Newsletter />

            {/* 8. WHATSAPP BUTTON */}
            <WhatsAppButton />
        </div>
    );
}
