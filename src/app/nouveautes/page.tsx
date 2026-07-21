'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { products, Product } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

export default function NouveautesPage() {
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

  const newProducts = productData.filter(p => p.isNew);

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
          <p style={{ color: '#475569', fontSize: '1.05rem' }}>
            {loading ? 'Chargement...' : `${newProducts.length} nouveaux produits viennent d'arriver. Soyez parmi les premiers à les découvrir !`}
          </p>
        </div>
      </section>

      <section style={{ padding: '100px 24px', maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ marginTop: '30px' }}>
            <SkeletonGrid count={8} />
          </div>
        ) : newProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
            <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '24px' }}>
              De nouveaux produits arrivent très bientôt !<br/>
              Consultez notre boutique pour voir tout le catalogue.
            </p>
            <Link href="/boutique" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#1b75bc', color: 'white', padding: '12px 24px',
              borderRadius: '10px', textDecoration: 'none', fontWeight: 600,
            }}>
              Voir la boutique <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '40px' }}>
              ✨ {newProducts.length} nouveauté{newProducts.length > 1 ? 's' : ''}
            </h2>
            <div className="product-grid">
              {newProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
