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
        <section className="px-3 sm:px-6 pt-1 pb-2 sm:py-10 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-stretch">

                {/* ═══ GRANDE CARTE HERO ═══ */}
                <div className="lg:col-span-8 relative flex flex-col bg-gradient-to-br from-[#071426] via-[#0B2342] to-[#071426] rounded-2xl sm:rounded-3xl text-white overflow-hidden border border-[#0B2342] shadow-lg group">

                    {/* Ambient Orbs */}
                    <div className="absolute -top-24 -right-24 size-[250px] sm:size-[420px] bg-[#007BFF]/20 rounded-full blur-[70px] sm:blur-[110px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 size-[220px] sm:size-[380px] bg-[#0088D8]/10 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

                    {/* ── MOBILE layout: Ultra-compact (200-240px) avec composition équilibrée ── */}
                    <div className="flex lg:hidden flex-col justify-between p-3.5 sm:p-5 relative z-10 min-h-[220px] max-h-[260px]">
                        {/* Top Row: Badge + Delivery */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[9px] font-extrabold text-[#0088D8]">
                                <Sparkles size={10} className="text-[#007BFF]" />
                                <span>COLLECTION HIGH-TECH</span>
                            </div>
                            <span className="text-[9px] font-bold text-[#16B364] bg-[#16B364]/10 border border-[#16B364]/20 px-2 py-0.5 rounded-full">
                                🚚 Express Sénégal
                            </span>
                        </div>

                        {/* Mid Row: 45% Text Left, 55% Image Right */}
                        <div className="grid grid-cols-12 gap-2 items-center my-1.5">
                            {/* Left Text (5 cols) */}
                            <div className="col-span-7 space-y-1">
                                <h1 className="text-[18px] xs:text-[22px] font-black tracking-tight text-white leading-tight">
                                    Technologie.<br />
                                    Simplicité.<br />
                                    <span className="text-[#007BFF]">Performance.</span>
                                </h1>
                                <p className="text-[10px] text-slate-300 font-normal line-clamp-2 leading-snug">
                                    Gadgets & accessoires high-tech pensés pour votre quotidien.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-1 bg-[#007BFF] hover:bg-[#0069D9] text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-md active:scale-95 transition-all"
                                    >
                                        <span>Découvrir</span>
                                        <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image (5 cols) */}
                            <div className="col-span-5 relative h-[120px] xs:h-[140px] flex items-center justify-center">
                                {featuredImages.map((src, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                                            index === currentImgIndex
                                                ? 'opacity-100 scale-100'
                                                : 'opacity-0 scale-90 pointer-events-none'
                                        }`}
                                    >
                                        <div className="relative w-full h-full flex items-center justify-center p-1">
                                            <Image
                                                src={src}
                                                alt="Produit High-Tech SenTech Plus"
                                                fill
                                                className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Indicator dots */}
                        <div className="flex items-center justify-center gap-1">
                            {featuredImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImgIndex(idx)}
                                    aria-label={`Diapositive ${idx + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        idx === currentImgIndex ? 'w-5 bg-[#007BFF]' : 'w-1.5 bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── DESKTOP layout ── */}
                    <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8 items-center flex-1 p-10 xl:p-12">
                        <div className="col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold text-[#0088D8] shadow-2xs">
                                <Sparkles size={13} className="text-[#007BFF]" />
                                <span>COLLECTION HIGH-TECH 2026</span>
                            </div>

                            <h1 className="text-[38px] xl:text-[46px] font-black tracking-tight text-white leading-[1.08]">
                                Technologie. Simplicité.<br />
                                <span className="text-[#007BFF]">Performance.</span>
                            </h1>

                            <p className="text-slate-300 text-[15px] sm:text-[16px] font-normal leading-relaxed max-w-md">
                                Découvrez une sélection de gadgets et accessoires high-tech pensés pour votre quotidien.
                            </p>

                            <div className="flex items-center gap-2 text-xs font-bold text-[#16B364] bg-[#16B364]/10 border border-[#16B364]/20 px-3.5 py-1.5 rounded-full w-fit">
                                <span className="size-2 rounded-full bg-[#16B364] animate-pulse" />
                                <span>Livraison rapide au Sénégal</span>
                            </div>

                            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2.5 bg-[#007BFF] hover:bg-[#0069D9] text-white font-extrabold text-sm py-3.5 px-7 rounded-2xl shadow-xl shadow-[#007BFF]/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                                >
                                    <span>Découvrir la collection</span>
                                    <ArrowRight size={15} />
                                </Link>
                                <Link
                                    href="/shop?search=Promo"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm py-3.5 px-6 rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-200 cursor-pointer"
                                >
                                    <span>Voir les offres</span>
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
                                                idx === currentImgIndex ? 'w-6 bg-[#007BFF]' : 'w-1.5 bg-white/30'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ CARTES SECONDAIRES (Masquées sur mobile: hidden lg:grid) ═══ */}
                <div className="hidden lg:grid lg:col-span-4 grid-cols-1 gap-6">
                    {/* Carte 1: Audio */}
                    <div className="relative bg-white rounded-3xl p-7 border border-[#E5E9F0] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[200px]">
                        <div className="absolute -right-6 -bottom-6 size-40 bg-[#EAF5FF] rounded-full pointer-events-none" />

                        <div className="relative z-10 space-y-1">
                            <div className="size-10 rounded-2xl bg-[#EAF5FF] text-[#007BFF] flex items-center justify-center">
                                <Headphones size={20} />
                            </div>
                            <h3 className="text-xl font-black text-[#101828] leading-tight pt-0.5">
                                Audio & Casques
                            </h3>
                        </div>

                        <div className="relative z-10 pt-4">
                            <Link
                                href="/shop?search=Casques"
                                className="inline-flex items-center gap-1 text-xs font-black text-[#007BFF]"
                            >
                                <span>Explorer</span>
                                <ArrowRight size={11} />
                            </Link>
                        </div>

                        <div className="absolute right-3 bottom-3 size-28 rounded-2xl bg-[#F6F8FB] border border-[#E5E9F0] overflow-hidden flex items-center justify-center">
                            <Image
                                src={assets.product_img3}
                                alt="Audio & Casques"
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    </div>

                    {/* Carte 2: Bon Plan */}
                    <div className="relative bg-gradient-to-br from-[#007BFF] via-[#0088D8] to-[#0B2342] rounded-3xl p-7 text-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[200px]">
                        <div className="relative z-10 space-y-1">
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-white/20">
                                <Flame size={9} className="text-white" />
                                BON PLAN
                            </span>
                            <h3 className="text-3xl font-black tracking-tight text-white leading-none pt-0.5">
                                Jusqu'à -20%
                            </h3>
                        </div>

                        <div className="relative z-10 pt-4">
                            <Link
                                href="/shop?search=Promo"
                                className="inline-flex items-center gap-1 bg-white text-[#071426] hover:bg-[#EAF5FF] font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                            >
                                <span>Profiter</span>
                                <ArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="absolute right-3 bottom-3 size-28 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden flex items-center justify-center">
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
