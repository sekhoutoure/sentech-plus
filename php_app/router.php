<?php
/**
 * SenTechPLUS — Local Security Router (Dev Server Defense)
 * Blocks unauthorized access to .env, .sql, .git, database, config, storage folders
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $uri;

// 1. Bloquer strictement les fichiers sensibles et d'environnement (exemption pour manifest.json)
if ($uri !== '/manifest.json' && preg_match('/(\.env|\.sql|\.json|\.log|\.git|\.md|database|storage|config)/i', $uri)) {
    http_response_code(403);
    die('<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>403 Forbidden</h1><p>Access denied to system resources.</p></body></html>');
}

// 2. Fichiers statiques autorisés (CSS, JS, Images, Polices)
if (file_exists($file) && !is_dir($file)) {
    return false; // Sert le fichier normalement
}

// 3. Fallback PHP Sécurisé (Anti-Path Traversal)
$phpCandidate = $file . '.php';
$realCandidate = file_exists($phpCandidate) ? realpath($phpCandidate) : false;
$baseDir = realpath(__DIR__);

if ($realCandidate && str_starts_with($realCandidate, $baseDir) && is_file($realCandidate)) {
    require $realCandidate;
    exit;
}


// 4. Routage dynamique
if ($uri === '/sitemap.xml') {
    require __DIR__ . '/sitemap.php';
    exit;
}

if ($uri === '/feed.xml' || $uri === '/google-shopping.xml') {
    require __DIR__ . '/google-merchant-feed.php';
    exit;
}

// 5. Par défaut : index.php
require __DIR__ . '/index.php';
