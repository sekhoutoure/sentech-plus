-- ======================================================
-- SenTechPLUS Dakar - Export Base de Données Complète
-- Date de l'export : 2026-11-06 12:00:25
-- Serveur : sql301.infinityfree.com
-- Base : if0_43348324_sentechplus
-- Tables exportées : 24
-- ======================================================

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- ------------------------------------------------------
-- Structure de la table `addresses`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE `addresses` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `name` varchar(191) NOT NULL,
  `first_name` varchar(128) DEFAULT NULL,
  `last_name` varchar(128) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(128) NOT NULL,
  `state` varchar(128) NOT NULL,
  `region` varchar(128) DEFAULT NULL,
  `district` varchar(128) DEFAULT NULL,
  `landmark` varchar(255) DEFAULT NULL,
  `zip` varchar(32) NOT NULL DEFAULT '00000',
  `country` varchar(128) NOT NULL DEFAULT 'Sénégal',
  `phone` varchar(64) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `addresses` (1 lignes)
INSERT INTO `addresses` (`id`, `user_id`, `name`, `first_name`, `last_name`, `email`, `street`, `city`, `state`, `region`, `district`, `landmark`, `zip`, `country`, `phone`, `is_default`, `created_at`) VALUES
('addr_6aeb65b768e93', 'user_customer_1', 'Sekhou Toure', 'Sekhou', 'Toure', 'sekhoutoure74@gmail.com', 12500, 'Dakar', 'Dakar', 'Dakar', 'Rufisque', '', '00000', 'Sénégal', 780128253, 0, '2026-11-04 09:04:56');

