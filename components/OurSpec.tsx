'use client'
import React from 'react'
import { Truck, Lock, CheckCircle2, MessageCircle } from 'lucide-react'

const features = [
    {
        title: "Livraison express",
        description: "Recevez vos commandes rapidement.",
        icon: Truck,
        bg: "bg-[#EAF3FF]",
        color: "text-[#1677FF]",
        pill: "Dakar & Sénégal"
    },
    {
        title: "Paiement sécurisé",
        description: "Vos paiements sont protégés.",
        icon: Lock,
        bg: "bg-[#EAF3FF]",
        color: "text-[#123B78]",
        pill: "Paiement à la livraison"
    },
    {
        title: "Produits certifiés",
        description: "Des produits high-tech soigneusement sélectionnés.",
        icon: CheckCircle2,
        bg: "bg-[#ECFDF5]",
        color: "text-[#16C784]",
        pill: "100% Authentique"
    },
    {
        title: "Support WhatsApp",
        description: "Une assistance disponible quand vous en avez besoin.",
        icon: MessageCircle,
        bg: "bg-[#DCFCE7]",
        color: "text-[#25D366]",
        pill: "Assistance 7j/7"
    },
]

const OurSpecs: React.FC = () => {
    return (
        <section aria-label="Pourquoi choisir SenTechPLUS" className="px-3 sm:px-6 py-4 max-w-[1280px] mx-auto w-full">

            {/* Section Header */}
            <div className="text-center space-y-1 mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EAF3FF] text-[#0F56C6] text-xs font-bold uppercase tracking-wider border border-[#0F56C6]/20">
                    NOS ENGAGEMENTS
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                    Pourquoi choisir SenTechPLUS ?
                </h2>
                <p className="text-xs sm:text-sm text-[#667085] max-w-xl mx-auto font-normal">
                    Une expérience d'achat simple, transparente et rassurante.
                </p>
            </div>

            {/* 4 Feature Cards (2x2 on Mobile, 4 on Desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {features.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                        <div
                            key={index}
                            className="group p-4 sm:p-6 rounded-2xl bg-white border border-[#E1E8F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)] hover:shadow-[0_8px_30px_rgba(22,119,255,0.08)] hover:border-[#1677FF]/30 transition-all duration-300 flex flex-col justify-between gap-3"
                        >
                            {/* Icon Circle */}
                            <div className={`size-10 sm:size-12 rounded-xl flex items-center justify-center ${item.bg} ${item.color} group-hover:scale-105 transition-transform duration-300`}>
                                <IconComponent size={20} />
                            </div>

                            {/* Text */}
                            <div className="space-y-1 flex-1">
                                <h3 className="text-xs sm:text-base font-bold text-[#172033] leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </div>

                            {/* Bottom Pill */}
                            <div className="pt-2 border-t border-[#E1E8F0]">
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#1677FF]">
                                    <span>✓ {item.pill}</span>
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
