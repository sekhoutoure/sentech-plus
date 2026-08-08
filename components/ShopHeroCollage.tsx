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
    Sparkles 
} from 'lucide-react'
import { assets } from '@/assets/assets'
import Logo from './Logo'

export default function ShopHeroCollage() {
    const router = useRouter()
    const [search, setSearch] = useState('')

    const categories = [
        { label: "Smartphones", query: "Smartphones", icon: Smartphone, color: "bg-blue-50 text-blue-700 border-blue-200" },
        { label: "Audio & Casques", query: "Casques", icon: Headphones, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        { label: "Montres connectées", query: "Montres", icon: Watch, color: "bg-purple-50 text-purple-700 border-purple-200" },
        { label: "Ordinateurs & Laptops", query: "Laptops", icon: Laptop, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { label: "Gaming", query: "Gaming", icon: Gamepad2, color: "bg-rose-50 text-rose-700 border-rose-200" },
        { label: "Accessoires & Hubs", query: "Accessoires", icon: Plug, color: "bg-amber-50 text-amber-700 border-amber-200" },
        { label: "Smart Home", query: "Maison", icon: Home, color: "bg-teal-50 text-teal-700 border-teal-200" },
    ]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
        }
    }

    return (
        <section className="relative w-full pt-6 pb-10 sm:py-12 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-gradient-to-tr from-[#1769FF]/10 via-[#EAF3FF] to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-6">
                
                {/* Floating Product Collage Around Logo (Shop.app style) */}
                <div className="relative w-full flex items-center justify-center py-4">
                    
                    {/* Floating Product Left 1 */}
                    <div className="hidden md:block absolute -left-4 lg:left-2 top-2 size-20 lg:size-24 rounded-2xl bg-white shadow-xl border border-[#EBEBEB] p-2 rotate-[-8deg] hover:rotate-0 transition-transform duration-300 animate-float">
                        <Image src={assets.product_img1} alt="Gaming Mouse" fill className="object-contain p-2" />
                    </div>

                    {/* Floating Product Left 2 */}
                    <div className="hidden lg:block absolute left-24 -bottom-2 size-20 rounded-2xl bg-white shadow-lg border border-[#EBEBEB] p-2 rotate-[6deg] hover:rotate-0 transition-transform duration-300">
                        <Image src={assets.product_img4} alt="Smartwatch" fill className="object-contain p-2" />
                    </div>

                    {/* Centered Brand Logo */}
                    <div className="flex flex-col items-center space-y-2 group">
                        <Link href="/" className="transition-transform duration-300 hover:scale-105 active:scale-95">
                            <Logo className="h-12 sm:h-16 w-auto" />
                        </Link>
                        <p className="text-xs sm:text-sm font-semibold text-[#667085] max-w-md">
                            La boutique n°1 des gadgets et équipements High-Tech au Sénégal
                        </p>
                    </div>

                    {/* Floating Product Right 1 */}
                    <div className="hidden md:block absolute -right-4 lg:right-2 top-2 size-20 lg:size-24 rounded-2xl bg-white shadow-xl border border-[#EBEBEB] p-2 rotate-[8deg] hover:rotate-0 transition-transform duration-300 animate-float" style={{ animationDelay: '1.5s' }}>
                        <Image src={assets.product_img3} alt="Wireless Headphone" fill className="object-contain p-2" />
                    </div>

                    {/* Floating Product Right 2 */}
                    <div className="hidden lg:block absolute right-24 -bottom-2 size-20 rounded-2xl bg-white shadow-lg border border-[#EBEBEB] p-2 rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
                        <Image src={assets.product_img8} alt="Smartphone" fill className="object-contain p-2" />
                    </div>

                </div>

                {/* Big Centered Omnibox Search Bar (Exact Shop.app style) */}
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

                {/* Category Filter Pills (Shop.app style horizontal pills) */}
                <div className="flex items-center gap-2 overflow-x-auto max-w-full py-2 no-scrollbar">
                    {categories.map((cat, idx) => {
                        const Icon = cat.icon
                        return (
                            <Link
                                key={idx}
                                href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 border hover:scale-105 active:scale-95 shadow-2xs ${cat.color}`}
                            >
                                <Icon size={14} className="shrink-0" />
                                <span>{cat.label}</span>
                            </Link>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
