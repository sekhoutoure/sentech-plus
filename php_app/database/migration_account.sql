-- =============================================================================
-- Migration SenTechPLUS : Système Espace Compte Client & Adresses
-- =============================================================================

SET NAMES utf8mb4;

-- Extension de la table addresses
ALTER TABLE `addresses`
  ADD COLUMN IF NOT EXISTS `first_name` VARCHAR(128) NULL AFTER `user_id`,
  ADD COLUMN IF NOT EXISTS `last_name` VARCHAR(128) NULL AFTER `first_name`,
  ADD COLUMN IF NOT EXISTS `region` VARCHAR(128) NOT NULL DEFAULT 'Dakar' AFTER `last_name`,
  ADD COLUMN IF NOT EXISTS `district` VARCHAR(128) NULL AFTER `city`,
  ADD COLUMN IF NOT EXISTS `landmark` VARCHAR(255) NULL AFTER `street`,
  ADD COLUMN IF NOT EXISTS `is_default` TINYINT(1) NOT NULL DEFAULT 0 AFTER `phone`;

-- Extension de la table users
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `phone` VARCHAR(64) NULL AFTER `email`,
  ADD COLUMN IF NOT EXISTS `birth_date` DATE NULL AFTER `phone`,
  ADD COLUMN IF NOT EXISTS `is_verified` TINYINT(1) NOT NULL DEFAULT 1 AFTER `role`;

-- Table product_reviews (si non existante)
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `product_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(128) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT NOT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'published', -- 'pending', 'published', 'rejected'
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
