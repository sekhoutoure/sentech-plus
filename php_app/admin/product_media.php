<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
ensureProductMediaTableExists($pdo);

$selectedPid = sanitize($_GET['product_id'] ?? '');
$message = '';
$messageType = 'success';

// Handle POST actions: Upload Media / Delete Media / Update Order
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'] ?? '';

        if ($action === 'upload_product_media') {
            $productId = sanitize($_POST['product_id'] ?? '');
            $mediaType = sanitize($_POST['media_type'] ?? 'image');
            $mediaRole = sanitize($_POST['media_role'] ?? 'gallery');
            $title = sanitize($_POST['title'] ?? '');
            $altText = sanitize($_POST['alt_text'] ?? '');
            $displayOrder = (int)($_POST['display_order'] ?? 0);

            if (empty($productId)) {
                $message = "Veuillez sélectionner un produit.";
                $messageType = 'error';
            } elseif (!empty($_FILES['media_file']['name'])) {
                $file = $_FILES['media_file'];
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

                if ($mediaType === 'image') {
                    $upRes = SecureUploader::processImageUpload($file, 'products', 1920, 1920);
                    if ($upRes['success']) {
                        $relPath = $upRes['path'];
                        $ok = addProductMedia($productId, $mediaType, $mediaRole, $relPath, $relPath, $title, $altText, $displayOrder);
                        if ($ok) {
                            $message = "Image produit téléversée et sécurisée avec succès !";
                            $messageType = 'success';
                        }
                    } else {
                        $message = $upRes['error'] ?? "Format d'image non valide.";
                        $messageType = 'error';
                    }
                } elseif ($mediaType === 'video') {
                    $allowedVideoExts = ['mp4', 'webm'];
                    $maxSize = 35 * 1024 * 1024;
                    if (!in_array($ext, $allowedVideoExts, true)) {
                        $message = "Extension vidéo non autorisée (MP4, WEBM).";
                        $messageType = 'error';
                    } elseif ($file['size'] > $maxSize) {
                        $message = "La vidéo dépasse 35 Mo.";
                        $messageType = 'error';
                    } else {
                        $subDir = 'assets/videos/products/';
                        $targetDir = __DIR__ . '/../' . $subDir;
                        if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
                        $newFilename = 'vid_' . bin2hex(random_bytes(8)) . '.' . $ext;
                        $relPath = $subDir . $newFilename;
                        if (move_uploaded_file($file['tmp_name'], $targetDir . $newFilename)) {
                            $ok = addProductMedia($productId, $mediaType, $mediaRole, $relPath, $relPath, $title, $altText, $displayOrder);
                            if ($ok) {
                                $message = "Média vidéo ajouté avec succès !";
                                $messageType = 'success';
                            }
                        }
                    }
                }
            } else {
                $message = "Veuillez sélectionner un fichier média.";
                $messageType = 'error';
            }
        } elseif ($action === 'delete_product_media') {

            $mediaId = (int)($_POST['media_id'] ?? 0);
            if ($mediaId > 0) {
                if (deleteProductMedia($mediaId)) {
                    $message = "Média supprimé avec succès.";
                    $messageType = 'success';
                } else {
                    $message = "Erreur lors de la suppression du média.";
                    $messageType = 'error';
                }
            }
        }
    }
}

// Fetch all products for selector
$allProducts = [];
if ($pdo) {
    try {
        $stmtP = $pdo->query("SELECT id, name, category, price FROM products ORDER BY name ASC");
        $allProducts = $stmtP ? $stmtP->fetchAll() : [];
    } catch (Throwable $e) {}
}

if (empty($allProducts)) {
    $allProducts = [
        ['id' => 'prod_1', 'name' => 'Casque Studio Pro Sans Fil ANC', 'category' => 'Audio & Écouteurs', 'price' => 45000],
        ['id' => 'prod_2', 'name' => 'Montre Connectée Sport V3 AMOLED', 'category' => 'Montres & Objets Connectés', 'price' => 32000],
        ['id' => 'prod_3', 'name' => 'Enceinte Nomade Bluetooth HD 360°', 'category' => 'Audio & Écouteurs', 'price' => 28000],
        ['id' => 'prod_4', 'name' => 'Écouteurs True Wireless Bass+ Pro', 'category' => 'Audio & Écouteurs', 'price' => 19500],
        ['id' => 'prod_5', 'name' => 'Souris Ergonomique Sans Fil Silence', 'category' => 'Informatique & Bureau', 'price' => 15000],
        ['id' => 'prod_6', 'name' => 'Chargeur Rapide GaN 65W Multi-Port', 'category' => 'Téléphones & Accessoires', 'price' => 14000],
        ['id' => 'prod_7', 'name' => 'Casque Gamer Surround 7.1 RGB Pro', 'category' => 'Gaming', 'price' => 39000]
    ];
}

