'use client'
import React from 'react'
import { useCartStore, useProductStore } from '@/lib/stores'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Counter from './Counter'
import { formatPrice } from '@/lib/format'

const CartDrawer = () => {
    const { isDrawerOpen, cartItems, closeDrawer, deleteItemFromCart } = useCartStore()
    const products = useProductStore(s => s.list)

    if (!isDrawerOpen) return null

    // Build cart items array
    const cartArray = []
    let totalPrice = 0
    for (const [key, value] of Object.entries(cartItems || {})) {
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
                onClick={closeDrawer}
                className="absolute inset-0 bg-[#071126]/60 backdrop-blur-xs transition-opacity animate-fade-in" 
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between transform transition duration-300 ease-out border-l border-[#E4E7EC]">
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F7F9FC]">
                        <div className="flex items-center gap-2 text-[#101828] font-bold text-base sm:text-lg">
                            <ShoppingBag size={20} className="text-[#1769FF]" />
                            <span>Mon Panier ({cartArray.reduce((acc, curr) => acc + curr.quantity, 0)})</span>
                        </div>
                        <button 
                            onClick={closeDrawer}
                            aria-label="Fermer le panier"
                            className="p-1.5 rounded-full text-[#667085] hover:text-[#101828] hover:bg-slate-200/60 transition cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                        {cartArray.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-[#667085]">
                                <ShoppingBag size={56} className="text-[#E4E7EC] mb-4 stroke-1" />
                                <p className="text-lg font-bold text-[#101828]">Votre panier est vide</p>
                                <p className="text-xs text-[#667085] mt-1 max-w-xs">Découvrez nos équipements high-tech certifiés et faites-vous plaisir !</p>
                                <button 
                                    onClick={closeDrawer}
                                    className="mt-6 px-6 py-2.5 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-xs rounded-full transition shadow-md shadow-[#1769FF]/20"
                                >
                                    Parcourir la boutique
                                </button>
                            </div>
                        ) : (
                            cartArray.map((item, index) => (
                                <div key={item.id} className="flex gap-4 p-3.5 bg-[#F7F9FC] rounded-2xl border border-[#E4E7EC] hover:border-[#1769FF]/30 transition animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="size-20 bg-white rounded-xl p-1 flex items-center justify-center border border-[#E4E7EC] shrink-0 overflow-hidden">
                                        <Image src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} alt={item.name || "Produit"} width={65} height={65} className="size-full object-cover rounded-lg" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-bold text-[#101828] text-xs sm:text-sm line-clamp-1">{item.name}</h4>
                                                <button 
                                                    onClick={() => deleteItemFromCart(item.id)}
                                                    aria-label="Supprimer du panier"
                                                    className="text-[#667085] hover:text-[#F04438] transition p-0.5 cursor-pointer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-[#1769FF] font-bold mt-0.5">{formatPrice(item.price)}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <Counter productId={item.id} />
                                            <p className="text-xs sm:text-sm font-black text-[#101828]">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Summary */}
                    {cartArray.length > 0 && (
                        <div className="p-5 sm:p-6 border-t border-[#E4E7EC] bg-[#F7F9FC] space-y-4">
                            <div className="space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between text-[#667085]">
                                    <span>Sous-total</span>
                                    <span className="font-bold text-[#101828]">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-[#667085]">
                                    <span>Livraison à Dakar</span>
                                    <span className="text-[#12B76A] font-bold">Gratuite</span>
                                </div>
                                <div className="flex justify-between text-base font-extrabold text-[#101828] pt-2 border-t border-[#E4E7EC]">
                                    <span>Total</span>
                                    <span className="text-[#1769FF]">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link 
                                    href="/cart"
                                    onClick={closeDrawer}
                                    className="w-full text-center py-3 border border-[#E4E7EC] bg-white text-[#101828] font-bold text-xs rounded-xl hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Voir le panier
                                </Link>
                                <Link 
                                    href="/cart"
                                    onClick={closeDrawer}
                                    className="w-full text-center py-3 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-[#1769FF]/25 cursor-pointer"
                                >
                                    Commander <ArrowRight size={15} />
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
