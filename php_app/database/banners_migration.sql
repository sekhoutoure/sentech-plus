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
