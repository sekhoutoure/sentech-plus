'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Star, ShoppingCart, Heart, Check, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/stores'
import { formatPrice } from '@/lib/format'
import { getProductImage } from '@/lib/image-utils'
import toast from 'react-hot-toast'
import { Product } from './ProductCard'

interface QuickViewModalProps {
    product: Product | any
    isOpen: boolean
    onClose: () => void
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
    const { addToCart, openDrawer } = useCartStore()
    const { items: wishlist, toggleWishlist } = useWishlistStore()

    const [selectedImgIndex, setSelectedImgIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false)

    const productId = product?.id || product?._id || 'prod_unknown'
    const isWishlisted = wishlist.includes(productId)

    // Extraire les images disponibles pour la galerie
    const imageList = React.useMemo(() => {
        if (!product) return []
        if (Array.isArray(product.images) && product.images.length > 0) {
            return product.images.map((_: any, idx: number) => getProductImage(product, idx))
        }
        return [getProductImage(product, 0)]
    }, [product])

    useEffect(() => {
        setSelectedImgIndex(0)
        setQuantity(1)
        setIsAdded(false)
    }, [product, isOpen])

    // Bloquer le défilement de l'arrière-plan quand la modal est ouverte
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Fermeture avec la touche Échap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen || !product) return null

    const ratingList = Array.isArray(product.rating) ? product.rating : []
    const avgRating = ratingList.length > 0
        ? (ratingList.reduce((acc: number, curr: any) => acc + (curr.rating || 0), 0) / ratingList.length).toFixed(1)
        : '5.0'

    const price = product.price || 0
    const mrp = product.mrp
    const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
    const isOutOfStock = product.inStock === false || product.stock === 0

    const handleAddToCart = () => {
        if (isOutOfStock) return
        for (let i = 0; i < quantity; i++) {
            addToCart(productId)
        }
        setIsAdded(true)
        toast.success(`${quantity}x "${product.name}" ajouté au panier !`, { icon: '🛒' })
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleWishlistToggle = () => {
        toggleWishlist(productId)
        if (!isWishlisted) {
            toast.success(`"${product.name}" ajouté aux favoris !`, { icon: '❤️' })
        } else {
            toast.success(`"${product.name}" retiré des favoris.`)
        }
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EAF0] overflow-hidden max-h-[90vh] flex flex-col sm:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bouton de Fermeture X */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-30 size-9 rounded-full bg-[#F5F7FA] hover:bg-[#EAF3FF] text-[#182230] hover:text-[#1677FF] flex items-center justify-center transition-colors cursor-pointer border border-[#E5EAF0]"
                    aria-label="Fermer la fenêtre d'aperçu"
                >
                    <X size={18} />
                </button>

                {/* COLONNE GAUCHE : Galerie Photos Multi-Images */}
                <div className="w-full sm:w-1/2 p-4 sm:p-6 bg-[#F7F9FC] border-b sm:border-b-0 sm:border-r border-[#E5EAF0] flex flex-col justify-between">
                    {/* Image Principale Grand Format */}
                    <div className="relative w-full aspect-square bg-white rounded-2xl border border-[#E8EDF3] overflow-hidden mb-3">
                        {discount > 0 && (
                            <span className="absolute top-3 left-3 z-10 bg-[#D9450F] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-2xs">
                                -{discount}%
                            </span>
                        )}
                        <Image
                            src={imageList[selectedImgIndex] || getProductImage(product, 0)}
                            alt={product.name || "Aperçu produit"}
                            fill
                            priority
                            className="object-contain p-4 transition-all duration-300"
                        />
                    </div>

                    {/* Vignettes Miniatures (Si plusieurs photos) */}
                    {imageList.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {imageList.map((imgUrl: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImgIndex(idx)}
                                    className={`relative size-14 rounded-xl bg-white border transition-all cursor-pointer overflow-hidden shrink-0 ${
                                        selectedImgIndex === idx
                                            ? 'border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-xs'
                                            : 'border-[#E8EDF3] hover:border-[#1677FF]/40'
                                    }`}
                                >
                                    <Image
                                        src={imgUrl}
                                        alt={`Miniature ${idx + 1}`}
                                        fill
                                        className="object-contain p-1"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* COLONNE DROITE : Détails & Actions */}
                <div className="w-full sm:w-1/2 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-3">
                        {/* En-tête : Catégorie & Étoiles */}
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-[#0B54C2] uppercase tracking-wider bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/20">
                                {product.category || 'High-Tech'}
                            </span>
                            <div className="flex items-center gap-1">
                                <Star size={14} fill="#F59E0B" className="text-amber-400" />
                                <span className="text-xs font-extrabold text-[#182230]">{avgRating}</span>
                                <span className="text-[11px] text-[#475467]">({ratingList.length > 0 ? ratingList.length : 12} avis)</span>
                            </div>
                        </div>

                        {/* Titre Produit */}
                        <h2 className="text-base sm:text-xl font-extrabold text-[#182230] leading-snug">
                            {product.name}
                        </h2>

                        {/* Prix & Statut Stock */}
                        <div className="flex items-baseline justify-between gap-2 pt-1 border-t border-[#E8EDF3]">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl sm:text-2xl font-black text-[#182230]">
                                    {formatPrice(price)}
                                </span>
                                {mrp && mrp > price && (
                                    <span className="text-xs sm:text-sm font-semibold text-[#475467] line-through">
                                        {formatPrice(mrp)}
                                    </span>
                                )}
                            </div>

                            {isOutOfStock ? (
                                <span className="text-xs font-bold text-[#D9450F] bg-[#D9450F]/10 px-2.5 py-1 rounded-full border border-[#D9450F]/20">
                                    Rupture de stock
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-[#0D8956] bg-[#0D8956]/10 px-2.5 py-1 rounded-full border border-[#0D8956]/20">
                                    En stock
                                </span>
                            )}
                        </div>

                        {/* Petite Description Snippet */}
                        <p className="text-xs text-[#475467] leading-relaxed line-clamp-3">
                            {product.description || "Découvrez cet équipement High-Tech haut de gamme sélectionné par SenTechPLUS. Garanti d'origine avec livraison rapide au Sénégal."}
                        </p>

                        {/* Réassurance Rapide */}
                        <div className="grid grid-cols-2 gap-2 py-2 text-[10px] sm:text-[11px] text-[#182230] font-bold">
                            <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-xl border border-[#E8EDF3]">
                                <Truck size={14} className="text-[#1677FF] shrink-0" />
                                <span>Livraison express</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#F8FAFC] p-2 rounded-xl border border-[#E8EDF3]">
                                <ShieldCheck size={14} className="text-[#0D8956] shrink-0" />
                                <span>Garantie certifiée</span>
                            </div>
                        </div>
                    </div>

                    {/* Zone d'Action : Quantité & Ajouter au Panier */}
                    <div className="space-y-3 pt-4 border-t border-[#E8EDF3] mt-3">
                        <div className="flex items-center gap-3">
                            {/* Sélecteur de Quantité */}
                            <div className="flex items-center bg-[#F5F7FA] border border-[#E5EAF0] rounded-xl p-1 shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1 || isOutOfStock}
                                    className="size-8 flex items-center justify-center font-bold text-[#182230] hover:bg-white rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-xs font-black text-[#182230]">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={isOutOfStock}
                                    className="size-8 flex items-center justify-center font-bold text-[#182230] hover:bg-white rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
                                >
                                    +
                                </button>
                            </div>

                            {/* Bouton Ajouter au Panier */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-1 font-extrabold text-xs sm:text-sm h-11 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md ${
                                    isAdded
                                        ? 'bg-[#0D8956] text-white'
                                        : isOutOfStock
                                        ? 'bg-[#EEF1F5] text-slate-400 cursor-not-allowed border border-[#E8EDF3]'
                                        : 'bg-[#1677FF] hover:bg-[#0F67E5] text-white'
                                }`}
                            >
                                {isAdded ? (
                                    <>
                                        <Check size={18} />
                                        <span>Ajouté !</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={18} />
                                        <span>Ajouter au panier</span>
                                    </>
                                )}
                            </button>

                            {/* Favoris */}
                            <button
                                onClick={handleWishlistToggle}
                                className={`size-11 rounded-xl flex items-center justify-center transition-all border cursor-pointer shrink-0 ${
                                    isWishlisted
                                        ? 'bg-[#D9450F] text-white border-[#D9450F]'
                                        : 'bg-[#F5F7FA] text-[#475467] hover:text-[#D9450F] border-[#E5EAF0]'
                                }`}
                                aria-label="Favoris"
                            >
                                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Lien vers la fiche produit complète */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <button
                                onClick={() => {
                                    onClose()
                                    openDrawer()
                                }}
                                className="text-[#1677FF] font-extrabold hover:underline cursor-pointer"
                            >
                                Voir le panier →
                            </button>

                            <Link
                                href={`/product/${productId}`}
                                onClick={onClose}
                                className="text-[#475467] hover:text-[#182230] font-bold flex items-center gap-1 transition-colors"
                            >
                                <span>Fiche complète</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickViewModal
