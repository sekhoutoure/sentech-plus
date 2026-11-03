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

// Traitement POST (Création, Modification, Suppression, Bascule d'activation)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if (!$pdo) {
        $message = "Connexion MySQL inactive. Impossible de modifier les annonces.";
        $messageType = 'error';
    } elseif (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        if ($action === 'create_announcement' || $action === 'edit_announcement') {
            $aid = ($action === 'edit_announcement') ? sanitize($_POST['announcement_id'] ?? '') : ('ann_' . uniqid());
            $title = sanitize($_POST['title'] ?? '');
            $subtitle = sanitize($_POST['subtitle'] ?? '');
            $type = sanitize($_POST['type'] ?? 'text');
            $placement = sanitize($_POST['placement'] ?? 'header_top_center');
            $messageContent = sanitize($_POST['message'] ?? '');
            $buttonText = sanitize($_POST['button_text'] ?? '');
            $buttonUrl = sanitize($_POST['button_url'] ?? 'shop.php');
            $targetBlank = isset($_POST['target_blank']) ? 1 : 0;
            $badgeText = sanitize($_POST['badge_text'] ?? '');
            $discountText = sanitize($_POST['discount_text'] ?? '');
            $icon = sanitize($_POST['icon'] ?? 'sparkles');
            $bgColor = sanitize($_POST['background_color'] ?? '#FFFFFF');
            $textColor = sanitize($_POST['text_color'] ?? '#182230');
            $buttonColor = sanitize($_POST['button_color'] ?? '#1677FF');
            $displayOrder = (int)($_POST['display_order'] ?? 0);
            $isActive = isset($_POST['is_active']) ? 1 : 0;
            $startsAt = !empty($_POST['starts_at']) ? $_POST['starts_at'] : null;
            $endsAt = !empty($_POST['ends_at']) ? $_POST['ends_at'] : null;
            
            $imageDesktop = sanitize($_POST['image_desktop_url'] ?? '');
            $imageMobile = sanitize($_POST['image_mobile_url'] ?? '');

            // Upload sécurisé de l'image Desktop via SecureUploader
            if (!empty($_FILES['image_desktop_file']['name'])) {
                $upRes = SecureUploader::processImageUpload($_FILES['image_desktop_file'], 'banners', 1920, 1080);
                if ($upRes['success']) {
                    $imageDesktop = $upRes['path'];
                }
            }

            // Upload sécurisé de l'image Mobile via SecureUploader
            if (!empty($_FILES['image_mobile_file']['name'])) {
                $upResMob = SecureUploader::processImageUpload($_FILES['image_mobile_file'], 'banners', 800, 800);
                if ($upResMob['success']) {
                    $imageMobile = $upResMob['path'];
                }
            }


            if (!empty($title) && $pdo) {
                try {
                    if ($action === 'create_announcement') {
                        $stmtIns = $pdo->prepare("INSERT INTO announcements 
                            (id, title, subtitle, type, placement, message, button_text, button_url, target_blank, badge_text, discount_text, icon, image_desktop, image_mobile, background_color, text_color, button_color, starts_at, ends_at, display_order, is_active) 
                            VALUES (:id, :title, :sub, :type, :pl, :msg, :btn_t, :btn_u, :tbl, :badge, :disc, :icon, :img_d, :img_m, :bg, :tc, :bc, :starts, :ends, :dord, :act)");
                        $stmtIns->execute([
                            ':id' => $aid,
                            ':title' => $title,
                            ':sub' => $subtitle,
                            ':type' => $type,
                            ':pl' => $placement,
                            ':msg' => $messageContent,
                            ':btn_t' => $buttonText,
                            ':btn_u' => $buttonUrl,
                            ':tbl' => $targetBlank,
                            ':badge' => $badgeText,
                            ':disc' => $discountText,
                            ':icon' => $icon,
                            ':img_d' => $imageDesktop,
                            ':img_m' => $imageMobile,
                            ':bg' => $bgColor,
                            ':tc' => $textColor,
                            ':bc' => $buttonColor,
                            ':starts' => $startsAt,
                            ':ends' => $endsAt,
                            ':dord' => $displayOrder,
                            ':act' => $isActive
                        ]);
                        $message = "Annonce « $title » créée avec succès !";
                        $messageType = 'success';
                    } else {
                        $stmtUpd = $pdo->prepare("UPDATE announcements SET 
                            title = :title, subtitle = :sub, type = :type, placement = :pl, message = :msg, 
                            button_text = :btn_t, button_url = :btn_u, target_blank = :tbl, badge_text = :badge, 
                            discount_text = :disc, icon = :icon, image_desktop = :img_d, image_mobile = :img_m, 
                            background_color = :bg, text_color = :tc, button_color = :bc, starts_at = :starts, ends_at = :ends, 
                            display_order = :dord, is_active = :act 
                            WHERE id = :id");
                        $stmtUpd->execute([
                            ':id' => $aid,
                            ':title' => $title,
                            ':sub' => $subtitle,
                            ':type' => $type,
                            ':pl' => $placement,
                            ':msg' => $messageContent,
                            ':btn_t' => $buttonText,
                            ':btn_u' => $buttonUrl,
                            ':tbl' => $targetBlank,
                            ':badge' => $badgeText,
                            ':disc' => $discountText,
                            ':icon' => $icon,
                            ':img_d' => $imageDesktop,
                            ':img_m' => $imageMobile,
                            ':bg' => $bgColor,
                            ':tc' => $textColor,
                            ':bc' => $buttonColor,
                            ':starts' => $startsAt,
                            ':ends' => $endsAt,
                            ':dord' => $displayOrder,
                            ':act' => $isActive
                        ]);
                        $message = "Annonce « $title » mise à jour avec succès !";
                        $messageType = 'success';
                    }
                } catch (Throwable $e) {
                    $message = "Erreur base de données : " . htmlspecialchars($e->getMessage());
                    $messageType = 'error';
                }
            }
        } elseif ($action === 'toggle_active') {
            $aid = sanitize($_POST['announcement_id'] ?? '');
            if ($aid && $pdo) {
                try {
                    $stmtT = $pdo->prepare("UPDATE announcements SET is_active = IF(is_active = 1, 0, 1) WHERE id = :id");
                    $stmtT->execute([':id' => $aid]);
                    $message = "Statut d'activation modifié.";
                    $messageType = 'success';
                } catch (Throwable $e) {}
            }
        } elseif ($action === 'delete_announcement') {
            $aid = sanitize($_POST['announcement_id'] ?? '');
            if ($aid && $pdo) {
                try {
                    $stmtDel = $pdo->prepare("DELETE FROM announcements WHERE id = :id");
                    $stmtDel->execute([':id' => $aid]);
                    $message = "Annonce supprimée avec succès.";
                    $messageType = 'success';
                } catch (Throwable $e) {}
            }
        }
    }
}

// Fetch all announcements
$announcements = [];
if ($pdo) {
    try {
        $stmtAll = $pdo->query("SELECT * FROM announcements ORDER BY placement ASC, display_order ASC, created_at DESC");
        $announcements = $stmtAll ? $stmtAll->fetchAll() : [];
    } catch (Throwable $e) {
        $announcements = [];
    }
}
if (empty($announcements)) {
    $announcements = [
        ['id' => 'ann_top_left', 'title' => 'Livraison Express Dakar H+2', 'subtitle' => 'Courses et livraisons express', 'type' => 'delivery', 'placement' => 'header_top_left', 'badge_text' => 'EXPRESS SÉNÉGAL', 'discount_text' => null, 'icon' => 'truck', 'button_text' => 'Commander', 'button_url' => 'shop.php', 'display_order' => 1, 'is_active' => 1],
        ['id' => 'ann_top_center', 'title' => 'Vente Flash -35% High-Tech', 'subtitle' => 'Offres limitées', 'type' => 'flash_promo', 'placement' => 'header_top_center', 'badge_text' => 'FLASH', 'discount_text' => '-35%', 'icon' => 'flame', 'button_text' => 'Profiter', 'button_url' => 'shop.php?collection=flash', 'display_order' => 2, 'is_active' => 1],
        ['id' => 'ann_top_right', 'title' => 'Code Promo: NEW20 (-20%)', 'subtitle' => 'Sur votre panier', 'type' => 'coupon_code', 'placement' => 'header_top_right', 'badge_text' => 'REMISE 20%', 'discount_text' => 'NEW20', 'icon' => 'sparkles', 'button_text' => 'Utiliser', 'button_url' => 'shop.php?search=Promo', 'display_order' => 3, 'is_active' => 1],
        ['id' => 'ann_mobile', 'title' => 'Vente Flash -35% High-Tech', 'subtitle' => 'Offres exclusives Dakar', 'type' => 'flash_promo', 'placement' => 'mobile_header_banner', 'badge_text' => 'FLASH', 'discount_text' => '-35%', 'icon' => 'flame', 'button_text' => 'Profiter', 'button_url' => 'shop.php?collection=flash', 'display_order' => 1, 'is_active' => 1]
    ];
}

$placementLabels = [
    'header_top_left' => 'Header Top Gauche (Carte 1)',
    'header_top_center' => 'Header Top Centre (Carte 2 Flash)',
    'header_top_right' => 'Header Top Droite (Carte 3 Promo)',
    'mobile_header_banner' => 'Bandeau Header Mobile',
    'hero_banner' => 'Affiche Hero Page d\'Accueil',
    'shop_banner' => 'Bannière Catalogue Boutique',
    'product_page_banner' => 'Bannière Fiche Produit'
];

$pageTitle = "Gestion des Annonces & Affiches Promo — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen bg-[#F3F7FC] flex">

    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen">
        
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="megaphone" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Gestionnaire d'Annonces & Affiches Promotionnelles</span>
                </h1>
            </div>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <!-- Header Title & Action Button -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 class="text-2xl font-black text-[#182230]">Annonces du Header & Bannières Promo</h2>
                    <p class="text-xs text-[#667085] mt-1">Configurez les messages du header, les ventes flash, les codes promos et les affiches commerciales.</p>
                </div>
                <button type="button" onclick="openNewAnnouncementModal()" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all active:scale-95">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    <span>+ Créer une Annonce</span>
                </button>
            </div>

            <!-- Announcements List Table -->
            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-[#E8EDF3] flex items-center justify-between gap-3 bg-[#F8FBFF]">
                    <span class="text-xs font-black text-[#182230] uppercase tracking-wider">Toutes les Annonces (<?= count($announcements) ?>)</span>
                    <span class="text-[11px] font-bold text-[#0D7D53] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ⚡ Affichage en temps réel dans le Header
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-3.5 pl-5">Aperçu & Titre</th>
                                <th class="p-3.5">Emplacement</th>
                                <th class="p-3.5">Type & Badge</th>
                                <th class="p-3.5">Lien d'Action</th>
                                <th class="p-3.5">Ordre</th>
                                <th class="p-3.5">Statut</th>
                                <th class="p-3.5 pr-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php foreach ($announcements as $ann): ?>
                                <tr class="hover:bg-[#F8FBFF] transition-colors">
                                    <td class="p-3.5 pl-5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                                                <i data-lucide="<?= htmlspecialchars($ann['icon'] ?? 'sparkles') ?>" class="w-5 h-5 text-[#1677FF]"></i>
                                            </div>
                                            <div class="min-w-0">
                                                <span class="font-bold text-[#182230] block truncate max-w-xs"><?= htmlspecialchars($ann['title']) ?></span>
                                                <?php if (!empty($ann['subtitle'])): ?>
                                                    <span class="text-[10px] text-[#667085] block truncate max-w-xs"><?= htmlspecialchars($ann['subtitle']) ?></span>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-extrabold text-[#0B54C2] bg-[#EAF3FF] px-2 py-0.5 rounded-lg text-[10px]">
                                            <?= htmlspecialchars($placementLabels[$ann['placement']] ?? $ann['placement']) ?>
                                        </span>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-bold text-[#182230] block uppercase text-[10px]"><?= htmlspecialchars($ann['type']) ?></span>
                                        <?php if (!empty($ann['badge_text'])): ?>
                                            <span class="text-[9px] font-black bg-[#F3F7FC] text-[#667085] px-1.5 py-0.2 rounded border border-[#E8EDF3] inline-block mt-0.5">
                                                <?= htmlspecialchars($ann['badge_text']) ?>
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-mono text-[11px] text-[#1677FF] block truncate max-w-[140px]"><?= htmlspecialchars($ann['button_url'] ?? '-') ?></span>
                                        <span class="text-[10px] text-[#667085]"><?= htmlspecialchars($ann['button_text'] ?? 'Bouton') ?></span>
                                    </td>
                                    <td class="p-3.5 font-bold text-[#182230]">
                                        <?= (int)($ann['display_order'] ?? 0) ?>
                                    </td>
                                    <td class="p-3.5">
                                        <form method="POST" action="announcements.php" class="inline">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="toggle_active">
                                            <input type="hidden" name="announcement_id" value="<?= htmlspecialchars($ann['id']) ?>">
                                            <button type="submit" class="cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors <?= !empty($ann['is_active']) ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200' ?>">
                                                <?= !empty($ann['is_active']) ? '🟢 Actif' : '⚪ Inactif' ?>
                                            </button>
                                        </form>
                                    </td>
                                    <td class="p-3.5 pr-5 text-right">
                                        <div class="flex items-center justify-end gap-1.5">
                                            <button type="button" onclick='openEditAnnouncementModal(<?= json_encode($ann) ?>)' class="cursor-pointer p-1.5 hover:bg-[#EAF3FF] text-[#0B54C2] rounded-lg transition-colors" title="Modifier">
                                                <i data-lucide="edit-2" class="w-4 h-4"></i>
                                            </button>
                                            <form method="POST" action="announcements.php" onsubmit="return confirm('Supprimer cette annonce ?');" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="delete_announcement">
                                                <input type="hidden" name="announcement_id" value="<?= htmlspecialchars($ann['id']) ?>">
                                                <button type="submit" class="cursor-pointer p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Supprimer">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
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

    </main>

</div>

<!-- Modal Créer / Modifier Annonce -->
<div id="announcement-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
            <div>
                <h3 id="amodal-title" class="text-base font-black text-[#182230]">Créer une Annonce Promotionnelle</h3>
                <p class="text-[11px] text-[#667085]">Diffusion dynamique dans le Header et les Pages clés</p>
            </div>
            <button type="button" onclick="closeAnnouncementModal()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" action="announcements.php" enctype="multipart/form-data" class="space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" id="aform-action" value="create_announcement">
            <input type="hidden" name="announcement_id" id="aform-id" value="">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Emplacement d'Affichage *</label>
                    <select name="placement" id="aform-placement" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold bg-white">
                        <option value="header_top_left">Header Top Gauche (Carte 1)</option>
                        <option value="header_top_center">Header Top Centre (Carte 2 Flash)</option>
                        <option value="header_top_right">Header Top Droite (Carte 3 Promo)</option>
                        <option value="mobile_header_banner">Bandeau Mobile Header</option>
                        <option value="hero_banner">Affiche Hero Accueil</option>
                        <option value="shop_banner">Bannière Catalogue Boutique</option>
                        <option value="product_page_banner">Bannière Fiche Produit</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Type d'Annonce *</label>
                    <select name="type" id="aform-type" required class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold bg-white">
                        <option value="delivery">🚚 Annonce Livraison Express</option>
                        <option value="flash_promo">⚡ Vente Flash / Promo</option>
                        <option value="coupon_code">🏷️ Code Promo / Remise</option>
                        <option value="whatsapp">💬 Contact WhatsApp</option>
                        <option value="image_banner">🖼️ Affiche Image / Bannière</option>
                        <option value="text">📝 Annonce Texte Standard</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Titre de l'Annonce *</label>
                <input type="text" name="title" id="aform-title" required placeholder="Ex: Vente Flash -35% High-Tech" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Sous-titre / Message court</label>
                    <input type="text" name="subtitle" id="aform-sub" placeholder="Ex: Valable sur votre premier panier" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Texte du Badge</label>
                    <input type="text" name="badge_text" id="aform-badge" placeholder="Ex: FLASH, EXPRESS, REMISE 20%" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none font-black text-[#1677FF]">
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Texte du Bouton</label>
                    <input type="text" name="button_text" id="aform-btntxt" placeholder="Ex: Profiter, Commander" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Lien de Redirection (URL)</label>
                    <input type="text" name="button_url" id="aform-btnurl" placeholder="shop.php?collection=flash" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none font-mono">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Icône Lucide</label>
                    <select name="icon" id="aform-icon" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                        <option value="truck">🚚 Camion (truck)</option>
                        <option value="flame">🔥 Flamme Flash (flame)</option>
                        <option value="sparkles">✨ Étoiles Promo (sparkles)</option>
                        <option value="tag">🏷️ Tag Remise (tag)</option>
                        <option value="shield-check">🛡️ Bouclier Sécurité (shield-check)</option>
                        <option value="clock">⏰ Horloge (clock)</option>
                        <option value="phone-call">📞 Téléphone (phone-call)</option>
                    </select>
                </div>
            </div>

            <!-- Images pour Affiches et Bannières -->
            <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-3">
                <span class="font-extrabold text-[#182230] block text-[11px] uppercase tracking-wider">Affiche / Image Optionnelle</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block font-bold text-[#667085] mb-1 text-[10px]">Image Desktop (Fichier)</label>
                        <input type="file" name="image_desktop_file" accept="image/webp,image/png,image/jpeg" class="w-full text-xs">
                        <input type="text" name="image_desktop_url" id="aform-imgdesk" placeholder="Ou URL image Desktop" class="w-full p-2 mt-1 rounded-lg border border-[#E8EDF3] bg-white">
                    </div>
                    <div>
                        <label class="block font-bold text-[#667085] mb-1 text-[10px]">Image Mobile (Fichier)</label>
                        <input type="file" name="image_mobile_file" accept="image/webp,image/png,image/jpeg" class="w-full text-xs">
                        <input type="text" name="image_mobile_url" id="aform-imgmob" placeholder="Ou URL image Mobile" class="w-full p-2 mt-1 rounded-lg border border-[#E8EDF3] bg-white">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Date Début (Optionnel)</label>
                    <input type="datetime-local" name="starts_at" id="aform-starts" class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Date Fin / Expiration</label>
                    <input type="datetime-local" name="ends_at" id="aform-ends" class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Ordre d'Affichage</label>
                    <input type="number" name="display_order" id="aform-order" value="1" min="0" class="w-full p-2 rounded-xl border border-[#E8EDF3] outline-none bg-white">
                </div>
            </div>

            <div class="flex items-center gap-6 pt-1">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" name="is_active" id="aform-active" value="1" checked class="accent-[#1677FF]">
                    <span>Activer cette annonce immédiatement</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" name="target_blank" id="aform-tbl" value="1" class="accent-[#1677FF]">
                    <span>Ouvrir dans un nouvel onglet (_blank)</span>
                </label>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2.5">
                <button type="button" onclick="closeAnnouncementModal()" class="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8EDF3] text-[#667085] font-bold hover:bg-[#F3F7FC]">
                    Annuler
                </button>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all">
                    Enregistrer l'Annonce
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openNewAnnouncementModal() {
    document.getElementById('amodal-title').textContent = "Créer une Annonce Promotionnelle";
    document.getElementById('aform-action').value = "create_announcement";
    document.getElementById('aform-id').value = "";
    document.getElementById('aform-title').value = "";
    document.getElementById('aform-sub').value = "";
    document.getElementById('aform-type').value = "flash_promo";
    document.getElementById('aform-placement').value = "header_top_center";
    document.getElementById('aform-badge').value = "FLASH";
    document.getElementById('aform-btntxt').value = "Profiter";
    document.getElementById('aform-btnurl').value = "shop.php?collection=flash";
    document.getElementById('aform-icon').value = "flame";
    document.getElementById('aform-imgdesk').value = "";
    document.getElementById('aform-imgmob').value = "";
    document.getElementById('aform-starts').value = "";
    document.getElementById('aform-ends').value = "";
    document.getElementById('aform-order').value = "1";
    document.getElementById('aform-active').checked = true;
    document.getElementById('aform-tbl').checked = false;
    document.getElementById('announcement-modal').classList.remove('hidden');
}

function openEditAnnouncementModal(ann) {
    document.getElementById('amodal-title').textContent = "Modifier l'Annonce : " + ann.title;
    document.getElementById('aform-action').value = "edit_announcement";
    document.getElementById('aform-id').value = ann.id;
    document.getElementById('aform-title').value = ann.title;
    document.getElementById('aform-sub').value = ann.subtitle || "";
    document.getElementById('aform-type').value = ann.type || "text";
    document.getElementById('aform-placement').value = ann.placement || "header_top_center";
    document.getElementById('aform-badge').value = ann.badge_text || "";
    document.getElementById('aform-btntxt').value = ann.button_text || "";
    document.getElementById('aform-btnurl').value = ann.button_url || "";
    document.getElementById('aform-icon').value = ann.icon || "sparkles";
    document.getElementById('aform-imgdesk').value = ann.image_desktop || "";
    document.getElementById('aform-imgmob').value = ann.image_mobile || "";
    document.getElementById('aform-starts').value = ann.starts_at ? ann.starts_at.replace(' ', 'T') : "";
    document.getElementById('aform-ends').value = ann.ends_at ? ann.ends_at.replace(' ', 'T') : "";
    document.getElementById('aform-order').value = ann.display_order || 0;
    document.getElementById('aform-active').checked = Boolean(Number(ann.is_active));
    document.getElementById('aform-tbl').checked = Boolean(Number(ann.target_blank));
    document.getElementById('announcement-modal').classList.remove('hidden');
}

function closeAnnouncementModal() {
    document.getElementById('announcement-modal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
