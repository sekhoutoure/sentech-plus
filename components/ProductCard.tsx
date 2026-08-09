'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Check, Zap } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { formatPrice } from '@/lib/format'
import toast from 'react-hot-toast'

export interface Product {
    id: string | number;
    name: string;
    price: number;
    mrp?: number;
    category?: string;
    images?: string[];
    rating?: { rating: number }[];
    createdAt?: string | number | Date;
}

interface RootState {
    wishlist?: { items: (string | number)[] };
    product?: { list: Product[] };
}

interface ProductCardProps {
    product: Product;
    rank?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
    const dispatch = useDispatch()
    const wishlist = useSelector((state: RootState) => state.wishlist?.items || [])
    const [isAdded, setIsAdded] = useState(false)

    const isWishlisted = wishlist.includes(product.id)

    const ratingList = Array.isArray(product.rating) ? product.rating : []
    const avgRating = ratingList.length > 0
        ? (ratingList.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratingList.length).toFixed(1)
        : '5.0'
    const reviewCount = ratingList.length

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
        <div className="group relative w-full bg-white rounded-3xl overflow-hidden border border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.10)] hover:border-[#1769FF]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col animate-card-in">

            {/* Top Image Zone */}
            <div className="relative w-full aspect-square overflow-hidden bg-[#F7F9FC] rounded-t-2xl flex items-center justify-center">

                {/* Rank Badge (1, 2, 3) */}
                {rank !== undefined && rank <= 3 && (
                    <div className={`absolute top-3 left-3 z-20 size-7 rounded-full flex items-center justify-center text-[11px] font-black shadow-md ${
                        rank === 1 ? 'bg-amber-400 text-amber-900' :
                        rank === 2 ? 'bg-slate-300 text-slate-700' :
                        'bg-amber-700 text-amber-100'
                    }`}>
                        {rank}
                    </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className={`absolute top-3 ${rank !== undefined && rank <= 3 ? 'left-12' : 'left-3'} z-20 bg-[#F04438] text-white text-[10px] font-bold px-2.5 py-1 rounded-full drop-shadow-md`}>
                        -{discount}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className={`absolute top-3 right-3 z-20 size-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm bg-white/80 backdrop-blur-md border border-[#EBEBEB] ${
                        isWishlisted
                            ? 'text-[#F04438] scale-110'
                            : 'text-[#667085] hover:text-[#F04438] hover:scale-110'
                    }`}
                >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Product Image */}
                <Link href={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center p-4">
                    <Image
                        fill
                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-600 ease-out"
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                        alt={product.name || "Produit SenTech Plus"}
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                </Link>
            </div>

            {/* Content Bottom */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-3">

                {/* Category + Rating */}
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[10px] font-bold uppercase tracking-wider">
                        <span className="size-1.5 rounded-full bg-[#1769FF]" />
                        {product.category || 'High-Tech'}
                    </span>
                    <div className="flex items-center gap-1">
                        <Star size={12} fill="#F59E0B" className="text-amber-400" />
                        <span className="text-xs font-bold text-[#101828]">{avgRating}</span>
                        {reviewCount > 0 && (
                            <span className="text-[10px] text-[#667085]">({reviewCount})</span>
                        )}
                    </div>
                </div>

                {/* Product Name */}
                <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-bold text-[#101828] line-clamp-2 group-hover:text-[#1769FF] transition-colors leading-snug">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex flex-col mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-[#101828]">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                    {product.mrp && product.mrp > product.price && (
                        <div className="text-xs text-[#667085] line-through">
                            {formatPrice(product.mrp)}
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleQuickAdd}
                    aria-label="Ajouter au panier"
                    className={`w-full mt-2 font-bold text-sm py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                        isAdded
                            ? 'bg-[#12B76A] text-white shadow-md'
                            : 'bg-[#071126] hover:bg-[#1769FF] text-white shadow-sm'
                    }`}
                >
                    {isAdded ? (
                        <><Check size={16} /><span>Ajouté !</span></>
                    ) : (
                        <><ShoppingCart size={16} /><span>Ajouter au panier</span></>
                    )}
                </button>
            </div>
        </div>
    )
}

export default ProductCard
