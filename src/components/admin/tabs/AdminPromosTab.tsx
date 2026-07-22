'use client';

import { Plus, Trash2 } from 'lucide-react';

interface AdminPromosTabProps {
  promosList: any[];
  onAddPromoClick: () => void;
  onDeletePromoClick: (code: string) => void;
}

export default function AdminPromosTab({
  promosList,
  onAddPromoClick,
  onDeletePromoClick,
}: AdminPromosTabProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>Codes Promo & Réductions</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-sentech-muted)' }}>Gérez les coupons et réductions actifs sur la boutique.</p>
        </div>
        <button
          onClick={onAddPromoClick}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} /> Créer un code promo
        </button>
      </div>

      <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-sentech-dark)' }}>
                {['Code Promo', 'Réduction', 'Type', 'Utilisations', 'Statut', 'Expiration', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promosList.map(promo => (
                <tr key={promo.code} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                  <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'monospace' }}>{promo.code}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 700 }}>{promo.discount}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-sentech-muted)', fontSize: '0.85rem' }}>{promo.type}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{promo.uses} fois</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                      background: promo.status === 'Actif' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: promo.status === 'Actif' ? '#10b981' : '#ef4444',
                    }}>
                      {promo.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>{promo.expires}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => onDeletePromoClick(promo.code)}
                      aria-label={`Supprimer ${promo.code}`}
                      style={{
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444',
                        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem',
                      }}
                    >
                      <Trash2 size={13} /> Désactiver
                    </button>
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
