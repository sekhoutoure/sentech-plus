<?php
/**
 * =============================================================================
 * SenTechPLUS — Connexion MySQL / MariaDB (Hostinger Premium)
 * Fournit l'instance singleton PDO $pdo pour l'ensemble du projet
 * =============================================================================
 */

require_once __DIR__ . '/../config/config.php';

// Initialise et retourne l'instance PDO
$pdo = getDBConnection();
