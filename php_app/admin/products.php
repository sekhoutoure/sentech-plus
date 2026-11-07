<?php
define('IS_ADMIN_AREA', true);
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';
$messageType = 'success';

// Handle Product Creation / Editing / Deletion / Status Toggle
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if (!$pdo) {
        $message = "Connexion MySQL inactive. Impossible d'enregistrer les modifications de produit.";
        $messageType = 'error';
    } elseif (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        if ($action === 'create_product' || $action === 'edit_product') {
            $pid = ($action === 'edit_product') ? sanitize($_POST['product_id'] ?? '') : ('prod_' . uniqid());
            $sku = sanitize($_POST['sku'] ?? ('ST-' . strtoupper(substr(uniqid(), -6))));
            $name = sanitize($_POST['name'] ?? '');
            $categoryId = sanitize($_POST['category_id'] ?? '');
            $subcategoryId = sanitize($_POST['subcategory_id'] ?? '');
            $brand = sanitize($_POST['brand'] ?? '');
            $price = (float)($_POST['price'] ?? 0);
            $mrp = (float)($_POST['mrp'] ?? $price);
            $discountPercent = $mrp > $price ? (int)round((($mrp - $price) / $mrp) * 100) : 0;
            $stock = (int)($_POST['stock'] ?? 10);
            $status = sanitize($_POST['status'] ?? 'active');
            $stockStatus = ($stock > 5) ? 'in_stock' : (($stock > 0) ? 'low_stock' : 'out_of_stock');
            if ($status === 'draft' || $status === 'archived') $stockStatus = $status;
            
            $description = sanitize($_POST['description'] ?? '');
            $imagePath = sanitize($_POST['image_url'] ?? 'assets/images/product_img1.webp');
            
            // Advanced Enterprise Attributes & Badges
            $connectionType = sanitize($_POST['connection_type'] ?? '');
            $compatibility = sanitize($_POST['compatibility'] ?? '');
            $power = sanitize($_POST['power'] ?? '');
            $capacity = sanitize($_POST['capacity'] ?? '');
            $usageType = sanitize($_POST['usage_type'] ?? '');
            $warranty = sanitize($_POST['warranty'] ?? 'Garantie 30 jours');
            $color = sanitize($_POST['color'] ?? '');
            
            $isNew = isset($_POST['is_new']) ? 1 : 0;
            $isBestSeller = isset($_POST['is_best_seller']) ? 1 : 0;
            $isFlashSale = isset($_POST['is_flash_sale']) ? 1 : 0;
            $isExpressDelivery = isset($_POST['is_express_delivery']) ? 1 : 0;
            $isLimitedStock = isset($_POST['is_limited_stock']) ? 1 : 0;
            $isFeatured = isset($_POST['is_featured']) ? 1 : 0;
            $isActive = ($status === 'active') ? 1 : 0;

            // Resolve Category Names
            $categoryName = 'Audio & Écouteurs';
            $subcategoryName = null;
            if ($categoryId && $pdo) {
                try {
                    $stmtC = $pdo->prepare("SELECT name FROM categories WHERE id = :id LIMIT 1");
                    $stmtC->execute([':id' => $categoryId]);
                    $categoryName = $stmtC->fetchColumn() ?: 'Général';
                } catch (Throwable $e) {}
            }
            if ($subcategoryId && $pdo) {
                try {
                    $stmtSc = $pdo->prepare("SELECT name FROM categories WHERE id = :id LIMIT 1");
                    $stmtSc->execute([':id' => $subcategoryId]);
                    $subcategoryName = $stmtSc->fetchColumn() ?: null;
                } catch (Throwable $e) {}
            }

            // Handle file upload securely via SecureUploader
            if (!empty($_FILES['product_image']['name'])) {
                $uploadRes = SecureUploader::processImageUpload($_FILES['product_image'], 'products', 1200, 1200);
                if ($uploadRes['success']) {
                    $imagePath = $uploadRes['path'];
                } else {
                    $message = $uploadRes['error'] ?? "Format d'image non valide (seuls JPG, PNG, WEBP max 5Mo sont autorisés).";
                    $messageType = 'error';
                }
            }


            if (!empty($name) && $price > 0 && $pdo) {
                try {
                    if ($action === 'create_product') {
                        $stmtStore = $pdo->query("SELECT id FROM stores LIMIT 1");
                        $store = $stmtStore ? $stmtStore->fetch() : null;
                        $storeId = $store ? $store['id'] : 'store_sentech';

                        $stmtIns = $pdo->prepare("INSERT INTO products 
                            (id, sku, store_id, category_id, subcategory_id, category, subcategory, brand, name, description, mrp, price, discount_percent, images, in_stock, stock, stock_status, status, is_active, is_featured, is_new, is_best_seller, is_flash_sale, is_express_delivery, is_limited_stock, connection_type, compatibility, power, capacity, usage_type, warranty, color, sales_count) 
                            VALUES (:id, :sku, :sid, :cid, :scid, :cat, :subcat, :brand, :name, :desc, :mrp, :price, :disc, :imgs, :in_stock, :stock, :stk_stat, :stat, :act, :feat, :new, :best, :flash, :exp, :lim, :conn, :comp, :power, :cap, :usage, :warr, :color, 0)");
                        $stmtIns->execute([
                            ':id' => $pid,
                            ':sku' => $sku,
                            ':sid' => $storeId,
                            ':cid' => $categoryId ?: null,
                            ':scid' => $subcategoryId ?: null,
                            ':cat' => $categoryName,
                            ':subcat' => $subcategoryName,
                            ':brand' => $brand,
                            ':name' => $name,
                            ':desc' => $description,
                            ':mrp' => $mrp,
                            ':price' => $price,
                            ':disc' => $discountPercent,
                            ':imgs' => json_encode([$imagePath]),
                            ':in_stock' => $stock > 0 ? 1 : 0,
                            ':stock' => $stock,
                            ':stk_stat' => $stockStatus,
                            ':stat' => $status,
                            ':act' => $isActive,
                            ':feat' => $isFeatured,
                            ':new' => $isNew,
                            ':best' => $isBestSeller,
                            ':flash' => $isFlashSale,
                            ':exp' => $isExpressDelivery,
                            ':lim' => $isLimitedStock,
                            ':conn' => $connectionType,
                            ':comp' => $compatibility,
                            ':power' => $power,
                            ':cap' => $capacity,
                            ':usage' => $usageType,
                            ':warr' => $warranty,
                            ':color' => $color
                        ]);
                        $message = "Produit « $name » créé avec succès !";
                        $messageType = 'success';
                    } else {
                        // Edit product
                        $stmtUpd = $pdo->prepare("UPDATE products SET 
                            sku = :sku, category_id = :cid, subcategory_id = :scid, category = :cat, subcategory = :subcat, 
                            brand = :brand, name = :name, description = :desc, mrp = :mrp, price = :price, 
                            discount_percent = :disc, in_stock = :in_stock, stock = :stock, stock_status = :stk_stat, status = :stat, is_active = :act, 
                            is_featured = :feat, is_new = :new, is_best_seller = :best, is_flash_sale = :flash, is_express_delivery = :exp, is_limited_stock = :lim,
                            connection_type = :conn, compatibility = :comp, power = :power, capacity = :cap, usage_type = :usage, warranty = :warr, color = :color
                            WHERE id = :id");
                        $stmtUpd->execute([
                            ':id' => $pid,
                            ':sku' => $sku,
                            ':cid' => $categoryId ?: null,
                            ':scid' => $subcategoryId ?: null,
                            ':cat' => $categoryName,
                            ':subcat' => $subcategoryName,
                            ':brand' => $brand,
                            ':name' => $name,
                            ':desc' => $description,
                            ':mrp' => $mrp,
                            ':price' => $price,
                            ':disc' => $discountPercent,
                            ':in_stock' => $stock > 0 ? 1 : 0,
                            ':stock' => $stock,
                            ':stk_stat' => $stockStatus,
                            ':stat' => $status,
                            ':act' => $isActive,
                            ':feat' => $isFeatured,
                            ':new' => $isNew,
                            ':best' => $isBestSeller,
                            ':flash' => $isFlashSale,
                            ':exp' => $isExpressDelivery,
                            ':lim' => $isLimitedStock,
                            ':conn' => $connectionType,
                            ':comp' => $compatibility,
                            ':power' => $power,
                            ':cap' => $capacity,
                            ':usage' => $usageType,
                            ':warr' => $warranty,
                            ':color' => $color
                        ]);

                        if (!empty($_FILES['product_image']['name'])) {
                            $stmtImg = $pdo->prepare("UPDATE products SET images = :imgs WHERE id = :id");
                            $stmtImg->execute([':id' => $pid, ':imgs' => json_encode([$imagePath])]);
                        }

                        $message = "Produit « $name » mis à jour avec succès !";
                        $messageType = 'success';
                    }
                } catch (Throwable $e) {
                    $message = "Erreur base de données : " . htmlspecialchars($e->getMessage());
                    $messageType = 'error';
                }
            }
        } elseif ($action === 'toggle_status') {
            $pid = sanitize($_POST['product_id'] ?? '');
            if ($pid && $pdo) {
                try {
                    $stmtT = $pdo->prepare("UPDATE products SET is_active = IF(is_active = 1, 0, 1) WHERE id = :id");
                    $stmtT->execute([':id' => $pid]);
                    $message = "Statut d'activation du produit modifié.";
                    $messageType = 'success';
                } catch (Throwable $e) {}
            }
        } elseif ($action === 'delete_product') {
            $pid = sanitize($_POST['product_id'] ?? '');
            if ($pid && $pdo) {
                try {
                    $stmtDel = $pdo->prepare("DELETE FROM products WHERE id = :id");
                    $stmtDel->execute([':id' => $pid]);
                    $message = "Produit supprimé avec succès.";
                    $messageType = 'success';
                } catch (Throwable $e) {
                    $message = "Impossible de supprimer ce produit.";
                    $messageType = 'error';
                }
            }
        }
    }
}

// Fetch Categories & Products
$catTree = getAllCategoriesTree();
$products = [];
if ($pdo) {
    try {
        $stmtAll = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
        $products = $stmtAll ? $stmtAll->fetchAll() : [];
    } catch (Throwable $e) {
        $products = [];
    }
}
if (empty($products)) {
    // Fallback Mock Catalogue
    $products = [
        ['id' => 'prod_1', 'sku' => 'ST-CAS-01', 'name' => 'Casque Studio Pro Sans Fil ANC', 'category' => 'Audio & Écouteurs', 'subcategory' => 'Casques audio', 'brand' => 'Sony', 'price' => 45000, 'mrp' => 55000, 'images' => '["assets/images/product_img4.webp"]', 'stock' => 15, 'is_active' => 1, 'is_new' => 1, 'is_best_seller' => 1, 'is_flash_sale' => 1, 'is_express_delivery' => 1, 'connection_type' => 'Bluetooth 5.3', 'compatibility' => 'iPhone, Android, PC', 'power' => '30mW', 'capacity' => '800mAh (40h)', 'usage_type' => 'bureau', 'warranty' => 'Garantie 30 jours', 'color' => 'Noir Sidéral', 'description' => 'Réduction active du bruit ; Autonomie 40h ; Audio Hi-Res.'],
        ['id' => 'prod_2', 'sku' => 'ST-WAT-02', 'name' => 'Montre Connectée Sport V3 AMOLED', 'category' => 'Montres & Objets Connectés', 'subcategory' => 'Montres connectées', 'brand' => 'Samsung', 'price' => 32000, 'mrp' => 40000, 'images' => '["assets/images/product_img8.webp"]', 'stock' => 4, 'is_active' => 1, 'is_new' => 0, 'is_best_seller' => 1, 'is_flash_sale' => 1, 'is_express_delivery' => 1, 'connection_type' => 'Bluetooth 5.2', 'compatibility' => 'iOS & Android', 'power' => '5W', 'capacity' => '350mAh', 'usage_type' => 'sport', 'warranty' => 'Garantie 6 mois', 'color' => 'Noir Carbone', 'description' => 'Écran AMOLED 1.43" ; Appels Bluetooth ; Capteur SpO2.'],
        ['id' => 'prod_4', 'sku' => 'ST-EAR-04', 'name' => 'Écouteurs True Wireless Bass+ Pro', 'category' => 'Audio & Écouteurs', 'subcategory' => 'Écouteurs sans fil', 'brand' => 'Anker', 'price' => 19500, 'mrp' => 25000, 'images' => '["assets/images/product_img1.webp"]', 'stock' => 25, 'is_active' => 1, 'is_new' => 1, 'is_best_seller' => 1, 'is_flash_sale' => 1, 'is_express_delivery' => 1, 'connection_type' => 'Bluetooth 5.3', 'compatibility' => 'iPhone & Android', 'power' => 'USB-C', 'capacity' => '500mAh', 'usage_type' => 'sport', 'warranty' => 'Garantie 30 jours', 'color' => 'Blanc Perle', 'description' => 'Drivers 10mm graphène ; Basses profondes ; Micro 4-mic ENC.'],
        ['id' => 'prod_6', 'sku' => 'ST-CHG-06', 'name' => 'Chargeur Rapide GaN 65W Multi-Port', 'category' => 'Téléphones & Accessoires', 'subcategory' => 'Chargeurs & câbles', 'brand' => 'Baseus', 'price' => 14000, 'mrp' => 18000, 'images' => '["assets/images/product_img7.webp"]', 'stock' => 30, 'is_active' => 1, 'is_new' => 1, 'is_best_seller' => 0, 'is_flash_sale' => 0, 'is_express_delivery' => 1, 'connection_type' => 'USB-C + USB-A', 'compatibility' => 'iPhone, Samsung, MacBook', 'power' => '65W GaN', 'capacity' => '3 Ports', 'usage_type' => 'maison', 'warranty' => 'Garantie 6 mois', 'color' => 'Noir Mat', 'description' => 'Technologie GaN III compacte ; 2 USB-C + 1 USB-A.']
    ];
}

$pageTitle = "Gestion des Produits — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen bg-[#F3F7FC] flex">

    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen">
        
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="package-check" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Catalogue Produits Entreprise</span>
                </h1>
            </div>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <!-- Header Title & Action Button -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 class="text-2xl font-black text-[#182230]">Gestion des Fiches Produits</h2>
                    <p class="text-xs text-[#667085] mt-1">Créez et configurez des fiches complètes avec variantes (couleurs, capacités), fiche technique et prix.</p>
                </div>
                <button type="button" onclick="openNewProductModal()" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all active:scale-95">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    <span>+ Ajouter un Produit</span>
                </button>
            </div>

            <!-- Products List Table -->
            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-[#E8EDF3] flex flex-wrap items-center justify-between gap-3 bg-[#F8FBFF]">
                    <span class="text-xs font-black text-[#182230] uppercase tracking-wider">Catalogue Actif (<?= count($products) ?> articles)</span>
                    <span class="text-[11px] font-bold text-[#0B54C2] bg-[#EAF3FF] px-2.5 py-1 rounded-full">
                        ✨ Synchronisé MySQL & Hostinger
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-3.5 pl-5">Article & SKU</th>
                                <th class="p-3.5">Rayon / Marque</th>
                                <th class="p-3.5">Prix FCFA</th>
                                <th class="p-3.5">Stock & Statut</th>
                                <th class="p-3.5">Badges</th>
                                <th class="p-3.5">État</th>
                                <th class="p-3.5 pr-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (!empty($products)): ?>
                                <?php foreach ($products as $p): 
                                    $pImg = getProductMainImage($p, 'assets/images/product_img1.webp');
                                ?>
                                    <tr class="hover:bg-[#F8FBFF] transition-colors">
                                        <td class="p-3.5 pl-5">
                                            <div class="flex items-center gap-3">
                                                <div class="w-11 h-11 rounded-xl bg-[#F3F7FC] p-1 border border-[#E8EDF3] flex items-center justify-center shrink-0">
                                                    <img src="../<?= htmlspecialchars($pImg) ?>" alt="<?= htmlspecialchars($p['name']) ?>" width="44" height="44" style="aspect-ratio:1/1;" class="max-h-full max-w-full object-contain" decoding="async">
                                                </div>
                                                <div class="min-w-0">
                                                    <a href="../product.php?id=<?= urlencode($p['id']) ?>" target="_blank" class="font-bold text-[#182230] hover:text-[#1677FF] transition-colors truncate block max-w-xs">
                                                        <?= htmlspecialchars($p['name']) ?>
                                                    </a>
                                                    <span class="text-[10px] font-mono text-[#98A2B3] block">
                                                        SKU: <?= htmlspecialchars($p['sku'] ?? $p['id']) ?>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="p-3.5">
                                            <span class="font-bold text-[#0B54C2] block"><?= htmlspecialchars($p['category']) ?></span>
                                            <?php if (!empty($p['brand'])): ?>
                                                <span class="text-[10px] font-extrabold text-[#182230] bg-[#F3F7FC] px-1.5 py-0.5 rounded inline-block mt-0.5"><?= htmlspecialchars($p['brand']) ?></span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="p-3.5">
                                            <span class="font-black text-[#182230] text-sm"><?= formatPrice($p['price']) ?></span>
                                            <?php if ($p['mrp'] > $p['price']): ?>
                                                <span class="text-[10px] text-rose-600 font-bold block">-<?= round((($p['mrp'] - $p['price']) / $p['mrp']) * 100) ?>%</span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="p-3.5">
                                            <?php if ($p['stock'] > 5): ?>
                                                <span class="bg-[#0D7D53]/10 text-[#0D7D53] font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                                    <i data-lucide="check" class="w-3 h-3"></i> En stock (<?= $p['stock'] ?>)
                                                </span>
                                            <?php elseif ($p['stock'] > 0): ?>
                                                <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                                    <i data-lucide="alert-triangle" class="w-3 h-3"></i> Limité (<?= $p['stock'] ?>)
                                                </span>
                                            <?php else: ?>
                                                <span class="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1">
                                                    <i data-lucide="x-circle" class="w-3 h-3"></i> Rupture
                                                </span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="p-3.5">
                                            <div class="flex flex-wrap gap-1">
                                                <?php if (!empty($p['is_new'])): ?><span class="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">Nouveau</span><?php endif; ?>
                                                <?php if (!empty($p['is_flash_sale'])): ?><span class="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">⚡ Flash</span><?php endif; ?>
                                                <?php if (!empty($p['is_express_delivery'])): ?><span class="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">🚚 Express</span><?php endif; ?>
                                                <?php if (!empty($p['is_best_seller'])): ?><span class="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">🔥 Best-seller</span><?php endif; ?>
                                            </div>
                                        </td>
                                        <td class="p-3.5">
                                            <form method="POST" action="products.php" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="toggle_status">
                                                <input type="hidden" name="product_id" value="<?= htmlspecialchars($p['id']) ?>">
                                                <button type="submit" class="cursor-pointer px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors <?= !empty($p['is_active']) ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
                                                    <?= !empty($p['is_active']) ? '🟢 Actif' : '⚪ Désactivé' ?>
                                                </button>
                                            </form>
                                        </td>
                                        <td class="p-3.5 pr-5 text-right">
                                            <div class="flex items-center justify-end gap-1.5">
                                                <a href="product_media.php?product_id=<?= urlencode($p['id']) ?>" class="cursor-pointer p-1.5 hover:bg-[#EAF3FF] text-[#1677FF] rounded-lg transition-colors" title="Gérer photos multi-angles et vidéo démo">
                                                    <i data-lucide="film" class="w-4 h-4"></i>
                                                </a>
                                                <button type="button" onclick='openEditProductModal(<?= json_encode($p) ?>)' class="cursor-pointer p-1.5 hover:bg-[#EAF3FF] text-[#0B54C2] rounded-lg transition-colors" title="Modifier la fiche">
                                                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                                                </button>
                                                <form method="POST" action="products.php" onsubmit="return confirm('Supprimer définitivement ce produit ?');" class="inline">
                                                    <?= getCSRFInputField() ?>
                                                    <input type="hidden" name="action" value="delete_product">
                                                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($p['id']) ?>">
                                                    <button type="submit" class="cursor-pointer p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Supprimer">
                                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="7" class="p-8 text-center text-xs text-[#667085]">
                                        Aucun produit dans le catalogue. Cliquez sur "+ Ajouter un Produit".
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    </main>

</div>

<!-- Modal Ajouter / Modifier Produit Entreprise -->
<div id="product-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
            <div>
                <h3 id="pmodal-title" class="text-base font-black text-[#182230]">Nouvelle Fiche Produit High-Tech</h3>
                <p class="text-[11px] text-[#667085]">Structure conforme aux standards Apple, Alibaba et Amazon</p>
            </div>
            <button type="button" onclick="closeProductModal()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" action="products.php" enctype="multipart/form-data" class="space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" id="pform-action" value="create_product">
            <input type="hidden" name="product_id" id="pform-id" value="">

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                    <label class="block font-bold text-[#182230] mb-1">Nom du Produit *</label>
                    <input type="text" name="name" id="pform-name" required placeholder="Ex: Casque Studio Pro Sans Fil ANC" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Code SKU / Référence</label>
                    <input type="text" name="sku" id="pform-sku" placeholder="Ex: ST-CAS-01" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none font-mono">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Catégorie Principale *</label>
                    <select name="category_id" id="pform-category" required onchange="onCategoryChange(this.value)" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                        <option value="">Sélectionner</option>
                        <?php foreach ($catTree as $cat): ?>
                            <option value="<?= htmlspecialchars($cat['id']) ?>"><?= htmlspecialchars($cat['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Sous-catégorie / Rayon</label>
                    <select name="subcategory_id" id="pform-subcategory" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-semibold">
                        <option value="">-- Aucune / Général --</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Marque</label>
                    <input type="text" name="brand" id="pform-brand" placeholder="Sony, Apple, Samsung, JBL..." class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Prix Vente FCFA *</label>
                    <input type="number" name="price" id="pform-price" required min="0" step="500" placeholder="45000" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-black text-[#1677FF]">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Ancien Prix / Barré (FCFA)</label>
                    <input type="number" name="mrp" id="pform-mrp" min="0" step="500" placeholder="55000" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Stock Disponible</label>
                    <input type="number" name="stock" id="pform-stock" min="0" value="10" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
            </div>

            <!-- Attributs Techniques Avancés -->
            <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-3">
                <span class="font-extrabold text-[#182230] block text-[11px] uppercase tracking-wider">Attributs & Fiche Technique Clé / Valeur</span>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                        <label class="block font-bold text-[#667085] mb-1 text-[10px]">Type de Connexion</label>
                        <select name="connection_type" id="pform-conn" class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                            <option value="">Non spécifié</option>
                            <option value="Bluetooth 5.3">Bluetooth Sans Fil</option>
                            <option value="USB-C">USB-C Filaire</option>
                            <option value="Jack 3.5mm">Jack 3.5mm</option>
                            <option value="Wi-Fi">Wi-Fi Connecté</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-[#667085] mb-1 text-[10px]">Compatibilité</label>
                        <input type="text" name="compatibility" id="pform-comp" placeholder="iPhone, Android, PC..." class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-[#667085] mb-1 text-[10px]">Puissance / Capacité</label>
                        <input type="text" name="power" id="pform-power" placeholder="65W GaN / 40h..." class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-[#667085] mb-1 text-[10px]">Garantie Dakar</label>
                        <input type="text" name="warranty" id="pform-warr" placeholder="Garantie 30 jours" class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Image URL (ou chemin existant)</label>
                    <input type="text" name="image_url" id="pform-image" placeholder="assets/images/product_img4.webp" class="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Téléverser Nouvelle Image</label>
                    <input type="file" name="product_image" accept="image/webp,image/png,image/jpeg" class="w-full px-3 py-1.5 rounded-xl border border-[#E8EDF3] outline-none bg-[#F3F7FC] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1677FF] file:text-white">
                </div>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Description & Caractéristiques (séparer par des ; pour générer des puces)</label>
                <textarea name="description" id="pform-desc" rows="3" placeholder="Réduction active du bruit ; Autonomie 40h ; Audio Hi-Res certifié..." class="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
            </div>

            <!-- Badges Marketing -->
            <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-2">
                <span class="font-extrabold text-[#182230] block text-[11px] uppercase tracking-wider">Badges Marketing & Collections</span>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <label class="flex items-center gap-1.5 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_new" id="pform-new" value="1" class="accent-[#1677FF]">
                        <span>✨ Nouveauté</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_best_seller" id="pform-best" value="1" class="accent-[#1677FF]">
                        <span>🔥 Best-seller</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_flash_sale" id="pform-flash" value="1" class="accent-[#1677FF]">
                        <span>⚡ Vente Flash</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_express_delivery" id="pform-exp" value="1" checked class="accent-[#1677FF]">
                        <span>🚚 Express Dakar</span>
                    </label>
                    <label class="flex items-center gap-1.5 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_featured" id="pform-featured" value="1" class="accent-[#1677FF]">
                        <span>★ En Vedette Accueil</span>
                    </label>
                </div>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2.5">
                <button type="button" onclick="closeProductModal()" class="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8EDF3] text-[#667085] font-bold hover:bg-[#F3F7FC]">
                    Annuler
                </button>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all">
                    Enregistrer la Fiche Produit
                </button>
            </div>
        </form>
    </div>
</div>

<script>
const categoriesData = <?= json_encode($catTree) ?>;

function onCategoryChange(parentId, selectedSubId = null) {
    const subSelect = document.getElementById('pform-subcategory');
    subSelect.innerHTML = '<option value="">-- Aucune / Général --</option>';
    if (!parentId) return;

    const parent = categoriesData.find(c => c.id === parentId);
    if (parent && parent.subcategories) {
        parent.subcategories.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.id;
            opt.textContent = sub.name;
            if (selectedSubId && (selectedSubId === sub.id || selectedSubId === sub.slug)) {
                opt.selected = true;
            }
            subSelect.appendChild(opt);
        });
    }
}

function openNewProductModal() {
    document.getElementById('pmodal-title').textContent = "Ajouter un Produit High-Tech";
    document.getElementById('pform-action').value = "create_product";
    document.getElementById('pform-id').value = "";
    document.getElementById('pform-name').value = "";
    document.getElementById('pform-sku').value = "ST-" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('pform-category').value = "";
    document.getElementById('pform-subcategory').innerHTML = '<option value="">-- Aucune / Général --</option>';
    document.getElementById('pform-brand').value = "";
    document.getElementById('pform-price').value = "";
    document.getElementById('pform-mrp').value = "";
    document.getElementById('pform-stock').value = "15";
    document.getElementById('pform-conn').value = "";
    document.getElementById('pform-comp').value = "";
    document.getElementById('pform-power').value = "";
    document.getElementById('pform-warr').value = "Garantie 30 jours";
    document.getElementById('pform-image').value = "assets/images/product_img1.webp";
    document.getElementById('pform-desc').value = "";
    document.getElementById('pform-new').checked = true;
    document.getElementById('pform-flash').checked = false;
    document.getElementById('pform-exp').checked = true;
    document.getElementById('pform-featured').checked = false;
    document.getElementById('product-modal').classList.remove('hidden');
}

function openEditProductModal(p) {
    document.getElementById('pmodal-title').textContent = "Modifier la Fiche Produit : " + p.name;
    document.getElementById('pform-action').value = "edit_product";
    document.getElementById('pform-id').value = p.id;
    document.getElementById('pform-sku').value = p.sku || p.id;
    document.getElementById('pform-name').value = p.name;
    document.getElementById('pform-category').value = p.category_id || "";
    onCategoryChange(p.category_id, p.subcategory_id || p.subcategory);
    document.getElementById('pform-brand').value = p.brand || "";
    document.getElementById('pform-price').value = p.price;
    document.getElementById('pform-mrp').value = p.mrp || p.price;
    document.getElementById('pform-stock').value = p.stock || 0;
    document.getElementById('pform-conn').value = p.connection_type || "";
    document.getElementById('pform-comp').value = p.compatibility || "";
    document.getElementById('pform-power').value = p.power || "";
    document.getElementById('pform-warr').value = p.warranty || "Garantie 30 jours";
    
    let imgs = [];
    try { imgs = JSON.parse(p.images); } catch(e){}
    document.getElementById('pform-image').value = imgs[0] || "";
    document.getElementById('pform-desc').value = p.description || "";
    document.getElementById('pform-new').checked = Boolean(Number(p.is_new));
    document.getElementById('pform-flash').checked = Boolean(Number(p.is_flash_sale));
    document.getElementById('pform-exp').checked = Boolean(Number(p.is_express_delivery));
    document.getElementById('pform-featured').checked = Boolean(Number(p.is_featured));
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
