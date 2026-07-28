'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/stores')
            const data = await res.json()
            if (data.success && data.stores) {
                setStores(data.stores.filter(s => s.status === 'pending'))
            } else {
                setStores(storesDummyData.filter(s => s.status === 'pending'))
            }
        } catch (e) {
            setStores(storesDummyData.filter(s => s.status === 'pending'))
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        try {
            const res = await fetch(`/api/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || ''
                },
                body: JSON.stringify({ status })
            })
            const data = await res.json()
            if (!data.success) {
                toast.error(data.message || "Erreur lors de la mise à jour.")
                return
            }
        } catch (err) {
            toast.error("Erreur réseau.")
            return
        }
        // Retirer la boutique de la liste des "en attente" dans l'UI
        setStores(prev => prev.filter(s => s.id !== storeId))
        if (status === 'approved') {
            toast.success("Demande de boutique approuvée avec succès !")
        } else {
            toast.success("Demande de boutique rejetée.")
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-600 mb-28 max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-light">Approuver les <span className="text-slate-900 font-bold">Boutiques</span></h1>
                <p className="text-xs text-slate-500 mt-1">Examinez et validez les candidatures des nouveaux vendeurs</p>
            </div>

            {stores.length > 0 ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex max-md:flex-col gap-4 md:items-end justify-between" >
                            <StoreInfo store={store} />
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => handleApprove({ storeId: store.id, status: 'approved' })} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-xs transition shadow-md shadow-blue-600/20 cursor-pointer" >
                                    Approuver
                                </button>
                                <button onClick={() => handleApprove({ storeId: store.id, status: 'rejected' })} className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium text-xs transition cursor-pointer" >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <h2 className="text-xl text-slate-400 font-medium">Aucune demande en attente</h2>
                    <p className="text-xs text-slate-400 mt-2">Toutes les candidatures de vendeurs ont été traitées.</p>
                </div>
            )}
        </div>
    )
}