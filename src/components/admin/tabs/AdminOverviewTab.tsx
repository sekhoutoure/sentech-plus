'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { formatPrice, Product } from '@/lib/products';

interface AdminOverviewTabProps {
  statsList: Array<{
    label: string;
    value: string;
    change: string;
    up: boolean;
    icon: React.ReactNode;
  }>;
  ordersList: any[];
  productList: Product[];
  statusColors: Record<string, string>;
  setActiveTab: (tab: string) => void;
}

export default function AdminOverviewTab({
  statsList,
  ordersList,
  productList,
  statusColors,
  setActiveTab
}: AdminOverviewTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. CARTES STATISTIQUES (SaaS Cards) */}
      <div className="stats-grid-4">
        {statsList.map(s => (
          <div key={s.label} style={{
            padding: '24px', borderRadius: '20px',
            background: '#ffffff', border: '1px solid var(--color-sentech-border)',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '14px',
                background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.icon}
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                background: s.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: s.up ? '#10b981' : '#ef4444',
                border: `1px solid ${s.up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {s.change}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-inter, Inter), sans-serif', marginBottom: '4px', letterSpacing: '-0.5px' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. GRAPHIQUES (SaaS Visual Analytics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Chart 1: Évolution du Chiffre d'Affaires */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Évolution du Chiffre d&apos;Affaires</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Revenus mensuels 2026 (en FCFA)</p>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '100px' }}>
              +18.4% 📈
            </span>
          </div>

          {/* SVG Wave Line Chart */}
          <div style={{ width: '100%', height: '180px', position: 'relative' }}>
            <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1b75bc" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1b75bc" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,120 Q 80,40 160,80 T 320,30 T 500,10 L 500,150 L 0,150 Z"
                fill="url(#revenueGrad)"
              />
              <path
                d="M 0,120 Q 80,40 160,80 T 320,30 T 500,10"
                fill="none"
                stroke="#1b75bc"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="120" r="5" fill="#1b75bc" />
              <circle cx="120" cy="60" r="5" fill="#1b75bc" />
              <circle cx="240" cy="55" r="5" fill="#1b75bc" />
              <circle cx="360" cy="25" r="5" fill="#1b75bc" />
              <circle cx="500" cy="10" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, marginTop: '8px' }}>
            <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span>
          </div>
        </div>

        {/* Chart 2: Répartition par Catégorie */}
        <div style={{ background: '#ffffff', border: '1px solid var(--color-sentech-border)', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Ventes par Catégorie</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Répartition du catalogue des produits</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '130px', height: '130px', position: 'relative', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.8" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1b75bc" strokeWidth="3.8" strokeDasharray="35, 100" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3.8" strokeDasharray="28, 100" strokeDashoffset="-35" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="22, 100" strokeDashoffset="-63" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>100%</span>
                <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Catalogue</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1b75bc' }} /> Audio & Écouteurs
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>35%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} /> Chargeurs Rapides
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>28%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} /> Power Banks
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>22%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} /> Accessoires
                </span>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>15%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. DERNIÈRES COMMANDES & TOP VENTES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Dernières Commandes Table */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--color-sentech-border)',
          borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-sentech-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Dernières Commandes</h3>
            <button onClick={() => setActiveTab('Commandes')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              Voir tout <ChevronRight size={14} />
            </button>
          </div>
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Client', 'Produit', 'Montant', 'Statut'].map(h => (
                    <th key={h} style={{
                      padding: '12px 18px', textAlign: 'left',
                      fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px',
                      fontWeight: 700,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordersList.slice(0, 5).map(order => (
                  <tr key={order.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                    <td style={{ padding: '14px 18px', color: '#0f172a', fontSize: '0.88rem', fontWeight: 700 }}>
                      {order.customer}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#475569', fontSize: '0.85rem' }}>
                      {order.product}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#1b75bc', fontSize: '0.88rem', fontWeight: 800 }}>
                      {formatPrice(order.amount)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                        background: `${statusColors[order.status] || '#10b981'}15`,
                        color: statusColors[order.status] || '#10b981',
                        border: `1px solid ${statusColors[order.status] || '#10b981'}40`,
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Ventes Ranking List */}
        <div style={{
          background: '#ffffff', border: '1px solid var(--color-sentech-border)',
          borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(15,23,42,0.03)',
        }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>🔥 Top Ventes</h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Par volume de ventes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {productList.slice(0, 4).map((prod, rank) => (
              <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', borderRadius: '16px', background: '#f8fafc', border: '1px solid var(--color-sentech-border)' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: rank === 0 ? '#fbbf24' : rank === 1 ? '#cbd5e1' : rank === 2 ? '#b45309' : '#e2e8f0',
                  color: rank === 0 || rank === 2 ? '#ffffff' : '#0f172a',
                  fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  #{rank + 1}
                </div>
                <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', background: '#ffffff', border: '1px solid var(--color-sentech-border)', flexShrink: 0, padding: '4px' }}>
                  <Image src={prod.image} alt={prod.name} fill sizes="44px" style={{ objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {prod.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {48 - rank * 9} ventes · {formatPrice(prod.price)}
                  </div>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10b981', flexShrink: 0 }}>
                  +{18 - rank * 3}%
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
