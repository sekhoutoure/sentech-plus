'use client';

import { X } from 'lucide-react';

interface PromoModalProps {
  onClose: () => void;
  onSavePromo: (e: React.FormEvent) => void;
  promoCode: string;
  setPromoCode: (v: string) => void;
  promoDiscount: string;
  setPromoDiscount: (v: string) => void;
  promoExpires: string;
  setPromoExpires: (v: string) => void;
}

export default function PromoModal({
  onClose,
  onSavePromo,
  promoCode,
  setPromoCode,
  promoDiscount,
  setPromoDiscount,
  promoExpires,
  setPromoExpires,
}: PromoModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
            Créer un Code Promo
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-sentech-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSavePromo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
              Code Promo (ex: REDUC25) *
            </label>
            <input
              type="text"
              required
              placeholder="SENTECH25"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className="sentech-input"
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
              Valeur de la réduction
            </label>
            <input
              type="text"
              placeholder="25% ou 5000 FCFA"
              value={promoDiscount}
              onChange={e => setPromoDiscount(e.target.value)}
              className="sentech-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
              Date d&apos;expiration
            </label>
            <input
              type="text"
              value={promoExpires}
              onChange={e => setPromoExpires(e.target.value)}
              className="sentech-input"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
            >
              Créer le Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
