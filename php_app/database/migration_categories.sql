-- =============================================================================
-- Migration SenTechPLUS : Système de Catégories & Sous-Catégories Hiérarchiques
-- À exécuter sur phpMyAdmin / MySQL pour mettre à niveau la structure
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Mise à jour de la structure de `categories`
ALTER TABLE `categories` 
  ADD COLUMN IF NOT EXISTS `parent_id` VARCHAR(64) NULL AFTER `image`,
  ADD COLUMN IF NOT EXISTS `icon` VARCHAR(64) NULL AFTER `image`,
  ADD COLUMN IF NOT EXISTS `is_featured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_active`,
  ADD CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;

-- 2. Mise à jour de la structure de `products`
ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `subcategory_id` VARCHAR(64) NULL AFTER `category_id`,
  ADD COLUMN IF NOT EXISTS `subcategory` VARCHAR(128) NULL AFTER `category`,
  ADD COLUMN IF NOT EXISTS `brand` VARCHAR(128) NULL AFTER `subcategory`,
  ADD COLUMN IF NOT EXISTS `slug` VARCHAR(191) NULL AFTER `name`,
  ADD COLUMN IF NOT EXISTS `discount_percent` INT NOT NULL DEFAULT 0 AFTER `price`,
  ADD COLUMN IF NOT EXISTS `is_active` TINYINT(1) NOT NULL DEFAULT 1 AFTER `in_stock`,
  ADD COLUMN IF NOT EXISTS `is_new` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_featured`,
  ADD COLUMN IF NOT EXISTS `is_flash_sale` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_new`,
  ADD COLUMN IF NOT EXISTS `is_express_delivery` TINYINT(1) NOT NULL DEFAULT 1 AFTER `is_flash_sale`,
  ADD COLUMN IF NOT EXISTS `connection_type` VARCHAR(64) NULL AFTER `is_express_delivery`,
  ADD COLUMN IF NOT EXISTS `compatibility` VARCHAR(255) NULL AFTER `connection_type`,
  ADD COLUMN IF NOT EXISTS `color` VARCHAR(64) NULL AFTER `compatibility`,
  ADD INDEX IF NOT EXISTS `idx_product_name` (`name`),
  ADD INDEX IF NOT EXISTS `idx_product_brand` (`brand`),
  ADD INDEX IF NOT EXISTS `idx_product_category` (`category_id`),
  ADD INDEX IF NOT EXISTS `idx_product_subcategory` (`subcategory_id`),
  ADD INDEX IF NOT EXISTS `idx_product_price` (`price`),
  ADD INDEX IF NOT EXISTS `idx_product_active_stock` (`is_active`, `in_stock`),
  ADD CONSTRAINT `fk_product_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;

-- 3. Réinitialisation et Insertion des 7 Grandes Catégories et leurs Sous-Catégories
DELETE FROM `categories`;

-- =============================================================================
-- 1. TÉLÉPHONES & ACCESSOIRES
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_telephones', 'Téléphones & Accessoires', 'telephones-accessoires', 'Accessoires essentiels pour smartphones iPhone, Samsung et Android.', 'assets/images/product_img7.webp', 'smartphone', NULL, 1, 1, 1),
('sub_supports_tel', 'Supports téléphone', 'supports-telephone', 'Supports bureau, voiture, MagSafe et trépieds.', 'assets/images/product_img7.webp', 'smartphone', 'cat_telephones', 1, 1, 0),
('sub_coques', 'Coques & protections', 'coques-protections', 'Coques antichoc, étuis cuir et protections renforcées.', 'assets/images/product_img7.webp', 'shield', 'cat_telephones', 2, 1, 0),
('sub_chargeurs_cables', 'Chargeurs & câbles', 'chargeurs-cables', 'Câbles USB-C, Lightning, chargeurs rapides GaN.', 'assets/images/product_img7.webp', 'zap', 'cat_telephones', 3, 1, 1),
('sub_batteries_ext', 'Batteries externes', 'batteries-externes', 'Powerbanks 10000mAh à 30000mAh charge rapide.', 'assets/images/product_img7.webp', 'battery-charging', 'cat_telephones', 4, 1, 1),
('sub_verres_trempes', 'Verres trempés', 'verres-trempes', 'Films et vitres de protection écran 9H haute transparence.', 'assets/images/product_img7.webp', 'square', 'cat_telephones', 5, 1, 0),
('sub_accessoires_voiture', 'Accessoires voiture', 'accessoires-voiture', 'Chargeurs allume-cigare, transmetteurs FM Bluetooth et supports grille.', 'assets/images/product_img7.webp', 'car', 'cat_telephones', 6, 1, 0);

-- =============================================================================
-- 2. AUDIO & ÉCOUTEURS
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_audio', 'Audio & Écouteurs', 'audio-ecouteurs', 'Le meilleur du son haute fidélité, écouteurs sans fil et casques.', 'assets/images/product_img4.webp', 'headphones', NULL, 2, 1, 1),
('sub_ecouteurs_sans_fil', 'Écouteurs sans fil', 'ecouteurs-sans-fil', 'True Wireless Bluetooth 5.3 avec réduction de bruit active.', 'assets/images/product_img1.webp', 'music', 'cat_audio', 1, 1, 1),
('sub_casques_audio', 'Casques audio', 'casques-audio', 'Casques Bluetooth circum-auriculaires autonomie 40h.', 'assets/images/product_img4.webp', 'headphones', 'cat_audio', 2, 1, 1),
('sub_casques_studio', 'Casques studio', 'casques-studio', 'Casques de monitoring et production musicale professionnelle.', 'assets/images/product_img4.webp', 'sliders', 'cat_audio', 3, 1, 0),
('sub_enceintes_bt', 'Enceintes Bluetooth', 'enceintes-bluetooth', 'Enceintes nomades portables et étanches IPX7.', 'assets/images/product_img2.webp', 'volume-2', 'cat_audio', 4, 1, 1),
('sub_barres_son', 'Barres de son', 'barres-de-son', 'Systèmes home cinéma et barres de son immersives pour salon.', 'assets/images/product_img2.webp', 'tv', 'cat_audio', 5, 1, 0),
('sub_micros_audio', 'Micros & accessoires audio', 'micros-accessoires-audio', 'Micros cravates sans fil, micros podcast et adaptateurs DAC.', 'assets/images/product_img4.webp', 'mic', 'cat_audio', 6, 1, 0);

-- =============================================================================
-- 3. MONTRES & OBJETS CONNECTÉS
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_montres', 'Montres & Objets Connectés', 'montres-objets-connectes', 'Smartwatches, bracelets sport et suivi de santé quotidien.', 'assets/images/product_img8.webp', 'watch', NULL, 3, 1, 1),
('sub_montres_connectees', 'Montres connectées', 'montres-connectees', 'Smartwatches avec écran AMOLED, appels Bluetooth et suivi cardiaque.', 'assets/images/product_img8.webp', 'watch', 'cat_montres', 1, 1, 1),
('sub_bracelets_connectes', 'Bracelets connectés', 'bracelets-connectes', 'Bracelets fitness étanches avec podomètre et suivi sommeil.', 'assets/images/product_img8.webp', 'activity', 'cat_montres', 2, 1, 0),
('sub_accessoires_montres', 'Accessoires montres', 'accessoires-montres', 'Bracelets silicone, cuir, métal et chargeurs magnétiques.', 'assets/images/product_img8.webp', 'link', 'cat_montres', 3, 1, 0),
('sub_trackers_gadgets', 'Trackers & gadgets connectés', 'trackers-gadgets-connectes', 'Balises GPS, bagues connectées et capteurs intelligents.', 'assets/images/product_img8.webp', 'navigation', 'cat_montres', 4, 1, 0);

-- =============================================================================
-- 4. INFORMATIQUE & BUREAU
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_informatique', 'Informatique & Bureau', 'informatique-bureau', 'Périphériques, connectique et équipement setup bureautique.', 'assets/images/product_img3.webp', 'laptop', NULL, 4, 1, 1),
('sub_souris', 'Souris', 'souris', 'Souris sans fil ergonomiques, bureautique et précision.', 'assets/images/product_img3.webp', 'mouse', 'cat_informatique', 1, 1, 1),
('sub_claviers', 'Claviers', 'claviers', 'Claviers sans fil silencieux et claviers mécaniques compacts.', 'assets/images/product_img3.webp', 'keyboard', 'cat_informatique', 2, 1, 1),
('sub_supports_laptop', 'Supports laptop', 'supports-laptop', 'Supports aluminium inclinables et refroidisseurs PC portable.', 'assets/images/product_img3.webp', 'maximize-2', 'cat_informatique', 3, 1, 0),
('sub_hubs_adaptateurs', 'Hubs & adaptateurs', 'hubs-adaptateurs', 'Hubs USB-C multiport 8-en-1 HDMI 4K, lecteurs SD.', 'assets/images/product_img3.webp', 'cpu', 'cat_informatique', 4, 1, 1),
('sub_stockage_usb', 'Stockage USB / cartes mémoire', 'stockage-usb-cartes-memoire', 'Clés USB 3.0, cartes MicroSD haute vitesse et SSD externes.', 'assets/images/product_img3.webp', 'hard-drive', 'cat_informatique', 5, 1, 0),
('sub_accessoires_pc', 'Accessoires PC', 'accessoires-pc', 'Tapis de souris XL, housses laptop et kits de nettoyage.', 'assets/images/product_img3.webp', 'monitor', 'cat_informatique', 6, 1, 0);

-- =============================================================================
-- 5. GAMING
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_gaming', 'Gaming', 'gaming', 'Équipements haute performance pour joueurs PC, PS5 et Xbox.', 'assets/images/product_img6.webp', 'gamepad-2', NULL, 5, 1, 1),
('sub_casques_gaming', 'Casques gaming', 'casques-gaming', 'Casques surround 7.1 avec micro antibruit et RGB.', 'assets/images/product_img14.webp', 'headphones', 'cat_gaming', 1, 1, 1),
('sub_souris_gaming', 'Souris gaming', 'souris-gaming', 'Souris gamer ultra-légères avec capteur optique 16000 DPI.', 'assets/images/product_img3.webp', 'mouse', 'cat_gaming', 2, 1, 1),
('sub_claviers_gaming', 'Claviers gaming', 'claviers-gaming', 'Claviers mécaniques RGB avec switches réactifs.', 'assets/images/product_img6.webp', 'keyboard', 'cat_gaming', 3, 1, 0),
('sub_manettes', 'Manettes', 'manettes', 'Manettes sans fil pour PC, PlayStation, Xbox et smartphone.', 'assets/images/product_img6.webp', 'gamepad', 'cat_gaming', 4, 1, 1),
('sub_supports_console', 'Supports & accessoires console', 'supports-accessoires-console', 'Stations de recharge doubles, grips et housses de protection.', 'assets/images/product_img6.webp', 'layers', 'cat_gaming', 5, 1, 0);

-- =============================================================================
-- 6. MAISON & ÉNERGIE
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_maison', 'Maison & Énergie', 'maison-energie', 'Éclairage intelligent, solutions d’alimentation et domotique.', 'assets/images/product_img13.webp', 'zap', NULL, 6, 1, 1),
('sub_lampes_led', 'Lampes LED', 'lampes-led', 'Lampes de bureau tactiles avec chargeur induction et veilleuses.', 'assets/images/product_img13.webp', 'sun', 'cat_maison', 1, 1, 1),
('sub_prises_multiprises', 'Prises & multiprises', 'prises-multiprises', 'Multiprises parasurtenseurs avec ports USB et prises connectées.', 'assets/images/product_img13.webp', 'power', 'cat_maison', 2, 1, 1),
('sub_chargeurs_secteur', 'Chargeurs secteur', 'chargeurs-secteur', 'Blocs de charge murale multi-ports GaN pour toute la maison.', 'assets/images/product_img7.webp', 'plug', 'cat_maison', 3, 1, 0),
('sub_eclairage_deco', 'Éclairage décoratif', 'eclairage-decoratif', 'Rubans LED RGB, barres lumineuses d’ambiance et projecteurs.', 'assets/images/product_img13.webp', 'sparkles', 'cat_maison', 4, 1, 0),
('sub_accessoires_domotique', 'Accessoires maison connectée', 'accessoires-maison-connectee', 'Capteurs d’humidité, thermomètres digitaux et prises Wi-Fi.', 'assets/images/product_img13.webp', 'home', 'cat_maison', 5, 1, 0);

-- =============================================================================
-- 7. SÉCURITÉ & CAMÉRAS
-- =============================================================================
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
('cat_securite', 'Sécurité & Caméras', 'securite-cameras', 'Surveillance vidéo intelligente, caméras Wi-Fi et capteurs de sécurité.', 'assets/images/product_img14.webp', 'camera', NULL, 7, 1, 1),
('sub_cameras_wifi', 'Caméras Wi-Fi', 'cameras-wi-fi', 'Caméras de surveillance 1080p/2K avec vision nocturne et audio bidirectionnel.', 'assets/images/product_img14.webp', 'camera', 'cat_securite', 1, 1, 1),
('sub_cameras_bebe', 'Caméras bébé', 'cameras-bebe', 'Babyphones vidéo connectés avec détection de mouvement et berceuses.', 'assets/images/product_img14.webp', 'eye', 'cat_securite', 2, 1, 0),
('sub_mini_cameras', 'Mini caméras', 'mini-cameras', 'Mini caméras discrètes et autonomes avec enregistrement sur carte SD.', 'assets/images/product_img14.webp', 'video', 'cat_securite', 3, 1, 0),
('sub_accessoires_surveillance', 'Accessoires surveillance', 'accessoires-surveillance', 'Panneaux solaires pour caméras, câbles d’alimentation longs et supports muraux.', 'assets/images/product_img14.webp', 'shield-check', 'cat_securite', 4, 1, 0);

SET FOREIGN_KEY_CHECKS = 1;
