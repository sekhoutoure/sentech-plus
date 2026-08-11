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
    ChevronDown,
    ArrowRight,
    Mic,
    MicOff,
    PhoneCall
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { openDrawer } from '@/lib/features/cart/cartSlice'
import { logout } from '@/lib/features/user/userSlice'
import { formatPrice } from '@/lib/format'
import { getProductImage } from '@/lib/image-utils'
import HeaderMegaMenu from './HeaderMegaMenu'
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

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
    const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)
    const headerRef = useRef<HTMLElement>(null)
    const [headerBottom, setHeaderBottom] = useState<number | undefined>(undefined)

    // Calcul dynamique de la hauteur du header pour positionner le Méga-Menu
    useEffect(() => {
        if (hoveredCategory && headerRef.current) {
            setHeaderBottom(headerRef.current.getBoundingClientRect().bottom)
        }
    }, [hoveredCategory])

    // Auto-fermeture du menu mobile, méga-menu et des recherches lors d'un changement de page
    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsSearchFocused(false)
        setHoveredCategory(null)
        setExpandedMobileCategory(null)
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
        <header ref={headerRef} className="sticky top-0 z-[100] bg-white border-b border-[#E5EAF0] shadow-xs">
            
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
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-1 bg-[#EAF3FF] hover:bg-[#0B54C2]/15 text-[#0B54C2] text-[11px] sm:text-xs font-extrabold px-3 py-1.5 rounded-full transition-all border border-[#0B54C2]/20"
                        >
                            <PhoneCall size={12} className="text-[#0B54C2]" />
                            <span>Contact</span>
                        </Link>
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

            {/* Sub-Header Categories Navigation Bar (Desktop Hover Mega-Menu + Mobile Direct Navigation) */}
            <div className="w-full bg-[#F3F7FC] border-t border-[#E8EDF3] relative">
                <div className="max-w-[1400px] mx-auto px-3 sm:px-6">
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 sm:py-2.5 no-scrollbar scroll-smooth">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon
                            const hasMegaMenu = ['Smartphones', 'Ordinateurs', 'Audio', 'Gaming'].includes(cat.label)
                            const isHovered = hoveredCategory === cat.label
                            return (
                                <div
                                    key={idx}
                                    onMouseEnter={() => {
                                        if (typeof window !== 'undefined' && window.innerWidth >= 1024 && hasMegaMenu) {
                                            setHoveredCategory(cat.label)
                                        }
                                    }}
                                    className="shrink-0"
                                >
                                    <Link
                                        href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                        onClick={() => setHoveredCategory(null)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-200 shrink-0 border ${
                                            isHovered
                                                ? 'bg-white text-[#0B54C2] border-[#0B54C2]/30 shadow-2xs'
                                                : 'text-[#182230] hover:text-[#0B54C2] hover:bg-white border-transparent hover:border-[#E8EDF3]'
                                        }`}
                                    >
                                        <Icon size={13} className={isHovered ? 'text-[#0B54C2]' : 'text-[#667085] shrink-0'} />
                                        <span className="whitespace-nowrap">{cat.label}</span>
                                        {hasMegaMenu && (
                                            <ChevronDown size={11} className={`hidden lg:inline transition-transform duration-200 ${isHovered ? 'rotate-180 text-[#0B54C2]' : 'text-slate-400'}`} />
                                        )}
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Méga-Menu Déroulant au survol (Bureau uniquement lg:block) */}
                {hoveredCategory && (
                    <div className="hidden lg:block">
                        <HeaderMegaMenu 
                            categoryKey={hoveredCategory} 
                            onClose={() => setHoveredCategory(null)} 
                            topPosition={headerBottom}
                        />
                    </div>
                )}
            </div>

            {/* Mobile Drawer (Tiroir de Navigation Mobile complet) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
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
                        className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white p-5 shadow-2xl flex flex-col justify-between z-50 border-r border-[#EBEBEB] animate-slide-in overflow-y-auto"
                    >
                        <div className="space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
                                <Logo className="h-7 w-auto" />
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    aria-label="Fermer le menu"
                                    className="p-1.5 rounded-full text-[#667085] hover:bg-slate-100 transition cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Section Liens Principaux */}
                            <nav className="flex flex-col space-y-1 text-xs sm:text-sm font-bold text-[#101828]">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#0B54C2] flex items-center justify-between transition-colors">
                                    <span>Accueil</span>
                                    <ChevronRight size={15} className="text-slate-400" />
                                </Link>
                                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#0B54C2] flex items-center justify-between transition-colors">
                                    <span className="flex items-center gap-2">
                                        <span>Catalogue Général</span>
                                        <span className="text-[9px] bg-[#0B54C2] text-white px-2 py-0.5 rounded-full font-black">TOUT</span>
                                    </span>
                                    <ChevronRight size={15} className="text-slate-400" />
                                </Link>
                                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 rounded-xl hover:bg-[#EAF3FF] hover:text-[#0B54C2] flex items-center justify-between transition-colors">
                                    <span>Mes Favoris ({wishlistCount})</span>
                                    <ChevronRight size={15} className="text-slate-400" />
                                </Link>
                            </nav>

                            {/* Section Catégories & Rayons Accordéon sur Mobile */}
                            <div className="pt-3 border-t border-[#EBEBEB] space-y-2">
                                <div className="text-[10px] font-black text-[#475467] uppercase tracking-wider px-1">
                                    Rayons & Équipements
                                </div>
                                <div className="space-y-1">
                                    {categories.map((cat, idx) => {
                                        const Icon = cat.icon
                                        const isExpanded = expandedMobileCategory === cat.label
                                        return (
                                            <div key={idx} className="rounded-xl border border-[#E8EDF3] overflow-hidden bg-[#F8FAFC]">
                                                <div className="flex items-center justify-between p-2.5">
                                                    <Link
                                                        href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center gap-2 text-xs font-bold text-[#182230] hover:text-[#0B54C2] flex-1"
                                                    >
                                                        <Icon size={15} className="text-[#0B54C2] shrink-0" />
                                                        <span>{cat.label}</span>
                                                    </Link>

                                                    <button
                                                        onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.label)}
                                                        className="p-1 text-slate-400 hover:text-[#0B54C2] transition"
                                                        aria-label={`Dérouler ${cat.label}`}
                                                    >
                                                        <ChevronDown size={15} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#0B54C2]' : ''}`} />
                                                    </button>
                                                </div>

                                                {/* Contenu Déroulant Accordéon Mobile */}
                                                {isExpanded && (
                                                    <div className="bg-white p-2.5 border-t border-[#E8EDF3] space-y-1.5 text-xs animate-in fade-in duration-200">
                                                        <Link
                                                            href={`/shop?search=${encodeURIComponent(cat.query)}`}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block text-[11px] font-extrabold text-[#0B54C2] hover:underline"
                                                        >
                                                            → Voir tous les produits {cat.label}
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Pied du Tiroir Mobile */}
                        <div className="pt-4 border-t border-[#EBEBEB]">
                            {isLoggedIn && user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-rose-50 text-[#C4320A] rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <LogOut size={16} /> Déconnexion
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-3 bg-[#0B54C2] hover:bg-[#09449E] text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                                >
                                    <User size={16} /> Se connecter / Créer un compte
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
