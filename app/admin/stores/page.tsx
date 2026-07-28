'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/stores')
            const data = await res.json()
            if (data.success && data.stores) {
                setStores(data.stores)
            } else {
                setStores(storesDummyData)
            }
        } catch (e) {
            setStores(storesDummyData)
        } finally {
            setLoading(false)
        }
    }

    const toggleIsActive = async (storeId) => {
        setStores(prev => prev.map(s => {
            if (s.id === storeId) {
                const nextActive = !s.isActive
                toast.success(nextActive ? `Boutique "${s.name}" activée !` : `Boutique "${s.name}" désactivée.`)
                return { ...s, isActive: nextActive }
            }
            return s
        }))
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-600 mb-28 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-light">Boutiques <span className="text-slate-900 font-bold">Actives</span></h1>
                <p className="text-xs text-slate-500 mt-1">Gérez le statut d'activation des boutiques partenaires sur la plateforme</p>
            </div>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex max-md:flex-col gap-4 md:items-end justify-between" >
                            <StoreInfo store={store} />
                            <div className="flex items-center gap-3 pt-2">
                                <span className="text-xs font-semibold text-slate-700">Statut :</span>
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-2">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toggleIsActive(store.id)} checked={store.isActive} />
                                    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    <span className="text-xs font-medium text-slate-600">{store.isActive ? 'Actif' : 'Inactif'}</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <h2 className="text-xl text-slate-400 font-medium">Aucune boutique disponible</h2>
                </div>
            )}
        </div>
    )
}