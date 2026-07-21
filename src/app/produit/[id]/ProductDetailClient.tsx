'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart, Star, Check, Truck, Shield, ChevronLeft, ChevronRight,
  Minus, Plus, Heart, Zap, Info, Share2, ChevronRight as BreadArrow, Copy, CheckCircle
} from 'lucide-react';
import { products, formatPrice } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ui/ProductCard';

export default function ProductDetailClient({ id }: { id: string }) {
  const [productData, setProductData] = useState(products);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Load from Supabase first, fall back to static
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        if (data && data.length > 0) setProductData(data as any);
      } catch {}
      finally { setLoading(false); }
    }
    load();
  }, []);

  const product = useMemo(() => productData.find(p => p.id === id), [productData, id]);

  const related = useMemo(() =>
    productData.filter(p => product && p.category === product.category && p.id !== product.id).slice(0, 4),
    [productData, product]
  );

  const handleCopyLink = () => {
    const url = `${window.location.origin}/produit/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const handleWhatsAppShare = () => {
    if (!product) return;
    const url = `${window.location.origin}/produit/${id}`;
    const text = encodeURIComponent(`Je viens de trouver ce produit sur SenTech Plus : ${product.name} — ${formatPrice(product.price)} 🔥\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', color: '#475569' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          Chargement du produit...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#475569' }}>
            <Info size={48} />
          </div>
          <h1 style={{ color: 'var(--color-foreground)', marginBottom: '12px', fontSize: '1.5rem' }}>Produit introuvable</h1>
          <p style={{ color: '#475569', marginBottom: '24px' }}>Ce produit n&apos;existe pas ou a été supprimé.</p>
          <Link href="/boutique" className="btn-primary">Retour à la boutique</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = product.images?.length > 1 ? product.images : [product.image, product.image, product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    showToast(`${product.name} ajouté au panier !`, 'success');
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.8rem', color: '#475569', marginBottom: '28px', flexWrap: 'wrap',
        }}>
          <Link href="/" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Accueil</Link>
          <BreadArrow size={13} />
          <Link href="/boutique" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Boutique</Link>
          <BreadArrow size={13} />
          <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} style={{ color: '#1b75bc', textDecoration: 'none', fontWeight: 500 }}>
            {product.category}
          </Link>
          <BreadArrow size={13} />
          <span style={{ color: 'var(--color-foreground)', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="product-detail-grid">
          {/* Images */}
          <div>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', marginBottom: '14px' }}>
              <Image src={images[activeImg] || product.image} alt={product.name} fill sizes="600px" style={{ objectFit: 'cover' }} priority />
              {product.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#1b75bc', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {product.badge}
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} aria-label="Image précédente" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % images.length)} aria-label="Image suivante" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ flex: 1, aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${activeImg === i ? '#1b75bc' : 'var(--color-sentech-border)'}`, cursor: 'pointer', padding: 0, position: 'relative', background: 'var(--color-sentech-card)' }}>
                  <Image src={img} alt={`Vue ${i + 1}`} fill sizes="80px" style={{ objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>{product.brand}</span>
              <span style={{ color: 'var(--color-sentech-border)' }}>·</span>
              <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>{product.category}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--color-foreground)', lineHeight: 1.2, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={16} fill={s <= Math.round(product.rating) ? '#fbbf24' : 'none'} color={s <= Math.round(product.rating) ? '#fbbf24' : '#475569'} />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--color-foreground)', fontSize: '0.875rem' }}>{product.rating}</span>
              <span style={{ color: '#475569', fontSize: '0.8rem' }}>({product.reviews} avis)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <>
                  <span style={{ color: '#475569', fontSize: '1.1rem', textDecoration: 'line-through' }}>{formatPrice(product.oldPrice)}</span>
                  <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '6px', padding: '3px 8px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)' }}>
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.inStock ? '#10b981' : '#ef4444' }} />
              <span style={{ color: product.inStock ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
                {product.inStock ? 'En stock — Expédition 24h' : 'Rupture de stock'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.95rem' }}>
                {product.description}
              </p>
            )}

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Diminuer" style={{ padding: '12px 16px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', display: 'flex' }}>
                  <Minus size={16} />
                </button>
                <span style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-foreground)', minWidth: '40px', textAlign: 'center', fontSize: '1rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} aria-label="Augmenter" style={{ padding: '12px 16px', background: 'none', border: 'none', color: 'var(--color-foreground)', cursor: 'pointer', display: 'flex' }}>
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', padding: '12px 20px', fontSize: '0.95rem', gap: '8px', minWidth: '160px' }}
              >
                {added ? <><Check size={18} /> Ajouté !</> : <><ShoppingCart size={18} /> Ajouter au panier</>}
              </button>
            </div>

            {/* Wishlist + Share */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', position: 'relative' }}>
              <button
                onClick={() => { toggleWishlist(product); showToast(inWishlist ? `${product.name} retiré des favoris` : `${product.name} ajouté aux favoris ❤️`, inWishlist ? 'info' : 'success'); }}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '10px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem',
                  background: inWishlist ? 'rgba(239,68,68,0.08)' : 'var(--color-sentech-dark)',
                  border: `1px solid ${inWishlist ? 'rgba(239,68,68,0.3)' : 'var(--color-sentech-border)'}`,
                  color: inWishlist ? '#ef4444' : '#475569', cursor: 'pointer',
                }}
              >
                <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} />
                {inWishlist ? 'Dans les favoris' : 'Ajouter aux favoris'}
              </button>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowShareMenu(v => !v)}
                  style={{
                    padding: '10px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem',
                    background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                    color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <Share2 size={16} /> Partager
                </button>
                {showShareMenu && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                    background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                    borderRadius: '12px', padding: '8px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    minWidth: '200px',
                  }}>
                    <button onClick={handleWhatsAppShare} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#25D366', fontWeight: 600, fontSize: '0.85rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>💬</span> WhatsApp
                    </button>
                    <button onClick={handleCopyLink} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: linkCopied ? '#10b981' : 'var(--color-foreground)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {linkCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {linkCopied ? 'Lien copié !' : 'Copier le lien'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Points forts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.features.slice(0, 5).map((f: string) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={12} color="#10b981" />
                      </div>
                      <span style={{ color: '#475569', fontSize: '0.875rem' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantees */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { icon: <Truck size={15} />, text: product.delivery || 'Livraison 24h-48h' },
                { icon: <Shield size={15} />, text: product.warranty || 'Garantie 1 an' },
                { icon: <Zap size={15} />, text: 'Paiement sécurisé' },
              ].map(g => (
                <div key={g.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', borderRadius: '8px', padding: '8px 12px' }}>
                  <span style={{ color: '#1b75bc' }}>{g.icon}</span>
                  <span style={{ color: '#475569', fontSize: '0.78rem', fontWeight: 500 }}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ marginTop: '64px' }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                Vous aimerez aussi
              </h2>
              <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '4px' }}>
                Autres produits dans la catégorie <strong>{product.category}</strong>
              </p>
            </div>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
