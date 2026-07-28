'use client'

import { Star, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addRating } from '@/lib/features/rating/ratingSlice';

interface RatingModalData {
    orderId: string;
    productId: string;
}

interface RatingModalProps {
    ratingModal: RatingModalData;
    setRatingModal: (value: RatingModalData | null) => void;
}

const RatingModal = ({ ratingModal, setRatingModal }: RatingModalProps) => {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const handleClose = () => {
        setRating(0);
        setReview('');
        setRatingModal(null);
    }

    const handleSubmit = async () => {
        if (rating <= 0 || rating > 5) {
            toast.error('Veuillez sélectionner une note en étoiles.');
            return;
        }
        if (review.trim().length < 3) {
            toast.error('Veuillez écrire un court avis.');
            return;
        }

        dispatch(addRating({
            orderId: ratingModal.orderId,
            productId: ratingModal.productId,
            rating,
            review: review.trim(),
            createdAt: new Date().toISOString()
        } as any))

        toast.success('Merci pour votre avis !');
        handleClose();
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4'>
            <div className='bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md relative border border-slate-100'>
                <button onClick={handleClose} className='absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-bold text-slate-900 mb-2 text-center'>Évaluer le produit</h2>
                <p className='text-xs text-slate-500 text-center mb-6'>Partagez votre expérience avec la communauté</p>
                <div className='flex items-center justify-center gap-1 mb-6'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer transition ${rating > i ? "text-blue-600 fill-current scale-110" : "text-slate-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-3 border border-slate-200 rounded-xl mb-6 text-xs focus:outline-none focus:border-blue-500 resize-none'
                    placeholder='Rédigez votre avis sur le produit...'
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button onClick={handleSubmit} className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer'>
                    Soumettre mon avis
                </button>
            </div>
        </div>
    )
}

export default RatingModal
