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

// Traitement POST : Mise à jour de statut ou note admin
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];
        $oid = sanitize($_POST['order_id'] ?? '');

        if ($action === 'update_status' && $oid && $pdo) {
            $newStatus = sanitize($_POST['order_status'] ?? 'pending');
            $newPaymentStatus = sanitize($_POST['payment_status'] ?? 'pending');
            $adminNotes = sanitize($_POST['admin_notes'] ?? '');

            try {
                $stmtGet = $pdo->prepare("SELECT order_status FROM orders WHERE id = :id");
                $stmtGet->execute([':id' => $oid]);
                $oldStatus = $stmtGet->fetchColumn() ?: 'pending';

                $stmtUpd = $pdo->prepare("UPDATE orders SET order_status = :ostat, payment_status = :pstat, status = :st, admin_notes = :an, updated_at = NOW() WHERE id = :id");
                $stmtUpd->execute([
                    ':ostat' => $newStatus,
                    ':pstat' => $newPaymentStatus,
                    ':st' => strtoupper($newStatus),
                    ':an' => $adminNotes,
                    ':id' => $oid
                ]);

                // Historique de statut
                if ($oldStatus !== $newStatus) {
                    $stmtHist = $pdo->prepare("INSERT INTO order_status_history (order_id, status_from, status_to, note, created_by) VALUES (:oid, :from, :to, :note, 'admin')");
                    $stmtHist->execute([
                        ':oid' => $oid,
                        ':from' => $oldStatus,
                        ':to' => $newStatus,
                        ':note' => "Statut changé par l'administrateur"
                    ]);

                    // Envoi automatique de notification SMS au client
                    try {
                        $stmtCust = $pdo->prepare("SELECT * FROM orders WHERE id = :id LIMIT 1");
                        $stmtCust->execute([':id' => $oid]);
                        $ordData = $stmtCust->fetch();
                        if ($ordData && !empty($ordData['customer_phone'] ?? $ordData['phone'])) {
                            $cPhone = $ordData['customer_phone'] ?? $ordData['phone'];
                            if ($newStatus === 'shipped' || $newStatus === 'processing') {
                                $sms = buildSMSMessage('order_shipped', [
                                    'id'            => $ordData['order_number'] ?? $ordData['id'],
                                    'name'          => ($ordData['customer_first_name'] ?? '') . ' ' . ($ordData['customer_last_name'] ?? ''),
                                    'total'         => $ordData['total'] ?? 0,
                                    'shipping_zone' => $ordData['delivery_city'] ?? 'Dakar'
                                ]);
                                sendSMSNotification($cPhone, $sms, 'order_shipped', ['order_id' => $oid]);
                            } elseif ($newStatus === 'delivered') {
                                $sms = buildSMSMessage('order_delivered', [
                                    'id'    => $ordData['order_number'] ?? $ordData['id'],
                                    'name'  => ($ordData['customer_first_name'] ?? '') . ' ' . ($ordData['customer_last_name'] ?? ''),
                                    'total' => $ordData['total'] ?? 0
                                ]);
                                sendSMSNotification($cPhone, $sms, 'order_delivered', ['order_id' => $oid]);
                            }
                        }
                    } catch (Throwable $e) {}
                }

                $message = "Commande mise à jour avec succès !";
                $messageType = 'success';
            } catch (Throwable $e) {
                $message = "Erreur base de données : " . htmlspecialchars($e->getMessage());
                $messageType = 'error';
            }
        }
    }
}

// Filtres et Recherche
$filterStatus = sanitize($_GET['status'] ?? '');
$searchQuery = sanitize($_GET['q'] ?? '');

$orders = [];
if ($pdo) {
    try {
        $sql = "SELECT o.*, u.name as client_user_name, u.email as client_user_email 
                FROM orders o 
                LEFT JOIN users u ON o.user_id = u.id 
                WHERE 1=1";
        $params = [];

        if (!empty($filterStatus)) {
            $sql .= " AND (o.order_status = :status OR o.status = :status_upper)";
            $params[':status'] = $filterStatus;
            $params[':status_upper'] = strtoupper($filterStatus);
        }

        if (!empty($searchQuery)) {
            $sql .= " AND (o.order_number LIKE :q OR o.id LIKE :q OR o.customer_phone LIKE :q OR o.customer_first_name LIKE :q OR o.customer_last_name LIKE :q)";
            $params[':q'] = "%$searchQuery%";
        }

        $sql .= " ORDER BY o.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();
    } catch (Throwable $e) {
        $orders = [];
    }
}

