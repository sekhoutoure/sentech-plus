// Analytics & E-Commerce Event Tracking Module for SenTech Plus

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-SENTECHPLUS1'

// Generic Custom Event Tracker
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// 1. View Item Event (Consultation Produit)
export const trackViewItem = (product: { id: string; name: string; price: number; category?: string }) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'High-Tech',
          price: product.price,
        },
      ],
    })
  }
}

// 2. Add to Cart Event (Ajout au Panier)
export const trackAddToCart = (product: { id: string; name: string; price: number; category?: string }, quantity = 1) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'High-Tech',
          price: product.price,
          quantity: quantity,
        },
      ],
    })
  }
}

// 3. Purchase Event (Commande Validée)
export const trackPurchase = (orderId: string, totalAmount: number, items: Array<any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'purchase', {
      transaction_id: orderId,
      value: totalAmount,
      currency: 'USD',
      items: items.map((item) => ({
        item_id: item.id || item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
    })
  }
}

// 4. Create Store Event (Création Boutique SaaS)
export const trackCreateStore = (storeName: string) => {
  trackEvent('create_store', 'SaaS_Seller', storeName)
}

// 5. User Login Event (Connexion Utilisateur)
export const trackUserLogin = (role: string) => {
  trackEvent('login', 'User_Auth', role)
}
