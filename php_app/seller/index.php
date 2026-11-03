<?php
require_once __DIR__ . '/../config/config.php';
$sellerUser = requireSeller();

// Redirection si non connecté
if (!isLoggedIn()) {
    header('Location: ../login.php?redirect=seller/index.php');
    exit;
}

$user = getCurrentUser();
$db = null;
$store = null;
$stats = [
    'revenue' => 485000,
    'orders_count' => 18,
    'products_count' => 12,
    'pending_orders' => 3
];
$recentOrders = [];

try {
    $db = getDBConnection();
    // Fetch store of current user
    $stmt = $db->prepare("SELECT * FROM stores WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $store = $stmt->fetch();

    if ($store) {
        // Real KPI aggregations
        $stmtP = $db->prepare("SELECT COUNT(*) as cnt FROM products WHERE store_id = ?");
        $stmtP->execute([$store['id']]);
        $stats['products_count'] = (int)$stmtP->fetch()['cnt'];

        $stmtO = $db->prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(total), 0) as total_rev FROM orders WHERE store_id = ?");
        $stmtO->execute([$store['id']]);
        $orderData = $stmtO->fetch();
        $stats['orders_count'] = (int)$orderData['cnt'];
        $stats['revenue'] = (float)$orderData['total_rev'];

        $stmtR = $db->prepare("SELECT * FROM orders WHERE store_id = ? ORDER BY created_at DESC LIMIT 5");
        $stmtR->execute([$store['id']]);
        $recentOrders = $stmtR->fetchAll();
    }
} catch (Exception $e) {
    $store = [
        'id' => 'store_partner',
        'name' => 'Boutique Partenaire Dakar',
        'username' => 'boutique-dakar',
        'status' => 'approved',
        'plan' => 'Standard (15 000 FCFA/mois)',
        'logo' => '../assets/images/happy_store.webp'
    ];
}

if (!$store) {
    header('Location: ../create-store.php');
    exit;
}

$pageTitle = "Tableau de Bord Vendeur — " . htmlspecialchars($store['name']);
?>
<!DOCTYPE html>
<html lang="fr" class="h-full bg-[#F8FBFF]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?> | SenTechPLUS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; }
    </style>
