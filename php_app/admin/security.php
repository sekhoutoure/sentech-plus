<?php
/**
 * =============================================================================
 * SenTechPLUS — Centre de Contrôle de Sécurité & Audit SIEM (Admin)
 * =============================================================================
 */
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Actions d'administration de la sécurité
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Session expirée ou jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];
        if ($action === 'clear_rate_limits') {
            $dir = dirname(__DIR__) . '/storage/security_cache';
            if (is_dir($dir)) {
                $files = glob($dir . '/*/*.json');
                foreach ($files as $f) { @unlink($f); }
            }
            if (function_exists('apcu_clear_cache')) {
                @apcu_clear_cache();
            }
            SecurityShield::logSecurityEvent('ADMIN_ACTION', "Réinitialisation des compteurs de Rate Limit par l'administrateur {$adminUser['email']}");
            $message = "Tous les compteurs de Rate Limit ont été réinitialisés avec succès.";
            $messageType = 'success';
        }
    }
}

// Récupération des événements d'audit récents
$recentEvents = SecurityShield::getRecentSecurityEvents(60);

$pageTitle = "Centre de Sécurité & SIEM — Cockpit SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
                    <span>Centre de Sécurité & Surveillance SIEM</span>
                </h1>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-xs font-bold text-[#667085] hidden sm:inline">Connecté : <strong><?= htmlspecialchars($adminUser['name'] ?? 'Admin') ?></strong></span>
                <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline cursor-pointer">Déconnexion</a>
            </div>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200' ?>">
                    <?= htmlspecialchars($message) ?>
                </div>
            <?php endif; ?>

            <!-- Hero Header -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-6 sm:p-8 rounded-3xl shadow-md">
                <div class="space-y-1">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Bouclier Actif — 100% Protection</span>
                    </div>
                    <h2 class="text-xl sm:text-2xl font-black">État de Santé & Surveillance de Sécurité</h2>
                    <p class="text-xs text-white/80">Supervision en direct des tentatives de brute-force, bots, sessions et intégrité des webhooks.</p>
                </div>
                <div class="flex items-center gap-3">
                    <form method="POST" onsubmit="return confirm('Réinitialiser tous les blocages temporaires de rate limiting ?');">
                        <?= getCSRFInputField() ?>
                        <input type="hidden" name="action" value="clear_rate_limits">
                        <button type="submit" class="cursor-pointer inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95">
                            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                            <span>Purger les Rate Limits</span>
                        </button>
                    </form>
                </div>
            </div>

            <!-- ─── 4 CARTES D'ÉTAT DES MODULES ─────────────────────────────── -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Rate Limiter -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Anti-Brute Force</span>
                        <div class="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                        </div>
                    </div>
                    <span class="text-lg font-black text-emerald-600 block">ACTIF (5 max / 15m)</span>
                    <p class="text-[11px] text-[#667085]">Dual-Key : IP + Compte Cible</p>
                </div>

                <!-- Session Fingerprint -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Anti-Session Hijack</span>
                        <div class="w-7 h-7 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold">
                            <i data-lucide="fingerprint" class="w-3.5 h-3.5"></i>
                        </div>
                    </div>
                    <span class="text-lg font-black text-[#1677FF] block">HMAC-SHA256</span>
                    <p class="text-[11px] text-[#667085]">Liaison User-Agent & IP Subnet</p>
                </div>

                <!-- CSP & En-têtes -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Isolation Navigateur</span>
                        <div class="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <i data-lucide="shield" class="w-3.5 h-3.5"></i>
                        </div>
                    </div>
                    <span class="text-lg font-black text-purple-600 block">CSP Stricte + COOP</span>
                    <p class="text-[11px] text-[#667085]">XSS & Clickjacking neutralisés</p>
                </div>

                <!-- Sandbox Uploads -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Upload Sandbox</span>
                        <div class="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <i data-lucide="file-check" class="w-3.5 h-3.5"></i>
                        </div>
                    </div>
                    <span class="text-lg font-black text-amber-600 block">WebP Detox (GD)</span>
                    <p class="text-[11px] text-[#667085]">Zéro EXIF / Anti-WebShell</p>
                </div>

            </div>

            <!-- ─── TABLEAU DU JOURNAL D'AUDIT DE SÉCURITÉ EN DIRECT ───────── -->
            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="p-5 border-b border-[#E8EDF3] flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-black text-[#182230] flex items-center gap-2">
                            <i data-lucide="activity" class="w-4 h-4 text-[#1677FF]"></i>
                            <span>Flux d'Événements de Sécurité (SIEM Audit Log)</span>
                        </h3>
                        <p class="text-[11px] text-[#667085]">Historique des événements cryptographiques, tentatives d'intrusion et validations.</p>
                    </div>
                    <span class="text-xs font-bold text-[#667085] bg-[#F3F7FC] px-3 py-1 rounded-full"><?= count($recentEvents) ?> événements récents</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-[#667085]">
                        <thead class="bg-[#F8FAFC] border-b border-[#E8EDF3] text-[10px] font-black uppercase text-[#667085]">
                            <tr>
                                <th class="p-3.5 pl-5">Horodatage</th>
                                <th class="p-3.5">Type d'Événement</th>
                                <th class="p-3.5">Adresse IP</th>
                                <th class="p-3.5">Détail du Message</th>
                                <th class="p-3.5 pr-5">Contexte</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (empty($recentEvents)): ?>
                                <tr>
                                    <td colspan="5" class="p-8 text-center text-xs text-[#98A2B3]">
                                        Aucun incident de sécurité enregistré. Tous les boucliers fonctionnent normalement.
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($recentEvents as $ev): 
                                    $badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
                                    if (str_contains($ev['type'], 'SUCCESS') || str_contains($ev['type'], 'CONFIRMED')) {
                                        $badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                    } elseif (str_contains($ev['type'], 'BLOCKED') || str_contains($ev['type'], 'HIJACK') || str_contains($ev['type'], 'BOT')) {
                                        $badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                                    } elseif (str_contains($ev['type'], 'FAILURE')) {
                                        $badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                                    }
                                ?>
                                    <tr class="hover:bg-[#F8FBFF] transition-colors font-mono text-[11px]">
                                        <td class="p-3.5 pl-5 text-[#182230] font-semibold whitespace-nowrap">
                                            <?= htmlspecialchars($ev['timestamp']) ?>
                                        </td>
                                        <td class="p-3.5">
                                            <span class="text-[10px] font-black px-2.5 py-1 rounded-full border <?= $badgeClass ?>">
                                                <?= htmlspecialchars($ev['type']) ?>
                                            </span>
                                        </td>
                                        <td class="p-3.5 font-bold text-[#1677FF]">
                                            <?= htmlspecialchars($ev['ip']) ?>
                                        </td>
                                        <td class="p-3.5 text-[#182230] font-sans text-xs">
                                            <?= htmlspecialchars($ev['message']) ?>
                                        </td>
                                        <td class="p-3.5 pr-5 text-[10px] text-[#98A2B3] max-w-xs truncate font-mono">
                                            <?= htmlspecialchars(json_encode($ev['context'], JSON_UNESCAPED_UNICODE)) ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>