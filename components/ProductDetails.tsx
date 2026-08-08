'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, Truck, ShieldCheck, CheckCircle2, ShoppingCart, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

interface Product {
    id: string;
    name: string;
    images?: string[];
    price: number;
    mrp?: number;
    rating?: { rating: number }[];
    description?: string;
    category?: string;
    [key: string]: any;
}

interface ProductDetailsProps {
    product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    const productId = product?.id;
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$');
    const cart = useSelector((state: any) => state.cart.cartItems || {});
    const dispatch = useDispatch();
    const router = useRouter();

    const defaultImage = product?.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
    const [mainImage, setMainImage] = useState(defaultImage);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }));
        toast.success(`"${product.name}" ajouté à votre panier !`);
    };

    const handleWhatsAppOrder = () => {
        const message = `Bonjour SenTech Plus, je souhaite commander l'article : ${product.name} (Réf : ${product.id}) au prix de ${currency}${product.price}. Est-il disponible immédiatement ?`;
        window.open(`https://wa.me/221770000000?text=${encodeURIComponent(message)}`, '_blank');
    };

    const ratingsList = Array.isArray(product?.rating) ? product.rating : [];
    const averageRating = ratingsList.length > 0 
        ? Math.round(ratingsList.reduce((acc: number, item: any) => acc + (item.rating || 0), 0) / ratingsList.length)
        : 5;

    const discountPercentage = product?.mrp && product?.mrp > product?.price 
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;
    
    return (
        <div className="flex max-lg:flex-col gap-8 lg:gap-14 pb-24 sm:pb-8">
            
            {/* Gallery Left Showcase */}
            <div className="flex max-sm:flex-col-reverse gap-4 sm:gap-6 flex-1 max-w-xl">
                
                {/* Thumbnails list */}
                <div className="flex sm:flex-col gap-3 overflow-x-auto overflow-y-hidden max-sm:pb-2 no-scrollbar">
                    {(product?.images || [defaultImage]).map((image: string, index: number) => (
                        <button
                            key={index} 
                            onClick={() => setMainImage(image)} 
                            className={`size-20 sm:size-24 rounded-2xl p-2 flex items-center justify-center bg-white dark:bg-slate-800 shrink-0 border-2 transition-all duration-200 cursor-pointer shadow-xs ${
                                mainImage === image 
                                    ? 'border-blue-600 dark:border-cyan-400 shadow-md ring-2 ring-blue-500/20' 
                                    : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-400'
                            }`}
                        >
                            <Image 
                                src={image} 
                                className="object-contain max-h-16 w-auto" 
                                alt={product?.name || "Thumbnail"} 
                                width={60} 
                                height={60} 
                            />
                        </button>
                    ))}
                </div>

                {/* Main Large Image Box */}
                <div className="relative flex-1 flex justify-center items-center aspect-square bg-gradient-to-b from-slate-100/80 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md p-8 overflow-hidden group">
                    {discountPercentage > 0 && (
                        <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md z-10">
                            -{discountPercentage}%
                        </span>
                    )}

                    <Image 
                        src={mainImage} 
                        alt={product?.name || "Produit High-Tech"} 
                        width={450} 
                        height={450} 
                        className="object-contain max-h-72 sm:max-h-96 w-auto group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-xl" 
                        priority
                    />
                </div>
            </div>

            {/* Product Meta Details Right */}
            <div className="flex-1 space-y-6">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                        {product?.category || "High-Tech"}
                    </span>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight leading-tight">
                        {product?.name}
                    </h1>

                    {/* Ratings */}
                    <div className='flex items-center gap-2 mt-3'>
                        <div className="flex items-center gap-1">
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon 
                                    key={index} 
                                    size={16} 
                                    className="text-yellow-400" 
                                    fill={averageRating >= index + 1 ? "#FACC15" : "#E2E8F0"} 
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{averageRating}.0</span>
                        <span className="text-xs text-slate-400">({ratingsList.length} avis vérifiés)</span>
                    </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        {currency}{product?.price}
                    </span>
                    {product?.mrp && product?.mrp > product?.price && (
                        <span className="text-lg text-slate-400 line-through font-semibold">
                            {currency}{product.mrp}
                        </span>
                    )}
                    {discountPercentage > 0 && (
                        <span className="ml-auto text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                            Économie : {currency}{(product.mrp! - product.price).toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-4">
                        {cart[productId] ? (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Quantité :</span>
                                <Counter productId={productId} />
                            </div>
                        ) : null}

                        <button 
                            onClick={addToCartHandler} 
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                            <ShoppingCart size={18} />
                            <span>{cart[productId] ? 'Ajouter un de plus' : 'Ajouter au Panier'}</span>
                        </button>
                    </div>

                    <button
                        onClick={handleWhatsAppOrder}
                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                        <MessageSquare size={16} />
                        <span>Commander instantanément via WhatsApp</span>
                    </button>
                </div>

                {/* Guarantee & Trust Badges */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                        <Truck size={18} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                        <span>Livraison Express 24h à Dakar</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                        <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Garantie 100% Neuf & Certifié</span>
                    </div>
                </div>

            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 p-3.5 shadow-2xl flex items-center gap-3">
                <div className="flex flex-col shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Prix</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">{currency}{product.price}</span>
                </div>

                <button 
                    onClick={addToCartHandler} 
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/30 active:scale-95 transition"
                >
                    <ShoppingCart size={15} />
                    <span>Ajouter au panier</span>
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