if (empty($orders) && empty($filterStatus) && empty($searchQuery)) {
    $orders = [
        [
            'id' => 'ord_1',
            'order_number' => 'ST-2026-9842',
            'customer_first_name' => 'Moussa',
            'customer_last_name' => 'Diallo',
            'customer_phone' => '+221 78 131 64 97',
            'customer_email' => 'moussa.diallo@gmail.com',
            'delivery_address' => 'Rue MZ-12, Villa 45',
            'delivery_city' => 'Dakar',
            'delivery_district' => 'Mermoz',
            'total' => 45000,
            'payment_method' => 'Wave',
            'payment_status' => 'paid',
            'order_status' => 'delivered',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 hours'))
        ],
        [
            'id' => 'ord_2',
            'order_number' => 'ST-2026-9710',
            'customer_first_name' => 'Fatou',
            'customer_last_name' => 'Sow',
            'customer_phone' => '+221 78 987 65 43',
            'customer_email' => 'fatou.sow@orange.sn',
            'delivery_address' => 'Avenue Cheikh Anta Diop',
            'delivery_city' => 'Dakar',
            'delivery_district' => 'Fann',
            'total' => 14000,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'order_status' => 'processing',
            'created_at' => date('Y-m-d H:i:s', strtotime('-30 mins'))
        ]
    ];
}

$statusLabels = [
    'pending' => ['label' => 'En attente', 'color' => 'bg-amber-50 text-amber-700 border-amber-200'],
    'confirmed' => ['label' => 'Confirmée', 'color' => 'bg-blue-50 text-[#0B54C2] border-blue-200'],
    'processing' => ['label' => 'En préparation', 'color' => 'bg-indigo-50 text-indigo-700 border-indigo-200'],
    'shipped' => ['label' => 'En livraison', 'color' => 'bg-purple-50 text-purple-700 border-purple-200'],
    'delivered' => ['label' => 'Livrée', 'color' => 'bg-emerald-50 text-[#0D7D53] border-emerald-200'],
    'cancelled' => ['label' => 'Annulée', 'color' => 'bg-rose-50 text-rose-700 border-rose-200']
];

