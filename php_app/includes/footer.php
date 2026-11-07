<?php
// Dynamic settings with clean fallbacks
$storeName = getSiteSetting('site_name', 'SenTechPLUS');
$storeLogo = getSiteSetting('site_logo', 'assets/images/sentech_logo.webp');
$storePhone = getSiteSetting('support_phone', defined('WHATSAPP_DISPLAY') ? WHATSAPP_DISPLAY : '+221 78 131 64 97');
$storeWa = getSiteSetting('whatsapp_number', defined('WHATSAPP_PHONE') ? WHATSAPP_PHONE : '221781316497');
$storeEmail = getSiteSetting('support_email', 'contact@sentechplus.com');
$storeAddress = getSiteSetting('store_address', 'Dakar, Sénégal');
$footerCartCount = getCartCount();
$footerWishCount = count(getWishlistItems());
$currPage = basename($_SERVER['PHP_SELF']);

// Layout detection
if (!isset($layoutType)) {
    if (in_array($currPage, ['login.php', 'register.php', 'forgot-password.php', 'reset-password.php'])) {
        $layoutType = 'auth';
    } elseif (in_array($currPage, ['checkout.php'])) {
        $layoutType = 'checkout';
    
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

// Blank & Admin : aucun footer public
if ($layoutType === 'blank' || $layoutType === 'admin') {
    return;
}
?>

<!-- Modals & Drawers Includes (Panier, QuickView, Omnibar Ask & Get) -->
<?php if ($layoutType === 'public_full' || $layoutType === 'public_compact' || $layoutType === 'checkout'): ?>
    <?php require_once __DIR__ . '/cart_drawer.php'; ?>
    <?php require_once __DIR__ . '/quick_view_modal.php'; ?>
    <?php require_once __DIR__ . '/omnibar.php'; ?>
<?php endif; ?>

<?php
// ─── 1. FOOTER AUTH (Login / Register minimal) ──────────────────────────────
if ($layoutType === 'auth'): ?>
    <footer class="bg-transparent py-8 text-center text-xs text-[#667085] space-y-2">
        <p>© <?= date('Y') ?> <strong><?= htmlspecialchars($storeName) ?></strong>. Tous droits réservés.</p>
        <div class="flex items-center justify-center gap-3 text-xs">
            <a href="contact.php#cgu" class="hover:text-[#1677FF]">Conditions Générales</a>
            <span>•</span>
            <a href="contact.php#privacy" class="hover:text-[#1677FF]">Confidentialité</a>
            <span>•</span>
            <a href="contact.php" class="hover:text-[#1677FF]">Assistance</a>
        </div>
    </footer>
    <script src="assets/js/app.min.js?v=3.9" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    </script>
    </body>
    </html>
<?php return; endif; ?>

<?php
// ─── 2. FOOTER CHECKOUT (Tunnel de commande sans distractions & sans bottom nav) ──
if ($layoutType === 'checkout'): ?>
    <footer class="bg-white border-t border-[#E8EDF3] py-8 mt-12 text-xs text-[#667085]">
        <div class="max-w-[1200px] mx-auto px-4 space-y-4 text-center">
            
            <!-- Reassurance Pills Checkout -->
            <div class="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#182230]">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1677FF]/10 text-[#0B54C2]">
                    <i data-lucide="smartphone" class="w-3.5 h-3.5"></i> Wave & Orange Money
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#0D7D53]">
                    <i data-lucide="banknote" class="w-3.5 h-3.5"></i> Paiement à la réception Dakar
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-[#0B54C2]">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Matériel 100% Neuf & Garanti
                </span>
            </div>

            <p>© <?= date('Y') ?> <strong><?= htmlspecialchars($storeName) ?></strong>. Transactions protégées & certifiées au Sénégal 🇸🇳</p>
            
            <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] leading-relaxed">
                <a href="contact.php#cgu" class="hover:text-[#1677FF]">CGU & Vente</a>
                <span class="text-slate-300">•</span>
                <a href="contact.php#delivery" class="hover:text-[#1677FF]">Politique de Livraison</a>
                <span class="text-slate-300">•</span>
                <a href="https://wa.me/<?= htmlspecialchars($storeWa) ?>" target="_blank" rel="noopener noreferrer" class="hover:text-[#0D7D53] font-bold inline-flex items-center gap-1">
                    <i data-lucide="message-circle" class="w-3.5 h-3.5 text-[#0D7D53]"></i>
                    <span>Aide WhatsApp : <?= htmlspecialchars($storePhone) ?></span>
                </a>
            </div>

        </div>
    </footer>
    <script src="assets/js/app.min.js?v=3.9" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    </script>
    </body>
    </html>
<?php return; endif; ?>

<?php
// ─── 2.5. FOOTER COMPACT (Fiche Produit / Panier — Épuré & Sans Gros Annuaire) ─
if ($layoutType === 'public_compact'): ?>
<footer class="bg-white text-[#182230] border-t border-slate-200/60 mt-10 py-8 pb-24 md:pb-8 relative z-10">
    <div class="max-w-[1200px] mx-auto px-4 text-center space-y-3 text-xs text-[#64748B]">
        <!-- Micro Réassurance -->
        <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#182230]">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1677FF]/10 text-[#0B54C2]">
                <i data-lucide="smartphone" class="w-3.5 h-3.5"></i> Wave & Orange Money
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D7D53]">
                <i data-lucide="truck" class="w-3.5 h-3.5"></i> Livraison Express Dakar 2h-4h
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0B54C2]">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Garantie 100% Original
            </span>
        </div>

        <p>© <?= date('Y') ?> <strong><?= htmlspecialchars($storeName) ?></strong>. Matériel High-Tech certifié au Sénégal 🇸🇳</p>
        
        <div class="flex items-center justify-center gap-3 text-[11px] text-[#64748B]">
            <a href="contact.php#cgu" class="hover:text-[#1677FF]">Conditions Générales</a>
            <span>•</span>
            <a href="contact.php" class="hover:text-[#1677FF]">Assistance Client</a>
            <span>•</span>
            <a href="https://wa.me/<?= htmlspecialchars($storeWa) ?>" target="_blank" rel="noopener noreferrer" class="hover:text-[#0D7D53] font-bold inline-flex items-center gap-1 text-[#0D7D53]">
                <i data-lucide="message-circle" class="w-3 h-3"></i> WhatsApp : <?= htmlspecialchars($storePhone) ?>
            </a>
        </div>
    </div>
