<?php
require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();
$message = '';
$messageType = '';

// Traitement des requêtes POST sécurisées (Ajout, Modification, Suppression, Vider, Coupon)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    // Protection CSRF
    $submittedCsrf = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
    if (!verifyCSRFToken($submittedCsrf)) {
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Jeton de sécurité CSRF invalide.']);
            exit;
        }
        $message = 'Erreur de sécurité : Jeton CSRF invalide.';
        $messageType = 'error';
    } else {
        if ($action === 'add') {
            $pid = sanitize($_POST['product_id'] ?? '');
            $qty = (int)($_POST['quantity'] ?? 1);
            if ($pid) {
                addToCart($pid, $qty);
                $message = 'Produit ajouté à votre panier !';
                $messageType = 'success';
            }
        } elseif ($action === 'update') {
            $pid = sanitize($_POST['product_id'] ?? '');
            $qty = (int)($_POST['quantity'] ?? 1);
            if ($pid) {
                updateCartQuantity($pid, $qty);
                $message = 'Quantité mise à jour.';
                $messageType = 'info';
            }
        } elseif ($action === 'remove') {
            $pid = sanitize($_POST['product_id'] ?? '');
            if ($pid) {
                removeFromCart($pid);
                $message = 'Article retiré du panier.';
                $messageType = 'info';
            }
        } elseif ($action === 'empty_cart') {
            $_SESSION['cart'] = [];
            unset($_SESSION['applied_coupon']);
            $message = 'Votre panier a été vidé.';
            $messageType = 'info';
        } elseif ($action === 'apply_coupon') {
            $code = strtoupper(sanitize($_POST['coupon_code'] ?? ''));
            if (!empty($code)) {
                $coupon = null;
                if ($pdo) {
                    try {
                        $stmt = $pdo->prepare("SELECT * FROM coupons WHERE code = :code AND (expires_at IS NULL OR expires_at >= NOW())");
                        $stmt->execute([':code' => $code]);
                        $coupon = $stmt->fetch();
                    } catch (Throwable $e) {}
                }
// Les coupons sont exclusivement validés depuis la base de données

                if ($coupon) {
                    $_SESSION['applied_coupon'] = [
                        'code' => $coupon['code'],
                        'discount' => (float)$coupon['discount'],
                        'description' => $coupon['description'] ?? 'Remise immédiate'
                    ];
                    $message = "Code promo '{$coupon['code']}' appliqué (-" . $coupon['discount'] . "%) !";
                    $messageType = 'success';
                } else {
                    unset($_SESSION['applied_coupon']);
                    $message = "Code promo invalide ou expiré.";
                    $messageType = 'error';
                }
            }
        } elseif ($action === 'remove_coupon') {
            unset($_SESSION['applied_coupon']);
            $message = "Coupon de réduction retiré.";
            $messageType = 'info';
        }

        // Réponse AJAX pour fluidité
        $isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
                  || (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json'));
        if ($isAjax) {
            header('Content-Type: application/json');
            $cartTotals = calculateCartTotals();
            echo json_encode([
                'success' => $messageType !== 'error',
                'message' => $message,
                'cart_count' => getCartCount(),
                'subtotal' => formatPrice($cartTotals['subtotal']),
                'discount' => formatPrice($cartTotals['discount_total']),
                'total' => formatPrice($cartTotals['total'])
            ]);
            exit;
        }
    }
}

// Calcul des montants via le helper serveur
$cartTotals = calculateCartTotals('zone_dakar', 'express');
$itemsInCart = $cartTotals['items'];
$appliedCoupon = $cartTotals['coupon'];

