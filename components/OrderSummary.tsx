import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import AddressModal from './AddressModal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

    const currency = useSelector((state: any) => state.siteSettings?.currencySymbol || '$');

    const router = useRouter();

    const addressList = useSelector((state: any) => state.address.list);

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

        // ✅ On envoie les IDs produits + quantités (le prix est recalculé côté serveur)
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

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Récapitulatif du paiement</h2>
            <p className='text-slate-400 text-xs my-4'>Moyen de paiement</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>Paiement à la livraison</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Paiement par carte (Stripe)</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Adresse de livraison</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[Number(e.target.value)])} >
                                        <option value="">Sélectionner une adresse</option>
                                        {
                                            addressList.map((address: any, index: number) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Ajouter une adresse <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Sous-total :</p>
                        <p>Livraison :</p>
                        {coupon && <p>Code promo :</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Gratuite</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={handleCouponCode} className='flex justify-center gap-3 mt-3'>
                            <input 
                                onChange={(e) => setCouponCodeInput(e.target.value)} 
                                value={couponCodeInput} 
                                type="text" 
                                placeholder='Code promo' 
                                className='border border-slate-300 p-2 rounded-xl w-full outline-none text-base sm:text-xs focus:border-blue-500 transition' 
                            />
                            <button type="submit" className='bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 cursor-pointer shrink-0'>
                                Appliquer
                            </button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-between text-xs mt-2 bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-700'>
                            <div>
                                <p className='font-bold'>{coupon.code.toUpperCase()} (-{coupon.discount}%)</p>
                                {coupon.description && <p className='text-[10px] opacity-80'>{coupon.description}</p>}
                            </div>
                            <XIcon size={16} onClick={() => setCoupon('')} className='hover:text-red-600 transition cursor-pointer shrink-0' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4 text-base font-bold text-slate-900'>
                <p>Total :</p>
                <p className='text-blue-600'>{currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={handlePlaceOrder} className='w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg cursor-pointer text-sm'>
                Passer la commande
            </button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary
