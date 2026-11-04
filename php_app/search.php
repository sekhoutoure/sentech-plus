<?php
require_once __DIR__ . '/config/config.php';

// Nettoyage et validation du terme de recherche
$rawQ = $_GET['q'] ?? $_GET['search'] ?? '';
$q = trim(sanitize($rawQ));
if (mb_strlen($q, 'UTF-8') > 100) {
    $q = mb_substr($q, 0, 100, 'UTF-8');
}

// Enregistrement des recherches récentes en session
if (!empty($q)) {
    if (!isset($_SESSION['recent_searches']) || !is_array($_SESSION['recent_searches'])) {
        $_SESSION['recent_searches'] = [];
    }
    if (!in_array($q, $_SESSION['recent_searches'], true)) {
        array_unshift($_SESSION['recent_searches'], $q);
        $_SESSION['recent_searches'] = array_slice($_SESSION['recent_searches'], 0, 6);
    }
}

// Filtres supplémentaires
$categoryParam = sanitize($_GET['category'] ?? '');
$subcategoryParam = sanitize($_GET['subcategory'] ?? '');
$brandParam = sanitize($_GET['brand'] ?? '');
$sort = sanitize($_GET['sort'] ?? 'relevance');
$minPrice = isset($_GET['min_price']) && is_numeric($_GET['min_price']) ? (float)$_GET['min_price'] : null;
$maxPrice = isset($_GET['max_price']) && is_numeric($_GET['max_price']) ? (float)$_GET['max_price'] : null;
$onlyInStock = isset($_GET['in_stock']) && $_GET['in_stock'] === '1';
$onlyPromo = isset($_GET['promo']) && $_GET['promo'] === '1';
$onlyExpress = isset($_GET['express']) && $_GET['express'] === '1';

$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$limit = 12;
$offset = ($page - 1) * $limit;

// Arborescence catégories
$categoriesTree = getAllCategoriesTree();
$activeCategory = $categoryParam ? getCategoryBySlug($categoryParam) : null;
$activeSubcategory = $subcategoryParam ? getCategoryBySlug($subcategoryParam) : null;

// SEO Title
$pageTitle = !empty($q) ? "Recherche : \"$q\"" : "Recherche de Produits High-Tech";
$pageTitle .= " | SenTechPLUS Dakar";

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$pdo = getDBConnection();

$totalProducts = 0;
$products = [];

// Construction dynamique de la requête SQL avec requêtes préparées
$whereClauses = ["is_active = 1"];
$params = [];

if ($onlyInStock) {
    $whereClauses[] = "in_stock = 1 AND stock > 0";
}

if ($onlyPromo) {
    $whereClauses[] = "mrp > price";
}

if ($onlyExpress) {
    $whereClauses[] = "is_express_delivery = 1";
}

if (!empty($q)) {
    // Multi-criteria case-insensitive matching across name, brand, category, subcategory, and description
    $words = preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY);
    $searchClauses = [];
    foreach ($words as $idx => $word) {
        $pKey = ":w_" . $idx;
        $searchClauses[] = "(name LIKE $pKey OR brand LIKE $pKey OR category LIKE $pKey OR subcategory LIKE $pKey OR description LIKE $pKey)";
        $params[$pKey] = '%' . $word . '%';
    }
    if (!empty($searchClauses)) {
        $whereClauses[] = "(" . implode(" AND ", $searchClauses) . ")";
    }
}

if ($activeCategory) {
    $whereClauses[] = "(category = :cat_name OR category_id = :cat_id OR category LIKE :cat_slug)";
    $params[':cat_name'] = $activeCategory['name'];
    $params[':cat_id'] = $activeCategory['id'];
    $params[':cat_slug'] = '%' . $activeCategory['slug'] . '%';
}

if ($activeSubcategory) {
    $whereClauses[] = "(subcategory = :subcat_name OR subcategory_id = :subcat_id OR subcategory LIKE :subcat_slug)";
    $params[':subcat_name'] = $activeSubcategory['name'];
    $params[':subcat_id'] = $activeSubcategory['id'];
    $params[':subcat_slug'] = '%' . $activeSubcategory['slug'] . '%';
}

if (!empty($brandParam)) {
    $whereClauses[] = "brand = :brand";
    $params[':brand'] = $brandParam;
}

if ($minPrice !== null) {
    $whereClauses[] = "price >= :min_price";
    $params[':min_price'] = $minPrice;
}

