<?php
require_once __DIR__ . '/config/config.php';
applyHttpMicroCache(30);

// ─── 1. Extraction et Nettoyage Sécurisé des Paramètres GET ─────────────────

$search             = sanitize($_GET['q'] ?? $_GET['search'] ?? '');
$categoryParam      = sanitize($_GET['category'] ?? '');
$subcategoryParam   = sanitize($_GET['subcategory'] ?? '');
$brandParam         = sanitize($_GET['brand'] ?? '');
$collectionParam    = sanitize($_GET['collection'] ?? ''); // 'flash', 'under10k', 'under25k', 'new', 'promo', 'express'
$connectionParam    = strtolower(sanitize($_GET['connection'] ?? $_GET['connection_type'] ?? ''));
$compatibilityParam = strtolower(sanitize($_GET['compatibility'] ?? ''));
$colorParam         = strtolower(sanitize($_GET['color'] ?? ''));
$inStockParam       = sanitize($_GET['in_stock'] ?? ''); // '1' (en stock), 'limited' (<=5), 'all'
$promoParam         = isset($_GET['promo']) && $_GET['promo'] === '1';
$isNewParam         = isset($_GET['is_new']) && $_GET['is_new'] === '1';
$expressParam       = isset($_GET['delivery_express']) && $_GET['delivery_express'] === '1';
$minRating          = isset($_GET['rating']) && is_numeric($_GET['rating']) ? (float)$_GET['rating'] : null;

