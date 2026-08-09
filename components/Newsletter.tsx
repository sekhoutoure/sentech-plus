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
        <section className="px-4 sm:px-6 my-16 sm:my-24 max-w-[1400px] mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-[#071126] p-8 sm:p-14 lg:p-16 text-white border border-slate-800/80 shadow-2xl">

                {/* Ambient Background Glows */}
                <div className="absolute -top-40 -right-40 size-[500px] bg-[#1769FF]/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 size-[400px] bg-purple-700/15 rounded-full blur-[100px] pointer-events-none" />

                {/* Inner Glassmorphism Container */}
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-extrabold text-cyan-300 shadow-inner mb-5">
                        <Sparkles size={12} className="text-cyan-400" />
                        <span>CLUB PRIVILÈGE SENTECH PLUS</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3" style={{ textWrap: 'balance' } as React.CSSProperties}>
                        Recevez nos offres VIP & bons plans
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed font-normal mb-6" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                        Inscrivez-vous gratuitement pour recevoir nos nouveautés, promotions exclusives et bons plans en avant-première.
                    </p>

                    {/* Benefit Pills */}
                    <div className="flex items-center justify-center gap-2.5 flex-wrap mb-7">
                        {benefits.map(({ icon: Icon, label }, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold text-slate-200">
                                <Icon size={12} className="text-cyan-400" />
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Form or Success */}
                    {isSubscribed ? (
                        <div className="inline-flex items-center gap-2.5 bg-[#12B76A]/20 text-emerald-300 px-6 py-4 rounded-2xl border border-[#12B76A]/40 text-sm font-bold">
                            <CheckCircle2 size={20} className="shrink-0" />
                            <span>Merci ! Votre coupon de bienvenue est en route 🎉</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/15 focus-within:border-[#1769FF]/60 focus-within:ring-2 focus-within:ring-[#1769FF]/30 transition-all">
                                <div className="flex items-center gap-2.5 flex-1 pl-3">
                                    <Mail size={17} className="text-slate-400 shrink-0" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre adresse email..."
                                        aria-label="Adresse email pour la newsletter"
                                        required
                                        className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-400 font-medium py-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-[#1769FF]/30 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                                >
                                    S'inscrire →
                                </button>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-3 font-normal">
                                Pas de spam. Désinscription à tout moment. Promis.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Newsletter
