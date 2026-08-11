import { Outfit } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StoreProvider from "@/app/StoreProvider";
import JsonLd from "@/components/seo/JsonLd";
import { defaultMetadata, getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";
import { GA_TRACKING_ID } from "@/lib/analytics";
import "./globals.css";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"));
const Toaster = dynamic(() => import("react-hot-toast").then((mod) => mod.Toaster));

import type { Viewport } from "next";

// ✅ Outfit via next/font — auto-optimisé, hébergé sur Vercel (zéro requête externe)
const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    preload: true,
});

export const metadata = defaultMetadata;

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" dir="ltr">
            <head>
                {/* ─────────────────────────────────────────────────────
                    🔗 PRECONNECT — Établit la connexion TCP/TLS en avance
                    Limité à 4 origines max pour éviter la congestion réseau
                ───────────────────────────────────────────────────── */}
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />

                {/* ─────────────────────────────────────────────────────
                    🔍 DNS-PREFETCH — Résolution DNS en arrière-plan
                    Pour les origines secondaires non critiques
                ───────────────────────────────────────────────────── */}
                <link rel="dns-prefetch" href="https://www.google-analytics.com" />
                <link rel="dns-prefetch" href="https://images.pexels.com" />
                <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

                {/* ─────────────────────────────────────────────────────
                    📱 PWA — Manifest chargé en mode non-bloquant
                    fetchpriority="low" dépriorise le manifest hors critical path
                ───────────────────────────────────────────────────── */}
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link rel="manifest" href="/manifest.webmanifest" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="SenTechPLUS" />
                <link rel="apple-touch-icon" href="/sentech_icon.png" />

                {/* ─────────────────────────────────────────────────────
                    🏷️ Schema.org — Structured Data
                ───────────────────────────────────────────────────── */}
                <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />

                {/* ─────────────────────────────────────────────────────
                    📊 Google Analytics GA4 — Chargé en lazyOnload
                    N'impacte pas LCP / FCP / CLS
                ───────────────────────────────────────────────────── */}
                <Script
                    strategy="lazyOnload"
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                />
                <Script
                    id="gtag-init"
                    strategy="lazyOnload"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GA_TRACKING_ID}', {
                                page_path: window.location.pathname,
                            });
                        `,
                    }}
                />
            </head>
            <body className={`${outfit.className} antialiased selection:bg-blue-600 selection:text-white`}>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
                >
                    Aller au contenu principal
                </a>
                <StoreProvider>
                    <Toaster />
                    {children}
                    <WhatsAppButton />
                </StoreProvider>

                {/* 📈 Vercel Analytics & Speed Insights — chargés après hydratation */}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
