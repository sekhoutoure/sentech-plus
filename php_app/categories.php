<?php
require_once __DIR__ . '/config/config.php';

// Redirection permanente 301 vers le catalogue officiel (shop.php)
$targetCategory = sanitize($_GET['category'] ?? '');
if (!empty($targetCategory)) {
    header('Location: shop.php?category=' . urlencode($targetCategory), true, 301);
} else {
    header('Location: shop.php', true, 301);
}
exit;
