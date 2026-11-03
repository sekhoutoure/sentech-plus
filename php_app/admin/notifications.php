<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
ensureNotificationsTableExists($pdo);

$message = '';
$messageType = 'info';

// Traitement des formulaires POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide ou expiré.";
        $messageType = 'error';
    } else {
        $action = sanitize($_POST['action'] ?? '');

        if ($action === 'create_notification') {
            $targetType = sanitize($_POST['target_type'] ?? 'global');
            $targetUserId = ($targetType === 'user') ? sanitize($_POST['target_user_id'] ?? null) : null;
            $type = sanitize($_POST['type'] ?? 'info');
            $title = sanitize($_POST['title'] ?? '');
            $msg = sanitize($_POST['message'] ?? '');
            $linkUrl = sanitize($_POST['link_url'] ?? '');
            $icon = sanitize($_POST['icon'] ?? 'bell');
            $priority = sanitize($_POST['priority'] ?? 'normal');
            $expiresAt = !empty($_POST['expires_at']) ? sanitize($_POST['expires_at']) : null;

            if (empty($title) || empty($msg)) {
                $message = "Le titre et le message de la notification sont obligatoires.";
                $messageType = 'error';
            } else {
                $notifId = createNotification($targetUserId, $type, $title, $msg, $linkUrl, $icon, $priority, $expiresAt);
                logAdminActivity('CREATE_NOTIFICATION', "Création notification « $title » ($type)");
                $message = "Notification diffusée avec succès ! (ID: $notifId)";
                $messageType = 'success';
            }
        } elseif ($action === 'delete_notification') {
            $notifId = sanitize($_POST['notif_id'] ?? '');
            if ($notifId) {
                deleteNotification($notifId);
                logAdminActivity('DELETE_NOTIFICATION', "Suppression notification $notifId");
                $message = "Notification supprimée avec succès.";
                $messageType = 'success';
            }
        }
    }
}

// Récupération des utilisateurs pour le ciblage
$usersList = [];
if ($pdo) {
    try {
        $stmtUsers = $pdo->query("SELECT id, name, email FROM users ORDER BY name ASC LIMIT 100");
        if ($stmtUsers) $usersList = $stmtUsers->fetchAll();
    } catch (Throwable $e) {}
}

