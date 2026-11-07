<?php
/**
 * =============================================================================
 * SenTechPLUS — Moteur "Ask & Get" & Omnibar Zero-UI (Temps de réponse < 15ms)
 * =============================================================================
 * Transforme la barre de recherche en assistant prédictif instantané :
 * 1. Réponses directes aux questions fréquentes (Livraison, Délais, Paiement, Suivi)
 * 2. Recherche produits & catégories ultra-rapide avec suggestions en direct
 * =============================================================================
 */

require_once __DIR__ . '/config/config.php';

header('Content-Type: application/json; charset=utf-8');

// Protection Anti-Scraping / Rate Limiting (120 req / 60s par IP)
if (!SecurityShield::checkRateLimit('api_omnibar', 120, 60)) {
    http_response_code(429);
    header('Retry-After: 60');
    echo json_encode([
        'error' => 'Too Many Requests',
        'message' => 'Veuillez ralentir le rythme de vos recherches.'
    ]);
    exit;
}

header('Cache-Control: public, max-age=60');

$query = trim($_GET['q'] ?? '');
$cleanQ = mb_strtolower($query, 'UTF-8');


if (mb_strlen($cleanQ) === 0) {
    // Suggestions par défaut avant la frappe (Zero-UI Starter)
    echo json_encode([
        'type' => 'suggestions',
        'intents' => [],
        'shortcuts' => [
            ['title' => '🔥 Ventes Flash -35%', 'subtitle' => 'Offres exclusives limitées', 'url' => 'shop.php?collection=flash', 'icon' => 'flame'],
            ['title' => '⚡ Chargeurs GaN 65W & Câbles', 'subtitle' => 'Charge rapide pour iPhone et Samsung', 'url' => 'shop.php?category=telephones-accessoires', 'icon' => 'zap'],
            ['title' => '🎧 Écouteurs sans fil & Casques', 'subtitle' => 'Réduction active de bruit ANC', 'url' => 'shop.php?category=audio-ecouteurs', 'icon' => 'headphones'],
            ['title' => '📦 Suivre ma commande', 'subtitle' => 'Entrez votre numéro ST-XXXX', 'url' => 'tracking.php', 'icon' => 'package'],
            ['title' => '💬 Poser une question sur WhatsApp', 'subtitle' => 'Réponse immédiate de nos conseillers', 'url' => 'https://wa.me/221781316497', 'icon' => 'message-circle']
        ],
        'products' => []
    ]);
    exit;
}

