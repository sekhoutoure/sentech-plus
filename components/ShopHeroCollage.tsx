'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
    Search, 
    ArrowRight, 
    Smartphone, 
    Headphones, 
    Watch, 
    Laptop, 
    Gamepad2, 
    Plug, 
    Home,
    Star 
} from 'lucide-react'
import { assets } from '@/assets/assets'
import Logo from './Logo'

export default function ShopHeroCollage() {
    const router = useRouter()
    const [search, setSearch] = useState('')

    const categories = [
        { label: "Smartphones", query: "Smartphones", dotColor: "bg-blue-600" },
        { label: "Audio & Casques", query: "Casques", dotColor: "bg-indigo-600" },
        { label: "Montres connectées", query: "Montres", dotColor: "bg-purple-600" },
        { label: "Ordinateurs & Laptops", query: "Laptops", dotColor: "bg-emerald-600" },
        { label: "Gaming", query: "Gaming", dotColor: "bg-rose-600" },
        { label: "Accessoires & Hubs", query: "Accessoires", dotColor: "bg-amber-600" },
        { label: "Smart Home", query: "Maison", dotColor: "bg-teal-600" },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
        }
    }

    return (
        <section className="relative w-full pt-4 pb-8 sm:py-10 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-gradient-to-tr from-[#1769FF]/10 via-[#EAF3FF]/40 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-6">
                
                {/* Floating Product Cards (Shop.app Top Hero Style) */}
                <div className="relative w-full flex items-center justify-center py-2 min-h-[140px] sm:min-h-[160px]">
                    
                    {/* Floating Product Card Top-Left with Rating */}
                    <div className="hidden md:flex absolute left-4 lg:left-10 top-0 flex-col items-center bg-white rounded-2xl p-2.5 shadow-xl border border-[#EBEBEB] rotate-[-6deg] hover:rotate-0 transition-transform duration-300 animate-float">
                        <div className="relative size-16 lg:size-20 rounded-xl bg-[#F7F9FC] overflow-hidden mb-1.5">
                            <Image src={assets.product_img3} alt="Wireless Headphone" fill className="object-contain p-1" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#101828]">
                            <Star size={11} fill="#F59E0B" className="text-amber-500" />
                            <span>4.9 (3.2k)</span>
                        </div>
                        <span className="text-[9px] text-[#667085] font-semibold">Casque ANC Pro</span>
                    </div>

                    {/* Centered Brand Logo */}
                    <div className="flex flex-col items-center space-y-2 group z-20">
                        <Link href="/" className="transition-transform duration-300 hover:scale-105 active:scale-95">
                            <Logo className="h-12 sm:h-16 w-auto" />
                        </Link>
                        <p className="text-xs sm:text-sm font-semibold text-[#667085] max-w-sm">
                            La technologie qui simplifie votre quotidien
                        </p>
                    </div>

                    {/* Floating Product Card Top-Right with Rating */}
                    <div className="hidden md:flex absolute right-4 lg:right-10 top-0 flex-col items-center bg-white rounded-2xl p-2.5 shadow-xl border border-[#EBEBEB] rotate-[6deg] hover:rotate-0 transition-transform duration-300 animate-float" style={{ animationDelay: '1.5s' }}>
                        <div className="relative size-16 lg:size-20 rounded-xl bg-[#F7F9FC] overflow-hidden mb-1.5">
                            <Image src={assets.product_img4} alt="Smartwatch" fill className="object-contain p-1" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#101828]">
                            <Star size={11} fill="#F59E0B" className="text-amber-500" />
                            <span>4.8 (1.9k)</span>
                        </div>
                        <span className="text-[9px] text-[#667085] font-semibold">Smartwatch AMOLED</span>
                    </div>

                </div>

                {/* Big Centered Omnibox Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl relative">
                    <div className="relative flex items-center bg-white rounded-[32px] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#EBEBEB] focus-within:border-[#1769FF] focus-within:ring-4 focus-within:ring-[#1769FF]/15 transition-all duration-300">
                        <Search size={20} className="text-[#667085] ml-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="Que recherchez-vous aujourd'hui sur SenTech Plus ?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#101828] placeholder:text-[#667085] placeholder:opacity-75"
                        />
                        <button
                            type="submit"
                            aria-label="Rechercher"
                            className="size-11 rounded-full bg-[#1769FF] hover:bg-[#1256D6] text-white flex items-center justify-center shadow-md shadow-[#1769FF]/30 active:scale-95 transition-transform shrink-0 cursor-pointer"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </form>

                {/* Category Filter Pills (Exact Shop.app color dots pills) */}
                <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1.5 no-scrollbar">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={`/shop?search=${encodeURIComponent(cat.query)}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#101828] bg-white hover:bg-[#F7F9FC] border border-[#EBEBEB] transition-all duration-200 shrink-0 hover:scale-105 active:scale-95 shadow-2xs"
                        >
                            <span className={`size-2.5 rounded-full ${cat.dotColor}`} />
                            <span>{cat.label}</span>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    )
}
