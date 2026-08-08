'use client'
import React from 'react'
import Title from './Title'
import { Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react'

const OurSpecs: React.FC = () => {
    const features = [
        {
            title: "Livraison Express Dakar 24h",
            description: "Recevez vos articles directement à domicile ou au bureau avec suivi en temps réel et option de paiement à la livraison.",
            icon: Truck,
            gradient: "from-blue-600 to-cyan-500",
        },
        {
            title: "Garantie 100% Authentique",
            description: "Tous nos équipements et appareils proviennent de circuits certifiés avec garantie constructeur complète.",
            icon: ShieldCheck,
            gradient: "from-emerald-600 to-teal-500",
        },
        {
            title: "Retours Faciles & Échanges",
            description: "Changement d'avis ? Retournez ou échangez votre article sans tracas sous 7 jours ouvrés.",
            icon: RefreshCw,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            title: "Support Client WhatsApp 24/7",
            description: "Une équipe réactive à votre écoute pour vous conseiller et vous accompagner avant et après chaque achat.",
            icon: Headphones,
            gradient: "from-purple-600 to-indigo-500",
        },
    ];

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-24 max-w-7xl mx-auto'>
            <Title
                badgeText="🌟 NOS ENGAGEMENTS QUALITÉ"
                title="Pourquoi Choisir SenTech Plus ?"
                description="Nous offrons une expérience d'achat haut de gamme, sécurisée et pensée pour les passionnés de technologie."
                visibleButton={false}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8'>
                {features.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={index}
                            className='relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden'
                        >
                            <div className="space-y-3.5">
                                <div className={`size-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent size={22} />
                                </div>
                                <h3 className='text-base font-bold text-slate-900 leading-snug'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-slate-600 leading-relaxed font-normal'>
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-blue-600">
                                <span>Service Garanti</span>
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
