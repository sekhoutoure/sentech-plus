<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();

// Fetch orders with address and items count
$orders = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT o.*, 
                                    u.name as user_name, 
                                    u.email as user_email,
                                    a.name as client_name, 
                                    a.phone as client_phone, 
                                    a.street as client_street, 
                                    a.city as client_city,
                                    (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as items_count
                             FROM orders o
                             LEFT JOIN users u ON o.user_id = u.id
                             LEFT JOIN addresses a ON o.address_id = a.id
                             ORDER BY o.created_at DESC");
        $orders = $stmt ? $stmt->fetchAll() : [];
    } catch (Throwable $e) {
        $orders = [];
    }
}

// Filename with timestamp
$filename = "sentechplus_commandes_" . date('Y-m-d_His') . ".csv";

// Headers for CSV download
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

// Open output stream
$output = fopen('php://output', 'w');

// UTF-8 BOM for Microsoft Excel compatibility
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// CSV Header row
fputcsv($output, [
    'N° Commande',
    'Date',
    'Nom Client',
    'Téléphone',
    'Email',
    'Quartier / Adresse Dakar',
    'Montant Total (FCFA)',
    'Mode de Paiement',
    'Statut Paiement',
    'Statut Commande',
    'Nb Articles'
], ';');

// Data rows
foreach ($orders as $o) {
    $cName = trim(($o['customer_first_name'] ?? '') . ' ' . ($o['customer_last_name'] ?? '')) ?: ($o['client_name'] ?: ($o['user_name'] ?: 'Client'));
    $cPhone = $o['customer_phone'] ?: ($o['client_phone'] ?: '-');
    $cEmail = $o['customer_email'] ?: ($o['user_email'] ?: '');
    $cAddress = trim(($o['delivery_address'] ?: ($o['client_street'] ?: '')) . ' - ' . ($o['delivery_city'] ?: ($o['client_city'] ?: 'Dakar')));
    $cTotal = (float)($o['total'] ?? $o['total_amount'] ?? 0);

    fputcsv($output, [
        $o['order_number'] ?? $o['id'],
        date('d/m/Y H:i', strtotime($o['created_at'])),
        $cName,
        $cPhone,
        $cEmail,
        $cAddress,
        $cTotal,
        $o['payment_method'] ?? 'COD',
        ($o['is_paid'] ?? false) ? 'PAYE' : 'EN_ATTENTE',
        $o['order_status'] ?? $o['status'] ?? 'ORDER_PLACED',
        $o['items_count'] ?? 1
    ], ';');
}

fclose($output);
exit;
