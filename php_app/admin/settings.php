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

// Traitement POST : Sauvegarde des paramètres
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $settingsToSave = [
            'site_name' => sanitize($_POST['site_name'] ?? 'SenTechPLUS'),
            'site_tagline' => sanitize($_POST['site_tagline'] ?? ''),
            'site_logo' => sanitize($_POST['site_logo'] ?? 'assets/images/sentech_logo.webp'),
            'contact_email' => sanitize($_POST['contact_email'] ?? ''),
            'contact_phone' => sanitize($_POST['contact_phone'] ?? ''),
            'contact_whatsapp' => sanitize($_POST['contact_whatsapp'] ?? ''),
            'contact_address' => sanitize($_POST['contact_address'] ?? ''),
            'opening_hours' => sanitize($_POST['opening_hours'] ?? ''),
            'delivery_fee_dakar_std' => sanitize($_POST['delivery_fee_dakar_std'] ?? '2000'),
            'delivery_fee_dakar_exp' => sanitize($_POST['delivery_fee_dakar_exp'] ?? '3000'),
            'delivery_fee_regions' => sanitize($_POST['delivery_fee_regions'] ?? '5000'),
            'delivery_notice' => sanitize($_POST['delivery_notice'] ?? ''),
            'highlighted_promo_code' => sanitize($_POST['highlighted_promo_code'] ?? 'NEW20'),
            'footer_copyright' => sanitize($_POST['footer_copyright'] ?? '')
        ];

        foreach ($settingsToSave as $k => $v) {
            setSiteSetting($k, $v);
        }

        logAdminActivity('settings_update', 'Paramètres généraux du site mis à jour');
        $message = "Tous les paramètres du site ont été enregistrés avec succès !";
        $messageType = 'success';
    }
}

$pageTitle = "Paramètres Généraux du Site — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="settings" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Configuration & Paramètres du Site SenTechPLUS</span>
            </h1>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div>
                <h2 class="text-2xl font-black text-[#182230]">Paramètres Généraux de la Boutique</h2>
                <p class="text-xs text-[#667085] mt-1">Gérez le nom du site, les coordonnées WhatsApp, les frais d'expédition et les mentions légales.</p>
            </div>

            <form method="POST" action="settings.php" class="space-y-6 text-xs">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="save_settings">

                <!-- 1. Identité du Site -->
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EDF3] shadow-2xs space-y-4">
                    <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3] flex items-center gap-2">
                        <i data-lucide="store" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Identité Visuelle & Boutique</span>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Nom de la Boutique *</label>
                            <input type="text" name="site_name" value="<?= htmlspecialchars(getSiteSetting('site_name', 'SenTechPLUS')) ?>" required class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Slogan Principal</label>
                            <input type="text" name="site_tagline" value="<?= htmlspecialchars(getSiteSetting('site_tagline', 'Le Meilleur du High-Tech au Sénégal')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold text-[#1677FF]">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Chemin du Logo Officiel</label>
                            <input type="text" name="site_logo" value="<?= htmlspecialchars(getSiteSetting('site_logo', 'assets/images/sentech_logo.webp')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-mono">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Code Promo Mis en Avant</label>
                            <input type="text" name="highlighted_promo_code" value="<?= htmlspecialchars(getSiteSetting('highlighted_promo_code', 'NEW20')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-black text-[#0D7D53]">
                        </div>
                    </div>
                </div>

                <!-- 2. Coordonnées & Support Client -->
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EDF3] shadow-2xs space-y-4">
                    <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3] flex items-center gap-2">
                        <i data-lucide="phone-call" class="w-4 h-4 text-[#25D366]"></i>
                        <span>Contact, SAV & WhatsApp Sénégal</span>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Numéro WhatsApp Direct *</label>
                            <input type="text" name="contact_whatsapp" value="<?= htmlspecialchars(getSiteSetting('contact_whatsapp', '+221 78 131 64 97')) ?>" required class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Téléphone Principal</label>
                            <input type="text" name="contact_phone" value="<?= htmlspecialchars(getSiteSetting('contact_phone', '+221 78 131 64 97')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Email Support</label>
                            <input type="email" name="contact_email" value="<?= htmlspecialchars(getSiteSetting('contact_email', 'contact@sentechplus.com')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Adresse Showroom / Siège</label>
                            <input type="text" name="contact_address" value="<?= htmlspecialchars(getSiteSetting('contact_address', 'Sacré-Cœur 3 / VDN, Dakar, Sénégal')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Horaires d'Ouverture</label>
                            <input type="text" name="opening_hours" value="<?= htmlspecialchars(getSiteSetting('opening_hours', 'Lun - Sam : 08h30 - 20h00 | Dim : 10h00 - 18h00')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                        </div>
                    </div>
                </div>

                <!-- 3. Frais & Conditions de Livraison -->
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EDF3] shadow-2xs space-y-4">
                    <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3] flex items-center gap-2">
                        <i data-lucide="truck" class="w-4 h-4 text-[#0B54C2]"></i>
                        <span>Frais & Paramètres de Livraison</span>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Livraison Dakar Standard (FCFA)</label>
                            <input type="number" name="delivery_fee_dakar_std" value="<?= htmlspecialchars(getSiteSetting('delivery_fee_dakar_std', '2000')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Livraison Dakar Express H+2 (FCFA)</label>
                            <input type="number" name="delivery_fee_dakar_exp" value="<?= htmlspecialchars(getSiteSetting('delivery_fee_dakar_exp', '3000')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold text-[#0B54C2]">
                        </div>
                        <div>
                            <label class="block font-bold text-[#182230] mb-1">Livraison Régions Sénégal (FCFA)</label>
                            <input type="number" name="delivery_fee_regions" value="<?= htmlspecialchars(getSiteSetting('delivery_fee_regions', '5000')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Texte de Réassurance Livraison</label>
                        <input type="text" name="delivery_notice" value="<?= htmlspecialchars(getSiteSetting('delivery_notice', 'Livraison Express en 2h à Dakar • Paiement à la livraison disponible')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-medium">
                    </div>
                </div>

                <!-- 4. Footer & Mentions Légales -->
                <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EDF3] shadow-2xs space-y-4">
                    <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3] flex items-center gap-2">
                        <i data-lucide="shield-check" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Pied de Page (Footer)</span>
                    </h3>

                    <div>
                        <label class="block font-bold text-[#182230] mb-1">Texte de Copyright Footer</label>
                        <input type="text" name="footer_copyright" value="<?= htmlspecialchars(getSiteSetting('footer_copyright', '© 2026 SenTechPLUS. Tous droits réservés. Dakar, Sénégal.')) ?>" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                    </div>
                </div>

                <div class="flex justify-end">
                    <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-xs transition-all active:scale-95 flex items-center gap-2">
                        <i data-lucide="save" class="w-4 h-4"></i>
                        <span>Enregistrer Tous les Paramètres</span>
                    </button>
                </div>
            </form>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
