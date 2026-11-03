<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';

// Handle Store Approval / Rejection
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Session expirée ou jeton CSRF invalide.";
    } else {
        $sid = sanitize($_POST['store_id'] ?? '');
        $action = $_POST['action'];

        if (!$pdo) {
            $message = "Connexion MySQL inactive. Impossible de modifier la boutique.";
        } elseif ($sid) {
            try {
                if ($action === 'approve') {
                    $pdo->prepare("UPDATE stores SET status = 'approved', is_active = 1 WHERE id = :id")->execute([':id' => $sid]);
                    $message = "Boutique approuvée avec succès !";
                } elseif ($action === 'reject') {
                    $pdo->prepare("UPDATE stores SET status = 'rejected', is_active = 0 WHERE id = :id")->execute([':id' => $sid]);
                    $message = "Boutique rejetée.";
                }
            } catch (Throwable $e) {
                $message = "Erreur lors de la modification de la boutique.";
            }
        }
    }
}


// Fetch all stores
$stores = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT s.*, u.name as owner_name, u.email as owner_email 
                             FROM stores s 
                             LEFT JOIN users u ON s.user_id = u.id 
                             ORDER BY s.created_at DESC");
        $stores = $stmt ? $stmt->fetchAll() : [];
    } catch (Throwable $e) {
        $stores = [];
    }
}

if (empty($stores)) {
    $stores = [
        [
            'id' => 'store_1',
            'name' => 'Dakar Tech Hub',
            'username' => 'dakar-tech',
            'owner_name' => 'Moussa Ndiaye',
            'owner_email' => 'moussa@example.com',
            'phone' => '+221 77 555 12 34',
            'status' => 'approved',
            'is_active' => 1,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'store_2',
            'name' => 'Almadies Gadgets Pro',
            'username' => 'almadies-gadgets',
            'owner_name' => 'Fatou Sow',
            'owner_email' => 'fatou@example.com',
            'phone' => '+221 78 444 88 99',
            'status' => 'pending',
            'is_active' => 0,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ];
}

$pageTitle = "Gestion des Boutiques Vendeurs";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex flex-col bg-[#F3F7FC]">
    
    <header class="bg-[#182230] text-white py-4 px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <a href="index.php" class="text-xs font-bold text-blue-400 hover:underline cursor-pointer transition-colors duration-200">← Dashboard Admin</a>
            <h1 class="text-sm font-extrabold">Validation des Boutiques Vendeurs</h1>
        </div>
    </header>

    <div class="max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">

        <?php if ($message): ?>
            <div class="p-4 bg-emerald-50 text-[#0D7D53] text-xs font-bold rounded-xl border border-emerald-200">
                <?= htmlspecialchars($message) ?>
            </div>
        <?php endif; ?>

        <div class="card-clean p-6 space-y-4">
            <h2 class="text-sm font-extrabold text-[#182230]">Demandes de Boutiques (<?= count($stores) ?>)</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b border-[#E8EDF3] text-[#667085] font-bold">
                            <th class="pb-3">Boutique</th>
                            <th class="pb-3">Propriétaire</th>
                            <th class="pb-3">Contact</th>
                            <th class="pb-3">Adresse</th>
                            <th class="pb-3">Statut</th>
                            <th class="pb-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#E8EDF3]">
                        <?php foreach ($stores as $st): ?>
                            <tr class="hover:bg-[#F8FAFC] transition-colors duration-200 cursor-default">
                                <td class="py-3 font-bold text-[#182230]">
                                    <?= htmlspecialchars($st['name']) ?>
                                    <span class="text-[10px] text-[#667085] block">@<?= htmlspecialchars($st['username']) ?></span>
                                </td>
                                <td class="py-3 font-medium text-[#182230]"><?= htmlspecialchars($st['owner_name'] ?: $st['owner_email']) ?></td>
                                <td class="py-3 text-[#667085]"><?= htmlspecialchars($st['contact']) ?></td>
                                <td class="py-3 text-[#667085] max-w-[180px] truncate"><?= htmlspecialchars($st['address']) ?></td>
                                <td class="py-3">
                                    <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase <?= $st['status'] === 'approved' ? 'bg-emerald-100 text-[#0D7D53]' : ($st['status'] === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800') ?>">
                                        <?= htmlspecialchars($st['status']) ?>
                                    </span>
                                </td>
                                <td class="py-3 text-right space-x-2">
                                    <?php if ($st['status'] !== 'approved'): ?>
                                        <form method="POST" action="stores.php" class="inline">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="approve">
                                            <input type="hidden" name="store_id" value="<?= htmlspecialchars($st['id']) ?>">
                                            <button type="submit" class="btn-electric py-1 px-2.5 text-[11px] cursor-pointer focus:ring-2 focus:ring-white duration-200 transition-colors">Approuver</button>
                                        </form>
                                    <?php endif; ?>
                                    <?php if ($st['status'] !== 'rejected'): ?>
                                        <form method="POST" action="stores.php" class="inline">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="reject">
                                            <input type="hidden" name="store_id" value="<?= htmlspecialchars($st['id']) ?>">
                                            <button type="submit" class="text-xs font-bold text-rose-600 hover:underline cursor-pointer duration-200 transition-colors focus:ring-2 focus:ring-rose-500">Rejeter</button>
                                        </form>
                                    <?php endif; ?>
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