if (empty($selectedPid) && !empty($allProducts)) {
    $selectedPid = $allProducts[0]['id'];
}

// Fetch current product media
$currentProductMedia = [];
if (!empty($selectedPid)) {
    $currentProductMedia = getProductMediaList($selectedPid);
}

// Find selected product name
$selectedProductName = '';
foreach ($allProducts as $p) {
    if ($p['id'] === $selectedPid) {
        $selectedProductName = $p['name'];
        break;
    }
}

$pageTitle = "Gestion Médias Produits & Vidéos — Admin SenTechPLUS";
$layoutType = 'admin';
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen bg-[#F4F7FB] flex flex-col lg:flex-row">
    
    <!-- Admin Sidebar -->
    <aside class="w-full lg:w-64 bg-[#182230] text-white p-5 space-y-6 shrink-0">
        <div class="flex items-center gap-3 pb-4 border-b border-slate-700">
            <img src="../assets/images/sentech_logo.webp" alt="Logo" width="112" height="28" style="aspect-ratio:4/1;" class="h-7 w-auto brightness-0 invert" loading="eager">
            <span class="text-xs font-bold text-slate-300">Admin</span>
        </div>
        <nav class="space-y-1 text-xs font-semibold">
            <a href="index.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
                <i data-lucide="layout-dashboard" class="w-4 h-4 text-slate-400"></i>
                <span>Tableau de Bord</span>
            </a>
            <a href="products.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
                <i data-lucide="package" class="w-4 h-4 text-slate-400"></i>
                <span>Produits & Catalogue</span>
            </a>
            <a href="product_media.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#1677FF] text-white font-bold transition-colors shadow-2xs">
                <i data-lucide="image" class="w-4 h-4"></i>
                <span>Galerie & Vidéos Démo</span>
            </a>
            <a href="orders.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
                <i data-lucide="shopping-bag" class="w-4 h-4 text-slate-400"></i>
                <span>Commandes</span>
            </a>
            <a href="banners.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
                <i data-lucide="layers" class="w-4 h-4 text-slate-400"></i>
                <span>Affiches & Bannières</span>
            </a>
            <a href="../index.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors pt-4 border-t border-slate-700">
                <i data-lucide="external-link" class="w-4 h-4"></i>
                <span>Voir la Boutique</span>
            </a>
        </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 sm:p-8 space-y-6">
        
        <!-- Header Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-black text-[#182230] tracking-tight flex items-center gap-2">
                    <i data-lucide="film" class="w-6 h-6 text-[#1677FF]"></i>
                    <span>Gestion des Médias Produits & Vidéos</span>
                </h1>
                <p class="text-xs text-[#667085] mt-1">Ajoutez plusieurs angles de photos, vidéos de démonstration, vues lifestyle et packaging.</p>
            </div>
            
            <a href="products.php" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1677FF] bg-white border border-[#E8EDF3] px-3.5 py-2 rounded-xl shadow-2xs hover:bg-[#F3F7FC] transition-colors">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>Retour aux produits</span>
            </a>
        </div>

        <!-- Feedback Alert -->
        <?php if (!empty($message)): ?>
            <div class="p-4 rounded-2xl text-xs font-bold flex items-center gap-2 <?= $messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-[#0D7D53] border border-emerald-200' ?>">
                <i data-lucide="<?= $messageType === 'error' ? 'alert-circle' : 'check-circle' ?>" class="w-4 h-4 shrink-0"></i>
                <span><?= htmlspecialchars($message) ?></span>
            </div>
        <?php endif; ?>

        <!-- Product Selector Dropdown -->
        <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs">
            <form method="GET" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label for="product_select" class="text-xs font-bold text-[#182230] shrink-0">Choisir un produit :</label>
                <select name="product_id" id="product_select" onchange="this.form.submit()" class="flex-1 bg-[#F8FAFC] border border-[#E8EDF3] text-xs font-bold p-2.5 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF] focus:outline-none">
                    <?php foreach ($allProducts as $p): ?>
                        <option value="<?= htmlspecialchars($p['id']) ?>" <?= $selectedPid === $p['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($p['name']) ?> (<?= htmlspecialchars($p['category']) ?> - <?= formatPrice($p['price']) ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
                <a href="../product.php?id=<?= urlencode($selectedPid) ?>" target="_blank" class="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#1677FF] hover:bg-[#0F67E5] px-4 py-2.5 rounded-xl transition-all shadow-2xs">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                    <span>Voir sur la page produit</span>
                </a>
            </form>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Upload Form Card (5 cols) -->
            <div class="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-4">
                <div class="flex items-center gap-2 pb-2 border-b border-[#E8EDF3]">
                    <i data-lucide="upload-cloud" class="w-5 h-5 text-[#1677FF]"></i>
                    <h2 class="text-sm font-black text-[#182230]">Téléverser un Nouveau Média</h2>
                </div>

                <form action="product_media.php?product_id=<?= urlencode($selectedPid) ?>" method="POST" enctype="multipart/form-data" class="space-y-4">
                    <?= getCSRFInputField() ?>
                    <input type="hidden" name="action" value="upload_product_media">
                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($selectedPid) ?>">

                    <!-- Media Type: Image or Video -->
                    <div>
                        <label class="block text-xs font-bold text-[#182230] mb-1">Type de média :</label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="cursor-pointer border border-[#E8EDF3] p-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F3F7FC] text-xs font-bold text-[#182230] has-checked:border-[#1677FF] has-checked:bg-[#EAF3FF] has-checked:text-[#0B54C2]">
                                <input type="radio" name="media_type" value="image" checked onchange="toggleMediaInput('image')" class="accent-[#1677FF]">
                                <i data-lucide="image" class="w-4 h-4"></i>
                                <span>Image</span>
                            </label>
                            <label class="cursor-pointer border border-[#E8EDF3] p-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F3F7FC] text-xs font-bold text-[#182230] has-checked:border-[#1677FF] has-checked:bg-[#EAF3FF] has-checked:text-[#0B54C2]">
                                <input type="radio" name="media_type" value="video" onchange="toggleMediaInput('video')" class="accent-[#1677FF]">
                                <i data-lucide="video" class="w-4 h-4"></i>
                                <span>Vidéo Démo</span>
                            </label>
                        </div>
                    </div>

                    <!-- Role Selector -->
                    <div>
                        <label class="block text-xs font-bold text-[#182230] mb-1">Rôle du média :</label>
                        <select name="media_role" class="w-full bg-[#F8FAFC] border border-[#E8EDF3] text-xs font-bold p-2.5 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF] focus:outline-none">
                            <option value="main">📷 Image Principale</option>
                            <option value="gallery" selected>🖼️ Galerie Standard (Autre angle)</option>
                            <option value="video_product">🎬 Vidéo Présentation Produit</option>
                            <option value="lifestyle">☕ Vue en Situation / Lifestyle</option>
                            <option value="packaging">📦 Packaging & Contenu de Boîte</option>
                            <option value="specs">📊 Schéma / Fiche Technique</option>
                            <option value="comparison">⚖️ Comparatif & Dimensions</option>
                        </select>
                    </div>

                    <!-- File Input -->
                    <div>
                        <label class="block text-xs font-bold text-[#182230] mb-1">Fichier (Max 8Mo Image / 35Mo Vidéo) :</label>
                        <input type="file" name="media_file" id="media_file_input" required accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" class="w-full bg-[#F8FAFC] border border-[#E8EDF3] text-xs font-bold p-2 rounded-xl text-[#667085] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#1677FF] file:text-white hover:file:bg-[#0F67E5] cursor-pointer">
                    </div>

                    <!-- Title & Alt Text -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Titre / Légende :</label>
                            <input type="text" name="title" placeholder="Ex: Vue latérale" class="w-full bg-[#F8FAFC] border border-[#E8EDF3] text-xs font-bold p-2.5 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF] focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Ordre d'affichage :</label>
                            <input type="number" name="display_order" value="0" min="0" max="99" class="w-full bg-[#F8FAFC] border border-[#E8EDF3] text-xs font-bold p-2.5 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF] focus:outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-[#182230] mb-1">Texte alternatif (Alt SEO) :</label>
                        <input type="text" name="alt_text" placeholder="Ex: Casque Sony noir vue de face" class="w-full bg-[#F8FAFC] border border-[#E8EDF3] text-xs font-bold p-2.5 rounded-xl text-[#182230] focus:ring-2 focus:ring-[#1677FF] focus:outline-none">
                    </div>

                    <button type="submit" class="cursor-pointer w-full bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>Enregistrer le Média</span>
                    </button>
                </form>
            </div>

            <!-- Media Gallery Display Card (7 cols) -->
            <div class="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-[#E8EDF3]">
                    <div class="flex items-center gap-2">
                        <i data-lucide="layers" class="w-5 h-5 text-[#1677FF]"></i>
                        <h2 class="text-sm font-black text-[#182230]">Médias Actuels (<?= count($currentProductMedia) ?>)</h2>
                    </div>
                    <span class="text-xs text-[#667085] font-bold"><?= htmlspecialchars($selectedProductName) ?></span>
                </div>

                <?php if (empty($currentProductMedia)): ?>
                    <div class="p-8 text-center text-xs text-[#667085] bg-[#F8FAFC] rounded-2xl border border-dashed border-[#DCE4EE]">
                        <i data-lucide="image-off" class="w-8 h-8 mx-auto text-slate-300 mb-2"></i>
                        <p>Aucun média pour ce produit pour le moment.</p>
                        <p class="text-[11px] text-slate-400 mt-1">Utilisez le formulaire ci-contre pour ajouter des photos et vidéos.</p>
                    </div>
                <?php else: ?>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                        <?php foreach ($currentProductMedia as $med): 
                            $isVid = ($med['media_type'] === 'video');
                            $thumb = $med['thumbnail_path'] ?: $med['file_path'];
                        ?>
                            <div class="bg-[#F8FAFC] rounded-2xl border border-[#E8EDF3] p-3 flex flex-col justify-between space-y-2 relative group">
                                
                                <!-- Role Badge -->
                                <span class="text-[9px] font-black px-2 py-0.5 rounded-full bg-white text-[#182230] border border-[#E8EDF3] w-fit">
                                    <?= htmlspecialchars($med['media_role']) ?>
                                </span>

                                <!-- Media Preview -->
                                <div class="w-full aspect-square rounded-xl bg-white border border-[#E8EDF3] overflow-hidden flex items-center justify-center relative">
                                    <?php if ($isVid): ?>
                                        <video src="../<?= htmlspecialchars($med['file_path']) ?>" class="w-full h-full object-cover" muted preload="metadata"></video>
                                        <div class="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                                            <div class="w-8 h-8 rounded-full bg-[#1677FF] text-white flex items-center justify-center shadow-md">
                                                <i data-lucide="play" class="w-4 h-4 fill-white translate-x-0.5"></i>
                                            </div>
                                        </div>
                                    <?php else: ?>
                                        <img src="../<?= htmlspecialchars($thumb) ?>" alt="<?= htmlspecialchars($med['alt_text'] ?? '') ?>" width="80" height="80" style="aspect-ratio:1/1;" class="w-full h-full object-contain p-2" decoding="async">
                                    <?php endif; ?>
                                </div>

                                <!-- Info & Actions -->
                                <div>
                                    <p class="text-xs font-bold text-[#182230] truncate"><?= htmlspecialchars($med['title'] ?: 'Sans titre') ?></p>
                                    <span class="text-[10px] text-[#667085] block">Ordre : <?= (int)$med['display_order'] ?></span>
                                </div>

                                <div class="pt-1 flex items-center justify-between border-t border-[#E8EDF3]">
                                    <a href="../<?= htmlspecialchars($med['file_path']) ?>" target="_blank" class="text-[10px] font-bold text-[#1677FF] hover:underline flex items-center gap-1">
                                        <i data-lucide="external-link" class="w-3 h-3"></i>
                                        <span>Ouvrir</span>
                                    </a>

                                    <?php if (is_numeric($med['id'])): ?>
                                        <form action="product_media.php?product_id=<?= urlencode($selectedPid) ?>" method="POST" onsubmit="return confirm('Supprimer définitivement ce média ?')">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="delete_product_media">
                                            <input type="hidden" name="media_id" value="<?= (int)$med['id'] ?>">
                                            <button type="submit" class="cursor-pointer text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1">
                                                <i data-lucide="trash-2" class="w-3 h-3"></i>
                                                <span>Supprimer</span>
                                            </button>
                                        </form>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

        </div>

    </main>

</div>

<script>
function toggleMediaInput(type) {
    const input = document.getElementById('media_file_input');
    if (type === 'video') {
        input.accept = 'video/mp4,video/webm';
    } else {
        input.accept = 'image/jpeg,image/png,image/webp';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
});
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
