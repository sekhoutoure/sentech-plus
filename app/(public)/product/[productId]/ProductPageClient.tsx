'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import ProductReviews from "@/components/ProductReviews";
import RecentlyViewed, { saveRecentlyViewed } from "@/components/RecentlyViewed";
import CompareModal from "@/components/CompareModal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCompare } from "@/lib/features/compare/compareSlice";
import { Scale } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductPageClient() {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState<any>();
    const products = useSelector((state: any) => state.product.list);
    const compareIds = useSelector((state: any) => state.compare?.items || []);

    const [isCompareOpen, setIsCompareOpen] = useState(false);

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

    const targetId = product?.id || product?._id || productId;
    const isCompared = compareIds.includes(targetId);

    const handleAddToCompare = () => {
        if (!product) return;
        dispatch(toggleCompare({ productId: targetId }));
        if (!isCompared) {
            toast.success(`"${product.name || 'Produit'}" ajouté au comparateur !`, { icon: '⚖️' });
        } else {
            toast.success(`"${product.name || 'Produit'}" retiré du comparateur.`);
        }
        setIsCompareOpen(true);
    };

    return (
        <div className="px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Breadcrumb & Comparator Button */}
                <div className="flex items-center justify-between mt-8 mb-5">
                    <div className="text-slate-500 text-xs">
                        Accueil / Produits / <span className="font-semibold text-slate-800">{product?.category}</span>
                    </div>

                    <button
                        onClick={handleAddToCompare}
                        className={`inline-flex items-center gap-1.5 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer ${
                            isCompared
                                ? 'bg-[#0B54C2] text-white shadow-xs'
                                : 'bg-[#EAF3FF] hover:bg-[#0B54C2]/15 text-[#0B54C2] border border-[#0B54C2]/20'
                        }`}
                    >
                        <Scale size={15} />
                        <span>{isCompared ? "Dans le comparateur" : "Comparer ce produit"}</span>
                    </button>
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description */}
                {product && (<ProductDescription product={product} />)}

                {/* Customer Rating & Reviews Section */}
                {product && (<ProductReviews productId={product.id || product._id} />)}

                {/* Recently Viewed Products Bar */}
                <RecentlyViewed />

                {/* Side-by-side Product Comparator Modal */}
                <CompareModal
                    isOpen={isCompareOpen}
                    onClose={() => setIsCompareOpen(false)}
                />
            </div>
        </div>
    );
}
