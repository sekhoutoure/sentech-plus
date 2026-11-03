<?php
require_once __DIR__ . '/config/config.php';

if (!isLoggedIn()) {
    header('Location: login.php?redirect=orders.php');
    exit;
}

$pdo = getDBConnection();
$user = getCurrentUser();
$orders = [];

if ($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT o.*, s.name as store_name, a.street, a.city, a.phone 
                               FROM orders o 
                               LEFT JOIN stores s ON o.store_id = s.id 
                               LEFT JOIN addresses a ON o.address_id = a.id 
                               WHERE o.user_id = :uid 
                               ORDER BY o.created_at DESC");
        $stmt->execute([':uid' => $user['id'] ?? '']);
        $orders = $stmt->fetchAll();
    } catch (Throwable $e) {
        $orders = [];
    }
}

if (empty($orders) && !empty($_SESSION['last_placed_order'])) {
    $orders = [$_SESSION['last_placed_order']];
}

$orderCount = count($orders);

$pageTitle = "Mes Commandes";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-8 flex-1 space-y-6">

    <!-- Breadcrumbs Navigation -->
    <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#667085] flex items-center gap-1.5">
        <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
        <span class="text-[#98A2B3]">/</span>
        <span class="text-[#182230] font-bold" aria-current="page">Mes Commandes</span>
    </nav>

    <div class="flex items-center justify-between gap-4">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#182230] tracking-tight">Mes Commandes (<?= $orderCount ?>)</h1>
        <a href="shop.php" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:text-[#0B54C2] transition-colors duration-200 hover:underline">Continuer mes achats →</a>
    </div>

    <?php if (isset($_GET['success']) && $_GET['success'] == '1'): ?>
        <div class="p-4 rounded-xl text-xs font-bold bg-[#EAF3FF] text-[#0B54C2] border border-[#1677FF]/20 flex items-center gap-2">
            <i data-lucide="check-circle-2" class="w-5 h-5"></i>
            <span>🎉 Félicitations ! Votre commande a été enregistrée avec succès.</span>
        </div>
    <?php endif; ?>

    <?php if (empty($orders)): ?>
        <div class="card-clean p-12 text-center space-y-3">
            <div class="w-16 h-16 bg-[#F3F7FC] text-[#667085] rounded-full flex items-center justify-center mx-auto">
                <i data-lucide="package" class="w-8 h-8"></i>
            </div>
            <h2 class="text-lg font-bold text-[#182230]">Vous n'avez pas encore passé de commande</h2>
            <p class="text-xs text-[#667085]">Consultez notre catalogue pour commander vos équipements High-Tech.</p>
            <a href="shop.php" class="cursor-pointer btn-electric inline-block mt-2 transition-colors duration-200">Voir la Boutique</a>
        </div>
    <?php else: ?>

        <div class="space-y-4">
            <?php foreach ($orders as $ord): 
                $stmtItems = $pdo->prepare("SELECT oi.*, p.name as product_name, p.images 
                                           FROM order_items oi 
                                           JOIN products p ON oi.product_id = p.id 
                                           WHERE oi.order_id = :oid");
                $stmtItems->execute([':oid' => $ord['id']]);
                $items = $stmtItems->fetchAll();

                $statusColor = 'bg-blue-100 text-[#0B54C2]';
                $statusLabel = 'Enregistrée';
                $status = $ord['status'];
                if ($status === 'ORDER_PLACED' || $status === 'PENDING' || $status === 'PROCESSING') {
                    $statusColor = 'bg-blue-100 text-[#0B54C2]';
                    $statusLabel = 'Commande Reçue';
                } elseif ($status === 'SHIPPED') {
                    $statusColor = 'bg-orange-100 text-[#C2410C]';
                    $statusLabel = 'Expédiée';
                } elseif ($status === 'DELIVERED') {
                    $statusColor = 'bg-emerald-100 text-[#0D7D53]';
                    $statusLabel = 'Livrée';
                } elseif ($status === 'CANCELLED') {
                    $statusColor = 'bg-red-100 text-red-600';
                    $statusLabel = 'Annulée';
                }
            ?>
                <div class="card-clean p-5 space-y-4">
                    
                    <!-- Header -->
                    <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8EDF3] text-xs">
                        <div>
                            <span class="text-[#667085]">N° de Commande :</span>
                            <span class="font-extrabold text-[#182230] font-mono">#<?= htmlspecialchars($ord['id']) ?></span>
                            <span class="text-[#667085] ml-2">• <?= date('d/m/Y à H:i', strtotime($ord['created_at'])) ?></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider <?= $statusColor ?>">
                                <?= $statusLabel ?>
                            </span>
                        </div>
                    </div>

                    <!-- Live Order Progress Timeline -->
                    <?php if ($status !== 'CANCELLED'): 
                        $currentStep = 1;
                        if ($status === 'PROCESSING') $currentStep = 2;
                        elseif ($status === 'SHIPPED') $currentStep = 3;
                        elseif ($status === 'DELIVERED') $currentStep = 4;
                        $progressPercent = min(100, ($currentStep - 1) * 33.33);

                        $timelineSteps = [
                            ['label' => 'Reçue', 'desc' => 'Enregistrée'],
                            ['label' => 'Préparation', 'desc' => 'En cours'],
                            ['label' => 'En Livraison', 'desc' => 'Livreur Dakar'],
                            ['label' => 'Livrée', 'desc' => 'Remis en main']
                        ];
                    ?>
                    <div class="py-3 px-2 sm:px-4 bg-[#F3F7FC] rounded-2xl border border-[#E8EDF3]">
                        <div class="relative flex items-center justify-between w-full">
                            <!-- Background line -->
                            <div class="absolute left-6 right-6 top-4 -translate-y-1/2 h-1 bg-[#E8EDF3] z-0"></div>
                            <!-- Active line -->
                            <div class="absolute left-6 top-4 -translate-y-1/2 h-1 bg-[#1677FF] transition-all duration-500 z-0" style="width: calc(<?= $progressPercent ?>% * (100% - 48px) / 100);"></div>

                            <?php foreach ($timelineSteps as $idx => $st): 
                                $stepNum = $idx + 1;
                                $isDone = ($currentStep >= $stepNum);
                                $isActive = ($currentStep === $stepNum);
                            ?>
                                <div class="relative z-10 flex flex-col items-center">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs <?= $isDone ? 'bg-[#1677FF] text-white ring-4 ring-[#1677FF]/20' : 'bg-white border-2 border-[#E8EDF3] text-[#667085]' ?>">
                                        <?php if ($isDone): ?>
                                            <i data-lucide="check" class="w-4 h-4 stroke-[3]"></i>
                                        <?php else: ?>
                                            <span><?= $stepNum ?></span>
                                        <?php endif; ?>
                                    </div>
                                    <span class="text-[10px] sm:text-xs font-extrabold mt-1.5 text-center <?= $isActive ? 'text-[#1677FF]' : ($isDone ? 'text-[#182230]' : 'text-[#667085]') ?>">
                                        <?= $st['label'] ?>
                                    </span>
                                    <span class="text-[9px] text-[#667085] hidden sm:block">
                                        <?= $st['desc'] ?>
                                    </span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endif; ?>

                    <!-- Body: Items -->
                    <div class="space-y-3">
                        <?php foreach ($items as $it): 
                            $imgs = getProductImages($it['images'] ?? null, 'assets/images/product_img1.webp');
                        ?>
                            <div class="flex items-center gap-4 text-xs">
                                <img src="<?= htmlspecialchars($imgs[0]) ?>" width="48" height="48" style="aspect-ratio:1/1;" class="w-12 h-12 object-contain bg-[#F3F7FC] rounded-xl p-1 border border-[#E8EDF3]" alt="Item" loading="lazy">
                                <div>
                                    <h4 class="font-bold text-[#182230]"><?= htmlspecialchars($it['product_name']) ?></h4>
                                    <span class="text-[#667085]">Qté : <?= $it['quantity'] ?></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- Footer -->
                    <div class="pt-3 border-t border-[#E8EDF3] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="text-[#667085]">Total :</span>
                            <span class="text-base font-black text-[#1677FF]"><?= formatPrice($ord['total']) ?></span>
                        </div>
                        <a href="order-success.php?id=<?= $ord['id'] ?>" class="cursor-pointer btn-electric py-2 px-4 focus:ring-2 focus:ring-white transition-colors duration-200">
                            Voir la Facture
                        </a>
                    </div>

                </div>
            <?php endforeach; ?>
        </div>

    <?php endif; ?>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
