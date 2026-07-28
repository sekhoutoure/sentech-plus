'use client'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeDrawer, deleteItemFromCart } from '@/lib/features/cart/cartSlice'
import { XIcon, ShoppingBagIcon, Trash2Icon, ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Counter from './Counter'

const CartDrawer = () => {
    const dispatch = useDispatch()
    const { isDrawerOpen, cartItems } = useSelector((state: any) => state.cart)
    const products = useSelector((state: any) => state.product.list)
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')

    if (!isDrawerOpen) return null

    // Build cart items array
    const cartArray = []
    let totalPrice = 0
    for (const [key, value] of Object.entries(cartItems)) {
        const product = products.find((p: any) => p.id === key)
        if (product) {
            cartArray.push({
                ...product,
                quantity: value as number
            })
            totalPrice += product.price * (value as number)
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                onClick={() => dispatch(closeDrawer())}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in" 
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col justify-between transform transition duration-300 ease-out">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
                            <ShoppingBagIcon size={20} className="text-blue-600" />
                            <span>Mon Panier ({cartArray.reduce((acc, curr) => acc + curr.quantity, 0)})</span>
                        </div>
                        <button 
                            onClick={() => dispatch(closeDrawer())}
                            aria-label="Fermer le panier"
                            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                        >
                            <XIcon size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cartArray.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                                <ShoppingBagIcon size={56} className="text-slate-300 mb-4 stroke-1" />
                                <p className="text-lg font-medium text-slate-600">Votre panier est vide</p>
                                <p className="text-sm text-slate-400 mt-1">Découvrez nos produits et faites-vous plaisir !</p>
                                <button 
                                    onClick={() => dispatch(closeDrawer())}
                                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-full hover:bg-blue-700 transition"
                                >
                                    Parcourir la boutique
                                </button>
                            </div>
                        ) : (
                            cartArray.map((item, index) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-100 transition animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
                                    <div className="size-20 bg-white rounded-lg p-2 flex items-center justify-center border border-slate-200/60 shrink-0">
                                        <Image src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} alt={item.name || "Produit"} width={60} height={60} className="max-h-16 w-auto object-contain" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-medium text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                                                <button 
                                                    onClick={() => dispatch(deleteItemFromCart({ productId: item.id }))}
                                                    aria-label="Supprimer du panier"
                                                    className="text-slate-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                                                >
                                                    <Trash2Icon size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-blue-600 font-semibold mt-0.5">{currency}{item.price}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <Counter productId={item.id} />
                                            <p className="text-sm font-semibold text-slate-800">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Summary */}
                    {cartArray.length > 0 && (
                        <div className="p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] border-t border-slate-100 bg-slate-50/50 space-y-4">
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-slate-500">
                                    <span>Sous-total</span>
                                    <span className="font-medium text-slate-800">{currency}{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Livraison</span>
                                    <span className="text-green-600 font-medium">Gratuite</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                                    <span>Total</span>
                                    <span className="text-blue-600">{currency}{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link 
                                    href="/cart"
                                    onClick={() => dispatch(closeDrawer())}
                                    className="w-full text-center py-3 border border-slate-300 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-100 transition"
                                >
                                    Voir le panier
                                </Link>
                                <Link 
                                    href="/cart"
                                    onClick={() => dispatch(closeDrawer())}
                                    className="w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                                >
                                    Commander <ArrowRightIcon size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartDrawer
