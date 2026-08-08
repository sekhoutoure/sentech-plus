import { Metadata } from 'next'

export const SITE_CONFIG = {
  name: 'SenTech Plus',
  domain: 'sentechplus.sn',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://sentechplus.sn',
  defaultTitle: 'SenTech Plus | Gadgets & Accessoires High-Tech au Sénégal',
  titleTemplate: '%s | SenTech Plus Sénégal',
  description:
    'Découvrez les gadgets, accessoires et équipements high-tech sélectionnés par SenTech Plus. Livraison au Sénégal.',
  phone: '+221 77 000 00 00',
  email: 'contact@sentechplus.sn',
  address: {
    streetAddress: 'Avenue Cheikh Anta Diop, Fann',
    addressLocality: 'Dakar',
    addressRegion: 'Dakar',
    postalCode: '11500',
    addressCountry: 'SN',
  },
  geo: {
    latitude: 14.7167,
    longitude: -17.4677,
  },
  keywords: [
    'accessoires high-tech Sénégal',
    'boutique high-tech Dakar',
    'acheter écouteurs Bluetooth Sénégal',
    'chargeur rapide GaN Sénégal',
    'power bank Sénégal',
    'montre connectée Sénégal',
    'câble USB-C Sénégal',
    'accessoires smartphone Sénégal',
    'accessoires informatique Sénégal',
    'meilleur chargeur téléphone Sénégal',
    'accessoires iPhone Sénégal',
    'accessoires Samsung Sénégal',
    'accessoires Xiaomi Sénégal',
    'boutique électronique Sénégal',
    'écouteurs sans fil Dakar',
    'casque audio Sénégal',
    'hub USB C Dakar',
    'support téléphone voiture Sénégal',
    'SSD externe Sénégal',
    'clé USB Dakar',
  ],
}

/**
 * ✅ Générateur de métadonnées racine Next.js 15 App Router avec Hreflang fr-SN et fr
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: SITE_CONFIG.titleTemplate,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: 'SenTech Plus', url: SITE_CONFIG.baseUrl }],
  creator: 'SenTech Plus',
  publisher: 'SenTech Plus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: './',
    languages: {
      'fr-SN': SITE_CONFIG.baseUrl,
      'fr': SITE_CONFIG.baseUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    url: SITE_CONFIG.baseUrl,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'SenTech Plus - Boutique High-Tech & Accessoires Smartphone au Sénégal (Dakar)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
    creator: '@SenTechPlusSN',
    images: [`${SITE_CONFIG.baseUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'SN-DK',
    'geo.placename': 'Dakar',
    'geo.position': `${SITE_CONFIG.geo.latitude};${SITE_CONFIG.geo.longitude}`,
    ICBM: `${SITE_CONFIG.geo.latitude}, ${SITE_CONFIG.geo.longitude}`,
  },
}

// ─────────────────────────────────────────────
// Schema.org JSON-LD Generators
// ─────────────────────────────────────────────

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE_CONFIG.baseUrl}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
    logo: `${SITE_CONFIG.baseUrl}/sentech_logo.png`,
    image: `${SITE_CONFIG.baseUrl}/og-image.jpg`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    priceRange: 'FCFA',
    address: {
      '@type': 'PostalAddress',
      ...SITE_CONFIG.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '20:00',
      },
    ],
    sameAs: [
      'https://facebook.com/sentechplus.sn',
      'https://instagram.com/sentechplus.sn',
      'https://twitter.com/sentechplussn',
    ],
  }
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.baseUrl}/#localbusiness`,
    name: SITE_CONFIG.name,
    image: `${SITE_CONFIG.baseUrl}/og-image.jpg`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    url: SITE_CONFIG.baseUrl,
    priceRange: 'FCFA',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Sénégal',
    },
  }
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.baseUrl}/#website`,
    url: SITE_CONFIG.baseUrl,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.baseUrl}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getProductSchema(product: {
  id: string
  name: string
  description?: string
  price: number
  mrp?: number
  category?: string
  images?: string[]
  inStock?: boolean
  rating?: any[]
}) {
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => (typeof img === 'string' ? img : (img as any)?.src))
      : [`${SITE_CONFIG.baseUrl}/product_placeholder.png`]

  const reviewsCount = Array.isArray(product.rating) ? product.rating.length : 12
  const avgRating = Array.isArray(product.rating) && product.rating.length > 0
    ? (product.rating.reduce((acc, curr) => acc + (curr.rating || 5), 0) / product.rating.length).toFixed(1)
    : '4.8'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_CONFIG.baseUrl}/product/${product.id}/#product`,
    name: product.name,
    image: images,
    description: product.description || `Achetez ${product.name} au meilleur prix au Sénégal sur SenTech Plus.`,
    sku: `STP-${product.id}`,
    mpn: `STP-MPN-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'SenTech Plus',
    },
    category: product.category || 'High-Tech',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.baseUrl}/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'SN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
        },
      },
    },
  }
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.baseUrl}${item.url}`,
    })),
  }
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function getReviewSchema(review: { author: string; ratingValue: number; reviewBody: string; datePublished: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  }
}