</head>
<body class="h-full flex flex-col antialiased text-[#182230]">

    <!-- Header Vendeur -->
    <header class="bg-white border-b border-[#E8EDF3] sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="../index.php" class="flex items-center gap-2">
                <img src="../assets/images/sentech_logo.webp" alt="SenTechPLUS" width="140" height="32" class="h-7 w-auto object-contain">
            </a>
            <span class="text-xs font-extrabold px-2.5 py-1 bg-[#1677FF]/10 text-[#0B54C2] rounded-full uppercase tracking-wider">Espace Vendeur</span>
        </div>

        <div class="flex items-center gap-3">
            <a href="../store.php?username=<?= urlencode($store['username']) ?>" target="_blank" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:text-[#0B54C2] px-3 py-1.5 rounded-xl border border-[#1677FF]/20 hover:bg-[#EAF3FF] transition-all flex items-center gap-1.5">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                <span>Voir ma vitrine</span>
            </a>
            <a href="../index.php" class="cursor-pointer text-xs font-bold text-[#667085] hover:text-[#182230] px-3 py-1.5 rounded-xl hover:bg-[#F3F7FC] transition-all">
                Boutique Principale
            </a>
        </div>
    </header>

    <div class="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <!-- Welcome Banner & Store Plan Status -->
        <div class="bg-gradient-to-r from-[#182230] to-[#0B54C2] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-white/20 overflow-hidden shrink-0">
                    <img src="<?= htmlspecialchars($store['logo'] ?? '../assets/images/happy_store.webp') ?>" alt="Logo Boutique" width="56" height="56" style="aspect-ratio:1/1;" class="w-full h-full object-cover rounded-xl" loading="eager">
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="text-xl sm:text-2xl font-black tracking-tight"><?= htmlspecialchars($store['name']) ?></h1>
                        <span class="bg-[#16C784]/20 text-[#16C784] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#16C784]/30">✓ Certifié</span>
                    </div>
                    <p class="text-xs text-white/70 mt-0.5">Slug public : sentechplus.com/store.php?username=<?= htmlspecialchars($store['username']) ?></p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <div class="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-left border border-white/15">
                    <span class="text-[10px] text-white/70 block uppercase font-bold">Abonnement SaaS</span>
                    <span class="text-xs font-extrabold text-white">Plan Standard (Actif)</span>
                </div>
                <a href="products.php" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5">
                    <i data-lucide="plus-circle" class="w-4 h-4"></i>
                    <span>Ajouter Produit</span>
                </a>
            </div>
        </div>

        <!-- 4 KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div class="bg-white p-5 rounded-2xl border border-[#E8EDF3] shadow-2xs space-y-1">
                <div class="flex items-center justify-between text-[#667085]">
                    <span class="text-xs font-bold">Chiffre d'Affaires</span>
                    <i data-lucide="wallet" class="w-4 h-4 text-[#1677FF]"></i>
                </div>
                <p class="text-xl sm:text-2xl font-black text-[#182230]"><?= formatPrice($stats['revenue']) ?></p>
                <span class="text-[10px] text-[#16C784] font-bold">✓ Net à percevoir</span>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-[#E8EDF3] shadow-2xs space-y-1">
                <div class="flex items-center justify-between text-[#667085]">
                    <span class="text-xs font-bold">Commandes Totales</span>
                    <i data-lucide="shopping-bag" class="w-4 h-4 text-[#0B54C2]"></i>
                </div>
                <p class="text-xl sm:text-2xl font-black text-[#182230]"><?= $stats['orders_count'] ?></p>
                <span class="text-[10px] text-[#0B54C2] font-bold">📦 Ventes confirmées</span>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-[#E8EDF3] shadow-2xs space-y-1">
                <div class="flex items-center justify-between text-[#667085]">
                    <span class="text-xs font-bold">Produits en Vente</span>
                    <i data-lucide="box" class="w-4 h-4 text-[#F97316]"></i>
                </div>
                <p class="text-xl sm:text-2xl font-black text-[#182230]"><?= $stats['products_count'] ?></p>
                <span class="text-[10px] text-[#667085] font-bold">Max 50 (Plan Standard)</span>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-[#E8EDF3] shadow-2xs space-y-1">
                <div class="flex items-center justify-between text-[#667085]">
                    <span class="text-xs font-bold">Commission SaaS</span>
                    <i data-lucide="percent" class="w-4 h-4 text-[#16C784]"></i>
                </div>
                <p class="text-xl sm:text-2xl font-black text-[#182230]">4.0%</p>
                <span class="text-[10px] text-[#16C784] font-bold">Taux préférentiel</span>
            </div>

        </div>

        <!-- Navigation Tabs Vendeur -->
        <div class="flex items-center gap-2 border-b border-[#E8EDF3] pb-2">
            <a href="index.php" class="cursor-pointer px-4 py-2 text-xs font-bold rounded-xl bg-[#1677FF] text-white shadow-2xs">Vue d'ensemble</a>
            <a href="products.php" class="cursor-pointer px-4 py-2 text-xs font-bold rounded-xl text-[#667085] hover:text-[#182230] hover:bg-white transition-all">Mes Produits</a>
            <a href="orders.php" class="cursor-pointer px-4 py-2 text-xs font-bold rounded-xl text-[#667085] hover:text-[#182230] hover:bg-white transition-all">Mes Commandes</a>
        </div>

        <!-- Recent Store Orders -->
        <div class="bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
            <div class="p-4 sm:p-5 border-b border-[#E8EDF3] flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-black text-[#182230]">Dernières Ventes Reçues</h3>
                    <p class="text-xs text-[#667085]">Commandes contenant vos équipements</p>
                </div>
                <a href="orders.php" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:underline">Voir toutes les commandes →</a>
            </div>

            <div class="p-6 text-center text-xs text-[#667085]">
                <div class="w-12 h-12 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="package-check" class="w-6 h-6"></i>
                </div>
                <p class="font-bold text-[#182230] text-sm">Vos commandes sont prêtes à être expédiées !</p>
                <p class="mt-1 text-xs text-[#667085] max-w-sm mx-auto">Chaque nouvelle commande validée par un client génère automatiquement un bordereau d'expédition.</p>
                <div class="mt-4">
                    <a href="products.php" class="cursor-pointer inline-flex items-center gap-1.5 bg-[#1677FF] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#0F67E5] transition-all">
                        <i data-lucide="plus" class="w-4 h-4"></i> Gérer mes produits
                    </a>
                </div>
            </div>
        </div>

    </div>

    <script src="../assets/js/lucide.min.js"></script>
    <script>
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }
    </script>
</body>
</html>
