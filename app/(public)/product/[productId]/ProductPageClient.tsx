'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import ProductReviews from "@/components/ProductReviews";
import RecentlyViewed, { saveRecentlyViewed } from "@/components/RecentlyViewed";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useProductStore } from "@/lib/stores";

export default function ProductPageClient() {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>();
    const products = useProductStore(s => s.list);

    const fetchProduct = async () => {
        const found = products.find((p: any) => (p.id === productId || p._id === productId));
        if (found) {
            setProduct(found);
            saveRecentlyViewed(found);
        }
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct();
        }
        scrollTo(0, 0);
    }, [productId, products]);

    return (
        <div className="px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between mt-8 mb-5">
                    <div className="text-slate-500 text-xs">
                        Accueil / Produits / <span className="font-semibold text-slate-800">{product?.category || 'High-Tech'}</span>
                    </div>
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description */}
                {product && (<ProductDescription product={product} />)}

                {/* Customer Rating & Reviews Section */}
                {product && (<ProductReviews productId={product.id || product._id} />)}

                {/* Recently Viewed Products Bar */}
                <RecentlyViewed />
            </div>
        </div>
    );
}
