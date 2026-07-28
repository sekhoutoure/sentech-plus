'use client'
import React from 'react'

export const ProductCardSkeleton = () => {
    return (
        <div className="w-full sm:w-60 animate-pulse space-y-3">
            <div className="bg-slate-200 h-40 sm:h-68 rounded-xl w-full" />
            <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="flex justify-between items-center pt-1">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/5" />
                </div>
            </div>
        </div>
    )
}

interface ProductGridSkeletonProps {
    count?: number;
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
    return (
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
            {Array(count).fill(0).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}

export default ProductCardSkeleton