$pageTitle = "Mon Panier (" . $cartTotals['items_count'] . " articles) — SenTechPLUS";
$layoutType = 'public_compact';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<div id="main-content" class="min-h-screen bg-[#F3F7FC] py-6 sm:py-10">
    <div class="max-w-[1400px] mx-auto px-3 sm:px-6 space-y-6">

        <!-- Fil d'ariane & Titre -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <nav class="text-xs text-[#667085] flex items-center gap-1.5 mb-1">
                    <a href="index.php" class="hover:text-[#1677FF]">Accueil</a>
                    <span>/</span>
                    <a href="shop.php" class="hover:text-[#1677FF]">Boutique</a>
                    <span>/</span>
                    <span class="text-[#182230] font-bold" aria-current="page">Panier</span>
                </nav>
                <h1 class="text-xl sm:text-2xl font-black text-[#182230] flex items-center gap-2.5">
                    <span>Mon Panier</span>
                    <span class="text-xs font-extrabold bg-[#EAF3FF] text-[#0B54C2] px-2.5 py-0.5 rounded-full">
                        <?= $cartTotals['items_count'] ?> <?= $cartTotals['items_count'] > 1 ? 'articles' : 'article' ?>
                    </span>
                </h1>
            </div>
            <a href="shop.php" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#1677FF] hover:text-[#0B54C2]">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>Continuer mes achats</span>
            </a>
        </div>

        <?php if ($message): ?>
            <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : ($messageType === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-blue-50 text-blue-800 border border-blue-200') ?> flex items-center justify-between shadow-2xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="<?= $messageType === 'success' ? 'check-circle-2' : ($messageType === 'error' ? 'alert-circle' : 'info') ?>" class="w-4 h-4"></i>
                    <span><?= htmlspecialchars($message) ?></span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
            </div>
        <?php endif; ?>

        <?php if (empty($itemsInCart)): ?>
            <!-- ─── Panier Vide : État de Vie & Découverte Active ─── -->
            <div class="bg-white rounded-3xl p-8 sm:p-12 border border-[#E1E8F0] shadow-2xs text-center space-y-6 max-w-xl mx-auto animate-fade-in">
                <div class="w-20 h-20 bg-[#EAF3FF] text-[#1677FF] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                    <i data-lucide="shopping-bag" class="w-10 h-10"></i>
                </div>
                <div class="space-y-2">
                    <h2 class="text-xl font-black text-[#182230] tracking-tight">Votre panier attend ses premiers articles !</h2>
                    <p class="text-xs text-[#667085] leading-relaxed max-w-md mx-auto">Explorez nos équipements certifiés 100% originaux avec livraison express à Dakar sous 2h et paiement à la réception.</p>
                </div>

                <!-- Pills de Découverte / État de Vie -->
                <div class="space-y-3 pt-2">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] block">Catégories Tendances</span>
                    <div class="flex flex-wrap items-center justify-center gap-2">
                        <a href="shop.php?category=telephones-accessoires" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">⚡ Chargeurs GaN 65W</a>
                        <a href="shop.php?category=audio-ecouteurs" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">🎧 Écouteurs Pro ANC</a>
                        <a href="shop.php?category=montres-objets-connectes" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">⌚ Smartwatches AMOLED</a>
                        <a href="shop.php?category=gaming" class="cursor-pointer text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F3F7FC] hover:bg-[#1677FF] text-[#182230] hover:text-white transition-colors border border-[#E8EDF3]">🎮 Gaming Setup</a>
                    </div>
                </div>

                <div class="pt-4 border-t border-[#E8EDF3]">
                    <a href="shop.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-8 py-3.5 rounded-full shadow-apple-soft transition-all active:scale-95">
                        <i data-lucide="compass" class="w-4 h-4"></i>
                        <span>Explorer Tout le Catalogue</span>
                    </a>
                </div>
            </div>

        <?php else: ?>
            <!-- ─── Grille 2 Colonnes Panier Rempli ─── -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <!-- Colonne Gauche : Liste des Articles (8 Cols) -->
                <div class="lg:col-span-8 space-y-4">
                    
                    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/60 shadow-apple-soft">
                        <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                            <h2 class="text-sm font-black text-[#0F172A] uppercase tracking-wider">Articles au Panier</h2>
                            
                            <form method="POST" action="cart.php" enctype="application/x-www-form-urlencoded" onsubmit="return confirm('Voulez-vous vraiment vider votre panier ?');">
                                <?= getCSRFInputField() ?>
                                <input type="hidden" name="action" value="clear">
                                <button type="submit" class="cursor-pointer text-xs font-bold text-[#64748B] hover:text-rose-600 transition-colors flex items-center gap-1">
                                    <i data-lucide="trash" class="w-3.5 h-3.5"></i>
                                    <span>Vider</span>
                                </button>
                            </form>
                        </div>

                        <!-- Liste des Articles -->
                        <div class="divide-y divide-slate-100 space-y-4">
                            <?php foreach ($itemsInCart as $item): 
                                $product = $item['product'];
                                $qty = $item['quantity'];
                                $maxStock = (int)($product['stock'] ?? 10);
                                $img = getProductMainImage($product, 'assets/images/product_img4.webp');
                            ?>
                                <div class="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    
                                    <!-- Image + Infos Produit -->
                                    <div class="flex items-center gap-4 min-w-0 flex-1">
                                        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F8FAFC] border border-slate-100 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img src="<?= htmlspecialchars($img) ?>" alt="<?= htmlspecialchars($product['name']) ?> - SenTechPLUS" width="80" height="80" loading="lazy" class="max-w-full max-h-full object-contain">
                                        </div>
                                        <div class="min-w-0 flex-1 space-y-1">
                                            <span class="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider block">
                                                <?= htmlspecialchars($product['brand'] ?? 'SenTech') ?>
                                            </span>
                                            <h3 class="text-xs sm:text-sm font-bold text-[#0F172A] hover:text-[#1677FF] transition-colors line-clamp-1">
                                                <a href="product.php?id=<?= urlencode($product['id']) ?>"><?= htmlspecialchars($product['name']) ?></a>
                                            </h3>
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs font-black text-[#0F172A]"><?= formatPrice($item['unit_price']) ?></span>
                                                <span class="text-[9px] font-bold text-[#0D7D53] bg-emerald-50 px-2 py-0.5 rounded-full">En Stock</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Contrôle Quantité & Total Ligne -->
                                    <div class="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
                                        
                                        <!-- Sélecteur Quantité -->
                                        <div class="flex items-center border border-slate-200 rounded-full bg-[#F8FAFC] p-1 shadow-2xs">
                                            <form method="POST" action="cart.php" enctype="application/x-www-form-urlencoded" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="update">
                                                <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                                                <input type="hidden" name="quantity" value="<?= max(1, $qty - 1) ?>">
                                                <button type="submit" <?= $qty <= 1 ? 'disabled' : '' ?> class="cursor-pointer w-7 h-7 flex items-center justify-center text-[#0F172A] hover:bg-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <i data-lucide="minus" class="w-3.5 h-3.5"></i>
                                                </button>
                                            </form>
                                            
                                            <span class="w-8 text-center text-xs font-black text-[#0F172A]"><?= $qty ?></span>

                                            <form method="POST" action="cart.php" enctype="application/x-www-form-urlencoded" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="update">
                                                <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                                                <input type="hidden" name="quantity" value="<?= min($maxStock, $qty + 1) ?>">
                                                <button type="submit" <?= $qty >= $maxStock ? 'disabled' : '' ?> class="cursor-pointer w-7 h-7 flex items-center justify-center text-[#0F172A] hover:bg-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                                                </button>
                                            </form>
                                        </div>

                                        <!-- Prix Total Ligne -->
                                        <div class="text-right">
                                            <span class="text-xs sm:text-sm font-black text-[#0F172A] block"><?= formatPrice($item['line_total']) ?></span>
                                        </div>

                                        <!-- Bouton Supprimer -->
                                        <form method="POST" action="cart.php" enctype="application/x-www-form-urlencoded" class="inline">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="remove">
                                            <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                                            <button type="submit" class="cursor-pointer p-2 text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" title="Supprimer">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </form>

                                    </div>

                                </div>
                            <?php endforeach; ?>
                        </div>

                    </div>
                    
                    <!-- Réassurance Expédition & Sécurité -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div class="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-2xs flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D7D53] flex items-center justify-center shrink-0">
                                <i data-lucide="truck" class="w-4 h-4"></i>
                            </div>
                            <div class="min-w-0">
                                <span class="text-[11px] font-black text-[#182230] block">Livraison Express</span>
                                <span class="text-[10px] text-[#667085] block">2h à Dakar et environs</span>
                            </div>
                        </div>
                        <div class="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-2xs flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center shrink-0">
                                <i data-lucide="shield-check" class="w-4 h-4"></i>
                            </div>
                            <div class="min-w-0">
                                <span class="text-[11px] font-black text-[#182230] block">100% Original</span>
                                <span class="text-[10px] text-[#667085] block">Garantie certifiée</span>
                            </div>
                        </div>
                        <div class="bg-white p-3.5 rounded-2xl border border-[#E1E8F0] shadow-2xs flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <i data-lucide="hand-coins" class="w-4 h-4"></i>
                            </div>
                            <div class="min-w-0">
                                <span class="text-[11px] font-black text-[#182230] block">Paiement à la Livraison</span>
                                <span class="text-[10px] text-[#667085] block">Cash ou Wave / OM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Colonne Droite : Résumé de la Commande & Coupon (4 Cols Sticky) -->
                <div class="lg:col-span-4 space-y-4 sticky top-20">
                    
                    <!-- Carte Résumé Apple Soft -->
                    <div class="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-apple-soft space-y-5">
                        <h2 class="text-sm font-black text-[#0F172A] uppercase tracking-wider pb-3 border-b border-slate-100">
                            Récapitulatif de Commande
                        </h2>

                        <!-- Code Promo Form -->
                        <div class="space-y-2">
                            <label for="coupon-code-input" class="block text-xs font-bold text-[#0F172A]">Code de Réduction</label>
                            <?php if ($appliedCoupon): ?>
                                <div class="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                                    <div class="flex items-center gap-2">
                                        <i data-lucide="tag" class="w-4 h-4 text-[#0D7D53]"></i>
                                        <span class="font-extrabold text-[#0D7D53]"><?= htmlspecialchars($appliedCoupon['code']) ?> (-<?= $appliedCoupon['discount'] ?>%)</span>
                                    </div>
                                    <form method="POST" action="cart.php" enctype="application/x-www-form-urlencoded" class="inline">
                                        <?= getCSRFInputField() ?>
                                        <input type="hidden" name="action" value="remove_coupon">
                                        <button type="submit" class="cursor-pointer text-xs font-black text-rose-500 hover:text-rose-700">✕</button>
                                    </form>
                                </div>
                            <?php else: ?>
                                <form method="POST" action="cart.php" enctype="application/x-www-form-urlencoded" class="flex gap-2">
                                    <?= getCSRFInputField() ?>
                                    <input type="hidden" name="action" value="apply_coupon">
                                    <input id="coupon-code-input" type="text" name="coupon_code" placeholder="Ex: PROMO10" required class="flex-1 px-3.5 py-2.5 rounded-full border border-slate-200 focus:border-[#1677FF] outline-none text-xs font-bold uppercase bg-[#F8FAFC]">
                                    <button type="submit" class="cursor-pointer bg-[#0F172A] hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-apple-soft">
                                        Appliquer
                                    </button>
                                </form>
                            <?php endif; ?>
                        </div>

                        <!-- Sélecteur Dynamique Zone de Livraison Dakar -->
                        <div class="space-y-1.5 pt-2">
                            <label for="cart-delivery-zone" class="block text-xs font-bold text-[#0F172A] flex items-center justify-between">
                                <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#1677FF]"></i> Zone de Livraison :</span>
                                <span class="text-[9px] text-[#0D7D53] font-black bg-emerald-50 px-2 py-0.5 rounded-full">Gratuit dès 50k</span>
                            </label>
                            <select id="cart-delivery-zone" onchange="updateCartDeliveryZone(this.value)" class="w-full bg-[#F8FAFC] border border-slate-200 p-2.5 rounded-2xl text-xs font-bold text-[#0F172A] outline-none cursor-pointer">
                                <?php 
                                $currentZone = $_SESSION['delivery_zone'] ?? 'dakar_centre';
                                foreach (getDakarDeliveryZones() as $zk => $zinfo): 
                                    $isZSelected = ($currentZone === $zk);
                                ?>
                                    <option value="<?= htmlspecialchars($zk) ?>" <?= $isZSelected ? 'selected' : '' ?> data-price="<?= $zinfo['price'] ?>">
                                        <?= htmlspecialchars($zinfo['name']) ?> (<?= formatPrice($zinfo['price']) ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <!-- Lignes de Calcul -->
                        <div class="space-y-2.5 text-xs pt-3 border-t border-slate-100">
                            <div class="flex justify-between text-[#64748B]">
                                <span>Sous-total articles</span>
                                <span class="font-bold text-[#0F172A]" id="cart-subtotal-val"><?= formatPrice($cartTotals['subtotal']) ?></span>
                            </div>

                            <?php if ($cartTotals['discount_total'] > 0): ?>
                                <div class="flex justify-between text-[#0D7D53] font-bold">
                                    <span>Remise coupon</span>
                                    <span>- <?= formatPrice($cartTotals['discount_total']) ?></span>
                                </div>
                            <?php endif; ?>

                            <?php 
                            $actualDeliveryFee = calculateDeliveryFee($currentZone, $cartTotals['subtotal']);
                            $finalCartTotal = max(0, $cartTotals['subtotal'] - $cartTotals['discount_total']) + $actualDeliveryFee;
                            ?>

                            <div class="flex justify-between items-center text-[#64748B]">
                                <span>Frais de livraison</span>
                                <span class="font-bold <?= $actualDeliveryFee === 0.0 ? 'text-[#0D7D53]' : 'text-[#0F172A]' ?>" id="cart-delivery-val">
                                    <?= $actualDeliveryFee === 0.0 ? 'GRATUIT 🎉' : formatPrice($actualDeliveryFee) ?>
                                </span>
                            </div>

                            <div class="flex justify-between items-center text-sm pt-3 border-t border-slate-100">
                                <span class="font-black text-[#0F172A]">Total net</span>
                                <span class="text-xl font-black text-[#0F172A] tracking-tight" id="cart-total-val"><?= formatPrice($finalCartTotal) ?></span>
                            </div>
                        </div>

                        <!-- CTA Passer à la Caisse & Commande WhatsApp 1-Clic -->
                        <div class="pt-2 space-y-2.5">
                            <a href="checkout.php" class="cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-sm py-3.5 rounded-full shadow-apple-soft transition-all active:scale-95">
                                <span>Commander en ligne</span>
                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </a>

                            <!-- Commande directe WhatsApp pour tout le panier -->
                            <a id="cart-whatsapp-order-btn" href="<?= getWhatsAppCartLink($itemsInCart, $cartTotals['subtotal'], $actualDeliveryFee, getDakarDeliveryZones()[$currentZone]['name'] ?? 'Dakar') ?>" target="_blank" rel="noopener" class="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-full shadow-apple-soft transition-all active:scale-95">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.704-.374-1.258-.528-2.079-1.808-2.142-1.892-.063-.084-.509-.678-.509-1.293s.322-.919.436-1.042c.114-.123.249-.155.334-.155.084 0 .168.002.241.006.077.004.181-.029.283.217.104.252.356.87.387.933.031.063.052.138.01.222-.042.084-.063.137-.126.21-.063.074-.132.164-.188.22-.063.063-.129.131-.056.257.073.126.326.539.7 0.871.482.428.887.561 1.013.624.126.063.2.052.273-.031.074-.084.316-.368.4-.494.084-.126.168-.105.283-.063.116.042.736.347.862.41.126.063.21.095.241.147.032.053.032.306-.112.711z"/></svg>
                                <span>Valider sur WhatsApp (1 Clic)</span>
                            </a>

                            <span class="text-[10px] text-[#94A3B8] text-center block pt-1">
                                🔒 Paiement à la livraison après inspection du matériel
                            </span>
                        </div>

                    </div>

                </div>

            </div>
        <?php endif; ?>

    </div>
</div>

<script>
function updateCartDeliveryZone(zoneKey) {
    const subtotal = <?= (float)$cartTotals['subtotal'] ?>;
    const discount = <?= (float)$cartTotals['discount_total'] ?>;
    const zones = <?= json_encode(getDakarDeliveryZones()) ?>;
    const selectedZone = zones[zoneKey] || { price: 2000, name: 'Dakar' };
    
    let fee = subtotal >= 50000 ? 0 : selectedZone.price;
    let total = Math.max(0, subtotal - discount) + fee;

    const deliveryEl = document.getElementById('cart-delivery-val');
    const totalEl = document.getElementById('cart-total-val');
    if (deliveryEl) deliveryEl.textContent = fee === 0 ? 'GRATUIT 🎉' : new Intl.NumberFormat('fr-FR').format(fee) + ' FCFA';
    if (totalEl) totalEl.textContent = new Intl.NumberFormat('fr-FR').format(total) + ' FCFA';
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
