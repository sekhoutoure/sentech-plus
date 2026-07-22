'use client';

import { Zap, Sliders, RefreshCw } from 'lucide-react';

interface AdminControlTabProps {
  siteAnnouncement: string;
  setSiteAnnouncement: (val: string) => void;
  whatsappPhone: string;
  setWhatsappPhone: (val: string) => void;
  shippingFee: string;
  setShippingFee: (val: string) => void;
  storeStatus: string;
  setStoreStatus: (val: string) => void;
  onSaveSiteSettings: (e: React.FormEvent) => void;
  onResetSiteSettings: () => void;
}

export default function AdminControlTab({
  siteAnnouncement,
  setSiteAnnouncement,
  whatsappPhone,
  setWhatsappPhone,
  shippingFee,
  setShippingFee,
  storeStatus,
  setStoreStatus,
  onSaveSiteSettings,
  onResetSiteSettings,
}: AdminControlTabProps) {
  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(27,117,188,0.1)', color: '#1b75bc', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          <Zap size={14} color="#1b75bc" /> Contrôle Total 1000%
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
          Pouvoir Administrateur Globale du Site
        </h2>
        <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Prenez le contrôle direct sur la bande d&apos;annonce supérieure, le statut général de la boutique, la livraison et les numéros clients en direct.
        </p>
      </div>

      <form onSubmit={onSaveSiteSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Bande d'annonce supérieure */}
        <div style={{
          padding: '24px', borderRadius: '16px', background: 'var(--color-sentech-card)',
          border: '1px solid var(--color-sentech-border)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sliders size={20} color="#1b75bc" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
              Bande d&apos;Annonce Supérieure (Top Banner)
            </h3>
          </div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-sentech-muted)', marginBottom: '8px' }}>
            Texte affiché tout en haut de la barre de navigation sur toutes les pages :
          </label>
          <input
            type="text"
            value={siteAnnouncement}
            onChange={e => setSiteAnnouncement(e.target.value)}
            className="sentech-input"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>

        {/* 2. Paramètres de Boutique & WhatsApp */}
        <div style={{
          padding: '24px', borderRadius: '16px', background: 'var(--color-sentech-card)',
          border: '1px solid var(--color-sentech-border)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Numéro WhatsApp Client
            </label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={e => setWhatsappPhone(e.target.value)}
              className="sentech-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Frais de Livraison (FCFA)
            </label>
            <input
              type="number"
              value={shippingFee}
              onChange={e => setShippingFee(e.target.value)}
              className="sentech-input"
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
              Statut Général de la Boutique
            </label>
            <select
              value={storeStatus}
              onChange={e => setStoreStatus(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: '1px solid var(--color-sentech-border)',
                background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
                fontSize: '0.9rem', fontWeight: 600,
              }}
            >
              <option value="En ligne">🟢 En ligne (Boutique active 24h/7j)</option>
              <option value="Promo Flash">🔥 Mode Grandes Promotions (Bannière spéciale)</option>
              <option value="Maintenance">🟠 Mode Maintenance (Accès restreint)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button type="submit" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            <Zap size={18} /> Appliquer les changements 1000%
          </button>
          <button
            type="button"
            onClick={onResetSiteSettings}
            className="btn-secondary"
            style={{ padding: '14px 20px', fontSize: '0.875rem' }}
          >
            <RefreshCw size={16} /> Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
}
