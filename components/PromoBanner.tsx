'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, Tag, Percent, Flame, Zap } from 'lucide-react'
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
        desc: "Son premium",
        img: assets.product_img5,
        color: "bg-cyan-500/20 border-cyan-500/30"
    },
]

export default function PromoBanner() {
    return (
        <section className="px-4 sm:px-6 my-16 sm:my-24 max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#071126] text-white border border-slate-800/80 shadow-2xl">

                {/* Ambient Glow Orbs */}
                <div className="absolute -top-32 -left-32 size-[500px] bg-[#1769FF]/25 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 size-[400px] bg-purple-700/20 rounded-full blur-[100px] pointer-events-none" />

                {/* Subtle diagonal lines texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px'
                }} />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center p-8 sm:p-12 lg:p-14">

                    {/* Left Copy */}
                    <div className="lg:col-span-6 space-y-5">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold text-amber-300">
                            <Flame size={13} className="text-amber-400" />
                            <span>OFFRES LIMITÉES DU MOMENT</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]" style={{ textWrap: 'balance' } as React.CSSProperties}>
                            Les bons plans du moment
                        </h2>

                        <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed font-normal" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                            Profitez de réductions exceptionnelles sur une sélection de produits high-tech soigneusement choisis pour vous.
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 pt-1">
                            {[
                                { val: "−30%", label: "Max de remise" },
                                { val: "200+", label: "Produits soldés" },
                                { val: "24h", label: "Livraison Dakar" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-xl sm:text-2xl font-black text-white">{stat.val}</div>
                                    <div className="text-[10px] text-slate-400 font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="pt-1 flex flex-wrap items-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-sm py-3.5 px-7 rounded-2xl shadow-lg shadow-[#1769FF]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                            >
                                <span>Découvrir les offres</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm py-3.5 px-5 rounded-2xl border border-white/15 hover:border-white/30 transition-all duration-200"
                            >
                                <Percent size={14} />
                                <span>Voir les promos</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Deal Cards */}
                    <div className="lg:col-span-6 flex items-center justify-center gap-3 sm:gap-4">
                        {promoDeals.map((deal, i) => (
                            <Link
                                key={i}
                                href="/shop"
                                className={`group relative flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl border ${deal.color} backdrop-blur-sm hover:scale-105 transition-all duration-300 w-28 sm:w-36 shrink-0 ${
                                    i === 1 ? 'scale-105 -translate-y-3' : ''
                                }`}
                            >
                                {/* Discount Badge */}
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#F04438] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md shadow-[#F04438]/30 whitespace-nowrap">
                                    {deal.label}
                                </span>

                                {/* Product Image */}
                                <div className="relative size-16 sm:size-20 rounded-xl bg-white/10 overflow-hidden">
                                    <Image
                                        src={deal.img}
                                        alt={deal.title}
                                        fill
                                        className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="text-center">
                                    <div className="text-[11px] font-black text-white leading-snug line-clamp-1">{deal.title}</div>
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
