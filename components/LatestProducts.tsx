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
        <section className="px-4 sm:px-6 my-16 sm:my-24 max-w-[1400px] mx-auto @container">

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        NOUVEAUTÉS HIGH-TECH 2026
                    </div>
                    <h2 className="text-3xl font-black text-[#101828] tracking-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
                        Dernières arrivées
                    </h2>
                    <p className="text-sm text-[#667085] max-w-md font-normal" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                        Les produits les plus récents, soigneusement sélectionnés par notre équipe.
                    </p>
                </div>

                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1769FF] border-2 border-[#1769FF] bg-transparent hover:bg-[#1769FF] hover:text-white px-6 py-2.5 rounded-full transition-all duration-300 self-start sm:self-auto shrink-0"
                >
                    <span>Voir tout</span>
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EBEBEB] to-transparent mb-8" />

            {/* Grid */}
            {latest.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {latest.map((product: Product) => (
                        <ProductCard key={product.id || product.name} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border-2 border-dashed border-[#EBEBEB] rounded-3xl bg-[#F7F9FC]/50">
                    <div className="size-16 rounded-2xl bg-white shadow-sm border border-[#EBEBEB] flex items-center justify-center">
                        <Sparkles size={28} className="text-[#1769FF]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#101828]">Aucun produit disponible</h3>
                    <p className="text-sm text-[#667085] max-w-sm">Revenez plus tard pour découvrir nos nouveautés high-tech.</p>
                    <Link href="/shop" className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-white bg-[#1769FF] hover:bg-[#071126] px-5 py-2.5 rounded-xl transition-colors">
                        Parcourir le catalogue <ArrowRight size={16} />
                    </Link>
                </div>
            )}
        </section>
    )
}

export default LatestProducts
