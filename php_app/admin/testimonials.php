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
            $name = sanitize($_POST['customer_name'] ?? '');
            $role = sanitize($_POST['customer_role'] ?? 'Client Vérifié');
            $loc = sanitize($_POST['customer_location'] ?? 'Dakar');
            $prod = sanitize($_POST['product_name'] ?? '');
            $rating = (int)($_POST['rating'] ?? 5);
            $comment = sanitize($_POST['comment'] ?? '');
            $is_featured = isset($_POST['is_featured']) ? 1 : 0;

            if (empty($name) || empty($comment)) {
                $message = "Le nom et le commentaire sont obligatoires.";
                $messageType = 'error';
            } else {
                if ($action === 'create') {
                    $id = 'testi_' . time() . '_' . rand(100, 999);
                    $stmt = $pdo->prepare("INSERT INTO testimonials (id, customer_name, customer_role, customer_location, product_name, rating, comment, is_featured) VALUES (:id, :name, :role, :loc, :prod, :r, :c, :if)");
                    $stmt->execute([':id'=>$id, ':name'=>$name, ':role'=>$role, ':loc'=>$loc, ':prod'=>$prod, ':r'=>$rating, ':c'=>$comment, ':if'=>$is_featured]);
                    $message = "Témoignage ajouté avec succès !";
                } else {
                    $stmt = $pdo->prepare("UPDATE testimonials SET customer_name = :name, customer_role = :role, customer_location = :loc, product_name = :prod, rating = :r, comment = :c, is_featured = :if WHERE id = :id");
                    $stmt->execute([':id'=>$id, ':name'=>$name, ':role'=>$role, ':loc'=>$loc, ':prod'=>$prod, ':r'=>$rating, ':c'=>$comment, ':if'=>$is_featured]);
                    $message = "Témoignage mis à jour !";
                }
                if (class_exists('FastCache')) { FastCache::forget('all_testimonials'); }
            }
        } elseif ($action === 'delete') {
            $id = sanitize($_POST['id'] ?? '');
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $message = "Témoignage supprimé !";
                if (class_exists('FastCache')) { FastCache::forget('all_testimonials'); }
            }
        }
    }
}

$testimonials = $pdo ? $pdo->query("SELECT * FROM testimonials ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC) : [];
$pageTitle = "Témoignages Clients — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>
<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>
    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="message-square" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Témoignages & Réassurance Clients (<?= count($testimonials) ?>)</span>
            </h1>
            <button type="button" onclick="openCreateModal()" class="btn-electric py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter un Témoignage</span>
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
                                <th class="p-4">Client</th>
                                <th class="p-4">Localisation</th>
                                <th class="p-4">Produit acheté</th>
                                <th class="p-4">Note</th>
                                <th class="p-4">Témoignage</th>
                                <th class="p-4">Accueil</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (empty($testimonials)): ?>
                                <tr><td colspan="7" class="p-8 text-center text-[#64748B]">Aucun témoignage enregistré.</td></tr>
                            <?php else: ?>
                                <?php foreach ($testimonials as $t): ?>
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="p-4 font-black text-[#182230]"><?= htmlspecialchars($t['customer_name']) ?></td>
                                        <td class="p-4 text-[#64748B]"><?= htmlspecialchars($t['customer_location'] ?? 'Dakar') ?></td>
                                        <td class="p-4 font-semibold text-[#0B54C2]"><?= htmlspecialchars($t['product_name'] ?? '-') ?></td>
                                        <td class="p-4 text-amber-700 font-bold"><?= str_repeat('★', (int)$t['rating']) ?></td>
                                        <td class="p-4 text-[#475467] max-w-sm truncate italic">"<?= htmlspecialchars($t['comment']) ?>"</td>
                                        <td class="p-4"><?= $t['is_featured'] ? '<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">✓ Oui</span>' : '<span class="text-slate-400 text-[10px]">Non</span>' ?></td>
                                        <td class="p-4 text-right space-x-2">
                                            <button type="button" onclick='openEditModal(<?= json_encode($t) ?>)' class="p-1.5 rounded-lg text-[#1677FF] hover:bg-blue-50 cursor-pointer"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                            <form method="POST" class="inline" onsubmit="return confirm('Supprimer ce témoignage ?');">
                                                <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $t['id'] ?>">
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

<div id="testiModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8EDF3]">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 id="modalTitle" class="text-sm font-black text-[#182230]">Ajouter un Témoignage</h2>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
            <input type="hidden" id="formAction" name="action" value="create">
            <input type="hidden" id="testiId" name="id" value="">
            <div>
                <label class="block font-bold text-[#182230] mb-1">Nom du Client *</label>
                <input type="text" id="testiName" name="customer_name" required placeholder="Ex: Moussa Diop" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Ville / Quartier</label>
                    <input type="text" id="testiLoc" name="customer_location" placeholder="Ex: Dakar Plateau" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Produit acheté</label>
                    <input type="text" id="testiProd" name="product_name" placeholder="Ex: Casque Studio ANC" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Note (1 à 5 étoiles)</label>
                <select id="testiRating" name="rating" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-bold text-amber-800 focus:outline-none focus:border-[#1677FF]">
                    <option value="5">★★★★★ (5/5)</option>
                    <option value="4">★★★★☆ (4/5)</option>
                    <option value="3">★★★☆☆ (3/5)</option>
                </select>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Témoignage complet *</label>
                <textarea id="testiComment" name="comment" rows="3" required placeholder="Avis et retour d'expérience du client..." class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" id="testiFeatured" name="is_featured" checked class="w-4 h-4 rounded text-[#1677FF]">
                    <span>Afficher sur la page d'accueil</span>
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
    document.getElementById('modalTitle').textContent = 'Ajouter un Témoignage';
    document.getElementById('formAction').value = 'create';
    document.getElementById('testiId').value = '';
    document.getElementById('testiName').value = '';
    document.getElementById('testiLoc').value = 'Dakar';
    document.getElementById('testiProd').value = '';
    document.getElementById('testiRating').value = '5';
    document.getElementById('testiComment').value = '';
    document.getElementById('testiFeatured').checked = true;
    var _m = document.getElementById('testiModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function openEditModal(t) {
    document.getElementById('modalTitle').textContent = 'Modifier le Témoignage : ' + t.customer_name;
    document.getElementById('formAction').value = 'update';
    document.getElementById('testiId').value = t.id;
    document.getElementById('testiName').value = t.customer_name;
    document.getElementById('testiLoc').value = t.customer_location || 'Dakar';
    document.getElementById('testiProd').value = t.product_name || '';
    document.getElementById('testiRating').value = t.rating || 5;
    document.getElementById('testiComment').value = t.comment || '';
    document.getElementById('testiFeatured').checked = (t.is_featured == 1);
    var _m = document.getElementById('testiModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function closeModal() { var _m = document.getElementById('testiModal'); if (_m) { _m.style.display = 'none'; _m.classList.add('hidden'); } }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>\n