/**
 * Utilitaire centralisé pour les appels API depuis le panneau d'administration.
 * 
 * ⚠️ ARCHITECTURE DÉMO : Ce module lit la clé admin depuis le sessionStorage
 * (initialisé après connexion). En production, remplacer par NextAuth.js :
 * les appels admin passeraient par des Server Actions authentifiées via session JWT.
 *
 * Pour passer en production :
 * 1. Installer NextAuth.js : npm install next-auth
 * 2. Configurer un provider Credentials dans app/api/auth/[...nextauth]/route.js
 * 3. Remplacer adminFetch par des Server Actions avec getServerSession()
 */

const getAdminHeaders = () => {
    // En démo : lire la clé depuis sessionStorage (jamais dans le bundle JS)
    // En production : la clé n'est plus nécessaire, c'est la session JWT qui authentifie
    const demoKey = typeof window !== 'undefined'
        ? sessionStorage.getItem('admin_demo_key') || ''
        : ''
    return {
        'Content-Type': 'application/json',
        'x-admin-key': demoKey,
    }
}

/**
 * Wrapper fetch sécurisé pour les routes d'administration.
 */
export const adminFetch = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAdminHeaders(),
            ...options.headers,
        },
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur réseau' }))
        throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
}

export const adminApi = {
    createProduct: (data) => adminFetch('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) => adminFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteProduct: (id) => adminFetch(`/api/products/${id}`, { method: 'DELETE' }),
    getOrders: () => adminFetch('/api/orders'),
    updateOrderStatus: (id, status) => adminFetch(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    updateSettings: (data) => adminFetch('/api/settings', { method: 'POST', body: JSON.stringify(data) }),
    getCoupons: () => adminFetch('/api/coupons'),
}