if ($maxPrice !== null) {
    $whereClauses[] = "price <= :max_price";
    $params[':max_price'] = $maxPrice;
}

$whereSql = implode(" AND ", $whereClauses);

// Tri
$orderBy = "created_at DESC";
if ($sort === 'price_asc') {
    $orderBy = "price ASC";
} elseif ($sort === 'price_desc') {
    $orderBy = "price DESC";
} elseif ($sort === 'newest') {
    $orderBy = "created_at DESC";
} elseif ($sort === 'sales' || $sort === 'discount') {
    $orderBy = "(mrp - price) DESC, sales_count DESC";
} elseif ($sort === 'relevance' && !empty($q)) {
    // Exact name match first, then recent
    $orderBy = "CASE WHEN name LIKE :q_exact THEN 1 WHEN brand LIKE :q_exact THEN 2 ELSE 3 END, created_at DESC";
    $params[':q_exact'] = '%' . $q . '%';
}

try {
    if (!$pdo) throw new Exception("DB offline");
    // Count query
    $countSql = "SELECT COUNT(*) FROM products WHERE {$whereSql}";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalProducts = (int)$countStmt->fetchColumn();
    $totalPages = max(1, ceil($totalProducts / $limit));

    // Data query
    $sql = "SELECT * FROM products WHERE {$whereSql} ORDER BY {$orderBy} LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
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

// ─── Tolérance aux fautes de frappe (Fuzzy Search Fallback) ─────────────────
$isFuzzyMatch = false;
if ($totalProducts === 0 && !empty($q) && $pdo) {
    try {
        if (!function_exists('normalizeSearchWord')) {
            function normalizeSearchWord($str) {
                $str = mb_strtolower(trim($str), 'UTF-8');
                $unwanted = [
                    'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C',
                    'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
                    'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a',
                    'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i',
                    'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u',
                    'û'=>'u', 'ü'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y', '°'=>'', '+'=>' ', '-'=>' ', '/'=>' ', '''=>' ', '"'=>' '
                ];
                $str = strtr($str, $unwanted);
                return preg_replace('/[^a-z0-9 ]/', '', $str);
            }
        }
        $stmtAll = $pdo->query("SELECT * FROM products WHERE is_active = 1 LIMIT 150");
        $allProds = $stmtAll->fetchAll();
        $cleanQ = normalizeSearchWord($q);
        $qWords = preg_split('/\s+/', $cleanQ, -1, PREG_SPLIT_NO_EMPTY);
        $fuzzyMap = [];

        foreach ($allProds as $p) {
            $score = 0;
            $haystack = normalizeSearchWord($p['name'] . ' ' . ($p['brand'] ?? '') . ' ' . ($p['category'] ?? ''));
            $haystackWords = preg_split('/\s+/', $haystack, -1, PREG_SPLIT_NO_EMPTY);

            foreach ($qWords as $qw) {
                $qwLen = strlen($qw);
                if ($qwLen < 1) continue;

                foreach ($haystackWords as $hw) {
                    $hwLen = strlen($hw);
                    if ($qwLen >= 2 && str_starts_with($hw, $qw)) { $score += 85; break; }
                    if ($hwLen >= 3 && str_starts_with($qw, $hw)) { $score += 80; break; }
                    if ($qwLen >= 3) {
                        $lev = levenshtein($qw, $hw);
                        $maxAllowedLev = ($qwLen <= 4) ? 1 : (($qwLen <= 7) ? 2 : 3);
                        if ($lev <= $maxAllowedLev) { $score += (75 - $lev * 15); break; }
                        if (metaphone($qw) === metaphone($hw) || soundex($qw) === soundex($hw)) { $score += 65; break; }
                    }
                    if ($qwLen >= 4 && $hwLen >= 4) {
                        similar_text($qw, $hw, $pct);
                        if ($pct >= 70) { $score += (int)($pct * 0.7); break; }
                    }
                }
            }

            if ($score >= 40) {
                $fuzzyMap[$p['id']] = ['p' => $p, 'score' => $score];
            }
        }

        if (!empty($fuzzyMap)) {
            uasort($fuzzyMap, fn($a, $b) => $b['score'] <=> $a['score']);
            $products = array_column(array_slice($fuzzyMap, 0, $limit), 'p');
            $totalProducts = count($products);
            $totalPages = 1;
            $isFuzzyMatch = true;
        }
    } catch (Throwable $e) {}
}

// Popular Searches list
$popularSearches = ['Casque Pro', 'Écouteurs Bass', 'Montre AMOLED', 'Chargeur GaN', 'JBL', 'Souris Sans Fil', 'Caméra Wi-Fi'];
$availableBrands = ['Sony', 'Apple', 'Samsung', 'JBL', 'Anker', 'Baseus', 'Logitech', 'Razer', 'Xiaomi', 'Ezviz'];
?>

<main id="main-content" class="max-w-[1400px] mx-auto px-3 sm:px-6 py-6 pb-24 lg:pb-8 flex-1">

    <!-- Breadcrumb -->
    <nav class="flex text-[11px] font-bold text-[#667085] mb-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
            <li class="inline-flex items-center">
                <a href="index.php" class="hover:text-[#1677FF] transition-colors flex items-center gap-1">
                    <i data-lucide="home" class="w-3.5 h-3.5"></i> Accueil
                </a>
            </li>
            <li>
                <div class="flex items-center">
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-1 text-[#98A2B3]"></i>
                    <a href="shop.php" class="hover:text-[#1677FF] transition-colors">Boutique</a>
                </div>
            </li>
            <li aria-current="page">
                <div class="flex items-center">
                    <i data-lucide="chevron-right" class="w-3 h-3 mx-1 text-[#98A2B3]"></i>
                    <span class="text-[#1677FF] font-extrabold">Recherche <?= !empty($q) ? '« ' . htmlspecialchars($q) . ' »' : '' ?></span>
                </div>
            </li>
        </ol>
    </nav>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8EDF3]">
        <div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight flex items-center gap-2">
                <?php if (!empty($q)): ?>
                    <span>Résultats pour <span class="text-[#1677FF]">"<?= htmlspecialchars($q) ?>"</span></span>
                <?php else: ?>
                    <span>Tous les Résultats</span>
                <?php endif; ?>
            </h1>
            <p class="text-xs text-[#667085] mt-1">
                <strong><?= $totalProducts ?></strong> équipement(s) trouvé(s) correspondant à votre recherche
            </p>
        </div>

        <!-- Formulaire de Tri & Filtres -->
        <form method="GET" action="search.php" class="flex flex-wrap items-center gap-3">
            <?php if ($q): ?><input type="hidden" name="q" value="<?= htmlspecialchars($q) ?>"><?php endif; ?>
            <?php if ($categoryParam): ?><input type="hidden" name="category" value="<?= htmlspecialchars($categoryParam) ?>"><?php endif; ?>
            <?php if ($subcategoryParam): ?><input type="hidden" name="subcategory" value="<?= htmlspecialchars($subcategoryParam) ?>"><?php endif; ?>
            <?php if ($brandParam): ?><input type="hidden" name="brand" value="<?= htmlspecialchars($brandParam) ?>"><?php endif; ?>
            <?php if ($minPrice !== null): ?><input type="hidden" name="min_price" value="<?= $minPrice ?>"><?php endif; ?>
            <?php if ($maxPrice !== null): ?><input type="hidden" name="max_price" value="<?= $maxPrice ?>"><?php endif; ?>
            <?php if ($onlyInStock): ?><input type="hidden" name="in_stock" value="1"><?php endif; ?>
            <?php if ($onlyPromo): ?><input type="hidden" name="promo" value="1"><?php endif; ?>
            <?php if ($onlyExpress): ?><input type="hidden" name="express" value="1"><?php endif; ?>

            <div class="flex items-center gap-2">
                <label for="sort-select" class="text-xs font-bold text-[#182230] hidden sm:block">Trier par :</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="arrow-up-down" class="w-3.5 h-3.5 text-[#667085]"></i>
                    </div>
                    <select id="sort-select" name="sort" onchange="this.form.submit()" class="pl-8 bg-white border border-[#E8EDF3] text-xs font-semibold text-[#182230] pr-8 py-2 rounded-xl focus:outline-none focus:border-[#1677FF] appearance-none cursor-pointer shadow-2xs">
                        <option value="relevance" <?= $sort === 'relevance' ? 'selected' : '' ?>>Pertinence</option>
                        <option value="newest" <?= $sort === 'newest' ? 'selected' : '' ?>>Plus récents</option>
                        <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>>Prix croissant</option>
                        <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>>Prix décroissant</option>
                        <option value="discount" <?= $sort === 'discount' ? 'selected' : '' ?>>Meilleures réductions</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[#667085]"></i>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- Active Filters Tags Row -->
    <?php if ($q || $categoryParam || $subcategoryParam || $brandParam || $minPrice !== null || $maxPrice !== null || $onlyInStock || $onlyPromo || $onlyExpress): ?>
        <div class="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs">
            <span class="text-[11px] font-bold text-[#667085] uppercase tracking-wider mr-1">Filtres :</span>

            <?php if ($q): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF3FF] text-[#0B54C2] text-xs font-bold">
                    🔍 "<?= htmlspecialchars($q) ?>"
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['q' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <?php if ($categoryParam): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F7FC] text-[#182230] text-xs font-bold border border-[#E8EDF3]">
                    📁 <?= htmlspecialchars($activeCategory['name'] ?? $categoryParam) ?>
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['category' => null, 'subcategory' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <?php if ($subcategoryParam): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F7FC] text-[#182230] text-xs font-bold border border-[#E8EDF3]">
                    ↳ <?= htmlspecialchars($activeSubcategory['name'] ?? $subcategoryParam) ?>
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['subcategory' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <?php if ($brandParam): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F7FC] text-[#182230] text-xs font-bold border border-[#E8EDF3]">
                    🏷️ <?= htmlspecialchars($brandParam) ?>
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['brand' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <?php if ($onlyInStock): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    ✅ En stock
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['in_stock' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <?php if ($onlyPromo): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                    🔥 En promo
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['promo' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <?php if ($onlyExpress): ?>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                    🚚 Express Dakar
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['express' => null])) ?>" class="hover:text-rose-600">✕</a>
                </span>
            <?php endif; ?>

            <a href="search.php" class="text-xs font-extrabold text-[#C2410C] hover:underline ml-auto">
                Réinitialiser la recherche
            </a>
        </div>
    <?php endif; ?>

    <!-- Mobile Filter Toggle Button -->
    <button type="button" onclick="document.getElementById('search-sidebar-filters').classList.toggle('hidden')" class="lg:hidden w-full flex items-center justify-between p-3.5 bg-white border border-[#E8EDF3] rounded-xl font-bold text-xs text-[#182230] shadow-2xs mb-4 cursor-pointer">
        <span class="flex items-center gap-2">
            <i data-lucide="sliders-horizontal" class="w-4 h-4 text-[#1677FF]"></i>
            <span>Affiner la recherche & Filtres</span>
        </span>
        <i data-lucide="chevron-down" class="w-4 h-4 text-[#667085]"></i>
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Sidebar Filtres de Recherche -->
        <aside id="search-sidebar-filters" class="hidden lg:block lg:col-span-3 space-y-5">

            <!-- 1. Recherches Populaires -->
            <div class="bg-white rounded-2xl border border-[#E8EDF3] p-4 sm:p-5 shadow-2xs space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-[#E8EDF3]">
                    <i data-lucide="flame" class="w-4 h-4 text-amber-500"></i>
                    <span>Recherches Populaires</span>
                </h3>
                <div class="flex flex-wrap gap-1.5">
                    <?php foreach ($popularSearches as $pop): ?>
                        <a href="search.php?q=<?= urlencode($pop) ?>" class="cursor-pointer px-2.5 py-1 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">
                            <?= htmlspecialchars($pop) ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- 2. Filtres Rapides (Disponibilité, Promo, Express) -->
            <div class="bg-white rounded-2xl border border-[#E8EDF3] p-4 sm:p-5 shadow-2xs space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3]">Disponibilité & Offres</h3>
                <div class="space-y-2 text-xs">
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['in_stock' => $onlyInStock ? null : 1])) ?>" 
                       class="cursor-pointer flex items-center justify-between p-2 rounded-xl transition-colors <?= $onlyInStock ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-[#182230] hover:bg-[#F3F7FC]' ?>">
                        <span class="flex items-center gap-2">
                            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                            <span>En Stock Uniquement</span>
                        </span>
                        <span class="w-4 h-4 rounded border flex items-center justify-center <?= $onlyInStock ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#D0D5DD]' ?>">
                            <?= $onlyInStock ? '✓' : '' ?>
                        </span>
                    </a>

                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['promo' => $onlyPromo ? null : 1])) ?>" 
                       class="cursor-pointer flex items-center justify-between p-2 rounded-xl transition-colors <?= $onlyPromo ? 'bg-rose-50 text-rose-800 font-bold' : 'text-[#182230] hover:bg-[#F3F7FC]' ?>">
                        <span class="flex items-center gap-2">
                            <i data-lucide="tag" class="w-4 h-4 text-rose-600"></i>
                            <span>Promotions & Bon Plans</span>
                        </span>
                        <span class="w-4 h-4 rounded border flex items-center justify-center <?= $onlyPromo ? 'bg-rose-600 border-rose-600 text-white' : 'border-[#D0D5DD]' ?>">
                            <?= $onlyPromo ? '✓' : '' ?>
                        </span>
                    </a>

                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['express' => $onlyExpress ? null : 1])) ?>" 
                       class="cursor-pointer flex items-center justify-between p-2 rounded-xl transition-colors <?= $onlyExpress ? 'bg-blue-50 text-blue-800 font-bold' : 'text-[#182230] hover:bg-[#F3F7FC]' ?>">
                        <span class="flex items-center gap-2">
                            <i data-lucide="truck" class="w-4 h-4 text-[#1677FF]"></i>
                            <span>Livraison Express 24h</span>
                        </span>
                        <span class="w-4 h-4 rounded border flex items-center justify-center <?= $onlyExpress ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-[#D0D5DD]' ?>">
                            <?= $onlyExpress ? '✓' : '' ?>
                        </span>
                    </a>
                </div>
            </div>

            <!-- 3. Rayons / Catégories -->
            <div class="bg-white rounded-2xl border border-[#E8EDF3] p-4 sm:p-5 shadow-2xs space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3]">Filtrer par Rayon</h3>
                <div class="space-y-1 text-xs">
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['category' => null, 'subcategory' => null])) ?>" 
                       class="cursor-pointer flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors <?= empty($categoryParam) ? 'bg-[#EAF3FF] text-[#0B54C2] font-bold' : 'text-[#667085] hover:bg-[#F3F7FC]' ?>">
                        <span>Tous les rayons</span>
                    </a>
                    <?php foreach ($categoriesTree as $pCat): 
                        $isCatSelected = ($activeCategory && ($activeCategory['slug'] === $pCat['slug'] || $activeCategory['name'] === $pCat['name']));
                    ?>
                        <a href="search.php?<?= http_build_query(array_merge($_GET, ['category' => $pCat['slug'], 'subcategory' => null])) ?>" 
                           class="cursor-pointer flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors <?= $isCatSelected ? 'bg-[#EAF3FF] text-[#0B54C2] font-bold' : 'text-[#182230] hover:bg-[#F3F7FC]' ?>">
                            <span class="flex items-center gap-2">
                                <i data-lucide="<?= htmlspecialchars($pCat['icon'] ?? 'box') ?>" class="w-3.5 h-3.5 <?= $isCatSelected ? 'text-[#0B54C2]' : 'text-[#667085]' ?>"></i>
                                <span><?= htmlspecialchars($pCat['name']) ?></span>
                            </span>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- 4. Marques -->
            <div class="bg-white rounded-2xl border border-[#E8EDF3] p-4 sm:p-5 shadow-2xs space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3]">Filtrer par Marque</h3>
                <div class="flex flex-wrap gap-1.5">
                    <?php foreach ($availableBrands as $b): ?>
                        <a href="search.php?<?= http_build_query(array_merge($_GET, ['brand' => ($brandParam === $b ? null : $b)])) ?>" 
                           class="cursor-pointer px-2.5 py-1 rounded-lg text-xs font-bold transition-colors <?= $brandParam === $b ? 'bg-[#1677FF] text-white' : 'bg-[#F3F7FC] text-[#182230] hover:bg-[#EAF3FF]' ?>">
                            <?= htmlspecialchars($b) ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- 5. Filtre Prix -->
            <div class="bg-white rounded-2xl border border-[#E8EDF3] p-4 sm:p-5 shadow-2xs space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3]">Prix (FCFA)</h3>
                <form method="GET" action="search.php" class="space-y-2.5">
                    <?php if ($q): ?><input type="hidden" name="q" value="<?= htmlspecialchars($q) ?>"><?php endif; ?>
                    <?php if ($categoryParam): ?><input type="hidden" name="category" value="<?= htmlspecialchars($categoryParam) ?>"><?php endif; ?>
                    <?php if ($subcategoryParam): ?><input type="hidden" name="subcategory" value="<?= htmlspecialchars($subcategoryParam) ?>"><?php endif; ?>
                    <?php if ($brandParam): ?><input type="hidden" name="brand" value="<?= htmlspecialchars($brandParam) ?>"><?php endif; ?>
                    <?php if ($sort !== 'relevance'): ?><input type="hidden" name="sort" value="<?= htmlspecialchars($sort) ?>"><?php endif; ?>

                    <div class="flex items-center gap-2">
                        <input type="number" name="min_price" aria-label="Prix minimum en FCFA" value="<?= $minPrice !== null ? $minPrice : '' ?>" placeholder="Min" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] text-xs font-semibold text-[#182230] px-3 py-2 rounded-xl focus:outline-none focus:border-[#1677FF]">
                        <span class="text-xs text-[#667085] font-bold">—</span>
                        <input type="number" name="max_price" aria-label="Prix maximum en FCFA" value="<?= $maxPrice !== null ? $maxPrice : '' ?>" placeholder="Max" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] text-xs font-semibold text-[#182230] px-3 py-2 rounded-xl focus:outline-none focus:border-[#1677FF]">
                    </div>
                    <button type="submit" class="w-full bg-[#EAF3FF] hover:bg-[#1677FF] hover:text-white text-[#0B54C2] text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer">
                        Appliquer
                    </button>
                </form>
            </div>

        </aside>

        <!-- Grille des Résultats de Recherche -->
        <div class="lg:col-span-9 space-y-6">

            <?php if (!empty($isFuzzyMatch)): ?>
                <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-center gap-3 shadow-2xs">
                    <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <i data-lucide="sparkles" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <p class="font-bold">Aucun résultat exact pour "<?= htmlspecialchars($q) ?>".</p>
                        <p class="text-[11px] text-amber-800">Voici les produits trouvés grâce à notre correction automatique d'orthographe :</p>
                    </div>
                </div>
            <?php endif; ?>

            <?php if (!empty($products)): ?>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <?php foreach ($products as $product): 
                        $imgs = getProductImages($product['images'] ?? null, 'assets/images/hero_product_img1.webp');
                        $mainImg = $imgs[0] ?? 'assets/images/hero_product_img1.webp';
                        $discount = $product['mrp'] > $product['price'] ? round((($product['mrp'] - $product['price']) / $product['mrp']) * 100) : 0;
                    ?>
                        <a href="product.php?id=<?= urlencode($product['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($product['name']) ?> - <?= formatPrice($product['price']) ?>">
                            
                            <!-- Badges & Rating -->
                            <div class="prod-card-top">
                                <div class="flex items-center gap-1">
                                    <?php if ($discount > 0): ?>
                                        <span class="prod-badge-discount">-<?= $discount ?>%</span>
                                    <?php elseif (!empty($product['is_new'])): ?>
                                        <span class="prod-badge-new">Nouveau</span>
                                    <?php else: ?>
                                        <span class="prod-badge-stock">En stock</span>
                                    <?php endif; ?>
                                </div>

                                <div class="flex items-center gap-1 text-[11px] font-bold text-[#F59E0B]">
                                    <span>★</span>
                                    <span class="text-[#64748B] text-[10px]">4.9</span>
                                </div>
                            </div>

                            <!-- Thumbnail -->
                            <div class="prod-card-img-wrap">
                                <img src="<?= htmlspecialchars($mainImg) ?>" alt="<?= htmlspecialchars($product['name']) ?>" width="180" height="180" loading="lazy" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;">
                            </div>

                            <!-- Info -->
                            <div class="prod-card-body">
                                <div>
                                    <div class="flex items-center justify-between text-[9px] text-[#64748B] font-semibold mb-0.5">
                                        <span class="prod-cat-text"><?= htmlspecialchars($product['subcategory'] ?: $product['category']) ?></span>
                                        <?php if (!empty($product['brand'])): ?>
                                            <span class="bg-[#F3F7FC] text-[#182230] px-1.5 py-0.2 rounded font-bold"><?= htmlspecialchars($product['brand']) ?></span>
                                        <?php endif; ?>
                                    </div>

                                    <h3 class="prod-name-text">
                                        <?= htmlspecialchars($product['name']) ?>
                                    </h3>
                                </div>

                                <!-- Price Section (No Button) -->
                                <div class="prod-price-row">
                                    <span class="prod-price-val"><?= formatPrice($product['price']) ?></span>
                                    <?php if ($product['mrp'] > $product['price']): ?>
                                        <span class="prod-price-old"><?= formatPrice($product['mrp']) ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>

                        </a>
                    <?php endforeach; ?>
                </div>

                <!-- Pagination -->
                <?php if ($totalPages > 1): ?>
                    <div class="flex items-center justify-center gap-2 pt-6">
                        <?php if ($page > 1): ?>
                            <a href="search.php?<?= http_build_query(array_merge($_GET, ['page' => $page - 1])) ?>" class="px-3.5 py-2 rounded-xl bg-white border border-[#E8EDF3] text-xs font-bold text-[#182230] hover:bg-[#F3F7FC] transition-colors">
                                ← Précédent
                            </a>
                        <?php endif; ?>

                        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                            <a href="search.php?<?= http_build_query(array_merge($_GET, ['page' => $i])) ?>" class="w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-colors <?= $i === $page ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white border border-[#E8EDF3] text-[#182230] hover:bg-[#F3F7FC]' ?>">
                                <?= $i ?>
                            </a>
                        <?php endfor; ?>

                        <?php if ($page < $totalPages): ?>
                            <a href="search.php?<?= http_build_query(array_merge($_GET, ['page' => $page + 1])) ?>" class="px-3.5 py-2 rounded-xl bg-white border border-[#E8EDF3] text-xs font-bold text-[#182230] hover:bg-[#F3F7FC] transition-colors">
                                Suivant →
                            </a>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

            <?php else: ?>
                <!-- Empty State avec Recommandations et Suggestions -->
                <div class="bg-white rounded-3xl border border-[#E8EDF3] p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-2xs">
                    <div class="w-16 h-16 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mx-auto">
                        <i data-lucide="search-x" class="w-8 h-8"></i>
                    </div>

                    <div class="space-y-1.5">
                        <h2 class="text-lg font-black text-[#182230]">Aucun équipement trouvé pour "<?= htmlspecialchars($q) ?>"</h2>
                        <p class="text-xs text-[#667085] max-w-md mx-auto">
                            Vérifiez l'orthographe de votre mot-clé ou essayez l'une de nos recherches fréquentes ci-dessous.
                        </p>
                    </div>

                    <!-- Suggestions Populaires -->
                    <div class="pt-2 space-y-2">
                        <span class="text-[11px] font-extrabold text-[#667085] uppercase tracking-wider block">Essayez avec un mot-clé populaire :</span>
                        <div class="flex flex-wrap items-center justify-center gap-2">
                            <?php foreach ($popularSearches as $pop): ?>
                                <a href="search.php?q=<?= urlencode($pop) ?>" class="px-3 py-1.5 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">
                                    🔍 <?= htmlspecialchars($pop) ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- Catégories Suggérées -->
                    <div class="pt-4 border-t border-[#E8EDF3] space-y-2">
                        <span class="text-[11px] font-extrabold text-[#667085] uppercase tracking-wider block">Ou explorez nos rayons majeurs :</span>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <a href="shop.php?category=telephones-accessoires" class="p-2 rounded-xl bg-[#F8FBFF] hover:bg-[#EAF3FF] text-xs font-bold text-[#0B54C2] flex items-center gap-1.5 justify-center transition-colors">
                                <i data-lucide="smartphone" class="w-3.5 h-3.5"></i>
                                <span>Téléphones</span>
                            </a>
                            <a href="shop.php?category=audio-ecouteurs" class="p-2 rounded-xl bg-[#F8FBFF] hover:bg-[#EAF3FF] text-xs font-bold text-[#0B54C2] flex items-center gap-1.5 justify-center transition-colors">
                                <i data-lucide="headphones" class="w-3.5 h-3.5"></i>
                                <span>Audio & Casques</span>
                            </a>
                            <a href="shop.php?category=montres-objets-connectes" class="p-2 rounded-xl bg-[#F8FBFF] hover:bg-[#EAF3FF] text-xs font-bold text-[#0B54C2] flex items-center gap-1.5 justify-center transition-colors">
                                <i data-lucide="watch" class="w-3.5 h-3.5"></i>
                                <span>Montres</span>
                            </a>
                        </div>
                    </div>

                    <div class="pt-2">
                        <a href="shop.php" class="inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all active:scale-95">
                            <span>Voir tout le catalogue</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                    </div>
                </div>
            <?php endif; ?>

        </div>

    </div>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
