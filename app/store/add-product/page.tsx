'use client'
import { assets, categories as FrenchCategories } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addProduct } from "@/lib/features/product/productSlice"

export default function StoreAddProduct() {
    const dispatch = useDispatch()
    const categories = FrenchCategories

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: categories[0] || "Casques",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
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
                    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || ''
                },
                body: JSON.stringify(newProductData)
            })

            toast.success("Produit ajouté avec succès à votre boutique !")
            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
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
        <form onSubmit={onSubmitHandler} className="text-slate-600 mb-28 max-w-2xl space-y-4">
            <h1 className="text-2xl font-light">Ajouter un Nouveau <span className="text-slate-900 font-bold">Produit</span></h1>
            <p className="mt-4 font-medium text-slate-700 text-sm">Images du produit</p>

            <div className="flex gap-3 mt-2">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-16 w-auto border border-slate-200 p-2 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition' src={images[key] ? URL.createObjectURL(images[key] as unknown as Blob) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-1.5 my-4">
                <span className="font-medium text-slate-700 text-sm">Nom du produit</span>
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Nom complet de l'article" className="w-full p-2.5 outline-none border border-slate-200 rounded-xl text-sm focus:border-blue-500 transition" required />
            </label>

            <label className="flex flex-col gap-1.5 my-4">
                <span className="font-medium text-slate-700 text-sm">Description</span>
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Description détaillée du produit" rows={4} className="w-full p-2.5 outline-none border border-slate-200 rounded-xl text-sm resize-none focus:border-blue-500 transition" required />
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                    <span className="font-medium text-slate-700 text-sm">Prix d'origine MRP</span>
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full p-2.5 outline-none border border-slate-200 rounded-xl text-sm focus:border-blue-500 transition" required />
                </label>
                <label className="flex flex-col gap-1.5">
                    <span className="font-medium text-slate-700 text-sm">Prix de vente</span>
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full p-2.5 outline-none border border-slate-200 rounded-xl text-sm focus:border-blue-500 transition" required />
                </label>
            </div>

            <div className="pt-2">
                <span className="font-medium text-slate-700 text-sm block mb-1.5">Catégorie</span>
                <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full p-2.5 outline-none border border-slate-200 rounded-xl text-sm bg-white focus:border-blue-500 transition" required>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <button disabled={loading} className="bg-blue-600 text-white font-semibold text-xs px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-600/20 cursor-pointer mt-4 active:scale-95">
                {loading ? 'Ajout en cours...' : 'Publier le Produit'}
            </button>
        </form>
    )
}