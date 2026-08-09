'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
    Home, 
    Grid, 
    ShoppingCart, 
    Tag, 
    Heart, 
    User, 
    LogOut,
    Store,
    ShieldCheck
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'
import { logout } from '@/lib/features/user/userSlice'
import { assets } from '@/assets/assets'
import toast from 'react-hot-toast'

export default function SidebarDock() {
    const pathname = usePathname()
    const dispatch = useDispatch()

    const cartCount = useSelector((state: any) => state.cart?.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    const handleLogout = () => {
        dispatch(logout())
        toast.success("Déconnexion réussie.")
    }

    const navItems = [
        { label: "Accueil", href: "/", icon: Home },
        { label: "Explorer", href: "/shop", icon: Grid },
        { 
            label: "Panier", 
            onClick: () => dispatch(openDrawer()), 
            icon: ShoppingCart, 
            badge: cartCount,
            isAction: true 
        },
        { label: "Offres", href: "/shop?search=Promo", icon: Tag },
        { 
            label: "Favoris", 
            href: "/wishlist", 
            icon: Heart, 
            badge: wishlistCount 
        },
    ]

    return (
        <nav 
            aria-label="Barre de navigation mobile"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#E8EDF3] px-2 py-1.5 pb-safe flex items-center justify-around shadow-[0_-4px_20px_rgba(20,40,70,0.06)] rounded-t-[24px]"
        >
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/' ? 'text-[#1677FF] font-black' : 'text-[#667085] hover:text-[#182230]'
                    }`}
                >
                    <Home size={20} className="stroke-[2.2]" />
                    <span className="text-[10px] leading-none">Accueil</span>
                </Link>

                <Link
                    href="/shop"
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/shop' ? 'text-[#1677FF] font-black' : 'text-[#667085] hover:text-[#182230]'
                    }`}
                >
                    <Grid size={20} className="stroke-[2.2]" />
                    <span className="text-[10px] leading-none">Explorer</span>
                </Link>

                {/* Cart Button */}
                <button
                    onClick={() => dispatch(openDrawer())}
                    className="relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl text-[#182230] active:scale-90 transition-all duration-200 cursor-pointer"
                    aria-label="Ouvrir le panier"
                >
                    <div className="relative">
                        <ShoppingCart size={20} className="stroke-[2.2]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 size-4 bg-[#1677FF] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-2xs">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold leading-none">Panier</span>
                </button>

                <Link
                    href="/wishlist"
                    className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/wishlist' ? 'text-[#FF6B35] font-black' : 'text-[#667085] hover:text-[#182230]'
                    }`}
                >
                    <div className="relative">
                        <Heart size={20} className="stroke-[2.2]" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 size-4 bg-[#FF6B35] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-2xs">
                                {wishlistCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] leading-none">Favoris</span>
                </Link>

                <Link
                    href={isLoggedIn ? "/orders" : "/login"}
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/login' || pathname === '/orders' ? 'text-[#1677FF] font-black' : 'text-[#667085] hover:text-[#182230]'
                    }`}
                >
                    <User size={20} className="stroke-[2.2]" />
                    <span className="text-[10px] leading-none">{isLoggedIn ? "Compte" : "Connexion"}</span>
                </Link>
            </nav>
    )
}
