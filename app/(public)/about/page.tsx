'use client'
import React from 'react'
import Link from 'next/link'
import { SparklesIcon, ArrowRightIcon, HelpCircleIcon } from 'lucide-react'
import OurSpec from '@/components/OurSpec'
import JsonLd from '@/components/seo/JsonLd'
import { getFaqSchema, getBreadcrumbSchema } from '@/lib/seo'

const aboutFaqs = [
    {
        question: "Quels sont les délais de livraison à Dakar et au Sénégal ?",
        answer: "Nous livrons en moins de 24h à Dakar et sa banlieue (Pikine, Guédiawaye, Rufisque). Pour les autres régions du Sénégal (Thiès, Saint-Louis, Ziguinchor, Mbour), la livraison s'effectue en 48h à 72h."
    },
    {
        question: "Quels sont les moyens de paiement disponibles ?",
        answer: "Vous pouvez payer à la livraison en espèces (COD), ou par mobile money via Wave, Orange Money, Free Money ainsi que par Carte Bancaire (Visa / Mastercard)."
    },
    {
        question: "Les accessoires vendus sur SenTech Plus sont-ils authentiques ?",
        answer: "Absolument. Tous nos chargeurs rapides GaN, écouteurs Bluetooth, montres connectées et câbles USB-C sont 100% originaux et garantis avec service après-vente à Dakar."
    }
]

export default function AboutPage() {
    const breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'À Propos', url: '/about' }
    ]

    return (
        <div className="mx-6 min-h-[80vh] my-16 text-slate-800">
            <JsonLd data={[getFaqSchema(aboutFaqs), getBreadcrumbSchema(breadcrumbs)]} />
            <div className="max-w-7xl mx-auto space-y-20">
                
                {/* Hero Banner */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <SparklesIcon size={14} /> À Propos de SenTech Plus
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                        N°1 des Accessoires High-Tech & Smart Devices au Sénégal
                    </h1>
                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                        Chez SenTech Plus, nous sélectionnons les meilleures technologies et accessoires intelligents (écouteurs Bluetooth, chargeurs GaN, power banks) pour vous offrir performance et fiabilité au quotidien à Dakar.
                    </p>
                </div>

                {/* Our Story Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-slate-50/70 p-8 sm:p-12 rounded-3xl border border-slate-200/80">
                    <div className="space-y-6">
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Notre Mission au Sénégal</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Rendre l'innovation high-tech accessible avec livraison express 24h à Dakar
                        </h2>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Fondée avec la volonté de démocratiser l'accès aux équipements high-tech certifiés, SenTech Plus s'engage à offrir des produits d'origine avec garantie officielle.
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            De nos écouteurs sans fil à nos montres connectées et hubs USB-C, chaque équipement est rigoureusement testé pour résister aux exigences quotidiennes.
                        </p>
                        <div className="pt-2">
                            <Link href="/shop" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-full transition shadow-md shadow-blue-600/20">
                                Découvrir le catalogue <ArrowRightIcon size={16} />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <span className="text-3xl font-extrabold text-blue-600">10 000+</span>
                            <p className="text-xs text-slate-500 font-medium">Clients satisfaits au Sénégal</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <span className="text-3xl font-extrabold text-blue-600">24H</span>
                            <p className="text-xs text-slate-500 font-medium">Livraison rapide sur Dakar</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <span className="text-3xl font-extrabold text-blue-600">24/7</span>
                            <p className="text-xs text-slate-500 font-medium">Assistance WhatsApp & Support</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                            <span className="text-3xl font-extrabold text-blue-600">100%</span>
                            <p className="text-xs text-slate-500 font-medium">Produits d'origine certifiés</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Foire Aux Questions (FAQ)</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Questions Fréquentes sur vos commandes au Sénégal</h2>
                    </div>
                    <div className="space-y-4">
                        {aboutFaqs.map((faq, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                                <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                                    <HelpCircleIcon size={18} className="text-blue-600 shrink-0" /> {faq.question}
                                </h3>
                                <p className="text-slate-600 text-sm pl-7 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Commitments Section */}
                <OurSpec />
            </div>
        </div>
    )
}
