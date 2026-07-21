'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Shield, AlertCircle, X, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
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
  'BIENVENUE10': { discount: 0.10, label: '-10%' },
  'GAMING15':  { discount: 0.15, label: '-15% gaming' },
  'PROMO30':   { discount: 0.30, label: '-30%' },
};

const FREE_SHIPPING_THRESHOLD = 30000;

// Checkout Modal Component
function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  total,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; email: string; phone: string; address: string }) => void;
  total: number;
  isLoading: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [step, setStep] = useState(1);

  // Pre-fill from localStorage if logged in
  useEffect(() => {
    if (isOpen) {
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) return;
    onConfirm({ name, email, phone, address });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', animation: 'fade-in 0.2s ease-out',
    }}>
      <div style={{
        background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
        borderRadius: '20px', width: '100%', maxWidth: '500px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        animation: 'fade-in 0.25s ease-out',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px',
        }}>
          <div>
            <h2 style={{ color: 'var(--color-foreground)', fontWeight: 800, fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif' }}>
              🛒 Valider la commande
            </h2>
            <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '4px' }}>
              Total : <strong style={{ color: '#1b75bc' }}>{formatPrice(total)}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: '4px' }}
            aria-label="Fermer"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
              Nom complet <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="text" required
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Moussa Diallo"
                className="input-dark"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="moussa@example.com"
                className="input-dark"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
              Téléphone <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="tel" required
                value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+221 77 000 00 00"
                className="input-dark"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '7px' }}>
              Adresse de livraison <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={15} style={{ position: 'absolute', left: '13px', top: '16px', color: '#475569' }} />
              <textarea
                required
                value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Rue, Quartier, Ville (ex: Liberté 6, Dakar)"
                rows={2}
                className="input-dark"
                style={{ paddingLeft: '40px', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Payment note */}
          <div style={{
            background: 'rgba(27,117,188,0.06)', border: '1px solid rgba(27,117,188,0.2)',
            borderRadius: '10px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <CheckCircle size={16} color="#1b75bc" />
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>
              Paiement à la livraison ou via <strong>Orange Money / Wave</strong>. Notre équipe vous contactera sous 24h.
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: '0 0 auto', padding: '13px 20px',
                background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                borderRadius: '10px', color: 'var(--color-foreground)', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem',
              }}
            >
              Annuler
            </button>
            <button
              type="submit" disabled={isLoading}
              style={{
                flex: 1, padding: '13px',
                background: isLoading ? '#93c5fd' : 'linear-gradient(135deg, #1b75bc, #2563eb)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontWeight: 700, fontSize: '0.9rem', cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(27,117,188,0.35)',
              }}
            >
              {isLoading ? '⏳ Traitement...' : '✅ Confirmer ma commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PanierPage() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [clearConfirm, setClearConfirm] = useState(false);
  const [shippingCost, setShippingCost] = useState(2500);
  const [promoCodes, setPromoCodes] = useState(BASE_PROMO_CODES);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Sync shipping fee and promo codes from admin localStorage
  useEffect(() => {
    const sync = () => {
      try {
        const fee = localStorage.getItem('siteShippingFee');
        if (fee) {
          const parsed = parseInt(fee, 10);
          if (!isNaN(parsed)) setShippingCost(parsed);
        }
      } catch {}
      try {
        const saved = localStorage.getItem('adminPromosList');
        if (saved) {
          const parsed: Array<{ code: string; discount: string; status: string }> = JSON.parse(saved);
          const merged = { ...BASE_PROMO_CODES };
          parsed
            .filter(p => p.status === 'Actif')
            .forEach(p => {
              const pct = parseFloat(p.discount);
              if (!isNaN(pct) && pct > 0 && pct <= 100) {
                merged[p.code] = { discount: pct / 100, label: `-${pct}%` };
              }
            });
          setPromoCodes(merged);
        }
      } catch {}
    };
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const discount = appliedPromo ? Math.round(totalPrice * appliedPromo.discount) : 0;
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const finalTotal = totalPrice - discount + shipping;

  const handleCheckoutConfirm = async (data: { name: string; email: string; phone: string; address: string }) => {
    setIsCheckingOut(true);
    try {
      const orderData = {
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        customer_address: data.address,
        total_amount: finalTotal,
        items: items,
        status: 'en_attente',
      };
      const { error } = await createOrder(orderData);
      if (error) {
        showToast('Erreur lors de la commande. Réessayez.', 'error');
        console.error(error);
      } else {
        clearCart();
        setShowCheckoutModal(false);
        showToast('🎉 Commande passée avec succès ! Merci de votre confiance.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Une erreur est survenue.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const applyPromo = () => {
    const upper = promoCode.trim().toUpperCase();
    const found = promoCodes[upper];
    if (found) {
      setAppliedPromo({ code: upper, ...found });
      setPromoError('');
      showToast(`Code "${upper}" appliqué ! ${found.label}`, 'success');
    } else {
      setPromoError('Code promo invalide ou expiré');
      setAppliedPromo(null);
    }
  };

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    showToast(`${name} retiré du panier`, 'info');
  };

  const handleClear = () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      return;
    }
    clearCart();
    setClearConfirm(false);
    showToast('Panier vidé', 'info');
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
          <ShoppingBag size={72} style={{ color: 'var(--color-sentech-border)', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
            Votre panier est vide
          </h1>
          <p style={{ color: '#475569', marginBottom: '32px' }}>
            Découvrez nos produits et ajoutez-en au panier !
          </p>
          <Link href="/boutique" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
            color: 'white', padding: '14px 28px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(27,117,188,0.35)',
          }}>
            Découvrir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckoutConfirm}
        total={finalTotal}
        isLoading={isCheckingOut}
      />

      <div style={{ minHeight: '100vh', paddingTop: '100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '8px' }}>
                <ArrowLeft size={15} /> Continuer les achats
              </Link>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingBag size={28} color="#1b75bc" />
                Mon Panier
                <span style={{ background: 'rgba(27,117,188,0.12)', border: '1px solid rgba(27,117,188,0.25)', color: '#1b75bc', borderRadius: '20px', padding: '2px 12px', fontSize: '1rem' }}>
                  {items.length}
                </span>
              </h1>
            </div>
            <button
              onClick={handleClear}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: clearConfirm ? 'rgba(239,68,68,0.08)' : 'var(--color-sentech-dark)',
                border: `1px solid ${clearConfirm ? 'rgba(239,68,68,0.3)' : 'var(--color-sentech-border)'}`,
                borderRadius: '8px', padding: '8px 16px',
                color: clearConfirm ? '#ef4444' : '#475569',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              }}
            >
              <Trash2 size={14} />
              {clearConfirm ? 'Confirmer la suppression ?' : 'Vider le panier'}
            </button>
          </div>

          {/* Free shipping progress */}
          {toFreeShipping > 0 && (
            <div style={{
              background: 'rgba(27,117,188,0.06)', border: '1px solid rgba(27,117,188,0.15)',
              borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <Truck size={18} color="#1b75bc" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
                  Plus que <strong style={{ color: 'var(--color-foreground)' }}>{formatPrice(toFreeShipping)}</strong> pour la livraison gratuite !
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    background: 'linear-gradient(90deg, #1b75bc, #a1b1c2)',
                    width: `${Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Layout */}
          <div className="cart-layout">
            {/* Cart items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                  borderRadius: '16px', padding: '18px', transition: 'border-color 0.2s',
                }}>
                  <div className="cart-item-grid">
                    <Link href={`/produit/${item.id}`} style={{ textDecoration: 'none' }} className="cart-item-image">
                      <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: 'var(--color-sentech-dark)' }}>
                        <Image src={item.image} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover' }} />
                      </div>
                    </Link>
                    <div className="cart-item-info">
                      <div style={{ fontSize: '0.68rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>
                        {item.brand} · {item.category}
                      </div>
                      <Link href={`/produit/${item.id}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ color: 'var(--color-foreground)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                          {item.name}
                        </h3>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                          {formatPrice(item.price)}
                        </span>
                        {item.oldPrice > item.price && (
                          <span className="price-old" style={{ fontSize: '0.8rem' }}>{formatPrice(item.oldPrice)}</span>
                        )}
                        {item.discount > 0 && <span className="badge-discount">-{item.discount}%</span>}
                      </div>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        aria-label={`Supprimer ${item.name}`}
                        style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuer" style={{ padding: '6px 10px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', display: 'flex' }}>
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '6px 12px', color: 'var(--color-foreground)', fontWeight: 700, fontSize: '0.9rem', minWidth: '32px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Augmenter" style={{ padding: '6px 10px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', display: 'flex' }}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--color-foreground)', fontSize: '0.95rem' }}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', padding: '24px', height: 'fit-content', position: 'sticky', top: '100px' }}>
              <h2 style={{ color: 'var(--color-foreground)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px' }}>Récapitulatif</h2>

              {/* Promo */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                  Code promo
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(); } }}
                      placeholder="SENTECH20"
                      className="input-dark"
                      style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    style={{
                      background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
                      borderRadius: '10px', padding: '0 14px', color: '#1b75bc',
                      cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap',
                    }}
                  >
                    Appliquer
                  </button>
                </div>
                {promoError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={12} /> {promoError}
                  </p>
                )}
                {appliedPromo && (
                  <p style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '6px' }}>
                    ✓ Code &ldquo;{appliedPromo.code}&rdquo; appliqué ({appliedPromo.label})
                  </p>
                )}
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.9rem' }}>
                  <span>Sous-total</span><span>{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '0.9rem' }}>
                    <span>Réduction promo</span><span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.9rem' }}>
                  <span>Livraison</span>
                  <span style={{ color: shipping === 0 ? '#10b981' : 'inherit' }}>
                    {shipping === 0 ? '🎉 Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p style={{ fontSize: '0.75rem', color: '#475569' }}>
                    Gratuite dès {formatPrice(FREE_SHIPPING_THRESHOLD)} d&apos;achat
                  </p>
                )}
                <div style={{ height: '1px', background: 'var(--color-sentech-border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-foreground)', fontWeight: 800, fontSize: '1.15rem' }}>
                  <span>Total</span><span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={() => setShowCheckoutModal(true)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}
              >
                🔐 Valider la commande
              </button>

              {/* Payment methods */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.72rem', color: '#475569', marginBottom: '10px' }}>Paiements acceptés</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {['💳 Carte', '📱 Orange Money', '📲 Wave', '💵 Cash livraison'].map(p => (
                    <span key={p} style={{
                      padding: '3px 8px', borderRadius: '4px',
                      background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                      fontSize: '0.68rem', color: '#475569',
                    }}>{p}</span>
                  ))}
                </div>
              </div>

              {/* Guarantees */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: <Shield size={13} />, text: 'Paiement 100% sécurisé' },
                  { icon: <Truck size={13} />, text: 'Livraison suivie & assurée' },
                ].map(g => (
                  <div key={g.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.8rem' }}>
                    <span style={{ color: '#10b981' }}>{g.icon}</span>
                    {g.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
