'use client'
import React from 'react'
import { MessageCircleIcon } from 'lucide-react'

export default function WhatsAppButton() {
    const phoneNumber = '221770000000' // Dakar Senegal WhatsApp
    const message = encodeURIComponent('Bonjour SenTech Plus ! Je souhaite avoir des informations sur vos équipements High-Tech.')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <aside aria-label="Support WhatsApp" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discutez avec nous sur WhatsApp"
                className="relative flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white p-3 sm:p-3.5 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
                <div className="relative">
                    <MessageCircleIcon size={24} className="fill-white stroke-emerald-500" />
                    <span className="absolute -top-1 -right-1 size-2.5 bg-white rounded-full animate-ping" />
                </div>
                
                {/* Expandable Text on Desktop Hover */}
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pl-0 group-hover:pl-1">
                    WhatsApp 24/7
                </span>
            </a>
        </aside>
    )
}
