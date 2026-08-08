'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { assets } from '@/assets/assets'

export default function CategorySection() {
    const categories = [
        {
            title: "Smartphones",
            subtitle: "Derniers modèles & écrans",
            image: assets.product_img8,
            query: "Smartphones",
            emoji: "📱"
        },
        {
            title: "Ordinateurs",
            subtitle: "Laptops & bureautique",
            image: assets.product_img7,
            query: "Laptops",
            emoji: "💻"
        },
        {
            title: "Audio & Casques",
            subtitle: "Casques & écouteurs sans fil",
            image: assets.product_img3,
            query: "Casques",
            emoji: "🎧"
        },
        {
            title: "Montres connectées",
            subtitle: "Smartwatches & fitness",
            image: assets.product_img4,
            query: "Montres",
            emoji: "⌚"
        },
        {
            title: "Gaming",
            subtitle: "Souris, claviers & manettes",
            image: assets.product_img1,
            query: "Gaming",
            emoji: "🎮"
        },
        {
            title: "Enceintes",
            subtitle: "Son puissant & nomade",
            image: assets.product_img5,
            query: "Enceintes",
            emoji: "🔊"
        },
        {
            title: "Accessoires & Câbles",
            subtitle: "Chargeurs rapides & hubs",
            image: assets.product_img2,
            query: "Accessoires",
            emoji: "🔌"
        },
        {
            title: "Smart Home",
            subtitle: "Maison intelligente & lampes",
            image: assets.product_img6,
            query: "Maison",
            emoji: "🏠"
        },
    ];

    return (
        <section className="px-4 sm:px-6 my-16 sm:my-20 max-w-[1400px] mx-auto">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E4E7EC] mb-8">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[11px] font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={12} /> Rayons Officiels
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
                        Découvrez nos catégories
                    </h2>
                    <p className="text-xs sm:text-sm text-[#667085] mt-1">
                        Explorez tout notre écosystème high-tech certifié et garanti.
                    </p>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1769FF] hover:text-[#1256D6] bg-[#EAF3FF] hover:bg-blue-100 px-4 py-2 rounded-full transition self-start sm:self-auto"
                >
                    <span>Explorer toute la boutique</span>
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Category Cards Grid (4 cols on desktop, 2 cols on mobile) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((cat, index) => (
                    <Link
                        key={index}
                        href={`/shop?search=${encodeURIComponent(cat.query)}`}
                        className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-[#E4E7EC] shadow-2xs hover:shadow-xl hover:border-[#1769FF]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                        {/* Image Container with subtle zoom */}
                        <div className="relative w-full h-32 sm:h-40 rounded-xl overflow-hidden bg-[#F7F9FC] flex items-center justify-center p-2 mb-3">
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out rounded-lg"
                            />
                        </div>

                        {/* Title & Arrow */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-[#101828] group-hover:text-[#1769FF] transition-colors leading-snug">
                                    {cat.title}
                                </h3>
                                <p className="text-[11px] text-[#667085] line-clamp-1">
                                    {cat.subtitle}
                                </p>
                            </div>

                            <div className="size-7 rounded-full bg-[#F7F9FC] group-hover:bg-[#1769FF] group-hover:text-white flex items-center justify-center text-[#667085] transition-colors shrink-0">
                                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
