<?php
// Sidebar Admin Unifiée SenTechPLUS
$currentAdminPage = basename($_SERVER['PHP_SELF']);
?>
<aside class="w-64 bg-[#182230] text-white min-h-screen p-4 space-y-1 hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none z-30">
    <div class="p-3 mb-4 border-b border-white/10 flex flex-col items-start gap-1">
        <a href="index.php">
            <img src="../assets/images/sentech_logo.png" onerror="this.onerror=null; this.src='../assets/images/sentech_logo.webp';" class="h-8 w-auto brightness-0 invert" alt="SenTechPLUS" width="140" height="32">
        </a>
        <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest block mt-1">Cockpit Administrateur</span>
    </div>
    
    <div class="text-[10px] font-black uppercase text-white/40 px-3 pt-2 tracking-wider">Commerce & Ventes</div>
    
    <a href="index.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'index.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="layout-dashboard" class="w-4 h-4 shrink-0"></i>
        <span>Tableau de bord</span>
    </a>
    
    <a href="orders.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'orders.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="shopping-cart" class="w-4 h-4 shrink-0"></i>
        <span>Commandes</span>
    </a>

    <a href="products.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'products.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="package" class="w-4 h-4 shrink-0"></i>
        <span>Produits & Variantes</span>
    </a>

    <a href="categories.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'categories.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="layers" class="w-4 h-4 shrink-0"></i>
        <span>Catégories & Rayons</span>
    </a>

    <a href="coupons.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'coupons.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="tag" class="w-4 h-4 shrink-0"></i>
        <span>Coupons & Promos</span>
    </a>

    <a href="reviews.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'reviews.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="star" class="w-4 h-4 shrink-0"></i>
        <span>Avis Clients</span>
    </a>

    <div class="text-[10px] font-black uppercase text-white/40 px-3 pt-4 tracking-wider">Marketing & Contenu</div>

    <a href="announcements.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'announcements.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="megaphone" class="w-4 h-4 shrink-0"></i>
        <span>Annonces & Bannières</span>
    </a>

    <a href="notifications.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'notifications.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="bell" class="w-4 h-4 shrink-0"></i>
        <span>Notifications Push & CRM</span>
    </a>

    <a href="pages.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'pages.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="file-text" class="w-4 h-4 shrink-0"></i>
        <span>Pages CMS & SEO</span>
    </a>

    <a href="sections.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'sections.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="layout-template" class="w-4 h-4 shrink-0"></i>
        <span>Sections Dynamiques</span>
    </a>

    <a href="media.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'media.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="image" class="w-4 h-4 shrink-0"></i>
        <span>Médiathèque</span>
    </a>

    <div class="text-[10px] font-black uppercase text-white/40 px-3 pt-4 tracking-wider">Configuration</div>

    <a href="settings.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'settings.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="settings" class="w-4 h-4 shrink-0"></i>
        <span>Paramètres du Site</span>
    </a>

    <a href="security.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'security.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="shield-check" class="w-4 h-4 shrink-0 text-emerald-400"></i>
        <span>Bouclier Sécurité & SIEM</span>
    </a>


    <a href="menus.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'menus.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="menu" class="w-4 h-4 shrink-0"></i>
        <span>Menus & Footer</span>
    </a>

    <a href="stores.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'stores.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="store" class="w-4 h-4 shrink-0"></i>
        <span>Boutiques Vendeurs</span>
    </a>

    <a href="backup.php" class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer <?= $currentAdminPage === 'backup.php' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white' ?>">
        <i data-lucide="database" class="w-4 h-4 shrink-0"></i>
        <span>Sauvegardes BDD</span>
    </a>

    <div class="pt-6 mt-6 border-t border-white/10 space-y-1">
        <a href="../shop.php" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-blue-400 hover:underline cursor-pointer">
            <i data-lucide="external-link" class="w-4 h-4"></i>
            <span>Boutique Publique</span>
        </a>
        <a href="../logout.php" class="flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-rose-400 hover:underline cursor-pointer">
            <i data-lucide="log-out" class="w-4 h-4"></i>
            <span>Déconnexion</span>
        </a>
    </div>
</aside>
