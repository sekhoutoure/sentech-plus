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

// Traitement POST : Mise à jour d'une section
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];
        $secId = sanitize($_POST['section_id'] ?? '');

        if ($action === 'save_section' && $secId && $pdo) {
            $title = sanitize($_POST['title'] ?? '');
            $subtitle = sanitize($_POST['subtitle'] ?? '');
            $content = sanitize($_POST['content'] ?? '');
            $btnText = sanitize($_POST['button_text'] ?? '');
            $btnUrl = sanitize($_POST['button_url'] ?? '');
            $displayOrder = (int)($_POST['display_order'] ?? 0);
            $isActive = isset($_POST['is_active']) ? 1 : 0;

            try {
                $stmt = $pdo->prepare("UPDATE page_sections SET title = :t, subtitle = :sub, content = :c, button_text = :bt, button_url = :bu, display_order = :ord, is_active = :act, updated_at = NOW() WHERE id = :id");
                $stmt->execute([
                    ':t' => $title,
                    ':sub' => $subtitle,
                    ':c' => $content,
                    ':bt' => $btnText,
                    ':bu' => $btnUrl,
                    ':ord' => $displayOrder,
                    ':act' => $isActive,
                    ':id' => $secId
                ]);
                $message = "Section « $title » mise à jour avec succès !";
                $messageType = 'success';
            } catch (Throwable $e) {
                $message = "Erreur : " . htmlspecialchars($e->getMessage());
                $messageType = 'error';
            }
        }
    }
}

// Fetch all sections
$sections = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM page_sections ORDER BY page_slug ASC, display_order ASC");
        $sections = $stmt ? $stmt->fetchAll() : [];
    } catch (Throwable $e) {
        $sections = [];
    }
}

if (empty($sections)) {
    $sections = [
        ['id' => 'sec_home_hero', 'page_slug' => 'home', 'section_key' => 'hero', 'title' => 'Le Meilleur du High-Tech au Sénégal', 'subtitle' => 'Casques sans fil, chargeurs GaN, montres connectées et caméras 100% garantis.', 'button_text' => 'Explorer la Boutique', 'button_url' => 'shop.php', 'display_order' => 1, 'is_active' => 1],
        ['id' => 'sec_home_popular_cat', 'page_slug' => 'home', 'section_key' => 'popular_categories', 'title' => 'Rayons Populaires', 'subtitle' => 'Explorez nos 7 univers d\'accessoires high-tech.', 'button_text' => 'Voir tout', 'button_url' => 'shop.php', 'display_order' => 2, 'is_active' => 1],
        ['id' => 'sec_home_flash', 'page_slug' => 'home', 'section_key' => 'flash_sale', 'title' => 'Ventes Flash du Jour', 'subtitle' => 'Remises exceptionnelles jusqu\'à -35% à durée limitée.', 'button_text' => 'Voir les offres', 'button_url' => 'shop.php?collection=flash', 'display_order' => 3, 'is_active' => 1],
        ['id' => 'sec_home_reassurance', 'page_slug' => 'home', 'section_key' => 'reassurance', 'title' => 'Nos Engagements Qualité', 'subtitle' => 'Livraison Express 2h, Produits 100% Originaux et SAV Dakar.', 'button_text' => null, 'button_url' => null, 'display_order' => 4, 'is_active' => 1]
    ];
}

