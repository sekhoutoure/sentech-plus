<?php
require_once __DIR__ . '/../config/config.php';
$sellerUser = requireSeller();

if (!isLoggedIn()) {
    header('Location: ../login.php?redirect=seller/products.php');
    exit;
}

$user = getCurrentUser();
$db = null;
$store = null;
$products = [];
$message = '';
$error = '';

try {
    $db = getDBConnection();
    $stmt = $db->prepare("SELECT * FROM stores WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $store = $stmt->fetch();

    if ($store) {
        // Traitement de l'ajout d'un nouveau produit
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_product') {
            if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
                $error = "Session expirée ou jeton CSRF invalide.";
            } else {
                $pName = sanitize($_POST['name'] ?? '');
                $pCategory = sanitize($_POST['category'] ?? 'Accessoires');
                $pPrice = (float)($_POST['price'] ?? 0);
                $pMrp = (float)($_POST['mrp'] ?? 0);
                $pStock = (int)($_POST['stock'] ?? 10);
                $pDesc = sanitize($_POST['description'] ?? '');
                $pImg = 'assets/images/product_img4.webp'; // Image par défaut certifiée WebP

                if (empty($pName) || $pPrice <= 0) {
                    $error = "Veuillez renseigner un nom valide et un prix supérieur à 0 FCFA.";
                } else {
                    $newId = 'prod_' . uniqid();
                    $stmtIns = $db->prepare("INSERT INTO products (id, store_id, name, category, price, mrp, stock, description, is_active, in_stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, NOW())");
                    $stmtIns->execute([$newId, $store['id'], $pName, $pCategory, $pPrice, $pMrp ?: $pPrice, $pStock, $pDesc]);

                    // Ajouter image primaire
                    $stmtImg = $db->prepare("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)");
                    $stmtImg->execute([$newId, $pImg]);

                    $message = "Produit ajouté avec succès à votre boutique !";
                }
            }
        }


        // Fetch seller products
        $stmtP = $db->prepare("SELECT p.*, COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), 'assets/images/product_img4.webp') as main_image FROM products p WHERE p.store_id = ? ORDER BY p.created_at DESC");
        $stmtP->execute([$store['id']]);
        $products = $stmtP->fetchAll();
    }
} catch (Exception $e) {
    $store = ['name' => 'Boutique Partenaire Dakar', 'username' => 'boutique-dakar'];
    $products = [];
}

