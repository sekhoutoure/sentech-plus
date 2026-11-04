<?php
$user = getCurrentUser();
$userId = $user['id'] ?? null;
$cartCount = getCartCount();
$currPage = basename($_SERVER['PHP_SELF']);
$categoriesTree = getAllCategoriesTree();
$unreadNotifsCount = getUnreadNotificationsCount($userId);
$recentNotifs = getUserNotifications($userId, 6);

// Annonces Actives pour le Bandeau Supérieur
$topAnnouncements = [];
$pdoAnn = getDBConnection();
if ($pdoAnn) {
    try {
        $stmtAnn = $pdoAnn->query("SELECT * FROM announcements WHERE is_active = 1 AND placement IN ('header_top_left', 'header_top_center', 'header_top_right', 'mobile_header_banner') ORDER BY display_order ASC");
        $topAnnouncements = $stmtAnn ? $stmtAnn->fetchAll(PDO::FETCH_ASSOC) : [];
    } catch (Throwable $e) {}
}
if (empty($topAnnouncements)) {
    $topAnnouncements = [
        [
            'title' => 'Livraison Express à Dakar en moins de 2h • Wave & Paiement à la livraison',
            'badge_text' => 'DAKAR H+2',
            'icon' => 'truck',
            'placement' => 'header_top_left'
        ],
        [
            'title' => 'Produits 100% Originaux certifiés sous blister avec garantie 12 mois',
            'button_text' => 'Nos engagements',
            'button_url' => 'about.php',
            'icon' => 'shield-check',
            'placement' => 'header_top_center'
        ]
    ];
}

// ─── DÉTECTION DU TYPE DE LAYOUT ─────────────────────────────────────────────
if (!isset($layoutType)) {
    if (in_array($currPage, ['login.php', 'register.php', 'forgot-password.php', 'reset-password.php'])) {
        $layoutType = 'auth';
    } elseif (in_array($currPage, ['checkout.php'])) {
        $layoutType = 'checkout';
    } elseif (in_array($currPage, ['categories.php'])) {
        $layoutType = 'blank';
    } elseif (in_array($currPage, [
        'cart.php', 
        'orders.php', 
        'wishlist.php', 
        'account.php', 
        'order-detail.php', 
        'order-success.php', 
        'tracking.php', 
        'pricing.php', 
        'create-store.php', 
        'offline.php',
        'product.php'
    ])) {
        $layoutType = 'public_compact';
    } elseif (strpos($_SERVER['PHP_SELF'], '/admin/') !== false) {
        $layoutType = 'admin';
    } else {
        $layoutType = 'public_full';
    }
}

// ─── 0. LAYOUT BLANK & ADMIN (Aucun header public) ───────────────────────────
if ($layoutType === 'blank' || $layoutType === 'admin') {
    return;
}

// ─── 1. LAYOUT AUTH (Header minimaliste centré pour login / register) ────────
if ($layoutType === 'auth'): ?>
    <header class="bg-white/85 backdrop-blur-xl border-b border-black/[0.06] py-3.5 sticky top-0 z-40 transition-all">
        <div class="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
            <a href="index.php" class="flex items-center group">
                <img src="assets/images/sentech_logo.webp" alt="SenTech PLUS" width="130" height="28" decoding="async" style="width: 130px; height: 28px; aspect-ratio: 130 / 28;" class="h-7 object-contain transition-transform duration-200 group-hover:scale-[1.03]">
            </a>
            <a href="shop.php" class="text-xs font-bold text-[#64748B] hover:text-[#1677FF] flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-full hover:bg-black/5 active:scale-[0.96]">
                <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
                <span>Retour à la boutique</span>
            </a>
        </div>
    </header>
<?php return; endif; ?>

<?php
// ─── 2. LAYOUT CHECKOUT (Header optimisé conversion sans distractions) ───────
if ($layoutType === 'checkout'): ?>
    <header class="bg-white border-b border-[#E8EDF3] py-3.5 sticky top-0 z-40 shadow-2xs">
        <div class="max-w-[1400px] mx-auto px-3 sm:px-6 flex items-center justify-between">
            <a href="index.php" class="flex items-center group">
                <img src="assets/images/sentech_logo.webp" alt="SenTech PLUS" width="130" height="28" decoding="async" style="width: 130px; height: 28px; aspect-ratio: 130 / 28;" class="h-7 object-contain">
            </a>
            <div class="flex items-center gap-3 sm:gap-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D7D53] border border-emerald-200 text-xs font-bold shadow-2xs">
                    <i data-lucide="shield-check" class="w-4 h-4 text-[#0D7D53]"></i>
                    <span class="hidden sm:inline">Paiement Sécurisé SSL 256-bit</span>
                    <span class="sm:hidden">Sécurisé</span>
                </span>
                <a href="cart.php" class="text-xs font-bold text-[#667085] hover:text-[#1677FF] flex items-center gap-1.5 transition-colors p-1.5 rounded-xl hover:bg-[#F3F7FC]">
                    <i data-lucide="shopping-bag" class="w-4 h-4 text-[#1677FF]"></i>
                    <span class="hidden sm:inline">Retour au Panier</span>
                </a>
            </div>
        </div>
    </header>
<?php return; endif; ?>

