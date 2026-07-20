import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getNewProducts } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';

export const metadata = {
  title: 'Nouveautés | SenTech Plus',
  description: 'Découvrez les derniers accessoires high-tech arrivés chez SenTech Plus.',
};

export default function NouveautesPage() {
  const newProducts = getNewProducts();

  return (
    <div>
      <section style={{
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(27,117,188,0.04) 0%, transparent 60%), var(--color-background)',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
            fontSize: '0.85rem', color: '#1b75bc', fontWeight: 600,
          }}>
            <Sparkles size={14} color="#1b75bc" /> Nouvelles arrivées
          </div>
          <h1 className="section-title" style={{ marginBottom: '16px', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Les <span className="sentech-gradient-text">Nouveautés</span>
          </h1>
          <p style={{ color: 'var(--color-sentech-muted)', fontSize: '1.05rem' }}>
            {newProducts.length} nouveaux produits viennent d&apos;arriver. Soyez parmi les premiers à les découvrir !
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="product-grid">
          {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/boutique">
            <button className="btn-secondary">
              Voir toute la boutique <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
