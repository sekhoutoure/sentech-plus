'use client'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, PackageIcon, ShieldCheckIcon, StoreIcon, SaveIcon, SparklesIcon, LogOutIcon, HeartIcon } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { logout } from '@/lib/features/user/userSlice'
import { useRouter } from 'next/navigation'
import JsonLd from '@/components/seo/JsonLd'
import { getBreadcrumbSchema } from '@/lib/seo'

export default function ProfilePage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { user } = useSelector((state: any) => state.user || {})
    const wishlist = useSelector((state: any) => state.wishlist?.items || [])

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '+221 77 000 00 00',
        address: user?.address || 'Dakar, Sénégal'
    })

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '+221 77 000 00 00',
                address: user.address || 'Dakar, Sénégal'
            })
        }
    }, [user])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Profil mis à jour avec succès !")
    }

    const handleLogout = () => {
        dispatch(logout())
        toast.success("Déconnexion réussie.")
        router.push('/')
    }

    const breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Mon Profil', url: '/profile' }
    ]

    return (
        <div className="mx-6 min-h-[80vh] my-16 text-slate-800">
            <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
            <div className="max-w-5xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
                            <SparklesIcon size={14} /> Espace Membre SenTech Plus
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Mon Profil & Espace Client
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Gérez vos informations personnelles, consultez l'historique de vos commandes et vos favoris.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-red-200 transition cursor-pointer self-start sm:self-auto"
                    >
                        <LogOutIcon size={15} /> Se déconnecter
                    </button>
                </div>

                {/* Profile Card & Role Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Sidebar Info Card */}
                    <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3.5">
                                <div className="size-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-600/20">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">{user?.name || 'Membre SenTech'}</h3>
                                    <p className="text-xs text-slate-500 truncate max-w-[160px]">{user?.email}</p>
                                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                        Rôle : {user?.role === 'admin' ? 'Administrateur' : user?.role === 'seller' ? 'Vendeur' : 'Client VIP'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <Link href="/orders" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-700">
                                    <span className="flex items-center gap-2"><PackageIcon size={16} className="text-blue-600" /> Mes Commandes</span>
                                    <span className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-full">Voir</span>
                                </Link>

                                <Link href="/wishlist" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition text-xs font-semibold text-slate-700">
                                    <span className="flex items-center gap-2"><HeartIcon size={16} className="text-red-500" /> Mes Favoris</span>
                                    <span className="bg-red-50 text-red-600 text-[11px] px-2 py-0.5 rounded-full font-bold">{wishlist.length}</span>
                                </Link>

                                {user?.role === 'seller' && (
                                    <Link href="/store" className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 text-blue-700 transition text-xs font-semibold border border-blue-200">
                                        <span className="flex items-center gap-2"><StoreIcon size={16} /> Dashboard Vendeur</span>
                                        <span className="text-[10px] font-bold uppercase">Accéder</span>
                                    </Link>
                                )}

                                {user?.role === 'admin' && (
                                    <Link href="/admin" className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 text-purple-800 transition text-xs font-semibold border border-purple-200">
                                        <span className="flex items-center gap-2"><ShieldCheckIcon size={16} /> Dashboard Admin</span>
                                        <span className="text-[10px] font-bold uppercase">Accéder</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                            Compte membre sécurisé par SenTech Plus SSL.
                        </div>
                    </div>

                    {/* Right Form Component */}
                    <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Informations Personnelles
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <UserIcon size={14} className="text-slate-400" /> Nom complet *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={form.name} 
                                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                                        className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50/50" 
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <MailIcon size={14} className="text-slate-400" /> Adresse E-mail *
                                    </label>
                                    <input 
                                        type="email" 
                                        value={form.email} 
                                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                                        className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50/50" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <PhoneIcon size={14} className="text-blue-600" /> Téléphone Sénégal *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={form.phone} 
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                                        className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50/50 font-medium" 
                                        required 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                        <MapPinIcon size={14} className="text-blue-600" /> Adresse de livraison par défaut
                                    </label>
                                    <input 
                                        type="text" 
                                        value={form.address} 
                                        onChange={(e) => setForm({ ...form, address: e.target.value })} 
                                        className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 bg-slate-50/50" 
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                                >
                                    <SaveIcon size={16} /> Enregistrer les modifications
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
