'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore, useCartStore } from "@/lib/stores";
import { 
    Star, 
    Truck, 
    ShieldCheck, 
    RefreshCw, 
    ShoppingCart, 
    MessageCircle, 
    Check, 
    ArrowRight,
    Play,
    Minus,
    Plus,
    Maximize2,
    X,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    PackageCheck,
    Info,
    CheckCircle2
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import ProductCard from "./ProductCard";
import toast from "react-hot-toast";

interface Product {
    id: string;
    _id?: string;
    name: string;
    images?: string[];
    image?: any;
    price: number;
    mrp?: number;
    rating?: { rating: number }[];
    description?: string;
    category?: string;
    inStock?: boolean;
    stock?: number;
    video?: string;
    videoUrl?: string;
    variants?: {
        colors?: string[];
        models?: string[];
        capacities?: string[];
        sizes?: string[];
    };
    specs?: { label: string; value: string }[];
    boxContent?: string[];
    [key: string]: any;
}

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const productId = product?.id || product?._id || 'prod_unknown';
    const addToCart = useCartStore(s => s.addToCart);
    const router = useRouter();
    const allProducts = useProductStore(s => s.list);

    // Images List
    const galleryImages = Array.isArray(product?.images) && product.images.length > 0
        ? product.images
        : [product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    // Dynamic Variant Options (Colors, Capacities, Models, Sizes)
    const availableColors = product?.variants?.colors || product?.colors || ['Noir', 'Blanc', 'Bleu'];
    const availableCapacities = product?.variants?.capacities || product?.capacities || ['128 Go', '256 Go'];
    const availableModels = product?.variants?.models || product?.models || null;

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Active Tab for details
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'box' | 'shipping'>('description');

    useEffect(() => {
        setActiveImageIndex(0);
        setSelectedColor(null);
        setSelectedCapacity(null);
        setSelectedModel(null);
        setValidationError(null);
        setQuantity(1);
    }, [product]);

    const isOutOfStock = product?.inStock === false || (typeof product?.stock === 'number' && product.stock === 0);
    const maxStock = typeof product?.stock === 'number' && product.stock > 0 ? product.stock : 99;

    // Rating calculations
    const ratingsList = Array.isArray(product?.rating) ? product.rating : [];
    const averageRating = ratingsList.length > 0 
        ? (ratingsList.reduce((acc: number, item: any) => acc + (item.rating || 0), 0) / ratingsList.length).toFixed(1)
        : null;

    const discountPercentage = product?.mrp && product?.mrp > product?.price 
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    // Video URL check
    const videoSource = product?.video || product?.videoUrl || null;

    // Option Validation Logic
    const validateOptions = (): boolean => {
        if (availableColors && availableColors.length > 0 && !selectedColor) {
            setValidationError('Veuillez sélectionner une Couleur avant d’ajouter au panier.');
            toast.error('Veuillez sélectionner une Couleur.', { icon: '⚠️' });
            return false;
        }
        if (availableCapacities && availableCapacities.length > 0 && !selectedCapacity) {
            setValidationError('Veuillez sélectionner une Capacité avant d’ajouter au panier.');
            toast.error('Veuillez sélectionner une Capacité.', { icon: '⚠️' });
            return false;
        }
        if (availableModels && availableModels.length > 0 && !selectedModel) {
            setValidationError('Veuillez sélectionner un Modèle avant d’ajouter au panier.');
            toast.error('Veuillez sélectionner un Modèle.', { icon: '⚠️' });
            return false;
        }
        setValidationError(null);
        return true;
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        if (!validateOptions()) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(productId);
        }
        setIsAdded(true);
        toast.success(`"${product.name}" (${quantity}) ajouté au panier !`, {
            icon: '🛒',
            style: { borderRadius: '12px', background: '#172033', color: '#fff' }
        });
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        if (!validateOptions()) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(productId);
        }
        router.push('/cart');
    };

    const handleWhatsAppOrder = () => {
        const optionText = [selectedColor, selectedCapacity, selectedModel].filter(Boolean).join(' / ');
        const message = `Bonjour SenTechPLUS, je souhaite commander l'article : ${product.name}${optionText ? ` (${optionText})` : ''} - Quantité : ${quantity} au prix de ${formatPrice(product.price * quantity)}. Est-il disponible pour livraison à Dakar ?`;
        window.open(`https://wa.me/221770000000?text=${encodeURIComponent(message)}`, '_blank');
    };

    // Related Products (exclude current product)
    const relatedProducts = allProducts
        .filter((p: any) => (p.id || p._id) !== productId && p.category === product.category)
        .slice(0, 4);

    return (
        <div className="w-full bg-[#F6F9FD] min-h-screen py-4 sm:py-8">
            <div className="max-w-[1280px] mx-auto px-3 sm:px-6 space-y-6 sm:space-y-10">

                {/* Breadcrumbs Navigation */}
                <nav aria-label="Fil d'Ariane" className="text-xs text-[#64748B] flex items-center gap-1.5 flex-wrap">
                    <Link href="/" className="hover:text-[#1677FF] transition-colors">Accueil</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#1677FF] transition-colors">Boutique</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${encodeURIComponent(product?.category || '')}`} className="hover:text-[#1677FF] transition-colors">
                        {product?.category || 'High-Tech'}
                    </Link>
                    <span>/</span>
                    <span className="font-bold text-[#172033] truncate max-w-[200px] sm:max-w-none">{product?.name}</span>
                </nav>

                {/* Main Product Showcase Grid (Desktop 2 cols) */}
                <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#DCE5F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

                    {/* ═══ GALERIE MÉDIA (Desktop 6 cols / Mobile Touch Swipe) ═══ */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        
                        {/* Grande image principale */}
                        <div className="relative w-full aspect-square bg-[#F5F8FC] rounded-2xl border border-[#DCE5F0] overflow-hidden flex items-center justify-center group">
                            
                            {/* Badges Overlay */}
                            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                                {discountPercentage > 0 && (
                                    <span className="bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                                        -{discountPercentage}%
                                    </span>
                                )}
                                {isOutOfStock ? (
                                    <span className="bg-[#DC2626] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                                        Rupture
                                    </span>
                                ) : (
                                    <span className="bg-[#16C784] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                                        En stock
                                    </span>
                                )}
                            </div>

                            {/* Lightbox / Zoom Button */}
                            <button
                                onClick={() => setIsLightboxOpen(true)}
                                aria-label="Agrandir l'image"
                                className="absolute top-3 right-3 z-20 size-9 rounded-full bg-white/90 hover:bg-white text-[#172033] flex items-center justify-center shadow-2xs border border-[#DCE5F0] transition active:scale-95 cursor-pointer"
                            >
                                <Maximize2 size={16} />
                            </button>

                            {/* Current Image */}
                            <Image
                                src={galleryImages[activeImageIndex]}
                                alt={product?.name || "Image Produit"}
                                fill
                                priority
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
                                sizes="(max-width: 768px) 100vw, 600px"
                            />

                            {/* Mobile Swipe Navigation Controls */}
                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                                        aria-label="Image précédente"
                                        className="sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/80 text-[#172033] flex items-center justify-center shadow-2xs border border-[#DCE5F0]"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)}
                                        aria-label="Image suivante"
                                        className="sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full bg-white/80 text-[#172033] flex items-center justify-center shadow-2xs border border-[#DCE5F0]"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </>
                            )}

                            {/* Mobile Image Counter Badge */}
                            {galleryImages.length > 1 && (
                                <span className="sm:hidden absolute bottom-3 right-3 z-20 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                                    {activeImageIndex + 1} / {galleryImages.length}
                                </span>
                            )}
                        </div>

                        {/* Thumbnails Row (Desktop & Mobile) */}
                        {galleryImages.length > 1 && (
                            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                                {galleryImages.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative size-16 sm:size-20 rounded-xl bg-[#F5F8FC] border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                                            activeImageIndex === idx
                                                ? 'border-[#1677FF] ring-2 ring-[#1677FF]/20'
                                                : 'border-[#DCE5F0] hover:border-slate-300'
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Miniature ${idx + 1}`}
                                            fill
                                            className="object-contain p-1"
                                            sizes="80px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Responsive Embedded Video Player (ONLY if video exists) */}
                        {videoSource && (
                            <div className="mt-2 rounded-2xl overflow-hidden border border-[#DCE5F0] bg-black">
                                <div className="p-2 bg-[#172033] text-white flex items-center gap-2 text-xs font-bold">
                                    <Play size={14} className="text-[#1677FF]" />
                                    <span>Vidéo de présentation du produit</span>
                                </div>
                                <video
                                    controls
                                    poster={galleryImages[0]}
                                    src={videoSource}
                                    className="w-full aspect-video object-cover"
                                >
                                    Votre navigateur ne supporte pas la lecture de vidéo.
                                </video>
                            </div>
                        )}
                    </div>

                    {/* ═══ INFORMATIONS & OPTIONS PRODUIT (6 cols) ═══ */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                            
                            {/* Category Tag */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-xs font-bold uppercase tracking-wider border border-[#1677FF]/15">
                                {product?.category || 'High-Tech'}
                            </span>

                            {/* Product Name */}
                            <h1 className="text-xl sm:text-3xl font-extrabold text-[#172033] tracking-tight leading-snug">
                                {product?.name || 'Équipement SenTechPLUS'}
                            </h1>

                            {/* Ratings & Avis Client */}
                            {averageRating && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < Math.round(Number(averageRating)) ? "#F59E0B" : "none"}
                                                className={i < Math.round(Number(averageRating)) ? "text-amber-400" : "text-slate-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-extrabold text-[#172033]">{averageRating}</span>
                                    <span className="text-xs text-[#64748B]">({ratingsList.length} avis certifiés)</span>
                                </div>
                            )}

                            {/* Pricing Box */}
                            <div className="p-4 rounded-2xl bg-[#F8FBFF] border border-[#DCE5F0] flex items-baseline justify-between gap-3 flex-wrap">
                                <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-2xl sm:text-3xl font-black text-[#172033]">
                                        {formatPrice(product?.price * quantity)}
                                    </span>
                                    {product?.mrp && product.mrp > product.price && (
                                        <span className="text-sm sm:text-base font-normal text-[#64748B] line-through">
                                            {formatPrice(product.mrp * quantity)}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                    isOutOfStock 
                                        ? 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20' 
                                        : 'bg-[#16C784]/10 text-[#16C784] border-[#16C784]/20'
                                }`}>
                                    {isOutOfStock ? 'Rupture de stock' : 'En stock • Livraison Express Dakar'}
                                </span>
                            </div>

                            {/* Validation Warning Message */}
                            {validationError && (
                                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold flex items-center gap-2 animate-bounce">
                                    <AlertCircle size={16} className="text-[#F97316] shrink-0" />
                                    <span>{validationError}</span>
                                </div>
                            )}

                            {/* ═══ VARIANTES & OPTIONS DYNAMIQUES ═══ */}
                            <div className="space-y-4 pt-2 border-t border-[#F1F6FC]">
                                
                                {/* Option Couleur */}
                                {availableColors && availableColors.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                                            <span>Couleur :</span>
                                            <span className="text-[#1677FF] font-black">{selectedColor || 'Choisir une couleur...'}</span>
                                        </label>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {availableColors.map((color: string) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedColor(color);
                                                        setValidationError(null);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                                        selectedColor === color
                                                            ? 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-2xs'
                                                            : 'bg-white text-[#172033] border-[#DCE5F0] hover:border-slate-300'
                                                    }`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Option Capacité */}
                                {availableCapacities && availableCapacities.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                                            <span>Capacité / Mémoire :</span>
                                            <span className="text-[#1677FF] font-black">{selectedCapacity || 'Choisir la capacité...'}</span>
                                        </label>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {availableCapacities.map((cap: string) => (
                                                <button
                                                    key={cap}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCapacity(cap);
                                                        setValidationError(null);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                                        selectedCapacity === cap
                                                            ? 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-2xs'
                                                            : 'bg-white text-[#172033] border-[#DCE5F0] hover:border-slate-300'
                                                    }`}
                                                >
                                                    {cap}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Option Modèle */}
                                {availableModels && availableModels.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                                            <span>Modèle :</span>
                                            <span className="text-[#1677FF] font-black">{selectedModel || 'Choisir un modèle...'}</span>
                                        </label>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {availableModels.map((mod: string) => (
                                                <button
                                                    key={mod}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedModel(mod);
                                                        setValidationError(null);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                                        selectedModel === mod
                                                            ? 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-2xs'
                                                            : 'bg-white text-[#172033] border-[#DCE5F0] hover:border-slate-300'
                                                    }`}
                                                >
                                                    {mod}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sélecteur de Quantité (− 1 +) */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#172033]">Quantité :</label>
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center border border-[#DCE5F0] rounded-xl bg-white p-1">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                                disabled={quantity <= 1}
                                                aria-label="Diminuer la quantité"
                                                className="size-8 rounded-lg text-[#172033] hover:bg-[#F5F8FC] flex items-center justify-center disabled:opacity-40 transition cursor-pointer"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-black text-[#172033]">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((prev) => Math.min(maxStock, prev + 1))}
                                                disabled={quantity >= maxStock}
                                                aria-label="Augmenter la quantité"
                                                className="size-8 rounded-lg text-[#172033] hover:bg-[#F5F8FC] flex items-center justify-center disabled:opacity-40 transition cursor-pointer"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="text-xs text-[#64748B]">({maxStock} disponibles)</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ═══ BOUTONS D'ACTION (Ajouter au panier & Commander) ═══ */}
                        <div className="space-y-3 pt-4 border-t border-[#F1F6FC]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Bouton Principal: Ajouter au panier */}
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className={`w-full h-[48px] rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95 ${
                                        isOutOfStock
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-[#DCE5F0]'
                                            : isAdded
                                            ? 'bg-[#16C784] text-white'
                                            : 'bg-[#1677FF] hover:bg-[#123B78] text-white'
                                    }`}
                                >
                                    {isAdded ? (
                                        <><Check size={18} /><span>Ajouté !</span></>
                                    ) : (
                                        <><ShoppingCart size={18} /><span>Ajouter au panier</span></>
                                    )}
                                </button>

                                {/* Bouton Secondaire: Commander maintenant */}
                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={isOutOfStock}
                                    className="w-full h-[48px] rounded-xl font-bold text-sm bg-[#0B1F4B] hover:bg-[#172033] text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                                >
                                    <span>Commander maintenant</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            {/* Option 1-Click Order via WhatsApp */}
                            <button
                                type="button"
                                onClick={handleWhatsAppOrder}
                                className="w-full h-[44px] rounded-xl font-bold text-xs bg-[#25D366] hover:bg-[#1EBD58] text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                            >
                                <MessageCircle size={16} />
                                <span>Commander instantanément sur WhatsApp</span>
                            </button>

                            {/* Trust Commitments */}
                            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-[#64748B]">
                                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <Truck size={14} className="text-[#1677FF] shrink-0" />
                                    <span>Livraison Dakar H+2</span>
                                </div>
                                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <ShieldCheck size={14} className="text-[#16C784] shrink-0" />
                                    <span>Garantie 7 Jours</span>
                                </div>
                                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <RefreshCw size={14} className="text-[#F97316] shrink-0" />
                                    <span>Paiement Wave/OM</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ═══ SECTIONS DÉTAILLÉES (Description, Caractéristiques, Contenu, Livraison) ═══ */}
                <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#DCE5F0] shadow-[0_4px_20px_rgba(23,32,51,0.04)] space-y-6">
                    
                    {/* Navigation Onglets */}
                    <div className="flex items-center gap-2 border-b border-[#DCE5F0] pb-3 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                                activeTab === 'description'
                                    ? 'bg-[#1677FF] text-white shadow-2xs'
                                    : 'bg-[#F5F8FC] text-[#64748B] hover:text-[#172033]'
                            }`}
                        >
                            Description complète
                        </button>
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                                activeTab === 'specs'
                                    ? 'bg-[#1677FF] text-white shadow-2xs'
                                    : 'bg-[#F5F8FC] text-[#64748B] hover:text-[#172033]'
                            }`}
                        >
                            Caractéristiques techniques
                        </button>
                        <button
                            onClick={() => setActiveTab('box')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                                activeTab === 'box'
                                    ? 'bg-[#1677FF] text-white shadow-2xs'
                                    : 'bg-[#F5F8FC] text-[#64748B] hover:text-[#172033]'
                            }`}
                        >
                            Contenu de la boîte
                        </button>
                        <button
                            onClick={() => setActiveTab('shipping')}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                                activeTab === 'shipping'
                                    ? 'bg-[#1677FF] text-white shadow-2xs'
                                    : 'bg-[#F5F8FC] text-[#64748B] hover:text-[#172033]'
                            }`}
                        >
                            Livraison & Garantie
                        </button>
                    </div>

                    {/* Contenu Onglet Description */}
                    {activeTab === 'description' && (
                        <div className="space-y-4 text-xs sm:text-sm text-[#64748B] leading-relaxed">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">
                                À propos du produit {product?.name}
                            </h2>
                            <p>
                                {product?.description || `${product?.name} est un équipement haut de gamme sélectionné par SenTechPLUS pour sa qualité de fabrication et ses performances exceptionnelles. Testé et approuvé pour le marché sénégalais.`}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <CheckCircle2 size={16} className="text-[#1677FF] shrink-0 mt-0.5" />
                                    <span>Conception premium ultra-résistante.</span>
                                </div>
                                <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <CheckCircle2 size={16} className="text-[#1677FF] shrink-0 mt-0.5" />
                                    <span>Garantie d'authenticité certifiée SenTechPLUS.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenu Onglet Caractéristiques (Tableau Structuré) */}
                    {activeTab === 'specs' && (
                        <div className="space-y-3">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">Fiche Technique</h2>
                            <div className="border border-[#DCE5F0] rounded-2xl overflow-hidden">
                                <table className="w-full text-xs sm:text-sm text-left">
                                    <tbody className="divide-y divide-[#DCE5F0]">
                                        <tr className="bg-[#F8FBFF]">
                                            <td className="p-3 font-bold text-[#172033] w-1/3">Marque / Référence</td>
                                            <td className="p-3 text-[#64748B]">SenTechPLUS ({product?.category || 'High-Tech'})</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-bold text-[#172033]">Compatibilité</td>
                                            <td className="p-3 text-[#64748B]">iOS, Android, Windows, Mac OS</td>
                                        </tr>
                                        <tr className="bg-[#F8FBFF]">
                                            <td className="p-3 font-bold text-[#172033]">Garantie</td>
                                            <td className="p-3 text-[#64748B]">7 Jours satisfait ou remboursé</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-bold text-[#172033]">Livraison</td>
                                            <td className="p-3 text-[#64748B]">Express Dakar (H+2 à 24h)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Contenu Onglet Contenu de la boîte */}
                    {activeTab === 'box' && (
                        <div className="space-y-3">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">Inclus dans le coffret</h2>
                            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
                                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <PackageCheck size={16} className="text-[#1677FF]" />
                                    <span>1 × Équipement principal {product?.name}</span>
                                </li>
                                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <PackageCheck size={16} className="text-[#1677FF]" />
                                    <span>1 × Câble de charge / alimentation officiel</span>
                                </li>
                                <li className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0]">
                                    <PackageCheck size={16} className="text-[#1677FF]" />
                                    <span>1 × Guide d'utilisation rapide en français</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Contenu Onglet Livraison */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-3 text-xs sm:text-sm text-[#64748B]">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">Informations de Livraison au Sénégal</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0] space-y-1">
                                    <div className="font-bold text-[#172033] flex items-center gap-1.5">
                                        <Truck size={16} className="text-[#1677FF]" />
                                        <span>Livraison Dakar</span>
                                    </div>
                                    <p>Livré le jour même ou sous 24h à domicile. Paiement cash, Wave ou Orange Money à la réception.</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#F8FBFF] border border-[#DCE5F0] space-y-1">
                                    <div className="font-bold text-[#172033] flex items-center gap-1.5">
                                        <Info size={16} className="text-[#1677FF]" />
                                        <span>Régions du Sénégal</span>
                                    </div>
                                    <p>Expédition sous 24h-48h vers Thiès, Saint-Louis, Mbour, Ziguinchor et toutes les régions.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* ═══ PRODUITS SIMILAIRES ("Vous pourriez également aimer") ═══ */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-2">
                            <h2 className="text-lg sm:text-2xl font-extrabold text-[#172033]">
                                Vous pourriez également aimer
                            </h2>
                            <Link href="/shop" className="text-xs font-bold text-[#1677FF] hover:underline">
                                Voir la boutique →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                            {relatedProducts.map((relProd: any) => (
                                <ProductCard key={relProd.id || relProd._id} product={relProd} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Lightbox Fullscreen Modal */}
                {isLightboxOpen && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Fermer le plein écran"
                            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                        <div className="relative w-full max-w-4xl aspect-square">
                            <Image
                                src={galleryImages[activeImageIndex]}
                                alt={product?.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}

            </div>

            {/* ═══ BARRE FIXE D'ACTION MOBILE AU DÉFILEMENT (Marketplace Experience) ═══ */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/96 backdrop-blur-md border-t border-[#DCE5F0] p-2.5 px-3 shadow-[0_-4px_20px_rgba(23,32,51,0.08)] flex items-center gap-2">
                <div className="flex flex-col shrink-0">
                    <span className="text-[9px] text-[#64748B] font-bold uppercase">Total</span>
                    <span className="text-sm font-black text-[#172033]">{formatPrice(product?.price * quantity)}</span>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 h-[42px] rounded-xl bg-[#1677FF] text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-2xs"
                >
                    <ShoppingCart size={14} />
                    <span>Panier</span>
                </button>

                <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 h-[42px] rounded-xl bg-[#0B1F4B] text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-2xs"
                >
                    <span>Commander</span>
                    <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
}
