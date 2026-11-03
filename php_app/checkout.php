<?php
require_once __DIR__ . '/config/config.php';

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

$defaultAddress = $savedAddresses[0] ?? null;

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
        $paymentMethod = sanitize($_POST['payment_method'] ?? 'cod');
        $saveAddress = isset($_POST['save_address']) && $userId;

        if (empty($firstName) || empty($phone) || empty($address)) {
            $message = "Veuillez renseigner votre prénom, numéro de téléphone et adresse complète.";
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

                // Redirection vers passerelle de paiement (PayTech / Wave / Orange Money / Carte) ou confirmation directe
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

<div id="main-content" class="min-h-screen bg-[#F3F7FC] py-6 sm:py-10">
    <div class="max-w-[1400px] mx-auto px-3 sm:px-6 space-y-6">

        <!-- ─── ÉTAPES DU TUNNEL DE COMMANDE ─────────────────────────────────── -->
        <div class="bg-white rounded-3xl p-4 sm:p-5 border border-[#E1E8F0] shadow-2xs">
            <div class="flex items-center justify-between max-w-2xl mx-auto text-xs font-black">
                
                <div class="flex items-center gap-2 text-[#0D7D53]">
                    <div class="w-7 h-7 rounded-full bg-emerald-100 text-[#0D7D53] flex items-center justify-center text-xs font-black">✓</div>
                    <span class="hidden sm:inline">1. Panier</span>
                </div>

                <div class="h-0.5 w-12 bg-[#1677FF]"></div>

                <div class="flex items-center gap-2 text-[#1677FF]">
                    <div class="w-7 h-7 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-black shadow-xs">2</div>
                    <span>2. Livraison & Paiement</span>
                </div>

                <div class="h-0.5 w-12 bg-slate-200"></div>

                <div class="flex items-center gap-2 text-[#667085]">
                    <div class="w-7 h-7 rounded-full bg-slate-100 text-[#667085] flex items-center justify-center text-xs font-black">3</div>
                    <span class="hidden sm:inline">3. Confirmation</span>
                </div>

            </div>
        </div>

        <?php if (!empty($_GET['payment_cancelled'])): ?>
            <div class="p-4 sm:p-5 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="text-xs font-black text-[#182230]">Session de paiement interrompue</h4>
                        <p class="text-[11px] text-[#667085]">Vous n'avez pas été débité. Vous pouvez réessayer avec Wave, Orange Money ou opter pour le paiement en espèces à la livraison.</p>
                    </div>
                </div>
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j'ai%20eu%20un%20souci%20avec%20mon%20paiement." target="_blank" rel="noopener noreferrer" class="cursor-pointer shrink-0 text-xs font-bold text-[#0B54C2] bg-white px-3.5 py-2 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs">
                    <i data-lucide="message-circle" class="w-4 h-4 text-[#25D366]"></i>
                    <span>Aide WhatsApp</span>
                </a>
            </div>
        <?php endif; ?>

        <?php if ($message): ?>
            <div class="p-4 rounded-2xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between shadow-2xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-4 h-4"></i>
                    <span><?= htmlspecialchars($message) ?></span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
            </div>
        <?php endif; ?>

        <!-- ─── FORMULAIRE DE COMMANDE & RÉSUMÉ ──────────────────────────────── -->
        <form method="POST" action="checkout.php" id="checkout-form" onsubmit="return handleCheckoutSubmit(this, event);" class="space-y-6">
            <?= getCSRFInputField() ?>
            
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <!-- Colonne Gauche : Formulaire (8 Cols) -->
                <div class="lg:col-span-8 space-y-6">
                    
                    <!-- 1. Coordonnées & Adresse de Livraison -->
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-5">
                        
                        <div class="flex items-center justify-between pb-3 border-b border-[#E8EDF3]">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-black text-xs">1</div>
                                <h2 class="text-sm font-black text-[#182230] uppercase tracking-wider">Adresse de Livraison au Sénégal</h2>
                            </div>
                            <?php if (isLoggedIn()): ?>
                                <span class="text-[11px] font-bold text-[#0D7D53] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    ✓ Connecté en tant que <?= htmlspecialchars(explode(' ', $user['name'])[0]) ?>
                                </span>
                            <?php endif; ?>
                        </div>

                        <!-- Sélecteur d'adresse sauvegardée -->
                        <?php if (!empty($savedAddresses)): ?>
                            <div class="p-3.5 bg-[#F8FBFF] rounded-2xl border border-[#E8EDF3] space-y-2">
                                <label class="block text-xs font-bold text-[#182230]">Choisir parmi vos adresses enregistrées :</label>
                                <select aria-label="Choisir une adresse enregistrée" onchange="fillSavedAddress(this.value)" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] bg-white text-xs font-bold outline-none cursor-pointer">
                                    <option value="">-- Saisir une nouvelle adresse --</option>
                                    <?php foreach ($savedAddresses as $idx => $sa): ?>
                                        <option value="<?= htmlspecialchars(json_encode($sa)) ?>" <?= !empty($sa['is_default']) ? 'selected' : '' ?>>
                                            <?= htmlspecialchars($sa['first_name'] . ' ' . $sa['last_name'] . ' - ' . $sa['street'] . ', ' . $sa['city']) ?> <?= !empty($sa['is_default']) ? '(Par défaut)' : '' ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        <?php endif; ?>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label for="c-fn" class="block font-bold text-[#182230] mb-1">Prénom *</label>
                                <input type="text" name="first_name" id="c-fn" value="<?= htmlspecialchars($defaultAddress['first_name'] ?? (explode(' ', $user['name'] ?? '')[0] ?? '')) ?>" required placeholder="Ex: Moussa" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                            </div>
                            <div>
                                <label for="c-ln" class="block font-bold text-[#182230] mb-1">Nom *</label>
                                <input type="text" name="last_name" id="c-ln" value="<?= htmlspecialchars($defaultAddress['last_name'] ?? (explode(' ', $user['name'] ?? '')[1] ?? '')) ?>" required placeholder="Ex: Diallo" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label for="c-phone" class="block font-bold text-[#182230] mb-1">Téléphone pour la livraison *</label>
                                <input type="tel" name="phone" id="c-phone" value="<?= htmlspecialchars($defaultAddress['phone'] ?? ($user['phone'] ?? '+221 ')) ?>" required placeholder="+221 78 131 64 97" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                                <span class="text-[10px] text-[#667085] mt-1 block">Le livreur vous appellera avant d'arriver.</span>
                            </div>
                            <div>
                                <label for="c-email" class="block font-bold text-[#182230] mb-1">Adresse Email (Optionnel)</label>
                                <input type="email" name="email" id="c-email" value="<?= htmlspecialchars($user['email'] ?? '') ?>" placeholder="Pour recevoir la facture PDF" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-medium">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                                <label for="c-region" class="block font-bold text-[#182230] mb-1">Région *</label>
                                <select name="region" id="c-region" onchange="updateDeliveryZone(this.value)" class="w-full px-3.5 py-3 rounded-xl border border-[#E8EDF3] bg-white font-bold outline-none cursor-pointer">
                                    <option value="Dakar" selected>Dakar</option>
                                    <option value="Thiès">Thiès</option>
                                    <option value="Saint-Louis">Saint-Louis</option>
                                    <option value="Autre Région">Autre Région</option>
                                </select>
                            </div>
                            <div>
                                <label for="c-city" class="block font-bold text-[#182230] mb-1">Ville *</label>
                                <input type="text" name="city" id="c-city" value="<?= htmlspecialchars($defaultAddress['city'] ?? 'Dakar') ?>" required placeholder="Dakar, Pikine, Rufisque..." class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                            </div>
                            <div>
                                <label for="c-dist" class="block font-bold text-[#182230] mb-1">Quartier / Commune *</label>
                                <input type="text" name="district" id="c-dist" value="<?= htmlspecialchars($defaultAddress['district'] ?? '') ?>" required placeholder="Mermoz, Plateau, Almadies..." class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                            </div>
                        </div>

                        <div class="text-xs">
                            <label for="c-addr" class="block font-bold text-[#182230] mb-1">Adresse Complète (Rue, Numéro de Villa, Étage) *</label>
                            <input type="text" name="address" id="c-addr" value="<?= htmlspecialchars($defaultAddress['street'] ?? '') ?>" required placeholder="Ex: Rue MZ-12, Villa N° 45, 2ème étage droite" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] outline-none font-bold">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label for="c-land" class="block font-bold text-[#182230] mb-1">Point de Repère Livreur (Optionnel)</label>
                                <input type="text" name="landmark" id="c-land" value="<?= htmlspecialchars($defaultAddress['landmark'] ?? '') ?>" placeholder="Ex: En face de la Pharmacie, Station Total..." class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] outline-none italic">
                            </div>
                            <div>
                                <label for="c-instructions" class="block font-bold text-[#182230] mb-1">Instructions de Livraison (Optionnel)</label>
                                <input type="text" name="instructions" id="c-instructions" placeholder="Ex: Appeler à l'interphone B4..." class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] outline-none">
                            </div>
                        </div>

                        <?php if (isLoggedIn()): ?>
                            <div class="pt-2">
                                <label class="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#182230]">
                                    <input type="checkbox" name="save_address" value="1" checked class="accent-[#1677FF]">
                                    <span>Sauvegarder cette adresse dans mon compte pour mes prochains achats</span>
                                </label>
                            </div>
                        <?php endif; ?>

                    </div>

                    <!-- 2. Mode de Livraison & Frais -->
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-5">
                        
                        <div class="flex items-center gap-3 pb-3 border-b border-[#E8EDF3]">
                            <div class="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-black text-xs">2</div>
                            <h2 class="text-sm font-black text-[#182230] uppercase tracking-wider">Option de Livraison</h2>
                        </div>

                        <input type="hidden" name="delivery_zone" id="input-delivery-zone" value="zone_dakar">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            <!-- Option 1 : Express Dakar H+2 -->
                            <label class="cursor-pointer flex items-start gap-3 p-4 rounded-2xl border-2 border-[#1677FF] bg-[#F8FBFF] relative shadow-2xs">
                                <input type="radio" name="delivery_method" value="express" checked onchange="updateDeliveryMethod(3000)" class="mt-1 accent-[#1677FF]">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-black text-[#182230]">Livraison Express H+2</span>
                                        <span class="text-[9px] font-extrabold bg-[#16C784]/15 text-[#0D7D53] px-2 py-0.2 rounded-full uppercase">Recommandé</span>
                                    </div>
                                    <p class="text-[11px] text-[#667085]">Livré en 2h à 4h à Dakar et banlieue</p>
                                    <span class="text-xs font-black text-[#0B54C2] block pt-1">3 000 FCFA</span>
                                </div>
                            </label>

                            <!-- Option 2 : Standard 24h -->
                            <label class="cursor-pointer flex items-start gap-3 p-4 rounded-2xl border border-[#E8EDF3] hover:border-[#1677FF]/40 bg-white relative transition-colors shadow-2xs">
                                <input type="radio" name="delivery_method" value="standard" onchange="updateDeliveryMethod(2000)" class="mt-1 accent-[#1677FF]">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-black text-[#182230]">Livraison Standard 24h</span>
                                    </div>
                                    <p class="text-[11px] text-[#667085]">Livré le jour ouvrable suivant</p>
                                    <span class="text-xs font-black text-[#0B54C2] block pt-1">2 000 FCFA</span>
                                </div>
                            </label>

                        </div>

                    </div>

                    <!-- 3. Méthode de Paiement Sécurisée -->
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-5">
                        
                        <div class="flex items-center gap-3 pb-3 border-b border-[#E8EDF3]">
                            <div class="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-black text-xs">3</div>
                            <h2 class="text-sm font-black text-[#182230] uppercase tracking-wider">Mode de Paiement</h2>
                        </div>

                        <div class="space-y-3">
                            
                            <!-- Mode 1 : Paiement à la Livraison -->
                            <label class="cursor-pointer flex items-center justify-between p-4 rounded-2xl border-2 border-[#1677FF] bg-[#F8FBFF] shadow-2xs">
                                <div class="flex items-center gap-3">
                                    <input type="radio" name="payment_method" value="cod" checked class="accent-[#1677FF]">
                                    <div>
                                        <span class="text-xs font-black text-[#182230] block">Paiement à la Livraison (Espèces ou Wave/OM)</span>
                                        <span class="text-[11px] text-[#667085]">Payez directement au livreur après vérification de votre colis.</span>
                                    </div>
                                </div>
                                <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#0D7D53] flex items-center justify-center shrink-0">
                                    <i data-lucide="hand-coins" class="w-4 h-4"></i>
                                </div>
                            </label>

                            <!-- Mode 2 : Wave Sénégal -->
                            <label class="cursor-pointer flex items-center justify-between p-4 rounded-2xl border border-[#E8EDF3] hover:border-[#1677FF]/40 bg-white transition-colors shadow-2xs">
                                <div class="flex items-center gap-3">
                                    <input type="radio" name="payment_method" value="wave" class="accent-[#1677FF]">
                                    <div>
                                        <span class="text-xs font-black text-[#182230] block">Wave Sénégal (Paiement Mobile)</span>
                                        <span class="text-[11px] text-[#667085]">Transfert direct sans frais au numéro officiel de la boutique.</span>
                                    </div>
                                </div>
                                <span class="text-xs font-black text-[#1FA2FF] bg-blue-50 px-2.5 py-1 rounded-lg">WAVE</span>
                            </label>

                            <!-- Mode 3 : Orange Money -->
                            <label class="cursor-pointer flex items-center justify-between p-4 rounded-2xl border border-[#E8EDF3] hover:border-[#1677FF]/40 bg-white transition-colors shadow-2xs">
                                <div class="flex items-center gap-3">
                                    <input type="radio" name="payment_method" value="om" class="accent-[#1677FF]">
                                    <div>
                                        <span class="text-xs font-black text-[#182230] block">Orange Money Sénégal</span>
                                        <span class="text-[11px] text-[#667085]">Paiement rapide via code marchand OM.</span>
                                    </div>
                                </div>
                                <span class="text-xs font-black text-[#FF7900] bg-orange-50 px-2.5 py-1 rounded-lg">OM</span>
                            </label>

                        </div>

                    </div>

                </div>

                <!-- Colonne Droite : Récapitulatif Sticky (4 Cols) -->
                <div class="lg:col-span-4 space-y-4 sticky top-20">
                    
                    <div class="bg-white rounded-3xl p-6 border border-[#E1E8F0] shadow-2xs space-y-5">
                        
                        <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider pb-3 border-b border-[#E8EDF3]">
                            Articles (<?= $initialTotals['items_count'] ?>)
                        </h3>

                        <!-- Mini Liste Articles -->
                        <div class="max-h-56 overflow-y-auto divide-y divide-[#E8EDF3] pr-1 space-y-2">
                            <?php foreach ($initialTotals['items'] as $it): 
                                $p = $it['product'];
                                $img = getProductMainImage($p, 'assets/images/product_img4.webp');
                            ?>
                                <div class="pt-2 first:pt-0 flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-2.5 min-w-0">
                                        <img src="<?= htmlspecialchars($img) ?>" alt="<?= htmlspecialchars($p['name']) ?> - SenTechPLUS" width="40" height="40" loading="lazy" style="aspect-ratio:1/1;" class="w-10 h-10 rounded-xl object-contain bg-[#F3F7FC] p-1 border border-[#E8EDF3] shrink-0">
                                        <div class="min-w-0">
                                            <span class="text-xs font-bold text-[#182230] truncate block"><?= htmlspecialchars($p['name']) ?></span>
                                            <span class="text-[10px] text-[#667085]"><?= $it['quantity'] ?> × <?= formatPrice($it['unit_price']) ?></span>
                                        </div>
                                    </div>
                                    <span class="text-xs font-black text-[#182230] shrink-0"><?= formatPrice($it['line_total']) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <!-- Calculs -->
                        <div class="space-y-2.5 text-xs pt-3 border-t border-[#E8EDF3]">
                            <div class="flex justify-between text-[#475467]">
                                <span>Sous-total</span>
                                <span class="font-bold text-[#182230]" id="display-subtotal"><?= formatPrice($initialTotals['subtotal']) ?></span>
                            </div>

                            <?php if ($initialTotals['discount_total'] > 0): ?>
                                <div class="flex justify-between text-[#0D7D53] font-bold">
                                    <span>Remise coupon (<?= htmlspecialchars($initialTotals['coupon']['code'] ?? '') ?>)</span>
                                    <span>- <?= formatPrice($initialTotals['discount_total']) ?></span>
                                </div>
                            <?php endif; ?>

                            <div class="flex justify-between text-[#475467]">
                                <span>Frais de livraison</span>
                                <span class="font-bold text-[#182230]" id="display-shipping"><?= formatPrice($initialTotals['delivery_fee']) ?></span>
                            </div>

                            <div class="flex justify-between items-center text-sm pt-3 border-t border-[#E8EDF3]">
                                <span class="font-black text-[#182230]">Total à payer</span>
                                <span class="text-xl font-black text-[#0B54C2]" id="display-grand-total"><?= formatPrice($initialTotals['total']) ?></span>
                            </div>
                        </div>

                        <!-- Bouton Confirmer Commande -->
                        <button type="submit" class="cursor-pointer w-full bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-sm py-4 rounded-full shadow-apple-soft transition-all active:scale-95 flex items-center justify-center gap-2">
                            <i data-lucide="check-circle" class="w-4 h-4"></i>
                            <span>Confirmer la Commande</span>
                        </button>

                        <div class="text-[10px] text-[#64748B] text-center space-y-1 pt-2 border-t border-slate-100">
                            <p>🔒 Vos données personnelles sont 100% protégées.</p>
                            <p>Assistance WhatsApp 7j/7 au <strong><?= defined('WHATSAPP_DISPLAY') ? WHATSAPP_DISPLAY : '+221 78 131 64 97' ?></strong></p>
                        </div>

                    </div>

                </div>

            </div>
        </form>

    </div>
</div>

<!-- ─── MODAL D'ATTENTE RASSURANTE / LABOR ILLUSION & PROGRESSIVE UX ─── -->
<div id="checkout-processing-modal" style="display: none;" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6 animate-fade-in">
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div class="absolute inset-0 rounded-full border-4 border-[#1677FF]/20 border-t-[#1677FF] animate-spin"></div>
            <div class="w-12 h-12 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shadow-inner">
                <i data-lucide="shield-check" class="w-6 h-6 animate-pulse"></i>
            </div>
        </div>
        
        <div class="space-y-2">
            <h3 class="text-base sm:text-lg font-black text-[#182230] tracking-tight" id="processing-title">Sécurisation de votre commande...</h3>
            <p class="text-xs text-[#667085] leading-relaxed" id="processing-desc">Chiffrement TLS 256-bit et vérification des stocks.</p>
        </div>

        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div id="processing-bar" class="h-full bg-gradient-to-r from-[#1677FF] via-[#0B54C2] to-[#0D7D53] transition-all duration-700 rounded-full" style="width: 20%;"></div>
        </div>

        <div class="space-y-2">
            <div class="flex items-center justify-center gap-2 text-[11px] font-bold text-[#667085]">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Passerelle Certifiée PayDunya & SenTechPLUS</span>
            </div>
            <!-- Bouton d'Assistance de Secours (> 12 secondes) -->
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
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    }

    const modal = document.getElementById('checkout-processing-modal');
    if (!modal) return true;

    // Règle d'or UX : Délai de grâce de 400ms pour éviter l'effet glitch sur réponses instantanées
    setTimeout(() => {
        modal.style.display = 'flex';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        const title = document.getElementById('processing-title');
        const desc = document.getElementById('processing-desc');
        const bar = document.getElementById('processing-bar');
        const fallbackHelp = document.getElementById('processing-fallback-help');

        // Étape 1 : 1.2s (Connexion Mobile Money)
        setTimeout(() => {
            if (bar) bar.style.width = '45%';
            if (title) title.textContent = 'Connexion à la passerelle Mobile Money...';
            if (desc) desc.textContent = 'Initialisation sécurisée Wave, Orange Money ou Carte.';
        }, 1200);

        // Étape 2 : 3.0s (Facturation & Reçu)
        setTimeout(() => {
            if (bar) bar.style.width = '75%';
            if (title) title.textContent = 'Génération de votre facture & SMS...';
            if (desc) desc.textContent = 'Attribution automatique du numéro de commande ST-XXXX.';
        }, 3000);

        // Étape 3 : 6.0s (Finalisation)
        setTimeout(() => {
            if (bar) bar.style.width = '92%';
            if (title) title.textContent = 'Finalisation dans quelques instants...';
            if (desc) desc.textContent = 'Redirection vers votre page de confirmation.';
        }, 6000);

        // Étape 4 : > 12.0s (Secours / Rassurance pour connexions très lentes)
        setTimeout(() => {
            if (fallbackHelp) fallbackHelp.style.display = 'block';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 12000);
    }, 350);

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
    document.getElementById('display-shipping').textContent = currentShippingFee.toLocaleString('fr-FR') + ' FCFA';
    document.getElementById('display-grand-total').textContent = total.toLocaleString('fr-FR') + ' FCFA';
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
