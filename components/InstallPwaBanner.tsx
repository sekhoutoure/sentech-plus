'use client'
import React, { useState, useEffect } from 'react'
import { Download, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react'

const InstallPwaBanner: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Vérifier si déjà installé ou déjà fermé par l'utilisateur
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        const isDismissed = localStorage.getItem('sentech_pwa_dismissed') === 'true'

        if (isStandalone) {
            setIsInstalled(true)
            return
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            if (!isDismissed) {
                setIsVisible(true)
            }
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setIsVisible(false)
            setIsInstalled(true)
        }
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem('sentech_pwa_dismissed', 'true')
    }

    if (!isVisible || isInstalled) return null

    return (
        <div className="bg-gradient-to-r from-[#1677FF] via-[#0F67E5] to-[#0B54C2] text-white py-2.5 px-3 sm:px-6 shadow-md border-b border-white/10 animate-in slide-in-from-top duration-300 relative z-40">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 text-xs">
                
                {/* Icône & Texte */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                        <Smartphone size={18} className="text-white" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
                        <span className="font-black tracking-tight text-xs sm:text-sm truncate flex items-center gap-1">
                            <span>Installez l'app SenTechPLUS</span>
                            <Sparkles size={12} className="text-amber-300 shrink-0" />
                        </span>
                        <span className="text-[10px] sm:text-xs text-white/85 font-medium truncate hidden md:inline">
                            Accès rapide 1-clic depuis votre écran d'accueil mobile
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleInstallClick}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#1677FF] font-extrabold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 rounded-full transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
                    >
                        <Download size={14} />
                        <span>Installer</span>
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="size-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Fermer l'invitation d'installation"
                    >
                        <X size={14} />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default InstallPwaBanner
