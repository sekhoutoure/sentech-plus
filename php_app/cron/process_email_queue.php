<?php
/**
 * SenTechPLUS — Cron Queue Processor (Email Automation Worker)
 * Usage: php cron/process_email_queue.php
 */
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/email_service.php';
$pdo = getDBConnection();

if (!$pdo) {
    echo "[" . date('Y-m-d H:i:s') . "] Error: Database connection unavailable.\n";
    exit(1);
}

$limit = 25; // Nombre d'emails par lot

$stmt = $pdo->prepare("
    SELECT * FROM email_queue 
    WHERE status = 'pending' AND attempts < max_attempts 
    ORDER BY id ASC 
    LIMIT :lim
");
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->execute();
$queue = $stmt->fetchAll(PDO::FETCH_ASSOC);

$total = count($queue);
if ($total === 0) {
    echo "[" . date('Y-m-d H:i:s') . "] Queue is empty. 0 emails to process.\n";
    exit(0);
}

echo "[" . date('Y-m-d H:i:s') . "] Processing {$total} pending emails...\n";

$sentCount = 0;
$failCount = 0;

foreach ($queue as $item) {
    $id = (int)$item['id'];
    $to = $item['recipient_email'];
    $name = $item['recipient_name'];
    $subject = $item['subject'];
    $html = $item['body_html'];
    $attempts = (int)$item['attempts'] + 1;

    // Verrouiller l'état en cours
    $lockStmt = $pdo->prepare("UPDATE email_queue SET status = 'sending', attempts = :att WHERE id = :id");
    $lockStmt->execute([':att' => $attempts, ':id' => $id]);

    try {
        $ok = EmailService::deliverDirectly($to, $name, $subject, $html);
        if ($ok) {
            $upd = $pdo->prepare("UPDATE email_queue SET status = 'sent', sent_at = NOW(), error_message = NULL WHERE id = :id");
            $upd->execute([':id' => $id]);
            $sentCount++;
            echo "  [OK] Email #{$id} delivered to {$to}\n";
        } else {
            throw new Exception("Delivery returned false");
        }
    } catch (Throwable $e) {
        $failCount++;
        $errMsg = substr($e->getMessage(), 0, 500);
        $newStatus = ($attempts >= (int)$item['max_attempts']) ? 'failed' : 'pending';
        $upd = $pdo->prepare("UPDATE email_queue SET status = :status, error_message = :err WHERE id = :id");
        $upd->execute([':status' => $newStatus, ':err' => $errMsg, ':id' => $id]);
        echo "  [FAIL] Email #{$id} to {$to} failed: {$errMsg}\n";
    }
}

echo "[" . date('Y-m-d H:i:s') . "] Summary: {$sentCount} sent, {$failCount} failed out of {$total}.\n";