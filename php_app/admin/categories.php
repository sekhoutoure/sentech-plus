<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';
$messageType = 'success';

// Handle Category Actions (Create, Update, Delete, Toggle Status)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if (!$pdo) {
        $message = "Connexion MySQL inactive. Impossible d'effectuer cette modification.";
        $messageType = 'error';
    } elseif (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        if ($action === 'create_category' || $action === 'edit_category') {
            $catId = ($action === 'edit_category') ? sanitize($_POST['category_id'] ?? '') : ('cat_' . uniqid());
            $name = sanitize($_POST['name'] ?? '');
            $slug = sanitize($_POST['slug'] ?? '');
            $parentId = !empty($_POST['parent_id']) ? sanitize($_POST['parent_id']) : null;
            $icon = sanitize($_POST['icon'] ?? 'box');
            $description = sanitize($_POST['description'] ?? '');
            $displayOrder = (int)($_POST['display_order'] ?? 0);
            $isActive = isset($_POST['is_active']) ? 1 : 0;
            $isFeatured = isset($_POST['is_featured']) ? 1 : 0;
            $imageUrl = sanitize($_POST['image_url'] ?? 'assets/images/product_img1.webp');

            if (empty($slug)) {
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
            }

            if (!empty($name)) {
                try {
                    if ($action === 'create_category') {
                        $stmt = $pdo->prepare("INSERT INTO categories (id, name, slug, description, image, icon, parent_id, display_order, is_active, is_featured) 
                                               VALUES (:id, :name, :slug, :desc, :img, :icon, :pid, :ord, :act, :feat)");
                        $stmt->execute([
                            ':id' => $catId,
                            ':name' => $name,
                            ':slug' => $slug,
                            ':desc' => $description,
                            ':img' => $imageUrl,
                            ':icon' => $icon,
                            ':pid' => $parentId,
                            ':ord' => $displayOrder,
                            ':act' => $isActive,
                            ':feat' => $isFeatured
                        ]);
                        $message = "Catégorie créée avec succès !";
                    } else {
                        $stmt = $pdo->prepare("UPDATE categories SET name = :name, slug = :slug, description = :desc, image = :img, icon = :icon, parent_id = :pid, display_order = :ord, is_active = :act, is_featured = :feat WHERE id = :id");
                        $stmt->execute([
                            ':name' => $name,
                            ':slug' => $slug,
                            ':desc' => $description,
                            ':img' => $imageUrl,
                            ':icon' => $icon,
                            ':pid' => $parentId,
                            ':ord' => $displayOrder,
                            ':act' => $isActive,
                            ':feat' => $isFeatured,
                            ':id' => $catId
                        ]);
                        $message = "Catégorie mise à jour avec succès !";
                    }
                } catch (Throwable $e) {
                    $message = "Erreur : Cette catégorie ou ce slug existe déjà.";
                    $messageType = 'error';
                }
            } else {
                $message = "Le nom de la catégorie est obligatoire.";
                $messageType = 'error';
            }
        } elseif ($action === 'delete_category') {
            $catId = sanitize($_POST['category_id'] ?? '');
            if ($catId) {
                // Check if products are linked to this category or subcategory
                try {
                    $stmtCheck = $pdo->prepare("SELECT COUNT(*) as pcount FROM products WHERE category_id = :id OR subcategory_id = :id");
                    $stmtCheck->execute([':id' => $catId]);
                    $pCount = (int)$stmtCheck->fetch()['pcount'];

                    // Also check if it's a parent category with child categories containing products
                    $stmtChildCheck = $pdo->prepare("SELECT COUNT(p.id) as child_pcount FROM categories c JOIN products p ON (p.category_id = c.id OR p.subcategory_id = c.id) WHERE c.parent_id = :id");
                    $stmtChildCheck->execute([':id' => $catId]);
                    $childPCount = (int)$stmtChildCheck->fetch()['child_pcount'];

                    if ($pCount > 0 || $childPCount > 0) {
                        $totalLinked = $pCount + $childPCount;
                        $message = "Impossible de supprimer : Cette catégorie contient $totalLinked produit(s) actif(s). Veuillez d'abord réassigner les produits.";
                        $messageType = 'error';
                    } else {
                        $pdo->prepare("DELETE FROM categories WHERE id = :id")->execute([':id' => $catId]);
                        $message = "Catégorie supprimée avec succès.";
                    }
                } catch (Throwable $e) {
                    $message = "Erreur lors de la suppression de la catégorie.";
                    $messageType = 'error';
                }
            }
        } elseif ($action === 'toggle_status') {
            $catId = sanitize($_POST['category_id'] ?? '');
            $newStatus = (int)($_POST['status'] ?? 1);
            if ($catId) {
                $pdo->prepare("UPDATE categories SET is_active = :st WHERE id = :id")->execute([':st' => $newStatus, ':id' => $catId]);
                $message = "Statut mis à jour.";
            }
        }
    }
}

