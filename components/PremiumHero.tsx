'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Flame, Headphones } from 'lucide-react'
import { useSelector } from 'react-redux'
import { assets } from '@/assets/assets'

export default function PremiumHero() {
    const [currentImgIndex, setCurrentImgIndex] = useState(0)

    const featuredImages = [
        assets.product_img3,
        assets.product_img4,
        assets.product_img8,
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % featuredImages.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [featuredImages.length])

    return (
        <section className="px-3 sm:px-6 pt-3 pb-5 sm:py-10 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-stretch">

                {/* ═══ GRANDE CARTE HERO ═══ */}
                <div className="lg:col-span-8 relative flex flex-col bg-gradient-to-br from-[#071126] via-[#0B1E3F] to-[#071126] rounded-2xl sm:rounded-3xl text-white overflow-hidden border border-slate-800/80 shadow-xl group">

                    {/* Ambient Orbs */}
                    <div className="absolute -top-24 -right-24 size-[300px] sm:size-[420px] bg-[#1769FF]/20 rounded-full blur-[80px] sm:blur-[110px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 size-[260px] sm:size-[380px] bg-cyan-500/10 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none" />

                    {/* ── MOBILE layout: Image produit très visible (240px) + Texte compact ── */}
                    <div className="flex flex-col lg:hidden flex-1 p-4 pb-5">
                        {/* Badge top */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold text-cyan-300 w-fit mb-2">
                            <Sparkles size={11} className="text-cyan-400" />
                            <span>COLLECTION HIGH-TECH 2026</span>
                        </div>

                        {/* Grande zone image produit héroique */}
                        <div className="relative w-full h-[220px] xs:h-[250px] flex items-center justify-center my-1">
                            {featuredImages.map((src, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                                        index === currentImgIndex
                                            ? 'opacity-100 scale-100'
                                            : 'opacity-0 scale-90 pointer-events-none'
                                    }`}
                                >
                                    <div className="relative w-56 h-56 xs:w-60 xs:h-60">
                                        <Image
                                            src={src}
                                            alt="Produit High-Tech SenTech Plus"
                                            fill
                                            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Carousel Indicators */}
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                {featuredImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImgIndex(idx)}
                                        aria-label={`Diapositive ${idx + 1}`}
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            idx === currentImgIndex ? 'w-5 bg-[#1769FF]' : 'w-1.5 bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Title & Actions */}
                        <div className="relative z-10 space-y-2.5 pt-1 text-center">
                            <h1 className="text-xl xs:text-2xl font-black tracking-tight text-white leading-snug">
                                Des accessoires intelligents pour simplifier votre quotidien.
                            </h1>

                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit mx-auto">
                                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Livraison express au Sénégal</span>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <Link
                                    href="/shop"
                                    className="flex-1 text-center inline-flex items-center justify-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md shadow-[#1769FF]/30 active:scale-95 transition-all"
                                >
                                    Acheter maintenant →
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-3.5 rounded-xl border border-white/20 transition-all"
                                >
                                    Catalogue
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ── DESKTOP layout: côte-à-côte ── */}
                    <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8 items-center flex-1 p-12">
                        <div className="col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 shadow-sm">
                                <Sparkles size={13} className="text-cyan-400" />
                                <span>COLLECTION HIGH-TECH 2026</span>
                            </div>

                            <h1 className="text-[42px] xl:text-[50px] font-black tracking-tight text-white leading-[1.08]">
                                Des accessoires intelligents pour simplifier votre quotidien.
                            </h1>

                            <p className="text-slate-300 text-[16px] font-normal leading-relaxed max-w-md">
                                Découvrez notre sélection de gadgets, accessoires et équipements high-tech soigneusement sélectionnés pour vous.
                            </p>

                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full w-fit">
                                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Livraison rapide au Sénégal</span>
                            </div>

                            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2.5 bg-[#1769FF] hover:bg-[#1256D6] text-white font-extrabold text-sm py-3.5 px-7 rounded-2xl shadow-xl shadow-[#1769FF]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                                >
                                    <span>Acheter maintenant →</span>
                                </Link>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm py-3.5 px-6 rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
                                >
                                    <span>Découvrir le catalogue</span>
                                </Link>
                            </div>
                        </div>

                        <div className="col-span-5 relative h-full flex items-center justify-center">
                            <div className="relative w-full min-h-[300px] lg:min-h-[320px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-2 flex items-center justify-center overflow-hidden">
                                {featuredImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-out ${
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
                                                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                                    {featuredImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImgIndex(idx)}
                                            aria-label={`Diapositive ${idx + 1}`}
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

                {/* ═══ CARTES SECONDAIRES ═══ */}
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                    {/* Carte 1: Audio */}
                    <div className="relative bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-[#EBEBEB] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[145px] sm:min-h-[200px]">
                        <div className="absolute -right-6 -bottom-6 size-28 sm:size-40 bg-[#EAF3FF] rounded-full pointer-events-none" />

                        <div className="relative z-10 space-y-1">
                            <div className="size-7 sm:size-10 rounded-lg sm:rounded-2xl bg-[#EAF3FF] text-[#1769FF] flex items-center justify-center">
                                <Headphones size={15} className="sm:hidden" />
                                <Headphones size={20} className="hidden sm:block" />
                            </div>
                            <h3 className="text-xs xs:text-sm sm:text-xl font-black text-[#101828] leading-tight pt-0.5">
                                Audio & Casques
                            </h3>
                        </div>

                        <div className="relative z-10 pt-1.5 sm:pt-4">
                            <Link
                                href="/shop?search=Casques"
                                className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black text-[#1769FF]"
                            >
                                <span>Explorer</span>
                                <ArrowRight size={11} />
                            </Link>
                        </div>

                        <div className="absolute right-1.5 bottom-1.5 sm:right-3 sm:bottom-3 size-14 xs:size-16 sm:size-28 rounded-lg sm:rounded-2xl bg-[#F7F9FC] border border-[#EBEBEB] overflow-hidden flex items-center justify-center">
                            <Image
                                src={assets.product_img3}
                                alt="Audio & Casques"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </div>

                    {/* Carte 2: Bon Plan */}
                    <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[145px] sm:min-h-[200px]">
                        <div className="relative z-10 space-y-1">
                            <span className="inline-flex items-center gap-1 bg-white text-amber-900 text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-3 py-0.5 rounded-full">
                                <Flame size={9} className="text-orange-500" />
                                BON PLAN
                            </span>
                            <h3 className="text-sm xs:text-lg sm:text-3xl font-black tracking-tight text-white leading-none pt-0.5">
                                Jusqu'à -20%
                            </h3>
                        </div>

                        <div className="relative z-10 pt-1.5 sm:pt-4">
                            <Link
                                href="/shop?search=Promo"
                                className="inline-flex items-center gap-1 bg-white text-amber-950 font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-md sm:rounded-lg shadow-xs"
                            >
                                <span>Profiter</span>
                                <ArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="absolute right-1.5 bottom-1.5 sm:right-3 sm:bottom-3 size-14 xs:size-16 sm:size-28 rounded-lg sm:rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md overflow-hidden flex items-center justify-center">
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
