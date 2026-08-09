'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import ProductCard, { Product } from './ProductCard'
import { useSelector } from 'react-redux'

interface RootState {
    product?: { list: Product[] };
}

const LatestProducts: React.FC = () => {
    const displayQuantity = 8
    const products = useSelector((state: RootState) => state.product?.list || [])

    const latest = [...products]
        .sort((a: Product, b: Product) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime())
        .slice(0, displayQuantity)

    return (
        <section className="px-1.5 sm:px-6 my-3 sm:my-8 lg:my-12 max-w-[1400px] mx-auto w-full @container">

            {/* Section Header */}
            <div className="flex items-end justify-between gap-3 mb-4 sm:mb-8 pb-3 border-b border-[#E8EDF3]">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-[#1677FF]/20">
                        <Sparkles size={12} />
                        NOUVEAUTÉS HIGH-TECH 2026
                    </div>
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-[#182230] tracking-tight">
                        Dernières arrivées
                    </h2>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:underline shrink-0"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={13} />
                </Link>
            </div>

            {/* Grid — 2 COLONNES sur mobile avec gap 8-10px */}
            {latest.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
                    {latest.map((product: Product) => (
                        <ProductCard key={product.id || product.name} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center border-2 border-dashed border-[#E5E9F0] rounded-2xl bg-[#F6F8FB]/50">
                    <Sparkles size={24} className="text-[#007BFF]" />
                    <h3 className="text-sm font-bold text-[#101828]">Aucun produit disponible</h3>
                    <Link href="/shop" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#007BFF] hover:bg-[#0069D9] px-4 py-2 rounded-xl">
                        Parcourir le catalogue <ArrowRight size={13} />
                    </Link>
                </div>
            )}
        </section>
    )
}

export default LatestProducts
