'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Scale, Star, ShoppingCart, Check, Trash2, ShieldCheck, Truck, ExternalLink } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCompare, clearCompare } from '@/lib/features/compare/compareSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { formatPrice } from '@/lib/format'
import { getProductImage } from '@/lib/image-utils'
import toast from 'react-hot-toast'

interface CompareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CompareModal({ isOpen, onClose }: CompareModalProps) {
    const dispatch = useDispatch()
    const compareIds = useSelector((state: any) => state.compare?.items || [])
    const allProducts = useSelector((state: any) => state.product?.list || [])

    // Filter target compare products
    const compareProducts = allProducts.filter((p: any) => {
        const pId = p.id || p._id || 'prod'
        return compareIds.includes(pId)
    })

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleAddToCart = (product: any) => {
        const pId = product.id || product._id || 'prod'
        dispatch(addToCart({ productId: pId }))
        toast.success(`"${product.name}" ajouté au panier !`, {
            icon: '🛒',
            style: { borderRadius: '12px', background: '#182230', color: '#fff', fontSize: '13px' }
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div 
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in" 
            />

            {/* Modal Container */}
            <div className="relative z-10 bg-white w-full max-w-5xl rounded-3xl border border-[#E8EDF3] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#E8EDF3] flex items-center justify-between bg-[#F8FAFC]">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-[#EAF3FF] text-[#0B54C2] flex items-center justify-center font-bold">
                            <Scale size={18} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-[#182230] leading-none">
                                Comparateur de Produits
                            </h2>
                            <span className="text-xs text-[#475467] font-medium">
                                {compareProducts.length} sur 3 produits sélectionnés
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {compareProducts.length > 0 && (
                            <button
                                onClick={() => dispatch(clearCompare())}
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#C4320A] hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition cursor-pointer"
                            >
                                <Trash2 size={13} />
                                <span className="hidden sm:inline">Vider le comparateur</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="size-8 rounded-full bg-white border border-[#E8EDF3] text-[#475467] hover:text-[#182230] flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Fermer le comparateur"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                    {compareProducts.length === 0 ? (
                        <div className="py-16 text-center space-y-3">
                            <div className="size-14 rounded-full bg-[#EAF3FF] text-[#0B54C2] flex items-center justify-center mx-auto">
                                <Scale size={24} />
                            </div>
                            <h3 className="text-lg font-black text-[#182230]">Votre comparateur est vide</h3>
                            <p className="text-xs text-[#475467] max-w-sm mx-auto">
                                Cliquez sur l'icône ⚖️ présent sur les fiches produits pour ajouter jusqu'à 3 articles et comparer leurs prix et spécifications côte à côte.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8EDF3]">
                            {compareProducts.map((product: any) => {
                                const pId = product.id || product._id || 'prod'
                                const img = getProductImage(product, 0)
                                const price = product.price || 0
                                const mrp = product.mrp
                                const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
                                const isOutOfStock = product.inStock === false || product.stock === 0
                                const ratingList = Array.isArray(product.rating) ? product.rating : []
                                const avgRating = ratingList.length > 0
                                    ? (ratingList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / ratingList.length).toFixed(1)
                                    : '5.0'

                                return (
                                    <div key={pId} className="flex flex-col justify-between space-y-4 pt-4 sm:pt-0 sm:px-4">
                                        
                                        {/* Header Card Info */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-[#0B54C2] uppercase tracking-wider bg-[#EAF3FF] px-2.5 py-0.5 rounded-full">
                                                    {product.category || 'High-Tech'}
                                                </span>
                                                <button
                                                    onClick={() => dispatch(removeFromCompare({ productId: pId }))}
                                                    className="text-[#475467] hover:text-[#C4320A] p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
                                                    title="Retirer du comparateur"
                                                >
                                                    <X size={15} />
                                                </button>
                                            </div>

                                            {/* Image */}
                                            <div className="relative w-full aspect-square bg-[#F7F9FC] rounded-2xl border border-[#E8EDF3] overflow-hidden p-3 flex items-center justify-center">
                                                <Image
                                                    src={img}
                                                    alt={product.name}
                                                    fill
                                                    sizes="250px"
                                                    className="object-contain p-2"
                                                />
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-sm font-extrabold text-[#182230] leading-snug line-clamp-2 min-h-[40px]">
                                                {product.name}
                                            </h3>
                                        </div>

                                        {/* Comparison Metrics Grid */}
                                        <div className="space-y-3 text-xs divide-y divide-[#E8EDF3]/60 border-t border-b border-[#E8EDF3]/60 py-3">
                                            
                                            {/* Prix */}
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-[#475467] font-semibold">Prix actuel :</span>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-[#182230]">{formatPrice(price)}</div>
                                                    {discount > 0 && (
                                                        <div className="text-[10px] text-[#C4320A] font-bold">-{discount}% (Économie)</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Note & Avis */}
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-[#475467] font-semibold">Note client :</span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={13} fill="#F59E0B" className="text-amber-400" />
                                                    <span className="font-extrabold text-[#182230]">{avgRating} / 5</span>
                                                </div>
                                            </div>

                                            {/* Stock */}
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-[#475467] font-semibold">Disponibilité :</span>
                                                {isOutOfStock ? (
                                                    <span className="text-[10px] font-bold text-[#C4320A] bg-[#C4320A]/10 px-2 py-0.5 rounded-full">Rupture</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-[#085D38] bg-[#085D38]/10 px-2 py-0.5 rounded-full">En stock</span>
                                                )}
                                            </div>

                                            {/* Garantie & Livraison */}
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-[#475467] font-semibold">Garantie :</span>
                                                <span className="font-bold text-[#0B54C2] flex items-center gap-1 text-[11px]">
                                                    <ShieldCheck size={13} />
                                                    <span>7 jours certifié</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2 pt-1">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={isOutOfStock}
                                                className={`w-full font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                                                    isOutOfStock
                                                        ? 'bg-[#EEF1F5] text-slate-400 cursor-not-allowed border border-[#E8EDF3]'
                                                        : 'bg-[#0B54C2] hover:bg-[#09449E] text-white'
                                                }`}
                                            >
                                                <ShoppingCart size={14} />
                                                <span>Ajouter au panier</span>
                                            </button>

                                            <Link
                                                href={`/product/${pId}`}
                                                onClick={onClose}
                                                className="w-full font-bold text-xs py-2 px-3 rounded-xl text-[#0B54C2] bg-[#EAF3FF] hover:bg-[#0B54C2]/15 transition-all flex items-center justify-center gap-1 border border-[#0B54C2]/20"
                                            >
                                                <span>Voir la fiche</span>
                                                <ExternalLink size={12} />
                                            </Link>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
