'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

export default function CreateStore() {

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        try {
            const savedStore = localStorage.getItem('sentech_user_store')
            if (savedStore) {
                const store = JSON.parse(savedStore)
                setAlreadySubmitted(true)
                setStatus(store.status || 'pending')
                setMessage(store.status === 'approved' 
                    ? "🎉 Félicitations ! Votre demande de boutique a été approuvée." 
                    : "⏳ Votre demande de création de boutique est en cours d'examen par nos équipes.")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if (!storeInfo.name || !storeInfo.username || !storeInfo.email) {
            toast.error("Veuillez remplir tous les champs obligatoires.")
            return
        }

        try {
            const payload = {
                name: storeInfo.name,
                username: storeInfo.username,
                description: storeInfo.description,
                email: storeInfo.email,
                contact: storeInfo.contact,
                address: storeInfo.address,
                logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                status: 'pending'
            }

            await fetch('/api/stores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            localStorage.setItem('sentech_user_store', JSON.stringify(payload))
            setAlreadySubmitted(true)
            setStatus('pending')
            setMessage("⏳ Votre demande de création de boutique a été envoyée avec succès ! Elle est en cours d'examen par notre équipe d'administration.")
            toast.success("Demande de boutique soumise avec succès !")
        } catch (err) {
            toast.error("Erreur lors de l'envoi de la demande.")
        }
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Envoi des données..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-4 text-slate-600">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-light">Créer Votre <span className="text-slate-900 font-bold">Boutique</span></h1>
                            <p className="max-w-lg text-slate-500 text-sm mt-1">Pour devenir vendeur sur SenTech Plus, soumettez les détails de votre boutique. Elle sera activée après vérification administrative.</p>
                        </div>

                        <label className="mt-6 cursor-pointer font-medium text-slate-700 text-sm">
                            Logo de la boutique
                            <Image src={(storeInfo.image as any) instanceof Blob ? URL.createObjectURL(storeInfo.image as unknown as Blob) : (typeof storeInfo.image === 'string' ? storeInfo.image : assets.upload_area)} className="rounded-xl mt-2 h-20 w-auto border border-slate-200 p-2 bg-slate-50 hover:bg-slate-100 transition" alt="Logo" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: (e.target.files?.[0] || '') as any })} hidden />
                        </label>

                        <div className="w-full max-w-lg space-y-1">
                            <p className="font-medium text-slate-700 text-sm">Nom d'utilisateur</p>
                            <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Entrez le nom d'utilisateur de la boutique" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-2.5 rounded-xl text-sm transition" />
                        </div>

                        <div className="w-full max-w-lg space-y-1">
                            <p className="font-medium text-slate-700 text-sm">Nom de la boutique</p>
                            <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Entrez le nom complet de la boutique" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-2.5 rounded-xl text-sm transition" />
                        </div>

                        <div className="w-full max-w-lg space-y-1">
                            <p className="font-medium text-slate-700 text-sm">Description</p>
                            <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={4} placeholder="Décrivez votre boutique et vos produits" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-2.5 rounded-xl text-sm resize-none transition" />
                        </div>

                        <div className="w-full max-w-lg space-y-1">
                            <p className="font-medium text-slate-700 text-sm">Adresse E-mail</p>
                            <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="contact@votreboutique.com" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-2.5 rounded-xl text-sm transition" />
                        </div>

                        <div className="w-full max-w-lg space-y-1">
                            <p className="font-medium text-slate-700 text-sm">Numéro de Téléphone</p>
                            <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="+33 6 12 34 56 78" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-2.5 rounded-xl text-sm transition" />
                        </div>

                        <div className="w-full max-w-lg space-y-1">
                            <p className="font-medium text-slate-700 text-sm">Adresse Physique</p>
                            <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={3} placeholder="Entrez l'adresse de votre siège ou magasin" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-2.5 rounded-xl text-sm resize-none transition" />
                        </div>

                        <button className="bg-blue-600 text-white font-medium px-12 py-3 rounded-xl mt-6 mb-40 active:scale-95 hover:bg-blue-700 transition shadow-md shadow-blue-600/20 cursor-pointer">
                            Soumettre la demande
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">Redirection vers le tableau de bord dans <span className="font-semibold">5 secondes</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}