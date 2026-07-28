'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { orderDummyData } from "@/assets/assets";
import { useSelector } from "react-redux";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const { user } = useSelector((state: any) => state.user || {})

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // ✅ On passe l'userId pour n'obtenir que ses propres commandes
                const userId = user?.id || 'guest'
                const res = await fetch(`/api/orders?userId=${userId}`)
                const data = await res.json()
                if (data.success && data.orders) {
                    setOrders(data.orders)
                } else {
                    setOrders(orderDummyData)
                }
            } catch (e) {
                setOrders(orderDummyData)
            }
        }
        fetchOrders()
    }, [user]);

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="Mes Commandes" text={`Affichage de ${orders.length} commandes au total`} linkText={'Retour à l\'accueil'} />

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Produit</th>
                                    <th className="text-center">Prix Total</th>
                                    <th className="text-left">Adresse</th>
                                    <th className="text-left">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Vous n'avez aucune commande</h1>
                </div>
            )}
        </div>
    )
}