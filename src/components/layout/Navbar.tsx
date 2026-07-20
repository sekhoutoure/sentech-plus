'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  ShoppingCart, Heart, Search, Menu, X, ChevronDown, ChevronUp, User,
  Package, Headphones, Watch, Battery, Monitor, Gamepad2, Cable, Smartphone, Zap
} from 'lucide-react';
import { products } from '@/lib/products';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Boutique', href: '/boutique' },
  { label: 'Nouveautés', href: '/nouveautes' },
  { label: '🔥 Promos', href: '/promotions' },
  {
    label: 'Catégories', href: '/boutique',
    children: [
      { label: 'Chargeurs Rapides', href: '/boutique?cat=Chargeurs+Rapides', icon: <Zap size={15} /> },
      { label: 'Câbles Premium', href: '/boutique?cat=C%C3%A2bles+Premium', icon: <Cable size={15} /> },
      { label: 'Supports Téléphone', href: '/boutique?cat=Supports+T%C3%A9l%C3%A9phone', icon: <Smartphone size={15} /> },
      { label: 'Écouteurs Bluetooth', href: '/boutique?cat=%C3%89couteurs+Bluetooth', icon: <Headphones size={15} /> },
      { label: 'Casques Audio', href: '/boutique?cat=Casques+Audio', icon: <Package size={15} /> },
      { label: 'Montres Connectées', href: '/boutique?cat=Montres+Connect%C3%A9es', icon: <Watch size={15} /> },
      { label: 'Batteries Externes', href: '/boutique?cat=Batteries+Externes', icon: <Battery size={15} /> },
      { label: 'Accessoires PC', href: '/boutique?cat=Accessoires+PC', icon: <Monitor size={15} /> },
      { label: 'Gaming', href: '/boutique?cat=Gaming', icon: <Gamepad2 size={15} /> },
    ],
  },
  { label: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Search suggestions
  const suggestions = searchQuery.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const [announcementText, setAnnouncementText] = useState('⚡ LIVRAISON EXPRESS À DAKAR EN 24H · -20% AVEC CODE: SENTECH20');

  useEffect(() => {
    const syncAnnouncement = () => {
      const updated = localStorage.getItem('siteAnnouncementText');
      if (updated) setAnnouncementText(updated);
    };
    setTimeout(syncAnnouncement, 0);
    window.addEventListener('storage', syncAnnouncement);
    return () => window.removeEventListener('storage', syncAnnouncement);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
        background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
        color: 'white', fontSize: '0.74rem', fontWeight: 600,
        textAlign: 'center', padding: '5px 16px', letterSpacing: '0.5px',
        boxShadow: '0 2px 10px rgba(13,82,140,0.2)',
      }}>
        {announcementText}
      </div>

      <nav
        aria-label="Navigation principale"
        style={{
          position: 'fixed', top: '28px', left: 0, right: 0, zIndex: 1000,
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(27,117,188,0.2)' : '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: scrolled ? '0 4px 30px rgba(15, 23, 42, 0.06)' : 'none',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }} aria-label="SenTech Plus — Accueil">
              <div style={{ position: 'relative', width: '155px', height: '38px' }}>
                <Image
                  src="/logo_horizontal_v2.png"
                  alt="SenTech Plus"
                  fill
                  sizes="155px"
                  style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav" role="menubar">
              {navLinks.map(link => (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => link.children && setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '8px 12px', borderRadius: '8px',
                      color: '#475569', textDecoration: 'none',
                      fontSize: '0.88rem', fontWeight: 500,
                      transition: 'all 0.2s',
                    }}
                    role="menuitem"
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#1b75bc';
                      e.currentTarget.style.background = 'rgba(27, 117, 188, 0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {link.label}
                    {link.children && <ChevronDown size={13} />}
                  </Link>

                  {/* Dropdown */}
                  {link.children && dropdown === link.label && (
                    <div
                      style={{
                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                        marginTop: '8px', minWidth: '210px', zIndex: 100,
                        background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)',
                        borderRadius: '12px', padding: '8px',
                        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
                        animation: 'slide-down 0.15s ease-out',
                      }}
                      role="menu"
                    >
                      {link.children.map(child => (
                        <Link
                          key={child.label}
                          href={child.href}
                          role="menuitem"
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '9px 12px', borderRadius: '8px',
                            color: '#475569', textDecoration: 'none',
                            fontSize: '0.85rem', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(27, 117, 188, 0.06)';
                            e.currentTarget.style.color = '#1b75bc';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#475569';
                          }}
                        >
                          <span style={{ color: '#1b75bc' }}>{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Search */}
              <button
                id="search-btn"
                onClick={() => setSearchOpen(o => !o)}
                aria-label={searchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'}
                aria-expanded={searchOpen}
                style={{
                  background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.08)',
                  borderRadius: '8px', padding: '8px', cursor: 'pointer', color: searchOpen ? '#1b75bc' : '#0f172a',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                }}
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link
                href="/favoris"
                style={{ position: 'relative', textDecoration: 'none' }}
                aria-label={`Favoris (${wishlistCount} article${wishlistCount !== 1 ? 's' : ''})`}
                className="desktop-nav"
              >
                <button
                  style={{
                    background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#0f172a',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                  }}
                >
                  <Heart size={18} />
                </button>
                {wishlistCount > 0 && (
                  <span aria-hidden="true" style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    background: '#ef4444', color: 'white', borderRadius: '50%',
                    width: '17px', height: '17px', fontSize: '0.62rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/panier"
                style={{ position: 'relative', textDecoration: 'none' }}
                aria-label={`Panier (${totalItems} article${totalItems !== 1 ? 's' : ''})`}
              >
                <button
                  style={{
                    background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
                    border: 'none', borderRadius: '8px', padding: '8px 14px',
                    cursor: 'pointer', color: 'white',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
                    fontWeight: 600, fontSize: '0.875rem',
                    boxShadow: totalItems > 0 ? '0 0 15px rgba(27,117,188,0.5)' : 'none',
                  }}
                >
                  <ShoppingCart size={17} />
                  <span className="desktop-nav">Panier</span>
                  {totalItems > 0 && (
                    <span aria-hidden="true" style={{
                      background: 'rgba(255,255,255,0.25)', borderRadius: '20px',
                      padding: '1px 7px', fontSize: '0.75rem',
                    }}>
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Account - desktop only */}
              <Link href="/compte" style={{ textDecoration: 'none' }} aria-label="Mon compte" className="desktop-nav">
                <button
                  style={{
                    background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#0f172a',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <User size={18} />
                </button>
              </Link>

              {/* Mobile menu toggle button */}
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
                className="mobile-only"
                style={{
                  background: 'rgba(15, 23, 42, 0.05)', border: '1px solid rgba(15, 23, 42, 0.12)',
                  borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#0f172a',
                  display: 'none', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div style={{ padding: '0 0 16px', position: 'relative', animation: 'slide-down 0.2s ease-out' }}>
              <form onSubmit={handleSearch} role="search">
                <label htmlFor="search-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                  Rechercher un produit
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    id="search-input"
                    ref={searchRef}
                    type="search"
                    placeholder="Rechercher... (chargeur, montre, écouteurs...)"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="sentech-input"
                    style={{ paddingLeft: '42px', paddingRight: '80px' }}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    style={{
                      position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                      background: '#1b75bc', border: 'none', borderRadius: '6px',
                      padding: '5px 12px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                    }}
                  >
                    Chercher
                  </button>
                </div>
              </form>
              {/* Search suggestions */}
              {suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, zIndex: 200,
                  background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)',
                  borderRadius: '12px', padding: '8px', marginTop: '4px',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
                }}>
                  {suggestions.map(p => (
                    <Link
                      key={p.id}
                      href={`/produit/${p.id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 12px', borderRadius: '8px',
                        textDecoration: 'none', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,117,188,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ width: '36px', height: '36px', position: 'relative', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="36px" />
                      </div>
                      <div>
                        <div style={{ color: '#0f172a', fontSize: '0.875rem', fontWeight: 500 }}>{p.name}</div>
                        <div style={{ color: '#475569', fontSize: '0.75rem' }}>{p.category}</div>
                      </div>
                      <span style={{ marginLeft: 'auto', color: '#1b75bc', fontWeight: 700, fontSize: '0.85rem' }}>
                        {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div style={{
            background: '#ffffff', borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            padding: '16px 24px 24px',
            animation: 'slide-down 0.2s ease-out',
            maxHeight: 'calc(100vh - 70px)', overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
          }}>
            {navLinks.map(link => (
              <div key={link.label} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => setMobileCategoriesOpen(o => !o)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 0', color: '#0f172a', background: 'none', border: 'none',
                        fontWeight: 600, fontSize: '1rem', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span>{link.label}</span>
                      {mobileCategoriesOpen ? <ChevronUp size={16} color="#1b75bc" /> : <ChevronDown size={16} color="#475569" />}
                    </button>
                    {mobileCategoriesOpen && (
                      <div style={{ paddingLeft: '12px', paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {link.children.map(child => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 12px', borderRadius: '8px', color: '#475569',
                              textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                              background: 'rgba(15, 23, 42, 0.02)',
                            }}
                          >
                            <span style={{ color: '#1b75bc' }}>{child.icon}</span>
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 0', color: '#0f172a', textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile action buttons */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <Link href="/panier" onClick={() => setMobileOpen(false)} style={{ flex: 1, textDecoration: 'none' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}>
                  <ShoppingCart size={16} /> Panier {totalItems > 0 && `(${totalItems})`}
                </button>
              </Link>
              <Link href="/favoris" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '12px 16px', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Favoris">
                  <Heart size={16} color="#0f172a" />
                  {wishlistCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '-4px', right: '-4px',
                      background: '#ef4444', color: 'white', borderRadius: '50%',
                      width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{wishlistCount}</span>
                  )}
                </button>
              </Link>
              <Link href="/compte" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }} aria-label="Mon compte">
                  <User size={16} color="#0f172a" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: '98px' }} aria-hidden="true" />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
