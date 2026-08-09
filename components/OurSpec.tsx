'use client'
import React from 'react'
import { Truck, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react'

const OurSpecs: React.FC = () => {
    const features = [
        {
            title: "Livraison express",
            description: "Livraison le jour même à Dakar et sous 24h partout au Sénégal.",
            icon: Truck,
            gradient: "from-[#1769FF] to-cyan-400",
            glow: "rgba(23, 105, 255, 0.25)",
            accent: "#1769FF",
            pill: "Dakar J+0"
        },
        {
            title: "Produits certifiés",
            description: "Equipements tech sélectionnés pour leur fiabilité et garantie.",
            icon: ShieldCheck,
            gradient: "from-[#12B76A] to-teal-400",
            glow: "rgba(18, 183, 106, 0.25)",
            accent: "#12B76A",
            pill: "Garantie SenTech"
        },
        {
            title: "Retours sous 7j",
            description: "Processus de retour simple et gratuit pour tout produit non conforme.",
            icon: RefreshCw,
            gradient: "from-amber-500 to-orange-400",
            glow: "rgba(245, 158, 11, 0.25)",
            accent: "#F59E0B",
            pill: "Remboursement 7j"
        },
        {
            title: "Support WhatsApp",
            description: "Disponibilité 7j/7 sur WhatsApp pour vos questions et commandes.",
            icon: MessageCircle,
            gradient: "from-purple-600 to-indigo-500",
            glow: "rgba(124, 58, 237, 0.25)",
            accent: "#7C3AED",
            pill: "Réponse < 5 min"
        },
    ]

    return (
        <section className="px-3 sm:px-6 py-10 sm:py-16 lg:py-24 max-w-[1400px] mx-auto">

            {/* Section Header */}
            <div className="text-center space-y-2 mb-8 sm:mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border border-[#1769FF]/20">
                    🌟 NOS ENGAGEMENTS
                </div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
                    Pourquoi choisir SenTech Plus ?
                </h2>
                <p className="text-xs sm:text-base text-[#667085] max-w-xl mx-auto font-normal leading-relaxed" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                    Une expérience d'achat simple et sécurisée pensée pour le Sénégal.
                </p>
            </div>

            {/* 4 Feature Cards — 2 cols mobile / 4 cols desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {features.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                        <div
                            key={index}
                            className="group relative p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between gap-3 overflow-hidden"
                        >
                            {/* Top glow strip */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl sm:rounded-t-3xl`} />

                            {/* Icon */}
                            <div
                                className={`size-11 sm:size-16 rounded-xl sm:rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white group-hover:scale-110 transition-transform duration-300`}
                                style={{ boxShadow: `0 6px 18px ${item.glow}` }}
                            >
                                <IconComponent size={20} className="sm:hidden" />
                                <IconComponent size={28} className="hidden sm:block" />
                            </div>

                            {/* Text */}
                            <div className="space-y-1 flex-1">
                                <h3 className="text-[13px] sm:text-[17px] font-extrabold text-[#101828] leading-snug tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-[11px] sm:text-sm text-[#667085] leading-relaxed font-normal line-clamp-3">
                                    {item.description}
                                </p>
                            </div>

                            {/* Bottom Pill */}
                            <div className="pt-2 sm:pt-3 border-t border-[#EBEBEB]">
                                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[#EAF3FF] text-[#1769FF]">
                                    <span>✓</span>
                                    <span>{item.pill}</span>
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default OurSpecs
