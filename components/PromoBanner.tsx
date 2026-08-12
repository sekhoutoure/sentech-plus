'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Flame } from 'lucide-react'
import { assets } from '@/assets/assets'

const promoDeals = [
    {
        label: "-30%",
        title: "Casques ANC",
        desc: "Réduction de bruit",
        img: assets.product_img2
    },
    {
        label: "-25%",
        title: "Montres Connectées",
        desc: "Suivi santé 24/7",
        img: assets.product_img4
    },
    {
        label: "-20%",
        title: "Enceintes Bluetooth",
        desc: "Son premium high-tech",
        img: assets.product_img5
    },
]

export default function PromoBanner() {
    return (
        <section aria-label="Offres du moment" className="px-3 sm:px-6 my-4 max-w-[1280px] mx-auto w-full">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#F3F8FF] via-[#EAF3FF] to-white text-[#172033] border border-[#E1E8F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)]">

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-10 items-center p-4 sm:p-10 lg:p-12">

                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#0F56C6]/20 text-xs font-bold text-[#0F56C6]">
                            <Flame size={13} className="text-[#C2410C]" />
                            <span>OFFRES DU MOMENT</span>
                        </div>

                        <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#172033] tracking-tight leading-tight">
                            Jusqu'à -30% sur la High-Tech
                        </h2>

                        <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
                            Sélection de réductions exclusives et livraison rapide.
                        </p>

                        {/* CTA */}
                        <div className="pt-1 flex items-center justify-center lg:justify-start gap-2">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-[#123B78] text-white font-semibold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                            >
                                <span>Découvrir les offres</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Deal Cards */}
                    <div className="lg:col-span-6 flex lg:grid grid-cols-3 gap-3 overflow-x-auto py-1 no-scrollbar pt-2 lg:pt-0">
                        {promoDeals.map((deal, i) => (
                            <Link
                                key={i}
                                href="/shop"
                                className="group relative flex items-center gap-2.5 p-3 rounded-2xl border border-[#E1E8F0] bg-white shadow-2xs hover:shadow-md hover:border-[#1677FF]/40 transition-all shrink-0 w-[160px] sm:w-auto"
                            >
                                {/* Product Image */}
                                <div className="relative size-12 sm:size-16 rounded-xl bg-[#F6FAFF] shrink-0 border border-[#E1E8F0]">
                                    <Image
                                        src={deal.img}
                                        alt={deal.title}
                                        fill
                                        sizes="(max-width: 640px) 48px, 64px"
                                        className="object-contain p-1 group-hover:scale-105 transition-transform"
                                    />
                                </div>

                                <div className="text-left flex-1 min-w-0">
                                    <span className="bg-[#C2410C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                                        {deal.label}
                                    </span>
                                    <div className="text-xs font-bold text-[#172033] leading-tight truncate">{deal.title}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
