'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, LogOut, Gift, Award, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useToast } from '@/context/ToastContext';

export default function ComptePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('orders');
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState('Moussa Diallo');
  const [userEmail, setUserEmail] = useState('moussa.diallo@example.com');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      showToast('Veuillez vous connecter pour accéder à votre compte.', 'info');
      router.replace('/login');
    } else {
      setTimeout(() => {
        setAuthorized(true);
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        if (name) setUserName(name);
        if (email) setUserEmail(email);
      }, 0);
    }
  }, [router, showToast]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    showToast('Déconnexion réussie.', 'info');
    router.replace('/login');
    // Notify layout/navbar of auth state change
    window.dispatchEvent(new Event('storage'));
  };

  const user = {
    name: userName,
    email: userEmail,
    phone: '+221 77 123 45 67',
    city: 'Dakar, Sénégal',
    loyaltyPoints: 350,
    memberSince: 'Janvier 2025',
    tier: 'Membre VIP Gold',
  };

  const orders = [
    { id: '#CMD-2847', date: '16 Juillet 2026', total: 15900, status: 'Livré', items: '1x Chargeur GaN 65W Pro' },
    { id: '#CMD-2712', date: '28 Mai 2026', total: 24900, status: 'Livré', items: '1x Écouteurs TWS Pro X1' },
    { id: '#CMD-2544', date: '10 Avril 2026', total: 8500, status: 'Livré', items: '1x Câble USB-C 100W Premium' },
  ];

  if (!authorized) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.95rem' }}>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '32px', fontFamily: 'Outfit, sans-serif' }}>
          Mon <span className="sentech-gradient-text">Compte</span>
        </h1>

        <div className="compte-layout">
          {/* Profile Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="sentech-card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1b75bc, #a1b1c2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontWeight: 800, color: 'white', fontSize: '1.8rem',
              }}>
                {user.name ? user.name[0] : 'U'}
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '4px' }}>{user.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-sentech-muted)', marginBottom: '16px', overflowWrap: 'break-word' }}>{user.email}</p>
              
              <div style={{ background: 'rgba(27,117,188,0.06)', border: '1px solid rgba(27,117,188,0.15)', borderRadius: '12px', padding: '12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={20} color="#1b75bc" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Statut Fidélité</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-foreground)', fontWeight: 700 }}>{user.tier}</div>
                </div>
              </div>
            </div>

            {/* Menu options */}
            <div className="sentech-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { id: 'orders', label: 'Mes Commandes', icon: <ShoppingBag size={16} /> },
                { id: 'loyalty', label: 'Programme Fidélité', icon: <Gift size={16} /> },
                { id: 'address', label: 'Mes Adresses', icon: <MapPin size={16} /> },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: activeSection === item.id ? 'rgba(27,117,188,0.08)' : 'transparent',
                    color: activeSection === item.id ? '#1b75bc' : 'var(--color-sentech-muted)',
                    fontSize: '0.875rem', fontWeight: activeSection === item.id ? 600 : 400,
                    textAlign: 'left', width: '100%', transition: 'all 0.2s',
                  }}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: 'transparent', color: '#ef4444',
                  fontSize: '0.875rem', textAlign: 'left', width: '100%', transition: 'all 0.2s',
                }}
              >
                <LogOut size={16} /> Se déconnecter
              </button>
            </div>
          </div>

          {/* Section detail */}
          <div className="sentech-card" style={{ padding: '32px' }}>
            {activeSection === 'orders' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>Historique des commandes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{
                      padding: '16px', borderRadius: '12px',
                      background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <span style={{ color: '#1b75bc', fontWeight: 700, fontSize: '0.9rem' }}>{order.id}</span>
                          <span style={{ fontSize: '0.75rem', color: '#475569' }}>{order.date}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-sentech-muted)' }}>{order.items}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '6px' }}>{formatPrice(order.total)}</div>
                        <span style={{
                          padding: '2px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600,
                          background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)'
                        }}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'loyalty' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>Programme Fidélité</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1b75bc', fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>{user.loyaltyPoints}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-sentech-muted)' }}>Points cumulés</div>
                  </div>
                  <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '8px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>15% de réduction</div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>Prochain palier dans 50 pts</div>
                  </div>
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(27,117,188,0.04)', border: '1px solid rgba(27,117,188,0.15)', display: 'flex', gap: '12px' }}>
                  <Clock size={20} color="#1b75bc" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ color: 'var(--color-foreground)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Comment ça marche ?</h4>
                    <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      Gagnez 1 point pour chaque 1000 FCFA dépensé. Échangez vos points contre des codes promos (ex: 200 points = 10% de réduction).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'address' && (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>Adresses de livraison</h3>
                <div style={{ padding: '20px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '0.72rem', color: '#1b75bc', fontWeight: 600, background: 'rgba(27,117,188,0.08)', padding: '2px 8px', borderRadius: '4px' }}>Principale</span>
                  <h4 style={{ color: 'var(--color-foreground)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>Domicile</h4>
                  <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {user.name}<br />
                    Mermoz Pyrotechnie, Villa 42<br />
                    Dakar, Sénégal<br />
                    {user.phone}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