-- ------------------------------------------------------
-- Structure de la table `banners`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `subtitle` varchar(500) NOT NULL DEFAULT '',
  `image_desktop` varchar(500) NOT NULL DEFAULT '',
  `image_mobile` varchar(500) NOT NULL DEFAULT '',
  `link_url` varchar(500) NOT NULL DEFAULT '',
  `button_text` varchar(100) NOT NULL DEFAULT '',
  `placement` varchar(100) NOT NULL DEFAULT 'hero_home',
  `display_order` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `starts_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_placement_active_order` (`placement`,`is_active`,`display_order`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Contenu de la table `banners` (4 lignes)
INSERT INTO `banners` (`id`, `title`, `subtitle`, `image_desktop`, `image_mobile`, `link_url`, `button_text`, `placement`, `display_order`, `is_active`, `starts_at`, `ends_at`, `created_at`, `updated_at`) VALUES
(1, 'Audio Haute Définition — Casques & Écouteurs Pro', 'Immersion sonore totale et réduction active du bruit', 'assets/images/banners/banner_audio_fr.webp', 'assets/images/banners/banner_audio_fr_mob.webp', 'shop.php?category=audio-ecouteurs', 'Découvrir', 'hero_home', 1, 1, NULL, NULL, '2026-11-03 17:15:58', '2026-11-03 17:15:58'),
(2, 'Montres Connectées — Le Sommet de la Performance', 'Suivi santé, autonomie prolongée et élégance à votre poignet', 'assets/images/banners/banner_montres_fr.webp', 'assets/images/banners/banner_montres_fr_mob.webp', 'shop.php?category=montres-objets-connectes', 'Explorer', 'hero_home', 2, 1, NULL, NULL, '2026-11-03 17:15:58', '2026-11-03 17:15:58'),
(3, 'Charge Ultra-Rapide GaN 65W & Accessoires', 'Rechargez tous vos appareils en un temps record', 'assets/images/banners/banner_charge_fr.webp', 'assets/images/banners/banner_charge_fr_mob.webp', 'shop.php?category=telephones-accessoires', 'Voir les offres', 'hero_home', 3, 1, NULL, NULL, '2026-11-03 17:15:58', '2026-11-03 17:15:58'),
(4, 'Gaming & Setup — Précision & Réactivité Absolue', 'Équipement pour joueurs exigeants au Sénégal', 'assets/images/banners/banner_gaming_fr.webp', 'assets/images/banners/banner_gaming_fr_mob.webp', 'shop.php?category=gaming', 'Jouer maintenant', 'hero_home', 4, 1, NULL, NULL, '2026-11-03 17:15:58', '2026-11-03 17:15:58');

-- ------------------------------------------------------
-- Structure de la table `brands`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `slug` varchar(128) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `brands` (10 lignes)
INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `description`, `is_featured`, `created_at`) VALUES
('b_anker', 'Anker', 'anker', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_apple', 'Apple', 'apple', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_baseus', 'Baseus', 'baseus', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_ezviz', 'Ezviz', 'ezviz', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_jbl', 'JBL', 'jbl', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_logitech', 'Logitech', 'logitech', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_razer', 'Razer', 'razer', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_samsung', 'Samsung', 'samsung', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_sony', 'Sony', 'sony', NULL, NULL, 1, '2026-11-03 14:43:26'),
('b_xiaomi', 'Xiaomi', 'xiaomi', NULL, NULL, 1, '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `cart_items`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) DEFAULT NULL,
  `session_id` varchar(128) DEFAULT NULL,
  `product_id` varchar(64) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `categories`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` varchar(64) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `parent_id` varchar(64) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_cat_perf_tree` (`parent_id`,`is_active`,`display_order`),
  KEY `idx_cat_perf_slug` (`slug`,`is_active`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `categories` (43 lignes)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
('cat_audio', 'Audio & Écouteurs', 'audio-ecouteurs', 'Le meilleur du son haute fidélité, écouteurs sans fil et casques.', 'assets/images/product_img4.webp', 'headphones', NULL, 2, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('cat_gaming', 'Gaming', 'gaming', 'Équipements haute performance pour joueurs PC, PS5 et Xbox.', 'assets/images/product_img6.webp', 'gamepad-2', NULL, 5, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('cat_informatique', 'Informatique & Bureau', 'informatique-bureau', 'Périphériques, connectique et équipement setup bureautique.', 'assets/images/product_img3.webp', 'laptop', NULL, 4, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('cat_maison', 'Maison & Énergie', 'maison-energie', 'Éclairage intelligent, solutions d’alimentation et domotique.', 'assets/images/product_img13.webp', 'zap', NULL, 6, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('cat_montres', 'Montres & Objets Connectés', 'montres-objets-connectes', 'Smartwatches, bracelets sport et suivi de santé quotidien.', 'assets/images/product_img8.webp', 'watch', NULL, 3, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('cat_securite', 'Sécurité & Caméras', 'securite-cameras', 'Surveillance vidéo intelligente, caméras Wi-Fi et capteurs de sécurité.', 'assets/images/product_img14.webp', 'camera', NULL, 7, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('cat_telephones', 'Téléphones & Accessoires', 'telephones-accessoires', 'Accessoires essentiels pour smartphones iPhone, Samsung et Android.', 'assets/images/product_img7.webp', 'smartphone', NULL, 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_accessoires_domotique', 'Accessoires maison connectée', 'accessoires-maison-connectee', 'Capteurs d’humidité, thermomètres digitaux et prises Wi-Fi.', 'assets/images/product_img13.webp', 'home', 'cat_maison', 5, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_accessoires_montres', 'Accessoires montres', 'accessoires-montres', 'Bracelets silicone, cuir, métal et chargeurs magnétiques.', 'assets/images/product_img8.webp', 'link', 'cat_montres', 3, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_accessoires_pc', 'Accessoires PC', 'accessoires-pc', 'Tapis de souris XL, housses laptop et kits de nettoyage.', 'assets/images/product_img3.webp', 'monitor', 'cat_informatique', 6, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_accessoires_surveillance', 'Accessoires surveillance', 'accessoires-surveillance', 'Panneaux solaires pour caméras, câbles d’alimentation longs et supports muraux.', 'assets/images/product_img14.webp', 'shield-check', 'cat_securite', 4, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_accessoires_voiture', 'Accessoires voiture', 'accessoires-voiture', 'Chargeurs allume-cigare, transmetteurs FM Bluetooth et supports grille.', 'assets/images/product_img7.webp', 'car', 'cat_telephones', 6, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_barres_son', 'Barres de son', 'barres-de-son', 'Systèmes home cinéma et barres de son immersives pour salon.', 'assets/images/product_img2.webp', 'tv', 'cat_audio', 5, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_batteries_ext', 'Batteries externes', 'batteries-externes', 'Powerbanks 10000mAh à 30000mAh charge rapide.', 'assets/images/product_img7.webp', 'battery-charging', 'cat_telephones', 4, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_bracelets_connectes', 'Bracelets connectés', 'bracelets-connectes', 'Bracelets fitness étanches avec podomètre et suivi sommeil.', 'assets/images/product_img8.webp', 'activity', 'cat_montres', 2, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_cameras_bebe', 'Caméras bébé', 'cameras-bebe', 'Babyphones vidéo connectés avec détection de mouvement et berceuses.', 'assets/images/product_img14.webp', 'eye', 'cat_securite', 2, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_cameras_wifi', 'Caméras Wi-Fi', 'cameras-wi-fi', 'Caméras de surveillance 1080p/2K avec vision nocturne et audio bidirectionnel.', 'assets/images/product_img14.webp', 'camera', 'cat_securite', 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_casques_audio', 'Casques audio', 'casques-audio', 'Casques Bluetooth circum-auriculaires autonomie 40h.', 'assets/images/product_img4.webp', 'headphones', 'cat_audio', 2, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_casques_gaming', 'Casques gaming', 'casques-gaming', 'Casques surround 7.1 avec micro antibruit et RGB.', 'assets/images/product_img14.webp', 'headphones', 'cat_gaming', 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_casques_studio', 'Casques studio', 'casques-studio', 'Casques de monitoring et production musicale professionnelle.', 'assets/images/product_img4.webp', 'sliders', 'cat_audio', 3, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_chargeurs_cables', 'Chargeurs & câbles', 'chargeurs-cables', 'Câbles USB-C, Lightning, chargeurs rapides GaN.', 'assets/images/product_img7.webp', 'zap', 'cat_telephones', 3, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_chargeurs_secteur', 'Chargeurs secteur', 'chargeurs-secteur', 'Blocs de charge murale multi-ports GaN pour toute la maison.', 'assets/images/product_img7.webp', 'plug', 'cat_maison', 3, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_claviers', 'Claviers', 'claviers', 'Claviers sans fil silencieux et claviers mécaniques compacts.', 'assets/images/product_img3.webp', 'keyboard', 'cat_informatique', 2, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_claviers_gaming', 'Claviers gaming', 'claviers-gaming', 'Claviers mécaniques RGB avec switches réactifs.', 'assets/images/product_img6.webp', 'keyboard', 'cat_gaming', 3, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_coques', 'Coques & protections', 'coques-protections', 'Coques antichoc, étuis cuir et protections renforcées.', 'assets/images/product_img7.webp', 'shield', 'cat_telephones', 2, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_eclairage_deco', 'Éclairage décoratif', 'eclairage-decoratif', 'Rubans LED RGB, barres lumineuses d’ambiance et projecteurs.', 'assets/images/product_img13.webp', 'sparkles', 'cat_maison', 4, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_ecouteurs_sans_fil', 'Écouteurs sans fil', 'ecouteurs-sans-fil', 'True Wireless Bluetooth 5.3 avec réduction de bruit active.', 'assets/images/product_img1.webp', 'music', 'cat_audio', 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_enceintes_bt', 'Enceintes Bluetooth', 'enceintes-bluetooth', 'Enceintes nomades portables et étanches IPX7.', 'assets/images/product_img2.webp', 'volume-2', 'cat_audio', 4, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_hubs_adaptateurs', 'Hubs & adaptateurs', 'hubs-adaptateurs', 'Hubs USB-C multiport 8-en-1 HDMI 4K, lecteurs SD.', 'assets/images/product_img3.webp', 'cpu', 'cat_informatique', 4, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_lampes_led', 'Lampes LED', 'lampes-led', 'Lampes de bureau tactiles avec chargeur induction et veilleuses.', 'assets/images/product_img13.webp', 'sun', 'cat_maison', 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_manettes', 'Manettes', 'manettes', 'Manettes sans fil pour PC, PlayStation, Xbox et smartphone.', 'assets/images/product_img6.webp', 'gamepad', 'cat_gaming', 4, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_micros_audio', 'Micros & accessoires audio', 'micros-accessoires-audio', 'Micros cravates sans fil, micros podcast et adaptateurs DAC.', 'assets/images/product_img4.webp', 'mic', 'cat_audio', 6, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_mini_cameras', 'Mini caméras', 'mini-cameras', 'Mini caméras discrètes et autonomes avec enregistrement sur carte SD.', 'assets/images/product_img14.webp', 'video', 'cat_securite', 3, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_montres_connectees', 'Montres connectées', 'montres-connectees', 'Smartwatches avec écran AMOLED, appels Bluetooth et suivi cardiaque.', 'assets/images/product_img8.webp', 'watch', 'cat_montres', 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_prises_multiprises', 'Prises & multiprises', 'prises-multiprises', 'Multiprises parasurtenseurs avec ports USB et prises connectées.', 'assets/images/product_img13.webp', 'power', 'cat_maison', 2, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_souris', 'Souris', 'souris', 'Souris sans fil ergonomiques, bureautique et précision.', 'assets/images/product_img3.webp', 'mouse', 'cat_informatique', 1, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_souris_gaming', 'Souris gaming', 'souris-gaming', 'Souris gamer ultra-légères avec capteur optique 16000 DPI.', 'assets/images/product_img3.webp', 'mouse', 'cat_gaming', 2, 1, 1, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_stockage_usb', 'Stockage USB / cartes mémoire', 'stockage-usb-cartes-memoire', 'Clés USB 3.0, cartes MicroSD haute vitesse et SSD externes.', 'assets/images/product_img3.webp', 'hard-drive', 'cat_informatique', 5, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_supports_console', 'Supports & accessoires console', 'supports-accessoires-console', 'Stations de recharge doubles, grips et housses de protection.', 'assets/images/product_img6.webp', 'layers', 'cat_gaming', 5, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_supports_laptop', 'Supports laptop', 'supports-laptop', 'Supports aluminium inclinables et refroidisseurs PC portable.', 'assets/images/product_img3.webp', 'maximize-2', 'cat_informatique', 3, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_supports_tel', 'Supports téléphone', 'supports-telephone', 'Supports bureau, voiture, MagSafe et trépieds.', 'assets/images/product_img7.webp', 'smartphone', 'cat_telephones', 1, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_trackers_gadgets', 'Trackers & gadgets connectés', 'trackers-gadgets-connectes', 'Balises GPS, bagues connectées et capteurs intelligents.', 'assets/images/product_img8.webp', 'navigation', 'cat_montres', 4, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('sub_verres_trempes', 'Verres trempés', 'verres-trempes', 'Films et vitres de protection écran 9H haute transparence.', 'assets/images/product_img7.webp', 'square', 'cat_telephones', 5, 1, 0, '2026-11-03 14:43:26', '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `collections`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` varchar(64) NOT NULL,
  `name` varchar(128) NOT NULL,
  `slug` varchar(128) NOT NULL,
  `badge_text` varchar(64) DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `collections` (6 lignes)
INSERT INTO `collections` (`id`, `name`, `slug`, `badge_text`, `icon`, `description`, `is_active`, `display_order`, `created_at`) VALUES
('col_bestseller', 'Meilleures Ventes', 'bestseller', '🔥 BEST', 'trending-up', NULL, 1, 3, '2026-11-03 14:43:26'),
('col_express', 'Livraison Express 24h', 'express', '🚚 EXPRESS', 'truck', NULL, 1, 6, '2026-11-03 14:43:26'),
('col_flash', 'Ventes Flash', 'flash', '⚡ FLASH', 'flame', NULL, 1, 1, '2026-11-03 14:43:26'),
('col_new', 'Nouveautés', 'new', '✨ NEW', 'sparkles', NULL, 1, 2, '2026-11-03 14:43:26'),
('col_under10k', 'Moins de 10 000 FCFA', 'under10k', '🏷️ <10K', 'tag', NULL, 1, 4, '2026-11-03 14:43:26'),
('col_under25k', 'Moins de 25 000 FCFA', 'under25k', '🏷️ <25K', 'tag', NULL, 1, 5, '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `contact_messages`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'unread',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `coupons`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `code` varchar(64) NOT NULL,
  `description` varchar(255) NOT NULL,
  `discount` decimal(5,2) NOT NULL,
  `for_new_user` tinyint(1) NOT NULL DEFAULT 0,
  `for_member` tinyint(1) NOT NULL DEFAULT 0,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `coupons` (2 lignes)
INSERT INTO `coupons` (`code`, `description`, `discount`, `for_new_user`, `for_member`, `is_public`, `expires_at`, `created_at`) VALUES
('BIENVENUE10', '10% de réduction immédiate sur votre 1ère commande Dakar', 10.00, 1, 0, 1, '2026-12-31 23:59:59', '2026-11-03 14:43:26'),
('SENTECH15', '15% de remise spéciale sur tous les accessoires audio', 15.00, 0, 0, 1, '2026-12-31 23:59:59', '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `inventory_movements`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `inventory_movements`;
CREATE TABLE `inventory_movements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(64) NOT NULL,
  `variant_id` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference` varchar(128) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `inventory_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `newsletter_subscribers`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `newsletter_subscribers`;
CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `notifications`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `type` varchar(32) NOT NULL DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `icon` varchar(64) NOT NULL DEFAULT 'bell',
  `priority` enum('low','normal','high') NOT NULL DEFAULT 'normal',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`,`is_read`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `order_items`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(64) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `variant_id` varchar(64) DEFAULT NULL,
  `product_name_snapshot` varchar(191) DEFAULT NULL,
  `product_image_snapshot` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `order_items` (2 lignes)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `variant_id`, `product_name_snapshot`, `product_image_snapshot`, `quantity`, `unit_price`, `price`, `subtotal`) VALUES
(1, 'ord_6aeb65b768945', 'prod_5', NULL, 'Souris Ergonomique Sans Fil Silence', 'assets/images/product_img3.webp', 1, 15000.00, 0.00, 15000.00),
(2, 'ord_6aeb65b768945', 'prod_1', NULL, 'Casque Studio Pro Sans Fil ANC', 'assets/images/product_img4.webp', 1, 45000.00, 0.00, 45000.00);

-- ------------------------------------------------------
-- Structure de la table `orders`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` varchar(64) NOT NULL,
  `order_number` varchar(64) DEFAULT NULL,
  `user_id` varchar(64) NOT NULL,
  `store_id` varchar(64) NOT NULL,
  `address_id` varchar(64) NOT NULL,
  `customer_first_name` varchar(128) DEFAULT NULL,
  `customer_last_name` varchar(128) DEFAULT NULL,
  `customer_email` varchar(191) DEFAULT NULL,
  `customer_phone` varchar(64) DEFAULT NULL,
  `delivery_region` varchar(128) DEFAULT NULL,
  `delivery_city` varchar(128) DEFAULT NULL,
  `delivery_district` varchar(128) DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `delivery_landmark` varchar(255) DEFAULT NULL,
  `delivery_instructions` text DEFAULT NULL,
  `delivery_method` varchar(64) DEFAULT 'express',
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `delivery_fee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `final_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(32) NOT NULL DEFAULT 'ORDER_PLACED',
  `order_status` varchar(32) NOT NULL DEFAULT 'ORDER_PLACED',
  `is_paid` tinyint(1) NOT NULL DEFAULT 0,
  `payment_status` varchar(32) NOT NULL DEFAULT 'UNPAID',
  `payment_method` varchar(32) NOT NULL DEFAULT 'COD',
  `is_coupon_used` tinyint(1) NOT NULL DEFAULT 0,
  `coupon_code` varchar(64) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `store_id` (`store_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `orders` (1 lignes)
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `store_id`, `address_id`, `customer_first_name`, `customer_last_name`, `customer_email`, `customer_phone`, `delivery_region`, `delivery_city`, `delivery_district`, `delivery_address`, `delivery_landmark`, `delivery_instructions`, `delivery_method`, `subtotal`, `delivery_fee`, `discount_amount`, `discount_total`, `total`, `total_amount`, `final_total`, `status`, `order_status`, `is_paid`, `payment_status`, `payment_method`, `is_coupon_used`, `coupon_code`, `created_at`, `updated_at`) VALUES
('ord_6aeb65b768945', 'ST-2026-68959', 'user_customer_1', 'store_happy', 'addr_6aeb65b768e93', 'Sekhou', 'Toure', 'sekhoutoure74@gmail.com', 780128253, 'Dakar', 'Dakar', 'Rufisque', 12500, '', '', 'express', 60000.00, 1000.00, 0.00, 0.00, 61000.00, 61000.00, 0.00, 'ORDER_PLACED', 'pending', 0, 'pending', 'wave', 0, NULL, '2026-11-04 09:04:56', '2026-11-04 09:04:56');

-- ------------------------------------------------------
-- Structure de la table `product_images`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(64) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `product_images` (9 lignes)
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `display_order`, `created_at`) VALUES
(1, 'prod_1', 'assets/images/product_img4.webp', 1, 1, '2026-11-03 14:43:26'),
(2, 'prod_2', 'assets/images/product_img8.webp', 1, 1, '2026-11-03 14:43:26'),
(3, 'prod_3', 'assets/images/product_img2.webp', 1, 1, '2026-11-03 14:43:26'),
(4, 'prod_4', 'assets/images/product_img1.webp', 1, 1, '2026-11-03 14:43:26'),
(5, 'prod_5', 'assets/images/product_img3.webp', 1, 1, '2026-11-03 14:43:26'),
(6, 'prod_6', 'assets/images/product_img7.webp', 1, 1, '2026-11-03 14:43:26'),
(7, 'prod_7', 'assets/images/product_img14.webp', 1, 1, '2026-11-03 14:43:26'),
(8, 'prod_8', 'assets/images/product_img13.webp', 1, 1, '2026-11-03 14:43:26'),
(9, 'prod_9', 'assets/images/product_img14.webp', 1, 1, '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `product_media`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_media`;
CREATE TABLE `product_media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(64) NOT NULL,
  `media_type` varchar(20) NOT NULL DEFAULT 'image',
  `media_role` varchar(30) NOT NULL DEFAULT 'gallery',
  `file_path` varchar(255) NOT NULL,
  `thumbnail_path` varchar(255) DEFAULT NULL,
  `title` varchar(150) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_media_pid` (`product_id`),
  KEY `idx_product_media_act` (`is_active`),
  KEY `idx_product_media_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `product_questions`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_questions`;
CREATE TABLE `product_questions` (
  `id` varchar(64) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `user_name` varchar(128) NOT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_questions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `product_related`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_related`;
CREATE TABLE `product_related` (
  `product_id` varchar(64) NOT NULL,
  `related_id` varchar(64) NOT NULL,
  PRIMARY KEY (`product_id`,`related_id`),
  KEY `related_id` (`related_id`),
  CONSTRAINT `product_related_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_related_ibfk_2` FOREIGN KEY (`related_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `product_specs`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_specs`;
CREATE TABLE `product_specs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(64) NOT NULL,
  `spec_key` varchar(128) NOT NULL,
  `spec_value` varchar(255) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_specs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `product_variants`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` varchar(64) NOT NULL,
  `product_id` varchar(64) NOT NULL,
  `sku` varchar(64) DEFAULT NULL,
  `variant_type` varchar(64) NOT NULL DEFAULT 'color',
  `name` varchar(128) NOT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `mrp` decimal(12,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 10,
  `image_url` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `products`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(64) NOT NULL,
  `store_id` varchar(64) NOT NULL,
  `category_id` varchar(64) DEFAULT NULL,
  `subcategory_id` varchar(64) DEFAULT NULL,
  `category` varchar(128) NOT NULL,
  `subcategory` varchar(128) DEFAULT NULL,
  `brand` varchar(128) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `sku` varchar(64) DEFAULT NULL,
  `description` text NOT NULL,
  `mrp` decimal(12,2) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `discount_percent` int(11) NOT NULL DEFAULT 0,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `in_stock` tinyint(1) NOT NULL DEFAULT 1,
  `stock` int(11) NOT NULL DEFAULT 10,
  `stock_status` varchar(32) NOT NULL DEFAULT 'IN_STOCK',
  `status` varchar(32) NOT NULL DEFAULT 'ACTIVE',
  `sales_count` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `is_limited_stock` tinyint(1) NOT NULL DEFAULT 0,
  `is_new` tinyint(1) NOT NULL DEFAULT 0,
  `is_flash_sale` tinyint(1) NOT NULL DEFAULT 0,
  `is_express_delivery` tinyint(1) NOT NULL DEFAULT 1,
  `connection_type` varchar(64) DEFAULT NULL,
  `compatibility` varchar(255) DEFAULT NULL,
  `color` varchar(64) DEFAULT NULL,
  `power` varchar(64) DEFAULT NULL,
  `capacity` varchar(64) DEFAULT NULL,
  `usage_type` varchar(64) DEFAULT NULL,
  `warranty` varchar(64) DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL DEFAULT 5.0,
  `review_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_product_name` (`name`),
  KEY `idx_product_brand` (`brand`),
  KEY `idx_product_category` (`category_id`),
  KEY `idx_product_subcategory` (`subcategory_id`),
  KEY `idx_product_price` (`price`),
  KEY `idx_product_active_stock` (`is_active`,`in_stock`),
  KEY `store_id` (`store_id`),
  KEY `idx_prod_perf_cat` (`category_id`,`is_active`,`in_stock`),
  KEY `idx_prod_perf_price` (`price`,`is_active`),
  KEY `idx_prod_perf_created` (`created_at`,`is_active`),
  FULLTEXT KEY `ft_product_search` (`name`,`description`,`brand`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`subcategory_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `products` (9 lignes)
INSERT INTO `products` (`id`, `store_id`, `category_id`, `subcategory_id`, `category`, `subcategory`, `brand`, `name`, `slug`, `sku`, `description`, `mrp`, `price`, `discount_percent`, `images`, `in_stock`, `stock`, `stock_status`, `status`, `sales_count`, `is_active`, `is_featured`, `is_best_seller`, `is_limited_stock`, `is_new`, `is_flash_sale`, `is_express_delivery`, `connection_type`, `compatibility`, `color`, `power`, `capacity`, `usage_type`, `warranty`, `rating`, `review_count`, `created_at`, `updated_at`) VALUES
('prod_1', 'store_sentech', 'cat_audio', 'sub_casques_audio', 'Audio & Écouteurs', 'Casques audio', 'Sony', 'Casque Studio Pro Sans Fil ANC', 'casque-studio-pro-sans-fil-anc', NULL, 'Réduction active du bruit ; Autonomie 40h ; Bluetooth 5.3 ; Audio Hi-Res certifié ; Coussinets à mémoire de forme.', 55000.00, 45000.00, 18, '[\"assets/images/product_img4.webp\"]', 1, 14, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 1, 1, 1, 'Bluetooth', 'iPhone, Android, PC', 'Noir Sidéral', NULL, NULL, NULL, NULL, 4.9, 28, '2026-11-03 14:43:26', '2026-11-04 09:04:56'),
('prod_2', 'store_sentech', 'cat_montres', 'sub_montres_connectees', 'Montres & Objets Connectés', 'Montres connectées', 'Samsung', 'Montre Connectée Sport V3 AMOLED', 'montre-connectee-sport-v3-amoled', NULL, 'Écran AMOLED HD 1.43 pouces ; Appels Bluetooth clairs ; Capteur cardiaque & SpO2 24/7 ; 100+ modes sport ; Étanche IP68.', 40000.00, 32000.00, 20, '[\"assets/images/product_img13.webp\"]', 1, 8, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 0, 1, 1, 'Bluetooth', 'iPhone, Android', 'Gris Titane', NULL, NULL, NULL, NULL, 4.8, 19, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('prod_3', 'store_happy', 'cat_audio', 'sub_enceintes_bt', 'Audio & Écouteurs', 'Enceintes Bluetooth', 'JBL', 'Enceinte Nomade Bluetooth HD 360°', 'enceinte-nomade-bluetooth-hd-360', NULL, 'Son immersif 360° 20W ; Étanche immersion IPX7 ; Autonomie 16h ; Fonction Powerbank intégrée ; Finition tissu renforcé.', 35000.00, 28000.00, 20, '[\"assets/images/product_img2.webp\"]', 1, 12, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 0, 0, 1, 'Bluetooth', 'Universel', 'Bleu Océan', NULL, NULL, NULL, NULL, 4.7, 14, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('prod_4', 'store_sentech', 'cat_audio', 'sub_ecouteurs_sans_fil', 'Audio & Écouteurs', 'Écouteurs sans fil', 'Anker', 'Écouteurs True Wireless Bass+ Pro', 'ecouteurs-true-wireless-bass-plus-pro', NULL, 'Drivers 10mm graphène ; Basses profondes ; Micro 4-mic ENC pour appels clairs ; Boîtier de charge USB-C 30h.', 25000.00, 19500.00, 22, '[\"assets/images/product_img9.webp\"]', 1, 25, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 1, 1, 1, 'Bluetooth', 'iPhone, Android, PC', 'Blanc Perle', NULL, NULL, NULL, NULL, 4.9, 35, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('prod_5', 'store_happy', 'cat_informatique', 'sub_souris', 'Informatique & Bureau', 'Souris', 'Logitech', 'Souris Ergonomique Sans Fil Silence', 'souris-ergonomique-sans-fil-silence', NULL, 'Prise en main naturelle 57° ; Clics silencieux à 90% ; Molette SmartWheel ; Connexion Bluetooth & Récepteur USB Logi Bolt.', 20000.00, 15000.00, 25, '[\"assets/images/product_img11.webp\"]', 1, 17, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 0, 0, 1, 'Bluetooth', 'PC, Mac', 'Graphite', NULL, NULL, NULL, NULL, 4.8, 22, '2026-11-03 14:43:26', '2026-11-04 09:04:56'),
('prod_6', 'store_sentech', 'cat_telephones', 'sub_chargeurs_cables', 'Téléphones & Accessoires', 'Chargeurs & câbles', 'Baseus', 'Chargeur Rapide GaN 65W Multi-Port', 'chargeur-rapide-gan-65w-multi-port', NULL, 'Technologie GaN III ultra-compacte ; 2 ports USB-C + 1 port USB-A ; Compatible Power Delivery 3.0 & Quick Charge 4+.', 18000.00, 14000.00, 22, '[\"assets/images/product_img7.webp\"]', 1, 30, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 1, 0, 1, 'USB-C', 'iPhone, Android, PC', 'Noir Mat', NULL, NULL, NULL, NULL, 5.0, 41, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('prod_7', 'store_sentech', 'cat_gaming', 'sub_casques_gaming', 'Gaming', 'Casques gaming', 'Razer', 'Casque Gamer Surround 7.1 RGB Pro', 'casque-gamer-surround-7-1-rgb-pro', NULL, 'Audio spatial 7.1 immersif ; Micro cardioïde antibruit détachable ; Rétroéclairage RGB personnalisable ; Confort oreillettes gel.', 48000.00, 39000.00, 19, '[\"assets/images/product_img15.webp\"]', 1, 7, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 0, 1, 1, 'USB-C', 'PC, PS5, Xbox', 'Noir & Vert', NULL, NULL, NULL, NULL, 4.8, 16, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('prod_8', 'store_happy', 'cat_maison', 'sub_lampes_led', 'Maison & Énergie', 'Lampes LED', 'Xiaomi', 'Lampe de Bureau LED Tactile avec Induction', 'lampe-de-bureau-led-tactile-induction', NULL, 'Variateur d’intensité tactile 5 niveaux ; 3 températures de couleur ; Chargeur induction sans fil 15W intégré sur le socle.', 22000.00, 18000.00, 18, '[\"assets/images/product_img1.webp\"]', 1, 10, 'IN_STOCK', 'ACTIVE', 0, 1, 0, 0, 0, 0, 0, 1, 'Filaire', 'Universel', 'Blanc Épuré', NULL, NULL, NULL, NULL, 4.6, 9, '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('prod_9', 'store_sentech', 'cat_securite', 'sub_cameras_wifi', 'Sécurité & Caméras', 'Caméras Wi-Fi', 'Ezviz', 'Caméra de Surveillance Wi-Fi 2K 360°', 'camera-surveillance-wifi-2k-360', NULL, 'Résolution 2K Ultra-HD ; Rotation panoramique 360° ; Vision nocturne couleur infrarouge ; Détection humaine IA & Suivi auto.', 32000.00, 25000.00, 22, '[\"assets/images/product_img6.webp\"]', 1, 14, 'IN_STOCK', 'ACTIVE', 0, 1, 1, 0, 0, 1, 0, 1, 'Wi-Fi', 'iPhone, Android', 'Blanc', NULL, NULL, NULL, NULL, 4.9, 12, '2026-11-03 14:43:26', '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `reviews`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `product_id` varchar(64) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `review` text DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `reviewer_name` varchar(191) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- Structure de la table `sms_logs`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `sms_logs`;
CREATE TABLE `sms_logs` (
  `id` varchar(64) NOT NULL,
  `phone` varchar(32) NOT NULL,
  `message` text NOT NULL,
  `template` varchar(50) NOT NULL,
  `provider` varchar(32) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'SENT',
  `order_id` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sms_phone` (`phone`),
  KEY `idx_sms_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `sms_logs` (1 lignes)
INSERT INTO `sms_logs` (`id`, `phone`, `message`, `template`, `provider`, `status`, `order_id`, `created_at`) VALUES
('sms_6aeb65b76b8cd', +221780128253, 'SenTechPLUS: Bonjour Sekhou, votre commande #ST-2026-68959 de 0 FCFA a bien ete recue ! Livraison prevue a Dakar. Notre coursier vous contactera sous 2h. Info: +221 78 131 64 97', 'order_created', 'SIMULATION', 'SENT', 'ord_6aeb65b768945', '2026-11-04 09:04:56');

-- ------------------------------------------------------
-- Structure de la table `stores`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `stores`;
CREATE TABLE `stores` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `username` varchar(191) NOT NULL,
  `address` text NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `logo` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `contact` varchar(64) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `stores` (4 lignes)
INSERT INTO `stores` (`id`, `user_id`, `name`, `description`, `username`, `address`, `status`, `is_active`, `logo`, `email`, `contact`, `created_at`, `updated_at`) VALUES
('store_happy', 'user_seller_2', 'Happy Store Dakar', 'Accessoires mobiles et gadgets connectés certifiés.', 'happystore', 'Médina, Dakar', 'approved', 1, 'assets/images/happy_store.webp', 'happy@sentechplus.com', '+221 77 123 45 67', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('store_sentech', 'user_admin', 'SenTechPLUS Officiel', 'Boutique certifiée officielle SenTechPLUS Dakar. Matériel garanti 100% original.', 'sentechplus', 'Avenue Ponty, Plateau, Dakar', 'approved', 1, 'assets/images/sentech_icon.webp', 'contact@sentechplus.com', '+221 78 131 64 97', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('store_sentech_main', 'user_seller_main', 'SenTechPLUS Dakar Principal', 'Entrepôt central et centre de distribution express Dakar.', 'sentech-central', 'Point E, Dakar', 'approved', 1, 'assets/images/sentech_logo.webp', 'admin@sentechplus.com', '+221 78 131 64 97', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('store_tech', 'user_seller_1', 'Boutique Tech Dakar', 'Spécialiste de l\'audio nomade et des accessoires smartphone haute performance.', 'tech-dakar', 'Almadies, Dakar', 'approved', 1, 'assets/images/happy_store.webp', 'techdakar@sentechplus.com', '+221 78 131 64 97', '2026-11-03 14:43:26', '2026-11-03 14:43:26');

-- ------------------------------------------------------
-- Structure de la table `users`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(64) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `email_verified` datetime DEFAULT NULL,
  `is_email_verified` tinyint(1) NOT NULL DEFAULT 1,
  `verification_token` varchar(64) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'assets/images/profile_pic1.webp',
  `cart` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cart`)),
  `role` varchar(32) NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu de la table `users` (6 lignes)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `email_verified`, `is_email_verified`, `verification_token`, `image`, `cart`, `role`, `created_at`, `updated_at`) VALUES
('user_ad68a8803e51bbf3', 'Sekhou Toure', 'medzotoure6@gmail.com', '$2y$12$lXlaBvYjmVU2dG8FkzDM8ufdvmFViAPBiymi3RFwdQF9YhJBYo/bS', NULL, '2026-11-04 07:36:19', 1, '294d4d4a9063d4d6eb9012d58a30dd0e', 'assets/images/profile_pic1.webp', NULL, 'customer', '2026-11-04 07:36:19', '2026-11-04 07:36:19'),
('user_admin', 'Administrateur SenTech', 'admin@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', NULL, NULL, 1, NULL, 'assets/images/profile_pic1.webp', NULL, 'admin', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('user_customer_1', 'Mamadou Diallo', 'client@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', NULL, NULL, 1, NULL, 'assets/images/profile_pic1.webp', NULL, 'user', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('user_seller_1', 'Boutique Tech Dakar', 'vendeur@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', NULL, NULL, 1, NULL, 'assets/images/profile_pic1.webp', NULL, 'seller', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('user_seller_2', 'Happy Store Dakar', 'happystore@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', NULL, NULL, 1, NULL, 'assets/images/profile_pic1.webp', NULL, 'seller', '2026-11-03 14:43:26', '2026-11-03 14:43:26'),
('user_seller_main', 'SenTechPLUS Principal', 'central@sentechplus.com', '$2y$10$w3r9xH8J7L6K5N4M3O2P1Q0R9S8T7U6V5W4X3Y2Z1A0B1C2D3E4F', NULL, NULL, 1, NULL, 'assets/images/profile_pic1.webp', NULL, 'seller', '2026-11-03 14:43:26', '2026-11-03 14:43:26');

SET FOREIGN_KEY_CHECKS=1;
