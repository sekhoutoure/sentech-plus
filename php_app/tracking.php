<?php
require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();
$orderQuery = sanitize(trim($_GET['order_id'] ?? $_GET['q'] ?? ''));
$phoneQuery = sanitize(trim($_GET['phone'] ?? ''));
$order = null;
$error = '';

if ($orderQuery !== '' || $phoneQuery !== '') {
    // 1. Recherche en Base de Données MySQL
    if ($pdo) {
        try {
            if ($orderQuery !== '') {
                $cleanOrderNum = preg_replace('/^#/', '', $orderQuery);
                $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = :q1 OR order_number = :q2 OR order_number = :q3 LIMIT 1");
                $stmt->execute([':q1' => $orderQuery, ':q2' => $orderQuery, ':q3' => $cleanOrderNum]);
                $order = $stmt->fetch();
            } elseif ($phoneQuery !== '') {
                $cleanPhone = preg_replace('/[^0-9]/', '', $phoneQuery);
                $stmt = $pdo->prepare("SELECT * FROM orders WHERE phone LIKE :p ORDER BY created_at DESC LIMIT 1");
                $stmt->execute([':p' => '%' . $cleanPhone . '%']);
                $order = $stmt->fetch();
            }

            if ($order) {
                // Fetch items
                $stmtItems = $pdo->prepare("SELECT oi.*, p.name, p.image, p.price as current_price FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = :oid");
                $stmtItems->execute([':oid' => $order['id']]);
                $order['items'] = $stmtItems->fetchAll();
            }
        } catch (Throwable $e) {}
    }

    // 2. Recherche en Session (Commandes passées récemment)
    if (!$order && !empty($_SESSION['orders'])) {
        foreach ($_SESSION['orders'] as $sOrder) {
            $sId = $sOrder['id'] ?? '';
            $sNum = $sOrder['order_number'] ?? '';
            $sPhone = preg_replace('/[^0-9]/', '', $sOrder['phone'] ?? $sOrder['customer']['phone'] ?? '');

            if (($orderQuery && ($orderQuery === $sId || $orderQuery === $sNum || str_contains($sNum, $orderQuery))) ||
                ($phoneQuery && $sPhone && str_contains($sPhone, preg_replace('/[^0-9]/', '', $phoneQuery)))) {
                $order = $sOrder;
                break;
            }
        }
    }

    // 3. Fallback sur dernière commande en session
    if (!$order && !empty($_SESSION['last_order'])) {
        $lOrder = $_SESSION['last_order'];
        $lNum = $lOrder['order_number'] ?? $lOrder['id'] ?? '';
        if ($orderQuery && str_contains($lNum, preg_replace('/^#/', '', $orderQuery))) {
            $order = $lOrder;
        }
    }

    if (!$order) {
        $error = "Aucune commande trouvée pour « " . htmlspecialchars($orderQuery ?: $phoneQuery) . " ». Vérifiez votre numéro de commande (#ST-XXXXX) ou votre numéro de téléphone.";
    }
}

// Configuration des étapes de livraison
$statuses = [
    'pending' => [
        'step' => 1,
        'label' => 'Commande Reçue',
        'desc' => 'Votre commande a été enregistrée avec succès dans notre système.',
        'icon' => 'receipt',
        'color' => 'blue'
    ],
    'confirmed' => [
        'step' => 2,
        'label' => 'Validée & Confirmée',
        'desc' => 'Commande validée par notre équipe logistique Dakar.',
        'icon' => 'check-circle-2',
        'color' => 'blue'
    ],
    'processing' => [
        'step' => 3,
        'label' => 'En Préparation à l\'Entrepôt',
        'desc' => 'Articles prélevés, testés et emballés soigneusement.',
        'icon' => 'package',
        'color' => 'amber'
    ],
    'shipped' => [
        'step' => 4,
        'label' => 'Coursier en Route',
        'desc' => 'Le livreur express est en route vers votre adresse à Dakar.',
        'icon' => 'truck',
        'color' => 'purple'
    ],
    'delivered' => [
        'step' => 5,
        'label' => 'Livré & Réceptionné',
        'desc' => 'Colis remis en main propre. Merci de votre confiance !',
        'icon' => 'check-check',
        'color' => 'emerald'
    ]
];

