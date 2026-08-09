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
        .sort((a: Product, b: Product) => (b.rating?.length || 0) - (a.rating?.length || 0))
        .slice(0, displayQuantity);

    return (
        <section className='bg-amber-50/30 py-16 sm:py-20'>
            <div className='px-4 sm:px-6 max-w-[1400px] mx-auto @container'>
                {/* Section Header */}
                <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E4E7EC]'>
                    <div className='space-y-3'>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-600 font-bold uppercase tracking-wider text-xs">
                            <Flame size={14} className="text-amber-500" /> 🔥 MEILLEURES VENTES
                        </div>
                        <h2 className='text-3xl font-black text-[#101828] tracking-tight' style={{ textWrap: 'balance' } as React.CSSProperties}>
                            Meilleures ventes & tendances
                        </h2>
                        <p className='text-sm text-[#667085] max-w-md font-normal' style={{ textWrap: 'pretty' } as React.CSSProperties}>
                            Les produits préférés de nos clients.
                        </p>
                    </div>

                    <Link
                        href="/shop"
                        className='inline-flex items-center gap-2 text-sm font-bold text-amber-600 border-2 border-amber-600 bg-transparent hover:bg-amber-600 hover:text-white px-6 py-2.5 rounded-full transition-all duration-300 self-start sm:self-auto shrink-0'
                    >
                        <span>Voir tout</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
                
                {/* Products Grid */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5'>
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
