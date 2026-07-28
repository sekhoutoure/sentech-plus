'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";

interface OrderItemProps {
    order: any;
}

const OrderItem = ({ order }: OrderItemProps) => {

    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$');
    const [ratingModal, setRatingModal] = useState<any>(null);

    const { ratings } = useSelector((state: any) => state.rating);

    const statusMap: Record<string, string> = {
        'ORDER_PLACED': 'Commande passée',
        'PROCESSING': 'En cours de traitement',
        'SHIPPED': 'Expédiée',
        'DELIVERED': 'Livrée',
        'confirmed': 'Confirmée',
        'delivered': 'Livrée'
    }

    const itemsList = order.orderItems || order.items || [];

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {itemsList.map((item: any, index: number) => {
                            const productObj = item.product || {}
                            const productImage = productObj.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
                            return (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md shrink-0">
                                        <Image
                                            className="h-14 w-auto object-contain"
                                            src={productImage}
                                            alt={productObj.name || "Produit"}
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center text-sm">
                                        <p className="font-medium text-slate-800 text-base line-clamp-1">{productObj.name || "Produit"}</p>
                                        <p className="text-xs text-slate-500">{currency}{item.price || productObj.price || 0} x {item.quantity || 1}</p>
                                        <p className="text-[11px] text-slate-400 mb-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'Aujourd\'hui'}</p>
                                        <div>
                                            {ratings.find((rating: any) => order.id === rating.orderId && productObj.id === rating.productId)
                                                ? <Rating value={ratings.find((rating: any) => order.id === rating.orderId && productObj.id === rating.productId).rating} />
                                                : <button onClick={() => setRatingModal({ orderId: order.id, productId: productObj.id })} className={`text-blue-600 hover:bg-blue-50 font-medium transition text-xs ${order.status !== "DELIVERED" && order.status !== "delivered" && 'hidden'}`}>Donner un avis</button>
                                            }
                                        </div>
                                        {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </td>

                <td className="text-center max-md:hidden font-bold text-slate-900">{currency}{order.total}</td>

                <td className="text-left max-md:hidden text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">{order.address?.name}</p>
                    <p>{order.address?.street}, {order.address?.city}</p>
                    <p>{order.address?.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'confirmed'
                            ? 'text-yellow-700 bg-yellow-50 border border-yellow-200'
                            : order.status === 'DELIVERED' || order.status === 'delivered'
                                ? 'text-green-700 bg-green-50 border border-green-200'
                                : 'text-slate-700 bg-slate-100'
                            }`}
                    >
                        <DotIcon size={12} className="scale-200" />
                        {statusMap[order.status] || order.status}
                    </div>
                </td>
            </tr>
            {/* Mobile Row */}
            <tr className="md:hidden">
                <td colSpan={4} className="pt-2 pb-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-900">Total : {currency}{order.total}</span>
                            <span className='px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]' >
                                {statusMap[order.status] || order.status}
                            </span>
                        </div>
                        <p className="text-slate-600">{order.address?.name} — {order.address?.phone}</p>
                        <p className="text-slate-400">{order.address?.street}, {order.address?.city}</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem
