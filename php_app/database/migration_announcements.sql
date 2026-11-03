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
