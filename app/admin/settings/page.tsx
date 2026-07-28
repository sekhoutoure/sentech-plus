'use client'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSiteSettings, updateBannerSettings, updateHeroSettings } from '@/lib/features/siteSettings/siteSettingsSlice'
import { SettingsIcon, SaveIcon, MegaphoneIcon, GlobeIcon, PhoneIcon, MailIcon, MapPinIcon, LayoutIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
    const dispatch = useDispatch()
    const siteSettings = useSelector((state: any) => state.siteSettings)

    const [form, setForm] = useState({
        siteName: siteSettings.siteName || 'SenTech Plus',
        slogan: siteSettings.slogan || 'Smart Accessories & High-Tech Products Sénégal',
        email: siteSettings.email || 'contact@sentechplus.sn',
        phone: siteSettings.phone || '+221 77 000 00 00',
        address: siteSettings.address || 'Avenue Cheikh Anta Diop, Fann, Dakar, Sénégal',
        currencySymbol: siteSettings.currencySymbol || '$',
        bannerEnabled: siteSettings.banner?.enabled ?? true,
        bannerText: siteSettings.banner?.text ?? '',
        bannerButtonText: siteSettings.banner?.buttonText ?? '',
        bannerCouponCode: siteSettings.banner?.couponCode ?? '',
        heroTitle: siteSettings.hero?.title ?? '',
        heroSubtitle: siteSettings.hero?.subtitle ?? '',
        heroCtaText: siteSettings.hero?.ctaText ?? ''
    })

    const handleSave = (e) => {
        e.preventDefault()

        dispatch(updateSiteSettings({
            siteName: form.siteName,
            slogan: form.slogan,
            email: form.email,
            phone: form.phone,
            address: form.address,
            currencySymbol: form.currencySymbol
        }))

        dispatch(updateBannerSettings({
            enabled: form.bannerEnabled,
            text: form.bannerText,
            buttonText: form.bannerButtonText,
            couponCode: form.bannerCouponCode
        }))

        dispatch(updateHeroSettings({
            title: form.heroTitle,
            subtitle: form.heroSubtitle,
            ctaText: form.heroCtaText
        }))

        toast.success("Paramètres du site enregistrés avec succès !")
    }

    return (
        <div className="space-y-6 text-slate-800 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <SettingsIcon className="text-blue-600" /> Paramètres du Site & Marque
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Personnalisez le nom du site, la bannière promotionnelle, les coordonnées et la devise globale.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* 1. Informations Générales & Marque */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
                        <GlobeIcon size={18} className="text-blue-600" /> Identité du Site & Coordonnées
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Nom du Site / Marque</label>
                            <input
                                type="text"
                                value={form.siteName}
                                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Devise Globale</label>
                            <select
                                value={form.currencySymbol}
                                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="$">Dollar ($)</option>
                                <option value="€">Euro (€)</option>
                                <option value="CFA">Franc CFA (CFA)</option>
                                <option value="£">Livre (£)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Slogan de la marque</label>
                        <input
                            type="text"
                            value={form.slogan}
                            onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                            className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">E-mail Officiel</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Téléphone du Support</label>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Adresse du Siège</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* 2. Bannière Promotionnelle du Haut */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <MegaphoneIcon size={18} className="text-blue-600" /> Bannière d'Annonce Supérieure
                        </h3>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.bannerEnabled}
                                onChange={(e) => setForm({ ...form, bannerEnabled: e.target.checked })}
                                className="size-4 text-blue-600 rounded"
                            />
                            Bannière Activée
                        </label>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Texte d'Annonce</label>
                            <input
                                type="text"
                                value={form.bannerText}
                                onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Texte du Bouton</label>
                                <input
                                    type="text"
                                    value={form.bannerButtonText}
                                    onChange={(e) => setForm({ ...form, bannerButtonText: e.target.value })}
                                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Code Promo associé</label>
                                <input
                                    type="text"
                                    value={form.bannerCouponCode}
                                    onChange={(e) => setForm({ ...form, bannerCouponCode: e.target.value })}
                                    className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1 uppercase font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Section Héro d'Accueil */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
                        <LayoutIcon size={18} className="text-blue-600" /> Bannières & Héro de la Page d'Accueil
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Titre Principal Héro</label>
                            <input
                                type="text"
                                value={form.heroTitle}
                                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-700">Sous-titre Héro</label>
                            <textarea
                                rows={2}
                                value={form.heroSubtitle}
                                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                    >
                        <SaveIcon size={18} /> Enregistrer les Paramètres du Site
                    </button>
                </div>
            </form>
        </div>
    )
}
