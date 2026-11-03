<?php
require_once dirname(__DIR__) . '/config/config.php';
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-cache, max-age=60');

$q = trim(sanitize($_GET['q'] ?? ''));
if (mb_strlen($q, 'UTF-8') < 2 || mb_strlen($q, 'UTF-8') > 80) {
    echo json_encode(['suggestions' => [], 'popular' => []]);
    exit;
}

$pdo = getDBConnection();
$suggestions = [];
$popular = [];

try {
    if ($pdo) {
        $like = '%' . $q . '%';
        $stmt = $pdo->prepare(
            "SELECT id, name, brand, category, price, mrp, images 
             FROM products 
             WHERE is_active = 1 
               AND (name LIKE :q1 OR brand LIKE :q2 OR category LIKE :q3 OR subcategory LIKE :q4)
             ORDER BY 
               CASE WHEN name LIKE :q5 THEN 1 
                    WHEN brand LIKE :q6 THEN 2 
                    ELSE 3 END,
               created_at DESC
             LIMIT 8"
        );
        $stmt->execute([':q1'=>$like,':q2'=>$like,':q3'=>$like,':q4'=>$like,':q5'=>$like,':q6'=>$like]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $r) {
            $imgs = getProductImages($r['images'] ?? null, 'assets/images/hero_product_img1.webp');
            $discount = ($r['mrp'] > $r['price']) ? round((($r['mrp'] - $r['price']) / $r['mrp']) * 100) : 0;
            $suggestions[] = [
                'id'       => $r['id'],
                'name'     => $r['name'],
                'brand'    => $r['brand'] ?? '',
                'category' => $r['category'] ?? '',
                'price'    => formatPrice($r['price']),
                'discount' => $discount,
                'img'      => $imgs[0] ?? 'assets/images/hero_product_img1.webp',
                'url'      => 'product.php?id=' . urlencode($r['id']),
            ];
        }
        $pop = $pdo->query("SELECT DISTINCT name FROM products WHERE is_active=1 ORDER BY sales_count DESC LIMIT 4");
        foreach ($pop->fetchAll(PDO::FETCH_COLUMN) as $name) {
            $popular[] = $name;
        }
    }
} catch (Throwable $e) {
    $suggestions = [];
    $popular = ['Casque Pro', 'JBL', 'Samsung', 'Chargeur GaN'];
}
echo json_encode(['suggestions' => $suggestions, 'popular' => $popular], JSON_UNESCAPED_UNICODE);
