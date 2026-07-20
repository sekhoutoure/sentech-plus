export default function SkeletonCard() {
  return (
    <div className="sentech-card" style={{ overflow: 'hidden' }}>
      {/* Image skeleton */}
      <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
        <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
      </div>
      {/* Content skeleton */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="skeleton" style={{ height: '10px', width: '40%' }} />
        <div className="skeleton" style={{ height: '14px', width: '90%' }} />
        <div className="skeleton" style={{ height: '14px', width: '70%' }} />
        <div className="skeleton" style={{ height: '10px', width: '55%' }} />
        <div className="skeleton" style={{ height: '36px', marginTop: '8px', borderRadius: '10px' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
