<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();
$pdo = getDBConnection();
$message = '';
$messageType = 'success';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];
        if ($action === 'create' || $action === 'update') {
            $id = sanitize($_POST['id'] ?? '');
            $name = sanitize($_POST['name'] ?? '');
            $slug = sanitize($_POST['slug'] ?? '') ?: createSlug($name);
            $logo = sanitize($_POST['logo'] ?? '');
            $description = sanitize($_POST['description'] ?? '');
            $display_order = (int)($_POST['display_order'] ?? 0);
            $is_active = isset($_POST['is_active']) ? 1 : 0;
            $is_featured = isset($_POST['is_featured']) ? 1 : 0;

            if (empty($name)) {
                $message = "Le nom de la marque est obligatoire.";
                $messageType = 'error';
            } else {
                if ($action === 'create') {
                    $id = 'brand_' . time() . '_' . rand(100, 999);
                    $stmt = $pdo->prepare("INSERT INTO brands (id, name, slug, logo, description, display_order, is_active, is_featured) VALUES (:id, :name, :slug, :logo, :desc, :do, :ia, :if)");
                    $stmt->execute([':id'=>$id, ':name'=>$name, ':slug'=>$slug, ':logo'=>$logo, ':desc'=>$description, ':do'=>$display_order, ':ia'=>$is_active, ':if'=>$is_featured]);
                    $message = "Marque « {$name} » créée avec succès !";
                } else {
                    $stmt = $pdo->prepare("UPDATE brands SET name = :name, slug = :slug, logo = :logo, description = :desc, display_order = :do, is_active = :ia, is_featured = :if WHERE id = :id");
                    $stmt->execute([':id'=>$id, ':name'=>$name, ':slug'=>$slug, ':logo'=>$logo, ':desc'=>$description, ':do'=>$display_order, ':ia'=>$is_active, ':if'=>$is_featured]);
                    $message = "Marque « {$name} » mise à jour !";
                }
                if (class_exists('FastCache')) { FastCache::forget('all_brands_all'); FastCache::forget('all_brands_feat'); }
            }
        } elseif ($action === 'delete') {
            $id = sanitize($_POST['id'] ?? '');
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM brands WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $message = "Marque supprimée !";
                if (class_exists('FastCache')) { FastCache::forget('all_brands_all'); FastCache::forget('all_brands_feat'); }
            }
        } elseif ($action === 'toggle_active') {
            $id = sanitize($_POST['id'] ?? '');
            $stmt = $pdo->prepare("UPDATE brands SET is_active = IF(is_active=1, 0, 1) WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $message = "Statut mis à jour !";
            if (class_exists('FastCache')) { FastCache::forget('all_brands_all'); FastCache::forget('all_brands_feat'); }
        }
    }
}

