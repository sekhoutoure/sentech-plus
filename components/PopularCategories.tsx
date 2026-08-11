'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { assets } from '@/assets/assets'

const popularCategories = [
    {
        title: 'Smartphones',
        query: 'Smartphones',
        image: assets.product_img8,
        badge: 'iOs & Android',
        bg: 'from-white to-[#F6FAFF]'
    },
    {
        title: 'Audio & Casques',
        query: 'Casques',
        image: assets.product_img3,
        badge: 'Réduction Bruit',
        bg: 'from-white to-[#EAF3FF]'
    },
    {
        title: 'Montres Connectées',
        query: 'Montres',
        image: assets.product_img4,
        badge: 'Santé & Sport',
        bg: 'from-white to-[#F3F8FF]'
    },
    {
        title: 'Gaming & Setup',
        query: 'Gaming',
        image: assets.product_img2,
        badge: 'Consoles & VR',
        bg: 'from-white to-[#F6FAFF]'
    },
    {
        title: 'Ordinateurs & Laptops',
        query: 'Laptops',
        image: assets.product_img1,
        badge: 'Pro & Studio',
        bg: 'from-white to-[#EAF3FF]'
    },
    {
        title: 'Maison & Énergie',
        query: 'Accessoires',
        image: assets.product_img5,
        badge: 'Smart Home',
        bg: 'from-white to-[#F3F8FF]'
    }
]

export default function PopularCategories() {
    return (
        <section aria-label="Catégories populaires" className="max-w-[1280px] mx-auto px-3 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#172033]">
                        Catégories populaires
                    </h2>
                    <p className="text-xs text-[#667085]">
                        Explorez nos univers high-tech soigneusement sélectionnés
                    </p>
                </div>
                <Link 
                    href="/shop" 
                    className="text-xs font-semibold text-[#1677FF] hover:text-[#123B78] flex items-center gap-1 transition-colors"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={13} />
                </Link>
            </div>

            {/* Grid 2 cols on Mobile, 3 cols on Tablet, 6 cols on Desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {popularCategories.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/shop?search=${encodeURIComponent(cat.query)}`}
                        className={`group relative bg-gradient-to-br ${cat.bg} rounded-2xl p-3.5 border border-[#E1E8F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)] hover:shadow-[0_8px_30px_rgba(22,119,255,0.12)] hover:border-[#1677FF]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[145px]`}
                    >
                        <div className="space-y-1 relative z-10">
                            <span className="text-[9px] font-bold text-[#1677FF] bg-[#1677FF]/10 px-2 py-0.5 rounded-full border border-[#1677FF]/15 inline-block">
                                {cat.badge}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-[#172033] line-clamp-1 leading-snug">
                                {cat.title}
                            </h3>
                        </div>

                        {/* Floating product preview image right/bottom */}
                        <div className="relative size-16 sm:size-20 self-end -mr-1 -mb-1 mt-2 flex items-center justify-center">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                sizes="80px"
                                className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#1677FF] group-hover:text-[#123B78] transition-colors relative z-10 pt-1">
                            <span>Explorer</span>
                            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
