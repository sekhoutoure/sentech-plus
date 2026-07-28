'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector((state: any) => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Meilleures ventes' description={`Affichage de ${products.length < displayQuantity ? products.length : displayQuantity} sur ${products.length} produits`} href='/shop' />
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {products.slice().sort((a: any, b: any) => (b.rating?.length || 0) - (a.rating?.length || 0)).slice(0, displayQuantity).map((product: any) => (
                    <ProductCard key={product.id || product.name} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling
