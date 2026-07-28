'use client'
import React from 'react'
import { XIcon, StarIcon, CheckCircle2Icon, ShoppingCartIcon, ScaleIcon } from 'lucide-react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

interface CompareModalProps {
    isOpen: boolean;
    onClose: () => void;
    productsToCompare: Array<any>;
    onRemoveProduct: (productId: string) => void;
}

export default function CompareModal({ isOpen, onClose, productsToCompare, onRemoveProduct }: CompareModalProps) {
    const dispatch = useDispatch()
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')

    if (!isOpen) return null

    const handleAddToCart = (product: any) => {
        dispatch(addToCart({ product, quantity: 1 }))
        toast.success(`${product.name} ajouté au panier !`)
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative border border-slate-200/80 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition"
                >
                    <XIcon size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="size-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <ScaleIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Comparateur de Produits High-Tech</h2>
                        <p className="text-xs text-slate-500">Comparez les caractéristiques, les prix et les évaluations des articles côte à côte</p>
                    </div>
                </div>

                {productsToCompare.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <ScaleIcon size={48} className="mx-auto text-slate-300" />
                        <p className="text-slate-500 text-sm font-medium">Aucun produit sélectionné pour la comparaison.</p>
                        <p className="text-xs text-slate-400">Cliquez sur le bouton "Comparer" sur les fiches produits pour ajouter jusqu'à 3 articles.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                        {productsToCompare.map((prod) => (
                            <div key={prod.id || prod._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 relative space-y-4 flex flex-col justify-between">
                                <button
                                    onClick={() => onRemoveProduct(prod.id || prod._id)}
                                    className="absolute top-3 right-3 text-red-500 hover:bg-red-50 p-1.5 rounded-full transition"
                                    title="Retirer du comparateur"
                                >
                                    <XIcon size={16} />
                                </button>

                                <div className="space-y-3 text-center">
                                    <div className="relative size-32 mx-auto bg-white rounded-xl p-2 border border-slate-100">
                                        <Image src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} alt={prod.name} fill className="object-contain p-1" />
                                    </div>
                                    <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2">{prod.name}</h4>
                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                        {prod.category || 'High-Tech'}
                                    </span>
                                </div>

                                {/* Comparison Metrics Table */}
                                <div className="space-y-2 text-xs border-t border-slate-200/80 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Prix Vente</span>
                                        <span className="font-extrabold text-blue-600 text-sm">{currency}{prod.price}</span>
                                    </div>
                                    {prod.mrp && prod.mrp > prod.price && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Prix d'origine</span>
                                            <span className="line-through text-slate-400">{currency}{prod.mrp}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Note Clients</span>
                                        <div className="flex items-center gap-1 font-bold text-amber-500">
                                            <StarIcon size={13} className="fill-amber-400 text-amber-400" />
                                            <span>4.8 / 5</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Livraison Dakar</span>
                                        <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2Icon size={13} /> 24h</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(prod)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-95"
                                >
                                    <ShoppingCartIcon size={14} /> Ajouter au panier
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
