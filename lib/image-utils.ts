import { assets } from '@/assets/assets'

// Image fallback officielle et professionnelle SenTech Plus
export const FALLBACK_PRODUCT_IMAGE = assets.product_img1;

/**
 * Extrait de manière sécurisée l'image d'un produit (Index 0 par défaut).
 * Supporte :
 * - Tableaux d'images [string | StaticImageData]
 * - URL unique string
 * - Objets Next.js StaticImageData ({ src: '...' })
 * - Chaînes JSON parsables '["https://..."]'
 * - Valeurs null / undefined / chaînes vides (rend le fallback)
 */
export function getProductImage(product: any, index: number = 0): any {
    if (!product) return FALLBACK_PRODUCT_IMAGE;

    let raw = product.images ?? product.image ?? product.img ?? product.coverImage;

    // Traitement si chaîne de caractères
    if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed.length === 0) return FALLBACK_PRODUCT_IMAGE;

        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                raw = JSON.parse(trimmed);
            } catch (e) {
                raw = [trimmed];
            }
        } else if (trimmed.includes(',') && !trimmed.startsWith('data:')) {
            raw = trimmed.split(',').map((s: string) => s.trim());
        } else {
            raw = [trimmed];
        }
    }

    // Traitement si tableau
    if (Array.isArray(raw) && raw.length > 0) {
        const target = raw[index] !== undefined ? raw[index] : raw[0];
        if (target) {
            if (typeof target === 'string' && target.trim().length > 0) {
                return target.trim();
            }
            if (typeof target === 'object' && target !== null) {
                if ('src' in target && typeof target.src === 'string' && target.src.trim().length > 0) {
                    return target; // Next.js StaticImageData
                }
                if ('url' in target && typeof target.url === 'string' && target.url.trim().length > 0) {
                    return target.url;
                }
            }
        }
    }

    // Traitement si objet direct
    if (typeof raw === 'object' && raw !== null) {
        if ('src' in raw && typeof raw.src === 'string') {
            return raw;
        }
        if ('url' in raw && typeof raw.url === 'string') {
            return raw.url;
        }
    }

    return FALLBACK_PRODUCT_IMAGE;
}
