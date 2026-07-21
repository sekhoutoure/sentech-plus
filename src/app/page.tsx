'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Shield, Truck, RotateCcw, Star, Sparkles,
  Flame, ShoppingCart, ShieldCheck, CreditCard, Clock, Zap, Cable, Smartphone, Headphones,
  Music, Watch, BatteryCharging, Monitor, Gamepad2, Send, ChevronRight
} from 'lucide-react';
import { products, categories, type Product } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { useToast } from '@/context/ToastContext';

// ── Category icon helper ──
function CategoryIcon({ name, size = 26 }: { name: string; size?: number }) {
  const color = '#1b75bc';
  switch (name) {
    case 'Chargeurs Rapides':   return <Zap size={size} color={color} />;
    case 'Câbles Premium':      return <Cable size={size} color={color} />;
    case 'Supports Téléphone':  return <Smartphone size={size} color={color} />;
    case 'Écouteurs Bluetooth': return <Headphones size={size} color={color} />;
    case 'Casques Audio':       return <Music size={size} color={color} />;
    case 'Montres Connectées':  return <Watch size={size} color={color} />;
    case 'Batteries Externes':  return <BatteryCharging size={size} color={color} />;
    case 'Accessoires PC':      return <Monitor size={size} color={color} />;
    case 'Gaming':              return <Gamepad2 size={size} color={color} />;
    default:                    return <Zap size={size} color={color} />;
  }
}

