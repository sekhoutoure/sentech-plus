'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Percent, Flame } from 'lucide-react'
import { assets } from '@/assets/assets'

const promoDeals = [
    {
        label: "-30%",
        title: "Casques ANC Pro",
        desc: "Réduction exclusive",
        img: assets.product_img3,
        color: "bg-blue-500/20 border-blue-500/30"
    },
    {
        label: "-25%",
        title: "Montres connectées",
        desc: "Édition limitée",
        img: assets.product_img4,
        color: "bg-purple-500/20 border-purple-500/30"
    },
    {
        label: "-20%",
        title: "Enceintes Bluetooth",
        desc: "Son premium high-tech",
        img: assets.product_img5,
        color: "bg-cyan-500/20 border-cyan-500/30"
    },
]

export default function PromoBanner() {
    return (
        <section className="px-3 sm:px-6 my-6 sm:my-14 lg:my-20 max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#071126] text-white border border-slate-800/80 shadow-xl">

                {/* Ambient Glow */}
                <div className="absolute -top-32 -left-32 size-[300px] sm:size-[500px] bg-[#1769FF]/25 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 size-[250px] sm:size-[400px] bg-purple-700/20 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-center p-4 sm:p-10 lg:p-14">

                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-3 sm:space-y-5 text-center lg:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-extrabold text-amber-300">
                            <Flame size={12} className="text-amber-400" />
                            <span>OFFRES LIMITÉES DU MOMENT</span>
                        </div>

                        <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Les bons plans du moment
                        </h2>

                        <p className="text-xs sm:text-base text-slate-300 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal">
                            Profitez de réductions exceptionnelles sur une sélection de produits high-tech.
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-1">
                            {[
                                { val: "−30%", label: "Remise Max" },
                                { val: "200+", label: "En Promo" },
                                { val: "24h", label: "Livraison" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-base sm:text-2xl font-black text-white">{stat.val}</div>
                                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="pt-1 flex items-center justify-center lg:justify-start gap-2 sm:gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-1.5 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3.5 px-4 sm:px-7 rounded-xl sm:rounded-2xl shadow-md active:scale-95 transition-all"
                            >
                                <span>Découvrir</span>
                                <ArrowRight size={13} />
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-1 text-white/80 hover:text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3.5 px-3.5 sm:px-5 rounded-xl sm:rounded-2xl border border-white/15 transition-all"
                            >
                                <Percent size={12} />
                                <span>Promos</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Deal Cards — Grid 1 col mobile / 3 cols desktop (plus d'écrasement !) */}
                    <div className="lg:col-span-6 grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2 lg:pt-0">
                        {promoDeals.map((deal, i) => (
                            <Link
                                key={i}
                                href="/shop"
                                className={`group relative flex items-center xs:flex-col justify-between xs:justify-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${deal.color} backdrop-blur-sm hover:scale-102 transition-all w-full`}
                            >
                                {/* Discount Badge */}
                                <span className="bg-[#F04438] text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                                    {deal.label}
                                </span>

                                {/* Product Image */}
                                <div className="relative size-12 xs:size-16 sm:size-20 rounded-lg bg-white/10 shrink-0">
                                    <Image
                                        src={deal.img}
                                        alt={deal.title}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </div>

                                <div className="text-left xs:text-center flex-1">
                                    <div className="text-xs sm:text-[11px] font-black text-white leading-snug">{deal.title}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{deal.desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
