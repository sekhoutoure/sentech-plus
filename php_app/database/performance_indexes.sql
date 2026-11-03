-- =============================================================================
-- SenTechPLUS — Index de Scalabilité & Haute Performance MySQL (1000+ Utilisateurs)
-- =============================================================================

ALTER TABLE `products` 
  ADD INDEX IF NOT EXISTS `idx_prod_perf_cat` (`category_id`, `is_active`, `in_stock`),
  ADD INDEX IF NOT EXISTS `idx_prod_perf_price` (`price`, `is_active`),
  ADD INDEX IF NOT EXISTS `idx_prod_perf_created` (`created_at`, `is_active`);

ALTER TABLE `categories`
  ADD INDEX IF NOT EXISTS `idx_cat_perf_tree` (`parent_id`, `is_active`, `display_order`),
  ADD INDEX IF NOT EXISTS `idx_cat_perf_slug` (`slug`, `is_active`);

ALTER TABLE `banners`
  ADD INDEX IF NOT EXISTS `idx_ban_perf_placement` (`placement`, `is_active`, `display_order`);

ALTER TABLE `orders`
  ADD INDEX IF NOT EXISTS `idx_ord_perf_user` (`user_id`, `created_at`),
  ADD INDEX IF NOT EXISTS `idx_ord_perf_status` (`status`, `created_at`),
  ADD INDEX IF NOT EXISTS `idx_ord_perf_number` (`order_number`);
