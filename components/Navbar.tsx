'use client'
import { Search, ShoppingCart, HeartIcon, UserIcon, LogOutIcon, ShieldCheckIcon, StoreIcon, PackageIcon, ChevronDownIcon, Menu, X, Sparkles, Compass, PhoneCall } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openDrawer } from "@/lib/features/cart/cartSlice";
import { logout } from "@/lib/features/user/userSlice";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Logo from "./Logo";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });
const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const cartCount = useSelector((state: any) => state.cart.itemCount)
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
                    ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-900/5 py-2.5' 
                    : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/60 py-3.5'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between gap-4">

                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Logo />
                        </Link>

                        {/* Navigation Links - Desktop */}
                        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Search Input Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-sm relative">
                            <div className="relative w-full flex items-center bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-2 rounded-full border border-slate-200/80 dark:border-slate-700/80 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 shadow-xs">
                                <Search size={16} className="text-slate-400 dark:text-slate-500 shrink-0 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent outline-none text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                                />
                                <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 shrink-0">
                                    ↵
                                </span>
                            </div>
                        </form>

                        {/* Action Buttons Right */}
                        <div className="flex items-center gap-2 sm:gap-3">

                            {/* Wishlist Link */}
                            <Link
                                href="/wishlist"
                                className="relative flex items-center justify-center size-9 sm:size-10 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-700 dark:text-slate-300 hover:text-red-500 transition border border-slate-200/60 dark:border-slate-700/60"
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
                                className="relative flex items-center gap-2 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-blue-600/25 active:scale-95 cursor-pointer"
                                aria-label="Panier d'achats"
                            >
                                <ShoppingCart size={16} />
                                <span className="hidden sm:inline">Panier</span>
                                <span className="size-4.5 rounded-full bg-blue-500 dark:bg-white text-white dark:text-blue-600 text-[10px] font-black flex items-center justify-center shadow-2xs">
                                    {cartCount}
                                </span>
                            </button>

                            {/* Account Authentication Dropdown */}
                            {isLoggedIn && user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 cursor-pointer"
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
                                        <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <ChevronDownIcon size={13} className="text-slate-400" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 z-50 text-xs animate-fade-in-up">
                                            <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-1 border border-slate-100 dark:border-slate-700/50">
                                                <p className="font-extrabold text-slate-900 dark:text-white truncate">{user.name}</p>
                                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                                <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                    {user.role === 'admin' ? '🛡️ Administrateur' : user.role === 'seller' ? '🏪 Vendeur' : '🛍️ Client VIP'}
                                                </span>
                                            </div>

                                            <Link
                                                href="/orders"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 font-semibold transition"
                                            >
                                                <PackageIcon size={15} className="text-blue-600" /> Mes Commandes
                                            </Link>

                                            {(user.role === 'seller' || user.role === 'admin') && (
                                                <Link
                                                    href="/store"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 font-semibold transition"
                                                >
                                                    <StoreIcon size={15} className="text-blue-600" /> Espace Vendeur
                                                </Link>
                                            )}

                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 font-semibold transition"
                                                >
                                                    <ShieldCheckIcon size={15} className="text-purple-600" /> Panneau Admin
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold transition cursor-pointer"
                                            >
                                                <LogOutIcon size={15} /> Déconnexion
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-blue-600/20 active:scale-95 transition-all duration-200"
                                >
                                    <UserIcon size={14} />
                                    <span>Connexion</span>
                                </Link>
                            )}

                            {/* Mobile Hamburger Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                                aria-label="Menu Mobile"
                            >
                                <Menu size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar Drawer / Input */}
                    <div className="md:hidden pt-2.5 pb-1">
                        <form onSubmit={handleSearch} className="relative w-full flex items-center bg-slate-100/90 dark:bg-slate-800/90 px-3.5 py-2 rounded-full border border-slate-200/80 dark:border-slate-700/80 focus-within:border-blue-500 transition shadow-xs">
                            <Search size={15} className="text-slate-400 shrink-0 mr-2" />
                            <input
                                type="text"
                                placeholder="Rechercher un produit high-tech..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent outline-none text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                            />
                        </form>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer Modal */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
                    <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
                    />
                    <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col justify-between z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <Logo />
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-2 text-sm font-semibold">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-2.5 rounded-xl transition ${
                                            pathname === link.href
                                                ? 'bg-blue-600 text-white font-bold'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <span>Mes Favoris</span>
                                    {wishlistCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            </nav>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <Link
                                href="/create-store"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800"
                            >
                                <StoreIcon size={15} /> Devenir Vendeur
                            </Link>

                            {!isLoggedIn && (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                                >
                                    <UserIcon size={15} /> Se connecter
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer Component (lazy mounted) */}
            <CartDrawer />
        </>
    );
};

export default Navbar;
