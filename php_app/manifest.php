<?php
header('Content-Type: application/manifest+json; charset=utf-8');
header('Cache-Control: public, max-age=86400');
header('Access-Control-Allow-Origin: *');

$manifestFile = __DIR__ . '/manifest.json';
if (file_exists($manifestFile)) {
    readfile($manifestFile);
} else {
    echo json_encode([
        "name" => "SenTechPLUS — High-Tech Dakar",
        "short_name" => "SenTechPLUS",
        "start_url" => "./index.php?source=pwa",
        "scope" => "./",
        "display" => "standalone",
        "background_color" => "#F4F7FB",
        "theme_color" => "#1677FF"
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}
exit;
