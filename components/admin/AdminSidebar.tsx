'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboardIcon,
  CheckCircleIcon,
  StoreIcon,
  PackageIcon,
  ShoppingBagIcon,
  TicketIcon,
  SettingsIcon,
} from 'lucide-react'

const navItems = [
  { label: 'Vue générale', href: '/admin', icon: LayoutDashboardIcon },
  { label: 'Approbations', href: '/admin/approve', icon: CheckCircleIcon },
  { label: 'Boutiques', href: '/admin/stores', icon: StoreIcon },
  { label: 'Produits', href: '/admin/products', icon: PackageIcon },
  { label: 'Commandes', href: '/admin/orders', icon: ShoppingBagIcon },
  { label: 'Coupons', href: '/admin/coupons', icon: TicketIcon },
  { label: 'Paramètres', href: '/admin/settings', icon: SettingsIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-1 shrink-0">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Administration
      </div>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </aside>
  )
}
