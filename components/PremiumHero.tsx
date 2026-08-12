'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Flame, Headphones } from 'lucide-react'
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
        <section className="px-1.5 sm:px-6 pt-1 pb-2 sm:py-6 max-w-[1400px] mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-stretch">

                {/* ═══ GRANDE CARTE HERO LUMINEUSE (border-radius: 24px, border: 1px solid #DCE8F5) ═══ */}
                <div className="lg:col-span-8 relative flex flex-col bg-gradient-to-br from-[#F8FBFF] via-[#F3F8FF] to-[#EAF3FF] rounded-[24px] text-[#172033] overflow-hidden border border-[#DCE8F5] shadow-2xs group">

                    {/* Subtle Blue Glow Halo */}
                    <div className="absolute -top-24 -right-24 size-[250px] sm:size-[420px] bg-[#1677FF]/10 rounded-full blur-[70px] sm:blur-[110px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 size-[220px] sm:size-[380px] bg-[#EAF3FF] rounded-full blur-[60px] sm:blur-[100px] pointer-events-none" />

                    {/* ── MOBILE layout: Compact ultra-lumineux ── */}
                    <div className="flex lg:hidden flex-col justify-between p-3.5 sm:p-5 relative z-10 min-h-[220px] max-h-[260px]">
                        {/* Top Row: Badge + Delivery */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] border border-[#0B54C2]/20 text-[9px] font-extrabold text-[#0B54C2]">
                                <Sparkles size={10} className="text-[#0B54C2]" />
                                <span>COLLECTION HIGH-TECH</span>
                            </div>
                            <span className="text-[9px] font-bold text-[#0D7D53] bg-[#0D7D53]/10 border border-[#0D7D53]/20 px-2 py-0.5 rounded-full">
                                🚚 Express Sénégal
                            </span>
                        </div>

                        {/* Mid Row: 45% Text Left, 55% Image Right */}
                        <div className="grid grid-cols-12 gap-2 items-center my-1.5">
                            {/* Left Text */}
                            <div className="col-span-7 space-y-1">
                                <h1 className="text-[18px] xs:text-[21px] font-black tracking-tight text-[#182230] leading-tight">
                                    Des accessoires <span className="text-[#1677FF]">intelligents</span> pour votre quotidien.
                                </h1>
                                <p className="text-[10px] text-[#667085] font-normal line-clamp-2 leading-snug">
                                    Découvrez nos gadgets et équipements haut de gamme.
                                </p>
                                <div className="pt-1">
                                    <Link
                                        href="/shop"
                                        className="inline-flex items-center gap-1 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-xs active:scale-95 transition-all"
                                    >
                                        <span>Découvrir</span>
                                        <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image */}
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
                                                alt="Produit High-Tech SenTechPLUS"
                                                fill
                                                sizes="(max-width: 640px) 160px, 240px"
                                                className="object-contain drop-shadow-[0_10px_20px_rgba(20,40,70,0.12)]"
                                                priority={index === 0}
                                                fetchPriority={index === 0 ? "high" : "auto"}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row: Indicator dots */}
                        <div className="flex items-center justify-center gap-0.5">
                            {featuredImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImgIndex(idx)}
                                    aria-label={`Diapositive ${idx + 1}`}
                                    className="p-2 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                                >
                                    <span
                                        className={`h-1.5 rounded-full transition-all duration-300 block ${
                                            idx === currentImgIndex ? 'w-5 bg-[#1677FF]' : 'w-1.5 bg-[#D9DEE7]'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── DESKTOP layout Lumineux ── */}
                    <div className="hidden lg:grid grid-cols-12 gap-6 lg:gap-8 items-center flex-1 p-10 xl:p-12 relative z-10">
                        <div className="col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3FF] border border-[#0B54C2]/20 text-xs font-bold text-[#0B54C2] shadow-2xs">
                                <Sparkles size={13} className="text-[#0B54C2]" />
                                <span>COLLECTION HIGH-TECH 2026</span>
                            </div>

                            <h1 className="text-[36px] xl:text-[44px] font-black tracking-tight text-[#172033] leading-[1.1]">
                                Des accessoires <span className="text-[#1677FF]">intelligents</span> pour simplifier votre quotidien.
                            </h1>

                            <p className="text-[#667085] text-[15px] sm:text-[16px] font-normal leading-relaxed max-w-md">
                                Découvrez nos gadgets et équipements haut de gamme.
                            </p>

                            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2.5 bg-[#0B54C2] hover:bg-[#09449E] text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-xs hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer"
                                >
                                    <span>Découvrir la collection</span>
                                    <ArrowRight size={15} />
                                </Link>
                                <Link
                                    href="/shop?search=Promo"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-[#F3F8FF] text-[#172033] font-semibold text-sm py-3 px-6 rounded-xl border border-[#E1E8F0] transition-all duration-200 cursor-pointer shadow-2xs"
                                >
                                    <span>Voir les offres</span>
                                </Link>
                            </div>

                            {/* Trust badges discreet */}
                            <div className="flex items-center gap-4 pt-2 text-xs text-[#667085] font-medium">
                                <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#16C784]" /> 🚚 Livraison rapide</span>
                                <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#1677FF]" /> 🔒 Paiement sécurisé</span>
                                <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#25D366]" /> 💬 Support WhatsApp</span>
                            </div>
                        </div>

                        <div className="col-span-5 relative h-full flex items-center justify-center">
                            <div className="relative w-full min-h-[300px] lg:min-h-[320px] rounded-2xl bg-white border border-[#E8EDF3] shadow-xs p-3 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#EAF3FF]/40 to-transparent pointer-events-none" />
                                {featuredImages.map((src, index) => {
                                    const isLcp = index === 0
                                    const isActive = index === currentImgIndex
                                    if (!isActive && !isLcp) return null
                                    return (
                                        <div
                                            key={index}
                                            className={`absolute inset-0 flex items-center justify-center p-3 transition-all duration-700 ease-out ${
                                                isActive
                                                    ? 'opacity-100 scale-100 translate-y-0'
                                                    : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
                                            }`}
                                        >
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <Image
                                                    src={src}
                                                    alt="Produit High-Tech SenTechPLUS"
                                                    width={420}
                                                    height={320}
                                                    sizes="(max-width: 1024px) 300px, 420px"
                                                    className="object-contain drop-shadow-[0_15px_30px_rgba(20,40,70,0.12)] max-h-[300px] w-auto h-auto"
                                                    priority={isLcp}
                                                    loading={isLcp ? "eager" : "lazy"}
                                                    fetchPriority={isLcp ? "high" : "auto"}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
                                    {featuredImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImgIndex(idx)}
                                            aria-label={`Diapositive ${idx + 1}`}
                                            className="p-2 cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                                        >
                                            <span
                                                className={`h-1.5 rounded-full transition-all duration-300 block ${
                                                    idx === currentImgIndex ? 'w-6 bg-[#1677FF]' : 'w-1.5 bg-[#D9DEE7]'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ CARTES SECONDAIRES DESKTOP LUMINEUSES ═══ */}
                <div className="hidden lg:grid lg:col-span-4 grid-cols-1 gap-6">
                    {/* Carte 1: Audio */}
                    <div className="relative bg-white rounded-3xl p-7 border border-[#E8EDF3] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[200px]">
                        <div className="absolute -right-6 -bottom-6 size-40 bg-[#EAF3FF] rounded-full pointer-events-none" />

                        <div className="relative z-10 space-y-1">
                            <div className="size-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                                <Headphones size={20} />
                            </div>
                            <h3 className="text-xl font-black text-[#182230] leading-tight pt-0.5">
                                Audio & Casques
                            </h3>
                        </div>

                        <div className="relative z-10 pt-4">
                            <Link
                                href="/shop?search=Casques"
                                className="inline-flex items-center gap-1 text-xs font-black text-[#1677FF]"
                            >
                                <span>Explorer</span>
                                <ArrowRight size={11} />
                            </Link>
                        </div>

                        <div className="absolute right-3 bottom-3 size-28 rounded-2xl bg-[#F5F7FA] border border-[#E8EDF3] overflow-hidden flex items-center justify-center">
                            <Image
                                src={assets.product_img3}
                                alt="Audio & Casques"
                                fill
                                sizes="112px"
                                className="object-contain p-1"
                            />
                        </div>
                    </div>

                    {/* Carte 2: Bon Plan */}
                    <div className="relative bg-gradient-to-br from-[#EAF3FF] via-white to-[#F3F7FC] rounded-3xl p-7 text-[#182230] border border-[#E8EDF3] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden min-h-[200px]">
                        <div className="relative z-10 space-y-1">
                            <span className="inline-flex items-center gap-1 bg-[#C2410C]/10 text-[#C2410C] text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-[#C2410C]/20">
                                <Flame size={9} className="text-[#C2410C]" />
                                BON PLAN -20%
                            </span>
                            <h3 className="text-3xl font-black tracking-tight text-[#182230] leading-none pt-0.5">
                                Jusqu'à -20%
                            </h3>
                        </div>

                        <div className="relative z-10 pt-4">
                            <Link
                                href="/shop?search=Promo"
                                className="inline-flex items-center gap-1 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                            >
                                <span>Profiter</span>
                                <ArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="absolute right-3 bottom-3 size-28 rounded-2xl bg-white border border-[#E8EDF3] shadow-2xs overflow-hidden flex items-center justify-center">
                            <Image
                                src={assets.product_img4}
                                alt="Bon Plan"
                                fill
                                sizes="112px"
                                className="object-contain p-1"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}