// Fetch structured categories from MySQL (with fallback)
$mainCategories = [];
$allCategoriesRaw = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT c.*, p.name as parent_name, 
                             (SELECT COUNT(*) FROM products prod WHERE prod.category_id = c.id OR prod.subcategory_id = c.id) as product_count 
                             FROM categories c 
                             LEFT JOIN categories p ON c.parent_id = p.id 
                             ORDER BY c.parent_id IS NOT NULL, c.display_order ASC, c.name ASC");
        $allCategoriesRaw = $stmt ? $stmt->fetchAll() : [];
        
        // Split into parents and children
        foreach ($allCategoriesRaw as $c) {
            if (empty($c['parent_id'])) {
                $mainCategories[$c['id']] = $c;
                $mainCategories[$c['id']]['children'] = [];
            }
        }
        foreach ($allCategoriesRaw as $c) {
            if (!empty($c['parent_id']) && isset($mainCategories[$c['parent_id']])) {
                $mainCategories[$c['parent_id']]['children'][] = $c;
            }
        }
    } catch (Throwable $e) {
        $allCategoriesRaw = [];
    }
}

if (empty($mainCategories)) {
    // Fallback tree
    $fallbackTree = getAllCategoriesTree();
    foreach ($fallbackTree as $p) {
        $p['product_count'] = 4;
        $p['children'] = $p['subcategories'] ?? [];
        $mainCategories[$p['id']] = $p;
    }
}

