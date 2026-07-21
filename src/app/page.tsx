'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Shield, Truck, RotateCcw, Star, Sparkles,
  Flame, ShoppingCart, ShieldCheck, CreditCard, Clock, Zap, Cable, Smartphone, Headphones,
  Music, Watch, BatteryCharging, Monitor, Gamepad2, Send
} from 'lucide-react';
import { products, categories, type Product } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { useToast } from '@/context/ToastContext';

const heroSlides = [
  {
    tag: '✨ Bienvenue',
    title: 'Votre Nouvelle Boutique',
    subtitle: 'En cours de configuration',
    desc: 'Découvrez bientôt notre catalogue complet. Ajoutez vos produits depuis votre tableau de bord.',
    img: '/charger.jpg',
    cta: '/boutique',
    color: '#1b75bc',
    badge: 'SENTECH',
  },
];

const reviews: any[] = [];

// Helper to render category icon using SVG instead of emoji
function CategoryIcon({ name, size = 28 }: { name: string; size?: number }) {
  const color = '#1b75bc';
  switch (name) {
    case 'Chargeurs Rapides':
      return <Zap size={size} color={color} />;
    case 'Câbles Premium':
      return <Cable size={size} color={color} />;
    case 'Supports Téléphone':
      return <Smartphone size={size} color={color} />;
    case 'Écouteurs Bluetooth':
      return <Headphones size={size} color={color} />;
    case 'Casques Audio':
      return <Music size={size} color={color} />;
    case 'Montres Connectées':
      return <Watch size={size} color={color} />;
    case 'Batteries Externes':
      return <BatteryCharging size={size} color={color} />;
    case 'Accessoires PC':
      return <Monitor size={size} color={color} />;
    case 'Gaming':
      return <Gamepad2 size={size} color={color} />;
    default:
      return <Zap size={size} color={color} />;
  }
}

// Promo end date: 3 days from now
const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

// Helper to render slide badge icon + text responsively (no emojis)
function renderHeroBadge(tag: string) {
  if (tag.includes('Meilleure vente')) {
    return (
      <>
        <Flame size={14} color="#ef4444" />
        <span>Meilleure vente</span>
      </>
    );
  }
  if (tag.includes('Premium')) {
    return (
      <>
        <Star size={14} color="#f59e0b" fill="#f59e0b" />
        <span>Premium</span>
      </>
    );
  }
  if (tag.includes('Nouveauté')) {
    return (
      <>
        <Sparkles size={14} color="#a855f7" />
        <span>Nouveauté</span>
      </>
    );
  }
  return <span>{tag}</span>;
}

