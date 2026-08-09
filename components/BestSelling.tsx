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
        <section className='bg-[#F6F8FB] py-6 sm:py-16 lg:py-24'>
            <div className='px-3 sm:px-6 max-w-[1400px] mx-auto @container'>
                {/* Section Header */}
                <div className='flex items-end justify-between gap-3 mb-4 sm:mb-8 pb-3 border-b border-[#E5E9F0]'>
                    <div className='space-y-1'>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#EAF5FF] border border-[#007BFF]/20 text-[#007BFF] font-extrabold uppercase tracking-wider text-[10px] sm:text-xs">
                            <Flame size={12} className="text-[#007BFF]" /> MEILLEURES VENTES
                        </div>
                        <h2 className='text-lg sm:text-2xl lg:text-3xl font-black text-[#101828] tracking-tight'>
                            Meilleures ventes & tendances
                        </h2>
                    </div>

                    <Link
                        href="/shop"
                        className='inline-flex items-center gap-1 text-xs font-bold text-[#007BFF] hover:underline shrink-0'
                    >
                        <span>Voir tout</span>
                        <ArrowRight size={13} />
                    </Link>
                </div>
                
                {/* Products Grid — 2 COLONNES sur mobile avec gap 8-10px */}
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6'>
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
