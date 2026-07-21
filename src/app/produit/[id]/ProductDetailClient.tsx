'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, Star, Check, Truck, Shield, ChevronLeft, ChevronRight,
  Minus, Plus, Heart, Zap, Info, Share2, ChevronRight as BreadArrow, Copy,
  CheckCircle, MessageSquare, HelpCircle, ChevronDown, Award
} from 'lucide-react';
import { products, formatPrice } from '@/lib/products';
import { fetchProducts, fetchProductReviews, submitProductReview } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ui/ProductCard';

const COLOR_OPTIONS = ['Noir Carbone', 'Blanc Studio', 'Bleu Saphir'];

const PRODUCT_FAQS = [
  { q: "Quels sont les délais de livraison au Sénégal ?", a: "Pour Dakar, la livraison est effectuée en 24h chrono. Pour les régions (Thiès, Saint-Louis, Ziguinchor, Mbour, etc.), comptez 48h." },
  { q: "Quels sont les modes de paiement disponibles ?", a: "Paiement à la livraison par Cash, Wave, Orange Money ou Carte Bancaire." },
  { q: "Quelle est la durée de la garantie ?", a: "Tous nos équipements sont certifiés d'origine et couverts par une garantie officielle de 1 à 2 ans avec SAV de proximité à Dakar." },
  { q: "Comment effectuer un retour ou échange ?", a: "Vous disposez de 7 jours satisfait ou remboursé si le produit est retourné dans son emballage d'origine." },
];

