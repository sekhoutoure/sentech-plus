import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-background)',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '520px' }}>
        {/* Animated 404 */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            background: 'linear-gradient(135deg, #1b75bc, #2563eb, #a1b1c2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            letterSpacing: '-4px',
          }}>
            404
          </div>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(27,117,188,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(27,117,188,0.1), rgba(37,99,235,0.1))',
          border: '1px solid rgba(27,117,188,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '2rem',
        }}>
          🔍
        </div>

        <h1 style={{
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          fontWeight: 800, color: 'var(--color-foreground)',
          marginBottom: '12px', fontFamily: 'Outfit, sans-serif',
        }}>
          Page introuvable
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '36px' }}>
          Désolé, la page que vous cherchez n&apos;existe pas ou a été déplacée.<br />
          Explorez notre boutique pour trouver ce qu&apos;il vous faut.
        </p>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
            color: 'white', padding: '12px 24px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
            boxShadow: '0 4px 16px rgba(27,117,188,0.35)',
          }}>
            🏠 Accueil
          </Link>
          <Link href="/boutique" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
            color: 'var(--color-foreground)', padding: '12px 24px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
          }}>
            🛍️ Boutique
          </Link>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
            color: 'var(--color-foreground)', padding: '12px 24px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
          }}>
            📞 Contact
          </Link>
        </div>

        {/* Popular categories */}
        <div style={{ borderTop: '1px solid var(--color-sentech-border)', paddingTop: '24px' }}>
          <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Catégories populaires
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Chargeurs', href: '/boutique?cat=Chargeurs+Rapides' },
              { label: 'Écouteurs', href: '/boutique?cat=%C3%89couteurs+Bluetooth' },
              { label: 'Montres', href: '/boutique?cat=Montres+Connect%C3%A9es' },
              { label: 'Gaming', href: '/boutique?cat=Gaming' },
            ].map(c => (
              <Link key={c.label} href={c.href} style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                background: 'rgba(27,117,188,0.06)', border: '1px solid rgba(27,117,188,0.15)',
                color: '#1b75bc', textDecoration: 'none', transition: 'all 0.2s',
              }}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
