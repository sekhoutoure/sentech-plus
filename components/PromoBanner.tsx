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
        <section className="px-3 sm:px-6 my-4 sm:my-14 lg:my-20 max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#071426] text-white border border-[#0B2342] shadow-lg">

                {/* Ambient Glow */}
                <div className="absolute -top-32 -left-32 size-[250px] sm:size-[500px] bg-[#007BFF]/20 rounded-full blur-[70px] sm:blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 size-[200px] sm:size-[400px] bg-[#0088D8]/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-10 items-center p-3.5 sm:p-10 lg:p-14">

                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-2 sm:space-y-5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] sm:text-xs font-extrabold text-[#0088D8]">
                            <Flame size={11} className="text-[#007BFF]" />
                            <span>OFFRES DU MOMENT</span>
                        </div>

                        <h2 className="text-lg sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Jusqu'à -30% sur la High-Tech
                        </h2>

                        <p className="text-[11px] sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
                            Sélection de réductions exclusives et livraison rapide.
                        </p>

                        {/* CTA */}
                        <div className="pt-0.5 flex items-center justify-center lg:justify-start gap-2">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-1 bg-[#007BFF] hover:bg-[#0069D9] text-white font-extrabold text-xs sm:text-sm py-2 sm:py-3.5 px-4 sm:px-7 rounded-xl sm:rounded-2xl shadow-md active:scale-95 transition-all"
                            >
                                <span>Découvrir les offres</span>
                                <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Deal Cards — Grid horizontal scroll / 3 cols desktop */}
                    <div className="lg:col-span-6 flex lg:grid grid-cols-3 gap-2 overflow-x-auto py-1 no-scrollbar pt-1 lg:pt-0">
                        {promoDeals.map((deal, i) => (
                            <Link
                                key={i}
                                href="/shop"
                                className={`group relative flex items-center gap-2 p-2 sm:p-4 rounded-xl border ${deal.color} backdrop-blur-sm hover:scale-102 transition-all shrink-0 w-[145px] sm:w-auto`}
                            >
                                {/* Product Image */}
                                <div className="relative size-10 sm:size-16 rounded-lg bg-white/10 shrink-0">
                                    <Image
                                        src={deal.img}
                                        alt={deal.title}
                                        fill
                                        className="object-contain p-0.5"
                                    />
                                </div>

                                <div className="text-left flex-1 min-w-0">
                                    <span className="bg-[#F04438] text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full inline-block mb-0.5">
                                        {deal.label}
                                    </span>
                                    <div className="text-[10px] sm:text-[11px] font-black text-white leading-tight truncate">{deal.title}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
