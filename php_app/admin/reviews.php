<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';
$messageType = 'success';

// Traitement POST : Modération d'un avis
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];
        $rid = sanitize($_POST['review_id'] ?? '');

        if ($action === 'update_status' && $rid && $pdo) {
            $newStatus = sanitize($_POST['status'] ?? 'published');
            try {
                $stmt = $pdo->prepare("UPDATE product_reviews SET status = :st WHERE id = :id");
                $stmt->execute([':st' => $newStatus, ':id' => $rid]);
                $message = "Statut de l'avis mis à jour.";
            } catch (Throwable $e) {}
        } elseif ($action === 'delete_review' && $rid && $pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM product_reviews WHERE id = :id");
                $stmt->execute([':id' => $rid]);
                $message = "Avis supprimé définitivement.";
            } catch (Throwable $e) {}
        }
    }
}

// Fetch all reviews
$reviews = [];
if ($pdo) {
    try {
        $stmtAll = $pdo->query("SELECT r.*, p.name as product_name, p.images as product_images 
                                FROM product_reviews r 
                                LEFT JOIN products p ON r.product_id = p.id 
                                ORDER BY r.created_at DESC");
        $reviews = $stmtAll ? $stmtAll->fetchAll() : [];
    } catch (Throwable $e) {
        $reviews = [];
    }
}

if (empty($reviews)) {
    $reviews = [
        [
            'id' => 'rev_1',
            'product_name' => 'Casque Studio Pro Sans Fil ANC',
            'user_name' => 'Moussa Diallo',
            'rating' => 5,
            'comment' => 'Excellente qualité sonore et réduction de bruit impressionnante pour les trajets à Dakar ! Livraison reçue en 1h30.',
            'status' => 'published',
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
        ],
        [
            'id' => 'rev_2',
            'product_name' => 'Chargeur Rapide GaN 65W Multi-Port',
            'user_name' => 'Awa Ndiaye',
            'rating' => 5,
            'comment' => 'Charge mon MacBook et mon iPhone en même temps à vitesse grand V. Produit 100% original.',
            'status' => 'published',
            'created_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
        ]
    ];
}

$pageTitle = "Modération des Avis Clients — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="star" class="w-4 h-4 text-amber-500"></i>
                <span>Modération des Avis Clients & Notes</span>
            </h1>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <div>
                <h2 class="text-2xl font-black text-[#182230]">Avis & Retours Clients (<?= count($reviews) ?>)</h2>
                <p class="text-xs text-[#667085] mt-1">Validez, publiez ou modérez les retours d'expérience sur vos produits.</p>
            </div>

            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-3.5 pl-5">Produit Concerné</th>
                                <th class="p-3.5">Auteur & Note</th>
                                <th class="p-3.5">Commentaire</th>
                                <th class="p-3.5">Statut</th>
                                <th class="p-3.5 pr-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php foreach ($reviews as $rev): ?>
                                <tr class="hover:bg-[#F8FBFF] transition-colors">
                                    <td class="p-3.5 pl-5 font-bold text-[#182230]">
                                        <?= htmlspecialchars($rev['product_name'] ?? 'Produit High-Tech') ?>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-bold text-[#182230] block"><?= htmlspecialchars($rev['user_name']) ?></span>
                                        <div class="flex items-center text-amber-500 text-xs mt-0.5">
                                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                                <span><?= $i <= $rev['rating'] ? '★' : '☆' ?></span>
                                            <?php endfor; ?>
                                        </div>
                                    </td>
                                    <td class="p-3.5 text-[#475467] italic max-w-sm">
                                        « <?= htmlspecialchars($rev['comment']) ?> »
                                    </td>
                                    <td class="p-3.5">
                                        <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full border <?= ($rev['status'] ?? '') === 'published' ? 'bg-emerald-50 text-[#0D7D53] border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200' ?>">
                                            <?= ($rev['status'] ?? '') === 'published' ? '✓ Publié' : '⏳ En attente' ?>
                                        </span>
                                    </td>
                                    <td class="p-3.5 pr-5 text-right">
                                        <div class="flex items-center justify-end gap-1.5">
                                            <form method="POST" action="reviews.php" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="update_status">
                                                <input type="hidden" name="review_id" value="<?= htmlspecialchars($rev['id']) ?>">
                                                <input type="hidden" name="status" value="<?= ($rev['status'] ?? '') === 'published' ? 'pending' : 'published' ?>">
                                                <button type="submit" class="cursor-pointer p-1.5 rounded-lg bg-[#EAF3FF] text-[#0B54C2] hover:bg-blue-100 transition-colors" title="Basculer statut">
                                                    <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                                </button>
                                            </form>
                                            <form method="POST" action="reviews.php" onsubmit="return confirm('Supprimer cet avis ?');" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="delete_review">
                                                <input type="hidden" name="review_id" value="<?= htmlspecialchars($rev['id']) ?>">
                                                <button type="submit" class="cursor-pointer p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Supprimer">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
