-- =============================================================================
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