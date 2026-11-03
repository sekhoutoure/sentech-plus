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
            $price = (float)($_POST['price'] ?? 0);
            $billing = sanitize($_POST['billing_period'] ?? 'mois');
            $desc = sanitize($_POST['description'] ?? '');
            $badge = sanitize($_POST['badge_text'] ?? '');
            $comm = (float)($_POST['commission_rate'] ?? 0);
            $max_prod = (int)($_POST['max_products'] ?? 0);
            $features_raw = $_POST['features'] ?? '';
            $features_arr = array_values(array_filter(array_map('trim', explode("\n", $features_raw))));
            $features_json = json_encode($features_arr, JSON_UNESCAPED_UNICODE);
            $is_popular = isset($_POST['is_popular']) ? 1 : 0;
            $is_active = isset($_POST['is_active']) ? 1 : 0;
            $display_order = (int)($_POST['display_order'] ?? 0);

            if (empty($name)) {
                $message = "Le nom du forfait est obligatoire.";
                $messageType = 'error';
            } else {
                if ($action === 'create') {
                    $id = 'plan_' . time() . '_' . rand(100, 999);
                    $stmt = $pdo->prepare("INSERT INTO seller_plans (id, name, slug, price, billing_period, description, badge_text, commission_rate, max_products, features, is_popular, is_active, display_order) VALUES (:id, :name, :slug, :price, :b, :desc, :badge, :comm, :mp, :f, :ip, :ia, :do)");
                    $stmt->execute([':id'=>$id, ':name'=>$name, ':slug'=>$slug, ':price'=>$price, ':b'=>$billing, ':desc'=>$desc, ':badge'=>$badge, ':comm'=>$comm, ':mp'=>$max_prod, ':f'=>$features_json, ':ip'=>$is_popular, ':ia'=>$is_active, ':do'=>$display_order]);
                    $message = "Formule vendeur « {$name} » créée avec succès !";
                } else {
                    $stmt = $pdo->prepare("UPDATE seller_plans SET name = :name, slug = :slug, price = :price, billing_period = :b, description = :desc, badge_text = :badge, commission_rate = :comm, max_products = :mp, features = :f, is_popular = :ip, is_active = :ia, display_order = :do WHERE id = :id");
                    $stmt->execute([':id'=>$id, ':name'=>$name, ':slug'=>$slug, ':price'=>$price, ':b'=>$billing, ':desc'=>$desc, ':badge'=>$badge, ':comm'=>$comm, ':mp'=>$max_prod, ':f'=>$features_json, ':ip'=>$is_popular, ':ia'=>$is_active, ':do'=>$display_order]);
                    $message = "Formule vendeur mise à jour !";
                }
                if (class_exists('FastCache')) { FastCache::forget('all_seller_plans'); }
            }
        } elseif ($action === 'delete') {
            $id = sanitize($_POST['id'] ?? '');
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM seller_plans WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $message = "Formule supprimée !";
                if (class_exists('FastCache')) { FastCache::forget('all_seller_plans'); }
            }
        }
    }
}

