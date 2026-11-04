<?php
require_once __DIR__ . '/config/config.php';

header('Content-Type: application/json; charset=UTF-8');

$rawQ = $_GET['q'] ?? $_GET['search'] ?? '';
$q = trim(sanitize($rawQ));

$pdo = getDBConnection();
if (!$pdo) {
    echo json_encode([]);
    exit;
}

// Nettoyage et normalisation phonétique (suppression accents et ponctuation)
function normalizeSearchWord($str) {
    $str = mb_strtolower(trim($str), 'UTF-8');
    $unwanted = [
        'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C',
        'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
        'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a',
        'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i',
        'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u',
        'û'=>'u', 'ü'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y', '°'=>'', '+'=>' ', '-'=>' ', '/'=>' ', '\''=>' ', '"'=>' '
    ];
    $str = strtr($str, $unwanted);
    return preg_replace('/[^a-z0-9 ]/', '', $str);
}

// 1. Requête vide : Suggérer directement les meilleurs produits du catalogue réel
if (mb_strlen($q, 'UTF-8') < 1) {
    try {
        $stmtPop = $pdo->query("SELECT id, name, price, mrp, category, brand, stock, in_stock, images 
                                FROM products 
                                WHERE is_active = 1 
                                ORDER BY is_featured DESC, sales_count DESC, id ASC 
                                LIMIT 6");
        $popResults = $stmtPop->fetchAll();
        $output = [];
        foreach ($popResults as $r) {
            $output[] = [
                'id' => $r['id'],
                'name' => $r['name'],
                'category' => $r['category'] ?? 'High-Tech',
                'brand' => $r['brand'] ?? '',
                'price' => (float)$r['price'],
                'mrp' => !empty($r['mrp']) ? (float)$r['mrp'] : 0,
                'formatted_price' => formatPrice((float)$r['price']),
                'image' => getProductMainImage($r, 'assets/images/product_img4.webp'),
                'in_stock' => (int)($r['stock'] ?? $r['in_stock'] ?? 1) > 0,
                'is_popular' => true
            ];
        }
        echo json_encode($output);
        exit;
    } catch (Throwable $e) {
        echo json_encode([]);
        exit;
    }
}

$cleanQ = normalizeSearchWord($q);
$qWords = preg_split('/\s+/', $cleanQ, -1, PREG_SPLIT_NO_EMPTY);
$resultsMap = [];

// 2. Étape 1 : Recherche SQL directe (Recherche exacte et sous-chaînes)
try {
    $whereClauses = [];
    $params = [];
    foreach ($qWords as $idx => $w) {
        $pKey = ":w_" . $idx;
        $whereClauses[] = "(name LIKE $pKey OR category LIKE $pKey OR description LIKE $pKey OR brand LIKE $pKey)";
        $params[$pKey] = '%' . $w . '%';
    }
    $whereSql = !empty($whereClauses) ? implode(" AND ", $whereClauses) : "1=1";
    $sql = "SELECT id, name, price, mrp, category, brand, stock, in_stock, images, sales_count, is_featured 
            FROM products 
            WHERE ({$whereSql}) AND (is_active = 1 OR in_stock = 1) 
            ORDER BY (CASE WHEN name LIKE :q_exact THEN 1 WHEN brand LIKE :q_exact THEN 2 ELSE 3 END), sales_count DESC 
            LIMIT 8";
    $params[':q_exact'] = '%' . $q . '%';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    foreach ($rows as $r) {
        $resultsMap[$r['id']] = [
            'item' => $r,
            'score' => 100
        ];
    }
} catch (Throwable $e) {}

// 3. Étape 2 : Algorithme Fuzzy & Tolérance aux fautes de frappe (Levenshtein, Soundex, Metaphone, Préfixes)
if (count($resultsMap) < 6) {
    try {
        $stmtAll = $pdo->query("SELECT id, name, price, mrp, category, brand, stock, in_stock, images, sales_count, is_featured 
                                FROM products 
                                WHERE is_active = 1 LIMIT 150");
        $allProducts = $stmtAll->fetchAll();

        foreach ($allProducts as $p) {
            if (isset($resultsMap[$p['id']])) {
                continue;
            }

            $score = 0;
            $haystack = normalizeSearchWord($p['name'] . ' ' . ($p['brand'] ?? '') . ' ' . ($p['category'] ?? ''));
            $haystackWords = preg_split('/\s+/', $haystack, -1, PREG_SPLIT_NO_EMPTY);

            foreach ($qWords as $qw) {
                $qwLen = strlen($qw);
                if ($qwLen < 1) continue;

                foreach ($haystackWords as $hw) {
                    $hwLen = strlen($hw);

                    // A. Correspondance de préfixe direct (ex: "casq" -> "casque", "charg" -> "chargeur")
                    if ($qwLen >= 2 && str_starts_with($hw, $qw)) {
                        $score += 85;
                        break;
                    }
                    if ($hwLen >= 3 && str_starts_with($qw, $hw)) {
                        $score += 80;
                        break;
                    }

                    // B. Tolérance aux fautes de frappe (Levenshtein)
                    if ($qwLen >= 3) {
                        $lev = levenshtein($qw, $hw);
                        $maxAllowedLev = ($qwLen <= 4) ? 1 : (($qwLen <= 7) ? 2 : 3);
                        if ($lev <= $maxAllowedLev) {
                            $score += (75 - ($lev * 15));
                            break;
                        }
                    }

                    // C. Tolérance phonétique (Metaphone & Soundex en français / anglais)
                    // Ex: "sansung" ~ "samsung", "ipone" ~ "iphone", "blutooth" ~ "bluetooth", "ecouter" ~ "ecouteurs"
                    if ($qwLen >= 3) {
                        if (metaphone($qw) === metaphone($hw) || soundex($qw) === soundex($hw)) {
                            $score += 65;
                            break;
                        }
                    }

                    // D. Taux de similarité textuelle
                    if ($qwLen >= 4 && $hwLen >= 4) {
                        similar_text($qw, $hw, $percent);
                        if ($percent >= 70) {
                            $score += (int)($percent * 0.7);
                            break;
                        }
                    }
                }
            }

            if ($score >= 40) {
                $resultsMap[$p['id']] = [
                    'item' => $p,
                    'score' => $score + ($p['sales_count'] ?? 0)
                ];
            }
        }
    } catch (Throwable $e) {}
}

// 4. Tri par score de pertinence décroissant
uasort($resultsMap, function($a, $b) {
    return $b['score'] <=> $a['score'];
});

$output = [];
$topResults = array_slice($resultsMap, 0, 8);
foreach ($topResults as $res) {
    $r = $res['item'];
    $output[] = [
        'id' => $r['id'],
        'name' => $r['name'],
        'category' => $r['category'] ?? 'High-Tech',
        'brand' => $r['brand'] ?? '',
        'price' => (float)$r['price'],
        'mrp' => !empty($r['mrp']) ? (float)$r['mrp'] : 0,
        'formatted_price' => formatPrice((float)$r['price']),
        'image' => getProductMainImage($r, 'assets/images/product_img4.webp'),
        'in_stock' => (int)($r['stock'] ?? $r['in_stock'] ?? 1) > 0,
        'score' => $res['score']
    ];
}

echo json_encode($output);
