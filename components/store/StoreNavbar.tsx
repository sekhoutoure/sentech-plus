'use client'
import React from 'react'
import Link from 'next/link'
import Logo from '../Logo'
import { StoreIcon, LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function StoreNavbar() {
  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Logo />
        </Link>
        <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
          <StoreIcon size={14} /> Espace Vendeur
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <LogOutIcon size={15} /> Déconnexion
        </button>
      </div>
    </header>
  )
}
