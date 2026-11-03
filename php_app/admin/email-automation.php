<?php
/**
 * SenTechPLUS — Panneau d'Automatisation & Gestion des Emails (Admin)
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/email_service.php';
$pdo = getDBConnection();

$adminUser = requireAdmin();

$pageTitle = "Automatisation des Emails & SMTP — Admin SenTechPLUS";
$successMsg = '';
$errorMsg = '';

// 1. Sauvegarde de la configuration SMTP
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_smtp'])) {
    $host = trim($_POST['smtp_host'] ?? '');
    $port = (int)($_POST['smtp_port'] ?? 465);
    $enc  = trim($_POST['smtp_encryption'] ?? 'ssl');
    $user = trim($_POST['smtp_user'] ?? '');
    $pass = trim($_POST['smtp_pass'] ?? '');
    $name = trim($_POST['from_name'] ?? 'SenTechPLUS Dakar');
    $email = trim($_POST['from_email'] ?? 'contact@sentechplus.com');

    if ($pdo) {
        try {
            // Si le mot de passe est vide, conserver l'ancien
            if (empty($pass)) {
                $stmt = $pdo->prepare("
                    UPDATE smtp_settings 
                    SET smtp_host = :h, smtp_port = :p, smtp_encryption = :e, smtp_user = :u, from_name = :n, from_email = :fe, updated_at = NOW() 
                    WHERE id = 1
                ");
                $stmt->execute([':h' => $host, ':p' => $port, ':e' => $enc, ':u' => $user, ':n' => $name, ':fe' => $email]);
            } else {
                $stmt = $pdo->prepare("
                    UPDATE smtp_settings 
                    SET smtp_host = :h, smtp_port = :p, smtp_encryption = :e, smtp_user = :u, smtp_pass = :pass, from_name = :n, from_email = :fe, updated_at = NOW() 
                    WHERE id = 1
                ");
                $stmt->execute([':h' => $host, ':p' => $port, ':e' => $enc, ':u' => $user, ':pass' => $pass, ':n' => $name, ':fe' => $email]);
            }
            $successMsg = "Configuration SMTP enregistrée avec succès !";
        } catch (Throwable $e) {
            $errorMsg = "Erreur lors de l'enregistrement : " . $e->getMessage();
        }
    }
}

// 2. Récupération des statistiques
$smtpConfig = EmailService::getSmtpConfig();
$stats = ['sent' => 0, 'pending' => 0, 'failed' => 0, 'verified_users' => 0];
$recentQueue = [];

if ($pdo) {
    try {
        $stats['sent'] = (int)$pdo->query("SELECT COUNT(*) FROM email_queue WHERE status = 'sent'")->fetchColumn();
        $stats['pending'] = (int)$pdo->query("SELECT COUNT(*) FROM email_queue WHERE status = 'pending'")->fetchColumn();
        $stats['failed'] = (int)$pdo->query("SELECT COUNT(*) FROM email_queue WHERE status = 'failed'")->fetchColumn();
        $stats['verified_users'] = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE is_email_verified = 1")->fetchColumn();

        $qStmt = $pdo->query("SELECT * FROM email_queue ORDER BY id DESC LIMIT 15");
        $recentQueue = $qStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Throwable $e) {}
}

require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen bg-[#F3F7FC] flex">
    <!-- Sidebar Admin -->
    <?php if (file_exists(__DIR__ . '/../includes/admin_sidebar.php')) require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main id="main-content" class="flex-1 p-6 lg:p-10 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl lg:text-3xl font-black text-[#182230] font-heading">Automatisation des Emails & SMTP</h1>
                <p class="text-xs text-[#475467] mt-1">Gestion des passerelles d'envoi, vérification des comptes et file d'attente.</p>
            </div>
            <a href="index.php" class="inline-flex items-center gap-2 text-xs font-bold text-[#0B54C2] hover:underline">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>Retour au Dashboard</span>
            </a>
        </div>

        <?php if (!empty($successMsg)): ?>
            <div class="mb-6 p-4 rounded-2xl bg-emerald-50 text-[#065F46] border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <i data-lucide="check-circle" class="w-5 h-5 shrink-0"></i>
                <span><?= $successMsg ?></span>
            </div>
        <?php endif; ?>

        <?php if (!empty($errorMsg)): ?>
            <div class="mb-6 p-4 rounded-2xl bg-rose-50 text-[#B91C1C] border border-rose-200 text-xs font-bold flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-5 h-5 shrink-0"></i>
                <span><?= $errorMsg ?></span>
            </div>
        <?php endif; ?>

        <!-- Stat Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-[#64748B]">Emails Envoyés</span>
                    <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#065F46] flex items-center justify-center"><i data-lucide="send" class="w-4 h-4"></i></div>
                </div>
                <div class="text-2xl font-black text-[#182230]"><?= number_format($stats['sent']) ?></div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-[#64748B]">En File d'Attente</span>
                    <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#0B54C2] flex items-center justify-center"><i data-lucide="clock" class="w-4 h-4"></i></div>
                </div>
                <div class="text-2xl font-black text-[#182230]"><?= number_format($stats['pending']) ?></div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-[#64748B]">Comptes Vérifiés</span>
                    <div class="w-8 h-8 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center"><i data-lucide="shield-check" class="w-4 h-4"></i></div>
                </div>
                <div class="text-2xl font-black text-[#182230]"><?= number_format($stats['verified_users']) ?></div>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-[#64748B]">Échecs d'Envoi</span>
                    <div class="w-8 h-8 rounded-xl bg-rose-50 text-[#B91C1C] flex items-center justify-center"><i data-lucide="alert-triangle" class="w-4 h-4"></i></div>
                </div>
                <div class="text-2xl font-black text-[#182230]"><?= number_format($stats['failed']) ?></div>
            </div>
        </div>

        <!-- 2 Colonnes : Formulaire SMTP & Outil de Test -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Formulaire Configuration SMTP (2/3) -->
            <div class="lg:col-span-2 bg-white rounded-3xl p-6 lg:p-8 border border-[#E2E8F0] shadow-sm">
                <div class="flex items-center gap-3 mb-6 pb-4 border-b border-[#F1F5F9]">
                    <div class="w-10 h-10 rounded-2xl bg-[#EEF4FB] text-[#0B54C2] flex items-center justify-center"><i data-lucide="server" class="w-5 h-5"></i></div>
                    <div>
                        <h2 class="text-base font-black text-[#182230]">Configuration du Serveur SMTP Hostinger</h2>
                        <p class="text-xs text-[#64748B]">Paramètres officiels d'envoi pour <code class="text-[#0B54C2]">contact@sentechplus.com</code></p>
                    </div>
                </div>

                <form method="POST" action="email-automation.php" class="space-y-4">
                    <?php
                    $csrfEmailAuto = $_SESSION['csrf_token'] ?? '';
                    ?>
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfEmailAuto) ?>">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="sm:col-span-2">
                            <label class="block text-xs font-bold text-[#182230] mb-1">Hôte SMTP (Host)</label>
                            <input type="text" name="smtp_host" required value="<?= htmlspecialchars($smtpConfig['host']) ?>" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Port</label>
                            <input type="number" name="smtp_port" required value="<?= (int)$smtpConfig['port'] ?>" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Chiffrement (Encryption)</label>
                            <select name="smtp_encryption" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                                <option value="ssl" <?= $smtpConfig['encryption'] === 'ssl' ? 'selected' : '' ?>>SSL (Port 465 - Recommandé Hostinger)</option>
                                <option value="tls" <?= $smtpConfig['encryption'] === 'tls' ? 'selected' : '' ?>>TLS (Port 587)</option>
                                <option value="none" <?= $smtpConfig['encryption'] === 'none' ? 'selected' : '' ?>>Aucun (Non sécurisé)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Utilisateur SMTP (Email)</label>
                            <input type="email" name="smtp_user" required value="<?= htmlspecialchars($smtpConfig['user']) ?>" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Mot de passe SMTP</label>
                            <input type="password" name="smtp_pass" placeholder="Laisser vide pour ne pas modifier" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-[#182230] mb-1">Nom de l'Expéditeur</label>
                            <input type="text" name="from_name" required value="<?= htmlspecialchars($smtpConfig['from_name']) ?>" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-[#182230] mb-1">Email Expéditeur Réel (From Email)</label>
                        <input type="email" name="from_email" required value="<?= htmlspecialchars($smtpConfig['from_email']) ?>" class="w-full px-4 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none font-semibold text-[#182230]">
                    </div>

                    <div class="pt-2">
                        <button type="submit" name="save_smtp" class="inline-flex items-center gap-2 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer">
                            <i data-lucide="save" class="w-4 h-4"></i>
                            <span>Enregistrer la Configuration</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Test SMTP & Déclencheurs (1/3) -->
            <div class="space-y-6">
                <div class="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
                    <div class="flex items-center gap-2 mb-4 pb-3 border-b border-[#F1F5F9]">
                        <i data-lucide="send" class="w-4 h-4 text-[#065F46]"></i>
                        <h3 class="text-sm font-black text-[#182230]">Testeur d'Envoi SMTP Direct</h3>
                    </div>
                    <p class="text-xs text-[#64748B] mb-4">Envoyez un email d'essai pour valider vos identifiants.</p>
                    
                    <div class="space-y-3">
                        <input type="email" id="test-email-input" value="<?= htmlspecialchars($currentUser['email'] ?? 'contact@sentechplus.com') ?>" placeholder="destinataire@exemple.com" class="w-full px-3.5 py-2.5 text-xs bg-[#F8FAFD] border border-[#CBD5E1] rounded-xl outline-none text-[#182230] font-semibold">
                        <button type="button" onclick="triggerSmtpTest()" id="btn-test-smtp" class="w-full inline-flex items-center justify-center gap-2 bg-[#065F46] hover:bg-[#0A6644] text-white font-black text-xs py-2.5 rounded-xl shadow transition-all cursor-pointer">
                            <i data-lucide="play" class="w-4 h-4"></i>
                            <span>Lancer le Test SMTP</span>
                        </button>
                        <div id="test-result-box" class="hidden p-3 rounded-xl text-xs font-bold"></div>
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
                    <div class="flex items-center gap-2 mb-3">
                        <i data-lucide="zap" class="w-4 h-4 text-[#1677FF]"></i>
                        <h3 class="text-sm font-black text-[#182230]">Automatisation Active</h3>
                    </div>
                    <ul class="text-xs text-[#475467] space-y-2">
                        <li class="flex items-center gap-1.5"><span class="text-[#065F46]">✓</span> Inscription $\rightarrow$ Email OTP & Token 24h</li>
                        <li class="flex items-center gap-1.5"><span class="text-[#065F46]">✓</span> Achat $\rightarrow$ Facture & Récapitulatif FCFA</li>
                        <li class="flex items-center gap-1.5"><span class="text-[#065F46]">✓</span> Statut $\rightarrow$ Alerte Expédition & Livraison</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Journal Récent de la File d'Attente -->
        <div class="bg-white rounded-3xl p-6 lg:p-8 border border-[#E2E8F0] shadow-sm">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#F1F5F9]">
                <div class="flex items-center gap-2">
                    <i data-lucide="list-checks" class="w-5 h-5 text-[#0B54C2]"></i>
                    <h2 class="text-base font-black text-[#182230]">Journal Récent des Envois Automatisés</h2>
                </div>
                <span class="text-xs text-[#64748B] font-bold">15 dernières opérations</span>
            </div>

            <?php if (empty($recentQueue)): ?>
                <div class="text-center py-10 text-xs text-[#64748B]">
                    <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-[#94A3B8]"></i>
                    Aucun email dans le journal pour le moment.
                </div>
            <?php else: ?>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-[#F1F5F9] text-[#64748B] font-bold">
                                <th class="pb-3">ID</th>
                                <th class="pb-3">Destinataire</th>
                                <th class="pb-3">Objet</th>
                                <th class="pb-3">Type</th>
                                <th class="pb-3">Statut</th>
                                <th class="pb-3">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#F8FAFD]">
                            <?php foreach ($recentQueue as $row): ?>
                                <tr class="hover:bg-[#F8FAFD]">
                                    <td class="py-3 font-mono font-bold text-[#64748B]">#<?= $row['id'] ?></td>
                                    <td class="py-3 font-semibold text-[#182230]"><?= htmlspecialchars($row['recipient_email']) ?></td>
                                    <td class="py-3 text-[#475467]"><?= htmlspecialchars($row['subject']) ?></td>
                                    <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-[#EEF4FB] text-[#0B54C2] font-bold text-[10px]"><?= htmlspecialchars($row['template_type']) ?></span></td>
                                    <td class="py-3">
                                        <?php if ($row['status'] === 'sent'): ?>
                                            <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-[#065F46] font-bold text-[10px]">Envoyé ✓</span>
                                        <?php elseif ($row['status'] === 'pending'): ?>
                                            <span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">En attente</span>
                                        <?php else: ?>
                                            <span class="px-2 py-0.5 rounded-full bg-rose-50 text-[#B91C1C] font-bold text-[10px]">Échec</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="py-3 text-[#94A3B8]"><?= $row['created_at'] ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </main>
</div>

<script>
async function triggerSmtpTest() {
    const btn = document.getElementById('btn-test-smtp');
    const input = document.getElementById('test-email-input');
    const resBox = document.getElementById('test-result-box');

    if (!input.value.includes('@')) {
        alert('Veuillez spécifier une adresse email valide.');
        return;
    }

    btn.disabled = true;
    btn.classList.add('opacity-50', 'pointer-events-none');
    resBox.className = 'mt-3 p-3 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 block';
    resBox.textContent = 'Connexion au serveur SMTP Hostinger en cours...';

    try {
        const formData = new FormData();
        formData.append('action', 'test_smtp');
        formData.append('target_email', input.value);

        const resp = await fetch('../api-email-actions.php', {
            method: 'POST',
            body: formData
        });
        const data = await resp.json();

        if (data.success) {
            resBox.className = 'mt-3 p-3 rounded-xl text-xs font-bold bg-emerald-50 text-[#065F46] border border-emerald-200 block';
            resBox.textContent = '✅ ' + data.message;
        } else {
            resBox.className = 'mt-3 p-3 rounded-xl text-xs font-bold bg-rose-50 text-[#B91C1C] border border-rose-200 block';
            resBox.textContent = '❌ ' + data.message;
        }
    } catch (e) {
        resBox.className = 'mt-3 p-3 rounded-xl text-xs font-bold bg-rose-50 text-[#B91C1C] border border-rose-200 block';
        resBox.textContent = '❌ Erreur réseau lors de la communication.';
    } finally {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none');
    }
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>