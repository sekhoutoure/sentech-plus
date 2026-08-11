'use client'
import React from 'react'

export default function WhatsAppButton() {
    const phoneNumber = '221770000000'
    const message = encodeURIComponent('Bonjour SenTech Plus ! Je souhaite avoir des informations sur vos équipements High-Tech.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <aside 
            aria-label="Support WhatsApp" 
            className="fixed bottom-[88px] lg:bottom-6 right-3.5 sm:right-6 z-30 group"
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactez-nous sur WhatsApp"
                className="relative flex items-center justify-center bg-[#25D366] hover:bg-[#1EBD58] text-white rounded-full shadow-lg shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer
                    size-[48px] sm:size-auto p-0 sm:pl-3 sm:pr-4 sm:py-2.5"
            >
                {/* WhatsApp Icon */}
                <div className="size-full sm:size-7 rounded-full bg-white/20 sm:bg-transparent flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 32 32" className="size-6 sm:size-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.002 2C8.28 2 2 8.28 2 16.002c0 2.482.672 4.81 1.844 6.812L2 30l7.394-1.816A13.934 13.934 0 0016.002 30C23.72 30 30 23.72 30 16.002 30 8.28 23.72 2 16.002 2zm0 25.324a11.27 11.27 0 01-5.744-1.574l-.41-.244-4.39 1.078 1.108-4.28-.268-.44a11.278 11.278 0 01-1.722-6.012c0-6.254 5.09-11.342 11.342-11.342 6.254 0 11.342 5.088 11.342 11.342 0 6.254-5.09 11.342-11.342 11.342h-.116zm6.22-8.49c-.34-.17-2.014-1.002-2.328-1.118-.314-.114-.542-.17-.77.17-.228.34-.882 1.118-1.082 1.346-.2.228-.4.256-.74.086-.34-.17-1.436-.53-2.736-1.69-1.012-.902-1.694-2.016-1.894-2.356-.2-.34-.022-.524.15-.694.156-.152.34-.398.51-.598.17-.2.228-.34.342-.568.114-.228.058-.428-.028-.598-.086-.17-.77-1.862-1.056-2.55-.278-.668-.56-.578-.77-.588h-.656c-.228 0-.598.086-.912.428-.314.342-1.2 1.172-1.2 2.856s1.228 3.31 1.398 3.54c.17.228 2.418 3.69 5.858 5.18.818.354 1.456.566 1.954.724.82.262 1.568.226 2.158.138.658-.1 2.014-.824 2.3-1.62.284-.798.284-1.482.2-1.624-.086-.142-.314-.228-.654-.4z" />
                    </svg>
                </div>

                {/* Text (Desktop only) */}
                <div className="hidden sm:flex flex-col text-left ml-2">
                    <span className="text-[9px] text-green-100 font-semibold leading-none">Besoin d'aide ?</span>
                    <span className="text-xs font-extrabold text-white leading-tight">WhatsApp 24/7</span>
                </div>
            </a>
        </aside>
    )
}
