'use client'
import { StarIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useDispatch()
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')
    const wishlist = useSelector((state: any) => state.wishlist?.items || [])

    const isWishlisted = wishlist.includes(product.id)

    // calculate the average rating of the product
    const ratingList = Array.isArray(product.rating) ? product.rating : [];
    const rating = ratingList.length > 0 
        ? Math.round(ratingList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / ratingList.length)
        : 0;

    const discount = product.mrp && product.mrp > product.price 
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
    }

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(toggleWishlist({ productId: product.id }))
    }

    return (
        <div className='group relative max-xl:mx-auto w-full sm:w-60 flex flex-col justify-between transition-all duration-300'>
            <div className='relative bg-slate-100/80 hover:bg-slate-100 h-44 sm:h-68 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200/60 shadow-sm group-hover:shadow-md transition duration-300'>
                {/* Discount Badge */}
                {discount > 0 && (
                    <span className='absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm'>
                        -{discount}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className='absolute top-2 right-2 sm:top-3 sm:right-3 z-10 size-11 sm:size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition shadow-sm'
                    title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <HeartIcon size={16} fill={isWishlisted ? "#EF4444" : "none"} className={isWishlisted ? "text-red-500" : ""} />
                </button>

                <Link href={`/product/${product.id}`} className='w-full h-full flex items-center justify-center p-4 pb-12 lg:pb-4'>
                    <Image 
                        width={300} 
                        height={300} 
                        className='max-h-28 sm:max-h-44 w-auto object-contain group-hover:scale-105 transition-transform duration-300 ease-out' 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                        alt={`${product.name || "Produit High-Tech"} - SenTech Plus Sénégal (Dakar)`} 
                    />
                </Link>

                {/* Quick Add Overlay Button */}
                <button
                    onClick={handleQuickAdd}
                    aria-label="Ajout rapide au panier"
                    className='absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 px-4 min-h-[44px] rounded-xl opacity-100 translate-y-0 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer'
                >
                    <ShoppingCartIcon size={14} />
                    <span className="max-sm:hidden">Ajout rapide</span>
                    <span className="sm:hidden">Ajouter</span>
                </button>
            </div>

            <Link href={`/product/${product.id}`} className='pt-3 space-y-1 block'>
                <p className='text-xs text-slate-400 font-medium uppercase tracking-wider'>{product.category}</p>
                <p className='text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition'>{product.name}</p>
                <div className='flex justify-between items-center pt-1'>
                    <div className='flex items-center gap-1'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={13} className='text-transparent' fill={rating >= index + 1 ? "#2563EB" : "#E2E8F0"} />
                        ))}
                    </div>
                    <div className='flex items-baseline gap-1.5'>
                        {product.mrp && product.mrp > product.price && (
                            <span className='text-xs text-slate-400 line-through'>{currency}{product.mrp}</span>
                        )}
                        <span className='text-base font-bold text-slate-900'>{currency}{product.price}</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard
