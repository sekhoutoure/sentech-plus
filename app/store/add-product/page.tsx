'use client'
import { assets, categories as FrenchCategories } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { addProduct } from "@/lib/features/product/productSlice"
import { PlusIcon, ShoppingBagIcon, TagIcon, DollarSignIcon, SparklesIcon } from "lucide-react"

export default function StoreAddProduct() {
    const dispatch = useDispatch()
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')
    const categories = FrenchCategories

    const [images, setImages] = useState<Record<string, any>>({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: categories[0] || "Casques",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!productInfo.name || !productInfo.price || !productInfo.description) {
            toast.error("Veuillez remplir tous les champs obligatoires du produit.")
            return
        }

        setLoading(true)

        try {
            const newProductData = {
                name: productInfo.name,
                description: productInfo.description,
                mrp: Number(productInfo.mrp || productInfo.price),
                price: Number(productInfo.price),
                category: productInfo.category,
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
                store: { name: 'Ma Boutique Vendeur', username: 'seller' }
            }

            dispatch(addProduct(newProductData))

            await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProductData)
            })

            toast.success("Article publié avec succès sur votre boutique SenTech Plus !")
            setProductInfo({
                name: "",
                description: "",
                mrp: "",
                price: "",
                category: categories[0] || "Casques",
            })
            setImages({ 1: null, 2: null, 3: null, 4: null })
        } catch (err) {
            toast.error("Erreur lors de l'ajout du produit.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="text-slate-800 mb-28 max-w-3xl space-y-6">
            
            {/* Header */}
            <div className="space-y-1.5 border-b border-slate-200 pb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    <SparklesIcon size={13} /> Publication Catalogue Vendeur
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Ajouter un Nouveau Produit
                </h1>
                <p className="text-xs text-slate-500">
                    Publiez vos nouveaux articles High-Tech et rendez-les disponibles pour des milliers de clients au Sénégal.
                </p>
            </div>

            {/* Images Upload Section */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="font-bold text-slate-900 text-xs block">
                    Visuels du Produit (jusqu'à 4 photos HD)
                </label>
                <p className="text-[11px] text-slate-500">Cliquez sur une case ci-dessous pour importer vos photos.</p>

                <div className="flex gap-3 pt-1">
                    {Object.keys(images).map((key) => (
                        <label key={key} htmlFor={`images${key}`} className="cursor-pointer">
                            <Image 
                                width={120} 
                                height={120} 
                                className='h-20 w-20 object-cover border border-slate-200 p-1.5 rounded-2xl bg-white hover:bg-slate-100 transition shadow-xs' 
                                src={images[key] ? URL.createObjectURL(images[key] as unknown as Blob) : assets.upload_area} 
                                alt={`Visuel ${key}`} 
                            />
                            <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files?.[0] })} hidden />
                        </label>
                    ))}
                </div>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                    <ShoppingBagIcon size={14} className="text-blue-600" /> Titre du produit *
                </label>
                <input 
                    type="text" 
                    name="name" 
                    onChange={onChangeHandler} 
                    value={productInfo.name} 
                    placeholder="Ex: Écouteurs Bluetooth Pro ANC - Réduction de Bruit" 
                    className="w-full p-3 outline-none border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-blue-500 focus:bg-white transition" 
                    required 
                />
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs">Description détaillée & Fiche technique *</label>
                <textarea 
                    name="description" 
                    onChange={onChangeHandler} 
                    value={productInfo.description} 
                    placeholder="Précisez l'autonomie, la compatibilité (iPhone / Android), la portée Bluetooth, la garantie et le contenu de la boîte." 
                    rows={4} 
                    className="w-full p-3 outline-none border border-slate-200 rounded-xl text-xs resize-none bg-slate-50/50 focus:border-blue-500 focus:bg-white transition" 
                    required 
                />
            </div>

            {/* Price & MRP Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                        <TagIcon size={14} className="text-slate-400" /> Prix d'origine barré (MRP - Optionnel)
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-blue-500 focus-within:bg-white transition">
                        <span className="text-xs font-bold text-slate-400 mr-2">{currency}</span>
                        <input 
                            type="number" 
                            name="mrp" 
                            onChange={onChangeHandler} 
                            value={productInfo.mrp} 
                            placeholder="Ex: 45" 
                            className="w-full py-3 text-xs outline-none bg-transparent text-slate-800" 
                        />
                    </div>
                    <p className="text-[11px] text-slate-400">Permet d'afficher un badge de promotion (-X%).</p>
                </div>

                <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                        <DollarSignIcon size={14} className="text-emerald-600" /> Prix de vente final *
                    </label>
                    <div className="flex items-center border border-slate-200 rounded-xl px-3 bg-slate-50/50 focus-within:border-blue-500 focus-within:bg-white transition">
                        <span className="text-xs font-bold text-emerald-600 mr-2">{currency}</span>
                        <input 
                            type="number" 
                            name="price" 
                            onChange={onChangeHandler} 
                            value={productInfo.price} 
                            placeholder="Ex: 35" 
                            className="w-full py-3 text-xs outline-none bg-transparent text-slate-800 font-bold" 
                            required 
                        />
                    </div>
                    <p className="text-[11px] text-slate-400">Le prix payé par le client final.</p>
                </div>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 text-xs block">Catégorie du Produit *</label>
                <select 
                    name="category"
                    onChange={onChangeHandler} 
                    value={productInfo.category} 
                    className="w-full p-3 outline-none border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:border-blue-500 focus:bg-white transition cursor-pointer font-medium" 
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <button 
                type="submit"
                disabled={loading} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-10 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/25 cursor-pointer mt-4 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                <PlusIcon size={16} />
                <span>{loading ? 'Publication en cours...' : 'Publier cet Article en Boutique'}</span>
            </button>

        </form>
    )
}