<?php
/**
 * =============================================================================
 * SenTechPLUS — Google Merchant Center & Shopping XML Feed (Google Shopping RSS 2.0)
 * Compliant with Google Base Specs & Google Shopping SN (Sénégal)
 * =============================================================================
 */

require_once __DIR__ . '/config/config.php';

header('Content-Type: application/xml; charset=UTF-8');
header('X-Robots-Tag: noindex, follow');

$baseUrl = rtrim(APP_URL, '/');
$pdo = getDBConnection();

$products = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM products WHERE is_active = 1 OR in_stock = 1 ORDER BY created_at DESC");
        $products = $stmt ? $stmt->fetchAll() : [];
    } catch (Throwable $e) {
        $products = [];
    }
}

if (empty($products)) {
    $mockIds = [
        'prod_charger_gan65w', 'prod_earbuds_anc_pro', 'prod_smartwatch_ultra', 
        'prod_soundbar_gaming', 'prod_speaker_smart_gray', 'prod_camera_security_4k', 
        'prod_smart_lamp_led', 'prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6', 'prod_7'
    ];
    foreach ($mockIds as $mId) {
        $p = getProductById($mId);
        if ($p) $products[] = $p;
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title><?= htmlspecialchars(SITE_NAME . ' — Google Shopping Feed Sénégal') ?></title>
        <link><?= htmlspecialchars($baseUrl) ?></link>
        <description><?= htmlspecialchars(SITE_TAGLINE . ' — Boutique officielle à Dakar, Sénégal.') ?></description>
        <language>fr-SN</language>

        <?php foreach ($products as $prod): 
            $prodId = $prod['id'];
            $title = $prod['name'];
            $desc = !empty($prod['description']) ? strip_tags($prod['description']) : ($title . ' disponible chez SenTechPLUS avec livraison rapide à Dakar.');
            $link = $baseUrl . '/product.php?id=' . urlencode($prodId);
            $imgRaw = getProductMainImage($prod, 'assets/images/hero_product_img1.webp');
            $imageLink = (str_starts_with($imgRaw, 'http://') || str_starts_with($imgRaw, 'https://')) ? $imgRaw : ($baseUrl . '/' . ltrim($imgRaw, '/'));
            $price = number_format((float)$prod['price'], 2, '.', '') . ' XOF';
            $inStock = (int)($prod['stock'] ?? $prod['in_stock'] ?? 1) > 0;
            $availability = $inStock ? 'in_stock' : 'out_of_stock';
            $brand = !empty($prod['brand']) ? $prod['brand'] : 'SenTechPLUS';
            $category = !empty($prod['category']) ? $prod['category'] : 'Electronics';
            $sku = !empty($prod['sku']) ? $prod['sku'] : ('ST-' . strtoupper(substr(md5($prodId), 0, 8)));
        ?>
        <item>
            <g:id><?= htmlspecialchars($sku) ?></g:id>
            <g:title><?= htmlspecialchars($title) ?></g:title>
            <g:description><?= htmlspecialchars($desc) ?></g:description>
            <g:link><?= htmlspecialchars($link) ?></g:link>
            <g:image_link><?= htmlspecialchars($imageLink) ?></g:image_link>
            <g:condition>new</g:condition>
            <g:availability><?= htmlspecialchars($availability) ?></g:availability>
            <g:price><?= htmlspecialchars($price) ?></g:price>
            <g:brand><?= htmlspecialchars($brand) ?></g:brand>
            <g:product_type><?= htmlspecialchars($category) ?></g:product_type>
            <g:identifier_exists>no</g:identifier_exists>
            <g:shipping>
                <g:country>SN</g:country>
                <g:service>Livraison Express Dakar</g:service>
                <g:price>1500.00 XOF</g:price>
            </g:shipping>
            <g:custom_label_0>Sénégal</g:custom_label_0>
            <g:custom_label_1>Livraison 2h</g:custom_label_1>
        </item>
        <?php endforeach; ?>

    </channel>
</rss>
