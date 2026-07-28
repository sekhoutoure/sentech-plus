'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Trash2Icon, PlusIcon, TagIcon } from "lucide-react"

const ADMIN_HEADERS = {
    'Content-Type': 'application/json',
    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || ''
}

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    // ✅ Chargement réel depuis l'API
    const fetchCoupons = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/coupons', { headers: ADMIN_HEADERS })
            const data = await res.json()
            if (data.success) {
                setCoupons(data.coupons)
            } else {
                toast.error("Erreur de chargement des coupons")
            }
        } catch (e) {
            toast.error("Erreur réseau")
        } finally {
            setLoading(false)
        }
    }

    // ✅ Création réelle via PUT /api/coupons (admin)
    const handleAddCoupon = async (e) => {
        e.preventDefault()
        if (!newCoupon.code.trim()) {
            toast.error("Veuillez saisir un code promo.")
            return
        }

        try {
            const res = await fetch('/api/coupons', {
                method: 'PUT',
                headers: ADMIN_HEADERS,
                body: JSON.stringify({
                    code: newCoupon.code.toUpperCase().trim(),
                    description: newCoupon.description,
                    discount: Number(newCoupon.discount),
                    forNewUser: newCoupon.forNewUser,
                    forMember: newCoupon.forMember,
                    expiresAt: new Date(newCoupon.expiresAt).toISOString()
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`Code promo ${data.coupon.code} ajouté avec succès !`)
                fetchCoupons()
                setNewCoupon({ code: '', description: '', discount: '', forNewUser: false, forMember: false, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
            } else {
                toast.error(data.message || "Erreur lors de l'ajout")
            }
        } catch (err) {
            toast.error("Erreur réseau.")
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    // ✅ Suppression réelle via DELETE /api/coupons (admin)
    const deleteCoupon = async (code) => {
        try {
            const res = await fetch('/api/coupons', {
                method: 'DELETE',
                headers: ADMIN_HEADERS,
                body: JSON.stringify({ code })
            })
            const data = await res.json()
            if (data.success) {
                setCoupons(prev => prev.filter(c => c.code !== code))
                toast.success(`Code promo ${code} supprimé !`)
            } else {
                toast.error(data.message || "Erreur suppression")
            }
        } catch (err) {
            toast.error("Erreur réseau.")
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    return (
        <div className="text-slate-600 mb-40 max-w-5xl space-y-8">
            {/* Add Coupon */}
            <form onSubmit={handleAddCoupon} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-xl space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Créer un <span className="text-blue-600">Code Promo</span></h2>
                    <p className="text-xs text-slate-500 mt-1">Ajoutez des bons de réduction valides sur le site</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Code Promo (ex: SENTECH50)" className="w-full p-2.5 border border-slate-200 outline-none focus:border-blue-500 rounded-xl text-xs font-semibold uppercase"
                        name="code" value={newCoupon.code} onChange={handleChange} required
                    />
                    <input type="number" placeholder="Réduction (%)" min={1} max={100} className="w-full p-2.5 border border-slate-200 outline-none focus:border-blue-500 rounded-xl text-xs"
                        name="discount" value={newCoupon.discount} onChange={handleChange} required
                    />
                </div>

                <input type="text" placeholder="Description de l'offre (ex: 20% de réduction première commande)" className="w-full p-2.5 border border-slate-200 outline-none focus:border-blue-500 rounded-xl text-xs"
                    name="description" value={newCoupon.description} onChange={handleChange} required
                />

                <label className="block">
                    <span className="text-xs font-medium text-slate-700 block mb-1">Date d'expiration</span>
                    <input type="date" className="w-full p-2.5 border border-slate-200 outline-none focus:border-blue-500 rounded-xl text-xs bg-slate-50"
                        name="expiresAt" value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: new Date(e.target.value) })}
                    />
                </label>

                <div className="flex gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-0 size-4 cursor-pointer"
                            name="forNewUser" checked={newCoupon.forNewUser}
                            onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                        />
                        Pour nouveaux utilisateurs
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-0 size-4 cursor-pointer"
                            name="forMember" checked={newCoupon.forMember}
                            onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                        />
                        Pour membres Plus
                    </label>
                </div>

                <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition shadow-md shadow-blue-600/20 cursor-pointer">
                    Ajouter le Code Promo
                </button>
            </form>

            {/* List Coupons */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Liste des <span className="text-blue-600">Codes Promos</span></h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="min-w-full text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-700">
                            <tr>
                                <th className="py-3 px-4 text-left">Code</th>
                                <th className="py-3 px-4 text-left">Description</th>
                                <th className="py-3 px-4 text-left">Réduction</th>
                                <th className="py-3 px-4 text-left">Expiration</th>
                                <th className="py-3 px-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon.code} className="hover:bg-slate-50 transition">
                                    <td className="py-3.5 px-4 font-bold text-blue-600">{coupon.code}</td>
                                    <td className="py-3.5 px-4 text-slate-800 font-medium">{coupon.description}</td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">-{coupon.discount}%</td>
                                    <td className="py-3.5 px-4 text-slate-500">{format(new Date(coupon.expiresAt), 'dd/MM/yyyy')}</td>
                                    <td className="py-3.5 px-4">
                                        <button 
                                            onClick={() => deleteCoupon(coupon.code)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                            title="Supprimer"
                                        >
                                            <Trash2Icon size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}