<?php
require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $pid = sanitize($_POST['product_id'] ?? '');
    if ($_POST['action'] === 'toggle' && $pid) {
        toggleWishlist($pid);
    } elseif ($_POST['action'] === 'add_all_to_cart') {
        $wItems = getWishlistItems();
        foreach ($wItems as $wid) {
            addToCart($wid, 1);
        }
        setFlashMessage('success', 'Tous les articles de vos favoris ont été ajoutés au panier !');
        header('Location: cart.php');
        exit;
    }
}

$wishlistIds = getWishlistItems();
$products = [];

if (!empty($wishlistIds)) {
    if ($pdo) {
        try {
            $placeholders = implode(',', array_fill(0, count($wishlistIds), '?'));
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
            $stmt->execute($wishlistIds);
            $products = $stmt->fetchAll();
        } catch (Throwable $e) {
            $products = [];
        }
    }
    
    if (empty($products)) {
        foreach ($wishlistIds as $wid) {
            $p = getProductById($wid);
            if ($p) $products[] = $p;
        }
    }
}

$pageTitle = "Ma Liste d'Envies";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-8 flex-1 space-y-6">

    <!-- Breadcrumbs Navigation -->
    <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#667085] flex items-center gap-1.5">
        <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
        <span class="text-[#98A2B3]">/</span>
        <span class="text-[#182230] font-bold" aria-current="page">Mes Favoris</span>
    </nav>

    <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#182230] tracking-tight">Ma Liste d'Envies (<?= count($products) ?>)</h1>
            <p class="text-xs text-[#667085] mt-0.5">Retrouvez vos coups de cœur et commandez en un clic.</p>
        </div>
        
        <div class="flex items-center gap-2">
            <?php if (!empty($products)): ?>
                <form action="wishlist.php" method="POST">
                    <?= getCSRFInputField() ?>
                    <input type="hidden" name="action" value="add_all_to_cart">
                    <button type="submit" class="cursor-pointer inline-flex items-center gap-1.5 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        <span>Tout ajouter au Panier</span>
                    </button>
                </form>
            <?php endif; ?>
            <a href="shop.php" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:text-[#0B54C2] transition-colors duration-200 hover:underline">Découvrir d'autres produits →</a>
        </div>
    </div>

    <?php if (empty($products)): ?>
        <div class="bg-white rounded-3xl p-8 sm:p-14 border border-[#E1E8F0] shadow-2xs text-center space-y-6 max-w-xl mx-auto animate-fade-in">
            <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <i data-lucide="heart" class="w-10 h-10"></i>
            </div>
            <div class="space-y-2">
                <h2 class="text-xl font-black text-[#182230] tracking-tight">Aucun favori enregistré pour le moment</h2>
                <p class="text-xs text-[#667085] leading-relaxed max-w-md mx-auto">Cliquez sur le cœur d'un produit pour le conserver dans votre liste d'envies et recevoir des alertes de baisse de prix.</p>
            </div>

            <!-- Suggestions de découverte active -->
            <div class="space-y-3 pt-2">
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] block">Nos Meilleures Ventes</span>
                <div class="flex flex-wrap items-center justify-center gap-2">
                    <a href="shop.php?collection=flash" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">🔥 Ventes Flash -35%</a>
                    <a href="shop.php?category=audio-ecouteurs" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">🎧 Casques & Audio</a>
                    <a href="shop.php?category=montres-objets-connectes" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">⌚ Montres Sport</a>
                </div>
            </div>

            <div class="pt-4 border-t border-[#E8EDF3]">
                <a href="shop.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-8 py-3.5 rounded-full shadow-apple-soft transition-all active:scale-95">
                    <i data-lucide="compass" class="w-4 h-4"></i>
                    <span>Explorer la Collection</span>
                </a>
            </div>
        </div>
    <?php else: ?>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <?php foreach ($products as $product): 
                $images = getProductImages($product['images'] ?? null, 'assets/images/hero_product_img1.webp');
                $mainImg = $images[0] ?? 'assets/images/hero_product_img1.webp';
                $discount = calculateDiscount((float)$product['price'], (float)$product['mrp']);
            ?>
                <div class="relative group">
                    <a href="product.php?id=<?= urlencode($product['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($product['name']) ?> - <?= formatPrice($product['price']) ?>">
                        
                        <!-- Top row: Badge Reduction / Stock -->
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
                            <img src="<?= htmlspecialchars($mainImg) ?>" alt="<?= htmlspecialchars($product['name']) ?> - SenTechPLUS" width="180" height="180" loading="lazy" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;">
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

                    <!-- Wishlist Actions Overlay (Add to Cart & Remove) -->
                    <div class="absolute top-2 right-2 z-10 flex items-center gap-1.5" onclick="event.stopPropagation();">
                        <!-- Direct Add to Cart -->
                        <button type="button" onclick="addToCart('<?= htmlspecialchars($product['id']) ?>', 1)" class="cursor-pointer w-7 h-7 rounded-full bg-white/95 hover:bg-[#1677FF] text-[#1677FF] hover:text-white flex items-center justify-center transition-all shadow-xs" title="Ajouter au Panier" aria-label="Ajouter au Panier">
                            <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                        </button>

                        <!-- Remove from Wishlist -->
                        <form action="wishlist.php" method="POST" class="inline">
                            <?= getCSRFInputField() ?>
                            <input type="hidden" name="action" value="toggle">
                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                            <button type="submit" class="cursor-pointer w-7 h-7 rounded-full bg-white/95 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-all shadow-xs" title="Retirer des favoris" aria-label="Retirer des favoris">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                        </form>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    <?php endif; ?>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
