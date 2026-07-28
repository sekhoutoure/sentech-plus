'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, StoreIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"

export default function StoreShopClient() {
    const { username } = useParams()
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                setLoading(true)
                // ✅ Vrais appels API — plus de données dummy
                const storesRes = await fetch('/api/stores')
                const storesData = await storesRes.json()
                const store = storesData.stores?.find(s => s.username === username)

                if (!store) {
                    setError('Boutique introuvable')
                    setLoading(false)
                    return
                }

                setStoreInfo(store)

                // Charger les produits filtrés par storeId
                const productsRes = await fetch(`/api/products?storeId=${store.id}`)
                const productsData = await productsRes.json()
                setProducts(productsData.products || [])
            } catch (err) {
                setError('Erreur lors du chargement de la boutique')
            } finally {
                setLoading(false)
            }
        }

        if (username) fetchStoreData()
    }, [username])

    if (loading) return <Loading />

    if (error) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-slate-500">
            <StoreIcon size={48} className="text-slate-300" />
            <p className="text-lg font-medium">{error}</p>
        </div>
    )

    return (
        <div className="min-h-[70vh] mx-6">
            {/* Store Info Banner */}
            {storeInfo && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    {storeInfo.logo ? (
                        <Image
                            src={storeInfo.logo}
                            alt={storeInfo.name}
                            className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
                            width={200}
                            height={200}
                        />
                    ) : (
                        <div className="size-32 sm:size-38 bg-slate-200 rounded-md flex items-center justify-center">
                            <StoreIcon size={48} className="text-slate-400" />
                        </div>
                    )}
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
                        <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description}</p>
                        <div className="space-y-2 text-sm text-slate-500 mt-4">
                            {storeInfo.address && (
                                <div className="flex items-center">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                                    <span>{storeInfo.address}</span>
                                </div>
                            )}
                            {storeInfo.email && (
                                <div className="flex items-center">
                                    <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                                    <span>{storeInfo.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            <div className="max-w-7xl mx-auto mb-40">
                <h2 className="text-2xl mt-12">
                    Produits <span className="text-slate-800 font-medium">de la boutique</span>
                </h2>
                {products.length === 0 ? (
                    <div className="mt-12 flex flex-col items-center gap-3 text-slate-400">
                        <StoreIcon size={40} />
                        <p className="text-sm">Aucun produit dans cette boutique pour le moment.</p>
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
