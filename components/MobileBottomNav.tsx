'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react'
import { openDrawer } from '@/lib/features/cart/cartSlice'

export default function MobileBottomNav() {
    const pathname = usePathname()
    const dispatch = useDispatch()

    const cartCount = useSelector((state: any) => state.cart.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    const navItems = [
        {
            label: 'Accueil',
            href: '/',
            icon: Home,
            isActive: pathname === '/',
        },
        {
            label: 'Boutique',
            href: '/shop',
            icon: ShoppingBag,
            isActive: pathname.startsWith('/shop'),
        },
        {
            label: 'Favoris',
            href: '/wishlist',
            icon: Heart,
            badge: wishlistCount,
            isActive: pathname === '/wishlist',
        },
        {
            label: 'Panier',
            onClick: () => dispatch(openDrawer()),
            icon: ShoppingCart,
            badge: cartCount,
            isActive: false,
        },
        {
            label: isLoggedIn ? (user?.name?.split(' ')[0] || 'Profil') : 'Compte',
            href: isLoggedIn ? (user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/store' : '/profile') : '/login',
            icon: User,
            isActive: pathname === '/profile' || pathname === '/login' || pathname.startsWith('/admin') || pathname.startsWith('/store'),
        },
    ]

    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <nav className="flex items-center justify-around px-2 max-w-md mx-auto">
                {navItems.map((item, index) => {
                    const IconComponent = item.icon
                    const isTabActive = item.isActive

                    const content = (
                        <div className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                            isTabActive 
                                ? 'text-blue-600 dark:text-cyan-400 font-extrabold' 
                                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white'
                        }`}>
                            <div className="relative">
                                <IconComponent 
                                    size={20} 
                                    className={`transition-transform duration-200 ${isTabActive ? 'scale-110' : ''}`} 
                                    strokeWidth={isTabActive ? 2.5 : 2}
                                />
                                {item.badge && item.badge > 0 ? (
                                    <span className="absolute -top-1.5 -right-2 size-4.5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pulse">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className="text-[10px] tracking-tight mt-0.5">
                                {item.label}
                            </span>
                            {isTabActive && (
                                <span className="absolute -bottom-1 size-1 bg-blue-600 dark:bg-cyan-400 rounded-full" />
                            )}
                        </div>
                    )

                    if (item.onClick) {
                        return (
                            <button
                                key={index}
                                onClick={item.onClick}
                                type="button"
                                aria-label={item.label}
                                className="focus:outline-none active:scale-90 transition-transform"
                            >
                                {content}
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href!}
                            aria-label={item.label}
                            className="focus:outline-none active:scale-90 transition-transform"
                        >
                            {content}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
