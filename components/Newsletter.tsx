'use client'
import React, { useState } from 'react'
import { Mail, Sparkles, CheckCircle2, Gift, Tag, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const Newsletter: React.FC = () => {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !email.includes('@')) {
            toast.error('Veuillez saisir une adresse email valide.')
            return
        }
        setIsSubscribed(true)
        toast.success('Bienvenue dans le Club SenTech Plus ! 🎉')
        setEmail('')
    }

    const benefits = [
        { icon: Gift, label: "Offres exclusives" },
        { icon: Zap, label: "Avant-premières" },
        { icon: Tag, label: "Réductions VIP" },
    ]

    return (
        <section className="px-3 sm:px-6 my-4 sm:my-10 lg:my-14 max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#071426] p-3.5 sm:p-14 lg:p-16 text-white border border-[#0B2342] shadow-lg">

                {/* Ambient Glows */}
                <div className="absolute -top-40 -right-40 size-[300px] sm:size-[500px] bg-[#007BFF]/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 size-[250px] sm:size-[400px] bg-[#0088D8]/10 rounded-full blur-[70px] sm:blur-[100px] pointer-events-none" />

                {/* Inner Container */}
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-12 max-w-2xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-extrabold text-[#0088D8] mb-3">
                        <Sparkles size={11} className="text-[#007BFF]" />
                        <span>CLUB PRIVILÈGE SENTECH PLUS</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-4xl font-black text-white tracking-tight leading-snug mb-2">
                        Recevez nos offres VIP & bons plans
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed font-normal mb-4">
                        Inscrivez-vous gratuitement pour recevoir nos nouveautés et réductions VIP.
                    </p>

                    {/* Benefit Pills */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap mb-5">
                        {benefits.map(({ icon: Icon, label }, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] sm:text-[11px] font-bold text-slate-200">
                                <Icon size={11} className="text-[#007BFF]" />
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Form or Success */}
                    {isSubscribed ? (
                        <div className="inline-flex items-center gap-2 bg-[#16B364]/20 text-[#16B364] px-4 py-3 rounded-xl border border-[#16B364]/40 text-xs sm:text-sm font-bold">
                            <CheckCircle2 size={18} className="shrink-0" />
                            <span>Bienvenue ! Votre coupon est activé 🎉</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
                            <div className="flex flex-col xs:flex-row items-stretch gap-2 bg-white/10 backdrop-blur-xl p-1.5 rounded-xl border border-white/15 focus-within:border-[#007BFF]/60 transition-all">
                                <div className="flex items-center gap-2 flex-1 pl-2.5">
                                    <Mail size={16} className="text-slate-400 shrink-0" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre adresse email..."
                                        aria-label="Adresse email pour la newsletter"
                                        required
                                        className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-slate-400 font-medium py-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-1.5 bg-[#007BFF] hover:bg-[#0069D9] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg sm:rounded-xl shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                                >
                                    S'inscrire →
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-normal">
                                Pas de spam. Désinscription à tout moment.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Newsletter
