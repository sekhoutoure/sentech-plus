<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';

// Handle Coupon Create / Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Session expirée ou jeton CSRF invalide.";
    } else {
        $action = $_POST['action'] ?? '';
        
        if (!$pdo) {
            $message = "Connexion MySQL inactive. Impossible d'effectuer cette modification.";
        } elseif ($action === 'create_coupon') {
            $code = strtoupper(sanitize($_POST['code'] ?? ''));
            $description = sanitize($_POST['description'] ?? '');
            $discount = (float)($_POST['discount'] ?? 10);
            $expiresAt = $_POST['expires_at'] ?? date('Y-12-31 23:59:59');


        if (!empty($code) && $discount > 0) {
            $stmt = $pdo->prepare("INSERT INTO coupons (code, description, discount, for_new_user, for_member, is_public, expires_at) 
                                   VALUES (:code, :desc, :disc, 0, 0, 1, :exp) 
                                   ON DUPLICATE KEY UPDATE discount = :disc, description = :desc, expires_at = :exp");
            $stmt->execute([
                ':code' => $code,
                ':desc' => $description,
                ':disc' => $discount,
                ':exp' => $expiresAt
            ]);
            $message = "Code promo '{$code}' créé/mis à jour avec succès !";
        }
    } elseif ($action === 'delete_coupon') {
        $code = sanitize($_POST['code'] ?? '');
        if ($code) {
            $pdo->prepare("DELETE FROM coupons WHERE code = :c")->execute([':c' => $code]);
            $message = "Code promo supprimé.";
        }
    }
    }
}

// Fetch all coupons
$coupons = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM coupons ORDER BY created_at DESC");
        $coupons = $stmt ? $stmt->fetchAll() : [];
    } catch (Throwable $e) {
        $coupons = [];
    }
}
if (empty($coupons)) {
    $coupons = [
        ['code' => 'BIENVENUE10', 'description' => '10% de réduction nouveaux clients', 'discount' => 10, 'expires_at' => '2026-12-31 23:59:59'],
        ['code' => 'SENTECH15', 'description' => '15% de réduction High-Tech', 'discount' => 15, 'expires_at' => '2026-12-31 23:59:59'],
        ['code' => 'NEW20', 'description' => '20% de remise spéciale lancement', 'discount' => 20, 'expires_at' => '2026-12-31 23:59:59'],
        ['code' => 'SENTECH-VIP10', 'description' => 'Cadeau fidélité -10%', 'discount' => 10, 'expires_at' => '2026-12-31 23:59:59'],
    ];
}

$pageTitle = "Gestion des Codes Promo";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex flex-col bg-[#F3F7FC]">
    
    <header class="bg-[#182230] text-white py-4 px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <a href="index.php" class="text-xs font-bold text-blue-400 hover:underline">← Dashboard Admin</a>
            <h1 class="text-sm font-extrabold">Gestion des Codes Promo</h1>
        </div>
    </header>

    <div class="max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">

        <?php if ($message): ?>
            <div class="p-4 bg-emerald-50 text-[#0D7D53] text-xs font-bold rounded-xl border border-emerald-200">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <!-- Form Add Coupon -->
        <div class="card-clean p-6 space-y-4">
            <h2 class="text-sm font-extrabold text-[#182230] pb-2 border-b border-[#E8EDF3]">Créer un Nouveau Code Promo</h2>
            <form method="POST" action="coupons.php" class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="create_coupon">
                
                <div>
                    <label for="admin-coupon-code" class="block font-bold mb-1">Code Promo *</label>
                    <input id="admin-coupon-code" type="text" name="code" required placeholder="Ex: SENTECH15" class="w-full bg-[#F3F7FC] border p-2.5 rounded-xl font-bold uppercase">
                </div>

                <div>
                    <label for="admin-coupon-discount" class="block font-bold mb-1">Réduction (%) *</label>
                    <input id="admin-coupon-discount" type="number" name="discount" required placeholder="15" step="0.5" class="w-full bg-[#F3F7FC] border p-2.5 rounded-xl font-bold">
                </div>

                <div>
                    <label for="admin-coupon-expires" class="block font-bold mb-1">Date d'expiration *</label>
                    <input id="admin-coupon-expires" type="date" name="expires_at" value="2028-12-31" class="w-full bg-[#F3F7FC] border p-2.5 rounded-xl">
                </div>

                <div>
                    <label for="admin-coupon-desc" class="block font-bold mb-1">Description</label>
                    <input id="admin-coupon-desc" type="text" name="description" placeholder="15% de réduction High-Tech" class="w-full bg-[#F3F7FC] border p-2.5 rounded-xl">
                </div>

                <div class="sm:col-span-4">
                    <button type="submit" class="btn-electric py-2.5 text-xs">Ajouter le Code Promo</button>
                </div>
            </form>
        </div>

        <!-- Coupons List Table -->
        <div class="card-clean p-6 space-y-4">
            <h2 class="text-sm font-extrabold text-[#182230]">Codes Promo Actifs (<?= count($coupons) ?>)</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-[#E8EDF3] text-[#667085] font-bold">
                            <th class="pb-3">Code</th>
                            <th class="pb-3">Description</th>
                            <th class="pb-3">Réduction</th>
                            <th class="pb-3">Expiration</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#E8EDF3]">
                        <?php foreach ($coupons as $c): ?>
                            <tr>
                                <td class="py-3 font-mono font-black text-[#1677FF]"><?= htmlspecialchars($c['code']) ?></td>
                                <td class="py-3 font-medium text-[#182230]"><?= htmlspecialchars($c['description']) ?></td>
                                <td class="py-3 font-extrabold text-[#0D7D53]">-<?= $c['discount'] ?>%</td>
                                <td class="py-3 text-[#667085]"><?= date('d/m/Y', strtotime($c['expires_at'])) ?></td>
                                <td class="py-3 text-right">
                                    <form method="POST" action="coupons.php" class="inline" onsubmit="return confirm('Supprimer ce code promo ?');">
                                        <?= getCSRFInputField() ?>
                                        <input type="hidden" name="action" value="delete_coupon">
                                        <input type="hidden" name="code" value="<?= htmlspecialchars($c['code']) ?>">
                                        <button type="submit" class="text-rose-500 font-bold hover:underline cursor-pointer">Supprimer</button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

</div>
<script>lucide.createIcons();</script>
</body>
</html>
