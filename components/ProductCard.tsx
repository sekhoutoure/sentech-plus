'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Check } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { formatPrice } from '@/lib/format'
import toast from 'react-hot-toast'

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useDispatch()
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
        <div className='group relative w-full bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E4E7EC] shadow-2xs hover:shadow-xl hover:border-[#1769FF]/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1'>
            
            {/* Image Container */}
            <div className='relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-[#F7F9FC] flex items-center justify-center border border-[#E4E7EC]/60'>
                
                {/* Discount Badge Top-Left */}
                {discount > 0 && (
                    <span className='absolute top-2.5 left-2.5 bg-[#F04438] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full z-10 shadow-xs'>
                        -{discount}%
                    </span>
                )}

                {/* Wishlist Button Top-Right */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className={`absolute top-2.5 right-2.5 z-10 size-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
                        isWishlisted 
                            ? 'bg-[#F04438] text-white scale-105' 
                            : 'bg-white/95 text-[#667085] hover:text-[#F04438] hover:scale-110 border border-[#E4E7EC]'
                    }`}
                >
                    <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Product Image Link */}
                <Link href={`/product/${product.id}`} className='w-full h-full relative block overflow-hidden'>
                    <Image 
                        fill
                        className='object-cover group-hover:scale-108 transition-transform duration-500 ease-out' 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                        alt={product.name || "Produit SenTech Plus"} 
                    />
                </Link>
            </div>

            {/* Product Meta Details */}
            <div className='pt-3 space-y-2 flex-1 flex flex-col justify-between'>
                <div>
                    {/* Category & Star Rating */}
                    <div className='flex items-center justify-between gap-1'>
                        <span className='text-[10px] font-extrabold text-[#1769FF] uppercase tracking-wider'>
                            {product.category || 'High-Tech'}
                        </span>
                        <div className='flex items-center gap-1'>
                            <Star size={12} fill="#F59E0B" className="text-amber-500" />
                            <span className='text-[11px] font-bold text-[#101828]'>{rating}.0</span>
                        </div>
                    </div>

                    {/* Product Name */}
                    <Link href={`/product/${product.id}`} className='block mt-1'>
                        <h3 className='text-sm font-bold text-[#101828] line-clamp-1 group-hover:text-[#1769FF] transition-colors leading-snug'>
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Pricing & Stock Status */}
                <div>
                    <div className='flex items-baseline justify-between pt-1'>
                        <div className='flex items-baseline gap-1.5'>
                            <span className='text-sm sm:text-base font-black text-[#101828]'>
                                {formatPrice(product.price)}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                                <span className='text-[11px] text-[#667085] line-through'>
                                    {formatPrice(product.mrp)}
                                </span>
                            )}
                        </div>

                        <span className='text-[10px] font-bold text-[#12B76A] bg-[#12B76A]/10 px-2 py-0.5 rounded-md'>
                            En stock
                        </span>
                    </div>

                    {/* Ajouter au panier Button */}
                    <button
                        onClick={handleQuickAdd}
                        aria-label="Ajouter au panier"
                        className={`w-full mt-2.5 font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer ${
                            isAdded 
                                ? 'bg-[#12B76A] text-white' 
                                : 'bg-[#071126] hover:bg-[#1769FF] text-white'
                        }`}
                    >
                        {isAdded ? (
                            <>
                                <Check size={14} />
                                <span>Ajouté !</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={14} />
                                <span>Ajouter au panier</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
