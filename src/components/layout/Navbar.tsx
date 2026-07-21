'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  ShoppingCart, Heart, Search, Menu, X, ChevronDown, User,
  Package, Headphones, Watch, Battery, Monitor, Gamepad2, Cable, Smartphone, Zap,
  BookOpen, Info, MessageCircle, Tag
} from 'lucide-react';
import { products } from '@/lib/products';

const categoryItems = [
  { label: 'Chargeurs Rapides', href: '/boutique?cat=Chargeurs+Rapides', icon: <Zap size={15} /> },
  { label: 'Câbles Premium', href: '/boutique?cat=C%C3%A2bles+Premium', icon: <Cable size={15} /> },
  { label: 'Supports Téléphone', href: '/boutique?cat=Supports+T%C3%A9l%C3%A9phone', icon: <Smartphone size={15} /> },
  { label: 'Écouteurs Bluetooth', href: '/boutique?cat=%C3%89couteurs+Bluetooth', icon: <Headphones size={15} /> },
  { label: 'Casques Audio', href: '/boutique?cat=Casques+Audio', icon: <Package size={15} /> },
  { label: 'Montres Connectées', href: '/boutique?cat=Montres+Connect%C3%A9es', icon: <Watch size={15} /> },
  { label: 'Batteries Externes', href: '/boutique?cat=Batteries+Externes', icon: <Battery size={15} /> },
  { label: 'Accessoires PC', href: '/boutique?cat=Accessoires+PC', icon: <Monitor size={15} /> },
  { label: 'Gaming', href: '/boutique?cat=Gaming', icon: <Gamepad2 size={15} /> },
];

