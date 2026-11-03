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
