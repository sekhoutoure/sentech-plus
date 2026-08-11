'use client'
import React, { useState } from 'react'
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react'
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
        toast.success('Bienvenue dans le Club SenTechPLUS ! 🎉')
        setEmail('')
    }

    return (
        <section aria-label="Newsletter" className="px-3 sm:px-6 my-4 max-w-[1280px] mx-auto w-full">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F3F8FF] p-4 sm:p-10 text-[#172033] border border-[#E1E8F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)]">

                {/* Inner White Card */}
                <div className="relative z-10 bg-white border border-[#E1E8F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)] rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto text-center space-y-3">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] border border-[#1677FF]/20 text-xs font-bold text-[#1677FF]">
                        <Sparkles size={13} className="text-[#1677FF]" />
                        <span>CLUB PRIVILÈGE SENTECHPLUS</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                        Recevez nos offres VIP & bons plans
                    </h2>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#667085] max-w-md mx-auto leading-relaxed font-normal">
                        Inscrivez-vous pour recevoir nos nouveautés et réductions VIP.
                    </p>

                    {/* Form or Success */}
                    {isSubscribed ? (
                        <div className="inline-flex items-center gap-2 bg-[#16C784]/10 text-[#16C784] px-4 py-3 rounded-xl border border-[#16C784]/30 text-xs font-bold">
                            <CheckCircle2 size={16} className="shrink-0" />
                            <span>Bienvenue ! Votre coupon VIP est activé 🎉</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-2 pt-2">
                            <div className="flex flex-col sm:flex-row items-center gap-2 bg-[#F7F9FC] p-1.5 rounded-xl border border-[#E1E8F0] focus-within:border-[#1677FF] focus-within:bg-white transition-all">
                                <div className="flex items-center gap-2 flex-1 pl-2 w-full">
                                    <Mail size={16} className="text-[#667085] shrink-0" />
                                    <input
                                        id="newsletter-email-input"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre adresse e-mail..."
                                        aria-label="Adresse email pour la newsletter"
                                        autoComplete="email"
                                        required
                                        className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#172033] placeholder:text-[#667085] font-normal py-1.5"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#1677FF] hover:bg-[#123B78] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer shrink-0"
                                >
                                    <span>S'inscrire →</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-[#667085] font-normal">
                                Pas de spam. Désinscription possible à tout moment.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Newsletter
