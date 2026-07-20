import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SkipToContent from '@/components/ui/SkipToContent';

import PageTransition from '@/components/ui/PageTransition';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const BASE_URL = 'https://sentechplus.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SenTech Plus | Boutique d\'accessoires High-Tech et Gadgets Innovants',
    template: '%s | SenTech Plus',
  },
  description: 'Découvrez les meilleurs accessoires high-tech : chargeurs rapides, écouteurs Bluetooth, montres connectées, batteries externes et gadgets intelligents. Livraison rapide au Sénégal.',
  keywords: 'accessoires high-tech, gadgets intelligents, chargeur rapide, écouteurs Bluetooth, montre connectée, power bank, support téléphone, accessoires smartphone, technologie, boutique tech, Sénégal, Dakar',
  authors: [{ name: 'SenTech Plus', url: BASE_URL }],
  creator: 'SenTech Plus',
  publisher: 'SenTech Plus',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'SenTech Plus',
    title: 'SenTech Plus | Boutique d\'accessoires High-Tech et Gadgets Innovants',
    description: 'Découvrez les meilleurs accessoires high-tech : chargeurs rapides, écouteurs Bluetooth, montres connectées et gadgets innovants.',
    images: [{ url: '/hero.jpg', width: 1200, height: 630, alt: 'SenTech Plus - Smart Accessories' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SenTech Plus | Boutique High-Tech Premium',
    description: 'Chargeurs rapides, écouteurs Bluetooth, montres connectées et gadgets intelligents.',
    images: ['/hero.jpg'],
  },
  icons: { icon: '/favicon.ico' },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`} style={{ scrollBehavior: 'smooth' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['Store', 'OnlineStore'],
              name: 'SenTech Plus',
              description: 'Boutique d\'accessoires high-tech et gadgets innovants au Sénégal',
              url: BASE_URL,
              logo: `${BASE_URL}/logo.png`,
              image: `${BASE_URL}/hero.jpg`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dakar',
                addressCountry: 'SN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+221-77-000-00-00',
                email: 'contact@sentechplus.com',
                contactType: 'customer service',
                availableLanguage: 'French',
                contactOption: 'TollFree',
              },
              sameAs: [
                'https://facebook.com/sentechplus',
                'https://instagram.com/sentechplus',
                'https://twitter.com/sentechplus',
              ],
              priceRange: '$$',
              currenciesAccepted: 'XOF',
              paymentAccepted: 'Cash, Credit Card, Orange Money, MTN Mobile Money',
              openingHours: 'Mo-Su 08:00-20:00',
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: 'var(--font-inter, Inter), system-ui, sans-serif' }}>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <SkipToContent />
              <Navbar />
              <main id="main-content" aria-label="Contenu principal">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <ScrollToTop />
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
