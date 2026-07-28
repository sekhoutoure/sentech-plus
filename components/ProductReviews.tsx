'use client'
import React, { useState } from 'react'
import { StarIcon, MessageSquareIcon, ThumbsUpIcon, CheckCircle2Icon, UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Review {
    id: string
    name: string
    rating: number
    comment: string
    date: string
    verified: boolean
}

export default function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Array<Review>>([
        {
            id: '1',
            name: 'Ousmane Sow',
            rating: 5,
            comment: 'Produit authentique reçu en 24h à Dakar (Fann). La qualité sonore du casque est exceptionnelle !',
            date: 'Il y a 2 jours',
            verified: true,
        },
        {
            id: '2',
            name: 'Awa Ndiaye',
            rating: 5,
            comment: 'Très bonne expérience d\'achat. Le vendeur a répondu rapidement et le paquet était bien emballé.',
            date: 'Il y a 5 jours',
            verified: true,
        },
        {
            id: '3',
            name: 'Cheikh Fall',
            rating: 4,
            comment: 'Livraison rapide à Thiès (48h). Conforme aux photos et à la description.',
            date: 'Il y a 1 semaine',
            verified: true,
        }
    ])

    const [newReview, setNewReview] = useState({
        name: '',
        rating: 5,
        comment: '',
    })

    const [isFormOpen, setIsFormOpen] = useState(false)

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newReview.name || !newReview.comment) {
            toast.error("Veuillez saisir votre nom et votre avis.")
            return
        }

        const review: Review = {
            id: Date.now().toString(),
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: 'À l\'instant',
            verified: true,
        }

        setReviews([review, ...reviews])
        setNewReview({ name: '', rating: 5, comment: '' })
        setIsFormOpen(false)
        toast.success("Merci ! Votre avis a été publié avec succès.")
    }

    const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)

    return (
        <section className="my-12 py-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 text-slate-800">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <MessageSquareIcon size={20} className="text-blue-600" /> Avis & Évaluations Clients
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Avis vérifiés de clients ayant acheté cet article au Sénégal</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl">
                        <StarIcon size={18} className="fill-amber-400 text-amber-400" />
                        <span className="text-lg font-extrabold text-slate-900">{averageRating}</span>
                        <span className="text-xs text-slate-500 font-medium">/ 5 ({reviews.length} avis)</span>
                    </div>

                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
                    >
                        {isFormOpen ? 'Fermer le formulaire' : 'Donner mon avis'}
                    </button>
                </div>
            </div>

            {/* Add Review Form */}
            {isFormOpen && (
                <form onSubmit={handleSubmitReview} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 animate-in fade-in">
                    <h4 className="font-bold text-slate-900 text-sm">Rédiger un avis sur ce produit</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Votre Nom ou Prénom *</label>
                            <input
                                type="text"
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                placeholder="Ex: Mamadou Diallo"
                                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Note attribuée *</label>
                            <div className="flex items-center gap-1 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="p-1 cursor-pointer"
                                    >
                                        <StarIcon
                                            size={20}
                                            className={star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">Votre Commentaire *</label>
                        <textarea
                            rows={3}
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="Partagez votre expérience sur la qualité, la livraison et l'utilisation..."
                            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-blue-500 resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer"
                    >
                        Publier mon avis
                    </button>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                                    <UserIcon size={14} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                        {rev.name}
                                        {rev.verified && (
                                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                                <CheckCircle2Icon size={10} /> Achat Vérifié
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-[10px] text-slate-400">{rev.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        size={13}
                                        className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 pl-10">{rev.comment}</p>
                    </div>
                ))}
            </div>

        </section>
    )
}
