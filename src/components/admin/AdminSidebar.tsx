'use client';

import Image from 'next/image';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  ShieldCheck, Settings, LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  tabs: string[];
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  tabs
}: AdminSidebarProps) {
  const icons: Record<string, React.ReactNode> = {
    'Tableau de bord': <LayoutDashboard size={18} />,
    'Produits': <Package size={18} />,
    'Commandes': <ShoppingBag size={18} />,
    'Clients': <Users size={18} />,
    'Promotions': <Tag size={18} />,
    'Pouvoir Admin': <ShieldCheck size={18} color="#1b75bc" />,
  };

  return (
    <aside style={{
      width: '240px', background: 'var(--color-sentech-card)', borderRight: '1px solid var(--color-sentech-border)',
      padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0,
    }} className="admin-sidebar">
      <div style={{ padding: '12px', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '130px', height: '32px', marginBottom: '4px' }}>
          <Image
            src="/logo_horizontal_v2.png"
            alt="SenTech Plus Admin"
            fill
            sizes="130px"
            style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
            priority
          />
        </div>
        <div style={{ fontSize: '0.65rem', color: '#1b75bc', letterSpacing: '2px', paddingLeft: '2px', fontWeight: 800 }}>SUPER ADMIN 1000%</div>
      </div>

      {tabs.map(tab => (
        <button
          key={tab}
          id={`admin-tab-${tab.toLowerCase().replace(/ /g, '-')}`}
          onClick={() => setActiveTab(tab)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: activeTab === tab ? 'rgba(27,117,188,0.08)' : 'transparent',
            color: activeTab === tab ? '#1b75bc' : 'var(--color-sentech-muted)',
            fontSize: '0.875rem', fontWeight: activeTab === tab ? 600 : 500,
            textAlign: 'left', width: '100%',
            borderLeft: activeTab === tab ? '3px solid #1b75bc' : '3px solid transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {icons[tab]}
          {tab}
        </button>
      ))}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '20px', borderTop: '1px solid var(--color-sentech-border)' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
          background: 'transparent', color: '#475569', fontSize: '0.875rem', width: '100%', textAlign: 'left',
        }}>
          <Settings size={18} /> Paramètres
        </button>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#ef4444', fontSize: '0.875rem', width: '100%', textAlign: 'left',
          }}
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