$pageTitle = "Sections de Page Dynamiques — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="layout-template" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Gestionnaire des Blocs & Sections de Page</span>
            </h1>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div>
                <h2 class="text-2xl font-black text-[#182230]">Sections Modifiables sans Coder (<?= count($sections) ?>)</h2>
                <p class="text-xs text-[#667085] mt-1">Ajustez les titres, sous-titres, textes et boutons d'action des blocs visibles sur le site.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <?php foreach ($sections as $sec): ?>
                    <div class="bg-white rounded-3xl p-6 border border-[#E8EDF3] shadow-2xs space-y-4 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-extrabold text-[10px] bg-[#EAF3FF] text-[#0B54C2] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Page : <?= htmlspecialchars($sec['page_slug']) ?> • Clé : <?= htmlspecialchars($sec['section_key']) ?>
                                </span>
                                <span class="font-mono text-xs font-bold text-[#667085]">Ordre : <?= (int)$sec['display_order'] ?></span>
                            </div>
                            <h3 class="font-black text-sm text-[#182230]"><?= htmlspecialchars($sec['title']) ?></h3>
                            <?php if (!empty($sec['subtitle'])): ?>
                                <p class="text-xs text-[#667085]"><?= htmlspecialchars($sec['subtitle']) ?></p>
                            <?php endif; ?>
                            <?php if (!empty($sec['button_text'])): ?>
                                <div class="pt-1 flex items-center gap-2">
                                    <span class="text-[10px] font-bold bg-slate-100 text-[#475467] px-2 py-0.5 rounded-md">Bouton : <?= htmlspecialchars($sec['button_text']) ?></span>
                                    <span class="text-[10px] font-mono text-[#1677FF]"><?= htmlspecialchars($sec['button_url'] ?? '-') ?></span>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="pt-3 border-t border-[#E8EDF3] flex items-center justify-between">
                            <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full border <?= !empty($sec['is_active']) ? 'bg-emerald-50 text-[#0D7D53] border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200' ?>">
                                <?= !empty($sec['is_active']) ? '🟢 Active' : '⚪ Désactivée' ?>
                            </span>
                            <button type="button" onclick='openEditSectionModal(<?= json_encode($sec) ?>)' class="cursor-pointer inline-flex items-center gap-1.5 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs">
                                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                <span>Modifier</span>
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>
</div>

<!-- Modal Modifier Section -->
<div id="section-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
            <h3 id="smodal-title" class="text-base font-black text-[#182230]">Modifier la Section</h3>
            <button type="button" onclick="closeSectionModal()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" action="sections.php" class="space-y-3.5 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" value="save_section">
            <input type="hidden" name="section_id" id="sform-id" value="">

            <div>
                <label class="block font-bold text-[#182230] mb-1">Titre de la Section *</label>
                <input type="text" name="title" id="sform-title" required class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Sous-titre / Description</label>
                <textarea name="subtitle" id="sform-sub" rows="2" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Texte du Bouton</label>
                    <input type="text" name="button_text" id="sform-btntxt" placeholder="Ex: Explorer" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Lien du Bouton (URL)</label>
                    <input type="text" name="button_url" id="sform-btnurl" placeholder="shop.php" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-mono">
                </div>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Ordre d'Affichage</label>
                <input type="number" name="display_order" id="sform-order" value="1" min="0" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
            </div>

            <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" name="is_active" id="sform-active" value="1" class="accent-[#1677FF]">
                    <span>Section active et visible sur le site</span>
                </label>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2.5">
                <button type="button" onclick="closeSectionModal()" class="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8EDF3] text-[#667085] font-bold hover:bg-[#F3F7FC]">
                    Annuler
                </button>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all">
                    Enregistrer la Section
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openEditSectionModal(sec) {
    document.getElementById('smodal-title').textContent = "Modifier la Section : " + sec.title;
    document.getElementById('sform-id').value = sec.id;
    document.getElementById('sform-title').value = sec.title;
    document.getElementById('sform-sub').value = sec.subtitle || "";
    document.getElementById('sform-btntxt').value = sec.button_text || "";
    document.getElementById('sform-btnurl').value = sec.button_url || "";
    document.getElementById('sform-order').value = sec.display_order || 0;
    document.getElementById('sform-active').checked = Boolean(Number(sec.is_active));
    document.getElementById('section-modal').classList.remove('hidden');
}

function closeSectionModal() {
    document.getElementById('section-modal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
