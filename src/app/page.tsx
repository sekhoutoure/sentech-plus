'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ShieldCheck, Truck, CreditCard, Star, Sparkles,
  Flame, Search, Zap, Cable, Smartphone, Headphones, ShoppingCart,
  Watch, BatteryCharging, Send, ChevronRight, Award, Clock
} from 'lucide-react';
import { products, type Product } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import CountdownTimer from '@/components/ui/CountdownTimer';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useToast } from '@/context/ToastContext';

// ── Top 6 essential categories ──
const TOP_CATEGORIES = [
  { name: 'Chargeurs Rapides',   icon: Zap,             count: '145 produits', emoji: '🔋' },
  { name: 'Écouteurs Bluetooth', icon: Headphones,      count: '98 produits',  emoji: '🎧' },
  { name: 'Batteries Externes',  icon: BatteryCharging, count: '64 produits',  emoji: '⚡' },
  { name: 'Câbles Premium',      icon: Cable,           count: '112 produits', emoji: '🔌' },
  { name: 'Montres Connectées',  icon: Watch,           count: '42 produits',  emoji: '⌚' },
  { name: 'Supports Téléphone',  icon: Smartphone,      count: '53 produits',  emoji: '📱' },
];

const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'promos' | 'new'>('bestsellers');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [productData, setProductData] = useState<Product[]>(products);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        if (data && data.length >= 4) {
          setProductData(data as any);
        } else if (data && data.length > 0) {
          setProductData([...(data as any), ...products.slice(data.length)]);
        }
      } catch (err) {
        console.error('Erreur chargement produits:', err);
      }
    }
    load();
  }, []);

  const bestSellers = productData.filter(p => p.isBestSeller);
  const promoProducts = productData.filter(p => p.isPromo);
  const newProducts = productData.filter(p => p.isNew);

  const currentTabProducts = activeTab === 'bestsellers'
    ? (bestSellers.length ? bestSellers : productData.slice(0, 8))
    : activeTab === 'promos'
    ? (promoProducts.length ? promoProducts : productData.slice(0, 8))
    : (newProducts.length ? newProducts : productData.slice(0, 8));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          SECTION 1 : HERO ULTRA MODERNE (Mobile-First & Desktop Senior UI/UX)
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        paddingTop: '40px',
        paddingBottom: '60px',
      }}>
        {/* Ambient Diffuse Glowing Blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '5%', right: '10%',
            width: '650px', height: '650px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(27,117,188,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '5%', left: '5%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }} />
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '60px',
            alignItems: 'center',
          }} className="hero-main-grid">
            
            {/* ── COLONNE GAUCHE (Éléments 1 à 6) ── */}
            <div style={{ animation: 'slide-up 0.5s ease-out', display: 'flex', flexDirection: 'column' }} className="hero-left-content">
              
              {/* 1. BADGE PREMIUM : 🇸🇳 Boutique officielle */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '999px',
                padding: '6px 16px',
                boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                marginBottom: '14px',
              }}>
                <span style={{ fontSize: '0.85rem' }}>🇸🇳</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                  Boutique officielle au Sénégal
                </span>
              </div>

              {/* 2. SOCIAL PROOF CAPSULE : 👥 ★★★★★ +2500 clients satisfaits */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '999px',
                padding: '6px 16px',
                boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                marginBottom: '20px',
              }}>
                <span style={{ fontSize: '0.82rem' }}>👥</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                  <span style={{ color: '#FBBF24', marginRight: '4px' }}>★★★★★</span>
                  <AnimatedCounter end={2500} prefix="+" suffix=" clients satisfaits" />
                </span>
              </div>

              {/* 3. TITRE : Manrope 800, 44px (Mobile) / 72px (Desktop), Line-height 1.1 */}
              <h1 className="hero-title" style={{
                fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                fontSize: 'clamp(34px, 5vw, 72px)',
                fontWeight: 800,
                lineHeight: 1.08,
                marginBottom: '20px',
                color: '#0F172A',
                letterSpacing: '-0.03em',
              }}>
                Les meilleurs accessoires <br />
                <span style={{ color: '#1B75BC' }}>High-Tech</span> <br />
                au meilleur prix au Sénégal.
              </h1>

              {/* 4. DESCRIPTION : Max 3 lines, Slate 600 */}
              <p className="hero-description" style={{
                fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                color: '#475569',
                fontSize: '1rem',
                fontWeight: 500,
                lineHeight: 1.55,
                marginBottom: '28px',
                maxWidth: '600px',
              }}>
                Découvrez une sélection premium d&apos;accessoires High-Tech certifiés avec livraison express partout au Sénégal.
              </p>

              {/* 5. BOUTONS : Full-width 56px (Mobile) / Auto (Desktop) avec 12px gap */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', marginBottom: '32px' }} className="hero-buttons-container">
                <Link href="/boutique" style={{ textDecoration: 'none', flex: 1, minWidth: '220px' }}>
                  <button id="hero-shop-btn" className="btn-primary btn-pulse mobile-hero-btn" style={{
                    height: '56px',
                    width: '100%',
                    padding: '0 28px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '16px',
                    background: '#1B75BC',
                    boxShadow: '0 10px 25px rgba(27,117,188,0.35)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    cursor: 'pointer', color: '#ffffff', border: 'none',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                  }}>
                    Acheter maintenant <ArrowRight size={18} />
                  </button>
                </Link>

                <Link href="/promotions" style={{ textDecoration: 'none', flex: 1, minWidth: '220px' }}>
                  <button id="hero-promo-btn" className="btn-secondary mobile-hero-btn" style={{
                    height: '56px',
                    width: '100%',
                    padding: '0 24px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                  }}>
                    Découvrir les promos <Flame size={18} color="#EF4444" />
                  </button>
                </Link>
              </div>

              {/* 6. CARTES AVANTAGES : 2 colonnes top, 1 full-width bottom */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                width: '100%',
                maxWidth: '600px',
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                }} className="hover-lift">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(27,117,188,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={18} color="#1B75BC" />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                    🚚 Livraison 24h
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                }} className="hover-lift">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(27,117,188,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={18} color="#1B75BC" />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                    🛡️ Produits certifiés
                  </div>
                </div>

                <div style={{
                  gridColumn: '1 / -1',
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                }} className="hover-lift">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(27,117,188,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Headphones size={18} color="#1B75BC" />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                    🎧 Support client 7j/7 à votre écoute
                  </div>
                </div>
              </div>

            </div>

            {/* ── 7. IMAGE PRODUITS SHOWCASE & FLOATING CARDS ── */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              
              {/* Soft Glowing Blue Halo Ring Behind Products */}
              <div style={{
                position: 'absolute',
                width: '380px', height: '380px',
                borderRadius: '50%',
                border: '2px solid rgba(27,117,188,0.3)',
                boxShadow: '0 0 80px rgba(27,117,188,0.2), inset 0 0 40px rgba(27,117,188,0.12)',
                pointerEvents: 'none',
                animation: 'pulse-glow 5s ease-in-out infinite',
              }} />

              {/* Main Floating Podium Products Showcase Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                height: '420px',
                borderRadius: '28px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
                animation: 'float 4s ease-in-out infinite',
              }}>
                <Image
                  src="/hero_showcase.jpg"
                  alt="Mise en scène produits High-Tech : Casque, Écouteurs, Chargeur GaN, Power Bank et Montre"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* Floating Card 1 (Paiement sécurisé) */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '0px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '16px',
                padding: '10px 14px',
                boxShadow: '0 10px 25px rgba(15,23,42,0.08)',
                zIndex: 4,
                display: 'flex', alignItems: 'center', gap: '8px',
                animation: 'float 3.5s ease-in-out infinite alternate',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={16} color="#22C55E" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Paiement sécurisé</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Orange Money • Wave</div>
                </div>
              </div>

              {/* Floating Card 2 (Livraison Express) */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '0px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '16px',
                padding: '10px 14px',
                boxShadow: '0 10px 25px rgba(15,23,42,0.08)',
                zIndex: 4,
                display: 'flex', alignItems: 'center', gap: '8px',
                animation: 'float 4.5s ease-in-out infinite alternate-reverse',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(27,117,188,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={16} color="#1B75BC" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Livraison Express</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>24h Dakar • 48h Régions</div>
                </div>
              </div>

            </div>

          </div>

          {/* ═══════════════════════════════════════════════
              8. BANDE DES CATÉGORIES (Scroller Horizontal Mobile & Grid Desktop)
          ═══════════════════════════════════════════════ */}
          <div style={{ marginTop: '40px' }}>
            <div className="mobile-category-scroll no-scrollbar" style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              padding: '10px 4px 14px 4px',
            }}>
              {[
                { name: 'Chargeurs', emoji: '⚡', count: '145 prods' },
                { name: 'Écouteurs', emoji: '🎧', count: '320 prods' },
                { name: 'Power Banks', emoji: '🔋', count: '87 prods' },
                { name: 'Montres', emoji: '⌚', count: '64 prods' },
                { name: 'Gaming', emoji: '🎮', count: '78 prods' },
                { name: 'Câbles', emoji: '🔌', count: '96 prods' },
                { name: 'Supports', emoji: '📱', count: '52 prods' },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/boutique?cat=${encodeURIComponent(cat.name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="mobile-category-item hover-lift">
                    <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{cat.emoji}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                      {cat.name}
                    </div>
                  </div>
                </Link>
              ))}

              <Link href="/boutique" style={{ textDecoration: 'none' }}>
                <div className="mobile-category-item hover-lift" style={{ border: '1px solid #1B75BC', background: 'rgba(27,117,188,0.04)' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '4px', color: '#1B75BC' }}>→</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1B75BC', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                    Voir tout
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 : CATÉGORIES POPULAIRES
      ═══════════════════════════════════════════════ */}
      <ScrollReveal animation="fade-up">
        <section className="section-padding" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fafcff 100%)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
              <h2 className="section-title" style={{ color: 'var(--color-foreground)', marginBottom: 0 }}>
                Catégories <span className="sentech-gradient-text">populaires</span>
              </h2>
              <Link href="/boutique" style={{ textDecoration: 'none', color: '#1b75bc', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Voir tout <ChevronRight size={18} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '24px',
            }}>
              {TOP_CATEGORIES.map((cat) => {
                return (
                  <Link
                    key={cat.name}
                    href={`/boutique?cat=${encodeURIComponent(cat.name)}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--color-sentech-border)',
                        borderRadius: '20px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '140px',
                        cursor: 'pointer',
                        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = '#1b75bc';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.08)';
                        const iconEl = e.currentTarget.querySelector('.cat-emoji');
                        if (iconEl) (iconEl as HTMLElement).style.transform = 'scale(1.15)';
                        const arrowEl = e.currentTarget.querySelector('.cat-arrow');
                        if (arrowEl) (arrowEl as HTMLElement).style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'var(--color-sentech-border)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.03)';
                        const iconEl = e.currentTarget.querySelector('.cat-emoji');
                        if (iconEl) (iconEl as HTMLElement).style.transform = 'scale(1)';
                        const arrowEl = e.currentTarget.querySelector('.cat-arrow');
                        if (arrowEl) (arrowEl as HTMLElement).style.transform = 'translateX(0)';
                      }}
                    >
                      {/* Top: Icon (Emoji) */}
                      <div
                        className="cat-emoji"
                        style={{
                          fontSize: '2.2rem',
                          marginBottom: '16px',
                          transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                          width: 'fit-content',
                        }}
                      >
                        {cat.emoji}
                      </div>

                      {/* Bottom: Title + Count (Left), Arrow (Right) */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-plus-jakarta, Plus Jakarta Sans), sans-serif', marginBottom: '2px' }}>
                            {cat.name}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                            {cat.count}
                          </div>
                        </div>

                        <div
                          className="cat-arrow"
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'rgba(27,117,188,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#1b75bc', fontWeight: 800, fontSize: '1.1rem',
                            transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                            flexShrink: 0,
                          }}
                        >
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ═══════════════════════════════════════════════
          SECTION 3 : 🔥 OFFRES FLASH
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #fafcff 0%, #f3f8ff 100%)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>🔥</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-inter, Inter), sans-serif', color: 'var(--color-foreground)' }}>
                  Offres <span className="sentech-gradient-text">Flash</span>
                </h2>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
                Promotions à durée limitée — jusqu&apos;à -40% sur une sélection d&apos;équipements certifiés.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <CountdownTimer targetDate={promoEndDate} label="Fin dans :" />
              <Link href="/promotions" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Voir tout <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </div>

          <div className="product-grid">
            {(promoProducts.length ? promoProducts : productData.slice(0, 4)).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 : ⭐ MEILLEURES VENTES
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fafcff 100%)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>⭐</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-inter, Inter), sans-serif', color: 'var(--color-foreground)' }}>
                  Meilleures <span className="sentech-gradient-text">Ventes</span>
                </h2>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
                Les accessoires les plus populaires et les mieux notés par les clients au Sénégal.
              </p>
            </div>

            {/* Quick Filter Pills */}
            <div style={{
              display: 'flex', gap: '8px', background: '#ffffff',
              padding: '6px', borderRadius: '16px', border: '1px solid var(--color-sentech-border)',
              boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
            }}>
              <button
                onClick={() => setActiveTab('bestsellers')}
                style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === 'bestsellers' ? '#1b75bc' : 'transparent',
                  color: activeTab === 'bestsellers' ? '#ffffff' : '#64748b',
                }}
              >
                🔥 Tout
              </button>
              <button
                onClick={() => setActiveTab('promos')}
                style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === 'promos' ? '#1b75bc' : 'transparent',
                  color: activeTab === 'promos' ? '#ffffff' : '#64748b',
                }}
              >
                🎧 Audio HD
              </button>
              <button
                onClick={() => setActiveTab('new')}
                style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === 'new' ? '#1b75bc' : 'transparent',
                  color: activeTab === 'new' ? '#ffffff' : '#64748b',
                }}
              >
                🔌 Chargeurs
              </button>
            </div>
          </div>

          <div className="product-grid">
            {(bestSellers.length ? bestSellers : productData.slice(0, 4)).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 : 🆕 NOUVEAUTÉS HIGH-TECH
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #fafcff 0%, #f3f8ff 100%)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>🆕</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-inter, Inter), sans-serif', color: 'var(--color-foreground)' }}>
                  Nouveautés <span className="sentech-gradient-text">High-Tech</span>
                </h2>
              </div>
              <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0 }}>
                Les tout derniers modèles certifiés récemment ajoutés à notre catalogue.
              </p>
            </div>

            <Link href="/nouveautes" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.88rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Découvrir <ChevronRight size={16} />
              </button>
            </Link>
          </div>

          <div className="product-grid">
            {(newProducts.length ? newProducts : productData.slice(4, 8)).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/boutique" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '0.95rem', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Voir toute la Boutique <ArrowRight size={17} />
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 : 📸 PRODUITS EN SITUATION & LIFESTYLE
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fafcff 100%)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)', padding: '6px 16px', borderRadius: '100px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#1b75bc" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                LIFESTYLE & USAGE AU QUOTIDIEN
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-inter, Inter), sans-serif', color: 'var(--color-foreground)' }}>
              Vos accessoires <span className="sentech-gradient-text">en situation réelle</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', maxWidth: '600px', margin: '8px auto 0' }}>
              Découvrez comment nos équipements s&apos;intègrent parfaitement dans votre quotidien au bureau, en voyage et lors de vos déplacements à Dakar.
            </p>
          </div>

          {/* 2 Big Lifestyle Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '48px',
          }}>
            {/* Card 1: Bureau & Audio Setup */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              height: '340px',
              border: '1px solid var(--color-sentech-border)',
              boxShadow: '0 12px 28px rgba(15,23,42,0.06)',
            }}>
              <Image
                src="/lifestyle_audio_setup.jpg"
                alt="Setup Audio & Bureau High-Tech avec Écouteurs sans fil"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)',
                padding: '24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                color: '#ffffff',
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  🎧 WORK & AUDIO HD
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 6px' }}>
                  Productivité & Immersion Sonore
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                  Casques & écouteurs sans fil à réduction de bruit pour travailler en toute sérénité.
                </p>
              </div>
            </div>

            {/* Card 2: Charge Rapide & Voyage */}
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              height: '340px',
              border: '1px solid var(--color-sentech-border)',
              boxShadow: '0 12px 28px rgba(15,23,42,0.06)',
            }}>
              <Image
                src="/lifestyle_charging_travel.jpg"
                alt="Chargeur GaN et Power Bank en situation de voyage"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)',
                padding: '24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                color: '#ffffff',
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ⚡ NOMADE & ULTRA-RAPIDE
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 6px' }}>
                  Energie Haute Capacité partout avec vous
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                  Chargeurs rapides GaN et Power Banks 20 000 mAh certifiés pour ne jamais tomber en panne.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 : POURQUOI CHOISIR SENTECH PLUS ? (Padding 100px, Margin 40px, Gap 24px)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, rgba(27,117,188,0.03) 0%, transparent 60%)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--color-foreground)' }}>
              Pourquoi choisir <span className="sentech-gradient-text">SenTech Plus</span> ?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '6px' }}>
              Achetez vos équipements tech en toute sécurité avec un service de proximité.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {[
              { icon: <ShieldCheck size={26} color="#1b75bc" />, title: 'Produits 100% Certifiés', desc: 'Composants officiels & testés pour votre sécurité.' },
              { icon: <Truck size={26} color="#1b75bc" />, title: 'Livraison Express 24h', desc: 'Expédition rapide partout à Dakar et dans les régions.' },
              { icon: <CreditCard size={26} color="#1b75bc" />, title: 'Paiement à la Livraison', desc: 'Réglez votre commande en Cash, Orange Money ou Wave.' },
              { icon: <Clock size={26} color="#1b75bc" />, title: 'Garantie & Support 7j/7', desc: '1 à 2 ans de garantie constructeur et SAV réactif.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--color-sentech-card)',
                border: '1px solid var(--color-sentech-border)',
                borderRadius: '20px',
                padding: '32px 24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'rgba(27,117,188,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.55' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 6 : NEWSLETTER (Padding 100px)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '28px',
            padding: '48px 36px',
            color: '#ffffff',
            textAlign: 'center',
          }}>
            <div style={{ maxWidth: '580px', margin: '0 auto' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(27,117,188,0.2)', border: '1px solid rgba(27,117,188,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}>
                <Send size={22} color="#60a5fa" />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
                Rejoignez le Club <span style={{ color: '#60a5fa' }}>SenTech Plus</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '28px', lineHeight: '1.6' }}>
                Recevez nos ventes privées, codes réductions et conseils tech directement par e-mail.
              </p>

              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  id="home-newsletter-email"
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: '1', minWidth: '250px', maxWidth: '380px',
                    padding: '14px 20px', fontSize: '0.92rem',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn-primary" style={{
                  padding: '14px 28px', fontSize: '0.92rem', fontWeight: 700, borderRadius: '14px',
                  background: 'linear-gradient(135deg, #1b75bc, #2563eb)'
                }}>
                  S&apos;abonner
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER (Rendu automatiquement par SiteChrome)
      ═══════════════════════════════════════════════ */}
    </>
  );
}
