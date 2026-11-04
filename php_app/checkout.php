<?php
require_once __DIR__ . '/config/config.php';

// Support du mode achat direct immédiat (ex: checkout.php?buy_now=prod_9)
$buyNowId = sanitize($_GET['buy_now'] ?? '');
if (!empty($buyNowId)) {
    $qty = max(1, (int)($_GET['qty'] ?? 1));
    addToCart($buyNowId, $qty);
}

$cartItems = getCartItems();
if (empty($cartItems)) {
    header('Location: cart.php');
    exit;
}

$user = getCurrentUser();
$userId = $user['id'] ?? null;
$pdo = getDBConnection();
$message = '';
$messageType = 'error';

// Récupérer les adresses sauvegardées si l'utilisateur est connecté
$savedAddresses = [];
if ($userId && $pdo) {
    try {
        $stmtAddr = $pdo->prepare("SELECT * FROM addresses WHERE user_id = :uid ORDER BY is_default DESC, created_at DESC");
        $stmtAddr->execute([':uid' => $userId]);
        $savedAddresses = $stmtAddr->fetchAll();
    } catch (Throwable $e) {}
}

$defaultAddress = null;
foreach ($savedAddresses as $addr) {
    if (!empty($addr['is_default'])) {
        $defaultAddress = $addr;
        break;
    }
}
if (!$defaultAddress && !empty($savedAddresses)) {
    $defaultAddress = $savedAddresses[0];
}

// Traitement de la commande en POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF expiré ou invalide.";
    } else {
        $firstName = sanitize($_POST['first_name'] ?? '');
        $lastName = sanitize($_POST['last_name'] ?? '');
        $phone = sanitize($_POST['phone'] ?? '');
        $email = sanitize($_POST['email'] ?? ($user['email'] ?? ''));
        $region = sanitize($_POST['region'] ?? 'Dakar');
        $city = sanitize($_POST['city'] ?? 'Dakar');
        $district = sanitize($_POST['district'] ?? '');
        $address = sanitize($_POST['address'] ?? '');
        $landmark = sanitize($_POST['landmark'] ?? '');
        $instructions = sanitize($_POST['instructions'] ?? '');
        $deliveryZone = sanitize($_POST['delivery_zone'] ?? 'zone_dakar');
        $deliveryMethod = sanitize($_POST['delivery_method'] ?? 'express');
        $paymentMethod = sanitize($_POST['payment_method'] ?? 'wave');
        $saveAddress = isset($_POST['save_address']) && $userId;

        // Nettoyage et validation stricte du numéro de téléphone sénégalais
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($cleanPhone, '221') && strlen($cleanPhone) === 12) {
            $cleanPhone = substr($cleanPhone, 3);
        } elseif (str_starts_with($cleanPhone, '00221') && strlen($cleanPhone) === 14) {
            $cleanPhone = substr($cleanPhone, 5);
        }
        $isSenegalPhoneValid = (strlen($cleanPhone) === 9 && in_array(substr($cleanPhone, 0, 2), ['70', '75', '76', '77', '78', '33']));

        if (empty($firstName) || empty($phone) || empty($address)) {
            $message = "Veuillez renseigner votre prénom, numéro de téléphone et adresse complète.";
        } elseif (!$isSenegalPhoneValid) {
            $message = "Veuillez saisir un numéro de téléphone sénégalais valide (9 chiffres commençant par 77, 78, 76, 75, 70 ou 33).";
        } else {
            // Recalcul strict des totaux côté serveur
            $orderTotals = calculateCartTotals($deliveryZone, $deliveryMethod);

            // Vérification des stocks physiques
            $stockOk = true;
            foreach ($orderTotals['items'] as $it) {
                $p = $it['product'];
                if ($it['quantity'] > (int)($p['stock'] ?? 0)) {
                    $stockOk = false;
                    $message = "Stock insuffisant pour « {$p['name']} ». Quantité ajustée au maximum disponible.";
                    break;
                }
            }

            if ($stockOk) {
                // Sauvegarder l'adresse dans le carnet si demandé
                if ($saveAddress && $pdo) {
                    try {
                        $addrId = 'addr_' . uniqid();
                        $fullName = trim("$firstName $lastName");
                        $stmtSave = $pdo->prepare("INSERT INTO addresses 
                            (id, user_id, name, first_name, last_name, email, street, city, state, zip, country, phone, region, district, landmark, is_default) 
                            VALUES (:id, :uid, :name, :fn, :ln, :email, :street, :city, :state, '00000', 'Sénégal', :phone, :region, :dist, :land, 0)");
                        $stmtSave->execute([
                            ':id' => $addrId,
                            ':uid' => $userId,
                            ':name' => $fullName,
                            ':fn' => $firstName,
                            ':ln' => $lastName,
                            ':email' => $email,
                            ':street' => $address,
                            ':city' => $city,
                            ':state' => $region,
                            ':phone' => $phone,
                            ':region' => $region,
                            ':dist' => $district,
                            ':land' => $landmark
                        ]);
                    } catch (Throwable $e) {}
                }

                // Création de la commande
                $customerData = [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => $phone,
                    'email' => $email,
                    'region' => $region,
                    'city' => $city,
                    'district' => $district,
                    'address' => $address,
                    'landmark' => $landmark,
                    'instructions' => $instructions,
                    'delivery_method' => $deliveryMethod,
                    'payment_method' => $paymentMethod
                ];

                $order = createOrder($customerData, $cartItems, $orderTotals);

                // Envoi automatique de la notification SMS de confirmation
                if (!empty($phone)) {
                    try {
                        $smsMsg = buildSMSMessage('order_created', [
                            'id'            => $order['order_number'] ?? $order['id'] ?? 'ST-NEW',
                            'name'          => $firstName . ' ' . $lastName,
                            'total'         => $orderTotals['final_total'] ?? 0,
                            'shipping_zone' => $city ?: ($region ?: 'Dakar')
                        ]);
                        sendSMSNotification($phone, $smsMsg, 'order_created', ['order_id' => $order['id'] ?? $order['order_number'] ?? null]);
                    } catch (Throwable $e) {}
                }

                // Redirection vers passerelle de paiement ou confirmation directe
                if (in_array(strtolower($paymentMethod), ['wave', 'om', 'orange_money', 'free_money', 'card', 'carte', 'paytech'])) {
                    try {
                        $payRes = initiatePayTechPayment($order);
                        if (!empty($payRes['redirect_url'])) {
                            header('Location: ' . $payRes['redirect_url']);
                            exit;
                        }
                    } catch (Throwable $ePay) {}
                }

                header('Location: order-success.php?id=' . urlencode($order['order_number'] ?? $order['id']));
                exit;
            }
        }
    }
}

