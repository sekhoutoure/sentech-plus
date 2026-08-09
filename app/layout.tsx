import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StoreProvider from "@/app/StoreProvider";
import JsonLd from "@/components/seo/JsonLd";
import WhatsAppButton from "@/components/WhatsAppButton";
import { defaultMetadata, getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";
import { GA_TRACKING_ID } from "@/lib/analytics";
import "./globals.css";

import type { Viewport } from "next";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

export const metadata = defaultMetadata;

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" dir="ltr">
            <head>
                {/* 🏷️ Global Schema.org Structured Data */}
                <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />

                {/* 📊 Google Analytics GA4 Script (Lazy Load for Maximum LCP/FCP) */}
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
                <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
                    Aller au contenu principal
                </a>
                <StoreProvider>
                    <Toaster />
                    {children}
                    <WhatsAppButton />
                </StoreProvider>

                {/* 📈 Vercel Analytics & Speed Insights */}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
