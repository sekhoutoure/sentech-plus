/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
});

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://*.google-analytics.com; script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://*.google-analytics.com; connect-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.doubleclick.net; frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://*.doubleclick.net; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https: https://www.googletagmanager.com https://www.google-analytics.com https://stats.g.doubleclick.net; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
  }
];

// ✅ Cache long durée pour les assets statiques Next.js (immutables — hash dans le nom)
const staticAssetCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=31536000, immutable',
  },
];

const nextConfig = {
    compress: true,
    poweredByHeader: false,
    // ✅ SWC compiler — cible ES2022, supprime les polyfills inutiles (~11 KiB économisés)
    compiler: {
        // Supprime les console.log en production
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    },
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            'react-hot-toast',
            'zustand',
            'recharts',
            'date-fns',
            'framer-motion',
        ],
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        imageSizes: [16, 32, 48, 64, 96, 128, 180, 240, 320, 384],
        deviceSizes: [480, 640, 750, 828, 1080, 1200],
        minimumCacheTTL: 31536000, // ✅ Cache images 1 an côté CDN Vercel
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'images.pexels.com' }
        ]
    },
    async headers() {
      return [
        // ✅ Headers sécurité sur toutes les routes
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
        // ✅ Cache long durée sur les chunks JS Next.js (immutables)
        {
          source: '/_next/static/:path*',
          headers: staticAssetCacheHeaders,
        },
        // ✅ Cache long durée sur les images optimisées Next.js
        {
          source: '/_next/image/:path*',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        // ✅ Cache court pour le manifest PWA (peut changer)
        {
          source: '/manifest.webmanifest',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
            { key: 'Content-Type', value: 'application/manifest+json' },
          ],
        },
        // ✅ Cache pour les assets publics statiques (icônes, favicon)
        {
          source: '/:file(sentech_icon.png|icon.png|favicon.ico)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' },
          ],
        },
      ];
    },
};

export default bundleAnalyzer(nextConfig);

