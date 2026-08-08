'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Sparkles, Smartphone, Headphones, Watch, Gamepad2, Laptop, TrendingUp } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function OmniboxSearch() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const products = useSelector((state: any) => state.product?.list || [])

    const suggestions = [
        { label: "Écouteurs sans fil & Casques", query: "Casques", icon: Headphones },
        { label: "Smartphones & Accessoires", query: "Smartphones", icon: Smartphone },
        { label: "Montres connectées AMOLED", query: "Montres", icon: Watch },
        { label: "Ordinateurs & Laptops", query: "Laptops", icon: Laptop },
        { label: "Gaming & Manettes", query: "Gaming", icon: Gamepad2 },
    ]

    // Click outside to close suggestion dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            setIsFocused(false)
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
        }
    }

    const handleSelectSuggestion = (query: string) => {
        setSearch(query)
        setIsFocused(false)
        router.push(`/shop?search=${encodeURIComponent(query)}`)
    }

    // Dynamic autocomplete matching
    const matchingProducts = search.trim()
        ? products
            .filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 4)
        : []

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-3 z-30">
            {/* Main Omnibox Bar (Shop.app inspired) */}
            <form onSubmit={handleSearch} className="relative w-full">
                <div 
                    className={`relative flex items-center bg-white/95 backdrop-blur-xl rounded-[32px] p-1.5 transition-all duration-300 ${
                        isFocused 
                            ? 'shadow-[0_8px_30px_rgb(23,105,255,0.15)] ring-2 ring-[#1769FF] border-transparent' 
                            : 'shadow-[0_4px_20px_0_rgba(0,0,0,0.08)] border border-[#E4E7EC] hover:border-[#CBD5E1]'
                    }`}
                >
                    <div className="flex items-center flex-1 pl-4 sm:pl-5 pr-2">
                        <Search size={19} className={`transition-colors duration-200 ${isFocused ? 'text-[#1769FF]' : 'text-[#667085]'}`} />
                        <input
                            type="search"
                            role="searchbox"
                            autoComplete="off"
                            placeholder="Que recherchez-vous aujourd'hui sur SenTech Plus ?"
                            value={search}
                            onFocus={() => setIsFocused(true)}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none px-3 py-2 text-xs sm:text-sm font-medium text-[#101828] placeholder:text-[#667085] placeholder:opacity-80"
                        />
                    </div>

                    <button
                        type="submit"
                        aria-label="Rechercher"
                        className="flex size-10 sm:size-11 items-center justify-center rounded-full bg-[#1769FF] hover:bg-[#1256D6] text-white shadow-[0_4px_16px_0_rgba(23,105,255,0.35)] active:scale-95 transition-transform duration-200 cursor-pointer shrink-0"
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>

            {/* Shop.app Style Floating Dropdown Suggestions */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl border border-[#E4E7EC] shadow-[0_12px_40px_0_rgba(0,0,0,0.12)] p-4 sm:p-5 overflow-hidden animate-fade-in-up">
                    
                    {matchingProducts.length > 0 ? (
                        <div className="space-y-1">
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] px-2 mb-2 flex items-center gap-1.5">
                                <Sparkles size={12} className="text-[#1769FF]" /> Produits correspondants
                            </p>
                            {matchingProducts.map((prod: any) => (
                                <div
                                    key={prod.id}
                                    onClick={() => handleSelectSuggestion(prod.name)}
                                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#EAF3FF] text-[#101828] hover:text-[#1769FF] transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-[#F7F9FC] border border-[#E4E7EC] flex items-center justify-center p-1 shrink-0">
                                            <Search size={14} className="text-[#667085] group-hover:text-[#1769FF]" />
                                        </div>
                                        <span className="text-xs sm:text-sm font-semibold">{prod.name}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#1769FF] bg-white px-2.5 py-0.5 rounded-full border border-[#E4E7EC]">
                                        {prod.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] px-2 mb-2 flex items-center gap-1.5">
                                <TrendingUp size={12} className="text-[#1769FF]" /> Recherches populaires au Sénégal
                            </p>
                            {suggestions.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSelectSuggestion(item.query)}
                                        className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#EAF3FF] text-[#101828] hover:text-[#1769FF] transition-all cursor-pointer group"
                                    >
                                        <div className="size-8 rounded-full bg-[#F7F9FC] group-hover:bg-white border border-[#E4E7EC] flex items-center justify-center shrink-0">
                                            <Icon size={15} className="text-[#667085] group-hover:text-[#1769FF]" />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-[#E4E7EC]/60 px-2 flex items-center justify-between text-[11px] text-[#667085]">
                        <span>Conseil : Appuyez sur Entrée pour valider la recherche</span>
                        <span className="font-bold text-[#1769FF]">SenTech Plus</span>
                    </div>
                </div>
            )}
        </div>
    )
}
