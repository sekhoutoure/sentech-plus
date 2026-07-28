'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { useSelector } from 'react-redux'
import Link from 'next/link'

const Hero: React.FC = () => {
    const siteSettings = useSelector((state: any) => state.siteSettings)
    const currency = siteSettings?.currencySymbol || '$'
    const hero = siteSettings?.hero

    const products = useSelector((state: any) => state.product.list)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    
    // Extract top 4 product images
    const featuredImages = products?.slice(0, 4).map((p: any) => p.images[0]).filter(Boolean) || []

    useEffect(() => {
        if (featuredImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % featuredImages.length)
        }, 3500) // Change image every 3.5 seconds
        return () => clearInterval(interval)
    }, [featuredImages.length])

    return (
        <div className='px-4 sm:px-6 relative'>
            <div className='flex max-xl:flex-col gap-6 sm:gap-8 max-w-7xl mx-auto my-8 sm:my-12'>
                {/* Main Hero Card */}
                <div className='relative flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2rem] sm:rounded-[2.5rem] xl:min-h-100 group shadow-2xl text-white overflow-hidden border border-slate-800'>
                    
                    {/* Glowing Orbs Background (Optimized: No animation on blurs) */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

                    <div className='p-6 sm:p-14 lg:p-16 z-10 flex flex-col justify-center h-full'>
                        <h1 className='text-3xl sm:text-5xl lg:text-6xl leading-[1.15] sm:leading-[1.1] mt-2 sm:mt-4 mb-3 sm:mb-4 font-extrabold tracking-tight text-white max-w-[280px] sm:max-w-lg drop-shadow-sm'>
                            {hero?.title || "Des accessoires qu'on adore. Des prix de confiance."}
                        </h1>
                        
                        {hero?.subtitle && (
                            <p className='text-slate-300/90 text-sm sm:text-lg font-medium max-w-[260px] sm:max-w-md leading-relaxed mb-4'>
                                {hero.subtitle}
                            </p>
                        )}
                        
                        <div className='flex items-baseline gap-2 mt-2 sm:mt-4'>
                            <p className='text-slate-400 text-sm sm:text-base font-medium'>À partir de</p>
                            <p className='text-3xl sm:text-4xl font-black text-blue-400'>{currency}4.90</p>
                        </div>
                        
                        <div className="mt-6 sm:mt-10 relative z-20">
                            <Link href="/shop" className='relative w-full sm:w-auto inline-flex items-center justify-center bg-white text-slate-900 text-sm font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] overflow-hidden group/btn'>
                                <span className="relative z-10">{hero?.ctaText || "DÉCOUVRIR MAINTENANT"}</span>
                                <div className="absolute inset-0 w-full h-full bg-slate-100 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                            </Link>
                        </div>
                    </div>

                    {/* Dynamic Image Slideshow */}
                    <div className='relative sm:absolute bottom-0 right-0 md:right-4 lg:right-10 w-full max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto sm:mx-0 h-[280px] sm:h-full mt-4 sm:mt-0 z-10 pointer-events-none overflow-hidden sm:overflow-visible'>
                        {featuredImages.length > 0 ? (
                            featuredImages.map((src: string, index: number) => (
                                <Image 
                                    key={index}
                                    className={`absolute bottom-0 left-0 sm:left-auto sm:right-0 w-full h-full object-contain transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] group-hover:scale-[1.05] group-hover:-translate-y-2 origin-bottom ${
                                        index === currentImageIndex 
                                        ? 'opacity-100 scale-100 translate-x-0' 
                                        : 'opacity-0 scale-95 translate-x-8'
                                    }`} 
                                    src={src} 
                                    alt={`Featured Product ${index + 1}`} 
                                    width={500} 
                                    height={500} 
                                    priority={index === 0}
                                />
                            ))
                        ) : (
                            <Image className='absolute bottom-0 right-0 w-full h-full object-contain opacity-90 drop-shadow-2xl' src={assets.hero_model_img} alt="Hero Model" priority />
                        )}
                    </div>
                </div>

                {/* Side Cards */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-4 sm:gap-6 w-full xl:max-w-[22rem] text-sm text-slate-600'>
                    
                    {/* Dark Card */}
                    <div className='relative flex-1 flex items-center justify-between w-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 group border border-slate-700/50 text-white shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer'>
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full transition-opacity duration-500 group-hover:bg-blue-500/20"></div>
                        <div className="relative z-10">
                            <p className='text-2xl sm:text-3xl font-bold text-white max-w-[7rem] sm:max-w-[8rem] leading-tight'>Meilleurs produits</p>
                            <p className='flex items-center gap-1 mt-3 sm:mt-5 text-blue-400 font-semibold text-[10px] sm:text-xs tracking-wider uppercase'>Voir plus <ArrowRightIcon className='group-hover:translate-x-2 transition-transform duration-300 w-3.5 h-3.5 sm:w-4 sm:h-4' /> </p>
                        </div>
                        <Image className='w-28 sm:w-36 lg:w-40 relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-xl' src={assets.hero_product_img1} alt="Products" />
                    </div>

                    {/* Light Card */}
                    <div className='relative flex-1 flex items-center justify-between w-full bg-gradient-to-br from-blue-50 to-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 group border border-blue-100 text-slate-800 shadow-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 cursor-pointer'>
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/5 blur-2xl rounded-full transition-opacity duration-500 group-hover:bg-blue-400/10"></div>
                        <div className="relative z-10">
                            <p className='text-2xl sm:text-3xl font-bold text-blue-950 max-w-[7rem] sm:max-w-[8rem] leading-tight'>20% de réduction</p>
                            <p className='flex items-center gap-1 mt-3 sm:mt-5 text-blue-600 font-semibold text-[10px] sm:text-xs tracking-wider uppercase'>Voir plus <ArrowRightIcon className='group-hover:translate-x-2 transition-transform duration-300 w-3.5 h-3.5 sm:w-4 sm:h-4' /> </p>
                        </div>
                        <Image className='w-28 sm:w-36 lg:w-40 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-xl' src={assets.hero_product_img2} alt="Discount" />
                    </div>

                </div>
            </div>
            
            <div className="mt-4 sm:mt-8">
                <CategoriesMarquee />
            </div>
        </div>

    )
}

export default Hero
