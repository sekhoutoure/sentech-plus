'use client'
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, Flame, Tag } from 'lucide-react'
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

    const products = useSelector((state: any) => state.product.list || [])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Extract top 4 product images
    const featuredImages = products?.slice(0, 4).map((p: any) => p.images[0]).filter(Boolean) || []

    useEffect(() => {
        if (featuredImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % featuredImages.length)
        }, 4500)
        return () => clearInterval(interval)
    }, [featuredImages.length])

    return (
        <section className='relative px-4 sm:px-6 overflow-hidden pt-4 sm:pt-6'>
            <div className='max-w-7xl mx-auto space-y-8'>

                {/* Hero Grid Container */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch'>

                    {/* Main Luxury Hero Card (8 Cols on Desktop) */}
                    <div className='lg:col-span-8 relative flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-12 text-white overflow-hidden border border-white/10 shadow-2xl group min-h-[480px] sm:min-h-[520px]'>

                        {/* Ambient Glowing Mesh Orbs */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                        {/* Two Columns inside Main Hero on Large Screens */}
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                            
                            {/* Text Content Left (7 cols) */}
                            <div className="md:col-span-7 space-y-4">
                                
                                {/* Floating Tech Highlight Badge */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 shadow-sm animate-fade-in-up">
                                    <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                                    <span>Collection High-Tech 2026</span>
                                </div>

                                {/* Main Title */}
                                <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-sm'>
                                    {hero?.title || "Des accessoires intelligents pour sublimer votre quotidien."}
                                </h1>

                                {/* Subtitle */}
                                <p className='text-slate-300 text-xs sm:text-sm font-normal leading-relaxed max-w-md'>
                                    {hero?.subtitle || "Découvrez notre sélection exclusive d'écouteurs, montres et accessoires connectés certifiés avec garantie 100% neuf."}
                                </p>

                                {/* Price & Action Area */}
                                <div className='pt-2 flex flex-wrap items-center gap-4 sm:gap-6'>
                                    <div>
                                        <span className='text-[10px] uppercase tracking-wider text-slate-400 font-semibold block'>À partir de</span>
                                        <span className='text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300'>
                                            {currency}4.90
                                        </span>
                                    </div>

                                    <Link
                                        href="/shop"
                                        className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-3.5 px-7 rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 border border-blue-400/30 group/btn'
                                    >
                                        <span>{hero?.ctaText || "Acheter maintenant"}</span>
                                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Product Floating Showcase Right (5 cols) */}
                            <div className="md:col-span-5 relative h-56 sm:h-72 md:h-80 flex items-center justify-center">
                                {/* Radiant Aura Halo */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35)_0%,rgba(6,182,212,0.15)_45%,transparent_70%)] rounded-full blur-xl pointer-events-none" />

                                {featuredImages.length > 0 ? (
                                    featuredImages.map((src: string, index: number) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                                                index === currentImageIndex
                                                    ? 'opacity-100 scale-100 translate-y-0'
                                                    : 'opacity-0 scale-90 translate-y-6 pointer-events-none'
                                            }`}
                                        >
                                            <div className="relative size-52 sm:size-64 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-md p-2 flex items-center justify-center">
                                                <Image
                                                    src={src}
                                                    alt={`Produit Vedette ${index + 1}`}
                                                    fill
                                                    priority={index === 0}
                                                    className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="relative size-52 sm:size-64 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-md p-2 flex items-center justify-center">
                                        <Image
                                            src={assets.hero_model_img}
                                            alt="Hero Model"
                                            fill
                                            priority
                                            className="object-cover rounded-2xl"
                                        />
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Trust Badges Bottom Row */}
                        <div className='relative z-10 mt-6 pt-5 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-300 font-medium border-t border-white/10'>
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400">
                                    <Zap size={13} />
                                </div>
                                <span>Livraison Express 24h Dakar</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400">
                                    <ShieldCheck size={13} />
                                </div>
                                <span>Garantie 100% Neuf & Certifié</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                                    <Star size={13} fill="#FACC15" />
                                </div>
                                <span>4.9/5 Avis Clients Vérifiés</span>
                            </div>
                        </div>

                    </div>

                    {/* Side Highlight Promotional Cards (4 Cols on Desktop) */}
                    <div className='lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 justify-between'>

                        {/* Top Promo Card: Audio & Casques */}
                        <Link
                            href="/shop?search=Casques"
                            className='relative flex-1 flex items-center justify-between p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-white/10 shadow-lg hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group'
                        >
                            <div className="absolute -right-8 -top-8 size-28 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all" />
                            
                            <div className="relative z-10 space-y-2 max-w-[140px] sm:max-w-[170px]">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/60">
                                    <Flame size={11} className="text-cyan-400" /> Tendance
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">Audio & Casques</h2>
                                <p className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Explorer le rayon <ArrowRight size={13} />
                                </p>
                            </div>

                            <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                                <Image
                                    src={assets.hero_product_img1}
                                    alt="Produit Vedette Audio"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </Link>

                        {/* Bottom Promo Card: -20% Offre Promo */}
                        <Link
                            href="/shop"
                            className='relative flex-1 flex items-center justify-between p-6 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-slate-900 border border-blue-200 shadow-lg hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden group'
                        >
                            <div className="absolute -left-8 -bottom-8 size-28 bg-blue-400/15 rounded-full blur-2xl group-hover:bg-blue-400/25 transition-all" />
                            
                            <div className="relative z-10 space-y-2 max-w-[140px] sm:max-w-[170px]">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                                    <Tag size={11} className="text-blue-600" /> Bon Plan
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black leading-tight text-slate-900">-20% Réduction</h2>
                                <p className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Code : NEW20 <ArrowRight size={13} />
                                </p>
                            </div>

                            <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shadow-lg border border-slate-200 shrink-0">
                                <Image
                                    src={assets.hero_product_img2}
                                    alt="Offre Réduction"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </Link>

                    </div>
                </div>

                {/* Categories Marquee Strip */}
                <CategoriesMarquee />
            </div>
        </section>
    );
};

export default Hero;
