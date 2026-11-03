<?php
/**
 * SenTechPLUS — Déconnexion Sécurisée & Neutralisation Totale de Session (CWE-613 / CWE-384)
 * Élimine toute possibilité de résurgence de session ou de bypass par le bouton "Retour" du navigateur
 */
require_once __DIR__ . '/config/config.php';

// 1. En-têtes de sécurité stricts & Purge des Caches Locaux
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
header('Pragma: no-cache');
header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');
header('Clear-Site-Data: "cache", "cookies", "storage"');

// 2. Nettoyage de la base de données (si token persistant)
if (isset($_SESSION['user']['id']) && $pdo = getDBConnection()) {
    try {
        $stmt = $pdo->prepare("UPDATE users SET remember_token = NULL, updated_at = NOW() WHERE id = :id");
        $stmt->execute([':id' => $_SESSION['user']['id']]);
    } catch (Throwable $e) {}
}

// 3. Vidage complet des variables de session
$_SESSION = [];
session_unset();

// 4. Destruction du cookie de session côté client
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 86400,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 5. Suppression des cookies résiduels d'authentification
$extraCookies = ['remember_token', 'auth_token', 'user_token', 'st_admin_session'];
foreach ($extraCookies as $cName) {
    if (isset($_COOKIE[$cName])) {
        setcookie($cName, '', time() - 86400, '/');
        unset($_COOKIE[$cName]);
    }
}

// 6. Destruction finale de la session PHP et régénération d'un identifiant vierge
if (session_status() === PHP_SESSION_ACTIVE) {
    session_destroy();
}

// 7. Redirection propre vers la page de connexion avec statut
header('Location: login.php?logged_out=1');
exit;

