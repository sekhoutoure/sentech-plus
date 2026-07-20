import Link from 'next/link';
import { Zap, Users, Award, Heart, Globe, ShoppingCart } from 'lucide-react';

export const metadata = {
  title: 'À propos | SenTech Plus',
  description: 'Découvrez l\'histoire et les valeurs de SenTech Plus, votre boutique premium d\'accessoires high-tech.',
};

export default function AProposPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '100px 24px 80px',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(27,117,188,0.04) 0%, transparent 60%), var(--color-background)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 28px',
            background: 'linear-gradient(135deg, #1b75bc, #a1b1c2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(27,117,188,0.4)', fontSize: '2rem',
          }}>
            <Zap size={36} color="white" fill="white" />
          </div>
          <h1 className="section-title" style={{ marginBottom: '16px', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Notre <span className="sentech-gradient-text">histoire</span>
          </h1>
          <p style={{ color: 'var(--color-sentech-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            SenTech Plus est née d&apos;une passion pour la technologie et d&apos;une vision simple :
            rendre les meilleurs gadgets high-tech accessibles à tous en Afrique de l&apos;Ouest.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 className="section-title" style={{ marginBottom: '12px' }}>
            Nos <span className="sentech-gradient-text">valeurs</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { icon: <Award size={28} />, title: 'Qualité Premium', desc: 'Nous sélectionnons rigoureusement chaque produit pour garantir une qualité irréprochable à nos clients.' },
            { icon: <Heart size={28} />, title: 'Satisfaction client', desc: 'Votre satisfaction est notre priorité absolue. Nous sommes là pour vous accompagner à chaque étape.' },
            { icon: <Globe size={28} />, title: 'Accessibilité', desc: 'Rendre la technologie premium accessible à tous les budgets en Afrique de l\'Ouest.' },
            { icon: <Users size={28} />, title: 'Communauté', desc: 'Nous construisons une communauté de passionnés de technologie partageant les mêmes valeurs.' },
          ].map(v => (
            <div key={v.title} className="sentech-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '16px', margin: '0 auto 20px',
                background: 'rgba(27,117,188,0.1)', border: '1px solid rgba(27,117,188,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1b75bc',
              }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: '1.6' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(27,117,188,0.05), transparent)',
        borderTop: '1px solid var(--color-sentech-border)',
        borderBottom: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }} className="about-stats-grid">
          {[
            { value: '10,000+', label: 'Clients satisfaits' },
            { value: '500+', label: 'Produits disponibles' },
            { value: '4.9★', label: 'Note moyenne' },
            { value: '3 ans', label: 'D\'expérience' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1b75bc', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
                {s.value}
              </div>
              <div style={{ color: '#475569', fontSize: '0.875rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
          Prêt à découvrir nos produits ?
        </h2>
        <p style={{ color: '#475569', marginBottom: '32px' }}>
          Explorez notre boutique et trouvez les gadgets parfaits pour votre quotidien.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/boutique">
            <button className="btn-primary" style={{ padding: '14px 32px' }}>
              <ShoppingCart size={18} /> Voir la boutique
            </button>
          </Link>
          <Link href="/contact">
            <button className="btn-secondary" style={{ padding: '14px 32px' }}>
              Nous contacter
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
