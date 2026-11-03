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
            $emoji = sanitize($_POST['emoji'] ?? '⚡');
            $title = sanitize($_POST['title'] ?? '');
            $client = sanitize($_POST['client_name'] ?? '');
            $city = sanitize($_POST['city'] ?? 'Dakar');
            $context = sanitize($_POST['context'] ?? '');
            $result = sanitize($_POST['result'] ?? '');
            $color = sanitize($_POST['color'] ?? '#1677FF');
            $link = sanitize($_POST['link_url'] ?? 'shop.php');
            $display_order = (int)($_POST['display_order'] ?? 0);
            $is_active = isset($_POST['is_active']) ? 1 : 0;

            $m1_val = sanitize($_POST['m1_val'] ?? '');
            $m1_lbl = sanitize($_POST['m1_lbl'] ?? '');
            $m2_val = sanitize($_POST['m2_val'] ?? '');
            $m2_lbl = sanitize($_POST['m2_lbl'] ?? '');
            $m3_val = sanitize($_POST['m3_val'] ?? '');
            $m3_lbl = sanitize($_POST['m3_lbl'] ?? '');

            $metrics = [
                ['val' => $m1_val, 'lbl' => $m1_lbl],
                ['val' => $m2_val, 'lbl' => $m2_lbl],
                ['val' => $m3_val, 'lbl' => $m3_lbl]
            ];
            $metrics_json = json_encode(array_values(array_filter($metrics, function($m) { return !empty($m['val']); })), JSON_UNESCAPED_UNICODE);

            $tags_raw = sanitize($_POST['tags'] ?? '');
            $tags_arr = array_values(array_filter(array_map('trim', explode(',', $tags_raw))));
            $tags_json = json_encode($tags_arr, JSON_UNESCAPED_UNICODE);

            if (empty($title) || empty($client)) {
                $message = "Le titre et le client sont obligatoires.";
                $messageType = 'error';
            } else {
                if ($action === 'create') {
                    $id = 'cs_' . time() . '_' . rand(100, 999);
                    $stmt = $pdo->prepare("INSERT INTO case_studies (id, emoji, title, client_name, city, context, result, metrics, tags, color, link_url, display_order, is_active) VALUES (:id, :em, :t, :c, :city, :ctx, :res, :m, :tags, :col, :link, :do, :ia)");
                    $stmt->execute([':id'=>$id, ':em'=>$emoji, ':t'=>$title, ':c'=>$client, ':city'=>$city, ':ctx'=>$context, ':res'=>$result, ':m'=>$metrics_json, ':tags'=>$tags_json, ':col'=>$color, ':link'=>$link, ':do'=>$display_order, ':ia'=>$is_active]);
                    $message = "Étude de cas créée avec succès !";
                } else {
                    $stmt = $pdo->prepare("UPDATE case_studies SET emoji = :em, title = :t, client_name = :c, city = :city, context = :ctx, result = :res, metrics = :m, tags = :tags, color = :col, link_url = :link, display_order = :do, is_active = :ia WHERE id = :id");
                    $stmt->execute([':id'=>$id, ':em'=>$emoji, ':t'=>$title, ':c'=>$client, ':city'=>$city, ':ctx'=>$context, ':res'=>$result, ':m'=>$metrics_json, ':tags'=>$tags_json, ':col'=>$color, ':link'=>$link, ':do'=>$display_order, ':ia'=>$is_active]);
                    $message = "Étude de cas mise à jour !";
                }
            }
        } elseif ($action === 'delete') {
            $id = sanitize($_POST['id'] ?? '');
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM case_studies WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $message = "Étude supprimée !";
            }
        }
    }
}

