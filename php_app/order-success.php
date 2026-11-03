<?php
require_once __DIR__ . '/config/config.php';

$orderId = sanitize($_GET['id'] ?? '');
$user = getCurrentUser();
$userId = $user['id'] ?? null;

$order = getOrderDetails($orderId, $userId);

if (!$order) {
    header('Location: shop.php');
    exit;
}

$pageTitle = "Commande Confirmée #" . htmlspecialchars($order['order_number'] ?? $order['id']) . " — SenTechPLUS";
$layoutType = 'public_compact';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<style>
@media print {
    /* Hide non-invoice elements */
    header, nav, footer, #header-container, #navbar-main, .screen-only, #back-to-top, .anim-drawer-overlay, .wa-float-btn {
        display: none !important;
    }
    body, html {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0 !important;
        margin: 0 !important;
        font-size: 12pt !important;
    }
    .print-invoice-card {
        border: 1px solid #d1d5db !important;
        box-shadow: none !important;
        padding: 24px !important;
        margin: 0 auto !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    .print-logo {
        filter: grayscale(1) !important;
    }
}
</style>

<div id="main-content" class="min-h-screen bg-[#F3F7FC] py-6 sm:py-10">
    <div class="max-w-3xl mx-auto px-3 sm:px-6 space-y-6">

        <!-- ─── CARTE SUCCÈS & FÉLICITATIONS (Écran uniquement) ──────────────── -->
        <div class="screen-only bg-white rounded-3xl p-6 sm:p-10 border border-[#E1E8F0] shadow-2xs text-center space-y-4">
            
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-[#0D7D53] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <i data-lucide="check" class="w-8 h-8 sm:w-10 sm:h-10"></i>
            </div>

            <div class="space-y-1">
                <span class="text-xs font-black text-[#1677FF] uppercase tracking-wider">Merci pour votre confiance</span>
                <h1 class="text-xl sm:text-2xl font-black text-[#182230]">Votre commande a été enregistrée avec succès !</h1>
                <p class="text-xs text-[#667085]">
                    Numéro de référence : <strong class="text-[#0B54C2] font-mono text-sm">#<?= htmlspecialchars($order['order_number'] ?? $order['id']) ?></strong>
                </p>
            </div>

            <!-- ─── REASSURANCE APPEL LIVREUR DAKAR (15 MIN) ────────────────── -->
            <div class="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-left flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <i data-lucide="phone-call" class="w-4 h-4"></i>
                </div>
                <div class="text-xs text-[#182230] space-y-0.5">
                    <p class="font-extrabold text-[#92400E]">Que se passe-t-il maintenant ?</p>
                    <p class="text-[#78350F] leading-relaxed">
                        Notre équipe logistique à Dakar vous contacte par téléphone dans les <strong>15 prochaines minutes</strong> pour confirmer l'adresse précise et envoyer votre coursier express. Gardez votre téléphone à proximité !
                    </p>
                </div>
            </div>

            <!-- ─── 4-STEP VISUAL DELIVERY PIPELINE ──────────────────────────── -->
            <div class="py-4 border-y border-[#E8EDF3] my-4">
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div class="space-y-1.5">
                        <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xs font-black shadow-xs">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold text-emerald-700 block">Confirmée</span>
                    </div>
                    <div class="space-y-1.5">
                        <div class="w-8 h-8 rounded-full bg-[#1677FF] text-white flex items-center justify-center mx-auto text-xs font-black shadow-xs animate-pulse">
                            <i data-lucide="package" class="w-4 h-4"></i>
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold text-[#1677FF] block">Préparation</span>
                    </div>
                    <div class="space-y-1.5 opacity-40">
                        <div class="w-8 h-8 rounded-full bg-[#E8EDF3] text-[#667085] flex items-center justify-center mx-auto text-xs font-bold">
                            <i data-lucide="truck" class="w-4 h-4"></i>
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold text-[#667085] block">En route</span>
                    </div>
                    <div class="space-y-1.5 opacity-40">
                        <div class="w-8 h-8 rounded-full bg-[#E8EDF3] text-[#667085] flex items-center justify-center mx-auto text-xs font-bold">
                            <i data-lucide="home" class="w-4 h-4"></i>
                        </div>
                        <span class="text-[10px] sm:text-xs font-bold text-[#667085] block">Livrée</span>
                    </div>
                </div>
            </div>

            <!-- ─── CODE PROMO EXCLUSIF PROCHAIN ACHAT ────────────────────────── -->
            <div class="p-4 bg-gradient-to-r from-[#EAF3FF] to-[#F0FDF4] rounded-2xl border border-blue-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-0.5">
                    <span class="text-[10px] font-black uppercase text-[#1677FF] tracking-wider block">🎁 Cadeau Fidélité SenTechPLUS</span>
                    <p class="text-xs font-bold text-[#182230]">Profitez de <strong>-10% de remise</strong> sur votre prochaine commande avec le code :</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-mono font-black text-sm px-3 py-1.5 bg-white border border-[#1677FF] text-[#1677FF] rounded-xl select-all">SENTECH-VIP10</span>
                </div>
            </div>

            <!-- ─── PARRAINAGE WHATSAPP (OFFREZ 2 000 FCFA) ───────────────────── -->
            <div class="p-4 bg-gradient-to-r from-[#F0FDF4] to-[#EAF3FF] rounded-2xl border border-emerald-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5 text-[#0D7D53] font-black text-[10px] uppercase tracking-wider">
                        <span>🤝 Parrainage Express</span>
                    </div>
                    <p class="text-xs font-bold text-[#182230]">Offrez <strong>2 000 FCFA</strong> à un proche pour sa 1ère commande</p>
                    <p class="text-[11px] text-[#475467]">Partagez SenTechPLUS sur WhatsApp, votre ami profite de la livraison express !</p>
                </div>
                <a href="https://wa.me/?text=<?= urlencode("Salut ! Je viens de commander sur SenTechPLUS (livraison express en moins de 2h à Dakar et produits 100% originaux). Découvre leur boutique ici : https://www.sentechplus.com/shop.php") ?>" target="_blank" rel="noopener" class="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0">
                    <i data-lucide="share-2" class="w-4 h-4"></i>
                    <span>Partager sur WhatsApp</span>
                </a>
            </div>

            <!-- Actions Rapides -->
            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button type="button" onclick="window.print()" class="cursor-pointer inline-flex items-center gap-2 bg-[#F3F7FC] hover:bg-[#EAF3FF] text-[#182230] hover:text-[#0B54C2] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#E8EDF3] transition-colors">
                    <i data-lucide="printer" class="w-4 h-4"></i>
                    <span>Imprimer la Facture</span>
                </button>
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20je%20suis%20le%20client%20<?= urlencode($order['customer_first_name']) ?>.%20Ma%20commande%20est%20la%20<?= urlencode($order['order_number'] ?? $order['id']) ?>." target="_blank" rel="noopener" class="cursor-pointer inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs">
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                    <span>Suivi Direct WhatsApp</span>
                </a>
            </div>

            <!-- Marketplace Invitation Card -->
            <div class="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center text-xs text-[#64748B] flex flex-wrap items-center justify-center gap-2">
                <span>Vous vendez du High-Tech au Sénégal ?</span>
                <a href="pricing.php" class="font-extrabold text-[#1677FF] hover:underline">Devenez vendeur certifié sur SenTechPLUS →</a>
            </div>

        </div>

        <!-- ─── REÇU / FACTURE OFFICIELLE PRINTABLE ───────────────────────────── -->
        <div class="print-invoice-card bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-6">
            
            <!-- En-tête Facture -->
            <div class="flex items-start justify-between gap-4 pb-4 border-b border-[#E8EDF3]">
                <div class="space-y-1">
                    <img src="assets/images/sentech_logo.webp" alt="SenTechPLUS" width="130" height="36" class="h-9 w-auto object-contain print-logo" loading="eager">
                    <p class="text-[10px] text-[#667085]">Équipements High-Tech & Accessoires Certifiés</p>
                    <p class="text-[10px] text-[#667085]">Avenue Cheikh Anta Diop, Dakar • Sénégal</p>
                    <p class="text-[10px] text-[#667085]">NINEA : 008945123 • RCCM : SN.DKR.2024.B.14890</p>
                </div>
                <div class="text-right space-y-1">
                    <span class="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0B54C2]">
                        Facture Reçue
                    </span>
                    <h2 class="text-sm font-mono font-extrabold text-[#182230]">#<?= htmlspecialchars($order['order_number'] ?? $order['id']) ?></h2>
                    <p class="text-[10px] text-[#667085]">Date : <?= date('d/m/Y à H:i', strtotime($order['created_at'] ?? 'now')) ?></p>
                </div>
            </div>

            <!-- Grille Informations Client & Livraison -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-1">
                    <span class="text-[10px] font-black text-[#1677FF] uppercase tracking-wider block">Facturé & Livré à :</span>
                    <p class="font-bold text-[#182230]"><?= htmlspecialchars(($order['customer_first_name'] ?? '') . ' ' . ($order['customer_last_name'] ?? '')) ?></p>
                    <p class="text-[#475467]"><?= htmlspecialchars($order['delivery_address'] ?? '') ?></p>
                    <p class="text-[#475467]"><?= htmlspecialchars($order['delivery_city'] ?? 'Dakar') ?> • Sénégal</p>
                    <p class="font-bold text-[#182230] pt-1">📞 <?= htmlspecialchars($order['customer_phone'] ?? '') ?></p>
                </div>

                <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-1">
                    <span class="text-[10px] font-black text-[#0D7D53] uppercase tracking-wider block">Modalités de Paiement :</span>
                    <p class="font-bold text-[#182230]">
                        <?= htmlspecialchars(($order['payment_method'] ?? 'cod') === 'cod' ? '💵 Paiement à la Livraison' : strtoupper($order['payment_method'] ?? 'WAVE')) ?>
                    </p>
                    <p class="text-[#475467]">Statut : <strong class="text-[#0D7D53]">Enregistrée & Confirmée</strong></p>
                    <p class="text-[#475467]">Délai estimé : <strong>2h à 4h chrono (Dakar)</strong></p>
                </div>
            </div>

            <!-- Tableau des Articles Commandés -->
            <div class="space-y-3 pt-2">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider pb-2 border-b border-[#E8EDF3]">
                    Détail des Articles
                </h3>

                <div class="divide-y divide-[#E8EDF3]">
                    <?php 
                    $items = $order['items'] ?? [];
                    foreach ($items as $it): 
                        $pname = $it['product_name_snapshot'] ?? ($it['product']['name'] ?? 'Produit');
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

            <!-- Récapitulatif Totaux -->
            <div class="space-y-2 text-xs pt-4 border-t border-[#E8EDF3]">
                <div class="flex justify-between text-[#475467]">
                    <span>Sous-total articles</span>
                    <span class="font-bold text-[#182230]"><?= formatPrice($order['subtotal'] ?? 0) ?></span>
                </div>

                <?php if ((float)($order['discount_total'] ?? 0) > 0): ?>
                    <div class="flex justify-between text-[#0D7D53] font-bold">
                        <span>Remise promotionnelle</span>
                        <span>- <?= formatPrice($order['discount_total']) ?></span>
                    </div>
                <?php endif; ?>

                <div class="flex justify-between text-[#475467]">
                    <span>Frais de livraison (Dakar / Régions)</span>
                    <span class="font-bold text-[#182230]"><?= formatPrice($order['delivery_fee'] ?? 0) ?></span>
                </div>

                <div class="flex justify-between items-center text-sm pt-3 border-t border-[#E8EDF3]">
                    <span class="font-black text-[#182230]">Montant Total TTC</span>
                    <span class="text-xl font-black text-[#0B54C2]"><?= formatPrice($order['total'] ?? $order['total_amount'] ?? 0) ?></span>
                </div>
            </div>

            <!-- Footer Facture (Print & Screen) -->
            <div class="pt-4 border-t border-[#E8EDF3] text-center space-y-1">
                <p class="text-[10px] font-bold text-[#182230]">Garantie Constructeur 12 Mois & Support Client 7j/7 au Sénégal</p>
                <p class="text-[9px] text-[#667085]">Pour toute question concernant votre colis : +221 78 131 64 97 • support@sentechplus.com</p>
            </div>

            <!-- Actions de navigation (Écran uniquement) -->
            <div class="screen-only pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8EDF3]">
                <a href="shop.php" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:underline">
                    ← Retourner à la boutique
                </a>
                <a href="orders.php" class="cursor-pointer inline-flex items-center gap-1.5 bg-[#182230] hover:bg-black text-white font-bold text-xs px-5 py-3 rounded-xl shadow-2xs transition-all">
                    <i data-lucide="package" class="w-4 h-4"></i>
                    <span>Voir toutes mes commandes</span>
                </a>
            </div>

        </div>

</div>

<!-- ─── CONFETTI CELEBRATION EFFECT (Micro-Victoire CRO) ────────────────── -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js" defer></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    function launchConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 75,
                spread: 60,
                origin: { y: 0.6 }
            });
            setTimeout(function() {
                confetti({
                    particleCount: 40,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 40,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 300);
        }
    }
    if (window.confetti) {
        launchConfetti();
    } else {
        window.addEventListener('load', launchConfetti);
    }
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
