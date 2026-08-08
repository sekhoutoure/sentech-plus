'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Logo from './Logo'

const Navbar: React.FC = () => {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
        }
    }

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-sm py-3' 
                : 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-4'
        }`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center space-y-3">
                
                {/* Centered Brand Logo (Shop.app style) */}
                <Link href="/" className="flex items-center justify-center group transition-transform duration-200 hover:scale-105 active:scale-95">
                    <Logo className="h-10 sm:h-12" />
                </Link>

                {/* Centered Modern Search Bar (Shop.app style) */}
                <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                    <div className="relative w-full flex items-center bg-slate-100 hover:bg-slate-100/80 focus-within:bg-white px-4 py-2.5 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 shadow-2xs">
                        <Search size={17} className="text-slate-400 shrink-0 mr-2.5" />
                        <input
                            type="text"
                            placeholder="Rechercher des équipements, casques, montres..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-500"
                        />
                        <button 
                            type="submit" 
                            aria-label="Rechercher"
                            className="text-[10px] font-bold text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 px-2.5 py-1 rounded-md border border-slate-200 shrink-0 transition"
                        >
                            Rechercher
                        </button>
                    </div>
                </form>

            </div>
        </header>
    );
};

export default Navbar;