$pageTitle = "Gestion des Catégories & Sous-Catégories — Administration";
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

    <!-- Admin Header -->
    <header class="bg-[#182230] text-white sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div class="flex items-center gap-4">
            <a href="index.php" class="flex items-center gap-2">
                <img src="../assets/images/sentech_logo.webp" alt="SenTechPLUS" width="130" height="30" class="h-7 w-auto object-contain brightness-0 invert">
            </a>
            <span class="text-xs font-extrabold px-2.5 py-1 bg-white/10 rounded-full uppercase tracking-wider text-blue-300">Administration</span>
        </div>

        <div class="flex items-center gap-3">
            <a href="index.php" class="cursor-pointer text-xs font-bold text-white/80 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all">Tableau de bord</a>
            <a href="products.php" class="cursor-pointer text-xs font-bold text-white/80 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all">Produits</a>
            <a href="announcements.php" class="cursor-pointer text-xs font-bold text-white/80 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all">Annonces & Affiches</a>
            <a href="../shop.php" target="_blank" rel="noopener noreferrer" class="cursor-pointer text-xs font-bold bg-[#1677FF] text-white px-3.5 py-1.5 rounded-xl hover:bg-[#0F67E5] transition-all">Voir Boutique</a>
        </div>
    </header>

    <div class="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <!-- Breadcrumb & Title Row -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <nav class="text-xs text-[#667085] flex items-center gap-1.5 mb-1">
                    <a href="index.php" class="hover:text-[#1677FF]">Admin</a>
                    <span>/</span>
                    <span class="text-[#182230] font-bold" aria-current="page">Catégories & Sous-catégories</span>
                </nav>
                <h1 class="text-2xl font-black tracking-tight text-[#182230]">Gestion des Catégories & Rayons</h1>
                <p class="text-xs text-[#667085]">Organisez vos 7 grands univers high-tech et leurs sous-catégories dédiées.</p>
            </div>

            <button type="button" onclick="openCreateModal()" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>+ Nouvelle Catégorie / Sous-catégorie</span>
            </button>
        </div>

        <?php if ($message): ?>
            <div class="p-4 rounded-xl text-xs font-bold flex items-center gap-2 <?= $messageType === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-[#0D7D53] border border-emerald-200' ?>">
                <i data-lucide="<?= $messageType === 'error' ? 'alert-circle' : 'check-circle-2' ?>" class="w-4 h-4 shrink-0"></i>
                <span><?= htmlspecialchars($message) ?></span>
            </div>
        <?php endif; ?>

        <!-- Category Hierarchy Table / Accordion Cards -->
        <div class="space-y-4">
            <?php foreach ($mainCategories as $parent): ?>
                <div class="bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                    
                    <!-- Main Category Header Row -->
                    <div class="p-4 sm:p-5 bg-[#F8FBFF] border-b border-[#E8EDF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#0B54C2] flex items-center justify-center font-bold shrink-0">
                                <i data-lucide="<?= htmlspecialchars($parent['icon'] ?? 'box') ?>" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="text-sm font-black text-[#182230]"><?= htmlspecialchars($parent['name']) ?></h3>
                                    <?php if (!empty($parent['is_featured'])): ?>
                                        <span class="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">★ En Vedette</span>
                                    <?php endif; ?>
                                    <?php if (empty($parent['is_active'])): ?>
                                        <span class="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Désactivée</span>
                                    <?php else: ?>
                                        <span class="bg-[#16C784]/15 text-[#0D7D53] text-[10px] font-extrabold px-2 py-0.5 rounded-full">Active</span>
                                    <?php endif; ?>
                                </div>
                                <p class="text-xs text-[#667085] mt-0.5">
                                    Slug: <code class="bg-[#F3F7FC] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#0B54C2]"><?= htmlspecialchars($parent['slug']) ?></code>
                                    • Ordre: <strong><?= $parent['display_order'] ?? 0 ?></strong>
                                    • <?= count($parent['children'] ?? []) ?> sous-catégories
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button type="button" onclick='openCreateSubModal(<?= json_encode($parent) ?>)' class="cursor-pointer bg-white hover:bg-[#EAF3FF] text-[#0B54C2] border border-[#1677FF]/20 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                <span>+ Sous-rayon</span>
                            </button>
                            <button type="button" onclick='openEditModal(<?= json_encode($parent) ?>)' class="cursor-pointer p-2 hover:bg-[#EAF3FF] text-[#0B54C2] rounded-lg transition-colors" title="Modifier">
                                <i data-lucide="edit-2" class="w-4 h-4"></i>
                            </button>
                            <form method="POST" action="categories.php" onsubmit="return confirm('Confirmer la suppression de cette catégorie principale ?');" class="inline">
                                <?= getCSRFInputField() ?>
                                <input type="hidden" name="action" value="delete_category">
                                <input type="hidden" name="category_id" value="<?= htmlspecialchars($parent['id']) ?>">
                                <button type="submit" class="cursor-pointer p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Supprimer">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Subcategories List -->
                    <?php if (!empty($parent['children'])): ?>
                        <div class="divide-y divide-[#E8EDF3]/60 bg-white">
                            <?php foreach ($parent['children'] as $sub): ?>
                                <div class="p-3.5 pl-8 sm:pl-12 flex items-center justify-between gap-3 hover:bg-[#F8FBFF]/60 transition-colors">
                                    <div class="flex items-center gap-3">
                                        <i data-lucide="corner-down-right" class="w-4 h-4 text-[#98A2B3] shrink-0"></i>
                                        <div class="w-7 h-7 rounded-lg bg-[#F3F7FC] flex items-center justify-center text-[#667085]">
                                            <i data-lucide="<?= htmlspecialchars($sub['icon'] ?? 'box') ?>" class="w-3.5 h-3.5"></i>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs font-bold text-[#182230]"><?= htmlspecialchars($sub['name']) ?></span>
                                                <code class="text-[10px] text-[#667085] bg-[#F3F7FC] px-1.5 py-0.5 rounded"><?= htmlspecialchars($sub['slug']) ?></code>
                                            </div>
                                            <p class="text-[11px] text-[#667085]"><?= htmlspecialchars($sub['description'] ?? '') ?></p>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        <span class="text-[11px] font-bold text-[#667085] bg-[#F3F7FC] px-2 py-0.5 rounded-full">
                                            <?= $sub['product_count'] ?? 0 ?> produit(s)
                                        </span>
                                        <button type="button" onclick='openEditModal(<?= json_encode($sub) ?>)' class="cursor-pointer p-1.5 hover:bg-[#EAF3FF] text-[#0B54C2] rounded-md transition-colors" title="Modifier">
                                            <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                        </button>
                                        <form method="POST" action="categories.php" onsubmit="return confirm('Supprimer cette sous-catégorie ?');" class="inline">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="delete_category">
                                            <input type="hidden" name="category_id" value="<?= htmlspecialchars($sub['id']) ?>">
                                            <button type="submit" class="cursor-pointer p-1.5 hover:bg-rose-50 text-rose-600 rounded-md transition-colors" title="Supprimer">
                                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="p-4 text-xs text-[#667085] text-center italic bg-white">
                            Aucune sous-catégorie créée pour ce rayon.
                        </div>
                    <?php endif; ?>

                </div>
            <?php endforeach; ?>
        </div>

    </div>

    <!-- Modal Créer / Modifier Catégorie -->
    <div id="category-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
                <h3 id="modal-title" class="text-sm font-black text-[#182230]">Nouvelle Catégorie / Sous-catégorie</h3>
                <button type="button" onclick="closeCategoryModal()" class="cursor-pointer text-[#667085] hover:text-[#182230]">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <form method="POST" action="categories.php" class="space-y-3.5 text-xs">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" id="form-action" value="create_category">
                <input type="hidden" name="category_id" id="form-category-id" value="">

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Catégorie Parente (Laisser vide pour catégorie principale)</label>
                    <select name="parent_id" id="form-parent-id" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                        <option value="">-- Catégorie Principale (Top-Level) --</option>
                        <?php foreach ($mainCategories as $p): ?>
                            <option value="<?= htmlspecialchars($p['id']) ?>">📁 <?= htmlspecialchars($p['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Nom de la Catégorie / Rayon *</label>
                    <input type="text" name="name" id="form-name" required placeholder="Ex: Supports téléphone" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Slug URL (auto si vide)</label>
                        <input type="text" name="slug" id="form-slug" placeholder="supports-telephone" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Icône Lucide</label>
                        <input type="text" name="icon" id="form-icon" placeholder="smartphone, headphones, watch..." class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Ordre d'affichage</label>
                        <input type="number" name="display_order" id="form-order" value="1" min="0" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                    </div>
                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Image URL</label>
                        <input type="text" name="image_url" id="form-image" placeholder="assets/images/product_img1.webp" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Description</label>
                    <textarea name="description" id="form-desc" rows="2" placeholder="Brève description de cette catégorie..." class="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
                </div>

                <div class="flex items-center gap-6 pt-1">
                    <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_active" id="form-active" value="1" checked class="accent-[#1677FF] w-4 h-4">
                        <span>Catégorie Active</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                        <input type="checkbox" name="is_featured" id="form-featured" value="1" class="accent-[#1677FF] w-4 h-4">
                        <span>Mettre en Vedette (Accueil)</span>
                    </label>
                </div>

                <div class="pt-3 flex items-center justify-end gap-2 border-t border-[#E8EDF3]">
                    <button type="button" onclick="closeCategoryModal()" class="cursor-pointer px-4 py-2 rounded-xl text-[#667085] hover:bg-[#F3F7FC] font-bold">Annuler</button>
                    <button type="submit" id="modal-submit-btn" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white px-5 py-2 rounded-xl font-bold active:scale-95 transition-all">Enregistrer</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../assets/js/lucide.min.js"></script>
    <script>
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }

        function openCreateModal() {
            document.getElementById('modal-title').textContent = "Nouvelle Catégorie Principale";
            document.getElementById('form-action').value = "create_category";
            document.getElementById('form-category-id').value = "";
            document.getElementById('form-parent-id').value = "";
            document.getElementById('form-name').value = "";
            document.getElementById('form-slug').value = "";
            document.getElementById('form-icon').value = "box";
            document.getElementById('form-desc').value = "";
            document.getElementById('form-order').value = "1";
            document.getElementById('form-active').checked = true;
            document.getElementById('form-featured').checked = false;
            document.getElementById('category-modal').classList.remove('hidden');
        }

        function openCreateSubModal(parent) {
            document.getElementById('modal-title').textContent = "Ajouter une Sous-catégorie dans " + parent.name;
            document.getElementById('form-action').value = "create_category";
            document.getElementById('form-category-id').value = "";
            document.getElementById('form-parent-id').value = parent.id;
            document.getElementById('form-name').value = "";
            document.getElementById('form-slug').value = "";
            document.getElementById('form-icon').value = parent.icon || "box";
            document.getElementById('form-desc').value = "";
            document.getElementById('form-order').value = "1";
            document.getElementById('form-active').checked = true;
            document.getElementById('form-featured').checked = false;
            document.getElementById('category-modal').classList.remove('hidden');
        }

        function openEditModal(cat) {
            document.getElementById('modal-title').textContent = "Modifier la Catégorie : " + cat.name;
            document.getElementById('form-action').value = "edit_category";
            document.getElementById('form-category-id').value = cat.id;
            document.getElementById('form-parent-id').value = cat.parent_id || "";
            document.getElementById('form-name').value = cat.name || "";
            document.getElementById('form-slug').value = cat.slug || "";
            document.getElementById('form-icon').value = cat.icon || "box";
            document.getElementById('form-image').value = cat.image || "";
            document.getElementById('form-desc').value = cat.description || "";
            document.getElementById('form-order').value = cat.display_order || "0";
            document.getElementById('form-active').checked = (cat.is_active != 0);
            document.getElementById('form-featured').checked = (cat.is_featured == 1);
            document.getElementById('category-modal').classList.remove('hidden');
        }

        function closeCategoryModal() {
            document.getElementById('category-modal').classList.add('hidden');
        }
    </script>
</body>
</html>
