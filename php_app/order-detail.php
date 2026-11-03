<?php
require_once __DIR__ . '/config/config.php';

if (!isLoggedIn()) {
    header('Location: login.php');
    exit;
}

$user = getCurrentUser();
$userId = $user['id'] ?? null;
$orderId = sanitize($_GET['id'] ?? '');

$order = getOrderDetails($orderId, $userId);

if (!$order) {
    header('Location: orders.php');
    exit;
}

$statuses = [
    'pending' => ['label' => 'Reçue', 'desc' => 'Votre commande a été enregistrée avec succès.'],
    'confirmed' => ['label' => 'Confirmée', 'desc' => 'Commande validée par l\'équipe SenTechPLUS.'],
    'processing' => ['label' => 'En préparation', 'desc' => 'Vos articles sont en cours d\'emballage soigné.'],
    'shipped' => ['label' => 'En livraison', 'desc' => 'Le livreur est en route vers votre adresse à Dakar.'],
    'delivered' => ['label' => 'Livrée', 'desc' => 'Colis remis en main propre. Merci pour votre achat !']
];

$currentStatus = $order['order_status'] ?? 'pending';
if ($order['status'] === 'DELIVERED') $currentStatus = 'delivered';

$statusKeys = array_keys($statuses);
$currentIndex = array_search($currentStatus, $statusKeys, true);
if ($currentIndex === false) $currentIndex = 0;

