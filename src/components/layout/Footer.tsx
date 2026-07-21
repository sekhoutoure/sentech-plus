'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Mail, Phone, MapPin, Lock, Truck, ShieldCheck, Heart, Send,
  HelpCircle, PackageCheck, RotateCcw, FileText, Building2, Store, Newspaper, Users2, Briefcase,
  MessageCircle, Share2, Globe, Video, AtSign
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

const socialLinks = [
  { Icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/221770000000' },
  { Icon: AtSign, label: 'Instagram', href: '#' },
  { Icon: Share2, label: 'Facebook', href: '#' },
  { Icon: Video, label: 'TikTok', href: '#' },
  { Icon: Globe, label: 'Website', href: '#' },
];

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Veuillez saisir une adresse email valide.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const { subscribeNewsletter } = await import('@/lib/supabase');
      const res = await subscribeNewsletter(email);
      
      if (res.error) {
        showToast('Erreur lors de l\'abonnement. Veuillez réessayer.', 'error');
      } else if (res.alreadySubscribed) {
        showToast('Vous êtes déjà abonné(e) à notre newsletter !', 'info');
        setEmail('');
      } else {
        showToast('🎉 Merci ! Vous êtes abonné(e) avec succès.', 'success');
        setEmail('');
      }
    } catch {
      showToast('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--color-sentech-border)', color: '#0f172a' }} aria-label="Pied de page">
      
      {/* ── Trust Reassurance Banner ── */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-sentech-border)', padding: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          {[
            { icon: <Truck size={20} color="#1b75bc" />, title: 'Livraison Express 24h', desc: 'À Dakar & dans les régions' },
            { icon: <ShieldCheck size={20} color="#10b981" />, title: 'Garantie Constructeur', desc: 'Produits 100% officiels & certifiés' },
            { icon: <RotateCcw size={20} color="#f59e0b" />, title: 'Retours Faciles 7J', desc: 'Satisfait ou remboursé' },
            { icon: <Lock size={20} color="#8b5cf6" />, title: 'Paiement Sécurisé', desc: 'Cash, Wave & Orange Money' },
          ].map(b => (
            <div key={b.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--color-sentech-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                {b.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{b.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Multi-Column Footer Content ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '80px 24px 40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '60px',
        }}>

          {/* COL 1: LOGO & DESCRIPTION & RÉSEAUX SOCIAUX */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href="/" aria-label="SenTech Plus — Accueil" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '170px', height: '42px' }}>
                <Image
                  src="/logo_horizontal_v2.png"
                  alt="SenTech Plus"
                  fill
                  sizes="170px"
                  style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
                  priority
                />
              </div>
            </Link>

            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.7', maxWidth: '380px', marginBottom: '24px' }}>
              La référence du matériel High-Tech et des accessoires d&apos;origine au Sénégal. Qualité certifiée, garantie officielle et service client d&apos;excellence.
            </p>

            {/* Contact quick items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', fontSize: '0.88rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#1b75bc" />
                <span>Service Client : <strong style={{ color: '#0f172a' }}>+221 77 000 00 00</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#1b75bc" />
                <a href="mailto:contact@sentechplus.com" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600 }}>contact@sentechplus.com</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#1b75bc" />
                <span>Showroom à Liberté 6, Dakar, Sénégal</span>
              </div>
            </div>

            {/* Réseaux Sociaux */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Suivez-nous sur les Réseaux
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {socialLinks.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: '#f8fafc', border: '1px solid var(--color-sentech-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#475569', textDecoration: 'none',
                      transition: 'all 250ms ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = '#1b75bc';
                      e.currentTarget.style.borderColor = '#1b75bc';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = 'var(--color-sentech-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COL 2: CATÉGORIES */}
          <div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '20px', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Catégories
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              {[
                'Téléphones', 'Accessoires', 'Audio', 'Gaming', 'PC', 'Montres', 'Chargeurs', 'Power Bank'
              ].map(cat => (
                <li key={cat}>
                  <Link
                    href={`/boutique?cat=${encodeURIComponent(cat)}`}
                    style={{ color: '#475569', textDecoration: 'none', transition: 'all 200ms ease', fontWeight: 500 }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; e.currentTarget.style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.paddingLeft = '0px'; }}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: SERVICE CLIENT */}
          <div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '20px', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Service Client
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              {[
                { label: 'Centre d\'aide & FAQ', href: '/contact' },
                { label: 'Suivi de commande', href: '/compte' },
                { label: 'Livraisons & Délais', href: '/contact' },
                { label: 'Retours & Remboursements', href: '/contact' },
                { label: 'Garanties & SAV', href: '/contact' },
                { label: 'Conditions Générales (CGV)', href: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{ color: '#475569', textDecoration: 'none', transition: 'all 200ms ease', fontWeight: 500 }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; e.currentTarget.style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.paddingLeft = '0px'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4: ENTREPRISE */}
          <div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '20px', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Entreprise
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              {[
                { label: 'À propos de SenTech Plus', href: '/a-propos' },
                { label: 'Notre Boutique à Dakar', href: '/contact' },
                { label: 'Blog High-Tech & Test', href: '/blog' },
                { label: 'Recrutement & Carrières', href: '/contact' },
                { label: 'Partenariats & Vente B2B', href: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{ color: '#475569', textDecoration: 'none', transition: 'all 200ms ease', fontWeight: 500 }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; e.currentTarget.style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.paddingLeft = '0px'; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 5: NEWSLETTER */}
          <div>
            <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '20px', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Newsletter
            </h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '16px', lineHeight: '1.6' }}>
              Abonnez-vous pour recevoir en avant-première nos offres exclusives et codes promos.
            </p>

            <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                required
                placeholder="votre.email@domaine.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="sentech-input"
                style={{ fontSize: '0.88rem', background: '#f8fafc' }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: '46px', fontSize: '0.9rem' }}
              >
                {loading ? 'Abonnement...' : <><Send size={16} /> S&apos;abonner</>}
              </button>
            </form>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '10px', display: 'block' }}>
              🔒 Pas de spam. Désinscription facile à tout moment.
            </span>
          </div>

        </div>

        {/* ── Bottom Bar & Copyright ── */}
        <div style={{
          borderTop: '1px solid var(--color-sentech-border)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.85rem',
          color: '#64748b',
        }}>
          <div>
            © 2026 <strong>SenTech Plus</strong>. Tous droits réservés.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
            Fait avec <Heart size={15} color="#ef4444" fill="#ef4444" /> au Sénégal
          </div>

          {/* Payment Accepted Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['💵 Cash', '📲 Wave', '📱 Orange Money', '💳 Visa / Mastercard'].map(pay => (
              <span key={pay} style={{
                padding: '4px 10px', borderRadius: '8px', background: '#f8fafc',
                border: '1px solid var(--color-sentech-border)', fontSize: '0.75rem', fontWeight: 700, color: '#475569'
              }}>
                {pay}
              </span>
            ))}
          </div>
        </div>

      </div>

    </footer>
  );
}
