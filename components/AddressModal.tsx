'use client'
import { XIcon, MapPinIcon, PhoneIcon, UserIcon, MailIcon, BuildingIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useAddressStore } from "@/lib/stores"

interface AddressModalProps {
    setShowAddressModal: (show: boolean) => void;
}

const AddressModal = ({ setShowAddressModal }: AddressModalProps) => {
    const addAddress = useAddressStore(s => s.addAddress)

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: 'Dakar',
        state: 'Dakar',
        zip: '11500',
        country: 'Sénégal',
        phone: '+221 '
    })

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!address.name || !address.street || !address.city || !address.phone) {
            toast.error("Veuillez remplir les informations de livraison obligatoires.")
            return
        }
        addAddress(address)
        toast.success("Adresse de livraison au Sénégal enregistrée avec succès !")
        setShowAddressModal(false)
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg relative border border-slate-200/80 space-y-4">
                <button 
                    onClick={() => setShowAddressModal(false)}
                    aria-label="Fermer la fenêtre d'adresse"
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                    <XIcon size={20} />
                </button>
                
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <MapPinIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Nouvelle Adresse de Livraison</h2>
                        <p className="text-xs text-slate-500">Pour la livraison express à Dakar ou dans les régions du Sénégal</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <UserIcon size={14} className="text-slate-400" /> Nom du destinataire *
                        </label>
                        <input name="name" onChange={handleAddressChange} value={address.name} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50" type="text" placeholder="Ex: Mamadou Diallo" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <MailIcon size={14} className="text-slate-400" /> E-mail de suivi *
                        </label>
                        <input name="email" onChange={handleAddressChange} value={address.email} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50" type="email" placeholder="Ex: mamadou@exemple.sn" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <BuildingIcon size={14} className="text-slate-400" /> Adresse exacte / Quartier / Rue *
                        </label>
                        <input name="street" onChange={handleAddressChange} value={address.street} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50" type="text" placeholder="Ex: Avenue Cheikh Anta Diop, Immeuble B, Fann" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Ville *</label>
                            <input name="city" onChange={handleAddressChange} value={address.city} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50" type="text" placeholder="Ex: Dakar, Thiès" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Région *</label>
                            <input name="state" onChange={handleAddressChange} value={address.state} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50" type="text" placeholder="Ex: Dakar" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Code postal / Zone</label>
                            <input name="zip" onChange={handleAddressChange} value={address.zip} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50" type="text" placeholder="11500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Pays *</label>
                            <input name="country" onChange={handleAddressChange} value={address.country} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50 font-semibold" type="text" placeholder="Sénégal" required />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <PhoneIcon size={14} className="text-blue-600" /> Téléphone pour la livraison *
                        </label>
                        <input name="phone" onChange={handleAddressChange} value={address.phone} className="p-3 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-xs w-full bg-slate-50/50 font-semibold" type="text" placeholder="+221 77 000 00 00" required />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/25 cursor-pointer mt-3">
                        Enregistrer cette Adresse
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddressModal
