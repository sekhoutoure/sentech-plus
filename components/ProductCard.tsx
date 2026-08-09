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

export interface Product {
    id: string;
    name: string;
    price: number;
    mrp?: number;
    images: string[];
    category?: string;
    rating?: any[];
    createdAt?: string;
}

interface ProductCardProps {
    product: Product | any;
    rank?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
    const dispatch = useDispatch()
    const wishlist = useSelector((state: any) => state.wishlist?.items || [])
    const [isAdded, setIsAdded] = useState(false)

    const isWishlisted = wishlist.includes(product.id)

    const ratingList = Array.isArray(product.rating) ? product.rating : []
    const avgRating = ratingList.length > 0
        ? (ratingList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / ratingList.length).toFixed(1)
        : '5.0'

    const discount = product.mrp && product.mrp > product.price
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(addToCart({ productId: product.id }))
        setIsAdded(true)
        toast.success(`"${product.name}" ajouté au panier !`, {
            icon: '🛒',
            style: { fontWeight: '600', fontSize: '13px' }
        })
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(toggleWishlist({ productId: product.id }))
        if (!isWishlisted) {
            toast.success(`"${product.name}" ajouté aux favoris !`, { icon: '❤️' })
        }
    }

    return (
        <div className="group relative w-full bg-white rounded-3xl overflow-hidden border border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] hover:border-[#1769FF]/30 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between min-h-[460px] sm:min-h-[500px]">

            {/* Top 60% Image Container */}
            <div className="relative w-full h-[260px] sm:h-[300px] bg-[#F7F9FC] flex items-center justify-center p-6 border-b border-[#EBEBEB]/60">

                {/* Rank Badge (1, 2, 3) */}
                {rank && rank <= 3 && (
                    <div className={`absolute top-3.5 left-3.5 z-20 size-8 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                        rank === 1 ? 'bg-amber-400 text-amber-950' :
                        rank === 2 ? 'bg-slate-300 text-slate-800' :
                        'bg-amber-700 text-amber-100'
                    }`}>
                        {rank}
                    </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className="absolute top-3.5 left-3.5 z-20 bg-[#F04438] text-white text-xs font-black px-3 py-1 rounded-full shadow-md shadow-[#F04438]/30">
                        -{discount}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className={`absolute top-3.5 right-3.5 z-20 size-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
                        isWishlisted
                            ? 'bg-[#F04438] text-white scale-110 shadow-[#F04438]/30 shadow-md'
                            : 'bg-white/90 backdrop-blur-md text-[#667085] hover:text-[#F04438] hover:scale-110 border border-[#EBEBEB]'
                    }`}
                >
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Main Product Image occupying ~60% height */}
                <Link href={`/product/${product.id}`} className="relative w-full h-full block">
                    <Image
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 ease-out"
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                        alt={product.name || "Produit SenTech Plus"}
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                </Link>
            </div>

            {/* Bottom Content Area */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-3 bg-white">

                <div className="space-y-1.5">
                    {/* Category & Star Rating */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-[#1769FF] uppercase tracking-wider">
                            {product.category || 'High-Tech'}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star size={13} fill="#F59E0B" className="text-amber-400" />
                            <span className="text-xs font-extrabold text-[#101828]">{avgRating}</span>
                        </div>
                    </div>

                    {/* Product Name */}
                    <Link href={`/product/${product.id}`} className="block">
                        <h3 className="text-base font-bold text-[#101828] line-clamp-2 group-hover:text-[#1769FF] transition-colors leading-snug">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="space-y-3 pt-1">
                    {/* Pricing & Stock Row */}
                    <div className="flex items-baseline justify-between gap-2">
                        <div>
                            <span className="text-lg sm:text-xl font-black text-[#101828]">
                                {formatPrice(product.price)}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                                <span className="text-xs text-[#667085] line-through ml-2 font-medium">
                                    {formatPrice(product.mrp)}
                                </span>
                            )}
                        </div>

                        <span className="text-xs font-bold text-[#12B76A] bg-[#12B76A]/10 px-2.5 py-1 rounded-lg">
                            En stock
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleQuickAdd}
                        aria-label="Ajouter au panier"
                        className={`w-full font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm ${
                            isAdded
                                ? 'bg-[#12B76A] text-white shadow-md shadow-[#12B76A]/30'
                                : 'bg-[#071126] hover:bg-[#1769FF] text-white shadow-md hover:shadow-[0_8px_24px_rgba(23,105,255,0.35)]'
                        }`}
                    >
                        {isAdded ? (
                            <><Check size={16} /><span>Ajouté au panier !</span></>
                        ) : (
                            <><ShoppingCart size={16} /><span>Ajouter au panier</span></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ProductCard
