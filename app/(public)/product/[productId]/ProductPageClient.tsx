'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProductPageClient() {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>();
    const products = useSelector((state: any) => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((p: any) => p.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId, products]);

    return (
        <div className="px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="text-slate-500 text-xs mt-8 mb-5">
                    Accueil / Produits / <span className="font-semibold text-slate-800">{product?.category}</span>
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}