const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export default function HomePage() {
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [productData, setProductData] = useState<Product[]>(products);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        if (data && data.length > 0) setProductData(data as any);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  const bestSellers  = productData.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts  = productData.filter(p => p.isNew).slice(0, 4);
  const promoProducts = productData.filter(p => p.isPromo).slice(0, 3);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      showToast('🎉 Inscription réussie ! Merci pour votre confiance.', 'success');
      setNewsletterEmail('');
    } else {
      showToast('Veuillez entrer une adresse e-mail valide.', 'error');
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — 65vh, catégories intégrées en bas
      ═══════════════════════════════════════════════ */}
      <section style={{
        minHeight: '65vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 70% 50%, rgba(27,117,188,0.06) 0%, transparent 60%), var(--color-background)',
        paddingBottom: '0',
      }}>
        {/* Fond décoratif */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${180 + i * 90}px`, height: `${180 + i * 90}px`,
              borderRadius: '50%',
              border: '1px solid rgba(27,117,188,0.07)',
              top: `${15 + i * 12}%`, right: `${3 + i * 4}%`,
              animation: `spin-slow ${20 + i * 5}s linear infinite`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }} />
          ))}
          <div style={{
            position: 'absolute', top: '15%', right: '12%',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(27,117,188,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Contenu hero */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="hero-grid">
            {/* Texte */}
            <div style={{ animation: 'slide-up 0.5s ease-out' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(27,117,188,0.10)', border: '1px solid rgba(27,117,188,0.22)',
                borderRadius: '100px', padding: '5px 14px', marginBottom: '20px',
                fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600,
              }}>
                <Sparkles size={13} /> Bienvenue sur SenTech Plus
              </div>

              <h1 className="section-title" style={{ fontSize: 'clamp(1.7rem, 4vw, 3.2rem)', marginBottom: '8px' }}>
                Votre Nouvelle Boutique
              </h1>
              <h2 style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)', fontWeight: 700,
                color: '#1b75bc', marginBottom: '18px', fontFamily: 'Outfit, sans-serif',
              }}>
                En cours de configuration
              </h2>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '32px', maxWidth: '480px' }}>
                Découvrez bientôt notre catalogue complet. Ajoutez vos produits depuis votre tableau de bord.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/boutique" style={{ textDecoration: 'none' }}>
                  <button id="hero-shop-btn" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                    <ShoppingCart size={17} /> Acheter maintenant
                  </button>
                </Link>
                <Link href="/promotions" style={{ textDecoration: 'none' }}>
                  <button id="hero-promo-btn" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Flame size={15} color="#ef4444" /> Promotions
                  </button>
                </Link>
              </div>

              {/* Stats compactes — uniquement le nombre réel de produits */}
              {productData.length > 0 && (
                <div style={{ display: 'flex', gap: '28px', marginTop: '32px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                      {productData.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>Produits</div>
                  </div>
                </div>
              )}
            </div>

            {/* Image héro */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-image-wrap">
              <div style={{
                position: 'relative', width: '380px', height: '380px',
                borderRadius: '28px', overflow: 'hidden',
                border: '1px solid var(--color-sentech-border)',
                boxShadow: '0 40px 80px rgba(15,23,42,0.08), 0 0 40px rgba(27,117,188,0.1)',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <Image
                  src="/charger.jpg" alt="SenTech Plus — Accessoires tech" fill
                  sizes="380px" style={{ objectFit: 'cover' }} priority
                />
                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white', borderRadius: '10px', padding: '6px 12px',
                  fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                }}>
                  SENTECH
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Catégories intégrées dans le Hero ── */}
        <div style={{
          borderTop: '1px solid var(--color-sentech-border)',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)',
          marginTop: '40px',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{
              display: 'flex', gap: '4px', overflowX: 'auto',
              padding: '14px 0',
              scrollbarWidth: 'none',
            }} className="categories-strip">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/boutique?cat=${encodeURIComponent(cat.name)}`}
                  style={{ textDecoration: 'none', flexShrink: 0 }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 14px', borderRadius: '100px',
                    border: '1px solid rgba(27,117,188,0.12)',
                    background: 'rgba(27,117,188,0.04)',
                    color: '#475569', fontSize: '0.82rem', fontWeight: 500,
                    whiteSpace: 'nowrap', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(27,117,188,0.10)';
                      e.currentTarget.style.color = '#1b75bc';
                      e.currentTarget.style.borderColor = 'rgba(27,117,188,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(27,117,188,0.04)';
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.borderColor = 'rgba(27,117,188,0.12)';
                    }}
                  >
                    <CategoryIcon name={cat.name} size={14} />
                    {cat.name}
                  </div>
                </Link>
              ))}
              <Link href="/boutique" style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '100px',
                  background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
                  color: 'white', fontSize: '0.82rem', fontWeight: 600,
                  whiteSpace: 'nowrap', cursor: 'pointer',
                }}>
                  Tout voir <ChevronRight size={13} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MEILLEURES VENTES
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px' }}>Top produits</span>
              <h2 className="section-title" style={{ marginTop: '6px', marginBottom: 0 }}>
                Nos <span className="sentech-gradient-text">meilleures ventes</span>
              </h2>
            </div>
            <Link href="/boutique" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" id="view-all-bestsellers" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', fontSize: '0.85rem' }}>
                Voir tout <ArrowRight size={15} />
              </button>
            </Link>
          </div>
          <div className="product-grid">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PROMOTIONS + COUNTDOWN
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Bandeau promo compact */}
          <div className="promo-banner-card" style={{ marginBottom: '36px' }}>
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '320px', height: '320px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(27,117,188,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div className="promo-banner-grid" style={{ position: 'relative', zIndex: 1 }}>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: '100px', padding: '4px 12px',
                  fontSize: '0.75rem', color: '#f87171', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
                  marginBottom: '16px',
                }}>
                  <Flame size={13} color="#ef4444" /> Offre Flash
                </span>
                <h2 className="section-title" style={{ marginBottom: '10px', fontSize: 'clamp(1.6rem, 3vw, 2.6rem)' }}>
                  Jusqu&apos;à <span style={{ color: '#ef4444' }}>-40%</span>{' '}
                  <span className="sentech-gradient-text">sélection produits</span>
                </h2>
                <p style={{ color: '#475569', marginBottom: '24px', fontSize: '0.95rem' }}>
                  Offres limitées — profitez avant la fin du compte à rebours !
                </p>
                <Link href="/promotions" style={{ textDecoration: 'none' }}>
                  <button id="promo-cta-btn" className="btn-primary" style={{ padding: '12px 24px' }}>
                    Voir toutes les promos <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
              <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
                <CountdownTimer targetDate={promoEndDate} label="Offre se termine dans" />
              </div>
            </div>
          </div>

          {/* Produits en promo */}
          <div className="product-grid">
            {promoProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NOUVEAUTÉS
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-sentech-dark)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} color="#1b75bc" /> Dernières arrivées
              </span>
              <h2 className="section-title" style={{ marginTop: '6px', marginBottom: 0 }}>
                Les <span className="sentech-gradient-text">nouveautés</span>
              </h2>
            </div>
            <Link href="/nouveautes" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" id="view-all-new" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', fontSize: '0.85rem' }}>
                Voir tout <ArrowRight size={15} />
              </button>
            </Link>
          </div>
          <div className="product-grid">
            {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          GARANTIES + NEWSLETTER (section fusionnée)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{
        background: 'linear-gradient(135deg, rgba(27,117,188,0.03) 0%, transparent 60%)',
        borderTop: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'start' }}>

            {/* Garanties compactes */}
            <div>
              <span style={{ fontSize: '0.75rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px' }}>Nos engagements</span>
              <h2 className="section-title" style={{ marginTop: '6px', marginBottom: '24px' }}>
                Pourquoi <span className="sentech-gradient-text">nous choisir</span> ?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { icon: <ShieldCheck size={20} color="#1b75bc" />, title: 'Produits certifiés', desc: 'Authentiques et testés rigoureusement.' },
                  { icon: <Truck size={20} color="#1b75bc" />, title: 'Livraison rapide', desc: 'Expédition 24h, livraison 2-5 jours.' },
                  { icon: <CreditCard size={20} color="#1b75bc" />, title: 'Paiement sécurisé', desc: 'Carte, Orange Money, MTN Money, PayPal.' },
                  { icon: <Shield size={20} color="#1b75bc" />, title: 'Garantie 1-2 ans', desc: 'SAV réactif et professionnel.' },
                  { icon: <Clock size={20} color="#1b75bc" />, title: 'Support 7j/7', desc: 'Équipe disponible avant et après achat.' },
                  { icon: <RotateCcw size={20} color="#1b75bc" />, title: 'Retours simples', desc: '14 jours — remboursement rapide.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                      background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.14)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '20px', padding: '36px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
              }}>
                <Send size={22} color="#1b75bc" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
                Club <span className="sentech-gradient-text">SenTech Plus</span>
              </h3>
              <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Recevez nos promotions exclusives, nouveautés et conseils tech directement dans votre boîte mail.
              </p>
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="home-newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                  Votre e-mail
                </label>
                <input
                  id="home-newsletter-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="sentech-input"
                  style={{ padding: '13px 18px', fontSize: '0.9rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '13px 24px', fontSize: '0.9rem', justifyContent: 'center' }}>
                  S&apos;abonner gratuitement
                </button>
              </form>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '10px' }}>
                Aucun spam. Désabonnement possible à tout moment.
              </p>

              {/* Crédibilité — affiché uniquement quand des avis réels existent via Supabase */}
              {false && (
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-sentech-border)' }}>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', lineHeight: '1.5' }}>
                    &ldquo;Aucun avis pour l’instant. Soyez le premier à partager votre expérience&nbsp;!&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .categories-strip::-webkit-scrollbar { display: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
