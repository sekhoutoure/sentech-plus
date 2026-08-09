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
        <header className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB] shadow-xs">
            
            {/* Main Header Container */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-3.5">
                
                {/* Desktop Header Row */}
                <div className="hidden lg:flex items-center justify-between gap-8">
                    
                    {/* [LOGO] SenTech Plus */}
                    <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0">
                        <Logo className="h-9 w-auto" />
                    </Link>

                    {/* [BARRE DE RECHERCHE] Large Omnibox */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
                        <div className="relative w-full flex items-center bg-[#F7F9FC] hover:bg-slate-100/80 focus-within:bg-white px-4 py-2.5 rounded-full border border-[#EBEBEB] focus-within:border-[#1769FF] focus-within:ring-2 focus-within:ring-[#1769FF]/15 transition-all duration-200">
                            <Search size={18} className="text-[#667085] shrink-0 mr-3" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit, une marque ou une catégorie..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#101828] placeholder:text-[#667085]"
                            />
                            <button
                                type="submit"
                                aria-label="Rechercher"
                                className="bg-[#1769FF] hover:bg-[#1256D6] text-white text-xs font-bold px-5 py-2 rounded-full transition-all duration-200 shrink-0 shadow-xs cursor-pointer active:scale-95 ml-2"
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
                            className="flex items-center gap-2 text-xs font-extrabold text-[#101828] hover:text-[#1769FF] transition-colors group"
                        >
                            <div className="size-9 rounded-full bg-[#F7F9FC] group-hover:bg-[#EAF3FF] border border-[#EBEBEB] flex items-center justify-center text-[#667085] group-hover:text-[#1769FF] transition-colors">
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
                            className="relative flex items-center gap-2 text-xs font-extrabold text-[#101828] hover:text-[#1769FF] transition-colors group"
                            aria-label="Favoris"
                        >
                            <div className="relative size-9 rounded-full bg-[#F7F9FC] group-hover:bg-[#EAF3FF] border border-[#EBEBEB] flex items-center justify-center text-[#667085] group-hover:text-[#F04438] transition-colors">
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4 bg-[#F04438] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xl:inline font-bold">Favoris</span>
                        </Link>

                        {/* Panier */}
                        <button
                            onClick={() => dispatch(openDrawer())}
                            className="relative flex items-center gap-2.5 bg-[#071126] hover:bg-[#1769FF] text-white font-extrabold text-xs px-4 py-2.5 rounded-full transition-all duration-200 shadow-md cursor-pointer active:scale-95"
                            aria-label="Panier"
                        >
                            <div className="relative">
                                <ShoppingCart size={17} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2.5 size-4 bg-[#1769FF] border border-[#071126] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span>Panier ({cartCount})</span>
                        </button>
                    </div>

                </div>

                {/* Mobile Header Row (Ligne 1: Menu - Logo - Panier) */}
                <div className="flex lg:hidden items-center justify-between gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-xl text-[#101828] hover:bg-slate-100 transition cursor-pointer"
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <Link href="/" className="flex items-center group shrink-0">
                        <Logo className="h-8 w-auto" />
                    </Link>

                    <button
                        onClick={() => dispatch(openDrawer())}
                        className="relative p-2 rounded-xl text-[#101828] hover:text-[#1769FF] transition cursor-pointer"
                        aria-label="Panier"
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 bg-[#1769FF] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Header Row 2 (Barre de Recherche) */}
                <div className="lg:hidden mt-2.5">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="relative flex items-center bg-[#F7F9FC] px-3.5 py-2 rounded-full border border-[#EBEBEB] focus-within:border-[#1769FF]">
                            <Search size={16} className="text-[#667085] mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit, une marque..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs font-semibold text-[#101828] placeholder:text-[#667085]"
                            />
                        </div>
                    </form>
                </div>

            </div>

            {/* Sub-Header Categories Navigation Bar (Scroll Horizontal sur Mobile) */}
            <div className="w-full bg-[#F7F9FC] border-t border-[#EBEBEB]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon
                            return (
                                <Link
                                    key={idx}
                                    href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#101828] hover:text-[#1769FF] hover:bg-white transition-all duration-200 shrink-0 border border-transparent hover:border-[#EBEBEB]"
                                >
                                    <Icon size={14} className="text-[#667085] shrink-0" />
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />
                    <div className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between z-50 border-r border-[#EBEBEB] animate-slide-in">
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