$brands = $pdo ? $pdo->query("SELECT * FROM brands ORDER BY display_order ASC, name ASC")->fetchAll(PDO::FETCH_ASSOC) : [];
$pageTitle = "Gestion des Marques — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>
<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>
    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Gestion des Marques Certifiées (<?= count($brands) ?>)</span>
            </h1>
            <button type="button" onclick="openCreateModal()" class="btn-electric py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter une Marque</span>
            </button>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div class="bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-[#334155]">
                        <thead class="bg-[#F8FAFC] text-[11px] font-black uppercase text-[#475467] border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-4">Ordre</th>
                                <th class="p-4">Marque</th>
                                <th class="p-4">Slug</th>
                                <th class="p-4">Description</th>
                                <th class="p-4">Accueil</th>
                                <th class="p-4">Statut</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (empty($brands)): ?>
                                <tr><td colspan="7" class="p-8 text-center text-[#64748B]">Aucune marque configurée.</td></tr>
                            <?php else: ?>
                                <?php foreach ($brands as $b): ?>
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="p-4 font-bold text-[#182230]"><?= $b['display_order'] ?></td>
                                        <td class="p-4 font-black text-[#182230] text-sm"><?= htmlspecialchars($b['name']) ?></td>
                                        <td class="p-4 text-[#64748B] font-mono text-[11px]"><?= htmlspecialchars($b['slug']) ?></td>
                                        <td class="p-4 text-[#475467] max-w-xs truncate"><?= htmlspecialchars($b['description'] ?? '-') ?></td>
                                        <td class="p-4"><?= $b['is_featured'] ? '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-[#1677FF] font-bold text-[10px]">⭐ Oui</span>' : '<span class="text-slate-400 text-[10px]">Non</span>' ?></td>
                                        <td class="p-4">
                                            <form method="POST" class="inline">
                                                <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                                <input type="hidden" name="action" value="toggle_active">
                                                <input type="hidden" name="id" value="<?= $b['id'] ?>">
                                                <button type="submit" class="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer <?= $b['is_active'] ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>"><?= $b['is_active'] ? 'Actif' : 'Inactif' ?></button>
                                            </form>
                                        </td>
                                        <td class="p-4 text-right space-x-2">
                                            <button type="button" onclick='openEditModal(<?= json_encode($b) ?>)' class="p-1.5 rounded-lg text-[#1677FF] hover:bg-blue-50 cursor-pointer"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                            <form method="POST" class="inline" onsubmit="return confirm('Supprimer cette marque ?');">
                                                <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $b['id'] ?>">
                                                <button type="submit" class="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<div id="brandModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8EDF3]">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 id="modalTitle" class="text-sm font-black text-[#182230]">Ajouter une Marque</h2>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
            <input type="hidden" id="formAction" name="action" value="create">
            <input type="hidden" id="brandId" name="id" value="">
            <div>
                <label class="block font-bold text-[#182230] mb-1">Nom de la Marque *</label>
                <input type="text" id="brandName" name="name" required placeholder="Ex: Apple, Samsung, Sony" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Slug (URL)</label>
                <input type="text" id="brandSlug" name="slug" placeholder="ex: apple (automatique si vide)" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Description</label>
                <textarea id="brandDesc" name="description" rows="2" placeholder="Description de la marque..." class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Ordre d'affichage</label>
                <input type="number" id="brandOrder" name="display_order" value="0" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div class="flex items-center gap-6 pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" id="brandActive" name="is_active" checked class="w-4 h-4 rounded text-[#1677FF]">
                    <span>Actif</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" id="brandFeatured" name="is_featured" class="w-4 h-4 rounded text-[#1677FF]">
                    <span>Afficher sur l'accueil</span>
                </label>
            </div>
            <div class="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onclick="closeModal()" class="btn-clean py-2 px-4 rounded-xl text-xs font-bold">Annuler</button>
                <button type="submit" class="btn-electric py-2 px-6 rounded-xl text-xs font-black">Enregistrer</button>
            </div>
        </form>
    </div>
</div>

<script>
function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Ajouter une Marque';
    document.getElementById('formAction').value = 'create';
    document.getElementById('brandId').value = '';
    document.getElementById('brandName').value = '';
    document.getElementById('brandSlug').value = '';
    document.getElementById('brandDesc').value = '';
    document.getElementById('brandOrder').value = '0';
    document.getElementById('brandActive').checked = true;
    document.getElementById('brandFeatured').checked = false;
    var _m = document.getElementById('brandModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function openEditModal(brand) {
    document.getElementById('modalTitle').textContent = 'Modifier la Marque : ' + brand.name;
    document.getElementById('formAction').value = 'update';
    document.getElementById('brandId').value = brand.id;
    document.getElementById('brandName').value = brand.name;
    document.getElementById('brandSlug').value = brand.slug;
    document.getElementById('brandDesc').value = brand.description || '';
    document.getElementById('brandOrder').value = brand.display_order || 0;
    document.getElementById('brandActive').checked = (brand.is_active == 1);
    document.getElementById('brandFeatured').checked = (brand.is_featured == 1);
    var _m = document.getElementById('brandModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function closeModal() { var _m = document.getElementById('brandModal'); if (_m) { _m.style.display = 'none'; _m.classList.add('hidden'); } }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>\n