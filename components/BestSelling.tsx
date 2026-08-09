'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import ProductCard, { Product } from './ProductCard'
import { useSelector } from 'react-redux'

interface RootState {
    product?: { list: Product[] };
}

const BestSelling: React.FC = () => {
    const displayQuantity = 8;
    const products = useSelector((state: RootState) => state.product?.list || []);

    // Trier spécifiquement par volume de vente réel (salesCount) pour une sélection top vendeurs distincte
    const bestProducts = [...products]
        .sort((a: Product, b: Product) => {
            const salesA = Number(a.salesCount || 0) * 10 + (Array.isArray(a.rating) ? a.rating.length : 0);
            const salesB = Number(b.salesCount || 0) * 10 + (Array.isArray(b.rating) ? b.rating.length : 0);
            if (salesB !== salesA) return salesB - salesA;
            return (b.name || '').localeCompare(a.name || '');
        })
        .slice(0, displayQuantity);

    return (
        <section className='bg-[#F3F7FC] py-3 sm:py-8 lg:py-12 w-full'>
            <div className='px-1.5 sm:px-6 max-w-[1400px] mx-auto w-full'>
                {/* Section Header */}
                <div className='flex items-end justify-between gap-3 mb-4 sm:mb-8 pb-3 border-b border-[#E8EDF3]'>
                    <div className='space-y-1'>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] font-extrabold uppercase tracking-wider text-[10px] sm:text-xs">
                            <Flame size={12} className="text-[#FF6B35]" /> MEILLEURES VENTES
                        </div>
                        <h2 className='text-lg sm:text-2xl lg:text-3xl font-black text-[#182230] tracking-tight'>
                            Meilleures ventes & tendances
                        </h2>
                    </div>

                    <Link
                        href="/shop"
                        className='inline-flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:underline shrink-0'
                    >
                        <span>Voir tout</span>
                        <ArrowRight size={13} />
                    </Link>
                </div>
                
                {/* Products Grid — 2 COLONNES sur mobile avec gap 8-10px */}
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6'>
                    {bestProducts.length > 0 ? (
                        bestProducts.map((product: Product, index: number) => (
                            <ProductCard 
                                key={product.id || product.name} 
                                product={product} 
                                rank={index + 1}
                            />
                        ))
                    ) : (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div 
                                key={index}
                                className="w-full bg-white rounded-2xl border border-[#E8EDF3] p-3 flex flex-col justify-between min-h-[280px] sm:min-h-[360px] animate-pulse"
                            >
                                <div className="w-full aspect-square bg-[#F5F7FA] rounded-xl mb-3" />
                                <div className="space-y-2">
                                    <div className="h-3 bg-[#F5F7FA] rounded w-1/3" />
                                    <div className="h-4 bg-[#F5F7FA] rounded w-3/4" />
                                    <div className="h-4 bg-[#F5F7FA] rounded w-1/2" />
                                </div>
                                <div className="h-10 bg-[#F5F7FA] rounded-xl mt-3" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSelling;
