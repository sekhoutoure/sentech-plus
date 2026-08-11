'use client'
import React, { useState } from 'react'
import { useProductStore } from '@/lib/stores'
import { PlusIcon, SearchIcon, EditIcon, Trash2Icon, PackageIcon, XIcon, CheckIcon } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { categories } from '@/assets/assets'

export default function AdminProductsPage() {
    const { list: products, addProduct, updateProduct, deleteProduct } = useProductStore()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Tous')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        category: categories[0] || 'Casques',
        price: '',
        mrp: '',
        description: '',
        image: ''
    })

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
        const matchesCat = selectedCategory === 'Tous' || product.category?.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCat
    })

    const handleOpenAddModal = () => {
        setEditingProduct(null)
        setFormData({
            name: '',
            category: categories[0] || 'Casques',
            price: '',
            mrp: '',
            description: '',
            image: ''
        })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            mrp: product.mrp || product.price,
            description: product.description || '',
            image: product.images[0] || ''
        })
        setIsModalOpen(true)
    }

    const handleDelete = (id, name) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
            deleteProduct(id)
            toast.success(`Produit "${name}" supprimé !`)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const payload = {
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            mrp: Number(formData.mrp || formData.price),
            description: formData.description,
            images: [formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
            store: { name: 'SenTech Official', username: 'sentech' }
        }

        if (editingProduct) {
            updateProduct({ id: editingProduct.id, ...payload })
            toast.success('Produit mis à jour avec succès')
        } else {
            addProduct(payload)
            toast.success("Nouveau produit ajouté à la boutique !")
        }

        setIsModalOpen(false)
    }

    return (
        <div className="space-y-6 text-slate-800">
            {/* Header Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <PackageIcon className="text-blue-600" /> Gestion des Produits
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Contrôle total sur l'inventaire ({products.length} produit{products.length > 1 ? 's' : ''} au total)
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                >
                    <PlusIcon size={16} /> Ajouter un produit
                </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs w-full sm:w-80">
                    <SearchIcon size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full outline-none bg-transparent"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    <button
                        onClick={() => setSelectedCategory('Tous')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                            selectedCategory === 'Tous' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        Tous
                    </button>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Produit</th>
                                <th className="p-4">Catégorie</th>
                                <th className="p-4">Prix</th>
                                <th className="p-4">MRP (D'origine)</th>
                                <th className="p-4">Boutique</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        Aucun produit ne correspond aux critères.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50/80 transition">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="size-12 rounded-lg border border-slate-200 p-1 flex items-center justify-center bg-white shrink-0">
                                                <Image src={product.images[0]} alt="" width={40} height={40} className="max-h-10 w-auto object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm line-clamp-1">{product.name}</p>
                                                <p className="text-[10px] text-slate-400">ID: {product.id}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-900 text-sm">
                                            {currency}{product.price}
                                        </td>
                                        <td className="p-4 text-slate-400 line-through">
                                            {currency}{product.mrp || product.price}
                                        </td>
                                        <td className="p-4 font-medium text-slate-600">
                                            {product.store?.name || 'SenTech'}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenEditModal(product)}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                                title="Éditer le produit"
                                            >
                                                <EditIcon size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                                title="Supprimer le produit"
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

            {/* Modal Add / Edit Product */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 z-10 border border-slate-100">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-900 text-lg">
                                    {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-full">
                                    <XIcon size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Nom du produit</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700">Prix de vente ({currency})</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700">Prix d'origine MRP ({currency})</label>
                                        <input
                                            type="number"
                                            value={formData.mrp}
                                            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                                            className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Catégorie</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1 bg-white"
                                    >
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700">URL de l'image</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border border-slate-200 p-2.5 rounded-xl text-xs outline-none focus:border-blue-500 mt-1 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer"
                                >
                                    {editingProduct ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
