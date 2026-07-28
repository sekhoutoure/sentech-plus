'use client'
import React, { useState } from 'react'
import { XIcon, MailIcon, LockIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon, StoreIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { useDispatch } from 'react-redux'
import { login, setUserRole } from '@/lib/features/user/userSlice'

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [mode, setMode] = useState<'login' | 'register'>('login') // 'login' | 'register'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    })

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch(login({
            name: formData.name || formData.email.split('@')[0],
            email: formData.email,
            role: formData.role
        }))
        if (mode === 'login') {
            toast.success("Connexion réussie ! Bienvenue sur SenTech Plus.")
        } else {
            toast.success("Compte créé avec succès ! Bienvenue.")
        }
        onClose()
    }

    const handleDemoAdmin = () => {
        dispatch(login({
            name: 'Administrateur SenTech',
            email: 'admin@sentechplus.com',
            role: 'admin'
        }))
        toast.success("Connecté en tant qu'Administrateur")
        onClose()
        router.push('/admin')
    }

    const handleDemoSeller = () => {
        dispatch(login({
            name: 'Boutique Offcielle Vendeur',
            email: 'vendeur@sentechplus.com',
            role: 'seller'
        }))
        toast.success("Connecté en tant que Vendeur")
        onClose()
        router.push('/store')
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            />

            {/* Modal Box */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 overflow-hidden transform transition-all border border-slate-100 z-10">
                    
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        aria-label="Fermer"
                        className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2.5 sm:p-2.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
                    >
                        <XIcon size={24} className="sm:w-5 sm:h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                            <UserIcon size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {mode === 'login' 
                                ? 'Accédez à votre espace membre SenTech Plus' 
                                : 'Rejoignez la communauté SenTech Plus dès aujourd’hui'}
                        </p>
                    </div>

                    {/* Mode Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl my-6 border border-slate-200/60">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            Se connecter
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            S'inscrire
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-700">Nom complet</label>
                                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 transition">
                                    <UserIcon size={16} className="text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Jean Dupont"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full text-base sm:text-xs outline-none bg-transparent" 
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700">Adresse E-mail</label>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 transition">
                                <MailIcon size={16} className="text-slate-400" />
                                <input 
                                    type="email" 
                                    placeholder="exemple@sentech.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full text-base sm:text-xs outline-none bg-transparent" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-slate-700">Mot de passe</label>
                                {mode === 'login' && (
                                    <a href="#" onClick={(e) => { e.preventDefault(); toast("Un e-mail de réinitialisation a été envoyé.") }} className="text-[11px] text-blue-600 hover:underline">Mot de passe oublié ?</a>
                                )}
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 transition">
                                <LockIcon size={16} className="text-slate-400" />
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full text-base sm:text-xs outline-none bg-transparent" 
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                        >
                            {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                            <ArrowRightIcon size={16} />
                        </button>
                    </form>

                    {/* Quick Demo Access Bar */}
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-[11px] text-center text-slate-400 mb-2 font-medium">Démo Accès Rapide :</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleDemoSeller}
                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-xl text-[11px] font-medium transition cursor-pointer"
                            >
                                <StoreIcon size={13} /> Espace Vendeur
                            </button>
                            <button
                                onClick={handleDemoAdmin}
                                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-medium transition cursor-pointer"
                            >
                                <ShieldCheckIcon size={13} /> Espace Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthModal
