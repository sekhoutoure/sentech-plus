'use client'
import React from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function Banner() {
    const [isOpen, setIsOpen] = React.useState(true);
    const banner = useSelector((state: any) => state.siteSettings?.banner)

    if (!banner?.enabled || !isOpen) return null;

    const handleClaim = () => {
        setIsOpen(false);
        toast.success(`Code promo ${banner.couponCode || 'NEW20'} copié dans le presse-papiers !`);
        navigator.clipboard.writeText(banner.couponCode || 'NEW20');
    };

    return (
        <div className="w-full px-4 sm:px-6 py-2.5 sm:py-2 font-medium text-xs sm:text-sm text-white text-center bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 shadow-sm relative z-[60]">
            <div className='flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 max-w-7xl mx-auto pr-6 sm:pr-0'>
                <p className="flex items-center justify-center gap-2 text-center w-full sm:w-auto leading-snug">{banner.text}</p>
                <div className="flex items-center justify-center gap-4 w-full sm:w-auto mt-1 sm:mt-0">
                    {banner.buttonText && (
                        <button onClick={handleClaim} type="button" className="font-bold text-slate-900 bg-white hover:bg-blue-50 px-5 py-1.5 rounded-full transition text-[11px] sm:text-xs shadow-sm cursor-pointer whitespace-nowrap">
                            {banner.buttonText}
                        </button>
                    )}
                </div>
                {/* Close Button - Absolutely positioned on mobile to avoid breaking the flex column */}
                <button onClick={() => setIsOpen(false)} type="button" className="absolute right-2 top-2 sm:relative sm:right-auto sm:top-auto font-normal text-white/70 hover:text-white p-1.5 rounded-full cursor-pointer transition">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="currentColor" />
                        <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
