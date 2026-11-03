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
$tableExists = false;

// Check if table exists
if ($pdo) {
    try {
        $pdo->query("SELECT 1 FROM banners LIMIT 1");
        $tableExists = true;
    } catch (Throwable $e) {
        $tableExists = false;
    }
}

// ── CSRF helper ─────────────────────────────────────────────────────────────
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf_token'];

// ── Handle POST ─────────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && $tableExists) {
    $action = $_POST['action'] ?? '';

    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = 'Erreur de sécurité : jeton CSRF invalide.';
        $messageType = 'error';
    } else {

        // ── Upload helper via SecureUploader ────────────────────────────────
        function uploadBannerImage(string $fileKey, string $prefix, string $uploadDir): string {
            if (empty($_FILES[$fileKey]['name'])) return '';
            $res = SecureUploader::processImageUpload($_FILES[$fileKey], 'banners', 1920, 1080);
            return $res['success'] ? $res['path'] : '';
        }


        if ($action === 'create_banner' || $action === 'edit_banner') {
            $bid         = $action === 'edit_banner' ? (int)($_POST['banner_id'] ?? 0) : 0;
            $title       = sanitize($_POST['title'] ?? '');
            $subtitle    = sanitize($_POST['subtitle'] ?? '');
            $linkUrl     = sanitize($_POST['link_url'] ?? '');
            $btnText     = sanitize($_POST['button_text'] ?? '');
            $placement   = sanitize($_POST['placement'] ?? 'hero_home');
            $displayOrder = (int)($_POST['display_order'] ?? 0);
            $isActive    = isset($_POST['is_active']) ? 1 : 0;
            $startsAt    = !empty($_POST['starts_at']) ? $_POST['starts_at'] : null;
            $endsAt      = !empty($_POST['ends_at']) ? $_POST['ends_at'] : null;

            // Existing images (if editing)
            $imgDesktop = sanitize($_POST['existing_image_desktop'] ?? '');
            $imgMobile  = sanitize($_POST['existing_image_mobile'] ?? '');

            // Upload new images
            $upDesk = uploadBannerImage('image_desktop_file', 'desk', $uploadDir);
            $upMob  = uploadBannerImage('image_mobile_file',  'mob',  $uploadDir);
            if ($upDesk) $imgDesktop = $upDesk;
            if ($upMob)  $imgMobile  = $upMob;

            if (empty($title)) {
                $message = 'Le titre est obligatoire.';
                $messageType = 'error';
            } elseif (empty($imgDesktop)) {
                $message = 'Veuillez uploader une image desktop.';
                $messageType = 'error';
            } else {
                try {
                    if ($action === 'create_banner') {
                        $s = $pdo->prepare("INSERT INTO banners (title, subtitle, image_desktop, image_mobile, link_url, button_text, placement, display_order, is_active, starts_at, ends_at) VALUES (:t,:s,:id,:im,:lu,:bt,:pl,:do,:ia,:sa,:ea)");
                        $s->execute([':t'=>$title,':s'=>$subtitle,':id'=>$imgDesktop,':im'=>$imgMobile,':lu'=>$linkUrl,':bt'=>$btnText,':pl'=>$placement,':do'=>$displayOrder,':ia'=>$isActive,':sa'=>$startsAt,':ea'=>$endsAt]);
                        $message = "Affiche « $title » créée avec succès !";
                    } else {
                        $s = $pdo->prepare("UPDATE banners SET title=:t, subtitle=:s, image_desktop=:id, image_mobile=:im, link_url=:lu, button_text=:bt, placement=:pl, display_order=:do, is_active=:ia, starts_at=:sa, ends_at=:ea WHERE id=:bid");
                        $s->execute([':t'=>$title,':s'=>$subtitle,':id'=>$imgDesktop,':im'=>$imgMobile,':lu'=>$linkUrl,':bt'=>$btnText,':pl'=>$placement,':do'=>$displayOrder,':ia'=>$isActive,':sa'=>$startsAt,':ea'=>$endsAt,':bid'=>$bid]);
                        $message = "Affiche « $title » mise à jour !";
                    }
                } catch (Throwable $e) {
                    $message = 'Erreur DB : ' . htmlspecialchars($e->getMessage());
                    $messageType = 'error';
                }
            }

        } elseif ($action === 'toggle_active') {
            $bid = (int)($_POST['banner_id'] ?? 0);
            if ($bid && $pdo) {
                try {
                    $s = $pdo->prepare("UPDATE banners SET is_active = IF(is_active=1,0,1) WHERE id=:id");
                    $s->execute([':id'=>$bid]);
                    $message = 'Statut modifié.';
                } catch (Throwable $e) {}
            }
        } elseif ($action === 'delete_banner') {
            $bid = (int)($_POST['banner_id'] ?? 0);
            if ($bid && $pdo) {
                try {
                    // Delete images from disk
                    $sr = $pdo->prepare("SELECT image_desktop, image_mobile FROM banners WHERE id=:id");
                    $sr->execute([':id'=>$bid]);
                    $row = $sr->fetch(PDO::FETCH_ASSOC);
                    if ($row) {
                        foreach (['image_desktop','image_mobile'] as $col) {
                            $f = __DIR__ . '/../' . $row[$col];
                            if (!empty($row[$col]) && is_file($f)) @unlink($f);
                        }
                    }
                    $s = $pdo->prepare("DELETE FROM banners WHERE id=:id");
                    $s->execute([':id'=>$bid]);
                    $message = 'Affiche supprimée.';
                } catch (Throwable $e) {}
            }
        }
    }
}

