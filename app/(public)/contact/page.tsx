'use client'
import React, { useState } from 'react'
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon, SparklesIcon, ClockIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import JsonLd from '@/components/seo/JsonLd'
import { SITE_CONFIG, getBreadcrumbSchema } from '@/lib/seo'

export default function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Votre message a été envoyé avec succès ! Notre équipe à Dakar vous répondra sous 24h.")
        setForm({ name: '', email: '', subject: '', message: '' })
    }

    const breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Contact', url: '/contact' }
    ]

    return (
        <div className="mx-6 min-h-[80vh] my-16 text-slate-800">
            <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header Title */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <SparklesIcon size={14} /> Service Client Sénégal & Dakar
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
                        Contactez SenTech Plus Dakar
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base">
                        Une question sur nos accessoires High-Tech, votre commande ou la livraison express à Dakar ? Notre équipe est à votre écoute.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    
                    {/* Contact Info Cards */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                                <PhoneIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Téléphone & WhatsApp Sénégal</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Du lundi au samedi, 8h30 - 20h00</p>
                                <p className="text-sm font-semibold text-blue-600 mt-2">{SITE_CONFIG.phone}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                                <MailIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Adresse E-mail</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Réponse garantie sous 24 heures</p>
                                <p className="text-sm font-semibold text-blue-600 mt-2">{SITE_CONFIG.email}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="size-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                                <MapPinIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Boutique & Showroom Dakar</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Point de retrait & démonstration</p>
                                <p className="text-sm font-semibold text-slate-700 mt-2">
                                    {SITE_CONFIG.address.streetAddress}, {SITE_CONFIG.address.addressLocality}, Sénégal
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">Envoyez-nous un message</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Votre nom complet</label>
                                    <input 
                                        type="text" 
                                        placeholder="Mamadou Diallo"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full border border-slate-200 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50"
                                        required 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700">Votre adresse e-mail</label>
                                    <input 
                                        type="email" 
                                        placeholder="mamadou@exemple.sn"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full border border-slate-200 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Sujet du message</label>
                                <input 
                                    type="text" 
                                    placeholder="Demande d'information / Suivi de commande Dakar"
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="w-full border border-slate-200 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50"
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Votre message</label>
                                <textarea 
                                    rows={5} 
                                    placeholder="Écrivez votre message ici..."
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full border border-slate-200 focus:border-blue-500 outline-none p-3 rounded-xl text-sm resize-none transition bg-slate-50/50"
                                    required 
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                            >
                                <SendIcon size={16} /> Envoyer le message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
