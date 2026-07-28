'use client'
import React, { useState } from 'react'
import { CheckIcon, SparklesIcon, ShieldCheckIcon, ZapIcon } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState('monthly')

    const plans = [
        {
            name: "Membre Gratuit",
            priceMonthly: 0,
            priceYearly: 0,
            description: "Idéal pour découvrir les produits et passer des commandes occasionnelles.",
            features: [
                "Accès à l'ensemble du catalogue",
                "Livraison standard",
                "Support client par e-mail",
                "Garantie satisfait ou remboursé 7 jours"
            ],
            cta: "Découvrir la boutique",
            href: "/shop",
            highlighted: false
        },
        {
            name: "Pass Membre Plus",
            priceMonthly: 9.99,
            priceYearly: 89.99,
            description: "Pour les passionnés de tech qui souhaitent des remises exclusives et la livraison express.",
            features: [
                "Remise permanente de 10% sur tous les articles",
                "Livraison express gratuite sans minimum d'achat",
                "Offres et ventes privées en avant-première",
                "Service client prioritaire 24/7",
                "Retours gratuits prolongés à 30 jours"
            ],
            cta: "Rejoindre le club Plus",
            href: "/create-store",
            highlighted: true
        },
        {
            name: "Partenaire Vendeur",
            priceMonthly: 29.99,
            priceYearly: 279.99,
            description: "Créez votre propre boutique SenTech et vendez vos produits à des milliers de clients.",
            features: [
                "Création de boutique vendeur dédiée",
                "Gestion d'inventaire et tableau de bord complet",
                "Commission réduite sur les ventes",
                "Assistance technique et marketing dédiée",
                "Statut Vendeur Vérifié"
            ],
            cta: "Créer ma boutique",
            href: "/create-store",
            highlighted: false
        }
    ]

    return (
        <div className="mx-6 min-h-[80vh] my-16 text-slate-800">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Header Title */}
                <div className="text-center max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
                        <SparklesIcon size={14} /> Club Membre SenTech Plus
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                        Des avantages exclusifs pour vos achats tech
                    </h1>
                    <p className="text-slate-500 mt-4 text-base sm:text-lg">
                        Choisissez le forfait qui correspond le mieux à vos besoins et profitez de réductions et services premium.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center gap-3 my-10 bg-slate-100 p-1.5 rounded-full border border-slate-200">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                            billingCycle === 'monthly'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Facturation Mensuelle
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                            billingCycle === 'yearly'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Facturation Annuelle <span className="bg-emerald-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">-25%</span>
                    </button>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
                    {plans.map((plan, index) => {
                        const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly
                        return (
                            <div
                                key={index}
                                className={`relative rounded-3xl p-8 flex flex-col justify-between transition duration-300 ${
                                    plan.highlighted
                                        ? 'bg-slate-900 text-white border-2 border-blue-500 shadow-xl scale-103 z-10'
                                        : 'bg-white text-slate-800 border border-slate-200 hover:border-slate-300 shadow-sm'
                                }`}
                            >
                                {plan.highlighted && (
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                                        Recommandé
                                    </span>
                                )}

                                <div>
                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                    <p className={`text-xs mt-2 ${plan.highlighted ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {plan.description}
                                    </p>

                                    <div className="my-6">
                                        <span className="text-4xl font-extrabold">
                                            {price === 0 ? "Gratuit" : `${price.toFixed(2)} €`}
                                        </span>
                                        {price > 0 && (
                                            <span className={`text-xs ml-1 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                                                /{billingCycle === 'monthly' ? 'mois' : 'an'}
                                            </span>
                                        )}
                                    </div>

                                    <ul className="space-y-3.5 my-6 text-sm">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <CheckIcon
                                                    size={16}
                                                    className={plan.highlighted ? "text-blue-400 shrink-0" : "text-blue-600 shrink-0"}
                                                />
                                                <span className={plan.highlighted ? "text-slate-200" : "text-slate-600"}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href={plan.href}
                                    className={`w-full text-center py-3.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                                        plan.highlighted
                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        )
                    })}
                </div>

                {/* Assurance Guarantee */}
                <div className="mt-16 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w-3xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <ShieldCheckIcon size={40} className="text-blue-600 shrink-0" />
                    <div>
                        <h4 className="font-semibold text-slate-900">Garantie de satisfaction SenTech Plus</h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Vous pouvez annuler ou modifier votre formule à tout moment depuis votre compte. Aucun engagement de durée.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}