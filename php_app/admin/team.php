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
            $role = sanitize($_POST['role'] ?? '');
            $dept = sanitize($_POST['department'] ?? 'Direction');
            $bio = sanitize($_POST['bio'] ?? '');
            $img = sanitize($_POST['image'] ?? 'assets/images/profile_pic1.webp');
            $display_order = (int)($_POST['display_order'] ?? 0);
            $is_active = isset($_POST['is_active']) ? 1 : 0;

            if (empty($name) || empty($role)) {
                $message = "Le nom et le poste sont obligatoires.";
                $messageType = 'error';
            } else {
                if ($action === 'create') {
                    $id = 'tm_' . time() . '_' . rand(100, 999);
                    $stmt = $pdo->prepare("INSERT INTO team_members (id, name, role, department, bio, image, display_order, is_active) VALUES (:id, :n, :r, :d, :b, :img, :do, :ia)");
                    $stmt->execute([':id'=>$id, ':n'=>$name, ':r'=>$role, ':d'=>$dept, ':b'=>$bio, ':img'=>$img, ':do'=>$display_order, ':ia'=>$is_active]);
                    $message = "Membre « {$name} » ajouté !";
                } else {
                    $stmt = $pdo->prepare("UPDATE team_members SET name = :n, role = :r, department = :d, bio = :b, image = :img, display_order = :do, is_active = :ia WHERE id = :id");
                    $stmt->execute([':id'=>$id, ':n'=>$name, ':r'=>$role, ':d'=>$dept, ':b'=>$bio, ':img'=>$img, ':do'=>$display_order, ':ia'=>$is_active]);
                    $message = "Membre mis à jour !";
                }
            }
        } elseif ($action === 'delete') {
            $id = sanitize($_POST['id'] ?? '');
            if ($id) {
                $stmt = $pdo->prepare("DELETE FROM team_members WHERE id = :id");
                $stmt->execute([':id' => $id]);
                $message = "Membre supprimé !";
            }
        }
    }
}

$members = $pdo ? $pdo->query("SELECT * FROM team_members ORDER BY display_order ASC, id ASC")->fetchAll(PDO::FETCH_ASSOC) : [];
$pageTitle = "Équipe Officielle — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>
<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>
    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="users" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Gestion de l'Équipe (<?= count($members) ?>)</span>
            </h1>
            <button type="button" onclick="openCreateModal()" class="btn-electric py-2 px-4 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4"></i>
                <span>Ajouter un Membre</span>
            </button>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <?php foreach ($members as $m): ?>
                    <div class="card-clean p-5 bg-white rounded-2xl border border-[#E8EDF3] flex flex-col justify-between space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-black text-lg shrink-0">
                                <?= mb_substr($m['name'], 0, 1) ?>
                            </div>
                            <div class="min-w-0">
                                <h2 class="text-sm font-black text-[#182230] truncate"><?= htmlspecialchars($m['name']) ?></h2>
                                <p class="text-xs text-[#1677FF] font-bold truncate"><?= htmlspecialchars($m['role']) ?></p>
                                <span class="text-[10px] text-[#64748B] block"><?= htmlspecialchars($m['department']) ?></span>
                            </div>
                        </div>
                        <?php if (!empty($m['bio'])): ?>
                            <p class="text-xs text-[#475467] line-clamp-2"><?= htmlspecialchars($m['bio']) ?></p>
                        <?php endif; ?>
                        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold <?= $m['is_active'] ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500' ?>"><?= $m['is_active'] ? 'Actif' : 'Inactif' ?></span>
                            <div class="space-x-1">
                                <button type="button" onclick='openEditModal(<?= json_encode($m) ?>)' class="p-1 rounded-lg text-[#1677FF] hover:bg-blue-50"><i data-lucide="edit-2" class="w-4 h-4"></i></button>
                                <form method="POST" class="inline" onsubmit="return confirm('Supprimer ce membre ?');">
                                    <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?= $m['id'] ?>">
                                    <button type="submit" class="p-1 rounded-lg text-rose-700 hover:bg-rose-50"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</div>

<div id="teamModal" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 hidden" style="display: none;">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8EDF3]">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 id="modalTitle" class="text-sm font-black text-[#182230]">Ajouter un Membre</h2>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-slate-600 font-black text-sm">✕</button>
        </div>
        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
            <input type="hidden" id="formAction" name="action" value="create">
            <input type="hidden" id="memberId" name="id" value="">
            <div>
                <label class="block font-bold text-[#182230] mb-1">Nom Complet *</label>
                <input type="text" id="memberName" name="name" required placeholder="Ex: Mamadou Ndiaye" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Poste / Rôle *</label>
                    <input type="text" id="memberRole" name="role" required placeholder="Ex: Directeur Général" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Département</label>
                    <input type="text" id="memberDept" name="department" value="Direction" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
            </div>
            <div>
                <label class="block font-bold text-[#182230] mb-1">Bio / Présentation</label>
                <textarea id="memberBio" name="bio" rows="2" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-2.5 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
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
    document.getElementById('modalTitle').textContent = 'Ajouter un Membre';
    document.getElementById('formAction').value = 'create';
    document.getElementById('memberId').value = '';
    document.getElementById('memberName').value = '';
    document.getElementById('memberRole').value = '';
    document.getElementById('memberDept').value = 'Direction';
    document.getElementById('memberBio').value = '';
    var _m = document.getElementById('teamModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function openEditModal(m) {
    document.getElementById('modalTitle').textContent = 'Modifier : ' + m.name;
    document.getElementById('formAction').value = 'update';
    document.getElementById('memberId').value = m.id;
    document.getElementById('memberName').value = m.name;
    document.getElementById('memberRole').value = m.role;
    document.getElementById('memberDept').value = m.department || 'Direction';
    document.getElementById('memberBio').value = m.bio || '';
    var _m = document.getElementById('teamModal'); if (_m) { _m.style.display = 'flex'; _m.classList.remove('hidden'); }
}
function closeModal() { var _m = document.getElementById('teamModal'); if (_m) { _m.style.display = 'none'; _m.classList.add('hidden'); } }
</script>
<?php require_once __DIR__ . '/../includes/footer.php'; ?>\n