$cases = $pdo ? $pdo->query("SELECT * FROM case_studies ORDER BY display_order ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC) : [];
$pageTitle = "Études de Cas & Délais — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>
<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>
    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="file-check" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Études de Cas & Protocoles de Livraison (<?= count($cases) ?>)</span>
            </h1>
            <button type="button" onclick="openCreateModal()" class="btn-electric py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter un Protocole / Cas</span>
            </button>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <?php foreach ($cases as $cs): 
                    $metrics = is_string($cs['metrics']) ? (json_decode($cs['metrics'], true) ?: []) : $cs['metrics'];
                ?>
                    <div class="card-clean p-5 bg-white rounded-2xl border border-[#E8EDF3] flex flex-col justify-between space-y-3">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="text-2xl"><?= htmlspecialchars($cs['emoji']) ?></span>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold <?= $cs['is_active'] ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>"><?= $cs['is_active'] ? 'Actif' : 'Inactif' ?></span>
                            </div>
                            <h2 class="text-base font-black text-[#182230] mt-2"><?= htmlspecialchars($cs['title']) ?></h2>
                            <p class="text-xs font-bold text-[#0B54C2]"><?= htmlspecialchars($cs['client_name']) ?> • <?= htmlspecialchars($cs['city']) ?></p>
                            <p class="text-xs text-[#64748B] mt-2 line-clamp-2"><?= htmlspecialchars($cs['result']) ?></p>
                            
                            <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
                                <?php foreach ($metrics as $m): ?>
                                    <div class="text-center p-2 rounded-lg bg-slate-50">
                                        <span class="block font-black text-xs text-[#182230]"><?= htmlspecialchars($m['val'] ?? '') ?></span>
                                        <span class="block text-[9px] text-[#64748B] truncate"><?= htmlspecialchars($m['lbl'] ?? '') ?></span>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span class="text-[10px] text-slate-400">Ordre : <?= $cs['display_order'] ?></span>
                            <div class="space-x-1">
                                <button type="button" onclick='openEditModal(<?= json_encode($cs) ?>)' class="p-1 rounded-lg text-[#1677FF] hover:bg-blue-50 cursor-pointer"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                <form method="POST" class="inline" onsubmit="return confirm('Supprimer ce cas ?');">
                                    <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= $cs['id'] ?>">
                                    <button type="submit" class="p-1 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</div>

<div id="csModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8EDF3] max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 id="modalTitle" class="text-sm font-black text-[#182230]">Ajouter un Protocole / Cas</h2>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
            <input type="hidden" id="formAction" name="action" value="create">
            <input type="hidden" id="csId" name="id" value="">
            <div class="grid grid-cols-4 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Emoji</label>
                    <input type="text" id="csEmoji" name="emoji" value="🎧" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium text-center text-lg focus:outline-none focus:border-[#1677FF]">
                </div>
                <div class="col-span-3">
                    <label class="block font-bold text-[#182230] mb-1">Titre *</label>
                    <input type="text" id="csTitle" name="title" required placeholder="Ex: Protocole Livraison Express" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Client / Contexte</label>
                    <input type="text" id="csClient" name="client_name" required placeholder="Ex: Commande Express Audio" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Ville / Région</label>
                    <input type="text" id="csCity" name="city" value="Dakar" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Contexte du besoin</label>
                <textarea id="csContext" name="context" rows="2" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Résultat garanti</label>
                <textarea id="csResult" name="result" rows="2" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div class="grid grid-cols-3 gap-2">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Métrique 1</label>
                    <input type="text" id="m1_val" name="m1_val" placeholder="24h-48h" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2 rounded-xl text-[11px]">
                    <input type="text" id="m1_lbl" name="m1_lbl" placeholder="Délai moyen" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2 rounded-xl text-[11px] mt-1">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Métrique 2</label>
                    <input type="text" id="m2_val" name="m2_val" placeholder="100%" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2 rounded-xl text-[11px]">
                    <input type="text" id="m2_lbl" name="m2_lbl" placeholder="Original" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2 rounded-xl text-[11px] mt-1">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Métrique 3</label>
                    <input type="text" id="m3_val" name="m3_val" placeholder="Wave / OM" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2 rounded-xl text-[11px]">
                    <input type="text" id="m3_lbl" name="m3_lbl" placeholder="Paiement" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2 rounded-xl text-[11px] mt-1">
                </div>
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
    document.getElementById('modalTitle').textContent = 'Ajouter un Cas';
    document.getElementById('formAction').value = 'create';
    document.getElementById('csId').value = '';
    document.getElementById('csEmoji').value = '🎧';
    document.getElementById('csTitle').value = '';
    document.getElementById('csClient').value = '';
    document.getElementById('csCity').value = 'Dakar';
    document.getElementById('csContext').value = '';
    document.getElementById('csResult').value = '';
    var _m = document.getElementById('csModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function openEditModal(cs) {
    document.getElementById('modalTitle').textContent = 'Modifier : ' + cs.title;
    document.getElementById('formAction').value = 'update';
    document.getElementById('csId').value = cs.id;
    document.getElementById('csEmoji').value = cs.emoji || '⚡';
    document.getElementById('csTitle').value = cs.title;
    document.getElementById('csClient').value = cs.client_name;
    document.getElementById('csCity').value = cs.city || 'Dakar';
    document.getElementById('csContext').value = cs.context || '';
    document.getElementById('csResult').value = cs.result || '';
    var m = [];
    if (typeof cs.metrics === 'string') {
        try { m = JSON.parse(cs.metrics) || []; } catch(e){}
    } else if (Array.isArray(cs.metrics)) { m = cs.metrics; }
    if (m[0]) { document.getElementById('m1_val').value = m[0].val || ''; document.getElementById('m1_lbl').value = m[0].lbl || ''; }
    if (m[1]) { document.getElementById('m2_val').value = m[1].val || ''; document.getElementById('m2_lbl').value = m[1].lbl || ''; }
    if (m[2]) { document.getElementById('m3_val').value = m[2].val || ''; document.getElementById('m3_lbl').value = m[2].lbl || ''; }
    var _m = document.getElementById('csModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function closeModal() { var _m = document.getElementById('csModal'); if (_m) { _m.style.display = 'none'; _m.classList.add('hidden'); } }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>\n