import { db } from "@/lib/db";
import StoreShopClient from "./StoreShopClient";

// ✅ Server-side metadata generation for SEO
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const storeInfo = await db.getStoreByUsername(username);
    
    if (!storeInfo) {
        return {
            title: 'Boutique introuvable - SenTech Plus',
            description: 'Cette boutique n\'existe pas.'
        };
    }
    
    return {
        title: `${storeInfo.name} | Boutique sur SenTech Plus`,
        description: storeInfo.description?.substring(0, 160) || '',
        openGraph: {
            title: storeInfo.name,
            description: storeInfo.description?.substring(0, 160) || '',
            images: storeInfo.logo ? [{ url: typeof storeInfo.logo === 'string' ? storeInfo.logo : (storeInfo.logo as any)?.src }] : [],
        }
    };
}

// ✅ Server Component wrapper - renders the Client Component
export default function StoreShopPage() {
    return <StoreShopClient />;
}