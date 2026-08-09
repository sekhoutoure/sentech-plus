'use client'
import React from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { ChevronRight } from 'lucide-react'
import { assets } from '@/assets/assets'

interface SubCategory {
    title: string;
    image: string | StaticImageData;
    query: string;
}

interface QuadrantTile {
    title: string;
    query: string;
    subCategories: SubCategory[];
}

export default function ShopQuadrantGrid() {
    const quadrants: QuadrantTile[] = [
        {
            title: "Smartphones & iOS",
            query: "Smartphones",
            subCategories: [
                { title: "iPhones", image: assets.product_img8, query: "Smartphones" },
                { title: "Galaxy", image: assets.product_img8, query: "Smartphones" },
                { title: "Coques Pro", image: assets.product_img2, query: "Accessoires" },
                { title: "Verres Trempés", image: assets.product_img2, query: "Accessoires" },
            ]
        },
        {
            title: "Audio & Écouteurs",
            query: "Casques",
            subCategories: [
                { title: "Casques ANC", image: assets.product_img3, query: "Casques" },
                { title: "Écouteurs TWS", image: assets.product_img4, query: "Casques" },
                { title: "Enceintes", image: assets.product_img5, query: "Enceintes" },
                { title: "Barres de Son", image: assets.product_img5, query: "Enceintes" },
            ]
        },
        {
            title: "Gaming & Setup",
            query: "Gaming",
            subCategories: [
                { title: "Souris RGB", image: assets.product_img1, query: "Gaming" },
                { title: "Laptops Pro", image: assets.product_img7, query: "Laptops" },
                { title: "Claviers", image: assets.product_img1, query: "Gaming" },
                { title: "Manettes", image: assets.product_img6, query: "Gaming" },
            ]
        },
        {
            title: "Maison & Énergie",
            query: "Maison",
            subCategories: [
                { title: "Chargeurs GaN", image: assets.product_img2, query: "Chargeurs" },
                { title: "Smart Lampes", image: assets.product_img6, query: "Maison" },
                { title: "Power Banks", image: assets.product_img2, query: "Accessoires" },
                { title: "Hubs USB-C", image: assets.product_img7, query: "Accessoires" },
            ]
        }
    ];

    return (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {quadrants.map((quad, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-4 border border-[#EBEBEB] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.01] hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between">
                        
                        {/* Title with Arrow */}
                        <div className="flex items-center justify-between pb-3 px-1">
                            <Link 
                                href={`/shop?search=${encodeURIComponent(quad.query)}`}
                                className="group flex items-center gap-1 text-xl font-black text-[#101828] hover:text-[#1769FF] transition-colors"
                            >
                                <span>{quad.title}</span>
                                <ChevronRight size={18} className="text-[#667085] group-hover:text-[#1769FF] group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* 2x2 Sub-Cards Grid (Exact Shop.app Quadrant Pattern) */}
                        <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
                            {quad.subCategories.map((sub, sIdx) => (
                                <Link
                                    key={sIdx}
                                    href={`/shop?search=${encodeURIComponent(sub.query)}`}
                                    className="group/sub relative h-28 sm:h-32 rounded-2xl overflow-hidden bg-[#F7F9FC] border border-[#EBEBEB]/80 flex flex-col justify-end p-3 transition-all hover:border-[#1769FF]/40"
                                >
                                    <Image
                                        src={sub.image}
                                        alt={sub.title}
                                        fill
                                        className="object-cover group-hover/sub:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
                                    <span className="relative z-10 text-[12px] font-extrabold text-white leading-none drop-shadow-md truncate">
                                        {sub.title}
                                    </span>
                                </Link>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
}
