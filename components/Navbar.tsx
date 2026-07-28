'use client'
import { Search, ShoppingCart, HeartIcon, UserIcon, LogOutIcon, ShieldCheckIcon, StoreIcon, PackageIcon, ShoppingBagIcon, ChevronDownIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assets } from "@/assets/assets";
import { openDrawer } from "@/lib/features/cart/cartSlice";
import { logout } from "@/lib/features/user/userSlice";
import toast from "react-hot-toast";
import CartDrawer from "./CartDrawer";
import AuthModal from "./AuthModal";
import Logo from "./Logo";

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    const cartCount = useSelector((state: any) => state.cart.itemCount)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const handleLogout = () => {
        dispatch(logout())
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
        toast.success("Déconnexion réussie. À bientôt !")
        router.push('/')
    }

    return (
        <>
            <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-xs transition-all">
                <div className="px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto py-3 sm:py-3.5 transition-all">

                        {/* ================= DESKTOP HEADER ================= */}
                        <div className="hidden sm:flex items-center justify-between w-full">
                            <Link href="/" className="relative flex items-center transition-transform hover:scale-[1.02]">
                                <Logo />
                            </Link>

                            <div className="flex items-center gap-4 lg:gap-8 text-slate-700 font-medium text-sm">
                                <Link href="/" className="hover:text-blue-600 transition">Accueil</Link>
                                <Link href="/shop" className="hover:text-blue-600 transition">Boutique</Link>
                                <Link href="/about" className="hover:text-blue-600 transition">À propos</Link>
                                <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>

                                <form onSubmit={handleSearch} className="flex items-center w-xs text-sm gap-2 bg-slate-100/90 px-4 py-2.5 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition">
                                    <Search size={17} className="text-slate-400" />
                                    <input className="w-full bg-transparent outline-none placeholder-slate-400 text-sm" type="text" placeholder="Rechercher un produit..." aria-label="Rechercher un produit" value={search} onChange={(e) => setSearch(e.target.value)} required />
                                </form>

                                {/* Wishlist Link */}
                                <Link href="/wishlist" className="relative flex items-center gap-1.5 text-slate-700 hover:text-red-500 transition" title="Mes Favoris">
                                    <HeartIcon size={19} />
                                    {wishlistCount > 0 && (
                                        <button className="absolute -top-1.5 -right-2 text-[9px] font-bold text-white bg-red-500 size-4 rounded-full flex items-center justify-center animate-pulse">{wishlistCount}</button>
                                    )}
                                </Link>

                                {/* Cart Drawer Trigger */}
                                <button 
                                    onClick={() => { setIsMobileMenuOpen(false); dispatch(openDrawer()); }}
                                    className="relative flex items-center gap-2 text-slate-700 hover:text-blue-600 transition cursor-pointer"
                                >
                                    <ShoppingCart size={19} />
                                    <span>Panier</span>
                                    <span className="text-[10px] font-bold text-white bg-blue-600 size-4.5 rounded-full flex items-center justify-center shadow-xs">{cartCount}</span>
                                </button>

                                {/* Account Dropdown or Connexion Button */}
                                {isLoggedIn && user ? (
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            aria-label="Profil"
                                            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full transition cursor-pointer border border-slate-200"
                                        >
                                            <Image src={user.avatar} alt="Photo de profil" width={28} height={28} className="size-7 rounded-full object-cover border border-blue-500" />
                                            <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[100px]">{user.name}</span>
                                            <ChevronDownIcon size={14} className="text-slate-500" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1 z-50 text-xs">
                                                <div className="px-3 py-2 border-b border-slate-100">
                                                    <p className="font-bold text-slate-900">{user.name}</p>
                                                    <p className="text-[10px] text-slate-400">{user.email}</p>
                                                    <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                                        Rôle : {user.role === 'admin' ? 'Administrateur' : user.role === 'seller' ? 'Vendeur' : 'Client'}
                                                    </span>
                                                </div>
                                                <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition">
                                                    <PackageIcon size={15} className="text-blue-600" /> Mes Commandes
                                                </Link>
                                                {(user.role === 'seller' || user.role === 'admin') && (
                                                    <Link href="/store" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-700 font-medium transition">
                                                        <StoreIcon size={15} /> Espace Vendeur
                                                    </Link>
                                                )}
                                                {user.role === 'admin' && (
                                                    <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-900 font-medium transition">
                                                        <ShieldCheckIcon size={15} className="text-purple-600" /> Panneau Admin
                                                    </Link>
                                                )}
                                                <button 
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-semibold transition cursor-pointer"
                                                >
                                                    <LogOutIcon size={15} /> Déconnexion
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsAuthOpen(true)}
                                        className="px-7 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full font-medium shadow-sm text-sm cursor-pointer"
                                    >
                                        Connexion
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ================= MOBILE HEADER ================= */}
                        <div className="flex sm:hidden items-center justify-between w-full relative">
                            
                            {/* Left: Hamburger & Search */}
                            <div className="flex items-center gap-1">
                                <button 
                                    onClick={() => { setIsMobileMenuOpen(true); setIsMobileSearchOpen(false); setIsUserMenuOpen(false); }}
                                    className="p-2.5 text-slate-700 hover:bg-slate-100 rounded-full transition"
                                >
                                    <Menu size={24} strokeWidth={2.5} />
                                </button>
                                <button 
                                    onClick={() => { setIsMobileSearchOpen(!isMobileSearchOpen); setIsUserMenuOpen(false); }}
                                    className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
                                >
                                    <Search size={22} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Center: Logo */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                <Link href="/" className="block scale-90 transition-transform">
                                    <Logo />
                                </Link>
                            </div>

                            {/* Right: User & Cart */}
                            <div className="flex items-center gap-1">
                                {isLoggedIn && user ? (
                                    <div className="relative">
                                        <button 
                                            onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsMobileSearchOpen(false); }}
                                            aria-label="Profil"
                                            className="p-0.5 rounded-full border border-slate-200 transition"
                                        >
                                            <Image src={user.avatar} alt="Photo de profil" width={28} height={28} className="size-7 rounded-full object-cover" />
                                        </button>
                                        
                                        {/* Mobile User Dropdown */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-2 space-y-1 z-50 text-xs animate-in slide-in-from-top-2">
                                                <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/60 rounded-xl mb-1">
                                                    <p className="font-extrabold text-slate-900 text-sm leading-tight">{user.name}</p>
                                                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                                            user.role === 'admin' 
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                                                : user.role === 'seller' 
                                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}>
                                                            {user.role === 'admin' ? <ShieldCheckIcon size={12} /> : user.role === 'seller' ? <StoreIcon size={12} /> : <UserIcon size={12} />}
                                                            {user.role === 'admin' ? 'Administrateur' : user.role === 'seller' ? 'Vendeur' : 'Client VIP'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Client Links */}
                                                <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition">
                                                    <UserIcon size={16} className="text-blue-600 shrink-0" /> Mon Profil Client
                                                </Link>

                                                <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition">
                                                    <PackageIcon size={16} className="text-blue-600 shrink-0" /> Mes Commandes
                                                </Link>


                                                <Link href="/wishlist" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition">
                                                    <HeartIcon size={16} className="text-red-500 shrink-0" /> Mes Favoris
                                                </Link>

                                                {/* Seller Section */}
                                                {(user.role === 'seller' || user.role === 'admin') && (
                                                    <div className="pt-1 border-t border-slate-100 mt-1">
                                                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest px-3 block mb-1">Espace Vendeur</span>
                                                        <Link href="/store" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-700 font-semibold transition">
                                                            <StoreIcon size={16} className="text-blue-600 shrink-0" /> Tableau de Bord Vendeur
                                                        </Link>
                                                        <Link href="/store/manage-product" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-700 font-semibold transition">
                                                            <ShoppingBagIcon size={16} className="text-blue-600 shrink-0" /> Gérer mes Produits
                                                        </Link>
                                                        <Link href="/store/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-700 font-semibold transition">
                                                            <PackageIcon size={16} className="text-blue-600 shrink-0" /> Ventes & Commandes
                                                        </Link>
                                                    </div>
                                                )}

                                                {/* Admin Section */}
                                                {user.role === 'admin' && (
                                                    <div className="pt-1 border-t border-slate-100 mt-1">
                                                        <span className="text-[9px] font-extrabold text-purple-500 uppercase tracking-widest px-3 block mb-1">Administration</span>
                                                        <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-800 font-semibold transition">
                                                            <ShieldCheckIcon size={16} className="text-purple-600 shrink-0" /> Panneau Admin
                                                        </Link>
                                                        <Link href="/admin/stores" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-800 font-semibold transition">
                                                            <StoreIcon size={16} className="text-purple-600 shrink-0" /> Modération Boutiques
                                                        </Link>
                                                    </div>
                                                )}

                                                <div className="pt-1 border-t border-slate-100 mt-1">
                                                    <button 
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-bold transition cursor-pointer"
                                                    >
                                                        <LogOutIcon size={16} className="shrink-0" /> Se déconnecter
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsAuthOpen(true)}
                                        className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
                                    >
                                        <UserIcon size={22} strokeWidth={2.5} />
                                    </button>
                                )}

                                <button 
                                    onClick={() => dispatch(openDrawer())}
                                    className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
                                >
                                    <ShoppingCart size={22} strokeWidth={2.5} />
                                    {cartCount > 0 && <span className="absolute top-1 right-1 text-[9px] font-bold text-white bg-blue-600 size-4 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search Dropdown */}
                        {isMobileSearchOpen && (
                            <div className="sm:hidden w-full pt-4 pb-1 animate-in slide-in-from-top-2">
                                <form onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }} className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition shadow-inner">
                                    <Search size={18} className="text-slate-400 shrink-0" />
                                    <input className="w-full bg-transparent outline-none placeholder-slate-500 text-base sm:text-sm" type="text" placeholder="Rechercher un produit..." aria-label="Rechercher un produit" value={search} onChange={(e) => setSearch(e.target.value)} required autoFocus />
                                    <button type="button" onClick={() => setIsMobileSearchOpen(false)} aria-label="Fermer la recherche mobile" className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                                        <X size={16} />
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu Overlay (Moved OUTSIDE of nav) */}
            {isMobileMenuOpen && (
                <div className="sm:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <Logo />
                        <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Fermer le menu mobile"
                            className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-red-600 rounded-full transition cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-20">
                        <div className="flex flex-col gap-2 text-slate-800 font-medium text-lg">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 hover:bg-slate-50 rounded-xl transition">Accueil</Link>
                            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 hover:bg-slate-50 rounded-xl transition">Boutique</Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 hover:bg-slate-50 rounded-xl transition">À propos</Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 hover:bg-slate-50 rounded-xl transition">Contact</Link>
                            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 hover:bg-slate-50 rounded-xl transition flex justify-between items-center mt-2 border-t border-slate-100 pt-5">
                                <span className="flex items-center gap-3"><HeartIcon size={20} className="text-red-500"/> Mes Favoris</span>
                                {wishlistCount > 0 && <span className="bg-red-500 text-white text-sm font-bold px-3 py-0.5 rounded-full shadow-sm">{wishlistCount}</span>}
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <CartDrawer />
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    )
}

export default Navbar
