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

    const bestProducts = [...products]
        .sort((a: Product, b: Product) => {
            const scoreA = (a.salesCount || 0) * 10 + (a.rating?.length || 0) * 2;
            const scoreB = (b.salesCount || 0) * 10 + (b.rating?.length || 0) * 2;
            if (scoreB !== scoreA) return scoreB - scoreA;
            return (a.id || '').localeCompare(b.id || '');
        })
        .slice(0, displayQuantity);

    return (
        <section className='bg-amber-50/30 py-10 sm:py-16 lg:py-24'>
            <div className='px-3 sm:px-6 max-w-[1400px] mx-auto @container'>
                {/* Section Header */}
                <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[#E4E7EC]'>
                    <div className='space-y-2'>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-600 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                            <Flame size={12} className="text-amber-500" /> 🔥 MEILLEURES VENTES
                        </div>
                        <h2 className='text-xl sm:text-2xl lg:text-3xl font-black text-[#101828] tracking-tight' style={{ textWrap: 'balance' } as React.CSSProperties}>
                            Meilleures ventes & tendances
                        </h2>
                        <p className='text-xs sm:text-sm text-[#667085] max-w-md font-normal hidden sm:block' style={{ textWrap: 'pretty' } as React.CSSProperties}>
                            Les produits préférés de nos clients.
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className='inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 border-2 border-amber-600 bg-transparent hover:bg-amber-600 hover:text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300 self-start sm:self-auto shrink-0'
                    >
                        <span>Voir tout</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
                
                {/* Products Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6'>
                    {bestProducts.map((product: Product, index: number) => (
                        <ProductCard 
                            key={product.id || product.name} 
                            product={product} 
                            rank={index + 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSelling;
