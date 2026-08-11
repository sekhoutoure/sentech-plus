'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { XIcon, MailIcon, LockIcon, UserIcon, ArrowRightIcon, ShieldCheckIcon, StoreIcon, ShoppingBagIcon, SparklesIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/stores'

import { registerSchema, loginSchema } from '@/lib/validations'

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UserRole = 'user' | 'seller' | 'admin'

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const router = useRouter()
    const loginUser = useUserStore(s => s.login)
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
            // Client-Side Zod Validation
            const schema = mode === 'register' ? registerSchema : loginSchema
            const payload = mode === 'register' 
                ? { name: formData.name, email: formData.email, password: formData.password, role: selectedRole }
                : { email: formData.email, password: formData.password }

            const validation = schema.safeParse(payload)
            if (!validation.success) {
                const firstError = validation.error.issues[0]?.message || 'Veuillez vérifier les champs du formulaire.'
                toast.error(firstError)
                setLoading(false)
                return
            }


            const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                toast.error(data.message || "Échec de l'authentification.")
                return
            }

            if (data.data) {
                loginUser(data.data)
            }
            toast.success(data.message || "Authentification réussie !")
            onClose()

            // Redirect based on validated user role
            if (data.data?.role === 'admin' || selectedRole === 'admin') {
                router.push('/admin')
            } else if (data.data?.role === 'seller' || selectedRole === 'seller') {
                router.push('/store')
            } else {
                router.push('/user')
            }
            router.refresh()
        } catch (err) {
            toast.error("Erreur de connexion au serveur d'authentification.")
        } finally {
            setLoading(false)
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
                                ? 'Saisissez vos identifiants pour accéder à votre profil.' 
                                : 'Inscrivez-vous pour commander ou gérer votre boutique sur SenTech Plus.'}
                        </p>
                    </div>

                    {/* Role Selector Tabs */}
                    <div className="mb-6">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
                            Type de profil
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
                                <label className="text-xs font-semibold text-slate-700">Nom et Prénom</label>
                                <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition bg-slate-50/50">
                                    <UserIcon size={16} className="text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Mamadou Diallo"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full text-xs outline-none bg-transparent text-slate-800" 
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Adresse E-mail professionnelle</label>
                            <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition bg-slate-50/50">
                                <MailIcon size={16} className="text-slate-400" />
                                <input 
                                    type="email" 
                                    placeholder="Ex: m.diallo@exemple.sn"
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
                                    <a href="#" onClick={(e) => { e.preventDefault(); toast("Un lien sécurisé de réinitialisation vous a été envoyé par email.") }} className="text-[11px] text-blue-600 hover:underline font-medium">Mot de passe oublié ?</a>
                                )}
                            </div>
                            <div className="flex items-center gap-2.5 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition bg-slate-50/50">
                                <LockIcon size={16} className="text-slate-400" />
                                <input 
                                    type="password" 
                                    placeholder="Mot de passe sécurisé"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full text-xs outline-none bg-transparent text-slate-800" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-center pt-2">
                          <Link 
                            href={mode === 'login' ? '/auth/login' : '/auth/register'} 
                            onClick={onClose}
                            className="text-xs text-indigo-600 font-semibold hover:underline"
                          >
                            Ouvrir sur une page dédiée →
                          </Link>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-98 disabled:opacity-50"
                        >
                            <span>{loading ? 'Authentification en cours...' : mode === 'login' ? `Se connecter (${selectedRole === 'admin' ? 'Admin' : selectedRole === 'seller' ? 'Vendeur' : 'Acheteur'})` : 'Créer mon compte'}</span>
                            <ArrowRightIcon size={15} />
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default AuthModal
