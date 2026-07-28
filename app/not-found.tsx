'use client'
import Link from 'next/link'
import { ArrowLeftIcon, HomeIcon } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="size-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-6 shadow-2xl">
                <span className="text-4xl font-extrabold">404</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
                Page Introuvable
            </h1>
            
            <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center">
                <Link 
                    href="/" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
                >
                    <HomeIcon size={18} />
                    Retour à l'accueil
                </Link>
                <button 
                    onClick={() => window.history.back()} 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition active:scale-95 cursor-pointer"
                >
                    <ArrowLeftIcon size={18} />
                    Page précédente
                </button>
            </div>
        </div>
    )
}
