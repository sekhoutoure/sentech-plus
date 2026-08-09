'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Percent, Flame } from 'lucide-react'
import { assets } from '@/assets/assets'

const promoDeals = [
    {
        label: "-30%",
        title: "Casques ANC",
        desc: "Réduction de bruit",
        img: assets.product_img2,
        color: "bg-[#0B2342]/80 border-[#C8CDD3]/20"
    },
    {
        label: "-25%",
        title: "Montres connectées",
        desc: "Suivi santé 24/7",
        img: assets.product_img4,
        color: "bg-[#0B2342]/80 border-[#C8CDD3]/20"
    },
    {
        label: "-20%",
        title: "Enceintes Bluetooth",
        desc: "Son premium high-tech",
        img: assets.product_img5,
        color: "bg-[#0B2342]/80 border-[#C8CDD3]/20"
    },
]

export default function PromoBanner() {
    return (
        <section className="px-1.5 sm:px-6 my-3 sm:my-8 lg:my-12 max-w-[1400px] mx-auto w-full">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#EAF3FF] via-white to-[#F8FBFF] text-[#182230] border border-[#E8EDF3] shadow-xs">

                {/* Subtle Ambient Glow */}
                <div className="absolute -top-32 -left-32 size-[250px] sm:size-[500px] bg-[#1677FF]/10 rounded-full blur-[70px] sm:blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 size-[200px] sm:size-[400px] bg-[#EAF3FF] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-10 items-center p-3.5 sm:p-10 lg:p-14">

                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-2 sm:space-y-5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#1677FF]/20 text-[9px] sm:text-xs font-extrabold text-[#1677FF]">
                            <Flame size={11} className="text-[#FF6B35]" />
                            <span>OFFRES DU MOMENT</span>
                        </div>

                        <h2 className="text-lg sm:text-4xl lg:text-5xl font-black text-[#182230] tracking-tight leading-tight">
                            Jusqu'à -30% sur la High-Tech
                        </h2>

                        <p className="text-[11px] sm:text-base text-[#667085] max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
                            Sélection de réductions exclusives et livraison rapide.
                        </p>

                        {/* CTA */}
                        <div className="pt-0.5 flex items-center justify-center lg:justify-start gap-2">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-1 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs sm:text-sm py-2 sm:py-3.5 px-4 sm:px-7 rounded-xl sm:rounded-2xl shadow-md active:scale-95 transition-all"
                            >
                                <span>Découvrir les offres</span>
                                <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Deal Cards */}
                    <div className="lg:col-span-6 flex lg:grid grid-cols-3 gap-2 overflow-x-auto py-1 no-scrollbar pt-1 lg:pt-0">
                        {promoDeals.map((deal, i) => (
                            <Link
                                key={i}
                                href="/shop"
                                className="group relative flex items-center gap-2 p-2 sm:p-4 rounded-xl border border-[#E8EDF3] bg-white shadow-2xs hover:shadow-md transition-all shrink-0 w-[145px] sm:w-auto"
                            >
                                {/* Product Image */}
                                <div className="relative size-10 sm:size-16 rounded-lg bg-[#F5F7FA] shrink-0 border border-[#E8EDF3]/60">
                                    <Image
                                        src={deal.img}
                                        alt={deal.title}
                                        fill
                                        sizes="(max-width: 640px) 40px, 64px"
                                        className="object-contain p-0.5"
                                    />
                                </div>

                                <div className="text-left flex-1 min-w-0">
                                    <span className="bg-[#FF6B35] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full inline-block mb-0.5">
                                        {deal.label}
                                    </span>
                                    <div className="text-[10px] sm:text-[11px] font-black text-[#182230] leading-tight truncate">{deal.title}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
