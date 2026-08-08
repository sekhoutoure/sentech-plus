'use client'
import ShopHeroCollage from "@/components/ShopHeroCollage";
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
            {/* Centered Hero Collage with Omnibox and Category Pills (Shop.app style) */}
            <ShopHeroCollage />

            {/* Curated Collection & Brand Showcase Rails (Shop.app style 3-in-1 cards) */}
            <ShopRails />

            {/* Real Product Catalogue Grids */}
            <LatestProducts />

            {/* Promotional Banner */}
            <PromoBanner />

            {/* Best Sellers */}
            <BestSelling />

            {/* Guarantees & Why SenTech Plus */}
            <OurSpecs />

            {/* Newsletter */}
            <Newsletter />

            {/* WhatsApp Floating Assistance */}
            <WhatsAppButton />
        </div>
    );
}