// Données de calcul par défaut
$initialTotals = calculateCartTotals('zone_dakar', 'express');

$pageTitle = "Commander — Validation & Paiement Sécurisé | SenTechPLUS";
$layoutType = 'checkout';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<div id="main-content" class="min-h-screen bg-[#F8FAFD] py-4 sm:py-8 pb-28 lg:pb-16">
    <div class="max-w-[1360px] mx-auto px-3 sm:px-6 space-y-5">

        <!-- ─── 1. TUNNEL DE COMMANDE ÉPURÉ TYPE APPLE (Indicateurs d'étapes) ─── -->
        <div class="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs">
            <div class="flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
                
                <!-- Étape 1 : Panier (Validé) -->
                <a href="cart.php" class="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors">
                    <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-black">✓</div>
                    <span class="hidden sm:inline">1. Panier</span>
                </a>

                <div class="h-0.5 flex-1 max-w-[60px] mx-2 bg-[#1677FF]/40"></div>

                <!-- Étape 2 : Livraison & Paiement (Active) -->
                <div class="flex items-center gap-2 text-[#1677FF]">
                    <div class="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-[11px] font-black shadow-xs">2</div>
                    <span class="font-extrabold">2. Livraison & Paiement</span>
                </div>

                <div class="h-0.5 flex-1 max-w-[60px] mx-2 bg-slate-200"></div>

                <!-- Étape 3 : Confirmation -->
                <div class="flex items-center gap-2 text-slate-400">
                    <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[11px] font-bold">3</div>
                    <span class="hidden sm:inline">3. Confirmation</span>
                </div>

            </div>
        </div>

        <!-- Alerte Session Annulée -->
        <?php if (!empty($_GET['payment_cancelled'])): ?>
            <div class="p-4 sm:p-5 rounded-3xl bg-amber-50/90 border border-amber-200/80 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs animate-fade-in">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-amber-950">Session de paiement interrompue</h4>
                        <p class="text-[11px] text-amber-800">Aucun montant n'a été débité. Vous pouvez choisir Wave, Orange Money ou le paiement en espèces à la livraison.</p>
                    </div>
                </div>
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j'ai%20eu%20un%20souci%20avec%20mon%20paiement." target="_blank" rel="noopener noreferrer" class="cursor-pointer shrink-0 text-xs font-bold text-[#0B54C2] bg-white px-3.5 py-2 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs">
                    <i data-lucide="message-circle" class="w-4 h-4 text-[#25D366]"></i>
                    <span>Aide WhatsApp</span>
                </a>
            </div>
        <?php endif; ?>

        <!-- Message d'erreur form -->
        <?php if ($message): ?>
            <div class="p-4 rounded-2xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between shadow-2xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600"></i>
                    <span><?= htmlspecialchars($message) ?></span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black text-rose-500 hover:text-rose-800">✕</button>
            </div>
        <?php endif; ?>

        <!-- ─── FORMULAIRE DE COMMANDE & RÉSUMÉ ──────────────────────────────── -->
        <form method="POST" action="checkout.php" id="checkout-form" onsubmit="return handleCheckoutSubmit(this, event);" class="space-y-6">
            <?= getCSRFInputField() ?>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                
                <!-- Colonne Gauche : Formulaire (7 ou 8 Cols) -->
                <div class="lg:col-span-8 space-y-5">
                    
                    <!-- 1. Coordonnées & Adresse de Livraison -->
                    <div class="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/70 shadow-2xs space-y-4">
                        
                        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div class="flex items-center gap-2.5">
                                <div class="w-7 h-7 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center font-black text-xs">1</div>
                                <div>
                                    <h2 class="text-xs sm:text-sm font-black text-[#1D1D1F] uppercase tracking-wider">Adresse de Livraison</h2>
                                    <p class="text-[11px] text-[#64748B]">Remise en main propre par coursier moto dédié</p>
                                </div>
                            </div>
                            <?php if (isLoggedIn()): ?>
                                <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 hidden sm:inline-flex">
                                    ✓ Connecté : <?= htmlspecialchars(explode(' ', $user['name'])[0]) ?>
                                </span>
                            <?php endif; ?>
                        </div>

                        <!-- Sélecteur d'adresse sauvegardée -->
                        <?php if (!empty($savedAddresses)): ?>
                            <div class="p-3 bg-[#F8FAFD] rounded-2xl border border-slate-200/80 space-y-1.5">
                                <label class="block text-xs font-bold text-[#1D1D1F]">Utiliser une adresse enregistrée :</label>
                                <select aria-label="Choisir une adresse enregistrée" onchange="fillSavedAddress(this.value)" class="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none cursor-pointer">
                                    <option value="">-- Saisir une nouvelle adresse --</option>
                                    <?php foreach ($savedAddresses as $idx => $sa): ?>
                                        <option value="<?= htmlspecialchars(json_encode($sa)) ?>" <?= !empty($sa['is_default']) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($sa['first_name'] . ' ' . $sa['last_name'] . ' — ' . $sa['street'] . ', ' . $sa['city']) ?> <?= !empty($sa['is_default']) ? '(Par défaut)' : '' ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        <?php endif; ?>

                        <!-- Nom & Prénom -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div>
                                <label for="c-fn" class="block font-bold text-[#1D1D1F] mb-1.5">Prénom *</label>
                                <input type="text" name="first_name" id="c-fn" value="<?= htmlspecialchars($defaultAddress['first_name'] ?? (explode(' ', $user['name'] ?? '')[0] ?? '')) ?>" required placeholder="Ex: Moussa" class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 focus:bg-white focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/10 outline-none font-bold text-xs sm:text-sm text-[#1D1D1F] transition-all">
                            </div>
                            <div>
                                <label for="c-ln" class="block font-bold text-[#1D1D1F] mb-1.5">Nom *</label>
                                <input type="text" name="last_name" id="c-ln" value="<?= htmlspecialchars($defaultAddress['last_name'] ?? (explode(' ', $user['name'] ?? '')[1] ?? '')) ?>" required placeholder="Ex: Diallo" class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 focus:bg-white focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/10 outline-none font-bold text-xs sm:text-sm text-[#1D1D1F] transition-all">
                            </div>
                        </div>

                        <!-- Téléphone sénégalais & Email -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div>
                                <label for="c-phone" class="block font-bold text-[#1D1D1F] mb-1.5">Numéro de Téléphone (Livraison) *</label>
                                <div class="relative flex items-center">
                                    <div style="position: absolute; left: 12px; z-index: 10; display: flex; align-items: center; gap: 6px; pointer-events: none; font-size: 13px; font-weight: 800; color: #475569; border-right: 1px solid #CBD5E1; padding-right: 8px;">
                                        <span>🇸🇳</span>
                                        <span>+221</span>
                                    </div>
                                    <input type="tel" name="phone" id="c-phone" value="<?= htmlspecialchars($defaultAddress['phone'] ?? ($user['phone'] ?? '')) ?>" required pattern="^((\+221|00221)[\s-]?)?(70|75|76|77|78|33)[0-9\s-]{7,11}$" placeholder="77 000 00 00" style="padding-left: 94px !important;" class="w-full h-11 pr-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 focus:bg-white focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/10 outline-none font-black text-xs sm:text-sm text-[#1D1D1F] tracking-wide transition-all">
                                </div>
                                <span class="text-[10.5px] text-[#64748B] mt-1 block">Le coursier vous appellera 15 min avant son arrivée.</span>
                            </div>
                            <div>
                                <label for="c-email" class="block font-bold text-[#1D1D1F] mb-1.5">Adresse Email <span class="font-normal text-slate-400">(Optionnel)</span></label>
                                <input type="email" name="email" id="c-email" value="<?= htmlspecialchars($user['email'] ?? '') ?>" placeholder="Pour recevoir votre reçu PDF" class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 focus:bg-white focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/10 outline-none font-medium text-xs sm:text-sm text-[#1D1D1F] transition-all">
                            </div>
                        </div>

                        <!-- Région, Ville, Quartier -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                            <div>
                                <label for="c-region" class="block font-bold text-[#1D1D1F] mb-1.5">Région *</label>
                                <select name="region" id="c-region" onchange="updateDeliveryZone(this.value)" class="w-full h-11 px-3 rounded-xl bg-[#F8FAFD] border border-slate-200/90 font-bold text-xs sm:text-sm text-[#1D1D1F] outline-none cursor-pointer">
                                    <option value="Dakar" selected>Dakar</option>
                                    <option value="Thiès">Thiès</option>
                                    <option value="Saint-Louis">Saint-Louis</option>
                                    <option value="Autre Région">Autre Région</option>
                                </select>
                            </div>
                            <div>
                                <label for="c-city" class="block font-bold text-[#1D1D1F] mb-1.5">Ville *</label>
                                <input type="text" name="city" id="c-city" value="<?= htmlspecialchars($defaultAddress['city'] ?? 'Dakar') ?>" required placeholder="Dakar, Pikine, Rufisque..." class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 outline-none font-bold text-xs sm:text-sm text-[#1D1D1F]">
                            </div>
                            <div>
                                <label for="c-dist" class="block font-bold text-[#1D1D1F] mb-1.5">Quartier / Commune *</label>
                                <input type="text" name="district" id="c-dist" value="<?= htmlspecialchars($defaultAddress['district'] ?? '') ?>" required placeholder="Plateau, Almadies, Mermoz, Point E..." class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 outline-none font-bold text-xs sm:text-sm text-[#1D1D1F]">
                            </div>
                        </div>

                        <!-- Adresse précise -->
                        <div class="text-xs">
                            <label for="c-addr" class="block font-bold text-[#1D1D1F] mb-1.5">Adresse Précise (Rue, N° Villa, Bâtiment, Étage) *</label>
                            <input type="text" name="address" id="c-addr" value="<?= htmlspecialchars($defaultAddress['street'] ?? '') ?>" required placeholder="Ex: Rue MZ-12, Immeuble A, 2ème étage droite" class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 outline-none font-bold text-xs sm:text-sm text-[#1D1D1F]">
                        </div>

                        <!-- Repère & Instructions -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div>
                                <label for="c-land" class="block font-bold text-[#1D1D1F] mb-1.5">Point de Repère <span class="font-normal text-slate-400">(Optionnel)</span></label>
                                <input type="text" name="landmark" id="c-land" value="<?= htmlspecialchars($defaultAddress['landmark'] ?? '') ?>" placeholder="Ex: En face Station Total, Pharmacie..." class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 outline-none text-xs sm:text-sm text-[#1D1D1F]">
                            </div>
                            <div>
                                <label for="c-instructions" class="block font-bold text-[#1D1D1F] mb-1.5">Note au Livreur <span class="font-normal text-slate-400">(Optionnel)</span></label>
                                <input type="text" name="instructions" id="c-instructions" placeholder="Ex: Laisser à l'accueil, appeler à l'interphone..." class="w-full h-11 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200/90 outline-none text-xs sm:text-sm text-[#1D1D1F]">
                            </div>
                        </div>

                        <?php if (isLoggedIn()): ?>
                            <div class="pt-1">
                                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1D1D1F]">
                                    <input type="checkbox" name="save_address" value="1" checked class="accent-[#1677FF] w-4 h-4 rounded">
                                    <span>Enregistrer cette adresse dans mon compte</span>
                                </label>
                            </div>
                        <?php endif; ?>

                    </div>

                    <!-- 2. Mode de Livraison & Frais -->
                    <div class="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/70 shadow-2xs space-y-4">
                        
                        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div class="flex items-center gap-2.5">
                                <div class="w-7 h-7 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center font-black text-xs">2</div>
                                <div>
                                    <h2 class="text-xs sm:text-sm font-black text-[#1D1D1F] uppercase tracking-wider">Option de Livraison</h2>
                                    <p class="text-[11px] text-[#64748B]">Dakar & banlieue immédiate</p>
                                </div>
                            </div>
                            <?php if ($initialTotals['subtotal'] >= 50000): ?>
                                <span class="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    🎉 Livraison Gratuite dès 50k
                                </span>
                            <?php endif; ?>
                        </div>

                        <input type="hidden" name="delivery_zone" id="input-delivery-zone" value="zone_dakar">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            
                            <!-- Option 1 : Express Dakar H+2 -->
                            <label class="cursor-pointer flex items-start gap-3 p-4 rounded-2xl border-2 border-[#1677FF] bg-[#F4F8FF] relative shadow-2xs transition-all">
                                <input type="radio" name="delivery_method" value="express" checked onchange="updateDeliveryMethod(3000)" class="mt-1 accent-[#1677FF] w-4 h-4">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs sm:text-sm font-black text-[#1D1D1F]">⚡ Express Dakar H+2</span>
                                        <span class="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">Recommandé</span>
                                    </div>
                                    <p class="text-[11px] text-[#64748B]">Remise en main propre sous 90 min à 2h à Dakar</p>
                                    <span class="text-xs font-black text-[#1677FF] block pt-0.5">3 000 FCFA</span>
                                </div>
                            </label>

                            <!-- Option 2 : Standard 24h -->
                            <label class="cursor-pointer flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white relative transition-all shadow-2xs">
                                <input type="radio" name="delivery_method" value="standard" onchange="updateDeliveryMethod(2000)" class="mt-1 accent-[#1677FF] w-4 h-4">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs sm:text-sm font-black text-[#1D1D1F]">📦 Livraison 24h</span>
                                    </div>
                                    <p class="text-[11px] text-[#64748B]">Livré le jour ouvrable suivant</p>
                                    <span class="text-xs font-black text-slate-700 block pt-0.5">2 000 FCFA</span>
                                </div>
                            </label>

                        </div>

                    </div>

                    <!-- 3. Mode de Paiement Sécurisé -->
                    <div class="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/70 shadow-2xs space-y-4">
                        
                        <div class="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                            <div class="w-7 h-7 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center font-black text-xs">3</div>
                            <div>
                                <h2 class="text-xs sm:text-sm font-black text-[#1D1D1F] uppercase tracking-wider">Mode de Paiement</h2>
                                <p class="text-[11px] text-[#64748B]">Aucun paiement avant inspection du blister scellé</p>
                            </div>
                        </div>

                        <!-- Incentive Reassurance Wave / OM -->
                        <div class="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-center gap-3 text-xs">
                            <div class="w-8 h-8 rounded-xl bg-[#1677FF] text-white flex items-center justify-center shrink-0 shadow-xs text-sm">
                                🎁
                            </div>
                            <div class="min-w-0 flex-1">
                                <span class="font-extrabold text-[#0B54C2] block">Privilège Paiement Mobile (Wave & OM)</span>
                                <span class="text-[11px] text-slate-700">Câble renforcé anti-coupure Offert + Traitement Prioritaire H+1 !</span>
                            </div>
                        </div>

                        <div class="space-y-3">
                            
                            <!-- Mode 1 : Wave Sénégal (Recommandé • Zéro Frais) -->
                            <label class="cursor-pointer flex items-center justify-between p-4 rounded-2xl border-2 border-[#1677FF] bg-[#F4F8FF] shadow-2xs transition-all">
                                <div class="flex items-center gap-3 min-w-0">
                                    <input type="radio" name="payment_method" value="wave" checked class="accent-[#1677FF] w-4 h-4 shrink-0">
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-xs sm:text-sm font-black text-[#1D1D1F]">Wave Sénégal</span>
                                            <span class="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">+ Câble Offert</span>
                                        </div>
                                        <span class="text-[11px] text-[#64748B] block mt-0.5">Payez en 1-clic ou scannez le QR code du coursier à la réception du colis.</span>
                                    </div>
                                </div>
                                <span class="text-xs font-black text-[#1FA2FF] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-xl shrink-0">WAVE</span>
                            </label>

                            <!-- Mode 2 : Orange Money Sénégal -->
                            <label class="cursor-pointer flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs">
                                <div class="flex items-center gap-3 min-w-0">
                                    <input type="radio" name="payment_method" value="om" class="accent-[#1677FF] w-4 h-4 shrink-0">
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span class="text-xs sm:text-sm font-black text-[#1D1D1F]">Orange Money Sénégal</span>
                                            <span class="text-[9px] font-black uppercase bg-orange-100 text-[#FF7900] px-2 py-0.5 rounded-full">+ Câble Offert</span>
                                        </div>
                                        <span class="text-[11px] text-[#64748B] block mt-0.5">Code marchand OM direct. Validation instantanée.</span>
                                    </div>
                                </div>
                                <span class="text-xs font-black text-[#FF7900] bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-xl shrink-0">OM</span>
                            </label>

                            <!-- Mode 3 : Espèces à la livraison -->
                            <label class="cursor-pointer flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-2xs">
                                <div class="flex items-center gap-3 min-w-0">
                                    <input type="radio" name="payment_method" value="cod" class="accent-slate-600 w-4 h-4 shrink-0">
                                    <div class="min-w-0">
                                        <span class="text-xs sm:text-sm font-bold text-[#1D1D1F] block">Paiement en Espèces au Coursier</span>
                                        <span class="text-[11px] text-[#64748B] block mt-0.5">Vous inspectez l'intégrité du blister scellé avant de remettre l'appoint.</span>
                                    </div>
                                </div>
                                <span class="text-xs font-black text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl shrink-0">CASH</span>
                            </label>

                        </div>

                    </div>

                </div>

                <!-- Colonne Droite : Récapitulatif Sticky Desktop (4 Cols) -->
                <div class="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                    
                    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/70 shadow-2xs space-y-4">
                        
                        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 class="text-xs sm:text-sm font-black text-[#1D1D1F] uppercase tracking-wider">
                                Votre Commande (<?= $initialTotals['items_count'] ?>)
                            </h3>
                            <a href="cart.php" class="text-[11px] font-bold text-[#1677FF] hover:underline">Modifier</a>
                        </div>

                        <!-- Mini Liste Articles -->
                        <div class="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-2">
                            <?php foreach ($initialTotals['items'] as $it): 
                                $p = $it['product'];
                                $img = getProductMainImage($p, 'assets/images/product_img4.webp');
                            ?>
                                <div class="pt-2 first:pt-0 flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-2.5 min-w-0">
                                        <img src="<?= htmlspecialchars($img) ?>" alt="<?= htmlspecialchars($p['name']) ?> - SenTechPLUS" width="44" height="44" loading="lazy" style="aspect-ratio:1/1;" class="w-11 h-11 rounded-2xl object-contain bg-[#F8FAFD] p-1 border border-slate-200/80 shrink-0">
                                        <div class="min-w-0">
                                            <span class="text-xs font-bold text-[#1D1D1F] truncate block"><?= htmlspecialchars($p['name']) ?></span>
                                            <span class="text-[11px] text-[#64748B] font-medium"><?= $it['quantity'] ?> × <?= formatPrice($it['unit_price']) ?></span>
                                        </div>
                                    </div>
                                    <span class="text-xs font-black text-[#1D1D1F] shrink-0"><?= formatPrice($it['line_total']) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <!-- Lignes de Calcul -->
                        <div class="space-y-2 text-xs pt-3 border-t border-slate-100">
                            <div class="flex justify-between text-[#64748B]">
                                <span>Sous-total</span>
                                <span class="font-bold text-[#1D1D1F]" id="display-subtotal"><?= formatPrice($initialTotals['subtotal']) ?></span>
                            </div>

                            <?php if ($initialTotals['discount_total'] > 0): ?>
                                <div class="flex justify-between text-emerald-700 font-bold">
                                    <span>Remise coupon (<?= htmlspecialchars($initialTotals['coupon']['code'] ?? '') ?>)</span>
                                    <span>- <?= formatPrice($initialTotals['discount_total']) ?></span>
                                </div>
                            <?php endif; ?>

                            <div class="flex justify-between text-[#64748B]">
                                <span>Livraison express</span>
                                <span class="font-bold text-[#1D1D1F]" id="display-shipping"><?= formatPrice($initialTotals['delivery_fee']) ?></span>
                            </div>

                            <div class="flex justify-between items-baseline pt-3 border-t border-slate-100">
                                <div>
                                    <span class="font-black text-sm text-[#1D1D1F] block">Total Net</span>
                                    <span class="text-[10px] text-[#64748B] font-medium">TTC · Livraison incluse</span>
                                </div>
                                <span class="text-2xl font-black text-[#1677FF] tracking-tight" id="display-grand-total"><?= formatPrice($initialTotals['total']) ?></span>
                            </div>
                        </div>

                        <!-- Bouton Confirmer Desktop -->
                        <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer w-full hover:bg-[#0F67E5] active:scale-[0.98] text-white font-extrabold text-sm py-4 rounded-2xl shadow-apple-soft transition-all flex items-center justify-center gap-2">
                            <i data-lucide="shield-check" class="w-4 h-4"></i>
                            <span>Confirmer la Commande</span>
                        </button>

                        <!-- Piliers de Confiance Apple -->
                        <div class="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-[#64748B]">
                            <div class="flex items-center gap-2">
                                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                                <span>Garantie 12 mois avec remplacement express à neuf</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="lock" class="w-4 h-4 text-blue-600 shrink-0"></i>
                                <span>Paiement 100% sécurisé Wave, OM ou à la remise</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="message-circle" class="w-4 h-4 text-[#25D366] shrink-0"></i>
                                <span>Assistance WhatsApp 7j/7 au <?= defined('WHATSAPP_DISPLAY') ? WHATSAPP_DISPLAY : '+221 78 131 64 97' ?></span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <!-- ─── MOBILE STICKY BUY BAR (Barre d'action inférieure sur smartphone) ─── -->
            <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 px-4 py-3 z-40 shadow-[0_-8px_25px_rgba(15,23,42,0.1)] flex items-center justify-between gap-3" style="padding-bottom: max(12px, env(safe-area-inset-bottom));">
                <div class="min-w-0">
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total à payer</span>
                    <span class="text-lg font-black text-[#1677FF] tracking-tight block leading-tight" id="mobile-display-total"><?= formatPrice($initialTotals['total']) ?></span>
                </div>
                <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer flex-1 max-w-[220px] py-3.5 px-4 rounded-2xl text-white font-black text-xs sm:text-sm active:scale-95 shadow-apple-soft transition-all flex items-center justify-center gap-2">
                    <span>Valider</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
            </div>

        </form>

    </div>
</div>

<!-- ─── MODAL D'ATTENTE RASSURANTE / LABOR ILLUSION ─── -->
<div id="checkout-processing-modal" style="display: none;" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6 animate-fade-in">
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-[#1677FF]/20 border-t-[#1677FF] animate-spin"></div>
            <div class="w-12 h-12 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shadow-inner">
                <i data-lucide="shield-check" class="w-6 h-6 animate-pulse"></i>
            </div>
        </div>
        
        <div class="space-y-2">
            <h3 class="text-base sm:text-lg font-black text-[#1D1D1F] tracking-tight" id="processing-title">Sécurisation de votre commande...</h3>
            <p class="text-xs text-[#64748B] leading-relaxed" id="processing-desc">Chiffrement TLS 256-bit et réservation des stocks.</p>
        </div>

        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div id="processing-bar" class="h-full bg-gradient-to-r from-[#1677FF] via-[#0B54C2] to-emerald-600 transition-all duration-700 rounded-full" style="width: 20%;"></div>
        </div>

        <div class="space-y-2">
            <div class="flex items-center justify-center gap-2 text-[11px] font-bold text-[#64748B]">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Passerelle Certifiée Wave, Orange Money & SenTechPLUS</span>
            </div>
            <!-- Bouton d'Assistance de Secours (> 10 secondes) -->
            <div id="processing-fallback-help" style="display: none;" class="pt-2 animate-fade-in">
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20ma%20commande%20semble%20bloqu%C3%A9e%20au%20chargement." target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-[#25D366] hover:underline inline-flex items-center gap-1">
                    <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                    <span>Connexion lente ? Obtenir de l'aide sur WhatsApp</span>
                </a>
            </div>
        </div>
    </div>
</div>

<script>
const baseSubtotal = <?= (float)$initialTotals['subtotal'] ?>;
const discountTotal = <?= (float)$initialTotals['discount_total'] ?>;
let currentShippingFee = <?= (float)$initialTotals['delivery_fee'] ?>;

function handleCheckoutSubmit(form, e) {
    const submitBtns = form.querySelectorAll('button[type="submit"]');
    submitBtns.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
    });

    const modal = document.getElementById('checkout-processing-modal');
    if (!modal) return true;

    // Délai de grâce de 300ms pour éviter l'effet glitch
    setTimeout(() => {
        modal.style.display = 'flex';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        const title = document.getElementById('processing-title');
        const desc = document.getElementById('processing-desc');
        const bar = document.getElementById('processing-bar');
        const fallbackHelp = document.getElementById('processing-fallback-help');

        // Étape 1 : 1.2s
        setTimeout(() => {
            if (bar) bar.style.width = '50%';
            if (title) title.textContent = 'Connexion à la passerelle Wave / OM...';
            if (desc) desc.textContent = 'Génération du code marchand et sécurisation de la session.';
        }, 1200);

        // Étape 2 : 2.8s
        setTimeout(() => {
            if (bar) bar.style.width = '80%';
            if (title) title.textContent = 'Attribution de votre N° de commande...';
            if (desc) desc.textContent = 'Réservation de votre créneau de livraison express.';
        }, 2800);

        // Étape 3 : 5.0s
        setTimeout(() => {
            if (bar) bar.style.width = '95%';
            if (title) title.textContent = 'Finalisation en cours...';
            if (desc) desc.textContent = 'Redirection vers votre confirmation.';
        }, 5000);

        // Étape 4 : > 10.0s
        setTimeout(() => {
            if (fallbackHelp) fallbackHelp.style.display = 'block';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 10000);
    }, 300);

    return true;
}

function updateDeliveryMethod(fee) {
    currentShippingFee = fee;
    recalculateTotal();
}

function updateDeliveryZone(region) {
    const zoneInput = document.getElementById('input-delivery-zone');
    if (region === 'Thiès') {
        zoneInput.value = 'zone_thies';
        currentShippingFee = 3500;
    } else if (region === 'Saint-Louis') {
        zoneInput.value = 'zone_stlouis';
        currentShippingFee = 4500;
    } else if (region === 'Autre Région') {
        zoneInput.value = 'zone_regions';
        currentShippingFee = 5000;
    } else {
        zoneInput.value = 'zone_dakar';
        currentShippingFee = 3000;
    }
    recalculateTotal();
}

function recalculateTotal() {
    const total = Math.max(0, baseSubtotal - discountTotal + currentShippingFee);
    const feeStr = currentShippingFee.toLocaleString('fr-FR') + ' FCFA';
    const totalStr = total.toLocaleString('fr-FR') + ' FCFA';
    
    const dispShip = document.getElementById('display-shipping');
    if (dispShip) dispShip.textContent = feeStr;
    
    const dispTotal = document.getElementById('display-grand-total');
    if (dispTotal) dispTotal.textContent = totalStr;

    const mobTotal = document.getElementById('mobile-display-total');
    if (mobTotal) mobTotal.textContent = totalStr;
}

function fillSavedAddress(jsonStr) {
    if (!jsonStr) return;
    try {
        const addr = JSON.parse(jsonStr);
        if (addr.first_name) document.getElementById('c-fn').value = addr.first_name;
        if (addr.last_name) document.getElementById('c-ln').value = addr.last_name;
        if (addr.phone) document.getElementById('c-phone').value = addr.phone;
        if (addr.city) document.getElementById('c-city').value = addr.city;
        if (addr.district) document.getElementById('c-dist').value = addr.district;
        if (addr.street) document.getElementById('c-addr').value = addr.street;
        if (addr.landmark) document.getElementById('c-land').value = addr.landmark;
    } catch(e) {}
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
