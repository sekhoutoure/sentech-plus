<?php
// Sidebar Admin Unifiée SenTechPLUS — Standard Emil Kowalski Design Engineering
$currentAdminPage = basename($_SERVER['PHP_SELF'] ?? '');

// Récupération dynamique et discrète des compteurs d'alertes
$adminSidebarPdo = function_exists('getDBConnection') ? getDBConnection() : null;
$sidebarPendingOrders = 0;
$sidebarPendingReviews = 0;
if ($adminSidebarPdo) {
    try {
        $stmtPOrders = $adminSidebarPdo->query("SELECT COUNT(*) FROM orders WHERE order_status IN ('pending', 'processing') OR status = 'ORDER_PLACED'");
        $sidebarPendingOrders = (int)($stmtPOrders ? $stmtPOrders->fetchColumn() : 0);
        
        $stmtPReviews = $adminSidebarPdo->query("SELECT COUNT(*) FROM reviews WHERE is_approved = 0");
        $sidebarPendingReviews = (int)($stmtPReviews ? $stmtPReviews->fetchColumn() : 0);
    } catch (Throwable $e) {}
}

/**
 * Helper de génération de lien tactile pour la sidebar
 */
if (!function_exists('renderSidebarLink')):
function renderSidebarLink($href, $icon, $label, $isActive, $badge = null, $badgeColor = 'amber') {
    $activeClass = 'relative bg-white/[0.08] text-white font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#1677FF] before:rounded-r-full shadow-2xs';
    $inactiveClass = 'text-slate-300/80 hover:bg-white/[0.05] hover:text-white';
    $baseClass = 'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-[transform,background-color,color] duration-120 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] cursor-pointer group';
    $stateClass = $isActive ? $activeClass : $inactiveClass;
    
    $badgeHtml = '';
    if ($badge !== null && $badge > 0) {
        $badgeColors = [
            'amber' => 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
            'blue' => 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
            'emerald' => 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
        ];
        $bCls = $badgeColors[$badgeColor] ?? $badgeColors['amber'];
        $badgeHtml = '<span class="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ' . $bCls . ' tabular-nums">' . (int)$badge . '</span>';
    }

    $iconColor = $isActive ? 'text-[#1677FF]' : 'text-slate-400 group-hover:text-white';

    echo '<a href="' . htmlspecialchars($href) . '" class="' . $baseClass . ' ' . $stateClass . '">' . "\n";
    echo '    <i data-lucide="' . htmlspecialchars($icon) . '" class="w-4 h-4 shrink-0 transition-transform duration-120 group-hover:scale-105 ' . $iconColor . '"></i>' . "\n";
    echo '    <span class="truncate">' . htmlspecialchars($label) . '</span>' . "\n";
    echo '    ' . $badgeHtml . "\n";
    echo '</a>' . "\n";
}
endif;
?>
<!-- Mobile Drawer Backdrop Automatique -->
<div id="admin-drawer-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 hidden lg:hidden opacity-0 transition-opacity duration-200"></div>

