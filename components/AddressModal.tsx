'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

import { useDispatch } from "react-redux"
import { addAddress } from "@/lib/features/address/addressSlice"

interface AddressModalProps {
    setShowAddressModal: (show: boolean) => void;
}

const AddressModal = ({ setShowAddressModal }: AddressModalProps) => {
    const dispatch = useDispatch()

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    })

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!address.name || !address.street || !address.city || !address.zip || !address.phone) {
            toast.error("Veuillez remplir tous les champs obligatoires.")
            return
        }
        dispatch(addAddress(address))
        toast.success("Adresse ajoutée avec succès !")
        setShowAddressModal(false)
    }

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md relative border border-slate-100 space-y-4">
                <button 
                    onClick={() => setShowAddressModal(false)}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                    <XIcon size={20} />
                </button>
                
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Ajouter une <span className="text-blue-600">Adresse</span></h2>
                    <p className="text-xs text-slate-500 mt-0.5">Saisissez les coordonnées de votre lieu de livraison</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="name" onChange={handleAddressChange} value={address.name} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Nom complet (ex: Jean Dupont)" required />
                    <input name="email" onChange={handleAddressChange} value={address.email} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="email" placeholder="Adresse e-mail de contact" required />
                    <input name="street" onChange={handleAddressChange} value={address.street} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Rue / Numéro / Bâtiment" required />
                    
                    <div className="grid grid-cols-2 gap-3">
                        <input name="city" onChange={handleAddressChange} value={address.city} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Ville" required />
                        <input name="state" onChange={handleAddressChange} value={address.state} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Région / État" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <input name="zip" onChange={handleAddressChange} value={address.zip} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Code postal (ex: 75001)" required />
                        <input name="country" onChange={handleAddressChange} value={address.country} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Pays" required />
                    </div>

                    <input name="phone" onChange={handleAddressChange} value={address.phone} className="p-2.5 outline-none border border-slate-200 focus:border-blue-500 rounded-xl text-base sm:text-xs w-full" type="text" placeholder="Numéro de téléphone" required />

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer mt-2">
                        Enregistrer l'adresse
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddressModal
