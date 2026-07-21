'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SkipToContent from '@/components/ui/SkipToContent';
import ScrollToTop from '@/components/ui/ScrollToTop';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

// Pages qui ne doivent PAS afficher le Navbar ni le Footer
const NO_CHROME_ROUTES = ['/login', '/admin', '/admin/login', '/panier'];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Vérifie si le chemin actuel est dans la liste des pages sans header/footer
  const hideChrome = NO_CHROME_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SkipToContent />
      <Navbar />
      <main id="main-content" aria-label="Contenu principal">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </>
  );
}