$cacheKey = 'ask_get_' . md5($cleanQ);
$result = FastCache::remember($cacheKey, 180, function() use ($cleanQ, $query) {
    $intents = [];
    $shortcuts = [];
    $matchedProducts = [];
    $matchedCategories = [];

    // ─── 1. Moteur NLP d'Intention Directe ("Ask & Get") ────────────────────────
    
    // Intention : Délais & Frais de Livraison
    if (preg_match('/(livr|delai|frais|zone|dakar|combien.*cout|quand.*livr|prix.*livr)/i', $cleanQ)) {
        $intents[] = [
            'type' => 'info_card',
            'title' => '🚚 Livraison Express Dakar & Régions',
            'badge' => '2h à 4h à Dakar',
            'content' => 'Livraison rapide à Dakar (2 000 à 3 000 FCFA). **Gratuite dès 50 000 FCFA d\'achat**. Paiement à la réception après vérification.',
            'action_label' => 'Voir les tarifs de livraison',
            'action_url' => 'tracking.php',
            'icon' => 'truck'
        ];
    }

    // Intention : Moyens de Paiement (Wave / Orange Money / Cash)
    if (preg_match('/(pai|pay|wave|orange|om|free|carte|espece|cash|comment.*pay)/i', $cleanQ)) {
        $intents[] = [
            'type' => 'info_card',
            'title' => '💳 Moyens de Paiement Autorisés',
            'badge' => 'Sécurisé 100%',
            'content' => 'Réglez par **Wave Sénégal**, **Orange Money**, **Free Money**, **Carte Bancaire** ou en **Espèces au livreur** lors de la réception.',
            'action_label' => 'Passer commande en ligne',
            'action_url' => 'checkout.php',
            'icon' => 'shield-check'
        ];
    }

    // Intention : Suivi de Commande & Colis
    if (preg_match('/(suiv|colis|ou.*est|st-|command|statut)/i', $cleanQ)) {
        $intents[] = [
            'type' => 'action_card',
            'title' => '📦 Suivi de Commande en Temps Réel',
            'badge' => 'GPS & SMS',
            'content' => 'Renseignez votre référence de commande (ex: ST-123456) pour localiser votre livreur à Dakar.',
            'action_label' => 'Ouvrir le Suivi de Colis',
            'action_url' => 'tracking.php' . (preg_match('/(st-[a-z0-9-]+)/i', $cleanQ, $m) ? '?order=' . urlencode($m[1]) : ''),
            'icon' => 'navigation'
        ];
    }

    // Intention : Contact & Support Direct
    if (preg_match('/(contact|tel|phone|whatsapp|aide|service|adresse|boutique|ou.*trouv)/i', $cleanQ)) {
        $intents[] = [
            'type' => 'action_card',
            'title' => '💬 Service Client & Boutique Dakar',
            'badge' => 'Disponible 7j/7',
            'content' => 'Point E, Boulevard de l\'Est, Dakar. Assistance WhatsApp au **+221 78 131 64 97** (08h30 - 20h00).',
            'action_label' => 'Écrire sur WhatsApp',
            'action_url' => 'https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j\'ai%20une%20question.',
            'icon' => 'message-circle'
        ];
    }

    // Intention : Authenticité & Garantie
    if (preg_match('/(garant|authent|origin|vrai|faux|qualit)/i', $cleanQ)) {
        $intents[] = [
            'type' => 'info_card',
            'title' => '🛡️ Garantie & Authenticité 100% Certifiée',
            'badge' => 'Garantie 6 à 12 mois',
            'content' => 'Tous nos produits tech sont neufs, scellés d\'origine et testés. Échange ou remboursement sous 7 jours en cas de défaut.',
            'action_label' => 'En savoir plus',
            'action_url' => 'about.php',
            'icon' => 'award'
        ];
    }

    // ─── 2. Recherche Base de Données Catalogue Directe ("Search & Find") ────────
    $pdo = getDBConnection();
    if ($pdo) {
        try {
            // Recherche Produits
            $sql = "SELECT id, name, price, mrp, category_id, images, in_stock, stock, description 
                    FROM products 
                    WHERE is_active = 1 
                      AND (name LIKE :q1 OR description LIKE :q2 OR category_id LIKE :q3)
                    ORDER BY 
                      CASE 
                        WHEN name LIKE :qExact THEN 1
                        WHEN name LIKE :qStart THEN 2
                        ELSE 3
                      END, 
                      sales_count DESC 
                    LIMIT 6";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':q1'      => '%' . $cleanQ . '%',
                ':q2'      => '%' . $cleanQ . '%',
                ':q3'      => '%' . $cleanQ . '%',
                ':qExact'  => $cleanQ,
                ':qStart'  => $cleanQ . '%'
            ]);

            while ($row = $stmt->fetch()) {
                $img = getProductMainImage($row, 'assets/images/product_img1.webp');
                $matchedProducts[] = [
                    'id'              => $row['id'],
                    'name'            => $row['name'],
                    'price'           => (float)$row['price'],
                    'formatted_price' => formatPrice($row['price']),
                    'mrp'             => (float)$row['mrp'],
                    'has_discount'    => $row['mrp'] > $row['price'],
                    'discount_pct'    => $row['mrp'] > $row['price'] ? round((($row['mrp'] - $row['price']) / $row['mrp']) * 100) : 0,
                    'image'           => $img,
                    'in_stock'        => (int)($row['in_stock'] ?? 1) === 1,
                    'url'             => 'product.php?id=' . urlencode($row['id'])
                ];
            }

            // Recherche Catégories
            $catTree = getAllCategoriesTree();
            foreach ($catTree as $parent) {
                if (stripos($parent['name'], $cleanQ) !== false || stripos($parent['slug'], $cleanQ) !== false) {
                    $matchedCategories[] = [
                        'name' => $parent['name'],
                        'slug' => $parent['slug'],
                        'url'  => 'shop.php?category=' . urlencode($parent['slug']),
                        'icon' => $parent['icon'] ?? 'folder'
                    ];
                }
                foreach ($parent['subcategories'] ?? [] as $sub) {
                    if (stripos($sub['name'], $cleanQ) !== false || stripos($sub['slug'], $cleanQ) !== false) {
                        $matchedCategories[] = [
                            'name' => $parent['name'] . ' › ' . $sub['name'],
                            'slug' => $sub['slug'],
                            'url'  => 'shop.php?subcategory=' . urlencode($sub['slug']),
                            'icon' => $sub['icon'] ?? 'tag'
                        ];
                    }
                }
            }
            $matchedCategories = array_slice($matchedCategories, 0, 4);

        } catch (Throwable $e) {}
    }

    // Fallback : Recherche dans le catalogue officiel en mémoire
    if (empty($matchedProducts)) {
        $catalog = getOfficialCatalogProducts();
        foreach ($catalog as $p) {
            $pName = mb_strtolower($p['name'] ?? '', 'UTF-8');
            $pDesc = mb_strtolower($p['description'] ?? '', 'UTF-8');
            $pCat = mb_strtolower($p['category'] ?? ($p['category_id'] ?? ''), 'UTF-8');
            if (str_contains($pName, $cleanQ) || str_contains($pDesc, $cleanQ) || str_contains($pCat, $cleanQ)) {
                $img = getProductMainImage($p, 'assets/images/product_img1.webp');
                $matchedProducts[] = [
                    'id'              => $p['id'],
                    'name'            => $p['name'],
                    'price'           => (float)$p['price'],
                    'formatted_price' => formatPrice($p['price']),
                    'mrp'             => (float)($p['mrp'] ?? $p['price']),
                    'has_discount'    => ($p['mrp'] ?? 0) > $p['price'],
                    'discount_pct'    => ($p['mrp'] ?? 0) > $p['price'] ? round(((($p['mrp'] ?? 0) - $p['price']) / ($p['mrp'] ?? 1)) * 100) : 0,
                    'image'           => $img,
                    'in_stock'        => (int)($p['in_stock'] ?? 1) === 1,
                    'url'             => 'product.php?id=' . urlencode($p['id'])
                ];
                if (count($matchedProducts) >= 6) break;
            }
        }
    }

    return [
        'type'       => 'results',
        'query'      => $query,
        'intents'    => $intents,
        'categories' => $matchedCategories,
        'products'   => $matchedProducts,
        'total_found'=> count($matchedProducts)
    ];
});

echo json_encode($result);
