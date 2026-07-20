'use client';

import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} style={{ animation: 'fade-in 0.3s ease-out', width: '100%' }}>
      {children}
    </div>
  );
}
