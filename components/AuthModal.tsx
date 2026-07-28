'use client'
import React, { useState } from 'react'
import { XIcon, MailIcon, LockIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon, StoreIcon, ShoppingBagIcon, SparklesIcon, CheckCircle2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { login } from '@/lib/features/user/userSlice'

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UserRole = 'user' | 'seller' | 'admin'

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [selectedRole, setSelectedRole] = useState<UserRole>('user')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Dispatch Redux User State
            dispatch(login({
                name: formData.name || (selectedRole === 'admin' ? 'Administrateur SenTech' : selectedRole === 'seller' ? 'Boutique Officielle' : formData.email.split('@')[0]),
                email: formData.email,
                role: selectedRole,
            }))

            if (mode === 'login') {
                toast.success(`Connexion réussie ! Bienvenue dans votre espace ${selectedRole === 'admin' ? 'Administration' : selectedRole === 'seller' ? 'Vendeur' : 'Client'}.`)
            } else {
                toast.success("Compte créé avec succès ! Bienvenue sur SenTech Plus.")
            }

            onClose()

            // Redirect based on selected role
            if (selectedRole === 'admin') {
                router.push('/admin')
            } else if (selectedRole === 'seller') {
                router.push('/store')
            }
        } catch (err) {
            toast.error("Une erreur s'est produite lors de l'authentification.")
        } finally {
            setLoading(false)
        }
    }

    const handleQuickPreset = (role: UserRole) => {
        setSelectedRole(role)
        if (role === 'admin') {
            setFormData({
                name: 'Administrateur SenTech',
                email: 'contact@sentechplus.sn',
                password: '••••••••',
            })
            dispatch(login({ name: 'Administrateur SenTech', email: 'contact@sentechplus.sn', role: 'admin' }))
            toast.success("Espace Administration déverrouillé !")
            onClose()
            router.push('/admin')
        } else if (role === 'seller') {
            setFormData({
                name: 'SenTech Official Store',
                email: 'seller@sentechplus.sn',
                password: '••••••••',
            })
            dispatch(login({ name: 'SenTech Official Store', email: 'seller@sentechplus.sn', role: 'seller' }))
            toast.success("Espace Vendeur déverrouillé !")
            onClose()
            router.push('/store')
        } else {
            setFormData({
                name: 'Mamadou Diallo',
                email: 'client@sentechplus.sn',
                password: '••••••••',
            })
            dispatch(login({ name: 'Mamadou Diallo', email: 'client@sentechplus.sn', role: 'user' }))
            toast.success("Bienvenue dans votre espace Client !")
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop with Blur */}
            <div 
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200" 
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden transform transition-all border border-slate-200/80 z-10">
                    
                    {/* Glowing Decorative Background Gradient */}
                    <div className="absolute -top-24 -right-24 size-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 size-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        aria-label="Fermer la fenêtre de connexion"
                        className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100/80 transition cursor-pointer"
                    >
                        <XIcon size={20} />
                    </button>

                    {/* Header */}
                    <div className="text-center space-y-1.5 mb-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            <SparklesIcon size={13} /> SenTech Plus Authentification
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {mode === 'login' ? 'Connexion à votre espace' : 'Créer un nouveau compte'}
                        </h2>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            {mode === 'login' 
                                ? 'Connectez-vous pour gérer vos commandes, votre boutique ou l\'administration.' 
                                : 'Rejoignez la plateforme e-commerce High-Tech n°1 au Sénégal.'}
                        </p>
                    </div>

                    {/* Role Selector Tabs */}
                    <div className="mb-6">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                            Sélectionnez votre profil
                        </label>
                        <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('user')}
                                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition text-xs font-semibold cursor-pointer ${
                                    selectedRole === 'user'
                                        ? 'bg-white text-blue-600 shadow-md shadow-slate-200 border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                            >
                                <ShoppingBagIcon size={16} className="mb-1" />
                                <span>Acheteur</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedRole('seller')}
                                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition text-xs font-semibold cursor-pointer ${
                                    selectedRole === 'seller'
                                        ? 'bg-white text-blue-600 shadow-md shadow-slate-200 border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                            >
                                <StoreIcon size={16} className="mb-1" />
                                <span>Vendeur</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSelectedRole('admin')}
                                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition text-xs font-semibold cursor-pointer ${
                                    selectedRole === 'admin'
                                        ? 'bg-white text-blue-600 shadow-md shadow-slate-200 border border-slate-200/60'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                }`}
                            >
                                <ShieldCheckIcon size={16} className="mb-1" />
                                <span>Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Login / Register Toggle */}
                    <div className="flex bg-slate-100/70 p-1 rounded-xl mb-5 border border-slate-200/60">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            Se connecter
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            S'inscrire
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {mode === 'register' && (
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700">Nom complet</label>
                                <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition bg-slate-50/50">
                                    <UserIcon size={16} className="text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Mamadou Diallo"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full text-xs outline-none bg-transparent text-slate-800" 
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Adresse E-mail</label>
                            <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition bg-slate-50/50">
                                <MailIcon size={16} className="text-slate-400" />
                                <input 
                                    type="email" 
                                    placeholder="adresse@sentechplus.sn"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full text-xs outline-none bg-transparent text-slate-800" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
                                {mode === 'login' && (
                                    <a href="#" onClick={(e) => { e.preventDefault(); toast("Un e-mail de réinitialisation vous a été envoyé.") }} className="text-[11px] text-blue-600 hover:underline font-medium">Mot de passe oublié ?</a>
                                )}
                            </div>
                            <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition bg-slate-50/50">
                                <LockIcon size={16} className="text-slate-400" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full text-xs outline-none bg-transparent text-slate-800" 
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-3 cursor-pointer active:scale-98 disabled:opacity-50"
                        >
                            <span>{loading ? 'Chargement...' : mode === 'login' ? `Connexion Espace ${selectedRole === 'admin' ? 'Admin' : selectedRole === 'seller' ? 'Vendeur' : 'Acheteur'}` : 'Créer mon compte'}</span>
                            <ArrowRightIcon size={15} />
                        </button>
                    </form>

                    {/* Quick Preset Accounts (1-Click Test Access) */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2">
                            Accès rapide démonstration :
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickPreset('user')}
                                className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 rounded-xl text-[11px] font-semibold transition cursor-pointer"
                            >
                                <ShoppingBagIcon size={13} /> Client
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickPreset('seller')}
                                className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 rounded-xl text-[11px] font-semibold transition cursor-pointer"
                            >
                                <StoreIcon size={13} /> Vendeur
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickPreset('admin')}
                                className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 rounded-xl text-[11px] font-semibold transition cursor-pointer"
                            >
                                <ShieldCheckIcon size={13} /> Admin
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthModal
