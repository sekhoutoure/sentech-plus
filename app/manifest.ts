import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SenTechPLUS — High-Tech Sénégal',
    short_name: 'SenTechPLUS',
    description: "Plateforme e-commerce spécialisée dans les équipements High-Tech d'origine au Sénégal avec livraison rapide.",
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F3F7FC',
    theme_color: '#1677FF',
    icons: [
      {
        src: '/sentech_icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/sentech_icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
