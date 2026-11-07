<?php
require_once __DIR__ . '/../config/config.php';

// Si déjà administrateur authentifié, redirection directe vers le cockpit
if (isAdmin()) {
    header('Location: index.php');
    exit;
}

// Redirection fluide vers la page de connexion globale avec retour automatique sur le cockpit admin
$redirectUrl = urlencode('admin/index.php');
header("Location: ../login.php?redirect={$redirectUrl}");
exit;
