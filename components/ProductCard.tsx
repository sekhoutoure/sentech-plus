'use client'
import { StarIcon, HeartIcon, ShoppingCartIcon, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import toast from 'react-hot-toast'

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useDispatch()
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')
    const wishlist = useSelector((state: any) => state.wishlist?.items || [])
    const [isAdded, setIsAdded] = useState(false)

    const isWishlisted = wishlist.includes(product.id)

    // Calculate rating
    const ratingList = Array.isArray(product.rating) ? product.rating : [];
    const rating = ratingList.length > 0 
        ? Math.round(ratingList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / ratingList.length)
        : 5;

    const discount = product.mrp && product.mrp > product.price 
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
        setIsAdded(true)
        toast.success(`"${product.name}" ajouté au panier !`)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(toggleWishlist({ productId: product.id }))
        if (!isWishlisted) {
            toast.success(`"${product.name}" ajouté à vos favoris !`)
        }
    }

    return (
        <div className='group relative w-full sm:w-64 bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5'>
            
            {/* Image & Badges Container */}
            <div className='relative bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 h-48 sm:h-56'>
                
                {/* Discount Badge */}
                {discount > 0 && (
                    <span className='absolute top-2.5 left-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full z-10 shadow-sm'>
                        -{discount}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className={`absolute top-2.5 right-2.5 z-10 size-8 sm:size-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                        isWishlisted 
                            ? 'bg-rose-500 text-white scale-105' 
                            : 'bg-white/95 text-slate-400 hover:text-rose-500 hover:scale-110 border border-slate-200/60'
                    }`}
                >
                    <HeartIcon size={15} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Product Image Link */}
                <Link href={`/product/${product.id}`} className='w-full h-full flex items-center justify-center p-4'>
                    <Image 
                        width={280} 
                        height={280} 
                        className='max-h-36 sm:max-h-44 w-auto object-contain group-hover:scale-108 transition-transform duration-500 ease-out drop-shadow-sm' 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                        alt={product.name || "Produit High-Tech"} 
                    />
                </Link>

                {/* Quick Add To Cart Button */}
                <button
                    onClick={handleQuickAdd}
                    aria-label="Ajout rapide au panier"
                    className={`absolute bottom-2.5 left-2.5 right-2.5 font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer ${
                        isAdded 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-900 hover:bg-blue-600 text-white opacity-100 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
                    }`}
                >
                    {isAdded ? (
                        <>
                            <Check size={14} />
                            <span>Ajouté !</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCartIcon size={14} />
                            <span>Ajout Rapide</span>
                        </>
                    )}
                </button>
            </div>

            {/* Product Meta Details */}
            <div className='pt-3 space-y-1.5 flex-1 flex flex-col justify-between'>
                <div>
                    <div className='flex items-center justify-between gap-1'>
                        <span className='text-[10px] font-bold text-blue-600 uppercase tracking-wider'>
                            {product.category || 'High-Tech'}
                        </span>
                        <div className='flex items-center gap-1'>
                            <StarIcon size={12} fill="#F59E0B" className="text-amber-500" />
                            <span className='text-[11px] font-bold text-slate-700'>{rating}.0</span>
                        </div>
                    </div>

                    <Link href={`/product/${product.id}`} className='block mt-0.5'>
                        <h3 className='text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors'>
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Price Display */}
                <div className='pt-2 flex items-baseline justify-between border-t border-slate-100 mt-2'>
                    <div className='flex items-baseline gap-1.5'>
                        <span className='text-base sm:text-lg font-black text-slate-900'>
                            {currency}{product.price}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                            <span className='text-xs text-slate-400 line-through'>
                                {currency}{product.mrp}
                            </span>
                        )}
                    </div>

                    <span className='text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60'>
                        En stock
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
