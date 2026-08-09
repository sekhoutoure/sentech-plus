'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState } from 'react'
import { 
    Search, 
    ShoppingCart, 
    Heart, 
    User, 
    Menu, 
    X, 
    LogOut, 
    Package, 
    Store, 
    ShieldCheck
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'
import { logout } from '@/lib/features/user/userSlice'
import toast from 'react-hot-toast'
import Logo from './Logo'

const Navbar: React.FC = () => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const cartCount = useSelector((state: any) => state.cart?.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        setIsMobileMenuOpen(false)
        toast.success("Déconnexion réussie.")
        router.push('/')
    }

    return (
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBEBEB] py-3 px-4 shadow-2xs">
            <div className="flex items-center justify-between gap-3">

                {/* Mobile Logo */}
                <Link href="/" className="flex items-center group transition-transform active:scale-95 shrink-0">
                    <Logo className="h-8 w-auto" />
                </Link>

                {/* Mobile Action Icons Right */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link
                        href="/wishlist"
                        className="relative p-2 rounded-full text-[#667085] hover:text-[#F04438] active:scale-90 transition"
                        aria-label="Favoris"
                    >
                        <Heart size={20} />
                        {wishlistCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 bg-[#F04438] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => dispatch(openDrawer())}
                        className="relative p-2 rounded-full text-[#101828] hover:text-[#1769FF] active:scale-90 transition cursor-pointer"
                        aria-label="Panier"
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 bg-[#1769FF] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-full text-[#101828] hover:bg-slate-100 transition cursor-pointer"
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

            </div>

            {/* Mobile Search Bar */}
            <div className="mt-2.5">
                <form onSubmit={handleSearch} className="relative w-full">
                    <div className="relative flex items-center bg-[#F7F9FC] px-3.5 py-2 rounded-full border border-[#EBEBEB] focus-within:border-[#1769FF]">
                        <Search size={16} className="text-[#667085] mr-2 shrink-0" />
                        <input
                            type="text"
                            placeholder="Rechercher des produits..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent outline-none text-xs font-semibold text-[#101828] placeholder:text-[#667085]"
                        />
                    </div>
                </form>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50">
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between z-50 border-l border-[#EBEBEB] animate-slide-in">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-[#EBEBEB]">
                                <Logo className="h-7 w-auto" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[#667085]">
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-2 text-sm font-bold text-[#101828]">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF]">Accueil</Link>
                                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF]">Boutique</Link>
                                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF]">Favoris ({wishlistCount})</Link>
                                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF]">À propos</Link>
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF]">Contact</Link>
                            </nav>
                        </div>

                        <div className="pt-4 border-t border-[#EBEBEB]">
                            {isLoggedIn && user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2.5 bg-rose-50 text-[#F04438] rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} /> Déconnexion
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-2.5 bg-[#1769FF] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                                >
                                    <User size={16} /> Se connecter
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
