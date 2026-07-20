import { Filter } from 'lucide-react';

export default function BoutiqueLoading() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }} className="animate-fade-in">
      
      {/* Header Skeleton */}
      <div style={{ 
        background: 'rgba(255,255,255,0.02)', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '30px 24px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ height: '32px', width: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '12px' }} className="animate-pulse" />
          <div style={{ height: '20px', width: '350px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} className="animate-pulse" />
        </div>
      </div>

      <div className="boutique-layout" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', display: 'flex', gap: '32px' }}>
        
        {/* Sidebar Skeleton */}
        <aside style={{ width: '280px', flexShrink: 0 }} className="desktop-nav">
          <div style={{ background: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <Filter size={18} color="#475569" />
              <div style={{ height: '20px', width: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} className="animate-pulse" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ height: '36px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} className="animate-pulse" />
              ))}
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ height: '20px', width: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '16px' }} className="animate-pulse" />
              <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '16px' }} className="animate-pulse" />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, height: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} className="animate-pulse" />
                <div style={{ flex: 1, height: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} className="animate-pulse" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div style={{ flex: 1 }}>
          {/* Top Controls Skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ height: '20px', width: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} className="animate-pulse" />
            <div style={{ height: '40px', width: '160px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} className="animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{ 
                background: '#141414', border: '1px solid rgba(255,255,255,0.06)', 
                borderRadius: '16px', overflow: 'hidden' 
              }}>
                {/* Image placeholder */}
                <div style={{ width: '100%', paddingTop: '100%', background: 'rgba(255,255,255,0.03)' }} className="animate-pulse" />
                
                {/* Content placeholder */}
                <div style={{ padding: '16px' }}>
                  <div style={{ height: '12px', width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '8px' }} className="animate-pulse" />
                  <div style={{ height: '16px', width: '90%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '8px' }} className="animate-pulse" />
                  <div style={{ height: '16px', width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '16px' }} className="animate-pulse" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                    <div style={{ height: '24px', width: '80px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px' }} className="animate-pulse" />
                    <div style={{ height: '16px', width: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} className="animate-pulse" />
                  </div>
                  <div style={{ height: '40px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} className="animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
