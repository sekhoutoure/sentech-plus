// ✅ Server Component — pas de 'use client' ici
// Les sections below-fold sont chargées de façon différée (dynamic imports)
// pour réduire le Script Evaluation time sur le main thread.
import dynamic from 'next/dynamic'
import PremiumHero from '@/components/PremiumHero'
import PopularCategories from '@/components/PopularCategories'

// ─── Sections above-fold : chargées normalement ───
// PremiumHero et PopularCategories sont visibles immédiatement → pas de lazy

// ─── Sections below-fold : lazy-loaded ───
// Chacune a un skeleton de même hauteur pour éviter le layout shift (CLS)
const BestSelling = dynamic(() => import('@/components/BestSelling'), {
    loading: () => (
        <div className="px-3 sm:px-6 max-w-[1280px] mx-auto w-full py-4 sm:py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-full bg-white rounded-2xl border border-[#E1E8F0] p-3 min-h-[260px] animate-pulse" />
                ))}
            </div>
        </div>
    ),
})

const PromoBanner = dynamic(() => import('@/components/PromoBanner'), {
    loading: () => <div className="h-48 mx-3 sm:mx-6 rounded-3xl bg-[#EAF3FF] animate-pulse" />,
})

const LatestProducts = dynamic(() => import('@/components/LatestProducts'), {
    loading: () => (
        <div className="px-3 sm:px-6 max-w-[1280px] mx-auto w-full py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-full bg-white rounded-2xl border border-[#E1E8F0] p-3 min-h-[260px] animate-pulse" />
                ))}
            </div>
        </div>
    ),
})

const OurSpecs = dynamic(() => import('@/components/OurSpec'), {
    loading: () => <div className="h-40 mx-3 sm:mx-6 rounded-3xl bg-white border border-[#E1E8F0] animate-pulse" />,
})

const Newsletter = dynamic(() => import('@/components/Newsletter'), {
    loading: () => <div className="h-32 mx-3 sm:mx-6 rounded-3xl bg-[#EAF3FF] animate-pulse" />,
})

export default function Home() {
    return (
        <div className="bg-[#F6F9FD] min-h-screen space-y-4 sm:space-y-8 lg:space-y-10">
            {/* 1. HERO — critique, chargé immédiatement */}
            <PremiumHero />

            {/* 2. CATÉGORIES — above-fold sur desktop */}
            <PopularCategories />

            {/* 3-7. SECTIONS BELOW-FOLD — chargées après hydratation */}
            {/* content-visibility:auto appliqué via CSS sur ces sections */}
            <BestSelling />
            <PromoBanner />
            <LatestProducts />
            <OurSpecs />
            <Newsletter />
        </div>
    )
}
