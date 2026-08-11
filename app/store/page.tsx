'use client'
import { dummyStoreDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSiteSettingsStore, useProductStore } from "@/lib/stores"

export default function Dashboard() {
    const currency = useSiteSettingsStore(s => s.currencySymbol) || '$'
    const reduxProducts = useProductStore(s => s.list)
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<any>({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    })

    const fetchDashboardData = async () => {
        setDashboardData(dummyStoreDashboardData)
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    const dashboardCardsData = [
        { title: 'Produits en Vente', value: reduxProducts.length || dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Revenus Totaux', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Commandes Reçues', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Avis Clients', value: dashboardData.ratings.length, icon: StarIcon },
    ]

    return (
        <div className="text-slate-600 mb-28 max-w-5xl space-y-8">
            <div>
                <h1 className="text-2xl font-light">Tableau de bord <span className="text-slate-900 font-bold">Vendeur</span></h1>
                <p className="text-xs text-slate-500 mt-1">Aperçu de vos ventes, produits et évaluations clients</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500">{card.title}</p>
                            <b className="text-2xl font-bold text-slate-900">{card.value}</b>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Avis et Évaluations Récentes</h2>

                <div className="divide-y divide-slate-100">
                    {dashboardData.ratings.map((review, index) => (
                        <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-4 text-sm text-slate-600">
                            <div>
                                <div className="flex gap-3 items-center">
                                    <Image src={review.user.image} alt="" className="size-10 rounded-full border border-slate-200 object-cover" width={40} height={40} />
                                    <div>
                                        <p className="font-bold text-slate-900">{review.user.name}</p>
                                        <p className="text-[11px] text-slate-400">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-slate-600 max-w-md leading-relaxed">{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-between gap-3 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">{review.product?.category}</span>
                                    <p className="font-semibold text-slate-900">{review.product?.name}</p>
                                    <div className='flex items-center gap-0.5 mt-0.5'>
                                        {Array(5).fill('').map((_, idx) => (
                                            <StarIcon key={idx} size={14} className='text-transparent' fill={review.rating >= idx + 1 ? "#2563EB" : "#E2E8F0"} />
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => router.push(`/product/${review.product.id}`)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer">Voir la fiche</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}