// Récupération de toutes les notifications pour le tableau
$allNotifs = [];
if ($pdo) {
    try {
        $stmtNotifs = $pdo->query("
            SELECT n.*, u.name as user_name, u.email as user_email 
            FROM notifications n 
            LEFT JOIN users u ON n.user_id = u.id 
            ORDER BY n.created_at DESC 
            LIMIT 100
        ");
        if ($stmtNotifs) $allNotifs = $stmtNotifs->fetchAll();
    } catch (Throwable $e) {}
}

if (empty($allNotifs)) {
    $allNotifs = getUserNotifications(null, 20);
}

$pageTitle = "Gestion des Notifications Push & CRM — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen bg-[#F3F7FC] flex">

    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="bell" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Diffusion de Notifications & Alertes CRM</span>
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
                    <h2 class="text-2xl font-black text-[#182230]">Centre de Diffusion Notifications</h2>
                    <p class="text-xs text-[#667085] mt-1">Envoyez des alertes broadcast à tous les visiteurs ou des notifications privées de suivi à un client précis.</p>
                </div>
                <button type="button" onclick="document.getElementById('notif-modal').classList.remove('hidden')" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all active:scale-95">
                    <i data-lucide="send" class="w-4 h-4"></i>
                    <span>+ Diffuser une Notification</span>
                </button>
            </div>

            <!-- Notifications Table -->
            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="p-4 border-b border-[#E8EDF3] flex items-center justify-between gap-3 bg-[#F8FBFF]">
                    <span class="text-xs font-black text-[#182230] uppercase tracking-wider">Historique des Notifications (<?= count($allNotifs) ?>)</span>
                    <span class="text-[11px] font-bold text-[#0D7D53] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ⚡ Synchronisé avec le Header Cloche
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-4">Type & Icône</th>
                                <th class="p-4">Destinataire</th>
                                <th class="p-4">Titre & Message</th>
                                <th class="p-4">Priorité</th>
                                <th class="p-4">Lien de Destination</th>
                                <th class="p-4">Date de Création</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (empty($allNotifs)): ?>
                                <tr>
                                    <td colspan="7" class="p-8 text-center text-slate-400">Aucune notification enregistrée.</td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($allNotifs as $n): ?>
                                    <tr class="hover:bg-[#F8FBFF] transition-colors">
                                        <td class="p-4">
                                            <div class="flex items-center gap-2.5">
                                                <div class="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                                                    <i data-lucide="<?= htmlspecialchars($n['icon'] ?? 'bell') ?>" class="w-4 h-4"></i>
                                                </div>
                                                <span class="font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                                    <?= htmlspecialchars($n['type']) ?>
                                                </span>
                                            </div>
                                        </td>
                                        <td class="p-4">
                                            <?php if (empty($n['user_id'])): ?>
                                                <span class="inline-flex items-center gap-1 text-[10px] font-black bg-blue-50 text-[#0B54C2] px-2 py-0.5 rounded-full border border-blue-200">
                                                    🌐 Public (Tous les visiteurs)
                                                </span>
                                            <?php else: ?>
                                                <span class="inline-flex items-center gap-1 text-[10px] font-black bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                                                    👤 <?= htmlspecialchars($n['user_name'] ?? $n['user_id']) ?>
                                                </span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="p-4 max-w-xs">
                                            <span class="font-black text-[#182230] block truncate"><?= htmlspecialchars($n['title']) ?></span>
                                            <p class="text-[11px] text-[#667085] line-clamp-1 mt-0.5"><?= htmlspecialchars($n['message']) ?></p>
                                        </td>
                                        <td class="p-4">
                                            <?php 
                                                $pColor = match($n['priority'] ?? 'normal') {
                                                    'high' => 'bg-rose-50 text-rose-700 border-rose-200',
                                                    'low' => 'bg-slate-50 text-slate-600 border-slate-200',
                                                    default => 'bg-emerald-50 text-[#0D7D53] border-emerald-200'
                                                };
                                            ?>
                                            <span class="text-[9px] font-black px-2 py-0.5 rounded-full border uppercase <?= $pColor ?>">
                                                <?= htmlspecialchars($n['priority'] ?? 'normal') ?>
                                            </span>
                                        </td>
                                        <td class="p-4">
                                            <?php if (!empty($n['link_url'])): ?>
                                                <a href="../<?= htmlspecialchars($n['link_url']) ?>" target="_blank" class="text-[#1677FF] hover:underline font-bold text-[11px] truncate block max-w-[140px]">
                                                    <?= htmlspecialchars($n['link_url']) ?>
                                                </a>
                                            <?php else: ?>
                                                <span class="text-slate-400 text-[11px]">Aucun</span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="p-4 whitespace-nowrap text-[#667085] text-[11px]">
                                            <?= date('d/m/Y H:i', strtotime($n['created_at'])) ?>
                                        </td>
                                        <td class="p-4 text-right">
                                            <form action="notifications.php" method="POST" class="inline" onsubmit="return confirm('Supprimer cette notification ?');">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="delete_notification">
                                                <input type="hidden" name="notif_id" value="<?= htmlspecialchars($n['id']) ?>">
                                                <button type="submit" class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Supprimer">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </form>
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

<!-- Modal Création de Notification -->
<div id="notif-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-[#E8EDF3] max-h-[90vh] overflow-y-auto animate-fade-in">
        
        <div class="flex items-center justify-between pb-3 border-b border-[#E8EDF3]">
            <div class="flex items-center gap-2">
                <i data-lucide="send" class="w-5 h-5 text-[#1677FF]"></i>
                <h3 class="text-sm font-black text-[#182230]">Diffuser une Nouvelle Notification</h3>
            </div>
            <button type="button" onclick="document.getElementById('notif-modal').classList.add('hidden')" class="p-1.5 rounded-full hover:bg-[#F3F7FC] text-[#667085]">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form action="notifications.php" method="POST" class="space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" value="create_notification">

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Cible de la Notification</label>
                    <select name="target_type" id="target-type-select" onchange="document.getElementById('user-target-box').style.display = this.value === 'user' ? 'block' : 'none'" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-bold outline-none focus:border-[#1677FF]">
                        <option value="global">🌐 Tous les utilisateurs (Public)</option>
                        <option value="user">👤 Utilisateur spécifique</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Type de Notification</label>
                    <select name="type" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-bold outline-none focus:border-[#1677FF]">
                        <option value="promo">🔥 Vente Flash & Promo</option>
                        <option value="coupon">🏷️ Code Promo & Remise</option>
                        <option value="order">📦 Commande & Expédition</option>
                        <option value="support">💬 Message Support</option>
                        <option value="info">ℹ️ Information Générale</option>
                    </select>
                </div>
            </div>

            <div id="user-target-box" style="display:none;">
                <label class="block font-bold text-[#182230] mb-1">Sélectionnez le client destinataire</label>
                <select name="target_user_id" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-bold outline-none focus:border-[#1677FF]">
                    <option value="">-- Choisir un utilisateur --</option>
                    <?php foreach ($usersList as $u): ?>
                        <option value="<?= htmlspecialchars($u['id']) ?>">
                            <?= htmlspecialchars($u['name'] ?? 'Utilisateur') ?> (<?= htmlspecialchars($u['email']) ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Titre de la Notification *</label>
                <input type="text" name="title" required placeholder="Ex: ⚡ Vente Flash Casques Audio -30%" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-bold outline-none focus:border-[#1677FF]">
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Message Détaillé *</label>
                <textarea name="message" rows="3" required placeholder="Ex: Profitez dès maintenant d'une remise immédiate sur tous les écouteurs sans fil jusqu'à minuit." class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-medium outline-none focus:border-[#1677FF]"></textarea>
            </div>

            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Icône Lucide</label>
                    <select name="icon" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-bold outline-none focus:border-[#1677FF]">
                        <option value="bell">🔔 Bell</option>
                        <option value="flame">🔥 Flame</option>
                        <option value="tag">🏷️ Tag</option>
                        <option value="truck">🚚 Truck</option>
                        <option value="sparkles">✨ Sparkles</option>
                        <option value="message-circle">💬 Support</option>
                        <option value="shield-check">🛡️ Sécurité</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Priorité</label>
                    <select name="priority" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-bold outline-none focus:border-[#1677FF]">
                        <option value="normal">Normal</option>
                        <option value="high">Haute (Flash/Urgent)</option>
                        <option value="low">Basse</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-[#182230] mb-1">Lien de Destination</label>
                    <input type="text" name="link_url" placeholder="shop.php?collection=flash" class="w-full bg-[#F7F9FC] border border-[#DCE5F0] rounded-xl px-3 py-2.5 font-medium outline-none focus:border-[#1677FF]">
                </div>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex items-center justify-end gap-3">
                <button type="button" onclick="document.getElementById('notif-modal').classList.add('hidden')" class="px-4 py-2.5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 cursor-pointer">
                    Annuler
                </button>
                <button type="submit" class="bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-5 py-2.5 rounded-xl shadow-2xs cursor-pointer">
                    Diffuser la Notification
                </button>
            </div>
        </form>

    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