$currentStatusKey = 'shipped'; // Par défaut pour démonstration vivante si en cours
if ($order) {
    $rawStatus = strtolower($order['order_status'] ?? $order['status'] ?? 'processing');
    if ($rawStatus === 'order_placed' || $rawStatus === 'pending') $currentStatusKey = 'confirmed';
    elseif ($rawStatus === 'processing') $currentStatusKey = 'processing';
    elseif ($rawStatus === 'shipped' || $rawStatus === 'in_transit') $currentStatusKey = 'shipped';
    elseif ($rawStatus === 'delivered') $currentStatusKey = 'delivered';
}

$pageTitle = "Suivi de Commande en Temps Réel — SenTechPLUS Dakar";
$metaDescription = "Suivez votre commande SenTechPLUS en temps réel : statut d'expédition, localisation du colis et estimation de livraison à Dakar et dans tout le Sénégal. Livraison express 2h disponible.";

$layoutType = 'public_compact';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<div id="main-content" class="min-h-screen bg-[#F3F7FC] py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-3 sm:px-6 space-y-6">

        <!-- En-tête de la Page -->
        <div class="text-center space-y-2 max-w-xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-xs font-black">
                <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                <span>Livraison Express Dakar & Sénégal</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">
                Suivi de Commande en Direct
            </h1>
            <p class="text-xs sm:text-sm text-[#64748B]">
                Entrez votre numéro de commande (ex: <strong>#ST-68696</strong>) ou votre numéro de téléphone pour suivre la position de votre colis.
            </p>
        </div>

        <!-- Formulaire de Recherche de Commande -->
        <div class="bg-white rounded-3xl p-4 sm:p-6 border border-[#E1E8F0] shadow-2xs">
            <form method="GET" action="tracking.php" class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <input type="text" 
                           name="order_id"
                           aria-label="Numéro de commande ou téléphone"
                           value="<?= htmlspecialchars($orderQuery ?: $phoneQuery) ?>" 
                           placeholder="Numéro de commande (ex: #ST-68696) ou Téléphone (77...)" 
                           required 
                           class="w-full bg-[#F4F7FB] border border-[#E8EDF3] focus:border-[#1677FF] focus:bg-white text-xs sm:text-sm font-bold p-3.5 pl-10 rounded-2xl text-[#182230] outline-none transition-all">
                    <i data-lucide="search" class="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                </div>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2">
                    <i data-lucide="radar" class="w-4 h-4"></i>
                    <span>Suivre mon colis</span>
                </button>
            </form>
        </div>

        <?php if ($error): ?>
            <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between shadow-2xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
                    <span><?= htmlspecialchars($error) ?></span>
                </div>
                <a href="contact.php" class="underline text-rose-900 ml-2 shrink-0">Besoin d'aide ?</a>
            </div>
        <?php endif; ?>

        <?php if ($order): 
            $orderNum = $order['order_number'] ?? $order['id'] ?? 'ST-000';
            $custName = trim(($order['first_name'] ?? '') . ' ' . ($order['last_name'] ?? '')) ?: ($order['customer_name'] ?? 'Client');
            $address = $order['address'] ?? ($order['shipping_address'] ?? 'Dakar, Sénégal');
            $city = $order['city'] ?? $order['region'] ?? 'Dakar';
            $phone = $order['phone'] ?? '';
            $totalAmount = (float)($order['total_amount'] ?? $order['total'] ?? 0);
            $createdAt = $order['created_at'] ?? date('Y-m-d H:i:s');
            $orderItems = $order['items'] ?? [];
        ?>
            <!-- ─── CARTE DÉTAILLÉE DU SUIVI ──────────────────────────────────────── -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-6 animate-fade-in">
                
                <!-- En-tête Commande -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8EDF3] gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-lg sm:text-xl font-black text-[#182230]">Commande #<?= htmlspecialchars($orderNum) ?></span>
                            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#EAF3FF] text-[#0B54C2] border border-blue-200">
                                <?= $statuses[$currentStatusKey]['label'] ?? 'En cours' ?>
                            </span>
                        </div>
                        <p class="text-xs text-[#64748B] mt-0.5">
                            Passée le <?= date('d/m/Y à H:i', strtotime($createdAt)) ?> • Client : <strong><?= htmlspecialchars($custName) ?></strong>
                        </p>
                    </div>

                    <a href="https://wa.me/<?= WHATSAPP_PHONE ?>?text=<?= rawurlencode("Bonjour SenTechPLUS, je souhaite des nouvelles de ma commande #" . $orderNum) ?>" target="_blank" rel="noopener" class="cursor-pointer inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 shrink-0">
                        <i data-lucide="message-circle" class="w-4 h-4"></i>
                        <span>Contacter le coursier</span>
                    </a>
                </div>

                <!-- ─── STEPPER VISUEL DYNAMIQUE DE LIVRAISON ────────────────── -->
                <div class="space-y-4">
                    <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider flex items-center gap-2">
                        <i data-lucide="truck" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Évolution de la livraison à Dakar</span>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <?php 
                        $stepOrder = ['confirmed', 'processing', 'shipped', 'delivered'];
                        $currentStepIndex = array_search($currentStatusKey, $stepOrder, true);
                        if ($currentStepIndex === false) $currentStepIndex = 1;

                        foreach ($stepOrder as $idx => $sKey):
                            $sInfo = $statuses[$sKey];
                            $isPassed = ($idx <= $currentStepIndex);
                            $isCurrent = ($idx === $currentStepIndex);
                        ?>
                            <div class="p-3.5 rounded-2xl border transition-all <?= $isCurrent ? 'bg-[#EAF3FF] border-[#1677FF] ring-2 ring-[#1677FF]/20 shadow-xs' : ($isPassed ? 'bg-[#F8FAFD] border-[#D0E2FF]' : 'bg-[#FAFCFF] border-[#E8EDF3] opacity-60') ?>">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black <?= $isPassed ? 'bg-[#1677FF] text-white' : 'bg-[#E8EDF3] text-[#64748B]' ?>">
                                        <?= $isPassed && !$isCurrent ? '✓' : ($idx + 1) ?>
                                    </span>
                                    <?php if ($isCurrent): ?>
                                        <span class="text-[9px] font-black uppercase text-[#1677FF] bg-white px-2 py-0.5 rounded-full animate-pulse">En cours</span>
                                    <?php endif; ?>
                                </div>
                                <h4 class="text-xs font-black text-[#182230] mb-0.5"><?= htmlspecialchars($sInfo['label']) ?></h4>
                                <p class="text-[10px] text-[#64748B] leading-tight"><?= htmlspecialchars($sInfo['desc']) ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- ─── INFOS DESTINATAIRE & ARTICLES ────────────────────────── -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-[#E8EDF3]">
                    
                    <!-- Adresse et Détails -->
                    <div class="md:col-span-5 space-y-3 bg-[#F8FAFD] p-4 rounded-2xl border border-[#E8EDF3] text-xs">
                        <h4 class="font-black text-[#182230] uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="navigation" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                            <span>Adresse de Livraison</span>
                        </h4>
                        <div class="space-y-1 text-[#475467]">
                            <p class="font-bold text-[#182230]"><?= htmlspecialchars($custName) ?></p>
                            <p><?= htmlspecialchars($address) ?></p>
                            <p><?= htmlspecialchars($city) ?>, Sénégal</p>
                            <?php if ($phone): ?>
                                <p class="font-semibold text-[#182230] pt-1">📞 <?= htmlspecialchars($phone) ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="pt-2 border-t border-[#E8EDF3] text-[11px] text-[#0D7D53] font-bold flex items-center gap-1">
                            <span>✓ Paiement à la livraison accepté</span>
                        </div>
                    </div>

                    <!-- Liste des Articles Commandés -->
                    <div class="md:col-span-7 space-y-3">
                        <h4 class="font-black text-[#182230] text-xs uppercase tracking-wider flex items-center justify-between">
                            <span>Articles commandés</span>
                            <span class="text-[#1677FF] font-extrabold text-sm"><?= formatPrice($totalAmount) ?></span>
                        </h4>

                        <div class="space-y-2">
                            <?php if (!empty($orderItems)): ?>
                                <?php foreach ($orderItems as $item): 
                                    $pName = $item['name'] ?? $item['product_name'] ?? 'Équipement High-Tech';
                                    $pImg = $item['image'] ?? 'assets/images/default_product.png';
                                    $pPrice = (float)($item['price'] ?? $item['unit_price'] ?? 0);
                                    $pQty = (int)($item['quantity'] ?? 1);
                                ?>
                                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFCFF] border border-[#E8EDF3]">
                                        <div class="flex items-center gap-3">
                                            <img src="<?= htmlspecialchars($pImg) ?>" alt="<?= htmlspecialchars($pName) ?>" width="40" height="40" style="aspect-ratio:1/1;" class="w-10 h-10 object-contain rounded-lg bg-white p-1 border border-[#E8EDF3]" loading="lazy">
                                            <div>
                                                <p class="text-xs font-bold text-[#182230] line-clamp-1"><?= htmlspecialchars($pName) ?></p>
                                                <p class="text-[10px] text-[#64748B]">Qté : <?= $pQty ?> × <?= formatPrice($pPrice) ?></p>
                                            </div>
                                        </div>
                                        <span class="text-xs font-black text-[#182230]"><?= formatPrice($pPrice * $pQty) ?></span>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="p-3 bg-[#FAFCFF] rounded-xl border border-[#E8EDF3] text-xs text-[#64748B]">
                                    Articles réservés en cours d'acheminement par coursier Dakar.
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                </div>

            </div>
        <?php else: ?>

            <!-- Carte Explicative quand aucune recherche n'est active -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div class="bg-white p-5 rounded-3xl border border-[#E1E8F0] shadow-2xs space-y-2 text-center">
                    <div class="w-10 h-10 rounded-2xl bg-blue-50 text-[#1677FF] flex items-center justify-center mx-auto">
                        <i data-lucide="zap" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-xs font-black text-[#182230]">Livraison 2h à Dakar</h3>
                    <p class="text-[11px] text-[#64748B]">Coursiers dédiés à moto sur Plateau, Almadies, Mermoz, Maristes et banlieue.</p>
                </div>
                <div class="bg-white p-5 rounded-3xl border border-[#E1E8F0] shadow-2xs space-y-2 text-center">
                    <div class="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0D7D53] flex items-center justify-center mx-auto">
                        <i data-lucide="shield-check" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-xs font-black text-[#182230]">Paiement à la Réception</h3>
                    <p class="text-[11px] text-[#64748B]">Inspectez votre matériel avant de payer par Wave, Orange Money ou Espèces.</p>
                </div>
                <div class="bg-white p-5 rounded-3xl border border-[#E1E8F0] shadow-2xs space-y-2 text-center">
                    <div class="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                        <i data-lucide="headphones" class="w-5 h-5"></i>
                    </div>
                    <h3 class="text-xs font-black text-[#182230]">Assistance WhatsApp 7j/7</h3>
                    <p class="text-[11px] text-[#64748B]">Notre support client reste joignable en permanence au +221 78 131 64 97.</p>
                </div>
            </div>

        <?php endif; ?>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
