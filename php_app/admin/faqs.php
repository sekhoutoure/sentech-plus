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
            $category = sanitize($_POST['category'] ?? 'Général');
            $question = sanitize($_POST['question'] ?? '');
            $answer = sanitize($_POST['answer'] ?? '');
            $display_order = (int)($_POST['display_order'] ?? 0);
            $is_active = isset($_POST['is_active']) ? 1 : 0;

            if (empty($question) || empty($answer)) {
                $message = "La question et la réponse sont obligatoires.";
                $messageType = 'error';
            } else {
                if ($action === 'create') {
                    $id = 'faq_' . time() . '_' . rand(100, 999);
                    $stmt = $pdo->prepare("INSERT INTO faqs (id, category, question, answer, display_order, is_active) VALUES (:id, :cat, :q, :a, :do, :ia)");
                    $stmt->execute([':id'=>$id, ':cat'=>$category, ':q'=>$question, ':a'=>$answer, ':do'=>$display_order, ':ia'=>$is_active]);
                    $message = "Question FAQ créée avec succès !";
                } else {
                    $stmt = $pdo->prepare("UPDATE faqs SET category = :cat, question = :q, answer = :a, display_order = :do, is_active = :ia WHERE id = :id");
                    $stmt->execute([':id'=>$id, ':cat'=>$category, ':q'=>$question, ':a'=>$answer, ':do'=>$display_order, ':ia'=>$is_active]);
                    $message = "Question FAQ mise à jour !";
                }
                if (class_exists('FastCache')) { FastCache::forget('all_faqs_all'); }
            }
        } elseif ($action === 'delete') {
            $id = sanitize($_POST['id'] ?? '');
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM faqs WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $message = "Question supprimée avec succès !";
                if (class_exists('FastCache')) { FastCache::forget('all_faqs_all'); }
            }
        } elseif ($action === 'toggle_active') {
            $id = sanitize($_POST['id'] ?? '');
            $stmt = $pdo->prepare("UPDATE faqs SET is_active = IF(is_active=1, 0, 1) WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $message = "Statut FAQ mis à jour !";
            if (class_exists('FastCache')) { FastCache::forget('all_faqs_all'); }
        }
    }
}

$faqs = $pdo ? $pdo->query("SELECT * FROM faqs ORDER BY category ASC, display_order ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC) : [];
$pageTitle = "Gestion FAQ — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>
<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>
    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="help-circle" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Gestion de la Foire Aux Questions (<?= count($faqs) ?>)</span>
            </h1>
            <button type="button" onclick="openCreateModal()" class="btn-electric py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter une Question</span>
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
                                <th class="p-4">Catégorie</th>
                                <th class="p-4">Question</th>
                                <th class="p-4">Réponse</th>
                                <th class="p-4">Ordre</th>
                                <th class="p-4">Statut</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (empty($faqs)): ?>
                                <tr><td colspan="6" class="p-8 text-center text-[#64748B]">Aucune question FAQ configurée.</td></tr>
                            <?php else: ?>
                                <?php foreach ($faqs as $f): ?>
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="p-4 font-bold text-[#0B54C2] bg-blue-50/50 rounded-lg"><?= htmlspecialchars($f['category']) ?></td>
                                        <td class="p-4 font-black text-[#182230] text-xs max-w-xs"><?= htmlspecialchars($f['question']) ?></td>
                                        <td class="p-4 text-[#475467] max-w-md truncate"><?= htmlspecialchars($f['answer']) ?></td>
                                        <td class="p-4 font-bold text-[#182230]"><?= $f['display_order'] ?></td>
                                        <td class="p-4">
                                            <form method="POST" class="inline">
                                                <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                                <input type="hidden" name="action" value="toggle_active">
                                                <input type="hidden" name="id" value="<?= $f['id'] ?>">
                                                <button type="submit" class="px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer <?= $f['is_active'] ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>"><?= $f['is_active'] ? 'Actif' : 'Inactif' ?></button>
                                            </form>
                                        </td>
                                        <td class="p-4 text-right space-x-2">
                                            <button type="button" onclick='openEditModal(<?= json_encode($f) ?>)' class="p-1.5 rounded-lg text-[#1677FF] hover:bg-blue-50 cursor-pointer"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                            <form method="POST" class="inline" onsubmit="return confirm('Supprimer cette question ?');">
                                                <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $f['id'] ?>">
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

<div id="faqModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8EDF3]">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 id="modalTitle" class="text-sm font-black text-[#182230]">Ajouter une Question FAQ</h2>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
            <input type="hidden" id="formAction" name="action" value="create">
            <input type="hidden" id="faqId" name="id" value="">
            <div>
                <label class="block font-bold text-[#182230] mb-1">Catégorie *</label>
                <select id="faqCategory" name="category" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                    <option value="Livraison">Livraison & Délais</option>
                    <option value="Paiement">Paiement & Sécurité</option>
                    <option value="Garantie">Garantie & Authenticité</option>
                    <option value="Retours">Retours & Remboursements</option>
                    <option value="Commandes">Commandes & Suivi</option>
                    <option value="Vendeurs">Espace Vendeurs</option>
                </select>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Question *</label>
                <input type="text" id="faqQuestion" name="question" required placeholder="Ex: Quels sont les délais de livraison à Dakar ?" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Réponse détaillée *</label>
                <textarea id="faqAnswer" name="answer" rows="4" required placeholder="Rédigez la réponse complète..." class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Ordre d'affichage</label>
                <input type="number" id="faqOrder" name="display_order" value="0" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" id="faqActive" name="is_active" checked class="w-4 h-4 rounded text-[#1677FF]">
                    <span>Publier sur le site</span>
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
    document.getElementById('modalTitle').textContent = 'Ajouter une Question FAQ';
    document.getElementById('formAction').value = 'create';
    document.getElementById('faqId').value = '';
    document.getElementById('faqQuestion').value = '';
    document.getElementById('faqAnswer').value = '';
    document.getElementById('faqOrder').value = '0';
    document.getElementById('faqActive').checked = true;
    var _m = document.getElementById('faqModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function openEditModal(faq) {
    document.getElementById('modalTitle').textContent = 'Modifier la Question FAQ';
    document.getElementById('formAction').value = 'update';
    document.getElementById('faqId').value = faq.id;
    document.getElementById('faqCategory').value = faq.category;
    document.getElementById('faqQuestion').value = faq.question;
    document.getElementById('faqAnswer').value = faq.answer;
    document.getElementById('faqOrder').value = faq.display_order || 0;
    document.getElementById('faqActive').checked = (faq.is_active == 1);
    var _m = document.getElementById('faqModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function closeModal() { var _m = document.getElementById('faqModal'); if (_m) { _m.style.display = 'none'; _m.classList.add('hidden'); } }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>\n