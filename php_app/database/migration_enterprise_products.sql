-- =============================================================================
-- Migration SenTechPLUS : Architecture Produit Entreprise (Style Apple / Alibaba)
-- Tables : brands, collections, product_variants, product_specs, inventory_movements
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table `brands` (Marques officielles)
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(128) NOT NULL UNIQUE,
  `slug` VARCHAR(128) NOT NULL UNIQUE,
  `logo` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table `collections` (Collections Marketing séparées des catégories)
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

-- 3. Mise à niveau de `products` (Fiche technique, SKU, statut et attributs avancés)
ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `sku` VARCHAR(64) NULL AFTER `id`,
  ADD COLUMN IF NOT EXISTS `brand_id` VARCHAR(64) NULL AFTER `store_id`,
  ADD COLUMN IF NOT EXISTS `short_description` VARCHAR(255) NULL AFTER `name`,
  ADD COLUMN IF NOT EXISTS `stock_status` VARCHAR(32) NOT NULL DEFAULT 'in_stock' AFTER `stock`, -- 'in_stock', 'low_stock', 'out_of_stock', 'draft', 'archived'
  ADD COLUMN IF NOT EXISTS `status` VARCHAR(32) NOT NULL DEFAULT 'active' AFTER `stock_status`, -- 'active', 'draft', 'archived'
  ADD COLUMN IF NOT EXISTS `is_best_seller` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_new`,
  ADD COLUMN IF NOT EXISTS `is_limited_stock` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_flash_sale`,
  ADD COLUMN IF NOT EXISTS `power` VARCHAR(64) NULL AFTER `connection_type`,
  ADD COLUMN IF NOT EXISTS `capacity` VARCHAR(64) NULL AFTER `power`,
  ADD COLUMN IF NOT EXISTS `usage_type` VARCHAR(64) NULL AFTER `compatibility`, -- 'bureau', 'gaming', 'sport', 'voiture', 'maison'
  ADD COLUMN IF NOT EXISTS `warranty` VARCHAR(64) NULL DEFAULT 'Garantie 7 jours' AFTER `color`;

-- 4. Table `product_variants` (Variantes type Apple : couleur, capacité, modèle, prix ajusté)
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `sku` VARCHAR(64) NULL,
  `variant_type` VARCHAR(64) NOT NULL DEFAULT 'color', -- 'color', 'capacity', 'model', 'connectivity', 'pack'
  `name` VARCHAR(128) NOT NULL, -- ex: 'Noir Sidéral', 'Blanc Perle', '65W GaN', 'Avec Boîtier'
  `price` DECIMAL(12,2) NULL, -- Prix spécifique si différent du produit parent
  `mrp` DECIMAL(12,2) NULL,
  `stock` INT NOT NULL DEFAULT 10,
  `image_url` VARCHAR(255) NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table `product_specs` (Fiche technique flexible Clé/Valeur)
CREATE TABLE IF NOT EXISTS `product_specs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `spec_key` VARCHAR(128) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table `product_collection_rel` (Association Produits / Collections Marketing)
CREATE TABLE IF NOT EXISTS `product_collection_rel` (
  `product_id` VARCHAR(64) NOT NULL,
  `collection_id` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`product_id`, `collection_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table `inventory_movements` (Traçabilité et historique des stocks)