<aside id="admin-sidebar" class="w-64 bg-[#182230] text-white min-h-screen p-4 space-y-1 hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none z-40 select-none">
    
    <!-- En-tête Cockpit & Fermeture Mobile -->
    <div class="p-2.5 mb-3 border-b border-white/10 flex items-center justify-between">
        <a href="index.php" class="flex flex-col items-start gap-1 focus:outline-hidden group">
            <img src="../assets/images/sentech_logo.png" onerror="this.onerror=null; this.src='../assets/images/sentech_logo.webp';" class="h-7 w-auto brightness-0 invert transition-transform duration-120 group-hover:scale-[1.02]" alt="SenTechPLUS" width="130" height="28">
            <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest block mt-0.5">Cockpit Administrateur</span>
        </a>
        <!-- Bouton Fermer Tactile (Mobile) -->
        <button type="button" id="admin-sidebar-close" class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer" aria-label="Fermer le menu">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    </div>
    
    <!-- Section 1 : Commerce & Ventes -->
    <div class="text-[10px] font-bold uppercase text-slate-400/70 px-3.5 pt-3 pb-1 tracking-widest">Commerce & Ventes</div>
    <?php renderSidebarLink('index.php', 'layout-dashboard', 'Tableau de bord', $currentAdminPage === 'index.php'); ?>
    <?php renderSidebarLink('orders.php', 'shopping-cart', 'Commandes', $currentAdminPage === 'orders.php', $sidebarPendingOrders, 'amber'); ?>
    <?php renderSidebarLink('products.php', 'package', 'Produits & Variantes', $currentAdminPage === 'products.php'); ?>
    <?php renderSidebarLink('categories.php', 'layers', 'Catégories & Rayons', $currentAdminPage === 'categories.php'); ?>
    <?php renderSidebarLink('coupons.php', 'tag', 'Coupons & Promos', $currentAdminPage === 'coupons.php'); ?>
    <?php renderSidebarLink('reviews.php', 'star', 'Avis Clients', $currentAdminPage === 'reviews.php', $sidebarPendingReviews, 'blue'); ?>

    <!-- Section 2 : Marketing & Contenu -->
    <div class="text-[10px] font-bold uppercase text-slate-400/70 px-3.5 pt-5 pb-1 tracking-widest">Marketing & Contenu</div>
    <?php renderSidebarLink('announcements.php', 'megaphone', 'Annonces & Bannières', $currentAdminPage === 'announcements.php'); ?>
    <?php renderSidebarLink('notifications.php', 'bell', 'Notifications Push & CRM', $currentAdminPage === 'notifications.php'); ?>
    <?php renderSidebarLink('pages.php', 'file-text', 'Pages CMS & SEO', $currentAdminPage === 'pages.php'); ?>
    <?php renderSidebarLink('sections.php', 'layout-template', 'Sections Dynamiques', $currentAdminPage === 'sections.php'); ?>
    <?php renderSidebarLink('media.php', 'image', 'Médiathèque', $currentAdminPage === 'media.php'); ?>

    <!-- Section 3 : Configuration Système -->
    <div class="text-[10px] font-bold uppercase text-slate-400/70 px-3.5 pt-5 pb-1 tracking-widest">Configuration</div>
    <?php renderSidebarLink('settings.php', 'settings', 'Paramètres du Site', $currentAdminPage === 'settings.php'); ?>
    <?php renderSidebarLink('security.php', 'shield-check', 'Bouclier Sécurité & SIEM', $currentAdminPage === 'security.php'); ?>
    <?php renderSidebarLink('menus.php', 'menu', 'Menus & Footer', $currentAdminPage === 'menus.php'); ?>
    <?php renderSidebarLink('stores.php', 'store', 'Boutiques Vendeurs', $currentAdminPage === 'stores.php'); ?>
    <?php renderSidebarLink('backup.php', 'database', 'Sauvegardes BDD', $currentAdminPage === 'backup.php'); ?>

    <!-- Pied de barre : Boutique Publique & Déconnexion -->
    <div class="pt-5 mt-5 border-t border-white/10 space-y-1">
        <a href="../shop.php" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-[transform,background-color,color] duration-120 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] cursor-pointer group">
            <i data-lucide="external-link" class="w-4 h-4 text-blue-400 transition-transform duration-120 group-hover:scale-105"></i>
            <span>Boutique Publique</span>
        </a>
        <a href="../logout.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-[transform,background-color,color] duration-120 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] cursor-pointer group">
            <i data-lucide="log-out" class="w-4 h-4 transition-transform duration-120 group-hover:scale-105"></i>
            <span>Déconnexion</span>
        </a>
    </div>
</aside>

<script>
// Mobile Sidebar Drawer Management (Emil Kowalski Momentum & Touch)
(function() {
    function initAdminDrawer() {
        var btn = document.getElementById('admin-sidebar-btn');
        var closeBtn = document.getElementById('admin-sidebar-close');
        var aside = document.getElementById('admin-sidebar');
        var backdrop = document.getElementById('admin-drawer-backdrop');

        if (!aside || !backdrop) return;

        function openDrawer() {
            aside.classList.add('open');
            backdrop.classList.remove('hidden');
            requestAnimationFrame(function() {
                backdrop.classList.add('opacity-100');
                backdrop.classList.remove('opacity-0');
            });
        }

        function closeDrawer() {
            aside.classList.remove('open');
            backdrop.classList.add('opacity-0');
            backdrop.classList.remove('opacity-100');
            setTimeout(function() {
                if (!aside.classList.contains('open')) {
                    backdrop.classList.add('hidden');
                }
            }, 220);
        }

        if (btn) {
            btn.onclick = function(e) {
                e.stopPropagation();
                if (aside.classList.contains('open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            };
        }

        if (closeBtn) {
            closeBtn.onclick = function(e) {
                e.stopPropagation();
                closeDrawer();
            };
        }

        backdrop.onclick = closeDrawer;

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && aside.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminDrawer);
    } else {
        initAdminDrawer();
    }
})();
</script>
