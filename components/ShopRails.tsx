'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { ChevronRight, ArrowRight, Sparkles, Flame } from 'lucide-react'
import { assets } from '@/assets/assets'

interface BrandCard {
    title: string;
    subtitle: string;
    bgImage: string | StaticImageData;
    query: string;
    badge?: string;
    thumbnails: (string | StaticImageData)[];
}

interface RailSection {
    sectionTitle: string;
    sectionSubtitle: string;
    exploreQuery: string;
    cards: BrandCard[];
}

export default function ShopRails() {
    const railSections: RailSection[] = [
        {
            sectionTitle: "Smartphones & Accessoires",
            sectionSubtitle: "Les meilleures marques et accessoires phares",
            exploreQuery: "Smartphones",
            cards: [
                {
                    title: "Apple & iOS Gear",
                    subtitle: "iPhone, MagSafe & AirPods",
                    bgImage: assets.product_img8,
                    query: "Smartphones",
                    badge: "Populaire",
                    thumbnails: [assets.product_img8, assets.product_img3, assets.product_img4]
                },
                {
                    title: "Samsung Galaxy",
                    subtitle: "Écrans AMOLED & charge rapide",
                    bgImage: assets.product_img8,
                    query: "Smartphones",
                    badge: "Certifié",
                    thumbnails: [assets.product_img8, assets.product_img2, assets.product_img5]
                },
                {
                    title: "Protection & Énergie",
                    subtitle: "Chargeurs rapides & câbles tressés",
                    bgImage: assets.product_img2,
                    query: "Accessoires",
                    thumbnails: [assets.product_img2, assets.product_img1, assets.product_img6]
                },
            ]
        },
        {
            sectionTitle: "Audio, Casques & Écouteurs",
            sectionSubtitle: "Immersion sonore haute fidélité & réduction de bruit",
            exploreQuery: "Casques",
            cards: [
                {
                    title: "Wireless Pro Audio",
                    subtitle: "Casques ANC & isolation active",
                    bgImage: assets.product_img3,
                    query: "Casques",
                    badge: "Top Vente",
                    thumbnails: [assets.product_img3, assets.product_img5, assets.product_img4]
                },
                {
                    title: "Enceintes Bluetooth",
                    subtitle: "Son nomade & basses puissantes",
                    bgImage: assets.product_img5,
                    query: "Enceintes",
                    thumbnails: [assets.product_img5, assets.product_img3, assets.product_img2]
                },
                {
                    title: "Montres & Écouteurs Sport",
                    subtitle: "Cardio, GPS & étanchéité IP68",
                    bgImage: assets.product_img4,
                    query: "Montres",
                    thumbnails: [assets.product_img4, assets.product_img3, assets.product_img8]
                },
            ]
        },
        {
            sectionTitle: "Gaming & Setup Pro",
            sectionSubtitle: "Périphériques haute précision & confort ultime",
            exploreQuery: "Gaming",
            cards: [
                {
                    title: "Souris & Claviers RGB",
                    subtitle: "Capteurs optiques 16 000 DPI",
                    bgImage: assets.product_img1,
                    query: "Gaming",
                    badge: "Esport",
                    thumbnails: [assets.product_img1, assets.product_img3, assets.product_img7]
                },
                {
                    title: "Laptops & Performances",
                    subtitle: "Processeurs ultra-rapides & bureautique",
                    bgImage: assets.product_img7,
                    query: "Laptops",
                    thumbnails: [assets.product_img7, assets.product_img1, assets.product_img2]
                },
                {
                    title: "Setup & Accessoires",
                    subtitle: "Casques gamer & supports",
                    bgImage: assets.product_img3,
                    query: "Gaming",
                    thumbnails: [assets.product_img3, assets.product_img1, assets.product_img4]
                },
            ]
        },
        {
            sectionTitle: "Maison Intelligente & Énergie",
            sectionSubtitle: "Chargeurs GaN rapides, power banks & smart home",
            exploreQuery: "Maison",
            cards: [
                {
                    title: "Chargeurs Rapides GaN",
                    subtitle: "65W à 140W multi-ports",
                    bgImage: assets.product_img2,
                    query: "Chargeurs",
                    badge: "Indispensable",
                    thumbnails: [assets.product_img2, assets.product_img8, assets.product_img7]
                },
                {
                    title: "Smart Home & Éclairage",
                    subtitle: "Lampes connectées & ambiance LED",
                    bgImage: assets.product_img6,
                    query: "Maison",
                    thumbnails: [assets.product_img6, assets.product_img5, assets.product_img4]
                },
                {
                    title: "Power Banks Haute Capacité",
                    subtitle: "20 000mAh à 50 000mAh nomade",
                    bgImage: assets.product_img2,
                    query: "Accessoires",
                    thumbnails: [assets.product_img2, assets.product_img8, assets.product_img1]
                },
            ]
        }
    ];

    return (
        <div className="space-y-12 sm:space-y-16 max-w-[1400px] mx-auto px-4 sm:px-6 my-8">
            {railSections.map((section, sIdx) => {
                const scrollContainerRef = useRef<HTMLDivElement>(null)

                const handleScrollRight = () => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
                    }
                }

                return (
                    <section key={sIdx} className="relative">
                        
                        {/* Rail Header */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <Link 
                                    href={`/shop?search=${encodeURIComponent(section.exploreQuery)}`}
                                    className="group inline-flex items-center gap-1.5 text-lg sm:text-2xl font-extrabold text-[#101828] hover:text-[#1769FF] transition-colors"
                                >
                                    <span>{section.sectionTitle}</span>
                                    <ChevronRight size={20} className="text-[#667085] group-hover:text-[#1769FF] group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-xs text-[#667085] mt-0.5">
                                    {section.sectionSubtitle}
                                </p>
                            </div>

                            <Link
                                href={`/shop?search=${encodeURIComponent(section.exploreQuery)}`}
                                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#1769FF] hover:underline"
                            >
                                <span>Tout voir</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {/* Rail Cards Container with Right Scroll Arrow (Exact Shop.app style) */}
                        <div className="relative group/rail">
                            <div 
                                ref={scrollContainerRef}
                                className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
                            >
                                {section.cards.map((card, cIdx) => (
                                    <Link
                                        key={cIdx}
                                        href={`/shop?search=${encodeURIComponent(card.query)}`}
                                        className="relative flex-1 min-w-[280px] sm:min-w-[340px] max-w-[420px] rounded-3xl overflow-hidden bg-white border border-[#EBEBEB] shadow-sm hover:shadow-xl hover:border-[#1769FF]/40 transition-all duration-300 flex flex-col justify-between group/card hover:-translate-y-1"
                                    >
                                        {/* Top Hero Banner of the Card */}
                                        <div className="relative h-44 sm:h-52 w-full bg-[#F7F9FC] overflow-hidden flex items-center justify-center p-6">
                                            {/* Background Image with Zoom */}
                                            <Image
                                                src={card.bgImage}
                                                alt={card.title}
                                                fill
                                                className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                                            {/* Badge Top Left */}
                                            {card.badge && (
                                                <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#101828] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                                                    {card.badge}
                                                </span>
                                            )}

                                            {/* Title Center Overlay */}
                                            <div className="relative z-10 text-center text-white space-y-1">
                                                <h3 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-slate-200 font-medium line-clamp-1 drop-shadow-sm">
                                                    {card.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom Row of 3 Thumbnails (Exact Shop.app Signature Feature) */}
                                        <div className="p-3 bg-white grid grid-cols-3 gap-2 border-t border-[#EBEBEB]">
                                            {card.thumbnails.map((thumbSrc, tIdx) => (
                                                <div
                                                    key={tIdx}
                                                    className="relative aspect-square rounded-2xl bg-[#F7F9FC] border border-[#EBEBEB] p-1.5 flex items-center justify-center overflow-hidden group-hover/card:border-[#1769FF]/30 transition-colors"
                                                >
                                                    <Image
                                                        src={thumbSrc}
                                                        alt="Thumbnail"
                                                        fill
                                                        className="object-contain p-1 group-hover/card:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Floating Right Scroll Arrow Button (Shop.app style) */}
                            <button
                                onClick={handleScrollRight}
                                aria-label="Faire défiler vers la droite"
                                className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white text-[#101828] shadow-xl border border-[#EBEBEB] items-center justify-center hover:bg-[#1769FF] hover:text-white transition-all duration-200 opacity-0 group-hover/rail:opacity-100 z-20 cursor-pointer"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                    </section>
                )
            })}
        </div>
    )
}
