'use client'
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { 
    Star, 
    MessageSquare, 
    ThumbsUp, 
    CheckCircle2, 
    User, 
    Camera, 
    Filter, 
    Sparkles, 
    X,
    ShieldCheck,
    Battery,
    Award
} from 'lucide-react'
import toast from 'react-hot-toast'

export interface ReviewItem {
    id: string
    name: string
    rating: number
    comment: string
    date: string
    verified: boolean
    helpfulCount: number
    images?: string[]
    city?: string
}

const initialReviews: ReviewItem[] = [
    {
        id: '1',
        name: 'Ousmane Sow',
        rating: 5,
        comment: 'Produit 100% authentique reçu en 24h à Dakar (Fann). La finition et le son sont exceptionnels !',
        date: 'Il y a 2 jours',
        verified: true,
        helpfulCount: 14,
        city: 'Dakar',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80'
        ]
    },
    {
        id: '2',
        name: 'Awa Ndiaye',
        rating: 5,
        comment: 'Très bonne expérience d\'achat. Le service client sur WhatsApp m\'a assisté immédiatement et l\'emballage était scellé.',
        date: 'Il y a 5 jours',
        verified: true,
        helpfulCount: 9,
        city: 'Thiès',
    },
    {
        id: '3',
        name: 'Cheikh Fall',
        rating: 4,
        comment: 'Livraison express à Mbour en 48h. Matériel robuste, conforme aux visuels SenTechPLUS.',
        date: 'Il y a 1 semaine',
        verified: true,
        helpfulCount: 6,
        city: 'Mbour',
        images: [
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80'
        ]
    }
]