$plans = $pdo ? $pdo->query("SELECT * FROM seller_plans ORDER BY display_order ASC, price ASC")->fetchAll(PDO::FETCH_ASSOC) : [];
$pageTitle = "Formules Vendeurs — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>
<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>
    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="credit-card" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Formules d'Adhésion Marketplace (<?= count($plans) ?>)</span>
            </h1>
            <button type="button" onclick="openCreateModal()" class="btn-electric py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter une Formule</span>
            </button>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <?php foreach ($plans as $p): 
                    $feats = is_string($p['features']) ? (json_decode($p['features'], true) ?: []) : $p['features'];
                ?>
                    <div class="card-clean p-6 bg-white rounded-2xl border <?= $p['is_popular'] ? 'border-2 border-[#1677FF] shadow-md' : 'border-[#E8EDF3]' ?> flex flex-col justify-between space-y-4">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase text-[#0B54C2]"><?= htmlspecialchars($p['badge_text'] ?: 'Forfait') ?></span>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold <?= $p['is_active'] ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>"><?= $p['is_active'] ? 'Actif' : 'Inactif' ?></span>
                            </div>
                            <h2 class="text-lg font-black text-[#182230] mt-1"><?= htmlspecialchars($p['name']) ?></h2>
                            <p class="text-2xl font-black text-[#1677FF] mt-2">
                                <?= $p['price'] > 0 ? formatPrice($p['price']) : 'Gratuit' ?>
                                <?php if ($p['price'] > 0): ?><span class="text-xs font-normal text-[#64748B]">/<?= htmlspecialchars($p['billing_period']) ?></span><?php endif; ?>
                            </p>
                            <p class="text-xs text-[#64748B] mt-1"><?= htmlspecialchars($p['description']) ?></p>
                            <hr class="my-3 border-slate-100">
                            <ul class="space-y-1.5 text-xs text-[#334155]">
                                <li class="font-bold text-[#182230]">Commission : <?= $p['commission_rate'] ?>%</li>
                                <li class="font-bold text-[#182230]">Limite : <?= $p['max_products'] > 0 ? $p['max_products'] . ' produits' : 'Illimité' ?></li>
                                <?php foreach ($feats as $f): ?>
                                    <li class="flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5 text-emerald-800 shrink-0"></i> <span><?= htmlspecialchars($f) ?></span></li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                        <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <button type="button" onclick='openEditModal(<?= json_encode($p) ?>)' class="btn-clean py-2 px-3 rounded-xl text-xs font-bold w-full text-center">Modifier</button>
                            <form method="POST" class="inline" onsubmit="return confirm('Supprimer ce forfait ?');">
                                <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?= $p['id'] ?>">
                                <button type="submit" class="p-2 rounded-xl text-rose-700 hover:bg-rose-50"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</div>

<div id="planModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8EDF3] max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 id="modalTitle" class="text-sm font-black text-[#182230]">Ajouter une Formule</h2>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
            <input type="hidden" id="formAction" name="action" value="create">
            <input type="hidden" id="planId" name="id" value="">
            <div>
                <label class="block font-bold text-[#182230] mb-1">Nom du Forfait *</label>
                <input type="text" id="planName" name="name" required placeholder="Ex: Découverte, Pro Dakar" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Prix (FCFA) *</label>
                    <input type="number" id="planPrice" name="price" value="0" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-bold focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Période</label>
                    <input type="text" id="planBilling" name="billing_period" value="mois" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Taux Commission (%)</label>
                    <input type="number" step="0.1" id="planComm" name="commission_rate" value="5.0" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-bold focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Max Produits (0 = illimité)</label>
                    <input type="number" id="planMaxProd" name="max_products" value="50" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Badge marketing (ex: Recommandé)</label>
                <input type="text" id="planBadge" name="badge_text" placeholder="Recommandé, Populaire..." class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Description</label>
                <textarea id="planDesc" name="description" rows="2" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Fonctionnalités (1 par ligne)</label>
                <textarea id="planFeatures" name="features" rows="4" placeholder="Jusqu'à 50 produits&#10;Boutique personnalisée&#10;Support WhatsApp 7j/7" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-mono focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>
            <div class="flex items-center gap-6 pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" id="planPopular" name="is_popular" class="w-4 h-4 rounded text-[#1677FF]">
                    <span>Mettre en avant (Bordure bleue)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" id="planActive" name="is_active" checked class="w-4 h-4 rounded text-[#1677FF]">
                    <span>Actif</span>
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
    document.getElementById('modalTitle').textContent = 'Ajouter une Formule';
    document.getElementById('formAction').value = 'create';
    document.getElementById('planId').value = '';
    document.getElementById('planName').value = '';
    document.getElementById('planPrice').value = '0';
    document.getElementById('planBilling').value = 'mois';
    document.getElementById('planComm').value = '5.0';
    document.getElementById('planMaxProd').value = '50';
    document.getElementById('planBadge').value = '';
    document.getElementById('planDesc').value = '';
    document.getElementById('planFeatures').value = '';
    document.getElementById('planPopular').checked = false;
    document.getElementById('planActive').checked = true;
    var _m = document.getElementById('planModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function openEditModal(p) {
    document.getElementById('modalTitle').textContent = 'Modifier : ' + p.name;
    document.getElementById('formAction').value = 'update';
    document.getElementById('planId').value = p.id;
    document.getElementById('planName').value = p.name;
    document.getElementById('planPrice').value = p.price;
    document.getElementById('planBilling').value = p.billing_period || 'mois';
    document.getElementById('planComm').value = p.commission_rate || '0';
    document.getElementById('planMaxProd').value = p.max_products || '0';
    document.getElementById('planBadge').value = p.badge_text || '';
    document.getElementById('planDesc').value = p.description || '';
    var feats = [];
    if (typeof p.features === 'string') {
        try { feats = JSON.parse(p.features) || []; } catch(e){}
    } else if (Array.isArray(p.features)) { feats = p.features; }
    document.getElementById('planFeatures').value = feats.join('\n');
    document.getElementById('planPopular').checked = (p.is_popular == 1);
    document.getElementById('planActive').checked = (p.is_active == 1);
    var _m = document.getElementById('planModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function closeModal() { var _m = document.getElementById('planModal'); if (_m) { _m.style.display = 'none'; _m.classList.add('hidden'); } }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>\n