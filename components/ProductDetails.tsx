'use client'

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { 
    Star, 
    Tag, 
    Truck, 
    ShieldCheck, 
    RefreshCw, 
    ShoppingCart, 
    MessageCircle, 
    Check, 
    ArrowRight 
} from "lucide-react";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { formatPrice } from "@/lib/format";
import Counter from "./Counter";
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

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    const productId = product?.id;
    const cart = useSelector((state: any) => state.cart?.cartItems || {});
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

    const handleBuyNow = () => {
        if (!cart[productId]) {
            dispatch(addToCart({ productId }));
        }
        router.push('/cart');
    };

    const handleWhatsAppOrder = () => {
        const message = `Bonjour SenTech Plus, je souhaite commander l'article : ${product.name} (Réf : ${product.id}) au prix de ${formatPrice(product.price)}. Est-il disponible immédiatement pour une livraison à Dakar ?`;
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
            
            {/* Main Product Showcase Grid */}
            <div className="flex max-lg:flex-col gap-8 lg:gap-14 pb-24 sm:pb-8">
                
                {/* Gallery Left */}
                <div className="flex max-sm:flex-col-reverse gap-4 sm:gap-6 flex-1 max-w-xl">
                    
                    {/* Thumbnails */}
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-sm:pb-2 no-scrollbar max-h-[480px]">
                        {(product?.images || [defaultImage]).map((image: string, index: number) => (
                            <button
                                key={index} 
                                onClick={() => setMainImage(image)} 
                                className={`size-20 sm:size-24 rounded-2xl p-2 flex items-center justify-center bg-white shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                                    mainImage === image 
                                        ? 'border-[#1769FF] shadow-sm' 
                                        : 'border-[#E4E7EC] hover:border-slate-300'
                                }`}
                            >
                                <Image 
                                    src={image} 
                                    className="object-cover size-full rounded-xl" 
                                    alt={product?.name || "Miniature"} 
                                    width={70} 
                                    height={70} 
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Showcase Image */}
                    <div className="relative flex-1 flex justify-center items-center aspect-square bg-[#F7F9FC] rounded-3xl border border-[#E4E7EC] shadow-sm p-6 overflow-hidden group">
                        {discountPercentage > 0 && (
                            <span className="absolute top-4 left-4 bg-[#F04438] text-white text-xs font-black px-3 py-1 rounded-full shadow-xs z-10">
                                -{discountPercentage}%
                            </span>
                        )}

                        <Image 
                            src={mainImage} 
                            alt={product?.name || "Produit SenTech Plus"} 
                            fill
                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out" 
                            priority
                        />
                    </div>
                </div>

                {/* Product Meta Details Right */}
                <div className="flex-1 space-y-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1769FF] text-xs font-bold uppercase tracking-wider">
                            {product?.category || "High-Tech"}
                        </span>

                        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#101828] mt-3 tracking-tight leading-tight">
                            {product?.name}
                        </h1>

                        {/* Ratings */}
                        <div className='flex items-center gap-2 mt-3'>
                            <div className="flex items-center gap-1">
                                {Array(5).fill('').map((_, index) => (
                                    <Star 
                                        key={index} 
                                        size={16} 
                                        className="text-amber-400" 
                                        fill={averageRating >= index + 1 ? "#F59E0B" : "#E4E7EC"} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-[#101828]">{averageRating}.0</span>
                            <span className="text-xs text-[#667085]">({ratingsList.length} avis clients)</span>
                        </div>
                    </div>

                    {/* Pricing in FCFA */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-black text-[#101828]">
                            {formatPrice(product?.price)}
                        </span>
                        {product?.mrp && product?.mrp > product?.price && (
                            <span className="text-lg text-[#667085] line-through font-semibold">
                                {formatPrice(product.mrp)}
                            </span>
                        )}
                        <span className="ml-auto text-xs font-bold text-[#12B76A] bg-[#12B76A]/10 px-3 py-1 rounded-full">
                            En stock • Expédition 24h
                        </span>
                    </div>

                    {/* Description */}
                    {product?.description && (
                        <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                            {product.description}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-4">
                            {cart[productId] ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-[#101828]">Quantité :</span>
                                    <Counter productId={productId} />
                                </div>
                            ) : null}

                            <button 
                                onClick={addToCartHandler} 
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1769FF] hover:bg-[#1256D6] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#1769FF]/20 active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                                <ShoppingCart size={18} />
                                <span>{cart[productId] ? 'Ajouter un de plus' : 'Ajouter au Panier'}</span>
                            </button>

                            <button 
                                onClick={handleBuyNow} 
                                className="inline-flex items-center justify-center gap-2 bg-[#071126] hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-all duration-200 cursor-pointer"
                            >
                                <span>Acheter</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* 1-Click WhatsApp Order */}
                        <button
                            onClick={handleWhatsAppOrder}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#12B76A] hover:bg-[#0EA25C] text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                            <MessageCircle size={16} />
                            <span>Commander instantanément via WhatsApp</span>
                        </button>
                    </div>

                    {/* Guarantee & Trust Badges */}
                    <div className="pt-4 border-t border-[#E4E7EC] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#667085]">
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E4E7EC]">
                            <Truck size={18} className="text-[#1769FF] shrink-0" />
                            <span>Livraison 24h Dakar</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E4E7EC]">
                            <ShieldCheck size={18} className="text-[#12B76A] shrink-0" />
                            <span>Garantie 100% Neuf</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E4E7EC]">
                            <RefreshCw size={18} className="text-amber-500 shrink-0" />
                            <span>Retours faciles 7j</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Mobile Sticky Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E4E7EC] p-3 shadow-xl flex items-center gap-3">
                <div className="flex flex-col shrink-0">
                    <span className="text-[10px] text-[#667085] font-bold uppercase">Prix</span>
                    <span className="text-base font-black text-[#101828]">{formatPrice(product?.price)}</span>
                </div>

                <button 
                    onClick={addToCartHandler} 
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1769FF] text-white px-4 py-3 rounded-xl font-bold text-xs shadow-md shadow-[#1769FF]/20 active:scale-95 transition"
                >
                    <ShoppingCart size={15} />
                    <span>Ajouter au panier</span>
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;