export default function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [productData, setProductData] = useState(products);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Noir Carbone');
  const [added, setAdded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Zoom Image State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetchProducts(),
          fetchProductReviews(id)
        ]);
        if (prodRes && prodRes.length > 0) setProductData(prodRes as any);
        if (revRes.data) setReviews(revRes.data);
      } catch {}
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  const product = useMemo(() => productData.find(p => p.id === id), [productData, id]);

  const related = useMemo(() =>
    productData.filter(p => product && p.category === product.category && p.id !== product.id).slice(0, 4),
    [productData, product]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    showToast(`${product.name} (${selectedColor}) ajouté au panier !`, 'success');
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    router.push('/panier');
  };

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setSubmittingReview(true);
    const { data, error } = await submitProductReview({
      product_id: id,
      user_name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });
    setSubmittingReview(false);
    
    if (error) {
      showToast('Erreur lors de l\'envoi de l\'avis', 'error');
    } else {
      showToast('Merci pour votre avis !', 'success');
      if (data) setReviews(prev => [data[0], ...prev]);
      setShowReviewForm(false);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
    }
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
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
  const images = product.images?.length > 1 ? product.images : [product.image, product.image, product.image, product.image];

  const dynamicRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating.toFixed(1);
  const dynamicReviewCount = reviews.length > 0 ? reviews.length : product.reviews;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px 100px' }}>

        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.85rem', color: '#475569', marginBottom: '40px', flexWrap: 'wrap',
        }}>
          <Link href="/" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Accueil</Link>
          <BreadArrow size={14} />
          <Link href="/boutique" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500 }}>Boutique</Link>
          <BreadArrow size={14} />
          <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} style={{ color: '#1b75bc', textDecoration: 'none', fontWeight: 600 }}>
            {product.category}
          </Link>
          <BreadArrow size={14} />
          <span style={{ color: 'var(--color-foreground)', fontWeight: 700 }}>{product.name}</span>
        </nav>

        {/* ═══════════════════════════════════════════════
            MAIN PRODUCT DETAIL SECTION
        ═══════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '48px',
          alignItems: 'start',
          marginBottom: '80px',
        }}>
          
          {/* LEFT: GALLERY & ZOOM */}
          <div>
            {/* Main Interactive Zoom Box */}
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                background: '#ffffff',
                border: '1px solid var(--color-sentech-border)',
                boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
                marginBottom: '16px',
                cursor: 'zoom-in',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
              }}
            >
              <Image
                src={images[activeImg] || product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                style={{
                  objectFit: 'contain',
                  padding: '24px',
                  transition: isZoomed ? 'none' : 'transform 250ms ease',
                  transform: isZoomed ? `scale(1.8)` : 'scale(1)',
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                }}
                priority
              />

              {/* Badge Overlay */}
              {product.discount > 0 && (
                <span style={{
                  position: 'absolute', top: '20px', left: '20px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff', padding: '6px 14px', borderRadius: '100px',
                  fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                }}>
                  -{product.discount}%
                </span>
              )}

              {/* Hover Zoom Hint */}
              <div style={{
                position: 'absolute', bottom: '16px', right: '16px',
                background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(10px)',
                color: '#ffffff', padding: '6px 12px', borderRadius: '100px',
                fontSize: '0.75rem', fontWeight: 600, pointerEvents: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                🔍 Survoler pour zoomer
              </div>
            </div>

            {/* Miniatures Thumbnails Gallery */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: activeImg === i ? '2px solid #1b75bc' : '1px solid var(--color-sentech-border)',
                    boxShadow: activeImg === i ? '0 0 16px rgba(27,117,188,0.3)' : 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    position: 'relative',
                    background: '#ffffff',
                    transition: 'all 200ms ease',
                  }}
                >
                  <Image src={img} alt={`Miniature ${i + 1}`} fill sizes="100px" style={{ objectFit: 'contain', padding: '6px' }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div>
            {/* Brand & Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.78rem', color: '#1b75bc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{product.brand}</span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{product.category}</span>
            </div>

            {/* Nom Produit (Inter Bold 28px) */}
            <h1 className="hero-title" style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 800,
              color: 'var(--color-foreground)',
              lineHeight: 1.2,
              marginBottom: '16px',
              fontFamily: 'var(--font-inter, Inter), sans-serif',
            }}>
              {product.name}
            </h1>

            {/* Note & Avis (★★★★★ 124) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '3px' }} role="img" aria-label={`Note: ${dynamicRating} sur 5`}>
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={18} fill={s <= Math.round(Number(dynamicRating)) ? '#fbbf24' : 'none'} color={s <= Math.round(Number(dynamicRating)) ? '#fbbf24' : '#cbd5e1'} />
                ))}
              </div>
              <span style={{ fontWeight: 800, color: 'var(--color-foreground)', fontSize: '0.95rem' }}>{dynamicRating}</span>
              <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>({dynamicReviewCount} avis vérifiés)</span>
            </div>

            {/* Prix Actuel & Ancien Prix */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1b75bc', fontFamily: 'var(--font-inter, Inter), sans-serif', letterSpacing: '-0.5px' }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice > product.price && (
                <>
                  <span style={{ color: '#94a3b8', fontSize: '1.2rem', textDecoration: 'line-through', fontWeight: 500 }}>
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '8px', padding: '4px 10px', fontSize: '0.82rem', fontWeight: 800, border: '1px solid rgba(239,68,68,0.2)' }}>
                    Économisez {formatPrice(product.oldPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Statut Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', background: product.inStock ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', padding: '10px 16px', borderRadius: '12px', border: `1px solid ${product.inStock ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, width: 'fit-content' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.inStock ? '#10b981' : '#ef4444', boxShadow: product.inStock ? '0 0 10px rgba(16,185,129,0.6)' : 'none' }} />
              <span style={{ color: product.inStock ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
                {product.inStock ? 'En stock — Expédition express sous 24h' : 'Rupture de stock'}
              </span>
            </div>

            {/* Description Épurée */}
            {product.description && (
              <p className="text-body" style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.65, marginBottom: '32px' }}>
                {product.description}
              </p>
            )}

            {/* Caractéristiques Principales */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Caractéristiques techniques
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {product.features.map((f: string) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15,23,42,0.02)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--color-sentech-border)' }}>
                      <CheckCircle size={16} color="#10b981" />
                      <span style={{ color: '#0f172a', fontSize: '0.88rem', fontWeight: 600 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Choix des Couleurs */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Couleur : <span style={{ color: '#1b75bc', fontWeight: 700 }}>{selectedColor}</span>
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {COLOR_OPTIONS.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      border: selectedColor === col ? '2px solid #1b75bc' : '1px solid var(--color-sentech-border)',
                      background: selectedColor === col ? 'rgba(27,117,188,0.08)' : '#ffffff',
                      color: selectedColor === col ? '#1b75bc' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantité & Boutons d'Action (Ajouter au panier & Acheter maintenant) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Selecteur Quantité */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '12px', overflow: 'hidden', height: '50px' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Diminuer" style={{ padding: '0 16px', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Minus size={18} />
                  </button>
                  <span style={{ padding: '0 16px', fontWeight: 800, color: '#0f172a', minWidth: '44px', textAlign: 'center', fontSize: '1.05rem' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} aria-label="Augmenter" style={{ padding: '0 16px', background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Plus size={18} />
                  </button>
                </div>

                {/* Bouton 1: Ajouter au panier */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    height: '50px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    minWidth: '200px',
                  }}
                >
                  {added ? <><Check size={20} /> Ajouté au panier !</> : <><ShoppingCart size={20} /> Ajouter au panier</>}
                </button>
              </div>

              {/* Bouton 2: Acheter maintenant (Express Direct Checkout) */}
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="btn-secondary"
                style={{
                  width: '100%',
                  height: '50px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  border: '2px solid #1b75bc',
                  color: '#1b75bc',
                }}
              >
                ⚡ Acheter maintenant (Commande Express)
              </button>

            </div>

            {/* Réassurance : Livraison & Garantie */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              padding: '20px',
              background: 'rgba(15,23,42,0.02)',
              borderRadius: '18px',
              border: '1px solid var(--color-sentech-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(27,117,188,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} color="#1b75bc" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Livraison 24h</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Express à Dakar & Régions</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Garantie Officielle</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>1 an constructeur & SAV</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ═══════════════════════════════════════════════
            SECTION: PRODUITS SIMILAIRES
        ═══════════════════════════════════════════════ */}
        {related.length > 0 && (
          <section className="section-padding" style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Produits <span className="sentech-gradient-text">similaires</span>
              </h2>
              <Link href={`/boutique?cat=${encodeURIComponent(product.category)}`} style={{ color: '#1b75bc', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Voir plus dans {product.category} →
              </Link>
            </div>

            <div className="product-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════
            SECTION: AVIS CLIENTS
        ═══════════════════════════════════════════════ */}
        <section className="section-padding" style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '8px' }}>
                Avis <span className="sentech-gradient-text">Clients</span> ({dynamicReviewCount})
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Découvrez les retours d&apos;expérience vérifiés de nos acheteurs au Sénégal.
              </p>
            </div>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary" 
              style={{ fontSize: '0.9rem', padding: '12px 24px' }}
            >
              {showReviewForm ? 'Annuler' : '✍️ Écrire un avis'}
            </button>
          </div>

          {/* Formulaire Avis */}
          {showReviewForm && (
            <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '20px', padding: '32px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(15,23,42,0.05)', animation: 'slide-down 0.2s ease-out' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>Donnez votre avis sur {product.name}</h3>
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Votre nom complet <span style={{color: '#ef4444'}}>*</span></label>
                    <input type="text" required value={reviewName} onChange={e => setReviewName(e.target.value)} className="sentech-input" placeholder="Mamadou S." />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Note globale <span style={{color: '#ef4444'}}>*</span></label>
                    <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', background: '#f8fafc', border: '1px solid var(--color-sentech-border)', borderRadius: '12px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setReviewRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                          <Star size={22} fill={star <= reviewRating ? '#fbbf24' : 'none'} color={star <= reviewRating ? '#fbbf24' : '#cbd5e1'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Votre commentaire <span style={{color: '#ef4444'}}>*</span></label>
                  <textarea required value={reviewComment} onChange={e => setReviewComment(e.target.value)} className="sentech-input" rows={4} placeholder="Partagez votre expérience avec cet équipement..." style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={submittingReview} className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                  {submittingReview ? 'Envoi en cours...' : 'Publier mon avis'}
                </button>
              </form>
            </div>
          )}

          {/* Liste des Avis */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '20px' }}>
              <MessageSquare size={36} style={{ color: '#1b75bc', margin: '0 auto 14px' }} />
              <p style={{ color: '#64748b', fontSize: '1rem' }}>Soyez le premier client à laisser un avis sur ce produit !</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1b75bc, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                        {rev.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>{rev.user_name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                          {new Date(rev.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={14} fill={s <= rev.rating ? '#fbbf24' : 'none'} color={s <= rev.rating ? '#fbbf24' : '#cbd5e1'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>&quot;{rev.comment}&quot;</p>
                  <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', fontWeight: 700 }}>
                    <CheckCircle size={15} /> Achat vérifié SenTech Plus
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION: QUESTIONS & FAQ PRODUIT (Accordion)
        ═══════════════════════════════════════════════ */}
        <section className="section-padding" style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>
              Questions <span className="sentech-gradient-text">Fréquentes</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Tout ce que vous devez savoir avant de commander ce produit.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
            {PRODUCT_FAQS.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-sentech-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                  boxShadow: openFaq === idx ? '0 8px 24px rgba(27,117,188,0.08)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: openFaq === idx ? '#1b75bc' : '#0f172a',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle size={20} color={openFaq === idx ? '#1b75bc' : '#64748b'} />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transition: 'transform 200ms ease',
                      transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                      color: openFaq === idx ? '#1b75bc' : '#64748b',
                    }}
                  />
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 24px 20px 56px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.65, animation: 'fade-in 0.2s ease-out' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