const moreLinks = [
  { label: 'Blog', href: '/blog', icon: <BookOpen size={15} /> },
  { label: 'À propos', href: '/a-propos', icon: <Info size={15} /> },
  { label: 'Contact', href: '/contact', icon: <MessageCircle size={15} /> },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  const [announcementText, setAnnouncementText] = useState('⚡ LIVRAISON EXPRESS À DAKAR EN 24H · -20% AVEC CODE: SENTECH20');

  useEffect(() => {
    const dismissed = localStorage.getItem('announcementDismissed');
    if (dismissed === '1') setAnnouncementVisible(false);

    const syncAnnouncement = () => {
      const updated = localStorage.getItem('siteAnnouncementText');
      if (updated) setAnnouncementText(updated);
    };
    setTimeout(syncAnnouncement, 0);
    window.addEventListener('storage', syncAnnouncement);
    return () => window.removeEventListener('storage', syncAnnouncement);
  }, []);

  const dismissAnnouncement = () => {
    setAnnouncementVisible(false);
    localStorage.setItem('announcementDismissed', '1');
  };

  const announcementHeight = announcementVisible ? '28px' : '0px';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const suggestions = searchQuery.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navTop = announcementVisible ? '28px' : '0px';

  return (
    <>
      {/* IHM WCAG 2.4.1 — Skip to content */}
      <a href="#main-content" className="skip-to-content">
        Aller au contenu principal
      </a>

      {/* ── Announcement Bar ── */}
      {announcementVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
          background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
          color: 'white', fontSize: '0.74rem', fontWeight: 600,
          textAlign: 'center', padding: '5px 40px 5px 16px', letterSpacing: '0.5px',
          boxShadow: '0 2px 10px rgba(13,82,140,0.2)',
          height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {announcementText}
          <button
            onClick={dismissAnnouncement}
            aria-label="Fermer l'annonce"
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Main Navbar ── */}
      <nav
        aria-label="Navigation principale"
        style={{
          position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 1000,
          transition: 'top 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(27,117,188,0.18)' : '1px solid rgba(15,23,42,0.06)',
          boxShadow: scrolled ? '0 4px 24px rgba(15,23,42,0.05)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }} aria-label="SenTech Plus — Accueil">
              <div style={{ position: 'relative', width: '140px', height: '34px' }}>
                <Image
                  src="/logo_horizontal_v2.png"
                  alt="SenTech Plus"
                  fill
                  sizes="140px"
                  style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
                  priority
                />
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="desktop-nav" role="menubar">

              {/* Boutique mega-menu */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setDropdown('boutique')}
                onMouseLeave={() => setDropdown(null)}
              >
                <Link
                  href="/boutique"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '8px 12px', borderRadius: '8px',
                    color: dropdown === 'boutique' ? '#1b75bc' : '#475569',
                    textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600,
                    transition: 'all 0.2s',
                    background: dropdown === 'boutique' ? 'rgba(27,117,188,0.07)' : 'transparent',
                  }}
                  role="menuitem"
                >
                  Boutique <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropdown === 'boutique' ? 'rotate(180deg)' : 'none' }} />
                </Link>

                {dropdown === 'boutique' && (
                  <div
                    style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: '50%', transform: 'translateX(-40%)',
                      zIndex: 200, background: '#ffffff',
                      border: '1px solid rgba(15,23,42,0.08)',
                      borderRadius: '16px', padding: '16px',
                      boxShadow: '0 24px 48px rgba(15,23,42,0.1)',
                      animation: 'slide-down 0.15s ease-out',
                      minWidth: '520px',
                    }}
                    role="menu"
                  >
                    {/* Header du mega-menu */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#1b75bc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Catégories</span>
                      <Link href="/boutique" style={{ fontSize: '0.78rem', color: '#1b75bc', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Voir tout →
                      </Link>
                    </div>
                    {/* Grille 3 colonnes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {categoryItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 10px', borderRadius: '8px',
                            color: '#475569', textDecoration: 'none',
                            fontSize: '0.82rem', fontWeight: 500,
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(27,117,188,0.07)';
                            e.currentTarget.style.color = '#1b75bc';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#475569';
                          }}
                        >
                          <span style={{ color: '#1b75bc', flexShrink: 0 }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Accès rapide: promos + nouveautés */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(15,23,42,0.06)' }}>
                      <Link href="/promotions" style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
                        padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
                        background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)',
                        transition: 'all 0.15s',
                      }}>
                        <Tag size={13} /> 🔥 Promotions
                      </Link>
                      <Link href="/nouveautes" style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
                        padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600,
                        background: 'rgba(27,117,188,0.07)', color: '#1b75bc', border: '1px solid rgba(27,117,188,0.15)',
                        transition: 'all 0.15s',
                      }}>
                        ✨ Nouveautés
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 🔥 Promos direct */}
              <Link
                href="/promotions"
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '8px 12px', borderRadius: '8px',
                  color: '#ef4444', textDecoration: 'none',
                  fontSize: '0.88rem', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                role="menuitem"
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.07)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                🔥 Promos
              </Link>

              {/* Plus ▾ menu */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setDropdown('more')}
                onMouseLeave={() => setDropdown(null)}
              >
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '8px 12px', borderRadius: '8px',
                    color: dropdown === 'more' ? '#1b75bc' : '#475569',
                    background: dropdown === 'more' ? 'rgba(27,117,188,0.07)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    fontSize: '0.88rem', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  aria-expanded={dropdown === 'more'}
                  aria-haspopup="true"
                  role="menuitem"
                >
                  Plus <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropdown === 'more' ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropdown === 'more' && (
                  <div
                    style={{
                      position: 'absolute', top: 'calc(100% + 4px)', right: 0,
                      zIndex: 200, background: '#ffffff',
                      border: '1px solid rgba(15,23,42,0.08)',
                      borderRadius: '12px', padding: '8px',
                      boxShadow: '0 20px 40px rgba(15,23,42,0.08)',
                      animation: 'slide-down 0.15s ease-out',
                      minWidth: '170px',
                    }}
                    role="menu"
                  >
                    {moreLinks.map(link => (
                      <Link
                        key={link.label}
                        href={link.href}
                        role="menuitem"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '9px 12px', borderRadius: '8px',
                          color: '#475569', textDecoration: 'none',
                          fontSize: '0.85rem', fontWeight: 500,
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(27,117,188,0.06)';
                          e.currentTarget.style.color = '#1b75bc';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#475569';
                        }}
                      >
                        <span style={{ color: '#1b75bc' }}>{link.icon}</span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Actions ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

              {/* Recherche inline — desktop */}
              <form onSubmit={handleSearch} role="search" className="desktop-nav" style={{ position: 'relative' }}>
                <label htmlFor="navbar-search-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                  Rechercher un produit
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', color: '#94a3b8', pointerEvents: 'none' }} />
                  <input
                    id="navbar-search-input"
                    ref={searchRef}
                    type="search"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoComplete="off"
                    style={{
                      paddingLeft: '32px', paddingRight: '12px',
                      height: '44px', width: searchQuery.length > 0 ? '200px' : '150px',
                      borderRadius: '8px', border: '1px solid rgba(15,23,42,0.12)',
                      background: 'rgba(15,23,42,0.04)', fontSize: '0.82rem',
                      color: '#0f172a',
                      transition: 'width 0.25s ease, border-color 0.2s',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.width = '200px';
                      e.currentTarget.style.borderColor = 'rgba(27,117,188,0.4)';
                    }}
                    onBlur={e => {
                      if (!searchQuery) e.currentTarget.style.width = '150px';
                      e.currentTarget.style.borderColor = 'rgba(15,23,42,0.12)';
                    }}
                  />
                </div>
                {suggestions.length > 0 && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    zIndex: 300, background: '#ffffff',
                    border: '1px solid rgba(15,23,42,0.08)',
                    borderRadius: '12px', padding: '8px',
                    boxShadow: '0 20px 40px rgba(15,23,42,0.08)',
                    minWidth: '280px',
                  }}>
                    {suggestions.map(p => (
                      <Link
                        key={p.id}
                        href={`/produit/${p.id}`}
                        onClick={() => setSearchQuery('')}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 10px', borderRadius: '8px',
                          textDecoration: 'none', transition: 'background 0.15s',
                          minHeight: '44px',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,117,188,0.07)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ width: '32px', height: '32px', position: 'relative', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="32px" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#0f172a', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          <div style={{ color: '#475569', fontSize: '0.72rem' }}>{p.category}</div>
                        </div>
                        <span style={{ color: '#1b75bc', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                          {new Intl.NumberFormat('fr-FR').format(p.price)} F
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>

              {/* IHM: Wishlist — Link stylé directement (pas de button imbriqué), 44x44px */}
              <Link
                href="/favoris"
                aria-label={`Favoris${wishlistCount > 0 ? ` — ${wishlistCount} article${wishlistCount > 1 ? 's' : ''}` : ''}`}
                className="desktop-nav"
                style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px',
                  background: 'rgba(15,23,42,0.04)', border: '1px solid rgba(15,23,42,0.08)',
                  borderRadius: '8px', color: '#0f172a', textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(27,117,188,0.08)';
                  e.currentTarget.style.color = '#1b75bc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(15,23,42,0.04)';
                  e.currentTarget.style.color = '#0f172a';
                }}
              >
                <Heart size={17} />
                {wishlistCount > 0 && (
                  <span aria-hidden="true" style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    background: '#ef4444', color: 'white', borderRadius: '50%',
                    width: '18px', height: '18px', fontSize: '0.62rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white',
                  }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* IHM: Panier — Link stylé directement, 44px */}
              <Link
                href="/panier"
                aria-label={`Panier${totalItems > 0 ? ` — ${totalItems} article${totalItems > 1 ? 's' : ''}` : ' (vide)'}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  height: '44px', padding: '0 16px',
                  background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
                  border: 'none', borderRadius: '8px', color: 'white',
                  fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
                  boxShadow: totalItems > 0 ? '0 0 14px rgba(27,117,188,0.45)' : 'none',
                  transition: 'box-shadow 0.3s, transform 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                <ShoppingCart size={16} />
                <span className="desktop-nav">Panier</span>
                {totalItems > 0 && (
                  <span aria-hidden="true" style={{
                    background: 'rgba(255,255,255,0.25)', borderRadius: '20px',
                    padding: '1px 7px', fontSize: '0.73rem',
                  }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* IHM: Compte — Link stylé directement, 44x44px */}
              <Link
                href="/compte"
                aria-label="Mon compte"
                className="desktop-nav"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px',
                  background: 'rgba(15,23,42,0.04)', border: '1px solid rgba(15,23,42,0.08)',
                  borderRadius: '8px', color: '#0f172a', textDecoration: 'none',
                  transition: 'background 0.2s, color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(27,117,188,0.08)';
                  e.currentTarget.style.color = '#1b75bc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(15,23,42,0.04)';
                  e.currentTarget.style.color = '#0f172a';
                }}
              >
                <User size={17} />
              </Link>

              {/* Mobile hamburger */}
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu-drawer"
                className="mobile-only"
                style={{
                  background: 'rgba(15,23,42,0.05)', border: '1px solid rgba(15,23,42,0.12)',
                  borderRadius: '8px', padding: '0',
                  width: '44px', height: '44px',
                  cursor: 'pointer', color: '#0f172a',
                  display: 'none', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div
            id="mobile-menu-drawer"
            role="navigation"
            aria-label="Menu mobile"
            style={{
              background: '#ffffff', borderTop: '1px solid rgba(15,23,42,0.07)',
              padding: '12px 20px 20px',
              animation: 'slide-down 0.2s ease-out',
              maxHeight: 'calc(100vh - 60px)', overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(15,23,42,0.1)',
            }}
          >
            {/* Mobile search */}
            <form onSubmit={handleSearch} role="search" style={{ marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  style={{
                    width: '100%', paddingLeft: '36px', paddingRight: '12px',
                    height: '40px', borderRadius: '8px',
                    border: '1px solid rgba(15,23,42,0.12)', background: 'rgba(15,23,42,0.03)',
                    fontSize: '0.875rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </form>

            {/* Boutique + catégories */}
            <div style={{ borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
              <button
                onClick={() => setMobileCategoriesOpen(o => !o)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 0', color: '#0f172a', background: 'none', border: 'none',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                }}
              >
                <span>🛒 Boutique</span>
                <ChevronDown size={15} style={{ transition: 'transform 0.2s', transform: mobileCategoriesOpen ? 'rotate(180deg)' : 'none', color: '#1b75bc' }} />
              </button>
              {mobileCategoriesOpen && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', paddingBottom: '12px' }}>
                  {categoryItems.map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 10px', borderRadius: '8px',
                        color: '#475569', textDecoration: 'none',
                        fontSize: '0.82rem', fontWeight: 500,
                        background: 'rgba(15,23,42,0.02)',
                      }}
                    >
                      <span style={{ color: '#1b75bc' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 🔥 Promos */}
            <Link
              href="/promotions"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', padding: '13px 0',
                borderBottom: '1px solid rgba(15,23,42,0.06)',
                color: '#ef4444', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
              }}
            >
              🔥 Promotions
            </Link>

            {/* Plus */}
            <div style={{ borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
              <button
                onClick={() => setMobileMoreOpen(o => !o)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 0', color: '#475569', background: 'none', border: 'none',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                }}
              >
                Plus
                <ChevronDown size={15} style={{ transition: 'transform 0.2s', transform: mobileMoreOpen ? 'rotate(180deg)' : 'none', color: '#94a3b8' }} />
              </button>
              {mobileMoreOpen && (
                <div style={{ paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {moreLinks.map(link => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px 12px', borderRadius: '8px',
                        color: '#475569', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                      }}
                    >
                      <span style={{ color: '#1b75bc' }}>{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons action mobile — IHM: Links stylés, cibles 44px */}
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px' }}>
              <Link
                href="/panier"
                onClick={() => setMobileOpen(false)}
                aria-label={`Panier${totalItems > 0 ? ` (${totalItems})` : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  height: '44px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
                  color: 'white', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                }}
              >
                <ShoppingCart size={15} /> Panier {totalItems > 0 && `(${totalItems})`}
              </Link>
              <Link
                href="/favoris"
                onClick={() => setMobileOpen(false)}
                aria-label={`Favoris${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`}
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '10px',
                  border: '1px solid rgba(15,23,42,0.12)', background: 'transparent',
                  textDecoration: 'none', color: '#0f172a',
                }}
              >
                <Heart size={15} />
                {wishlistCount > 0 && (
                  <span aria-hidden="true" style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ef4444', color: 'white', borderRadius: '50%',
                    width: '17px', height: '17px', fontSize: '0.6rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white',
                  }}>{wishlistCount}</span>
                )}
              </Link>
              <Link
                href="/compte"
                onClick={() => setMobileOpen(false)}
                aria-label="Mon compte"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '10px',
                  border: '1px solid rgba(15,23,42,0.12)', background: 'transparent',
                  textDecoration: 'none', color: '#0f172a',
                }}
              >
                <User size={15} />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer — adaptatif selon la barre d'annonce */}
      <div style={{ height: announcementVisible ? '88px' : '60px', transition: 'height 0.3s ease' }} aria-hidden="true" />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
