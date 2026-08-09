'use client'
import React from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { ArrowRight } from 'lucide-react'
import { assets } from '@/assets/assets'

interface CollectionCard {
    title: string;
    description: string;
    query: string;
    image: string | StaticImageData;
    badge?: string;
    bgGradient: string;
}

export default function PremiumCollections() {
    const collections: CollectionCard[] = [
        {
            title: "Smartphones",
            description: "iPhone, Samsung & téléphones récents",
            query: "Smartphones",
            image: assets.product_img8,
            badge: "Top Vente",
            bgGradient: "from-[#071126] via-[#0D1F42] to-[#071126]"
        },
        {
            title: "Audio & Casques",
            description: "Réduction de bruit ANC & son immersif",
            query: "Casques",
            image: assets.product_img3,
            badge: "Populaire",
            bgGradient: "from-[#0B1A3A] via-[#122A5C] to-[#0B1A3A]"
        },
        {
            title: "Montres connectées",
            description: "Suivi santé, sport & écrans AMOLED",
            query: "Montres",
            image: assets.product_img4,
            badge: "Tendance",
            bgGradient: "from-[#110B2A] via-[#21164C] to-[#110B2A]"
        },
        {
            title: "Gaming & Setup",
            description: "Souris, claviers RGB & performance",
            query: "Gaming",
            image: assets.product_img1,
            badge: "Esport",
            bgGradient: "from-[#2A0B12] via-[#4C1623] to-[#2A0B12]"
        },
        {
            title: "Ordinateurs & Laptops",
            description: "Processeurs puissants & bureautique",
            query: "Laptops",
            image: assets.product_img7,
            badge: "Performance",
            bgGradient: "from-[#0B2A24] via-[#164C42] to-[#0B2A24]"
        },
        {
            title: "Maison & Énergie",
            description: "Chargeurs GaN & smart home",
            query: "Maison",
            image: assets.product_img2,
            badge: "Énergie",
            bgGradient: "from-[#1F2937] via-[#374151] to-[#1F2937]"
        }
    ];

    return (
        <section className="px-3 sm:px-6 my-6 sm:my-14 lg:my-20 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-end justify-between gap-4 mb-4 sm:mb-8 pb-3 border-b border-[#EBEBEB]">
                <div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-[#1769FF] uppercase tracking-widest block mb-0.5">
                        NOS COLLECTIONS EXCLUSIVES
                    </span>
                    <h2 className="text-lg sm:text-2xl lg:text-4xl font-black text-[#101828] tracking-tight">
                        Catégories & Équipements
                    </h2>
                </div>
                <Link
                    href="/shop"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1769FF] hover:underline"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={14} />
                </Link>
            </div>

            {/* Grid — 1 col mobile compact (h-auto / min-h-[140px]), 2 cols tablet, 3 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                {collections.map((col, idx) => (
                    <Link
                        key={idx}
                        href={`/shop?search=${encodeURIComponent(col.query)}`}
                        className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${col.bgGradient} text-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-white/10
                            h-36 xs:h-40 sm:h-64 lg:h-72 p-4 sm:p-7`}
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 size-32 sm:size-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Left Info */}
                        <div className="relative z-10 space-y-1 max-w-[65%]">
                            {col.badge && (
                                <span className="inline-block bg-white/15 backdrop-blur-md text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white/20">
                                    {col.badge}
                                </span>
                            )}
                            <h3 className="text-base xs:text-lg sm:text-[22px] lg:text-[26px] font-black tracking-tight text-white leading-tight">
                                {col.title}
                            </h3>
                            <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-2 hidden sm:block">
                                {col.description}
                            </p>
                        </div>

                        {/* CTA Bottom Left */}
                        <div className="relative z-10 pt-1">
                            <span className="inline-flex items-center gap-1 bg-white text-[#101828] text-[10px] sm:text-xs font-extrabold px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl group-hover:bg-[#1769FF] group-hover:text-white transition-all shadow-xs">
                                <span>Explorer</span>
                                <ArrowRight size={11} />
                            </span>
                        </div>

                        {/* Product Image Right */}
                        <div className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 size-20 xs:size-24 sm:size-32 lg:size-40 rounded-xl sm:rounded-2xl bg-white p-1.5 sm:p-3 group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none shadow-lg flex items-center justify-center border border-white/20 overflow-hidden">
                            <Image
                                src={col.image}
                                alt={col.title}
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
