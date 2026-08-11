'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
    ChevronRight, 
    Sparkles, 
    Flame, 
    ShieldCheck, 
    ArrowRight,
    Smartphone,
    Laptop,
    Headphones,
    Watch,
    Gamepad2,
    Speaker,
    Plug,
    Home
} from 'lucide-react'
import { formatPrice } from '@/lib/format'

interface MegaMenuData {
    id: string
    label: string
    query: string
    icon: any
    subCategories: { name: string; query: string; badge?: string }[]
    brands: string[]
    featuredProduct: {
        id: string
        name: string
        price: number
        mrp?: number
        image: string
        category: string
        badge: string
    }
}

export const megaMenuDetails: Record<string, MegaMenuData> = {
    "Smartphones": {
        id: "Smartphones",
        label: "Smartphones",
        query: "Smartphones",
        icon: Smartphone,
        subCategories: [
            { name: "Série Apple iPhone 15 & 14", query: "iPhone", badge: "Populaire" },
            { name: "Samsung Galaxy S & Série A", query: "Samsung" },
            { name: "Xiaomi, Redmi & Poco", query: "Xiaomi" },
            { name: "Google Pixel & Android Pur", query: "Pixel" },
            { name: "Coques, Verres & Protections", query: "Coque" },
            { name: "Chargeurs Rapides & Magsafe", query: "Chargeur", badge: "Nouveau" }
        ],
        brands: ["Apple", "Samsung", "Xiaomi", "Google", "Huawei"],
        featuredProduct: {
            id: "prod_iphone15",
            name: "Apple iPhone 15 Pro 256GB Titanium",
            price: 790000,
            mrp: 850000,
            image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
            category: "Smartphones",
            badge: "-7% OFFRE FLASH"
        }
    },
    "Ordinateurs": {
        id: "Ordinateurs",
        label: "Ordinateurs",
        query: "Ordinateurs",
        icon: Laptop,
        subCategories: [
            { name: "Apple MacBook Pro & Air M3", query: "MacBook", badge: "Top 2026" },
            { name: "Laptops Gaming High-End", query: "Gaming Laptop" },
            { name: "Ordinateurs Portables HP & Dell", query: "HP" },
            { name: "Moniteurs & Écrans 4K 144Hz", query: "Moniteur" },
            { name: "Claviers, Souris & Hubs USB-C", query: "Souris" }
        ],
        brands: ["Apple", "HP", "Dell", "Lenovo", "Asus", "MSI"],
        featuredProduct: {
            id: "prod_macbook",
            name: "MacBook Pro 14 M3 Chip 16GB / 512GB",
            price: 1350000,
            mrp: 1450000,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
            category: "Ordinateurs",
            badge: "PROMO EXCLUSIVE"
        }
    },
    "Audio": {
        id: "Audio",
        label: "Audio",
        query: "Audio",
        icon: Headphones,
        subCategories: [
            { name: "Casques Réduction de Bruit (ANC)", query: "Casque", badge: "Recommandé" },
            { name: "Écouteurs True Wireless", query: "Écouteurs" },
            { name: "Enceintes Portables Waterproof", query: "Enceinte" },
            { name: "Barres de Son & Home Cinéma", query: "Barre de son" }
        ],
        brands: ["JBL", "Sony", "Bose", "Apple AirPods", "Sennheiser"],
        featuredProduct: {
            id: "prod_sony_anc",
            name: "Sony WH-1000XM5 Réduction de bruit",
            price: 215000,
            mrp: 250000,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
            category: "Audio",
            badge: "-14% MEILLEUR SON"
        }
    },
    "Gaming": {
        id: "Gaming",
        label: "Gaming",
        query: "Gaming",
        icon: Gamepad2,
        subCategories: [
            { name: "Consoles PS5 & Xbox Series X", query: "PS5", badge: "En Stock" },
            { name: "Manettes Sans Fil DualSense", query: "Manette" },
            { name: "Casques Gamer 7.1 Surround", query: "Casque Gamer" },
            { name: "Sièges & Bureau Ergonomique", query: "Chaise Gamer" }
        ],
        brands: ["PlayStation", "Xbox", "Nintendo", "Logitech G", "Razer"],
        featuredProduct: {
            id: "prod_ps5",
            name: "PlayStation 5 Slim Édition Standard 1TB",
            price: 395000,
            mrp: 440000,
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
            category: "Gaming",
            badge: "-10% PACK SÉNÉGAL"
        }
    }
}

