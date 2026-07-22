'use client';

import { Search, Mail } from 'lucide-react';
import { formatPrice } from '@/lib/products';

interface AdminCustomersTabProps {
  filteredCustomers: any[];
  customerSearch: string;
  setCustomerSearch: (val: string) => void;
  onContactCustomer: (email: string) => void;
}

export default function AdminCustomersTab({
  filteredCustomers,
  customerSearch,
  setCustomerSearch,
  onContactCustomer
}: AdminCustomersTabProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px', width: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ville..."
            value={customerSearch}
            onChange={e => setCustomerSearch(e.target.value)}
            className="sentech-input"
            style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
        <div className="admin-table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-sentech-dark)' }}>
                {['Réf', 'Nom complet', 'Email', 'Ville', 'Commandes', 'Total Dépensé', 'Statut Client', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(cust => (
                <tr key={cust.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                  <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>{cust.id}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{cust.name}</td>
                  <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>{cust.email}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.85rem' }}>{cust.city}</td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{cust.ordersCount} cmd</td>
                  <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.875rem', fontWeight: 700 }}>{formatPrice(cust.totalSpent)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                      background: cust.type === 'VIP' ? 'rgba(168,85,247,0.1)' : 'rgba(27,117,188,0.1)',
                      color: cust.type === 'VIP' ? '#a855f7' : '#1b75bc',
                    }}>
                      {cust.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => onContactCustomer(cust.email)}
                      style={{
                        background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
                        borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: '#1b75bc',
                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600,
                      }}
                    >
                      <Mail size={13} /> Contacter
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
