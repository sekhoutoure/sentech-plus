SET FOREIGN_KEY_CHECKS = 0;
-- =============================================================================
-- SenTechPLUS — Pack de Déploiement BDD Complet & Idempotent (Production)
-- Date de Génération : 2026-08-24
-- Compatible : MySQL 5.7+ / MariaDB 10.3+ / Hostinger Premium (phpMyAdmin)
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ─── 1. STRUCTURE DES TABLES ─────────────────────────────────────────────────
-- =============================================================================
-- SenTechPLUS — Base de données MySQL / MariaDB (Hostinger Premium)
-- Structure complète avec Système Hiérarchique de Catégories (Parents / Enfants)
-- Importation : phpMyAdmin -> Importer -> Sélectionner database/schema.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `ratings`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `stores`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Table `users` (Clients, Vendeurs, Administrateurs)
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NULL,
  `phone` VARCHAR(64) NULL,
  `email_verified` DATETIME NULL,
  `is_email_verified` TINYINT(1) NOT NULL DEFAULT 1,
  `verification_token` VARCHAR(64) NULL,
  `image` VARCHAR(255) NULL DEFAULT 'assets/images/profile_pic1.webp',
  `cart` JSON NULL,
  `role` VARCHAR(32) NOT NULL DEFAULT 'user', -- 'user', 'customer', 'admin', 'seller'
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 2. Table `stores` (Boutiques des vendeurs SaaS)
-- -----------------------------------------------------------------------------
CREATE TABLE `stores` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `address` TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  `is_active` TINYINT(1) NOT NULL DEFAULT 0,
  `logo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `contact` VARCHAR(64) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table `categories` (Système Hiérarchique Parents / Enfants)
-- -----------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` VARCHAR(255) NULL,
  `icon` VARCHAR(64) NULL,
  `parent_id` VARCHAR(64) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table `products` (Catalogue produits complet avec métadonnées)
-- -----------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `store_id` VARCHAR(64) NOT NULL,
  `category_id` VARCHAR(64) NULL,
  `subcategory_id` VARCHAR(64) NULL,
  `category` VARCHAR(128) NOT NULL,
  `subcategory` VARCHAR(128) NULL,
  `brand` VARCHAR(128) NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NULL,
  `sku` VARCHAR(64) NULL,
  `description` TEXT NOT NULL,
  `mrp` DECIMAL(12,2) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `discount_percent` INT NOT NULL DEFAULT 0,
  `images` JSON NOT NULL, -- Array de chemins d'images ["assets/images/product_img1.webp", ...]
  `in_stock` TINYINT(1) NOT NULL DEFAULT 1,
  `stock` INT NOT NULL DEFAULT 10,
  `stock_status` VARCHAR(32) NOT NULL DEFAULT 'IN_STOCK',
  `status` VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  `sales_count` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_best_seller` TINYINT(1) NOT NULL DEFAULT 0,
  `is_limited_stock` TINYINT(1) NOT NULL DEFAULT 0,
  `is_new` TINYINT(1) NOT NULL DEFAULT 0,
  `is_flash_sale` TINYINT(1) NOT NULL DEFAULT 0,
  `is_express_delivery` TINYINT(1) NOT NULL DEFAULT 1,
  `connection_type` VARCHAR(64) NULL, -- 'Bluetooth', 'USB-C', 'Jack', 'Wi-Fi', 'Filaire'
  `compatibility` VARCHAR(255) NULL,   -- 'iPhone', 'Android', 'PC', 'PS5', 'Xbox'
  `color` VARCHAR(64) NULL,
  `power` VARCHAR(64) NULL,
  `capacity` VARCHAR(64) NULL,
  `usage_type` VARCHAR(64) NULL,
  `warranty` VARCHAR(64) NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0,
  `review_count` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product_name` (`name`),
  INDEX `idx_product_brand` (`brand`),
  INDEX `idx_product_category` (`category_id`),
  INDEX `idx_product_subcategory` (`subcategory_id`),
  INDEX `idx_product_price` (`price`),
  INDEX `idx_product_active_stock` (`is_active`, `in_stock`),
  FULLTEXT KEY `ft_product_search` (`name`, `description`, `brand`),
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`subcategory_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 5. Table `product_images` (Galerie d'images par produit)
-- -----------------------------------------------------------------------------
CREATE TABLE `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table `addresses` (Adresses de livraison)
-- -----------------------------------------------------------------------------
CREATE TABLE `addresses` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `first_name` VARCHAR(128) NULL,
  `last_name` VARCHAR(128) NULL,
  `email` VARCHAR(191) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(128) NOT NULL,
  `state` VARCHAR(128) NOT NULL,
  `region` VARCHAR(128) NULL,
  `district` VARCHAR(128) NULL,
  `landmark` VARCHAR(255) NULL,
  `zip` VARCHAR(32) NOT NULL DEFAULT '00000',
  `country` VARCHAR(128) NOT NULL DEFAULT 'Sénégal',
  `phone` VARCHAR(64) NOT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table `cart_items` (Panier persistant en base)
-- -----------------------------------------------------------------------------
CREATE TABLE `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NULL,
  `session_id` VARCHAR(128) NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. Table `coupons` (Codes de réduction)
-- -----------------------------------------------------------------------------
CREATE TABLE `coupons` (
  `code` VARCHAR(64) NOT NULL PRIMARY KEY,
  `description` VARCHAR(255) NOT NULL,
  `discount` DECIMAL(5,2) NOT NULL, -- pourcentage ex: 15.00
  `for_new_user` TINYINT(1) NOT NULL DEFAULT 0,
  `for_member` TINYINT(1) NOT NULL DEFAULT 0,
  `is_public` TINYINT(1) NOT NULL DEFAULT 1,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. Table `orders` (Commandes)
-- -----------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `order_number` VARCHAR(64) NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `store_id` VARCHAR(64) NOT NULL,
  `address_id` VARCHAR(64) NOT NULL,
  `customer_first_name` VARCHAR(128) NULL,
  `customer_last_name` VARCHAR(128) NULL,
  `customer_email` VARCHAR(191) NULL,
  `customer_phone` VARCHAR(64) NULL,
  `delivery_region` VARCHAR(128) NULL,
  `delivery_city` VARCHAR(128) NULL,
  `delivery_district` VARCHAR(128) NULL,
  `delivery_address` TEXT NULL,
  `delivery_landmark` VARCHAR(255) NULL,
  `delivery_instructions` TEXT NULL,
  `delivery_method` VARCHAR(64) NULL DEFAULT 'express',
  `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `delivery_fee` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `discount_amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `discount_total` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `total` DECIMAL(12,2) NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `final_total` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `status` VARCHAR(32) NOT NULL DEFAULT 'ORDER_PLACED', -- 'ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  `order_status` VARCHAR(32) NOT NULL DEFAULT 'ORDER_PLACED',
  `is_paid` TINYINT(1) NOT NULL DEFAULT 0,
  `payment_status` VARCHAR(32) NOT NULL DEFAULT 'UNPAID',
  `payment_method` VARCHAR(32) NOT NULL DEFAULT 'COD', -- 'COD', 'WAVE', 'ORANGE_MONEY', 'PAYDUNYA'
  `is_coupon_used` TINYINT(1) NOT NULL DEFAULT 0,
  `coupon_code` VARCHAR(64) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`),
  FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 10. Table `order_items` (Lignes d'articles commandés avec Snapshot)
-- -----------------------------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `variant_id` VARCHAR(64) NULL,
  `product_name_snapshot` VARCHAR(191) NULL,
  `product_image_snapshot` VARCHAR(255) NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `price` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 11. Table `reviews` (Avis clients)
-- -----------------------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64) NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `review` TEXT NULL,
  `comment` TEXT NULL,
  `reviewer_name` VARCHAR(191) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. Table `newsletter_subscribers`
