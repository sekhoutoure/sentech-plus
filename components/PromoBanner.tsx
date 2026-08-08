'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight } from 'lucide-react'
import { assets } from '@/assets/assets'

export default function PromoBanner() {
    const promoProducts = [
        assets.product_img3,
        assets.product_img4,
        assets.product_img5,
    ];

    return (
        <section className="px-4 sm:px-6 my-16 sm:my-20 max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#071126] via-[#0B1E40] to-[#071126] p-8 sm:p-12 lg:p-14 text-white border border-slate-800 shadow-xl">
                
                {/* Ambient glow effects */}
                <div className="absolute -top-24 -left-24 size-80 bg-[#1769FF]/20 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 size-80 bg-[#1769FF]/15 rounded-full blur-[90px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Copy (7 cols) */}
                    <div className="lg:col-span-7 space-y-4 text-left">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 shadow-sm">
                            <Sparkles size={13} className="text-cyan-400" />
                            <span>OFFRES LIMITÉES</span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            Les bons plans du moment
                        </h2>

                        <p className="text-xs sm:text-base text-slate-300 max-w-lg leading-relaxed font-normal">
                            Profitez de réductions exceptionnelles sur une sélection de produits high-tech soigneusement choisis pour vous.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2.5 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-xs sm:text-sm py-3.5 px-7 rounded-xl shadow-lg shadow-[#1769FF]/25 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                            >
                                <span>Découvrir les offres</span>
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Product Visuals (5 cols) */}
                    <div className="lg:col-span-5 flex items-center justify-center gap-3 sm:gap-4 overflow-hidden">
                        {promoProducts.map((imgSrc, i) => (
                            <div
                                key={i}
                                className={`relative size-24 sm:size-32 rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-md p-2 shrink-0 ${
                                    i === 1 ? 'scale-110 -translate-y-1' : 'opacity-85'
                                }`}
                            >
                                <Image
                                    src={imgSrc}
                                    alt="Produit en promotion"
                                    fill
                                    className="object-cover rounded-xl"
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
