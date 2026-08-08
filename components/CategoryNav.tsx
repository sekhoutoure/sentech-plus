'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
    Smartphone, 
    Laptop, 
    Headphones, 
    Watch, 
    Gamepad2, 
    Speaker, 
    Plug, 
    Home, 
    Camera, 
    Zap 
} from 'lucide-react'

export default function CategoryNav() {
    const router = useRouter();

    const categories = [
        { label: "Smartphones", query: "Smartphones", icon: Smartphone },
        { label: "Ordinateurs", query: "Laptops", icon: Laptop },
        { label: "Casques & Écouteurs", query: "Casques", icon: Headphones },
        { label: "Montres connectées", query: "Montres", icon: Watch },
        { label: "Gaming", query: "Gaming", icon: Gamepad2 },
        { label: "Enceintes", query: "Enceintes", icon: Speaker },
        { label: "Accessoires", query: "Accessoires", icon: Plug },
        { label: "Maison intelligente", query: "Maison", icon: Home },
        { label: "Caméras", query: "Cameras", icon: Camera },
        { label: "Chargeurs", query: "Chargeurs", icon: Zap },
    ];

    return (
        <nav aria-label="Catégories principales" className="w-full bg-white border-b border-[#E4E7EC] shadow-2xs">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
                    {categories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={idx}
                                href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#101828] hover:text-[#1769FF] hover:bg-[#EAF3FF] transition-all duration-200 shrink-0 group border border-transparent hover:border-[#1769FF]/20"
                            >
                                <Icon size={16} className="text-[#667085] group-hover:text-[#1769FF] transition-colors shrink-0" />
                                <span className="whitespace-nowrap">{cat.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
