'use client';

import { useState, useEffect } from 'react';
import { Timer, Flame, Zap, Headphones, Watch, BatteryCharging, Gamepad2 } from 'lucide-react';
import { products, Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import CountdownTimer from '@/components/ui/CountdownTimer';

const promoEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export default function PromotionsPage() {
  const [productData, setProductData] = useState<Product[]>(products);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem('adminProductList');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setProductData(parsed);
        }
      } catch {}
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const promoProducts = productData.filter(p => p.isPromo);
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
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
            fontSize: '0.85rem', color: '#f87171', fontWeight: 600,
          }}>
            <Flame size={14} color="#ef4444" /> Offres Flash Limitées
          </div>
          <h1 className="section-title" style={{ marginBottom: '16px', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Jusqu&apos;à <span style={{ color: '#ef4444' }}>-40%</span> de réduction
          </h1>
          <p style={{ color: 'var(--color-sentech-muted)', fontSize: '1.05rem', marginBottom: '40px' }}>
            {promoProducts.length} produits en promotion. Dépêchez-vous, les stocks sont limités !
          </p>
          <CountdownTimer targetDate={promoEnd} label="Offres se terminent dans" />
        </div>
      </section>

      {/* Promo categories quick nav */}
      <section style={{ padding: '32px 24px', background: 'var(--color-background)', borderBottom: '1px solid var(--color-sentech-border)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'Chargeurs', discount: '-36%', icon: <Zap size={14} color="#ef4444" /> },
            { label: 'Écouteurs', discount: '-34%', icon: <Headphones size={14} color="#ef4444" /> },
            { label: 'Montres', discount: '-33%', icon: <Watch size={14} color="#ef4444" /> },
            { label: 'Batteries', discount: '-33%', icon: <BatteryCharging size={14} color="#ef4444" /> },
            { label: 'Gaming', discount: '-35%', icon: <Gamepad2 size={14} color="#ef4444" /> },
          ].map(item => (
            <div key={item.label} style={{
              padding: '10px 20px', borderRadius: '100px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer',
            }}>
              {item.icon}
              <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>{item.discount}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '60px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
            {promoProducts.length} produits en promotion
          </h2>
          <span style={{ color: '#475569', fontSize: '0.875rem' }}>
            <Timer size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Offres limitées
          </span>
        </div>
        <div className="product-grid">
          {promoProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
