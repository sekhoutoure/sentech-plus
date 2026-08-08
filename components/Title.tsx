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
        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-8'>
            <div className='space-y-1.5'>
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest border border-blue-200 dark:border-blue-800/60 shadow-xs">
                    <Sparkles size={11} className="text-blue-600 dark:text-cyan-400" />
                    <span>{badgeText}</span>
                </div>

                {/* Main Heading */}
                <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight'>
                    {title}
                </h2>

                {/* Subtitle / Description */}
                {description && (
                    <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl'>
                        {description}
                    </p>
                )}
            </div>

            {/* Action Link Button */}
            {visibleButton && href && (
                <Link
                    href={href}
                    className='inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-all duration-200 group self-start sm:self-auto border border-blue-100 dark:border-slate-700 active:scale-95'
                >
                    <span>Voir tout</span>
                    <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform' />
                </Link>
            )}
        </div>
    )
}

export default Title