-- -----------------------------------------------------------------------------
CREATE TABLE `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `ip_address` VARCHAR(45) NULL,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------------------------------
-- 13. Table `contact_messages`
-- -----------------------------------------------------------------------------
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'unread',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- DONNÉES DE DÉPART (SEED DATA)
-- =============================================================================

-- Utilisateurs initiaux
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
('user_admin', 'Administrateur SenTech', 'admin@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', 'admin'),
('user_seller_1', 'Boutique Tech Dakar', 'vendeur@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', 'seller'),
('user_seller_2', 'Happy Store Dakar', 'happystore@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', 'seller'),
('user_seller_main', 'SenTechPLUS Principal', 'central@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', 'seller'),
('user_customer_1', 'Mamadou Diallo', 'client@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', 'user');

-- Boutiques officielles
INSERT INTO `stores` (`id`, `user_id`, `name`, `description`, `username`, `address`, `status`, `is_active`, `logo`, `email`, `contact`) VALUES
('store_sentech', 'user_admin', 'SenTechPLUS Officiel', 'Boutique certifiée officielle SenTechPLUS Dakar. Matériel garanti 100% original.', 'sentechplus', 'Avenue Ponty, Plateau, Dakar', 'approved', 1, 'assets/images/sentech_icon.webp', 'contact@sentechplus.com', '+221 78 131 64 97'),
('store_sentech_main', 'user_seller_main', 'SenTechPLUS Dakar Principal', 'Entrepôt central et centre de distribution express Dakar.', 'sentech-central', 'Point E, Dakar', 'approved', 1, 'assets/images/sentech_logo.webp', 'admin@sentechplus.com', '+221 78 131 64 97'),
('store_happy', 'user_seller_2', 'Happy Store Dakar', 'Accessoires mobiles et gadgets connectés certifiés.', 'happystore', 'Médina, Dakar', 'approved', 1, 'assets/images/happy_store.webp', 'happy@sentechplus.com', '+221 77 123 45 67'),
('store_tech', 'user_seller_1', 'Boutique Tech Dakar', 'Spécialiste de l\'audio nomade et des accessoires smartphone haute performance.', 'tech-dakar', 'Almadies, Dakar', 'approved', 1, 'assets/images/happy_store.webp', 'techdakar@sentechplus.com', '+221 78 131 64 97');

-- Catégories Principales & Sous-Catégories Hiérarchiques
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
-- 1. Téléphones & Accessoires
('cat_telephones', 'Téléphones & Accessoires', 'telephones-accessoires', 'Accessoires essentiels pour smartphones iPhone, Samsung et Android.', 'assets/images/product_img7.webp', 'smartphone', NULL, 1, 1, 1),
('sub_supports_tel', 'Supports téléphone', 'supports-telephone', 'Supports bureau, voiture, MagSafe et trépieds.', 'assets/images/product_img7.webp', 'smartphone', 'cat_telephones', 1, 1, 0),
('sub_coques', 'Coques & protections', 'coques-protections', 'Coques antichoc, étuis cuir et protections renforcées.', 'assets/images/product_img7.webp', 'shield', 'cat_telephones', 2, 1, 0),
('sub_chargeurs_cables', 'Chargeurs & câbles', 'chargeurs-cables', 'Câbles USB-C, Lightning, chargeurs rapides GaN.', 'assets/images/product_img7.webp', 'zap', 'cat_telephones', 3, 1, 1),
('sub_batteries_ext', 'Batteries externes', 'batteries-externes', 'Powerbanks 10000mAh à 30000mAh charge rapide.', 'assets/images/product_img7.webp', 'battery-charging', 'cat_telephones', 4, 1, 1),
('sub_verres_trempes', 'Verres trempés', 'verres-trempes', 'Films et vitres de protection écran 9H haute transparence.', 'assets/images/product_img7.webp', 'square', 'cat_telephones', 5, 1, 0),
('sub_accessoires_voiture', 'Accessoires voiture', 'accessoires-voiture', 'Chargeurs allume-cigare, transmetteurs FM Bluetooth et supports grille.', 'assets/images/product_img7.webp', 'car', 'cat_telephones', 6, 1, 0),

-- 2. Audio & Écouteurs
('cat_audio', 'Audio & Écouteurs', 'audio-ecouteurs', 'Le meilleur du son haute fidélité, écouteurs sans fil et casques.', 'assets/images/product_img4.webp', 'headphones', NULL, 2, 1, 1),
('sub_ecouteurs_sans_fil', 'Écouteurs sans fil', 'ecouteurs-sans-fil', 'True Wireless Bluetooth 5.3 avec réduction de bruit active.', 'assets/images/product_img1.webp', 'music', 'cat_audio', 1, 1, 1),
('sub_casques_audio', 'Casques audio', 'casques-audio', 'Casques Bluetooth circum-auriculaires autonomie 40h.', 'assets/images/product_img4.webp', 'headphones', 'cat_audio', 2, 1, 1),
('sub_casques_studio', 'Casques studio', 'casques-studio', 'Casques de monitoring et production musicale professionnelle.', 'assets/images/product_img4.webp', 'sliders', 'cat_audio', 3, 1, 0),
('sub_enceintes_bt', 'Enceintes Bluetooth', 'enceintes-bluetooth', 'Enceintes nomades portables et étanches IPX7.', 'assets/images/product_img2.webp', 'volume-2', 'cat_audio', 4, 1, 1),
('sub_barres_son', 'Barres de son', 'barres-de-son', 'Systèmes home cinéma et barres de son immersives pour salon.', 'assets/images/product_img2.webp', 'tv', 'cat_audio', 5, 1, 0),
('sub_micros_audio', 'Micros & accessoires audio', 'micros-accessoires-audio', 'Micros cravates sans fil, micros podcast et adaptateurs DAC.', 'assets/images/product_img4.webp', 'mic', 'cat_audio', 6, 1, 0),

-- 3. Montres & Objets Connectés
('cat_montres', 'Montres & Objets Connectés', 'montres-objets-connectes', 'Smartwatches, bracelets sport et suivi de santé quotidien.', 'assets/images/product_img8.webp', 'watch', NULL, 3, 1, 1),
('sub_montres_connectees', 'Montres connectées', 'montres-connectees', 'Smartwatches avec écran AMOLED, appels Bluetooth et suivi cardiaque.', 'assets/images/product_img8.webp', 'watch', 'cat_montres', 1, 1, 1),
('sub_bracelets_connectes', 'Bracelets connectés', 'bracelets-connectes', 'Bracelets fitness étanches avec podomètre et suivi sommeil.', 'assets/images/product_img8.webp', 'activity', 'cat_montres', 2, 1, 0),
('sub_accessoires_montres', 'Accessoires montres', 'accessoires-montres', 'Bracelets silicone, cuir, métal et chargeurs magnétiques.', 'assets/images/product_img8.webp', 'link', 'cat_montres', 3, 1, 0),
('sub_trackers_gadgets', 'Trackers & gadgets connectés', 'trackers-gadgets-connectes', 'Balises GPS, bagues connectées et capteurs intelligents.', 'assets/images/product_img8.webp', 'navigation', 'cat_montres', 4, 1, 0),

-- 4. Informatique & Bureau
('cat_informatique', 'Informatique & Bureau', 'informatique-bureau', 'Périphériques, connectique et équipement setup bureautique.', 'assets/images/product_img3.webp', 'laptop', NULL, 4, 1, 1),
('sub_souris', 'Souris', 'souris', 'Souris sans fil ergonomiques, bureautique et précision.', 'assets/images/product_img3.webp', 'mouse', 'cat_informatique', 1, 1, 1),
('sub_claviers', 'Claviers', 'claviers', 'Claviers sans fil silencieux et claviers mécaniques compacts.', 'assets/images/product_img3.webp', 'keyboard', 'cat_informatique', 2, 1, 1),
('sub_supports_laptop', 'Supports laptop', 'supports-laptop', 'Supports aluminium inclinables et refroidisseurs PC portable.', 'assets/images/product_img3.webp', 'maximize-2', 'cat_informatique', 3, 1, 0),
('sub_hubs_adaptateurs', 'Hubs & adaptateurs', 'hubs-adaptateurs', 'Hubs USB-C multiport 8-en-1 HDMI 4K, lecteurs SD.', 'assets/images/product_img3.webp', 'cpu', 'cat_informatique', 4, 1, 1),
('sub_stockage_usb', 'Stockage USB / cartes mémoire', 'stockage-usb-cartes-memoire', 'Clés USB 3.0, cartes MicroSD haute vitesse et SSD externes.', 'assets/images/product_img3.webp', 'hard-drive', 'cat_informatique', 5, 1, 0),
('sub_accessoires_pc', 'Accessoires PC', 'accessoires-pc', 'Tapis de souris XL, housses laptop et kits de nettoyage.', 'assets/images/product_img3.webp', 'monitor', 'cat_informatique', 6, 1, 0),

-- 5. Gaming
('cat_gaming', 'Gaming', 'gaming', 'Équipements haute performance pour joueurs PC, PS5 et Xbox.', 'assets/images/product_img6.webp', 'gamepad-2', NULL, 5, 1, 1),
('sub_casques_gaming', 'Casques gaming', 'casques-gaming', 'Casques surround 7.1 avec micro antibruit et RGB.', 'assets/images/product_img14.webp', 'headphones', 'cat_gaming', 1, 1, 1),
('sub_souris_gaming', 'Souris gaming', 'souris-gaming', 'Souris gamer ultra-légères avec capteur optique 16000 DPI.', 'assets/images/product_img3.webp', 'mouse', 'cat_gaming', 2, 1, 1),
('sub_claviers_gaming', 'Claviers gaming', 'claviers-gaming', 'Claviers mécaniques RGB avec switches réactifs.', 'assets/images/product_img6.webp', 'keyboard', 'cat_gaming', 3, 1, 0),
('sub_manettes', 'Manettes', 'manettes', 'Manettes sans fil pour PC, PlayStation, Xbox et smartphone.', 'assets/images/product_img6.webp', 'gamepad', 'cat_gaming', 4, 1, 1),
('sub_supports_console', 'Supports & accessoires console', 'supports-accessoires-console', 'Stations de recharge doubles, grips et housses de protection.', 'assets/images/product_img6.webp', 'layers', 'cat_gaming', 5, 1, 0),

-- 6. Maison & Énergie
('cat_maison', 'Maison & Énergie', 'maison-energie', 'Éclairage intelligent, solutions d’alimentation et domotique.', 'assets/images/product_img13.webp', 'zap', NULL, 6, 1, 1),
('sub_lampes_led', 'Lampes LED', 'lampes-led', 'Lampes de bureau tactiles avec chargeur induction et veilleuses.', 'assets/images/product_img13.webp', 'sun', 'cat_maison', 1, 1, 1),
('sub_prises_multiprises', 'Prises & multiprises', 'prises-multiprises', 'Multiprises parasurtenseurs avec ports USB et prises connectées.', 'assets/images/product_img13.webp', 'power', 'cat_maison', 2, 1, 1),
('sub_chargeurs_secteur', 'Chargeurs secteur', 'chargeurs-secteur', 'Blocs de charge murale multi-ports GaN pour toute la maison.', 'assets/images/product_img7.webp', 'plug', 'cat_maison', 3, 1, 0),
('sub_eclairage_deco', 'Éclairage décoratif', 'eclairage-decoratif', 'Rubans LED RGB, barres lumineuses d’ambiance et projecteurs.', 'assets/images/product_img13.webp', 'sparkles', 'cat_maison', 4, 1, 0),
('sub_accessoires_domotique', 'Accessoires maison connectée', 'accessoires-maison-connectee', 'Capteurs d’humidité, thermomètres digitaux et prises Wi-Fi.', 'assets/images/product_img13.webp', 'home', 'cat_maison', 5, 1, 0),

-- 7. Sécurité & Caméras
('cat_securite', 'Sécurité & Caméras', 'securite-cameras', 'Surveillance vidéo intelligente, caméras Wi-Fi et capteurs de sécurité.', 'assets/images/product_img14.webp', 'camera', NULL, 7, 1, 1),
('sub_cameras_wifi', 'Caméras Wi-Fi', 'cameras-wi-fi', 'Caméras de surveillance 1080p/2K avec vision nocturne et audio bidirectionnel.', 'assets/images/product_img14.webp', 'camera', 'cat_securite', 1, 1, 1),
('sub_cameras_bebe', 'Caméras bébé', 'cameras-bebe', 'Babyphones vidéo connectés avec détection de mouvement et berceuses.', 'assets/images/product_img14.webp', 'eye', 'cat_securite', 2, 1, 0),
('sub_mini_cameras', 'Mini caméras', 'mini-cameras', 'Mini caméras discrètes et autonomes avec enregistrement sur carte SD.', 'assets/images/product_img14.webp', 'video', 'cat_securite', 3, 1, 0),
('sub_accessoires_surveillance', 'Accessoires surveillance', 'accessoires-surveillance', 'Panneaux solaires pour caméras, câbles d’alimentation longs et supports muraux.', 'assets/images/product_img14.webp', 'shield-check', 'cat_securite', 4, 1, 0);

-- Produits Exemple avec Catégories et Sous-Catégories
INSERT INTO `products` (`id`, `store_id`, `category_id`, `subcategory_id`, `category`, `subcategory`, `brand`, `name`, `slug`, `description`, `mrp`, `price`, `discount_percent`, `images`, `in_stock`, `stock`, `is_active`, `is_featured`, `is_new`, `is_flash_sale`, `is_express_delivery`, `connection_type`, `compatibility`, `color`, `rating`, `review_count`) VALUES
('prod_1', 'store_sentech', 'cat_audio', 'sub_casques_audio', 'Audio & Écouteurs', 'Casques audio', 'Sony', 'Casque Studio Pro Sans Fil ANC', 'casque-studio-pro-sans-fil-anc', 'Réduction active du bruit ; Autonomie 40h ; Bluetooth 5.3 ; Audio Hi-Res certifié ; Coussinets à mémoire de forme.', 55000.00, 45000.00, 18, '["assets/images/product_img4.webp"]', 1, 15, 1, 1, 1, 1, 1, 'Bluetooth', 'iPhone, Android, PC', 'Noir Sidéral', 4.9, 28),
('prod_2', 'store_sentech', 'cat_montres', 'sub_montres_connectees', 'Montres & Objets Connectés', 'Montres connectées', 'Samsung', 'Montre Connectée Sport V3 AMOLED', 'montre-connectee-sport-v3-amoled', 'Écran AMOLED HD 1.43 pouces ; Appels Bluetooth clairs ; Capteur cardiaque & SpO2 24/7 ; 100+ modes sport ; Étanche IP68.', 40000.00, 32000.00, 20, '["assets/images/product_img8.webp"]', 1, 8, 1, 1, 0, 1, 1, 'Bluetooth', 'iPhone, Android', 'Gris Titane', 4.8, 19),
('prod_3', 'store_happy', 'cat_audio', 'sub_enceintes_bt', 'Audio & Écouteurs', 'Enceintes Bluetooth', 'JBL', 'Enceinte Nomade Bluetooth HD 360°', 'enceinte-nomade-bluetooth-hd-360', 'Son immersif 360° 20W ; Étanche immersion IPX7 ; Autonomie 16h ; Fonction Powerbank intégrée ; Finition tissu renforcé.', 35000.00, 28000.00, 20, '["assets/images/product_img2.webp"]', 1, 12, 1, 1, 0, 0, 1, 'Bluetooth', 'Universel', 'Bleu Océan', 4.7, 14),
('prod_4', 'store_sentech', 'cat_audio', 'sub_ecouteurs_sans_fil', 'Audio & Écouteurs', 'Écouteurs sans fil', 'Anker', 'Écouteurs True Wireless Bass+ Pro', 'ecouteurs-true-wireless-bass-plus-pro', 'Drivers 10mm graphène ; Basses profondes ; Micro 4-mic ENC pour appels clairs ; Boîtier de charge USB-C 30h.', 25000.00, 19500.00, 22, '["assets/images/product_img1.webp"]', 1, 25, 1, 1, 1, 1, 1, 'Bluetooth', 'iPhone, Android, PC', 'Blanc Perle', 4.9, 35),
('prod_5', 'store_happy', 'cat_informatique', 'sub_souris', 'Informatique & Bureau', 'Souris', 'Logitech', 'Souris Ergonomique Sans Fil Silence', 'souris-ergonomique-sans-fil-silence', 'Prise en main naturelle 57° ; Clics silencieux à 90% ; Molette SmartWheel ; Connexion Bluetooth & Récepteur USB Logi Bolt.', 20000.00, 15000.00, 25, '["assets/images/product_img3.webp"]', 1, 18, 1, 1, 0, 0, 1, 'Bluetooth', 'PC, Mac', 'Graphite', 4.8, 22),
('prod_6', 'store_sentech', 'cat_telephones', 'sub_chargeurs_cables', 'Téléphones & Accessoires', 'Chargeurs & câbles', 'Baseus', 'Chargeur Rapide GaN 65W Multi-Port', 'chargeur-rapide-gan-65w-multi-port', 'Technologie GaN III ultra-compacte ; 2 ports USB-C + 1 port USB-A ; Compatible Power Delivery 3.0 & Quick Charge 4+.', 18000.00, 14000.00, 22, '["assets/images/product_img7.webp"]', 1, 30, 1, 1, 1, 0, 1, 'USB-C', 'iPhone, Android, PC', 'Noir Mat', 5.0, 41),
('prod_7', 'store_sentech', 'cat_gaming', 'sub_casques_gaming', 'Gaming', 'Casques gaming', 'Razer', 'Casque Gamer Surround 7.1 RGB Pro', 'casque-gamer-surround-7-1-rgb-pro', 'Audio spatial 7.1 immersif ; Micro cardioïde antibruit détachable ; Rétroéclairage RGB personnalisable ; Confort oreillettes gel.', 48000.00, 39000.00, 19, '["assets/images/product_img14.webp"]', 1, 7, 1, 1, 0, 1, 1, 'USB-C', 'PC, PS5, Xbox', 'Noir & Vert', 4.8, 16),
('prod_8', 'store_happy', 'cat_maison', 'sub_lampes_led', 'Maison & Énergie', 'Lampes LED', 'Xiaomi', 'Lampe de Bureau LED Tactile avec Induction', 'lampe-de-bureau-led-tactile-induction', 'Variateur d’intensité tactile 5 niveaux ; 3 températures de couleur ; Chargeur induction sans fil 15W intégré sur le socle.', 22000.00, 18000.00, 18, '["assets/images/product_img13.webp"]', 1, 10, 1, 0, 0, 0, 1, 'Filaire', 'Universel', 'Blanc Épuré', 4.6, 9),
('prod_9', 'store_sentech', 'cat_securite', 'sub_cameras_wifi', 'Sécurité & Caméras', 'Caméras Wi-Fi', 'Ezviz', 'Caméra de Surveillance Wi-Fi 2K 360°', 'camera-surveillance-wifi-2k-360', 'Résolution 2K Ultra-HD ; Rotation panoramique 360° ; Vision nocturne couleur infrarouge ; Détection humaine IA & Suivi auto.', 32000.00, 25000.00, 22, '["assets/images/product_img14.webp"]', 1, 14, 1, 1, 1, 0, 1, 'Wi-Fi', 'iPhone, Android', 'Blanc', 4.9, 12);

-- Images des produits
INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`) VALUES
('prod_1', 'assets/images/product_img4.webp', 1, 1),
('prod_2', 'assets/images/product_img8.webp', 1, 1),
('prod_3', 'assets/images/product_img2.webp', 1, 1),
('prod_4', 'assets/images/product_img1.webp', 1, 1),
('prod_5', 'assets/images/product_img3.webp', 1, 1),
('prod_6', 'assets/images/product_img7.webp', 1, 1),
('prod_7', 'assets/images/product_img14.webp', 1, 1),
('prod_8', 'assets/images/product_img13.webp', 1, 1),
('prod_9', 'assets/images/product_img14.webp', 1, 1);

