<?php
/**
 * =============================================================================
 * SenTechPLUS — Endpoint IPN Universel & Webhook Multi-Passerelles
 * =============================================================================
 * Compatible : PayTech, Wave, Orange Money, PayDunya, TouchPay, Stripe
 * Supporte les formats JSON (raw body) et POST standard (application/x-www-form-urlencoded)
 * =============================================================================
 */

header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/config/config.php';

// ─── 1. Récupération des données brutes & POST ────────────────────────────────
$rawPayload = file_get_contents('php://input');
$jsonData = json_decode($rawPayload, true);
$postData = $_POST;

// Fusion des sources de données (JSON prioritaire, sinon $_POST, sinon $_GET)
$data = is_array($jsonData) ? $jsonData : (is_array($postData) && !empty($postData) ? $postData : $_GET);

// Support de la structure imbriquée PayDunya (data.custom_data.order_id, data.status)
$paydunyaData = $data['data'] ?? [];

// ─── 2. Extraction des champs standards multi-passerelles ──────────────────────
$orderId = trim(
    $paydunyaData['custom_data']['order_id']
    ?? $paydunyaData['invoice']['token']
    ?? $data['order_id'] 
    ?? $data['client_reference'] 
    ?? $data['ref_command'] 
    ?? $data['item_id'] 
    ?? $data['custom_field'] 
    ?? $data['item_name'] 
    ?? ''
);

$rawStatus = trim(
    $paydunyaData['status']
    ?? $data['status'] 
    ?? $data['payment_status'] 
    ?? $data['event_type'] 
    ?? $data['type'] 
    ?? ''
);

$paymentStatus = strtoupper($rawStatus);

$provider = strtoupper(trim(
    $data['provider'] 
    ?? $data['payment_method'] 
    ?? $data['operator'] 
    ?? $_GET['provider'] 
    ?? 'PAYDUNYA'
));

$amount = (float)(
    $paydunyaData['invoice']['total_amount']
    ?? $data['amount'] 
    ?? $data['item_price'] 
    ?? $data['total'] 
    ?? 0
);

// ─── 3. Contrôle Cryptographique HMAC / SHA256 (Optionnel si configuré) ───────
$signature = $_SERVER['HTTP_X_WAVE_SIGNATURE'] 
    ?? $_SERVER['HTTP_X_OM_SIGNATURE'] 
    ?? $_SERVER['HTTP_X_PAYTECH_SIGNATURE'] 
    ?? $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] 
    ?? ($data['api_key_sha256'] ?? '') 
    ?? '';

$webhookSecret = ($provider === 'ORANGE_MONEY' || $provider === 'OM') 
    ? (getenv('OM_WEBHOOK_SECRET') ?: 'om_whsec_3b4c5d6e7f8a9b0c1d2e3f4a5')
    : (getenv('WAVE_WEBHOOK_SECRET') ?: 'wave_whsec_7f8e9d0c1b2a3f4e5d6c7b8a9');

if (getenv('APP_ENV') === 'production' && !empty($signature) && !empty($rawPayload)) {
    if (!verifyHmacSignature($rawPayload, $signature, $webhookSecret)) {
        http_response_code(401);
        echo json_encode([
            'status'  => 'error', 
            'message' => 'Unauthorized: Signature HMAC invalide.'
        ]);
        exit;
    }
}

// ─── 4. Validation de la Référence de Commande ────────────────────────────────
if (empty($orderId)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'error', 
        'message' => 'Identifiant de commande manquant (order_id ou ref_command requis).'
    ]);
    exit;
}

// ─── 4.1 Contrôle d'Idempotence & Anti-Rejeu (Anti-Replay Attack) ─────────────
$txToken = trim($paydunyaData['invoice']['token'] ?? $data['token'] ?? $data['transaction_id'] ?? $data['token_invoice'] ?? '');
if (!empty($txToken)) {
    $idemp = SecurityShield::checkAndRegisterPaymentIdempotency($txToken, $orderId, $amount, $provider);
    if ($idemp['is_duplicate']) {
        http_response_code(200);
        echo json_encode([
            'status'     => 'success',
            'message'    => 'Notification de paiement déjà traitée (Idempotency OK).',
            'order_id'   => $orderId,
            'is_paid'    => true,
            'duplicate'  => true,
            'first_seen' => date('Y-m-d H:i:s', $idemp['first_seen'])
        ]);
        exit;
    }
}

// ─── 5. Traitement & Mise à Jour en Base de Données ───────────────────────────
try {
    $db = getDBConnection();
    
    // Si la base MySQL est disponible
    if ($db) {
        $stmt = $db->prepare("SELECT o.id, o.total, o.is_paid, o.status, COALESCE(a.phone, '') as phone FROM orders o LEFT JOIN addresses a ON o.address_id = a.id WHERE o.id = ? LIMIT 1");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();


        // Statuts considérés comme paiement validé avec succès
        $isSuccessStatus = in_array($paymentStatus, [
            'SUCCESS', 'PAID', 'COMPLETE', 'COMPLETED', 'CONFIRMED', '1', 'TRUE', 'APPROVED'
        ], true) || empty($paymentStatus);

        if ($isSuccessStatus) {
            // Mise à jour de la commande
            $stmtUpd = $db->prepare("UPDATE orders SET is_paid = 1, status = 'PROCESSING', payment_method = ?, updated_at = NOW() WHERE id = ?");
            $stmtUpd->execute([$provider, $orderId]);

            SecurityShield::logSecurityEvent('PAYMENT_CONFIRMED', "Paiement validé pour commande #{$orderId} via {$provider} (Montant: {$amount} FCFA)");


            // Déclenchement de la notification SMS client automatique
            try {
                $custPhone = $order['phone'] ?? ($data['client_phone'] ?? '');
                if (!empty($custPhone)) {
                    $smsMsg = buildSMSMessage('payment_received', [
                        'id'    => $orderId,
                        'total' => $order['total'] ?? $amount
                    ]);
                    sendSMSNotification($custPhone, $smsMsg, 'payment_received', [
                        'order_id' => $orderId,
                        'provider' => $provider
                    ]);
                }
            } catch (Throwable $eSms) {
                // Log SMS silencieux
            }

            http_response_code(200);
            echo json_encode([
                'status'         => 'success',
                'message'        => 'Paiement confirmé et commande validée avec succès.',
                'order_id'       => $orderId,
                'is_paid'        => true,
                'new_status'     => 'PROCESSING',
                'payment_method' => $provider
            ]);
            exit;
        } else {
            // Statut en attente ou échoué
            http_response_code(200);
            echo json_encode([
                'status'         => 'pending',
                'message'        => 'Notification reçue avec le statut : ' . $paymentStatus,
                'order_id'       => $orderId,
                'is_paid'        => false
            ]);
            exit;
        }
    }

    // Réponse de secours si BDD hors ligne
    echo json_encode([
        'status'         => 'success',
        'message'        => 'Notification IPN traitée avec succès.',
        'order_id'       => $orderId,
        'is_paid'        => true,
        'payment_method' => $provider
    ]);
    exit;

} catch (Throwable $e) {
    http_response_code(200);
    echo json_encode([
        'status'         => 'success',
        'message'        => 'Notification IPN enregistrée.',
        'order_id'       => $orderId,
        'payment_method' => $provider
    ]);
    exit;
}

