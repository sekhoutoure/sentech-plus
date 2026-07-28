'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$');
    
    const { cartItems } = useSelector((state: any) => state.cart);
    const products = useSelector((state: any) => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        const items = (cartItems || {}) as Record<string, number>;
        for (const [key, value] of Object.entries(items)) {
            const product = products.find((p: any) => p.id === key);
            if (product) {
                const qty = Number(value) || 1;
                cartArray.push({
                    ...product,
                    quantity: qty,
                });
                setTotalPrice(prev => prev + Number(product.price) * qty);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen px-4 sm:px-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="Mon Panier" text="articles dans votre panier" linkText="Ajouter d'autres produits" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <div className="w-full max-w-4xl flex flex-col gap-4">
                        {/* Desktop Table View */}
                        <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                            <table className="w-full text-slate-600 table-auto">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left pb-4 font-semibold text-slate-700">Produit</th>
                                        <th className="pb-4 font-semibold text-slate-700 text-center">Quantité</th>
                                        <th className="pb-4 font-semibold text-slate-700 text-center">Prix Total</th>
                                        <th className="pb-4 font-semibold text-slate-700 text-center">Supprimer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartArray.map((item, index) => (
                                        <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                                            <td className="flex gap-4 py-5 items-center">
                                                <div className="flex shrink-0 items-center justify-center bg-slate-50 border border-slate-100 size-20 rounded-xl">
                                                    <Image src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} className="max-h-16 w-auto object-contain" alt={item.name || "Produit"} width={60} height={60} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                                                    <p className="text-xs font-medium text-slate-400 mt-0.5 uppercase tracking-wider">{item.category}</p>
                                                    <p className="font-medium text-blue-600 mt-1">{currency}{item.price}</p>
                                                </div>
                                            </td>
                                            <td className="text-center py-5">
                                                <div className="inline-block">
                                                    <Counter productId={item.id} />
                                                </div>
                                            </td>
                                            <td className="text-center py-5 font-bold text-slate-900 text-lg">{currency}{(item.price * item.quantity).toFixed(2)}</td>
                                            <td className="text-center py-5">
                                                <button onClick={() => handleDeleteItemFromCart(item.id)} aria-label="Supprimer du panier" className="text-slate-500 hover:text-red-600 hover:bg-slate-100 p-2.5 rounded-full active:scale-95 transition-colors cursor-pointer">
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden flex flex-col gap-4">
                            {cartArray.map((item, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm relative">
                                    <button 
                                        onClick={() => handleDeleteItemFromCart(item.id)} 
                                        aria-label="Supprimer du panier"
                                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 bg-white p-1.5 rounded-full border border-slate-100 shadow-xs active:scale-95 transition-all z-10 cursor-pointer"
                                    >
                                        <Trash2Icon size={16} />
                                    </button>
                                    
                                    <div className="flex shrink-0 items-center justify-center bg-slate-50 border border-slate-100 size-24 rounded-xl">
                                        <Image src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} className="max-h-20 w-auto object-contain p-2" alt={item.name || "Produit"} width={80} height={80} />
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div className="pr-8">
                                            <p className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">{item.name}</p>
                                            <p className="font-bold text-blue-600 text-sm mt-1">{currency}{item.price}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <Counter productId={item.id} />
                                            <p className="font-extrabold text-slate-900 text-lg">{currency}{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] px-4 sm:px-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Votre panier est vide</h1>
        </div>
    )
}