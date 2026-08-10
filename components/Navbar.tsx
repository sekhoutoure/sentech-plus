'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
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
    ChevronRight,
    ArrowRight,
    Mic,
    MicOff
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'
import { logout } from '@/lib/features/user/userSlice'
import { formatPrice } from '@/lib/format'
import { getProductImage } from '@/lib/image-utils'
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
    const [isListening, setIsListening] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    // Recherche Vocale avec Web Speech API (Dictée automatique)
    const startVoiceSearch = () => {
        if (typeof window === 'undefined') return
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognition) {
            toast.error("La recherche vocale n'est pas disponible sur ce navigateur.", { icon: '🎙️' })
            return
        }

        try {
            const recognition = new SpeechRecognition()
            recognition.lang = 'fr-FR'
            recognition.continuous = false
            recognition.interimResults = true

            recognition.onstart = () => {
                setIsListening(true)
                toast.success("Écoute vocale active... Parlez maintenant (ex: iPhone, Casque, Montre)", {
                    icon: '🎙️',
                    duration: 4000
                })
            }

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('')

                setSearch(transcript)
                setIsSearchFocused(true)
            }

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error)
                setIsListening(false)
                if (event.error !== 'no-speech') {
                    toast.error("Vocal non reconnu. Veuillez réessayer.")
                }
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognition.start()
        } catch (err) {
            console.error(err)
            setIsListening(false)
        }
    }

    const cartCount = useSelector((state: any) => state.cart?.itemCount || 0)
    const wishlistCount = useSelector((state: any) => state.wishlist?.items?.length || 0)
    const { isLoggedIn, user } = useSelector((state: any) => state.user || { isLoggedIn: false, user: null })
    const products = useSelector((state: any) => state.product?.list || [])

    // Filtrer les résultats de recherche instantanée (Live Search)
    const searchResults = React.useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return []
        return products.filter((p: any) => 
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.category && p.category.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query))
        ).slice(0, 5)
    }, [search, products])

    // Détection clic à l'extérieur pour fermer le menu déroulant
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setIsSearchFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Auto-fermeture du menu mobile et des recherches lors d'un changement de page
    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsSearchFocused(false)
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
        <header className="sticky top-0 z-50 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-[#E5EAF0] shadow-xs">
            
            {/* Main Header Container */}
            <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
                
                {/* Desktop Header Row */}
                <div className="hidden lg:flex items-center justify-between gap-8">
                    
                    {/* [LOGO] SenTech Plus */}
                    <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0">
                        <Logo className="h-10 w-auto" />
                    </Link>

                    {/* [BARRE DE RECHERCHE] Large Omnibox avec Autocomplétion Live */}
                    <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <div className="relative w-full flex items-center bg-white hover:bg-[#F5F7FA] focus-within:bg-white px-4 py-3 rounded-full border border-[#E5EAF0] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 transition-all duration-200 shadow-2xs">
                                <Search size={18} className="text-[#475467] shrink-0 mr-3" />
                                <input
                                    id="desktop-search-input"
                                    name="search"
                                    type="text"
                                    placeholder="Rechercher un produit, une marque ou une catégorie..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setIsSearchFocused(true)
                                    }}
                                    onFocus={() => setIsSearchFocused(true)}
                                    aria-label="Rechercher un produit, une marque ou une catégorie"
                                    autoComplete="off"
                                    className="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#182230] placeholder:text-[#475467]"
                                />
                                
                                {/* Voice Search Mic Button Desktop */}
                                <button
                                    type="button"
                                    onClick={startVoiceSearch}
                                    aria-label="Recherche vocale"
                                    title="Dictée vocale par microphone"
                                    className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 ml-1.5 ${
                                        isListening
                                            ? 'bg-[#C4320A] text-white animate-pulse shadow-md'
                                            : 'text-[#0B54C2] hover:bg-[#EAF3FF] hover:scale-105'
                                    }`}
                                >
                                    <Mic size={16} />
                                </button>

                                <button
                                    type="submit"
                                    aria-label="Rechercher"
                                    className="bg-[#0B54C2] hover:bg-[#09449E] text-white text-xs font-extrabold px-5 py-2 rounded-full transition-all duration-200 shrink-0 shadow-2xs cursor-pointer active:scale-95 ml-2"
                                >
                                    Rechercher
                                </button>
                            </div>
                        </form>

                        {/* Dropdown de Résultats Live Autocomplete */}
                        {isSearchFocused && search.trim().length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E5EAF0] shadow-xl z-50 overflow-hidden">
                                {searchResults.length > 0 ? (
                                    <div>
                                        <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E5EAF0] text-[10px] font-extrabold text-[#475467] uppercase tracking-wider flex items-center justify-between">
                                            <span>Suggérés pour vous</span>
                                            <span className="text-[#0B54C2] font-black">{searchResults.length} produit(s)</span>
                                        </div>
                                        <div className="divide-y divide-[#E5EAF0] max-h-[360px] overflow-y-auto">
                                            {searchResults.map((product: any) => {
                                                const img = getProductImage(product, 0)
                                                const price = product.price || 0
                                                const productId = product.id || product._id || 'prod'
                                                return (
                                                    <Link
                                                        key={productId}
                                                        href={`/product/${productId}`}
                                                        onClick={() => setIsSearchFocused(false)}
                                                        className="flex items-center gap-3 p-3 hover:bg-[#F3F7FC] transition-colors group"
                                                    >
                                                        <div className="relative size-12 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3] overflow-hidden shrink-0">
                                                            <Image
                                                                src={img}
                                                                alt={product.name || 'Produit'}
                                                                fill
                                                                sizes="48px"
                                                                className="object-contain p-1 group-hover:scale-105 transition-transform"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-[10px] font-extrabold text-[#0B54C2] uppercase">
                                                                {product.category || 'High-Tech'}
                                                            </span>
                                                            <div className="text-xs font-bold text-[#182230] truncate group-hover:text-[#0B54C2] transition-colors">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-xs font-black text-[#182230]">
                                                                {formatPrice(price)}
                                                            </div>
                                                        </div>
                                                        <ArrowRight size={14} className="text-slate-400 group-hover:text-[#0B54C2] group-hover:translate-x-1 transition-all shrink-0" />
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                        <button
                                            onClick={handleSearch}
                                            type="button"
                                            className="w-full p-3 bg-[#F8FAFC] hover:bg-[#EAF3FF] text-[#0B54C2] text-xs font-extrabold text-center transition-colors border-t border-[#E5EAF0] flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>Voir tous les résultats pour "{search}"</span>
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <p className="text-xs font-bold text-[#182230] mb-1">Aucun résultat trouvé pour "{search}"</p>
                                        <p className="text-[11px] text-[#475467]">Essayez avec d'autres mots-clés (ex: iPhone, Casque, Montre...)</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* [ACTIONS DROITE] Compte | Favoris | Panier */}
                    <div className="flex items-center gap-5 shrink-0">
                        {/* Account */}
                        <Link
                            href={isLoggedIn ? "/orders" : "/login"}
                            className="flex items-center gap-2 text-xs font-extrabold text-[#182230] hover:text-[#0B54C2] transition-colors group"
                        >
                            <div className="size-9 rounded-full bg-white group-hover:bg-[#EAF3FF] border border-[#E5EAF0] flex items-center justify-center text-[#475467] group-hover:text-[#0B54C2] transition-colors shadow-2xs">
                                <User size={18} />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-[#475467] font-medium leading-none">Bonjour</span>
                                <span className="text-xs font-bold leading-tight">{isLoggedIn ? (user?.name?.split(' ')[0] || "Compte") : "Connexion"}</span>
                            </div>
                        </Link>

                        {/* Favoris */}
                        <Link
                            href="/wishlist"
                            className="relative flex items-center gap-2 text-xs font-extrabold text-[#182230] hover:text-[#0B54C2] transition-colors group"
                            aria-label="Favoris"
                        >
                            <div className="relative size-9 rounded-full bg-white group-hover:bg-[#EAF3FF] border border-[#E5EAF0] flex items-center justify-center text-[#475467] group-hover:text-[#C4320A] transition-colors shadow-2xs">
                                <Heart size={18} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 size-4 bg-[#C4320A] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xl:inline font-bold">Favoris</span>
                        </Link>

                        {/* Panier */}
                        <button
                            onClick={() => dispatch(openDrawer())}
                            className="relative flex items-center gap-2.5 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs px-4 py-2.5 rounded-full transition-all duration-200 shadow-md cursor-pointer active:scale-95"
                            aria-label="Panier"
                        >
                            <div className="relative">
                                <ShoppingCart size={17} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2.5 size-4 bg-white text-[#0B54C2] text-[9px] font-black rounded-full flex items-center justify-center">
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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="size-[42px] rounded-xl text-[#182230] hover:bg-[#F5F7FA] active:bg-[#EAF3FF] transition cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-[#E8EDF3]"
                            aria-label="Menu de navigation"
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
                            className="inline-flex items-center gap-1 bg-[#085D38]/10 hover:bg-[#085D38]/20 text-[#085D38] text-[11px] font-extrabold px-2.5 py-1.5 rounded-full transition-all border border-[#085D38]/20"
                        >
                            <span className="size-1.5 rounded-full bg-[#085D38] animate-pulse" />
                            <span>Aide 24/7</span>
                        </a>
                    </div>
                </div>

                {/* Mobile Header Row 2 (Barre de Recherche Omnibox 44px) */}
                <div className="lg:hidden mt-1.5 relative">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <div className="relative h-[44px] flex items-center bg-white px-3.5 rounded-xl border border-[#E5EAF0] focus-within:border-[#0B54C2] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B54C2]/15 transition-all shadow-2xs">
                            <Search size={16} className="text-[#475467] mr-2 shrink-0" />
                            <input
                                id="mobile-search-input"
                                name="mobile_search"
                                type="text"
                                placeholder="Rechercher un produit, une marque..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setIsSearchFocused(true)
                                }}
                                onFocus={() => setIsSearchFocused(true)}
                                aria-label="Rechercher un produit ou une marque"
                                autoComplete="off"
                                className="w-full bg-transparent outline-none text-xs font-semibold text-[#182230] placeholder:text-[#475467]"
                            />

                            {/* Voice Search Mic Button Mobile */}
                            <button
                                type="button"
                                onClick={startVoiceSearch}
                                aria-label="Recherche vocale mobile"
                                title="Dictée vocale par microphone"
                                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer shrink-0 ml-1 ${
                                    isListening
                                        ? 'bg-[#C4320A] text-white animate-pulse shadow-md'
                                        : 'text-[#0B54C2] hover:bg-[#EAF3FF]'
                                }`}
                            >
                                <Mic size={16} />
                            </button>
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
