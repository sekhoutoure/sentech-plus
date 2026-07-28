'use client'
import { ArrowRight, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

interface ProductDescriptionProps {
    product: any;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState<string>('Description')

    const tabLabels: { [key: string]: string } = {
        'Description': 'Description',
        'Reviews': 'Avis'
    }

    return (
        <div className="my-16 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold' : 'text-slate-400'} px-3 py-2 font-medium`} key={index} onClick={() => setSelectedTab(tab)}>
                        {tabLabels[tab]}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <p className="max-w-xl">{product.description}</p>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="flex flex-col gap-4 mt-6">
                    {(!product.rating || product.rating.length === 0) ? (
                        <p className="text-sm text-slate-400 italic">Aucun avis pour le moment. Soyez le premier à évaluer ce produit après votre commande !</p>
                    ) : (
                        product.rating.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 max-w-xl">
                                <Image src={item.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="" className="size-10 rounded-full border border-slate-200 object-cover" width={40} height={40} />
                                <div>
                                    <div className="flex items-center gap-0.5">
                                        {Array(5).fill('').map((_, idx) => (
                                            <StarIcon key={idx} size={15} className='text-transparent' fill={item.rating >= idx + 1 ? "#2563EB" : "#E2E8F0"} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-700 my-2 leading-relaxed">{item.review}</p>
                                    <p className="font-semibold text-xs text-slate-900">{item.user?.name || "Acheteur Vérifié"}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(item.createdAt || Date.now()).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Store Page */}
            {product?.store && (
                <div className="flex gap-3 mt-14 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 w-fit">
                    <Image 
                        src={product.store.logo || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} 
                        alt={product.store.name || "Boutique Vendeur"} 
                        className="size-11 rounded-full ring-2 ring-blue-500/20 object-cover" 
                        width={44} 
                        height={44} 
                    />
                    <div>
                        <p className="font-semibold text-slate-800 text-xs">Vendu par <span className="text-blue-600">{product.store.name}</span></p>
                        <Link href={`/shop/${product.store.username || ''}`} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium mt-0.5 transition">
                            Voir la boutique <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDescription
