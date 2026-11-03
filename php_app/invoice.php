<?php
/**
 * SenTechPLUS — Système de Facturation Pro & Reçus Officiels
 * Formats supportés : Visualisation Web, Impression A4 / PDF, Partage WhatsApp
 */
require_once __DIR__ . '/config/config.php';

$orderId = sanitize($_GET['id'] ?? '');
$user = getCurrentUser();
$userId = $user['id'] ?? null;

$order = null;
if (!empty($orderId)) {
    $order = getOrderDetails($orderId, $userId);
}

// Fallback pour les commandes de démonstration client
if (!$order) {
    if ($orderId === 'CMD-2026-9842' || empty($orderId)) {
        $order = [
            'id' => 'CMD-2026-9842',
            'order_number' => 'CMD-2026-9842',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 hours')),
            'customer_first_name' => explode(' ', $user['name'] ?? 'Moussa')[0] ?? 'Moussa',
            'customer_last_name' => explode(' ', $user['name'] ?? 'Diallo')[1] ?? 'Diallo',
            'customer_phone' => $user['phone'] ?? '+221 78 131 64 97',
            'customer_email' => $user['email'] ?? 'client@sentechplus.com',
            'delivery_address' => 'Rue MZ-12, Villa N° 45, Mermoz',
            'delivery_city' => 'Dakar',
            'payment_method' => 'Wave',
            'status' => 'DELIVERED',
            'subtotal' => 45000,
            'delivery_fee' => 0,
            'discount_total' => 0,
            'total_amount' => 45000,
            'items' => [
                [
                    'product_name_snapshot' => 'Casque Studio Pro Sans Fil ANC (Noir)',
                    'product_image_snapshot' => 'assets/images/product_img4.webp',
                    'quantity' => 1,
                    'unit_price' => 45000,
                    'subtotal' => 45000
                ]
            ]
        ];
    } elseif ($orderId === 'CMD-2026-9710') {
        $order = [
            'id' => 'CMD-2026-9710',
            'order_number' => 'CMD-2026-9710',
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 week')),
            'customer_first_name' => explode(' ', $user['name'] ?? 'Moussa')[0] ?? 'Moussa',
            'customer_last_name' => explode(' ', $user['name'] ?? 'Diallo')[1] ?? 'Diallo',
            'customer_phone' => $user['phone'] ?? '+221 78 131 64 97',
            'customer_email' => $user['email'] ?? 'client@sentechplus.com',
            'delivery_address' => 'Sacré-Cœur 3, Immeuble Horizon',
            'delivery_city' => 'Dakar',
            'payment_method' => 'Orange Money',
            'status' => 'DELIVERED',
            'subtotal' => 14000,
            'delivery_fee' => 0,
            'discount_total' => 0,
            'total_amount' => 14000,
            'items' => [
                [
                    'product_name_snapshot' => 'Chargeur Rapide GaN 65W Multi-Port Dual USB-C',
                    'product_image_snapshot' => 'assets/images/product_img7.webp',
                    'quantity' => 1,
                    'unit_price' => 14000,
                    'subtotal' => 14000
                ]
            ]
        ];
    } else {
        header('Location: account?tab=orders');
        exit;
    }
}

$invoiceNumber = 'FAC-' . preg_replace('/[^0-9]/', '', $order['order_number'] ?? $order['id'] ?? '202601');
if (strlen($invoiceNumber) < 8) $invoiceNumber = 'FAC-2026-' . substr(md5($order['id']), 0, 4);

$invoiceDate = !empty($order['created_at']) ? date('d/m/Y à H:i', strtotime($order['created_at'])) : date('d/m/Y');
$pageTitle = "Facture " . htmlspecialchars($invoiceNumber) . " — SenTechPLUS";

// Lien WhatsApp pour partager ou demander de l'aide sur la facture
$waInvoiceText = urlencode("Bonjour SenTechPLUS, je vous contacte concernant ma facture " . $invoiceNumber . " d'un montant de " . formatPrice($order['total_amount'] ?? $order['total'] ?? 0));
$waInvoiceLink = "https://wa.me/221781316497?text=" . $waInvoiceText;
?>
<!DOCTYPE html>
<html lang="fr" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    
    <link rel="preload" as="style" href="assets/css/tailwind.min.css" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="assets/css/tailwind.min.css"></noscript>
    <link rel="stylesheet" href="assets/css/tailwind.min.css">
    <script src="assets/js/lucide.min.js" defer></script>
    <style>
    @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
        .print\:shadow-none { box-shadow: none !important; }
    }
    </style>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
        
        @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; padding: 0 !important; color: #000 !important; }
            .invoice-box {
                box-shadow: none !important;
                border: 1px solid #e2e8f0 !important;
                padding: 24px !important;
                max-width: 100% !important;
                border-radius: 0 !important;
            }
        }
    </style>
