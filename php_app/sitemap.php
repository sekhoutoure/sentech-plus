<?php
/**
 * =============================================================================
 * SenTechPLUS — Dynamic XML Sitemap Generator (Google & Bing Compliant)
 * Generates XML standard sitemap with Image Extensions and Dynamic Entities
 * =============================================================================
 */

require_once __DIR__ . '/config/config.php';

header('Content-Type: application/xml; charset=UTF-8');
header('X-Robots-Tag: noindex, follow');

$baseUrl = rtrim(APP_URL, '/');
$pdo = getDBConnection();
$today = date('Y-m-d');

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

    <!-- ─── 1. PAGES STATIQUES PRINCIPALES ──────────────────────────────────── -->
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/shop.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/categories.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/about.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/contact.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/faq.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/case-studies.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/privacy.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/tracking.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc><?= htmlspecialchars($baseUrl . '/pricing.php') ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>


    <!-- ─── 2. RAYONS & CATÉGORIES HIÉRARCHIQUES ───────────────────────────── -->
    <?php
    $categoriesTree = getAllCategoriesTree();
    foreach ($categoriesTree as $pCat):
        $catUrl = $baseUrl . '/shop.php?category=' . urlencode($pCat['slug']);
    ?>
    <url>
        <loc><?= htmlspecialchars($catUrl) ?></loc>
        <lastmod><?= $today ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
        <?php if (!empty($pCat['subcategories'])): ?>
            <?php foreach ($pCat['subcategories'] as $sub): 
                $subUrl = $baseUrl . '/shop.php?category=' . urlencode($pCat['slug']) . '&amp;subcategory=' . urlencode($sub['slug']);
            ?>
            <url>
                <loc><?= htmlspecialchars($subUrl) ?></loc>
                <lastmod><?= $today ?></lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.7</priority>
            </url>
            <?php endforeach; ?>
        <?php endif; ?>
    <?php endforeach; ?>

    <!-- ─── 3. PRODUITS DU CATALOGUE & IMAGES GOOGLE ────────────────────────── -->
    <?php
    $products = [];
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT id, name, images, updated_at, created_at FROM products WHERE is_active = 1 OR in_stock = 1 ORDER BY updated_at DESC");
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

    foreach ($products as $prod):
        $prodUrl = $baseUrl . '/product.php?id=' . urlencode($prod['id']);
        $prodDate = !empty($prod['updated_at']) ? substr($prod['updated_at'], 0, 10) : (!empty($prod['created_at']) ? substr($prod['created_at'], 0, 10) : $today);
        $mainImage = getProductMainImage($prod, 'assets/images/hero_product_img1.webp');
        $fullImageUrl = (str_starts_with($mainImage, 'http://') || str_starts_with($mainImage, 'https://')) ? $mainImage : ($baseUrl . '/' . ltrim($mainImage, '/'));
    ?>
    <url>
        <loc><?= htmlspecialchars($prodUrl) ?></loc>
        <lastmod><?= htmlspecialchars($prodDate) ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
        <?php if (!empty($fullImageUrl)): ?>
        <image:image>
            <image:loc><?= htmlspecialchars($fullImageUrl) ?></image:loc>
            <image:title><?= htmlspecialchars($prod['name'] ?? 'Produit High-Tech SenTechPLUS') ?></image:title>
        </image:image>
        <?php endif; ?>
    </url>
    <?php endforeach; ?>

</urlset>
