'use client'
import CategoryNav from "@/components/CategoryNav";
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
