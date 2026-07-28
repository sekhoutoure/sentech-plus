'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { ProductGridSkeleton } from "@/components/SkeletonLoader"
import { MoveLeftIcon, SlidersHorizontalIcon, XIcon, ArrowUpDownIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { categories } from "@/assets/assets"

import JsonLd from "@/components/seo/JsonLd"
import { getBreadcrumbSchema } from "@/lib/seo"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Boutique', url: '/shop' }
    ]

    const products = useSelector((state: any) => state.product.list)
    const [selectedCategory, setSelectedCategory] = useState("Tous")
    const [sortBy, setSortBy] = useState("default")

    const categoryList = ["Tous", ...categories]

    // Category & Search Filtering + Sorting
    const filteredProducts = useMemo(() => {
        let list = [...products]

        // Search query filter
        if (search) {
            list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        }

        // Category filter
        if (selectedCategory !== "Tous") {
            list = list.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())
        }

        // Sorting
        if (sortBy === "price-low") {
            list.sort((a: any, b: any) => Number(a.price) - Number(b.price))
        } else if (sortBy === "price-high") {
            list.sort((a: any, b: any) => Number(b.price) - Number(a.price))
        } else if (sortBy === "newest") {
            list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }

        return list
    }, [products, search, selectedCategory, sortBy])

    const resetFilters = () => {
        setSelectedCategory("Tous")
        setSortBy("default")
        if (search) {
            router.push('/shop')
        }
    }

    return (
        <div className="min-h-[70vh] px-4 sm:px-6">
            <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
            <div className="max-w-7xl mx-auto py-6">
                
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                    <div>
                        <h1 onClick={() => router.push('/shop')} className="text-2xl sm:text-3xl text-slate-500 flex items-center gap-2 cursor-pointer font-light">
                            {search && <MoveLeftIcon size={22} className="text-blue-600" />} 
                            Tous les <span className="text-slate-900 font-bold">Produits</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-100/80 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-600 border border-slate-200/80">
                            <ArrowUpDownIcon size={15} className="text-blue-600" />
                            <span className="font-medium hidden sm:inline">Trier par :</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer font-semibold text-slate-800"
                            >
                                <option value="default">Par défaut</option>
                                <option value="price-low">Prix : croissant</option>
                                <option value="price-high">Prix : décroissant</option>
                                <option value="newest">Plus récents</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories Filter Pills */}
                <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <SlidersHorizontalIcon size={14} /> Catégories :
                    </span>
                    {categoryList.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-103'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}

                    {(selectedCategory !== "Tous" || search || sortBy !== "default") && (
                        <button
                            onClick={resetFilters}
                            className="ml-auto shrink-0 text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition"
                        >
                            <XIcon size={13} /> Réinitialiser
                        </button>
                    )}
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="my-20 text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xl font-semibold text-slate-700">Aucun produit ne correspond à votre recherche</p>
                        <p className="text-sm text-slate-400 mt-2">Essayez de modifier vos filtres ou d'explorer d'autres catégories.</p>
                        <button
                            onClick={resetFilters}
                            className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-full hover:bg-blue-700 transition"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto p-6">
        <ProductGridSkeleton count={8} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}