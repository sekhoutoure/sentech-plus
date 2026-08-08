'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts: React.FC = () => {
    const displayQuantity = 4;
    const products = useSelector((state: any) => state.product.list || []);

    const latest = [...products]
        .sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime())
        .slice(0, displayQuantity);

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-24 max-w-7xl mx-auto'>
            <Title
                badgeText="⚡ NOUVEAUTÉS 2026"
                title="Derniers Arrivages High-Tech"
                description={`Découvrez les toutes dernières sorties technologiques fraîchement intégrées au catalogue.`}
                href="/shop"
            />
            
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center'>
                {latest.map((product: any) => (
                    <ProductCard key={product.id || product.name} product={product} />
                ))}
            </div>
        </section>
    );
};

export default LatestProducts;
