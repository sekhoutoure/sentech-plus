'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { ProductGridSkeleton } from "@/components/SkeletonLoader"
import MobileFilterDrawer from "@/components/MobileFilterDrawer"
import { MoveLeft, SlidersHorizontal, X, ArrowUpDown, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { categories } from "@/assets/assets"
import JsonLd from "@/components/seo/JsonLd"
import { getBreadcrumbSchema } from "@/lib/seo"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const categoryParam = searchParams.get('category')
    const router = useRouter()

    const breadcrumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Boutique SenTech Plus', url: '/shop' }
    ]

    const products = useSelector((state: any) => state.product?.list || [])
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || "Tous")
    const [sortBy, setSortBy] = useState("default")
    const [priceRange, setPriceRange] = useState("all")
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    const categoryList = ["Tous", ...categories, "Smartphones", "Laptops", "Gaming"]

    // Category & Search Filtering + Price Range + Sorting
    const filteredProducts = useMemo(() => {
        let list = [...products]

        // Search query filter
        if (search) {
            list = list.filter(p => 
                p.name?.toLowerCase().includes(search.toLowerCase()) || 
                p.category?.toLowerCase().includes(search.toLowerCase())
            )
        }

        // Category filter
        const targetCategory = selectedCategory !== "Tous" ? selectedCategory : categoryParam
        if (targetCategory && targetCategory !== "Tous") {
            list = list.filter(p => p.category?.toLowerCase() === targetCategory.toLowerCase())
        }

        // Price Range filter
        if (priceRange === "under-50k") {
            list = list.filter(p => Number(p.price || 0) < 50000)
        } else if (priceRange === "50k-150k") {
            list = list.filter(p => Number(p.price || 0) >= 50000 && Number(p.price || 0) <= 150000)
        } else if (priceRange === "over-150k") {
            list = list.filter(p => Number(p.price || 0) > 150000)
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
    }, [products, search, selectedCategory, priceRange, sortBy])

    const resetFilters = () => {
        setSelectedCategory("Tous")
        setSortBy("default")
        setPriceRange("all")
        if (search) {
            router.push('/shop')
        }
    }

    return (
        <div className="min-h-[70vh] px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
            <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
            
            {/* Header Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E7EC]">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles size={11} />
                        <span>CATALOGUE OFFICIEL</span>
                    </div>
                    <h1 onClick={() => router.push('/shop')} className="text-2xl sm:text-3xl text-[#101828] flex items-center gap-2 cursor-pointer font-extrabold tracking-tight">
                        {search && <MoveLeft size={22} className="text-[#1769FF]" />} 
                        Boutique SenTech Plus
                    </h1>
                    <p className="text-xs sm:text-sm text-[#667085]">
                        {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''} {search ? `pour "${search}"` : ''}
                    </p>
                </div>

                {/* Sort Selector Dropdown + Mobile Filter Trigger */}
                <div className="flex items-center gap-2">
                    {/* Mobile Filter Bottom-Sheet Trigger Button */}
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="lg:hidden flex items-center gap-1.5 bg-[#0B54C2] hover:bg-[#09449E] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm cursor-pointer active:scale-95 shrink-0 transition-all"
                    >
                        <SlidersHorizontal size={14} />
                        <span>Filtres</span>
                        {(selectedCategory !== "Tous" || sortBy !== "default" || priceRange !== "all") && (
                            <span className="size-4 bg-white text-[#0B54C2] font-black text-[10px] rounded-full flex items-center justify-center">
                                {(selectedCategory !== "Tous" ? 1 : 0) + (sortBy !== "default" ? 1 : 0) + (priceRange !== "all" ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl text-xs sm:text-sm text-[#475467] border border-[#E4E7EC] shadow-2xs">
                        <ArrowUpDown size={14} className="text-[#0B54C2]" />
                        <span className="font-semibold hidden sm:inline">Trier par :</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent outline-none cursor-pointer font-bold text-[#182230]"
                        >
                            <option value="default">Populaires</option>
                            <option value="price-low">Prix : Moins cher</option>
                            <option value="price-high">Prix : Plus cher</option>
                            <option value="newest">Nouveautés 2026</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Categories Filter Pills Horizontal Bar */}
            <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2 no-scrollbar">
                <span className="text-xs font-bold text-[#475467] uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <SlidersHorizontal size={14} /> Rayons :
                </span>
                {categoryList.map((cat, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                            selectedCategory === cat
                                ? 'bg-[#0B54C2] text-white shadow-md scale-105'
                                : 'bg-white text-[#182230] hover:bg-slate-100 border border-[#E4E7EC]'
                        }`}
                    >
                        {cat}
                    </button>
                ))}

                {(selectedCategory !== "Tous" || search || sortBy !== "default" || priceRange !== "all") && (
                    <button
                        onClick={resetFilters}
                        className="ml-auto shrink-0 text-xs text-[#C4320A] hover:text-red-700 font-bold flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-full transition border border-rose-200 cursor-pointer"
                    >
                        <X size={13} /> Réinitialiser
                    </button>
                )}
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="my-16 text-center py-20 bg-white rounded-3xl border border-dashed border-[#E4E7EC] max-w-lg mx-auto p-6 space-y-4">
                    <p className="text-xl font-bold text-[#182230]">Aucun produit trouvé</p>
                    <p className="text-xs text-[#475467]">
                        Aucun équipement ne correspond à vos filtres actuels. Réinitialisez vos critères pour voir tout le stock SenTech Plus.
                    </p>
                    <button
                        onClick={resetFilters}
                        className="px-6 py-2.5 bg-[#0B54C2] hover:bg-[#09449E] text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                    >
                        Voir tous les produits
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id || product.name} product={product} />
                    ))}
                </div>
            )}

            {/* Mobile Filter & Sort Bottom-Sheet Drawer */}
            <MobileFilterDrawer
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                totalResults={filteredProducts.length}
                onReset={resetFilters}
            />
        </div>
    )
}

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="max-w-[1400px] mx-auto p-6">
        <ProductGridSkeleton count={8} />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}