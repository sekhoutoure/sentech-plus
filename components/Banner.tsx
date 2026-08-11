'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Sparkles, Copy, Check, X } from 'lucide-react'

export default function Banner() {
    const [isOpen, setIsOpen] = useState(true)
    const [copied, setCopied] = useState(false)
    const banner = useSelector((state: any) => state.siteSettings?.banner)

    if (banner?.enabled === false || !isOpen) return null

    const couponCode = banner?.couponCode || 'NEW20'
    const promoText = banner?.text || "Obtenez 20% de réduction sur votre première commande"

    const handleClaim = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(couponCode)
        setCopied(true)
        toast.success(`Code promo "${couponCode}" copié ! 20% de réduction appliqués.`)
        setTimeout(() => setCopied(false), 3000)
    }

    return (
        <aside aria-label="Bannière promotionnelle" className="relative z-30 w-full bg-[#EAF3FF] text-[#172033] border-b border-[#E1E8F0] h-[36px] flex items-center">
            <div className="max-w-[1280px] mx-auto px-3 sm:px-6 w-full flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                
                {/* Promo Message */}
                <div 
                    onClick={handleClaim}
                    className="flex items-center gap-1.5 cursor-pointer sm:cursor-default truncate"
                >
                    <Sparkles size={13} className="text-[#1677FF] shrink-0" />
                    <span className="text-[#172033] font-medium truncate">
                        {promoText}
                    </span>
                </div>

                {/* Right: Coupon Code & Dismiss */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleClaim}
                        type="button"
                        className="inline-flex items-center gap-1 bg-[#1677FF] hover:bg-[#123B78] text-white font-semibold px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                    >
                        {copied ? <Check size={11} className="text-white" /> : <Copy size={11} />}
                        <span>Code : <strong>{couponCode}</strong></span>
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        aria-label="Fermer la bannière"
                        className="text-[#667085] hover:text-[#172033] p-0.5 rounded-full hover:bg-white/50 transition-colors cursor-pointer"
                    >
                        <X size={13} />
                    </button>
                </div>

            </div>
        </aside>
    )
}