// ── Fetch all banners ────────────────────────────────────────────────────────
$banners = [];
if ($pdo && $tableExists) {
    try {
        $s = $pdo->query("SELECT * FROM banners ORDER BY placement ASC, display_order ASC, id DESC");
        $banners = $s ? $s->fetchAll(PDO::FETCH_ASSOC) : [];
    } catch (Throwable $e) { $banners = []; }
}

$pageTitle = 'Gestion des Affiches — Admin SenTechPLUS';
$placements = [
    'hero_home'   => 'Hero Principal (Accueil)',
    'promo_home'  => 'Bannière Promo (Accueil)',
    'shop_top'    => 'Boutique — En-tête',
    'product_top' => 'Page Produit — En-tête',
];
?>
<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= htmlspecialchars($pageTitle) ?></title>
<link rel="stylesheet" href="../assets/css/output.css">
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
</head>
<body class="bg-[#F3F7FC] min-h-screen font-sans">

<div class="max-w-[1200px] mx-auto px-4 py-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
            <a href="index.php" class="w-9 h-9 rounded-xl bg-white border border-[#E8EDF3] flex items-center justify-center hover:bg-[#EAF3FF] transition-colors">
                <i data-lucide="arrow-left" class="w-4 h-4 text-[#667085]"></i>
            </a>
            <div>
                <h1 class="text-lg font-black text-[#182230]">Affiches Promotionnelles</h1>
                <p class="text-xs text-[#667085] font-medium">Gérez les bannières slider de votre site</p>
            </div>
        </div>
        <button type="button" onclick="document.getElementById('modal-add').classList.remove('hidden')" class="inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95">
            <i data-lucide="plus" class="w-4 h-4"></i> Nouvelle affiche
        </button>
    </div>

    <!-- Alert -->
    <?php if ($message): ?>
    <div class="px-4 py-3 rounded-xl text-sm font-semibold <?= $messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200' ?>">
        <?= htmlspecialchars($message) ?>
    </div>
    <?php endif; ?>

    <!-- Table not exists warning -->
    <?php if (!$tableExists): ?>
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div class="flex items-start gap-3">
            <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"></i>
            <div>
                <p class="font-bold text-amber-800 text-sm mb-1">Table `banners` introuvable</p>
                <p class="text-xs text-amber-700">Exécutez le fichier <code class="bg-amber-100 px-1 rounded">database/banners_migration.sql</code> dans phpMyAdmin pour créer la table.</p>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Banners list -->
    <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#E8EDF3]">
            <h2 class="text-sm font-black text-[#182230] uppercase tracking-wider">
                <?= count($banners) ?> affiche<?= count($banners) > 1 ? 's' : '' ?> au total
            </h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs min-w-[700px]">
                <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                    <tr>
                        <th class="p-3.5 pl-5">Aperçu</th>
                        <th class="p-3.5">Titre / Placement</th>
                        <th class="p-3.5">Ordre</th>
                        <th class="p-3.5">Dates</th>
                        <th class="p-3.5">Statut</th>
                        <th class="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#F3F7FC]">
                <?php if (empty($banners)): ?>
                    <tr>
                        <td colspan="6" class="p-10 text-center text-[#667085] text-sm">Aucune affiche. Cliquez sur "Nouvelle affiche" pour commencer.</td>
                    </tr>
                <?php endif; ?>
                <?php foreach ($banners as $b): ?>
                    <tr class="hover:bg-[#F8FBFF] transition-colors">
                        <td class="p-3.5 pl-5">
                            <?php if ($b['image_desktop']): ?>
                            <img src="../<?= htmlspecialchars($b['image_desktop']) ?>" alt="Aperçu bannière" width="80" height="48" style="aspect-ratio:5/3;" class="w-20 h-12 object-cover rounded-lg border border-[#E8EDF3]" loading="lazy">
                            <?php else: ?>
                            <div class="w-20 h-12 rounded-lg bg-[#F3F7FC] flex items-center justify-center">
                                <i data-lucide="image" class="w-5 h-5 text-[#CBD5E1]"></i>
                            </div>
                            <?php endif; ?>
                        </td>
                        <td class="p-3.5">
                            <p class="font-black text-[#182230] mb-0.5"><?= htmlspecialchars($b['title']) ?></p>
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] text-[10px] font-bold">
                                <?= htmlspecialchars($placements[$b['placement']] ?? $b['placement']) ?>
                            </span>
                        </td>
                        <td class="p-3.5 font-black text-[#182230] text-center"><?= (int)$b['display_order'] ?></td>
                        <td class="p-3.5 text-[#667085]">
                            <?php if ($b['starts_at']): ?>
                                <span class="block">Du <?= date('d/m/Y', strtotime($b['starts_at'])) ?></span>
                            <?php endif; ?>
                            <?php if ($b['ends_at']): ?>
                                <span class="block">Au <?= date('d/m/Y', strtotime($b['ends_at'])) ?></span>
                            <?php else: ?>
                                <span class="text-[#0D7D53] font-bold">Toujours active</span>
                            <?php endif; ?>
                        </td>
                        <td class="p-3.5">
                            <form method="POST">
                                <input type="hidden" name="action" value="toggle_active">
                                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                                <input type="hidden" name="banner_id" value="<?= (int)$b['id'] ?>">
                                <button type="submit" class="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border transition-all
                                    <?= $b['is_active'] ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-[#F3F7FC] text-[#667085] border-[#E8EDF3] hover:bg-[#EAF3FF]' ?>">
                                    <i data-lucide="<?= $b['is_active'] ? 'check-circle' : 'circle' ?>" class="w-3 h-3"></i>
                                    <?= $b['is_active'] ? 'Active' : 'Inactive' ?>
                                </button>
                            </form>
                        </td>
                        <td class="p-3.5 pr-5">
                            <div class="flex items-center justify-end gap-2">
                                <!-- Edit -->
                                <button type="button" onclick="openEditModal(<?= htmlspecialchars(json_encode($b)) ?>)"
                                    class="w-8 h-8 rounded-xl bg-[#F3F7FC] hover:bg-[#EAF3FF] border border-[#E8EDF3] flex items-center justify-center transition-colors">
                                    <i data-lucide="pencil" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                                </button>
                                <!-- Delete -->
                                <form method="POST" onsubmit="return confirm('Supprimer cette affiche ?')">
                                    <input type="hidden" name="action" value="delete_banner">
                                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
                                    <input type="hidden" name="banner_id" value="<?= (int)$b['id'] ?>">
                                    <button type="submit" class="w-8 h-8 rounded-xl bg-[#F3F7FC] hover:bg-red-50 border border-[#E8EDF3] hover:border-red-200 flex items-center justify-center transition-colors">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-500"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- ── MODAL ADD ───────────────────────────────────────────────────────────── -->
<div id="modal-add" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-[#E8EDF3] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
            <h2 class="text-base font-black text-[#182230]">Nouvelle affiche</h2>
            <button type="button" onclick="document.getElementById('modal-add').classList.add('hidden')" class="w-8 h-8 rounded-xl bg-[#F3F7FC] hover:bg-red-50 flex items-center justify-center transition-colors">
                <i data-lucide="x" class="w-4 h-4 text-[#667085]"></i>
            </button>
        </div>
        <form method="POST" enctype="multipart/form-data" class="p-6 space-y-4">
            <input type="hidden" name="action" value="create_banner">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Titre *</label>
                    <input type="text" name="title" required placeholder="Ex: Ventes Flash -35%" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Sous-titre</label>
                    <input type="text" name="subtitle" placeholder="Description courte (optionnel)" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Lien URL</label>
                    <input type="url" name="link_url" placeholder="https://... ou shop.php" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Texte bouton</label>
                    <input type="text" name="button_text" placeholder="Ex: Découvrir" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Emplacement</label>
                    <select name="placement" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                        <?php foreach ($placements as $val => $lab): ?>
                        <option value="<?= htmlspecialchars($val) ?>"><?= htmlspecialchars($lab) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Ordre d'affichage</label>
                    <input type="number" name="display_order" value="0" min="0" max="99" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Date début</label>
                    <input type="datetime-local" name="starts_at" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Date fin</label>
                    <input type="datetime-local" name="ends_at" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Image Desktop * <span class="text-[#667085] font-normal">(JPG/PNG/WEBP, max 5MB, recommandé: 1400×440px)</span></label>
                    <input type="file" name="image_desktop_file" accept=".jpg,.jpeg,.png,.webp" required class="w-full text-sm text-[#667085] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#EAF3FF] file:text-[#1677FF] file:font-bold hover:file:bg-[#1677FF] hover:file:text-white file:transition-colors">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Image Mobile <span class="text-[#667085] font-normal">(optionnel, recommandé: 750×900px)</span></label>
                    <input type="file" name="image_mobile_file" accept=".jpg,.jpeg,.png,.webp" class="w-full text-sm text-[#667085] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#F3F7FC] file:text-[#667085] file:font-bold file:transition-colors">
                </div>
                <div class="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" name="is_active" id="new-active" checked class="w-4 h-4 accent-[#1677FF]">
                    <label for="new-active" class="text-sm font-semibold text-[#182230]">Affiche active</label>
                </div>
            </div>

            <div class="flex gap-3 pt-2">
                <button type="submit" class="flex-1 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95">
                    Créer l'affiche
                </button>
                <button type="button" onclick="document.getElementById('modal-add').classList.add('hidden')" class="px-6 py-3 rounded-xl border border-[#E8EDF3] text-sm font-bold text-[#667085] hover:bg-[#F3F7FC] transition-all">
                    Annuler
                </button>
            </div>
        </form>
    </div>
</div>

<!-- ── MODAL EDIT ──────────────────────────────────────────────────────────── -->
<div id="modal-edit" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-[#E8EDF3] flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
            <h2 class="text-base font-black text-[#182230]">Modifier l'affiche</h2>
            <button type="button" onclick="document.getElementById('modal-edit').classList.add('hidden')" class="w-8 h-8 rounded-xl bg-[#F3F7FC] hover:bg-red-50 flex items-center justify-center transition-colors">
                <i data-lucide="x" class="w-4 h-4 text-[#667085]"></i>
            </button>
        </div>
        <form method="POST" enctype="multipart/form-data" class="p-6 space-y-4" id="form-edit">
            <input type="hidden" name="action" value="edit_banner">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
            <input type="hidden" name="banner_id" id="edit-id">
            <input type="hidden" name="existing_image_desktop" id="edit-existing-desk">
            <input type="hidden" name="existing_image_mobile"  id="edit-existing-mob">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Titre *</label>
                    <input type="text" name="title" id="edit-title" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Sous-titre</label>
                    <input type="text" name="subtitle" id="edit-subtitle" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Lien URL</label>
                    <input type="text" name="link_url" id="edit-link" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Texte bouton</label>
                    <input type="text" name="button_text" id="edit-btn" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Emplacement</label>
                    <select name="placement" id="edit-placement" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                        <?php foreach ($placements as $val => $lab): ?>
                        <option value="<?= htmlspecialchars($val) ?>"><?= htmlspecialchars($lab) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Ordre d'affichage</label>
                    <input type="number" name="display_order" id="edit-order" min="0" max="99" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium focus:outline-none focus:border-[#1677FF]">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Date début</label>
                    <input type="datetime-local" name="starts_at" id="edit-starts" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium">
                </div>
                <div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Date fin</label>
                    <input type="datetime-local" name="ends_at" id="edit-ends" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] text-sm font-medium">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Image Desktop actuelle</label>
                    <div id="edit-desk-preview" class="mb-2"></div>
                    <label class="block text-xs font-bold text-[#667085] mb-1">Remplacer l'image Desktop</label>
                    <input type="file" name="image_desktop_file" accept=".jpg,.jpeg,.png,.webp" class="w-full text-sm text-[#667085] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#EAF3FF] file:text-[#1677FF] file:font-bold">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#667085] mb-1">Remplacer Image Mobile (optionnel)</label>
                    <input type="file" name="image_mobile_file" accept=".jpg,.jpeg,.png,.webp" class="w-full text-sm text-[#667085] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#F3F7FC] file:text-[#667085] file:font-bold">
                </div>
                <div class="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" name="is_active" id="edit-active" class="w-4 h-4 accent-[#1677FF]">
                    <label for="edit-active" class="text-sm font-semibold text-[#182230]">Affiche active</label>
                </div>
            </div>

            <div class="flex gap-3 pt-2">
                <button type="submit" class="flex-1 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-sm py-3 rounded-xl transition-all">
                    Enregistrer les modifications
                </button>
                <button type="button" onclick="document.getElementById('modal-edit').classList.add('hidden')" class="px-6 py-3 rounded-xl border border-[#E8EDF3] text-sm font-bold text-[#667085] hover:bg-[#F3F7FC]">
                    Annuler
                </button>
            </div>
        </form>
    </div>
</div>

<script>
lucide.createIcons();

function openEditModal(b) {
    document.getElementById('edit-id').value       = b.id;
    document.getElementById('edit-title').value    = b.title;
    document.getElementById('edit-subtitle').value = b.subtitle;
    document.getElementById('edit-link').value     = b.link_url;
    document.getElementById('edit-btn').value      = b.button_text;
    document.getElementById('edit-order').value    = b.display_order;
    document.getElementById('edit-placement').value = b.placement;
    document.getElementById('edit-starts').value   = b.starts_at ? b.starts_at.replace(' ','T') : '';
    document.getElementById('edit-ends').value     = b.ends_at   ? b.ends_at.replace(' ','T')   : '';
    document.getElementById('edit-active').checked = b.is_active == 1;
    document.getElementById('edit-existing-desk').value = b.image_desktop;
    document.getElementById('edit-existing-mob').value  = b.image_mobile;
    var prev = document.getElementById('edit-desk-preview');
    prev.innerHTML = b.image_desktop
        ? '<img src="../' + b.image_desktop + '" class="h-16 rounded-lg border border-[#E8EDF3] object-cover" alt="Aperçu">'
        : '<p class="text-xs text-[#667085]">Aucune image</p>';
    document.getElementById('modal-edit').classList.remove('hidden');
}

// Close modals on backdrop click
['modal-add','modal-edit'].forEach(function(id) {
    document.getElementById(id).addEventListener('click', function(e) {
        if (e.target === this) this.classList.add('hidden');
    });
});
</script>

</body>
</html>