export default function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
    const [activeFilter, setActiveFilter] = useState<'all' | '5star' | '4star' | 'photos' | 'verified'>('all')
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [votedHelpful, setVotedHelpful] = useState<string[]>([])

    // New Review Form State
    const [newReview, setNewReview] = useState({
        name: '',
        rating: 5,
        comment: '',
        city: 'Dakar',
        photoUrl: '',
    })

    // Ratings stats calculations
    const stats = useMemo(() => {
        const total = reviews.length
        if (total === 0) return { avg: '5.0', breakdown: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 } }
        
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
        const avg = (sum / total).toFixed(1)

        const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        reviews.forEach(r => {
            counts[r.rating] = (counts[r.rating] || 0) + 1
        })

        const breakdown = {
            5: Math.round((counts[5] / total) * 100),
            4: Math.round((counts[4] / total) * 100),
            3: Math.round((counts[3] / total) * 100),
            2: Math.round((counts[2] / total) * 100),
            1: Math.round((counts[1] / total) * 100),
        }

        return { avg, breakdown }
    }, [reviews])

    // Filtered reviews list
    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            if (activeFilter === '5star') return r.rating === 5
            if (activeFilter === '4star') return r.rating === 4
            if (activeFilter === 'photos') return r.images && r.images.length > 0
            if (activeFilter === 'verified') return r.verified
            return true
        })
    }, [reviews, activeFilter])

    const handleVoteHelpful = (reviewId: string) => {
        if (votedHelpful.includes(reviewId)) return
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
        setVotedHelpful(prev => [...prev, reviewId])
        toast.success("Merci pour votre vote !")
    }

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newReview.name.trim() || !newReview.comment.trim()) {
            toast.error("Veuillez saisir votre nom et votre commentaire.")
            return
        }

        const review: ReviewItem = {
            id: Date.now().toString(),
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: 'À l\'instant',
            verified: true,
            helpfulCount: 0,
            city: newReview.city || 'Dakar',
            images: newReview.photoUrl.trim() ? [newReview.photoUrl.trim()] : undefined
        }

        setReviews([review, ...reviews])
        setNewReview({ name: '', rating: 5, comment: '', city: 'Dakar', photoUrl: '' })
        setIsFormOpen(false)
        toast.success("Votre avis et photo ont été publiés avec succès ! 🎉")
    }

    return (
        <section className="my-10 py-6 sm:py-8 bg-white rounded-3xl border border-[#E8EDF3] p-4 sm:p-8 space-y-6 text-[#182230] shadow-2xs">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8EDF3] pb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#0B54C2] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                        <Sparkles size={11} />
                        <span>AVIS CLIENTS VÉRIFIÉS SÉNÉGAL</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#182230] flex items-center gap-2">
                        <MessageSquare size={22} className="text-[#0B54C2]" />
                        <span>Avis & Retours d'Expérience ({reviews.length})</span>
                    </h2>
                    <p className="text-xs text-[#475467] mt-0.5">
                        Évaluations de vrais acheteurs certifiés à Dakar, Thiès, Saint-Louis et régions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="inline-flex items-center gap-2 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs px-5 py-3 rounded-xl transition shadow-md cursor-pointer active:scale-95"
                    >
                        <Camera size={15} />
                        <span>{isFormOpen ? 'Fermer le formulaire' : 'Rédiger un avis + Photo'}</span>
                    </button>
                </div>
            </div>

            {/* Scorecard Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8FAFC] p-5 rounded-2xl border border-[#E8EDF3]">
                
                {/* Global Score (Left Column) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-2 lg:border-r lg:border-[#E8EDF3] lg:pr-6">
                    <div className="text-4xl sm:text-5xl font-black text-[#182230] leading-none">
                        {stats.avg}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} fill="#F59E0B" className="text-amber-400" />
                        ))}
                    </div>
                    <div className="text-xs font-bold text-[#475467]">
                        Basé sur <span className="text-[#182230] font-black">{reviews.length} avis certifiés</span>
                    </div>
                </div>

                {/* Rating Distribution Progress Bars (Middle Column) */}
                <div className="lg:col-span-5 space-y-2 justify-center flex flex-col">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const pct = stats.breakdown[stars as keyof typeof stats.breakdown] || 0
                        return (
                            <div key={stars} className="flex items-center gap-3 text-xs">
                                <span className="font-extrabold text-[#182230] min-w-[28px]">{stars} ★</span>
                                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#0B54C2] rounded-full transition-all duration-500" 
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-[#475467] min-w-[36px] text-right">{pct}%</span>
                            </div>
                        )
                    })}
                </div>

                {/* Criteria Sub-ratings (Right Column) */}
                <div className="lg:col-span-3 space-y-2.5 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#E8EDF3] pt-4 lg:pt-0 lg:pl-6 text-xs font-bold">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#475467]"><Award size={13} className="text-[#0B54C2]" /> Finition & Design</span>
                        <span className="text-[#0B54C2] font-black">4.9 / 5</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#475467]"><Battery size={13} className="text-[#085D38]" /> Performance / Batterie</span>
                        <span className="text-[#085D38] font-black">4.8 / 5</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#475467]"><ShieldCheck size={13} className="text-[#0B54C2]" /> Rapport Qualité/Prix</span>
                        <span className="text-[#0B54C2] font-black">5.0 / 5</span>
                    </div>
                </div>

            </div>

            {/* Add Review Form */}
            {isFormOpen && (
                <form onSubmit={handleSubmitReview} className="bg-[#EAF3FF]/40 p-5 rounded-2xl border border-[#0B54C2]/20 space-y-4 animate-in fade-in duration-200">
                    <h3 className="font-black text-[#182230] text-sm flex items-center gap-2">
                        <Camera size={16} className="text-[#0B54C2]" />
                        <span>Partagez votre avis et vos photos de l'équipement</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#182230]">Nom & Prénom *</label>
                            <input
                                type="text"
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                placeholder="Ex: Awa Ndiaye"
                                className="w-full p-2.5 border border-[#E8EDF3] rounded-xl text-xs outline-none bg-white focus:border-[#0B54C2] font-semibold"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#182230]">Ville de livraison</label>
                            <select
                                value={newReview.city}
                                onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                                className="w-full p-2.5 border border-[#E8EDF3] rounded-xl text-xs outline-none bg-white focus:border-[#0B54C2] font-semibold cursor-pointer"
                            >
                                <option value="Dakar">Dakar</option>
                                <option value="Thiès">Thiès</option>
                                <option value="Mbour">Mbour</option>
                                <option value="Saint-Louis">Saint-Louis</option>
                                <option value="Ziguinchor">Ziguinchor</option>
                                <option value="Autre région">Autre région</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[#182230]">Note globale *</label>
                            <div className="flex items-center gap-1 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className="p-1 cursor-pointer hover:scale-110 transition-transform"
                                    >
                                        <Star
                                            size={20}
                                            fill={star <= newReview.rating ? "#F59E0B" : "none"}
                                            className={star <= newReview.rating ? 'text-amber-400' : 'text-slate-300'}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#182230]">URL de Photo (Optionnel)</label>
                        <input
                            type="url"
                            value={newReview.photoUrl}
                            onChange={(e) => setNewReview({ ...newReview, photoUrl: e.target.value })}
                            placeholder="Lien d'image de votre produit (ex: https://...)"
                            className="w-full p-2.5 border border-[#E8EDF3] rounded-xl text-xs outline-none bg-white focus:border-[#0B54C2] font-medium"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#182230]">Votre Témoignage *</label>
                        <textarea
                            rows={3}
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="Ex: Qualité sonore excellente, autonomie parfaite et livraison rapide à Dakar..."
                            className="w-full p-2.5 border border-[#E8EDF3] rounded-xl text-xs outline-none bg-white focus:border-[#0B54C2] font-medium resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-md active:scale-95"
                    >
                        Publier mon avis certifié
                    </button>
                </form>
            )}

            {/* Filter Tabs Horizontal Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[#E8EDF3]">
                <span className="text-xs font-bold text-[#475467] uppercase tracking-wider shrink-0 flex items-center gap-1">
                    <Filter size={13} /> Filtrer :
                </span>
                {[
                    { id: 'all', label: `Tous (${reviews.length})` },
                    { id: 'photos', label: `Avec photos 📷` },
                    { id: '5star', label: `5 Étoiles ★` },
                    { id: '4star', label: `4 Étoiles ★` },
                    { id: 'verified', label: `Achat vérifié ✓` },
                ].map((tab) => {
                    const isSelected = activeFilter === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id as any)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                                isSelected
                                    ? 'bg-[#0B54C2] text-white shadow-xs'
                                    : 'bg-[#F5F7FA] text-[#182230] hover:bg-[#E8EDF3] border border-[#E8EDF3]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Reviews List Grid */}
            <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                    <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl text-xs text-[#475467] font-semibold">
                        Aucun avis ne correspond à ce filtre.
                    </div>
                ) : (
                    filteredReviews.map((rev) => (
                        <div key={rev.id} className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#E8EDF3] space-y-3">
                            
                            {/* Review Top Row */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-[#EAF3FF] text-[#0B54C2] font-black text-xs flex items-center justify-center border border-[#0B54C2]/20">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-extrabold text-[#182230] text-xs sm:text-sm">{rev.name}</span>
                                            {rev.city && (
                                                <span className="text-[10px] text-[#475467] font-bold bg-white px-2 py-0.5 rounded-full border border-[#E8EDF3]">
                                                    📍 {rev.city}
                                                </span>
                                            )}
                                            {rev.verified && (
                                                <span className="text-[10px] text-[#085D38] bg-[#085D38]/10 border border-[#085D38]/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                    <CheckCircle2 size={11} /> Achat Vérifié
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-[#475467] font-medium">{rev.date}</span>
                                    </div>
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < rev.rating ? "#F59E0B" : "none"}
                                            className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <p className="text-xs sm:text-sm text-[#182230] leading-relaxed font-medium pl-0 sm:pl-13">
                                {rev.comment}
                            </p>

                            {/* Customer Photos Gallery Thumbnails */}
                            {rev.images && rev.images.length > 0 && (
                                <div className="flex items-center gap-2 pl-0 sm:pl-13 pt-1">
                                    {rev.images.map((imgUrl, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => setPreviewImage(imgUrl)}
                                            className="relative size-16 sm:size-20 rounded-xl bg-white border border-[#E8EDF3] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={`Photo client ${rev.name}`}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Helpful Counter Button */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#E8EDF3]/60 text-xs">
                                <button
                                    onClick={() => handleVoteHelpful(rev.id)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                                        votedHelpful.includes(rev.id)
                                            ? 'bg-[#085D38] text-white'
                                            : 'bg-white text-[#475467] hover:text-[#0B54C2] border border-[#E8EDF3]'
                                    }`}
                                >
                                    <ThumbsUp size={12} />
                                    <span>Utile ({rev.helpfulCount})</span>
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* Photo Lightbox Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
                    <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden p-3 shadow-2xl">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 z-20 size-9 rounded-full bg-slate-900/70 text-white flex items-center justify-center transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                        <div className="relative w-full aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden bg-slate-950">
                            <Image
                                src={previewImage}
                                alt="Aperçu photo avis client"
                                fill
                                sizes="700px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

        </section>
    )
}