$pageTitle = "Gestion des Produits — Espace Vendeur";
?>
<!DOCTYPE html>
<html lang="fr" class="h-full bg-[#F8FBFF]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?> | SenTechPLUS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>body { font-family: 'Inter', system-ui, sans-serif; }</style>
</head>
<body class="h-full flex flex-col antialiased text-[#182230]">

    <header class="bg-white border-b border-[#E8EDF3] sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="index.php" class="flex items-center gap-2">
                <img src="../assets/images/sentech_logo.webp" alt="SenTechPLUS" width="140" height="32" class="h-7 w-auto object-contain">
            </a>
            <span class="text-xs font-extrabold px-2.5 py-1 bg-[#1677FF]/10 text-[#0B54C2] rounded-full uppercase tracking-wider">Espace Vendeur</span>
        </div>
        <div class="flex items-center gap-3">
            <a href="index.php" class="cursor-pointer text-xs font-bold text-[#667085] hover:text-[#182230] px-3 py-1.5 rounded-xl hover:bg-[#F3F7FC] transition-all">Tableau de bord</a>
        </div>
    </header>

    <div class="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-black tracking-tight text-[#182230]">Mes Produits en Vente (<?= count($products) ?>)</h1>
                <p class="text-xs text-[#667085]">Gérez votre catalogue, vos prix et vos niveaux de stock en temps réel.</p>
            </div>
            <button type="button" onclick="document.getElementById('modal-add-product').classList.remove('hidden')" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter un Produit</span>
            </button>
        </div>

        <?php if ($message): ?>
            <div class="p-4 bg-[#16C784]/10 border border-[#16C784]/30 rounded-xl text-xs font-bold text-[#0D7D53] flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-[#16C784]"></i>
                <span><?= htmlspecialchars($message) ?></span>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600"></i>
                <span><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <!-- Products Table -->
        <div class="bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-[#F8FBFF] border-b border-[#E8EDF3] text-[#667085] uppercase tracking-wider font-bold">
                            <th class="p-4">Produit</th>
                            <th class="p-4">Catégorie</th>
                            <th class="p-4">Prix Vente</th>
                            <th class="p-4">Prix Barré</th>
                            <th class="p-4">Stock</th>
                            <th class="p-4">Statut</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#E8EDF3]">
                        <?php foreach ($products as $p): ?>
                            <tr class="hover:bg-[#F8FBFF]/60 transition-colors">
                                <td class="p-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 rounded-xl bg-[#F3F7FC] p-1 border border-[#E8EDF3] flex items-center justify-center shrink-0">
                                            <img src="../<?= htmlspecialchars($p['main_image']) ?>" alt="<?= htmlspecialchars($p['name']) ?>" width="40" height="40" class="max-w-full max-h-full object-contain">
                                        </div>
                                        <div>
                                            <p class="font-bold text-[#182230] text-xs leading-snug"><?= htmlspecialchars($p['name']) ?></p>
                                            <span class="text-[10px] text-[#667085]">ID: <?= htmlspecialchars($p['id']) ?></span>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4">
                                    <span class="px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#0B54C2] font-bold text-[10px]"><?= htmlspecialchars($p['category']) ?></span>
                                </td>
                                <td class="p-4 font-extrabold text-[#182230]"><?= formatPrice($p['price']) ?></td>
                                <td class="p-4 text-[#667085] line-through"><?= $p['mrp'] > $p['price'] ? formatPrice($p['mrp']) : '-' ?></td>
                                <td class="p-4">
                                    <span class="font-bold <?= $p['stock'] <= 3 ? 'text-[#C2410C]' : 'text-[#0D7D53]' ?>"><?= $p['stock'] ?> unités</span>
                                </td>
                                <td class="p-4">
                                    <span class="px-2 py-0.5 rounded-full bg-[#16C784]/15 text-[#0D7D53] font-extrabold text-[10px]">En Vente</span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- Modal Ajouter un Produit -->
    <div id="modal-add-product" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
                <h3 class="text-sm font-black text-[#182230]">Ajouter un Produit High-Tech</h3>
                <button type="button" onclick="document.getElementById('modal-add-product').classList.add('hidden')" class="cursor-pointer text-[#667085] hover:text-[#182230]">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form action="products.php" method="POST" class="space-y-3.5 text-xs">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="add_product">

                
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Nom du Produit *</label>
                    <input type="text" name="name" required placeholder="Ex: Écouteurs Sans Fil Pro ANC" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/20 outline-none">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Catégorie *</label>
                        <select name="category" aria-label="Catégorie" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none">
                            <option value="Casques">Casques Audio</option>
                            <option value="Écouteurs">Écouteurs Sans Fil</option>
                            <option value="Montres">Montres Connectées</option>
                            <option value="Enceintes">Enceintes Bluetooth</option>
                            <option value="Smartphones">Accessoires Smartphone</option>
                            <option value="Gaming">Gaming & Setup</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Stock Initial *</label>
                        <input type="number" name="stock" aria-label="Stock Initial" value="10" min="1" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Prix de Vente (FCFA) *</label>
                        <input type="number" name="price" required placeholder="Ex: 25000" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                    </div>
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Prix Barré / MRP (FCFA)</label>
                        <input type="number" name="mrp" placeholder="Ex: 30000" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Description / Caractéristiques (séparées par ;)</label>
                    <textarea name="description" rows="3" placeholder="Autonomie 30h ; Réduction active du bruit ; Bluetooth 5.3" class="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
                </div>

                <div class="pt-2 flex items-center justify-end gap-2">
                    <button type="button" onclick="document.getElementById('modal-add-product').classList.add('hidden')" class="cursor-pointer px-4 py-2 rounded-xl text-[#667085] hover:bg-[#F3F7FC] font-bold">Annuler</button>
                    <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white px-5 py-2 rounded-xl font-bold active:scale-95 transition-all">Mettre en Vente</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../assets/js/lucide.min.js"></script>
    <script>if (typeof lucide !== 'undefined') { lucide.createIcons(); }</script>
</body>
</html>
