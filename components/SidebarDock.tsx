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
        <>
            {/* Desktop Left Dock (Shop.app inspired) */}
            <aside 
                aria-label="Navigation principale"
                className="hidden lg:flex flex-col items-center justify-between w-[76px] h-screen sticky top-0 left-0 bg-white border-r border-[#EBEBEB] py-5 px-2 z-50 shrink-0 select-none"
            >
                {/* Brand Icon Top */}
                <Link 
                    href="/" 
                    className="relative size-10 rounded-2xl flex items-center justify-center p-1 transition-transform hover:scale-110 active:scale-95"
                    title="SenTech Plus - Accueil"
                >
                    <Image 
                        src={assets.sentech_icon || assets.sentech_logo} 
                        alt="SenTech Plus" 
                        width={38} 
                        height={38} 
                        className="object-contain rounded-xl"
                        priority
                    />
                </Link>

                {/* Center Navigation Icons with Tooltips */}
                <nav className="flex flex-col items-center gap-3 w-full">
                    {navItems.map((item, idx) => {
                        const Icon = item.icon
                        const isActive = !item.isAction && pathname === item.href

                        if (item.isAction) {
                            return (
                                <div key={idx} className="relative group flex items-center justify-center">
                                    <button
                                        onClick={item.onClick}
                                        aria-label={item.label}
                                        className="relative p-3 rounded-2xl text-[#101828] hover:bg-[#F7F9FC] hover:text-[#1769FF] transition-all duration-200 cursor-pointer active:scale-90"
                                    >
                                        <Icon size={22} className="stroke-[2.2]" />
                                        {item.badge > 0 && (
                                            <span className="absolute top-1.5 right-1.5 size-4 bg-[#1769FF] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                    {/* Tooltip on Hover */}
                                    <span className="absolute left-[calc(100%+8px)] px-2.5 py-1 bg-[#071126] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md z-50">
                                        {item.label}
                                    </span>
                                </div>
                            )
                        }

                        return (
                            <div key={idx} className="relative group flex items-center justify-center">
                                <Link
                                    href={item.href || '/'}
                                    aria-label={item.label}
                                    className={`relative p-3 rounded-2xl transition-all duration-200 active:scale-90 ${
                                        isActive 
                                            ? 'bg-[#EAF3FF] text-[#1769FF] shadow-xs' 
                                            : 'text-[#667085] hover:bg-[#F7F9FC] hover:text-[#101828]'
                                    }`}
                                >
                                    <Icon size={22} className="stroke-[2.2]" />
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute top-1.5 right-1.5 size-4 bg-[#F04438] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                                {/* Tooltip */}
                                <span className="absolute left-[calc(100%+8px)] px-2.5 py-1 bg-[#071126] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md z-50">
                                    {item.label}
                                </span>
                            </div>
                        )
                    })}
                </nav>

                {/* Bottom User / Account Section */}
                <div className="relative group flex items-center justify-center">
                    {isLoggedIn && user ? (
                        <Link
                            href="/orders"
                            className="relative size-10 rounded-full overflow-hidden border-2 border-[#1769FF] hover:scale-105 transition"
                            title={user.name}
                        >
                            <Image
                                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                                alt="Profil"
                                fill
                                className="object-cover"
                            />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            aria-label="Se connecter"
                            className="p-3 rounded-2xl text-[#667085] hover:bg-[#F7F9FC] hover:text-[#1769FF] transition-all duration-200 active:scale-90"
                        >
                            <User size={22} className="stroke-[2.2]" />
                        </Link>
                    )}
                    <span className="absolute left-[calc(100%+8px)] px-2.5 py-1 bg-[#071126] text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md z-50">
                        {isLoggedIn ? 'Mon Compte' : 'Se connecter'}
                    </span>
                </div>
            </aside>

            {/* Mobile Bottom Dock (Shop.app style rounded-top bottom bar) */}
            <nav 
                aria-label="Barre de navigation mobile"
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#EBEBEB] px-2 py-1.5 pb-safe flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)] rounded-t-[24px]"
            >
                <Link
                    href="/"
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/' ? 'text-[#1769FF] font-black' : 'text-[#667085] hover:text-[#101828]'
                    }`}
                >
                    <Home size={20} className="stroke-[2.2]" />
                    <span className="text-[10px] leading-none">Accueil</span>
                </Link>

                <Link
                    href="/shop"
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/shop' ? 'text-[#1769FF] font-black' : 'text-[#667085] hover:text-[#101828]'
                    }`}
                >
                    <Grid size={20} className="stroke-[2.2]" />
                    <span className="text-[10px] leading-none">Explorer</span>
                </Link>

                {/* Cart Button */}
                <button
                    onClick={() => dispatch(openDrawer())}
                    className="relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl text-[#101828] active:scale-90 transition-all duration-200 cursor-pointer"
                    aria-label="Ouvrir le panier"
                >
                    <div className="relative">
                        <ShoppingCart size={20} className="stroke-[2.2]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 size-4 bg-[#1769FF] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold leading-none">Panier</span>
                </button>

                <Link
                    href="/wishlist"
                    className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/wishlist' ? 'text-[#F04438] font-black' : 'text-[#667085] hover:text-[#101828]'
                    }`}
                >
                    <div className="relative">
                        <Heart size={20} className="stroke-[2.2]" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 size-4 bg-[#F04438] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                                {wishlistCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] leading-none">Favoris</span>
                </Link>

                <Link
                    href={isLoggedIn ? "/orders" : "/login"}
                    className={`flex flex-col items-center justify-center gap-0.5 min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all duration-200 active:scale-90 ${
                        pathname === '/login' || pathname === '/orders' ? 'text-[#1769FF] font-black' : 'text-[#667085] hover:text-[#101828]'
                    }`}
                >
                    <User size={20} className="stroke-[2.2]" />
                    <span className="text-[10px] leading-none">{isLoggedIn ? "Compte" : "Connexion"}</span>
                </Link>
            </nav>
        </>
    )
}
