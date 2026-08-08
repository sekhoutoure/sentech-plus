'use client'
import React, { useState } from 'react'
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
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
        toast.success('Félicitations ! Vous êtes inscrit aux offres exclusives SenTech Plus.')
        setEmail('')
    }

    return (
        <section className='px-4 sm:px-6 my-16 sm:my-24 max-w-[1400px] mx-auto'>
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071126] via-[#0B1E40] to-[#071126] p-8 sm:p-14 lg:p-16 text-white border border-slate-800 shadow-2xl'>
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1769FF]/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1769FF]/15 rounded-full blur-[90px] pointer-events-none" />
                
                <div className='relative z-10 max-w-2xl mx-auto text-center space-y-4'>
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-cyan-300 shadow-sm">
                        <Sparkles size={13} className="text-cyan-400" />
                        <span>CLUB PRIVILÈGE SENTECH PLUS</span>
                    </div>

                    {/* Title */}
                    <h2 className='text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-tight'>
                        Recevez nos offres VIP & bons plans
                    </h2>

                    {/* Description */}
                    <p className='text-xs sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed font-normal'>
                        Inscrivez-vous gratuitement pour recevoir nos nouveautés, promotions et offres exclusives en avant-première.
                    </p>

                    {/* Subscription Form */}
                    {isSubscribed ? (
                        <div className="inline-flex items-center gap-2 bg-[#12B76A]/20 text-emerald-300 px-6 py-3.5 rounded-full border border-[#12B76A]/40 text-sm font-bold animate-in zoom-in-95">
                            <CheckCircle2 size={18} />
                            <span>Merci ! Votre coupon de bienvenue a été envoyé par email.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='pt-4 max-w-lg mx-auto'>
                            <div className='flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-xl p-2 rounded-2xl sm:rounded-full border border-white/20 focus-within:border-[#1769FF] focus-within:ring-2 focus-within:ring-[#1769FF]/30 transition-all shadow-lg'>
                                <div className="flex items-center gap-2.5 flex-1 px-3 w-full sm:w-auto">
                                    <Mail size={18} className="text-slate-400 shrink-0" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Entrez votre adresse email..."
                                        aria-label="Adresse email"
                                        required
                                        className="w-full bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-slate-400 font-medium py-1"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl sm:rounded-full shadow-md shadow-[#1769FF]/30 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                                >
                                    <span>S'inscrire →</span>
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-[11px] text-slate-400 pt-2 font-normal">
                        Pas de spam. Désinscription à tout moment.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
