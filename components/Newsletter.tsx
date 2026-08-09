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
        <section className="px-1.5 sm:px-6 my-3 sm:my-10 lg:my-14 max-w-[1400px] mx-auto w-full">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#F1F7FF] via-white to-[#F8FBFF] p-3.5 sm:p-14 lg:p-16 text-[#182230] border border-[#E8EDF3] shadow-xs">

                {/* Subtle Ambient Glows */}
                <div className="absolute -top-40 -right-40 size-[300px] sm:size-[500px] bg-[#1677FF]/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 size-[250px] sm:size-[400px] bg-[#EAF3FF] rounded-full blur-[70px] sm:blur-[100px] pointer-events-none" />

                {/* Inner White Card */}
                <div className="relative z-10 bg-white border border-[#E8EDF3] shadow-[0_4px_20px_rgba(20,40,70,0.06)] rounded-2xl sm:rounded-3xl p-5 sm:p-12 max-w-2xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] border border-[#1677FF]/20 text-[10px] sm:text-xs font-extrabold text-[#1677FF] mb-3">
                        <Sparkles size={11} className="text-[#1677FF]" />
                        <span>CLUB PRIVILÈGE SENTECHPLUS</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-4xl font-black text-[#182230] tracking-tight leading-snug mb-2">
                        Recevez nos offres VIP & bons plans
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-base text-[#667085] max-w-md mx-auto leading-relaxed font-normal mb-4">
                        Inscrivez-vous gratuitement pour recevoir nos nouveautés et réductions VIP.
                    </p>

                    {/* Benefit Pills */}
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap mb-5">
                        {benefits.map(({ icon: Icon, label }, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F7FA] border border-[#E8EDF3] text-[10px] sm:text-[11px] font-bold text-[#182230]">
                                <Icon size={11} className="text-[#1677FF]" />
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Form or Success */}
                    {isSubscribed ? (
                        <div className="inline-flex items-center gap-2 bg-[#16B979]/10 text-[#16B979] px-4 py-3 rounded-xl border border-[#16B979]/30 text-xs sm:text-sm font-bold">
                            <CheckCircle2 size={18} className="shrink-0" />
                            <span>Bienvenue ! Votre coupon est activé 🎉</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2">
                            <div className="flex flex-col xs:flex-row items-stretch gap-2 bg-[#F7F9FC] p-1.5 rounded-xl border border-[#E8EDF3] focus-within:border-[#1677FF] focus-within:bg-white transition-all">
                                <div className="flex items-center gap-2 flex-1 pl-2.5">
                                    <Mail size={16} className="text-[#667085] shrink-0" />
                                    <input
                                        id="newsletter-email-input"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre adresse email..."
                                        aria-label="Adresse email pour la newsletter"
                                        required
                                        className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#182230] placeholder:text-[#667085] font-medium py-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-1.5 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg sm:rounded-xl shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                                >
                                    S'inscrire →
                                </button>
                            </div>
                            <p className="text-[10px] text-[#667085] font-normal">
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
