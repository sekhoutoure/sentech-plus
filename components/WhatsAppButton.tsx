'use client'
import React from 'react'
import { MessageCircleIcon } from 'lucide-react'

export default function WhatsAppButton() {
    const phoneNumber = '221770000000' // Dakar Senegal WhatsApp
    const message = encodeURIComponent('Bonjour SenTech Plus ! Je souhaite avoir des informations sur vos accessoires High-Tech.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactez-nous sur WhatsApp"
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group"
        >
            <div className="relative">
                <MessageCircleIcon size={20} className="fill-white stroke-emerald-500" />
                <span className="absolute -top-1 -right-1 size-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span className="hidden sm:inline font-semibold">Besoin d'aide ? Chat WhatsApp</span>
        </a>
    )
}
