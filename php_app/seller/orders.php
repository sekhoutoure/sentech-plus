<?php
require_once __DIR__ . '/../config/config.php';
$sellerUser = requireSeller();

if (!isLoggedIn()) {
    header('Location: ../login.php?redirect=seller/orders.php');
    exit;
}

$user = getCurrentUser();
$db = null;
$store = null;
$orders = [];

try {
    $db = getDBConnection();
    $stmt = $db->prepare("SELECT * FROM stores WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $store = $stmt->fetch();

    if ($store) {
        $stmtO = $db->prepare("SELECT DISTINCT o.*, 
                   COALESCE(NULLIF(TRIM(CONCAT(COALESCE(o.customer_first_name, ''), ' ', COALESCE(o.customer_last_name, ''))), ''), u.name, 'Client Dakar') as customer_name, 
                   COALESCE(o.customer_email, u.email) as customer_email, 
                   COALESCE(o.customer_phone, a.phone) as customer_phone, 
                   COALESCE(o.delivery_city, a.city, 'Dakar') as customer_city 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            LEFT JOIN addresses a ON o.address_id = a.id 
            LEFT JOIN order_items oi ON o.id = oi.order_id 
            LEFT JOIN products p ON oi.product_id = p.id 
            WHERE (o.store_id = :sid1 OR p.store_id = :sid2) 
            ORDER BY o.created_at DESC");
        $stmtO->execute([':sid1' => $store['id'], ':sid2' => $store['id']]);
        $orders = $stmtO->fetchAll();
    }
} catch (Exception $e) {
    $store = ['name' => 'Boutique Partenaire Dakar', 'username' => 'boutique-dakar'];
    $orders = [];
}

$pageTitle = "Commandes Reçues — Espace Vendeur";
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
    <style>body { font-family: 'Inter', system-ui, sans-serif; }</style>
</head>
<body class="h-full flex flex-col antialiased text-[#182230]">

    <header class="bg-white border-b border-[#E8EDF3] sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="index.php" class="flex items-center gap-2">
                <img src="../assets/images/sentech_logo.webp" alt="SenTechPLUS" width="140" height="32" class="h-7 w-auto object-contain">
            </a>
            <span class="text-xs font-extrabold px-2.5 py-1 bg-[#1677FF]/10 text-[#0B54C2] rounded-full uppercase tracking-wider">Espace Vendeur</span>
        </div>
        <div class="flex items-center gap-3">
            <a href="index.php" class="cursor-pointer text-xs font-bold text-[#667085] hover:text-[#182230] px-3 py-1.5 rounded-xl hover:bg-[#F3F7FC] transition-all">Tableau de bord</a>
        </div>
    </header>

    <div class="flex-1 max-w-[1280px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <div>
            <h1 class="text-2xl font-black tracking-tight text-[#182230]">Commandes Reçues (<?= count($orders) ?>)</h1>
            <p class="text-xs text-[#667085]">Suivez et préparez les commandes de vos clients pour la livraison express.</p>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr class="bg-[#F8FBFF] border-b border-[#E8EDF3] text-[#667085] uppercase tracking-wider font-bold">
                            <th class="p-4">Réf. Commande</th>
                            <th class="p-4">Client & Contact</th>
                            <th class="p-4">Destination</th>
                            <th class="p-4">Montant Total</th>
                            <th class="p-4">Paiement</th>
                            <th class="p-4">Statut</th>
                            <th class="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#E8EDF3]">
                        <?php foreach ($orders as $o): ?>
                            <tr class="hover:bg-[#F8FBFF]/60 transition-colors">
                                <td class="p-4 font-black text-[#182230]">
                                    #<?= htmlspecialchars($o['id']) ?>
                                    <span class="block text-[10px] text-[#667085] font-normal"><?= htmlspecialchars($o['created_at']) ?></span>
                                </td>
                                <td class="p-4">
                                    <p class="font-bold text-[#182230]"><?= htmlspecialchars($o['customer_name'] ?? 'Client Dakar') ?></p>
                                    <a href="https://wa.me/<?= preg_replace('/\D/', '', $o['customer_phone'] ?? '221781316497') ?>" target="_blank" class="text-[10px] font-bold text-[#0D7D53] hover:underline flex items-center gap-1 mt-0.5">
                                        <i data-lucide="message-circle" class="w-3 h-3 text-[#16C784]"></i>
                                        <?= htmlspecialchars($o['customer_phone'] ?? '+221 78 131 64 97') ?>
                                    </a>
                                </td>
                                <td class="p-4 text-[#667085] font-medium">
                                    <?= htmlspecialchars($o['customer_city'] ?? 'Dakar') ?>
                                </td>
                                <td class="p-4 font-extrabold text-[#182230]">
                                    <?= formatPrice($o['total']) ?>
                                </td>
                                <td class="p-4">
                                    <span class="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#1677FF]/10 text-[#0B54C2]">
                                        <?= htmlspecialchars($o['payment_method']) ?>
                                    </span>
                                </td>
                                <td class="p-4">
                                    <?php
                                    $statusMap = [
                                        'ORDER_PLACED' => ['bg' => 'bg-amber-50 text-amber-700', 'label' => 'En attente'],
                                        'PROCESSING'   => ['bg' => 'bg-blue-50 text-blue-700', 'label' => 'En préparation'],
                                        'SHIPPED'      => ['bg' => 'bg-purple-50 text-purple-700', 'label' => 'Expédiée'],
                                        'DELIVERED'    => ['bg' => 'bg-emerald-50 text-emerald-700', 'label' => 'Livrée ✓'],
                                        'CANCELLED'    => ['bg' => 'bg-rose-50 text-rose-700', 'label' => 'Annulée']
                                    ];
                                    $st = $statusMap[$o['status']] ?? $statusMap['ORDER_PLACED'];
                                    ?>
                                    <span class="px-2.5 py-1 rounded-full font-bold text-[10px] <?= $st['bg'] ?>">
                                        <?= $st['label'] ?>
                                    </span>
                                </td>
                                <td class="p-4 text-right">
                                    <a href="../invoice.php?id=<?= urlencode($o['order_number'] ?? $o['id']) ?>" target="_blank" class="cursor-pointer inline-flex items-center gap-1 bg-[#EAF3FF] hover:bg-[#1677FF] text-[#0B54C2] hover:text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors">
                                        <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                                        <span>Bordereau</span>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <script src="../assets/js/lucide.min.js"></script>
    <script>if (typeof lucide !== 'undefined') { lucide.createIcons(); }</script>
</body>
</html>
