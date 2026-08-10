'use client'
import React, { useState, useEffect } from 'react'
import { SlidersHorizontal, X, Check, ArrowUpDown, Tag, DollarSign, RotateCcw } from 'lucide-react'
import { categories } from '@/assets/assets'

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategory: string;
    setSelectedCategory: (cat: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    priceRange: string;
    setPriceRange: (range: string) => void;
    totalResults: number;
    onReset: () => void;
}

const sortOptions = [
    { id: 'default', label: 'Populaires & Tendances' },
    { id: 'price-low', label: 'Prix : Moins cher d\'abord' },
    { id: 'price-high', label: 'Prix : Plus cher d\'abord' },
    { id: 'newest', label: 'Nouveautés 2026' },
]

const priceRanges = [
    { id: 'all', label: 'Tous les prix' },
    { id: 'under-50k', label: 'Moins de 50 000 FCFA' },
    { id: '50k-150k', label: '50 000 - 150 000 FCFA' },
    { id: 'over-150k', label: 'Plus de 150 000 FCFA' },
]

const categoryList = ["Tous", ...categories, "Smartphones", "Laptops", "Gaming"]

export default function MobileFilterDrawer({
    isOpen,
    onClose,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    totalResults,
    onReset
}: MobileFilterDrawerProps) {
    // Bloquer le défilement arrière en ouverture
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const activeFilterCount = (selectedCategory !== 'Tous' ? 1 : 0) + (sortBy !== 'default' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0)

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
            {/* Backdrop Blur */}
            <div 
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in" 
            />

            {/* Bottom Sheet Modal Container */}
            <div className="relative z-10 bg-white w-full rounded-t-[28px] border-t border-[#E8EDF3] shadow-[0_-10px_40px_rgba(15,23,42,0.15)] flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                
                {/* Drag Handle Top Indicator */}
                <div className="pt-3 pb-1 flex justify-center shrink-0">
                    <div className="w-12 h-1.5 bg-slate-300 rounded-full cursor-grab" />
                </div>

                {/* Header Title & Close */}
                <div className="px-5 py-3 border-b border-[#E8EDF3] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-xl bg-[#EAF3FF] text-[#0B54C2] flex items-center justify-center font-bold">
                            <SlidersHorizontal size={16} />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-[#182230] leading-none">
                                Filtres & Tri Tactiles
                            </h2>
                            <span className="text-[11px] text-[#475467] font-medium">
                                {totalResults} équipement{totalResults > 1 ? 's' : ''} disponible{totalResults > 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="size-8 rounded-full bg-[#F5F7FA] text-[#475467] hover:text-[#182230] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Fermer le tiroir de filtres"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content Body */}
                <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
                    
                    {/* Section 1: Rayons & Catégories */}
                    <div className="space-y-2.5">
                        <label className="font-extrabold text-[#182230] text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <Tag size={13} className="text-[#0B54C2]" />
                            <span>Rayons & Catégories</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categoryList.map((cat, idx) => {
                                const isSelected = selectedCategory === cat
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                            isSelected
                                                ? 'bg-[#0B54C2] text-white shadow-xs scale-105'
                                                : 'bg-[#F5F7FA] text-[#182230] hover:bg-[#E8EDF3] border border-[#E8EDF3]'
                                        }`}
                                    >
                                        {isSelected && <Check size={12} />}
                                        <span>{cat}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Section 2: Trier Par */}
                    <div className="space-y-2.5 pt-3 border-t border-[#E8EDF3]">
                        <label className="font-extrabold text-[#182230] text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <ArrowUpDown size={13} className="text-[#0B54C2]" />
                            <span>Ordre d'affichage</span>
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {sortOptions.map((opt) => {
                                const isSelected = sortBy === opt.id
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSortBy(opt.id)}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-between border ${
                                            isSelected
                                                ? 'bg-[#EAF3FF] text-[#0B54C2] border-[#0B54C2]/40 font-extrabold'
                                                : 'bg-[#F5F7FA] text-[#182230] border-[#E8EDF3] hover:bg-[#E8EDF3]'
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && <Check size={15} className="text-[#0B54C2]" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Section 3: Tranche de Prix */}
                    <div className="space-y-2.5 pt-3 border-t border-[#E8EDF3]">
                        <label className="font-extrabold text-[#182230] text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <DollarSign size={13} className="text-[#0B54C2]" />
                            <span>Tranche de Prix (FCFA)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {priceRanges.map((pr) => {
                                const isSelected = priceRange === pr.id
                                return (
                                    <button
                                        key={pr.id}
                                        onClick={() => setPriceRange(pr.id)}
                                        className={`px-3 py-2.5 rounded-xl text-[11px] font-bold text-center transition-all duration-200 border ${
                                            isSelected
                                                ? 'bg-[#0B54C2] text-white border-[#0B54C2] shadow-xs'
                                                : 'bg-[#F5F7FA] text-[#182230] border-[#E8EDF3] hover:bg-[#E8EDF3]'
                                        }`}
                                    >
                                        {pr.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* Footer Action Buttons Sticky */}
                <div className="p-4 border-t border-[#E8EDF3] bg-white flex items-center gap-3 shrink-0 rounded-b-none">
                    {activeFilterCount > 0 && (
                        <button
                            onClick={onReset}
                            className="inline-flex items-center gap-1 bg-[#FFF1F0] text-[#C4320A] font-extrabold px-3 py-3 rounded-xl hover:bg-rose-100 transition cursor-pointer text-xs shrink-0"
                            title="Réinitialiser"
                        >
                            <RotateCcw size={14} />
                            <span>Effacer</span>
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#0B54C2] hover:bg-[#09449E] text-white font-black text-sm py-3 px-5 rounded-xl shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span>Afficher les {totalResults} produit{totalResults > 1 ? 's' : ''}</span>
                    </button>
                </div>

            </div>
        </div>
    )
}