export default function HomePage() {
  const [heroSlide, setHeroSlide] = useState(0);
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [productData, setProductData] = useState<Product[]>(products);

  // Sync with Supabase
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        if (data && data.length > 0) {
          setProductData(data as any);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const bestSellers = productData.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts = productData.filter(p => p.isNew).slice(0, 4);
  const promoProducts = productData.filter(p => p.isPromo).slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);



  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      showToast('🎉 Inscription réussie ! Merci pour votre confiance.', 'success');
      setNewsletterEmail('');
    } else {
      showToast('Veuillez entrer une adresse e-mail valide.', 'error');
    }
  };

  const slide = heroSlides[heroSlide];

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section-mobile" style={{
        minHeight: '88vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 70% 50%, rgba(27,117,188,0.06) 0%, transparent 60%), var(--color-background)',
      }}>
        {/* Animated background particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              borderRadius: '50%',
              border: '1px solid rgba(27,117,188,0.08)',
              top: `${20 + i * 10}%`,
              right: `${5 + i * 3}%`,
              animation: `spin-slow ${20 + i * 5}s linear infinite`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
            }} />
          ))}
          <div style={{
            position: 'absolute', top: '20%', right: '15%',
            width: '600px', height: '600px',
            background: `radial-gradient(circle, ${slide.color}15 0%, transparent 70%)`,
            transition: 'background 1s ease',
            pointerEvents: 'none',
          }} />
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div className="hero-grid">
            {/* Text */}
            <div style={{ animation: 'slide-up 0.6s ease-out' }}>
              <div className="hero-badge-pill" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(27,117,188,0.1)', border: '1px solid rgba(27,117,188,0.25)',
                borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
                fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600,
              }}>
                {renderHeroBadge(slide.tag)}
              </div>
              <h1 className="section-title" style={{
                fontSize: 'clamp(1.7rem, 4vw, 3.5rem)',
                marginBottom: '8px',
                color: 'var(--color-foreground)',
              }}>
                {slide.title}
              </h1>
              <h2 style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 700,
                color: slide.color, marginBottom: '20px', fontFamily: 'Outfit, sans-serif',
              }}>
                {slide.subtitle}
              </h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '40px', maxWidth: '500px' }}>
                {slide.desc}
              </p>
              <div className="hero-ctas" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/boutique" style={{ textDecoration: 'none' }}>
                  <button id="hero-shop-btn" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
                    <ShoppingCart size={18} /> Acheter maintenant
                  </button>
                </Link>
                <Link href="/nouveautes" style={{ textDecoration: 'none' }}>
                  <button id="hero-new-btn" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#1b75bc" /> Voir les nouveautés
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats-flex">
                {[['10K+', 'Clients satisfaits'], [`${productData.length}+`, 'Produits disponibles'], ['4.9★', 'Note moyenne']].map(([val, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>{val}</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-image-wrap">
              <div style={{
                position: 'relative', width: '440px', height: '440px',
                borderRadius: '32px', overflow: 'hidden',
                border: '1px solid var(--color-sentech-border)',
                boxShadow: `0 40px 80px rgba(15, 23, 42, 0.08), 0 0 40px ${slide.color}15`,
                transition: 'box-shadow 1s ease',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  sizes="440px"
                  style={{ objectFit: 'cover', transition: 'opacity 0.5s ease' }}
                  priority
                />
                {/* Discount badge on image */}
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white', borderRadius: '12px', padding: '8px 14px',
                  fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif',
                  boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
                }}>
                  {slide.badge}
                </div>
              </div>

              {/* Slide dots */}
              <div style={{
                position: 'absolute', bottom: '-32px', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: '8px',
              }}>
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlide(i)}
                    aria-label={`Aller au slide ${i + 1}`}
                    aria-current={i === heroSlide ? 'true' : undefined}
                    style={{
                      width: i === heroSlide ? '24px' : '8px',
                      height: '8px', borderRadius: '4px',
                      background: i === heroSlide ? '#1b75bc' : 'rgba(255,255,255,0.2)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>
              Explorer
            </span>
            <h2 className="section-title" style={{ marginTop: '8px', marginBottom: '12px' }}>
              Catégories <span className="sentech-gradient-text">populaires</span>
            </h2>
            <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto' }}>
              Trouvez l&apos;accessoire parfait pour votre style de vie tech
            </p>
          </div>
          <div className="category-grid">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/boutique?cat=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                <div
                  className="sentech-card"
                  style={{
                    textAlign: 'center', padding: '24px 16px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
                  }}
                >
                  <div className="category-icon-wrap">
                    <CategoryIcon name={cat.name} size={24} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-foreground)', lineHeight: '1.3' }}>
                    {cat.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS ===== */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>Top produits</span>
              <h2 className="section-title" style={{ marginTop: '8px' }}>
                Nos <span className="sentech-gradient-text">meilleures ventes</span>
              </h2>
            </div>
            <Link href="/boutique" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" id="view-all-bestsellers" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Voir tout <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          <div className="product-grid">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ===== WHY SENTECH ===== */}
      <section className="section-padding" style={{
        background: 'linear-gradient(135deg, rgba(27,117,188,0.03) 0%, transparent 50%, rgba(161,177,194,0.03) 100%)',
        borderTop: '1px solid var(--color-sentech-border)',
        borderBottom: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>Nos engagements</span>
            <h2 className="section-title" style={{ marginTop: '8px' }}>
              Pourquoi choisir <span className="sentech-gradient-text">SenTech Plus</span> ?
            </h2>
          </div>
          <div className="why-grid">
            {[
              { icon: <ShieldCheck size={26} color="#1b75bc" />, title: 'Produits certifiés', desc: 'Tous nos produits sont authentiques et certifiés, testés rigoureusement avant mise en vente.' },
              { icon: <Truck size={26} color="#1b75bc" />, title: 'Livraison rapide', desc: 'Expédition en 24h, livraison en 2 à 5 jours ouvrés partout en Afrique de l\'Ouest.' },
              { icon: <CreditCard size={26} color="#1b75bc" />, title: 'Paiement 100% sécurisé', desc: 'Transactions sécurisées SSL. Paiement par carte, Orange Money, MTN Money, PayPal.' },
              { icon: <Shield size={26} color="#1b75bc" />, title: 'Garantie sur tous les produits', desc: 'De 1 à 2 ans de garantie selon les produits. SAV réactif et professionnel.' },
              { icon: <Clock size={26} color="#1b75bc" />, title: 'Support client 7j/7', desc: 'Notre équipe est disponible 7 jours sur 7 pour vous accompagner avant et après votre achat.' },
              { icon: <RotateCcw size={26} color="#1b75bc" />, title: 'Retours simples', desc: 'Politique de retour simple sous 14 jours. Remboursement rapide sans questions.' },
            ].map((item) => (
              <div key={item.title} className="sentech-card" style={{ padding: '28px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMOTIONS SECTION ===== */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Promo banner */}
          <div className="promo-banner-card">
            <div style={{
              position: 'absolute', top: '-50px', right: '-50px',
              width: '400px', height: '400px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(27,117,188,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-80px', left: '20%',
              width: '300px', height: '300px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div className="promo-banner-grid" style={{ position: 'relative', zIndex: 1 }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.2))',
                  border: '1px solid rgba(239,68,68,0.4)', borderRadius: '100px',
                  padding: '4px 14px', fontSize: '0.8rem', color: '#f87171',
                  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
                  marginBottom: '20px',
                }}>
                  <Flame size={14} color="#ef4444" style={{ flexShrink: 0 }} /> Offre Flash
                </span>
                <h2 className="section-title" style={{ marginBottom: '12px', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
                  Jusqu&apos;à <span style={{ color: '#ef4444' }}>-40%</span> sur une{' '}
                  <span className="sentech-gradient-text">sélection de produits</span>
                </h2>
                <p style={{ color: '#475569', marginBottom: '32px', fontSize: '1rem' }}>
                  Offres limitées ! Profitez de nos meilleures réductions avant la fin du compte à rebours.
                </p>
                <Link href="/promotions" style={{ textDecoration: 'none' }}>
                  <button id="promo-cta-btn" className="btn-primary" style={{ padding: '14px 28px' }}>
                    Voir toutes les promos <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
              <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
                <CountdownTimer targetDate={promoEndDate} label="Offre se termine dans" />
              </div>
            </div>
          </div>

          {/* Promo products */}
          <div className="product-grid">
            {promoProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="section-padding" style={{ background: 'var(--color-sentech-dark)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#1b75bc" /> Dernières arrivées
              </span>
              <h2 className="section-title" style={{ marginTop: '8px' }}>
                Les <span className="sentech-gradient-text">nouveautés</span>
              </h2>
            </div>
            <Link href="/nouveautes" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" id="view-all-new" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                Voir tout <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          <div className="product-grid">
            {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="section-padding" style={{
        background: 'linear-gradient(135deg, rgba(27,117,188,0.02) 0%, transparent 100%)',
        borderTop: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span style={{ fontSize: '0.8rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px' }}>Témoignages</span>
            <h2 className="section-title" style={{ marginTop: '8px' }}>
              Ce que disent nos <span className="sentech-gradient-text">clients</span>
          </div>
          <div className="reviews-grid">
            {reviews.length === 0 ? (
              <p style={{ color: '#475569', textAlign: 'center', gridColumn: '1 / -1' }}>Aucun témoignage pour le moment.</p>
            ) : (
              reviews.map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: '28px', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: '20px', right: '20px',
                  fontSize: '3rem', color: 'rgba(27,117,188,0.1)', fontFamily: 'serif', lineHeight: 1,
                }}>
                  &ldquo;
                </div>
                <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '12px' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--color-foreground)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1b75bc, #a1b1c2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: 'white',
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-foreground)', fontSize: '0.9rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>{r.city} · {r.product}</div>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="section-padding" style={{ background: 'var(--color-sentech-dark)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Send size={24} color="#1b75bc" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
            Rejoignez le club <span className="sentech-gradient-text">SenTech Plus</span>
          </h2>
          <p style={{ color: '#475569', marginBottom: '32px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Abonnez-vous à notre newsletter pour recevoir nos promotions exclusives, nouveautés et conseils d&apos;experts high-tech directement par e-mail.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <label htmlFor="home-newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                Votre e-mail pour la newsletter
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                placeholder="votre@email.com"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                className="sentech-input"
                style={{ padding: '14px 20px', fontSize: '0.95rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
              S&apos;abonner
            </button>
          </form>
          <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '12px' }}>
            Aucun spam. Désabonnement possible à tout moment.
          </p>
        </div>
      </section>
    </>
  );
}
