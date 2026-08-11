'use client'
import { Plus, Edit2, X, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import AddressModal from './AddressModal';
import { useAddressStore } from '@/lib/stores';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/format';

interface OrderItem {
    id: string;
    quantity: number;
    [key: string]: any;
}

interface OrderSummaryProps {
    totalPrice: number;
    items: OrderItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice, items }) => {
    const router = useRouter();
    const addressList = useAddressStore(s => s.list) || [];

    const [paymentMethod, setPaymentMethod] = useState<string>('COD');
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
    const [couponCodeInput, setCouponCodeInput] = useState<string>('');
    const [coupon, setCoupon] = useState<any>('');

    const handleCouponCode = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!couponCodeInput.trim()) {
            toast.error("Veuillez saisir un code promo.");
            return;
        }

        try {
            const res = await fetch('/api/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCodeInput })
            })
            const data = await res.json()
            if (data.success && data.coupon) {
                setCoupon(data.coupon)
                toast.success(`Code promo ${data.coupon.code} appliqué (-${data.coupon.discount}%) !`)
                setCouponCodeInput('')
            } else {
                toast.error(data.message || "Code promo invalide.")
            }
        } catch (err) {
            toast.error("Erreur lors de la validation du code promo.")
        }
    }

    const handlePlaceOrder = async (e: React.MouseEvent) => {
        e.preventDefault();

        const addressToUse = selectedAddress || addressList[0];
        if (!addressToUse) {
            toast.error("Veuillez sélectionner ou ajouter une adresse de livraison.");
            setShowAddressModal(true);
            return;
        }

        if (!items || items.length === 0) {
            toast.error("Votre panier est vide.");
            return;
        }

        const orderItems = items.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }))

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address: addressToUse,
                    paymentMethod,
                    isCouponUsed: !!coupon,
                    coupon: coupon ? { code: coupon.code } : null,
                    orderItems
                })
            })
            const data = await res.json()
            if (!data.success) {
                toast.error(data.message || "Erreur lors de la commande.")
                return
            }
        } catch (err) {
            console.error(err)
            toast.error("Erreur réseau. Veuillez réessayer.")
            return
        }

        toast.success("🎉 Commande passée avec succès ! Merci pour votre confiance.");
        router.push('/orders');
    }

    const discountAmount = coupon ? (coupon.discount / 100) * totalPrice : 0;
    const finalTotal = totalPrice - discountAmount;

    return (
        <div className='w-full bg-white border border-[#E4E7EC] text-[#101828] text-xs sm:text-sm rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5'>
            <h2 className='text-lg font-extrabold text-[#101828] pb-3 border-b border-[#E4E7EC]'>
                Récapitulatif de commande
            </h2>

            {/* Mode de Paiement */}
            <div className="space-y-2.5">
                <p className='text-[11px] font-bold uppercase tracking-wider text-[#667085]'>Moyen de paiement</p>
                <div className='flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F9FC] border border-[#E4E7EC] cursor-pointer' onClick={() => setPaymentMethod('COD')}>
                    <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-[#1769FF] size-4 cursor-pointer' />
                    <label htmlFor="COD" className='cursor-pointer font-bold text-xs text-[#101828]'>Paiement à la livraison (Dakar)</label>
                </div>
                <div className='flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F9FC] border border-[#E4E7EC] cursor-pointer' onClick={() => setPaymentMethod('STRIPE')}>
                    <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-[#1769FF] size-4 cursor-pointer' />
                    <label htmlFor="STRIPE" className='cursor-pointer font-bold text-xs text-[#101828]'>Carte Bancaire / Wave / OM (En ligne)</label>
                </div>
            </div>

            {/* Adresse de Livraison */}
            <div className='py-4 border-y border-[#E4E7EC] space-y-2'>
                <p className='text-[11px] font-bold uppercase tracking-wider text-[#667085]'>Adresse de livraison</p>
                {selectedAddress ? (
                    <div className='flex justify-between items-center bg-[#F7F9FC] p-3 rounded-xl border border-[#E4E7EC]'>
                        <p className="font-semibold text-xs text-[#101828]">{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}</p>
                        <button onClick={() => setSelectedAddress(null)} className='text-[#1769FF] p-1 cursor-pointer' title="Modifier l'adresse">
                            <Edit2 size={16} />
                        </button>
                    </div>
                ) : (
                    <div>
                        {addressList.length > 0 && (
                            <select 
                                className='border border-[#E4E7EC] bg-[#F7F9FC] p-2.5 w-full my-2 outline-none rounded-xl text-xs font-semibold text-[#101828] focus:border-[#1769FF]' 
                                onChange={(e) => setSelectedAddress(addressList[Number(e.target.value)])} 
                            >
                                <option value="">Sélectionner une adresse enregistrée</option>
                                {addressList.map((address: any, index: number) => (
                                    <option key={index} value={index}>{address.name}, {address.city}, {address.state}</option>
                                ))}
                            </select>
                        )}
                        <button 
                            className='flex items-center gap-1.5 text-xs font-bold text-[#1769FF] hover:underline mt-1 cursor-pointer' 
                            onClick={() => setShowAddressModal(true)} 
                        >
                            <Plus size={15} /> Ajouter une nouvelle adresse
                        </button>
                    </div>
                )}
            </div>

            {/* Subtotal, Shipping, Coupon */}
            <div className='space-y-2 pb-4 border-b border-[#E4E7EC]'>
                <div className='flex justify-between text-xs sm:text-sm text-[#667085]'>
                    <span>Sous-total</span>
                    <span className="font-bold text-[#101828]">{formatPrice(totalPrice)}</span>
                </div>
                <div className='flex justify-between text-xs sm:text-sm text-[#667085]'>
                    <span>Livraison à Dakar</span>
                    <span className="text-[#12B76A] font-bold">Gratuite</span>
                </div>
                {coupon && (
                    <div className='flex justify-between text-xs sm:text-sm text-[#12B76A]'>
                        <span>Remise promo ({coupon.code})</span>
                        <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                )}

                {/* Coupon Input Form */}
                {!coupon ? (
                    <form onSubmit={handleCouponCode} className='flex gap-2 pt-2'>
                        <input 
                            onChange={(e) => setCouponCodeInput(e.target.value)} 
                            value={couponCodeInput} 
                            type="text" 
                            placeholder='Code promo (ex: NEW20)' 
                            className='border border-[#E4E7EC] bg-[#F7F9FC] p-2 rounded-xl w-full outline-none text-xs font-semibold focus:border-[#1769FF]' 
                        />
                        <button type="submit" className='bg-[#071126] hover:bg-[#1769FF] text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer shrink-0'>
                            Appliquer
                        </button>
                    </form>
                ) : (
                    <div className='w-full flex items-center justify-between text-xs bg-[#EAF3FF] p-2.5 rounded-xl border border-[#1769FF]/20 text-[#1769FF]'>
                        <div>
                            <p className='font-bold'>{coupon.code.toUpperCase()} (-{coupon.discount}%)</p>
                            {coupon.description && <p className='text-[10px] text-slate-500'>{coupon.description}</p>}
                        </div>
                        <X size={16} onClick={() => setCoupon('')} className='hover:text-red-600 transition cursor-pointer shrink-0' />
                    </div>
                )}
            </div>

            {/* Total Final */}
            <div className='flex justify-between items-baseline pt-1'>
                <span className="text-base font-bold text-[#101828]">Total à payer :</span>
                <span className='text-xl font-black text-[#1769FF]'>{formatPrice(finalTotal)}</span>
            </div>

            {/* CTA Passer la commande */}
            <button 
                onClick={handlePlaceOrder} 
                className='w-full bg-[#1769FF] hover:bg-[#1256D6] text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#1769FF]/25 cursor-pointer text-xs sm:text-sm active:scale-95'
            >
                Confirmer la commande
            </button>

            {/* Trust Shield Note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#667085] pt-1">
                <ShieldCheck size={14} className="text-[#12B76A]" />
                <span>Paiement 100% sécurisé & garanti</span>
            </div>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
        </div>
    )
}

export default OrderSummary
