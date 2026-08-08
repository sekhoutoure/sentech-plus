'use client'
import CategoryNav from "@/components/CategoryNav";
import OmniboxSearch from "@/components/OmniboxSearch";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import LatestProducts from "@/components/LatestProducts";
import PromoBanner from "@/components/PromoBanner";
import BestSelling from "@/components/BestSelling";
import OurSpecs from "@/components/OurSpec";
import Newsletter from "@/components/Newsletter";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
    return (
        <div className="bg-[#F7F9FC] min-h-screen">
            <CategoryNav />
            <div className="px-4 sm:px-6 pt-3 pb-1 max-w-[1400px] mx-auto">
                <OmniboxSearch />
            </div>
            <Hero />
            <CategorySection />
            <LatestProducts />
            <PromoBanner />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
            <WhatsAppButton />
        </div>
    );
}
