'use client'
import React from 'react'
import { Truck, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react'

const OurSpecs: React.FC = () => {
    const features = [
        {
            title: "Livraison express",
            description: "Livraison le jour même à Dakar et expédition rapide partout au Sénégal sous 24h.",
            icon: Truck,
            gradient: "from-[#1769FF] to-cyan-400",
            glow: "rgba(23, 105, 255, 0.25)",
            accent: "#1769FF",
            pill: "Dakar J+0"
        },
        {
            title: "Produits certifiés",
            description: "Des produits tech soigneusement sélectionnés pour leur fiabilité, leurs performances et leur rapport qualité/prix.",
            icon: ShieldCheck,
            gradient: "from-[#12B76A] to-teal-400",
            glow: "rgba(18, 183, 106, 0.25)",
            accent: "#12B76A",
            pill: "Certifié SenTech"
        },
        {
            title: "Retours sous 7 jours",
            description: "Un processus de retour simple, transparent et gratuit pour les produits défectueux ou non conformes.",
            icon: RefreshCw,
            gradient: "from-amber-500 to-orange-400",
            glow: "rgba(245, 158, 11, 0.25)",
            accent: "#F59E0B",
            pill: "Remboursement 7j"
        },
        {
            title: "Support WhatsApp 24/7",
            description: "Notre équipe est disponible 7j/7 sur WhatsApp pour répondre à toutes vos questions et vous accompagner.",
            icon: MessageCircle,
            gradient: "from-purple-600 to-indigo-500",
            glow: "rgba(124, 58, 237, 0.25)",
            accent: "#7C3AED",
            pill: "Réponse < 5 min"
        },
    ]

    return (
        <section className="px-4 sm:px-6 my-16 sm:my-24 max-w-[1400px] mx-auto">

            {/* Section Header */}
            <div className="text-center space-y-3 mb-12">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[11px] font-extrabold uppercase tracking-widest border border-[#1769FF]/20">
                    🌟 NOS ENGAGEMENTS
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#101828] tracking-tight" style={{ textWrap: 'balance' } as React.CSSProperties}>
                    Pourquoi choisir SenTech Plus ?
                </h2>
                <p className="text-sm sm:text-base text-[#667085] max-w-xl mx-auto font-normal leading-relaxed" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                    Une expérience d'achat simple, sécurisée et pensée pour les passionnés de technologie au Sénégal.
                </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {features.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                        <div
                            key={index}
                            className="group relative p-7 rounded-3xl bg-white border border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.09)] hover:-translate-y-2 hover:border-transparent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col gap-4 overflow-hidden"
                            style={{
                                '--glow': item.glow,
                                '--accent': item.accent,
                            } as React.CSSProperties}
                        >
                            {/* Subtle top glow strip on hover */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-3xl`} />

                            {/* Icon */}
                            <div
                                className={`size-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                                style={{ boxShadow: `0 8px 24px ${item.glow}` }}
                            >
                                <IconComponent size={24} />
                            </div>

                            {/* Text */}
                            <div className="space-y-1.5 flex-1">
                                <h3 className="text-base font-extrabold text-[#101828] leading-snug tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-[#667085] leading-relaxed font-normal" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                                    {item.description}
                                </p>
                            </div>

                            {/* Bottom Pill */}
                            <div className="pt-3 border-t border-[#EBEBEB]">
                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF]`}>
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
