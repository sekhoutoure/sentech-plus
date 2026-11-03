-- =============================================================================
-- SenTechPLUS — Migration : Système Email & Notifications
-- Tables : smtp_settings, email_queue, email_verifications, password_resets, sms_logs
-- =============================================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `smtp_settings` (
  `id` INT NOT NULL DEFAULT 1 PRIMARY KEY,
  `smtp_host` VARCHAR(255) NOT NULL DEFAULT 'smtp.hostinger.com',
  `smtp_port` INT NOT NULL DEFAULT 465,
  `smtp_encryption` ENUM('ssl','tls','none') NOT NULL DEFAULT 'ssl',
  `smtp_user` VARCHAR(255) NOT NULL DEFAULT 'contact@sentechplus.com',
  `smtp_pass` VARCHAR(255) NOT NULL DEFAULT '',
  `from_name` VARCHAR(191) NOT NULL DEFAULT 'SenTechPLUS Dakar',
  `from_email` VARCHAR(191) NOT NULL DEFAULT 'contact@sentechplus.com',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `smtp_settings` (`id`, `smtp_host`, `smtp_port`, `smtp_encryption`, `smtp_user`, `from_name`, `from_email`)
VALUES (1, 'smtp.hostinger.com', 465, 'ssl', 'contact@sentechplus.com', 'SenTechPLUS Dakar', 'contact@sentechplus.com');

CREATE TABLE IF NOT EXISTS `email_queue` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient_email` VARCHAR(255) NOT NULL,
  `recipient_name` VARCHAR(191) NOT NULL DEFAULT '',
  `subject` VARCHAR(500) NOT NULL,
  `body_html` LONGTEXT NOT NULL,
  `template_type` VARCHAR(64) NOT NULL DEFAULT 'general',
  `status` ENUM('pending','sending','sent','failed') NOT NULL DEFAULT 'pending',
  `attempts` INT NOT NULL DEFAULT 0,
  `max_attempts` INT NOT NULL DEFAULT 3,
  `error_message` TEXT NULL,
  `sent_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email_queue_status` (`status`, `attempts`),
  INDEX `idx_email_queue_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `email_verifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(128) NOT NULL UNIQUE,
  `otp_code` VARCHAR(10) NOT NULL,
  `is_used` TINYINT(1) NOT NULL DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ev_token` (`token`),
  INDEX `idx_ev_user` (`user_id`, `is_used`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(128) NOT NULL UNIQUE,
  `is_used` TINYINT(1) NOT NULL DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_pr_token` (`token`),
  INDEX `idx_pr_email` (`email`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sms_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phone` VARCHAR(32) NOT NULL,
  `message` TEXT NOT NULL,
  `provider` VARCHAR(64) NOT NULL DEFAULT 'infobip',
  `status` VARCHAR(32) NOT NULL DEFAULT 'sent',
  `error_message` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sms_phone` (`phone`),
  INDEX `idx_sms_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
