<?php
require_once __DIR__ . '/config/config.php';

$user = getCurrentUser();
$userId = $user['id'] ?? null;
$filter = sanitize($_GET['filter'] ?? 'all');
$unreadOnly = ($filter === 'unread');
$typeFilter = in_array($filter, ['order', 'promo', 'support', 'coupon']) ? $filter : null;

// Traitement des actions POST
$message = '';
$messageType = 'info';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF expiré.";
        $messageType = 'error';
    } else {
        $action = sanitize($_POST['action'] ?? '');
        if ($action === 'mark_all_read') {
            markAllNotificationsAsRead($userId);
            $message = "Toutes les notifications ont été marquées comme lues.";
            $messageType = 'success';
        } elseif ($action === 'mark_read') {
            $notifId = sanitize($_POST['notif_id'] ?? '');
            if ($notifId) {
                markNotificationAsRead($notifId, $userId);
                $message = "Notification marquée comme lue.";
                $messageType = 'success';
            }
        } elseif ($action === 'delete') {
            $notifId = sanitize($_POST['notif_id'] ?? '');
            if ($notifId) {
                deleteNotification($notifId, $userId);
                $message = "Notification supprimée.";
                $messageType = 'success';
            }
        }
    }
}

$notifications = getUserNotifications($userId, 50, $unreadOnly, $typeFilter);
$unreadCount = getUnreadNotificationsCount($userId);

