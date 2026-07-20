'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Check, Truck, Shield, ChevronLeft, ChevronRight, Minus, Plus, Heart, Zap, Info } from 'lucide-react';
import { products, formatPrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ui/ProductCard';

export default function ProductDetailClient({ id }: { id: string }) {
  const [productData, setProductData] = useState(products);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  // Load admin-managed products from localStorage
  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('adminProductList');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setProductData(parsed);
        }
      } catch {}
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const product = useMemo(() => productData.find(p => p.id === id), [productData, id]);

  const related = useMemo(() =>
    productData.filter(p => product && p.category === product.category && p.id !== product.id).slice(0, 4),
    [productData, product]
  );

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#475569' }}>
            <Info size={48} />
          </div>
          <h1 style={{ color: 'white', marginBottom: '12px', fontSize: '1.5rem' }}>Produit introuvable</h1>
          <p style={{ color: '#475569', marginBottom: '24px' }}>Ce produit n&apos;existe pas ou a été supprimé.</p>
          <Link href="/boutique" className="btn-primary">Retour à la boutique</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    showToast(`${product.name} ajouté au panier !`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    showToast(inWishlist ? 'Retiré des favoris' : '❤️ Ajouté aux favoris !', inWishlist ? 'info' : 'success');
  };

  const savings = product.oldPrice > product.price ? product.oldPrice - product.price : 0;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" style={{ marginBottom: '32px', fontSize: '0.875rem', color: '#475569', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
          <Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Accueil</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href="/boutique" style={{ color: '#475569', textDecoration: 'none' }}>Boutique</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} style={{ color: '#475569', textDecoration: 'none' }}>{product.category}</Link>
          <span style={{ margin: '0 6px' }}>›</span>
          <span style={{ color: '#1b75bc' }}>{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="product-detail-grid">
          {/* Images */}
          <div>
            <div style={{
              position: 'relative', borderRadius: '20px', overflow: 'hidden',
              aspectRatio: '1', background: 'var(--color-sentech-dark)',
              border: '1px solid var(--color-sentech-border)',
              marginBottom: '16px',
            }}>
              <Image
                src={product.images[activeImg] || product.image}
                alt={`${product.name} - image ${activeImg + 1}`}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
              {/* Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => Math.max(0, i - 1))}
                    aria-label="Image précédente"
                    style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex',
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => Math.min(product.images.length - 1, i + 1))}
                    aria-label="Image suivante"
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'white', display: 'flex',
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {product.discount > 0 && (
                <span className="badge-discount" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.85rem' }}>
                  -{product.discount}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Voir image ${i + 1}`}
                  aria-pressed={activeImg === i}
                  style={{
                    width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden',
                    border: activeImg === i ? '2px solid #1b75bc' : '2px solid var(--color-sentech-border)',
                    cursor: 'pointer', background: 'var(--color-sentech-dark)', padding: 0, position: 'relative',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Image src={img} alt={`${product.name} vue ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="72px" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            {/* Brand & Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.brand}
              </span>
              {product.badge && (
                <span className="badge-new" style={{
                  background: product.badge === 'BEST SELLER'
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : product.badge === 'PREMIUM'
                      ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                      : undefined,
                }}>
                  {product.badge}
                </span>
              )}
            </div>

            <h1 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--color-foreground)',
              marginBottom: '16px', lineHeight: 1.3,
              fontFamily: 'Outfit, sans-serif',
            }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }} aria-label={`Note: ${product.rating} sur 5`}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                ))}
              </div>
              <span style={{ color: '#334155', fontSize: '0.9rem' }}>
                {product.rating}/5 · {product.reviews} avis vérifiés
              </span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '20px', borderRadius: '16px',
              background: 'rgba(27,117,188,0.05)',
              border: '1px solid rgba(27,117,188,0.15)',
              marginBottom: '24px', flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                {formatPrice(product.price)}
              </span>
              {savings > 0 && (
                <>
                  <span className="price-old">{formatPrice(product.oldPrice)}</span>
                  <span className="badge-discount">-{product.discount}%</span>
                  <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
                    Vous économisez {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--color-sentech-muted)', lineHeight: '1.7', marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Features */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ color: 'var(--color-foreground)', fontWeight: 600, marginBottom: '12px', fontSize: '0.95rem' }}>
                Caractéristiques principales
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Check size={16} color="#1b75bc" aria-hidden="true" />
                    <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px',
              padding: '10px 14px', borderRadius: '10px',
              background: product.inStock ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              border: product.inStock ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: product.inStock ? '#10b981' : '#ef4444',
                boxShadow: product.inStock ? '0 0 8px #10b981' : 'none',
                flexShrink: 0,
              }} />
              <span style={{ color: product.inStock ? '#10b981' : '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>
                {product.inStock ? `En stock — ${product.stockCount} unités disponibles` : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity & Add */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                  disabled={quantity <= 1}
                  style={{ padding: '12px 16px', background: 'none', border: 'none', color: 'white', cursor: quantity > 1 ? 'pointer' : 'not-allowed', display: 'flex', opacity: quantity <= 1 ? 0.4 : 1 }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ padding: '12px 20px', color: 'var(--color-foreground)', fontWeight: 700, minWidth: '48px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))}
                  aria-label="Augmenter la quantité"
                  disabled={quantity >= product.stockCount}
                  style={{ padding: '12px 16px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: quantity < product.stockCount ? 'pointer' : 'not-allowed', display: 'flex', opacity: quantity >= product.stockCount ? 0.4 : 1 }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                style={{
                  flex: 1, minWidth: '160px', padding: '14px',
                  background: added ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #1b75bc, #0d528c)',
                  border: 'none', borderRadius: '12px',
                  color: 'white', fontWeight: 700, fontSize: '1rem',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(27,117,188,0.3)',
                }}
                aria-label={`Ajouter ${quantity} ${product.name} au panier`}
              >
                {added ? <><Check size={20} /> Ajouté !</> : <><ShoppingCart size={20} /> Ajouter au panier</>}
              </button>
              <button
                onClick={handleWishlist}
                style={{
                  padding: '14px', borderRadius: '12px', cursor: 'pointer',
                  background: inWishlist ? 'rgba(239,68,68,0.08)' : 'var(--color-sentech-dark)',
                  border: inWishlist ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--color-sentech-border)',
                  color: inWishlist ? '#ef4444' : 'var(--color-sentech-muted)', display: 'flex', transition: 'all 0.2s',
                }}
                aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} />
              </button>
            </div>

            {/* Buy now */}
            <Link href="/panier" onClick={handleBuyNow} style={{ display: 'block', marginBottom: '24px' }}>
              <button
                style={{
                  width: '100%', padding: '14px',
                  background: 'transparent',
                  border: '1px solid rgba(27,117,188,0.4)', borderRadius: '12px',
                  color: '#1b75bc', fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <Zap size={16} /> Acheter maintenant
              </button>
            </Link>

            {/* Delivery & Warranty */}
            <div className="delivery-grid">
              {[
                { icon: <Truck size={18} aria-hidden="true" />, label: 'Livraison', value: product.delivery },
                { icon: <Shield size={18} aria-hidden="true" />, label: 'Garantie', value: product.warranty },
              ].map(item => (
                <div key={item.label} style={{
                  padding: '14px', borderRadius: '12px',
                  background: 'var(--color-sentech-card)',
                  border: '1px solid var(--color-sentech-border)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <span style={{ color: '#1b75bc' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-foreground)', fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section style={{ marginTop: '60px' }} aria-label="Avis clients">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            Avis clients
            <span style={{ marginLeft: '10px', fontSize: '1rem', color: '#f59e0b' }}>⭐ {product.rating}/5</span>
          </h2>
          <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '24px' }}>{product.reviews} avis vérifiés</p>
          <div className="reviews-grid">
            {[
              { name: 'Moussa D.', rating: 5, text: 'Produit excellent, conforme à la description. Livraison rapide, je recommande à 100% !', date: '12 juillet 2025', verified: true },
              { name: 'Fatou S.', rating: 5, text: 'Très bonne qualité pour le prix. Le service client est réactif et professionnel.', date: '8 juillet 2025', verified: true },
              { name: 'Ibrahima B.', rating: 4, text: 'Article reçu dans les délais. Qualité au rendez-vous. Emballage soigné et sécurisé.', date: '2 juillet 2025', verified: true },
            ].map(review => (
              <div key={review.name} style={{
                padding: '20px', borderRadius: '16px',
                background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1b75bc, #a1b1c2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white', fontSize: '1rem', flexShrink: 0,
                  }} aria-hidden="true">
                    {review.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-foreground)', fontSize: '0.9rem' }}>{review.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                      {review.date}
                      {review.verified && <span style={{ marginLeft: '6px', color: '#10b981' }}>✓ Achat vérifié</span>}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', color: '#f59e0b' }} aria-label={`Note: ${review.rating} étoiles`}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12} fill={s <= review.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', lineHeight: '1.6' }}>{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ marginTop: '60px' }} aria-label="Produits similaires">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '32px', fontFamily: 'Outfit, sans-serif' }}>
              Produits similaires
            </h2>
            <div className="product-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
