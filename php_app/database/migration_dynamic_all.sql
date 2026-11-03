-- =============================================================================
-- SenTechPLUS — Migration Dynamique Globale (100% Base de Données)
-- Tables : brands, faqs, testimonials, seller_plans, site_settings, wishlists
-- =============================================================================

SET NAMES utf8mb4;

-- ─── 1. Table `brands` (Marques Officielles Partenaires) ─────────────────────
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `logo` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_brand_slug` (`slug`),
  INDEX `idx_brand_featured` (`is_featured`, `is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des Marques Officielles
INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `description`, `is_featured`, `display_order`, `is_active`) VALUES
('br_apple', 'Apple', 'apple', 'assets/images/brands/apple.svg', 'Produits et accessoires certifiés Apple au Sénégal', 1, 1, 1),
('br_samsung', 'Samsung', 'samsung', 'assets/images/brands/samsung.svg', 'Écosystème Galaxy, charge rapide et audio haute fidélité', 1, 2, 1),
('br_sony', 'Sony', 'sony', 'assets/images/brands/sony.svg', 'Casques antibruit de référence mondiale et audio Hi-Res', 1, 3, 1),
('br_jbl', 'JBL', 'jbl', 'assets/images/brands/jbl.svg', 'Enceintes portables étanches et casques au son Pure Bass', 1, 4, 1),
('br_anker', 'Anker', 'anker', 'assets/images/brands/anker.svg', 'Chargeurs GaN ultrarapides et batteries externes certifiées', 1, 5, 1),
('br_xiaomi', 'Xiaomi', 'xiaomi', 'assets/images/brands/xiaomi.svg', 'Accessoires connectés et écosystème smart life', 1, 6, 1),
('br_oraimo', 'Oraimo', 'oraimo', 'assets/images/brands/oraimo.svg', 'Écouteurs sans fil grande autonomie et montres connectées', 1, 7, 1),
('br_baseus', 'Baseus', 'baseus', 'assets/images/brands/baseus.svg', 'Câbles renforcés, stations d’accueil et chargeurs polyvalents', 1, 8, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `logo` = VALUES(`logo`);

-- ─── 2. Table `faqs` (Foire Aux Questions) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(64) NOT NULL DEFAULT 'Général',
  `question` VARCHAR(500) NOT NULL,
  `answer` TEXT NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_faq_cat` (`category`, `is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des 10 FAQs officielles
INSERT INTO `faqs` (`category`, `question`, `answer`, `display_order`, `is_active`) VALUES
('Livraison', 'Quels sont les délais de livraison à Dakar et dans les régions ?', 'À Dakar, les commandes sont livrées sous 2 à 4 heures pour le mode express, ou sous 24h ouvrées en standard. Pour les régions (Thiès, Saint-Louis, Mbour, Ziguinchor, etc.), la livraison s’effectue en 24h à 48h via nos transporteurs partenaires sécurisés.', 1, 1),
('Paiement', 'Quels moyens de paiement acceptez-vous ?', 'Nous acceptons Wave Sénégal, Orange Money, Free Money, les Cartes Bancaires (Visa / Mastercard) et le Paiement en espèces à la livraison (Cash on Delivery) partout à Dakar.', 2, 1),
('Garantie', 'Vos produits sont-ils originaux et garantis ?', 'Oui, 100% de nos articles sont neufs, scellés et authentiques avec garantie constructeur de 6 à 12 mois selon les catégories. Nous délivrons une facture légale avec chaque commande.', 3, 1),
('Commandes', 'Comment suivre l’acheminement de ma commande en temps réel ?', 'Dès validation de votre commande, vous recevez un lien de suivi par SMS et Email. Vous pouvez également entrer votre numéro de commande sur notre page de suivi (tracking.php).', 4, 1),
('Retours', 'Quelle est votre politique de retour et d’échange ?', 'Vous disposez de 48 heures après réception pour signaler tout défaut de conformité ou dysfonctionnement. Le remplacement par un produit neuf ou le remboursement est garanti après vérification par notre service technique.', 5, 1),
('Paiement', 'Le paiement en ligne est-il 100% sécurisé ?', 'Absolument. Nos passerelles de paiement Wave et Orange Money utilisent les API chiffrées officielles avec validation par code OTP sur votre téléphone. Aucune donnée bancaire n’est stockée sur nos serveurs.', 6, 1),
('Vendeurs', 'Comment ouvrir une boutique vendeur sur SenTechPLUS ?', 'Rendez-vous sur la page Devenir Vendeur (pricing.php) ou Create Store. Remplissez le formulaire de demande avec vos coordonnées professionnelles et votre boutique sera activée sous 24h après validation.', 7, 1),
('Général', 'Où se situe votre showroom / point de retrait à Dakar ?', 'Notre hub principal et showroom est situé au Point E, Boulevard de l’Est, Dakar. Vous pouvez venir tester et retirer vos produits directement sur place du lundi au samedi de 8h30 à 20h00.', 8, 1)
ON DUPLICATE KEY UPDATE `question` = VALUES(`question`), `answer` = VALUES(`answer`);

-- ─── 3. Table `testimonials` (Avis et Témoignages Clients) ────────────────────
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `customer_name` VARCHAR(128) NOT NULL,
  `customer_role` VARCHAR(128) NOT NULL DEFAULT 'Client vérifié',
  `customer_location` VARCHAR(128) NOT NULL DEFAULT 'Dakar',
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `comment` TEXT NOT NULL,
  `avatar` VARCHAR(255) NULL,
  `product_name` VARCHAR(191) NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_testi_feat` (`is_featured`, `is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des Témoignages
INSERT INTO `testimonials` (`id`, `customer_name`, `customer_role`, `customer_location`, `rating`, `comment`, `avatar`, `product_name`, `is_featured`, `display_order`) VALUES
('testi_1', 'Amadou Diallo', 'Ingénieur Télécom', 'Almadies, Dakar', 5.0, 'Livraison en moins de 2h à mon bureau aux Almadies. Le casque Sony WH-1000XM5 est 100% original, scellé avec facture officielle. Service client WhatsApp extrêmement réactif !', 'assets/images/profile_pic1.webp', 'Sony WH-1000XM5', 1, 1),
('testi_2', 'Fatou Sow', 'Architecte & Créatrice', 'Point E, Dakar', 5.0, 'J’ai commandé une Apple Watch et un chargeur GaN Anker 65W. Paiement par Wave fluide et reçu le jour même. Je recommande vivement SenTechPLUS pour la tech à Dakar.', 'assets/images/profile_pic2.webp', 'Apple Watch Series 9', 1, 2),
('testi_3', 'Cheikh Tidiane Diop', 'Directeur d’Agence', 'Mermoz, Dakar', 5.0, 'Très bonne expérience d’achat. Emballage soigné, garantie 1 an respectée et livreur courtois. La référence High-Tech au Sénégal.', 'assets/images/profile_pic3.webp', 'JBL Charge 5', 1, 3)
ON DUPLICATE KEY UPDATE `comment` = VALUES(`comment`);

-- ─── 4. Table `seller_plans` (Formules d’Abonnement Vendeur) ──────────────────
CREATE TABLE IF NOT EXISTS `seller_plans` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL,
  `slug` VARCHAR(64) NOT NULL UNIQUE,
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `billing_period` VARCHAR(32) NOT NULL DEFAULT 'mensuel',
  `description` VARCHAR(255) NOT NULL,
  `badge_text` VARCHAR(64) NULL,
  `features` JSON NOT NULL,
  `max_products` INT NOT NULL DEFAULT 20,
  `commission_rate` DECIMAL(4,2) NOT NULL DEFAULT 8.00,
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_plan_active` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des 3 plans
INSERT INTO `seller_plans` (`id`, `name`, `slug`, `price`, `billing_period`, `description`, `badge_text`, `features`, `max_products`, `commission_rate`, `is_popular`, `display_order`) VALUES
('plan_starter', 'Formule Découverte', 'starter', 0.00, 'mois', 'Idéal pour les particuliers et débutants voulant vendre leurs premiers articles.', 'Gratuit', '[
  "Jusqu’à 15 produits au catalogue",
  "Paiements Wave, Orange Money et Cash",
  "Tableau de bord des ventes standard",
  "Commission de 8% par vente",
  "Support standard par email"
]', 15, 8.00, 0, 1),
('plan_pro', 'Boutique Pro Dakar', 'pro', 15000.00, 'mois', 'La formule la plus choisie par les commerçants et boutiques tech établies.', 'Recommandé 🔥', '[
  "Jusqu’à 100 produits au catalogue",
  "Commission réduite à 4% par vente",
  "Mise en avant sur la page d’accueil",
  "Badge Vendeur Vérifié & Certifié",
  "Support prioritaire WhatsApp 7j/7",
  "Gestion des stocks et promotions flash"
]', 100, 4.00, 1, 2),
('plan_enterprise', 'Vendeur Élite & Marque', 'enterprise', 35000.00, 'mois', 'Pour les grossistes, distributeurs officiels et grandes enseignes.', 'VIP Exclusive', '[
  "Catalogue illimité de produits",
  "Commission ultra-réduite de 2% par vente",
  "Bannières personnalisées & Slider exclusif",
  "Campagnes SMS et Emails dédiées",
  "Gestionnaire de compte VIP attitré",
  "Intégration API & Export comptable"
]', 9999, 2.00, 0, 3)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price` = VALUES(`price`), `features` = VALUES(`features`);

-- ─── 5. Table `site_settings` (Configuration Globale & Contact) ───────────────
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(128) NOT NULL PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `setting_group` VARCHAR(64) NOT NULL DEFAULT 'general',
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des réglages
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`, `description`) VALUES
('site_name', 'SenTechPLUS', 'general', 'Nom officiel de la plateforme'),
('site_tagline', 'High-Tech Certifié & Livraison Express Dakar', 'general', 'Slogan du site'),
('contact_email', 'contact@sentechplus.com', 'contact', 'Email officiel du service client'),
('contact_phone', '+221 78 131 64 97', 'contact', 'Téléphone d’appel client'),
('whatsapp_phone', '221781316497', 'contact', 'Numéro WhatsApp international'),
('contact_address', 'Point E, Boulevard de l’Est, Dakar, Sénégal', 'contact', 'Adresse physique showroom'),
('opening_hours', 'Lun - Sam : 08h30 - 20h00', 'contact', 'Horaires d’ouverture du showroom'),
('facebook_url', 'https://facebook.com/sentechplus', 'social', 'Lien page Facebook'),
('instagram_url', 'https://instagram.com/sentechplus', 'social', 'Lien compte Instagram'),
('linkedin_url', 'https://linkedin.com/company/sentechplus', 'social', 'Lien LinkedIn entreprise'),
('tiktok_url', 'https://tiktok.com/@sentechplus', 'social', 'Lien compte TikTok officiel'),
('delivery_dakar_standard', '1500', 'shipping', 'Tarif livraison standard Dakar (FCFA)'),
('delivery_dakar_express', '2500', 'shipping', 'Tarif livraison express H+2 Dakar (FCFA)')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- ─── 6. Table `wishlists` (Persistance des Favoris par Utilisateur) ───────────
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  INDEX `idx_wishlist_user` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
