'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Shield, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/products';
import { createOrder } from '@/lib/supabase';

// Promo codes — in production these should be validated server-side
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

  const handleCheckout = async () => {
    const customerName = window.prompt('Votre nom complet :');
    if (!customerName) return;
    const customerEmail = window.prompt('Votre email :');
    if (!customerEmail) return;

    setIsCheckingOut(true);
    try {
      const orderData = {
        customer_name: customerName,
        customer_email: customerEmail,
        total_amount: finalTotal,
        items: items,
        status: 'en_attente'
      };
      
      const { error } = await createOrder(orderData);
      
      if (error) {
        showToast('Erreur lors de la commande', 'error');
        console.error(error);
      } else {
        clearCart();
        showToast('Commande passée avec succès ! Merci de votre confiance.', 'success');
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

  const discount = appliedPromo ? Math.round(totalPrice * appliedPromo.discount) : 0;
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : shippingCost;
  const finalTotal = totalPrice - discount + shipping;
  const toFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '60px 24px', paddingTop: '130px' }}>
        <div style={{
          width: '90px', height: '90px', margin: '0 auto 20px',
          background: 'rgba(27,117,188,0.08)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(27,117,188,0.15)',
        }}>
          <ShoppingBag size={40} color="#1b75bc" />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Votre panier est vide
        </h1>
        <p style={{ color: '#475569', marginBottom: '32px', maxWidth: '360px' }}>
          Découvrez nos produits high-tech et ajoutez vos favoris au panier !
        </p>
        <Link href="/boutique" className="btn-primary" style={{ padding: '14px 32px' }}>
          <ShoppingBag size={18} /> Aller à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '8px' }}>
              <ArrowLeft size={16} /> Continuer les achats
            </Link>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
              Mon panier{' '}
              <span style={{ color: '#475569', fontSize: '1.1rem', fontWeight: 400 }}>
                ({items.length} article{items.length > 1 ? 's' : ''})
              </span>
            </h1>
          </div>
          <button
            onClick={handleClear}
            style={{
              background: clearConfirm ? 'rgba(239,68,68,0.15)' : 'transparent',
              border: `1px solid ${clearConfirm ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '8px', padding: '8px 16px', color: '#ef4444', cursor: 'pointer',
              fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
            aria-label="Vider le panier"
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
                borderRadius: '16px', padding: '18px',
                transition: 'border-color 0.2s',
              }}>
                <div className="cart-item-grid">
                  {/* Image */}
                  <Link href={`/produit/${item.id}`} style={{ textDecoration: 'none' }} className="cart-item-image">
                    <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: 'var(--color-sentech-dark)' }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
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

                  {/* Controls */}
                  <div className="cart-item-controls">
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      aria-label={`Supprimer ${item.name} du panier`}
                      style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                    >
                      <Trash2 size={16} />
                    </button>
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', borderRadius: '8px', overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Diminuer la quantité de ${item.name}`}
                        style={{ padding: '6px 10px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', display: 'flex' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '6px 12px', color: 'var(--color-foreground)', fontWeight: 700, fontSize: '0.9rem', minWidth: '32px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Augmenter la quantité de ${item.name}`}
                        disabled={item.quantity >= item.stockCount}
                        style={{ padding: '6px 10px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: item.quantity < item.stockCount ? 'pointer' : 'not-allowed', display: 'flex', opacity: item.quantity >= item.stockCount ? 0.4 : 1 }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1b75bc' }}>
                      = {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
              borderRadius: '20px', padding: '28px',
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '24px' }}>
                Récapitulatif
              </h2>

              {/* Promo code */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="promo-code-input" style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Code promo
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Tag size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} aria-hidden="true" />
                    <input
                      id="promo-code-input"
                      type="text"
                      placeholder="SENTECH10..."
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && applyPromo()}
                      className="input-dark"
                      style={{ paddingLeft: '34px', fontSize: '0.875rem' }}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-sentech-muted)', fontSize: '0.9rem' }}>
                  <span>Sous-total</span><span>{formatPrice(totalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '0.9rem' }}>
                    <span>Réduction promo</span><span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-sentech-muted)', fontSize: '0.9rem' }}>
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
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', opacity: isCheckingOut ? 0.7 : 1 }}
              >
                {isCheckingOut ? 'Traitement...' : '🔐 Valider la commande'}
              </button>

              {/* Payment methods */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-sentech-muted)', marginBottom: '10px' }}>Paiements acceptés</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {['💳 Carte', '📱 Orange Money', '📲 MTN', '🔐 PayPal'].map(p => (
                    <span key={p} style={{
                      padding: '3px 8px', borderRadius: '4px',
                      background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                      fontSize: '0.68rem', color: 'var(--color-sentech-muted)',
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
    </div>
  );
}