$pageTitle = "Suivi de Commande #" . htmlspecialchars($order['order_number'] ?? $order['id']) . " — SenTechPLUS";
$layoutType = 'public_compact';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<div id="main-content" class="min-h-screen bg-[#F3F7FC] py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-3 sm:px-6 space-y-6">

        <!-- Navigation Retour -->
        <div class="flex items-center justify-between">
            <a href="orders.php" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#1677FF] hover:text-[#0B54C2]">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>Retour à mes commandes</span>
            </a>
            <button type="button" onclick="window.print()" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#182230] hover:text-[#1677FF] bg-white px-3 py-1.5 rounded-xl border border-[#E8EDF3] shadow-2xs">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Imprimer</span>
            </button>
        </div>

        <!-- ─── CARTE PRINCIPALE DE COMMANDE ─────────────────────────────────── -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-6">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8EDF3] gap-3">
                <div>
                    <span class="text-[10px] font-black text-[#1677FF] uppercase tracking-wider block">Détails de la commande</span>
                    <h1 class="text-xl font-black text-[#182230]">N° <?= htmlspecialchars($order['order_number'] ?? $order['id']) ?></h1>
                    <span class="text-xs text-[#667085]">Effectuée le <?= date('d/m/Y à H:i', strtotime($order['created_at'])) ?></span>
                </div>
                <span class="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#0D7D53] border border-emerald-200 self-start sm:self-auto">
                    <?= htmlspecialchars($currentStatus === 'delivered' ? '✓ Livrée avec succès' : '🚚 ' . ($statuses[$currentStatus]['label'] ?? $currentStatus)) ?>
                </span>
            </div>

            <!-- ─── TIMELINE DE STATUT (PROGRESS BAR) ────────────────────────── -->
            <div class="py-4">
                <h2 class="text-xs font-black text-[#182230] uppercase tracking-wider mb-6">Évolution de la livraison</h2>
                
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <?php foreach ($statuses as $k => $step): 
                        $idx = array_search($k, $statusKeys, true);
                        $isPast = $idx <= $currentIndex;
                        $isCurrent = $idx === $currentIndex;
                    ?>
                        <div class="flex flex-col items-center text-center p-3 rounded-2xl border <?= $isCurrent ? 'bg-[#EAF3FF] border-[#1677FF]' : ($isPast ? 'bg-[#F8FBFF] border-emerald-200' : 'bg-[#F3F7FC] border-transparent opacity-50') ?>">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs mb-2 <?= $isCurrent ? 'bg-[#1677FF] text-white shadow-xs' : ($isPast ? 'bg-[#0D7D53] text-white' : 'bg-slate-300 text-slate-600') ?>">
                                <?= $isPast && !$isCurrent ? '✓' : ($idx + 1) ?>
                            </div>
                            <span class="text-xs font-bold text-[#182230] block"><?= htmlspecialchars($step['label']) ?></span>
                            <span class="text-[10px] text-[#667085] hidden sm:block mt-1"><?= htmlspecialchars($step['desc']) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- ─── LISTE DES ARTICLES ────────────────────────────────────────── -->
            <div class="space-y-4 pt-4 border-t border-[#E8EDF3]">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Articles de la commande</h3>
                <div class="divide-y divide-[#E8EDF3]">
                    <?php 
                    $items = $order['items'] ?? [];
                    foreach ($items as $it): 
                        $pname = $it['product_name_snapshot'] ?? ($it['product']['name'] ?? 'Article');
                        $pimg = $it['product_image_snapshot'] ?? getProductMainImage($it['product'] ?? null, 'assets/images/product_img4.webp');
                        $uprice = (float)($it['unit_price'] ?? 0);
                        $qty = (int)($it['quantity'] ?? 1);
                        $lineTotal = (float)($it['subtotal'] ?? ($uprice * $qty));
                    ?>
                        <div class="py-3 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3 min-w-0">
                                <img src="<?= htmlspecialchars($pimg) ?>" alt="img" width="48" height="48" style="aspect-ratio:1/1;" class="w-12 h-12 rounded-xl object-contain bg-[#F3F7FC] p-1 border border-[#E8EDF3] shrink-0" loading="lazy">
                                <div class="min-w-0">
                                    <h4 class="text-xs font-bold text-[#182230] truncate"><?= htmlspecialchars($pname) ?></h4>
                                    <span class="text-[10px] text-[#667085]"><?= $qty ?> × <?= formatPrice($uprice) ?></span>
                                </div>
                            </div>
                            <span class="text-xs font-black text-[#182230] shrink-0"><?= formatPrice($lineTotal) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- ─── INFORMATIONS DE LIVRAISON & TOTAL ────────────────────────── -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8EDF3] text-xs">
                
                <div class="p-4 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-1">
                    <span class="text-[10px] font-black text-[#1677FF] uppercase tracking-wider block">Lieu de Livraison</span>
                    <p class="font-bold text-[#182230]"><?= htmlspecialchars(trim(($order['customer_first_name'] ?? '') . ' ' . ($order['customer_last_name'] ?? '')) ?: 'Client Dakar') ?></p>
                    <p class="text-[#475467]"><?= htmlspecialchars($order['delivery_address']) ?></p>
                    <p class="text-[#475467]"><?= htmlspecialchars($order['delivery_city'] ?? 'Dakar') ?> • Sénégal</p>
                    <p class="font-bold text-[#182230] pt-1">📞 <?= htmlspecialchars($order['customer_phone']) ?></p>
                </div>

                <div class="p-4 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-2">
                    <span class="text-[10px] font-black text-[#0D7D53] uppercase tracking-wider block">Récapitulatif Financier</span>
                    <div class="space-y-1">
                        <div class="flex justify-between text-[#475467]">
                            <span>Sous-total articles :</span>
                            <span class="font-bold text-[#182230]"><?= formatPrice($order['subtotal']) ?></span>
                        </div>
                        <div class="flex justify-between text-[#475467]">
                            <span>Livraison :</span>
                            <span class="font-bold text-[#182230]"><?= formatPrice($order['delivery_fee']) ?></span>
                        </div>
                        <div class="flex justify-between items-center text-sm pt-2 border-t border-[#E8EDF3]">
                            <span class="font-black text-[#182230]">Total :</span>
                            <span class="font-black text-[#0B54C2]"><?= formatPrice($order['total'] ?? $order['total_amount']) ?></span>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
