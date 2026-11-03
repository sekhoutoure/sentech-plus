<?php
/**
 * SenTechPLUS — API Actions Email & Vérification
 */
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/email_service.php';
$pdo = getDBConnection();

$action = trim($_POST['action'] ?? $_GET['action'] ?? '');

if ($action === 'resend_verification') {
    $email = trim($_POST['email'] ?? '');
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
        exit;
    }

    if ($pdo) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $result = EmailService::createAndSendVerification($user);
            echo json_encode(['success' => true, 'message' => 'Code envoyé avec succès.']);
            exit;
        }
    }

    echo json_encode(['success' => false, 'message' => 'Aucun compte associé à cet email.']);
    exit;
}

if ($action === 'test_smtp') {
    // Réservé à l'administrateur
    $currentUser = getCurrentUser();
    if (empty($currentUser) || ($currentUser['role'] ?? '') !== 'admin') {
        echo json_encode(['success' => false, 'message' => 'Accès refusé.']);
        exit;
    }

    $targetEmail = trim($_POST['target_email'] ?? $currentUser['email'] ?? 'contact@sentechplus.com');
    $smtpConfig = EmailService::getSmtpConfig();

    $testHtml = "<h2>Test de Connexion SMTP SenTechPLUS</h2><p>Ce message confirme que votre passerelle d'automatisation d'email fonctionne parfaitement sur votre serveur Hostinger.</p><p><strong>Date :</strong> " . date('Y-m-d H:i:s') . "</p>";

    $sent = EmailService::deliverDirectly($targetEmail, 'Admin SenTechPLUS', 'Test de Connexion Email SenTechPLUS', $testHtml);

    if ($sent) {
        echo json_encode(['success' => true, 'message' => "Email de test délivré avec succès à {$targetEmail} !"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Échec de l'envoi de test. Vérifiez les paramètres SMTP ou le service mail."]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action non reconnue.']);