'use client'
import { assets } from '@/assets/assets'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { 
    Search, 
    ShoppingCart, 
    HeartIcon, 
    Menu, 
    X, 
    LogOutIcon, 
    UserIcon, 
    PackageIcon, 
    StoreIcon, 
    ShieldCheckIcon,
    ChevronDownIcon
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

    const cartCount = useSelector((state: any) => state.cart.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
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

    const navLinks = [
        { label: "Accueil", href: "/" },
        { label: "Boutique", href: "/shop" },
        { label: "À propos", href: "/about" },
        { label: "Contact", href: "/contact" },
    ]

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-sm py-2.5' 
                    : 'bg-white/95 backdrop-blur-md border-b border-slate-100 py-3.5'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">

                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Logo />
                        </Link>

                        {/* Navigation Links - Desktop */}
                        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                                : 'text-slate-700 hover:text-blue-600 hover:bg-white'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Search Input Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-sm relative">
                            <div className="relative w-full flex items-center bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 shadow-2xs">
                                <Search size={16} className="text-slate-400 shrink-0 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-500"
                                />
                                <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shrink-0">
                                    ↵
                                </span>
                            </div>
                        </form>

                        {/* Action Buttons Right */}
                        <div className="flex items-center gap-2 sm:gap-3">

                            {/* Wishlist Link */}
                            <Link
                                href="/wishlist"
                                className="relative flex items-center justify-center size-9 sm:size-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-500 transition border border-slate-200"
                                title="Mes Favoris"
                                aria-label="Mes Favoris"
                            >
                                <HeartIcon size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-pulse">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart Drawer Trigger */}
                            <button
                                onClick={() => dispatch(openDrawer())}
                                className="relative flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-blue-600/25 active:scale-95 cursor-pointer"
                                aria-label="Panier d'achats"
                            >
                                <ShoppingCart size={16} />
                                <span className="hidden sm:inline">Panier</span>
                                <span className="size-4.5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shadow-2xs">
                                    {cartCount}
                                </span>
                            </button>

                            {/* Account Authentication Dropdown */}
                            {isLoggedIn && user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-full bg-slate-100 hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
                                        aria-label="Menu Utilisateur"
                                    >
                                        <div className="relative size-7 rounded-full overflow-hidden border border-blue-500">
                                            <Image
                                                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                                                alt="Profil"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[80px] truncate">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <ChevronDownIcon size={13} className="text-slate-400" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-1 z-50 text-xs animate-fade-in-up">
                                            <div className="px-3 py-2.5 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                                                <p className="font-extrabold text-slate-900 truncate">{user.name}</p>
                                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                                <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                                    {user.role === 'admin' ? '🛡️ Administrateur' : user.role === 'seller' ? '🏪 Vendeur' : '🛍️ Client VIP'}
                                                </span>
                                            </div>

                                            <Link
                                                href="/orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 font-semibold transition"
                                            >
                                                <PackageIcon size={15} className="text-blue-600" /> Mes Commandes
                                            </Link>

                                            {(user.role === 'seller' || user.role === 'admin') && (
                                                <Link
                                                    href="/store"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-blue-700 hover:bg-blue-50 font-semibold transition"
                                                >
                                                    <StoreIcon size={15} className="text-blue-600" /> Espace Vendeur
                                                </Link>
                                            )}

                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-700 hover:bg-purple-50 font-semibold transition"
                                                >
                                                    <ShieldCheckIcon size={15} className="text-purple-600" /> Panneau Admin
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition cursor-pointer"
                                            >
                                                <LogOutIcon size={15} /> Déconnexion
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition shadow-xs hover:shadow-blue-600/30 active:scale-95 cursor-pointer"
                                >
                                    <UserIcon size={14} />
                                    <span>Connexion</span>
                                </Link>
                            )}

                            {/* Mobile Hamburger Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden flex items-center justify-center size-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition border border-slate-200 cursor-pointer"
                                aria-label="Menu Mobile"
                            >
                                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar below Navbar on Small Screens */}
                    <div className="md:hidden mt-2.5 pb-1">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                placeholder="Rechercher écouteurs, casques, montres..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-slate-100 text-slate-800 text-xs rounded-full py-2 pl-9 pr-4 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white shadow-2xs font-medium placeholder:text-slate-400"
                            />
                            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Drawer Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div 
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between z-50 border-l border-slate-200 animate-slide-in">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <Logo />
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-2">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span>{link.label}</span>
                                            {isActive && <span className="size-2 rounded-full bg-blue-600" />}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-3">
                            {isLoggedIn && user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <LogOutIcon size={14} /> Déconnexion
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                                >
                                    <UserIcon size={14} /> Se connecter
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
