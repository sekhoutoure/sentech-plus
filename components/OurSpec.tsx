'use client'
import React from 'react'
import { Truck, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react'

const OurSpecs: React.FC = () => {
    const features = [
        {
            title: "Livraison express",
            description: "Jour même à Dakar, sous 24h partout au Sénégal.",
            icon: Truck,
            bg: "bg-[#EAF3FF]",
            color: "text-[#1677FF]",
            pillBg: "bg-[#EAF3FF]",
            pillText: "text-[#1677FF]",
            pill: "Dakar J+0"
        },
        {
            title: "Produits certifiés",
            description: "Équipements tech certifiés avec vraie garantie.",
            icon: ShieldCheck,
            bg: "bg-[#ECFDF3]",
            color: "text-[#16B979]",
            pillBg: "bg-[#ECFDF3]",
            pillText: "text-[#16B979]",
            pill: "Certifié SenTechPLUS"
        },
        {
            title: "Retours sous 7j",
            description: "Processus de retour simple et 100% gratuit.",
            icon: RefreshCw,
            bg: "bg-[#FFF7E8]",
            color: "text-[#FF6B35]",
            pillBg: "bg-[#FFF7E8]",
            pillText: "text-[#FF6B35]",
            pill: "Garantie 7 jours"
        },
        {
            title: "Support WhatsApp",
            description: "Assistance réactive 7j/7 sur WhatsApp.",
            icon: MessageCircle,
            bg: "bg-[#F3EEFF]",
            color: "text-[#8B5CF6]",
            pillBg: "bg-[#F3EEFF]",
            pillText: "text-[#8B5CF6]",
            pill: "Réponse < 5 min"
        },
    ]

    return (
        <section className="px-1.5 sm:px-6 py-3 sm:py-8 lg:py-12 max-w-[1400px] mx-auto w-full">

            {/* Section Header */}
            <div className="text-center space-y-1.5 mb-6 sm:mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border border-[#1677FF]/20">
                    🌟 NOS ENGAGEMENTS
                </div>
                <h2 className="text-lg sm:text-3xl lg:text-4xl font-black text-[#182230] tracking-tight">
                    Pourquoi choisir SenTechPLUS ?
                </h2>
                <p className="text-xs sm:text-base text-[#667085] max-w-xl mx-auto font-normal leading-relaxed">
                    Une expérience d'achat simple et sécurisée pensée pour le Sénégal.
                </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {features.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                        <div
                            key={index}
                            className="group relative p-3 sm:p-7 rounded-xl sm:rounded-3xl bg-white border border-[#E8EDF3] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-2.5 overflow-hidden"
                        >
                            {/* Icon Circle */}
                            <div className={`size-10 sm:size-14 rounded-full flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-105 transition-transform duration-300 border border-[#E8EDF3]/60`}>
                                <IconComponent size={18} className="sm:hidden" />
                                <IconComponent size={24} className="hidden sm:block" />
                            </div>

                            {/* Text */}
                            <div className="space-y-0.5 flex-1">
                                <h3 className="text-xs xs:text-sm sm:text-[17px] font-extrabold text-[#182230] leading-snug tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-[10px] sm:text-sm text-[#667085] leading-normal font-normal line-clamp-2">
                                    {item.description}
                                </p>
                            </div>

                            {/* Bottom Pill */}
                            <div className="pt-1.5 sm:pt-3 border-t border-[#E8EDF3]">
                                <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${item.pillBg} ${item.pillText}`}>
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
