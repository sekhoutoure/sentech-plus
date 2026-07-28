'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { orderDummyData } from "@/assets/assets"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

export default function StoreOrders() {
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            const data = await res.json()
            if (data.success && data.orders) {
                setOrders(data.orders)
            } else {
                setOrders(orderDummyData)
            }
        } catch (e) {
            setOrders(orderDummyData)
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
            await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            toast.success("Statut de la commande mis à jour !")
        } catch (err) {
            toast.error("Erreur lors de la mise à jour.")
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="space-y-6 text-slate-800 max-w-5xl mb-28">
            <div>
                <h1 className="text-2xl font-light">Commandes <span className="text-slate-900 font-bold">Vendeur</span></h1>
                <p className="text-xs text-slate-500 mt-1">Consultez et modifiez l'état d'expédition de vos commandes reçues</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-400 font-medium">Aucune commande reçue pour le moment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-xs text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">N°</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Paiement</th>
                                <th className="px-4 py-3">Code Promo</th>
                                <th className="px-4 py-3">Statut</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50 transition cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="px-4 py-3.5 font-bold text-blue-600">
                                        #{index + 1}
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-slate-900">{order.user?.name || "Client SenTech"}</td>
                                    <td className="px-4 py-3.5 font-bold text-slate-900">{currency}{order.total}</td>
                                    <td className="px-4 py-3.5">{order.paymentMethod === 'COD' ? 'Paiement Livraison' : 'Stripe / Carte'}</td>
                                    <td className="px-4 py-3.5">
                                        {order.isCouponUsed ? (
                                            <span className="bg-blue-50 text-blue-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-blue-200">
                                                {order.coupon?.code}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5" onClick={(e) => { e.stopPropagation() }}>
                                        <select
                                            value={order.status}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className="border border-slate-200 rounded-lg p-1 text-xs outline-none focus:border-blue-500 bg-white font-medium cursor-pointer"
                                        >
                                            <option value="ORDER_PLACED">Commande passée</option>
                                            <option value="PROCESSING">En traitement</option>
                                            <option value="SHIPPED">Expédiée</option>
                                            <option value="DELIVERED">Livrée</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-400">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Detail */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-slate-900/60 text-slate-700 text-xs backdrop-blur-xs z-50 p-4" >
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative border border-slate-100 space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 text-center">
                            Détails de la Commande
                        </h2>

                        {/* Customer Details */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                            <h3 className="font-bold text-slate-800 mb-2 text-sm">Informations Client & Livraison</h3>
                            <p><span className="font-semibold text-slate-600">Nom :</span> {selectedOrder.user?.name}</p>
                            <p><span className="font-semibold text-slate-600">Email :</span> {selectedOrder.user?.email}</p>
                            <p><span className="font-semibold text-slate-600">Téléphone :</span> {selectedOrder.address?.phone || "+33 6 12 34 56 78"}</p>
                            <p><span className="font-semibold text-slate-600">Adresse :</span> {selectedOrder.address?.street ? `${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.country}` : "794 Francisco Street, San Francisco, CA"}</p>
                        </div>

                        {/* Products */}
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2 text-sm">Articles Commandés</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 border border-slate-100 bg-white p-2.5 rounded-xl">
                                        <img
                                            src={item.product?.images?.[0]?.src || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                                            alt={item.product?.name}
                                            className="w-12 h-12 object-contain p-1 rounded-lg border border-slate-200"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900">{item.product?.name}</p>
                                            <p className="text-slate-500">Quantité : {item.quantity} × {currency}{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl grid grid-cols-2 gap-2 text-slate-700">
                            <p><span className="font-semibold text-slate-900">Moyen de paiement :</span> {selectedOrder.paymentMethod === 'COD' ? 'Paiement Livraison' : 'Stripe'}</p>
                            <p><span className="font-semibold text-slate-900">Statut :</span> {selectedOrder.status}</p>
                            <p><span className="font-semibold text-slate-900">Total :</span> <span className="font-bold text-blue-600">{currency}{selectedOrder.total}</span></p>
                            <p><span className="font-semibold text-slate-900">Date :</span> {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-2">
                            <button onClick={closeModal} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-semibold text-xs transition cursor-pointer" >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
