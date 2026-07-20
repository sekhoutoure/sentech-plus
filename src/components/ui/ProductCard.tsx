'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
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

  // Badge color logic
  const getBadgeStyle = (badge: string) => {
    if (badge === 'BEST SELLER') return { background: 'linear-gradient(135deg, #f59e0b, #d97706)' };
    if (badge === 'PREMIUM') return { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' };
    if (badge === 'TOP VENTE') return { background: 'linear-gradient(135deg, #10b981, #059669)' };
    return {}; // uses badge-new class (blue)
  };

  return (
    <>
      <Link href={`/produit/${product.id}`} style={{ textDecoration: 'none', display: 'block' }} aria-label={`Voir ${product.name}`}>
        <article
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative', overflow: 'hidden',
            cursor: 'pointer', borderRadius: '16px',
            background: 'var(--color-sentech-card)',
            border: hovered ? '1px solid rgba(27,117,188,0.3)' : '1px solid var(--color-sentech-border)',
            transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
            transition: 'all 0.3s ease',
            boxShadow: hovered ? '0 20px 40px rgba(15, 23, 42, 0.08), 0 0 20px rgba(27, 117, 188, 0.1)' : '0 4px 20px rgba(15, 23, 42, 0.03)',
          }}
        >
          {/* Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, display: 'flex', gap: '6px', flexDirection: 'column' }}>
            {product.discount > 0 && (
              <span className="badge-discount">-{product.discount}%</span>
            )}
            {product.badge && (
              <span
                className={!['BEST SELLER','PREMIUM','TOP VENTE'].includes(product.badge) ? 'badge-new' : ''}
                style={{
                  padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem',
                  fontWeight: 700, color: 'white', display: 'inline-block',
                  ...getBadgeStyle(product.badge),
                }}
              >
                {product.badge === 'BEST SELLER' ? '⭐ ' : ''}{product.badge}
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
            style={{
              position: 'absolute', top: '12px', right: '12px', zIndex: 2,
              background: inWishlist ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.5)',
              border: inWishlist ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '7px', cursor: 'pointer',
              color: inWishlist ? '#ef4444' : '#475569',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} />
          </button>

          {/* Quick view */}
          {showQuickView && hovered && (
            <div style={{
              position: 'absolute', bottom: '74px', left: '50%', transform: 'translateX(-50%)',
              zIndex: 3, animation: 'fade-in 0.15s ease-out',
            }}>
              <button
                onClick={handleQuickView}
                aria-label={`Aperçu rapide de ${product.name}`}
                style={{
                  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
                  padding: '6px 14px', color: 'white', cursor: 'pointer',
                  fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Eye size={14} /> Aperçu rapide
              </button>
            </div>
          )}

          {/* Image */}
          <div style={{
            position: 'relative', width: '100%', paddingTop: '100%',
            background: 'linear-gradient(135deg, var(--color-sentech-dark), var(--color-background))',
            overflow: 'hidden',
          }}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
              }}
            />
            {hovered && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at center, rgba(27,117,188,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              {product.category}
            </div>

            <h3 style={{
              fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-foreground)',
              marginBottom: '8px', lineHeight: '1.4',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {product.name}
            </h3>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }} aria-label={`Note: ${product.rating} sur 5`}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={12} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#475569' }}>
                {product.rating} ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-foreground)' }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <span className="price-old" style={{ fontSize: '0.8rem' }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: product.inStock ? '#10b981' : '#ef4444',
                boxShadow: product.inStock ? '0 0 6px #10b981' : 'none',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '0.75rem', color: product.inStock ? '#10b981' : '#ef4444' }}>
                {product.inStock ? `En stock (${product.stockCount})` : 'Rupture de stock'}
              </span>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              aria-label={`Ajouter ${product.name} au panier`}
              aria-disabled={!product.inStock}
              title={!product.inStock ? 'Rupture de stock' : undefined}
              style={{
                width: '100%', padding: '10px',
                background: added
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : inCart
                    ? 'rgba(27,117,188,0.08)'
                    : 'linear-gradient(135deg, #1b75bc, #0d528c)',
                border: inCart && !added ? '1px solid rgba(27,117,188,0.2)' : 'none',
                borderRadius: '10px', cursor: product.inStock ? 'pointer' : 'not-allowed',
                color: added ? 'white' : inCart ? '#1b75bc' : 'white', fontWeight: 600, fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.3s ease',
                opacity: product.inStock ? 1 : 0.5,
              }}
            >
              {added ? <>✓ Ajouté !</> : inCart ? <><ShoppingCart size={16} /> Dans le panier</> : <><ShoppingCart size={16} /> Ajouter</>}
            </button>
          </div>

          {/* Glow border on hover */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '16px', pointerEvents: 'none',
              boxShadow: 'inset 0 0 0 1px rgba(27,117,188,0.3)',
            }} />
          )}
        </article>
      </Link>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickView product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
