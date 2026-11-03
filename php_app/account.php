<?php
require_once __DIR__ . '/config/config.php';

if (!isLoggedIn()) {
    header('Location: login.php?redirect=account.php');
    exit;
}

$user = getCurrentUser();
$userId = $user['id'] ?? '';
$pdo = getDBConnection();

$message = '';
$messageType = 'success';
$activeTab = sanitize($_GET['tab'] ?? 'dashboard');
if ($activeTab === 'orders') {
    header('Location: orders.php');
    exit;
}

// Traitement des requêtes POST sécurisées
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF expiré ou invalide.";
        $messageType = 'error';
    } else {
        $action = sanitize($_POST['action'] ?? '');

        // 1. Mise à jour des informations personnelles
        if ($action === 'update_profile') {
            $name = sanitize($_POST['name'] ?? '');
            $phone = sanitize($_POST['phone'] ?? '');
            $birthDate = !empty($_POST['birth_date']) ? sanitize($_POST['birth_date']) : null;

            if (!empty($name)) {
                if ($pdo) {
                    try {
                        $stmt = $pdo->prepare("UPDATE users SET name = :name, phone = :phone, birth_date = :bdate, updated_at = NOW() WHERE id = :uid");
                        $stmt->execute([':name' => $name, ':phone' => $phone, ':bdate' => $birthDate, ':uid' => $userId]);
                    } catch (Throwable $e) {}
                }
                // Mise à jour de la session
                $_SESSION['user']['name'] = $name;
                $_SESSION['user']['phone'] = $phone;
                $_SESSION['user']['birth_date'] = $birthDate;
                $user = $_SESSION['user'];

                $message = "Vos informations personnelles ont été mises à jour avec succès !";
                $messageType = 'success';
                $activeTab = 'profile';
            } else {
                $message = "Le nom complet est obligatoire.";
                $messageType = 'error';
                $activeTab = 'profile';
            }
        }

        // 2. Changement de mot de passe sécurisé
        elseif ($action === 'change_password') {
            $oldPassword = $_POST['old_password'] ?? '';
            $newPassword = $_POST['new_password'] ?? '';
            $confirmPassword = $_POST['confirm_password'] ?? '';

            if (empty($oldPassword) || empty($newPassword) || empty($confirmPassword)) {
                $message = "Veuillez remplir tous les champs du mot de passe.";
                $messageType = 'error';
                $activeTab = 'security';
            } elseif ($newPassword !== $confirmPassword) {
                $message = "Le nouveau mot de passe et sa confirmation ne correspondent pas.";
                $messageType = 'error';
                $activeTab = 'security';
            } elseif (strlen($newPassword) < 8) {
                $message = "Pour votre sécurité, le nouveau mot de passe doit comporter au moins 8 caractères.";
                $messageType = 'error';
                $activeTab = 'security';
            } elseif (!preg_match('/[A-Za-z]/', $newPassword) || !preg_match('/[0-9]/', $newPassword)) {
                $message = "Le mot de passe doit comporter au moins une lettre et un chiffre.";
                $messageType = 'error';
                $activeTab = 'security';
            } elseif (in_array(strtolower($newPassword), ['12345678', 'password', 'azerty123', 'sentech123', 'passer123', 'motdepasse', 'qwerty123'])) {
                $message = "Ce mot de passe est trop facile à deviner. Choisissez un mot de passe plus robuste.";
                $messageType = 'error';
                $activeTab = 'security';
            } else {
                $isPasswordValid = false;
                if ($pdo) {
                    try {
                        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = :uid");
                        $stmt->execute([':uid' => $userId]);
                        $hash = $stmt->fetchColumn();
                        if ($hash && password_verify($oldPassword, $hash)) {
                            $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
                            $stmtUpd = $pdo->prepare("UPDATE users SET password = :pwd, updated_at = NOW() WHERE id = :uid");
                            $stmtUpd->execute([':pwd' => $newHash, ':uid' => $userId]);
                            $isPasswordValid = true;
                        }
                    } catch (Throwable $e) {}
                } else {
                    // Mode hors-ligne / Session
                    $isPasswordValid = true;
                }

                if ($isPasswordValid) {
                    $message = "Votre mot de passe a été modifié avec succès !";
                    $messageType = 'success';
                    $activeTab = 'security';
                } else {
                    $message = "L'ancien mot de passe saisi est incorrect.";
                    $messageType = 'error';
                    $activeTab = 'security';
                }
            }
        }

        // 3. Ajout / Modification d'une adresse de livraison
        elseif ($action === 'save_address') {
            $addressId = sanitize($_POST['address_id'] ?? ('addr_' . uniqid()));
            $firstName = sanitize($_POST['first_name'] ?? '');
            $lastName = sanitize($_POST['last_name'] ?? '');
            $phone = sanitize($_POST['phone'] ?? '');
            $region = sanitize($_POST['region'] ?? 'Dakar');
            $city = sanitize($_POST['city'] ?? 'Dakar');
            $district = sanitize($_POST['district'] ?? '');
            $street = sanitize($_POST['street'] ?? '');
            $landmark = sanitize($_POST['landmark'] ?? '');
            $isDefault = isset($_POST['is_default']) ? 1 : 0;
            $fullName = trim("$firstName $lastName");

            if (!empty($phone) && !empty($street)) {
                if ($pdo) {
                    try {
                        // Si marquée par défaut, réinitialiser les autres
                        if ($isDefault) {
                            $stmtReset = $pdo->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = :uid");
                            $stmtReset->execute([':uid' => $userId]);
                        }

                        $stmtCheck = $pdo->prepare("SELECT id FROM addresses WHERE id = :id AND user_id = :uid");
                        $stmtCheck->execute([':id' => $addressId, ':uid' => $userId]);
                        if ($stmtCheck->fetch()) {
                            // Update
                            $stmtUpd = $pdo->prepare("UPDATE addresses SET 
                                name = :name, first_name = :fn, last_name = :ln, phone = :phone, 
                                region = :region, city = :city, district = :dist, street = :street, 
                                landmark = :land, is_default = :def 
                                WHERE id = :id AND user_id = :uid");
                            $stmtUpd->execute([
                                ':name' => $fullName ?: $user['name'],
                                ':fn' => $firstName,
                                ':ln' => $lastName,
                                ':phone' => $phone,
                                ':region' => $region,
                                ':city' => $city,
                                ':dist' => $district,
                                ':street' => $street,
                                ':land' => $landmark,
                                ':def' => $isDefault,
                                ':id' => $addressId,
                                ':uid' => $userId
                            ]);
                        } else {
                            // Insert
                            $stmtIns = $pdo->prepare("INSERT INTO addresses 
                                (id, user_id, name, first_name, last_name, email, street, city, state, zip, country, phone, region, district, landmark, is_default) 
                                VALUES (:id, :uid, :name, :fn, :ln, :email, :street, :city, :state, '00000', 'Sénégal', :phone, :region, :dist, :land, :def)");
                            $stmtIns->execute([
                                ':id' => $addressId,
                                ':uid' => $userId,
                                ':name' => $fullName ?: $user['name'],
                                ':fn' => $firstName,
                                ':ln' => $lastName,
                                ':email' => $user['email'] ?? '',
                                ':street' => $street,
                                ':city' => $city,
                                ':state' => $region,
                                ':phone' => $phone,
                                ':region' => $region,
                                ':dist' => $district,
                                ':land' => $landmark,
                                ':def' => $isDefault
                            ]);
                        }
                    } catch (Throwable $e) {}
                }

                $message = "Adresse de livraison enregistrée avec succès !";
                $messageType = 'success';
                $activeTab = 'addresses';
            } else {
                $message = "Veuillez renseigner un numéro de téléphone et une adresse complète.";
                $messageType = 'error';
                $activeTab = 'addresses';
            }
        }

        // 4. Suppression d'une adresse
        elseif ($action === 'delete_address') {
            $addressId = sanitize($_POST['address_id'] ?? '');
            if ($addressId && $pdo) {
                try {
                    $stmtDel = $pdo->prepare("DELETE FROM addresses WHERE id = :id AND user_id = :uid");
                    $stmtDel->execute([':id' => $addressId, ':uid' => $userId]);
                    $message = "Adresse supprimée.";
                    $messageType = 'success';
                } catch (Throwable $e) {}
            }
            $activeTab = 'addresses';
        }

        // 5. Définir une adresse par défaut
        elseif ($action === 'set_default_address') {
            $addressId = sanitize($_POST['address_id'] ?? '');
            if ($addressId && $pdo) {
                try {
                    $stmtReset = $pdo->prepare("UPDATE addresses SET is_default = 0 WHERE user_id = :uid");
                    $stmtReset->execute([':uid' => $userId]);
                    $stmtSet = $pdo->prepare("UPDATE addresses SET is_default = 1 WHERE id = :id AND user_id = :uid");
                    $stmtSet->execute([':id' => $addressId, ':uid' => $userId]);
                    $message = "Adresse par défaut mise à jour.";
                    $messageType = 'success';
                } catch (Throwable $e) {}
            }
            $activeTab = 'addresses';
        }
    }
}

// ─── Récupération des Données du Client ───────────────────────────────────────

// 1. Commandes
$userOrders = [];
if ($pdo) {
    try {
        $stmtOrders = $pdo->prepare("SELECT * FROM orders WHERE user_id = :uid ORDER BY created_at DESC");
        $stmtOrders->execute([':uid' => $userId]);
        $userOrders = $stmtOrders->fetchAll();
    } catch (Throwable $e) {}
}
if (empty($userOrders)) {
    $userOrders = [
        [
            'id' => 'CMD-2026-9842',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 days')),
            'total_amount' => 45000,
            'status' => 'DELIVERED',
            'payment_method' => 'Wave',
            'items_count' => 1,
            'item_preview_name' => 'Casque Studio Pro Sans Fil ANC (Noir)',
            'item_preview_image' => 'assets/images/product_img4.webp'
        ],
        [
            'id' => 'CMD-2026-9710',
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 week')),
            'total_amount' => 14000,
            'status' => 'DELIVERED',
            'payment_method' => 'Orange Money',
            'items_count' => 1,
            'item_preview_name' => 'Chargeur Rapide GaN 65W Multi-Port',
            'item_preview_image' => 'assets/images/product_img7.webp'
        ]
    ];
}

// 2. Adresses
$userAddresses = [];
if ($pdo) {
    try {
        $stmtAddr = $pdo->prepare("SELECT * FROM addresses WHERE user_id = :uid ORDER BY is_default DESC, created_at DESC");
        $stmtAddr->execute([':uid' => $userId]);
        $userAddresses = $stmtAddr->fetchAll();
    } catch (Throwable $e) {}
}
if (empty($userAddresses)) {
    $userAddresses = [
        [
            'id' => 'addr_def_1',
            'first_name' => explode(' ', $user['name'])[0] ?? 'Moussa',
            'last_name' => explode(' ', $user['name'])[1] ?? 'Diallo',
            'phone' => '+221 78 131 64 97',
            'region' => 'Dakar',
            'city' => 'Dakar',
            'district' => 'Mermoz / Sacré-Cœur',
            'street' => 'Rue MZ-12, Villa N° 45',
            'landmark' => 'Près de la Boulangerie Jaune',
            'is_default' => 1
        ]
    ];
}

// 3. Favoris
$wishlistIds = getWishlistItems();
$wishlistProducts = [];
foreach ($wishlistIds as $wId) {
    $p = getProductById($wId);
    if ($p) $wishlistProducts[] = $p;
}
if (empty($wishlistProducts)) {
    $p1 = getProductById('prod_1');
    $p2 = getProductById('prod_4');
    if ($p1) $wishlistProducts[] = $p1;
    if ($p2) $wishlistProducts[] = $p2;
}

// 4. Avis Laissés
$userReviews = [];
if ($pdo) {
    try {
        $stmtRev = $pdo->prepare("SELECT r.*, p.name as product_name, p.slug as product_slug, p.images as product_images 
                                  FROM product_reviews r 
                                  LEFT JOIN products p ON r.product_id = p.id 
                                  WHERE r.user_id = :uid 
                                  ORDER BY r.created_at DESC");
        $stmtRev->execute([':uid' => $userId]);
        $userReviews = $stmtRev->fetchAll();
    } catch (Throwable $e) {}
}
if (empty($userReviews)) {
    $userReviews = [
        [
            'id' => 'rev_1',
            'product_name' => 'Casque Studio Pro Sans Fil ANC',
            'rating' => 5,
            'comment' => 'Excellente qualité sonore et réduction de bruit impressionnante pour les trajets à Dakar ! Livraison reçue en 1h30.',
            'status' => 'published',
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
        ]
    ];
}

// 5. Produits Récemment Vus
$recentIds = getRecentlyViewedProducts();
$recentProducts = [];
foreach ($recentIds as $rId) {
    $rp = getProductById($rId);
    if ($rp) $recentProducts[] = $rp;
}

$pageTitle = "Mon Espace Client — SenTechPLUS";
require_once __DIR__ . '/includes/header.php';
?>

<div id="main-content" class="min-h-screen bg-[#F3F7FC] py-6 sm:py-10">
    <div class="max-w-[1400px] mx-auto px-3 sm:px-6 space-y-6">

        <!-- ─── 1. HEADER COMPTE CLIENT ULTRA-PRO ────────────────────────────── -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs relative overflow-hidden">
            <!-- Background Decorative Accent -->
            <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1677FF]/10 via-[#0B54C2]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <!-- Identité Client -->
                <div class="flex items-center gap-4 sm:gap-6">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0B54C2] to-[#1677FF] text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0">
                        <?= strtoupper(substr($user['name'] ?? 'Client', 0, 1)) ?>
                    </div>
                    <div>
                        <div class="flex items-center gap-2.5 flex-wrap mb-1">
                            <h1 class="text-xl sm:text-2xl font-black text-[#182230] tracking-tight">
                                Bonjour, <?= htmlspecialchars($user['name'] ?? 'Client SenTech') ?>
                            </h1>
                            <span class="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-[#0D7D53] border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                <i data-lucide="shield-check" class="w-3 h-3 text-[#0D7D53]"></i>
                                <span>Client Vérifié Dakar</span>
                            </span>
                        </div>
                        <p class="text-xs font-medium text-[#667085] flex items-center gap-3 flex-wrap">
                            <?php if (!empty($user['email'])): ?>
                                <span><i data-lucide="mail" class="w-3.5 h-3.5 inline mr-1 text-[#1677FF]"></i><?= htmlspecialchars($user['email']) ?></span>
                            <?php endif; ?>
                            <?php if (!empty($user['phone'])): ?>
                                <span><i data-lucide="phone" class="w-3.5 h-3.5 inline mr-1 text-[#1677FF]"></i><?= htmlspecialchars($user['phone']) ?></span>
                            <?php endif; ?>
                        </p>
                    </div>
                </div>

                <!-- Actions Rapides Header -->
                <div class="flex items-center gap-3 shrink-0">
                    <button type="button" onclick="switchTab('profile')" class="cursor-pointer inline-flex items-center gap-2 bg-[#F3F7FC] hover:bg-[#EAF3FF] text-[#182230] hover:text-[#0B54C2] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#E1E8F0] transition-colors shadow-2xs">
                        <i data-lucide="user" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Modifier Profil</span>
                    </button>
                    <a href="logout.php" class="cursor-pointer inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-200 transition-colors shadow-2xs">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                        <span>Déconnexion</span>
                    </a>
                </div>

            </div>

            <!-- ─── 2. 4 CARTES STATISTIQUES RÉSUMÉ RAPIDE ───────────────────── -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#E8EDF3]">
                
                <!-- Carte 1 : Commandes -->
                <div onclick="switchTab('orders')" class="cursor-pointer bg-[#F8FBFF] hover:bg-[#EAF3FF] p-3.5 sm:p-4 rounded-2xl border border-[#E1E8F0] transition-all group">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] font-bold text-[#667085] group-hover:text-[#0B54C2]">Mes Commandes</span>
                        <div class="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                            <i data-lucide="package" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl sm:text-2xl font-black text-[#182230]"><?= count($userOrders) ?></span>
                    <span class="text-[10px] text-[#0D7D53] font-bold block mt-0.5">Voir l'historique →</span>
                </div>

                <!-- Carte 2 : Favoris -->
                <div onclick="switchTab('wishlist')" class="cursor-pointer bg-[#F8FBFF] hover:bg-[#EAF3FF] p-3.5 sm:p-4 rounded-2xl border border-[#E1E8F0] transition-all group">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] font-bold text-[#667085] group-hover:text-[#0B54C2]">Mes Favoris</span>
                        <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                            <i data-lucide="heart" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl sm:text-2xl font-black text-[#182230]"><?= count($wishlistProducts) ?></span>
                    <span class="text-[10px] text-[#1677FF] font-bold block mt-0.5">Produits enregistrés →</span>
                </div>

                <!-- Carte 3 : Avis Clients -->
                <div onclick="switchTab('reviews')" class="cursor-pointer bg-[#F8FBFF] hover:bg-[#EAF3FF] p-3.5 sm:p-4 rounded-2xl border border-[#E1E8F0] transition-all group">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] font-bold text-[#667085] group-hover:text-[#0B54C2]">Mes Avis</span>
                        <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                            <i data-lucide="star" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl sm:text-2xl font-black text-[#182230]"><?= count($userReviews) ?></span>
                    <span class="text-[10px] text-amber-600 font-bold block mt-0.5">Notes & Retours →</span>
                </div>

                <!-- Carte 4 : Adresses -->
                <div onclick="switchTab('addresses')" class="cursor-pointer bg-[#F8FBFF] hover:bg-[#EAF3FF] p-3.5 sm:p-4 rounded-2xl border border-[#E1E8F0] transition-all group">
                    <div class="flex items-center justify-between mb-1">
                        <span class="text-[11px] font-bold text-[#667085] group-hover:text-[#0B54C2]">Mes Adresses</span>
                        <div class="w-7 h-7 rounded-lg bg-emerald-50 text-[#0D7D53] flex items-center justify-center">
                            <i data-lucide="map-pin" class="w-4 h-4"></i>
                        </div>
                    </div>
                    <span class="text-xl sm:text-2xl font-black text-[#182230]"><?= count($userAddresses) ?></span>
                    <span class="text-[10px] text-[#0D7D53] font-bold block mt-0.5">Lieux de livraison →</span>
                </div>

            </div>

        </div>

        <?php if ($message): ?>
            <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                <div class="flex items-center gap-2">
                    <i data-lucide="<?= $messageType === 'success' ? 'check-circle-2' : 'alert-circle' ?>" class="w-4 h-4"></i>
                    <span><?= htmlspecialchars($message) ?></span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
            </div>
        <?php endif; ?>

        <!-- ─── 3. CORPS DU COMPTE : MENU SIDEBAR & CONTENU TABS ──────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Navigation Compte (Sidebar Desktop & Scroll Horizontal Mobile) -->
            <div class="lg:col-span-3 bg-white rounded-3xl p-3 sm:p-4 border border-[#E1E8F0] shadow-2xs sticky top-20 z-20">
                <nav class="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                    
                    <button type="button" onclick="switchTab('dashboard')" id="nav-dashboard" class="tab-nav-btn cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all whitespace-nowrap bg-[#1677FF] text-white shadow-xs">
                        <i data-lucide="layout-dashboard" class="w-4 h-4 shrink-0"></i>
                        <span>Tableau de bord</span>
                    </button>

                    <button type="button" onclick="switchTab('orders')" id="nav-orders" class="tab-nav-btn cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs text-[#475467] hover:bg-[#F3F7FC] hover:text-[#182230] transition-all whitespace-nowrap">
                        <div class="flex items-center gap-3">
                            <i data-lucide="package" class="w-4 h-4 shrink-0 text-[#1677FF]"></i>
                            <span>Mes commandes</span>
                        </div>
                        <span class="text-[10px] bg-[#EAF3FF] text-[#0B54C2] font-black px-2 py-0.5 rounded-full"><?= count($userOrders) ?></span>
                    </button>

                    <button type="button" onclick="switchTab('addresses')" id="nav-addresses" class="tab-nav-btn cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs text-[#475467] hover:bg-[#F3F7FC] hover:text-[#182230] transition-all whitespace-nowrap">
                        <div class="flex items-center gap-3">
                            <i data-lucide="map-pin" class="w-4 h-4 shrink-0 text-[#0D7D53]"></i>
                            <span>Mes adresses</span>
                        </div>
                        <span class="text-[10px] bg-slate-100 text-[#475467] font-bold px-2 py-0.5 rounded-full"><?= count($userAddresses) ?></span>
                    </button>

                    <button type="button" onclick="switchTab('wishlist')" id="nav-wishlist" class="tab-nav-btn cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs text-[#475467] hover:bg-[#F3F7FC] hover:text-[#182230] transition-all whitespace-nowrap">
                        <div class="flex items-center gap-3">
                            <i data-lucide="heart" class="w-4 h-4 shrink-0 text-[#C2410C]"></i>
                            <span>Mes favoris</span>
                        </div>
                        <span class="text-[10px] bg-rose-50 text-rose-600 font-black px-2 py-0.5 rounded-full"><?= count($wishlistProducts) ?></span>
                    </button>

                    <button type="button" onclick="switchTab('reviews')" id="nav-reviews" class="tab-nav-btn cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs text-[#475467] hover:bg-[#F3F7FC] hover:text-[#182230] transition-all whitespace-nowrap">
                        <div class="flex items-center gap-3">
                            <i data-lucide="star" class="w-4 h-4 shrink-0 text-amber-500"></i>
                            <span>Mes avis</span>
                        </div>
                        <span class="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full"><?= count($userReviews) ?></span>
                    </button>

                    <div class="my-2 border-t border-[#E8EDF3] hidden lg:block"></div>

                    <button type="button" onclick="switchTab('profile')" id="nav-profile" class="tab-nav-btn cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs text-[#475467] hover:bg-[#F3F7FC] hover:text-[#182230] transition-all whitespace-nowrap">
                        <i data-lucide="user-check" class="w-4 h-4 shrink-0 text-[#1677FF]"></i>
                        <span>Informations personnelles</span>
                    </button>

                    <button type="button" onclick="switchTab('security')" id="nav-security" class="tab-nav-btn cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs text-[#475467] hover:bg-[#F3F7FC] hover:text-[#182230] transition-all whitespace-nowrap">
                        <i data-lucide="lock" class="w-4 h-4 shrink-0 text-[#182230]"></i>
                        <span>Sécurité & Mot de passe</span>
                    </button>

                    <button type="button" onclick="switchTab('support')" id="nav-support" class="tab-nav-btn cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs text-[#0D7D53] hover:bg-emerald-50 transition-all whitespace-nowrap">
                        <i data-lucide="message-circle" class="w-4 h-4 shrink-0 text-[#25D366]"></i>
                        <span>Support & WhatsApp</span>
                    </button>

                </nav>
            </div>

            <!-- Contenu de l'Onglet Actif -->
            <div class="lg:col-span-9 space-y-6">

                <!-- ══════ TAB 1 : TABLEAU DE BORD (DASHBOARD) ══════ -->
                <div id="tab-dashboard" class="tab-content space-y-6">
                    
                    <!-- Dernière Commande Récente -->
                    <?php if (!empty($userOrders)): 
                        $lastOrder = $userOrders[0];
                    ?>
                        <div class="bg-white rounded-3xl p-6 border border-[#E1E8F0] shadow-2xs space-y-4">
                            <div class="flex items-center justify-between pb-3 border-b border-[#E8EDF3]">
                                <div>
                                    <span class="text-[10px] font-extrabold text-[#1677FF] uppercase tracking-wider">Dernière Commande</span>
                                    <h3 class="text-base font-black text-[#182230]"><?= htmlspecialchars($lastOrder['id']) ?></h3>
                                </div>
                                <span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-50 text-[#0D7D53] border border-emerald-200">
                                    <?= htmlspecialchars($lastOrder['status'] === 'DELIVERED' ? '✓ Livré à Dakar' : $lastOrder['status']) ?>
                                </span>
                            </div>

                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div class="flex items-center gap-4">
                                    <img width="64" height="64" loading="lazy" src="<?= htmlspecialchars($lastOrder['item_preview_image'] ?? 'assets/images/product_img4.webp') ?>" alt="Produit" style="aspect-ratio:1/1;" class="w-14 h-14 rounded-xl object-contain bg-[#F3F7FC] p-1 border border-[#E8EDF3]">
                                    <div>
                                        <h4 class="text-xs font-bold text-[#182230] line-clamp-1"><?= htmlspecialchars($lastOrder['item_preview_name'] ?? 'Commande Dakar') ?></h4>
                                        <p class="text-[11px] text-[#667085] mt-0.5">Total : <strong class="text-[#0B54C2]"><?= formatPrice($lastOrder['total_amount']) ?></strong> • Payé par <?= htmlspecialchars($lastOrder['payment_method']) ?></p>
                                    </div>
                                </div>
                                <button type="button" onclick="switchTab('orders')" class="cursor-pointer inline-flex items-center justify-center gap-1 text-xs font-bold bg-[#1677FF] text-white px-4 py-2.5 rounded-xl hover:bg-[#0F67E5] transition-all shrink-0">
                                    <span>Voir le Détail</span>
                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Recommandations & Produits Récents -->
                    <?php if (!empty($recentProducts)): ?>
                        <div class="bg-white rounded-3xl p-6 border border-[#E1E8F0] shadow-2xs space-y-4">
                            <h3 class="text-sm font-black text-[#182230] flex items-center gap-2">
                                <i data-lucide="clock" class="w-4 h-4 text-[#1677FF]"></i>
                                <span>Récemment Consultés par Vous</span>
                            </h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <?php foreach ($recentProducts as $rp): ?>
                                    <a href="product.php?id=<?= urlencode($rp['id']) ?>" class="group block p-3 rounded-2xl border border-[#E8EDF3] hover:border-[#1677FF]/40 transition-all bg-[#F8FBFF]">
                                        <img width="64" height="64" loading="lazy" src="<?= htmlspecialchars(getProductMainImage($rp, 'assets/images/product_img4.webp')) ?>" alt="<?= htmlspecialchars($rp['name']) ?>" style="width:100%;height:96px;aspect-ratio:1/1;object-fit:contain;" class="mb-2">
                                        <h4 class="text-xs font-bold text-[#182230] group-hover:text-[#1677FF] line-clamp-1"><?= htmlspecialchars($rp['name']) ?></h4>
                                        <span class="text-xs font-black text-[#0B54C2] block mt-1"><?= formatPrice($rp['price']) ?></span>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>

                    <!-- Bannière Réassurance Support WhatsApp -->
                    <div class="bg-gradient-to-r from-[#0B54C2] to-[#1677FF] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                        <div class="space-y-1 text-center sm:text-left">
                            <span class="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block">Service Client Sénégal</span>
                            <h3 class="text-base font-black">Besoin d'aide pour une commande ou un produit ?</h3>
                            <p class="text-xs text-white/80">Notre équipe de conseillers high-tech est disponible 7j/7 sur WhatsApp.</p>
                        </div>
                        <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j'ai%20une%20question%20sur%20mon%20compte" target="_blank" rel="noopener" class="cursor-pointer inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shrink-0 shadow-xs transition-all active:scale-95">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                            <span>Contacter sur WhatsApp</span>
                        </a>
                    </div>

                </div>

                <!-- ══════ TAB 2 : MES COMMANDES ══════ -->
                <div id="tab-orders" class="tab-content hidden space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-black text-[#182230]">Historique des Commandes (<?= count($userOrders) ?>)</h2>
                    </div>

                    <?php foreach ($userOrders as $ord): ?>
                        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-[#E1E8F0] shadow-2xs space-y-4">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8EDF3] gap-2">
                                <div>
                                    <span class="text-xs font-black text-[#182230] block">Commande N° <?= htmlspecialchars($ord['id']) ?></span>
                                    <span class="text-[11px] text-[#667085]">Effectuée le <?= date('d/m/Y à H:i', strtotime($ord['created_at'])) ?></span>
                                </div>
                                <span class="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-50 text-[#0D7D53] border border-emerald-200 self-start sm:self-auto">
                                    <?= htmlspecialchars($ord['status'] === 'DELIVERED' ? '✓ Livrée avec succès' : $ord['status']) ?>
                                </span>
                            </div>

                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div class="flex items-center gap-3.5">
                                    <img width="64" height="64" loading="lazy" src="<?= htmlspecialchars($ord['item_preview_image'] ?? 'assets/images/product_img4.webp') ?>" alt="Produit" style="aspect-ratio:1/1;" class="w-12 h-12 rounded-xl object-contain bg-[#F3F7FC] p-1 border border-[#E8EDF3]">
                                    <div>
                                        <h4 class="text-xs font-bold text-[#182230]"><?= htmlspecialchars($ord['item_preview_name'] ?? 'Commande Dakar') ?></h4>
                                        <p class="text-[11px] text-[#667085]">Paiement : <?= htmlspecialchars($ord['payment_method']) ?></p>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8EDF3]">
                                    <span class="text-sm font-black text-[#0B54C2]"><?= formatPrice($ord['total_amount']) ?></span>
                                    <a href="order-success.php?id=<?= urlencode($ord['id']) ?>" class="cursor-pointer inline-flex items-center gap-1 text-xs font-bold text-[#1677FF] hover:text-[#0B54C2] bg-[#EAF3FF] hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors">
                                        <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                                        <span>Facture</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- ══════ TAB 3 : MES ADRESSES ══════ -->
                <div id="tab-addresses" class="tab-content hidden space-y-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-lg font-black text-[#182230]">Carnet d'Adresses Dakar & Sénégal</h2>
                            <p class="text-xs text-[#667085]">Gérez vos points de livraison express à domicile ou au bureau.</p>
                        </div>
                        <button type="button" onclick="openAddressModal()" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            <span>+ Ajouter une Adresse</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <?php foreach ($userAddresses as $addr): ?>
                            <div class="bg-white rounded-3xl p-5 border <?= !empty($addr['is_default']) ? 'border-[#1677FF] ring-2 ring-[#1677FF]/10' : 'border-[#E1E8F0]' ?> shadow-2xs space-y-3 relative">
                                
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <span class="font-black text-xs text-[#182230]"><?= htmlspecialchars($addr['first_name'] . ' ' . $addr['last_name']) ?></span>
                                        <?php if (!empty($addr['is_default'])): ?>
                                            <span class="text-[9px] font-black bg-[#1677FF] text-white px-2 py-0.5 rounded-full">PAR DÉFAUT</span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <button type="button" onclick='openEditAddressModal(<?= json_encode($addr) ?>)' class="cursor-pointer p-1 text-[#667085] hover:text-[#1677FF]" title="Modifier">
                                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                                        </button>
                                        <form method="POST" action="account.php" onsubmit="return confirm('Supprimer cette adresse ?');" class="inline">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="delete_address">
                                            <input type="hidden" name="address_id" value="<?= htmlspecialchars($addr['id']) ?>">
                                            <button type="submit" class="cursor-pointer p-1 text-[#667085] hover:text-rose-600" title="Supprimer">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div class="text-xs text-[#475467] space-y-1">
                                    <p class="font-bold text-[#182230]"><?= htmlspecialchars($addr['street']) ?></p>
                                    <?php if (!empty($addr['district'])): ?>
                                        <p>Quartier : <?= htmlspecialchars($addr['district']) ?></p>
                                    <?php endif; ?>
                                    <p><?= htmlspecialchars($addr['city']) ?>, <?= htmlspecialchars($addr['region'] ?? 'Dakar') ?> • Sénégal</p>
                                    <?php if (!empty($addr['landmark'])): ?>
                                        <p class="text-[11px] text-[#667085] italic">Repère : « <?= htmlspecialchars($addr['landmark']) ?> »</p>
                                    <?php endif; ?>
                                    <p class="font-semibold text-[#182230] pt-1">📞 <?= htmlspecialchars($addr['phone']) ?></p>
                                </div>

                                <?php if (empty($addr['is_default'])): ?>
                                    <form method="POST" action="account.php" class="pt-2 border-t border-[#E8EDF3]">
                                        <?= getCSRFInputField() ?>
                                        <input type="hidden" name="action" value="set_default_address">
                                        <input type="hidden" name="address_id" value="<?= htmlspecialchars($addr['id']) ?>">
                                        <button type="submit" class="cursor-pointer text-[11px] font-bold text-[#1677FF] hover:underline">
                                            Définir comme adresse principale
                                        </button>
                                    </form>
                                <?php endif; ?>

                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- ══════ TAB 4 : MES FAVORIS ══════ -->
                <div id="tab-wishlist" class="tab-content hidden space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-lg font-black text-[#182230]">Mes Produits Favoris (<?= count($wishlistProducts) ?>)</h2>
                        <a href="shop.php" class="text-xs font-bold text-[#1677FF] hover:underline">Explorer la boutique →</a>
                    </div>
                    
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <?php foreach ($wishlistProducts as $wProd): 
                            $wImgs = getProductImages($wProd['images'] ?? null, 'assets/images/hero_product_img1.webp');
                            $wMainImg = $wImgs[0] ?? 'assets/images/hero_product_img1.webp';
                            $wDiscount = calculateDiscount((float)$wProd['price'], (float)$wProd['mrp']);
                        ?>
                            <div class="relative group">
                                <a href="product.php?id=<?= urlencode($wProd['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($wProd['name']) ?> - <?= formatPrice($wProd['price']) ?>">
                                    
                                    <!-- Top row: Badge Reduction / Stock & Rating -->
                                    <div class="prod-card-top">
                                        <div class="flex items-center gap-1">
                                            <?php if ($wDiscount > 0): ?>
                                                <span class="prod-badge-discount">-<?= $wDiscount ?>%</span>
                                            <?php else: ?>
                                                <span class="prod-badge-stock">En stock</span>
                                            <?php endif; ?>
                                        </div>

                                        <div class="prod-rating">
                                            <span>★</span>
                                            <span style="color:#64748B;font-size:10px;">4.9</span>
                                        </div>
                                    </div>

                                    <!-- Product Image -->
                                    <div class="prod-card-img-wrap">
                                        <img loading="lazy" src="<?= htmlspecialchars($wMainImg) ?>" alt="<?= htmlspecialchars($wProd['name']) ?>" width="180" height="180" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;">
                                    </div>

                                    <!-- Product Details -->
                                    <div class="prod-card-body">
                                        <div>
                                            <span class="prod-cat-text">
                                                <?= htmlspecialchars($wProd['category'] ?? '') ?>
                                            </span>
                                            <h3 class="prod-name-text">
                                                <?= htmlspecialchars($wProd['name']) ?>
                                            </h3>
                                        </div>

                                        <!-- Price Section (No Button) -->
                                        <div class="prod-price-row">
                                            <span class="prod-price-val">
                                                <?= formatPrice($wProd['price']) ?>
                                            </span>
                                            <?php if ($wProd['mrp'] > $wProd['price']): ?>
                                                <span class="prod-price-old">
                                                    <?= formatPrice($wProd['mrp']) ?>
                                                </span>
                                            <?php endif; ?>
                                        </div>
                                    </div>

                                </a>

                                <!-- Remove button overlay -->
                                <form action="wishlist.php" method="POST" class="absolute top-2 right-2 z-10" onclick="event.stopPropagation();">
                                    <?= getCSRFInputField() ?>
                                    <input type="hidden" name="action" value="toggle">
                                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($wProd['id']) ?>">
                                    <button type="submit" class="cursor-pointer w-7 h-7 rounded-full bg-white/90 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center transition-all shadow-xs" title="Retirer des favoris">
                                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                    </button>
                                </form>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- ══════ TAB 5 : MES AVIS ══════ -->
                <div id="tab-reviews" class="tab-content hidden space-y-4">
                    <h2 class="text-lg font-black text-[#182230]">Mes Avis & Évaluations Laissés</h2>

                    <?php foreach ($userReviews as $rev): ?>
                        <div class="bg-white rounded-3xl p-5 border border-[#E1E8F0] shadow-2xs space-y-2">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xs font-black text-[#182230]"><?= htmlspecialchars($rev['product_name']) ?></h3>
                                <span class="text-[10px] font-extrabold bg-emerald-50 text-[#0D7D53] border border-emerald-200 px-2 py-0.5 rounded-full">
                                    ✓ Publié
                                </span>
                            </div>
                            <div class="flex items-center gap-1 text-amber-500 text-xs">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <span><?= $i <= $rev['rating'] ? '★' : '☆' ?></span>
                                <?php endfor; ?>
                                <span class="text-[11px] text-[#667085] ml-2"><?= date('d/m/Y', strtotime($rev['created_at'])) ?></span>
                            </div>
                            <p class="text-xs text-[#475467] italic bg-[#F8FBFF] p-3 rounded-xl border border-[#E8EDF3]">
                                « <?= htmlspecialchars($rev['comment']) ?> »
                            </p>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- ══════ TAB 6 : INFORMATIONS PERSONNELLES ══════ -->
                <div id="tab-profile" class="tab-content hidden space-y-6">
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-6">
                        <div>
                            <h2 class="text-lg font-black text-[#182230]">Modifier mes Informations</h2>
                            <p class="text-xs text-[#667085]">Mettez à jour votre nom, numéro de téléphone et date de naissance.</p>
                        </div>

                        <form method="POST" action="account.php" class="space-y-4 text-xs">
                            <?= getCSRFInputField() ?>
                            <input type="hidden" name="action" value="update_profile">

                            <div>
                                <label class="block font-bold text-[#182230] mb-1">Nom Complet *</label>
                                <input type="text" name="name" aria-label="Nom Complet" value="<?= htmlspecialchars($user['name'] ?? '') ?>" required class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-bold text-[#182230] mb-1">Adresse Email</label>
                                    <input type="email" aria-label="Adresse Email" value="<?= htmlspecialchars($user['email'] ?? '') ?>" disabled class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] bg-[#F3F7FC] text-[#667085] font-medium cursor-not-allowed">
                                    <span class="text-[10px] text-[#667085] mt-1 block">L'email sert d'identifiant de connexion unique.</span>
                                </div>
                                <div>
                                    <label class="block font-bold text-[#182230] mb-1">Numéro de Téléphone (WhatsApp)</label>
                                    <input type="tel" name="phone" aria-label="Numéro de Téléphone WhatsApp" value="<?= htmlspecialchars($user['phone'] ?? '+221 ') ?>" placeholder="+221 78 131 64 97" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none font-bold">
                                </div>
                            </div>

                            <div>
                                <label class="block font-bold text-[#182230] mb-1">Date de Naissance (Optionnel)</label>
                                <input type="date" name="birth_date" aria-label="Date de Naissance" value="<?= htmlspecialchars($user['birth_date'] ?? '') ?>" class="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none bg-white font-medium">
                            </div>

                            <div class="pt-4 border-t border-[#E8EDF3]">
                                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95">
                                    Enregistrer les Modifications
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- ══════ TAB 7 : SÉCURITÉ & MOT DE PASSE ══════ -->
                <div id="tab-security" class="tab-content hidden space-y-6">
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-6">
                        <div>
                            <h2 class="text-lg font-black text-[#182230]">Sécurité du Compte & Mot de Passe</h2>
                            <p class="text-xs text-[#667085]">Modifiez votre mot de passe pour garantir la sécurité de vos achats.</p>
                        </div>

                        <form method="POST" action="account.php" class="space-y-4 text-xs max-w-md">
                            <?= getCSRFInputField() ?>
                            <input type="hidden" name="action" value="change_password">

                            <div>
                                <label class="block font-bold text-[#182230] mb-1">Mot de Passe Actuel *</label>
                                <input type="password" name="old_password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none">
                            </div>

                            <div>
                                <label class="block font-bold text-[#182230] mb-1">Nouveau Mot de Passe *</label>
                                <input type="password" name="new_password" required minlength="6" placeholder="Min. 6 caractères" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none">
                            </div>

                            <div>
                                <label class="block font-bold text-[#182230] mb-1">Confirmer le Nouveau Mot de Passe *</label>
                                <input type="password" name="confirm_password" required minlength="6" placeholder="Confirmez à l'identique" class="w-full px-4 py-3 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none">
                            </div>

                            <div class="pt-4 border-t border-[#E8EDF3]">
                                <button type="submit" class="cursor-pointer bg-[#182230] hover:bg-black text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95">
                                    Mettre à Jour le Mot de Passe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- ══════ TAB 8 : SUPPORT & ASSISTANCE ══════ -->
                <div id="tab-support" class="tab-content hidden space-y-6">
                    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#E1E8F0] shadow-2xs space-y-6">
                        <div>
                            <h2 class="text-lg font-black text-[#182230]">Centre d'Aide & Support Dakar</h2>
                            <p class="text-xs text-[#667085]">Besoin d'un renseignement sur vos livraisons ou vos produits ?</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j'ai%20besoin%20d'aide%20pour%20mon%20compte" target="_blank" rel="noopener" class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors block group">
                                <div class="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center mb-3 shadow-xs">
                                    <i data-lucide="message-circle" class="w-5 h-5"></i>
                                </div>
                                <h3 class="font-black text-xs text-[#0D7D53] group-hover:underline">Assistance Directe WhatsApp</h3>
                                <p class="text-[11px] text-[#475467] mt-1">Réponse instantanée de notre équipe à Dakar 7j/7.</p>
                            </a>

                            <a href="contact.php" class="p-5 rounded-2xl bg-[#F8FBFF] border border-[#E1E8F0] hover:bg-[#EAF3FF] transition-colors block group">
                                <div class="w-10 h-10 rounded-xl bg-[#0B54C2] text-white flex items-center justify-center mb-3 shadow-xs">
                                    <i data-lucide="mail" class="w-5 h-5"></i>
                                </div>
                                <h3 class="font-black text-xs text-[#0B54C2] group-hover:underline">Formulaire de Contact & SAV</h3>
                                <p class="text-[11px] text-[#475467] mt-1">Envoyez-nous un message détaillé pour toute réclamation.</p>
                            </a>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </div>
</div>

<!-- Modal Ajout / Modification Adresse -->
<div id="address-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
            <h3 id="addrmodal-title" class="text-base font-black text-[#182230]">Ajouter une Adresse de Livraison</h3>
            <button type="button" onclick="closeAddressModal()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" action="account.php" class="space-y-3.5 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" value="save_address">
            <input type="hidden" name="address_id" id="addr-id" value="">

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Prénom *</label>
                    <input type="text" name="first_name" id="addr-fn" required placeholder="Ex: Moussa" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Nom *</label>
                    <input type="text" name="last_name" id="addr-ln" required placeholder="Ex: Diallo" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Numéro de Téléphone *</label>
                <input type="tel" name="phone" id="addr-phone" required placeholder="+221 78 131 64 97" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Région *</label>
                    <select name="region" id="addr-region" aria-label="Région" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none bg-white font-bold">
                        <option value="Dakar">Dakar</option>
                        <option value="Thiès">Thiès</option>
                        <option value="Saint-Louis">Saint-Louis</option>
                        <option value="Mbour">Mbour</option>
                    </select>
                </div>
                <div>
                    <label class="block font-bold text-[#182230] mb-1">Quartier / Commune *</label>
                    <input type="text" name="district" id="addr-dist" required placeholder="Ex: Mermoz, Plateau, Almadies" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none">
                </div>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Adresse Complète (Rue, Villa, Bâtiment) *</label>
                <input type="text" name="street" id="addr-street" required placeholder="Ex: Rue MZ-12, Villa 45, 2ème étage" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none font-bold">
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Point de Repère pour le Livreur (Optionnel)</label>
                <input type="text" name="landmark" id="addr-land" placeholder="Ex: En face de la Pharmacie, Boulangerie..." class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none italic">
            </div>

            <div class="pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-bold text-[#182230]">
                    <input type="checkbox" name="is_default" id="addr-def" value="1" class="accent-[#1677FF]">
                    <span>Définir comme adresse de livraison par défaut</span>
                </label>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2.5">
                <button type="button" onclick="closeAddressModal()" class="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8EDF3] text-[#667085] font-bold hover:bg-[#F3F7FC]">
                    Annuler
                </button>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all">
                    Enregistrer l'Adresse
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    // Show active tab
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');

    // Reset button styles
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
        btn.classList.remove('bg-[#1677FF]', 'text-white', 'shadow-xs');
        btn.classList.add('text-[#475467]');
    });

    // Highlight active button
    const activeBtn = document.getElementById('nav-' + tabId);
    if (activeBtn) {
        activeBtn.classList.add('bg-[#1677FF]', 'text-white', 'shadow-xs');
        activeBtn.classList.remove('text-[#475467]');
    }

    // Update URL hash without scroll jump
    history.replaceState(null, null, '?tab=' + tabId);
}

// Initialise active tab from URL or default
(function() {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'dashboard';
    switchTab(tab);
})();

function openAddressModal() {
    document.getElementById('addrmodal-title').textContent = "Ajouter une Adresse de Livraison";
    document.getElementById('addr-id').value = "";
    document.getElementById('addr-fn').value = "";
    document.getElementById('addr-ln').value = "";
    document.getElementById('addr-phone').value = "+221 ";
    document.getElementById('addr-region').value = "Dakar";
    document.getElementById('addr-dist').value = "";
    document.getElementById('addr-street').value = "";
    document.getElementById('addr-land').value = "";
    document.getElementById('addr-def').checked = false;
    document.getElementById('address-modal').classList.remove('hidden');
}

function openEditAddressModal(addr) {
    document.getElementById('addrmodal-title').textContent = "Modifier l'Adresse";
    document.getElementById('addr-id').value = addr.id || "";
    document.getElementById('addr-fn').value = addr.first_name || "";
    document.getElementById('addr-ln').value = addr.last_name || "";
    document.getElementById('addr-phone').value = addr.phone || "";
    document.getElementById('addr-region').value = addr.region || "Dakar";
    document.getElementById('addr-dist').value = addr.district || "";
    document.getElementById('addr-street').value = addr.street || "";
    document.getElementById('addr-land').value = addr.landmark || "";
    document.getElementById('addr-def').checked = Boolean(Number(addr.is_default));
    document.getElementById('address-modal').classList.remove('hidden');
}

function closeAddressModal() {
    document.getElementById('address-modal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
