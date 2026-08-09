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
            description: "iPhone, Samsung & récents",
            query: "Smartphones",
            image: assets.product_img8,
            badge: "Top",
            bgGradient: "from-[#071126] via-[#0D1F42] to-[#071126]"
        },
        {
            title: "Audio & Casques",
            description: "Réduction de bruit ANC",
            query: "Casques",
            image: assets.product_img3,
            badge: "Populaire",
            bgGradient: "from-[#0B1A3A] via-[#122A5C] to-[#0B1A3A]"
        },
        {
            title: "Montres",
            description: "Suivi santé & AMOLED",
            query: "Montres",
            image: assets.product_img4,
            badge: "Tendance",
            bgGradient: "from-[#110B2A] via-[#21164C] to-[#110B2A]"
        },
        {
            title: "Gaming",
            description: "Souris & claviers RGB",
            query: "Gaming",
            image: assets.product_img1,
            badge: "Esport",
            bgGradient: "from-[#2A0B12] via-[#4C1623] to-[#2A0B12]"
        },
        {
            title: "Laptops",
            description: "Processeurs puissants",
            query: "Laptops",
            image: assets.product_img7,
            badge: "Pro",
            bgGradient: "from-[#0B2A24] via-[#164C42] to-[#0B2A24]"
        },
        {
            title: "Smart Home",
            description: "Chargeurs & énergie",
            query: "Maison",
            image: assets.product_img2,
            badge: "Énergie",
            bgGradient: "from-[#1F2937] via-[#374151] to-[#1F2937]"
        }
    ];

    return (
        <section className="px-3 sm:px-6 my-6 sm:my-14 lg:my-20 max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex items-end justify-between gap-4 mb-3 sm:mb-8 pb-2.5 border-b border-[#EBEBEB]">
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1769FF] hover:underline"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={13} />
                </Link>
            </div>

            {/* Grid — 2 COLONNES sur mobile, 3 colonnes sur desktop, hauteur 115-130px sur mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 lg:gap-6">
                {collections.map((col, idx) => (
                    <Link
                        key={idx}
                        href={`/shop?search=${encodeURIComponent(col.query)}`}
                        className={`group relative rounded-xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${col.bgGradient} text-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 border border-white/10
                            h-[115px] xs:h-[130px] sm:h-64 lg:h-72 p-3 sm:p-7`}
                    >
                        {/* Left Info */}
                        <div className="relative z-10 space-y-0.5 max-w-[62%]">
                            {col.badge && (
                                <span className="inline-block bg-white/15 backdrop-blur-md text-white text-[8px] xs:text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full border border-white/20">
                                    {col.badge}
                                </span>
                            )}
                            <h3 className="text-xs xs:text-sm sm:text-[22px] lg:text-[26px] font-black tracking-tight text-white leading-snug">
                                {col.title}
                            </h3>
                            <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-1 hidden sm:block">
                                {col.description}
                            </p>
                        </div>

                        {/* CTA Bottom Left */}
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-1 bg-white text-[#101828] text-[9px] xs:text-[10px] sm:text-xs font-extrabold px-2 xs:px-2.5 sm:px-4 py-0.5 sm:py-2 rounded sm:rounded-xl group-hover:bg-[#1769FF] group-hover:text-white transition-all shadow-xs">
                                <span>Explorer</span>
                                <ArrowRight size={10} />
                            </span>
                        </div>

                        {/* Product Image Right */}
                        <div className="absolute right-1.5 bottom-1.5 sm:right-4 sm:bottom-4 size-14 xs:size-18 sm:size-32 lg:size-40 rounded-lg sm:rounded-2xl bg-white p-1 sm:p-3 group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none shadow-md flex items-center justify-center border border-white/20 overflow-hidden">
                            <Image
                                src={col.image}
                                alt={col.title}
                                fill
                                className="object-contain p-0.5 sm:p-1"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
