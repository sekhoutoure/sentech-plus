'use client'
import React from 'react'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
    const phoneNumber = '221770000000' // Dakar Senegal WhatsApp
    const message = encodeURIComponent('Bonjour SenTech Plus ! Je souhaite avoir des informations sur vos équipements High-Tech.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <aside aria-label="Support WhatsApp" className="fixed bottom-6 right-4 sm:right-6 z-40">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactez-nous sur WhatsApp"
                className="relative flex items-center gap-2.5 bg-[#12B76A] hover:bg-[#0EA25C] text-white px-4 py-3 rounded-full shadow-xl shadow-[#12B76A]/30 hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
            >
                <div className="relative">
                    <MessageCircle size={22} className="fill-white stroke-[#12B76A]" />
                    <span className="absolute -top-1 -right-1 size-2 bg-white rounded-full animate-ping" />
                </div>
                
                <div className="flex flex-col text-left pr-1">
                    <span className="text-[10px] text-emerald-100 font-medium leading-none">Besoin d'aide ?</span>
                    <span className="text-xs font-bold text-white leading-tight">WhatsApp 24/7</span>
                </div>
            </a>
        </aside>
    );
}
