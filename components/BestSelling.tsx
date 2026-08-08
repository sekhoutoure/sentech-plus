'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling: React.FC = () => {
    const displayQuantity = 8;
    const products = useSelector((state: any) => state.product.list || []);

    const bestProducts = [...products]
        .sort((a: any, b: any) => (b.rating?.length || 0) - (a.rating?.length || 0))
        .slice(0, displayQuantity);

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-24 max-w-7xl mx-auto'>
            <Title
                badgeText="🔥 LES PLUS VENDUS"
                title="Meilleures Ventes & Tendances"
                description={`Découvrez nos articles les plus plébiscités par nos clients au Sénégal et dans le monde.`}
                href="/shop"
            />
            
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center'>
                {bestProducts.map((product: any) => (
                    <ProductCard key={product.id || product.name} product={product} />
                ))}
            </div>
        </section>
    );
};

export default BestSelling;