-- Coupons de réduction
INSERT INTO `coupons` (`code`, `description`, `discount`, `for_new_user`, `for_member`, `is_public`, `expires_at`) VALUES
('BIENVENUE10', '10% de réduction immédiate sur votre 1ère commande Dakar', 10.00, 1, 0, 1, '2026-12-31 23:59:59'),
('SENTECH15', '15% de remise spéciale sur tous les accessoires audio', 15.00, 0, 0, 1, '2026-12-31 23:59:59');

-- -----------------------------------------------------------------------------
-- 15. Table `brands` (Marques officielles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL UNIQUE,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `logo` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 16. Table `collections` (Collections Marketing)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `collections` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL UNIQUE,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `badge_text` VARCHAR(64) NULL,
  `icon` VARCHAR(64) NULL,
  `description` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 17. Table `product_variants` (Variantes type Apple : couleur, capacité, modèle)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `sku` VARCHAR(64) NULL,
  `variant_type` VARCHAR(64) NOT NULL DEFAULT 'color',
  `name` VARCHAR(128) NOT NULL,
  `price` DECIMAL(12,2) NULL,
  `mrp` DECIMAL(12,2) NULL,
  `stock` INT NOT NULL DEFAULT 10,
  `image_url` VARCHAR(255) NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 18. Table `product_specs` (Fiche technique flexible Clé/Valeur)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_specs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `spec_key` VARCHAR(128) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 19. Table `product_questions` (FAQ & Questions/Réponses Produits)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_questions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NULL,
  `user_name` VARCHAR(128) NOT NULL,
  `question` TEXT NOT NULL,
  `answer` TEXT NULL,
  `is_approved` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 20. Table `product_related` (Produits associés manuellement)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_related` (
  `product_id` VARCHAR(64) NOT NULL,
  `related_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`product_id`, `related_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`related_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 21. Table `inventory_movements` (Traçabilité & Historique des Stocks)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory_movements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `variant_id` VARCHAR(64) NULL,
  `type` VARCHAR(32) NOT NULL,
  `quantity` INT NOT NULL,
  `reference` VARCHAR(128) NULL,
  `note` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seeds Brands & Collections
INSERT IGNORE INTO `brands` (`id`, `name`, `slug`, `is_featured`) VALUES
('b_sony', 'Sony', 'sony', 1),
('b_apple', 'Apple', 'apple', 1),
('b_samsung', 'Samsung', 'samsung', 1),
('b_jbl', 'JBL', 'jbl', 1),
('b_anker', 'Anker', 'anker', 1),
('b_baseus', 'Baseus', 'baseus', 1),
('b_logitech', 'Logitech', 'logitech', 1),
('b_razer', 'Razer', 'razer', 1),
('b_xiaomi', 'Xiaomi', 'xiaomi', 1),
('b_ezviz', 'Ezviz', 'ezviz', 1);

INSERT IGNORE INTO `collections` (`id`, `name`, `slug`, `badge_text`, `icon`, `display_order`) VALUES
('col_flash', 'Ventes Flash', 'flash', '⚡ FLASH', 'flame', 1),
('col_new', 'Nouveautés', 'new', '✨ NEW', 'sparkles', 2),
('col_bestseller', 'Meilleures Ventes', 'bestseller', '🔥 BEST', 'trending-up', 3),
('col_under10k', 'Moins de 10 000 FCFA', 'under10k', '🏷️ <10K', 'tag', 4),
('col_under25k', 'Moins de 25 000 FCFA', 'under25k', '🏷️ <25K', 'tag', 5),
('col_express', 'Livraison Express 24h', 'express', '🚚 EXPRESS', 'truck', 6);





-- =============================================================================
-- ADDITIONAL EXTENSION TABLES (Banners, CMS, Settings, Funnel)
-- =============================================================================

-- =============================================================================
-- SenTechPLUS — Banners / Promotional Sliders Migration
-- Idempotent: safe to run multiple times
-- Compatible: MySQL 5.7+ / MariaDB 10.3+
-- =============================================================================

CREATE TABLE IF NOT EXISTS `banners` (
  `id`             INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `title`          VARCHAR(255)    NOT NULL DEFAULT '',
  `subtitle`       VARCHAR(500)    NOT NULL DEFAULT '',
  `image_desktop`  VARCHAR(500)    NOT NULL DEFAULT '',
  `image_mobile`   VARCHAR(500)    NOT NULL DEFAULT '',
  `link_url`       VARCHAR(500)    NOT NULL DEFAULT '',
  `button_text`    VARCHAR(100)    NOT NULL DEFAULT '',
  `placement`      VARCHAR(100)    NOT NULL DEFAULT 'hero_home'
                   COMMENT 'hero_home | promo_home | shop_top | product_top',
  `display_order`  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`      TINYINT(1)      NOT NULL DEFAULT 1,
  `starts_at`      DATETIME        NULL     DEFAULT NULL,
  `ends_at`        DATETIME        NULL     DEFAULT NULL,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_placement_active_order` (`placement`, `is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Promotional banner sliders managed from admin';

-- Sample data (hero home)
INSERT IGNORE INTO `banners` (`id`, `title`, `subtitle`, `image_desktop`, `image_mobile`, `link_url`, `button_text`, `placement`, `display_order`, `is_active`) VALUES
(1, 'Des accessoires intelligents pour votre quotidien', 'Audio HD, montres connectées et charge rapide certifiés au Sénégal', 'assets/images/product_img4.webp', '', 'shop.php', 'Explorer la collection', 'hero_home', 1, 1),
(2, 'Ventes Flash — Jusqu\'à -35%', 'Offres exclusives sur les meilleurs produits high-tech', 'assets/images/product_img8.webp', '', 'shop.php?collection=flash', 'Profiter maintenant', 'hero_home', 2, 1),
(3, 'Nouveautés 2026 disponibles', 'Découvrez les dernières technologies audio et wearables', 'assets/images/product_img2.webp', '', 'shop.php?sort=newest', 'Voir les nouveautés', 'hero_home', 3, 1);


-- =============================================================================
-- Migration SenTechPLUS : Cockpit Administrateur Central & Paramètres CMS
-- =============================================================================

SET NAMES utf8mb4;

-- 1. Table `site_settings` (Paramètres généraux du site)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(64) NOT NULL UNIQUE,
  `setting_value` TEXT NULL,
  `setting_group` VARCHAR(64) NOT NULL DEFAULT 'general', -- 'general', 'contact', 'delivery', 'social', 'seo'
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des paramètres par défaut
INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`, `description`) VALUES
('site_name', 'SenTechPLUS', 'general', 'Nom officiel de la boutique'),
('site_tagline', 'Le Meilleur du High-Tech au Sénégal', 'general', 'Slogan principal'),
('site_logo', 'assets/images/sentech_logo.webp', 'general', 'URL du logo officiel'),
('site_favicon', 'assets/images/favicon.ico', 'general', 'Favicon du site'),
('contact_email', 'contact@sentechplus.com', 'contact', 'Email officiel du support'),
('contact_phone', '+221 78 131 64 97', 'contact', 'Numéro de téléphone principal'),
('contact_whatsapp', '+221 78 131 64 97', 'contact', 'Numéro WhatsApp pour commandes directes'),
('contact_address', 'Rue MZ-12, Sacré-Cœur 3 / VDN, Dakar, Sénégal', 'contact', 'Adresse physique du siège / showroom'),
('opening_hours', 'Lun - Sam : 08h30 - 20h00 | Dim : 10h00 - 18h00', 'contact', 'Horaires d''ouverture'),
('currency', 'FCFA', 'general', 'Devise de facturation'),
('delivery_fee_dakar_std', '2000', 'delivery', 'Frais livraison standard Dakar (FCFA)'),
('delivery_fee_dakar_exp', '3000', 'delivery', 'Frais livraison express Dakar H+2 (FCFA)'),
('delivery_fee_regions', '5000', 'delivery', 'Frais livraison hors Dakar (FCFA)'),
('delivery_notice', 'Livraison Express en 2h à Dakar • Paiement à la livraison disponible', 'delivery', 'Message de réassurance livraison'),
('social_facebook', 'https://facebook.com/sentechplus', 'social', 'Lien Facebook'),
('social_instagram', 'https://instagram.com/sentechplus', 'social', 'Lien Instagram'),
('social_tiktok', 'https://tiktok.com/@sentechplus', 'social', 'Lien TikTok'),
('footer_copyright', '© 2026 SenTechPLUS. Tous droits réservés. Dakar, Sénégal.', 'general', 'Texte de copyright footer'),
('highlighted_promo_code', 'NEW20', 'general', 'Code promo mis en avant');

-- 2. Table `pages` (Pages CMS & Référencement SEO)
CREATE TABLE IF NOT EXISTS `pages` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `title` VARCHAR(191) NOT NULL,
  `headline` VARCHAR(255) NULL,
  `content` LONGTEXT NULL,
  `meta_title` VARCHAR(191) NULL,
  `meta_description` VARCHAR(255) NULL,
  `main_image` VARCHAR(255) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des pages du site
INSERT IGNORE INTO `pages` (`id`, `slug`, `title`, `headline`, `meta_title`, `meta_description`, `is_active`) VALUES
('page_home', 'home', 'Accueil', 'Le Meilleur du High-Tech au Sénégal', 'SenTechPLUS | Boutique High-Tech & Accessoires Dakar', 'Découvrez notre catalogue d''écouteurs, casques, chargeurs GaN et montres connectées au Sénégal.', 1),
('page_shop', 'shop', 'Boutique', 'Tous nos Produits High-Tech Certifiés', 'Boutique High-Tech Dakar | SenTechPLUS', 'Achetez vos accessoires électroniques 100% originaux avec livraison express à Dakar.', 1),
('page_about', 'about', 'À Propos', 'L''Excellence Technologique au Service du Sénégal', 'Qui Sommes-Nous ? | SenTechPLUS Sénégal', 'Présentation de SenTechPLUS, leader de la distribution high-tech garantie à Dakar.', 1),
('page_contact', 'contact', 'Contact & SAV', 'Notre Équipe est à Votre Écoute 7j/7', 'Contactez le Service Client | SenTechPLUS', 'Besoin d''aide ou d''une commande spéciale ? Contactez-nous par WhatsApp ou téléphone.', 1),
('page_terms', 'terms', 'Conditions Générales de Vente', 'Transparence & Garantie Client', 'Conditions Générales de Vente | SenTechPLUS', 'Conditions de vente, de retour et de garantie sur tous nos articles high-tech.', 1),
('page_privacy', 'privacy', 'Politique de Confidentialité', 'Protection de vos Données Personnelles', 'Politique de Confidentialité | SenTechPLUS', 'Comment nous protégeons vos informations lors de vos achats en ligne.', 1);

-- 3. Table `page_sections` (Blocs & Sections éditables des pages)
CREATE TABLE IF NOT EXISTS `page_sections` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `page_slug` VARCHAR(128) NOT NULL,
  `section_key` VARCHAR(64) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `content` TEXT NULL,
  `image_desktop` VARCHAR(255) NULL,
  `image_mobile` VARCHAR(255) NULL,
  `button_text` VARCHAR(64) NULL,
  `button_url` VARCHAR(255) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_section_page` (`page_slug`, `section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des sections par défaut
INSERT IGNORE INTO `page_sections` 
(`id`, `page_slug`, `section_key`, `title`, `subtitle`, `button_text`, `button_url`, `display_order`, `is_active`) VALUES
('sec_home_hero', 'home', 'hero', 'Le Meilleur du High-Tech au Sénégal', 'Casques sans fil, chargeurs GaN, montres connectées et caméras 100% garantis.', 'Explorer la Boutique', 'shop.php', 1, 1),
('sec_home_popular_cat', 'home', 'popular_categories', 'Rayons Populaires', 'Explorez nos 7 univers d''accessoires high-tech.', 'Voir tout', 'shop.php', 2, 1),
('sec_home_flash', 'home', 'flash_sale', 'Ventes Flash du Jour', 'Remises exceptionnelles jusqu''à -35% à durée limitée.', 'Voir les offres', 'shop.php?collection=flash', 3, 1),
('sec_home_reassurance', 'home', 'reassurance', 'Nos Engagements Qualité', 'Livraison Express 2h, Produits 100% Originaux et SAV Dakar.', NULL, NULL, 4, 1);

-- 4. Table `media_library` (Médiathèque centrale des images)
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(32) NOT NULL DEFAULT 'image/webp',
  `file_size` INT NOT NULL DEFAULT 0,
  `category` VARCHAR(64) NOT NULL DEFAULT 'products', -- 'products', 'banners', 'categories', 'general'
  `uploaded_by` VARCHAR(128) NULL DEFAULT 'admin',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des images existantes dans la médiathèque
INSERT IGNORE INTO `media_library` (`filename`, `original_name`, `file_path`, `file_type`, `category`) VALUES
('sentech_logo.webp', 'sentech_logo.webp', 'assets/images/sentech_logo.webp', 'image/webp', 'general'),
('product_img1.webp', 'product_img1.webp', 'assets/images/product_img1.webp', 'image/webp', 'products'),
('product_img2.webp', 'product_img2.webp', 'assets/images/product_img2.webp', 'image/webp', 'products'),
('product_img3.webp', 'product_img3.webp', 'assets/images/product_img3.webp', 'image/webp', 'products'),
('product_img4.webp', 'product_img4.webp', 'assets/images/product_img4.webp', 'image/webp', 'products'),
('product_img7.webp', 'product_img7.webp', 'assets/images/product_img7.webp', 'image/webp', 'products'),
('product_img8.webp', 'product_img8.webp', 'assets/images/product_img8.webp', 'image/webp', 'products'),
('product_img13.webp', 'product_img13.webp', 'assets/images/product_img13.webp', 'image/webp', 'products'),
('product_img14.webp', 'product_img14.webp', 'assets/images/product_img14.webp', 'image/webp', 'products');

-- 5. Table `admin_activity_logs` (Journal d'activité des administrateurs)
CREATE TABLE IF NOT EXISTS `admin_activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `admin_id` VARCHAR(64) NULL,
  `admin_name` VARCHAR(128) NOT NULL DEFAULT 'Administrateur',
  `action` VARCHAR(64) NOT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- Migration SenTechPLUS : Système d'Annonces & Bannières Header et Pages
-- Table : announcements
-- =============================================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `type` VARCHAR(64) NOT NULL DEFAULT 'text', -- 'text', 'flash_promo', 'coupon_code', 'image_banner', 'whatsapp', 'delivery'
  `placement` VARCHAR(64) NOT NULL DEFAULT 'header_top_center', -- 'header_top_left', 'header_top_center', 'header_top_right', 'hero_banner', 'mobile_header_banner', 'shop_banner', 'product_page_banner'
  `message` TEXT NULL,
  `button_text` VARCHAR(64) NULL,
  `button_url` VARCHAR(255) NULL,
  `target_blank` TINYINT(1) NOT NULL DEFAULT 0,
  `badge_text` VARCHAR(64) NULL,
  `discount_text` VARCHAR(64) NULL,
  `image_desktop` VARCHAR(255) NULL,
  `image_mobile` VARCHAR(255) NULL,
  `background_color` VARCHAR(32) NULL DEFAULT '#FFFFFF',
  `text_color` VARCHAR(32) NULL DEFAULT '#182230',
  `button_color` VARCHAR(32) NULL DEFAULT '#1677FF',
  `icon` VARCHAR(64) NULL DEFAULT 'sparkles',
  `starts_at` DATETIME NULL,
  `ends_at` DATETIME NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_announcement_active_placement` (`is_active`, `placement`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des annonces par défaut (Header Top Cards)
INSERT IGNORE INTO `announcements` 
(`id`, `title`, `subtitle`, `type`, `placement`, `message`, `button_text`, `button_url`, `target_blank`, `badge_text`, `discount_text`, `icon`, `background_color`, `display_order`, `is_active`) 
VALUES
('ann_top_left', 'Livraison Express Dakar H+2', 'Courses et livraisons express dans toute la région de Dakar.', 'delivery', 'header_top_left', 'Livraison express à domicile et au bureau en 2 heures.', 'Commander', 'shop.php', 0, 'EXPRESS SÉNÉGAL', NULL, 'truck', '#FFFFFF', 1, 1),
('ann_top_center', 'Vente Flash -35% High-Tech', 'Offres limitées sur une sélection d\'accessoires premium.', 'flash_promo', 'header_top_center', 'Profitez de remises exclusives sur les casques et chargeurs.', 'Profiter', 'shop.php?collection=flash', 0, 'FLASH', '-35%', 'flame', '#FFFFFF', 2, 1),
('ann_top_right', 'Code Promo: NEW20 (-20%)', 'Valable sur votre premier panier d\'accessoires connectés.', 'coupon_code', 'header_top_right', 'Utilisez le code promo NEW20 lors de votre commande.', 'Utiliser', 'shop.php?search=Promo', 0, 'REMISE 20%', 'NEW20', 'sparkles', '#FFFFFF', 3, 1),
('ann_mobile', 'Vente Flash -35% High-Tech', 'Offres exclusives Dakar', 'flash_promo', 'mobile_header_banner', 'Vente Flash -35% High-Tech', 'Profiter', 'shop.php?collection=flash', 0, 'FLASH', '-35%', 'flame', '#FFFFFF', 1, 1),
('ann_hero_1', 'Le Meilleur du High-Tech au Sénégal', 'Casques sans fil, chargeurs GaN, montres connectées et caméras.', 'image_banner', 'hero_banner', 'Des équipements 100% originaux avec garantie et livraison rapide.', 'Découvrir la Boutique', 'shop.php', 0, 'NOUVEAUTÉ 2026', '-30%', 'shield-check', '#0B54C2', 1, 1);


-- =============================================================================
-- Migration SenTechPLUS : Tunnel de Commande Entreprise & Gestion des Commandes
-- =============================================================================

SET NAMES utf8mb4;

-- 1. Table `delivery_zones` (Zones & Tarifs de Livraison Sénégal)
CREATE TABLE IF NOT EXISTS `delivery_zones` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `region` VARCHAR(128) NOT NULL,
  `city` VARCHAR(128) NOT NULL,
  `fee` DECIMAL(12,2) NOT NULL DEFAULT 2000.00,
  `express_fee` DECIMAL(12,2) NOT NULL DEFAULT 3500.00,
  `estimated_hours` VARCHAR(64) NOT NULL DEFAULT '24h - 48h',
  `express_available` TINYINT(1) NOT NULL DEFAULT 1,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des zones de livraison par défaut
INSERT IGNORE INTO `delivery_zones` (`id`, `region`, `city`, `fee`, `express_fee`, `estimated_hours`, `express_available`) VALUES
('zone_dakar', 'Dakar', 'Dakar & Banlieue', 2000.00, 3000.00, '2h - 4h (Express)', 1),
('zone_thies', 'Thiès', 'Thiès / Mbour / Saly', 3500.00, 5000.00, '24h', 1),
('zone_stlouis', 'Saint-Louis', 'Saint-Louis', 4500.00, 7000.00, '24h - 48h', 0),
('zone_regions', 'Autres Régions', 'Ziguinchor / Touba / Kaolack', 5000.00, 8000.00, '48h - 72h', 0);

-- 2. Mise à niveau de la table `orders`
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `order_number` VARCHAR(64) NOT NULL UNIQUE,
  `user_id` VARCHAR(64) NULL,
  `customer_first_name` VARCHAR(128) NOT NULL,
  `customer_last_name` VARCHAR(128) NOT NULL,
  `customer_email` VARCHAR(191) NULL,
  `customer_phone` VARCHAR(64) NOT NULL,
  `delivery_region` VARCHAR(128) NOT NULL DEFAULT 'Dakar',
  `delivery_city` VARCHAR(128) NOT NULL DEFAULT 'Dakar',
  `delivery_district` VARCHAR(128) NULL,
  `delivery_address` VARCHAR(255) NOT NULL,
  `delivery_landmark` VARCHAR(255) NULL,
  `delivery_instructions` TEXT NULL,
  `delivery_method` VARCHAR(64) NOT NULL DEFAULT 'express', -- 'express', 'standard', 'pickup'
  `delivery_fee` DECIMAL(12,2) NOT NULL DEFAULT 2000.00,
  `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount_total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00, -- alias pour compatibilité
  `coupon_code` VARCHAR(64) NULL,
  `payment_method` VARCHAR(64) NOT NULL DEFAULT 'cod', -- 'cod', 'wave', 'om', 'free'
  `payment_status` VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  `order_status` VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  `status` VARCHAR(32) NOT NULL DEFAULT 'ORDER_PLACED', -- alias
  `notes` TEXT NULL,
  `admin_notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_user` (`user_id`),
  INDEX `idx_order_status` (`order_status`),
  INDEX `idx_order_number` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Mise à niveau de la table `order_items` avec snapshots
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL,
  `product_id` VARCHAR(64) NOT NULL,
  `variant_id` VARCHAR(64) NULL,
  `product_name_snapshot` VARCHAR(255) NOT NULL,
  `product_image_snapshot` VARCHAR(255) NULL,
  `variant_snapshot` VARCHAR(128) NULL,
  `unit_price` DECIMAL(12,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table `order_status_history` (Journalisation de l'évolution des statuts)
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(64) NOT NULL,
  `status_from` VARCHAR(32) NULL,
  `status_to` VARCHAR(32) NOT NULL,
  `note` TEXT NULL,
  `created_by` VARCHAR(128) NULL DEFAULT 'system',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table `coupon_usages` (Suivi de l'utilisation des coupons)
CREATE TABLE IF NOT EXISTS `coupon_usages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `coupon_code` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NULL,
  `order_id` VARCHAR(64) NOT NULL,
  `discount_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `used_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


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


﻿-- =============================================================================
-- SenTechPLUS — Complete Automated Email & Verification System Schema
-- =============================================================================

CREATE TABLE IF NOT EXISTS `email_verifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `otp_code` VARCHAR(6) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `is_used` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `verified_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_ev_token` (`token`),
  INDEX `idx_ev_email_otp` (`email`, `otp_code`),
  INDEX `idx_ev_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_queue` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `recipient_email` VARCHAR(191) NOT NULL,
  `recipient_name` VARCHAR(191) NOT NULL DEFAULT '',
  `subject` VARCHAR(255) NOT NULL,
  `body_html` MEDIUMTEXT NOT NULL,
  `template_type` VARCHAR(64) NOT NULL DEFAULT 'general' COMMENT 'verification | order_confirmation | status_update | password_reset | admin_alert',
  `status` ENUM('pending', 'sending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
  `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `max_attempts` TINYINT UNSIGNED NOT NULL DEFAULT 3,
  `error_message` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sent_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_eq_status_created` (`status`, `created_at`),
  INDEX `idx_eq_template` (`template_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `smtp_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `smtp_host` VARCHAR(191) NOT NULL DEFAULT 'smtp.hostinger.com',
  `smtp_port` INT NOT NULL DEFAULT 465,
  `smtp_encryption` VARCHAR(10) NOT NULL DEFAULT 'ssl' COMMENT 'ssl | tls | none',
  `smtp_user` VARCHAR(191) NOT NULL DEFAULT 'contact@sentechplus.com',
  `smtp_pass` VARCHAR(255) NOT NULL DEFAULT '',
  `from_name` VARCHAR(191) NOT NULL DEFAULT 'SenTechPLUS Sénégal',
  `from_email` VARCHAR(191) NOT NULL DEFAULT 'contact@sentechplus.com',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample default SMTP config if empty
INSERT IGNORE INTO `smtp_settings` (`id`, `smtp_host`, `smtp_port`, `smtp_encryption`, `smtp_user`, `smtp_pass`, `from_name`, `from_email`, `is_active`)
VALUES (1, 'smtp.hostinger.com', 465, 'ssl', 'contact@sentechplus.com', '', 'SenTechPLUS Dakar', 'contact@sentechplus.com', 1);

-- ─── 2. INDEX D'OPTIMISATION HAUTE CONCURRENCE & SCALABILITÉ ─────────────────
-- =============================================================================
-- SenTechPLUS — Index de Scalabilité & Haute Performance MySQL (1000+ Utilisateurs)
-- =============================================================================

ALTER TABLE `products` 
  ADD INDEX IF NOT EXISTS `idx_prod_perf_cat` (`category_id`, `is_active`, `in_stock`),
  ADD INDEX IF NOT EXISTS `idx_prod_perf_price` (`price`, `is_active`),
  ADD INDEX IF NOT EXISTS `idx_prod_perf_created` (`created_at`, `is_active`);

ALTER TABLE `categories`
  ADD INDEX IF NOT EXISTS `idx_cat_perf_tree` (`parent_id`, `is_active`, `display_order`),
  ADD INDEX IF NOT EXISTS `idx_cat_perf_slug` (`slug`, `is_active`);

ALTER TABLE `banners`
  ADD INDEX IF NOT EXISTS `idx_ban_perf_placement` (`placement`, `is_active`, `display_order`);

ALTER TABLE `orders`
  ADD INDEX IF NOT EXISTS `idx_ord_perf_user` (`user_id`, `created_at`),
  ADD INDEX IF NOT EXISTS `idx_ord_perf_status` (`status`, `created_at`),
  ADD INDEX IF NOT EXISTS `idx_ord_perf_number` (`order_number`);


-- ─── 3. DONNÉES INITIALES & CATALOGUE CERTIFIÉ ───────────────────────────────
-- =============================================================================
-- SenTechPLUS — Données de Départ Professionnelles & Catalogue Réaliste
-- Fichier : database/seed.sql
-- Importation : phpMyAdmin -> Importer -> Sélectionner database/seed.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── 1. UTILISATEURS & BOUTIQUE OFFICIELLE ───────────────────────────────────

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `image`) VALUES
('usr_admin_1', 'Administrateur SenTechPLUS', 'admin@sentechplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'assets/images/profile_pic1.webp'),
('usr_seller_1', 'SenTech Official Store', 'store@sentechplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller', 'assets/images/profile_pic2.webp'),
('usr_client_1', 'Moussa Diallo', 'client@sentechplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'assets/images/profile_pic3.webp')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `role`=VALUES(`role`);



-- ─── 2. CATÉGORIES PRINCIPALES (8) & SOUS-CATÉGORIES (26) ───────────────────

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
-- 8 Catégories Principales
('cat_telephones', 'Téléphones & Accessoires', 'telephones-accessoires', 'Coques, chargeurs rapides, câbles renforcés et supports voiture.', 'smartphone', NULL, 1, 1, 1),
('cat_audio', 'Audio & Écouteurs', 'audio-ecouteurs', 'Écouteurs sans fil ANC, casques studio et enceintes Bluetooth haute fidélité.', 'headphones', NULL, 2, 1, 1),
('cat_montres', 'Montres & Objets Connectés', 'montres-objets-connectes', 'Montres intelligentes, bracelets sport et traqueurs d''activité.', 'watch', NULL, 3, 1, 1),
('cat_informatique', 'Informatique & Bureau', 'informatique-bureau', 'Souris ergonomiques, claviers sans fil, hubs USB-C et supports laptop.', 'laptop', NULL, 4, 1, 1),
('cat_gaming', 'Gaming & Jeux Vidéo', 'gaming-jeux-video', 'Casques surround 7.1, souris RGB ultra-réactives et accessoires gamer.', 'gamepad-2', NULL, 5, 1, 1),
('cat_energie', 'Maison & Énergie', 'maison-energie', 'Batteries externes solaires, lampes LED d''ambiance et prises intelligentes.', 'zap', NULL, 6, 1, 1),
('cat_securite', 'Sécurité & Caméras', 'securite-cameras', 'Caméras de surveillance Wi-Fi, baby monitors et systèmes d''alerte.', 'shield-check', NULL, 7, 1, 1),
('cat_promos', 'Promos & Bons Plans', 'promos-bons-plans', 'Ventes flash et remises exceptionnelles jusqu''à -40% sur le high-tech.', 'tag', NULL, 8, 1, 1),

-- Sous-catégories Téléphones
('sub_supports', 'Supports Voiture & Bureau', 'supports-voiture-bureau', 'Supports magnétiques MagSafe et pinces grille aération.', 'smartphone', 'cat_telephones', 1, 1, 0),
('sub_chargeurs', 'Chargeurs & Câbles', 'chargeurs-cables', 'Chargeurs GaN rapides et câbles tressés 100W.', 'zap', 'cat_telephones', 2, 1, 0),
('sub_powerbanks', 'Batteries Externes', 'batteries-externes', 'Power banks haute capacité 10000mAh à 30000mAh.', 'battery-charging', 'cat_telephones', 3, 1, 0),
('sub_protections', 'Coques & Verres Trempés', 'coques-verres-trempes', 'Protection intégrale anti-chocs et anti-rayures.', 'shield', 'cat_telephones', 4, 1, 0),

-- Sous-catégories Audio
('sub_ecouteurs', 'Écouteurs Sans Fil (TWS)', 'ecouteurs-sans-fil-tws', 'True wireless avec réduction active du bruit.', 'headphones', 'cat_audio', 1, 1, 0),
('sub_casques', 'Casques Audio Bluetooth', 'casques-audio-bluetooth', 'Casques arceau supra et circum-auriculaires.', 'headphones', 'cat_audio', 2, 1, 0),
('sub_enceintes', 'Enceintes Portables', 'enceintes-portables', 'Enceintes Bluetooth étanches et nomades.', 'volume-2', 'cat_audio', 3, 1, 0),

-- Sous-catégories Montres
('sub_smartwatches', 'Montres Connectées Sport', 'montres-connectees-sport', 'Suivi cardiaque, GPS et autonomie longue durée.', 'watch', 'cat_montres', 1, 1, 0),
('sub_bracelets', 'Bracelets Connectés', 'bracelets-connectes', 'Compteurs de pas légers et étanches.', 'activity', 'cat_montres', 2, 1, 0),
('sub_accessoires_montres', 'Accessoires Montres', 'accessoires-montres', 'Bracelets en silicone, cuir et chargeurs magnétiques.', 'watch', 'cat_montres', 3, 1, 0),

-- Sous-catégories Informatique
('sub_souris_clavier', 'Souris & Claviers Sans Fil', 'souris-claviers-sans-fil', 'Périphériques bureautiques silencieux et ergonomiques.', 'mouse', 'cat_informatique', 1, 1, 0),
('sub_hubs_adaptateurs', 'Hubs & Adaptateurs USB-C', 'hubs-adaptateurs-usb-c', 'Stations d''accueil HDMI 4K, ports SD et Ethernet.', 'cpu', 'cat_informatique', 2, 1, 0),
('sub_supports_pc', 'Supports Laptop & Ergonomie', 'supports-laptop-ergonomie', 'Rehausseurs ventilés en aluminium.', 'monitor', 'cat_informatique', 3, 1, 0),
('sub_webcams', 'Webcams & Ring Lights', 'webcams-ring-lights', 'Caméras Full HD et éclairages pour visio et streaming.', 'video', 'cat_informatique', 4, 1, 0),

-- Sous-catégories Gaming
('sub_souris_gaming', 'Souris Gaming RGB', 'souris-gaming-rgb', 'Capteurs optiques haute précision et rétroéclairage.', 'mouse-pointer', 'cat_gaming', 1, 1, 0),
('sub_casques_gaming', 'Casques Gaming Surround', 'casques-gaming-surround', 'Immersion sonore spatiale et micro anti-bruit.', 'headphones', 'cat_gaming', 2, 1, 0),

-- Sous-catégories Maison & Énergie
('sub_eclairage', 'Lampes & Éclairage LED', 'lampes-eclairage-led', 'Rubans LED et veilleuses d''ambiance intelligentes.', 'sun', 'cat_energie', 1, 1, 0),
('sub_domotique', 'Prises & Domotique Wi-Fi', 'prises-domotique-wifi', 'Prises programmables et contrôle à distance.', 'wifi', 'cat_energie', 2, 1, 0),

-- Sous-catégories Sécurité
('sub_cameras_interieur', 'Caméras Intérieures Wi-Fi', 'cameras-interieures-wifi', 'Surveillance 1080p avec vision nocturne et détection.', 'camera', 'cat_securite', 1, 1, 0),
('sub_cameras_bebe', 'Babyphones & Caméras Bébé', 'babyphones-cameras-bebe', 'Audio bidirectionnel et capteur de température.', 'eye', 'cat_securite', 2, 1, 0)

ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `parent_id`=VALUES(`parent_id`), `is_active`=1;

-- ─── 3. COLLECTIONS MARKETING ────────────────────────────────────────────────

INSERT INTO `collections` (`id`, `title`, `slug`, `description`, `is_active`) VALUES
('col_bestsellers', 'Meilleures Ventes', 'meilleures-ventes', 'Les produits les plus plébiscités par nos clients au Sénégal.', 1),
('col_new', 'Dernières Arrivées', 'nouveautes', 'Les nouveautés technologiques tout juste arrivées en stock à Dakar.', 1),
('col_flash', 'Ventes Flash', 'flash-sale', 'Offres limitées dans le temps avec réductions immédiates.', 1),
('col_express', 'Livraison Express 2h', 'livraison-express', 'Disponibles immédiatement pour livraison express à Dakar.', 1),
('col_under_10k', 'Moins de 10 000 FCFA', 'petits-prix-10k', 'Accessoires essentiels à prix très doux.', 1),
('col_under_25k', 'Moins de 25 000 FCFA', 'budget-25k', 'Équipements haute performance à prix accessible.', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `is_active`=1;

-- ─── 4. CATALOGUE DES 26 PRODUITS RÉALISTES ─────────────────────────────────

INSERT INTO `products` 
(`id`, `store_id`, `category_id`, `subcategory_id`, `category`, `subcategory`, `brand`, `name`, `slug`, `description`, `mrp`, `price`, `discount_percent`, `images`, `in_stock`, `stock`, `sales_count`, `is_active`, `is_featured`, `is_new`, `is_flash_sale`, `is_express_delivery`, `connection_type`, `compatibility`, `color`, `rating`, `review_count`) 
VALUES

-- 1. Téléphones & Accessoires
('prod_magsafe_car', 'store_sentech_main', 'cat_telephones', 'sub_supports', 'Téléphones & Accessoires', 'Supports Voiture & Bureau', 'Baseus', 'Support Smartphone Voiture MagSafe 15W', 'support-smartphone-voiture-magsafe', 'Support magnétique ultra-puissant pour grille d''aération. Compatible MagSafe iPhone et smartphones avec anneau magnétique. Rotation 360° fluide et maintien sécurisé sur les routes de Dakar.', 16000.00, 12500.00, 22, '["assets/images/product_img1.webp", "assets/images/product_img2.webp"]', 1, 24, 85, 1, 1, 0, 1, 1, 'Magnétique / Sans fil', 'iPhone 12 à 16, Android avec coque MagSafe', 'Noir Mat', 4.9, 18),

('prod_charger_gan65w', 'store_sentech_main', 'cat_telephones', 'sub_chargeurs', 'Téléphones & Accessoires', 'Chargeurs & Câbles', 'Anker', 'Chargeur Rapide 65W GaN Dual USB-C', 'chargeur-rapide-65w-gan-dual-usbc', 'Chargeur ultra-compact technologie Gallium Nitride (GaN). Permet de recharger simultanément un ordinateur portable (MacBook, Dell) et un smartphone à pleine vitesse.', 28000.00, 22000.00, 21, '["assets/images/product_img7.webp", "assets/images/product_img1.webp"]', 1, 35, 140, 1, 1, 1, 1, 1, 'USB-C / GaN', 'MacBook, iPhone, Samsung Galaxy, iPad, PC USB-C', 'Blanc Titane', 5.0, 32),

('prod_charger_20w_apple', 'store_sentech_main', 'cat_telephones', 'sub_chargeurs', 'Téléphones & Accessoires', 'Chargeurs & Câbles', 'Apple', 'Adaptateur Secteur 20W USB-C Original', 'adaptateur-secteur-20w-usbc-original', 'Bloc de charge rapide 20W certifié Apple. Recharge 50% de batterie en seulement 30 minutes sur tous les iPhone récents.', 15000.00, 11500.00, 23, '["assets/images/product_img7.webp"]', 1, 40, 210, 1, 1, 0, 0, 1, 'USB-C', 'iPhone 8 à iPhone 16 Pro Max, iPad Pro', 'Blanc', 4.8, 45),

('prod_cable_usbc_100w', 'store_sentech_main', 'cat_telephones', 'sub_chargeurs', 'Téléphones & Accessoires', 'Chargeurs & Câbles', 'Baseus', 'Câble USB-C vers USB-C Renforcé 100W 2M', 'cable-usbc-renforce-100w-2m', 'Câble blindé tressé en nylon avec affichage digital LED de la puissance en temps réel. Supporte le transfert de données et la charge ultra-rapide jusqu''à 100W.', 9000.00, 6500.00, 28, '["assets/images/product_img1.webp"]', 1, 50, 95, 1, 0, 0, 1, 1, 'USB-C Filaire', 'Tous appareils avec port USB-C', 'Gris Sidéral', 4.9, 14),

('prod_powerbank_20k', 'store_sentech_main', 'cat_telephones', 'sub_powerbanks', 'Téléphones & Accessoires', 'Batteries Externes', 'Oraimo', 'Power Bank 20 000 mAh Fast Charge 22.5W', 'power-bank-20000mah-fast-charge-oraimo', 'Batterie externe grande capacité avec double sortie USB-A et entrée/sortie USB-C Power Delivery. Écran numérique indiquant le pourcentage précis de batterie restante.', 22000.00, 17500.00, 20, '["assets/images/product_img10.webp", "assets/images/product_img11.webp"]', 1, 18, 62, 1, 1, 0, 0, 1, 'USB-A / USB-C', 'Android, iPhone, Tablettes, Écouteurs', 'Noir Texturé', 4.7, 21),

('prod_pack_accessoires', 'store_sentech_main', 'cat_telephones', 'sub_protections', 'Téléphones & Accessoires', 'Coques & Verres Trempés', 'SenTech', 'Pack Essentiel Protection & Câble Smartphone', 'pack-essentiel-protection-cable', 'Kit complet comprenant un câble de charge rapide 60W, un verre trempé 9D haute résistance et un support de bureau pliable.', 12000.00, 8500.00, 29, '["assets/images/product_img2.webp"]', 1, 30, 48, 1, 0, 1, 0, 1, 'Filaire', 'Universel Android / iPhone', 'Noir / Transparent', 4.8, 9),

-- 2. Audio & Écouteurs
('prod_earbuds_anc_pro', 'store_sentech_main', 'cat_audio', 'sub_ecouteurs', 'Audio & Écouteurs', 'Écouteurs Sans Fil (TWS)', 'Sony', 'Écouteurs Pro ANC Sans Fil Haute Définition', 'ecouteurs-pro-anc-sans-fil-hd', 'Écouteurs true wireless avec réduction active du bruit ambiant jusqu''à -35dB. Transducteurs dynamiques 11mm pour des basses profondes et des voix cristallines. 32h d''autonomie.', 42000.00, 32500.00, 23, '["assets/images/product_img3.webp", "assets/images/product_img5.webp"]', 1, 20, 115, 1, 1, 1, 1, 1, 'Bluetooth 5.3', 'iOS, Android, Windows, Mac', 'Noir Mat', 5.0, 27),

('prod_headphones_studio', 'store_sentech_main', 'cat_audio', 'sub_casques', 'Audio & Écouteurs', 'Casques Audio Bluetooth', 'Sony', 'Casque Audio Sans Fil Studio ANC Over-Ear', 'casque-audio-sans-fil-studio-anc', 'Casque arceau supra-auriculaire avec coussinets à mémoire de forme. Réduction active de bruit, mode transparence et autonomie marathon de 50 heures. Idéal pour studio et voyages.', 58000.00, 45000.00, 22, '["assets/images/product_img4.webp", "assets/images/hero_product_img1.webp"]', 1, 15, 78, 1, 1, 0, 0, 1, 'Bluetooth 5.3 + Jack 3.5mm', 'Smartphones, PC, Consoles de jeux', 'Gris Anthracite', 4.9, 39),

('prod_speaker_smart_gray', 'store_sentech_main', 'cat_audio', 'sub_enceintes', 'Audio & Écouteurs', 'Enceintes Portables', 'JBL', 'Enceinte Bluetooth Smart Gray 20W Waterproof', 'enceinte-bluetooth-smart-gray-20w', 'Enceinte portable certifiée IPX7 résistante à l''eau et à la poussière. Son à 360° percutant et autonomie de 14h pour vos soirées et sorties plage à Dakar.', 35000.00, 27000.00, 23, '["assets/images/product_img6.webp", "assets/images/product_img12.webp"]', 1, 22, 90, 1, 1, 0, 1, 1, 'Bluetooth 5.2', 'Tous smartphones et tablettes', 'Gris Tissé', 4.8, 19),

('prod_speaker_outdoor', 'store_sentech_main', 'cat_audio', 'sub_enceintes', 'Audio & Écouteurs', 'Enceintes Portables', 'Oraimo', 'Enceinte Portable Outdoor Extra Bass 10W', 'enceinte-portable-outdoor-extra-bass', 'Enceinte compacte avec dragonne intégrée. Basses renforcées BassUp, lecteur carte TF et radio FM intégrée.', 18000.00, 13500.00, 25, '["assets/images/product_img12.webp"]', 1, 28, 54, 1, 0, 0, 0, 1, 'Bluetooth 5.0 / MicroSD', 'Android, iOS, PC', 'Noir / Rouge', 4.6, 12),

-- 3. Montres & Objets Connectés
('prod_smartwatch_sport_pro', 'store_sentech_main', 'cat_montres', 'sub_smartwatches', 'Montres & Objets Connectés', 'Montres Connectées Sport', 'Xiaomi', 'Montre Connectée Sport Pro Écran AMOLED', 'montre-connectee-sport-pro-amoled', 'Montre intelligente avec magnifique écran AMOLED 1.43 pouce Always-On. Capteur cardiaque, SpO2 oxygène sanguin, GPS multisport et réception d''appels Bluetooth en direct.', 48000.00, 38000.00, 21, '["assets/images/product_img8.webp", "assets/images/product_img13.webp"]', 1, 16, 88, 1, 1, 1, 1, 1, 'Bluetooth 5.2 / GPS', 'Android 6.0+ et iOS 11.0+', 'Noir Sport', 4.9, 31),

('prod_smartwatch_elegance', 'store_sentech_main', 'cat_montres', 'sub_smartwatches', 'Montres & Objets Connectés', 'Montres Connectées Sport', 'Xiaomi', 'Montre Connectée Élégance Boîtier Métal', 'montre-connectee-elegance-metal', 'Montre connectée au design fin et élégant avec cadran en alliage d''aluminium et bracelet en cuir végétal. Suivi du sommeil, suivi du stress et notifications WhatsApp.', 45000.00, 34500.00, 23, '["assets/images/product_img13.webp", "assets/images/product_img8.webp"]', 1, 12, 42, 1, 0, 0, 0, 1, 'Bluetooth 5.1', 'iPhone et Android', 'Argent & Cuir Brun', 4.8, 15),

-- 4. Informatique & Bureau
('prod_mouse_ergo_wireless', 'store_sentech_main', 'cat_informatique', 'sub_souris_clavier', 'Informatique & Bureau', 'Souris & Claviers Sans Fil', 'Logitech', 'Souris Ergonomique Sans Fil Silencieuse', 'souris-ergonomique-sans-fil-silencieuse', 'Conception ergonomique profilée réduisant la fatigue du poignet. Clics ultra-silencieux, molette de défilement fluide et double connectivité Bluetooth + Dongle USB 2.4GHz.', 18000.00, 14000.00, 22, '["assets/images/product_img14.webp"]', 1, 25, 76, 1, 1, 0, 1, 1, 'Bluetooth + Sans fil 2.4GHz', 'Windows, MacOS, Linux, ChromeOS', 'Noir Mat', 4.9, 23),

('prod_keyboard_bt_compact', 'store_sentech_main', 'cat_informatique', 'sub_souris_clavier', 'Informatique & Bureau', 'Souris & Claviers Sans Fil', 'Logitech', 'Clavier Bluetooth Multi-Device Compact', 'clavier-bluetooth-multidevice-compact', 'Clavier sans fil ultra-fin permettant de basculer instantanément entre 3 appareils (PC, Tablette, Smartphone). Touches douces et silencieuses.', 26000.00, 19500.00, 25, '["assets/images/product_img14.webp"]', 1, 18, 38, 1, 0, 1, 0, 1, 'Bluetooth Multi-Appareils', 'Windows, Mac, iPadOS, Android', 'Gris Clair', 4.7, 11),

('prod_stand_laptop_alu', 'store_sentech_main', 'cat_informatique', 'sub_supports_pc', 'Informatique & Bureau', 'Supports Laptop & Ergonomie', 'Baseus', 'Support Laptop Aluminium Pliable & Réglable', 'support-laptop-aluminium-pliable', 'Support pour ordinateur portable en aluminium brossé premium. 6 angles d''inclinaison pour une posture ergonomique et une meilleure dissipation thermique.', 15000.00, 11000.00, 27, '["assets/images/product_img9.webp"]', 1, 30, 92, 1, 1, 0, 0, 1, 'Mécanique réglable', 'Laptops 10 à 17 pouces, MacBook, iPad', 'Gris Sidéral', 4.9, 26),

('prod_hub_usbc_7in1', 'store_sentech_main', 'cat_informatique', 'sub_hubs_adaptateurs', 'Informatique & Bureau', 'Hubs & Adaptateurs USB-C', 'Ugreen', 'Hub Adaptateur USB-C Multiport 7-en-1 HDMI 4K', 'hub-adaptateur-usbc-7en1-hdmi4k', 'Station d''accueil compacte comprenant 1 port HDMI 4K 60Hz, 3 ports USB 3.0, 1 lecteur de carte SD/TF et 1 port de charge USB-C Power Delivery 100W.', 25000.00, 19500.00, 22, '["assets/images/product_img1.webp"]', 1, 22, 65, 1, 1, 0, 1, 1, 'USB-C vers Multi-ports', 'MacBook Pro/Air, Dell XPS, Lenovo, iPad Pro', 'Aluminium Gris', 4.8, 17),

('prod_webcam_fhd_1080p', 'store_sentech_main', 'cat_informatique', 'sub_webcams', 'Informatique & Bureau', 'Webcams & Ring Lights', 'Logitech', 'Webcam Full HD 1080p avec Micro Réducteur de Bruit', 'webcam-full-hd-1080p-micro', 'Caméra web avec lentille en verre Full HD 1080p à 30fps. Autofocus rapide, correction automatique de faible luminosité et microphone stéréo intégré.', 32000.00, 24500.00, 23, '["assets/images/product_img15.webp"]', 1, 14, 33, 1, 0, 0, 0, 1, 'USB Plug & Play', 'Zoom, Teams, Google Meet, Skype, OBS', 'Noir', 4.7, 8),

('prod_ringlight_led_desk', 'store_sentech_main', 'cat_informatique', 'sub_webcams', 'Informatique & Bureau', 'Webcams & Ring Lights', 'SenTech', 'Ring Light LED de Bureau avec Trépied Réglable', 'ring-light-led-bureau-trepied', 'Anneau lumineux LED 10 pouces avec 3 modes de couleur (chaud, neutre, froid) et 10 niveaux d''intensité. Idéal pour streaming, maquillage et visioconférences.', 16000.00, 11500.00, 28, '["assets/images/product_img9.webp"]', 1, 26, 44, 1, 0, 0, 1, 1, 'Alimentation USB', 'Smartphones et appareils photo', 'Noir', 4.8, 14),

('prod_sdcard_128gb', 'store_sentech_main', 'cat_informatique', 'sub_hubs_adaptateurs', 'Informatique & Bureau', 'Hubs & Adaptateurs USB-C', 'Samsung', 'Carte Mémoire MicroSD EVO Plus 128 Go Class 10', 'carte-memoire-microsd-128go-samsung', 'Vitesse de transfert jusqu''à 130 Mo/s. Résistante à l''eau, aux températures extrêmes et aux rayons X. Adaptateur SD inclus.', 14000.00, 9500.00, 32, '["assets/images/product_img10.webp"]', 1, 45, 120, 1, 0, 0, 1, 1, 'MicroSDXC UHS-I U3', 'Smartphones, Caméras, Drones, Nintendo Switch', 'Blanc & Bleu', 5.0, 35),

-- 5. Gaming
('prod_mouse_gaming_rgb', 'store_sentech_main', 'cat_gaming', 'sub_souris_gaming', 'Gaming', 'Souris Gaming RGB', 'Logitech', 'Souris Gaming RGB Pro Haute Précision 12800 DPI', 'souris-gaming-rgb-pro-12800dpi', 'Souris gamer ultra-légère avec capteur optique haute précision réglable jusqu''à 12800 DPI, 7 boutons programmables et rétroéclairage RGB 16.8 millions de couleurs.', 22000.00, 16500.00, 25, '["assets/images/product_img16.webp"]', 1, 20, 58, 1, 1, 1, 1, 1, 'Filaire USB tressé', 'PC Windows, PS5, Xbox Series', 'Noir RGB', 4.9, 19),

('prod_headset_gaming_71', 'store_sentech_main', 'cat_gaming', 'sub_casques_gaming', 'Gaming', 'Casques Gaming Surround', 'Sony', 'Casque Gaming Surround 7.1 avec Micro Anti-Bruit', 'casque-gaming-surround-71', 'Casque gaming immersif avec son spatial 7.1, haut-parleurs néodyme 50mm, arceau rembourré ajustable et micro rétractable à réduction de bruit.', 38000.00, 29000.00, 24, '["assets/images/hero_product_img2.webp", "assets/images/product_img4.webp"]', 1, 12, 47, 1, 1, 0, 0, 1, 'USB + Jack 3.5mm', 'PlayStation 4/5, Xbox, PC, Nintendo Switch', 'Noir & Bleu Néon', 4.8, 22),

-- 6. Maison & Énergie
('prod_lamp_rgb_ambiance', 'store_sentech_main', 'cat_energie', 'sub_eclairage', 'Maison & Énergie', 'Lampes & Éclairage LED', 'Xiaomi', 'Lampe d''Ambiance LED Intelligente RGB Touch', 'lampe-ambiance-led-rgb-touch', 'Lampe de chevet tactile avec 16 millions de teintes colorées, variateur d''intensité et minuterie sommeil. Compatible contrôle tactile et application smartphone.', 24000.00, 18500.00, 23, '["assets/images/product_img9.webp"]', 1, 18, 36, 1, 0, 0, 0, 1, 'Sans fil / USB-C', 'Application Android et iOS', 'Blanc Dépoli', 4.7, 10),

('prod_plug_smart_wifi', 'store_sentech_main', 'cat_energie', 'sub_domotique', 'Maison & Énergie', 'Prises & Domotique Wi-Fi', 'Xiaomi', 'Prise Connectée Wi-Fi avec Compteur d''Énergie', 'prise-connectee-wifi-compteur-energie', 'Permet d''allumer ou éteindre vos appareils électriques à distance depuis votre téléphone. Suivi en temps réel de votre consommation électrique en kWh.', 12000.00, 8500.00, 29, '["assets/images/product_img1.webp"]', 1, 35, 75, 1, 0, 0, 1, 1, 'Wi-Fi 2.4GHz', 'Tuya, Smart Life, Google Assistant, Alexa', 'Blanc', 4.9, 16),

-- 7. Sécurité & Caméras
('prod_camera_wifi_indoor', 'store_sentech_main', 'cat_securite', 'sub_cameras_interieur', 'Sécurité & Caméras', 'Caméras Intérieures Wi-Fi', 'Xiaomi', 'Mini Caméra de Surveillance Wi-Fi 360° Full HD', 'mini-camera-surveillance-wifi-360', 'Caméra rotative motorisée à 360° avec vision nocturne infrarouge, détection humaine par IA et alertes instantanées sur smartphone. Audio bidirectionnel.', 28000.00, 21500.00, 23, '["assets/images/product_img15.webp", "assets/images/product_img11.webp"]', 1, 15, 68, 1, 1, 0, 1, 1, 'Wi-Fi 2.4GHz', 'iOS et Android', 'Blanc Compact', 4.9, 25),

('prod_camera_baby_monitor', 'store_sentech_main', 'cat_securite', 'sub_cameras_bebe', 'Sécurité & Caméras', 'Babyphones & Caméras Bébé', 'Xiaomi', 'Caméra Bébé Connectée Wi-Fi avec Détection de Pleurs', 'camera-bebe-connectee-wifi', 'Babyphone intelligent avec notification immédiate en cas de pleurs, veilleuse apaisante et berceuses intégrées pilotables depuis le smartphone.', 32000.00, 24000.00, 25, '["assets/images/product_img15.webp"]', 1, 10, 29, 1, 0, 1, 0, 1, 'Wi-Fi / Audio bidirectionnel', 'Application iOS & Android', 'Blanc & Rose Pâle', 4.8, 13)

ON DUPLICATE KEY UPDATE 
`price`=VALUES(`price`), `mrp`=VALUES(`mrp`), `stock`=VALUES(`stock`), `images`=VALUES(`images`), `category_id`=VALUES(`category_id`), `subcategory_id`=VALUES(`subcategory_id`);

-- ─── 5. GALERIE MULTI-IMAGES (PRODUCT_IMAGES) ────────────────────────────────

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`) VALUES
('prod_magsafe_car', 'assets/images/product_img1.webp', 1, 1),
('prod_magsafe_car', 'assets/images/product_img2.webp', 0, 2),
('prod_charger_gan65w', 'assets/images/product_img7.webp', 1, 1),
('prod_charger_gan65w', 'assets/images/product_img1.webp', 0, 2),
('prod_earbuds_anc_pro', 'assets/images/product_img3.webp', 1, 1),
('prod_earbuds_anc_pro', 'assets/images/product_img5.webp', 0, 2),
('prod_headphones_studio', 'assets/images/product_img4.webp', 1, 1),
('prod_headphones_studio', 'assets/images/hero_product_img1.webp', 0, 2),
('prod_smartwatch_sport_pro', 'assets/images/product_img8.webp', 1, 1),
('prod_smartwatch_sport_pro', 'assets/images/product_img13.webp', 0, 2),
('prod_speaker_smart_gray', 'assets/images/product_img6.webp', 1, 1),
('prod_speaker_smart_gray', 'assets/images/product_img12.webp', 0, 2),
('prod_camera_wifi_indoor', 'assets/images/product_img15.webp', 1, 1),
('prod_camera_wifi_indoor', 'assets/images/product_img11.webp', 0, 2)
ON DUPLICATE KEY UPDATE `image_url`=VALUES(`image_url`);

-- ─── 6. LIAISON PRODUITS & COLLECTIONS MARKETING ─────────────────────────────

INSERT IGNORE INTO `collection_products` (`collection_id`, `product_id`) VALUES
-- Meilleures Ventes
('col_bestsellers', 'prod_charger_gan65w'),
('col_bestsellers', 'prod_earbuds_anc_pro'),
('col_bestsellers', 'prod_headphones_studio'),
('col_bestsellers', 'prod_smartwatch_sport_pro'),
('col_bestsellers', 'prod_magsafe_car'),
('col_bestsellers', 'prod_stand_laptop_alu'),

-- Nouveautés
('col_new', 'prod_charger_gan65w'),
('col_new', 'prod_earbuds_anc_pro'),
('col_new', 'prod_smartwatch_sport_pro'),
('col_new', 'prod_keyboard_bt_compact'),
('col_new', 'prod_mouse_gaming_rgb'),
('col_new', 'prod_camera_baby_monitor'),

-- Ventes Flash
('col_flash', 'prod_magsafe_car'),
('col_flash', 'prod_charger_gan65w'),
('col_flash', 'prod_earbuds_anc_pro'),
('col_flash', 'prod_speaker_smart_gray'),
('col_flash', 'prod_smartwatch_sport_pro'),
('col_flash', 'prod_hub_usbc_7in1'),

-- Moins de 10 000 FCFA
('col_under_10k', 'prod_cable_usbc_100w'),
('col_under_10k', 'prod_pack_accessoires'),
('col_under_10k', 'prod_sdcard_128gb'),
('col_under_10k', 'prod_plug_smart_wifi'),

-- Moins de 25 000 FCFA
('col_under_25k', 'prod_magsafe_car'),
('col_under_25k', 'prod_charger_gan65w'),
('col_under_25k', 'prod_charger_20w_apple'),
('col_under_25k', 'prod_powerbank_20k'),
('col_under_25k', 'prod_mouse_ergo_wireless'),
('col_under_25k', 'prod_keyboard_bt_compact'),
('col_under_25k', 'prod_stand_laptop_alu'),
('col_under_25k', 'prod_hub_usbc_7in1'),
('col_under_25k', 'prod_webcam_fhd_1080p'),
('col_under_25k', 'prod_ringlight_led_desk'),
('col_under_25k', 'prod_mouse_gaming_rgb'),
('col_under_25k', 'prod_lamp_rgb_ambiance'),
('col_under_25k', 'prod_camera_wifi_indoor'),
('col_under_25k', 'prod_camera_bebe_connectee');

-- ─── 7. AVIS CLIENTS VÉRIFIÉS ────────────────────────────────────────────────

INSERT INTO `product_reviews` (`id`, `product_id`, `user_name`, `rating`, `comment`, `status`) VALUES
('rev_1', 'prod_headphones_studio', 'Moussa Diallo', 5, 'Excellente qualité sonore et réduction de bruit impressionnante pour les trajets à Dakar ! Livraison reçue en 1h30.', 'published'),
('rev_2', 'prod_charger_gan65w', 'Awa Ndiaye', 5, 'Charge mon MacBook Pro et mon iPhone en même temps à vitesse grand V. Produit 100% original, je recommande vivement !', 'published'),
('rev_3', 'prod_earbuds_anc_pro', 'Cheikh Tidiane Sène', 5, 'Basses bien rondes, les micros en appel sont parfaits même dans le vent. Très satisfait.', 'published'),
('rev_4', 'prod_smartwatch_sport_pro', 'Fatou Kiné Sow', 5, 'L''écran AMOLED est sublime et la batterie tient facilement 8 jours. Reçu avec le livreur très courtois.', 'published'),
('rev_5', 'prod_magsafe_car', 'Ibrahima Ba', 5, 'L''aimant tient fermement mon iPhone même sur les dos d''âne. Super achat !', 'published')
ON DUPLICATE KEY UPDATE `rating`=VALUES(`rating`), `status`='published';

SET FOREIGN_KEY_CHECKS = 1;


SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Fin du script de déploiement — Base de données SenTechPLUS prête pour la production !
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 1;
