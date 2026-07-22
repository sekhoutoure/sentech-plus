'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ShieldCheck, Truck, Headphones, Star, Flame,
  Zap, Cable, Smartphone, Watch, BatteryCharging, Gamepad2, Grid,
  Lock, Wallet, ChevronRight, Send
} from 'lucide-react';
import { products, type Product } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import CountdownTimer from '@/components/ui/CountdownTimer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useToast } from '@/context/ToastContext';

// ── 8 Catégories Flottantes Bento ──
const HERO_CATEGORIES = [
  { name: 'Chargeurs', count: '145 produits', icon: Zap, catParam: 'Chargeurs Rapides' },
  { name: 'Écouteurs', count: '320 produits', icon: Headphones, catParam: 'Écouteurs Bluetooth' },
  { name: 'Power Banks', count: '87 produits', icon: BatteryCharging, catParam: 'Batteries Externes' },
  { name: 'Câbles', count: '96 produits', icon: Cable, catParam: 'Câbles Premium' },
  { name: 'Montres', count: '64 produits', icon: Watch, catParam: 'Montres Connectées' },
  { name: 'Supports', count: '52 produits', icon: Smartphone, catParam: 'Supports Téléphone' },
  { name: 'Gaming', count: '78 produits', icon: Gamepad2, catParam: 'Gaming' },
  { name: 'Voir toutes les catégories', count: '', icon: Grid, catParam: '' },
];

const promoEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export default function HomePage() {
  const router = useRouter();
  const { showToast } = useToast();
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
    <div style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 1 : HERO SECTION MASTERCLASS (720px Height + Design Canonique)
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(circle at top left, #f8fbff, #eef6ff 35%, #ffffff 70%)',
        paddingTop: '40px',
        paddingBottom: '70px',
        minHeight: '720px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Glow bleu arrière-plan ultra premium (.hero::before) */}
        <div style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          background: 'rgba(59, 130, 246, 0.12)',
          filter: 'blur(120px)',
          top: '-200px',
          right: '-100px',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, width: '100%' }}>
          
          {/* Layout Grid 1fr 1fr (gap 80px) */}
          <div className="hero-master-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: '80px',
          }}>

            {/* ── COLONNE GAUCHE : TYPOGRAPHIE & ESPACEMENTS RIGOUREUX ── */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              
              {/* Badge Official Store Senegal */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '100px',
                  background: '#ffffff', border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                  fontSize: '0.8rem', fontWeight: 700, color: '#0f172a',
                }}>
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  BOUTIQUE OFFICIELLE AU SÉNÉGAL 🇸🇳
                </span>
              </div>

              {/* Social Proof Pill (Avatars + Stars + 2500 clients) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'].map((src, idx) => (
                    <div key={idx} style={{
                      position: 'relative', width: '30px', height: '30px', borderRadius: '50%',
                      overflow: 'hidden', border: '2px solid #ffffff', marginLeft: idx > 0 ? '-8px' : 0,
                    }}>
                      <Image src={src} alt="Client satisfait" fill sizes="30px" style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    +2500 clients satisfaits
                  </span>
                </div>
              </div>

              {/* Main Heading (72px, weight 900, line-height 1.02) */}
              <h1 style={{
                fontSize: 'clamp(42px, 5vw, 72px)',
                fontWeight: 900,
                lineHeight: 1.02,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: '32px', /* Titre -> 32px -> Description */
                fontFamily: 'var(--font-inter, Inter), system-ui, sans-serif',
              }}>
                Les meilleurs<br />
                accessoires<br />
                <span style={{
                  background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}>High-Tech</span><br />
                au meilleur prix au Sénégal.
              </h1>

              {/* Description text */}
              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                lineHeight: 1.6,
                maxWidth: '540px',
                marginBottom: '40px', /* Description -> 40px -> Boutons */
                fontWeight: 450,
              }}>
                Découvrez une sélection premium d&apos;accessoires High-Tech certifiés avec garantie et livraison express 24h partout au Sénégal.
              </p>

              {/* CTA Dual Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px', flexWrap: 'wrap' }}>
                <Link
                  href="/boutique"
                  style={{
                    background: '#2563eb',
                    borderRadius: '18px',
                    padding: '18px 36px',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textDecoration: 'none',
                    boxShadow: '0 12px 30px rgba(37, 99, 235, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  className="hero-btn-primary"
                >
                  Acheter maintenant <ArrowRight size={20} />
                </Link>

                <Link
                  href="/promotions"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '18px',
                    padding: '18px 36px',
                    color: '#1f2937',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  className="hero-btn-secondary"
                >
                  Découvrir les promos <Flame size={18} color="#ef4444" fill="#ef4444" />
                </Link>
              </div>

              {/* 3 Cartes Confiance (Box Shadow 0 15px 35px rgba(0,0,0,.06)) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                width: '100%',
                maxWidth: '600px',
                marginBottom: '50px', /* Cartes -> 50px -> Catégories */
              }} className="hero-trust-cards">
                
                <div style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Livraison 24h</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Partout au Sénégal</div>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.08)', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Produits certifiés</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Garantie 12 mois</div>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Headphones size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Support 7j/7</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>À votre écoute</div>
                  </div>
                </div>

              </div>

            </div>

            {/* ── COLONNE DROITE : CERCLE LUMINEUX 550PX + SOCLES 3D + PRODUITS DÉTOURÉS ── */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '580px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} className="hero-col-right-master">

              {/* Cercle Lumineux (width: 550px, height: 550px, border: 4px solid #dbeafe, shadow: 0 0 100px #93c5fd) */}
              <div style={{
                position: 'absolute',
                width: '550px',
                height: '550px',
                borderRadius: '50%',
                border: '4px solid #dbeafe',
                boxShadow: '0 0 100px #93c5fd',
                pointerEvents: 'none',
                zIndex: 0,
              }} />

              {/* Socle 3D Cylindre CSS au bas des produits */}
              <div style={{
                position: 'absolute',
                bottom: '40px',
                width: '480px',
                height: '110px',
                background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                borderRadius: '50%',
                boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
                pointerEvents: 'none',
                zIndex: 1,
              }} />

              {/* Exposition Image Composité Multi-Produits Détourés */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                height: '520px',
                zIndex: 2,
              }}>
                <Image
                  src="/hero_podium_composite.jpg"
                  alt="Accessoires High-Tech SenTech Plus 3D Render"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{
                    objectFit: 'contain',
                    mixBlendMode: 'multiply',
                  }}
                />
              </div>

              {/* Floating Payment & Trust Card (Top Right Edge) */}
              <div style={{
                position: 'absolute',
                top: '40px',
                right: '-20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '20px 24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 10,
                minWidth: '190px',
              }} className="hero-floating-card">
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Lock size={14} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Paiement sécurisé</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Wallet size={14} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Paiement à la livraison</span>
                </div>

                <div style={{
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}>
                  <span style={{ color: '#ff6600' }}>Orange Money</span>
                  <span style={{ color: '#00a5e4' }}>& Wave</span>
                </div>
              </div>

            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════
              BARRE DE CATÉGORIES BENTO FLOTTANTE (Card background white, border-radius 28px, shadow 0 25px 70px)
          ═════════════════════════════════════════════════════════════════ */}
          <div style={{
            marginTop: '50px',
            background: '#ffffff',
            borderRadius: '28px',
            padding: '30px',
            boxShadow: '0 25px 70px rgba(15, 23, 42, 0.08)',
            border: '1px solid #f1f5f9',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '14px',
            }} className="bento-category-grid">

              {HERO_CATEGORIES.map((cat, idx) => {
                const IconComp = cat.icon;
                const isLast = idx === HERO_CATEGORIES.length - 1;

                return (
                  <Link
                    key={cat.name}
                    href={cat.catParam ? `/boutique?cat=${encodeURIComponent(cat.catParam)}` : '/boutique'}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      height: '96px',
                      borderRadius: '18px',
                      background: isLast ? 'rgba(37, 99, 235, 0.06)' : '#ffffff',
                      border: isLast ? '1px dashed rgba(37, 99, 235, 0.3)' : '1px solid #f1f5f9',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: '6px',
                      transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                      cursor: 'pointer',
                    }} className="bento-cat-card">
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        background: isLast ? '#2563eb' : 'rgba(37, 99, 235, 0.08)',
                        color: isLast ? '#ffffff' : '#2563eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: isLast ? '#2563eb' : '#0f172a',
                          lineHeight: '1.2',
                        }}>
                          {cat.name}
                        </div>
                        {cat.count && (
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', fontWeight: 500 }}>
                            {cat.count}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}

            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 2 : COMPTE À REBOURS VENTE FLASH & PROMOTIONS
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '60px 0', background: '#ffffff', borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <ScrollReveal>
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '24px',
              padding: '32px 40px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ef4444', color: '#ffffff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  <Flame size={14} /> OFFRE FLASH LIMITÉE
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>
                  Jusqu&apos;à -30% sur la Sélection Audio & GaN Fast Charge
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Profitez des réductions exclusives SenTech Plus avec livraison express à Dakar.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <CountdownTimer targetDate={promoEndDate} />
                <Link href="/promotions" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                  Voir les promos <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 3 : GRILLE DES PRODUITS PAR ONGLETS
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px',
          }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '8px' }}>
                Nos Accessoires <span className="sentech-gradient-text">En Vedette</span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Sélection certifiée conforme avec garantie officielle SenTech Plus.
              </p>
            </div>

            {/* Selector Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              background: '#ffffff',
              padding: '6px',
              borderRadius: '14px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
            }}>
              <button
                onClick={() => setActiveTab('bestsellers')}
                style={{
                  padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: activeTab === 'bestsellers' ? 700 : 600,
                  background: activeTab === 'bestsellers' ? '#2563eb' : 'transparent',
                  color: activeTab === 'bestsellers' ? '#ffffff' : '#64748b',
                  transition: 'all 200ms ease',
                }}
              >
                🔥 Meilleures Ventes
              </button>

              <button
                onClick={() => setActiveTab('promos')}
                style={{
                  padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: activeTab === 'promos' ? 700 : 600,
                  background: activeTab === 'promos' ? '#2563eb' : 'transparent',
                  color: activeTab === 'promos' ? '#ffffff' : '#64748b',
                  transition: 'all 200ms ease',
                }}
              >
                ⚡ Promotions Flash
              </button>

              <button
                onClick={() => setActiveTab('new')}
                style={{
                  padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: activeTab === 'new' ? 700 : 600,
                  background: activeTab === 'new' ? '#2563eb' : 'transparent',
                  color: activeTab === 'new' ? '#ffffff' : '#64748b',
                  transition: 'all 200ms ease',
                }}
              >
                ✨ Nouveautés
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {currentTabProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/boutique" className="btn-secondary" style={{ padding: '14px 32px', borderRadius: '12px' }}>
              Explorer tout le catalogue <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 4 : AVANTAGES & TÉMOIGNAGES
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: '#ffffff', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
            <h2 className="section-title" style={{ marginBottom: '12px' }}>
              Pourquoi choisir <span className="sentech-gradient-text">SenTech Plus</span> ?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              L&apos;engagement d&apos;un service irréprochable et de produits high-tech 100% certifiés au Sénégal.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
          }} className="advantages-grid">

            <div style={{ background: '#F8FAFC', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Livraison 24h Express</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Expédition rapide à Dakar et dans toutes les régions du Sénégal avec suivi direct.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Garantie Officielle 12 Mois</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Tous nos produits sont testés et couverte par une garantie d&apos;échange à neuf.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Headphones size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Support Client 7j/7</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Une équipe réactive disponible via WhatsApp et téléphone pour vous conseiller.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '20px', padding: '28px 24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Wallet size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Paiement Souple & Sécurisé</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Payez à la livraison en espèces ou en un clic via Orange Money et Wave.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 5 : NEWSLETTER
      ═════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0', background: '#F8FAFC', borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '28px',
            padding: '48px 36px',
            color: '#ffffff',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(37, 99, 235, 0.3)',
          }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', marginBottom: '12px' }}>
              Rejoignez le Club Privé SenTech Plus
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.88)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.5 }}>
              Recevez en avant-première nos ventes flash, nos codes promos exclusifs et nos nouveaux arrivages high-tech.
            </p>

            <form onSubmit={handleNewsletterSubmit} style={{
              display: 'flex',
              gap: '10px',
              maxWidth: '480px',
              margin: '0 auto',
            }} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Votre adresse e-mail..."
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  background: '#ffffff',
                  color: '#0f172a',
                }}
              />
              <button type="submit" style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}>
                S&apos;inscrire <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ── Responsive CSS Rules ── */}
      <style>{`
        .hero-btn-primary:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 36px rgba(37, 99, 235, 0.35) !important;
        }
        .hero-btn-secondary:hover {
          transform: translateY(-4px) !important;
          border-color: #cbd5e1 !important;
        }
        .bento-cat-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08) !important;
        }
        @media (max-width: 1024px) {
          .hero-master-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .hero-col-right-master {
            max-width: 480px;
            margin: 0 auto;
          }
          .bento-category-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .advantages-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .bento-category-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-trust-cards {
            grid-template-columns: 1fr !important;
          }
          .advantages-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-floating-card {
            display: none !important;
          }
          .newsletter-form {
            flex-direction: column !important;
          }
        }
      `}</style>

    </div>
  );
}
