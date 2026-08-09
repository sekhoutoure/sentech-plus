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
    Smartphone,
    Laptop,
    Headphones,
    Watch,
    Gamepad2,
    Speaker,
    Plug,
    Home,
    ChevronRight
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'
import { logout } from '@/lib/features/user/userSlice'
import toast from 'react-hot-toast'
import Logo from './Logo'

const categories = [
    { label: "Smartphones", query: "Smartphones", icon: Smartphone },
    { label: "Ordinateurs", query: "Laptops", icon: Laptop },
    { label: "Audio", query: "Casques", icon: Headphones },
    { label: "Montres", query: "Montres", icon: Watch },
    { label: "Gaming", query: "Gaming", icon: Gamepad2 },
    { label: "Enceintes", query: "Enceintes", icon: Speaker },
    { label: "Accessoires", query: "Accessoires", icon: Plug },
    { label: "Smart Home", query: "Maison", icon: Home },
]

const Navbar: React.FC = () => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()

    const [search, setSearch] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const cartCount = useSelector((state: any) => state.cart?.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    // Auto-fermeture du menu mobile lors d'un changement de page / navigation
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Bloquer le défilement de l'arrière-plan quand le tiroir mobile est ouvert
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

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
        <header className="sticky top-0 z-50 bg-white border-b border-[#E8EDF3] shadow-2xs">
            
            {/* Main Header Container */}
            <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
                
                {/* Desktop Header Row */}
                <div className="hidden lg:flex items-center justify-between gap-8">
                    
                    {/* [LOGO] SenTech Plus */}
                    <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0">
                        <Logo className="h-10 w-auto" />
                    </Link>

                    {/* [BARRE DE RECHERCHE] Large Omnibox */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                        <div className="relative w-full flex items-center bg-[#F5F7FA] hover:bg-[#EEF1F5] focus-within:bg-white px-4 py-3 rounded-full border border-[#E5EAF0] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 transition-all duration-200">
                            <Search size={18} className="text-[#667085] shrink-0 mr-3" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit, une marque ou une catégorie..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#182230] placeholder:text-[#667085]"
                            />
                            <button
                                type="submit"
                                aria-label="Rechercher"
                                className="bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-extrabold px-5 py-2 rounded-full transition-all duration-200 shrink-0 shadow-2xs cursor-pointer active:scale-95 ml-2"
                            >
                                Rechercher
                            </button>
                        </div>
                    </form>

                    {/* [ACTIONS DROITE] Compte | Favoris | Panier */}
                    <div className="flex items-center gap-5 shrink-0">
                        {/* Account */}
                        <Link
                            href={isLoggedIn ? "/orders" : "/login"}
                            className="flex items-center gap-2 text-xs font-extrabold text-[#182230] hover:text-[#1677FF] transition-colors group"
                        >
                            <div className="size-9 rounded-full bg-[#F5F7FA] group-hover:bg-[#EAF3FF] border border-[#E8EDF3] flex items-center justify-center text-[#667085] group-hover:text-[#1677FF] transition-colors">
                                <User size={18} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-[#667085] font-medium leading-none">Bonjour</span>
                                <span className="text-xs font-bold leading-tight">{isLoggedIn ? (user?.name?.split(' ')[0] || "Compte") : "Connexion"}</span>
                            </div>
                        </Link>

                        {/* Favoris */}
                        <Link
                            href="/wishlist"
                            className="relative flex items-center gap-2 text-xs font-extrabold text-[#182230] hover:text-[#1677FF] transition-colors group"
                            aria-label="Favoris"
                        >
                            <div className="relative size-9 rounded-full bg-[#F5F7FA] group-hover:bg-[#EAF3FF] border border-[#E8EDF3] flex items-center justify-center text-[#667085] group-hover:text-[#FF6B35] transition-colors">
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4 bg-[#FF6B35] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xl:inline font-bold">Favoris</span>
                        </Link>

                        {/* Panier */}
                        <button
                            onClick={() => dispatch(openDrawer())}
                            className="relative flex items-center gap-2.5 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-4 py-2.5 rounded-full transition-all duration-200 shadow-md cursor-pointer active:scale-95"
                            aria-label="Panier"
                        >
                            <div className="relative">
                                <ShoppingCart size={17} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2.5 size-4 bg-white text-[#1677FF] text-[9px] font-black rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span>Panier ({cartCount})</span>
                        </button>
                    </div>

                </div>

                {/* Mobile Header Row */}
                <div className="flex lg:hidden items-center justify-between gap-2 h-11">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="size-[42px] rounded-xl text-[#182230] hover:bg-[#F5F7FA] active:bg-[#EAF3FF] transition cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-[#E8EDF3]"
                            aria-label="Menu de navigation"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-drawer-menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <Link href="/" className="flex items-center group shrink-0">
                            <Logo className="h-7 w-auto" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        <a
                            href="https://wa.me/221770000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#16B979]/10 hover:bg-[#16B979]/20 text-[#16B979] text-[11px] font-extrabold px-2.5 py-1.5 rounded-full transition-all border border-[#16B979]/20"
                        >
                            <span className="size-1.5 rounded-full bg-[#16B979] animate-pulse" />
                            <span>Aide 24/7</span>
                        </a>
                    </div>
                </div>

                {/* Mobile Header Row 2 (Barre de Recherche Omnibox 44px) */}
                <div className="lg:hidden mt-1.5">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="relative h-[44px] flex items-center bg-[#F5F7FA] px-3.5 rounded-xl border border-[#E5EAF0] focus-within:border-[#1677FF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/15 transition-all">
                            <Search size={16} className="text-[#667085] mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit, une marque..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs font-semibold text-[#182230] placeholder:text-[#667085]"
                            />
                        </div>
                    </form>
                </div>

            </div>

            {/* Sub-Header Categories Navigation Bar */}
            <div className="w-full bg-[#F3F7FC] border-t border-[#E8EDF3]">
                <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 sm:py-2.5 no-scrollbar scroll-smooth">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon
                            return (
                                <Link
                                    key={idx}
                                    href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold text-[#182230] hover:text-[#1677FF] hover:bg-white transition-all duration-200 shrink-0 border border-transparent hover:border-[#E8EDF3]"
                                >
                                    <Icon size={13} className="text-[#667085] shrink-0" />
                                    <span className="whitespace-nowrap">{cat.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50">
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        aria-hidden="true"
                    />
                    <div 
                        id="mobile-drawer-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation mobile"
                        className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between z-50 border-r border-[#EBEBEB] animate-slide-in"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-[#EBEBEB]">
                                <Logo className="h-7 w-auto" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[#667085]">
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-1 text-sm font-bold text-[#101828]">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] flex items-center justify-between">
                                    <span>Accueil</span>
                                    <ChevronRight size={16} />
                                </Link>
                                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] flex items-center justify-between">
                                    <span>Catalogue Produits</span>
                                    <ChevronRight size={16} />
                                </Link>
                                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] flex items-center justify-between">
                                    <span>Favoris ({wishlistCount})</span>
                                    <ChevronRight size={16} />
                                </Link>
                                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] flex items-center justify-between">
                                    <span>À propos</span>
                                    <ChevronRight size={16} />
                                </Link>
                                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl hover:bg-[#EAF3FF] hover:text-[#1769FF] flex items-center justify-between">
                                    <span>Contact</span>
                                    <ChevronRight size={16} />
                                </Link>
                            </nav>
                        </div>

                        <div className="pt-4 border-t border-[#EBEBEB]">
                            {isLoggedIn && user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-rose-50 text-[#F04438] rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} /> Déconnexion
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-3 bg-[#1769FF] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
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