$minPrice           = isset($_GET['min_price']) && is_numeric($_GET['min_price']) ? (float)$_GET['min_price'] : null;
$maxPrice           = isset($_GET['max_price']) && is_numeric($_GET['max_price']) ? (float)$_GET['max_price'] : null;
$sort               = sanitize($_GET['sort'] ?? 'newest');
$page               = isset($_GET['page']) && is_numeric($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$limit              = 12;
$offset             = ($page - 1) * $limit;

// Arborescence complète des catégories
$categoriesTree = getAllCategoriesTree();

// Résolution de la catégorie / sous-catégorie active
$activeCategory = null;
$activeSubcategory = null;
if ($categoryParam) {
    $activeCategory = getCategoryBySlug($categoryParam);
}
if ($subcategoryParam) {
    $activeSubcategory = getCategoryBySlug($subcategoryParam);
}

// ─── 2. SEO Dynamique ────────────────────────────────────────────────────────

$pageTitle = "Boutique High-Tech Dakar — SenTechPLUS";
$metaDescription = "Catalogue High-Tech au Sénégal : écouteurs sans fil, montres connectées et chargeurs rapides. Livraison express 2h à Dakar et paiement Wave/OM.";

$collectionTitles = [
    'flash'    => '⚡ Ventes Flash & Bons Plans',
    'under10k' => '🏷️ Moins de 10 000 FCFA',
    'under25k' => '🏷️ Moins de 25 000 FCFA',
    'new'      => '✨ Nouveautés High-Tech',
    'promo'    => '🔥 Promotions Spéciales',
    'express'  => '🚚 Livraison Express Dakar'
];

if ($activeSubcategory) {
    $pageTitle = htmlspecialchars($activeSubcategory['name']) . " — SenTechPLUS";
    $metaDescription = "Achetez " . htmlspecialchars($activeSubcategory['name']) . " au Sénégal. Livraison rapide à Dakar, paiement Wave & Orange Money. Garantie SenTechPLUS.";
} elseif ($activeCategory) {
    $pageTitle = htmlspecialchars($activeCategory['name']) . " — SenTechPLUS";
    $metaDescription = "Produits " . htmlspecialchars($activeCategory['name']) . " certifiés au Sénégal. Livraison express Dakar 2h, garantie et authenticité SenTechPLUS.";
} elseif ($collectionParam && isset($collectionTitles[$collectionParam])) {
    $pageTitle = $collectionTitles[$collectionParam] . " — Boutique SenTechPLUS";
    $metaDescription = "Profitez des meilleures offres High-Tech au Sénégal : " . strip_tags($collectionTitles[$collectionParam]) . ". Paiement mobile sécurisé, livraison rapide à Dakar.";
} elseif ($brandParam) {
    $pageTitle = "Équipements " . htmlspecialchars($brandParam) . " — SenTechPLUS";
    $metaDescription = "Tous les produits " . htmlspecialchars($brandParam) . " disponibles au Sénégal sur SenTechPLUS Dakar. Authentiques, garantis et livrés en 2h à Dakar.";
} elseif ($search) {
    $pageTitle = "Recherche: " . htmlspecialchars($search) . " — SenTechPLUS";
    $metaDescription = "Résultats pour \"" . htmlspecialchars($search) . "\" sur la boutique High-Tech SenTechPLUS au Sénégal. Produits certifiés avec livraison express Dakar.";
}


// ─── 3. Construction Sécurisée de la Requête SQL (PDO) ────────────────────────

$pdo = getDBConnection();
$whereClauses = ["is_active = 1"];
$params = [];

// Recherche textuelle multi-colonnes
if ($search !== '') {
    $whereClauses[] = "(name LIKE :search OR description LIKE :search OR category LIKE :search OR subcategory LIKE :search OR brand LIKE :search)";
    $params[':search'] = '%' . $search . '%';
}

// Catégorie
if ($activeCategory) {
    $whereClauses[] = "(category = :cat_name OR category_id = :cat_id OR category LIKE :cat_slug)";
    $params[':cat_name'] = $activeCategory['name'];
    $params[':cat_id']   = $activeCategory['id'];
    $params[':cat_slug'] = '%' . $activeCategory['slug'] . '%';
}

// Sous-catégorie
if ($activeSubcategory) {
    $whereClauses[] = "(subcategory = :subcat_name OR subcategory_id = :subcat_id OR subcategory LIKE :subcat_slug)";
    $params[':subcat_name'] = $activeSubcategory['name'];
    $params[':subcat_id']   = $activeSubcategory['id'];
    $params[':subcat_slug'] = '%' . $activeSubcategory['slug'] . '%';
}

// Marque
if ($brandParam !== '') {
    $whereClauses[] = "brand = :brand";
    $params[':brand'] = $brandParam;
}

// Fourchette de Prix
if ($minPrice !== null && $minPrice > 0) {
    $whereClauses[] = "price >= :min_price";
    $params[':min_price'] = $minPrice;
}
if ($maxPrice !== null && $maxPrice > 0) {
    $whereClauses[] = "price <= :max_price";
    $params[':max_price'] = $maxPrice;
}

// Disponibilité / Stock
if ($inStockParam === '1' || $inStockParam === 'in_stock') {
    $whereClauses[] = "stock > 0";
} elseif ($inStockParam === 'limited') {
    $whereClauses[] = "stock > 0 AND stock <= 5";
} elseif ($inStockParam === 'out') {
    $whereClauses[] = "stock = 0";
}

// Promotions & Ventes Flash
if ($promoParam || $collectionParam === 'promo') {
    $whereClauses[] = "(mrp > price OR is_flash_sale = 1)";
} elseif ($collectionParam === 'flash') {
    $whereClauses[] = "is_flash_sale = 1";
}

// Nouveautés
if ($isNewParam || $collectionParam === 'new') {
    $whereClauses[] = "is_new = 1";
}

// Livraison Express Dakar
if ($expressParam || $collectionParam === 'express') {
    $whereClauses[] = "is_express_delivery = 1";
}

// Filtres Budgets prédéfinis
if ($collectionParam === 'under10k') {
    $whereClauses[] = "price <= 10000";
} elseif ($collectionParam === 'under25k') {
    $whereClauses[] = "price <= 25000";
}

// Type de Connexion (Bluetooth, USB-C, Jack, Wi-Fi)
if ($connectionParam !== '') {
    $whereClauses[] = "(connection_type LIKE :conn OR description LIKE :conn_desc OR name LIKE :conn_name)";
    $params[':conn'] = '%' . $connectionParam . '%';
    $params[':conn_desc'] = '%' . $connectionParam . '%';
    $params[':conn_name'] = '%' . $connectionParam . '%';
}

// Compatibilité (iPhone, Android, PC, PS5, Xbox)
if ($compatibilityParam !== '') {
    $whereClauses[] = "(compatibility LIKE :comp OR description LIKE :comp_desc OR name LIKE :comp_name)";
    $params[':comp'] = '%' . $compatibilityParam . '%';
    $params[':comp_desc'] = '%' . $compatibilityParam . '%';
    $params[':comp_name'] = '%' . $compatibilityParam . '%';
}

// Couleur
if ($colorParam !== '') {
    $whereClauses[] = "(color LIKE :col OR description LIKE :col_desc OR name LIKE :col_name)";
    $params[':col'] = '%' . $colorParam . '%';
    $params[':col_desc'] = '%' . $colorParam . '%';
    $params[':col_name'] = '%' . $colorParam . '%';
}

// Tri SQL
$orderBy = match ($sort) {
    'price_asc'  => "price ASC, id DESC",
    'price_desc' => "price DESC, id DESC",
    'sales'      => "sales_count DESC, created_at DESC",
    'promo'      => "(mrp - price) DESC, created_at DESC",
    'rating'     => "created_at DESC",
    'in_stock'   => "stock DESC, created_at DESC",
    default      => "created_at DESC"
};

$whereSql = implode(" AND ", $whereClauses);

// ─── 4. Exécution & Récupération des Données ──────────────────────────────────

$totalProducts = 0;
$products = [];
$availableBrands = ['Apple', 'Samsung', 'Sony', 'JBL', 'Anker', 'Baseus', 'Logitech', 'Razer', 'Xiaomi', 'Ezviz'];

try {
    if (!$pdo) throw new Exception("DB offline");

    // Extraction dynamique des marques existantes
    $brandQuery = $pdo->query("SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL AND brand != '' AND is_active = 1 ORDER BY brand ASC");
    if ($brandQuery) {
        $dbBrands = $brandQuery->fetchAll(PDO::FETCH_COLUMN);
        if (!empty($dbBrands)) {
            $availableBrands = array_values(array_unique(array_merge($dbBrands, $availableBrands)));
        }
    }

    // Calcul du total de résultats pour la pagination
    $countSql = "SELECT COUNT(*) FROM products WHERE {$whereSql}";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalProducts = (int)$countStmt->fetchColumn();
    $totalPages = max(1, (int)ceil($totalProducts / $limit));

    // Récupération des produits paginés
    $sql = "SELECT * FROM products WHERE {$whereSql} ORDER BY {$orderBy} LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $products = $stmt->fetchAll();
} catch (Throwable $e) {
    $products = [];
    $totalProducts = 0;
    $totalPages = 1;
}

// ─── 5. Gestion des Filtres Actifs Réels (Uniquement critères secondaires) ────

$activeFilters = [];

if ($search !== '') {
    $activeFilters[] = ['label' => '« ' . $search . ' »', 'key' => 'q'];
}
if ($brandParam !== '') {
    $activeFilters[] = ['label' => 'Marque : ' . $brandParam, 'key' => 'brand'];
}
if ($promoParam) {
    $activeFilters[] = ['label' => '🔥 Promos', 'key' => 'promo'];
}
if ($isNewParam) {
    $activeFilters[] = ['label' => '✨ Nouveautés', 'key' => 'is_new'];
}
if ($expressParam) {
    $activeFilters[] = ['label' => '🚚 Express 2h', 'key' => 'delivery_express'];
}
if ($inStockParam === '1' || $inStockParam === 'in_stock') {
    $activeFilters[] = ['label' => '✓ En stock', 'key' => 'in_stock'];
} elseif ($inStockParam === 'limited') {
    $activeFilters[] = ['label' => '⚠️ Stock limité', 'key' => 'in_stock'];
}
if ($minPrice !== null || $maxPrice !== null) {
    $pLabel = ($minPrice ? formatPrice($minPrice) : '0') . ' - ' . ($maxPrice ? formatPrice($maxPrice) : 'Max');
    $activeFilters[] = ['label' => $pLabel, 'key' => 'price_range', 'keys' => ['min_price', 'max_price']];
}
if ($connectionParam !== '') {
    $activeFilters[] = ['label' => ucfirst($connectionParam), 'key' => 'connection'];
}
if ($compatibilityParam !== '') {
    $activeFilters[] = ['label' => ucfirst($compatibilityParam), 'key' => 'compatibility'];
}
if ($colorParam !== '') {
    $activeFilters[] = ['label' => ucfirst($colorParam), 'key' => 'color'];
}
if ($minRating !== null) {
    $activeFilters[] = ['label' => $minRating . '★ & +', 'key' => 'rating'];
}

$activeFilterCount = count($activeFilters);

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="w-full max-w-[1400px] mx-auto px-3 sm:px-6 py-3 sm:py-5 pb-24 lg:pb-8 flex-1 space-y-3 sm:space-y-4 overflow-x-hidden min-w-0">

    <!-- 1. Fil d'Ariane épuré Desktop & Titre Compact -->
    <div class="space-y-2 w-full min-w-0">
        
        <!-- Desktop Fil d'Ariane (Visible uniquement sur Écran Tablette / PC) -->
        <nav aria-label="Fil d'Ariane" class="hidden md:flex text-xs font-semibold text-[#667085] items-center flex-wrap gap-2 w-full min-w-0">
            <a href="index.php" class="hover:text-[#1677FF] transition-colors flex items-center gap-1 shrink-0">
                <i data-lucide="home" class="w-3.5 h-3.5"></i> Accueil
            </a>
            <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
            <a href="categories.php" class="hover:text-[#1677FF] transition-colors shrink-0">Catégories</a>
            <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
            <a href="shop.php" class="hover:text-[#1677FF] transition-colors shrink-0 <?= empty($categoryParam) && empty($collectionParam) ? 'text-[#182230] font-bold' : '' ?>">Boutique</a>
            <?php if ($activeCategory): ?>
                <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
                <a href="shop.php?category=<?= urlencode($activeCategory['slug']) ?>" class="hover:text-[#1677FF] transition-colors shrink-0 <?= empty($activeSubcategory) ? 'text-[#182230] font-bold' : '' ?>">
                    <?= htmlspecialchars($activeCategory['name']) ?>
                </a>
            <?php endif; ?>
            <?php if ($activeSubcategory): ?>
                <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
                <span class="text-[#182230] font-bold truncate max-w-xs" aria-current="page"><?= htmlspecialchars($activeSubcategory['name']) ?></span>
            <?php elseif ($collectionParam && isset($collectionTitles[$collectionParam])): ?>
                <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
                <span class="text-[#182230] font-bold truncate max-w-xs" aria-current="page"><?= htmlspecialchars($collectionTitles[$collectionParam]) ?></span>
            <?php endif; ?>
        </nav>

        <!-- Titre et Barre d'actions épurée (1 seule ligne compacte) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full min-w-0 pt-0.5">
            <div class="min-w-0">
                <h1 class="text-lg sm:text-2xl font-black text-[#182230] tracking-tight flex items-center gap-1.5">
                    <?php if ($activeSubcategory): ?>
                        <span><?= htmlspecialchars($activeSubcategory['name']) ?></span>
                    <?php elseif ($activeCategory): ?>
                        <span><?= htmlspecialchars($activeCategory['name']) ?></span>
                    <?php elseif ($collectionParam && isset($collectionTitles[$collectionParam])): ?>
                        <span><?= htmlspecialchars($collectionTitles[$collectionParam]) ?></span>
                    <?php elseif ($brandParam): ?>
                        <span>Équipements <?= htmlspecialchars($brandParam) ?></span>
                    <?php elseif ($search): ?>
                        <span>« <?= htmlspecialchars($search) ?> »</span>
                    <?php else: ?>
                        <span>Boutique High-Tech</span>
                    <?php endif; ?>
                    <span class="text-xs font-semibold text-[#64748B] tracking-normal font-normal">(<?= $totalProducts ?>)</span>
                </h1>
            </div>

            <!-- Barre d'outils unifiée : Filtres + Tri + Grille/Liste -->
            <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                
                <!-- Bouton Filtres Mobile (Drawer) -->
                <button type="button" 
                        onclick="openShopFilterDrawer()" 
                        class="lg:hidden flex-1 sm:flex-initial cursor-pointer inline-flex items-center justify-center gap-1.5 bg-white border border-[#E8EDF3] hover:border-[#1677FF] px-3.5 py-2 rounded-xl text-xs font-bold text-[#182230] shadow-2xs transition-colors shrink-0"
                        aria-label="Ouvrir les filtres">
                    <svg class="w-4 h-4 text-[#1677FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    <span>Filtres</span>
                    <?php if ($activeFilterCount > 0): ?>
                        <span class="w-4 h-4 rounded-full bg-[#1677FF] text-white text-[9px] font-black flex items-center justify-center"><?= $activeFilterCount ?></span>
                    <?php endif; ?>
                </button>

                <!-- Sélecteur de Tri Compact -->
                <form method="GET" action="shop.php" class="relative inline-flex items-center flex-1 sm:flex-initial">
                    <?php foreach ($_GET as $k => $v): if ($k !== 'sort' && $k !== 'page'): ?>
                        <input type="hidden" name="<?= htmlspecialchars($k) ?>" value="<?= htmlspecialchars($v) ?>">
                    <?php endif; endforeach; ?>

                    <div class="relative w-full">
                        <select name="sort" onchange="this.form.submit()" aria-label="Trier les résultats" class="w-full bg-white border border-[#E8EDF3] text-xs font-bold text-[#182230] pl-3 pr-7 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1677FF] shadow-2xs appearance-none cursor-pointer">
                            <option value="newest" <?= $sort === 'newest' ? 'selected' : '' ?>>✨ Nouveautés</option>
                            <option value="sales" <?= $sort === 'sales' ? 'selected' : '' ?>>🔥 Populaires</option>
                            <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>>💵 Moins cher</option>
                            <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>>💎 Haut de gamme</option>
                            <option value="promo" <?= $sort === 'promo' ? 'selected' : '' ?>>🏷️ Promos</option>
                        </select>
                        <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[#667085] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"></i>
                    </div>
                </form>

                <!-- Sélecteur Grille / Liste -->
                <div class="flex items-center bg-white border border-[#E8EDF3] rounded-xl p-0.5 shadow-2xs shrink-0">
                    <button type="button" 
                            onclick="setShopView('grid')" 
                            id="view-grid-btn" 
                            class="cursor-pointer p-1.5 sm:p-2 rounded-lg text-[#1677FF] bg-[#EAF3FF] transition-all flex items-center justify-center" 
                            aria-label="Affichage en Grille">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    <button type="button" 
                            onclick="setShopView('list')" 
                            id="view-list-btn" 
                            class="cursor-pointer p-1.5 sm:p-2 rounded-lg text-[#64748B] hover:text-[#182230] transition-all flex items-center justify-center" 
                            aria-label="Affichage en Liste détaillée">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Filtres Rapides par Budget (Affichés uniquement sur catalogue global pour éviter les doublons en catégorie) -->
    <?php if (empty($categoryParam) && empty($collectionParam) && empty($search)): ?>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full min-w-0">
            <a href="shop.php" class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs shrink-0 bg-[#1677FF] text-white">
                Tout le catalogue
            </a>
            <a href="shop.php?collection=flash" class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs shrink-0 bg-white text-[#EF4444] border border-red-200 hover:bg-red-50">
                ⚡ Ventes Flash
            </a>
            <a href="shop.php?collection=express" class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs shrink-0 bg-white text-[#0D7D53] border border-emerald-200 hover:bg-emerald-50">
                🚚 Express 2h
            </a>
        </div>
    <?php endif; ?>

    <!-- 3. Filtres Actifs Réels (Uniquement si des critères supplémentaires comme prix ou marque sont appliqués) -->
    <?php if ($activeFilterCount > 0): ?>
        <div class="flex flex-wrap items-center gap-1.5 p-2 bg-[#F8FBFF] rounded-xl border border-[#D9E8FF] w-full min-w-0">
            <span class="text-[10px] font-black text-[#667085] uppercase tracking-wider mr-1">Filtres :</span>
            
            <?php foreach ($activeFilters as $f): 
                $removeQuery = $_GET;
                unset($removeQuery['page']);
                if (isset($f['keys'])) {
                    foreach ($f['keys'] as $k) unset($removeQuery[$k]);
                } else {
                    unset($removeQuery[$f['key']]);
                    if ($f['key'] === 'q') unset($removeQuery['search']);
                }
                $removeUrl = 'shop.php' . (!empty($removeQuery) ? '?' . http_build_query($removeQuery) : '');
            ?>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white text-[#0B54C2] text-[11px] font-bold border border-blue-200 shadow-2xs">
                    <span><?= htmlspecialchars($f['label']) ?></span>
                    <a href="<?= $removeUrl ?>" class="hover:text-red-600 transition-colors font-black ml-0.5 text-xs" aria-label="Supprimer ce filtre">✕</a>
                </span>
            <?php endforeach; ?>

            <a href="shop.php<?= $categoryParam ? '?category='.urlencode($categoryParam) . ($subcategoryParam ? '&subcategory='.urlencode($subcategoryParam) : '') : '' ?>" class="text-[11px] font-bold text-[#EF4444] hover:underline ml-auto flex items-center gap-1 py-0.5 px-2 rounded-md hover:bg-red-50 transition-colors">
                <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
                <span>Effacer</span>
            </a>
        </div>
    <?php endif; ?>

    <!-- 4. Grille Principale (Desktop: 3 Cols Sidebar / 9 Cols Produits) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start w-full min-w-0 pt-1">
        
        <!-- Sidebar Filtres Desktop -->
        <aside class="hidden lg:block lg:col-span-3 space-y-4 self-start sticky top-20">
            
            <form method="GET" action="shop.php" id="desktop-filters-form" class="space-y-4">
                <?php if ($sort !== 'newest'): ?><input type="hidden" name="sort" value="<?= htmlspecialchars($sort) ?>"><?php endif; ?>

                <!-- 1. Recherche instantanée -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <label for="desktop-search-input" class="block text-xs font-black text-[#182230] uppercase tracking-wider">Recherche</label>
                    <div class="relative">
                        <input type="text" 
                               id="desktop-search-input"
                               name="q" 
                               value="<?= htmlspecialchars($search) ?>" 
                               placeholder="Modèle, marque, type..." 
                               class="w-full bg-[#F4F7FB] border border-[#E8EDF3] text-xs font-semibold text-[#182230] pl-8 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1677FF]">
                        <i data-lucide="search" class="w-4 h-4 text-[#667085] absolute left-2.5 top-1/2 -translate-y-1/2"></i>
                    </div>
                </div>

                <!-- 2. Rayons & Catégories -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2.5">
                    <div class="flex items-center justify-between pb-2 border-b border-[#E8EDF3]">
                        <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="layers" class="w-4 h-4 text-[#1677FF]"></i>
                            <span>Rayons</span>
                        </h3>
                        <?php if ($categoryParam || $subcategoryParam): ?>
                            <a href="shop.php" class="text-[10px] font-bold text-[#EF4444] hover:underline">Tous</a>
                        <?php endif; ?>
                    </div>

                    <div class="space-y-1 text-xs font-semibold max-h-60 overflow-y-auto no-scrollbar pr-1">
                        <a href="shop.php<?= $search ? '?q='.urlencode($search) : '' ?>" class="flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors <?= empty($categoryParam) && empty($collectionParam) ? 'bg-[#EAF3FF] text-[#0B54C2] font-black' : 'text-[#182230] hover:bg-[#F3F7FC]' ?>">
                            <span>Tout le catalogue</span>
                        </a>

                        <?php foreach ($categoriesTree as $pCat): 
                            $isCatActive = ($activeCategory && ($activeCategory['slug'] === $pCat['slug'] || $activeCategory['name'] === $pCat['name']));
                        ?>
                            <div class="pt-0.5">
                                <a href="shop.php?category=<?= urlencode($pCat['slug']) ?><?= $search ? '&q='.urlencode($search) : '' ?>" class="flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors <?= $isCatActive && empty($activeSubcategory) ? 'bg-[#EAF3FF] text-[#0B54C2] font-black' : 'text-[#182230] hover:bg-[#F3F7FC]' ?>">
                                    <span><?= htmlspecialchars($pCat['name']) ?></span>
                                    <?php if (!empty($pCat['subcategories'])): ?>
                                        <i data-lucide="<?= $isCatActive ? 'chevron-down' : 'chevron-right' ?>" class="w-3.5 h-3.5 text-[#98A2B3]"></i>
                                    <?php endif; ?>
                                </a>

                                <?php if (!empty($pCat['subcategories']) && $isCatActive): ?>
                                    <div class="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-[#1677FF]/20 ml-3 my-0.5">
                                        <?php foreach ($pCat['subcategories'] as $sCat): 
                                            $isSubActive = ($activeSubcategory && ($activeSubcategory['slug'] === $sCat['slug'] || $activeSubcategory['name'] === $sCat['name']));
                                        ?>
                                            <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>&subcategory=<?= urlencode($sCat['slug']) ?><?= $search ? '&q='.urlencode($search) : '' ?>" class="flex items-center justify-between px-2 py-1 rounded-lg text-[11px] transition-colors <?= $isSubActive ? 'bg-[#1677FF] text-white font-black' : 'text-[#667085] hover:text-[#182230] hover:bg-[#F3F7FC]' ?>">
                                                <span><?= htmlspecialchars($sCat['name']) ?></span>
                                            </a>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- 3. Disponibilité & Offres -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2.5">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E8EDF3]">
                        <i data-lucide="check-circle" class="w-4 h-4 text-[#0D7D53]"></i>
                        <span>Disponibilité & Offres</span>
                    </h3>
                    <div class="space-y-2 text-xs font-bold text-[#182230]">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="in_stock" value="1" <?= ($inStockParam === '1' || $inStockParam === 'in_stock') ? 'checked' : '' ?> class="accent-[#1677FF] w-4 h-4 rounded">
                            <span>En stock uniquement</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="promo" value="1" <?= $promoParam ? 'checked' : '' ?> class="accent-[#EF4444] w-4 h-4 rounded">
                            <span class="text-[#EF4444]">🔥 Ventes Flash & Promos</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="is_new" value="1" <?= $isNewParam ? 'checked' : '' ?> class="accent-[#1677FF] w-4 h-4 rounded">
                            <span>✨ Nouveautés</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="delivery_express" value="1" <?= $expressParam ? 'checked' : '' ?> class="accent-[#0D7D53] w-4 h-4 rounded">
                            <span class="text-[#0D7D53]">🚚 Express Dakar 2h-24h</span>
                        </label>
                    </div>
                </div>

                <!-- 4. Marques Populaires -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2.5">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E8EDF3]">
                        <i data-lucide="tag" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Marques</span>
                    </h3>
                    <div class="flex flex-wrap gap-1.5">
                        <?php foreach ($availableBrands as $b): 
                            $isBActive = (strcasecmp($brandParam, $b) === 0);
                            $bQuery = $_GET;
                            unset($bQuery['page']);
                            $bQuery['brand'] = $isBActive ? null : $b;
                            $bUrl = 'shop.php' . (!empty($bQuery) ? '?' . http_build_query($bQuery) : '');
                        ?>
                            <a href="<?= $bUrl ?>" class="cursor-pointer text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all <?= $isBActive ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-[#F4F7FB] text-[#182230] hover:bg-[#EAF3FF] hover:text-[#0B54C2] border border-[#E8EDF3]' ?>">
                                <?= htmlspecialchars($b) ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- 5. Fourchette de Prix (FCFA) -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-3">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E8EDF3]">
                        <i data-lucide="banknote" class="w-4 h-4 text-[#0D7D53]"></i>
                        <span>Budget (FCFA)</span>
                    </h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label for="desktop-min-price" class="block text-[10px] font-bold text-[#667085] mb-1">Min</label>
                            <input type="number" id="desktop-min-price" name="min_price" value="<?= $minPrice !== null ? htmlspecialchars($minPrice) : '' ?>" placeholder="0" min="0" step="500" class="w-full bg-[#F4F7FB] border border-[#E8EDF3] text-xs font-bold p-2 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF]">
                        </div>
                        <div>
                            <label for="desktop-max-price" class="block text-[10px] font-bold text-[#667085] mb-1">Max</label>
                            <input type="number" id="desktop-max-price" name="max_price" value="<?= $maxPrice !== null ? htmlspecialchars($maxPrice) : '' ?>" placeholder="80000" min="0" step="500" class="w-full bg-[#F4F7FB] border border-[#E8EDF3] text-xs font-bold p-2 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF]">
                        </div>
                    </div>
                </div>

                <!-- 6. Type de Connexion -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2.5">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E8EDF3]">
                        <i data-lucide="radio" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Connectivité</span>
                    </h3>
                    <div class="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                        <?php 
                        $connections = ['bluetooth' => 'Bluetooth', 'usb-c' => 'USB-C', 'jack' => 'Jack 3.5mm', 'wifi' => 'Wi-Fi'];
                        foreach ($connections as $cKey => $cLabel):
                            $isCActive = ($connectionParam === $cKey);
                            $cQuery = $_GET;
                            unset($cQuery['page']);
                            $cQuery['connection'] = $isCActive ? null : $cKey;
                            $cUrl = 'shop.php' . (!empty($cQuery) ? '?' . http_build_query($cQuery) : '');
                        ?>
                            <a href="<?= $cUrl ?>" class="p-2 rounded-xl text-center border transition-all <?= $isCActive ? 'bg-[#1677FF] text-white border-[#1677FF]' : 'bg-[#F4F7FB] text-[#182230] border-[#E8EDF3] hover:bg-[#EAF3FF]' ?>">
                                <?= $cLabel ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- 7. Compatibilité -->
                <div class="bg-white p-4 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2.5">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E8EDF3]">
                        <i data-lucide="smartphone" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Compatibilité</span>
                    </h3>
                    <div class="flex flex-wrap gap-1.5 text-[11px] font-bold">
                        <?php 
                        $compatibilities = ['iphone' => 'iPhone', 'android' => 'Android', 'pc' => 'PC / Mac', 'ps5' => 'PS5', 'xbox' => 'Xbox'];
                        foreach ($compatibilities as $compKey => $compLabel):
                            $isCompActive = ($compatibilityParam === $compKey);
                            $compQuery = $_GET;
                            unset($compQuery['page']);
                            $compQuery['compatibility'] = $isCompActive ? null : $compKey;
                            $compUrl = 'shop.php' . (!empty($compQuery) ? '?' . http_build_query($compQuery) : '');
                        ?>
                            <a href="<?= $compUrl ?>" class="px-2.5 py-1 rounded-xl border transition-all <?= $isCompActive ? 'bg-[#1677FF] text-white border-[#1677FF]' : 'bg-[#F4F7FB] text-[#182230] border-[#E8EDF3] hover:bg-[#EAF3FF]' ?>">
                                <?= $compLabel ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Bouton Appliquer & Réinitialiser -->
                <div class="space-y-2 pt-1">
                    <button type="submit" class="cursor-pointer w-full bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-black py-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2">
                        <i data-lucide="filter" class="w-4 h-4"></i>
                        <span>Appliquer les filtres</span>
                    </button>
                    <?php if ($activeFilterCount > 0): ?>
                        <a href="shop.php" class="block text-center text-xs font-bold text-[#EF4444] hover:underline py-1">
                            Réinitialiser tous les filtres
                        </a>
                    <?php endif; ?>
                </div>

            </form>
        </aside>

        <!-- Grille / Liste Produits Responsive & Pagination (9 Cols) -->
        <div class="lg:col-span-9 space-y-6">
            
            <?php if (!empty($products)): ?>
                <!-- Conteneur Hybride (Grille 2 cols mobile, 3 cols tablette/desktop, 4 cols grand écran) -->
                <div id="products-view-container" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <?php foreach ($products as $pIdx => $p): 
                        $pImgs = getProductImages($p['images'] ?? null, 'assets/images/product_img1.webp');
                        $pMainImg = $pImgs[0] ?? 'assets/images/product_img1.webp';
                        $pDiscount = calculateDiscount((float)$p['price'], (float)$p['mrp']);
                        $pRating = isset($p['rating']) ? (float)$p['rating'] : 4.9;
                    ?>
                        <!-- Carte Produit (Identique à Accueil index.php) -->
                        <a href="product.php?id=<?= urlencode($p['id']) ?>" class="shop-product-item prod-card" aria-label="<?= htmlspecialchars($p['name']) ?> - <?= formatPrice($p['price']) ?>">
                            
                            <!-- Top row: Badge Reduction / Stock & Rating -->
                            <div class="prod-card-top">
                                <div class="flex items-center gap-1">
                                    <?php if ($pDiscount > 0): ?>
                                        <span class="prod-badge-discount">-<?= $pDiscount ?>%</span>
                                    <?php elseif (!empty($p['is_new'])): ?>
                                        <span class="prod-badge-new">Nouveau</span>
                                    <?php else: ?>
                                        <span class="prod-badge-stock">En stock</span>
                                    <?php endif; ?>
                                </div>

                                <div class="prod-rating">
                                    <span>★</span>
                                    <span style="color:#64748B;font-size:10px;"><?= number_format($pRating, 1) ?></span>
                                </div>
                            </div>

                            <!-- Product Image (Fondue sans cadre) -->
                            <div class="prod-card-img-wrap">
                                <img src="<?= htmlspecialchars($pMainImg) ?>" alt="<?= htmlspecialchars($p['name']) ?> - SenTechPLUS" width="180" height="180" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;" <?= $pIdx < 2 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"' ?>>
                            </div>

                            <!-- Product Details -->
                            <div class="prod-card-body">
                                <div>
                                    <span class="prod-cat-text">
                                        <?= htmlspecialchars($p['subcategory'] ?? $p['category']) ?>
                                    </span>
                                    <h3 class="prod-name-text">
                                        <?= htmlspecialchars($p['name']) ?>
                                    </h3>
                                    
                                    <!-- Description masquée par défaut (uniquement mode liste) -->
                                    <p class="shop-list-desc hidden text-xs text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                                        <?= htmlspecialchars($p['description'] ?? 'Équipement certifié 100% original avec garantie.') ?>
                                    </p>
                                </div>

                                <!-- Price Section -->
                                <div class="prod-price-row">
                                    <span class="prod-price-val">
                                        <?= formatPrice($p['price']) ?>
                                    </span>
                                    <?php if ($p['mrp'] > $p['price']): ?>
                                        <span class="prod-price-old">
                                            <?= formatPrice($p['mrp']) ?>
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </div>

                        </a>
                    <?php endforeach; ?>
                </div>

                <!-- Pagination Pilules Préservant l'Intégralité des Filtres GET -->
                <?php if ($totalPages > 1): ?>
                    <nav aria-label="Pagination boutique" class="flex items-center justify-center gap-1.5 pt-6 pb-2">
                        <?php if ($page > 1): ?>
                            <a href="shop.php?<?= http_build_query(array_merge($_GET, ['page' => $page - 1])) ?>" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E8EDF3] text-xs font-black text-[#182230] hover:bg-[#F3F7FC] transition-colors shadow-2xs" aria-label="Page précédente">
                                ‹
                            </a>
                        <?php endif; ?>

                        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                            <a href="shop.php?<?= http_build_query(array_merge($_GET, ['page' => $i])) ?>" class="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all <?= $i === $page ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white border border-[#E8EDF3] text-[#182230] hover:bg-[#F3F7FC]' ?>" aria-current="<?= $i === $page ? 'page' : 'false' ?>">
                                <?= $i ?>
                            </a>
                        <?php endfor; ?>

                        <?php if ($page < $totalPages): ?>
                            <a href="shop.php?<?= http_build_query(array_merge($_GET, ['page' => $page + 1])) ?>" class="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-[#E8EDF3] text-xs font-black text-[#182230] hover:bg-[#F3F7FC] transition-colors shadow-2xs" aria-label="Page suivante">
                                ›
                            </a>
                        <?php endif; ?>
                    </nav>
                <?php endif; ?>

            <?php else: ?>
                <!-- Empty State Moderne & Rassurant -->
                <div class="bg-white rounded-3xl border border-[#E8EDF3] p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
                    <div class="w-16 h-16 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mx-auto">
                        <i data-lucide="package-search" class="w-8 h-8"></i>
                    </div>
                    <div class="space-y-1">
                        <h2 class="text-base sm:text-lg font-black text-[#182230]">Aucun équipement correspondant</h2>
                        <p class="text-xs text-[#667085] leading-relaxed">
                            Nous n'avons trouvé aucun produit correspondant à vos filtres sélectionnés.
                        </p>
                    </div>
                    <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a href="shop.php" class="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all">
                            <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                            <span>Réinitialiser les filtres</span>
                        </a>
                        <a href="index.php" class="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F4F7FB] hover:bg-[#EAF3FF] text-[#182230] text-xs font-bold px-5 py-2.5 rounded-xl border border-[#E8EDF3] transition-all">
                            <span>Accueil</span>
                        </a>
                    </div>

                    <!-- Suggestions Populaires -->
                    <div class="pt-4 border-t border-[#E8EDF3] text-left">
                        <p class="text-[11px] font-bold text-[#667085] mb-2">Rayons populaires :</p>
                        <div class="flex flex-wrap gap-1.5">
                            <a href="shop.php?category=audio-ecouteurs" class="text-[11px] font-bold bg-[#F4F7FB] px-2.5 py-1 rounded-lg text-[#182230] hover:bg-[#EAF3FF] hover:text-[#0B54C2]">Écouteurs & Audio</a>
                            <a href="shop.php?category=montres-objets-connectes" class="text-[11px] font-bold bg-[#F4F7FB] px-2.5 py-1 rounded-lg text-[#182230] hover:bg-[#EAF3FF] hover:text-[#0B54C2]">Montres Connectées</a>
                            <a href="shop.php?category=telephones-accessoires" class="text-[11px] font-bold bg-[#F4F7FB] px-2.5 py-1 rounded-lg text-[#182230] hover:bg-[#EAF3FF] hover:text-[#0B54C2]">Chargeurs GaN</a>
                            <a href="shop.php?collection=flash" class="text-[11px] font-bold bg-red-50 text-[#EF4444] px-2.5 py-1 rounded-lg">⚡ Ventes Flash</a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

        </div>

    </div>

</main>

<!-- 5. Drawer Tactile Mobile Plein Écran (Bottom Sheet / Slide-up) -->
<div id="shop-mobile-filter-drawer" 
     class="fixed inset-0 z-[100000] bg-slate-900/60 backdrop-blur-sm hidden flex-col justify-end transition-opacity duration-300" 
     onclick="if (event.target === this) closeShopFilterDrawer()"
     role="dialog" 
     aria-modal="true" 
     aria-label="Filtres boutique">
    
    <div class="bg-white rounded-t-3xl max-h-[85vh] w-full overflow-hidden flex flex-col shadow-2xl animate-fade-in pb-safe">
        
        <!-- Drawer Header -->
        <div class="px-4 py-3.5 border-b border-[#E8EDF3] flex items-center justify-between bg-white shrink-0">
            <div class="flex items-center gap-2">
                <i data-lucide="sliders-horizontal" class="w-4 h-4 text-[#1677FF]"></i>
                <h3 class="text-sm font-black text-[#182230]">Filtres</h3>
                <?php if ($activeFilterCount > 0): ?>
                    <span class="bg-[#EAF3FF] text-[#1677FF] text-[11px] font-black px-2 py-0.5 rounded-full"><?= $activeFilterCount ?> actif(s)</span>
                <?php endif; ?>
            </div>
            <button type="button" onclick="closeShopFilterDrawer()" class="cursor-pointer p-1.5 text-[#667085] hover:text-[#182230] rounded-xl hover:bg-[#F3F7FC]" aria-label="Fermer les filtres">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <!-- Drawer Scrollable Content -->
        <form method="GET" action="shop.php" class="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
            <?php if ($sort !== 'newest'): ?><input type="hidden" name="sort" value="<?= htmlspecialchars($sort) ?>"><?php endif; ?>

            <!-- Rayons / Catégories (Chips compacts) -->
            <div class="space-y-1.5">
                <span class="block text-[11px] font-black text-[#64748B] uppercase tracking-wider">Rayon :</span>
                <div class="flex flex-wrap gap-1.5">
                    <a href="shop.php" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors <?= empty($categoryParam) ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-[#F4F7FB] text-[#182230] border border-[#E8EDF3]' ?>">
                        Tous les rayons
                    </a>
                    <?php foreach ($categoriesTree as $pCat): 
                        $isCatActive = ($activeCategory && ($activeCategory['slug'] === $pCat['slug'] || $activeCategory['name'] === $pCat['name']));
                    ?>
                        <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>" class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors <?= $isCatActive ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-[#F4F7FB] text-[#182230] border border-[#E8EDF3]' ?>">
                            <?= htmlspecialchars($pCat['name']) ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Disponibilité & Offres Rapides -->
            <div class="space-y-1.5">
                <span class="block text-[11px] font-black text-[#64748B] uppercase tracking-wider">Disponibilité & Offres :</span>
                <div class="grid grid-cols-2 gap-1.5 font-bold text-xs">
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7FB] border border-[#E8EDF3] cursor-pointer active:scale-95 transition-transform">
                        <input type="checkbox" name="in_stock" value="1" <?= ($inStockParam === '1' || $inStockParam === 'in_stock') ? 'checked' : '' ?> class="accent-[#1677FF] w-4 h-4 rounded">
                        <span>✓ En stock</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7FB] border border-[#E8EDF3] cursor-pointer active:scale-95 transition-transform">
                        <input type="checkbox" name="promo" value="1" <?= $promoParam ? 'checked' : '' ?> class="accent-[#EF4444] w-4 h-4 rounded">
                        <span class="text-[#EF4444]">🔥 Promos</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7FB] border border-[#E8EDF3] cursor-pointer active:scale-95 transition-transform">
                        <input type="checkbox" name="is_new" value="1" <?= $isNewParam ? 'checked' : '' ?> class="accent-[#1677FF] w-4 h-4 rounded">
                        <span>✨ Nouveautés</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 rounded-xl bg-[#F4F7FB] border border-[#E8EDF3] cursor-pointer active:scale-95 transition-transform">
                        <input type="checkbox" name="delivery_express" value="1" <?= $expressParam ? 'checked' : '' ?> class="accent-[#0D7D53] w-4 h-4 rounded">
                        <span class="text-[#0D7D53]">🚚 Express 2h</span>
                    </label>
                </div>
            </div>

            <!-- Fourchette Prix -->
            <div class="space-y-1.5">
                <span class="block text-[11px] font-black text-[#64748B] uppercase tracking-wider">Budget FCFA :</span>
                <div class="grid grid-cols-2 gap-2">
                    <input type="number" name="min_price" value="<?= $minPrice !== null ? htmlspecialchars($minPrice) : '' ?>" placeholder="Min FCFA" aria-label="Prix minimum en FCFA" class="w-full bg-[#F4F7FB] border border-[#E8EDF3] p-2.5 rounded-xl font-bold text-xs outline-none focus:border-[#1677FF]">
                    <input type="number" name="max_price" value="<?= $maxPrice !== null ? htmlspecialchars($maxPrice) : '' ?>" placeholder="Max FCFA" aria-label="Prix maximum en FCFA" class="w-full bg-[#F4F7FB] border border-[#E8EDF3] p-2.5 rounded-xl font-bold text-xs outline-none focus:border-[#1677FF]">
                </div>
            </div>

            <!-- Marques Populaires -->
            <div class="space-y-1.5">
                <span class="block text-[11px] font-black text-[#64748B] uppercase tracking-wider">Marques :</span>
                <div class="flex flex-wrap gap-1.5">
                    <?php foreach ($availableBrands as $b): 
                        $isBActive = (strcasecmp($brandParam, $b) === 0);
                    ?>
                        <a href="shop.php?brand=<?= urlencode($b) ?>" class="px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors <?= $isBActive ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-[#F4F7FB] text-[#182230] border border-[#E8EDF3]' ?>">
                            <?= htmlspecialchars($b) ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Connectivité -->
            <div class="space-y-1.5">
                <span class="block text-[11px] font-black text-[#64748B] uppercase tracking-wider">Connectivité :</span>
                <div class="flex flex-wrap gap-1.5">
                    <?php foreach (['bluetooth' => 'Bluetooth', 'usb-c' => 'USB-C', 'jack' => 'Jack 3.5mm', 'wifi' => 'Wi-Fi'] as $ck => $cl): 
                        $isCActive = ($connectionParam === $ck);
                    ?>
                        <a href="shop.php?connection=<?= urlencode($ck) ?>" class="px-2.5 py-1.5 rounded-lg text-center font-bold text-xs transition-colors <?= $isCActive ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-[#F4F7FB] text-[#182230] border border-[#E8EDF3]' ?>">
                            <?= $cl ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Actions Fixes en Bas du Drawer -->
            <div class="pt-3 border-t border-[#E8EDF3] flex items-center gap-2 sticky bottom-0 bg-white shadow-lg">
                <a href="shop.php" class="cursor-pointer text-center py-3 px-4 rounded-xl bg-[#F4F7FB] text-[#EF4444] font-bold text-xs border border-[#E8EDF3] hover:bg-red-50 transition-colors">
                    Effacer
                </a>
                <button type="submit" class="cursor-pointer flex-1 py-3 rounded-xl bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs shadow-2xs transition-all active:scale-98">
                    Voir les résultats (<?= $totalProducts ?>)
                </button>
            </div>
        </form>

    </div>
</div>

<script>
function openShopFilterDrawer() {
    const drawer = document.getElementById('shop-mobile-filter-drawer');
    if (!drawer) return;
    drawer.classList.remove('hidden');
    drawer.classList.add('flex');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleShopDrawerKeydown);
    if (window.lucide) lucide.createIcons();
}

function closeShopFilterDrawer() {
    const drawer = document.getElementById('shop-mobile-filter-drawer');
    if (!drawer) return;
    drawer.classList.add('hidden');
    drawer.classList.remove('flex');
    document.body.style.overflow = '';
    window.removeEventListener('keydown', handleShopDrawerKeydown);
}

function setShopView(mode) {
    const container = document.getElementById('products-view-container');
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    if (!container) return;

    if (mode === 'list') {
        container.className = 'grid grid-cols-1 gap-3';
        container.style.gridTemplateColumns = '1fr';
        document.querySelectorAll('.shop-product-item').forEach(el => {
            el.classList.add('prod-card-list-mode');
        });
        document.querySelectorAll('.shop-list-desc').forEach(el => el.classList.remove('hidden'));

        if (gridBtn && listBtn) {
            gridBtn.className = 'cursor-pointer p-2 rounded-lg text-[#64748B] hover:text-[#182230] transition-all flex items-center justify-center';
            listBtn.className = 'cursor-pointer p-2 rounded-lg text-[#1677FF] bg-[#EAF3FF] transition-all flex items-center justify-center';
        }
    } else {
        container.className = 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4';
        container.style.gridTemplateColumns = '';
        document.querySelectorAll('.shop-product-item').forEach(el => {
            el.classList.remove('prod-card-list-mode');
        });
        document.querySelectorAll('.shop-list-desc').forEach(el => el.classList.add('hidden'));

        if (gridBtn && listBtn) {
            gridBtn.className = 'cursor-pointer p-2 rounded-lg text-[#1677FF] bg-[#EAF3FF] transition-all flex items-center justify-center';
            listBtn.className = 'cursor-pointer p-2 rounded-lg text-[#64748B] hover:text-[#182230] transition-all flex items-center justify-center';
        }
    }
}
</script>

<style>
/* Grille 2 colonnes stricte sur smartphone (< 640px) identique à index.php */
#products-view-container {
    width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
}
#products-view-container:not(.grid-cols-1) {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px !important;
}
@media (min-width: 640px) {
    #products-view-container:not(.grid-cols-1) {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 14px !important;
    }
}
@media (min-width: 768px) {
    #products-view-container:not(.grid-cols-1) {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 16px !important;
    }
}
@media (min-width: 1280px) {
    #products-view-container:not(.grid-cols-1) {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 16px !important;
    }
}

.prod-card-list-mode {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    padding: 12px 14px !important;
    gap: 14px !important;
    min-height: auto !important;
    width: 100% !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
}
.prod-card-list-mode .prod-card-top {
    display: none !important;
}
.prod-card-list-mode .prod-card-img-wrap {
    width: 86px !important;
    height: 86px !important;
    min-width: 86px !important;
    max-width: 86px !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    order: 1 !important;
}
.prod-card-list-mode .prod-card-body {
    flex: 1 1 0% !important;
    min-width: 0 !important;
    width: auto !important;
    order: 2 !important;
    overflow: hidden !important;
}
.prod-card-list-mode .prod-name-text {
    height: auto !important;
    max-height: 40px !important;
    margin-bottom: 2px !important;
    font-size: 13px !important;
}
.prod-card-list-mode .prod-price-row {
    border-top: none !important;
    padding-top: 2px !important;
    margin-top: 4px !important;
}
</style>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
