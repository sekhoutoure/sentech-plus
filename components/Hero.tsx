'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Flame, Tag } from 'lucide-react'
import { useSelector } from 'react-redux'
import { assets } from '@/assets/assets'

const Hero: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)
    const hero = siteSettings?.hero

    const products = useSelector((state: any) => state.product?.list || [])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Top featured product images
    const featuredImages = products?.slice(0, 4).map((p: any) => p.images[0]).filter(Boolean) || []

    useEffect(() => {
        if (featuredImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % featuredImages.length)
        }, 4500)
        return () => clearInterval(interval)
    }, [featuredImages.length])

    return (
        <section className='relative px-4 sm:px-6 pt-5 pb-8 sm:py-8'>
            <div className='max-w-[1400px] mx-auto'>
                
                {/* Hero Grid: 2 Columns on Desktop */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch'>

                    {/* GRANDE CARTE GAUCHE (8 Colonnes) */}
                    <div className='lg:col-span-8 relative flex flex-col justify-between bg-gradient-to-br from-[#071126] via-[#0B1E40] to-[#071126] rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden border border-slate-800 shadow-xl group min-h-[460px] sm:min-h-[500px]'>

                        {/* Ambient Subtle Lighting */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#1769FF]/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1769FF]/10 rounded-full blur-[90px] pointer-events-none" />

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                            
                            {/* Left Text Content */}
                            <div className="md:col-span-7 space-y-4">
                                
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 shadow-sm">
                                    <Sparkles size={13} className="text-cyan-400" />
                                    <span>COLLECTION HIGH-TECH 2026</span>
                                </div>

                                {/* Title */}
                                <h1 className='text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-[1.18]'>
                                    {hero?.title || "Des accessoires intelligents pour simplifier votre quotidien."}
                                </h1>

                                {/* Description */}
                                <p className='text-slate-300 text-xs sm:text-sm font-normal leading-relaxed max-w-md'>
                                    {hero?.subtitle || "Découvrez notre sélection de gadgets, accessoires et équipements high-tech soigneusement sélectionnés pour vous."}
                                </p>

                                {/* Promo Price */}
                                <div className='pt-1'>
                                    <span className='text-[11px] uppercase tracking-wider text-slate-400 font-semibold block'>Offre de bienvenue</span>
                                    <span className='text-2xl sm:text-3xl font-extrabold text-white'>
                                        À partir de <span className="text-[#1769FF] font-black">2 900 FCFA</span>
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className='pt-2 flex flex-wrap items-center gap-3 sm:gap-4'>
                                    <Link
                                        href="/shop"
                                        className='inline-flex items-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg shadow-[#1769FF]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer'
                                    >
                                        <span>Acheter maintenant →</span>
                                    </Link>

                                    <Link
                                        href="/shop"
                                        className='inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl border border-white/20 transition-all duration-200 cursor-pointer'
                                    >
                                        <span>Découvrir le catalogue</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Product Image Showcase */}
                            <div className="md:col-span-5 relative h-56 sm:h-72 flex items-center justify-center">
                                {featuredImages.length > 0 ? (
                                    featuredImages.map((src: string, index: number) => (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                                                index === currentImageIndex
                                                    ? 'opacity-100 scale-100 translate-y-0'
                                                    : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                                            }`}
                                        >
                                            <div className="relative size-52 sm:size-64 rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-md p-2 flex items-center justify-center">
                                                <Image
                                                    src={src}
                                                    alt="Produit Vedette SenTech Plus"
                                                    fill
                                                    priority={index === 0}
                                                    className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="relative size-52 sm:size-64 rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-md p-2 flex items-center justify-center">
                                        <Image
                                            src={assets.hero_model_img}
                                            alt="SenTech Plus Model"
                                            fill
                                            priority
                                            className="object-cover rounded-xl"
                                        />
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* CARTES SECONDAIRES DROITE (4 Colonnes) */}
                    <div className='lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 justify-between'>

                        {/* CARTE SECONDAIRE 1: Audio & Casques */}
                        <Link
                            href="/shop?search=Casques"
                            className='relative flex-1 flex items-center justify-between p-6 sm:p-7 rounded-3xl bg-[#071126] text-white border border-slate-800 shadow-md hover:shadow-xl hover:border-[#1769FF]/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group'
                        >
                            <div className="absolute -right-8 -top-8 size-28 bg-[#1769FF]/15 rounded-full blur-2xl group-hover:bg-[#1769FF]/25 transition-all" />
                            
                            <div className="relative z-10 space-y-2 max-w-[170px]">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/60">
                                    <Flame size={11} className="text-cyan-400" /> Tendance
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold leading-tight text-white">Audio & Casques</h2>
                                <p className="text-xs text-slate-300 font-normal">Découvrez notre sélection audio</p>
                                <p className="text-xs font-bold text-[#1769FF] flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                                    Explorer →
                                </p>
                            </div>

                            <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shadow-md border border-white/10 shrink-0">
                                <Image
                                    src={assets.hero_product_img1}
                                    alt="Audio et Casques"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </Link>

                        {/* CARTE SECONDAIRE 2: BON PLAN Jusqu'à -20% */}
                        <Link
                            href="/shop"
                            className='relative flex-1 flex items-center justify-between p-6 sm:p-7 rounded-3xl bg-white text-[#101828] border border-[#E4E7EC] shadow-md hover:shadow-xl hover:border-[#1769FF]/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden group'
                        >
                            <div className="absolute -left-8 -bottom-8 size-28 bg-[#1769FF]/10 rounded-full blur-2xl group-hover:bg-[#1769FF]/20 transition-all" />
                            
                            <div className="relative z-10 space-y-2 max-w-[170px]">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#1769FF] bg-[#EAF3FF] px-2.5 py-1 rounded-full border border-[#1769FF]/20">
                                    <Tag size={11} /> BON PLAN
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black leading-tight text-[#101828]">Jusqu'à -20%</h2>
                                <p className="text-xs text-[#667085] font-normal">Sur vos accessoires favoris</p>
                                <p className="text-xs font-bold text-[#1769FF] flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
                                    Profiter de l'offre →
                                </p>
                            </div>

                            <div className="relative size-24 sm:size-28 rounded-2xl overflow-hidden shadow-md border border-[#E4E7EC] shrink-0">
                                <Image
                                    src={assets.hero_product_img2}
                                    alt="Bon Plan Promo"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </Link>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
