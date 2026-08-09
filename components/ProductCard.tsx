'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Check, ImageOff } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { formatPrice } from '@/lib/format'
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '@/lib/image-utils'
import toast from 'react-hot-toast'

export interface Product {
    id: string;
    name: string;
    price: number;
    mrp?: number;
    images?: any[];
    image?: any;
    category?: string;
    rating?: any[];
    inStock?: boolean;
    stock?: number;
    salesCount?: number;
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
    const [imgSrc, setImgSrc] = useState(() => getProductImage(product, 0))
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        setImgSrc(getProductImage(product, 0))
        setImgError(false)
    }, [product])

    const productId = product?.id || product?._id || 'prod_unknown'
    const isWishlisted = wishlist.includes(productId)

    const ratingList = Array.isArray(product?.rating) ? product.rating : []
    const avgRating = ratingList.length > 0
        ? (ratingList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / ratingList.length).toFixed(1)
        : '5.0'

    const price = product?.price || 0
    const mrp = product?.mrp
    const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
    const isOutOfStock = product?.inStock === false || product?.stock === 0

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isOutOfStock) return
        dispatch(addToCart({ productId }))
        setIsAdded(true)
        toast.success(`"${product?.name || 'Produit'}" ajouté au panier !`, {
            icon: '🛒',
            style: { fontWeight: '600', fontSize: '13px' }
        })
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(toggleWishlist({ productId }))
        if (!isWishlisted) {
            toast.success(`"${product?.name || 'Produit'}" ajouté aux favoris !`, { icon: '❤️' })
        } else {
            toast.success(`"${product?.name || 'Produit'}" retiré des favoris.`)
        }
    }

    return (
        <div className="group relative w-full bg-white rounded-xl sm:rounded-3xl overflow-hidden border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:border-[#1769FF]/25 transition-all duration-300 ease-out flex flex-col justify-between">

            {/* Image Container — aspect-square 1:1, object-contain */}
            <div className="relative w-full aspect-square bg-[#F7F9FC] flex items-center justify-center border-b border-[#EBEBEB]/60 overflow-hidden">

                {/* Rank Badge */}
                {rank && rank <= 3 && (
                    <div className={`absolute top-2 left-2 z-20 size-6 sm:size-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shadow-md ${
                        rank === 1 ? 'bg-amber-400 text-amber-950' :
                        rank === 2 ? 'bg-slate-300 text-slate-800' :
                        'bg-amber-700 text-amber-100'
                    }`}>
                        {rank}
                    </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 z-20 bg-[#F04438] text-white text-[9px] sm:text-xs font-black px-1.5 sm:px-3 py-0.5 rounded-full shadow-md shadow-[#F04438]/30">
                        -{discount}%
                    </span>
                )}

                {/* Wishlist Button (Min 40x40px touch zone) */}
                <button
                    onClick={handleWishlistToggle}
                    aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className={`absolute top-1.5 right-1.5 z-20 size-8 sm:size-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
                        isWishlisted
                            ? 'bg-[#F04438] text-white scale-105'
                            : 'bg-white/95 backdrop-blur-md text-[#667085] hover:text-[#F04438] border border-[#EBEBEB]'
                    }`}
                >
                    <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} className="sm:hidden" />
                    <Heart size={17} fill={isWishlisted ? "currentColor" : "none"} className="hidden sm:block" />
                </button>

                {/* Product Image */}
                <Link href={`/product/${productId}`} className="relative w-full h-full block p-2">
                    {imgError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#F7F9FC]">
                            <ImageOff size={20} className="text-[#1769FF]/30" />
                            <span className="text-[8px] font-bold text-[#667085] uppercase">Sans image</span>
                        </div>
                    ) : (
                        <Image
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out p-1"
                            src={imgSrc}
                            onError={() => {
                                if (imgSrc !== FALLBACK_PRODUCT_IMAGE) {
                                    setImgSrc(FALLBACK_PRODUCT_IMAGE)
                                } else {
                                    setImgError(true)
                                }
                            }}
                            alt={product?.name || "Produit SenTech Plus"}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    )}
                </Link>
            </div>

            {/* Content Area — Padding ~8px sur mobile */}
            <div className="p-2 sm:p-5 flex flex-col flex-1 justify-between gap-1.5 sm:gap-3 bg-white">

                <div className="space-y-1">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] sm:text-[12px] font-extrabold text-[#1769FF] uppercase tracking-wider truncate">
                            {product?.category || 'High-Tech'}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                            <Star size={11} fill="#F59E0B" className="text-amber-400" />
                            <span className="text-[11px] sm:text-[13px] font-extrabold text-[#101828]">{avgRating}</span>
                        </div>
                    </div>

                    {/* Product Name (Max 2 lignes, 12-14px) */}
                    <Link href={`/product/${productId}`} className="block">
                        <h3 className="text-[12px] sm:text-[15px] font-bold text-[#101828] line-clamp-2 leading-snug group-hover:text-[#1769FF] transition-colors">
                            {product?.name || 'Équipement SenTech Plus'}
                        </h3>
                    </Link>
                </div>

                <div className="space-y-2 pt-0.5">
                    {/* Pricing & Stock (Prix 14-16px, très lisible) */}
                    <div className="flex items-baseline justify-between gap-1">
                        <span className="text-[14px] xs:text-[15px] sm:text-[18px] font-black text-[#101828] leading-none">
                            {formatPrice(price)}
                        </span>
                        {isOutOfStock ? (
                            <span className="text-[8px] sm:text-xs font-bold text-[#F04438] bg-rose-50 px-1 py-0.5 rounded shrink-0">
                                Rupture
                            </span>
                        ) : (
                            <span className="text-[8px] sm:text-xs font-bold text-[#12B76A] bg-emerald-50 px-1 py-0.5 rounded shrink-0">
                                En stock
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button (Min 40px height) */}
                    <button
                        onClick={handleQuickAdd}
                        disabled={isOutOfStock}
                        aria-label="Ajouter au panier"
                        className={`w-full font-bold text-[11px] sm:text-sm min-h-[40px] py-2.5 sm:py-3 px-2 rounded-lg sm:rounded-2xl transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                            isOutOfStock
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : isAdded
                                ? 'bg-[#12B76A] text-white shadow-sm'
                                : 'bg-[#071126] hover:bg-[#1769FF] text-white shadow-2xs'
                        }`}
                    >
                        {isOutOfStock ? (
                            <span>Épuisé</span>
                        ) : isAdded ? (
                            <><Check size={14} /><span>Ajouté !</span></>
                        ) : (
                            <><ShoppingCart size={14} /><span>Ajouter</span></>
                        )}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ProductCard
