'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react'
import { useCompareStore, useProductStore } from '@/lib/stores'
import { getProductImage } from '@/lib/image-utils'
import CompareModal from './CompareModal'

export default function CompareFloatingBar() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const compareIds = useCompareStore(s => s.items)
    const allProducts = useProductStore(s => s.list)
    const removeFromCompare = useCompareStore(s => s.removeFromCompare)
    const clearCompare = useCompareStore(s => s.clearCompare)

    if (!compareIds || compareIds.length === 0) return null

    const compareProducts = allProducts.filter((p: any) => {
        const pId = p.id || p._id || 'prod'
        return compareIds.includes(pId)
    })

    return (
        <>
            <div className="fixed bottom-16 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#182230]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 sm:gap-6 animate-in slide-in-from-bottom duration-300 max-w-[92vw] sm:max-w-lg">
                
                {/* Micro Label */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="size-8 rounded-xl bg-[#0B54C2] text-white flex items-center justify-center font-bold shadow-xs">
                        <Scale size={16} />
                    </div>
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-black leading-none">Comparateur</div>
                        <div className="text-[10px] text-slate-300 font-medium">{compareProducts.length}/3 sélectionnés</div>
                    </div>
                </div>

                {/* Thumbnails list */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {compareProducts.map((product: any) => {
                        const pId = product.id || product._id || 'prod'
                        const img = getProductImage(product, 0)
                        return (
                            <div key={pId} className="relative size-9 rounded-xl bg-white p-0.5 border border-white/20 shrink-0 group">
                                <Image
                                    src={img}
                                    alt={product.name}
                                    fill
                                    sizes="36px"
                                    className="object-contain p-0.5 rounded-lg"
                                />
                                <button
                                    onClick={() => removeFromCompare(pId)}
                                    aria-label="Supprimer du comparateur"
                                    className="absolute -top-1.5 -right-1.5 size-4 bg-[#C4320A] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-2 ml-auto shrink-0">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                        <span>Comparer</span>
                        <ArrowRight size={13} />
                    </button>

                    <button
                        onClick={() => clearCompare()}
                        className="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                        title="Vider la sélection"
                        aria-label="Vider la sélection du comparateur"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

            </div>

            {/* Compare Modal */}
            <CompareModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
