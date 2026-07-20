'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/products';

export default function FavorisPage() {
  const { items, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleRemove = (productId: string, name: string) => {
    toggleWishlist(items.find(i => i.id === productId)!);
    showToast(`${name} retiré des favoris`, 'info');
  };

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart(item);
    showToast(`${item.name} ajouté au panier !`, 'success');
  };

  const handleAddAll = () => {
    items.forEach(item => addToCart(item));
    showToast(`${items.length} articles ajoutés au panier !`, 'success');
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link href="/boutique" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '8px' }}>
              <ArrowLeft size={16} /> Continuer les achats
            </Link>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart size={28} color="#ef4444" fill="#ef4444" />
              Mes Favoris
              <span style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '20px', padding: '2px 12px', fontSize: '1rem' }}>
                {items.length}
              </span>
            </h1>
          </div>
          {items.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddAll}
                className="btn-primary"
                style={{ fontSize: '0.875rem' }}
              >
                <ShoppingCart size={16} /> Tout ajouter au panier
              </button>
              <button
                onClick={() => { clearWishlist(); showToast('Favoris vidés', 'info'); }}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}
              >
                <Trash2 size={16} /> Vider les favoris
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{
              width: '100px', height: '100px', margin: '0 auto 24px',
              background: 'rgba(239,68,68,0.08)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(239,68,68,0.15)',
            }}>
              <Heart size={44} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '12px' }}>
              Aucun favori pour l&apos;instant
            </h2>
            <p style={{ color: '#475569', marginBottom: '28px', maxWidth: '360px', margin: '0 auto 28px' }}>
              Explorez notre boutique et ajoutez vos produits préférés à vos favoris !
            </p>
            <Link href="/boutique" className="btn-primary">
              <ShoppingCart size={18} /> Découvrir la boutique
            </Link>
          </div>
        )}

        {/* Products grid */}
        {items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {items.map(item => (
              <div key={item.id} className="sentech-card" style={{ overflow: 'hidden' }}>
                {/* Image */}
                <Link href={`/produit/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ position: 'relative', paddingTop: '75%', background: 'var(--color-sentech-dark)', overflow: 'hidden' }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    />
                    {item.discount > 0 && (
                      <span className="badge-discount" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#1b75bc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    {item.category}
                  </div>
                  <Link href={`/produit/${item.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '10px', lineHeight: 1.4 }}>
                      {item.name}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-foreground)' }}>{formatPrice(item.price)}</span>
                    {item.oldPrice > item.price && (
                      <span className="price-old" style={{ fontSize: '0.8rem' }}>{formatPrice(item.oldPrice)}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className="btn-primary"
                      style={{ flex: 1, padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                      aria-label={`Ajouter ${item.name} au panier`}
                    >
                      <ShoppingCart size={15} />
                      {item.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      style={{
                        padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444', display: 'flex', alignItems: 'center',
                        transition: 'all 0.2s',
                      }}
                      aria-label={`Retirer ${item.name} des favoris`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
