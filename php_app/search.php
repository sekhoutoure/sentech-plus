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
        $_SESSION['recent_searches'] = array_slice($_SESSION['recent_searches'], 0, 8);
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
$pageTitle = !empty($q) ? "Recherche : \"$q\" — Catalogue Certifié" : "Recherche Haute Précision High-Tech";
$pageTitle .= " | SenTechPLUS Dakar";

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$pdo = getDBConnection();
$totalProducts = 0;
$products = [];

// Construction dynamique de la requête SQL
$whereClauses = ["is_active = 1"];
$params = [];

if ($onlyInStock) {
    $whereClauses[] = "(in_stock = 1 AND stock > 0)";
}

if ($onlyPromo) {
    $whereClauses[] = "mrp > price";
}

if ($onlyExpress) {
    $whereClauses[] = "is_express_delivery = 1";
}

if (!empty($q)) {
    $words = preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY);
    $searchClauses = [];
    foreach ($words as $idx => $word) {
        $pName = ":wn_{$idx}";
        $pBrand = ":wb_{$idx}";
        $pCat = ":wc_{$idx}";
        $pSub = ":ws_{$idx}";
        $pDesc = ":wd_{$idx}";
        $searchClauses[] = "(name LIKE {$pName} OR brand LIKE {$pBrand} OR category LIKE {$pCat} OR subcategory LIKE {$pSub} OR description LIKE {$pDesc})";
        $val = '%' . $word . '%';
        $params[$pName] = $val;
        $params[$pBrand] = $val;
        $params[$pCat] = $val;
        $params[$pSub] = $val;
        $params[$pDesc] = $val;
    }
    if (!empty($searchClauses)) {
        $whereClauses[] = "(" . implode(" AND ", $searchClauses) . ")";
    }
}

