'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { StoreIcon, SparklesIcon, MapPinIcon, PhoneIcon, MailIcon, InfoIcon } from "lucide-react"

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

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                    ? "🎉 Félicitations ! Votre boutique SenTech Plus a été validée. Accédez à votre espace vendeur pour publier vos produits." 
                    : "⏳ Votre demande de création de boutique à Dakar est en cours d'examen par notre équipe d'administration.")
            }
        } catch (e) {
            if (process.env.NODE_ENV !== 'production') console.error('[create-store]', e)
        } finally {
            setLoading(false)
        }
    }

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!storeInfo.name || !storeInfo.username || !storeInfo.email || !storeInfo.contact) {
            toast.error("Veuillez remplir tous les champs obligatoires.")
            return
        }

        try {
            const payload = {
                name: storeInfo.name,
                username: storeInfo.username.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                description: storeInfo.description,
                email: storeInfo.email,
                contact: storeInfo.contact,
                address: storeInfo.address || 'Dakar, Sénégal',
                logo: typeof storeInfo.image === 'string' && storeInfo.image ? storeInfo.image : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
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
            setMessage("⏳ Votre demande de boutique SenTech Plus a été transmise avec succès ! Notre équipe d'administration procède à la validation sous 24h.")
            toast.success("Demande de boutique enregistrée avec succès !")
        } catch (err) {
            toast.error("Erreur lors de l'enregistrement de votre boutique.")
        }
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16 text-slate-800">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Validation de votre boutique en cours..." })} className="max-w-3xl mx-auto space-y-6">
                        
                        {/* Title Header */}
                        <div className="space-y-2 border-b border-slate-200 pb-6">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                <SparklesIcon size={14} /> Espace Vendeur SaaS SenTech Plus
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900">
                                Ouvrir ma Boutique en Ligne au Sénégal
                            </h1>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Vendez vos accessoires High-Tech sur la plateforme n°1 à Dakar. Remplissez les informations ci-dessous pour soumettre votre candidature vendeur.
                            </p>
                        </div>

                        {/* Logo Upload */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
                            <label className="cursor-pointer font-bold text-slate-900 text-sm block">
                                Logo ou Visuel de la Boutique
                            </label>
                            <p className="text-xs text-slate-500">Format recommandé : PNG, JPG ou WEBP (min. 300x300px)</p>
                            <div className="flex items-center gap-4 pt-2">
                                <Image src={(storeInfo.image as any) instanceof Blob ? URL.createObjectURL(storeInfo.image as unknown as Blob) : (typeof storeInfo.image === 'string' && storeInfo.image ? storeInfo.image : assets.upload_area)} className="rounded-2xl h-24 w-24 object-cover border border-slate-200 p-2 bg-white hover:bg-slate-100 transition shadow-xs" alt="Logo Boutique" width={100} height={100} />
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">Choisir une image</span>
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: (e.target.files?.[0] || '') as any })} hidden />
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                                    <StoreIcon size={14} className="text-blue-600" /> Nom de la boutique *
                                </label>
                                <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Ex: SenTech Official, Dakar Accessories" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-3 rounded-xl text-xs bg-slate-50/50 transition" required />
                                <p className="text-[11px] text-slate-400">Le nom officiel visible par vos clients.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                                    <InfoIcon size={14} className="text-blue-600" /> Identifiant unique URL (Username) *
                                </label>
                                <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Ex: sentech-dakar" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-3 rounded-xl text-xs bg-slate-50/50 transition" required />
                                <p className="text-[11px] text-slate-400">URL : sentechplus.sn/shop/votre-identifiant</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-800 text-xs">Description de la boutique & Produits *</label>
                            <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={4} placeholder="Présentez vos catégories de produits (écouteurs sans fil, chargeurs rapides GaN, montres connectées...) et vos garanties." className="border border-slate-200 focus:border-blue-500 outline-none w-full p-3 rounded-xl text-xs resize-none bg-slate-50/50 transition" required />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                                    <MailIcon size={14} className="text-blue-600" /> Adresse E-mail Professionnelle *
                                </label>
                                <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Ex: contact@boutique-dakar.sn" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-3 rounded-xl text-xs bg-slate-50/50 transition" required />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                                    <PhoneIcon size={14} className="text-blue-600" /> Téléphone & WhatsApp Sénégal *
                                </label>
                                <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Ex: +221 77 000 00 00" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-3 rounded-xl text-xs bg-slate-50/50 transition" required />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                                <MapPinIcon size={14} className="text-blue-600" /> Adresse Physique / Localisation à Dakar *
                            </label>
                            <input name="address" onChange={onChangeHandler} value={storeInfo.address} type="text" placeholder="Ex: Avenue Cheikh Anta Diop, Fann, Dakar" className="border border-slate-200 focus:border-blue-500 outline-none w-full p-3 rounded-xl text-xs bg-slate-50/50 transition" required />
                        </div>

                        <button className="w-full bg-blue-600 text-white font-bold text-xs py-4 rounded-xl mt-6 active:scale-98 hover:bg-blue-700 transition shadow-lg shadow-blue-600/25 cursor-pointer">
                            Soumettre la demande de validation
                        </button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                        <StoreIcon size={36} />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 max-w-xl">{message}</p>
                </div>
            )}
        </>
    ) : (<Loading />)
}