interface HeaderMegaMenuProps {
    categoryKey: string;
    onClose: () => void;
}

export default function HeaderMegaMenu({ categoryKey, onClose }: HeaderMegaMenuProps) {
    const data = megaMenuDetails[categoryKey]

    if (!data) return null

    const IconComponent = data.icon

    return (
        <div 
            onMouseLeave={onClose}
            className="hidden lg:block absolute top-full left-0 right-0 z-[110] bg-white/98 backdrop-blur-xl border-b border-[#E8EDF3] shadow-[0_25px_60px_rgba(15,23,42,0.18)] animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-8 items-start">
                    
                    {/* Col 1: Sous-catégories principales (5 cols) */}
                    <div className="col-span-5 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-[#E8EDF3]">
                            <div className="size-8 rounded-xl bg-[#EAF3FF] text-[#0B54C2] flex items-center justify-center font-bold">
                                <IconComponent size={16} />
                            </div>
                            <span className="font-black text-sm text-[#182230] uppercase tracking-wider">
                                Rayon {data.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            {data.subCategories.map((sub, idx) => (
                                <Link
                                    key={idx}
                                    href={`/shop?search=${encodeURIComponent(sub.query)}`}
                                    onClick={onClose}
                                    className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors"
                                >
                                    <span className="text-xs font-bold text-[#182230] group-hover:text-[#0B54C2] transition-colors flex items-center gap-2">
                                        <ChevronRight size={14} className="text-slate-400 group-hover:text-[#0B54C2] group-hover:translate-x-0.5 transition-all" />
                                        <span>{sub.name}</span>
                                    </span>
                                    {sub.badge && (
                                        <span className="text-[9px] font-black text-[#0B54C2] bg-[#EAF3FF] border border-[#0B54C2]/20 px-2 py-0.5 rounded-full">
                                            {sub.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Marques Phares & Raccourcis Rapides (3 cols) */}
                    <div className="col-span-3 space-y-4 border-l border-[#E8EDF3] pl-8">
                        <div className="pb-2 border-b border-[#E8EDF3]">
                            <span className="font-black text-xs text-[#475467] uppercase tracking-wider">
                                Marques officielles
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {data.brands.map((brand, i) => (
                                <Link
                                    key={i}
                                    href={`/shop?search=${encodeURIComponent(brand)}`}
                                    onClick={onClose}
                                    className="text-xs font-extrabold text-[#182230] bg-[#F5F7FA] hover:bg-[#EAF3FF] hover:text-[#0B54C2] px-3 py-1.5 rounded-xl border border-[#E8EDF3] transition-all"
                                >
                                    {brand}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-3 space-y-2">
                            <Link
                                href={`/shop?category=${encodeURIComponent(data.query)}`}
                                onClick={onClose}
                                className="inline-flex items-center gap-1.5 text-xs font-black text-[#0B54C2] hover:underline"
                            >
                                <span>Voir tout le catalogue {data.label}</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>

                    {/* Col 3: Produit Vedette Highlight (4 cols) */}
                    <div className="col-span-4 border-l border-[#E8EDF3] pl-8">
                        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E8EDF3] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="bg-[#C4320A] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                                    {data.featuredProduct.badge}
                                </span>
                                <span className="text-[10px] font-bold text-[#085D38] bg-[#085D38]/10 px-2 py-0.5 rounded-full">
                                    En Stock Dakar
                                </span>
                            </div>

                            <div className="relative w-full aspect-4/3 rounded-xl bg-white border border-[#E8EDF3] overflow-hidden">
                                <Image
                                    src={data.featuredProduct.image}
                                    alt={data.featuredProduct.name}
                                    fill
                                    sizes="300px"
                                    className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-[#182230] line-clamp-1">
                                    {data.featuredProduct.name}
                                </h4>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-sm font-black text-[#182230]">
                                        {formatPrice(data.featuredProduct.price)}
                                    </span>
                                    {data.featuredProduct.mrp && (
                                        <span className="text-xs font-semibold text-[#475467] line-through">
                                            {formatPrice(data.featuredProduct.mrp)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Link
                                href={`/shop?search=${encodeURIComponent(data.query)}`}
                                onClick={onClose}
                                className="w-full bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer block text-center"
                            >
                                <span>Découvrir l'offre</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
