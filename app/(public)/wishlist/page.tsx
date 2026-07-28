'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '@/components/ProductCard'
import PageTitle from '@/components/PageTitle'
import { HeartIcon, ShoppingBagIcon, ArrowRightIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { addToCart, openDrawer } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

export default function WishlistPage() {
    const dispatch = useDispatch()
    const wishlistIds = useSelector((state: any) => state.wishlist?.items || [])
    const products = useSelector((state: any) => state.product.list || [])

    // Filter products that are in the wishlist
    const wishlistedProducts = products.filter((product: any) => wishlistIds.includes(product.id))

    const handleAddAllToCart = () => {
        if (wishlistedProducts.length === 0) return
        wishlistedProducts.forEach(product => {
            dispatch(addToCart({ productId: product.id }))
        })
        dispatch(openDrawer())
        toast.success("Tous les favoris ont été ajoutés à votre panier ! 🛒")
    }

    return (
        <div className="min-h-screen px-4 sm:px-6">
            <div className="max-w-7xl mx-auto py-10 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-light text-slate-500 flex items-center gap-2.5">
                            Mes <span className="text-slate-900 font-bold flex items-center gap-2">Favoris <HeartIcon className="text-red-500 fill-current" size={26} /></span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {wishlistedProducts.length} article{wishlistedProducts.length > 1 ? 's' : ''} sauvegardé{wishlistedProducts.length > 1 ? 's' : ''} dans votre liste de souhaits
                        </p>
                    </div>

                    {wishlistedProducts.length > 0 && (
                        <button
                            onClick={handleAddAllToCart}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-3 rounded-full transition shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                        >
                            <ShoppingBagIcon size={16} /> Tout ajouter au panier
                        </button>
                    )}
                </div>

                {/* Content */}
                {wishlistedProducts.length === 0 ? (
                    <div className="my-16 text-center py-20 bg-slate-50/70 rounded-3xl border border-dashed border-slate-200 max-w-2xl mx-auto space-y-4">
                        <div className="size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                            <HeartIcon size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Votre liste de favoris est vide</h2>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            Coup de cœur sur un article ? Cliquez sur l'icône en forme de cœur sur un produit pour le sauvegarder ici et le retrouver facilement.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-full transition shadow-md shadow-blue-600/20 active:scale-95"
                            >
                                Explorer la boutique <ArrowRightIcon size={15} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {wishlistedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
