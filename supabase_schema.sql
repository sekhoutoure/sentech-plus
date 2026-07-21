-- Activer l'extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table des produits
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    badge TEXT,
    rating NUMERIC DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des commandes
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'en_attente',
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sécurité (Row Level Security)
-- On autorise la lecture (SELECT) des produits pour tout le monde (public)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produits visibles par tous" ON public.products FOR SELECT USING (true);

-- On autorise l'insertion, modification et suppression pour tout le monde (simplifié pour ce MVP, en prod on utiliserait un rôle admin)
CREATE POLICY "Tout le monde peut insérer/modifier des produits" ON public.products FOR ALL USING (true);

-- Pareil pour les commandes
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tout le monde peut voir et insérer des commandes" ON public.orders FOR ALL USING (true);

-- 4. Insérer quelques produits par défaut pour tester
INSERT INTO public.products (name, price, old_price, image, category, brand, badge, rating, reviews, in_stock, description)
VALUES 
('AirPods Pro 2', 175000, 190000, '/earbuds.jpg', 'Écouteurs', 'Apple', 'TOP VENTE', 4.9, 124, true, 'Écouteurs sans fil avec réduction de bruit active.'),
('Chargeur Rapide 20W', 15000, 25000, '/charger.jpg', 'Chargeurs', 'Anker', 'BEST SELLER', 4.8, 89, true, 'Chargeur USB-C ultra rapide.'),
('Powerbank 20000mAh', 35000, 45000, '/powerbank.jpg', 'Batteries externes', 'Xiaomi', 'PROMO', 4.7, 56, true, 'Batterie externe haute capacité.');