$pageTitle = "Centre de Notifications (" . $unreadCount . ") — SenTechPLUS";
$layoutType = 'public_full';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="flex-1 max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 pb-20 md:pb-10 lg:pb-12">
    
    <!-- En-tête Page Notifications -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#0B54C2] text-xs font-bold border border-[#0B54C2]/15">
                <i data-lucide="bell" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                <span>CENTRE DE NOTIFICATIONS</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">Mes Notifications</h1>
            <p class="text-xs text-[#64748B]">Suivi de commandes, alertes promos flash et messages du support SenTechPLUS.</p>
        </div>

        <?php if ($unreadCount > 0): ?>
            <form action="notifications.php" method="POST" class="shrink-0">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="mark_all_read">
                <button type="submit" class="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-[#F3F7FC] text-[#1677FF] border border-[#1677FF]/30 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs active:scale-95">
                    <i data-lucide="check-check" class="w-4 h-4"></i>
                    <span>Tout marquer comme lu</span>
                </button>
            </form>
        <?php endif; ?>
    </div>

    <?php if ($message): ?>
        <div class="p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between <?= $messageType === 'success' ? 'bg-emerald-50 text-[#0D7D53] border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200' ?>">
            <div class="flex items-center gap-2">
                <i data-lucide="<?= $messageType === 'success' ? 'check-circle' : 'alert-circle' ?>" class="w-4 h-4"></i>
                <span><?= htmlspecialchars($message) ?></span>
            </div>
            <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
        </div>
    <?php endif; ?>

    <!-- Onglets Filtres -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        <a href="notifications.php?filter=all" class="px-4 py-2 rounded-xl transition-all whitespace-nowrap <?= ($filter === 'all') ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white text-[#64748B] hover:text-[#182230] border border-slate-200/60' ?>">
            Toutes
        </a>
        <a href="notifications.php?filter=unread" class="px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 <?= ($filter === 'unread') ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white text-[#64748B] hover:text-[#182230] border border-slate-200/60' ?>">
            <span>Non lues</span>
            <?php if ($unreadCount > 0): ?>
                <span class="px-1.5 py-0.2 rounded-full text-[9px] font-black <?= ($filter === 'unread') ? 'bg-white text-[#1677FF]' : 'bg-orange-100 text-[#C2410C]' ?>">
                    <?= $unreadCount ?>
                </span>
            <?php endif; ?>
        </a>
        <a href="notifications.php?filter=order" class="px-4 py-2 rounded-xl transition-all whitespace-nowrap <?= ($filter === 'order') ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white text-[#64748B] hover:text-[#182230] border border-slate-200/60' ?>">
            📦 Commandes
        </a>
        <a href="notifications.php?filter=promo" class="px-4 py-2 rounded-xl transition-all whitespace-nowrap <?= ($filter === 'promo') ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white text-[#64748B] hover:text-[#182230] border border-slate-200/60' ?>">
            🔥 Promotions Flash
        </a>
        <a href="notifications.php?filter=support" class="px-4 py-2 rounded-xl transition-all whitespace-nowrap <?= ($filter === 'support') ? 'bg-[#1677FF] text-white shadow-2xs' : 'bg-white text-[#64748B] hover:text-[#182230] border border-slate-200/60' ?>">
            💬 Support
        </a>
    </div>

    <!-- Liste des Notifications -->
    <div class="space-y-3">
        <?php if (empty($notifications)): ?>
            <div class="card-clean p-10 text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-[#F3F7FC] text-slate-400 flex items-center justify-center mx-auto">
                    <i data-lucide="bell-off" class="w-6 h-6"></i>
                </div>
                <h3 class="text-sm font-bold text-[#182230]">Aucune notification trouvée</h3>
                <p class="text-xs text-[#64748B]">Vous êtes parfaitement à jour !</p>
                <div class="pt-2">
                    <a href="shop.php" class="inline-flex items-center gap-2 bg-[#1677FF] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs">
                        <span>Explorer la boutique</span>
                        <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </a>
                </div>
            </div>
        <?php else: ?>
            <?php foreach ($notifications as $notif): 
                $isUnread = ($notif['is_read'] == 0);
            ?>
                <div class="card-clean p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 transition-all <?= $isUnread ? 'border-l-4 border-l-[#1677FF] bg-[#F8FBFF]' : '' ?>">
                    <div class="flex items-start gap-3.5 flex-1 min-w-0">
                        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 <?= $isUnread ? 'bg-[#1677FF] text-white shadow-xs' : 'bg-[#EAF3FF] text-[#1677FF]' ?>">
                            <i data-lucide="<?= htmlspecialchars($notif['icon'] ?? 'bell') ?>" class="w-5 h-5"></i>
                        </div>
                        <div class="space-y-1 flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-sm font-black text-[#182230] truncate"><?= htmlspecialchars($notif['title']) ?></h3>
                                <?php if ($isUnread): ?>
                                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-[#0B54C2] uppercase">Nouveau</span>
                                <?php endif; ?>
                            </div>
                            <p class="text-xs text-[#64748B] leading-relaxed"><?= htmlspecialchars($notif['message']) ?></p>
                            <span class="text-[10px] text-slate-400 font-semibold block pt-1">
                                <?= getRelativeTime($notif['created_at']) ?>
                            </span>
                        </div>
                    </div>

                    <!-- Actions à Droite -->
                    <div class="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                        <?php if (!empty($notif['link_url'])): ?>
                            <a href="<?= htmlspecialchars($notif['link_url']) ?>" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs shrink-0 flex items-center gap-1">
                                <span>Voir</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </a>
                        <?php endif; ?>

                        <?php if ($isUnread): ?>
                            <form action="notifications.php" method="POST" class="inline">
                                <?= getCSRFInputField() ?>
                                <input type="hidden" name="action" value="mark_read">
                                <input type="hidden" name="notif_id" value="<?= htmlspecialchars($notif['id']) ?>">
                                <button type="submit" class="cursor-pointer p-2 rounded-xl bg-white hover:bg-[#F3F7FC] text-[#64748B] hover:text-[#1677FF] border border-slate-200/60 transition-colors" title="Marquer comme lu" aria-label="Marquer comme lu">
                                    <i data-lucide="check" class="w-4 h-4"></i>
                                </button>
                            </form>
                        <?php endif; ?>

                        <form action="notifications.php" method="POST" class="inline">
                            <?= getCSRFInputField() ?>
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="notif_id" value="<?= htmlspecialchars($notif['id']) ?>">
                            <button type="submit" onclick="return confirm('Supprimer cette notification ?')" class="cursor-pointer p-2 rounded-xl bg-white hover:bg-rose-50 text-[#64748B] hover:text-rose-600 border border-slate-200/60 transition-colors" title="Supprimer" aria-label="Supprimer la notification">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
