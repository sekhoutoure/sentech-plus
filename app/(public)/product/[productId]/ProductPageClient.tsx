'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import ProductReviews from "@/components/ProductReviews";
import RecentlyViewed, { saveRecentlyViewed } from "@/components/RecentlyViewed";
import CompareModal from "@/components/CompareModal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ScaleIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductPageClient() {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>();
    const products = useSelector((state: any) => state.product.list);

    // Comparator State
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [compareList, setCompareList] = useState<Array<any>>([]);

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

    const handleAddToCompare = () => {
        if (!product) return;
        if (compareList.some(p => (p.id || p._id) === (product.id || product._id))) {
            toast("Ce produit est déjà dans votre comparateur.");
        } else {
            setCompareList([...compareList, product]);
            toast.success("Produit ajouté au comparateur !");
        }
        setIsCompareOpen(true);
    };

    const handleRemoveFromCompare = (id: string) => {
        setCompareList(compareList.filter(p => (p.id || p._id) !== id));
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
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
                    >
                        <ScaleIcon size={15} className="text-blue-600" />
                        <span>Comparer ce produit</span>
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
                    productsToCompare={compareList}
                    onRemoveProduct={handleRemoveFromCompare}
                />
            </div>
        </div>
    );
}