</footer>
<?php else: ?>
<!-- ─── 3. FOOTER PUBLIC FULL (Accueil & Boutique Principale) ────────────────── -->
<footer class="bg-white text-[#182230] border-t border-[#E8EDF3] mt-12 pb-24 lg:pb-8 relative z-10">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        
        <!-- ─── DESKTOP FOOTER GRID (5 Colonnes Parfaitement Équilibrées) ─── -->
        <div class="hidden lg:grid" style="grid-template-columns: 2.2fr 1.1fr 1.1fr 1.3fr 1.5fr; gap: 32px;">
            
            <!-- Col 1: Marque & Présentation -->
            <div class="space-y-4 pr-4">
                <a href="index.php" class="inline-block transition-transform hover:scale-[1.01]">
                    <img src="<?= htmlspecialchars($storeLogo) ?>" alt="<?= htmlspecialchars($storeName) ?>" width="160" height="36" decoding="async" loading="lazy" style="width:160px; height:36px; aspect-ratio:160/36; object-fit:contain;" class="object-contain">
                </a>
                <p class="text-xs text-[#667085] leading-relaxed">
                    Votre boutique en ligne de référence pour les accessoires High-Tech au Sénégal. Matériel certifié, garantie constructeur et livraison express sécurisée à Dakar et dans toutes les régions.
                </p>
                <div class="pt-1">
                    <a href="https://wa.me/<?= htmlspecialchars($storeWa) ?>?text=Bonjour%20<?= urlencode($storeName) ?>%20!%20J'ai%20besoin%20d'informations." target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#085237] border border-[#25D366]/30 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs">
                        <i data-lucide="message-circle" class="w-4 h-4 text-[#0D7D53]"></i>
                        <span>Support WhatsApp Dakar</span>
                    </a>
                </div>
            </div>

            <!-- Col 2: Navigation -->
            <div class="space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Navigation</h3>
                <ul class="space-y-2 text-xs font-semibold text-[#667085]">
                    <li><a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a></li>
                    <li><a href="shop.php" class="hover:text-[#1677FF] transition-colors">Boutique High-Tech</a></li>
                    <li><a href="about.php" class="hover:text-[#1677FF] transition-colors">À Propos de Nous</a></li>
                    <li><a href="contact.php" class="hover:text-[#1677FF] transition-colors">Contact & Support</a></li>
                    <li><a href="about.php#garantie" class="hover:text-[#1677FF] transition-colors">Garantie 12 Mois & RMA</a></li>
                    <li><a href="tracking.php" class="hover:text-[#1677FF] transition-colors">Suivi de Colis en Direct</a></li>
                </ul>
            </div>

            <!-- Col 3: Catégories Clés (Dynamiques depuis MySQL) -->
            <div class="space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Rayons</h3>
                <ul class="space-y-2 text-xs font-semibold text-[#667085]">
                    <?php 
                    $footerCats = array_slice($categoriesTree ?? getAllCategoriesTree(), 0, 5);
                    foreach ($footerCats as $fCat): ?>
                        <li><a href="shop.php?category=<?= urlencode($fCat['slug']) ?>" class="hover:text-[#1677FF] transition-colors"><?= htmlspecialchars($fCat['name']) ?></a></li>
                    <?php endforeach; ?>
                    <li><a href="shop.php?collection=flash" class="hover:text-[#C2410C] text-[#C2410C] font-bold transition-colors">⚡ Ventes Flash</a></li>
                </ul>
            </div>

            <!-- Col 4: Paiements & Confiance -->
            <div class="space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Paiements</h3>
                <div class="flex flex-col gap-1.5 text-xs font-bold">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1677FF]/10 text-[#0B54C2] border border-[#1677FF]/20 w-fit">
                        <i data-lucide="smartphone" class="w-3.5 h-3.5"></i> Wave
                    </span>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9A3412]/10 text-[#9A3412] border border-[#9A3412]/20 w-fit">
                        <i data-lucide="smartphone" class="w-3.5 h-3.5"></i> Orange Money
                    </span>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#085237]/10 text-[#085237] border border-[#085237]/20 w-fit">
                        <i data-lucide="banknote" class="w-3.5 h-3.5"></i> À la livraison
                    </span>
                </div>
                <div class="pt-2 space-y-1.5 text-xs text-[#667085]">
                    <div class="flex items-center gap-2 whitespace-nowrap">
                        <i data-lucide="shield-check" class="w-4 h-4 text-[#0D7D53] shrink-0"></i>
                        <span>100% Produits originaux</span>
                    </div>
                    <div class="flex items-center gap-2 whitespace-nowrap">
                        <i data-lucide="truck" class="w-4 h-4 text-[#1677FF] shrink-0"></i>
                        <span>Livraison Dakar 2h - 24h</span>
                    </div>
                </div>
            </div>

            <!-- Col 5: Contact Direct -->
            <div class="space-y-3">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Contact Dakar</h3>
                <ul class="space-y-2.5 text-xs text-[#667085] font-medium">
                    <li class="flex items-center gap-2">
                        <i data-lucide="phone" class="w-4 h-4 text-[#1677FF] shrink-0"></i>
                        <a href="tel:<?= preg_replace('/\s+/', '', $storePhone) ?>" class="font-bold text-[#182230] hover:text-[#1677FF] whitespace-nowrap transition-colors"><?= htmlspecialchars($storePhone) ?></a>
                    </li>
                    <li class="flex items-center gap-2">
                        <i data-lucide="mail" class="w-4 h-4 text-[#1677FF] shrink-0"></i>
                        <a href="mailto:<?= htmlspecialchars($storeEmail) ?>" class="hover:text-[#1677FF] whitespace-nowrap transition-colors" title="<?= htmlspecialchars($storeEmail) ?>"><?= htmlspecialchars($storeEmail) ?></a>
                    </li>
                    <li class="flex items-center gap-2">
                        <i data-lucide="map-pin" class="w-4 h-4 text-[#1677FF] shrink-0"></i>
                        <span class="whitespace-nowrap"><?= htmlspecialchars($storeAddress) ?></span>
                    </li>
                </ul>
            </div>

        </div>

        <!-- ─── MOBILE ACCORDION FOOTER (Optimisé smartphone) ───────────────── -->
        <div class="block lg:hidden space-y-3">
            
            <!-- Brand Info Mobile -->
            <div class="space-y-3 pb-3 border-b border-[#E8EDF3]">
                <a href="index.php" class="inline-block">
                    <img src="<?= htmlspecialchars($storeLogo) ?>" alt="<?= htmlspecialchars($storeName) ?>" width="140" height="32" decoding="async" loading="lazy" style="width:140px; height:32px; aspect-ratio:140/32; object-fit:contain;" class="object-contain">
                </a>
                <p class="text-xs text-[#667085] leading-relaxed">
                    Votre boutique en ligne de référence pour les accessoires High-Tech au Sénégal.
                </p>
                <div class="pt-1">
                    <a href="https://wa.me/<?= htmlspecialchars($storeWa) ?>" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#085237] border border-[#25D366]/30 text-xs font-extrabold py-2.5 rounded-xl">
                        <i data-lucide="message-circle" class="w-4 h-4 text-[#0D7D53]"></i>
                        <span>Support WhatsApp : <?= htmlspecialchars($storePhone) ?></span>
                    </a>
                </div>
            </div>

            <!-- Accordéon 1: Navigation -->
            <div class="border-b border-[#E8EDF3] pb-2">
                <button type="button" onclick="toggleFooterAccordion('foot-nav')" class="w-full flex items-center justify-between py-2 text-xs font-black text-[#182230] uppercase tracking-wider cursor-pointer" aria-expanded="false">
                    <span>Navigation</span>
                    <i data-lucide="chevron-down" id="chevron-foot-nav" class="w-4 h-4 text-[#667085] transition-transform duration-200"></i>
                </button>
                <ul id="foot-nav" class="hidden pt-1 pb-2 space-y-2 text-xs font-semibold text-[#667085]">
                    <li><a href="index.php" class="hover:text-[#1677FF] block py-0.5">Accueil</a></li>
                    <li><a href="shop.php" class="hover:text-[#1677FF] block py-0.5">Boutique High-Tech</a></li>
                    <li><a href="about.php" class="hover:text-[#1677FF] block py-0.5">À Propos de Nous</a></li>
                    <li><a href="contact.php" class="hover:text-[#1677FF] block py-0.5">Contact & Support</a></li>
                    <li><a href="about.php#garantie" class="hover:text-[#1677FF] block py-0.5">Garantie 12 Mois & RMA</a></li>
                </ul>
            </div>

            <!-- Accordéon 2: Rayons Populaires -->
            <div class="border-b border-[#E8EDF3] pb-2">
                <button type="button" onclick="toggleFooterAccordion('foot-cats')" class="w-full flex items-center justify-between py-2 text-xs font-black text-[#182230] uppercase tracking-wider cursor-pointer" aria-expanded="false">
                    <span>Rayons Populaires</span>
                    <i data-lucide="chevron-down" id="chevron-foot-cats" class="w-4 h-4 text-[#667085] transition-transform duration-200"></i>
                </button>
                <ul id="foot-cats" class="hidden pt-1 pb-2 space-y-2 text-xs font-semibold text-[#667085]">
                    <?php foreach ($footerCats as $fCat): ?>
                        <li><a href="shop.php?category=<?= urlencode($fCat['slug']) ?>" class="hover:text-[#1677FF] block py-0.5"><?= htmlspecialchars($fCat['name']) ?></a></li>
                    <?php endforeach; ?>
                    <li><a href="shop.php?collection=flash" class="hover:text-[#C2410C] text-[#C2410C] font-bold block py-0.5">⚡ Ventes Flash</a></li>
                </ul>
            </div>

            <!-- Accordéon 3: Paiement & Sécurité -->
            <div class="border-b border-[#E8EDF3] pb-2">
                <button type="button" onclick="toggleFooterAccordion('foot-pay')" class="w-full flex items-center justify-between py-2 text-xs font-black text-[#182230] uppercase tracking-wider cursor-pointer" aria-expanded="false">
                    <span>Paiements Acceptés</span>
                    <i data-lucide="chevron-down" id="chevron-foot-pay" class="w-4 h-4 text-[#667085] transition-transform duration-200"></i>
                </button>
                <div id="foot-pay" class="hidden pt-1 pb-2 space-y-2">
                    <div class="flex flex-wrap gap-2 text-xs font-bold">
                        <span class="px-2.5 py-1 rounded-lg bg-[#1677FF]/10 text-[#0B54C2]">Wave</span>
                        <span class="px-2.5 py-1 rounded-lg bg-[#9A3412]/10 text-[#9A3412]">Orange Money</span>
                        <span class="px-2.5 py-1 rounded-lg bg-[#085237]/10 text-[#085237]">À la livraison</span>
                    </div>
                    <p class="text-[11px] text-[#667085] pt-1">Garantie satisfait ou remboursé. Paiement à la réception du colis partout à Dakar.</p>
                </div>
            </div>

        </div>

        <!-- ─── FOOTER BOTTOM BAR ────────────────────────────────────────────── -->
        <div class="border-t border-[#E8EDF3] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085] pr-0 lg:pr-32">
            <p class="text-center sm:text-left">© <?= date('Y') ?> <strong><?= htmlspecialchars($storeName) ?></strong>. Tous droits réservés. Conçu pour le Sénégal 🇸🇳</p>
            <div class="flex flex-wrap items-center justify-center gap-3 text-xs">
                <a href="privacy.php" class="hover:text-[#1677FF] transition-colors">Politique de Confidentialité</a>
                <span>•</span>
                <a href="contact.php#cgu" class="hover:text-[#1677FF] transition-colors">Conditions Générales</a>
                <span>•</span>
                <a href="contact.php" class="hover:text-[#1677FF] transition-colors">FAQ & Itinéraire Dakar</a>
                <span>•</span>
                <a href="about.php" class="hover:text-[#1677FF] transition-colors">Études de Cas & Équipe</a>
            </div>
        </div>

    </div>
</footer>
<?php endif; ?>

<script>
function toggleFooterAccordion(id) {
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
</script>

<!-- Floating Actions Stack (Back to Top + WhatsApp cleanly positioned at Bottom-Right) -->
<div id="floating-actions-stack" aria-label="Actions rapides flottantes" class="flex flex-col items-end gap-2.5 pointer-events-none fixed <?= in_array($currPage, ['product.php', 'wishlist.php', 'checkout.php']) ? 'hidden md:flex' : 'bottom-[68px]' ?> md:bottom-6 right-3 sm:right-6 z-30">
    
    <!-- 1. Back to Top Arrow (High Contrast Apple Dark Finish) -->
    <button type="button" id="back-to-top" style="display:none; background-color: #1D1D1F !important; color: #FFFFFF !important; box-shadow: 0 4px 16px rgba(0,0,0,0.3) !important;" class="pointer-events-auto w-10 h-10 bg-[#1D1D1F] hover:bg-[#0B54C2] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-white active:scale-95 hover:scale-105" aria-label="Retour en haut de la page">
      <i data-lucide="chevrons-up" class="w-5 h-5 text-white" style="color: #FFFFFF !important; stroke: #FFFFFF !important;"></i>
      <span class="sr-only">Retour en haut</span>
    </button>

    <!-- 2. Floating WhatsApp Button (Vibrant Emerald Pill) -->
    <aside id="floating-whatsapp-btn" aria-label="Support WhatsApp" class="pointer-events-auto" style="pointer-events: auto !important;">
        <a href="https://wa.me/<?= htmlspecialchars($storeWa) ?>?text=Bonjour%20<?= urlencode($storeName) ?>%20!%20Je%20souhaite%20avoir%20des%20informations%20sur%20vos%20%C3%A9quipements%20High-Tech." target="_blank" rel="noopener noreferrer" style="background-color: #25D366 !important; color: #FFFFFF !important; box-shadow: 0 6px 20px rgba(37,211,102,0.45) !important;" class="relative flex items-center justify-center bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer p-2.5 sm:px-4 sm:py-2.5" aria-label="Contactez-nous sur WhatsApp">
            <div class="w-5 h-5 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 32 32" class="w-5 h-5 fill-white" style="fill: #FFFFFF !important;" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.002 2C8.28 2 2 8.28 2 16.002c0 2.482.672 4.81 1.844 6.812L2 30l7.394-1.816A13.934 13.934 0 0016.002 30C23.72 30 30 23.72 30 16.002 30 8.28 23.72 2 16.002 2zm0 25.324a11.27 11.27 0 01-5.744-1.574l-.41-.244-4.39 1.078 1.108-4.28-.268-.44a11.278 11.278 0 01-1.722-6.012c0-6.254 5.09-11.342 11.342-11.342 6.254 0 11.342 5.088 11.342 11.342 0 6.254-5.09 11.342-11.342 11.342h-.116zm6.22-8.49c-.34-.17-2.014-1.002-2.328-1.118-.314-.114-.542-.17-.77.17-.228.34-.882 1.118-1.082 1.346-.2.228-.4.256-.74.086-.34-.17-1.436-.53-2.736-1.69-1.012-.902-1.694-2.016-1.894-2.356-.2-.34-.022-.524.15-.694.156-.152.34-.398.51-.598.17-.2.228-.34.342-.568.114-.228.058-.428-.028-.598-.086-.17-.77-1.862-1.056-2.55-.278-.668-.56-.578-.77-.588h-.656c-.228 0-.598.086-.912.428-.314.342-1.2 1.172-1.2 2.856s1.228 3.31 1.398 3.54c.17.228 2.418 3.69 5.858 5.18.818.354 1.456.566 1.954.724.82.262 1.568.226 2.158.138.658-.1 2.014-.824 2.3-1.62.284-.798.284-1.482.2-1.624-.086-.142-.314-.228-.654-.4z" />
                </svg>
            </div>
            <span class="hidden sm:inline-block ml-1.5 text-xs font-bold text-white leading-none whitespace-nowrap">WhatsApp</span>
        </a>
    </aside>
</div>

<!-- ─── MOBILE BOTTOM APP BAR (Apple iOS Glass Tab Bar) ─── -->
<?php if ($currPage !== 'product.php' && $currPage !== 'cart.php' && $currPage !== 'checkout.php'): ?>
<nav aria-label="Navigation mobile principale" class="fixed bottom-0 left-0 right-0 z-50 md:hidden apple-pill-bar" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 999; padding-bottom: max(6px, env(safe-area-inset-bottom)); background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-top: 1px solid rgba(226, 232, 240, 0.9); box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.05);">
    <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; width: 100%; height: 58px; max-width: 500px; margin: 0 auto; padding: 0 4px;">
        
        <!-- 1. Accueil -->
        <?php $isHome = ($currPage === 'index.php' || $currPage === ''); ?>
        <a href="index.php" class="cursor-pointer group active:scale-95 transition-all" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px;" <?= $isHome ? 'aria-current="page"' : '' ?>>
            <svg class="w-5 h-5 <?= $isHome ? 'text-[#0B54C2]' : 'text-[#475467]' ?>" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span style="font-size: 10px; font-weight: <?= $isHome ? '800' : '700' ?>; margin-top: 2px; color: <?= $isHome ? '#0B54C2' : '#344054' ?>;">Accueil</span>
        </a>

        <!-- 2. Boutique / Catalogue -->
        <?php $isShop = ($currPage === 'shop.php'); ?>
        <a href="shop.php" class="cursor-pointer group active:scale-95 transition-all" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px;" <?= $isShop ? 'aria-current="page"' : '' ?>>
            <svg class="w-5 h-5 <?= $isShop ? 'text-[#0B54C2]' : 'text-[#475467]' ?>" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
            <span style="font-size: 10px; font-weight: <?= $isShop ? '800' : '700' ?>; margin-top: 2px; color: <?= $isShop ? '#0B54C2' : '#344054' ?>;">Boutique</span>
        </a>

        <!-- 3. Panier (Central avec compteur) -->
        <?php $isCart = ($currPage === 'cart.php'); ?>
        <button type="button" onclick="toggleCartDrawer(true)" class="cursor-pointer group active:scale-95 transition-all relative" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: none; border: none; padding: 0; outline: none; cursor: pointer; min-height: 44px;" aria-label="Mon Panier">
            <div style="position: relative; display: inline-flex;">
                <svg class="w-5 h-5 <?= $isCart ? 'text-[#0B54C2]' : 'text-[#475467]' ?>" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                <?php if ($footerCartCount > 0): ?>
                    <span class="cart-count-badge" style="position: absolute; top: -6px; right: -9px; min-width: 16px; height: 16px; padding: 0 3px; background-color: #0B54C2; color: #ffffff; font-size: 8px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                        <?= $footerCartCount ?>
                    </span>
                <?php endif; ?>
            </div>
            <span style="font-size: 10px; font-weight: <?= $isCart ? '800' : '700' ?>; margin-top: 2px; color: <?= $isCart ? '#0B54C2' : '#344054' ?>;">Panier</span>
        </button>

        <!-- 4. Favoris -->
        <?php $isWish = ($currPage === 'wishlist.php'); ?>
        <a href="wishlist.php" class="cursor-pointer group active:scale-95 transition-all" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; position: relative; min-height: 44px;" <?= $isWish ? 'aria-current="page"' : '' ?>>
            <div style="position: relative; display: inline-flex;">
                <svg class="w-5 h-5 <?= $isWish ? 'text-[#0B54C2]' : 'text-[#475467]' ?>" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                <?php if ($footerWishCount > 0): ?>
                    <span style="position: absolute; top: -6px; right: -8px; min-width: 15px; height: 15px; padding: 0 3px; background-color: #B91C1C; color: #ffffff; font-size: 8px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                        <?= $footerWishCount ?>
                    </span>
                <?php endif; ?>
            </div>
            <span style="font-size: 10px; font-weight: <?= $isWish ? '800' : '700' ?>; margin-top: 2px; color: <?= $isWish ? '#0B54C2' : '#344054' ?>;">Favoris</span>
        </a>

        <!-- 5. Compte Client -->
        <?php $isAuth = ($currPage === 'account.php' || $currPage === 'login.php' || $currPage === 'register.php' || $currPage === 'orders.php'); ?>
        <a href="<?= isLoggedIn() ? 'account.php' : 'login.php' ?>" class="cursor-pointer group active:scale-95 transition-all" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px;" <?= $isAuth ? 'aria-current="page"' : '' ?>>
            <svg class="w-5 h-5 <?= $isAuth ? 'text-[#0B54C2]' : 'text-[#475467]' ?>" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span style="font-size: 10px; font-weight: <?= $isAuth ? '800' : '700' ?>; margin-top: 2px; color: <?= $isAuth ? '#0B54C2' : '#344054' ?>;"><?= isLoggedIn() ? htmlspecialchars(explode(' ', getCurrentUser()['name'])[0]) : 'Compte' ?></span>
        </a>

    </div>
</nav>
<?php endif; ?>

<!-- Interactive Scripts -->
<script src="assets/js/app.min.js?v=3.9" defer></script>
<script>
    function initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        var autoContainers = document.querySelectorAll('.content-auto');
        if (autoContainers.length > 0) {
            if ('IntersectionObserver' in window) {
                var autoObs = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            if (typeof lucide !== 'undefined') {
                                lucide.createIcons({ root: entry.target, skipHidden: false });
                            }
                            autoObs.unobserve(entry.target);
                        }
                    });
                }, { rootMargin: '350px' });
                autoContainers.forEach(function(el) { autoObs.observe(el); });
            } else {
                if (typeof lucide !== 'undefined') {
                    autoContainers.forEach(function(el) {
                        lucide.createIcons({ root: el, skipHidden: false });
                    });
                }
            }
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIcons);
    } else {
        initIcons();
    }
</script>



</body>
</html>

