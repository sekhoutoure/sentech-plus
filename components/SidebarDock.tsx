'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    Home, 
    Grid, 
    ShoppingCart, 
    Heart, 
    User
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'

export default function SidebarDock() {
    const pathname = usePathname()
    const dispatch = useDispatch()

    const cartCount = useSelector((state: any) => state.cart?.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn } = useSelector((state: any) => state.user || { isLoggedIn: false })

    return (
        <nav 
            aria-label="Barre de navigation mobile"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E1E8F0] px-2 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] flex items-center justify-around shadow-[0_-4px_20px_rgba(23,32,51,0.06)] h-[68px]"
        >
            {/* Accueil */}
            <Link
                href="/"
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                    pathname === '/' ? 'text-[#1677FF] font-bold' : 'text-[#667085] hover:text-[#172033]'
                }`}
            >
                <Home size={20} className="stroke-[2]" />
                <span className="text-[10px] leading-none font-medium">Accueil</span>
            </Link>

            {/* Explorer */}
            <Link
                href="/shop"
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                    pathname === '/shop' ? 'text-[#1677FF] font-bold' : 'text-[#667085] hover:text-[#172033]'
                }`}
            >
                <Grid size={20} className="stroke-[2]" />
                <span className="text-[10px] leading-none font-medium">Explorer</span>
            </Link>

            {/* Panier */}
            <button
                onClick={() => dispatch(openDrawer())}
                className="relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl text-[#667085] active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Ouvrir le panier"
            >
                <div className="relative">
                    <ShoppingCart size={20} className="stroke-[2]" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 size-4 bg-[#1677FF] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-2xs">
                            {cartCount}
                        </span>
                    )}
                </div>
                <span className="text-[10px] leading-none font-medium">Panier</span>
            </button>

            {/* Favoris */}
            <Link
                href="/wishlist"
                className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                    pathname === '/wishlist' ? 'text-[#1677FF] font-bold' : 'text-[#667085] hover:text-[#172033]'
                }`}
            >
                <div className="relative">
                    <Heart size={20} className="stroke-[2]" />
                    {wishlistCount > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 size-4 bg-[#F97316] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-2xs">
                            {wishlistCount}
                        </span>
                    )}
                </div>
                <span className="text-[10px] leading-none font-medium">Favoris</span>
            </Link>

            {/* Compte */}
            <Link
                href={isLoggedIn ? "/orders" : "/login"}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                    pathname === '/login' || pathname === '/orders' ? 'text-[#1677FF] font-bold' : 'text-[#667085] hover:text-[#172033]'
                }`}
            >
                <User size={20} className="stroke-[2]" />
                <span className="text-[10px] leading-none font-medium">{isLoggedIn ? "Compte" : "Connexion"}</span>
            </Link>
        </nav>
    )
}
