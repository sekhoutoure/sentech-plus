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
          SECTION 1 : HERO ULTRA MODERNE (Senior UI/UX Design)
      ═══════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        paddingTop: '80px',
        paddingBottom: '100px',
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

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '45% 55%',
            gap: '80px',
            alignItems: 'center',
            minHeight: '720px',
          }} className="hero-main-grid">
            
            {/* ── COLONNE GAUCHE (45%) ── */}
            <div style={{ animation: 'slide-up 0.5s ease-out' }}>
              
              {/* Badges Top: Badge Premium & Badge Social Proof */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {/* Badge Premium */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                }}>
                  <Award size={15} color="#1B75BC" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                    ⭐ Boutique Officielle au Sénégal 🇸🇳
                  </span>
                </div>

                {/* Badge Social Proof */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                    👥 +2500 clients satisfaits &nbsp; <span style={{ color: '#FBBF24' }}>★★★★★</span> 4.9/5
                  </span>
                </div>
              </div>

              {/* Grand Titre (72px, 800 weight, 1.05 line-height) */}
              <h1 className="hero-title" style={{
                fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                fontSize: 'clamp(38px, 5.2vw, 72px)',
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: '24px',
                color: '#0F172A',
                letterSpacing: '-0.03em',
              }}>
                Les meilleurs accessoires <br />
                <span style={{ color: '#1B75BC' }}>High-Tech</span> <br />
                au meilleur prix au Sénégal.
              </h1>

              {/* Description (Max 600px, Slate 600, 500 weight) */}
              <p className="hero-description" style={{
                fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                color: '#475569',
                fontSize: '1.05rem',
                fontWeight: 500,
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '600px',
              }}>
                Découvrez une sélection premium d&apos;accessoires High-Tech certifiés avec livraison express partout au Sénégal.
              </p>

              {/* 3 Cartes de confiance (Petites cartes blanches avec icônes Lucide) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '36px',
              }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.03)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                }} className="hover-lift">
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(27,117,188,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={20} color="#1B75BC" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Livraison Express 24h</div>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.03)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                }} className="hover-lift">
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(27,117,188,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={20} color="#1B75BC" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Produits Certifiés</div>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 4px 14px rgba(15,23,42,0.03)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                }} className="hover-lift">
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(27,117,188,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Headphones size={20} color="#1B75BC" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Support 7j/7</div>
                  </div>
                </div>
              </div>

              {/* Deux Boutons (16px gap, 16px border-radius) */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <Link href="/boutique" style={{ textDecoration: 'none' }}>
                  <button id="hero-shop-btn" className="btn-primary btn-pulse" style={{
                    padding: '16px 36px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '16px',
                    background: '#1B75BC',
                    boxShadow: '0 10px 25px rgba(27,117,188,0.35)',
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer', color: '#ffffff', border: 'none',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                  }}>
                    Acheter maintenant <ArrowRight size={18} />
                  </button>
                </Link>

                <Link href="/promotions" style={{ textDecoration: 'none' }}>
                  <button id="hero-promo-btn" className="btn-secondary" style={{
                    padding: '16px 32px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #E2E8F0',
                    color: '#0F172A',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15,23,42,0.04)',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'var(--font-manrope, Manrope), sans-serif',
                  }}>
                    Découvrir les promotions <Flame size={18} color="#EF4444" />
                  </button>
                </Link>
              </div>

              {/* Sous les boutons : Photos rondes de clients + rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex' }}>
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
                  ].map((src, i) => (
                    <div key={i} style={{
                      position: 'relative', width: '32px', height: '32px', borderRadius: '50%',
                      overflow: 'hidden', border: '2px solid #ffffff', marginLeft: i === 0 ? 0 : '-10px',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.1)',
                    }}>
                      <Image src={src} alt="Client satisfait" fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                  <span style={{ color: '#FBBF24', marginRight: '4px' }}>★★★★★</span>
                  <AnimatedCounter end={2500} prefix="+" suffix=" clients satisfaits" />
                </div>
              </div>

            </div>

            {/* ── COLONNE DROITE (55%): Podium & Cartes Flottantes Glassmorphism ── */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              
              {/* Soft Glowing Blue Halo Ring Behind Products */}
              <div style={{
                position: 'absolute',
                width: '460px', height: '460px',
                borderRadius: '50%',
                border: '2px solid rgba(27,117,188,0.3)',
                boxShadow: '0 0 100px rgba(27,117,188,0.2), inset 0 0 50px rgba(27,117,188,0.12)',
                pointerEvents: 'none',
                animation: 'pulse-glow 5s ease-in-out infinite',
              }} />

              {/* Main Floating Podium Products Showcase Image */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '540px',
                height: '480px',
                borderRadius: '32px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
                animation: 'float 4s ease-in-out infinite',
              }}>
                <Image
                  src="/hero_showcase.jpg"
                  alt="Mise en scène podium produits High-Tech : Casque, Earbuds, Chargeur GaN, Power Bank et Smartwatch"
                  fill
                  sizes="(max-width: 768px) 100vw, 540px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* ── CARTE FLOTTANTE 1 (Haut Gauche) : Paiement Sécurisé ── */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '-10px',
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                padding: '14px 18px',
                boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
                zIndex: 4,
                display: 'flex', alignItems: 'center', gap: '12px',
                animation: 'float 3.5s ease-in-out infinite alternate',
              }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#22C55E" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>✓ Paiement sécurisé</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
                    <span style={{ color: '#FF6600', fontWeight: 800 }}>Orange Money</span> • <span style={{ color: '#1BA0E2', fontWeight: 800 }}>Wave</span> • Cash
                  </div>
                </div>
              </div>

              {/* ── CARTE FLOTTANTE 2 (Haut Droite) : Livraison Express ── */}
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '-10px',
                background: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                padding: '14px 18px',
                boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
                zIndex: 4,
                display: 'flex', alignItems: 'center', gap: '12px',
                animation: 'float 4.5s ease-in-out infinite alternate-reverse',
              }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(27,117,188,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} color="#1B75BC" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Livraison Express</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    ⚡ 24h Dakar • 48h Régions
                  </div>
                </div>
              </div>

              {/* ── CARTE FLOTTANTE 3 (Bas Droite) : Garantie 12 mois ── */}
              <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                padding: '14px 18px',
                boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
                zIndex: 4,
                display: 'flex', alignItems: 'center', gap: '12px',
                animation: 'float 4s ease-in-out infinite alternate',
              }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} color="#2563EB" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>Garantie 12 mois</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    Produits certifiés d&apos;origine
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ═══════════════════════════════════════════════
              BANDE FLOTTANTE DES CATÉGORIES (En bas du Hero)
          ═══════════════════════════════════════════════ */}
          <div style={{
            marginTop: '60px',
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '20px 24px',
            boxShadow: '0 20px 50px rgba(15,23,42,0.07)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
            gap: '16px',
            alignItems: 'center',
          }}>
            {[
              { name: 'Chargeurs', count: '145 produits', icon: Zap },
              { name: 'Écouteurs', count: '320 produits', icon: Headphones },
              { name: 'Power Banks', count: '87 produits', icon: BatteryCharging },
              { name: 'Câbles', count: '96 produits', icon: Cable },
              { name: 'Montres', count: '64 produits', icon: Watch },
              { name: 'Gaming', count: '78 produits', icon: Sparkles },
              { name: 'Supports', count: '52 produits', icon: Smartphone },
            ].map((cat, i) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/boutique?cat=${encodeURIComponent(cat.name)}`}
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                >
                  <div
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      padding: '12px 10px',
                      transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms ease, box-shadow 250ms ease',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = '#1B75BC';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(27,117,188,0.1)';
                      const iconEl = e.currentTarget.querySelector('.cat-icon-container');
                      if (iconEl) (iconEl as HTMLElement).style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                      const iconEl = e.currentTarget.querySelector('.cat-icon-container');
                      if (iconEl) (iconEl as HTMLElement).style.transform = 'scale(1)';
                    }}
                  >
                    <div
                      className="cat-icon-container"
                      style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: 'rgba(27,117,188,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 10px', color: '#1B75BC',
                        transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500, marginTop: '3px' }}>
                      {cat.count}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* 8ème carte : Voir toutes les catégories */}
            <Link
              href="/boutique"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '12px 10px',
                  transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms ease, box-shadow 250ms ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#1B75BC';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(27,117,188,0.1)';
                  const iconEl = e.currentTarget.querySelector('.cat-icon-container');
                  if (iconEl) (iconEl as HTMLElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  const iconEl = e.currentTarget.querySelector('.cat-icon-container');
                  if (iconEl) (iconEl as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                <div
                  className="cat-icon-container"
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'rgba(15,23,42,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 10px', color: '#0F172A',
                    transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ChevronRight size={22} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1B75BC', fontFamily: 'var(--font-manrope, Manrope), sans-serif' }}>
                  Voir toutes <br /> les catégories
                </div>
              </div>
            </Link>
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
