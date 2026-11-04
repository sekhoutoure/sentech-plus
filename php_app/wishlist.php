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

$pageTitle = "Mes Favoris (" . count($products) . ") — SenTechPLUS";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="min-h-screen bg-[#F8FAFD] py-5 sm:py-9 pb-32 lg:pb-12">
    <div class="max-w-[1360px] mx-auto px-3 sm:px-6 space-y-6">

        <!-- Fil d'Ariane & Titre Apple Minimal -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#64748B] flex items-center gap-1.5 mb-1">
                    <a href="index.php" class="hover:text-[#1677FF] transition-colors flex items-center gap-1">
                        <i data-lucide="home" class="w-3.5 h-3.5"></i>
                        <span>Accueil</span>
                    </a>
                    <span class="text-[#CBD5E1]">/</span>
                    <span class="text-[#1D1D1F] font-bold" aria-current="page">Mes Favoris</span>
                </nav>
                <h1 class="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight flex items-center gap-2.5">
                    <span>Mes Favoris</span>
                    <span class="text-xs font-extrabold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-200/50">
                        <?= count($products) ?> <?= count($products) > 1 ? 'articles' : 'article' ?>
                    </span>
                </h1>
            </div>

            <div class="flex items-center gap-2.5 flex-wrap">
                <?php if (!empty($products)): ?>
                    <form action="wishlist.php" method="POST" class="inline">
                        <?= getCSRFInputField() ?>
                        <input type="hidden" name="action" value="add_all_to_cart">
                        <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0B54C2] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95">
                            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                            <span>Tout ajouter au panier</span>
                        </button>
                    </form>
                <?php endif; ?>
                <a href="shop.php" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:text-[#0B54C2] transition-colors flex items-center gap-1 active:scale-95">
                    <span>Découvrir le catalogue</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </a>
            </div>
        </div>

        <?php if (empty($products)): ?>
            <!-- ─── ÉTAT VIDE : DÉCOUVERTE ACTIVE & ÉLÉGANCE APPLE ─── -->
            <div class="bg-white rounded-[32px] p-8 sm:p-14 border border-slate-200/80 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.06)] text-center space-y-6 max-w-xl mx-auto">
                <div class="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-rose-500/10">
                    <i data-lucide="heart" class="w-10 h-10"></i>
                </div>
                <div class="space-y-2">
                    <h2 class="text-xl font-black text-[#1D1D1F] tracking-tight">Aucun favori pour le moment</h2>
                    <p class="text-xs text-[#64748B] leading-relaxed max-w-md mx-auto">Appuyez sur le cœur d'un produit pour l'enregistrer dans vos favoris et suivre ses baisses de prix.</p>
                </div>

                <!-- Suggestions Rapides -->
                <div class="space-y-2.5 pt-1">
                    <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#94A3B8] block">Catégories Populaires</span>
                    <div class="flex flex-wrap items-center justify-center gap-2">
                        <a href="shop.php?collection=flash" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#1677FF] text-[#1D1D1F] hover:text-white transition-all border border-[#E8EDF3] active:scale-95">🔥 Ventes Flash Dakar</a>
                        <a href="shop.php?category=audio-ecouteurs" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#1677FF] text-[#1D1D1F] hover:text-white transition-all border border-[#E8EDF3] active:scale-95">🎧 Écouteurs & Casques</a>
                        <a href="shop.php?category=montres-objets-connectes" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#1677FF] text-[#1D1D1F] hover:text-white transition-all border border-[#E8EDF3] active:scale-95">⌚ Montres Connectées</a>
                    </div>
                </div>

                <div class="pt-3 border-t border-[#F1F3F7]">
                    <a href="shop.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0B54C2] text-white font-extrabold text-xs px-8 py-3.5 rounded-full shadow-[0_8px_20px_rgba(22,119,255,0.25)] transition-all active:scale-95">
                        <i data-lucide="compass" class="w-4 h-4"></i>
                        <span>Explorer la boutique</span>
                    </a>
                </div>
            </div>

        <?php else: ?>

            <!-- ─── GRILLE DES FAVORIS (Cartes Apple Ergonomiques) ─── -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                <?php foreach ($products as $product): 
                    $images = getProductImages($product['images'] ?? null, 'assets/images/hero_product_img1.webp');
                    $mainImg = $images[0] ?? 'assets/images/hero_product_img1.webp';
                    $discount = calculateDiscount((float)$product['price'], (float)$product['mrp']);
                ?>
                    <div class="relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-apple-hover hover:border-[#1677FF]/30 transition-all flex flex-col justify-between group">
                        
                        <!-- Top Row: Badge + Bouton Retirer des Favoris -->
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <div>
                                <?php if ($discount > 0): ?>
                                    <span class="text-[9px] sm:text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full">
                                        -<?= $discount ?>%
                                    </span>
                                <?php else: ?>
                                    <span class="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                                        ⚡ En Stock
                                    </span>
                                <?php endif; ?>
                            </div>

                            <!-- Bouton Supprimer des Favoris -->
                            <form action="wishlist.php" method="POST" class="inline" onsubmit="return confirm('Retirer ce produit de vos favoris ?');">
                                <?= getCSRFInputField() ?>
                                <input type="hidden" name="action" value="toggle">
                                <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                                <button type="submit" class="cursor-pointer w-8 h-8 rounded-full bg-[#F8FAFD] hover:bg-rose-50 text-rose-500 hover:text-rose-600 flex items-center justify-center transition-all active:scale-90" title="Retirer des favoris" aria-label="Retirer">
                                    <i data-lucide="heart" class="w-4 h-4 fill-rose-500 text-rose-500"></i>
                                </button>
                            </form>
                        </div>

                        <!-- Vignette Produit avec lien vers fiche -->
                        <a href="product.php?id=<?= urlencode($product['id']) ?>" class="block my-2 w-full aspect-square rounded-2xl bg-[#F8FAFD] p-3 flex items-center justify-center overflow-hidden group-hover:bg-[#EAF3FF]/30 transition-all">
                            <img src="<?= htmlspecialchars($mainImg) ?>" alt="<?= htmlspecialchars($product['name']) ?> - SenTechPLUS" width="200" height="200" loading="lazy" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300">
                        </a>

                        <!-- Informations Textuelles & Prix -->
                        <div class="space-y-1.5 pt-1">
                            <span class="text-[9px] sm:text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider block truncate">
                                <?= htmlspecialchars($product['category'] ?? 'High-Tech') ?>
                            </span>

                            <h3 class="text-xs sm:text-sm font-bold text-[#1D1D1F] group-hover:text-[#1677FF] transition-colors line-clamp-2 leading-snug">
                                <a href="product.php?id=<?= urlencode($product['id']) ?>"><?= htmlspecialchars($product['name']) ?></a>
                            </h3>

                            <div class="flex items-baseline gap-2 pt-1">
                                <span class="text-sm sm:text-base font-black text-[#1D1D1F]">
                                    <?= formatPrice($product['price']) ?>
                                </span>
                                <?php if ($product['mrp'] > $product['price']): ?>
                                    <span class="text-[11px] font-semibold text-[#94A3B8] line-through">
                                        <?= formatPrice($product['mrp']) ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <!-- Bouton Ajouter au Panier 1-Clic -->
                        <div class="pt-3 border-t border-slate-100 mt-2">
                            <button type="button" onclick="addToCart('<?= htmlspecialchars($product['id']) ?>', 1)" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer w-full py-2.5 px-3 rounded-xl bg-[#1677FF] hover:bg-[#0B54C2] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95">
                                <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
                                <span>Ajouter au panier</span>
                            </button>
                        </div>

                    </div>
                <?php endforeach; ?>
            </div>

        <?php endif; ?>

    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