if ($activeCategory) {
    $whereClauses[] = "(category = :cat_name OR category_id = :cat_id OR category LIKE :cat_slug OR subcategory = :cat_sub_name OR subcategory_id = :cat_sub_id OR subcategory LIKE :cat_sub_slug)";
    $params[':cat_name'] = $activeCategory['name'];
    $params[':cat_id'] = $activeCategory['id'];
    $params[':cat_slug'] = '%' . $activeCategory['slug'] . '%';
    $params[':cat_sub_name'] = $activeCategory['name'];
    $params[':cat_sub_id'] = $activeCategory['id'];
    $params[':cat_sub_slug'] = '%' . $activeCategory['slug'] . '%';
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

// Tri robuste et sécurisé
$orderBy = "created_at DESC, id DESC";
if ($sort === 'price_asc') {
    $orderBy = "price ASC, id DESC";
} elseif ($sort === 'price_desc') {
    $orderBy = "price DESC, id DESC";
} elseif ($sort === 'newest') {
    $orderBy = "created_at DESC, id DESC";
} elseif ($sort === 'sales' || $sort === 'discount') {
    $orderBy = "(mrp - price) DESC, id DESC";
} elseif ($sort === 'relevance' && !empty($q)) {
    if ($pdo) {
        $escapedQ = $pdo->quote('%' . $q . '%');
        $orderBy = "CASE WHEN name LIKE {$escapedQ} THEN 1 WHEN brand LIKE {$escapedQ} THEN 2 ELSE 3 END, id DESC";
    } else {
        $orderBy = "id DESC";
    }
}

try {
    if (!$pdo) throw new Exception("DB offline");
    $countSql = "SELECT COUNT(*) FROM products WHERE {$whereSql}";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $totalProducts = (int)$countStmt->fetchColumn();
    $totalPages = max(1, (int)ceil($totalProducts / $limit));

    $sql = "SELECT * FROM products WHERE {$whereSql} ORDER BY {$orderBy} LIMIT " . (int)$limit . " OFFSET " . (int)$offset;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
} catch (Throwable $e) {
        $products = [];
    $totalProducts = 0;
    $totalPages = 1;
}

// Tolérance aux fautes de frappe (Fuzzy search fallback)
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
                    'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c', 'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'ì'=>'i',
                    'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u',
                    'û'=>'u', 'ü'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y', '°'=>'', '+'=>' ', '-'=>' ', '/'=>' ', '\''=>' ', '"'=>' '
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

// Hero SKUs fallback en cas de 0 résultat
$heroFallbackProducts = [];
if ($totalProducts === 0 && $pdo) {
    try {
        $stmtHero = $pdo->query("SELECT * FROM products WHERE is_active = 1 ORDER BY is_featured DESC, sales_count DESC LIMIT 4");
        $heroFallbackProducts = $stmtHero ? $stmtHero->fetchAll() : [];
    } catch (Throwable $e) {}
}

$popularSearches = ['Chargeur GaN 65W', 'Câble 100W', 'Casque ANC', 'Écouteurs Bass', 'JBL Wave', 'Baseus', 'Anker', 'Montre AMOLED'];
$availableBrands = ['Baseus', 'Anker', 'Apple', 'JBL', 'Oraimo', 'Sony', 'Samsung', 'Xiaomi', 'Logitech'];
?>

<main id="main-content" class="min-h-[calc(100vh-140px)] bg-[#F8FAFD] pb-24 lg:pb-16 flex-1">

    <!-- Top Atmospheric Banner & Omnibox Bar -->
    <div class="bg-white/80 backdrop-blur-xl border-b border-[#E8EDF3] py-5 sm:py-7">
        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 space-y-4">

            <!-- Breadcrumbs -->
            <nav class="flex text-[11px] font-bold text-[#64748B]" aria-label="Fil d'Ariane">
                <ol class="inline-flex items-center space-x-1.5">
                    <li>
                        <a href="index.php" class="hover:text-[#1677FF] transition-colors flex items-center gap-1.5">
                            <i data-lucide="home" class="w-3.5 h-3.5"></i>
                            <span>Accueil</span>
                        </a>
                    </li>
                    <li class="flex items-center">
                        <i data-lucide="chevron-right" class="w-3 h-3 text-[#94A3B8]"></i>
                        <a href="shop.php" class="hover:text-[#1677FF] transition-colors ml-1.5">Boutique Officielle</a>
                    </li>
                    <li class="flex items-center" aria-current="page">
                        <i data-lucide="chevron-right" class="w-3 h-3 text-[#94A3B8]"></i>
                        <span class="text-[#1677FF] font-black ml-1.5">Recherche</span>
                    </li>
                </ol>
            </nav>

            <!-- Header Results Title & Sorting Controls (Eliminates redundant duplicate search bar) -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                    <h1 class="text-lg sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
                        <?= !empty($q) ? 'Résultats pour « ' . htmlspecialchars($q) . ' »' : 'Tous les Produits' ?>
                    </h1>
                    <p class="text-xs text-[#64748B] font-medium mt-0.5">
                        <span class="font-extrabold text-[#1D1D1F]"><?= $totalProducts ?></span> produit<?= $totalProducts > 1 ? 's trouvés' : ' trouvé' ?>
                    </p>
                </div>

                <!-- Tri Dropdown Apple -->
                <div class="flex items-center gap-3 shrink-0">
                    <form method="GET" action="search.php" class="inline-flex items-center">
                        <?php if ($q): ?><input type="hidden" name="q" value="<?= htmlspecialchars($q) ?>"><?php endif; ?>
                        <?php if ($categoryParam): ?><input type="hidden" name="category" value="<?= htmlspecialchars($categoryParam) ?>"><?php endif; ?>
                        <?php if ($brandParam): ?><input type="hidden" name="brand" value="<?= htmlspecialchars($brandParam) ?>"><?php endif; ?>
                        <?php if ($onlyInStock): ?><input type="hidden" name="in_stock" value="1"><?php endif; ?>
                        <?php if ($onlyPromo): ?><input type="hidden" name="promo" value="1"><?php endif; ?>
                        <?php if ($onlyExpress): ?><input type="hidden" name="express" value="1"><?php endif; ?>

                        <div class="relative flex items-center bg-white border border-[#E2E8F0] rounded-xl px-3 h-[42px] hover:border-[#CBD5E1] transition-all shadow-2xs">
                            <i data-lucide="arrow-down-up" class="w-3.5 h-3.5 text-[#64748B] mr-2 shrink-0"></i>
                            <select name="sort" onchange="this.form.submit()" class="bg-transparent text-xs font-bold text-[#1D1D1F] outline-none cursor-pointer pr-4 appearance-none">
                                <option value="relevance" <?= $sort === 'relevance' ? 'selected' : '' ?>>Pertinence</option>
                                <option value="newest" <?= $sort === 'newest' ? 'selected' : '' ?>>Plus récents</option>
                                <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>>Prix croissant</option>
                                <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>>Prix décroissant</option>
                                <option value="discount" <?= $sort === 'discount' ? 'selected' : '' ?>>Meilleures réductions</option>
                            </select>
                            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-[#64748B] pointer-events-none absolute right-2.5"></i>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Horizontal Fast-Filter Chip Bar (UI-UX-Pro-Max / HIG Standard) -->
            <div class="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                
                <!-- 1. Express H+2 Dakar -->
                <a href="search.php?<?= http_build_query(array_merge($_GET, ['express' => $onlyExpress ? null : 1])) ?>" 
                   class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 <?= $onlyExpress ? 'bg-[#1677FF] text-white shadow-xs' : 'bg-[#F1F3F7] text-[#1D1D1F] hover:bg-[#E5E8EE]' ?>">
                    <i data-lucide="zap" class="w-3.5 h-3.5 <?= $onlyExpress ? 'text-white' : 'text-amber-500' ?>"></i>
                    <span>Livraison H+2 Dakar</span>
                    <?php if ($onlyExpress): ?><span>✕</span><?php endif; ?>
                </a>

                <!-- 2. En Stock Direct -->
                <a href="search.php?<?= http_build_query(array_merge($_GET, ['in_stock' => $onlyInStock ? null : 1])) ?>" 
                   class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 <?= $onlyInStock ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#F1F3F7] text-[#1D1D1F] hover:bg-[#E5E8EE]' ?>">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5 <?= $onlyInStock ? 'text-white' : 'text-emerald-600' ?>"></i>
                    <span>En Stock Immédiat</span>
                    <?php if ($onlyInStock): ?><span>✕</span><?php endif; ?>
                </a>

                <!-- 3. Promotions & Bons plans -->
                <a href="search.php?<?= http_build_query(array_merge($_GET, ['promo' => $onlyPromo ? null : 1])) ?>" 
                   class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 <?= $onlyPromo ? 'bg-rose-600 text-white shadow-xs' : 'bg-[#F1F3F7] text-[#1D1D1F] hover:bg-[#E5E8EE]' ?>">
                    <i data-lucide="tag" class="w-3.5 h-3.5 <?= $onlyPromo ? 'text-white' : 'text-rose-600' ?>"></i>
                    <span>Bons Plans %</span>
                    <?php if ($onlyPromo): ?><span>✕</span><?php endif; ?>
                </a>

                <div class="h-5 w-px bg-[#E2E8F0] shrink-0 mx-1"></div>

                <!-- 4. Marques rapides -->
                <?php foreach (['Baseus', 'Anker', 'Apple', 'JBL', 'Oraimo'] as $quickBrand): 
                    $isBActive = ($brandParam === $quickBrand);
                ?>
                    <a href="search.php?<?= http_build_query(array_merge($_GET, ['brand' => $isBActive ? null : $quickBrand])) ?>" 
                       class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 <?= $isBActive ? 'bg-[#1D1D1F] text-white shadow-xs' : 'bg-white border border-[#E2E8F0] text-[#475467] hover:border-[#1677FF] hover:text-[#1677FF]' ?>">
                        <span><?= htmlspecialchars($quickBrand) ?></span>
                        <?php if ($isBActive): ?><span class="text-[10px] ml-0.5">✕</span><?php endif; ?>
                    </a>
                <?php endforeach; ?>

            </div>

        </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">

        <!-- Active Filters Tags Summary Row -->
        <?php if ($q || $categoryParam || $subcategoryParam || $brandParam || $minPrice !== null || $maxPrice !== null || $onlyInStock || $onlyPromo || $onlyExpress): ?>
            <div class="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8EDF3] shadow-2xs">
                <span class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mr-1">Filtres actifs :</span>

                <?php if ($q): ?>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-xs font-bold border border-[#1677FF]/20">
                        <span>Mot-clé : "<?= htmlspecialchars($q) ?>"</span>
                        <a href="search.php?<?= http_build_query(array_merge($_GET, ['q' => null])) ?>" aria-label="Supprimer le filtre mot-clé" class="hover:text-rose-600 transition-colors">✕</a>
                    </span>
                <?php endif; ?>

                <?php if ($categoryParam): ?>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F3F7] text-[#1D1D1F] text-xs font-bold border border-[#E2E8F0]">
                        <span>Rayon : <?= htmlspecialchars($activeCategory['name'] ?? $categoryParam) ?></span>
                        <a href="search.php?<?= http_build_query(array_merge($_GET, ['category' => null, 'subcategory' => null])) ?>" aria-label="Supprimer le filtre rayon" class="hover:text-rose-600 transition-colors">✕</a>
                    </span>
                <?php endif; ?>

                <?php if ($brandParam): ?>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1D1D1F] text-white text-xs font-bold">
                        <span>Marque : <?= htmlspecialchars($brandParam) ?></span>
                        <a href="search.php?<?= http_build_query(array_merge($_GET, ['brand' => null])) ?>" aria-label="Supprimer le filtre marque" class="text-white/80 hover:text-white transition-colors">✕</a>
                    </span>
                <?php endif; ?>

                <?php if ($minPrice !== null || $maxPrice !== null): ?>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F3F7] text-[#1D1D1F] text-xs font-bold border border-[#E2E8F0]">
                        <span>Prix : <?= $minPrice ? formatPrice($minPrice) : '0 F' ?> — <?= $maxPrice ? formatPrice($maxPrice) : 'Max' ?></span>
                        <a href="search.php?<?= http_build_query(array_merge($_GET, ['min_price' => null, 'max_price' => null])) ?>" aria-label="Supprimer le filtre de prix" class="hover:text-rose-600 transition-colors">✕</a>
                    </span>
                <?php endif; ?>

                <a href="search.php" class="text-xs font-extrabold text-rose-600 hover:text-rose-700 hover:underline ml-auto flex items-center gap-1">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    <span>Tout effacer</span>
                </a>
            </div>
        <?php endif; ?>

        <!-- Layout 2 Colonnes : Sidebar Filtres + Grille Produits -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <!-- Sidebar Filtres Desktop (Apple Glass Card) -->
            <aside class="hidden lg:block lg:col-span-3 sticky top-20 space-y-4">
                
                <div class="bg-white/95 backdrop-blur-xl rounded-[28px] border border-[#E8EDF3] p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)] space-y-5">
                    
                    <div class="flex items-center justify-between pb-3 border-b border-[#F1F3F7]">
                        <h2 class="text-xs font-black text-[#1D1D1F] uppercase tracking-wider flex items-center gap-2">
                            <i data-lucide="sliders" class="w-4 h-4 text-[#1677FF]"></i>
                            <span>Affiner le Catalogue</span>
                        </h2>
                        <?php if ($categoryParam || $brandParam || $minPrice || $maxPrice): ?>
                            <a href="search.php<?= $q ? '?q=' . urlencode($q) : '' ?>" class="text-[11px] font-bold text-[#1677FF] hover:underline">Réinitialiser</a>
                        <?php endif; ?>
                    </div>

                    <!-- 1. Filtre par Rayon -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-[#1D1D1F]">Rayons & Univers</label>
                        <div class="space-y-1 text-xs max-h-56 overflow-y-auto pr-1">
                            <a href="search.php?<?= http_build_query(array_merge($_GET, ['category' => null, 'subcategory' => null])) ?>" 
                               class="flex items-center justify-between px-3 py-2 rounded-xl transition-all <?= empty($categoryParam) ? 'bg-[#EAF3FF] text-[#1677FF] font-bold' : 'text-[#64748B] hover:bg-[#F1F3F7] hover:text-[#1D1D1F]' ?>">
                                <span>Tous les rayons</span>
                                <i data-lucide="layers" class="w-3.5 h-3.5"></i>
                            </a>
                            <?php foreach ($categoriesTree as $pCat): 
                                $isCatSelected = ($activeCategory && ($activeCategory['slug'] === $pCat['slug'] || $activeCategory['name'] === $pCat['name']));
                            ?>
                                <a href="search.php?<?= http_build_query(array_merge($_GET, ['category' => $pCat['slug'], 'subcategory' => null])) ?>" 
                                   class="flex items-center justify-between px-3 py-2 rounded-xl transition-all <?= $isCatSelected ? 'bg-[#EAF3FF] text-[#1677FF] font-bold' : 'text-[#1D1D1F] hover:bg-[#F1F3F7]' ?>">
                                    <span class="truncate"><?= htmlspecialchars($pCat['name']) ?></span>
                                    <?php if ($isCatSelected): ?>
                                        <i data-lucide="check" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                                    <?php endif; ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- 2. Filtre par Marque -->
                    <div class="pt-3 border-t border-[#F1F3F7] space-y-2">
                        <label class="block text-xs font-bold text-[#1D1D1F]">Marques Certifiées</label>
                        <div class="flex flex-wrap gap-1.5">
                            <?php foreach ($availableBrands as $b): 
                                $isBrandActive = ($brandParam === $b);
                            ?>
                                <a href="search.php?<?= http_build_query(array_merge($_GET, ['brand' => $isBrandActive ? null : $b])) ?>" 
                                   class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 <?= $isBrandActive ? 'bg-[#1D1D1F] text-white shadow-xs' : 'bg-[#F1F3F7] text-[#475467] hover:bg-[#E2E8F0] hover:text-[#1D1D1F]' ?>">
                                    <?= htmlspecialchars($b) ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <!-- 3. Fourchette de Prix -->
                    <div class="pt-3 border-t border-[#F1F3F7] space-y-2.5">
                        <label class="block text-xs font-bold text-[#1D1D1F]">Fourchette de Prix (FCFA)</label>
                        <form method="GET" action="search.php" class="space-y-2">
                            <?php if ($q): ?><input type="hidden" name="q" value="<?= htmlspecialchars($q) ?>"><?php endif; ?>
                            <?php if ($categoryParam): ?><input type="hidden" name="category" value="<?= htmlspecialchars($categoryParam) ?>"><?php endif; ?>
                            <?php if ($brandParam): ?><input type="hidden" name="brand" value="<?= htmlspecialchars($brandParam) ?>"><?php endif; ?>
                            <?php if ($sort !== 'relevance'): ?><input type="hidden" name="sort" value="<?= htmlspecialchars($sort) ?>"><?php endif; ?>

                            <div class="grid grid-cols-2 gap-2">
                                <input type="number" name="min_price" value="<?= $minPrice !== null ? $minPrice : '' ?>" placeholder="Min" aria-label="Prix minimum en FCFA" class="w-full bg-[#F1F3F7] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1D1D1F] outline-none focus:border-[#1677FF]">
                                <input type="number" name="max_price" value="<?= $maxPrice !== null ? $maxPrice : '' ?>" placeholder="Max" aria-label="Prix maximum en FCFA" class="w-full bg-[#F1F3F7] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-semibold text-[#1D1D1F] outline-none focus:border-[#1677FF]">
                            </div>

                            <button type="submit" class="w-full h-9 rounded-xl bg-[#1677FF] hover:bg-[#0F67E5] active:scale-98 text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer">
                                <span>Filtrer par Prix</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </button>
                        </form>
                    </div>

                    <!-- 4. Recherches fréquentes -->
                    <div class="pt-3 border-t border-[#F1F3F7] space-y-2">
                        <label class="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Tendances à Dakar</label>
                        <div class="flex flex-wrap gap-1.5">
                            <?php foreach ($popularSearches as $pop): ?>
                                <a href="search.php?q=<?= urlencode($pop) ?>" class="text-[11px] font-semibold text-[#475467] hover:text-[#1677FF] bg-[#F8FAFD] hover:bg-[#EAF3FF] px-2 py-1 rounded-lg transition-colors">
                                    #<?= htmlspecialchars($pop) ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>

                </div>

            </aside>

            <!-- Grille Principale des Résultats -->
            <div class="lg:col-span-9 space-y-6">

                <?php if (!empty($isFuzzyMatch)): ?>
                    <div class="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-center gap-3 shadow-2xs">
                        <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <i data-lucide="sparkles" class="w-5 h-5"></i>
                        </div>
                        <div>
                            <p class="font-bold text-amber-900">Aucun résultat exact pour "<?= htmlspecialchars($q) ?>".</p>
                            <p class="text-[11px] text-amber-800">Voici les produits trouvés grâce à notre moteur de correction intelligente d'orthographe :</p>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if (!empty($products)): ?>
                    
                    <!-- Grille Produits Pro Max Apple Style -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
                        <?php foreach ($products as $product): 
                            $mainImg = getProductMainImage($product, 'assets/images/product_img1.webp');
                            $discount = ($product['mrp'] > $product['price']) ? round((($product['mrp'] - $product['price']) / $product['mrp']) * 100) : 0;
                            $inStock = (int)($product['stock'] ?? $product['in_stock'] ?? 1) > 0;
                        ?>
                            <div class="group relative bg-white rounded-3xl p-3 sm:p-4 border border-[#E8EDF3] hover:border-[#1677FF]/40 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_rgba(22,119,255,0.09)] transition-all duration-300 flex flex-col justify-between">
                                
                                <div>
                                    <!-- Badges supérieurs -->
                                    <div class="flex items-center justify-between gap-1 mb-2">
                                        <div class="flex items-center gap-1">
                                            <?php if ($discount > 0): ?>
                                                <span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black">-<?= $discount ?>%</span>
                                            <?php endif; ?>
                                            <?php if (!empty($product['is_express_delivery'])): ?>
                                                <span class="px-2 py-0.5 rounded-full bg-blue-50 text-[#1677FF] border border-blue-200 text-[10px] font-bold flex items-center gap-0.5">
                                                    <i data-lucide="zap" class="w-3 h-3 text-amber-500"></i> H+2
                                                </span>
                                            <?php endif; ?>
                                        </div>

                                        <span class="text-[10px] font-bold <?= $inStock ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100' ?> px-2 py-0.5 rounded-full">
                                            <?= $inStock ? 'En stock' : 'Rupture' ?>
                                        </span>
                                    </div>

                                    <!-- Vignette Produit avec zoom tactile -->
                                    <a href="product.php?id=<?= urlencode($product['id']) ?>" class="block w-full aspect-square bg-[#F8FAFD] rounded-2xl p-3 mb-3 overflow-hidden flex items-center justify-center">
                                        <img 
                                            src="<?= htmlspecialchars($mainImg) ?>" 
                                            alt="<?= htmlspecialchars($product['name']) ?>" 
                                            loading="lazy" 
                                            class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 ease-out">
                                    </a>

                                    <!-- Informations Produit -->
                                    <div class="space-y-1">
                                        <div class="flex items-center justify-between text-[11px] text-[#64748B]">
                                            <span class="font-bold text-[#1677FF] uppercase tracking-wider text-[10px] truncate max-w-[120px]"><?= htmlspecialchars($product['brand'] ?: 'Certifié') ?></span>
                                            <span class="text-[10px] font-semibold text-[#94A3B8]"><?= htmlspecialchars($product['category'] ?? '') ?></span>
                                        </div>

                                        <h3 class="text-xs sm:text-sm font-bold text-[#1D1D1F] line-clamp-2 leading-snug group-hover:text-[#1677FF] transition-colors">
                                            <a href="product.php?id=<?= urlencode($product['id']) ?>">
                                                <?= htmlspecialchars($product['name']) ?>
                                            </a>
                                        </h3>
                                    </div>
                                </div>

                                <!-- Bas de carte : Prix & Action -->
                                <div class="pt-3 mt-3 border-t border-[#F1F3F7] flex items-center justify-between gap-2">
                                    <div>
                                        <div class="text-sm sm:text-base font-black text-[#1D1D1F] tracking-tight">
                                            <?= formatPrice($product['price']) ?>
                                        </div>
                                        <?php if ($product['mrp'] > $product['price']): ?>
                                            <div class="text-[10px] font-semibold text-[#94A3B8] line-through">
                                                <?= formatPrice($product['mrp']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </div>

                                    <?php if ($inStock): ?>
                                        <form action="cart.php" method="POST" class="inline shrink-0">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="add">
                                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                                            <input type="hidden" name="quantity" value="1">
                                            <button type="submit" class="cursor-pointer h-9 px-3 rounded-xl bg-[#1677FF] hover:bg-[#0B54C2] text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs" aria-label="Ajouter au panier">
                                                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                                                <span>+ Panier</span>
                                            </button>
                                        </form>
                                    <?php else: ?>
                                        <a href="product.php?id=<?= urlencode($product['id']) ?>" class="h-9 px-3 rounded-xl bg-[#F1F3F7] hover:bg-[#1677FF] hover:text-white text-[#1D1D1F] text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shrink-0">
                                            <span>Détails</span>
                                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                                        </a>
                                    <?php endif; ?>
                                </div>

                            </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- Pagination Apple Native -->
                    <?php if ($totalPages > 1): ?>
                        <div class="flex items-center justify-center gap-1.5 pt-8">
                            <?php if ($page > 1): ?>
                                <a href="search.php?<?= http_build_query(array_merge($_GET, ['page' => $page - 1])) ?>" class="h-10 px-4 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#1D1D1F] hover:bg-[#F1F3F7] transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs">
                                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                    <span>Précédent</span>
                                </a>
                            <?php endif; ?>

                            <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                <a href="search.php?<?= http_build_query(array_merge($_GET, ['page' => $i])) ?>" class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all active:scale-95 <?= $i === $page ? 'bg-[#1677FF] text-white shadow-xs' : 'bg-white border border-[#E2E8F0] text-[#1D1D1F] hover:bg-[#F1F3F7]' ?>">
                                    <?= $i ?>
                                </a>
                            <?php endfor; ?>

                            <?php if ($page < $totalPages): ?>
                                <a href="search.php?<?= http_build_query(array_merge($_GET, ['page' => $page + 1])) ?>" class="h-10 px-4 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#1D1D1F] hover:bg-[#F1F3F7] transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs">
                                    <span>Suivant</span>
                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </a>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                <?php else: ?>

                    <!-- ZERO RESULTS / EMPTY STATE PRO MAX -->
                    <div class="bg-white/95 backdrop-blur-xl rounded-[32px] border border-[#E8EDF3] p-8 sm:p-12 text-center space-y-7 max-w-2xl mx-auto shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
                        
                        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1677FF]/10 to-[#1677FF]/5 border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center mx-auto shadow-inner">
                            <i data-lucide="search-x" class="w-10 h-10"></i>
                        </div>

                        <div class="space-y-2">
                            <h2 class="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
                                Aucun équipement trouvé pour "<?= htmlspecialchars($q) ?>"
                            </h2>
                            <p class="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                                Vérifiez l'orthographe ou découvrez nos indispensables certifiés livrés en express à Dakar.
                            </p>
                        </div>

                        <!-- Suggestions Rapides -->
                        <div class="space-y-2.5">
                            <span class="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Essayez avec ces termes très demandés :</span>
                            <div class="flex flex-wrap items-center justify-center gap-2">
                                <?php foreach ($popularSearches as $pop): ?>
                                    <a href="search.php?q=<?= urlencode($pop) ?>" class="px-3.5 py-1.5 rounded-full bg-[#F1F3F7] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#1D1D1F] transition-all active:scale-95">
                                        🔍 <?= htmlspecialchars($pop) ?>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <!-- VIP WhatsApp Concierge Order -->
                        <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div class="space-y-1 text-center sm:text-left">
                                <p class="text-xs font-extrabold text-[#1D1D1F] flex items-center justify-center sm:justify-start gap-1.5">
                                    <i data-lucide="message-circle" class="w-4 h-4 text-emerald-600"></i>
                                    <span>Vous cherchez un modèle précis introuvable ?</span>
                                </p>
                                <p class="text-[11px] text-[#64748B] leading-relaxed">
                                    Envoyez-nous la référence par WhatsApp : notre équipe locale vérifie la disponibilité constructeur et vous livre sous 2h à Dakar.
                                </p>
                            </div>
                            <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20je%20recherche%20un%20produit%20spécifique%20: <?= urlencode($q) ?>" target="_blank" rel="noopener" class="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0">
                                <span>Demander sur WhatsApp</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>

                        <!-- Hero SKUs Fallback Grid -->
                        <?php if (!empty($heroFallbackProducts)): ?>
                            <div class="pt-4 border-t border-[#F1F3F7] text-left space-y-3">
                                <h3 class="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider flex items-center gap-1.5">
                                    <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500"></i>
                                    <span>Les Indispensables Tech Recommandés :</span>
                                </h3>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    <?php foreach ($heroFallbackProducts as $hp): 
                                        $hMainImg = getProductMainImage($hp, 'assets/images/product_img1.webp');
                                    ?>
                                        <a href="product.php?id=<?= urlencode($hp['id']) ?>" class="p-2.5 rounded-2xl bg-[#F8FAFD] hover:bg-white border border-[#E8EDF3] hover:border-[#1677FF] transition-all group flex flex-col justify-between">
                                            <div class="w-full aspect-square p-1 flex items-center justify-center mb-1.5">
                                                <img src="<?= htmlspecialchars($hMainImg) ?>" alt="<?= htmlspecialchars($hp['name']) ?>" class="max-w-full max-h-full object-contain">
                                            </div>
                                            <div>
                                                <p class="text-[11px] font-bold text-[#1D1D1F] line-clamp-1 group-hover:text-[#1677FF]"><?= htmlspecialchars($hp['name']) ?></p>
                                                <p class="text-xs font-black text-[#1677FF] mt-0.5"><?= formatPrice($hp['price']) ?></p>
                                            </div>
                                        </a>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php endif; ?>

                    </div>

                <?php endif; ?>

            </div>

        </div>

    </div>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
