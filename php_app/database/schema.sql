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
('user_customer_1', 'Mamadou Diallo', 'client@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', 'user');

-- Boutiques officielles
INSERT INTO `stores` (`id`, `user_id`, `name`, `description`, `username`, `address`, `status`, `is_active`, `logo`, `email`, `contact`) VALUES
('store_sentech', 'user_admin', 'SenTechPLUS Officiel', 'Boutique certifiée officielle SenTechPLUS Dakar. Matériel garanti 100% original.', 'sentechplus', 'Avenue Ponty, Plateau, Dakar', 'approved', 1, 'assets/images/sentech_icon.webp', 'contact@sentechplus.com', '+221 78 131 64 97'),
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

