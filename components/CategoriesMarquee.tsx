'use client'
import { categories } from "@/assets/assets";
import { useRouter } from "next/navigation";
import React from "react";

const CategoriesMarquee: React.FC = () => {
    const router = useRouter()

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_25s_linear_infinite] group-hover:[animation-play-state:paused] gap-4 will-change-transform" >
                {[...categories, ...categories, ...categories, ...categories].map((company: string, index: number) => (
                    <button 
                        key={index} 
                        onClick={() => router.push(`/shop?search=${encodeURIComponent(company)}`)}
                        className="px-5 py-2.5 bg-slate-100/90 rounded-full text-slate-700 font-medium text-xs sm:text-sm hover:bg-blue-600 hover:text-white transition duration-200 cursor-pointer border border-slate-200/60 shadow-xs"
                    >
                        {company}
                    </button>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;
