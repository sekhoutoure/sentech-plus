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

// Traitement POST : Sauvegarde de la navigation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_menus') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $footerAbout = sanitize($_POST['footer_about'] ?? '');
        $footerPaymentPills = sanitize($_POST['footer_payment_pills'] ?? 'Wave, Orange Money, Paiement à la livraison');
        
        setSiteSetting('footer_about_text', $footerAbout);
        setSiteSetting('footer_payment_pills', $footerPaymentPills);
        
        logAdminActivity('menus_update', 'Mise à jour des liens et du footer');
        $message = "Configuration des menus et du footer enregistrée !";
        $messageType = 'success';
    }
}

$pageTitle = "Gestion des Menus & Footer — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="menu" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Gestionnaire des Menus, Liens Rapides & Footer</span>
            </h1>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div>
                <h2 class="text-2xl font-black text-[#182230]">Navigation Publique & Footer</h2>
                <p class="text-xs text-[#667085] mt-1">Configurez les liens du header, les rayons prioritaires et les mentions du footer.</p>
            </div>

            <form method="POST" action="menus.php" class="space-y-6 text-xs">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="save_menus">

                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EDF3] shadow-2xs space-y-4">
                    <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3]">
                        Description Footer & Réassurance
                    </h3>

                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Texte de Présentation Footer</label>
                        <textarea name="footer_about" rows="3" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none"><?= htmlspecialchars(getSiteSetting('footer_about_text', 'SenTechPLUS est la référence de la vente d\'accessoires et d\'équipements high-tech garantis 100% originaux au Sénégal avec livraison express.')) ?></textarea>
                    </div>

                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Moyens de Paiement Affichés (Pills)</label>
                        <input type="text" name="footer_payment_pills" value="<?= htmlspecialchars(getSiteSetting('footer_payment_pills', 'Wave, Orange Money, Paiement à la livraison, Free Money')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold text-[#0B54C2]">
                        <span class="text-[10px] text-[#667085] mt-1 block">Séparez par des virgules pour générer automatiquement les badges visuels.</span>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-xs transition-all active:scale-95 flex items-center gap-2">
                        <i data-lucide="save" class="w-4 h-4"></i>
                        <span>Enregistrer la Navigation</span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
