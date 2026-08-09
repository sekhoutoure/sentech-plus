'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Sparkles, Copy, Check, X } from 'lucide-react';

export default function Banner() {
    const [isOpen, setIsOpen] = useState(true);
    const [copied, setCopied] = useState(false);
    const banner = useSelector((state: any) => state.siteSettings?.banner);

    if (!banner?.enabled || !isOpen) return null;

    const couponCode = banner.couponCode || 'NEW20';

    const handleClaim = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        toast.success(`Code promo "${couponCode}" copié ! 20% de réduction appliqués.`);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <aside aria-label="Bannière promotionnelle" className="relative z-[60] w-full bg-[#071126] text-white border-b border-slate-800/80">
            <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-1 min-h-[28px] flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                
                {/* Promo Message */}
                <div 
                    onClick={handleClaim}
                    className="flex items-center gap-1.5 cursor-pointer sm:cursor-default truncate"
                >
                    <span className="flex items-center justify-center size-4 rounded-full bg-[#1769FF]/20 text-[#1769FF] shrink-0">
                        <Sparkles size={10} />
                    </span>
                    <span className="text-slate-200 font-semibold truncate">
                        {banner.text || "🚚 Livraison rapide partout au Sénégal"}
                    </span>
                </div>

                {/* Right: Coupon Code & Dismiss */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleClaim}
                        type="button"
                        className="inline-flex items-center gap-1 bg-[#1769FF] hover:bg-[#1256D6] text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                    >
                        {copied ? <Check size={11} className="text-white" /> : <Copy size={11} />}
                        <span>Code: <span className="underline underline-offset-2">{couponCode}</span></span>
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        aria-label="Fermer la bannière"
                        className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                    >
                        <X size={13} />
                    </button>
                </div>

            </div>
        </aside>
    );
}
