'use client'
import ShopHeroCollage from "@/components/ShopHeroCollage";
import ShopQuadrantGrid from "@/components/ShopQuadrantGrid";
import ShopRails from "@/components/ShopRails";
import LatestProducts from "@/components/LatestProducts";
import PromoBanner from "@/components/PromoBanner";
import BestSelling from "@/components/BestSelling";
import OurSpecs from "@/components/OurSpec";
import Newsletter from "@/components/Newsletter";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
    return (
        <div className="bg-[#FCFCFC] min-h-screen">
            {/* 1. Hero with Centered Logo, Floating Gadgets with Ratings & Omnibox */}
            <ShopHeroCollage />

            {/* 2. Shop.app Signature 4-Quadrant Category Tiles (2x2) */}
            <ShopQuadrantGrid />

            {/* 3. Shop.app Signature 3-in-1 Brand & Collection Rails */}
            <ShopRails />

            {/* 4. Real Product Catalogue (Dernières arrivées en FCFA) */}
            <LatestProducts />

            {/* 5. Night Blue Promo Banner */}
            <PromoBanner />

            {/* 6. Best Sellers Grid */}
            <BestSelling />

            {/* 7. Why SenTech Plus (Dakar Delivery, Guarantees) */}
            <OurSpecs />

            {/* 8. VIP Newsletter */}
            <Newsletter />

            {/* 9. Floating WhatsApp Assistance */}
            <WhatsAppButton />
        </div>
    );
}
