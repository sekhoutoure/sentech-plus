'use client'
import React, { useState, useEffect } from 'react'
import { dummyAdminDashboardData } from '@/assets/assets'
import { ShoppingBagIcon, SearchIcon, FilterIcon, CheckCircle2Icon, ClockIcon, TruckIcon, AlertCircleIcon } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useSiteSettingsStore } from '@/lib/stores'

export default function AdminOrdersPage() {
    const currency = useSiteSettingsStore(s => s.currencySymbol) || '$'
    const [orders, setOrders] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders')
                const data = await res.json()
                if (data.success && data.orders) {
                    setOrders(data.orders)
                } else {
                    setOrders(dummyAdminDashboardData.allOrders || [])
                }
            } catch (e) {
                setOrders(dummyAdminDashboardData.allOrders || [])
            }
        }
        fetchOrders()
    }, [])

    const statusMap: Record<string, { label: string; color: string }> = {
        'PENDING': { label: 'En attente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        'CONFIRMED': { label: 'Confirmée', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        'confirmed': { label: 'Confirmée', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        'PREPARING': { label: 'Préparation', color: 'bg-purple-50 text-purple-700 border-purple-200' },
        'SHIPPED': { label: 'Expédiée', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        'in_transit': { label: 'Expédiée', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
        'DELIVERED': { label: 'Livrée', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        'delivered': { label: 'Livrée', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        'CANCELLED': { label: 'Annulée', color: 'bg-red-50 text-red-700 border-red-200' },
        'cancelled': { label: 'Annulée', color: 'bg-red-50 text-red-700 border-red-200' }
    }


    const handleStatusChange = async (orderId, newStatus) => {
        // ✅ Mise à jour optimiste de l'UI
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

        // ✅ Persistance réelle via l'API
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || ''
                },
                body: JSON.stringify({ status: newStatus })
            })
            const data = await res.json()
            if (!data.success) {
                toast.error(data.message || "Erreur lors de la mise à jour")
                // Annuler la mise à jour optimiste
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: o.status } : o))
            } else {
                toast.success(`Statut mis à jour : ${statusMap[newStatus]?.label || newStatus}`)
            }
        } catch (err) {
            toast.error("Erreur réseau.")
        }
    }

    const filteredOrders = orders.filter(order => {
        const orderIdStr = String(order.id || '')
        const customerNameStr = String(order.address?.name || order.user?.name || '')
        const searchQuery = (search || '').toLowerCase()

        const matchesSearch = orderIdStr.toLowerCase().includes(searchQuery) ||
            customerNameStr.toLowerCase().includes(searchQuery)
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6 text-slate-800">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBagIcon className="text-blue-600" /> Gestion Globale des Commandes
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Suivi et mise à jour des statuts des commandes ({orders.length} commande{orders.length > 1 ? 's' : ''})
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs w-full sm:w-80">
                    <SearchIcon size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par ID ou nom client..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full outline-none bg-transparent"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-semibold">Statut :</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl outline-none font-semibold text-slate-700"
                    >
                        <option value="ALL">Tous les statuts</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="in_transit">En transit</option>
                        <option value="DELIVERED">Livrée</option>
                        <option value="cancelled">Annulée</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Commande</th>
                                <th className="p-4">Client & Adresse</th>
                                <th className="p-4">Articles</th>
                                <th className="p-4">Montant Total</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Changer le statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        Aucune commande trouvée.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => {
                                    const statusInfo = statusMap[order.status] || { label: order.status || 'Confirmée', color: 'bg-slate-100 text-slate-700' }
                                    const orderIdDisplay = String(order.id || `ORD-${index + 1}`)
                                    return (
                                        <tr key={order.id || index} className="hover:bg-slate-50/80 transition">
                                            <td className="p-4 font-mono font-bold text-slate-900">
                                                #{orderIdDisplay.slice(-6).toUpperCase()}
                                                <p className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <p className="font-semibold text-slate-900">{order.address?.name}</p>
                                                <p className="text-[11px] text-slate-500 line-clamp-1">{order.address?.street}, {order.address?.city}</p>
                                                <p className="text-[10px] text-slate-400">{order.address?.phone}</p>
                                            </td>

                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="size-5 rounded bg-slate-100 text-[10px] font-bold flex items-center justify-center">
                                                                {item.quantity}x
                                                            </span>
                                                            <span className="line-clamp-1 font-medium text-slate-700">{item.product?.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="p-4 font-bold text-blue-600 text-sm">
                                                {currency}{order.total}
                                            </td>

                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-semibold ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>

                                            <td className="p-4 text-right">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 p-1.5 rounded-lg text-xs font-semibold outline-none cursor-pointer"
                                                >
                                                    <option value="PENDING">En attente</option>
                                                    <option value="CONFIRMED">Confirmée</option>
                                                    <option value="PREPARING">Préparation</option>
                                                    <option value="SHIPPED">Expédiée</option>
                                                    <option value="DELIVERED">Livrée</option>
                                                    <option value="CANCELLED">Annulée</option>
                                                </select>

                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
