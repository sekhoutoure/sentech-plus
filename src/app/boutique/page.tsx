'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react';
import { products, categories, formatPrice } from '@/lib/products';
import { fetchProducts } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';
import type { Product } from '@/lib/products';

const sortOptions = [
  { value: 'default',     label: 'Par défaut' },
  { value: 'price-asc',   label: 'Prix ↑' },
  { value: 'price-desc',  label: 'Prix ↓' },
  { value: 'rating',      label: 'Mieux notés' },
  { value: 'newest',      label: 'Nouveautés' },
  { value: 'discount',    label: 'Meilleures réductions' },
  { value: 'best-seller', label: 'Meilleures ventes' },
];

const quickFilters = [
  { label: '🔥 En promo',          value: 'discount' },
  { label: '⭐ Mieux notés',       value: 'rating' },
  { label: '✨ Nouveautés',        value: 'newest' },
  { label: '🏆 Meilleures ventes', value: 'best-seller' },
];

function BoutiqueContent() {
  const searchParams  = useSearchParams();
  const initialCat    = searchParams.get('cat') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort   = searchParams.get('sort') || 'default';

  const [search, setSearch]           = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [sort, setSort]               = useState(initialSort);
  const [maxPrice, setMaxPrice]       = useState(200000);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [page, setPage]               = useState(1);
  const [productData, setProductData] = useState<Product[]>(products);
  const [loading, setLoading]         = useState(true);
  const PER_PAGE = 12;

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        if (data && data.length > 0) setProductData(data as any);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadProducts();
  }, []);

  const resetPage = useCallback(() => setPage(1), []);

  const handleCat   = useCallback((cat: string) => { setSelectedCat(cat); resetPage(); }, [resetPage]);
  const handleSort  = useCallback((s: string)   => { setSort(s); resetPage(); }, [resetPage]);
  const handlePrice = useCallback((v: number)   => { setMaxPrice(v); resetPage(); }, [resetPage]);

  const clearFilters = () => { setSearch(''); setSelectedCat(''); setSort('default'); setMaxPrice(200000); setPage(1); };

  const filtered = useMemo(() => {
    let result = [...productData];
    if (search)      result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
    if (selectedCat) result = result.filter(p => p.category === selectedCat);
    result = result.filter(p => p.price <= maxPrice);
    switch (sort) {
      case 'price-asc':    result.sort((a, b) => a.price - b.price); break;
      case 'price-desc':   result.sort((a, b) => b.price - a.price); break;
      case 'rating':       result.sort((a, b) => b.rating - a.rating); break;
      case 'newest':       result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'discount':     result.sort((a, b) => b.discount - a.discount); break;
      case 'best-seller':  result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
    }
    return result;
  }, [search, selectedCat, sort, maxPrice, productData]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hasActiveFilters = selectedCat || search || sort !== 'default' || maxPrice < 200000;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

      {/* ── En-tête ── */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-title" style={{ marginBottom: '4px' }}>
          La <span className="sentech-gradient-text">Boutique</span>
        </h1>
        {/* IHM WCAG 1.3.1 — aria-live: annonce dynamique du nombre de résultats */}
        <p
          aria-live="polite"
          aria-atomic="true"
          style={{ color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}
        >
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          {selectedCat && ` · ${selectedCat}`}
          {search && ` · « ${search} »`}
        </p>
      </div>

      {/* ════════════════════════════════════════════
          BARRE DE FILTRES HORIZONTALE (toujours visible)
      ════════════════════════════════════════════ */}
      <div style={{
        background: 'var(--color-sentech-card)',
        border: '1px solid var(--color-sentech-border)',
        borderRadius: '14px', padding: '14px 16px',
        marginBottom: '20px',
        position: 'sticky', top: '68px', zIndex: 50,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Ligne 1 : Recherche + tri + filtres avancés */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Recherche */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <label htmlFor="boutique-search" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Rechercher
            </label>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} aria-hidden="true" />
            <input
              id="boutique-search"
              type="search"
              placeholder="Rechercher un produit, une marque..."
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              style={{
                width: '100%', paddingLeft: '36px', paddingRight: '12px',
                height: '38px', borderRadius: '8px',
                border: '1px solid var(--color-sentech-border)',
                background: 'var(--color-background)',
                fontSize: '0.85rem', color: 'var(--color-foreground)',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(27,117,188,0.4)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-sentech-border)'; }}
            />
          </div>

          {/* Tri select */}
          <label htmlFor="boutique-sort" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Trier par
          </label>
          <select
            id="boutique-sort"
            value={sort}
            onChange={e => handleSort(e.target.value)}
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-sentech-border)',
              color: 'var(--color-foreground)',
              borderRadius: '8px', padding: '0 12px',
              height: '38px', cursor: 'pointer',
              fontSize: '0.85rem', minWidth: '160px',
            }}
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}
                style={{ background: 'var(--color-sentech-card)', color: 'var(--color-foreground)' }}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Bouton filtres avancés */}
          <button
            id="boutique-advanced-filters"
            onClick={() => setAdvancedOpen(o => !o)}
            aria-expanded={advancedOpen}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '0 14px', height: '38px', borderRadius: '8px',
              border: '1px solid var(--color-sentech-border)',
              background: advancedOpen ? 'rgba(27,117,188,0.08)' : 'var(--color-background)',
              color: advancedOpen ? '#1b75bc' : 'var(--color-foreground)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
          >
            <SlidersHorizontal size={15} />
            Filtres
            {hasActiveFilters && (
              <span style={{
                background: '#1b75bc', color: 'white', borderRadius: '50%',
                width: '17px', height: '17px', fontSize: '0.62rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>!</span>
            )}
            <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: advancedOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {/* Effacer tout */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '0 12px', height: '38px', borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.05)', color: '#ef4444',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <X size={13} /> Effacer
            </button>
          )}
        </div>

        {/* Ligne 2 : Catégories chips (toujours visibles) — IHM: ✓ sur actif, 44px */}
        <div
          className="scroll-fade-both"
          role="group"
          aria-label="Filtrer par catégorie"
          style={{
            display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '12px',
            paddingBottom: '4px', scrollbarWidth: 'none',
          }}
        >
          {/* Toutes */}
          <button
            onClick={() => handleCat('')}
            aria-pressed={!selectedCat}
            style={{
              flexShrink: 0, padding: '0 14px', borderRadius: '100px',
              minHeight: '44px',
              border: `1px solid ${!selectedCat ? '#1b75bc' : 'var(--color-sentech-border)'}`,
              background: !selectedCat ? 'rgba(27,117,188,0.10)' : 'transparent',
              color: !selectedCat ? '#1b75bc' : '#475569',
              fontSize: '0.8rem', fontWeight: !selectedCat ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}
          >
            {!selectedCat && <span aria-hidden="true">&#10003;&nbsp;</span>}
            Toutes ({productData.length})
          </button>

          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => handleCat(cat.name)}
              aria-pressed={selectedCat === cat.name}
              style={{
                flexShrink: 0, padding: '0 14px', borderRadius: '100px',
                minHeight: '44px',
                border: `1px solid ${selectedCat === cat.name ? '#1b75bc' : 'var(--color-sentech-border)'}`,
                background: selectedCat === cat.name ? 'rgba(27,117,188,0.10)' : 'transparent',
                color: selectedCat === cat.name ? '#1b75bc' : '#475569',
                fontSize: '0.8rem', fontWeight: selectedCat === cat.name ? 700 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}
            >
              {selectedCat === cat.name && <span aria-hidden="true">&#10003;&nbsp;</span>}
              {cat.icon} {cat.name}
            </button>
          ))}

          {/* Separateur */}
          <div aria-hidden="true" style={{ width: '1px', background: 'var(--color-sentech-border)', flexShrink: 0, margin: '8px 4px' }} />

          {/* Quick-filters — IHM: ✓ + 44px */}
          {quickFilters.map(f => (
            <button
              key={f.value}
              onClick={() => handleSort(sort === f.value ? 'default' : f.value)}
              aria-pressed={sort === f.value}
              style={{
                flexShrink: 0, padding: '0 14px', borderRadius: '100px',
                minHeight: '44px',
                border: `1px solid ${sort === f.value ? '#1b75bc' : 'var(--color-sentech-border)'}`,
                background: sort === f.value ? 'rgba(27,117,188,0.10)' : 'transparent',
                color: sort === f.value ? '#1b75bc' : '#475569',
                fontSize: '0.8rem', fontWeight: sort === f.value ? 700 : 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
              }}
            >
              {sort === f.value && <span aria-hidden="true">&#10003;&nbsp;</span>}
              {f.label}
            </button>
          ))}
        </div>

        {/* Panneau avancé collapsible — Prix max */}
        {advancedOpen && (
          <div style={{
            marginTop: '14px', paddingTop: '14px',
            borderTop: '1px solid var(--color-sentech-border)',
            animation: 'slide-down 0.15s ease-out',
          }}>
            <label htmlFor="price-range" style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              Prix maximum
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <input
                id="price-range"
                type="range" min={0} max={200000} step={1000}
                value={maxPrice}
                onChange={e => handlePrice(Number(e.target.value))}
                style={{ flex: 1, minWidth: '200px', accentColor: '#1b75bc' }}
                aria-valuemin={0} aria-valuemax={200000}
                aria-valuenow={maxPrice} aria-valuetext={formatPrice(maxPrice)}
              />
              <span style={{ color: '#1b75bc', fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', minWidth: '120px' }}>
                ≤ {formatPrice(maxPrice)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Produits ── */}
      <section aria-label="Résultats de la boutique">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : paginated.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'var(--color-sentech-card)',
            borderRadius: '16px', border: '1px solid var(--color-sentech-border)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Aucun produit trouvé
            </h3>
            <p style={{ color: '#64748b' }}>Essayez de modifier vos filtres ou votre recherche.</p>
            <button onClick={clearFilters} className="btn-secondary" style={{ marginTop: '20px' }}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px', flexWrap: 'wrap' }}>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    aria-label={`Page ${i + 1}`}
                    aria-current={page === i + 1 ? 'page' : undefined}
                    style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: page === i + 1 ? 'linear-gradient(135deg, #1b75bc, #0d528c)' : 'var(--color-sentech-card)',
                      border: page === i + 1 ? 'none' : '1px solid var(--color-sentech-border)',
                      color: page === i + 1 ? 'white' : 'var(--color-foreground)',
                      cursor: 'pointer', fontWeight: page === i + 1 ? 700 : 400,
                      boxShadow: page === i + 1 ? '0 0 14px rgba(27,117,188,0.2)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </>
        )}
      </section>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        div[style*="scrollbar-width"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Suspense fallback={
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
          <SkeletonGrid count={12} />
        </div>
      }>
        <BoutiqueContent />
      </Suspense>
    </div>
  );
}
