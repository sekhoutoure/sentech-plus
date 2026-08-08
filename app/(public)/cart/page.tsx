'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "@/lib/format";

export default function Cart() {
    const { cartItems } = useSelector((state: any) => state.cart || { cartItems: {} });
    const products = useSelector((state: any) => state.product?.list || []);
    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        let total = 0;
        const arr = [];
        const items = (cartItems || {}) as Record<string, number>;
        for (const [key, value] of Object.entries(items)) {
            const product = products.find((p: any) => p.id === key);
            if (product) {
                const qty = Number(value) || 1;
                arr.push({
                    ...product,
                    quantity: qty,
                });
                total += Number(product.price) * qty;
            }
        }
        setCartArray(arr);
        setTotalPrice(total);
    }

    const handleDeleteItemFromCart = (productId: string) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-10 text-[#101828] max-w-[1400px] mx-auto">
            {/* Title */}
            <PageTitle heading="Mon Panier" text="articles dans votre panier" linkText="Continuer mes achats" />

            <div className="flex items-start justify-between gap-6 max-lg:flex-col mt-6">
                
                {/* Products List Left */}
                <div className="w-full max-w-4xl flex flex-col gap-4">
                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-2xs">
                        <table className="w-full text-[#667085] table-auto">
                            <thead>
                                <tr className="border-b border-[#E4E7EC]">
                                    <th className="text-left pb-4 font-bold text-[#101828] text-xs uppercase tracking-wider">Produit</th>
                                    <th className="pb-4 font-bold text-[#101828] text-center text-xs uppercase tracking-wider">Quantité</th>
                                    <th className="pb-4 font-bold text-[#101828] text-center text-xs uppercase tracking-wider">Prix Total</th>
                                    <th className="pb-4 font-bold text-[#101828] text-center text-xs uppercase tracking-wider">Supprimer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartArray.map((item, index) => (
                                    <tr key={index} className="border-b border-[#E4E7EC] last:border-0 hover:bg-[#F7F9FC] transition">
                                        <td className="flex gap-4 py-5 items-center">
                                            <div className="flex shrink-0 items-center justify-center bg-[#F7F9FC] border border-[#E4E7EC] size-20 rounded-xl overflow-hidden p-1">
                                                <Image src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} className="size-full object-cover rounded-lg" alt={item.name || "Produit"} width={70} height={70} />
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-bold text-[#101828] text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-[11px] font-bold text-[#1769FF] mt-0.5 uppercase tracking-wider">{item.category}</p>
                                                <p className="font-extrabold text-[#101828] mt-1 text-xs">{formatPrice(item.price)}</p>
                                            </div>
                                        </td>
                                        <td className="text-center py-5">
                                            <div className="inline-block">
                                                <Counter productId={item.id} />
                                            </div>
                                        </td>
                                        <td className="text-center py-5 font-black text-[#101828] text-base">{formatPrice(item.price * item.quantity)}</td>
                                        <td className="text-center py-5">
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} aria-label="Supprimer du panier" className="text-[#667085] hover:text-[#F04438] hover:bg-rose-50 p-2.5 rounded-full transition-colors cursor-pointer">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-3">
                        {cartArray.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-2xl border border-[#E4E7EC] shadow-2xs flex gap-3.5">
                                <div className="size-20 bg-[#F7F9FC] border border-[#E4E7EC] rounded-xl overflow-hidden shrink-0 p-1">
                                    <Image src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} alt={item.name} width={70} height={70} className="size-full object-cover rounded-lg" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[#101828] text-xs line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] text-[#1769FF] font-bold uppercase">{item.category}</p>
                                        </div>
                                        <button onClick={() => handleDeleteItemFromCart(item.id)} className="text-[#667085] hover:text-[#F04438] p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <Counter productId={item.id} />
                                        <span className="font-black text-xs text-[#101828]">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary Right */}
                <div className="w-full lg:max-w-md">
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 max-w-md mx-auto space-y-4">
            <div className="size-20 rounded-full bg-[#EAF3FF] text-[#1769FF] flex items-center justify-center mb-2">
                <ShoppingBag size={36} />
            </div>
            <h2 className="text-2xl font-extrabold text-[#101828]">Votre panier est vide</h2>
            <p className="text-xs sm:text-sm text-[#667085]">
                Découvrez nos accessoires et équipements high-tech sélectionnés avec soin.
            </p>
            <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white px-6 py-3 rounded-full font-bold text-xs shadow-md transition"
            >
                <span>Découvrir le catalogue</span>
                <ArrowRight size={15} />
            </Link>
        </div>
    );
}