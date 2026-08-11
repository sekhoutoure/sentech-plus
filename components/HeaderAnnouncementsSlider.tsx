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
    Clock
} from 'lucide-react'

const announcements = [
    {
        id: '1',
        title: 'Livraison Express Dakar H+2',
        badge: 'EXPRESS SÉNÉGAL',
        badgeBg: 'bg-[#16C784]/10 text-[#16C784] border-[#16C784]/20',
        icon: Truck,
        link: '/shop',
        linkText: 'Commander'
    },
    {
        id: '2',
        title: 'Vente Flash -35% High-Tech',
        badge: 'FLASH',
        badgeBg: 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20',
        icon: Flame,
        link: '/shop?search=Promo',
        linkText: 'Profiter',
        hasTimer: true
    },
    {
        id: '3',
        title: 'Code Promo: NEW20 (-20%)',
        badge: 'REMISE 20%',
        badgeBg: 'bg-[#1677FF]/10 text-[#1677FF] border-[#1677FF]/20',
        icon: Sparkles,
        link: '/shop?search=Promo',
        linkText: 'Utiliser'
    },
    {
        id: '4',
        title: 'Paiement à la Livraison Wave & OM',
        badge: 'PAIEMENT SÉCURISÉ',
        badgeBg: 'bg-[#16C784]/10 text-[#16C784] border-[#16C784]/20',
        icon: CreditCard,
        link: '/shop',
        linkText: 'Voir catalogue'
    },
    {
        id: '5',
        title: 'Garantie Certifiée 7 Jours',
        badge: 'GARANTIE 100%',
        badgeBg: 'bg-[#1677FF]/10 text-[#1677FF] border-[#1677FF]/20',
        icon: ShieldCheck,
        link: '/about',
        linkText: 'Découvrir'
    }
]

export default function HeaderAnnouncementsSlider() {
    const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 })
    const [activeMobileIdx, setActiveMobileIdx] = useState(0)

    // Countdown Timer pour la vente flash
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                return { hours: 5, minutes: 0, seconds: 0 }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Défilement automatique carrousel mobile
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMobileIdx((prev) => (prev + 1) % announcements.length)
        }, 3200)
        return () => clearInterval(interval)
    }, [])

    const formatTimer = () => {
        const h = String(timeLeft.hours).padStart(2, '0')
        const m = String(timeLeft.minutes).padStart(2, '0')
        const s = String(timeLeft.seconds).padStart(2, '0')
        return `${h}:${m}:${s}`
    }

    return (
        <div className="w-full bg-[#F3F8FF] border-t border-b border-[#E1E8F0] py-2 overflow-hidden relative shadow-2xs">
            <div className="max-w-[1280px] mx-auto px-3 sm:px-6">
                
                {/* DESKTOP View: 3 Pills d'annonces côte à côte avec Timer & Actions */}
                <div className="hidden md:grid grid-cols-3 gap-3 items-center">
                    {announcements.slice(0, 3).map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl p-2 px-3 border border-[#E1E8F0] shadow-2xs flex items-center justify-between gap-2 hover:border-[#1677FF]/40 transition-all"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="size-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                                        <Icon size={14} />
                                    </div>
                                    <div className="truncate">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${item.badgeBg}`}>
                                                {item.badge}
                                            </span>
                                            {item.hasTimer && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#F97316] bg-[#F97316]/10 px-1.5 py-0.2 rounded-full">
                                                    <Clock size={9} />
                                                    {formatTimer()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-[#172033] truncate block">
                                            {item.title}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={item.link}
                                    className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#1677FF] hover:text-[#123B78] shrink-0"
                                >
                                    <span>{item.linkText}</span>
                                    <ChevronRight size={11} />
                                </Link>
                            </div>
                        )
                    })}
                </div>

                {/* MOBILE View: Pill glissante unique avec swipe & timer */}
                <div className="md:hidden flex items-center justify-between gap-2 bg-white rounded-xl p-2 px-3 border border-[#E1E8F0] shadow-2xs">
                    {(() => {
                        const current = announcements[activeMobileIdx]
                        const Icon = current.icon
                        return (
                            <>
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="size-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                                        <Icon size={14} />
                                    </div>
                                    <div className="truncate">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${current.badgeBg}`}>
                                                {current.badge}
                                            </span>
                                            {current.hasTimer && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#F97316] bg-[#F97316]/10 px-1.5 py-0.2 rounded-full">
                                                    <Clock size={9} />
                                                    {formatTimer()}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-[#172033] truncate block">
                                            {current.title}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={current.link}
                                    className="inline-flex items-center gap-1 bg-[#1677FF] hover:bg-[#123B78] text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs"
                                >
                                    <span>{current.linkText}</span>
                                    <ChevronRight size={10} />
                                </Link>
                            </>
                        )
                    })()}
                </div>

            </div>
        </div>
    )
}