CREATE TABLE IF NOT EXISTS `inventory_movements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `variant_id` VARCHAR(64) NULL,
  `type` VARCHAR(32) NOT NULL, -- 'restock', 'sale', 'adjustment', 'return'
  `quantity` INT NOT NULL,
  `reference` VARCHAR(128) NULL,
  `note` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DONNÉES INITIALES (SEED BRANDS & COLLECTIONS)
-- =============================================================================

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
('col_express', 'Livraison Express 24h', 'express', '🚚 EXPRESS', 'truck', 6),
('col_recommended', 'Recommandé SenTech', 'recommended', '★ TOP CHOIX', 'award', 7),
('col_bundles', 'Packs Économiques', 'bundles', '📦 PACK', 'package', 8);

-- Insertion d'exemples de Variantes et de Fiches Techniques
INSERT IGNORE INTO `product_variants` (`id`, `product_id`, `sku`, `variant_type`, `name`, `price`, `mrp`, `stock`, `image_url`, `is_default`) VALUES
('var_p1_black', 'prod_1', 'ST-CAS-01-BK', 'color', 'Noir Sidéral', 45000.00, 55000.00, 10, 'assets/images/product_img4.webp', 1),
('var_p1_silver', 'prod_1', 'ST-CAS-01-SL', 'color', 'Argent Titane', 47000.00, 57000.00, 5, 'assets/images/product_img4.webp', 0),
('var_p2_black', 'prod_2', 'ST-WAT-02-BK', 'color', 'Noir Carbone', 32000.00, 40000.00, 5, 'assets/images/product_img8.webp', 1),
('var_p2_grey', 'prod_2', 'ST-WAT-02-GR', 'color', 'Gris Titane', 32000.00, 40000.00, 3, 'assets/images/product_img8.webp', 0),
('var_p4_white', 'prod_4', 'ST-EAR-04-WH', 'color', 'Blanc Perle', 19500.00, 25000.00, 15, 'assets/images/product_img1.webp', 1),
('var_p4_black', 'prod_4', 'ST-EAR-04-BK', 'color', 'Noir Onyx', 19500.00, 25000.00, 10, 'assets/images/product_img1.webp', 0),
('var_p6_65w', 'prod_6', 'ST-CHG-06-65', 'capacity', 'Modèle 65W GaN (3 Ports)', 14000.00, 18000.00, 20, 'assets/images/product_img7.webp', 1),
('var_p6_100w', 'prod_6', 'ST-CHG-06-100', 'capacity', 'Modèle 100W GaN Pro (4 Ports)', 22000.00, 28000.00, 10, 'assets/images/product_img7.webp', 0);

INSERT IGNORE INTO `product_specs` (`product_id`, `spec_key`, `spec_value`, `display_order`) VALUES
('prod_1', 'Autonomie', '40 heures de lecture continue (ANC activé)', 1),
('prod_1', 'Connexion', 'Bluetooth 5.3 + Câble Jack 3.5mm détachable', 2),
('prod_1', 'Réduction de Bruit', 'Active Noise Cancelling (ANC) hybride 38dB', 3),
('prod_1', 'Compatibilité', 'iOS, Android, Windows, macOS, PS5', 4),
('prod_1', 'Garantie', 'Garantie 30 jours SenTechPLUS', 5),
('prod_2', 'Écran', 'Écran tactile AMOLED HD 1.43 pouces (466x466 px)', 1),
('prod_2', 'Capteurs', 'Cardiofréquencemètre 24/7, SpO2, Podomètre, Sommeil', 2),
('prod_2', 'Étanchéité', 'Certification IP68 (résistant à l\'eau et transpiration)', 3),
('prod_2', 'Autonomie', '7 à 10 jours en utilisation normale', 4),
('prod_2', 'Appels', 'Haut-parleur & Micro intégrés pour appels Bluetooth', 5),
('prod_4', 'Drivers Audio', 'Transducteurs 10mm en graphène haute fidélité', 1),
('prod_4', 'Microphones', '4 microphones ENC avec réduction de bruit ambiant', 2),
('prod_4', 'Autonomie', '8h par charge + 24h avec le boîtier USB-C', 3),
('prod_4', 'Recharge', 'Charge rapide USB-C (10 min = 2h d\'écoute)', 4),
('prod_6', 'Technologie', 'Composants GaN III (Nitrure de Gallium)', 1),
('prod_6', 'Puissance Totale', '65W Max Power Delivery 3.0 & PPS', 2),
('prod_6', 'Ports', '2 x USB-C (65W) + 1 x USB-A (30W)', 3),
('prod_6', 'Sécurité', 'Protection surtension, surchauffe et court-circuit', 4);

SET FOREIGN_KEY_CHECKS = 1;
