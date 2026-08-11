'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Check, ImageOff, Eye } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlist/wishlistSlice'
import { formatPrice } from '@/lib/format'
import { getProductImage, FALLBACK_PRODUCT_IMAGE } from '@/lib/image-utils'
import toast from 'react-hot-toast'
import QuickViewModal from './QuickViewModal'

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
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
    const [activeImgIndex, setActiveImgIndex] = useState(0)
    const [imgSrc, setImgSrc] = useState(() => getProductImage(product, 0))
    const [imgError, setImgError] = useState(false)

    const touchStartX = React.useRef<number | null>(null)
    const touchStartY = React.useRef<number | null>(null)

    const imagesList = Array.isArray(product?.images) && product.images.length > 0
        ? product.images
        : [getProductImage(product, 0)]

    useEffect(() => {
        setActiveImgIndex(0)
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

    // Touch Gestures: Swipe horizontal pour changer les photos sur mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return

        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        const deltaY = e.changedTouches[0].clientY - touchStartY.current

        if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                if (imagesList.length > 1) {
                    const nextIdx = (activeImgIndex + 1) % imagesList.length
                    setActiveImgIndex(nextIdx)
                    setImgSrc(getProductImage(product, nextIdx))
                }
            } else {
                if (imagesList.length > 1) {
                    const prevIdx = (activeImgIndex - 1 + imagesList.length) % imagesList.length
                    setActiveImgIndex(prevIdx)
                    setImgSrc(getProductImage(product, prevIdx))
                }
            }
        }

        touchStartX.current = null
        touchStartY.current = null
    }

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isOutOfStock) return
        dispatch(addToCart({ productId }))
        setIsAdded(true)
        toast.success(`"${product?.name || 'Produit'}" ajouté au panier !`, {
            icon: '🛒',
            style: { borderRadius: '12px', background: '#172033', color: '#fff', fontSize: '13px' }
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
        <div className="group relative w-full bg-white rounded-2xl overflow-hidden border border-[#E1E8F0] shadow-[0_4px_15px_rgba(23,32,51,0.04)] hover:shadow-[0_8px_25px_rgba(22,119,255,0.1)] hover:border-[#1677FF]/35 transition-all duration-200 ease-out flex flex-col justify-between h-full p-2 sm:p-3">

            {/* Image Zone: aspect-ratio 1/1, overflow-hidden, rounded-xl, bg #F5F8FC */}
            <div 
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative w-full aspect-square bg-[#F5F8FC] rounded-xl flex items-center justify-center overflow-hidden shrink-0 touch-pan-y"
            >

                {/* Rank Badge */}
                {rank && rank <= 3 && (
                    <div className={`absolute top-1.5 left-1.5 z-20 size-5 sm:size-6 rounded-full flex items-center justify-center text-[9px] sm:text-xs font-bold shadow-xs ${
                        rank === 1 ? 'bg-amber-400 text-amber-950' :
                        rank === 2 ? 'bg-slate-300 text-slate-800' :
                        'bg-amber-700 text-amber-100'
                    }`}>
                        {rank}
                    </div>
                )}

                {/* Badge Promotion (#F97316, 11px font-bold, padding 4px 8px, radius 20px) */}
                {discount > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-20 bg-[#F97316] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                        -{discount}%
                    </span>
                )}

                {/* Action Buttons Top Right: Aperçu Rapide & Favoris (32px - 36px) */}
                <div className="absolute top-[6px] right-[6px] z-20 flex items-center gap-1">
                    {/* Quick View Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsQuickViewOpen(true)
                        }}
                        aria-label="Aperçu rapide du produit"
                        title="Aperçu rapide"
                        className="size-7 sm:size-8 rounded-full bg-white/90 hover:bg-white text-[#667085] hover:text-[#1677FF] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs border border-[#E1E8F0] active:scale-95"
                    >
                        <Eye size={14} />
                    </button>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className={`size-7 sm:size-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ${
                            isWishlisted
                                ? 'bg-[#F97316] text-white'
                                : 'bg-white/90 text-[#667085] hover:text-[#F97316] hover:bg-white border border-[#E1E8F0]'
                        }`}
                    >
                        <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Product Image */}
                <Link href={`/product/${productId}`} className="relative w-full h-full block p-2">
                    {imgError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#F5F8FC]">
                            <ImageOff size={20} className="text-[#1677FF]/40" />
                            <span className="text-[8px] font-bold text-[#667085] uppercase tracking-wider">SenTechPLUS</span>
                        </div>
                    ) : (
                        <Image
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300 ease-out p-1"
                            src={imgSrc}
                            onError={() => {
                                if (imgSrc !== FALLBACK_PRODUCT_IMAGE) {
                                    setImgSrc(FALLBACK_PRODUCT_IMAGE)
                                } else {
                                    setImgError(true)
                                }
                            }}
                            alt={product?.name || "Produit SenTechPLUS"}
                            sizes="(max-width: 480px) 180px, (max-width: 768px) 240px, (max-width: 1280px) 280px, 320px"
                        />
                    )}
                </Link>

                {/* Touch Swipe Image Dots Indicator */}
                {imagesList.length > 1 && (
                    <div className="absolute bottom-1 left-0 right-0 z-20 flex justify-center items-center gap-1 pointer-events-none">
                        {imagesList.map((_: any, idx: number) => (
                            <span
                                key={idx}
                                className={`size-1 rounded-full transition-all duration-300 ${
                                    idx === activeImgIndex ? 'bg-[#1677FF] w-2.5' : 'bg-slate-300/80'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area — Compact Spacing */}
            <div className="pt-2 flex flex-col flex-1 justify-between gap-1 bg-white">

                <div className="space-y-0.5">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] sm:text-[10px] font-bold text-[#1677FF] uppercase tracking-wider truncate">
                            {product?.category || 'High-Tech'}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                            <Star size={10} fill="#F59E0B" className="text-amber-400" />
                            <span className="text-[10px] font-bold text-[#172033]">{avgRating}</span>
                        </div>
                    </div>

                    {/* Product Name (max 2 lines) */}
                    <Link href={`/product/${productId}`} className="block">
                        <h3 className="text-[11px] xs:text-[12px] sm:text-[13px] font-bold text-[#172033] line-clamp-2 leading-tight group-hover:text-[#1677FF] transition-colors min-h-[28px]">
                            {product?.name || 'Équipement SenTechPLUS'}
                        </h3>
                    </Link>
                </div>

                <div className="space-y-1.5 pt-1">
                    {/* Pricing & Stock */}
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-baseline gap-1 flex-wrap">
                            <span className="text-[13px] xs:text-[14px] sm:text-[15px] font-extrabold text-[#172033] leading-none">
                                {formatPrice(price)}
                            </span>
                            {mrp && mrp > price && (
                                <span className="text-[9px] sm:text-[11px] font-normal text-[#667085] line-through leading-none">
                                    {formatPrice(mrp)}
                                </span>
                            )}
                        </div>
                        {isOutOfStock ? (
                            <span className="text-[8px] font-bold text-[#DC2626] bg-[#DC2626]/10 px-1.5 py-0.5 rounded shrink-0">
                                Rupture
                            </span>
                        ) : (
                            <span className="text-[8px] font-bold text-[#16C784] bg-[#16C784]/10 px-1.5 py-0.5 rounded shrink-0">
                                En stock
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button (height 42px, radius 10-12px, font 13-14px font 600) */}
                    <button
                        onClick={handleQuickAdd}
                        disabled={isOutOfStock}
                        aria-label="Ajouter au panier"
                        className={`w-full font-semibold text-xs sm:text-sm h-[42px] py-2 px-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                            isOutOfStock
                                ? 'bg-[#EEF1F5] text-slate-400 cursor-not-allowed border border-[#E1E8F0]'
                                : isAdded
                                ? 'bg-[#16C784] text-white shadow-2xs'
                                : 'bg-[#1677FF] hover:bg-[#123B78] text-white shadow-2xs'
                        }`}
                    >
                        {isOutOfStock ? (
                            <span>Épuisé</span>
                        ) : isAdded ? (
                            <><Check size={14} /><span>Ajouté !</span></>
                        ) : (
                            <><ShoppingCart size={14} /><span>Ajouter au panier</span></>
                        )}
                    </button>
                </div>

            </div>

            {/* Quick View Interactive Modal */}
            <QuickViewModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </div>
    )
}

export default ProductCard
