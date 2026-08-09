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
        <section className="px-3 sm:px-6 my-10 sm:my-16 lg:my-24 max-w-[1400px] mx-auto @container">

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={12} />
                        NOUVEAUTÉS HIGH-TECH 2026
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#101828] tracking-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
                        Dernières arrivées
                    </h2>
                    <p className="text-xs sm:text-sm text-[#667085] max-w-md font-normal hidden sm:block" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                        Les produits les plus récents, soigneusement sélectionnés par notre équipe.
                    </p>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1769FF] border-2 border-[#1769FF] bg-transparent hover:bg-[#1769FF] hover:text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 self-start sm:self-auto shrink-0"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={14} />
                </Link>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EBEBEB] to-transparent mb-5 sm:mb-8" />

            {/* Grid */}
            {latest.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
                    {latest.map((product: Product) => (
                        <ProductCard key={product.id || product.name} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border-2 border-dashed border-[#EBEBEB] rounded-2xl sm:rounded-3xl bg-[#F7F9FC]/50">
                    <div className="size-14 rounded-2xl bg-white shadow-sm border border-[#EBEBEB] flex items-center justify-center">
                        <Sparkles size={24} className="text-[#1769FF]" />
                    </div>
                    <h3 className="text-base font-bold text-[#101828]">Aucun produit disponible</h3>
                    <p className="text-xs text-[#667085] max-w-xs">Revenez plus tard pour découvrir nos nouveautés high-tech.</p>
                    <Link href="/shop" className="mt-1 inline-flex items-center gap-2 text-xs font-bold text-white bg-[#1769FF] hover:bg-[#071126] px-5 py-2.5 rounded-xl transition-colors">
                        Parcourir le catalogue <ArrowRight size={14} />
                    </Link>
                </div>
            )}
        </section>
    )
}

export default LatestProducts
