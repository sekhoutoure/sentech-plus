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
