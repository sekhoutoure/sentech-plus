'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
    Truck, 
    Sparkles, 
    ShieldCheck, 
    CreditCard, 
    Flame, 
    ChevronRight,
    ChevronLeft
} from 'lucide-react'

const announcements = [
    {
        id: '1',
        title: 'Livraison Express Dakar H+2',
        subtitle: 'Commandez avant 16h, livré aujourd\'hui chez vous !',
        badge: 'EXPRESS SÉNÉGAL',
        badgeBg: 'bg-[#085D38]/10 text-[#085D38] border-[#085D38]/20',
        icon: Truck,
        link: '/shop',
        linkText: 'Commander'
    },
    {
        id: '2',
        title: 'Offre Bienvenue : -20% immédiats',
        subtitle: 'Utilisez le code promo NEW20 lors de votre commande',
        badge: 'CODE: NEW20',
        badgeBg: 'bg-[#0B54C2]/10 text-[#0B54C2] border-[#0B54C2]/20',
        icon: Sparkles,
        link: '/shop?search=Promo',
        linkText: 'Profiter'
    },
    {
        id: '3',
        title: 'Équipements Certifiés & Garantis 7 Jours',
        subtitle: 'Produits 100% authentiques testés au Sénégal',
        badge: 'GARANTIE 100%',
        badgeBg: 'bg-[#0B54C2]/10 text-[#0B54C2] border-[#0B54C2]/20',
        icon: ShieldCheck,
        link: '/about',
        linkText: 'En savoir plus'
    },
    {
        id: '4',
        title: 'Paiement Sécurisé à la Livraison',
        subtitle: 'Payez en espèces, Wave ou Orange Money à la réception',
        badge: 'WAVE & OM',
        badgeBg: 'bg-[#085D38]/10 text-[#085D38] border-[#085D38]/20',
        icon: CreditCard,
        link: '/shop',
        linkText: 'Voir catalogue'
    },
    {
        id: '5',
        title: 'Ventes Flash High-Tech jusqu\'à -35%',
        subtitle: 'Promotions exclusives sur casques, montres et laptops',
        badge: 'VENTES FLASH',
        badgeBg: 'bg-[#C4320A]/10 text-[#C4320A] border-[#C4320A]/20',
        icon: Flame,
        link: '/shop?search=Promo',
        linkText: 'Voir les offres'
    }
]

export default function HeaderAnnouncementsSlider() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Défilement automatique toutes les 3.5 secondes
    useEffect(() => {
        if (isPaused) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length)
        }, 3500)
        return () => clearInterval(timer)
    }, [isPaused])

    const current = announcements[currentIndex]
    const Icon = current.icon

    return (
        <div 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full bg-gradient-to-r from-[#EAF3FF] via-[#F3F7FC] to-[#EAF3FF] border-t border-b border-[#E8EDF3] py-2 overflow-hidden relative shadow-2xs"
        >
            <div className="max-w-[1400px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-3">
                
                {/* Previous Button (Desktop) */}
                <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
                    aria-label="Annonce précédente"
                    className="hidden sm:flex size-7 rounded-full bg-white/80 hover:bg-white text-[#182230] items-center justify-center border border-[#E8EDF3] transition cursor-pointer shrink-0 shadow-2xs active:scale-95"
                >
                    <ChevronLeft size={14} />
                </button>

                {/* Animated Announcement Item Container */}
                <div className="flex-1 overflow-hidden">
                    <div 
                        key={current.id}
                        className="flex items-center justify-between sm:justify-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300 min-h-[32px]"
                    >
                        {/* Left Icon & Badge */}
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="size-7 rounded-xl bg-white text-[#0B54C2] flex items-center justify-center shrink-0 border border-[#E8EDF3] shadow-2xs">
                                <Icon size={14} />
                            </div>

                            <div className="truncate text-left">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${current.badgeBg}`}>
                                        {current.badge}
                                    </span>
                                    <span className="text-xs font-extrabold text-[#182230] truncate">
                                        {current.title}
                                    </span>
                                </div>
                                <span className="hidden md:inline text-[11px] text-[#475467] font-medium truncate">
                                    {current.subtitle}
                                </span>
                            </div>
                        </div>

                        {/* Action CTA Button */}
                        <Link
                            href={current.link}
                            className="inline-flex items-center gap-1 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-[10px] sm:text-xs px-3 py-1.5 rounded-full transition-all shrink-0 shadow-2xs active:scale-95 cursor-pointer"
                        >
                            <span>{current.linkText}</span>
                            <ChevronRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Next Button (Desktop) */}
                <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
                    aria-label="Annonce suivante"
                    className="hidden sm:flex size-7 rounded-full bg-white/80 hover:bg-white text-[#182230] items-center justify-center border border-[#E8EDF3] transition cursor-pointer shrink-0 shadow-2xs active:scale-95"
                >
                    <ChevronRight size={14} />
                </button>

                {/* Pagination Dots indicator */}
                <div className="hidden lg:flex items-center gap-1 shrink-0">
                    {announcements.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Annonce ${idx + 1}`}
                            className="p-1 cursor-pointer"
                        >
                            <span 
                                className={`block h-1.5 rounded-full transition-all duration-300 ${
                                    idx === currentIndex ? 'w-4 bg-[#0B54C2]' : 'w-1.5 bg-[#CBD5E1]'
                                }`}
                            />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    )
}