</head>
<body class="bg-[#F1F5F9] text-[#0F172A] min-h-screen py-4 sm:py-10 px-3 sm:px-6">

    <div class="max-w-3xl mx-auto space-y-4">

        <!-- ═══════════════ BARRE D'ACTIONS (ÉCRAN UNIQUEMENT) ═══════════════ -->
        <div class="no-print flex items-center justify-between flex-wrap gap-2.5 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <a href="account?tab=orders" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0B54C2] transition-colors">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>Mon Espace Client</span>
            </a>

            <div class="flex items-center gap-2">
                <!-- Partager WhatsApp -->
                <a href="<?= $waInvoiceLink ?>" target="_blank" rel="noopener" class="cursor-pointer inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#065F46] font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-200/80 transition-colors">
                    <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                    <span>Reçu WhatsApp</span>
                </a>

                <!-- Bouton Imprimer / PDF -->
                <button type="button" onclick="window.print()" class="cursor-pointer inline-flex items-center gap-1.5 bg-[#0B54C2] hover:bg-[#08439B] text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95">
                    <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                    <span>Imprimer / PDF</span>
                </button>
            </div>
        </div>

        <!-- ═══════════════ FACTURE OFFICIELLE (PRINTABLE) ═══════════════ -->
        <div class="invoice-box bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
            
            <!-- 1. En-tête Facture & Société -->
            <div class="flex items-start justify-between flex-wrap gap-4 pb-6 border-b border-slate-100">
                <div class="space-y-1">
                    <img src="assets/images/sentech_logo.webp" alt="Logo Officiel SenTechPLUS" width="240" height="47" style="aspect-ratio: 240 / 47;" class="h-9 w-auto object-contain" loading="eager">
                    <p class="text-xs font-bold text-[#0F172A] pt-1">SenTechPLUS S.U.A.R.L</p>
                    <p class="text-[11px] text-[#64748B]">High-Tech & Accessoires Certifiés au Sénégal</p>
                    <p class="text-[11px] text-[#64748B]">Avenue Cheikh Anta Diop, Dakar • Sénégal</p>
                    <p class="text-[10px] text-[#94A3B8]">NINEA : 008945123 • RCCM : SN.DKR.2024.B.14890</p>
                </div>

                <div class="text-right space-y-1">
                    <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0B54C2] border border-blue-200/60">
                        Facture Acquittée
                    </span>
                    <h1 class="text-base sm:text-lg font-mono font-black text-[#0F172A] tracking-tight">
                        #<?= htmlspecialchars($invoiceNumber) ?>
                    </h1>
                    <p class="text-xs text-[#64748B]">Réf. Commande : <strong>#<?= htmlspecialchars($order['order_number'] ?? $order['id']) ?></strong></p>
                    <p class="text-[11px] text-[#64748B]">Date : <?= htmlspecialchars($invoiceDate) ?></p>
                </div>
            </div>

            <!-- 2. Informations Client & Paiement -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 space-y-1">
                    <span class="text-[10px] font-black text-[#0B54C2] uppercase tracking-wider block">Client / Facturé à :</span>
                    <p class="font-black text-sm text-[#0F172A]">
                        <?= htmlspecialchars(trim(($order['customer_first_name'] ?? '') . ' ' . ($order['customer_last_name'] ?? '')) ?: ($user['name'] ?? 'Client')) ?>
                    </p>
                    <p class="text-[#475467]"><?= htmlspecialchars($order['delivery_address'] ?? 'Dakar, Sénégal') ?></p>
                    <p class="text-[#475467]"><?= htmlspecialchars($order['delivery_city'] ?? 'Dakar') ?> • Sénégal</p>
                    <p class="font-bold text-[#0F172A] pt-0.5">📞 <?= htmlspecialchars($order['customer_phone'] ?? $user['phone'] ?? '') ?></p>
                </div>

                <div class="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 space-y-1">
                    <span class="text-[10px] font-black text-[#065F46] uppercase tracking-wider block">Mode de Règlement :</span>
                    <p class="font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                        <span><?= htmlspecialchars(strtoupper($order['payment_method'] ?? 'WAVE')) ?></span>
                        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    </p>
                    <p class="text-[#475467]">Statut de paiement : <strong class="text-[#065F46]">Payé & Confirmé</strong></p>
                    <p class="text-[#475467]">Mode de livraison : <strong>Express Dakar (1h - 3h)</strong></p>
                </div>
            </div>

            <!-- 3. Tableau des Articles -->
            <div class="space-y-2">
                <div class="border-b border-slate-200 pb-2 text-[10px] font-black text-[#64748B] uppercase tracking-wider flex items-center justify-between">
                    <span>Désignation de l'article</span>
                    <div class="flex items-center gap-8 text-right">
                        <span class="hidden sm:inline">Qté</span>
                        <span class="hidden sm:inline">P.U</span>
                        <span>Total TTC</span>
                    </div>
                </div>

                <div class="divide-y divide-slate-100">
                    <?php 
                    $items = $order['items'] ?? [];
                    foreach ($items as $it): 
                        $pname = $it['product_name_snapshot'] ?? ($it['product']['name'] ?? 'Accessoire High-Tech');
                        $pimg = $it['product_image_snapshot'] ?? 'assets/images/product_img4.webp';
                        $uprice = (float)($it['unit_price'] ?? 0);
                        $qty = (int)($it['quantity'] ?? 1);
                        $lineTotal = (float)($it['subtotal'] ?? ($uprice * $qty));
                    ?>
                        <div class="py-3 flex items-center justify-between gap-4 text-xs">
                            <div class="flex items-center gap-3 min-w-0">
                                <img src="<?= htmlspecialchars($pimg) ?>" alt="Produit" width="44" height="44" class="w-11 h-11 rounded-xl bg-slate-50 object-contain p-1 border border-slate-100 shrink-0">
                                <div class="min-w-0">
                                    <h2 class="font-bold text-xs text-[#0F172A] truncate"><?= htmlspecialchars($pname) ?></h2>
                                    <span class="text-[11px] text-[#64748B] sm:hidden"><?= $qty ?> × <?= formatPrice($uprice) ?></span>
                                </div>
                            </div>

                            <div class="flex items-center gap-8 text-right shrink-0">
                                <span class="text-xs text-[#64748B] hidden sm:inline"><?= $qty ?></span>
                                <span class="text-xs text-[#64748B] hidden sm:inline"><?= formatPrice($uprice) ?></span>
                                <span class="text-xs font-black text-[#0F172A]"><?= formatPrice($lineTotal) ?></span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- 4. Totaux & Calcul TTC -->
            <div class="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div class="flex justify-between text-[#64748B]">
                    <span>Sous-total articles</span>
                    <span class="font-bold text-[#0F172A]"><?= formatPrice($order['subtotal'] ?? $order['total_amount'] ?? 0) ?></span>
                </div>

                <?php if ((float)($order['discount_total'] ?? 0) > 0): ?>
                    <div class="flex justify-between text-[#065F46] font-bold">
                        <span>Remise commerciale</span>
                        <span>- <?= formatPrice($order['discount_total']) ?></span>
                    </div>
                <?php endif; ?>

                <div class="flex justify-between text-[#64748B]">
                    <span>Frais de livraison (Dakar)</span>
                    <span class="font-bold text-[#0F172A]"><?= (float)($order['delivery_fee'] ?? 0) > 0 ? formatPrice($order['delivery_fee']) : 'Gratuit' ?></span>
                </div>

                <div class="flex justify-between items-center text-sm sm:text-base pt-3 border-t border-slate-200">
                    <span class="font-black text-[#0F172A]">Total Net à Payer (TTC)</span>
                    <span class="text-lg sm:text-xl font-black text-[#0B54C2]"><?= formatPrice($order['total_amount'] ?? $order['total'] ?? 0) ?></span>
                </div>
            </div>

            <!-- 5. Pied de Facture Officiel -->
            <div class="pt-6 border-t border-slate-100 text-center space-y-1 text-[10px] text-[#64748B]">
                <p class="font-bold text-[#0F172A]">Garantie Constructeur & Service Après-Vente 7j/7 au Sénégal</p>
                <p>Support Client : <strong>+221 78 131 64 97</strong> • Email : <strong>support@sentechplus.com</strong></p>
                <p class="text-[9px] text-[#94A3B8] pt-1">Facture électronique émise conformément aux dispositions commerciales en vigueur au Sénégal.</p>
            </div>

        </div>

    </div>

    <script>
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    </script>
</body>
</html>
