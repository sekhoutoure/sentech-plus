'use client'
import { categories } from "@/assets/assets";
import { useRouter } from "next/navigation";
import React from "react";
import { Headphones, Speaker, Watch, Radio, Mouse, Sparkles, Smartphone, Laptop } from "lucide-react";

export default function CategoriesMarquee() {
    const router = useRouter();

    const categoryIcons: Record<string, any> = {
        "Casques": Headphones,
        "Enceintes": Speaker,
        "Montres": Watch,
        "Écouteurs": Radio,
        "Souris": Mouse,
        "Smartphones": Smartphone,
        "Laptops": Laptop,
        "Décoration": Sparkles,
    };

    const extendedList = [...categories, "Smartphones", "Laptops"];

    return (
        <div className="relative w-full max-w-7xl mx-auto overflow-hidden select-none py-3 group">
            {/* Left and Right Gradient Fade Edges */}
            <div className="absolute left-0 top-0 h-full w-16 sm:w-28 z-10 pointer-events-none bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-16 sm:w-28 z-10 pointer-events-none bg-gradient-to-l from-slate-50 to-transparent" />

            {/* Marquee Track */}
            <div className="flex min-w-[200%] animate-[marqueeScroll_32s_linear_infinite] group-hover:[animation-play-state:paused] gap-3 sm:gap-4 will-change-transform py-1">
                {[...extendedList, ...extendedList, ...extendedList, ...extendedList].map((category: string, index: number) => {
                    const IconComponent = categoryIcons[category] || Sparkles;
                    return (
                        <button 
                            key={index} 
                            onClick={() => router.push(`/shop?search=${encodeURIComponent(category)}`)}
                            className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full bg-white hover:bg-blue-600 text-slate-800 hover:text-white font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-600 hover:scale-105 active:scale-95 shrink-0 group/pill"
                        >
                            <IconComponent size={16} className="text-blue-600 group-hover/pill:text-white transition-colors" />
                            <span>{category}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
