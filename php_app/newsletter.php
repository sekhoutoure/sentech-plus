<?php
/**
 * =============================================================================
 * SenTechPLUS — Inscription Newsletter
 * Valide et enregistre les abonnés dans la table `newsletter_subscribers`
 * =============================================================================
 */

require_once __DIR__ . '/config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$email = strtolower(sanitize($_POST['email'] ?? ''));

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Veuillez saisir une adresse email valide.']);
    exit;
}

try {
    $pdo = getDBConnection();
    if ($pdo) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            ip_address VARCHAR(45) NULL,
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // Vérifier si l'email existe déjà
        $stmtCheck = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = :email LIMIT 1");
        $stmtCheck->execute([':email' => $email]);
        if ($stmtCheck->fetch()) {
            echo json_encode(['success' => true, 'message' => 'Vous êtes déjà inscrit(e) à notre Newsletter !']);
            exit;
        }

        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email, ip_address, status) VALUES (:email, :ip, 'active')");
        $stmt->execute([
            ':email' => $email,
            ':ip' => $ip
        ]);
    }

    echo json_encode(['success' => true, 'message' => 'Merci pour votre inscription à la Newsletter SenTechPLUS ! 🎉']);
} catch (Exception $e) {
    echo json_encode(['success' => true, 'message' => 'Merci pour votre inscription à la Newsletter SenTechPLUS ! 🎉']);
}
