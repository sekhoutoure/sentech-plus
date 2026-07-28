'use client'
import React from 'react'
import Image from 'next/image'
import { StoreIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react'

interface StoreInfoProps {
  store: {
    id: string
    name: string
    username: string
    email?: string
    contact?: string
    address?: string
    description?: string
    status?: string
    logo?: string
  }
}

export default function StoreInfo({ store }: StoreInfoProps) {
  const statusBadge = () => {
    switch (store.status) {
      case 'approved':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">Approuvée</span>
      case 'pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md">En attente</span>
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-md">Refusée</span>
      default:
        return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{store.status}</span>
    }
  }

  return (
    <div className="flex items-start gap-4">
      {store.logo ? (
        <Image
          src={store.logo}
          alt={store.name}
          width={64}
          height={64}
          className="size-16 rounded-xl object-cover border border-slate-200"
        />
      ) : (
        <div className="size-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
          <StoreIcon size={28} />
        </div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 text-base">{store.name}</h3>
          {statusBadge()}
        </div>
        <p className="text-xs text-slate-400">@{store.username}</p>

        {store.description && (
          <p className="text-xs text-slate-600 mt-1 max-w-md line-clamp-2">{store.description}</p>
        )}

        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 mt-2">
          {store.email && (
            <span className="flex items-center gap-1">
              <MailIcon size={12} className="text-slate-400" /> {store.email}
            </span>
          )}
          {store.contact && (
            <span className="flex items-center gap-1">
              <PhoneIcon size={12} className="text-slate-400" /> {store.contact}
            </span>
          )}
          {store.address && (
            <span className="flex items-center gap-1">
              <MapPinIcon size={12} className="text-slate-400" /> {store.address}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
