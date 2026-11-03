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

// Traitement POST : Mise à jour d'une page
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];
        $pid = sanitize($_POST['page_id'] ?? '');

        if ($action === 'save_page' && $pid && $pdo) {
            $title = sanitize($_POST['title'] ?? '');
            $headline = sanitize($_POST['headline'] ?? '');
            $metaTitle = sanitize($_POST['meta_title'] ?? '');
            $metaDesc = sanitize($_POST['meta_description'] ?? '');
            $content = sanitize($_POST['content'] ?? '');
            $isActive = isset($_POST['is_active']) ? 1 : 0;

            try {
                $stmt = $pdo->prepare("UPDATE pages SET title = :t, headline = :h, meta_title = :mt, meta_description = :md, content = :c, is_active = :act, updated_at = NOW() WHERE id = :id");
                $stmt->execute([
                    ':t' => $title,
                    ':h' => $headline,
                    ':mt' => $metaTitle,
                    ':md' => $metaDesc,
                    ':c' => $content,
                    ':act' => $isActive,
                    ':id' => $pid
                ]);
                $message = "Page « $title » mise à jour avec succès !";
                $messageType = 'success';
            } catch (Throwable $e) {
                $message = "Erreur base de données : " . htmlspecialchars($e->getMessage());
                $messageType = 'error';
            }
        }
    }
}

// Fetch all CMS pages
$pages = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM pages ORDER BY title ASC");
        $pages = $stmt ? $stmt->fetchAll() : [];
    } catch (Throwable $e) {
        $pages = [];
    }
}

if (empty($pages)) {
    $pages = [
        ['id' => 'page_home', 'slug' => 'home', 'title' => 'Accueil', 'headline' => 'Le Meilleur du High-Tech au Sénégal', 'meta_title' => 'SenTechPLUS | Boutique High-Tech & Accessoires Dakar', 'meta_description' => 'Découvrez notre catalogue d\'accessoires électroniques garantis.', 'is_active' => 1],
        ['id' => 'page_shop', 'slug' => 'shop', 'title' => 'Boutique', 'headline' => 'Tous nos Produits High-Tech Certifiés', 'meta_title' => 'Boutique High-Tech Dakar | SenTechPLUS', 'meta_description' => 'Achetez vos accessoires 100% originaux avec livraison express.', 'is_active' => 1],
        ['id' => 'page_about', 'slug' => 'about', 'title' => 'À Propos', 'headline' => 'L\'Excellence Technologique au Service du Sénégal', 'meta_title' => 'Qui Sommes-Nous ? | SenTechPLUS Sénégal', 'meta_description' => 'Leader de la distribution high-tech garantie à Dakar.', 'is_active' => 1],
        ['id' => 'page_contact', 'slug' => 'contact', 'title' => 'Contact & SAV', 'headline' => 'Notre Équipe est à Votre Écoute 7j/7', 'meta_title' => 'Contactez le Service Client | SenTechPLUS', 'meta_description' => 'Contactez notre support par WhatsApp ou téléphone.', 'is_active' => 1]
    ];
}

$pageTitle = "Gestion des Pages CMS & SEO — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="file-text" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Gestionnaire des Pages du Site & Référencement SEO</span>
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
                <h2 class="text-2xl font-black text-[#182230]">Pages Publiques & Contenu CMS (<?= count($pages) ?>)</h2>
                <p class="text-xs text-[#667085] mt-1">Personnalisez les titres, slogans, textes et balises meta SEO de chaque page.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <?php foreach ($pages as $p): ?>
                    <div class="bg-white rounded-3xl p-6 border border-[#E8EDF3] shadow-2xs space-y-4 flex flex-col justify-between">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-black text-sm text-[#182230]"><?= htmlspecialchars($p['title']) ?></span>
                                <span class="font-mono text-[10px] font-bold bg-[#EAF3FF] text-[#0B54C2] px-2.5 py-0.5 rounded-full">/<?= htmlspecialchars($p['slug']) ?>.php</span>
                            </div>
                            <h3 class="text-xs font-bold text-[#1677FF]"><?= htmlspecialchars($p['headline'] ?? '') ?></h3>
                            <p class="text-[11px] text-[#667085] line-clamp-2"><?= htmlspecialchars($p['meta_description'] ?? '') ?></p>
                        </div>

                        <div class="pt-3 border-t border-[#E8EDF3] flex items-center justify-between">
                            <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full <?= !empty($p['is_active']) ? 'bg-emerald-50 text-[#0D7D53]' : 'bg-slate-100 text-slate-600' ?>">
                                <?= !empty($p['is_active']) ? '🟢 Publiée' : '⚪ Masquée' ?>
                            </span>
                            <button type="button" onclick='openEditPageModal(<?= json_encode($p) ?>)' class="cursor-pointer inline-flex items-center gap-1.5 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs">
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

<!-- Modal Modifier Page -->
<div id="page-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
            <h3 id="pmodal-title" class="text-base font-black text-[#182230]">Modifier la Page</h3>
            <button type="button" onclick="closePageModal()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" action="pages.php" class="space-y-3.5 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" value="save_page">
            <input type="hidden" name="page_id" id="pform-id" value="">

            <div>
                <label class="block font-bold text-[#182230] mb-1">Titre de la Page *</label>
                <input type="text" name="title" id="pform-title" required class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Titre Principal (Headline Hero)</label>
                <input type="text" name="headline" id="pform-headline" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold text-[#1677FF]">
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Titre SEO (Balise Meta Title)</label>
                <input type="text" name="meta_title" id="pform-mtitle" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Description SEO (Balise Meta Description)</label>
                <textarea name="meta_description" id="pform-mdesc" rows="2" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Contenu / Texte de la Page</label>
                <textarea name="content" id="pform-content" rows="4" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
            </div>

            <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" name="is_active" id="pform-active" value="1" class="accent-[#1677FF]">
                    <span>Page active et accessible au public</span>
                </label>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2.5">
                <button type="button" onclick="closePageModal()" class="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8EDF3] text-[#667085] font-bold hover:bg-[#F3F7FC]">
                    Annuler
                </button>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all">
                    Enregistrer la Page
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openEditPageModal(page) {
    document.getElementById('pmodal-title').textContent = "Modifier la Page : " + page.title;
    document.getElementById('pform-id').value = page.id;
    document.getElementById('pform-title').value = page.title;
    document.getElementById('pform-headline').value = page.headline || "";
    document.getElementById('pform-mtitle').value = page.meta_title || "";
    document.getElementById('pform-mdesc').value = page.meta_description || "";
    document.getElementById('pform-content').value = page.content || "";
    document.getElementById('pform-active').checked = Boolean(Number(page.is_active));
    document.getElementById('page-modal').classList.remove('hidden');
}

function closePageModal() {
    document.getElementById('page-modal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
