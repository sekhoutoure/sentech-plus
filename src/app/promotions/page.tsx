'use client';

import { useState, useEffect } from 'react';
import { Timer, Flame, Zap, Headphones, Watch, BatteryCharging, Gamepad2 } from 'lucide-react';
import { products, Product } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import CountdownTimer from '@/components/ui/CountdownTimer';

const promoEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export default function PromotionsPage() {
  const [productData, setProductData] = useState<Product[]>(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        if (data && data.length > 0) setProductData(data as any);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const promoProducts = productData.filter(p => p.isPromo || p.discount > 0);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      {/* Hero */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.06) 0%, transparent 60%), var(--color-background)',
        textAlign: 'center',
        borderBottom: '1px solid var(--color-sentech-border)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
            fontSize: '0.85rem', color: '#ef4444', fontWeight: 600,
          }}>
            <Flame size={14} color="#ef4444" /> Flash Sales — Offres limitées
          </div>
          <h1 className="section-title" style={{ marginBottom: '16px', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            🔥 Promotions <span className="sentech-gradient-text">Exceptionnelles</span>
          </h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '32px' }}>
            {promoProducts.length} offre{promoProducts.length > 1 ? 's' : ''} en cours · Profitez-en avant la fin !
          </p>

          {/* Countdown */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '14px', padding: '14px 24px',
          }}>
            <Timer size={18} color="#ef4444" />
            <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
              Fin des offres dans :
            </span>
            <CountdownTimer targetDate={promoEnd} />
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '60px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            Chargement des offres...
          </div>
        ) : promoProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎁</div>
            <p style={{ color: '#475569', fontSize: '1.1rem' }}>
              Aucune promotion active pour le moment.<br />
              <span style={{ color: '#1b75bc', fontWeight: 600 }}>Revenez bientôt — les offres arrivent !</span>
            </p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '32px' }}>
              🔥 {promoProducts.length} produit{promoProducts.length > 1 ? 's' : ''} en promotion
            </h2>
            <div className="products-grid">
              {promoProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
