'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

interface Product {
    id: string;
    name: string;
    images?: string[];
    price: number;
    mrp?: number;
    rating?: { rating: number }[];
    [key: string]: any;
}

interface ProductDetailsProps {
    product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {

    const productId = product?.id;
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$');

    const cart = useSelector((state: any) => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const defaultImage = product?.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
    const [mainImage, setMainImage] = useState(defaultImage);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const ratingsList = Array.isArray(product?.rating) ? product.rating : [];
    const averageRating = ratingsList.length > 0 
        ? Math.round(ratingsList.reduce((acc: number, item: any) => acc + (item.rating || 0), 0) / ratingsList.length)
        : 0;

    const discountPercentage = product?.mrp && product?.mrp > product?.price 
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;
    
    return (
        <div className="flex max-lg:flex-col gap-12 pb-24 sm:pb-0">
            <div className="flex max-sm:flex-col-reverse gap-3 sm:gap-4">
                <div className="flex sm:flex-col gap-3 overflow-x-auto overflow-y-hidden max-sm:pb-2 scrollbar-hide">
                    {(product?.images || [defaultImage]).map((image: string, index: number) => (
                        <div key={index} onClick={() => setMainImage(image)} className={`bg-slate-100 flex items-center justify-center size-20 sm:size-24 shrink-0 rounded-lg group cursor-pointer border transition-all ${mainImage === image ? 'border-blue-500 shadow-sm' : 'border-slate-200/60'}`}>
                            <Image src={image} className="group-hover:scale-105 transition object-contain" alt={product?.name || "Produit"} width={50} height={50} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center aspect-square w-full max-w-[500px] sm:h-96 sm:w-96 bg-slate-100 rounded-lg border border-slate-200/60 shadow-xs p-4">
                    <Image src={mainImage} alt={product?.name || "Produit"} width={300} height={300} className="object-contain max-h-80 w-auto" />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product?.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#2563EB" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{ratingsList.length} avis</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product?.price} </p>
                    {product?.mrp && product?.mrp > product?.price && (
                        <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                    )}
                </div>
                {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 text-blue-600 font-medium bg-blue-50 w-fit px-3 py-1 rounded-lg text-sm">
                        <TagIcon size={14} />
                        <p>Économisez {discountPercentage}% dès maintenant</p>
                    </div>
                )}
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantité</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }
                    <button onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 transition">
                        {!cart[productId] ? 'Ajouter au panier' : 'Voir le panier'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Livraison gratuite dans le monde entier </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> Paiement 100% sécurisé </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Recommandé par les plus grandes marques </p>
                </div>

            </div>

            {/* Mobile Sticky CTA */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex items-center gap-4">
                <div className="flex flex-col shrink-0">
                    <span className="text-xs text-slate-500 font-medium">Prix</span>
                    <span className="text-lg font-bold text-slate-900">{currency}{product.price}</span>
                </div>
                {cart[productId] ? (
                    <button onClick={() => router.push('/cart')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 text-sm font-bold rounded-xl transition text-center shadow-lg shadow-blue-600/30 cursor-pointer">
                        Voir le panier
                    </button>
                ) : (
                    <button onClick={addToCartHandler} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3.5 text-sm font-bold rounded-xl transition text-center shadow-md cursor-pointer">
                        Ajouter au panier
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProductDetails
