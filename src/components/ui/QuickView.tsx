'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Heart, Star, Check, Truck, Shield } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);
  const modalRef  = useRef<HTMLDivElement>(null);
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  // IHM WCAG 2.1.2 — Focus trap + gestion Escape
  useEffect(() => {
    // Focus automatique sur le bouton fermer à l'ouverture
    closeRef.current?.focus();

    const FOCUSABLE = [
      'a[href]', 'button:not([disabled])', 'textarea', 'input',
      'select', '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', trapFocus);
    document.body.style.overflow = 'hidden';

    // IHM: masquer le fond pour les AT
    document.getElementById('main-content')?.setAttribute('aria-hidden', 'true');

    return () => {
      document.removeEventListener('keydown', trapFocus);
      document.body.style.overflow = '';
      document.getElementById('main-content')?.removeAttribute('aria-hidden');
    };
  }, [onClose]);

  const handleAdd = () => {
    addToCart(product);
    showToast(`${product.name} ajouté au panier !`, 'success');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    showToast(inWishlist ? 'Retiré des favoris' : 'Ajouté aux favoris !', inWishlist ? 'info' : 'success');
  };

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      <div ref={modalRef} className="modal-content" style={{ maxWidth: '800px' }}>
        {/* Bouton fermer — IHM: ref pour focus initial, 44x44px */}
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fermer l'aperçu"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
            borderRadius: '8px',
            width: '44px', height: '44px',
            cursor: 'pointer', color: 'var(--color-foreground)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        <div className="quickview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Image */}
          <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', background: 'var(--color-sentech-dark)' }}>
            <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="400px" />
            {product.discount > 0 && (
              <span className="badge-discount" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.category} · {product.brand}
            </div>

            {/* IHM: id pour aria-labelledby sur le dialog */}
            <h2 id="quickview-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.3, fontFamily: 'Outfit, sans-serif' }}>
              {product.name}
            </h2>

            {/* Rating — IHM: role img + contraste #475569 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }} role="img" aria-label={`Note ${product.rating} sur 5`}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>{product.rating} ({product.reviews} avis)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <span className="price-old">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            {/* Features (first 3) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.features.slice(0, 3).map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={14} color="#1b75bc" />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-foreground)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Delivery & Stock */}
            <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }} />
                {product.inStock ? `En stock (${product.stockCount})` : 'Rupture'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-sentech-muted)' }}>
                <Truck size={13} />
                {product.delivery}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-sentech-muted)' }}>
                <Shield size={13} />
                {product.warranty}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                style={{
                  flex: 1, padding: '12px',
                  background: inCart ? 'rgba(27,117,188,0.08)' : 'linear-gradient(135deg, #1b75bc, #0d528c)',
                  border: inCart ? '1px solid rgba(27,117,188,0.2)' : 'none',
                  borderRadius: '10px', color: inCart ? '#1b75bc' : 'white', fontWeight: 600,
                  fontSize: '0.875rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
                aria-label={`Ajouter ${product.name} au panier`}
              >
                <ShoppingCart size={16} />
                {inCart ? 'Dans le panier' : 'Ajouter au panier'}
              </button>
              <button
                onClick={handleWishlist}
                style={{
                  padding: '12px', borderRadius: '10px', cursor: 'pointer',
                  background: inWishlist ? 'rgba(239,68,68,0.08)' : 'var(--color-sentech-dark)',
                  border: inWishlist ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--color-sentech-border)',
                  color: inWishlist ? '#ef4444' : 'var(--color-sentech-muted)', display: 'flex',
                }}
                aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart size={18} fill={inWishlist ? '#ef4444' : 'none'} />
              </button>
            </div>

            <Link
              href={`/produit/${product.id}`}
              onClick={onClose}
              style={{ textAlign: 'center', fontSize: '0.82rem', color: '#1b75bc', textDecoration: 'none' }}
            >
              Voir la page complète →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