$pageTitle = "Gestion des Commandes — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen">
        
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="shopping-cart" class="w-4 h-4 text-[#1677FF]"></i>
                    <span>Gestion des Commandes Clients & Expéditions Dakar</span>
                </h1>
            </div>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <!-- Titre & Statistiques d'en-tête -->
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 class="text-2xl font-black text-[#182230]">Toutes les Commandes (<?= count($orders) ?>)</h2>
                    <p class="text-xs text-[#667085] mt-1">Gérez le traitement, les expéditions express et les règlements clients.</p>
                </div>
                <div class="flex items-center gap-3">
                    <a href="export-orders.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#0D7D53] hover:bg-[#0A6342] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all">
                        <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                        <span>Exporter CSV / Excel</span>
                    </a>
                </div>
            </div>

            <!-- Filtres de Statut & Barre de Recherche -->
            <div class="bg-white rounded-3xl p-4 border border-[#E8EDF3] shadow-2xs space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <!-- Search Input -->
                    <form method="GET" action="orders.php" class="flex-1 max-w-md relative">
                        <i data-lucide="search" class="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" placeholder="Rechercher par N° commande, client, téléphone..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8EDF3] focus:border-[#1677FF] outline-none text-xs font-medium">
                        <?php if ($filterStatus): ?>
                            <input type="hidden" name="status" value="<?= htmlspecialchars($filterStatus) ?>">
                        <?php endif; ?>
                    </form>

                    <!-- Pills de Filtres -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        <a href="orders.php<?= $searchQuery ? '?q='.urlencode($searchQuery) : '' ?>" class="cursor-pointer px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-colors <?= empty($filterStatus) ? 'bg-[#1677FF] text-white' : 'bg-[#F3F7FC] text-[#475467] hover:bg-slate-200' ?>">
                            Tous
                        </a>
                        <a href="orders.php?status=pending<?= $searchQuery ? '&q='.urlencode($searchQuery) : '' ?>" class="cursor-pointer px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-colors <?= $filterStatus === 'pending' ? 'bg-[#1677FF] text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100' ?>">
                            En attente
                        </a>
                        <a href="orders.php?status=processing<?= $searchQuery ? '&q='.urlencode($searchQuery) : '' ?>" class="cursor-pointer px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-colors <?= $filterStatus === 'processing' ? 'bg-[#1677FF] text-white' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100' ?>">
                            En préparation
                        </a>
                        <a href="orders.php?status=shipped<?= $searchQuery ? '&q='.urlencode($searchQuery) : '' ?>" class="cursor-pointer px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-colors <?= $filterStatus === 'shipped' ? 'bg-[#1677FF] text-white' : 'bg-purple-50 text-purple-800 hover:bg-purple-100' ?>">
                            En livraison
                        </a>
                        <a href="orders.php?status=delivered<?= $searchQuery ? '&q='.urlencode($searchQuery) : '' ?>" class="cursor-pointer px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-colors <?= $filterStatus === 'delivered' ? 'bg-[#1677FF] text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' ?>">
                            Livrées
                        </a>
                    </div>

                </div>
            </div>

            <!-- Tableau des Commandes -->
            <div class="bg-white rounded-3xl border border-[#E8EDF3] shadow-2xs overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F3F7FC] text-[#667085] font-black uppercase text-[10px] tracking-wider border-b border-[#E8EDF3]">
                            <tr>
                                <th class="p-3.5 pl-5">N° Commande & Date</th>
                                <th class="p-3.5">Client & Contact</th>
                                <th class="p-3.5">Lieu de Livraison</th>
                                <th class="p-3.5">Montant Total</th>
                                <th class="p-3.5">Statut Commande</th>
                                <th class="p-3.5">Paiement</th>
                                <th class="p-3.5 pr-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php foreach ($orders as $ord): 
                                $cname = ($ord['customer_first_name'] ?? '') . ' ' . ($ord['customer_last_name'] ?? '');
                                if (trim($cname) === '') $cname = $ord['client_user_name'] ?? 'Client Inconnu';
                                
                                $phone = $ord['customer_phone'] ?? '';
                                $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
                                $orderStat = strtolower($ord['order_status'] ?? ($ord['status'] ?? 'pending'));
                                if ($orderStat === 'order_placed') $orderStat = 'pending';
                                
                                $badge = $statusLabels[$orderStat] ?? ['label' => $orderStat, 'color' => 'bg-slate-100 text-slate-700 border-slate-200'];
                            ?>
                                <tr class="hover:bg-[#F8FBFF] transition-colors">
                                    <td class="p-3.5 pl-5">
                                        <span class="font-mono font-black text-[#1677FF] block text-xs">#<?= htmlspecialchars($ord['order_number'] ?? $ord['id']) ?></span>
                                        <span class="text-[10px] text-[#667085] block"><?= date('d/m/Y H:i', strtotime($ord['created_at'])) ?></span>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-bold text-[#182230] block"><?= htmlspecialchars($cname) ?></span>
                                        <span class="text-[11px] text-[#667085] block">📞 <?= htmlspecialchars($phone) ?></span>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-bold text-[#182230] block truncate max-w-xs"><?= htmlspecialchars($ord['delivery_address'] ?? 'Dakar') ?></span>
                                        <span class="text-[10px] text-[#667085]"><?= htmlspecialchars($ord['delivery_district'] ?? '') ?>, <?= htmlspecialchars($ord['delivery_city'] ?? 'Dakar') ?></span>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="font-black text-xs text-[#0B54C2] block"><?= formatPrice($ord['total'] ?? $ord['total_amount']) ?></span>
                                        <span class="text-[10px] text-[#667085] uppercase font-bold"><?= htmlspecialchars($ord['payment_method'] ?? 'COD') ?></span>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="text-[10px] font-extrabold px-2.5 py-1 rounded-full border inline-block <?= $badge['color'] ?>">
                                            <?= htmlspecialchars($badge['label']) ?>
                                        </span>
                                    </td>
                                    <td class="p-3.5">
                                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-lg <?= ($ord['payment_status'] ?? '') === 'paid' ? 'bg-emerald-50 text-[#0D7D53]' : 'bg-amber-50 text-amber-700' ?>">
                                            <?= ($ord['payment_status'] ?? '') === 'paid' ? '✓ Réglé' : 'En attente' ?>
                                        </span>
                                    </td>
                                    <td class="p-3.5 pr-5 text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            
                                            <!-- WhatsApp Direct Client Contact -->
                                            <?php if (!empty($cleanPhone)): ?>
                                                <a href="https://wa.me/<?= urlencode($cleanPhone) ?>?text=Bonjour%20<?= urlencode($cname) ?>,%20nous%20vous%20contactons%20concernant%20votre%20commande%20SenTechPLUS%20<?= urlencode($ord['order_number'] ?? $ord['id']) ?>." target="_blank" rel="noopener" class="cursor-pointer p-1.5 rounded-lg bg-emerald-50 text-[#0D7D53] hover:bg-emerald-100 transition-colors" title="Contacter le client sur WhatsApp">
                                                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                                                </a>
                                            <?php endif; ?>

                                            <!-- Transmettre au Livreur Moto (WhatsApp Dispatch) -->
                                            <?php
                                            $dispatchMsg = "📦 COURSE LIVRAISON SENTECHPLUS DAKAR\n"
                                                . "--------------------------------\n"
                                                . "• Commande : #" . ($ord['order_number'] ?? $ord['id']) . "\n"
                                                . "• Client : " . $cname . "\n"
                                                . "• Tél : " . $phone . "\n"
                                                . "• Adresse : " . ($ord['delivery_address'] ?? '') . " (" . ($ord['delivery_district'] ?? '') . ", " . ($ord['delivery_city'] ?? 'Dakar') . ")\n"
                                                . "• Montant : " . formatPrice($ord['total'] ?? 0) . " [" . strtoupper($ord['payment_method'] ?? 'COD') . "]\n"
                                                . "--------------------------------\n"
                                                . "📍 Merci de livrer sous 2h.";
                                            ?>
                                            <a href="https://wa.me/?text=<?= urlencode($dispatchMsg) ?>" target="_blank" rel="noopener" class="cursor-pointer p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors" title="Transmettre la course au livreur sur WhatsApp">
                                                <i data-lucide="send" class="w-4 h-4"></i>
                                            </a>

                                            <!-- Modal Modifier Statut -->
                                            <button type="button" onclick='openUpdateOrderModal(<?= json_encode($ord) ?>)' class="cursor-pointer p-1.5 rounded-lg bg-[#EAF3FF] text-[#0B54C2] hover:bg-blue-100 transition-colors" title="Gérer le statut">
                                                <i data-lucide="edit-2" class="w-4 h-4"></i>
                                            </button>

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

<!-- Modal Modification Statut Commande -->
<div id="order-modal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between border-b border-[#E8EDF3] pb-3">
            <div>
                <h3 id="omodal-title" class="text-base font-black text-[#182230]">Mettre à Jour la Commande</h3>
                <p class="text-[11px] text-[#667085]">Ajustement du statut et du règlement</p>
            </div>
            <button type="button" onclick="closeOrderModal()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" action="orders.php" class="space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" value="update_status">
            <input type="hidden" name="order_id" id="oform-id" value="">

            <div>
                <label class="block font-bold text-[#182230] mb-1">Statut d'Acheminement *</label>
                <select name="order_status" id="oform-ostat" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] bg-white font-bold outline-none cursor-pointer">
                    <option value="pending">⏳ En attente (Reçue)</option>
                    <option value="confirmed">👍 Confirmée</option>
                    <option value="processing">📦 En préparation</option>
                    <option value="shipped">🚚 En livraison Dakar</option>
                    <option value="delivered">✅ Livrée avec succès</option>
                    <option value="cancelled">❌ Annulée</option>
                </select>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Statut du Paiement *</label>
                <select name="payment_status" id="oform-pstat" class="w-full p-2.5 rounded-xl border border-[#E8EDF3] bg-white font-bold outline-none cursor-pointer">
                    <option value="pending">⏳ En attente d'encaissement</option>
                    <option value="paid">✅ Payé (Wave / OM / Espèces)</option>
                    <option value="failed">❌ Paiement échoué</option>
                    <option value="refunded">↩️ Remboursé</option>
                </select>
            </div>

            <div>
                <label class="block font-bold text-[#182230] mb-1">Note Interne Admin (Optionnel)</label>
                <textarea name="admin_notes" id="oform-notes" rows="2" placeholder="Ex: Livré par Mamadou H+2, client satisfait..." class="w-full p-2.5 rounded-xl border border-[#E8EDF3] outline-none"></textarea>
            </div>

            <div class="pt-3 border-t border-[#E8EDF3] flex justify-end gap-2.5">
                <button type="button" onclick="closeOrderModal()" class="cursor-pointer px-4 py-2.5 rounded-xl border border-[#E8EDF3] text-[#667085] font-bold hover:bg-[#F3F7FC]">
                    Annuler
                </button>
                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition-all">
                    Enregistrer les Modifications
                </button>
            </div>
        </form>
    </div>
</div>

<script>
function openUpdateOrderModal(ord) {
    document.getElementById('omodal-title').textContent = "Commande #" + (ord.order_number || ord.id);
    document.getElementById('oform-id').value = ord.id;
    
    let ostat = (ord.order_status || ord.status || 'pending').toLowerCase();
    if (ostat === 'order_placed') ostat = 'pending';
    document.getElementById('oform-ostat').value = ostat;
    
    document.getElementById('oform-pstat').value = ord.payment_status || 'pending';
    document.getElementById('oform-notes').value = ord.admin_notes || "";
    document.getElementById('order-modal').classList.remove('hidden');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
