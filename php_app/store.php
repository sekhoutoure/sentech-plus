<?php
require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();
$username = sanitize($_GET['username'] ?? '');

$store = null;
if (!empty($username) && $pdo) {
    try {
        $stmtStore = $pdo->prepare("SELECT * FROM stores WHERE username = :u AND is_active = 1 LIMIT 1");
        $stmtStore->execute([':u' => $username]);
        $store = $stmtStore->fetch();
    } catch (Throwable $e) {}
}

if (!$store && $pdo) {
    try {
        $stmtStore = $pdo->query("SELECT * FROM stores WHERE is_active = 1 LIMIT 1");
        $store = $stmtStore ? $stmtStore->fetch() : null;
    } catch (Throwable $e) {}
}

if (!$store) {
    $store = [
        'id' => 1,
        'name' => 'SenTechPLUS Officiel',
        'username' => 'sentech-officiel',
        'logo' => 'assets/images/sentech_logo.webp',
        'description' => 'Boutique officielle certifiée SenTechPLUS à Dakar. Produits 100% authentiques garantis.',
        'contact' => '+221 78 131 64 97',
        'phone' => '+221 78 131 64 97',
        'address' => 'Point E, Dakar, Sénégal'
    ];
}

// Fetch Store Products
$products = [];
if ($pdo) {
    try {
        $stmtProd = $pdo->prepare("SELECT * FROM products WHERE store_id = :sid AND in_stock = 1 ORDER BY created_at DESC LIMIT 12");
        $stmtProd->execute([':sid' => $store['id']]);
        $products = $stmtProd->fetchAll();
    } catch (Throwable $e) {}
}
if (empty($products)) {
    $products = getAllProducts();
}

$pageTitle = htmlspecialchars($store['name']) . " — Boutique Dakar";
$metaDescription = "Boutique " . htmlspecialchars($store['name']) . " sur SenTechPLUS. Produits High-Tech certifiés, livraison express Dakar 2h et paiement Wave/OM.";
$canonicalUrl = "https://www.sentechplus.com/store.php" . (!empty($username) ? "?username=" . urlencode($username) : "");
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">

    <div class="card-clean p-6 sm:p-8 bg-gradient-to-r from-white via-[#F3F7FC] to-[#EAF3FF] flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4 text-center md:text-left">
            <img src="<?= htmlspecialchars($store['logo'] ?: 'assets/images/happy_store.webp') ?>" alt="<?= htmlspecialchars($store['name']) ?>" width="80" height="80" style="aspect-ratio:1/1;" class="w-20 h-20 rounded-2xl object-cover border-2 border-[#1677FF] shadow-xs" loading="lazy">
            <div class="space-y-1">
                <span class="text-[10px] font-bold text-[#0D7D53] bg-[#0D7D53]/10 px-2.5 py-0.5 rounded-full">
                    Vendeur Vérifié SenTechPLUS 🇸🇳
                </span>
                <h1 class="text-2xl font-extrabold text-[#182230]"><?= htmlspecialchars($store['name']) ?></h1>
                <p class="text-xs text-[#667085] max-w-lg"><?= htmlspecialchars($store['description']) ?></p>
            </div>
        </div>

        <div class="space-y-2 text-xs text-[#667085] border-t md:border-t-0 md:border-l border-[#E8EDF3] pt-4 md:pt-0 md:pl-6">
            <div class="flex items-center gap-2">
                <i data-lucide="map-pin" class="w-4 h-4 text-[#1677FF]"></i>
                <span><?= htmlspecialchars($store['address'] ?? 'Point E, Dakar, Sénégal') ?></span>
            </div>
            <div class="flex items-center gap-2">
                <i data-lucide="phone" class="w-4 h-4 text-[#0D7D53]"></i>
                <span><?= htmlspecialchars($store['contact'] ?? ($store['phone'] ?? '+221 78 131 64 97')) ?></span>
            </div>
        </div>
    </div>

    <!-- Products Section -->
    <div class="space-y-4">
        <h2 class="text-xl font-extrabold text-[#182230] flex items-center gap-2">
            <i data-lucide="package" class="w-5 h-5 text-[#1677FF]"></i>
            <span>Produits de la Boutique (<?= count($products) ?>)</span>
        </h2>

        <?php if (empty($products)): ?>
            <div class="card-clean p-8 text-center text-xs text-[#667085]">
                Cette boutique n'a pas encore de produits disponibles.
            </div>
        <?php else: ?>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <?php foreach ($products as $product): 
                    $images = getProductImages($product['images'] ?? null, 'assets/images/hero_product_img1.webp');
                    $mainImg = $images[0] ?? 'assets/images/hero_product_img1.webp';
                    $discount = calculateDiscount((float)$product['price'], (float)$product['mrp']);
                ?>
                    <a href="product.php?id=<?= urlencode($product['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($product['name']) ?> - <?= formatPrice($product['price']) ?>">
                        
                        <!-- Top row: Badge Reduction / Stock & Rating -->
                        <div class="prod-card-top">
                            <div class="flex items-center gap-1">
                                <?php if ($discount > 0): ?>
                                    <span class="prod-badge-discount">-<?= $discount ?>%</span>
                                <?php else: ?>
                                    <span class="prod-badge-stock">En stock</span>
                                <?php endif; ?>
                            </div>

                            <div class="prod-rating">
                                <span>★</span>
                                <span style="color:#64748B;font-size:10px;">4.9</span>
                            </div>
                        </div>

                        <!-- Product Image -->
                        <div class="prod-card-img-wrap">
                            <img src="<?= htmlspecialchars($mainImg) ?>" alt="<?= htmlspecialchars($product['name']) ?>" width="180" height="180" loading="lazy" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;">
                        </div>

                        <!-- Product Details -->
                        <div class="prod-card-body">
                            <div>
                                <span class="prod-cat-text">
                                    <?= htmlspecialchars($product['category'] ?? '') ?>
                                </span>
                                <h3 class="prod-name-text">
                                    <?= htmlspecialchars($product['name']) ?>
                                </h3>
                            </div>

                            <!-- Price Section (No Button) -->
                            <div class="prod-price-row">
                                <span class="prod-price-val">
                                    <?= formatPrice($product['price']) ?>
                                </span>
                                <?php if ($product['mrp'] > $product['price']): ?>
                                    <span class="prod-price-old">
                                        <?= formatPrice($product['mrp']) ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                        </div>

                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
