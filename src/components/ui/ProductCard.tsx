'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye, Check } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import dynamic from 'next/dynamic';

const QuickView = dynamic(() => import('./QuickView'), { ssr: false });

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export default function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    showToast(`${product.name} ajouté au panier !`, 'success');
    setTimeout(() => { if (mountedRef.current) setAdded(false); }, 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(inWishlist ? 'Retiré des favoris' : '❤️ Ajouté aux favoris !', inWishlist ? 'info' : 'success');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const badgeText = product.discount > 0 
    ? `-${product.discount}%` 
    : (product.badge || (product.isNew ? 'NEW' : product.isBestSeller ? 'BEST SELLER' : ''));

  return (
    <>
      <Link href={`/produit/${product.id}`} style={{ textDecoration: 'none', display: 'block' }} aria-label={`Voir ${product.name}`}>
        <article
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            cursor: 'pointer',
            borderRadius: '20px',
            background: 'var(--color-sentech-card, #ffffff)',
            border: hovered ? '1px solid rgba(27,117,188,0.35)' : '1px solid var(--color-sentech-border, rgba(15,23,42,0.08))',
            transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: hovered 
              ? '0 12px 28px rgba(15, 23, 42, 0.08)' 
              : '0 2px 6px rgba(15, 23, 42, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* ═════════════════════════════════════════
              IMAGE AREA — Fond Blanc, Même Ratio 1:1
          ═════════════════════════════════════════ */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            background: '#ffffff',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
          }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
              style={{
                objectFit: 'contain',
                padding: '12px',
                transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />

            {/* Quick View Floating Button on Hover */}
            {showQuickView && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: hovered ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -40%) scale(0.9)',
                opacity: hovered ? 1 : 0,
                pointerEvents: hovered ? 'auto' : 'none',
                zIndex: 3,
                transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <button
                  onClick={handleQuickView}
                  aria-label={`Aperçu rapide de ${product.name}`}
                  style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '30px',
                    padding: '8px 16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <Eye size={14} /> Aperçu rapide
                </button>
              </div>
            )}

            {/* ── Overlay Bottom Bar inside Image: Heart (Left) & Badge (Right) ── */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}>
              {/* ❤️ Heart Wishlist Button (Bottom Left) */}
              <button
                onClick={handleWishlist}
                aria-label={inWishlist ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
                aria-pressed={inWishlist}
                style={{
                  pointerEvents: 'auto',
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: inWishlist ? 'rgba(239,68,68,0.95)' : 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  border: inWishlist ? '1px solid #ef4444' : '1px solid rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: inWishlist ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Heart size={18} fill={inWishlist ? '#ffffff' : 'none'} color={inWishlist ? '#ffffff' : '#64748b'} />
              </button>

              {/* 🏷️ Badge Pill (Bottom Right) */}
              {badgeText && (
                <span style={{
                  pointerEvents: 'auto',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  color: '#ffffff',
                  background: product.discount > 0 || product.isPromo
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'linear-gradient(135deg, #1b75bc, #0d528c)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hovered ? 'scale(1.05)' : 'scale(1)',
                }}>
                  {badgeText}
                </span>
              )}
            </div>
          </div>

          {/* ═════════════════════════════════════════
              CARD DETAILS AREA (SEPARATOR LINE)
          ═════════════════════════════════════════ */}
          <div style={{
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-sentech-border, rgba(15,23,42,0.06))',
          }}>
            <div>
              {/* Product Name — Titre carte 20px Inter */}
              <h3 className="card-title" style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-foreground, #0f172a)',
                marginBottom: '8px',
                lineHeight: '1.3',
                fontFamily: 'var(--font-inter, Inter), system-ui, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.6em',
              }}>
                {product.name}
              </h3>

              {/* Rating: Stars + Review count (Petit texte 14px) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', color: '#fbbf24' }} role="img" aria-label={`Note: ${product.rating} sur 5`}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= Math.round(product.rating) ? '#fbbf24' : 'none'}
                      color="#fbbf24"
                    />
                  ))}
                </div>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                  ({product.reviews})
                </span>
              </div>

              {/* Current Price (20px / 1.25rem) */}
              <div style={{ marginBottom: '4px' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--color-foreground, #0f172a)',
                  fontFamily: 'var(--font-inter, Inter), system-ui, sans-serif',
                  letterSpacing: '-0.3px',
                }}>
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Old Price (Petit texte 14px) */}
              <div style={{ minHeight: '20px', marginBottom: '12px' }}>
                {product.oldPrice > product.price ? (
                  <span style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    textDecoration: 'line-through',
                    fontWeight: 500,
                  }}>
                    {formatPrice(product.oldPrice)}
                  </span>
                ) : null}
              </div>

              {/* Stock Indicator (Petit texte 14px) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: product.inStock ? '#10b981' : '#ef4444',
                  boxShadow: product.inStock ? '0 0 8px rgba(16,185,129,0.5)' : 'none',
                }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: product.inStock ? '#10b981' : '#ef4444',
                }}>
                  {product.inStock ? 'En stock' : 'Rupture de stock'}
                </span>
              </div>
            </div>

            {/* Action Button: [ Ajouter ] (Progressive emergence transition on hover) */}
            <div style={{
              opacity: hovered ? 1 : 0.9,
              transform: hovered ? 'translateY(0)' : 'translateY(2px)',
              transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                aria-label={added ? `${product.name} ajouté au panier` : `Ajouter ${product.name} au panier`}
                style={{
                  width: '100%',
                  minHeight: '44px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: added
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : inCart
                    ? 'rgba(27,117,188,0.1)'
                    : 'linear-gradient(135deg, #1b75bc, #2563eb)',
                  border: inCart && !added ? '1px solid rgba(27,117,188,0.3)' : 'none',
                  color: added ? '#ffffff' : inCart ? '#1b75bc' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: hovered
                    ? '0 8px 20px rgba(27,117,188,0.35)'
                    : '0 4px 12px rgba(27,117,188,0.18)',
                  transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: product.inStock ? 1 : 0.5,
                }}
              >
                {added ? (
                  <>
                    <Check size={18} /> Ajouté !
                  </>
                ) : inCart ? (
                  <>
                    <ShoppingCart size={18} /> Dans le panier
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Ajouter
                  </>
                )}
              </button>
            </div>
          </div>
        </article>
      </Link>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickView product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
