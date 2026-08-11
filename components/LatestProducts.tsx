'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard, { Product } from './ProductCard'
import { useProductStore } from '@/lib/stores'

const LatestProducts: React.FC = () => {
    const displayQuantity = 8
    const products = useProductStore(s => s.list)

    const latest = [...products]
        .sort((a: Product, b: Product) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime())
        .slice(0, displayQuantity)

    return (
        <section aria-label="Dernières arrivées" className="section-below-fold px-3 sm:px-6 my-4 max-w-[1280px] mx-auto w-full">

            {/* Section Header Vertically Aligned */}
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 pb-2 border-b border-[#E1E8F0]">
                <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] text-[10px] font-bold uppercase tracking-wider border border-[#1677FF]/20">
                        <Sparkles size={11} /> NOUVEAUTÉS HIGH-TECH
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172033] tracking-tight">
                        Dernières arrivées
                    </h2>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1677FF] hover:text-[#123B78] transition-colors shrink-0"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={13} />
                </Link>
            </div>

            {/* Grid — 2 COLONNES sur mobile gap 10px */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
                {latest.length > 0 ? (
                    latest.map((product: Product) => (
                        <ProductCard key={product.id || product.name} product={product} />
                    ))
                ) : (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div 
                            key={index}
                            className="w-full bg-white rounded-2xl border border-[#E1E8F0] p-3 flex flex-col justify-between min-h-[260px] animate-pulse"
                        >
                            <div className="w-full aspect-square bg-[#F5F8FC] rounded-xl mb-2" />
                            <div className="space-y-1.5">
                                <div className="h-3 bg-[#F5F8FC] rounded w-1/3" />
                                <div className="h-4 bg-[#F5F8FC] rounded w-3/4" />
                                <div className="h-4 bg-[#F5F8FC] rounded w-1/2" />
                            </div>
                            <div className="h-10 bg-[#F5F8FC] rounded-xl mt-2" />
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}

export default LatestProducts
