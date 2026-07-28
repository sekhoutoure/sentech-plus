'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts: React.FC = () => {

    const displayQuantity = 4
    const products = useSelector((state: any) => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Derniers produits' description={`Affichage de ${products.length < displayQuantity ? products.length : displayQuantity} sur ${products.length} produits`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {products.slice().sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime()).slice(0, displayQuantity).map((product: any) => (
                    <ProductCard key={product.id || product.name} product={product} />
                ))}
            </div>
        </div>
    )
}

export default LatestProducts
