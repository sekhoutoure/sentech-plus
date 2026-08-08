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
        <aside aria-label="Bannière promotionnelle" className="relative z-[60] w-full bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white border-b border-blue-500/20 shadow-md">
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm">
                
                {/* Promo message */}
                <div 
                    onClick={handleClaim}
                    className="flex items-center gap-1.5 sm:gap-2 pr-7 sm:pr-0 font-medium cursor-pointer sm:cursor-default truncate"
                >
                    <span className="flex items-center justify-center size-5 sm:size-6 rounded-full bg-blue-500/20 text-blue-400 shrink-0 animate-pulse">
                        <Sparkles size={12} />
                    </span>
                    <span className="text-slate-200 truncate text-[11px] sm:text-xs md:text-sm">
                        {banner.text || "✨ -20% sur votre 1ère commande avec le code"} <strong className="text-cyan-300 sm:hidden">{couponCode}</strong>
                    </span>
                </div>

                {/* Voucher pill and close action - Desktop */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleClaim}
                        type="button"
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3.5 py-1 rounded-full text-xs shadow-sm hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer border border-blue-400/30 active:scale-95"
                    >
                        {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                        <span>Code : <span className="underline decoration-dotted">{couponCode}</span></span>
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        type="button"
                        aria-label="Fermer la bannière"
                        className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* Mobile close button with proper margin */}
                <button
                    onClick={() => setIsOpen(false)}
                    type="button"
                    aria-label="Fermer la bannière"
                    className="sm:hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                    <X size={15} />
                </button>
            </div>
        </aside>
    );
}
