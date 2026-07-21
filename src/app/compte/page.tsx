'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MapPin, LogOut, Gift, Award, Clock, User, Mail, Phone, Edit3, Save, X, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { useToast } from '@/context/ToastContext';
import { fetchOrdersByEmail } from '@/lib/supabase';

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: string;
};

const STATUS_COLORS: Record<string, { bg: string; color: string; icon: string }> = {
  'en_attente':   { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: '⏳' },
  'confirmé':     { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', icon: '✅' },
  'en_livraison': { bg: 'rgba(139,92,246,0.1)',  color: '#8b5cf6', icon: '🚚' },
  'livré':        { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', icon: '📦' },
  'annulé':       { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', icon: '❌' },
  'Livré':        { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', icon: '📦' },
};

export default function ComptePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('orders');
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userCity, setUserCity] = useState('Dakar, Sénégal');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      showToast('Veuillez vous connecter pour accéder à votre compte.', 'info');
      router.replace('/login');
    } else {
      setAuthorized(true);
      const name = localStorage.getItem('userName') || 'Utilisateur';
      const email = localStorage.getItem('userEmail') || '';
      const phone = localStorage.getItem('userPhone') || '';
      const city = localStorage.getItem('userCity') || 'Dakar, Sénégal';
      setUserName(name);
      setUserEmail(email);
      setUserPhone(phone);
      setUserCity(city);
      setEditName(name);
      setEditPhone(phone);
      setEditCity(city);

      // Fetch real orders from Supabase
      if (email) {
        setOrdersLoading(true);
        fetchOrdersByEmail(email).then(({ data }) => {
          if (data && data.length > 0) {
            const formatted: Order[] = data.map((o: any) => ({
              id: `#CMD-${o.id.substring(0, 6).toUpperCase()}`,
              date: new Date(o.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
              total: o.total_amount,
              status: o.status || 'en_attente',
              items: Array.isArray(o.items) && o.items.length > 0
                ? `${o.items.length} article${o.items.length > 1 ? 's' : ''} · ${o.items[0]?.name || ''}`
                : 'Commande',
            }));
            setOrders(formatted);
          }
          setOrdersLoading(false);
        });
      }
    }
  }, [router, showToast]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userCity');
    showToast('Déconnexion réussie.', 'info');
    router.replace('/login');
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    showToast('Mise à jour en cours...', 'info');

    try {
      // Import dynamically or use a quick fetch to Supabase (if we had the client exposed)
      // Wait, we need to import supabase at the top!
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.updateUser({
        data: { name: editName, phone: editPhone, city: editCity }
      });

      if (error) {
        console.error("Erreur de mise à jour profil", error);
        showToast('Erreur lors de la sauvegarde.', 'error');
        return;
      }
      
      setUserName(editName);
      setUserPhone(editPhone);
      setUserCity(editCity);
      localStorage.setItem('userName', editName);
      localStorage.setItem('userPhone', editPhone);
      localStorage.setItem('userCity', editCity);
      showToast('Profil mis à jour de façon permanente !', 'success');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
      showToast('Erreur réseau.', 'error');
    }
  };

  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const loyaltyPoints = orders.reduce((sum, o) => sum + Math.floor(o.total / 1000), 0);

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '90px' }}>
        <div style={{ textAlign: 'center', color: '#475569' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          Chargement...
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'Mes commandes', icon: <Package size={16} /> },
    { id: 'profile', label: 'Mon profil', icon: <User size={16} /> },
    { id: 'loyalty', label: 'Fidélité', icon: <Gift size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', background: 'var(--color-background)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Profile header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f1a2e, #1b3b6a)',
          borderRadius: '20px', padding: '32px', marginBottom: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1b75bc, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 900, fontSize: '1.5rem', flexShrink: 0,
              border: '3px solid rgba(255,255,255,0.2)',
            }}>
              {initials || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>
                Membre SenTech Plus
              </div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Outfit, sans-serif' }}>
                {userName}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{userEmail}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>{orders.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Commandes</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.5rem' }}>{loyaltyPoints}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>Points</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '10px 16px', color: '#fca5a5',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}>
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px', border: '1px solid',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
                background: activeSection === tab.id ? '#1b75bc' : 'var(--color-sentech-card)',
                color: activeSection === tab.id ? 'white' : '#475569',
                borderColor: activeSection === tab.id ? '#1b75bc' : 'var(--color-sentech-border)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ORDERS */}
        {activeSection === 'orders' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '20px' }}>
              Historique des commandes
            </h2>
            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                Chargement de vos commandes...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-sentech-card)', borderRadius: '16px', border: '1px solid var(--color-sentech-border)' }}>
                <ShoppingBag size={48} style={{ color: 'var(--color-sentech-border)', margin: '0 auto 16px' }} />
                <p style={{ color: '#475569', marginBottom: '20px' }}>Vous n&apos;avez pas encore de commande.</p>
                <a href="/boutique" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#1b75bc', color: 'white', padding: '12px 24px',
                  borderRadius: '10px', textDecoration: 'none', fontWeight: 700,
                }}>
                  Découvrir la boutique
                </a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.map(order => {
                  const statusStyle = STATUS_COLORS[order.status] || { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', icon: '📋' };
                  return (
                    <div key={order.id} style={{
                      background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                      borderRadius: '14px', padding: '20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '10px',
                          background: statusStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1.2rem', flexShrink: 0,
                        }}>
                          {statusStyle.icon}
                        </div>
                        <div>
                          <div style={{ color: 'var(--color-foreground)', fontWeight: 700, fontSize: '0.95rem' }}>{order.id}</div>
                          <div style={{ color: '#475569', fontSize: '0.8rem' }}>{order.date}</div>
                          <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '2px' }}>{order.items}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--color-foreground)', fontSize: '1rem' }}>
                          {formatPrice(order.total)}
                        </div>
                        <span style={{
                          padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                          background: statusStyle.bg, color: statusStyle.color,
                        }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE */}
        {activeSection === 'profile' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)' }}>Mon profil</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(27,117,188,0.1)', border: '1px solid rgba(27,117,188,0.2)',
                  borderRadius: '8px', padding: '8px 16px', color: '#1b75bc',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                }}>
                  <Edit3 size={15} /> Modifier
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setIsEditing(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                    borderRadius: '8px', padding: '8px 14px', color: '#475569',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    <X size={14} /> Annuler
                  </button>
                  <button onClick={handleSaveProfile} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#1b75bc', border: 'none',
                    borderRadius: '8px', padding: '8px 16px', color: 'white',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    <Save size={14} /> Sauvegarder
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { icon: <User size={18} />, label: 'Nom complet', value: userName, key: 'name', editable: true, editValue: editName, onChange: setEditName },
                { icon: <Mail size={18} />, label: 'Email', value: userEmail, key: 'email', editable: false, editValue: userEmail, onChange: () => {} },
                { icon: <Phone size={18} />, label: 'Téléphone', value: userPhone || 'Non renseigné', key: 'phone', editable: true, editValue: editPhone, onChange: setEditPhone },
                { icon: <MapPin size={18} />, label: 'Ville', value: userCity, key: 'city', editable: true, editValue: editCity, onChange: setEditCity },
              ].map(field => (
                <div key={field.key} style={{
                  background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                  borderRadius: '14px', padding: '20px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#1b75bc' }}>
                    {field.icon}
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#475569' }}>
                      {field.label}
                    </span>
                  </div>
                  {isEditing && field.editable ? (
                    <input
                      type="text"
                      value={field.editValue}
                      onChange={e => field.onChange(e.target.value)}
                      className="input-dark"
                      style={{ fontSize: '0.9rem' }}
                    />
                  ) : (
                    <p style={{ color: 'var(--color-foreground)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {field.value}
                    </p>
                  )}
                  {!field.editable && isEditing && (
                    <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: '4px' }}>Non modifiable</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOYALTY */}
        {activeSection === 'loyalty' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '20px' }}>Programme de fidélité</h2>
            <div style={{
              background: 'linear-gradient(135deg, #0f1a2e, #1b3b6a)',
              borderRadius: '20px', padding: '32px', marginBottom: '24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fbbf24', marginBottom: '8px' }}>
                {loyaltyPoints}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>Points de fidélité accumulés</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Niveau', value: loyaltyPoints >= 500 ? '🥇 Gold' : loyaltyPoints >= 200 ? '🥈 Silver' : '🥉 Bronze' },
                  { label: 'Commandes', value: orders.length },
                  { label: 'Valeur totale', value: formatPrice(orders.reduce((s, o) => s + o.total, 0)) },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{stat.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {[
                { points: 100, reward: '5% de réduction sur votre prochaine commande', unlocked: loyaltyPoints >= 100 },
                { points: 250, reward: 'Livraison gratuite offerte', unlocked: loyaltyPoints >= 250 },
                { points: 500, reward: '15% de réduction + cadeau surprise', unlocked: loyaltyPoints >= 500 },
                { points: 1000, reward: 'Accès VIP aux ventes privées', unlocked: loyaltyPoints >= 1000 },
              ].map(reward => (
                <div key={reward.points} style={{
                  background: 'var(--color-sentech-card)', border: `1px solid ${reward.unlocked ? 'rgba(251,191,36,0.4)' : 'var(--color-sentech-border)'}`,
                  borderRadius: '14px', padding: '20px',
                  opacity: reward.unlocked ? 1 : 0.6,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24' }}>{reward.points} pts</span>
                    {reward.unlocked ? <CheckCircle size={18} color="#10b981" /> : <AlertCircle size={18} color="#475569" />}
                  </div>
                  <p style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 500 }}>{reward.reward}</p>
                  <p style={{ fontSize: '0.72rem', color: reward.unlocked ? '#10b981' : '#475569', marginTop: '8px', fontWeight: 600 }}>
                    {reward.unlocked ? '✓ Débloqué' : `Encore ${reward.points - loyaltyPoints} points`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
