<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$adminUser = getCurrentUser();

// Statistiques cockpit temps réel
$totalSales = 0.0;
$totalOrdersCount = 0;
$pendingOrdersCount = 0;
$totalProductsCount = 0;
$lowStockCount = 0;
$totalReviewsCount = 0;
$activeAnnouncementsCount = 0;
$recentOrders = [];

if ($pdo) {
    try {
        // Chiffre d'affaires & Commandes
        $stmtSales = $pdo->query("SELECT COALESCE(SUM(total), 0) FROM orders WHERE order_status != 'cancelled'");
        $totalSales = (float)($stmtSales ? $stmtSales->fetchColumn() : 0);

        $stmtTotOrd = $pdo->query("SELECT COUNT(*) FROM orders");
        $totalOrdersCount = (int)($stmtTotOrd ? $stmtTotOrd->fetchColumn() : 0);

        $stmtPend = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'pending' OR status = 'ORDER_PLACED'");
        $pendingOrdersCount = (int)($stmtPend ? $stmtPend->fetchColumn() : 0);

        // Produits & Alertes Stock
        $stmtTotProd = $pdo->query("SELECT COUNT(*) FROM products");
        $totalProductsCount = (int)($stmtTotProd ? $stmtTotProd->fetchColumn() : 0);

        $stmtLow = $pdo->query("SELECT COUNT(*) FROM products WHERE stock <= 5 AND stock > 0");
        $lowStockCount = (int)($stmtLow ? $stmtLow->fetchColumn() : 0);

        // Avis Clients
        $stmtRev = $pdo->query("SELECT COUNT(*) FROM reviews");
        $totalReviewsCount = (int)($stmtRev ? $stmtRev->fetchColumn() : 0);

        // Annonces actives
        $stmtAnn = $pdo->query("SELECT COUNT(*) FROM announcements WHERE is_active = 1");
        $activeAnnouncementsCount = (int)($stmtAnn ? $stmtAnn->fetchColumn() : 0);

        // Dernières commandes
        $stmtRecent = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 6");
        $recentOrders = $stmtRecent ? $stmtRecent->fetchAll() : [];

    } catch (Throwable $e) {}
}

