'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

interface AdminHeaderProps {
  activeTab: string;
}

export default function AdminHeader({ activeTab }: AdminHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header style={{
      padding: '20px 32px', borderBottom: '1px solid var(--color-sentech-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--color-sentech-card)',
    }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>{activeTab}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(o => !o)}
            style={{
              position: 'relative', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
              borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--color-foreground)',
              display: 'flex', alignItems: 'center', transition: 'all 0.2s ease',
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px',
              background: '#ef4444', borderRadius: '50%', fontSize: '0.6rem', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}>3</span>
          </button>

          {notificationsOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: '8px', width: '300px',
              background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
              borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)',
              zIndex: 200, animation: 'slide-down 0.2s ease-out',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-foreground)' }}>Notifications Récentes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(27,117,188,0.06)', color: 'var(--color-foreground)' }}>
                  <strong>🎉 Nouvelle commande</strong> #CMD-2847 reçue de Amadou Diallo (15,900 FCFA).
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(245,158,11,0.06)', color: 'var(--color-foreground)' }}>
                  <strong>⚠️ Stock faible</strong> pour &quot;Câble USB-C Tressé&quot; (reste 4 dispos).
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(16,185,129,0.06)', color: 'var(--color-foreground)' }}>
                  <strong>👤 Nouveau client</strong> inscrit : Mariama Koné.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px', borderRadius: '10px',
          background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: 'white', fontSize: '0.8rem',
          }}>A</div>
          <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>Super Admin</span>
        </div>
      </div>
    </header>
  );
}
