/** @type {import('next').NextConfig} */

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

const nextConfig = {
    compress: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        imageSizes: [16, 32, 48, 64, 96, 128, 180, 240, 320, 384],
        deviceSizes: [480, 640, 750, 828, 1080, 1200],
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
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ];
    },
};

export default nextConfig;