$pageTitle = "Cockpit Administrateur Central — SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="layout-dashboard" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Cockpit de Pilotage Central SenTechPLUS</span>
                </h1>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-xs font-bold text-[#667085] hidden sm:inline">Connecté : <strong><?= htmlspecialchars($adminUser['name'] ?? 'Admin') ?></strong></span>
                <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline cursor-pointer">Déconnexion</a>
            </div>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            <!-- Welcome Header -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-[#182230] to-[#0B54C2] text-white p-6 sm:p-8 rounded-3xl shadow-md">
                <div class="space-y-1">
                    <span class="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block">Tableau de Bord Global</span>
                    <h2 class="text-xl sm:text-2xl font-black">Bienvenue sur votre Espace de Pilotage</h2>
                    <p class="text-xs text-white/80">Contrôlez vos ventes, vos stocks, vos bannières et le contenu de votre boutique sans coder.</p>
                </div>
                <div class="flex items-center gap-3">
                    <a href="products.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-xs transition-all active:scale-95">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>+ Nouveau Produit</span>
                    </a>
                </div>
            </div>

            <!-- ─── 4 CARTES MÉTRIQUES CLÉS ────────────────────────────────────── -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <!-- Chiffre d'Affaires -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Chiffre d'Affaires</span>
                        <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D7D53] flex items-center justify-center font-bold">
                            <i data-lucide="banknote" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl font-black text-[#182230] block"><?= formatPrice($totalSales) ?></span>
                    <span class="text-[10px] text-[#0D7D53] font-extrabold">Encaissé & Confirmé</span>
                </div>

                <!-- Total Commandes -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Commandes</span>
                        <div class="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-bold">
                            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl font-black text-[#182230] block"><?= $totalOrdersCount ?></span>
                    <span class="text-[10px] text-amber-600 font-extrabold"><?= $pendingOrdersCount ?> en attente de livraison</span>
                </div>

                <!-- Catalogue Produits & Alerte Stock -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Catalogue Produits</span>
                        <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                            <i data-lucide="package" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl font-black text-[#182230] block"><?= $totalProductsCount ?> articles</span>
                    <span class="text-[10px] text-rose-500 font-extrabold"><?= $lowStockCount ?> en alerte stock faible</span>
                </div>

                <!-- Avis & Bannières -->
                <div class="bg-white p-5 rounded-3xl border border-[#E8EDF3] shadow-2xs space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-[#667085]">Marketing & Avis</span>
                        <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                            <i data-lucide="megaphone" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl font-black text-[#182230] block"><?= $activeAnnouncementsCount ?> annonces</span>
                    <span class="text-[10px] text-[#1677FF] font-extrabold"><?= $totalReviewsCount ?> avis clients publiés</span>
                </div>

            </div>

            <!-- ─── RACCOURCIS DE GESTION RAPIDE DU SITE ────────────────────────── -->
            <div class="bg-white rounded-3xl p-6 border border-[#E8EDF3] shadow-2xs space-y-4">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Accès Rapide aux Modules de Gestion</h3>
                
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    
                    <a href="products.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="package" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Produits</span>
                    </a>

                    <a href="categories.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-[#0D7D53]/10 text-[#0D7D53] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="layers" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Catégories</span>
                    </a>

                    <a href="orders.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Commandes</span>
                    </a>

                    <a href="announcements.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="megaphone" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Annonces Header</span>
                    </a>

                    <a href="pages.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="file-text" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Pages CMS</span>
                    </a>

                    <a href="banners.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="image" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Affiches Slider</span>
                    </a>

                    <a href="settings.php" class="p-3.5 rounded-2xl bg-[#F8FBFF] hover:bg-[#EAF3FF] border border-[#E8EDF3] transition-all text-center space-y-2 group">
                        <div class="w-10 h-10 rounded-xl bg-slate-700/10 text-slate-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                            <i data-lucide="settings" class="w-5 h-5"></i>
                        </div>
                        <span class="text-xs font-bold text-[#182230] block">Paramètres</span>
                    </a>

                </div>
            </div>

            <!-- ─── DERNIÈRES COMMANDES ────────────────────────────────────────── -->
            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="p-5 border-b border-[#E8EDF3] flex items-center justify-between">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Dernières Commandes Clients</h3>
                    <a href="orders.php" class="text-xs font-bold text-[#1677FF] hover:underline">Voir toutes les commandes →</a>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-3.5 pl-5">N° Commande</th>
                                <th class="p-3.5">Client</th>
                                <th class="p-3.5">Montant</th>
                                <th class="p-3.5">Paiement</th>
                                <th class="p-3.5">Statut</th>
                                <th class="p-3.5 pr-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php if (empty($recentOrders)): ?>
                                <tr>
                                    <td colspan="6" class="p-8 text-center text-[#64748B]">
                                        <div class="space-y-1">
                                            <p class="font-bold text-sm text-[#182230]">Aucune commande récente</p>
                                            <p class="text-xs">Les commandes validées par vos clients apparaîtront automatiquement ici.</p>
                                        </div>
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach ($recentOrders as $rord): ?>
                                    <tr class="hover:bg-[#F8FBFF] transition-colors">
                                        <td class="p-3.5 pl-5 font-mono font-bold text-[#1677FF]">
                                            #<?= htmlspecialchars($rord['order_number'] ?? $rord['id']) ?>
                                        </td>
                                        <td class="p-3.5 font-bold text-[#182230]">
                                            <?= htmlspecialchars(($rord['customer_first_name'] ?? 'Client') . ' ' . ($rord['customer_last_name'] ?? '')) ?>
                                        </td>
                                        <td class="p-3.5 font-black text-[#0B54C2]">
                                            <?= formatPrice($rord['total'] ?? $rord['total_amount'] ?? 0) ?>
                                        </td>
                                        <td class="p-3.5 uppercase font-bold text-[10px]">
                                            <?= htmlspecialchars($rord['payment_method'] ?? 'COD') ?>
                                        </td>
                                        <td class="p-3.5">
                                            <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0D7D53] border border-emerald-200">
                                                <?= htmlspecialchars($rord['order_status'] ?? 'Enregistrée') ?>
                                            </span>
                                        </td>
                                        <td class="p-3.5 pr-5 text-right">
                                            <a href="orders.php" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:underline">Gérer</a>
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
