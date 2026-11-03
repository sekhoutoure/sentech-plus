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

// Catalogue de secours en cas d'indisponibilité temporaire BDD
if (empty($output)) {
    $mockCatalog = [
        ['id' => 'prod_charger_gan65w', 'name' => 'Chargeur Rapide 65W GaN Dual USB-C', 'category' => 'Téléphones & Accessoires', 'brand' => 'Baseus', 'price' => 22000, 'mrp' => 28000, 'images' => '["assets/images/product_img7.webp"]', 'stock' => 35],
        ['id' => 'prod_earbuds_anc_pro', 'name' => 'Écouteurs Sans Fil Pro ANC Réduction Bruit', 'category' => 'Audio & Écouteurs', 'brand' => 'Anker', 'price' => 35000, 'mrp' => 45000, 'images' => '["assets/images/hero_product_img1.webp"]', 'stock' => 20],
        ['id' => 'prod_smartwatch_ultra', 'name' => 'Montre Connectée AMOLED Sport & Appels', 'category' => 'Montres & Objets Connectés', 'brand' => 'Samsung', 'price' => 42000, 'mrp' => 55000, 'images' => '["assets/images/hero_product_img2.webp"]', 'stock' => 15],
        ['id' => 'prod_soundbar_gaming', 'name' => 'Barre de Son Home Cinema 7.1 Bass Immersion', 'category' => 'Gaming & Setup', 'brand' => 'Razer', 'price' => 49000, 'mrp' => 65000, 'images' => '["assets/images/product_img8.webp"]', 'stock' => 12],
        ['id' => 'prod_speaker_smart_gray', 'name' => 'Enceinte Bluetooth Smart HD 360° Waterproof', 'category' => 'Audio & Écouteurs', 'brand' => 'JBL', 'price' => 27000, 'mrp' => 35000, 'images' => '["assets/images/product_img2.webp"]', 'stock' => 22],
        ['id' => 'prod_camera_security_4k', 'name' => 'Caméra de Surveillance Wi-Fi 4K Vision Nocturne', 'category' => 'Sécurité & Caméras', 'brand' => 'Ezviz', 'price' => 34000, 'mrp' => 45000, 'images' => '["assets/images/product_img6.webp"]', 'stock' => 18],
        ['id' => 'prod_smart_lamp_led', 'name' => 'Lampe LED Tactile Intelligente Sans Fil', 'category' => 'Maison & Énergie', 'brand' => 'Xiaomi', 'price' => 18500, 'mrp' => 24000, 'images' => '["assets/images/product_img1.webp"]', 'stock' => 28],
        ['id' => 'prod_mouse_rgb_silent', 'name' => 'Souris Gamer Ergonomique Sans Fil Silence RGB', 'category' => 'Informatique & Bureau', 'brand' => 'Logitech', 'price' => 15000, 'mrp' => 20000, 'images' => '["assets/images/product_img3.webp"]', 'stock' => 18],
        ['id' => 'prod_powerbank_20k', 'name' => 'Batterie Externe 20000mAh 65W PowerBank USB-C', 'category' => 'Téléphones & Accessoires', 'brand' => 'Baseus', 'price' => 25000, 'mrp' => 32000, 'images' => '["assets/images/product_img7.webp"]', 'stock' => 14],
        ['id' => 'prod_headset_studio', 'name' => 'Casque Audio Studio Sans Fil Hi-Res ANC', 'category' => 'Audio & Écouteurs', 'brand' => 'Sony', 'price' => 55000, 'mrp' => 69000, 'images' => '["assets/images/product_img4.webp"]', 'stock' => 9],
    ];

    $qWords = preg_split('/\s+/', mb_strtolower($q, 'UTF-8'), -1, PREG_SPLIT_NO_EMPTY);
    foreach ($mockCatalog as $item) {
        $searchSpace = mb_strtolower($item['name'] . ' ' . $item['category'] . ' ' . ($item['brand'] ?? ''), 'UTF-8');
        $match = true;
        foreach ($qWords as $qw) {
            if (strpos($searchSpace, $qw) === false) {
                $match = false;
                break;
            }
        }
        if ($match) {
            $img = getProductMainImage($item, 'assets/images/product_img4.webp');
            $output[] = [
                'id' => $item['id'],
                'name' => $item['name'],
                'category' => $item['category'],
                'brand' => $item['brand'] ?? '',
                'price' => (float)$item['price'],
                'mrp' => (float)($item['mrp'] ?? 0),
                'formatted_price' => formatPrice((float)$item['price']),
                'image' => $img,
                'in_stock' => (int)($item['stock'] ?? 1) > 0
            ];
        }
    }
}

echo json_encode($output);
