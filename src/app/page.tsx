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
        if (data && data.length > 0) setProductData(data as any);
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
          SECTION 1 : HERO (Aération 100px)
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(27,117,188,0.06) 0%, rgba(248,250,252,0.95) 45%, rgba(27,117,188,0.08) 100%)',
        padding: '70px 0 100px 0',
      }}>
        {/* Soft Background Orbs & Glass Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-15%', right: '10%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(27,117,188,0.12) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'pulse-glow 6s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '5%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          
          {/* LOGO Header Area in Hero */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: '32px',
            animation: 'fade-in 0.6s ease-out',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(27,117,188,0.18)',
              borderRadius: '100px',
              padding: '8px 24px',
              boxShadow: '0 8px 24px rgba(27,117,188,0.08)',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ position: 'relative', width: '130px', height: '32px' }}>
                <Image
                  src="/logo_horizontal_v2.png"
                  alt="SenTech Plus Logo"
                  fill
                  sizes="130px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1b75bc', letterSpacing: '1px', textTransform: 'uppercase' }}>
                OFFICIEL SÉNÉGAL
              </span>
            </div>
          </div>

          <div className="hero-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'center',
          }}>
            
            {/* Content Left */}
            <div style={{ animation: 'slide-up 0.6s ease-out' }}>
              
              {/* Proof Rating Badge (★★★★★ +2500 clients satisfaits) */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#ffffff',
                border: '1px solid var(--color-sentech-border)',
                borderRadius: '100px',
                padding: '6px 16px',
                boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', gap: '2px' }} role="img" aria-label="5 étoiles sur 5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={15} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                  <AnimatedCounter end={2500} prefix="+" suffix=" clients satisfaits au Sénégal" />
                </span>
              </div>

              {/* Titre Impactant (56px) */}
              <h1 className="hero-title" style={{
                fontSize: 'clamp(34px, 5.5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.12,
                marginBottom: '20px',
                color: 'var(--color-foreground)',
                letterSpacing: '-0.5px',
              }}>
                Les meilleurs accessoires <span className="sentech-gradient-text">High-Tech</span> <br />
                au meilleur prix au Sénégal.
              </h1>

              <p className="text-body" style={{
                color: '#475569',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '520px',
              }}>
                Équipements certifiés d&apos;origine, écouteurs sans fil, chargeurs ultra-rapides et power banks avec livraison express 24h.
              </p>

              {/* Action Buttons: [ Acheter ] [ Promotions ] */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Link href="/boutique" style={{ textDecoration: 'none' }}>
                  <button id="hero-shop-btn" className="btn-primary btn-pulse" style={{
                    padding: '16px 36px',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
                    boxShadow: '0 10px 25px rgba(27,117,188,0.35)',
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer',
                  }}>
                    <ShoppingCart size={20} /> Acheter
                  </button>
                </Link>

                <Link href="/promotions" style={{ textDecoration: 'none' }}>
                  <button id="hero-promo-btn" className="btn-secondary" style={{
                    padding: '16px 32px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(27, 117, 188, 0.25)',
                    color: '#0f172a',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer',
                  }}>
                    <Flame size={20} color="#ef4444" /> Promotions
                  </button>
                </Link>
              </div>

              {/* Reassurances List: ✓ Livraison 24h  ✓ Paiement Wave  ✓ Garantie */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
                fontSize: '0.9rem', fontWeight: 700, color: '#0f172a',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span> Livraison 24h
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span> Paiement Wave
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span> Garantie
                </span>
              </div>

            </div>

            {/* Right Visual Showcase: Grande Image Produit (45% à 50% de largeur) */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                height: '500px',
                borderRadius: '32px',
                overflow: 'hidden',
                background: '#ffffff',
                border: '1px solid var(--color-sentech-border)',
                boxShadow: '0 25px 50px rgba(15,23,42,0.08), 0 0 40px rgba(27,117,188,0.12)',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <Image
                  src="/hero.jpg"
                  alt="Setup High Tech moderne - Écouteurs, Smartphone, Power Bank & Chargeur"
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  style={{ objectFit: 'cover' }}
                  priority
                />

                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 60%)',
                }} />

                <div style={{
                  position: 'absolute', top: '20px', left: '20px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '14px', padding: '8px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  animation: 'float 3.5s ease-in-out infinite alternate',
                }}>
                  <Headphones size={18} color="#1b75bc" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Casque Audio HD</span>
                </div>

                <div style={{
                  position: 'absolute', top: '70px', right: '20px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '14px', padding: '8px 14px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  animation: 'float 4.5s ease-in-out infinite alternate-reverse',
                }}>
                  <BatteryCharging size={18} color="#10b981" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Power Bank 20K</span>
                </div>

                <div style={{
                  position: 'absolute', bottom: '24px', left: '20px', right: '20px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(18px)',
                  border: '1px solid rgba(27, 117, 188, 0.4)',
                  borderRadius: '18px', padding: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: 'rgba(27,117,188,0.2)', border: '1px solid rgba(27,117,188,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Smartphone size={20} color="#60a5fa" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        SETUP MODERNE COMPLET
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                        Smartphone & High-Tech
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '100px' }}>
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>4.9/5</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 : CATÉGORIES POPULAIRES (Padding 100px, Margin 40px, Gap 24px)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--color-foreground)' }}>
              Catégories <span className="sentech-gradient-text">populaires</span>
            </h2>
            <Link href="/boutique" style={{ textDecoration: 'none', color: '#1b75bc', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Voir tout <ChevronRight size={16} />
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
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-inter, Inter), sans-serif', marginBottom: '2px' }}>
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

      {/* ═══════════════════════════════════════════════
          SECTION 3 : 🔥 OFFRES FLASH (Décompte & Promotions)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-sentech-border)' }}>
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
          SECTION 4 : ⭐ MEILLEURES VENTES (Filtres Interactifs)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'rgba(248, 250, 252, 0.6)', borderTop: '1px solid var(--color-sentech-border)' }}>
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
      <section className="section-padding" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-sentech-border)' }}>
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
          SECTION : 📸 PRODUITS EN SITUATION & LIFESTYLE
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'rgba(248, 250, 252, 0.7)', borderTop: '1px solid var(--color-sentech-border)' }}>
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
