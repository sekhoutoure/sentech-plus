'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { ProductGridSkeleton } from "@/components/SkeletonLoader"
import { MoveLeftIcon, SlidersHorizontalIcon, XIcon, ArrowUpDownIcon, Sparkles } from "lucide-react"
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

    const products = useSelector((state: any) => state.product.list || [])
    const [selectedCategory, setSelectedCategory] = useState("Tous")
    const [sortBy, setSortBy] = useState("default")

    const categoryList = ["Tous", ...categories, "Smartphones", "Laptops"]

    // Category & Search Filtering + Sorting
    const filteredProducts = useMemo(() => {
        let list = [...products]

        // Search query filter
        if (search) {
            list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()))
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
            list.sort((a: any, b: any) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime())
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
            <div className="max-w-7xl mx-auto py-8">
                
                {/* Header Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest border border-blue-200 dark:border-blue-800/60 shadow-xs">
                            <Sparkles size={11} className="text-blue-600 dark:text-cyan-400" />
                            <span>CATALOGUE COMPLET</span>
                        </div>
                        <h1 onClick={() => router.push('/shop')} className="text-2xl sm:text-4xl text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer font-extrabold tracking-tight">
                            {search && <MoveLeftIcon size={22} className="text-blue-600" />} 
                            Boutique & Équipements High-Tech
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''} {search ? `pour "${search}"` : ''}
                        </p>
                    </div>

                    {/* Sort Selector Dropdown */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                            <ArrowUpDownIcon size={14} className="text-blue-600 dark:text-cyan-400" />
                            <span className="font-semibold hidden sm:inline">Trier par :</span>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer font-bold text-slate-800 dark:text-white"
                            >
                                <option value="default" className="text-slate-900 bg-white">Populaires</option>
                                <option value="price-low" className="text-slate-900 bg-white">Prix : Moins cher</option>
                                <option value="price-high" className="text-slate-900 bg-white">Prix : Plus cher</option>
                                <option value="newest" className="text-slate-900 bg-white">Nouveautés 2026</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories Filter Pills Horizontal Bar */}
                <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2 no-scrollbar">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <SlidersHorizontalIcon size={14} /> Filtres :
                    </span>
                    {categoryList.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}

                    {(selectedCategory !== "Tous" || search || sortBy !== "default") && (
                        <button
                            onClick={resetFilters}
                            className="ml-auto shrink-0 text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 px-3.5 py-2 rounded-full transition border border-rose-200 dark:border-rose-900 cursor-pointer"
                        >
                            <XIcon size={13} /> Réinitialiser
                        </button>
                    )}
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="my-16 text-center py-20 bg-white dark:bg-slate-800/60 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 max-w-lg mx-auto p-6 space-y-4">
                        <p className="text-xl font-bold text-slate-800 dark:text-white">Aucun produit trouvé</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Aucun équipement ne correspond à vos filtres actuels. Réinitialisez vos critères pour voir tout le stock.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                        >
                            Voir tous les produits
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center mb-32">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id || product.name} product={product} />
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