'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Shield,
  AlertCircle, X, User, Phone, MapPin, CheckCircle, CreditCard, Banknote,
  Smartphone, Lock, ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/products';
import { createOrder } from '@/lib/supabase';

// Promo codes
const BASE_PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'SENTECH10': { discount: 0.10, label: '-10%' },
  'BIENVENUE': { discount: 0.15, label: '-15% bienvenue' },
  'TECH20':    { discount: 0.20, label: '-20% fidélité' },
  'SENTECH20': { discount: 0.20, label: '-20% promo' },
};

const FREE_SHIPPING_THRESHOLD = 30000;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Form State (Informations Client)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dakar');
  const [notes, setNotes] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wave' | 'om' | 'card'>('cash');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [shippingCost, setShippingCost] = useState(2500);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem('userName');
    const storedPhone = localStorage.getItem('userPhone');
    if (storedName) setName(storedName);
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const discount = appliedPromo ? Math.round(totalPrice * appliedPromo.discount) : 0;
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
  const finalTotal = Math.max(0, totalPrice - discount + shipping);

  const applyPromo = () => {
    const upper = promoCode.trim().toUpperCase();
    const found = BASE_PROMO_CODES[upper];
    if (found) {
      setAppliedPromo({ code: upper, ...found });
      setPromoError('');
      showToast(`Code "${upper}" appliqué ! ${found.label}`, 'success');
    } else {
      setPromoError('Code promo invalide ou expiré');
      setAppliedPromo(null);
    }
  };

  const handleValidateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Veuillez entrer votre nom complet.', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('Veuillez entrer votre numéro de téléphone.', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Veuillez préciser votre adresse de livraison.', 'error');
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_address: `${address}, ${city}${notes ? ` (Note: ${notes})` : ''}`,
        payment_method: paymentMethod,
        total_amount: finalTotal,
        items: items,
        status: 'en_attente',
      };

      const { error } = await createOrder(orderData);
      if (error) {
        console.error(error);
        showToast('Erreur lors de l\'enregistrement de la commande. Réessayez.', 'error');
      } else {
        clearCart();
        setOrderComplete(true);
        showToast('🎉 Commande validée avec succès ! Merci pour votre confiance.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Une erreur est survenue lors de la commande.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  // Confirmation screen when order complete
  if (orderComplete) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px auto', boxShadow: '0 10px 25px rgba(16,185,129,0.3)',
          }}>
            <CheckCircle size={44} color="#ffffff" />
          </div>

          <h1 className="hero-title" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
            Commande <span className="sentech-gradient-text">Confirmée !</span>
          </h1>

          <p className="text-body" style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '32px', lineHeight: 1.6 }}>
            Merci <strong>{name}</strong> ! Votre commande de <strong>{formatPrice(finalTotal)}</strong> a été enregistrée avec succès. Notre équipe vous contactera par téléphone ou WhatsApp sous 24h.
          </p>

          <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Détails de Livraison</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#475569' }}>
              <div><strong>Client :</strong> {name}</div>
              <div><strong>Téléphone :</strong> {phone}</div>
              <div><strong>Adresse :</strong> {address}, {city}</div>
              <div><strong>Mode de Règlement :</strong> {paymentMethod === 'cash' ? '💵 Paiement à la livraison (Cash)' : paymentMethod === 'wave' ? '📲 Wave' : paymentMethod === 'om' ? '📱 Orange Money' : '💳 Carte bancaire'}</div>
            </div>
          </div>

          <Link href="/boutique" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
            Continuer mes achats <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', background: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <ShoppingBag size={72} style={{ color: 'var(--color-sentech-border)', margin: '0 auto 24px' }} />
            <h1 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
              Votre panier est vide
            </h1>
            <p className="text-body" style={{ color: '#475569', marginBottom: '32px' }}>
              Découvrez nos produits High-Tech certifiés et ajoutez-en à votre panier !
            </p>
            <Link href="/boutique" className="btn-primary" style={{ padding: '16px 32px' }}>
              Découvrir la boutique <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', background: 'var(--color-background)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px 100px' }}>

        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
              <ArrowLeft size={16} /> Continuer les achats
            </Link>
            <h1 className="hero-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Checkout <span className="sentech-gradient-text">& Paiement</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '8px 16px', borderRadius: '100px', color: '#10b981', fontSize: '0.85rem', fontWeight: 700 }}>
            <Lock size={16} /> Transaction 100% Sécurisée
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            2-COLUMN DESKTOP LAYOUT (Informations + Paiement | Résumé + Total)
        ═══════════════════════════════════════════════ */}
        <form onSubmit={handleValidateOrder} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}>
          
          {/* ═══════════════════════════════════════════════
              LEFT COLUMN: INFORMATIONS & PAIEMENT
          ═══════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* 1. INFORMATIONS CLIENT & LIVRAISON */}
            <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-inter, Inter), sans-serif' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1b75bc', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>1</span>
                Informations de Livraison
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Nom complet */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Nom & Prénom <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text" required
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Moussa Diallo"
                      className="sentech-input"
                      style={{ paddingLeft: '44px' }}
                    />
                  </div>
                </div>

                {/* Téléphone (WhatsApp / Appel) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Numéro de Téléphone (Appel / WhatsApp) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="tel" required
                      value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="sentech-input"
                      style={{ paddingLeft: '44px' }}
                    />
                  </div>
                </div>

                {/* Adresse & Ville */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                      Adresse de livraison <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text" required
                        value={address} onChange={e => setAddress(e.target.value)}
                        placeholder="Quartier, Rue, N° villa..."
                        className="sentech-input"
                        style={{ paddingLeft: '44px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                      Ville <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={city} onChange={e => setCity(e.target.value)}
                      className="sentech-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Dakar">Dakar</option>
                      <option value="Thiès">Thiès</option>
                      <option value="Saint-Louis">Saint-Louis</option>
                      <option value="Mbour">Mbour</option>
                      <option value="Ziguinchor">Ziguinchor</option>
                      <option value="Autre région">Autre région</option>
                    </select>
                  </div>
                </div>

                {/* Instruction de livraison */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    Instruction de livraison (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="ex: Déposer auprès du gardien ou appeler à l'arrivée"
                    className="sentech-input"
                  />
                </div>

              </div>
            </div>

            {/* 2. MODE DE PAIEMENT */}
            <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-inter, Inter), sans-serif' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1b75bc', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>2</span>
                Mode de Paiement
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'cash', title: 'Paiement à la livraison', icon: <Banknote size={20} color="#10b981" />, badge: 'Espèces' },
                  { id: 'wave', title: 'Wave', icon: <Smartphone size={20} color="#00b4d8" />, badge: 'Mobile Money' },
                  { id: 'om', title: 'Orange Money', icon: <Smartphone size={20} color="#ff6b00" />, badge: 'Mobile Money' },
                  { id: 'card', title: 'Carte Bancaire', icon: <CreditCard size={20} color="#1b75bc" />, badge: 'Visa / Mastercard' },
                ].map(method => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    style={{
                      border: paymentMethod === method.id ? '2px solid #1b75bc' : '1px solid var(--color-sentech-border)',
                      borderRadius: '16px',
                      padding: '16px 14px',
                      background: paymentMethod === method.id ? 'rgba(27,117,188,0.05)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {method.icon}
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{method.badge}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {method.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════
              RIGHT COLUMN: RÉSUMÉ, TOTAL & VALIDATION
          ═══════════════════════════════════════════════ */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(15,23,42,0.05)' }}>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', fontFamily: 'var(--font-inter, Inter), sans-serif' }}>
                Résumé de la commande ({items.length})
              </h2>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--color-sentech-border)' }}>
                    <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: '#ffffff', border: '1px solid var(--color-sentech-border)', flexShrink: 0, padding: '4px' }}>
                      <Image src={item.image} alt={item.name} fill sizes="60px" style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Qté : {item.quantity} × {formatPrice(item.price)}</div>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Code Promo Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Code Promo
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      placeholder="Ex: SENTECH20"
                      className="sentech-input"
                      style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="btn-secondary"
                    style={{ padding: '0 16px', fontSize: '0.85rem' }}
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px' }}>{promoError}</p>}
                {appliedPromo && <p style={{ color: '#10b981', fontSize: '0.78rem', marginTop: '6px', fontWeight: 700 }}>✓ Code {appliedPromo.code} appliqué ({appliedPromo.label})</p>}
              </div>

              {/* Detail Prix & Subtotals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '0.92rem', color: '#475569' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sous-total</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatPrice(totalPrice)}</span>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 700 }}>
                    <span>Réduction promo</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Livraison ({city})</span>
                  <span style={{ fontWeight: 700, color: shipping === 0 ? '#10b981' : '#0f172a' }}>
                    {shipping === 0 ? '🎉 Gratuite' : formatPrice(shipping)}
                  </span>
                </div>

                <div style={{ height: '1px', background: 'var(--color-sentech-border)', margin: '8px 0' }} />

                {/* TOTAL FINAL (Bold Inter 24px) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', color: '#0f172a' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>TOTAL</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1b75bc', fontFamily: 'var(--font-inter, Inter), sans-serif' }}>
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Bouton VALIDER LA COMMANDE */}
              <button
                type="submit"
                disabled={isCheckingOut}
                className="btn-primary"
                style={{
                  width: '100%',
                  height: '54px',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(27,117,188,0.4)',
                }}
              >
                {isCheckingOut ? '⏳ Validation...' : `🔐 Valider ma commande (${formatPrice(finalTotal)})`}
              </button>

              {/* Badges de réassurance */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', fontSize: '0.78rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Truck size={14} color="#10b981" /> Livraison 24h</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Shield size={14} color="#10b981" /> Garantie 1 an</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
