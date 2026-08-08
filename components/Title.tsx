'use client'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface TitleProps {
    title: string;
    subtitle?: string;
    description?: string;
    visibleButton?: boolean;
    href?: string;
    badgeText?: string;
}

const Title: React.FC<TitleProps> = ({
    title,
    description,
    visibleButton = true,
    href = '/shop',
    badgeText = 'SÉLECTION OFFICIELLE',
}) => {
    return (
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 mb-8'>
            <div className='space-y-2'>
                {/* Punchy High-Contrast Pill Tag */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    <Sparkles size={12} className="text-cyan-200 fill-cyan-200" />
                    <span>{badgeText}</span>
                </div>

                {/* Main Heading */}
                <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block'>
                    {title}
                </h2>

                {/* Subtitle / Description */}
                {description && (
                    <p className='text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed'>
                        {description}
                    </p>
                )}
            </div>

            {/* Action Link Button */}
            {visibleButton && href && (
                <Link
                    href={href}
                    className='inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-4 py-2.5 rounded-full transition-all duration-200 group self-start sm:self-auto border border-blue-200 shadow-2xs active:scale-95'
                >
                    <span>Voir tout le catalogue</span>
                    <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' />
                </Link>
            )}
        </div>
    )
}

export default Title
