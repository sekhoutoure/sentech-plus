<?php
require_once __DIR__ . '/config/config.php';

header('Content-Type: application/json; charset=UTF-8');

$rawQ = $_GET['q'] ?? $_GET['search'] ?? '';
$q = trim(sanitize($rawQ));

if (mb_strlen($q, 'UTF-8') < 1) {
    echo json_encode([]);
    exit;
}

$output = [];
$pdo = getDBConnection();

if ($pdo) {
    try {
        $words = preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY);
        $searchClauses = [];
        $params = [];
        foreach ($words as $idx => $word) {
            $pKey = ":w_" . $idx;
            $searchClauses[] = "(name LIKE $pKey OR category LIKE $pKey OR description LIKE $pKey OR brand LIKE $pKey)";
            $params[$pKey] = '%' . $word . '%';
        }
        $whereSql = !empty($searchClauses) ? implode(" AND ", $searchClauses) : "1=1";

        $sql = "SELECT id, name, price, mrp, category, brand, stock, in_stock, images 
                FROM products 
                WHERE ({$whereSql}) AND (is_active = 1 OR in_stock = 1) 
                ORDER BY (CASE WHEN name LIKE :q_exact THEN 1 WHEN brand LIKE :q_exact THEN 2 ELSE 3 END), sales_count DESC, created_at DESC 
                LIMIT 8";
        $params[':q_exact'] = '%' . $q . '%';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll();

        foreach ($results as $r) {
            $img = getProductMainImage($r, 'assets/images/product_img4.webp');

            $output[] = [
                'id' => $r['id'],
                'name' => $r['name'],
                'category' => $r['category'] ?? 'High-Tech',
                'brand' => $r['brand'] ?? '',
                'price' => (float)$r['price'],
                'mrp' => !empty($r['mrp']) ? (float)$r['mrp'] : 0,
                'formatted_price' => formatPrice((float)$r['price']),
                'image' => $img,
                'in_stock' => (int)($r['stock'] ?? $r['in_stock'] ?? 1) > 0
            ];
        }
    } catch (Throwable $e) {
        $output = [];
    }
}

// Zéro catalogue fictif : recherche dynamique 100% MySQL

echo json_encode($output);
