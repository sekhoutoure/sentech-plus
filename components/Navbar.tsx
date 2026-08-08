'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
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
    ShieldCheck,
    ChevronDown
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'
import { logout } from '@/lib/features/user/userSlice'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Logo from './Logo'

const Navbar: React.FC = () => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const cartCount = useSelector((state: any) => state.cart?.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
        }
    }

    const handleLogout = () => {
        dispatch(logout())
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
        toast.success("Déconnexion réussie. À bientôt !")
        router.push('/')
    }

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-xl border-b border-[#E4E7EC] shadow-sm py-2.5 sm:py-3' 
                : 'bg-white border-b border-[#E4E7EC] py-3.5 sm:py-4'
        }`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between gap-4 lg:gap-8">

                    {/* [LOGO] SenTech Plus */}
                    <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0">
                        <Logo />
                    </Link>

                    {/* [RECHERCHE] Grande Barre de Recherche (Desktop & Tablet) */}
                    <form onSubmit={handleSearch} className="hidden sm:flex items-center flex-1 max-w-2xl relative">
                        <div className="relative w-full flex items-center bg-[#F7F9FC] hover:bg-slate-100/80 focus-within:bg-white px-4 py-2.5 rounded-full border border-[#E4E7EC] focus-within:border-[#1769FF] focus-within:ring-2 focus-within:ring-[#1769FF]/15 transition-all duration-200">
                            <Search size={18} className="text-[#667085] shrink-0 mr-3" />
                            <input
                                type="text"
                                placeholder="Rechercher des équipements, casques, montres..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs sm:text-sm font-medium text-[#101828] placeholder:text-[#667085]"
                            />
                            <button 
                                type="submit" 
                                aria-label="Rechercher"
                                className="bg-[#1769FF] hover:bg-[#1256D6] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 shrink-0 shadow-xs cursor-pointer active:scale-95"
                            >
                                Rechercher
                            </button>
                        </div>
                    </form>

                    {/* [ACTIONS] Compte | Favoris | Panier */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                        {/* COMPTE */}
                        {isLoggedIn && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full bg-[#F7F9FC] hover:bg-slate-100 border border-[#E4E7EC] transition cursor-pointer text-xs font-semibold text-[#101828]"
                                    aria-label="Mon Compte"
                                >
                                    <div className="relative size-6 sm:size-7 rounded-full overflow-hidden border border-[#1769FF]">
                                        <Image
                                            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                                            alt="Profil"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="hidden md:inline max-w-[90px] truncate">
                                        {user.name?.split(' ')[0]}
                                    </span>
                                    <ChevronDown size={14} className="text-[#667085]" />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-[#E4E7EC] p-2 space-y-1 z-50 text-xs animate-fade-in-up">
                                        <div className="px-3 py-2.5 bg-[#F7F9FC] rounded-xl mb-1 border border-[#E4E7EC]">
                                            <p className="font-bold text-[#101828] truncate">{user.name}</p>
                                            <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                                            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EAF3FF] text-[#1769FF]">
                                                {user.role === 'admin' ? '🛡️ Administrateur' : user.role === 'seller' ? '🏪 Vendeur' : '🛍️ Client VIP'}
                                            </span>
                                        </div>

                                        <Link
                                            href="/orders"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101828] hover:bg-[#EAF3FF] hover:text-[#1769FF] font-semibold transition"
                                        >
                                            <Package size={16} className="text-[#1769FF]" /> Mes Commandes
                                        </Link>

                                        {(user.role === 'seller' || user.role === 'admin') && (
                                            <Link
                                                href="/store"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101828] hover:bg-[#EAF3FF] hover:text-[#1769FF] font-semibold transition"
                                            >
                                                <Store size={16} className="text-[#1769FF]" /> Espace Vendeur
                                            </Link>
                                        )}

                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101828] hover:bg-[#EAF3FF] hover:text-[#1769FF] font-semibold transition"
                                            >
                                                <ShieldCheck size={16} className="text-purple-600" /> Panneau Admin
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F04438] hover:bg-rose-50 font-semibold transition cursor-pointer"
                                        >
                                            <LogOut size={16} /> Déconnexion
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#101828] hover:text-[#1769FF] bg-[#F7F9FC] hover:bg-[#EAF3FF] px-3.5 py-2 rounded-full border border-[#E4E7EC] transition active:scale-95"
                            >
                                <User size={16} className="text-[#1769FF]" />
                                <span className="hidden md:inline">Compte</span>
                            </Link>
                        )}

                        {/* FAVORIS */}
                        <Link
                            href="/wishlist"
                            className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full bg-[#F7F9FC] hover:bg-rose-50 text-[#101828] hover:text-[#F04438] border border-[#E4E7EC] transition text-xs font-semibold"
                            title="Mes Favoris"
                            aria-label="Mes Favoris"
                        >
                            <Heart size={18} className="text-[#667085] hover:text-[#F04438]" />
                            <span className="hidden md:inline">Favoris</span>
                            {wishlistCount > 0 && (
                                <span className="size-4.5 rounded-full bg-[#F04438] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* PANIER */}
                        <button
                            onClick={() => dispatch(openDrawer())}
                            className="relative flex items-center gap-2 bg-[#071126] hover:bg-[#1769FF] text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                            aria-label="Panier d'achats"
                        >
                            <ShoppingCart size={17} />
                            <span className="hidden sm:inline">Panier</span>
                            <span className="size-5 rounded-full bg-[#1769FF] text-white text-[10px] font-black flex items-center justify-center">
                                {cartCount}
                            </span>
                        </button>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="sm:hidden flex items-center justify-center size-9 rounded-full bg-[#F7F9FC] text-[#101828] hover:bg-slate-100 transition border border-[#E4E7EC] cursor-pointer"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>

                </div>

                {/* Mobile Search Bar below Header on Small Screens */}
                <div className="sm:hidden mt-3 pt-1 border-t border-[#E4E7EC]/60">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="relative w-full flex items-center bg-[#F7F9FC] px-3.5 py-2 rounded-full border border-[#E4E7EC]">
                            <Search size={16} className="text-[#667085] shrink-0 mr-2" />
                            <input
                                type="text"
                                placeholder="Rechercher des équipements, casques..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs font-semibold text-[#101828] placeholder:text-[#667085]"
                            />
                            <button
                                type="submit"
                                aria-label="Rechercher"
                                className="bg-[#1769FF] text-white text-[10px] font-bold px-3 py-1 rounded-full shrink-0"
                            >
                                OK
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 sm:hidden">
                    <div 
                        className="fixed inset-0 bg-[#071126]/50 backdrop-blur-xs transition-opacity" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between z-50 border-l border-[#E4E7EC] animate-slide-in">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
                                <Logo />
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1 rounded-full text-[#667085] hover:text-[#101828]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-2 text-sm font-semibold">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] text-[#101828] transition"
                                >
                                    Accueil
                                </Link>
                                <Link
                                    href="/shop"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] text-[#101828] transition"
                                >
                                    Boutique
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] text-[#101828] transition flex items-center justify-between"
                                >
                                    <span>Mes Favoris</span>
                                    {wishlistCount > 0 && <span className="size-5 rounded-full bg-[#F04438] text-white text-[10px] font-black flex items-center justify-center">{wishlistCount}</span>}
                                </Link>
                                <Link
                                    href="/about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] text-[#101828] transition"
                                >
                                    À propos
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] text-[#101828] transition"
                                >
                                    Contact
                                </Link>
                            </nav>
                        </div>

                        <div className="pt-6 border-t border-[#E4E7EC] space-y-3">
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
                                    className="w-full py-2.5 bg-[#1769FF] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#1769FF]/25"
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
