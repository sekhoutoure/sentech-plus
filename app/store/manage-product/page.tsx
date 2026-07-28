'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useSelector, useDispatch } from "react-redux"
import { deleteProduct, updateProduct } from "@/lib/features/product/productSlice"
import { Trash2Icon } from "lucide-react"

export default function StoreManageProducts() {
    const dispatch = useDispatch()
    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$')
    const products = useSelector((state: any) => state.product.list || [])

    const toggleStock = (productId, currentStock) => {
        const newStock = !currentStock
        dispatch(updateProduct({ id: productId, inStock: newStock }))
        toast.success(newStock ? "Produit marqué comme En Stock !" : "Produit marqué comme En Rupture de Stock !")
    }

    const handleDeleteProduct = (productId, name) => {
        if (confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) {
            dispatch(deleteProduct(productId))
            toast.success(`Produit "${name}" supprimé avec succès !`)
        }
    }

    return (
        <div className="space-y-6 text-slate-800 max-w-5xl mb-28">
            <div>
                <h1 className="text-2xl font-light">Gérer mes <span className="text-slate-900 font-bold">Produits</span></h1>
                <p className="text-xs text-slate-500 mt-1">Activer/désactiver le stock et gérer le catalogue de votre boutique</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3">Produit</th>
                            <th className="px-4 py-3 hidden md:table-cell">Description</th>
                            <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                            <th className="px-4 py-3">Prix</th>
                            <th className="px-4 py-3 text-center">En Stock</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">
                                    Aucun produit dans votre catalogue.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3 items-center">
                                            <div className="size-10 rounded-lg border border-slate-200 p-1 flex items-center justify-center bg-white shrink-0">
                                                <Image width={40} height={40} className='max-h-8 w-auto object-contain' src={product.images[0]} alt="" />
                                            </div>
                                            <span className="font-semibold text-slate-900 line-clamp-1">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs text-slate-500 hidden md:table-cell truncate">{product.description}</td>
                                    <td className="px-4 py-3 hidden md:table-cell text-slate-400 line-through">{currency}{product.mrp}</td>
                                    <td className="px-4 py-3 font-bold text-slate-900">{currency}{product.price}</td>
                                    <td className="px-4 py-3 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                onChange={() => toggleStock(product.id, product.inStock ?? true)} 
                                                checked={product.inStock ?? true} 
                                            />
                                            <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id, product.name)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                            title="Supprimer"
                                        >
                                            <Trash2Icon size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}