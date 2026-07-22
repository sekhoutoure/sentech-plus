'use client';

import Image from 'next/image';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';

interface AdminProductsTabProps {
  filteredProducts: Product[];
  productSearch: string;
  setProductSearch: (val: string) => void;
  productCategoryFilter: string;
  setProductCategoryFilter: (val: string) => void;
  productStockFilter: string;
  setProductStockFilter: (val: string) => void;
  productSortBy: string;
  setProductSortBy: (val: string) => void;
  onAddProductClick: () => void;
  onEditProductClick: (prod: Product) => void;
  onDeleteProductClick: (id: string, name: string) => void;
  onToggleStock: (id: string) => void;
}

export default function AdminProductsTab({
  filteredProducts,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  productStockFilter,
  setProductStockFilter,
  productSortBy,
  setProductSortBy,
  onAddProductClick,
  onEditProductClick,
  onDeleteProductClick,
  onToggleStock,
}: AdminProductsTabProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <label htmlFor="admin-search-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Rechercher un produit
            </label>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} aria-hidden="true" />
            <input
              id="admin-search-input"
              type="text"
              placeholder="Rechercher par nom..."
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              className="sentech-input"
              style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
            />
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={productCategoryFilter}
            onChange={e => setProductCategoryFilter(e.target.value)}
            style={{
              padding: '10px 12px', borderRadius: '10px',
              border: '1px solid var(--color-sentech-border)',
              background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <option value="Toutes">Toutes les catégories</option>
            <option value="Chargeurs Rapides">Chargeurs Rapides</option>
            <option value="Câbles Premium">Câbles Premium</option>
            <option value="Supports Téléphone">Supports Téléphone</option>
            <option value="Écouteurs Bluetooth">Écouteurs Bluetooth</option>
            <option value="Casques Audio">Casques Audio</option>
            <option value="Montres Connectées">Montres Connectées</option>
            <option value="Batteries Externes">Batteries Externes</option>
            <option value="Accessoires PC">Accessoires PC</option>
            <option value="Gaming">Gaming</option>
          </select>

          {/* Stock Filter Dropdown */}
          <select
            value={productStockFilter}
            onChange={e => setProductStockFilter(e.target.value)}
            style={{
              padding: '10px 12px', borderRadius: '10px',
              border: '1px solid var(--color-sentech-border)',
              background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <option value="Tous">Tous les stocks</option>
            <option value="instock">En stock uniquement</option>
            <option value="outstock">Rupture de stock</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={productSortBy}
            onChange={e => setProductSortBy(e.target.value)}
            style={{
              padding: '10px 12px', borderRadius: '10px',
              border: '1px solid var(--color-sentech-border)',
              background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            <option value="default">Tri : Défaut</option>
            <option value="name-asc">Nom (A-Z)</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="stock-desc">Stock le plus élevé</option>
            <option value="rating-desc">Meilleures notes</option>
          </select>
        </div>

        <button
          id="admin-add-product"
          onClick={onAddProductClick}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>

      <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-sentech-dark)' }}>
                {['Produit', 'Catégorie', 'Prix', 'Stock', 'Badges', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-sentech-dark)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600, display: 'block' }}>{p.name}</span>
                        <span style={{ color: '#475569', fontSize: '0.75rem' }}>{p.brand || 'SenTech'}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-sentech-muted)', fontSize: '0.85rem' }}>{p.category}</td>
                  <td style={{ padding: '14px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                      background: p.inStock ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: p.inStock ? '#10b981' : '#ef4444',
                    }}>
                      {p.inStock ? `${p.stockCount} en stock` : 'Rupture'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.isNew && <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(27,117,188,0.1)', color: '#1b75bc', fontWeight: 600 }}>Nouveau</span>}
                      {p.isBestSeller && <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 600 }}>Best-Seller</span>}
                      {p.isPromo && <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 600 }}>Promo</span>}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => onToggleStock(p.id)}
                        title={p.inStock ? 'Passer en rupture' : 'Remettre en stock'}
                        style={{
                          background: p.inStock ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                          border: p.inStock ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                          borderRadius: '6px', padding: '6px 8px', cursor: 'pointer',
                          color: p.inStock ? '#10b981' : '#ef4444',
                          fontSize: '0.75rem', fontWeight: 600,
                        }}
                      >
                        {p.inStock ? 'Stock OK' : 'Rupture'}
                      </button>
                      <button
                        onClick={() => onEditProductClick(p)}
                        aria-label={`Modifier ${p.name}`}
                        style={{
                          background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
                          borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#1b75bc',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600,
                        }}
                      >
                        <Edit size={13} /> Modifier
                      </button>
                      <button
                        onClick={() => onDeleteProductClick(p.id, p.name)}
                        aria-label={`Supprimer ${p.name}`}
                        style={{
                          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#ef4444',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
