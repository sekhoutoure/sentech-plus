'use client'
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, Flame } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { assets } from '@/assets/assets'

const Hero: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)
    const currency = siteSettings?.currencySymbol || '$'
    const hero = siteSettings?.hero

    const products = useSelector((state: any) => state.product.list)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Extract top 4 product images
    const featuredImages = products?.slice(0, 4).map((p: any) => p.images[0]).filter(Boolean) || []

    useEffect(() => {
        if (featuredImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % featuredImages.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [featuredImages.length])

    return (
        <section className='relative px-4 sm:px-6 overflow-hidden pt-4 sm:pt-6'>
            <div className='max-w-7xl mx-auto'>

                {/* Hero Grid Container */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch'>

                    {/* Main Luxury Hero Card (8 Cols on Desktop) */}
                    <div className='lg:col-span-8 relative flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-14 text-white overflow-hidden border border-white/10 shadow-2xl group min-h-[460px] sm:min-h-[520px]'>

                        {/* Ambient Glowing Mesh Orbs */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                        {/* Content Area */}
                        <div className='relative z-10 max-w-xl space-y-4'>
                            
                            {/* Floating Tech Highlight Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-blue-300 shadow-sm animate-fade-in-up">
                                <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                                <span>Nouvelle Collection High-Tech 2026</span>
                            </div>

                            {/* Main Title */}
                            <h1 className='text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-sm'>
                                {hero?.title || "L'Excellence High-Tech à Prix Imbattables."}
                            </h1>

                            {/* Subtitle */}
                            <p className='text-slate-300 text-xs sm:text-base font-normal leading-relaxed max-w-md'>
                                {hero?.subtitle || "Smartphones, casques sans fil, ordinateurs et accessoires connectés certifiés 100% neufs avec livraison express à Dakar."}
                            </p>

                            {/* Price & Action Area */}
                            <div className='pt-2 flex flex-wrap items-center gap-4 sm:gap-6'>
                                <div>
                                    <span className='text-[11px] uppercase tracking-wider text-slate-400 font-semibold block'>À partir de</span>
                                    <span className='text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300'>
                                        {currency}4.90
                                    </span>
                                </div>

                                <Link
                                    href="/shop"
                                    className='inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm py-3.5 px-8 rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-95 transition-all duration-300 border border-blue-400/30 group/btn'
                                >
                                    <span>{hero?.ctaText || "DÉCOUVRIR LE CATALOGUE"}</span>
                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            {/* Trust Badges Floating List */}
                            <div className='pt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-slate-300/90 font-medium border-t border-white/10'>
                                <div className="flex items-center gap-1.5">
                                    <Zap size={14} className="text-amber-400" />
                                    <span>Livraison 24h Dakar</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-emerald-400" />
                                    <span>Garantie 100% Neuf</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star size={14} className="text-yellow-400" fill="#FACC15" />
                                    <span>4.9/5 Avis Clients</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Product Showcase Dynamic Slide */}
                        <div className='relative lg:absolute lg:right-4 lg:bottom-4 w-full lg:w-[45%] h-56 sm:h-72 lg:h-[88%] mt-6 lg:mt-0 flex items-center justify-center pointer-events-none'>
                            {featuredImages.length > 0 ? (
                                featuredImages.map((src: string, index: number) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                                            index === currentImageIndex
                                                ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                                                : 'opacity-0 scale-90 translate-y-6 rotate-2'
                                        }`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Produit Vedette ${index + 1}`}
                                            width={440}
                                            height={440}
                                            priority={index === 0}
                                            className="max-h-52 sm:max-h-72 lg:max-h-80 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))
                            ) : (
                                <Image
                                    src={assets.hero_model_img}
                                    alt="Hero Model"
                                    width={440}
                                    height={440}
                                    priority
                                    className="max-h-72 w-auto object-contain drop-shadow-2xl"
                                />
                            )}
                        </div>
                    </div>

                    {/* Side Highlight Promotional Cards (4 Cols on Desktop) */}
                    <div className='lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6'>

                        {/* Top Promo Card: Best Sellers */}
                        <Link
                            href="/shop?search=Casques"
                            className='relative flex-1 flex items-center justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-white/10 shadow-lg hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden group'
                        >
                            <div className="absolute -right-8 -top-8 size-28 bg-blue-500/15 rounded-full blur-2xl group-hover:bg-blue-500/25 transition-all" />
                            
                            <div className="relative z-10 space-y-2 max-w-[140px] sm:max-w-[170px]">
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                                    <Flame size={11} className="text-cyan-400" /> Tendance
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">Audio & Casques</h2>
                                <p className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Explorer <ArrowRight size={13} />
                                </p>
                            </div>

                            <Image
                                src={assets.hero_product_img1}
                                alt="Produit Vedette Audio"
                                width={130}
                                height={130}
                                className="relative z-10 w-24 sm:w-28 object-contain drop-shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300"
                            />
                        </Link>

                        {/* Bottom Promo Card: 20% Discount Offer */}
                        <Link
                            href="/shop"
                            className='relative flex-1 flex items-center justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/70 text-slate-900 border border-blue-200/80 shadow-lg hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden group'
                        >
                            <div className="absolute -left-8 -bottom-8 size-28 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all" />
                            
                            <div className="relative z-10 space-y-2 max-w-[140px] sm:max-w-[170px]">
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                                    Offre Spéciale
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black leading-tight text-slate-900">-20% Réduction</h2>
                                <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Profiter du code <ArrowRight size={13} />
                                </p>
                            </div>

                            <Image
                                src={assets.hero_product_img2}
                                alt="Offre Réduction"
                                width={130}
                                height={130}
                                className="relative z-10 w-24 sm:w-28 object-contain drop-shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                            />
                        </Link>

                    </div>
                </div>

                {/* Categories Marquee Strip Under Hero */}
                <div className="mt-8 sm:mt-12">
                    <CategoriesMarquee />
                </div>
            </div>
        </section>
    );
};

export default Hero;
