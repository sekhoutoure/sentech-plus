'use client'
import React from 'react'
import { Truck, ShieldCheck, RefreshCw, MessageCircle } from 'lucide-react'

const OurSpecs: React.FC = () => {
    const features = [
        {
            title: "Livraison rapide",
            description: "Livraison express à Dakar et expédition partout au Sénégal.",
            icon: Truck,
            gradient: "from-[#1769FF] to-cyan-500",
        },
        {
            title: "Produits sélectionnés",
            description: "Des produits soigneusement sélectionnés pour leur qualité et leur fiabilité.",
            icon: ShieldCheck,
            gradient: "from-[#12B76A] to-teal-500",
        },
        {
            title: "Retours faciles",
            description: "Une procédure simple et transparente pour vos retours sous 7 jours.",
            icon: RefreshCw,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            title: "Support client",
            description: "Une assistance disponible via WhatsApp pour vous accompagner.",
            icon: MessageCircle,
            gradient: "from-purple-600 to-indigo-500",
        },
    ];

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-20 max-w-[1400px] mx-auto'>
            {/* Header */}
            <div className='pb-4 border-b border-[#E4E7EC] mb-8 space-y-1.5'>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[11px] font-bold uppercase tracking-wider">
                    🌟 NOS ENGAGEMENTS QUALITÉ
                </div>
                <h2 className='text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight'>
                    Pourquoi choisir SenTech Plus ?
                </h2>
                <p className='text-xs sm:text-sm text-[#667085] max-w-xl'>
                    Une expérience d'achat simple, sécurisée et pensée pour les passionnés de technologie au Sénégal.
                </p>
            </div>

            {/* 4 Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'>
                {features.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={index}
                            className='relative p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E7EC] shadow-2xs hover:shadow-xl hover:border-[#1769FF]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden'
                        >
                            <div className="space-y-3.5">
                                <div className={`size-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white shadow-md shadow-[#1769FF]/10 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent size={22} />
                                </div>
                                <h3 className='text-base font-bold text-[#101828] leading-snug'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-[#667085] leading-relaxed font-normal'>
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#E4E7EC]/60 flex items-center gap-1 text-[11px] font-bold text-[#1769FF]">
                                <span>Garantie SenTech</span>
                                <span>✓</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default OurSpecs;
