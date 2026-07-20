'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { products, categories, formatPrice } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';
import type { Product } from '@/lib/products';

const sortOptions = [
  { value: 'default',   label: 'Par défaut' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc',label: 'Prix décroissant' },
  { value: 'rating',    label: 'Meilleures notes' },
  { value: 'newest',    label: 'Nouveautés' },
  { value: 'discount',  label: 'Meilleures réductions' },
  { value: 'best-seller', label: 'Meilleures ventes' },
];

// Extract Sidebar as top-level component to avoid remount issue
interface SidebarProps {
  productData: Product[];
  selectedCat: string;
  maxPrice: number;
  sort: string;
  onCatChange: (cat: string) => void;
  onMaxPriceChange: (v: number) => void;
  onQuickFilter: (s: string) => void;
  onClose?: () => void;
}

function Sidebar({ productData, selectedCat, maxPrice, sort, onCatChange, onMaxPriceChange, onQuickFilter, onClose }: SidebarProps) {
  const categoryCounts = useMemo(() =>
    Object.fromEntries(categories.map(c => [c.name, productData.filter(p => p.category === c.name).length])),
    [productData]
  );

  return (
    <div style={{
      background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
      borderRadius: '16px', padding: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--color-foreground)', fontWeight: 700, fontSize: '1rem' }}>Filtres</h2>
        {onClose && (
          <button onClick={onClose} aria-label="Fermer les filtres" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category */}
      <fieldset style={{ border: 'none', padding: 0, marginBottom: '24px' }}>
        <legend style={{ color: 'var(--color-sentech-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'block' }}>
          Catégorie
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => onCatChange('')}
            aria-pressed={!selectedCat}
            style={{
              padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: !selectedCat ? 'rgba(27,117,188,0.08)' : 'transparent',
              color: !selectedCat ? '#1b75bc' : 'var(--color-sentech-muted)', fontSize: '0.875rem',
              display: 'flex', justifyContent: 'space-between',
            }}
          >
            <span>Toutes</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{productData.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => onCatChange(cat.name)}
              aria-pressed={selectedCat === cat.name}
              style={{
                padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: selectedCat === cat.name ? 'rgba(27,117,188,0.08)' : 'transparent',
                color: selectedCat === cat.name ? '#1b75bc' : 'var(--color-sentech-muted)',
                fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span>{cat.icon} {cat.name}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{categoryCounts[cat.name]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Price range */}
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="price-range" style={{ display: 'block', color: 'var(--color-sentech-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          Prix maximum
        </label>
        <input
          id="price-range"
          type="range" min={0} max={200000} step={1000}
          value={maxPrice}
          onChange={e => onMaxPriceChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#1b75bc' }}
          aria-valuemin={0}
          aria-valuemax={200000}
          aria-valuenow={maxPrice}
          aria-valuetext={formatPrice(maxPrice)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
          <span>0 FCFA</span>
          <span style={{ color: '#1b75bc', fontWeight: 600 }}>≤ {formatPrice(maxPrice)}</span>
        </div>
      </div>

      {/* Quick filters */}
      <div>
        <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Filtres rapides
        </p>
        {[
          { label: '🔥 En promo', value: 'discount' },
          { label: '⭐ Mieux notés', value: 'rating' },
          { label: '✨ Nouveautés', value: 'newest' },
          { label: '🏆 Meilleures ventes', value: 'best-seller' },
        ].map(f => (
          <button
            key={f.label}
            onClick={() => onQuickFilter(f.value)}
            aria-pressed={sort === f.value}
            style={{
              display: 'block', width: '100%', padding: '8px 12px', borderRadius: '8px',
              border: 'none', cursor: 'pointer', textAlign: 'left', marginBottom: '4px',
              background: sort === f.value ? 'rgba(27,117,188,0.08)' : 'transparent',
              color: sort === f.value ? '#1b75bc' : 'var(--color-sentech-muted)', fontSize: '0.875rem',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const initialCat    = searchParams.get('cat') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort   = searchParams.get('sort') || 'default';

  const [search, setSearch]           = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [sort, setSort]               = useState(initialSort);
  const [maxPrice, setMaxPrice]       = useState(200000);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage]               = useState(1);
  const [productData, setProductData] = useState(products);
  const PER_PAGE = 12;

  // Load admin-managed products from localStorage (synced from Admin Dashboard)
  useEffect(() => {
    const loadProducts = () => {
      try {
        const saved = localStorage.getItem('adminProductList');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setProductData(parsed);
        }
      } catch {}
    };
    loadProducts();
    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  const resetPage = useCallback(() => setPage(1), []);

  const handleCat = useCallback((cat: string) => { setSelectedCat(cat); resetPage(); setSidebarOpen(false); }, [resetPage]);
  const handleSort = useCallback((s: string) => { setSort(s); resetPage(); }, [resetPage]);
  const handlePrice = useCallback((v: number) => { setMaxPrice(v); resetPage(); }, [resetPage]);

  const filtered = useMemo(() => {
    let result = [...productData];
    if (search) result = result.filter(p =>
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

  const clearFilters = () => { setSearch(''); setSelectedCat(''); setSort('default'); setMaxPrice(200000); setPage(1); };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title" style={{ marginBottom: '8px' }}>
          La <span className="sentech-gradient-text">Boutique</span>
        </h1>
        <p style={{ color: '#475569', fontSize: '0.9rem' }}>
          {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          {selectedCat && ` dans "${selectedCat}"`}
          {search && ` pour "${search}"`}
        </p>
      </div>

      {/* Search & Sort bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
          <label htmlFor="boutique-search" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Rechercher un produit
          </label>
          <Search size={17} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} aria-hidden="true" />
          <input
            id="boutique-search"
            type="search"
            placeholder="Rechercher un produit, une marque..."
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage(); }}
            className="input-dark"
            style={{ paddingLeft: '42px' }}
          />
        </div>
        <label htmlFor="boutique-sort" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Trier par
        </label>
        <select
          id="boutique-sort"
          value={sort}
          onChange={e => handleSort(e.target.value)}
          style={{
            background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
            color: 'var(--color-foreground)', borderRadius: '10px', padding: '12px 16px',
            cursor: 'pointer', fontSize: '0.875rem', minWidth: '170px',
          }}
        >
          {sortOptions.map(o => <option key={o.value} value={o.value} style={{ background: 'var(--color-sentech-card)', color: 'var(--color-foreground)' }}>{o.label}</option>)}
        </select>
        {/* Mobile filter toggle */}
        <button
          id="boutique-filter-mobile"
          onClick={() => setSidebarOpen(o => !o)}
          aria-expanded={sidebarOpen}
          aria-label="Afficher les filtres"
          className="btn-secondary mobile-filter-btn"
          style={{ display: 'none' }}
        >
          <SlidersHorizontal size={16} />
          Filtres
          {(selectedCat || sort !== 'default' || maxPrice < 200000) && (
            <span style={{
              background: '#1b75bc', color: 'white', borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>!</span>
          )}
        </button>
      </div>

      {/* Active filters */}
      {(selectedCat || search || sort !== 'default' || maxPrice < 200000) && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#475569' }}>Filtres actifs :</span>
          {selectedCat && (
            <button onClick={() => handleCat('')} style={{
              padding: '3px 10px 3px 12px', borderRadius: '100px',
              background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
              color: '#1b75bc', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
            }}>
              {selectedCat} <X size={11} />
            </button>
          )}
          {search && (
            <button onClick={() => { setSearch(''); resetPage(); }} style={{
              padding: '3px 10px 3px 12px', borderRadius: '100px',
              background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
              color: '#1b75bc', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer',
            }}>
              &ldquo;{search}&rdquo; <X size={11} />
            </button>
          )}
          <button onClick={clearFilters} style={{
            padding: '3px 10px', borderRadius: '100px',
            background: 'transparent', border: '1px solid var(--color-sentech-border)',
            color: '#475569', fontSize: '0.78rem', cursor: 'pointer',
          }}>
            Effacer tout
          </button>
        </div>
      )}

      {/* Boutique layout */}
      <div className="boutique-layout">
        {/* Mobile sidebar backdrop overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 1999,
            }}
            className="mobile-only"
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside className={`boutique-sidebar${sidebarOpen ? ' open' : ''}`}>
          <Sidebar
            productData={productData}
            selectedCat={selectedCat}
            maxPrice={maxPrice}
            sort={sort}
            onCatChange={handleCat}
            onMaxPriceChange={handlePrice}
            onQuickFilter={handleSort}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Products */}
        <section aria-label="Résultats">
          {paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#475569' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ color: 'var(--color-foreground)', marginBottom: '8px' }}>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
              <button onClick={clearFilters} className="btn-primary" style={{ marginTop: '20px' }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
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
                        background: page === i + 1 ? 'linear-gradient(135deg, #1b75bc, #0d528c)' : 'rgba(15, 23, 42, 0.04)',
                        border: page === i + 1 ? 'none' : '1px solid var(--color-sentech-border)',
                        color: page === i + 1 ? 'white' : 'var(--color-foreground)', cursor: 'pointer', fontWeight: page === i + 1 ? 700 : 400,
                        boxShadow: page === i + 1 ? '0 0 15px rgba(27, 117, 188, 0.2)' : 'none',
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
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
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
