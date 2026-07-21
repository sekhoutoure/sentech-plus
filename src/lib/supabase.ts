import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Récupérer tous les produits
export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Erreur fetch products:', error);
    return [];
  }
  // Mappage des noms de colonnes Supabase (ex: old_price) vers notre format React (oldPrice)
  return data.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    oldPrice: p.old_price,
    discount: p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : 0,
    image: p.image,
    images: [p.image], // Simplifié pour le MVP
    rating: p.rating,
    reviews: p.reviews,
    inStock: p.in_stock,
    stockCount: 50,
    isNew: p.badge === 'NEW',
    isBestSeller: p.badge === 'BEST SELLER',
    isPromo: p.badge === 'PROMO',
    brand: p.brand,
    description: p.description || '',
    features: ['Qualité premium', 'Garantie Sentech'],
    delivery: 'Livraison 24h/48h',
    warranty: 'Garantie 1 an',
    badge: p.badge
  }));
}

// Ajouter un produit (Admin)
export async function addProduct(productData: any) {
  const { data, error } = await supabase.from('products').insert([{
    name: productData.name,
    price: productData.price,
    old_price: productData.oldPrice || null,
    image: productData.image,
    category: productData.category,
    brand: productData.brand,
    badge: productData.badge || null,
    in_stock: productData.inStock,
    description: productData.description
  }]).select();
  return { data, error };
}

// Supprimer un produit (Admin)
export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error };
}

// Mettre à jour un produit (Admin)
export async function updateProduct(id: string, productData: any) {
  const { data, error } = await supabase.from('products').update({
    name: productData.name,
    price: productData.price,
    old_price: productData.oldPrice || null,
    image: productData.image,
    category: productData.category,
    brand: productData.brand,
    badge: productData.badge || null,
    in_stock: productData.inStock !== undefined ? productData.inStock : true,
    description: productData.description,
    updated_at: new Date().toISOString(),
  }).eq('id', id).select();
  return { data, error };
}

// Récupérer les commandes par email client
export async function fetchOrdersByEmail(email: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

// Récupérer les commandes
export async function fetchOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return { data: data || [], error };
}

// Créer une commande (Panier Checkout)
export async function createOrder(orderData: any) {
  const { data, error } = await supabase.from('orders').insert([orderData]).select();
  return { data, error };
}

// Sauvegarder un message de contact
export async function saveContactMessage(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data, error } = await supabase.from('contact_messages').insert([{
    name: message.name,
    email: message.email,
    subject: message.subject || 'Sans sujet',
    message: message.message,
    created_at: new Date().toISOString(),
  }]).select();
  return { data, error };
}

// S'abonner à la newsletter
export async function subscribeNewsletter(email: string) {
  // Vérifie si l'email existe déjà
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) return { data: existing, error: null, alreadySubscribed: true };

  const { data, error } = await supabase.from('newsletter_subscribers').insert([{
    email,
    subscribed_at: new Date().toISOString(),
  }]).select();
  return { data, error, alreadySubscribed: false };
}

