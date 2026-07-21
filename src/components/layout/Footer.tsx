'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Mail, Phone, MapPin, Lock, Truck, RefreshCw, BadgeCheck, MessageCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

// SVG Social Icons
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const socialLinks = [
  { Icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/sentechplus' },
  { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/sentechplus' },
  { Icon: TwitterIcon, label: 'X (Twitter)', href: 'https://x.com/sentechplus' },
  { Icon: YouTubeIcon, label: 'YouTube', href: 'https://www.youtube.com/@sentechplus' },
];

const footerLinks = {
  boutique: [
    { label: 'Tous les produits', href: '/boutique' },
    { label: 'Nouveautés', href: '/nouveautes' },
    { label: 'Promotions', href: '/promotions' },
    { label: 'Meilleures ventes', href: '/boutique?sort=best-seller' },
  ],
  support: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Contactez-nous', href: '/contact' },
    { label: 'Suivi de commande', href: '/contact' },
    { label: 'Retours & échanges', href: '/contact' },
    { label: 'Garantie', href: '/contact' },
  ],
  legal: [
    { label: 'Mentions légales', href: '/contact' },
    { label: 'Confidentialité', href: '/contact' },
    { label: 'CGV', href: '/contact' },
    { label: 'Cookies', href: '/contact' },
  ],
};

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Veuillez saisir un email valide.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // @ts-ignore - we'll dynamically import or ensure it exists if not already imported at top
      const { subscribeNewsletter } = await import('@/lib/supabase');
      const res = await subscribeNewsletter(email);
      
      if (res.error) {
        showToast('Erreur lors de l\'abonnement. Veuillez réessayer.', 'error');
      } else if (res.alreadySubscribed) {
        showToast('Vous êtes déjà abonné(e) à notre newsletter !', 'info');
        setEmail('');
      } else {
        showToast('🎉 Merci ! Vous êtes maintenant abonné(e).', 'success');
        setEmail('');
      }
    } catch (err) {
      showToast('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ background: '#f8fafc', borderTop: '1px solid rgba(15, 23, 42, 0.08)', marginTop: '0' }} aria-label="Pied de page">
      {/* Trust bar */}
      <div style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.04)', background: 'rgba(27,117,188,0.04)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
            {([
              { Icon: Lock, label: 'Paiement sécurisé' },
              { Icon: Truck, label: 'Livraison rapide' },
              { Icon: RefreshCw, label: 'Retours 30 jours' },
              { Icon: BadgeCheck, label: 'Produits certifiés' },
              { Icon: MessageCircle, label: 'Support 7j/7' },
            ] as const).map(({ Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={16} color="#1b75bc" aria-hidden="true" />
                <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 24px 40px' }}>
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <Link href="/" aria-label="SenTech Plus — Accueil">
              <div style={{ position: 'relative', width: '160px', height: '40px', marginBottom: '20px' }}>
                <Image
                  src="/logo_horizontal_v2.png"
                  alt="SenTech Plus"
                  fill
                  sizes="160px"
                  style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
                />
              </div>
            </Link>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.7', maxWidth: '300px', marginBottom: '20px' }}>
              Votre boutique high-tech de confiance. Des gadgets premium, certifiés, avec une livraison rapide partout au Sénégal.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              <a href="tel:+221770000000" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}>
                <Phone size={15} color="#1b75bc" /> +221 77 000 00 00
              </a>
              <a href="mailto:contact@sentechplus.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}>
                <Mail size={15} color="#1b75bc" /> contact@sentechplus.com
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.875rem' }}>
                <MapPin size={15} color="#1b75bc" /> Dakar, Sénégal
              </div>
            </div>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#1b75bc';
                    e.currentTarget.style.background = 'rgba(27,117,188,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(27,117,188,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Boutique links */}
          <nav aria-label="Liens boutique">
            <h3 style={{ color: 'var(--color-foreground)', fontWeight: 700, marginBottom: '18px', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Boutique</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.boutique.map(link => (
                <li key={link.label}>
                  <Link href={link.href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support links */}
          <nav aria-label="Liens support">
            <h3 style={{ color: 'var(--color-foreground)', fontWeight: 700, marginBottom: '18px', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Support</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {footerLinks.support.map(link => (
                <li key={link.label}>
                  <Link href={link.href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h3 style={{ color: 'var(--color-foreground)', fontWeight: 700, marginBottom: '18px', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
              Newsletter
            </h3>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.6' }}>
              Recevez nos offres exclusives, nouveautés et conseils tech.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="footer-newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                Votre adresse e-mail
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="sentech-input"
                style={{ fontSize: '0.875rem' }}
              />
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                <Mail size={15} /> S&apos;abonner
              </button>
            </form>
            <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '10px' }}>
              Pas de spam. Désinscription en un clic.
            </p>

            {/* Legal links */}
            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {footerLinks.legal.map(link => (
                <Link key={link.label} href={link.href} style={{ color: '#475569', textDecoration: 'none', fontSize: '0.72rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#475569'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: '48px', paddingTop: '24px',
          borderTop: '1px solid rgba(15, 23, 42, 0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} SenTech Plus. Tous droits réservés.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569', marginRight: '4px' }}>Paiements sécurisés :</span>
            {['Orange Money', 'Wave', 'Carte Bancaire', 'Livraison Cash'].map(pay => (
              <span key={pay} style={{
                fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px',
                background: 'rgba(15, 23, 42, 0.04)', border: '1px solid rgba(15, 23, 42, 0.08)',
                color: '#475569', fontWeight: 600,
              }}>
                {pay}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#475569' }}>Fait avec ❤️ au Sénégal</span>
            <a
              href="https://sentechplus.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1b75bc'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
            >
              <ExternalLink size={12} /> sentechplus.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
