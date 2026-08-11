'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import dynamic from "next/dynamic"

const OrdersAreaChart = dynamic(() => import("@/components/OrdersAreaChart"), {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100/80 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-400 font-semibold">Chargement du graphique analytique...</div>
})
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, PackageIcon, SettingsIcon, PlusIcon, ArrowRightIcon } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSiteSettingsStore, useProductStore } from "@/lib/stores"

export default function AdminDashboard() {
    const currency = useSiteSettingsStore(s => s.currencySymbol) || '$'
    const reduxProducts = useProductStore(s => s.list)

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState<any>({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const fetchDashboardData = async () => {
        setDashboardData(dummyAdminDashboardData)
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    const dashboardCardsData = [
        { title: 'Chiffre d\'Affaires Total', value: `${currency}${dashboardData.revenue}`, icon: CircleDollarSignIcon, change: '+12.5% ce mois', color: 'text-emerald-600 bg-emerald-50' },
        { title: 'Total des Produits', value: reduxProducts.length || dashboardData.products, icon: PackageIcon, change: 'Catalogue actif', color: 'text-blue-600 bg-blue-50' },
        { title: 'Commandes Effectuées', value: dashboardData.orders, icon: TagsIcon, change: '100% traitées', color: 'text-purple-600 bg-purple-50' },
        { title: 'Boutiques Partenaires', value: dashboardData.stores, icon: StoreIcon, change: 'Vendeurs vérifiés', color: 'text-amber-600 bg-amber-50' },
    ]

    return (
        <div className="space-y-8 text-slate-800">
            {/* Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-light text-slate-500">
                        Tableau de bord <span className="text-slate-900 font-bold">Administrateur</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Aperçu global de l'activité, des revenus et des opérations du site SenTech Plus.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/admin/products" className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs">
                        <PlusIcon size={15} /> Nouveau produit
                    </Link>
                    <Link href="/admin/settings" className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition">
                        <SettingsIcon size={15} /> Paramètres
                    </Link>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-slate-500">{card.title}</p>
                                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${card.color}`}>
                                <card.icon size={22} />
                            </div>
                        </div>
                        <p className="text-[11px] font-medium text-slate-400 border-t border-slate-100 pt-2.5">{card.change}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Link href="/admin/products" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition space-y-2 group">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-base">Gérer les Produits</h4>
                        <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition" />
                    </div>
                    <p className="text-xs text-blue-100">Ajouter, modifier le prix, le stock et la description de tout produit du site.</p>
                </Link>

                <Link href="/admin/orders" className="bg-slate-900 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition space-y-2 group">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-base">Gérer les Commandes</h4>
                        <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition" />
                    </div>
                    <p className="text-xs text-slate-400">Modifier en direct le statut de livraison et vérifier les informations clients.</p>
                </Link>

                <Link href="/admin/settings" className="bg-slate-100 text-slate-800 border border-slate-200/80 p-6 rounded-2xl hover:bg-slate-200/60 transition space-y-2 group">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-base">Paramètres de la Marque</h4>
                        <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-500">Configurer le nom du site, la bannière promotionnelle et la devise.</p>
                </Link>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Évolution du Chiffre d'Affaires</h3>
                <OrdersAreaChart allOrders={dashboardData.allOrders} />
            </div>
        </div>
    )
}