<?php
// ─── 2.5. LAYOUT PUBLIC COMPACT (Header secondaire épuré & rapide) ───────────
if ($layoutType === 'public_compact'): ?>
    <header class="bg-white border-b border-[#E8EDF3] py-2.5 sm:py-3 sticky top-0 z-40 shadow-2xs">
        <div class="max-w-[1400px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-4">
            
            <!-- Logo -->
            <a href="index.php" class="flex items-center group shrink-0">
                <img src="assets/images/sentech_logo.webp" alt="SenTech PLUS" width="130" height="28" decoding="async" style="width: 130px; height: 28px; aspect-ratio: 130 / 28;" class="h-7 object-contain">
            </a>

            <!-- Search Bar Compact Omnibox -->
            <div class="flex-1 max-w-xl hidden sm:block">
                <form action="search.php" method="GET" class="w-full relative">
                    <div class="relative h-[44px] flex items-center bg-[#F1F3F7] hover:bg-[#EAEFF5] focus-within:bg-white pl-3.5 pr-1.5 rounded-2xl border border-[#E2E8F0] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 transition-all shadow-xs">
                        <svg class="w-4 h-4 text-[#1677FF] mr-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input 
                            name="q" 
                            type="search" 
                            aria-label="Rechercher un produit, une marque"
                            placeholder="Rechercher un produit, une marque..." 
                            value="<?= htmlspecialchars($_GET['q'] ?? $_GET['search'] ?? '') ?>"
                            autocomplete="off"
                            class="w-full bg-transparent outline-none no-focus-ring search-pill-input text-xs font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]" style="font-size: 14px !important; outline: none !important; border: none !important; box-shadow: none !important; -webkit-appearance: none !important;"
                        >
                        <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important; height: 32px; padding: 0 14px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex-shrink: 0; font-size: 12px; font-weight: 700; border: none;" class="active:scale-95 transition-all shadow-xs cursor-pointer" aria-label="Rechercher">
                            <span>Rechercher</span>
                            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Right Actions: Boutique, Notifications (Cloche), Compte -->
            <div class="flex items-center gap-1.5 sm:gap-2.5">
                <a href="shop.php" class="cursor-pointer text-xs font-bold text-[#344054] hover:text-[#1677FF] px-2.5 py-1.5 rounded-xl hover:bg-[#F3F7FC] transition-colors hidden md:flex items-center gap-1.5">
                    <i data-lucide="grid" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Boutique</span>
                </a>

                <!-- Notifications Cloche Dropdown (Compact Header) -->
                <div class="relative" id="compact-notifs-container">
                    <button 
                        id="compact-notifs-btn"
                        type="button" 
                        onclick="toggleCompactNotifsDropdown()" 
                        class="cursor-pointer relative p-2 text-[#344054] hover:text-[#1677FF] rounded-xl hover:bg-[#F3F7FC] transition-colors focus:ring-2 focus:ring-[#1677FF]" 
                        aria-label="Notifications"
                        aria-expanded="false"
                    >
                        <i data-lucide="bell" class="w-5 h-5"></i>
                        <?php if ($unreadNotifsCount > 0): ?>
                            <span class="absolute top-1 right-1 min-w-4 h-4 bg-[#F97316] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 animate-pulse">
                                <?= $unreadNotifsCount ?>
                            </span>
                        <?php endif; ?>
                    </button>

                    <!-- Dropdown Panneau Notifications Compact -->
                    <div id="compact-notifs-dropdown" class="hidden absolute right-0 top-full mt-2 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-[#E1E8F0] z-50 overflow-hidden animate-fade-in">
                        <!-- En-tête Dropdown -->
                        <div class="p-3 px-4 bg-[#F8FBFF] border-b border-[#E8EDF3] flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i data-lucide="bell" class="w-4 h-4 text-[#1677FF]"></i>
                                <span class="text-xs font-black text-[#182230]">Notifications</span>
                                <?php if ($unreadNotifsCount > 0): ?>
                                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-[#C2410C]">
                                        <?= $unreadNotifsCount ?> non lue<?= $unreadNotifsCount > 1 ? 's' : '' ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                            <form action="notifications.php" method="POST" class="inline">
                                <?= getCSRFInputField() ?>
                                <input type="hidden" name="action" value="mark_all_read">
                                <button type="submit" class="text-[10px] font-bold text-[#0B54C2] hover:underline cursor-pointer">
                                    Tout marquer lu
                                </button>
                            </form>
                        </div>

                        <!-- Liste des Notifications -->
                        <div class="divide-y divide-[#E8EDF3] max-h-[300px] overflow-y-auto">
                            <?php if (empty($recentNotifs)): ?>
                                <div class="p-5 text-center text-xs text-[#667085]">
                                    <i data-lucide="bell-off" class="w-6 h-6 mx-auto text-slate-300 mb-1.5"></i>
                                    <p>Aucune notification.</p>
                                </div>
                            <?php else: ?>
                                <?php foreach ($recentNotifs as $notif): ?>
                                    <a href="<?= htmlspecialchars($notif['link_url'] ?? 'notifications.php') ?>" class="block p-3 hover:bg-[#F8FBFF] transition-colors <?= $notif['is_read'] == 0 ? 'bg-[#EEF5FC]/40' : '' ?>">
                                        <div class="flex items-start gap-2.5">
                                            <div class="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                                                <i data-lucide="<?= htmlspecialchars($notif['icon'] ?? 'bell') ?>" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center justify-between gap-1">
                                                    <span class="text-xs font-bold text-[#182230] truncate"><?= htmlspecialchars($notif['title']) ?></span>
                                                    <?php if ($notif['is_read'] == 0): ?>
                                                        <span class="w-1.5 h-1.5 rounded-full bg-[#1677FF] shrink-0"></span>
                                                    <?php endif; ?>
                                                </div>
                                                <p class="text-[11px] text-[#667085] line-clamp-2 mt-0.5"><?= htmlspecialchars($notif['message']) ?></p>
                                                <span class="text-[9px] text-[#475467] font-semibold mt-1 block"><?= getRelativeTime($notif['created_at']) ?></span>
                                            </div>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>

                        <!-- Footer Dropdown -->
                        <div class="p-2.5 bg-[#F8FBFF] border-t border-[#E8EDF3] text-center">
                            <a href="notifications.php" class="text-xs font-black text-[#0B54C2] hover:text-[#09449E] inline-flex items-center gap-1">
                                <span>Voir toutes les notifications</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Account / Connexion -->
                <a href="<?= isLoggedIn() ? 'account.php' : 'login.php' ?>" class="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-[#344054] hover:text-[#1677FF] p-2 rounded-xl hover:bg-[#F3F7FC] transition-colors" aria-label="Mon Compte">
                    <i data-lucide="user" class="w-5 h-5"></i>
                    <span class="hidden lg:inline"><?= isLoggedIn() ? htmlspecialchars(explode(' ', getCurrentUser()['name'])[0]) : 'Compte' ?></span>
                </a>
            </div>

        </div>
<?php return; endif; ?>

<?php if (!empty($topAnnouncements)): ?>
    <!-- ─── BANDEAU ANNONCES SUPÉRIEUR (Dynamique DB) ─────────────────────── -->
    <div class="bg-[#182230] text-white text-[11px] font-medium py-1.5 px-3 sm:px-6 border-b border-white/10 hidden sm:block">
        <div class="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-slate-300">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span><?= htmlspecialchars($topAnnouncements[0]['title'] ?? 'Livraison Express Dakar') ?></span>
                <?php if (!empty($topAnnouncements[0]['badge_text'])): ?>
                    <span class="bg-[#0B54C2] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                        <?= htmlspecialchars($topAnnouncements[0]['badge_text']) ?>
                    </span>
                <?php endif; ?>
            </div>

            <?php if (count($topAnnouncements) > 1 && !empty($topAnnouncements[1])): ?>
                <div class="hidden md:flex items-center gap-2 text-slate-300">
                    <i data-lucide="<?= htmlspecialchars($topAnnouncements[1]['icon'] ?? 'sparkles') ?>" class="w-3.5 h-3.5 text-amber-400"></i>
                    <span><?= htmlspecialchars($topAnnouncements[1]['title']) ?></span>
                    <?php if (!empty($topAnnouncements[1]['button_url']) && !empty($topAnnouncements[1]['button_text'])): ?>
                        <a href="<?= htmlspecialchars($topAnnouncements[1]['button_url']) ?>" class="text-[#60A5FA] hover:text-white font-bold hover:underline ml-1">
                            <?= htmlspecialchars($topAnnouncements[1]['button_text']) ?> →
                        </a>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <div class="flex items-center gap-4 text-slate-300 text-[10px]">
                <a href="tracking.php" class="hover:text-white transition-colors flex items-center gap-1">
                    <i data-lucide="truck" class="w-3 h-3 text-[#60A5FA]"></i>
                    <span>Suivi Colis</span>
                </a>
                <a href="contact.php" class="hover:text-white transition-colors flex items-center gap-1">
                    <i data-lucide="headphones" class="w-3 h-3 text-[#60A5FA]"></i>
                    <span>Support 7j/7</span>
                </a>
            </div>
        </div>
    </div>
<?php endif; ?>

<!-- ─── 4. MAIN HEADER STICKY RESPONSIVE (Apple-Style Glassmorphism) ────────── -->
<header class="sticky top-0 z-40 glass-nav shadow-apple-soft">
    
    <div class="max-w-[1400px] mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        
        <!-- ─── A. DESKTOP HEADER (>= 1024px) ───────────────────────────────── -->
        <div class="hidden lg:flex items-center justify-between gap-6">
            
            <!-- Logo -->
            <a href="index.php" class="cursor-pointer flex items-center group shrink-0 transition-transform hover:scale-[1.02]">
                <img src="assets/images/sentech_logo.webp" alt="SenTech PLUS" width="150" height="34" decoding="async" style="width: 150px; height: 34px; aspect-ratio: 150 / 34;" class="h-8 object-contain">
            </a>

            <!-- Search Bar Omnibox Desktop Directe -->
            <div class="flex-1 max-w-2xl relative">
                <form action="search.php" method="GET" class="w-full relative">
                    <div class="relative h-[46px] flex items-center bg-[#F1F3F7] hover:bg-[#EAEFF5] focus-within:bg-white pl-4 pr-1.5 rounded-2xl border border-[#E2E8F0] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 transition-all shadow-xs group">
                        <svg class="w-4 h-4 text-[#1677FF] shrink-0 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input 
                            name="q"
                            type="search" 
                            aria-label="Rechercher un produit ou une marque"
                            placeholder="Rechercher un produit, marque, catégorie..." 
                            value="<?= htmlspecialchars($_GET['q'] ?? $_GET['search'] ?? '') ?>"
                            autocomplete="off"
                            class="w-full bg-transparent outline-none no-focus-ring search-pill-input text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]" style="font-size: 14px !important; outline: none !important; border: none !important; box-shadow: none !important; -webkit-appearance: none !important;"
                        >
                        <div class="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/5 text-[10px] font-semibold text-[#86868B] shrink-0 mr-2 border border-black/[0.04] pointer-events-none">
                            <kbd class="font-sans">⌘</kbd>K
                        </div>
                        <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important; height: 34px; padding: 0 16px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex-shrink: 0; font-size: 12px; font-weight: 700; border: none;" class="active:scale-95 transition-all shadow-xs cursor-pointer">
                            <span>Rechercher</span>
                            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Actions Droite: Cloche Notifications + Espace Compte -->
            <div class="flex items-center gap-4 shrink-0">
                
                <!-- Cloche Notifications Dropdown Container -->
                <div class="relative" id="desktop-notifs-container">
                    <button type="button" onclick="toggleNotificationsDropdown()" id="desktop-notifs-btn" aria-expanded="false" aria-haspopup="true" aria-label="Notifications" class="cursor-pointer relative w-10 h-10 rounded-full bg-white hover:bg-[#EAF3FF] border border-[#E5EAF0] flex items-center justify-center text-[#475467] hover:text-[#1677FF] transition-all shadow-2xs focus:ring-2 focus:ring-[#1677FF]">
                        <div class="relative inline-flex items-center justify-center">
                            <svg class="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                            </svg>
                            <?php if ($unreadNotifsCount > 0): ?>
                                <span style="position: absolute; top: -6px; right: -8px; min-width: 16px; height: 16px; padding: 0 4px; background-color: #EF4444; color: #ffffff; font-size: 9px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff; line-height: 1; pointer-events: none; z-index: 10;">
                                    <?= $unreadNotifsCount ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </button>

                    <!-- Dropdown Panneau Notifications -->
                    <div id="desktop-notifs-dropdown" class="hidden absolute right-0 top-full mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-[#E1E8F0] z-50 overflow-hidden animate-fade-in">
                        <!-- En-tête Dropdown -->
                        <div class="p-3.5 px-4 bg-[#F8FBFF] border-b border-[#E8EDF3] flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <i data-lucide="bell" class="w-4 h-4 text-[#1677FF]"></i>
                                <span class="text-xs font-black text-[#182230]">Notifications</span>
                                <?php if ($unreadNotifsCount > 0): ?>
                                    <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-[#C2410C]">
                                        <?= $unreadNotifsCount ?> non lue<?= $unreadNotifsCount > 1 ? 's' : '' ?>
                                    </span>
                                <?php endif; ?>
                            </div>
                            <form action="notifications.php" method="POST" class="inline">
                                <?= getCSRFInputField() ?>
                                <input type="hidden" name="action" value="mark_all_read">
                                <button type="submit" class="text-[10px] font-bold text-[#0B54C2] hover:underline cursor-pointer">
                                    Tout marquer comme lu
                                </button>
                            </form>
                        </div>

                        <!-- Liste des Notifications -->
                        <div class="divide-y divide-[#E8EDF3] max-h-[360px] overflow-y-auto">
                            <?php if (empty($recentNotifs)): ?>
                                <div class="p-6 text-center text-xs text-[#667085]">
                                    <i data-lucide="bell-off" class="w-8 h-8 mx-auto text-slate-300 mb-2"></i>
                                    <p>Aucune notification pour le moment.</p>
                                </div>
                            <?php else: ?>
                                <?php foreach ($recentNotifs as $notif): ?>
                                    <a href="<?= htmlspecialchars($notif['link_url'] ?? 'notifications.php') ?>" class="block p-3.5 hover:bg-[#F8FBFF] transition-colors <?= $notif['is_read'] == 0 ? 'bg-[#EEF5FC]/40' : '' ?>">
                                        <div class="flex items-start gap-3">
                                            <div class="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                                                <i data-lucide="<?= htmlspecialchars($notif['icon'] ?? 'bell') ?>" class="w-4 h-4 text-[#1677FF]"></i>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center justify-between gap-1">
                                                    <span class="text-xs font-bold text-[#182230] truncate"><?= htmlspecialchars($notif['title']) ?></span>
                                                    <?php if ($notif['is_read'] == 0): ?>
                                                        <span class="w-2 h-2 rounded-full bg-[#1677FF] shrink-0"></span>
                                                    <?php endif; ?>
                                                </div>
                                                <p class="text-[11px] text-[#667085] line-clamp-2 mt-0.5"><?= htmlspecialchars($notif['message']) ?></p>
                                                <span class="text-[9px] text-[#475467] font-semibold mt-1 block"><?= getRelativeTime($notif['created_at']) ?></span>
                                            </div>
                                        </div>
                                    </a>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>

                        <!-- Footer Dropdown -->
                        <div class="p-2.5 bg-[#F8FBFF] border-t border-[#E8EDF3] text-center">
                            <a href="notifications.php" class="text-xs font-black text-[#0B54C2] hover:text-[#09449E] inline-flex items-center gap-1">
                                <span>Voir toutes les notifications</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Account / Connexion -->
                <a href="<?= isLoggedIn() ? 'account.php' : 'login.php' ?>" class="cursor-pointer flex items-center gap-2 text-xs font-extrabold text-[#182230] hover:text-[#0B54C2] transition-colors group">
                    <div class="w-10 h-10 rounded-full bg-white group-hover:bg-[#EAF3FF] border border-[#E5EAF0] flex items-center justify-center text-[#475467] group-hover:text-[#0B54C2] transition-colors shadow-2xs">
                        <svg class="w-5 h-5 text-[#475467] group-hover:text-[#0B54C2] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div class="flex flex-col text-left">
                        <span class="text-[10px] text-[#475467] font-medium leading-none">Bonjour</span>
                        <span class="text-xs font-bold leading-tight"><?= isLoggedIn() ? htmlspecialchars(explode(' ', $user['name'])[0]) : 'Connexion' ?></span>
                    </div>
                </a>

            </div>

        </div>

        <!-- ─── B. TABLET HEADER (768px <= width < 1024px / iPad) ──────────── -->
        <div class="hidden md:flex lg:hidden items-center justify-between gap-4 w-full">
            
            <div class="flex items-center gap-3 shrink-0">
                <!-- Hamburger Button -->
                <button type="button" onclick="openMobileDrawer()" aria-label="Menu" class="cursor-pointer w-10 h-10 rounded-xl text-[#182230] hover:bg-[#F5F7FA] transition-colors flex items-center justify-center">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
                </button>
                <!-- Logo Tablette Parfaitement Proportionné -->
                <a href="index.php" class="flex items-center shrink-0">
                    <img src="assets/images/sentech_logo.webp" alt="SenTech PLUS" width="120" height="28" decoding="async" style="width: 120px; height: 28px; aspect-ratio: 120 / 28;" class="h-7 object-contain">
                </a>
            </div>

            <!-- Central Search Omnibox on Tablet -->
            <div class="flex-1 max-w-sm relative">
                <form action="search.php" method="GET" class="w-full relative">
                    <div class="relative h-[44px] flex items-center bg-[#F1F3F7] hover:bg-[#EAEFF5] focus-within:bg-white pl-3.5 pr-1.5 rounded-2xl border border-[#E2E8F0] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 shadow-xs transition-all">
                        <svg class="w-4 h-4 text-[#1677FF] mr-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input 
                            name="q" 
                            type="text" 
                            aria-label="Rechercher sur SenTechPLUS"
                            placeholder="Rechercher sur SenTechPLUS..." 
                            value="<?= htmlspecialchars($_GET['q'] ?? $_GET['search'] ?? '') ?>"
                            autocomplete="off"
                            class="w-full bg-transparent outline-none no-focus-ring search-pill-input text-xs font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]" style="font-size: 14px !important; outline: none !important; border: none !important; box-shadow: none !important; -webkit-appearance: none !important;"
                        >
                        <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important; height: 32px; padding: 0 12px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; flex-shrink: 0; font-size: 12px; font-weight: 700; border: none;" class="active:scale-95 transition-all shadow-xs cursor-pointer" aria-label="Rechercher">
                            <span>Rechercher</span>
                            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </button>
                    </div>
            </div>

            <!-- Tablet Actions: Cloche Notifications + User -->
            <div class="flex items-center gap-2 shrink-0">
                <a href="notifications.php" class="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#475467] hover:text-[#1677FF] hover:bg-[#F3F7FC] transition-colors" aria-label="Notifications">
                    <div class="relative inline-flex items-center justify-center">
                        <svg class="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                        </svg>
                        <?php if ($unreadNotifsCount > 0): ?>
                            <span style="position: absolute; top: -6px; right: -8px; min-width: 16px; height: 16px; padding: 0 4px; background-color: #EF4444; color: #ffffff; font-size: 9px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff; line-height: 1; pointer-events: none; z-index: 10;">
                                <?= $unreadNotifsCount ?>
                            </span>
                        <?php endif; ?>
                    </div>
                </a>

                <a href="<?= isLoggedIn() ? 'account.php' : 'login.php' ?>" class="w-9 h-9 rounded-xl flex items-center justify-center text-[#475467] hover:text-[#0B54C2] hover:bg-[#F3F7FC] transition-colors" aria-label="Compte">
                    <i data-lucide="user" class="w-5 h-5"></i>
                </a>
            </div>

        </div>

        <!-- ─── C. MOBILE HEADER (< 768px / iPhone & Smartphones) ─────────── -->
        <div class="block md:hidden">
            <!-- Mobile Row 1: Hamburger (Left) | Logo (Center) | Cloche Notifications (Right) -->
            <div class="flex items-center justify-between h-10 w-full gap-2">
                
                <!-- Left: Hamburger Button -->
                <button type="button" onclick="openMobileDrawer()" aria-label="Ouvrir le menu de navigation" class="cursor-pointer w-9 h-9 rounded-xl text-[#182230] hover:bg-[#F5F7FA] active:bg-[#EAF3FF] transition-colors flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
                </button>

                <!-- Center: Logo -->
                <div class="flex items-center justify-center flex-1">
                    <a href="index.php" class="flex items-center">
                        <img src="assets/images/sentech_logo.webp" alt="SenTech PLUS" width="115" height="25" decoding="async" style="width: 115px; height: 25px; aspect-ratio: 115 / 25;" class="h-6 object-contain">
                    </a>
                </div>

                <!-- Right: Cloche Notifications Mobile (Parfaitement positionnée en haut à droite) -->
                <div class="flex items-center justify-end shrink-0 w-9 pr-1">
                    <a href="notifications.php" class="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#182230] hover:text-[#1677FF] active:bg-[#EAF3FF] transition-colors" aria-label="Notifications">
                        <div class="relative inline-flex items-center justify-center">
                            <svg class="w-5 h-5 text-[#182230]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                            </svg>
                            <?php if ($unreadNotifsCount > 0): ?>
                                <span style="position: absolute; top: -6px; right: -8px; min-width: 16px; height: 16px; padding: 0 4px; background-color: #EF4444; color: #ffffff; font-size: 9px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #ffffff; line-height: 1; pointer-events: none; z-index: 10;">
                                    <?= $unreadNotifsCount ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Mobile Row 2: Pure Apple Squircle Search Bar -->
            <?php if ($currPage !== 'shop.php' && $currPage !== 'categories.php'): ?>
                <div class="mt-2.5 relative">
                    <form action="search.php" method="GET" class="w-full relative">
                        <div class="relative h-[46px] flex items-center bg-[#F1F3F7] hover:bg-[#EAEFF5] focus-within:bg-white pl-3.5 pr-1.5 rounded-2xl border border-[#E2E8F0] focus-within:border-[#1677FF] focus-within:ring-4 focus-within:ring-[#1677FF]/15 transition-all shadow-xs">
                            <svg class="w-4 h-4 text-[#1677FF] mr-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                            <input 
                                name="q" 
                                type="search" 
                                inputmode="search"
                                enterkeyhint="search"
                                aria-label="Rechercher sur SenTechPLUS"
                                placeholder="Rechercher un produit, marque..." 
                                value="<?= htmlspecialchars($_GET['q'] ?? $_GET['search'] ?? '') ?>"
                                autocomplete="off"
                                class="w-full bg-transparent outline-none no-focus-ring search-pill-input text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]" style="font-size: 14px !important; outline: none !important; border: none !important; box-shadow: none !important; -webkit-appearance: none !important;"
                            >
                            <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important; height: 34px; padding: 0 14px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex-shrink: 0; font-size: 12px; font-weight: 700; border: none;" class="active:scale-95 transition-all shadow-xs cursor-pointer" aria-label="Lancer la recherche">
                                <span>Rechercher</span>
                                <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </form>
                </div>
            <?php endif; ?>
        </div>

        <!-- ─── DESKTOP SECONDARY NAVBAR (Uniquement sur layout_public_full) ─── -->
        <?php if ($layoutType === 'public_full'): ?>
            <div class="hidden lg:flex items-center justify-between pt-2.5 mt-2 border-t border-[#E8EDF3] text-xs font-bold text-[#475467] relative">
                
                <div class="flex items-center gap-6">
                    
                    <!-- Mega-Menu Categories Trigger -->
                    <div class="relative group" id="desktop-cat-dropdown-container">
                        <button type="button" id="desktop-cat-btn" onclick="toggleDesktopMegaMenu()" aria-expanded="false" aria-haspopup="true" class="cursor-pointer inline-flex items-center gap-2 bg-[#0B54C2] hover:bg-[#09449E] text-white px-4 py-2 rounded-xl transition-all shadow-2xs font-extrabold">
                            <i data-lucide="layout-grid" class="w-4 h-4"></i>
                            <span>Rayons & Catégories</span>
                            <i data-lucide="chevron-down" id="desktop-cat-chevron" class="w-3.5 h-3.5 transition-transform duration-200"></i>
                        </button>

                        <!-- Mega-Menu Dropdown Panel (Pro & Spacious Grid) -->
                        <div id="desktop-mega-menu" class="hidden bg-white rounded-3xl p-6 border border-[#E1E8F0] animate-fade-in text-left" style="position: absolute; top: calc(100% + 8px); left: 0; width: 860px; max-width: calc(100vw - 60px); z-index: 9999; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);">
                            <div style="display: grid; grid-template-columns: 2.3fr 1fr; gap: 24px;">
                                
                                <!-- 7 Main Categories (3 Columns) -->
                                <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px;">
                                    <?php foreach ($categoriesTree as $pCat): ?>
                                        <div class="space-y-1.5">
                                            <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>" class="inline-flex items-center gap-2 font-extrabold text-xs text-[#182230] hover:text-[#1677FF] transition-colors pb-1 border-b border-[#F1F5F9] w-full">
                                                <i data-lucide="<?= htmlspecialchars($pCat['icon'] ?? 'box') ?>" class="w-4 h-4 text-[#1677FF] shrink-0"></i>
                                                <span class="truncate"><?= htmlspecialchars($pCat['name']) ?></span>
                                            </a>

                                            <?php if (!empty($pCat['subcategories'])): ?>
                                                <ul class="space-y-1 pl-1 text-[11px] font-medium text-[#64748B]">
                                                    <?php foreach (array_slice($pCat['subcategories'], 0, 4) as $sCat): ?>
                                                        <li>
                                                            <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>&subcategory=<?= urlencode($sCat['slug']) ?>" class="hover:text-[#1677FF] transition-colors block truncate py-0.5">
                                                                <?= htmlspecialchars($sCat['name']) ?>
                                                            </a>
                                                        </li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            <?php endif; ?>
                                        </div>
                                    <?php endforeach; ?>
                                </div>

                                <!-- Right Spotlight Card: Promos & Bons Plans -->
                                <div class="bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EB] to-[#F8FBFF] rounded-2xl p-4 border border-amber-200/70 flex flex-col justify-between space-y-3">
                                    <div>
                                        <span class="inline-flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                            <i data-lucide="flame" class="w-2.5 h-2.5"></i> Bons Plans
                                        </span>
                                        <h4 class="text-xs font-black text-amber-950 mt-2 leading-tight">Promotions & Ventes Flash</h4>
                                        <p class="text-[10px] text-amber-800/80 mt-1">Jusqu'à -35% de réduction immédiate sur les meilleures marques.</p>
                                    </div>

                                    <div class="space-y-1.5 text-[11px] font-bold">
                                        <a href="shop.php?collection=flash" class="flex items-center justify-between p-2 rounded-xl bg-white/80 hover:bg-white text-amber-900 shadow-2xs transition-colors">
                                            <span>⚡ Vente Flash</span>
                                            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                                        </a>
                                        <a href="shop.php?collection=new" class="flex items-center justify-between p-2 rounded-xl bg-white/80 hover:bg-white text-amber-900 shadow-2xs transition-colors">
                                            <span>✨ Nouveautés 2026</span>
                                            <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                                        </a>
                                    </div>

                                    <a href="shop.php" class="inline-flex items-center justify-center gap-1 w-full bg-[#0B54C2] text-white text-xs font-black py-2 rounded-xl shadow-2xs hover:bg-[#09449E] transition-all">
                                        <span>Tout Explorer</span>
                                        <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Navigation Quick Links -->
                    <a href="index.php" class="hover:text-[#0B54C2] transition-colors <?= ($currPage === 'index.php') ? 'text-[#0B54C2]' : '' ?>">Accueil</a>
                    <a href="shop.php" class="hover:text-[#0B54C2] transition-colors <?= ($currPage === 'shop.php' && empty($_GET['collection'])) ? 'text-[#0B54C2]' : '' ?>">Boutique</a>
                    <a href="shop.php?collection=flash" class="hover:text-[#C2410C] text-[#C2410C] transition-colors inline-flex items-center gap-1">
                        <i data-lucide="flame" class="w-3.5 h-3.5"></i>
                        <span>Ventes Flash</span>
                    </a>
                    <a href="tracking.php" class="hover:text-[#0B54C2] transition-colors inline-flex items-center gap-1.5 <?= ($currPage === 'tracking.php') ? 'text-[#0B54C2]' : '' ?>">
                        <i data-lucide="radar" class="w-3.5 h-3.5 text-[#0B54C2]"></i>
                        <span>Suivi Colis</span>
                    </a>
                    <a href="contact.php" class="hover:text-[#0B54C2] transition-colors">Support & FAQ</a>
                </div>

                <div class="flex items-center gap-3">
                    <a href="https://wa.me/<?= WHATSAPP_PHONE ?>" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[#0D7D53] hover:text-[#085237] text-xs font-extrabold">
                        <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                        <span>Dakar : <?= WHATSAPP_DISPLAY ?></span>
                    </a>
                </div>

            </div>
        <?php endif; ?>

    </div>

</header>

<!-- ─── 5. MOBILE SLIDE-OVER DRAWER MENU (Apple Glass & Gesture Drag) ───────── -->
<div id="mobile-drawer-overlay" class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md hidden transition-all duration-300" onclick="closeMobileDrawer()">
    <div id="mobile-drawer-panel" class="fixed inset-y-0 left-0 max-w-[320px] w-full bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between p-5 space-y-4 overflow-y-auto animate-slide-in border-r border-white/60" onclick="event.stopPropagation()">
        
        <!-- Apple Sheet Grabber -->
        <div class="sm:hidden pt-1 pb-1 flex justify-center">
            <div class="apple-drag-handle"></div>
        </div>
        
        <!-- Drawer Header -->
        <div class="space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#E8EDF3]">
                <a href="index.php">
                    <img src="assets/images/sentech_logo.webp" alt="Logo" width="110" height="26" decoding="async" style="width: 110px; height: 26px; aspect-ratio: 110 / 26;" class="h-6 object-contain">
                </a>
                <button type="button" onclick="closeMobileDrawer()" class="cursor-pointer p-1.5 rounded-full hover:bg-[#F3F7FC] text-[#667085]">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Profile Info Card -->
            <?php if (isLoggedIn()): ?>
                <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#1677FF] text-white flex items-center justify-center font-black text-sm">
                        <?= strtoupper(substr($user['name'] ?? 'U', 0, 1)) ?>
                    </div>
                    <div class="min-w-0">
                        <span class="text-xs font-black text-[#182230] truncate block"><?= htmlspecialchars($user['name']) ?></span>
                        <span class="text-[10px] text-[#344054] font-medium truncate block"><?= htmlspecialchars($user['email']) ?></span>
                    </div>
                </div>
            <?php else: ?>
                <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] flex items-center justify-between gap-2">
                    <div class="text-xs">
                        <span class="font-bold text-[#182230] block">Bienvenue sur SenTechPLUS</span>
                        <span class="text-[10px] text-[#344054] font-medium">Connectez-vous pour vos commandes</span>
                    </div>
                    <a href="login.php" class="cursor-pointer bg-[#0B54C2] hover:bg-[#09449E] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                        Connexion
                    </a>
                </div>
            <?php endif; ?>

            <!-- Navigation Links -->
            <div class="space-y-1 text-xs font-bold text-[#182230]">
                <a href="index.php" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'index.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                    <i data-lucide="home" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Accueil</span>
                </a>

                <a href="shop.php" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'shop.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                    <i data-lucide="layout-grid" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Toute la Boutique</span>
                </a>

                <a href="notifications.php" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'notifications.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                    <div class="flex items-center gap-3">
                        <i data-lucide="bell" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Mes Notifications</span>
                    </div>
                    <?php if ($unreadNotifsCount > 0): ?>
                        <span class="text-[10px] bg-orange-100 text-[#C2410C] px-2 py-0.5 rounded-full font-black"><?= $unreadNotifsCount ?></span>
                    <?php endif; ?>
                </a>

                <a href="shop.php?collection=flash" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 text-amber-900 transition-colors">
                    <i data-lucide="flame" class="w-4 h-4 text-[#C2410C]"></i>
                    <span>Ventes Flash du Jour</span>
                </a>

                <a href="wishlist.php" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'wishlist.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                    <div class="flex items-center gap-3">
                        <i data-lucide="heart" class="w-4 h-4 text-rose-500"></i>
                        <span>Mes Favoris</span>
                    </div>
                </a>

                <a href="orders.php" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'orders.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                    <i data-lucide="package" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Mes Commandes</span>
                </a>

                <a href="tracking.php" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'tracking.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                    <i data-lucide="radar" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Suivi de Colis en Direct</span>
                </a>

                <?php if (isLoggedIn()): ?>
                    <a href="account.php" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F3F7FC] transition-colors <?= ($currPage === 'account.php') ? 'bg-[#EAF3FF] text-[#0B54C2]' : '' ?>">
                        <i data-lucide="settings" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Mon Compte & Adresses</span>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Accordéon Rayons & Catégories Mobile -->
            <div class="pt-3 border-t border-[#E8EDF3] space-y-1.5">
                <span class="text-[10px] font-black uppercase text-[#344054] tracking-wider px-2 block mb-1">Nos Rayons High-Tech</span>
                
                <?php foreach ($categoriesTree as $cIdx => $pCat): ?>
                    <div class="rounded-2xl border border-[#E8EDF3] overflow-hidden">
                        <!-- En-tête Catégorie -->
                        <div class="flex items-center justify-between p-3 bg-[#F8FBFF] hover:bg-[#F0F5FD] cursor-pointer transition-colors" onclick="toggleMobileCatAccordion('mob-cat-<?= $cIdx ?>')">
                            <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>" class="flex items-center gap-2.5 text-xs font-bold text-[#182230]" onclick="event.stopPropagation()">
                                <i data-lucide="<?= htmlspecialchars($pCat['icon'] ?? 'box') ?>" class="w-4 h-4 text-[#1677FF]"></i>
                                <span class="truncate"><?= htmlspecialchars($pCat['name']) ?></span>
                            </a>
                            <button type="button" class="p-1 text-[#667085]">
                                <i data-lucide="chevron-down" id="chevron-mob-cat-<?= $cIdx ?>" class="w-3.5 h-3.5 transition-transform duration-200"></i>
                            </button>
                        </div>

                        <!-- Liste Sous-Catégories Dépliables -->
                        <?php if (!empty($pCat['subcategories'])): ?>
                            <div id="mob-cat-<?= $cIdx ?>" class="hidden px-4 py-2 bg-white space-y-1 text-[11px] border-t border-[#E8EDF3]">
                                <?php foreach ($pCat['subcategories'] as $sCat): ?>
                                    <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>&subcategory=<?= urlencode($sCat['slug']) ?>" class="flex items-center justify-between py-1.5 text-[#475467] hover:text-[#0B54C2] font-semibold transition-colors">
                                        <span><?= htmlspecialchars($sCat['name']) ?></span>
                                        <i data-lucide="arrow-right" class="w-3 h-3 opacity-50"></i>
                                    </a>
                                <?php endforeach; ?>
                                <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>" class="block pt-1.5 text-[10px] font-black text-[#0B54C2] hover:underline">
                                    Voir tout dans <?= htmlspecialchars($pCat['name']) ?> →
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>

            </div>
        </div>

        <!-- Drawer Footer (Support & Logout) -->
        <div class="pt-3 border-t border-[#E8EDF3] space-y-2 text-xs">
            <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j'ai%20besoin%20d'aide." target="_blank" rel="noopener" class="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-2.5 rounded-xl shadow-2xs">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
                <span>Support WhatsApp 7j/7</span>
            </a>

            <?php if (isLoggedIn()): ?>
                <a href="logout.php" class="w-full flex items-center justify-center gap-2 text-rose-600 font-bold py-2 rounded-xl hover:bg-rose-50 transition-colors">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    <span>Déconnexion</span>
                </a>
            <?php endif; ?>
        </div>

    </div>
</div>

<script>
// Notifications Dropdown Toggle & Outside Click
function toggleNotificationsDropdown() {
    const dropdown = document.getElementById('desktop-notifs-dropdown');
    const btn = document.getElementById('desktop-notifs-btn');
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
        dropdown.classList.remove('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
        dropdown.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
}

function toggleCompactNotifsDropdown() {
    const dropdown = document.getElementById('compact-notifs-dropdown');
    const btn = document.getElementById('compact-notifs-btn');
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
        dropdown.classList.remove('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
        dropdown.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
}

// Close Dropdowns on Click Outside or Escape
document.addEventListener('click', function(e) {
    const container = document.getElementById('desktop-notifs-container');
    const dropdown = document.getElementById('desktop-notifs-dropdown');
    const btn = document.getElementById('desktop-notifs-btn');
    if (container && !container.contains(e.target) && dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    const cContainer = document.getElementById('compact-notifs-container');
    const cDropdown = document.getElementById('compact-notifs-dropdown');
    const cBtn = document.getElementById('compact-notifs-btn');
    if (cContainer && !cContainer.contains(e.target) && cDropdown && !cDropdown.classList.contains('hidden')) {
        cDropdown.classList.add('hidden');
        if (cBtn) cBtn.setAttribute('aria-expanded', 'false');
    }

    const catContainer = document.getElementById('desktop-cat-dropdown-container');
    const megaMenu = document.getElementById('desktop-mega-menu');
    const chevron = document.getElementById('desktop-cat-chevron');
    if (catContainer && !catContainer.contains(e.target) && megaMenu && !megaMenu.classList.contains('hidden')) {
        megaMenu.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const dropdown = document.getElementById('desktop-notifs-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
        const cDropdown = document.getElementById('compact-notifs-dropdown');
        if (cDropdown) cDropdown.classList.add('hidden');
        const megaMenu = document.getElementById('desktop-mega-menu');
        if (megaMenu) megaMenu.classList.add('hidden');
        closeMobileDrawer();
        if (typeof closeMobileSearch === 'function') closeMobileSearch();
    }
});

// Desktop Mega-Menu Toggle
function toggleDesktopMegaMenu() {
    const menu = document.getElementById('desktop-mega-menu');
    const chevron = document.getElementById('desktop-cat-chevron');
    const btn = document.getElementById('desktop-cat-btn');
    if (!menu) return;
    
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
        menu.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        if (btn) btn.setAttribute('aria-expanded', 'true');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: menu, skipHidden: false });
        }
    } else {
        menu.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
}

// Mobile Accordion Toggle
function toggleMobileCatAccordion(id) {
    const el = document.getElementById(id);
    const chevron = document.getElementById('chevron-' + id);
    if (!el) return;
    
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
        el.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
}

function openMobileDrawer() {
    const ov = document.getElementById('mobile-drawer-overlay');
    if (ov) {
        ov.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}
function closeMobileDrawer() {
    const ov = document.getElementById('mobile-drawer-overlay');
    if (ov) {
        ov.classList.add('hidden');
        document.body.style.overflow = '';
    }
}
</script>

