'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EyeIcon, StarIcon, ShoppingCartIcon } from 'lucide-react'
import { useSiteSettingsStore, useCartStore } from '@/lib/stores'
import toast from 'react-hot-toast'

export default function RecentlyViewed() {
    const addToCart = useCartStore(s => s.addToCart)
    const currency = useSiteSettingsStore(s => s.currencySymbol) || '$'
    const [recentProducts, setRecentProducts] = useState<Array<any>>([])

    useEffect(() => {
        try {
            const saved = localStorage.getItem('sentech_recently_viewed')
            if (saved) {
                setRecentProducts(JSON.parse(saved))
            }
        } catch {
            // localStorage indisponible (navigation privée, quota dépassé) — silencieux en prod
        }
    }, [])

    if (recentProducts.length === 0) return null

    const handleAddToCart = (product: any) => {
        addToCart(product.id)
        toast.success(`${product.name} ajouté au panier !`)
    }

    return (
        <section className="my-12 py-8 bg-slate-50/60 rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4">
                <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <EyeIcon size={18} />
                </div>
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Produits Récemment Vus</h3>
                    <p className="text-xs text-slate-500">Retrouvez les articles que vous avez consultés récemment</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {recentProducts.slice(0, 6).map((product) => (
                    <div key={product.id || product._id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:shadow-md transition flex flex-col justify-between group space-y-2">
                        <Link href={`/product/${product.id || product._id}`} className="space-y-2 block">
                            <div className="relative size-28 mx-auto bg-slate-50 rounded-xl p-2">
                                <Image 
                                    src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                                    alt={product.name} 
                                    fill 
                                    className="object-contain p-1 group-hover:scale-105 transition" 
                                />
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs line-clamp-2 group-hover:text-blue-600 transition">{product.name}</h4>
                            <p className="text-xs font-extrabold text-blue-600">{currency}{product.price}</p>
                        </Link>

                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-[11px] py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        >
                            <ShoppingCartIcon size={12} /> Ajouter
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

// Utility function to save viewed product
export function saveRecentlyViewed(product: any) {
    if (typeof window === 'undefined' || !product) return
    try {
        const saved = localStorage.getItem('sentech_recently_viewed')
        let items: Array<any> = saved ? JSON.parse(saved) : []
        items = items.filter(p => (p.id || p._id) !== (product.id || product._id))
        items.unshift(product)
        if (items.length > 10) items = items.slice(0, 10)
        localStorage.setItem('sentech_recently_viewed', JSON.stringify(items))
    } catch (e) {
        console.error(e)
    }
}
