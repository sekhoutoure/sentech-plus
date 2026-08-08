'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Flame } from 'lucide-react'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling: React.FC = () => {
    const displayQuantity = 8;
    const products = useSelector((state: any) => state.product?.list || []);

    const bestProducts = [...products]
        .sort((a: any, b: any) => (b.rating?.length || 0) - (a.rating?.length || 0))
        .slice(0, displayQuantity);

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-20 max-w-[1400px] mx-auto'>
            {/* Section Header */}
            <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E4E7EC] mb-8'>
                <div className='space-y-1.5'>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
                        <Flame size={12} className="text-amber-500" /> TENDANCES CLIENTS
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight'>
                        Meilleures ventes & tendances
                    </h2>
                    <p className='text-xs sm:text-sm text-[#667085] max-w-xl'>
                        Les produits préférés de nos clients.
                    </p>
                </div>

                <Link
                    href="/shop"
                    className='inline-flex items-center gap-1.5 text-xs font-bold text-[#1769FF] hover:text-[#1256D6] bg-[#EAF3FF] hover:bg-blue-100 px-4 py-2 rounded-full transition self-start sm:self-auto'
                >
                    <span>Voir tout</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
            
            {/* Products Grid: 4 cols on desktop, 2 cols on mobile */}
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                {bestProducts.map((product: any) => (
                    <ProductCard key={product.id || product.name} product={product} />
                ))}
            </div>
        </section>
    );
};

export default BestSelling;
