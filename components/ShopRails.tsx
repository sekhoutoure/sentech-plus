'use client'
import React, { useRef } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { ChevronRight, ArrowRight, Star } from 'lucide-react'
import { assets } from '@/assets/assets'

interface BrandCard {
    title: string;
    subtitle: string;
    bgImage: string | StaticImageData;
    query: string;
    rating: string;
    reviewsCount: string;
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
                    title: "APPLE",
                    subtitle: "iPhone, MagSafe & AirPods",
                    bgImage: assets.product_img8,
                    query: "Smartphones",
                    rating: "4.9",
                    reviewsCount: "48,2 k",
                    thumbnails: [assets.product_img8, assets.product_img3, assets.product_img4]
                },
                {
                    title: "SAMSUNG",
                    subtitle: "Galaxy AMOLED & Ultra Series",
                    bgImage: assets.product_img8,
                    query: "Smartphones",
                    rating: "4.8",
                    reviewsCount: "32,4 k",
                    thumbnails: [assets.product_img8, assets.product_img2, assets.product_img5]
                },
                {
                    title: "SPIGEN",
                    subtitle: "Protection antichoc & verres 9H",
                    bgImage: assets.product_img2,
                    query: "Accessoires",
                    rating: "4.9",
                    reviewsCount: "15,8 k",
                    thumbnails: [assets.product_img2, assets.product_img8, assets.product_img1]
                },
            ]
        },
        {
            sectionTitle: "Audio & Écouteurs Pro",
            sectionSubtitle: "Immersion sonore haute fidélité & réduction de bruit",
            exploreQuery: "Casques",
            cards: [
                {
                    title: "SONY AUDIO",
                    subtitle: "Casques ANC & 360 Reality Audio",
                    bgImage: assets.product_img3,
                    query: "Casques",
                    rating: "4.9",
                    reviewsCount: "62,1 k",
                    thumbnails: [assets.product_img3, assets.product_img5, assets.product_img4]
                },
                {
                    title: "JBL SOUND",
                    subtitle: "Enceintes Bluetooth & basses profondes",
                    bgImage: assets.product_img5,
                    query: "Enceintes",
                    rating: "4.8",
                    reviewsCount: "41,9 k",
                    thumbnails: [assets.product_img5, assets.product_img3, assets.product_img2]
                },
                {
                    title: "BOSE",
                    subtitle: "Confort suprême & clarté vocale",
                    bgImage: assets.product_img4,
                    query: "Casques",
                    rating: "4.9",
                    reviewsCount: "29,4 k",
                    thumbnails: [assets.product_img4, assets.product_img3, assets.product_img8]
                },
            ]
        },
        {
            sectionTitle: "Gaming & Setup Pro",
            sectionSubtitle: "Périphériques haute précision & confort esport",
            exploreQuery: "Gaming",
            cards: [
                {
                    title: "RAZER",
                    subtitle: "Capteurs optiques Chroma RGB",
                    bgImage: assets.product_img1,
                    query: "Gaming",
                    rating: "4.9",
                    reviewsCount: "84,0 k",
                    thumbnails: [assets.product_img1, assets.product_img3, assets.product_img7]
                },
                {
                    title: "LOGITECH G",
                    subtitle: "Laptops & bureautique haute performance",
                    bgImage: assets.product_img7,
                    query: "Laptops",
                    rating: "4.8",
                    reviewsCount: "53,2 k",
                    thumbnails: [assets.product_img7, assets.product_img1, assets.product_img2]
                },
                {
                    title: "CORSAIR",
                    subtitle: "Setup streaming & accessoires",
                    bgImage: assets.product_img3,
                    query: "Gaming",
                    rating: "4.8",
                    reviewsCount: "21,7 k",
                    thumbnails: [assets.product_img3, assets.product_img1, assets.product_img6]
                },
            ]
        },
        {
            sectionTitle: "Maison Intelligente & Énergie",
            sectionSubtitle: "Chargeurs GaN rapides, power banks & domotique",
            exploreQuery: "Maison",
            cards: [
                {
                    title: "ANKER",
                    subtitle: "Chargeurs GaN 65W-140W multi-ports",
                    bgImage: assets.product_img2,
                    query: "Chargeurs",
                    rating: "4.9",
                    reviewsCount: "95,4 k",
                    thumbnails: [assets.product_img2, assets.product_img8, assets.product_img7]
                },
                {
                    title: "XIAOMI HOME",
                    subtitle: "Lampes connectées & domotique",
                    bgImage: assets.product_img6,
                    query: "Maison",
                    rating: "4.8",
                    reviewsCount: "37,6 k",
                    thumbnails: [assets.product_img6, assets.product_img5, assets.product_img4]
                },
                {
                    title: "BASEUS",
                    subtitle: "Power Banks 30 000mAh & Hubs",
                    bgImage: assets.product_img2,
                    query: "Accessoires",
                    rating: "4.8",
                    reviewsCount: "19,8 k",
                    thumbnails: [assets.product_img2, assets.product_img8, assets.product_img1]
                },
            ]
        }
    ];

    return (
        <div className="space-y-12 sm:space-y-16 max-w-[1400px] mx-auto px-4 sm:px-6 my-10">
            {railSections.map((section, sIdx) => {
                const scrollContainerRef = useRef<HTMLDivElement>(null)

                const handleScrollRight = () => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' })
                    }
                }

                return (
                    <section key={sIdx} className="relative">
                        
                        {/* Rail Header */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <Link 
                                    href={`/shop?search=${encodeURIComponent(section.exploreQuery)}`}
                                    className="group inline-flex items-center gap-1.5 text-lg sm:text-2xl font-black text-[#101828] hover:text-[#1769FF] transition-colors tracking-tight"
                                >
                                    <span>{section.sectionTitle}</span>
                                    <ChevronRight size={22} className="text-[#667085] group-hover:text-[#1769FF] group-hover:translate-x-1 transition-transform" />
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

                        {/* Rail Cards Carousel (Exact Shop.app 3-in-1 layout) */}
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
                                        {/* Main Card Image with Rating and Big Centered Wordmark */}
                                        <div className="relative h-48 sm:h-56 w-full bg-[#F7F9FC] overflow-hidden flex items-center justify-center p-6">
                                            <Image
                                                src={card.bgImage}
                                                alt={card.title}
                                                fill
                                                className="object-cover group-hover/card:scale-108 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

                                            {/* Rating Top Left */}
                                            <div className="absolute top-3.5 left-3.5 flex items-center gap-1 text-white text-[11px] font-bold drop-shadow-md">
                                                <Star size={12} fill="white" className="text-white" />
                                                <span>{card.rating} ({card.reviewsCount})</span>
                                            </div>

                                            {/* Big Bold Brand Name Center */}
                                            <div className="relative z-10 text-center text-white space-y-1">
                                                <h3 className="text-2xl sm:text-3xl font-black tracking-widest uppercase drop-shadow-lg">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-slate-200 font-medium line-clamp-1 drop-shadow-sm">
                                                    {card.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 3 Product Thumbnails (Exact Shop.app Feature) */}
                                        <div className="p-3 bg-white grid grid-cols-3 gap-2.5 border-t border-[#EBEBEB]">
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

                            {/* Floating Right Scroll Arrow Button */}
                            <button
                                onClick={handleScrollRight}
                                aria-label="Faire défiler vers la droite"
                                className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 size-11 rounded-full bg-white text-[#101828] shadow-2xl border border-[#EBEBEB] items-center justify-center hover:bg-[#1769FF] hover:text-white transition-all duration-200 opacity-0 group-hover/rail:opacity-100 z-20 cursor-pointer"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </div>

                    </section>
                )
            })}
        </div>
    )
}
