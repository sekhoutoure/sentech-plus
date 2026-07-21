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
import { useToast } from '@/context/ToastContext';

// ── Top 6 essential categories ──
const TOP_CATEGORIES = [
  { name: 'Chargeurs Rapides',   icon: Zap,             desc: 'GaN & Power Delivery' },
  { name: 'Écouteurs Bluetooth', icon: Headphones,      desc: 'Audio HD & Sans Fil' },
  { name: 'Batteries Externes',  icon: BatteryCharging, desc: 'Power Banks 10K-30K' },
  { name: 'Câbles Premium',      icon: Cable,           desc: 'Type-C & Lightning' },
  { name: 'Montres Connectées',  icon: Watch,           desc: 'Smartwatches & Sport' },
  { name: 'Supports Téléphone',  icon: Smartphone,      desc: 'Voiture & Bureau' },
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

          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            {/* Content Left */}
            <div style={{ animation: 'slide-up 0.6s ease-out' }}>
              
              <h1 className="hero-title" style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '24px',
                color: 'var(--color-foreground)',
                letterSpacing: '-0.5px',
              }}>
                Les meilleurs accessoires <span className="sentech-gradient-text">High-Tech</span> <br />
                au meilleur prix au Sénégal.
              </h1>

              <p className="text-body" style={{
                color: '#475569',
                fontSize: '16px',
                lineHeight: 1.65,
                marginBottom: '40px',
                maxWidth: '540px',
              }}>
                Chargeurs ultra-rapides, écouteurs sans fil HD, batteries externes haute capacité et équipements certifiés avec <strong>livraison express sous 24h</strong>.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <Link href="/boutique" style={{ textDecoration: 'none' }}>
                  <button id="hero-shop-btn" className="btn-primary" style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
                    boxShadow: '0 10px 25px rgba(27,117,188,0.35)',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(27,117,188,0.45)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(27,117,188,0.35)';
                  }}>
                    <ShoppingCart size={19} /> Acheter maintenant <ArrowRight size={17} />
                  </button>
                </Link>

                <Link href="/promotions" style={{ textDecoration: 'none' }}>
                  <button id="hero-promo-btn" style={{
                    padding: '16px 28px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(27, 117, 188, 0.25)',
                    color: '#0f172a',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.borderColor = '#1b75bc';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(27, 117, 188, 0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.75)';
                    e.currentTarget.style.borderColor = 'rgba(27, 117, 188, 0.25)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.05)';
                  }}>
                    <Flame size={18} color="#ef4444" /> Découvrir les promos
                  </button>
                </Link>
              </div>

              {/* Instant Search Bar (<10s) */}
              <form onSubmit={handleSearch} style={{
                display: 'flex', gap: '8px',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(27,117,188,0.2)',
                borderRadius: '16px',
                padding: '8px 10px',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
                maxWidth: '540px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px', color: '#1b75bc' }}>
                  <Search size={19} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un produit... (ex: Ecouteurs, Chargeur 65W)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#0f172a',
                    fontSize: '0.92rem',
                    padding: '8px 4px',
                  }}
                />
                <button type="submit" className="btn-primary" style={{
                  padding: '10px 20px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1b75bc, #2563eb)'
                }}>
                  Chercher
                </button>
              </form>

            </div>

            {/* Right Visual Showcase: Modern Tech Setup */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                height: '440px',
                borderRadius: '32px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 30px 60px rgba(15,23,42,0.12), 0 0 40px rgba(27,117,188,0.12)',
                animation: 'float 4s ease-in-out infinite',
              }}>
                <Image
                  src="/hero.jpg"
                  alt="Setup moderne High Tech - Casque, Smartphone, Power Bank"
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '24px',
          }}>
            {TOP_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/boutique?cat=${encodeURIComponent(cat.name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--color-sentech-card)',
                    border: '1px solid var(--color-sentech-border)',
                    borderRadius: '18px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '14px',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(27,117,188,0.35)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(27,117,188,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--color-sentech-border)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                  }}
                  >
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '14px',
                      background: 'rgba(27,117,188,0.08)',
                      border: '1px solid rgba(27,117,188,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconComp size={24} color="#1b75bc" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                        {cat.desc}
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
          SECTION 3 : PRODUITS VEDETTES (Padding 100px, Margin 40px, Gap 24px)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--color-foreground)' }}>
                Sélection <span className="sentech-gradient-text">Produits</span>
              </h2>
            </div>

            {/* Quick Filter Tabs */}
            <div style={{
              display: 'flex', gap: '8px', background: 'rgba(15,23,42,0.04)',
              padding: '6px', borderRadius: '16px', border: '1px solid var(--color-sentech-border)'
            }}>
              <button
                onClick={() => setActiveTab('bestsellers')}
                style={{
                  padding: '9px 18px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === 'bestsellers' ? '#1b75bc' : 'transparent',
                  color: activeTab === 'bestsellers' ? '#ffffff' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Award size={16} /> Meilleures ventes
              </button>
              <button
                onClick={() => setActiveTab('promos')}
                style={{
                  padding: '9px 18px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === 'promos' ? '#ef4444' : 'transparent',
                  color: activeTab === 'promos' ? '#ffffff' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Flame size={16} /> Offres Flash
              </button>
              <button
                onClick={() => setActiveTab('new')}
                style={{
                  padding: '9px 18px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === 'new' ? '#1b75bc' : 'transparent',
                  color: activeTab === 'new' ? '#ffffff' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Sparkles size={16} /> Nouveautés
              </button>
            </div>
          </div>

          <div className="product-grid">
            {currentTabProducts.slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/boutique" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '0.95rem', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Voir tous les produits dans la Boutique <ArrowRight size={17} />
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 : BANDEAU OFFRE FLASH (Padding 100px, Margin 40px)
      ═══════════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: 'var(--color-background)', borderTop: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '28px',
            padding: '48px',
            color: '#ffffff',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px', alignItems: 'center',
            boxShadow: '0 20px 50px rgba(15,23,42,0.12)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '100px', padding: '6px 14px',
                fontSize: '0.78rem', color: '#f87171', fontWeight: 800, textTransform: 'uppercase',
                marginBottom: '18px',
              }}>
                <Flame size={15} color="#ef4444" /> Vente Flash Spéciale
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
                Jusqu&apos;à <span style={{ color: '#ef4444' }}>-40%</span> sur les Chargeurs & Écouteurs
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginBottom: '28px', lineHeight: '1.6' }}>
                Stocks de promotion limités. Commandez avant la fin du décompte !
              </p>
              <Link href="/promotions" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  En profiter maintenant <ArrowRight size={17} />
                </button>
              </Link>
            </div>

            <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
              <CountdownTimer targetDate={promoEndDate} label="Temps restant :" />
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
