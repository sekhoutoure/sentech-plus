'use client'
import React from 'react'
import Title from './Title'
import { Truck, ShieldCheck, Headphones, RefreshCw, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const OurSpecs: React.FC = () => {
    const features = [
        {
            title: "Livraison Express Dakar 24h",
            description: "Recevez vos articles directement à domicile ou au bureau avec suivi en temps réel et option de paiement à la livraison.",
            icon: Truck,
            gradient: "from-blue-600 to-cyan-500",
            link: "/shop",
            actionText: "En savoir plus",
        },
        {
            title: "Garantie 100% Authentique",
            description: "Tous nos équipements et appareils proviennent de circuits certifiés avec garantie constructeur complète.",
            icon: ShieldCheck,
            gradient: "from-emerald-600 to-teal-500",
            link: "/pricing",
            actionText: "Nos garanties",
        },
        {
            title: "Retours Faciles & Échanges",
            description: "Changement d'avis ? Retournez ou échangez votre article sans tracas sous 7 jours ouvrés après réception.",
            icon: RefreshCw,
            gradient: "from-amber-500 to-orange-500",
            link: "/pricing",
            actionText: "Politique retours",
        },
        {
            title: "Support Client WhatsApp 24/7",
            description: "Une équipe réactive et dévouée à votre écoute pour vous conseiller et vous accompagner à chaque étape.",
            icon: Headphones,
            gradient: "from-purple-600 to-indigo-500",
            link: "https://wa.me/221770000000",
            actionText: "Discuter avec nous",
        },
    ];

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-24 max-w-7xl mx-auto'>
            <Title
                badgeText="🌟 NOS ENGAGEMENTS QUALITÉ"
                title="Pourquoi Choisir SenTech Plus ?"
                description="Nous offrons une expérience d'achat haut de gamme, sécurisée et pensée pour les passionnés de technologie au Sénégal."
                visibleButton={false}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8'>
                {features.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={index}
                            className='relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden'
                        >
                            <div className="space-y-4">
                                <div className={`size-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${item.gradient} text-white shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent size={22} />
                                </div>
                                <h3 className='text-base font-bold text-slate-900 leading-snug'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-slate-600 leading-relaxed font-normal'>
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                                <span>{item.actionText}</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default OurSpecs;
