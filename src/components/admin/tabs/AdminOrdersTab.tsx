'use client';

import { Search } from 'lucide-react';
import { formatPrice } from '@/lib/products';

interface AdminOrdersTabProps {
  filteredOrders: any[];
  orderSearch: string;
  setOrderSearch: (val: string) => void;
  orderFilter: string;
  setOrderFilter: (val: string) => void;
  statusColors: Record<string, string>;
  onUpdateOrderStatus: (orderId: string, newStatus: string) => void;
}

export default function AdminOrdersTab({
  filteredOrders,
  orderSearch,
  setOrderSearch,
  orderFilter,
  setOrderFilter,
  statusColors,
  onUpdateOrderStatus
}: AdminOrdersTabProps) {
  return (
    <div>
      {/* Controls & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            placeholder="Rechercher par ID, client ou produit..."
            value={orderSearch}
            onChange={e => setOrderSearch(e.target.value)}
            className="sentech-input"
            style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Tous', 'En cours', 'Livré', 'En attente', 'Annulé'].map(st => (
            <button
              key={st}
              onClick={() => setOrderFilter(st)}
              style={{
                padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: orderFilter === st ? '#1b75bc' : 'var(--color-sentech-dark)',
                color: orderFilter === st ? 'white' : 'var(--color-sentech-muted)',
                fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-sentech-dark)' }}>
                {['N° Commande', 'Client', 'Article', 'Montant', 'Statut Actuel', 'Mettre à jour le statut', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                  <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.875rem', fontWeight: 700 }}>{order.id}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{order.customer}</div>
                    <div style={{ color: '#475569', fontSize: '0.75rem' }}>{order.email}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem' }}>{order.product}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 700 }}>{formatPrice(order.amount)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                      background: `${statusColors[order.status]}15`,
                      color: statusColors[order.status],
                      border: `1px solid ${statusColors[order.status]}40`,
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <select
                      value={order.status}
                      onChange={e => onUpdateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '6px 10px', borderRadius: '8px',
                        border: '1px solid var(--color-sentech-border)',
                        background: 'var(--color-sentech-dark)',
                        color: 'var(--color-foreground)',
                        fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                      }}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Livré">Livré</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
