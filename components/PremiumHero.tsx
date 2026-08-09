'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Flame, Tag, Headphones, Watch, Smartphone, Laptop } from 'lucide-react'
import { useSelector } from 'react-redux'
import { assets } from '@/assets/assets'

export default function PremiumHero() {
    const siteSettings = useSelector((state: any) => state.siteSettings)
    const hero = siteSettings?.hero
    const products = useSelector((state: any) => state.product?.list || [])
    
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    // Select featured high quality product images
    const featuredImages = [
        assets.product_img3, // Headphone
        assets.product_img4, // Smartwatch
        assets.product_img8, // Smartphone
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % featuredImages.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [featuredImages.length])

    return (
        <section className="relative px-4 sm:px-6 pt-4 pb-8 sm:py-10 max-w-[1400px] mx-auto">
            {/* Desktop 70% / 30% Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                
                {/* 1. GRANDE CARTE HERO (70% - lg:col-span-8) */}
                <div className="lg:col-span-8 relative flex flex-col justify-between bg-gradient-to-br from-[#071126] via-[#0B1E3F] to-[#071126] rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden border border-slate-800/80 shadow-2xl min-h-[480px] sm:min-h-[520px] group">
                    
                    {/* Subtle Ambient Lighting Orbs */}
                    <div className="absolute -top-32 -right-32 size-[420px] bg-[#1769FF]/20 rounded-full blur-[110px] pointer-events-none" />
                    <div className="absolute -bottom-32 -left-32 size-[380px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-1">
                        
                        {/* Left Copy Content */}
                        <div className="md:col-span-7 space-y-5">
                            
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 shadow-sm">
                                <Sparkles size={13} className="text-cyan-400" />
                                <span>COLLECTION HIGH-TECH 2026</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-[1.12]">
                                Des accessoires intelligents pour simplifier votre quotidien.
                            </h1>

                            {/* Description */}
                            <p className="text-slate-300 text-xs sm:text-base font-normal leading-relaxed max-w-md">
                                Découvrez notre sélection de gadgets, accessoires et équipements high-tech soigneusement sélectionnés pour vous.
                            </p>

                            {/* Avantage */}
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full w-fit">
                                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Livraison rapide au Sénégal</span>
                            </div>

                            {/* CTAs */}
                            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2.5 bg-[#1769FF] hover:bg-[#1256D6] text-white font-extrabold text-xs sm:text-sm py-3.5 px-7 rounded-2xl shadow-xl shadow-[#1769FF]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                                >
                                    <span>Acheter maintenant →</span>
                                </Link>

                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
                                >
                                    <span>Découvrir le catalogue</span>
                                </Link>
                            </div>
                        </div>

                        {/* Right: Grande Image Produit High-Tech Premium dans une carte conteneur très propre */}
                        <div className="md:col-span-5 relative h-64 sm:h-80 lg:h-full flex items-center justify-center p-2">
                            {/* Card Background Wrapper for Product Image */}
                            <div className="relative w-full h-full min-h-[260px] sm:min-h-[300px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 flex items-center justify-center overflow-hidden">
                                {featuredImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-700 ease-out ${
                                            index === currentImgIndex
                                                ? 'opacity-100 scale-100 translate-y-0'
                                                : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                                        }`}
                                    >
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={src}
                                                alt="Produit High-Tech SenTech Plus"
                                                fill
                                                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Carousel Indicators */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                                    {featuredImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImgIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                idx === currentImgIndex ? 'w-6 bg-[#1769FF]' : 'w-1.5 bg-white/30'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. DEUX CARTES SECONDAIRES (30% - lg:col-span-4) */}
                <div className="lg:col-span-4 flex flex-col gap-5 sm:gap-6 justify-between">
                    
                    {/* Carte Secondaire 1: Audio & Casques */}
                    <div className="relative flex-1 bg-white rounded-3xl p-6 sm:p-7 border border-[#EBEBEB] shadow-sm hover:shadow-xl hover:border-[#1769FF]/30 transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[220px]">
                        <div className="absolute -right-8 -bottom-8 size-40 bg-[#EAF3FF] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        
                        <div className="relative z-10 space-y-2 max-w-[60%]">
                            <div className="size-10 rounded-2xl bg-[#EAF3FF] text-[#1769FF] flex items-center justify-center font-bold">
                                <Headphones size={20} />
                            </div>
                            <h3 className="text-xl font-black text-[#101828] leading-tight pt-1">
                                Audio & Casques
                            </h3>
                            <p className="text-xs text-[#667085] font-medium leading-relaxed">
                                Découvrez notre sélection audio
                            </p>
                        </div>

                        <div className="relative z-10 pt-4">
                            <Link
                                href="/shop?search=Casques"
                                className="inline-flex items-center gap-1.5 text-xs font-black text-[#1769FF] group-hover:gap-2.5 transition-all"
                            >
                                <span>Explorer</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Image conteneur avec fond clair propre */}
                        <div className="absolute right-3 bottom-3 size-28 sm:size-32 rounded-2xl bg-[#F7F9FC] border border-[#EBEBEB] p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <Image
                                src={assets.product_img3}
                                alt="Audio & Casques"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </div>

                    {/* Carte Secondaire 2: Bon Plan -20% */}
                    <div className="relative flex-1 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[220px]">
                        <div className="absolute top-0 right-0 size-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

                        <div className="relative z-10 space-y-2 max-w-[60%]">
                            <span className="inline-flex items-center gap-1 bg-white text-amber-900 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
                                <Flame size={12} className="text-orange-500" />
                                BON PLAN
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none pt-1">
                                Jusqu'à -20%
                            </h3>
                            <p className="text-xs text-amber-100 font-medium">
                                Offres exclusives réservées
                            </p>
                        </div>

                        <div className="relative z-10 pt-4">
                            <Link
                                href="/shop?search=Promo"
                                className="inline-flex items-center gap-1.5 bg-white text-amber-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md group-hover:scale-105 transition-all"
                            >
                                <span>Profiter de l'offre</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {/* Image conteneur avec fond clair propre */}
                        <div className="absolute right-3 bottom-3 size-28 sm:size-32 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md p-2 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <Image
                                src={assets.product_img4}
                                alt="Bon Plan"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}
