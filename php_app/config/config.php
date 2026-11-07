<?php

/**

 * =============================================================================

 * SenTechPLUS — Configuration Globale & Sécurité Production

 * Compatible Hostinger Premium & Serveur Local (PHP 8+, PDO MySQL)

 * =============================================================================

 */



// ─── 1. Chargeur de Variables d'Environnement (.env) ──────────────────────────

function loadEnvFile(string $path): void {

    if (!file_exists($path) || !is_readable($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {

        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#')) continue;

        if (strpos($line, '=') !== false) {

            list($key, $val) = explode('=', $line, 2);

            $key = trim($key);

            $val = trim($val);

            // Dé-guillemeter

            if (preg_match('/^(["\'])(.*)\1$/', $val, $m)) {

                $val = $m[2];

            }

            if (function_exists('putenv')) {
                @putenv("{$key}={$val}");
            }
            $_ENV[$key] = $val;
            $_SERVER[$key] = $val;

        }

    }

}

loadEnvFile(__DIR__ . '/../.env');

if (!function_exists('env_val')) {
    function env_val(string $key, mixed $default = null): mixed {
        if (isset($_ENV[$key]) && $_ENV[$key] !== '') return $_ENV[$key];
        if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return $_SERVER[$key];
        $val = function_exists('getenv') ? getenv($key) : false;
        if ($val !== false && $val !== '') return $val;
        return $default;
    }
}



// ─── 1.1 Moteur de Cache & Haute Scalabilité (APCu / Mémoire / Disque Atomique) 

require_once __DIR__ . '/../includes/cache_engine.php';



// ─── 1.2 Moteur de Sécurité Avancée & Anti-Brute Force (SecurityShield Engine) ──

require_once __DIR__ . '/../includes/security_engine.php';



// ─── 1.3 Service de Téléversement Sécurisé & Détoxification WebP ───────────────

require_once __DIR__ . '/../includes/upload_service.php';



// ─── 1.4 Pare-Feu Applicatif & Inspection Profonde WAF (SQLi/XSS/LFI/RCE) ──────

require_once __DIR__ . '/../includes/waf_engine.php';

WebAppFirewall::inspectRequest();







// ─── 2. Gestion des Erreurs Production / Debug ────────────────────────────────

$isProd = (getenv('APP_ENV') === 'production' || strtolower(getenv('APP_DEBUG') ?: 'false') === 'false');

if ($isProd) {

    ini_set('display_errors', '0');

    ini_set('display_startup_errors', '0');

    error_reporting(E_ALL);

    ini_set('log_errors', '1');

    $logDir = __DIR__ . '/../storage/logs';

    if (!is_dir($logDir)) {

        @mkdir($logDir, 0755, true);

    }

    ini_set('error_log', $logDir . '/php_errors.log');

} else {

    ini_set('display_errors', '1');

    ini_set('display_startup_errors', '1');

    error_reporting(E_ALL);

}



// ─── 3. En-têtes HTTP de Sécurité Globale (CSP, HSTS, X-Frame, Redirection HTTPS) ─
function applyGlobalSecurityHeaders(): void {
    if (headers_sent() || php_sapi_name() === 'cli') return;

    // Masquage empreinte serveur & PHP
    @header_remove('X-Powered-By');
    @ini_set('expose_php', '0');

    // Détection HTTPS universelle (Direct, Nginx reverse-proxy, Cloudflare, ByetHost)
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443)
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string)$_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https')
        || (isset($_SERVER['HTTP_CF_VISITOR']) && strpos((string)$_SERVER['HTTP_CF_VISITOR'], 'https') !== false);

    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $isLocalhost = in_array($host, ['localhost', '127.0.0.1', '::1'])
        || str_ends_with($host, '.local')
        || str_ends_with($host, '.test');

    // Redirection automatique 301 vers HTTPS pour le trafic public non chiffré
    if (!$isHttps && !$isLocalhost) {
        $targetUrl = 'https://' . $host . ($_SERVER['REQUEST_URI'] ?? '/');
        header('HTTP/1.1 301 Moved Permanently');
        header('Location: ' . $targetUrl);
        exit;
    }

    // Protection Clickjacking & MIME-Sniffing
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // Permissions Policy (Désactivation matériel sensible non nécessaire)
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://app.paydunya.com")');

    // Cross-Origin Opener Policy
    header('Cross-Origin-Opener-Policy: same-origin-allow-popups');

    // Content-Security-Policy stricte & optimisée
    $csp = "default-src 'self'; "
         . "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://unpkg.com https://cdn.jsdelivr.net; "
         . "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
         . "font-src 'self' https://fonts.gstatic.com data:; "
         . "img-src 'self' data: https: blob:; "
         . "connect-src 'self' https://app.paydunya.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://fonts.googleapis.com https://fonts.gstatic.com; "
         . "frame-ancestors 'self'; "
         . "form-action 'self' https://app.paydunya.com; "
         . "base-uri 'self';";
    header("Content-Security-Policy: {$csp}");

    // HSTS (HTTP Strict Transport Security - 1 an + subdomains + preload)
    if ($isHttps) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
}

applyGlobalSecurityHeaders();



// ─── 3.1 Compression HTTP Unifiée & Sans Conflit (Zlib Native) ────────────────

if (extension_loaded('zlib') && !headers_sent() && !ini_get('zlib.output_compression')) {

    @ini_set('zlib.output_compression', 'On');

    @ini_set('zlib.output_compression_level', '6');

}





// ─── 4. Sécurisation & Expiration des Sessions ────────────────────────────────

if (session_status() === PHP_SESSION_NONE) {

    $sessionLifetime = (int)(getenv('SESSION_LIFETIME') ?: 7200); // 2h par défaut

    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 

        || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) 

        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')

        || (isset($_SERVER['HTTP_CF_VISITOR']) && strpos($_SERVER['HTTP_CF_VISITOR'], 'https') !== false);

    

    ini_set('session.use_strict_mode', '1');

    ini_set('session.use_only_cookies', '1');

    ini_set('session.cookie_httponly', '1');

    ini_set('session.gc_maxlifetime', (string)$sessionLifetime);

    

    session_set_cookie_params([

        'lifetime' => $sessionLifetime,

        'path'     => '/',

        'domain'   => '',

        'secure'   => $isSecure,

        'httponly' => true,

        'samesite' => 'Lax'

    ]);

    session_cache_limiter('');

    session_start();

}



// Timeout d'inactivité de session (2 heures)

if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > (int)(getenv('SESSION_LIFETIME') ?: 7200))) {

    session_unset();

    session_destroy();

    session_cache_limiter('');

    session_start();

}

$_SESSION['last_activity'] = time();

if (!function_exists('setFlashMessage')) {
    function setFlashMessage(string $type, string $message): void {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            @session_start();
        }
        $_SESSION['flash_message'] = [
            'type' => $type,
            'message' => $message
        ];
    }
}

if (!function_exists('getFlashMessage')) {
    function getFlashMessage(): ?array {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            @session_start();
        }
        if (isset($_SESSION['flash_message'])) {
            $msg = $_SESSION['flash_message'];
            unset($_SESSION['flash_message']);
            return $msg;
        }
        return null;
    }
}



// Default Cache-Control for bfcache (Back/Forward Cache) eligibility

if (!headers_sent()) {

    header('Cache-Control: private, no-cache');

}



// ─── 5. Configuration Base de Données ─────────────────────────────────────────

define('DB_HOST', env_val('DB_HOST', '127.0.0.1'));

define('DB_PORT', env_val('DB_PORT', '3306'));

define('DB_NAME', env_val('DB_NAME', 'sentech_plus'));

define('DB_USER', env_val('DB_USER', 'root'));

define('DB_PASS', env_val('DB_PASS', ''));

define('DB_CHARSET', 'utf8mb4');



// ─── 6. Configuration Globale Application & Contacts Officiels ───────────────

define('SITE_NAME', 'SenTechPLUS');

define('SITE_TAGLINE', 'Boutique High-Tech & Accessoires Smartphone Sénégal');

define('APP_URL', env_val('APP_URL', 'https://sentechplus.com'));

define('CONTACT_EMAIL', env_val('CONTACT_EMAIL', 'contact@sentechplus.com'));

define('CONTACT_PHONE', env_val('CONTACT_PHONE', '+221 78 131 64 97'));

define('CONTACT_ADDRESS', env_val('CONTACT_ADDRESS', 'Point E, Boulevard de l\'Est, Dakar, Sénégal'));

define('APP_CURRENCY_SYMBOL', ' FCFA');

define('BASE_URL', ''); 

define('APP_SECRET', env_val('APP_SECRET', 'sentech_default_secret_production_key_2026'));

define('WHATSAPP_PHONE', env_val('WHATSAPP_PHONE', '221781316497'));

define('WHATSAPP_DISPLAY', env_val('WHATSAPP_DISPLAY', '+221 78 131 64 97'));



/**

 * Zones de livraison officielles Dakar & Sénégal avec tarifs et délais

 */

function getDakarDeliveryZones(): array {

    return [

        'dakar_centre' => [

            'name' => 'Dakar Centre (Plateau, Médina, Fann, Point E, Colobane)',

            'price' => 1500,

            'delay' => '2h à 4h'

        ],

        'dakar_ouest' => [

            'name' => 'Dakar Ouest (Almadies, Ngor, Ouakam, Mermoz, Sacré-Cœur, Yoff)',

            'price' => 2000,

            'delay' => '2h à 4h'

        ],

        'dakar_banlieue' => [

            'name' => 'Banlieue & Keur Massar (ZAC Mbao, Pikine, Guédiawaye, Parcelles, Thiaroye)',

            'price' => 2500,

            'delay' => 'Dans la journée (2h à 5h)'

        ],

        'dakar_extension' => [

            'name' => 'Extension Dakar (Rufisque, Diamniadio, Bargny, Lac Rose, Sebikotane)',

            'price' => 3500,

            'delay' => '24h'

        ],

        'regions' => [

            'name' => 'Autres Régions (Thiès, Mbour, Saint-Louis, Kaolack, Touba, Ziguinchor)',

            'price' => 4500,

            'delay' => '24h à 48h (GP / Poste)'

        ]

    ];

}



/**

 * Calcule les frais de livraison avec gratuité offerte dès 50 000 FCFA

 */

function calculateDeliveryFee(string $zoneKey, float $subtotal): float {

    if ($subtotal >= 50000) {

        return 0.0;

    }

    $zones = getDakarDeliveryZones();

    return isset($zones[$zoneKey]) ? (float)$zones[$zoneKey]['price'] : 2000.0;

}



/**

 * Génère le lien de commande instantanée 1-Clic WhatsApp pour un produit

 */

function getWhatsAppProductLink(array $product, ?string $variantName = null, int $quantity = 1): string {

    $phone = WHATSAPP_PHONE;

    $price = (float)($product['price'] ?? 0);

    $totalPrice = $price * $quantity;

    

    $text = "Bonjour *SenTechPLUS* ! 👋\n\n";

    $text .= "Je souhaite commander directement cet article :\n\n";

    $text .= "📦 *Produit :* " . ($product['name'] ?? 'Équipement') . "\n";

    if (!empty($variantName)) {

        $text .= "🎨 *Variante :* " . $variantName . "\n";

    }

    $text .= "🔢 *Quantité :* " . $quantity . "\n";

    $text .= "💰 *Prix unitaire :* " . formatPrice($price) . "\n";

    if ($quantity > 1) {

        $text .= "💵 *Total :* " . formatPrice($totalPrice) . "\n";

    }

    $text .= "🔗 *Fiche produit :* https://" . ($_SERVER['HTTP_HOST'] ?? 'localhost:8000') . "/product.php?id=" . urlencode($product['id'] ?? '') . "\n\n";

    $text .= "📍 *Mon nom & quartier de livraison à Dakar :* ";



    return "https://wa.me/{$phone}?text=" . rawurlencode($text);

}



/**

 * Génère le lien de commande WhatsApp pour l'intégralité du panier

 */

function getWhatsAppCartLink(array $items, float $subtotal, float $deliveryFee = 0.0, ?string $deliveryZone = null): string {

    $phone = WHATSAPP_PHONE;

    $total = $subtotal + $deliveryFee;



    $text = "Bonjour *SenTechPLUS* ! 👋\n\n";

    $text .= "Je souhaite valider ma commande pour mon panier :\n\n";

    $i = 1;

    foreach ($items as $it) {

        $p = $it['product'] ?? [];

        $qty = (int)($it['quantity'] ?? 1);

        $pPrice = (float)($p['price'] ?? 0);

        $text .= "{$i}. *" . ($p['name'] ?? 'Article') . "* x{$qty} — " . formatPrice($pPrice * $qty) . "\n";

        $i++;

    }

    $text .= "\n💵 *Sous-total :* " . formatPrice($subtotal) . "\n";

    if ($deliveryFee === 0.0) {

        $text .= "🚚 *Livraison :* GRATUITE (Offerte dès 50 000 FCFA)\n";

    } else {

        $text .= "🚚 *Frais de livraison :* " . formatPrice($deliveryFee) . ($deliveryZone ? " ({$deliveryZone})" : "") . "\n";

    }

    $text .= "💎 *TOTAL À PAYER :* " . formatPrice($total) . "\n\n";

    $text .= "📍 *Mon nom & quartier de livraison à Dakar :* ";



    return "https://wa.me/{$phone}?text=" . rawurlencode($text);

}



/**

 * Retourne une instance singleton PDO pour les requêtes MySQL

 */

function getDBConnection(): ?PDO {
    static $pdo = null;
    static $attempted = false;
    if ($pdo === null && !$attempted) {
        $attempted = true;
        try {

            $dsn = sprintf("mysql:host=%s;port=%s;dbname=%s;charset=%s", DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);

            $options = [

                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,

                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,

                PDO::ATTR_EMULATE_PREPARES   => false,

                PDO::ATTR_TIMEOUT            => 5,

            ];

            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            ensureAccurateCatalogImages($pdo);

        } catch (Throwable $e) {

            $pdo = null;

            if (getenv('APP_DEBUG') === 'true') {

                error_log("DB Connection Error: " . $e->getMessage());

            }

        }

    }

    return $pdo;

}



// ─── 7. Moteur de Rate Limiting (Protection Anti-Brute-Force SecurityShield) ───

function getClientIP(): string {

    return SecurityShield::getClientIP();

}



function checkRateLimit(string $action = 'login', int $maxAttempts = 5, int $decaySeconds = 900, ?string $identifier = null): bool {

    return SecurityShield::checkRateLimit($action, $maxAttempts, $decaySeconds, $identifier);

}



function recordFailedAttempt(string $action = 'login', int $decaySeconds = 900, ?string $identifier = null): int {

    return SecurityShield::recordFailedAttempt($action, $decaySeconds, $identifier);

}



function clearRateLimit(string $action = 'login', ?string $identifier = null): void {

    SecurityShield::clearRateLimit($action, $identifier);

}



function getRateLimitRemainingMinutes(string $action = 'login', int $decaySeconds = 900, ?string $identifier = null): int {

    return SecurityShield::getRemainingMinutes($action, $decaySeconds, $identifier);

}





// ─── 8. Helpers Middleware RBAC, RLS & Protection Anti-BFcache ────────────────

function requireAuth(?string $redirect = null): array {

    // 1. Envoi systématique d'en-têtes Anti-BFcache (Empêche l'affichage de pages privées via le bouton retour du navigateur)

    if (!headers_sent()) {

        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');

        header('Pragma: no-cache');

        header('Expires: Thu, 01 Jan 1970 00:00:00 GMT');

    }



    if (!isLoggedIn()) {

        $isInSubdir = (strpos($_SERVER['PHP_SELF'] ?? '', '/admin/') !== false || strpos($_SERVER['PHP_SELF'] ?? '', '/seller/') !== false);

        $defaultLogin = $isInSubdir ? '../login.php' : 'login.php';

        $loginUrl = $redirect ?: $defaultLogin;

        

        $target = $loginUrl . '?redirect=' . urlencode($_SERVER['REQUEST_URI'] ?? '');

        header("Location: {$target}");

        exit;

    }

    return getCurrentUser();

}



function requireAdmin(): array {

    $user = requireAuth();

    if (($user['role'] ?? '') !== 'admin') {

        http_response_code(403);

        $homeUrl = (strpos($_SERVER['PHP_SELF'] ?? '', '/admin/') !== false) ? '../index.php' : 'index.php';

        die('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>403 Accès Refusé — SenTechPLUS</title><style>body{font-family:system-ui,sans-serif;text-align:center;padding:60px;background:#F8FAFC;color:#182230;}h1{color:#C2410C;font-size:2rem;}a{color:#1677FF;font-weight:bold;text-decoration:none;}</style></head><body><h1>403 — Accès Refusé</h1><p>Cette section est strictement réservée à l\'administrateur du système.</p><p style="margin-top:20px;"><a href="' . htmlspecialchars($homeUrl) . '">← Retour au site public</a></p></body></html>');

    }

    return $user;

}



function requireSeller(): array {

    $user = requireAuth();

    if (($user['role'] ?? '') !== 'seller' && ($user['role'] ?? '') !== 'admin') {

        http_response_code(403);

        $homeUrl = (strpos($_SERVER['PHP_SELF'] ?? '', '/seller/') !== false) ? '../index.php' : 'index.php';

        $pricingUrl = (strpos($_SERVER['PHP_SELF'] ?? '', '/seller/') !== false) ? '../pricing.php' : 'pricing.php';

        die('<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>403 Espace Vendeur Requis — SenTechPLUS</title><style>body{font-family:system-ui,sans-serif;text-align:center;padding:60px;background:#F8FAFC;color:#182230;}h1{color:#C2410C;font-size:2rem;}a{color:#1677FF;font-weight:bold;text-decoration:none;}</style></head><body><h1>403 — Accès Vendeur Requis</h1><p>Cette section est réservée aux vendeurs partenaires certifiés SenTechPLUS.</p><p style="margin-top:20px;"><a href="' . htmlspecialchars($pricingUrl) . '">Devenir Vendeur</a> • <a href="' . htmlspecialchars($homeUrl) . '">Retour à l\'accueil</a></p></body></html>');

    }

    return $user;

}



/**

 * Sécurise les redirections (Anti-Open Redirect CWE-601)

 * Empêche toute redirection vers des domaines externes ou des protocoles malveillants.

 */

function getSafeRedirectUrl(?string $redirect, string $userRole = 'customer'): string {

    if (empty($redirect)) {

        return ($userRole === 'admin') ? 'admin/index.php' : 'index.php';

    }



    $redirect = trim($redirect);



    // 1. Rejeter les schémas d'URL absolues (http://, https://, ftp://, javascript:, data:)

    if (preg_match('#^(https?|ftp|javascript|data):#i', $redirect)) {

        return ($userRole === 'admin') ? 'admin/index.php' : 'index.php';

    }



    // 2. Rejeter tout antislash (\\) ou double slash (//) pour éviter l'évasion d'hôte

    if (str_contains($redirect, '\\') || str_starts_with($redirect, '//') || str_starts_with($redirect, '/\\')) {

        return ($userRole === 'admin') ? 'admin/index.php' : 'index.php';

    }



    // 3. Parser l'URL pour vérifier l'absence d'hôte externe

    $parsed = parse_url($redirect);

    if ($parsed === false || !empty($parsed['host']) || !empty($parsed['scheme'])) {

        return ($userRole === 'admin') ? 'admin/index.php' : 'index.php';

    }



    $path = $parsed['path'] ?? $redirect;

    $filename = basename($path);



    // 4. Interdire la redirection en boucle sur les pages d'authentification

    $forbiddenFiles = ['login.php', 'register.php', 'logout.php', 'forgot-password.php', 'reset-password.php'];

    if (in_array($filename, $forbiddenFiles, true)) {

        return ($userRole === 'admin') ? 'admin/index.php' : 'index.php';

    }



    // 5. Protection de l'espace Admin : seul un compte admin peut être redirigé vers admin/

    if (str_contains($path, 'admin/') || str_starts_with($path, 'admin/')) {

        if ($userRole !== 'admin') {

            return 'index.php';

        }

    }



    // 6. Nettoyage et vérification des caractères autorisés dans l'URL relative

    $safeUrl = filter_var($redirect, FILTER_SANITIZE_URL);

    if (empty($safeUrl) || preg_match('/[\r\n\t]/', $safeUrl)) {

        return ($userRole === 'admin') ? 'admin/index.php' : 'index.php';

    }



    return $safeUrl;

}



/**

 * Normalise les images de produit en tableau d'URLs valides.

 * Résout de manière transparente et sécurisée :

 * - Les tableaux PHP natifs (['assets/images/p1.webp'])

 * - Les chaînes JSON ('["assets/images/p1.webp"]')

 * - Les chaînes simples d'URL ('assets/images/p1.webp')

 * - Les listes séparées par des virgules ('p1.webp, p2.webp')

 * - Les valeurs vides ou nulles (avec image de repli par défaut)

 */

function getProductImages(mixed $images, string $fallback = 'assets/images/product_img1.webp'): array {

    if (empty($images)) {

        return [$fallback];

    }

    

    // 1. Si déjà un tableau PHP

    if (is_array($images)) {

        $filtered = array_values(array_filter(array_map('trim', $images)));

        return !empty($filtered) ? $filtered : [$fallback];

    }

    

    if (!is_string($images)) {

        return [$fallback];

    }

    

    $trimmed = trim($images);

    if ($trimmed === '') {

        return [$fallback];

    }

    

    // 2. Si chaîne JSON

    if (str_starts_with($trimmed, '[') || str_starts_with($trimmed, '{')) {

        $decoded = json_decode($trimmed, true);

        if (is_array($decoded) && !empty($decoded)) {

            $filtered = array_values(array_filter(array_map('trim', $decoded)));

            if (!empty($filtered)) {

                return $filtered;

            }

        }

    }

    

    // 3. Si chaîne séparée par virgule

    if (str_contains($trimmed, ',')) {

        $parts = array_values(array_filter(array_map('trim', explode(',', $trimmed))));

        if (!empty($parts)) {

            return $parts;

        }

    }

    

    // 4. Chaîne simple (URL unique)

    return [$trimmed];

}



/**
 * Table de correspondance visuelle exacte des produits du catalogue officiel
 * Corrige toute inversion d'image (ex: montre affichée sur lampe LED ou PS5 sur caméra)
 */
function getOfficialProductImageMap(): array {
    return [
        'prod_1' => 'assets/images/product_img4.webp',  // Casque Studio Pro Sans Fil ANC
        'prod_2' => 'assets/images/product_img13.webp', // Montre Connectée Sport V3 AMOLED
        'prod_3' => 'assets/images/product_img2.webp',  // Enceinte Nomade Bluetooth HD 360°
        'prod_4' => 'assets/images/product_img9.webp',  // Écouteurs True Wireless Bass+ Pro
        'prod_5' => 'assets/images/product_img11.webp', // Souris Ergonomique Sans Fil Silence
        'prod_6' => 'assets/images/product_img7.webp',  // Chargeur Rapide GaN 65W Multi-Port
        'prod_7' => 'assets/images/product_img15.webp', // Casque Gamer Surround 7.1 RGB Pro
        'prod_8' => 'assets/images/product_img1.webp',  // Lampe de Bureau LED Tactile avec Induction
        'prod_9' => 'assets/images/product_img6.webp',  // Caméra de Surveillance Wi-Fi 2K 360°
    ];
}

/**
 * Synchronise automatiquement et de manière idempotente les images des produits et catégories en BDD
 */
function ensureAccurateCatalogImages(?PDO $pdo = null): void {
    if (!$pdo) return;
    static $synced = false;
    if ($synced) return;
    $synced = true;

    try {
        // Vérifie si prod_8 (Lampe de bureau) pointe encore sur l'ancienne image (product_img13.webp)
        $stmtCheck = $pdo->query("SELECT images FROM products WHERE id = 'prod_8' LIMIT 1");
        $currentImg8 = $stmtCheck ? (string)$stmtCheck->fetchColumn() : '';
        if (strpos($currentImg8, 'product_img13.webp') !== false || strpos($currentImg8, 'product_img1.webp') === false) {
            $prodMap = getOfficialProductImageMap();
            $stmtUpdProd = $pdo->prepare("UPDATE products SET images = :imgs WHERE id = :id");
            foreach ($prodMap as $pid => $imgPath) {
                $stmtUpdProd->execute([
                    ':imgs' => json_encode([$imgPath], JSON_UNESCAPED_SLASHES),
                    ':id'   => $pid
                ]);
            }

            $catMap = [
                'cat_montres'               => 'assets/images/product_img13.webp',
                'sub_montres_connectees'    => 'assets/images/product_img13.webp',
                'sub_bracelets_connectes'   => 'assets/images/product_img10.webp',
                'sub_accessoires_montres'   => 'assets/images/product_img3.webp',
                'sub_trackers_gadgets'      => 'assets/images/product_img10.webp',
                'cat_informatique'          => 'assets/images/product_img11.webp',
                'sub_souris'                => 'assets/images/product_img11.webp',
                'sub_claviers'              => 'assets/images/product_img11.webp',
                'sub_supports_laptop'       => 'assets/images/product_img11.webp',
                'sub_hubs_adaptateurs'      => 'assets/images/product_img7.webp',
                'sub_stockage_usb'          => 'assets/images/product_img11.webp',
                'sub_accessoires_pc'        => 'assets/images/product_img11.webp',
                'cat_gaming'                => 'assets/images/product_img14.webp',
                'sub_casques_gaming'        => 'assets/images/product_img15.webp',
                'sub_souris_gaming'         => 'assets/images/product_img11.webp',
                'sub_claviers_gaming'       => 'assets/images/product_img14.webp',
                'sub_manettes'              => 'assets/images/product_img14.webp',
                'sub_supports_console'      => 'assets/images/product_img14.webp',
                'cat_maison'                => 'assets/images/product_img1.webp',
                'sub_lampes_led'            => 'assets/images/product_img1.webp',
                'sub_prises_multiprises'    => 'assets/images/product_img1.webp',
                'sub_eclairage_deco'        => 'assets/images/product_img16.webp',
                'sub_accessoires_domotique' => 'assets/images/product_img12.webp',
                'cat_securite'              => 'assets/images/product_img6.webp',
                'sub_cameras_wifi'          => 'assets/images/product_img6.webp',
                'sub_cameras_bebe'          => 'assets/images/product_img6.webp',
                'sub_mini_cameras'          => 'assets/images/product_img6.webp',
                'sub_accessoires_surveillance' => 'assets/images/product_img6.webp',
                'sub_ecouteurs_sans_fil'    => 'assets/images/product_img9.webp',
                'sub_barres_son'            => 'assets/images/product_img8.webp',
            ];
            $stmtUpdCat = $pdo->prepare("UPDATE categories SET image = :img WHERE id = :id");
            foreach ($catMap as $cid => $cImg) {
                $stmtUpdCat->execute([':img' => $cImg, ':id' => $cid]);
            }

            if (class_exists('FastCache')) {
                FastCache::forget('official_catalog_products');
                FastCache::forget('global_categories_tree');
            }
        }
    } catch (Throwable $e) {}
}

/**

 * Retourne l'image principale d'un produit (toujours une chaîne URL valide, jamais '[')

 */

function getProductMainImage(mixed $productOrImages, string $fallback = 'assets/images/product_img1.webp'): string {
    if (is_array($productOrImages) && !empty($productOrImages['id'])) {
        $officialMap = getOfficialProductImageMap();
        $pid = (string)$productOrImages['id'];
        if (isset($officialMap[$pid])) {
            $rawImgs = getProductImages($productOrImages['images'] ?? $productOrImages['image'] ?? '', '');
            $firstImg = $rawImgs[0] ?? '';
            // Si l'image est vide ou utilise une image générique product_img*.webp, garantir la bonne correspondance
            if ($firstImg === '' || str_starts_with($firstImg, 'assets/images/product_img')) {
                return $officialMap[$pid];
            }
        }
    }

    if (is_array($productOrImages) && isset($productOrImages['images'])) {

        $imgs = getProductImages($productOrImages['images'], $fallback);

        return $imgs[0] ?? $fallback;

    }

    if (is_array($productOrImages) && isset($productOrImages['image'])) {

        $imgs = getProductImages($productOrImages['image'], $fallback);

        return $imgs[0] ?? $fallback;

    }

    $imgs = getProductImages($productOrImages, $fallback);

    return $imgs[0] ?? $fallback;

}



// ─── 9. Upload Sécurisé de Fichiers (MIME Réel Binaire + Taille Max) ──────────

function handleSecureUpload(

    array $file, 

    array $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'], 

    int $maxBytes = 2097152, // 2 Mo

    string $destDir = 'assets/images/uploads/'

): array {

    if (!isset($file['error']) || is_array($file['error'])) {

        return ['success' => false, 'error' => 'Paramètres d\'upload invalides.'];

    }

    

    switch ($file['error']) {

        case UPLOAD_ERR_OK:

            break;

        case UPLOAD_ERR_NO_FILE:

            return ['success' => false, 'error' => 'Aucun fichier sélectionné.'];

        case UPLOAD_ERR_INI_SIZE:

        case UPLOAD_ERR_FORM_SIZE:

            return ['success' => false, 'error' => 'Le fichier dépasse la taille maximale autorisée (2 Mo).'];

        default:

            return ['success' => false, 'error' => 'Erreur inconnue lors du transfert.'];

    }

    

    if ($file['size'] > $maxBytes) {

        return ['success' => false, 'error' => 'Le fichier est trop lourd. Limite : ' . round($maxBytes / 1048576, 1) . ' Mo.'];

    }

    

    // Vérification du type MIME binaire réel

    $finfo = finfo_open(FILEINFO_MIME_TYPE);

    $mimeType = finfo_file($finfo, $file['tmp_name']);

    finfo_close($finfo);

    

    if (!in_array($mimeType, $allowedMimes, true)) {

        return ['success' => false, 'error' => 'Type de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, SVG.'];

    }

    

    // Extensions autorisées correspondantes

    $mimeMap = [

        'image/jpeg'    => 'jpg',

        'image/png'     => 'png',

        'image/webp'    => 'webp',

        'image/svg+xml' => 'svg'

    ];

    $ext = $mimeMap[$mimeType] ?? 'bin';

    

    // Nom aléatoire cryptographique

    $newFileName = bin2hex(random_bytes(16)) . '.' . $ext;

    $targetDir = __DIR__ . '/../' . ltrim($destDir, '/');

    if (!is_dir($targetDir)) {

        @mkdir($targetDir, 0755, true);

    }

    $targetPath = rtrim($targetDir, '/') . '/' . $newFileName;

    

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {

        return ['success' => false, 'error' => 'Impossible d\'enregistrer le fichier sur le serveur.'];

    }

    

    return [

        'success'   => true,

        'file_name' => $newFileName,

        'rel_path'  => ltrim($destDir, '/') . $newFileName,

        'mime_type' => $mimeType,

        'size'      => $file['size']

    ];

}



// ─── 10. Vérification Cryptographique des Webhooks HMAC-SHA256 ─────────────────

function verifyHmacSignature(string $payload, ?string $signature, string $secret): bool {

    if (empty($signature) || empty($secret)) return false;

    $expected = hash_hmac('sha256', $payload, $secret);

    return hash_equals($expected, $signature);

}



// ─── 11. Configuration Publique Frontend (Zéro Secret) ────────────────────────

function getClientPublicConfig(): array {

    return [

        'appName'         => SITE_NAME,

        'currency'        => 'FCFA',

        'stripePublicKey' => getenv('STRIPE_PUBLIC_KEY') ?: '',

        'env'             => getenv('APP_ENV') ?: 'production'

    ];

}



// ─── Fonctions Utilitaires & Image Delivery Optimization ──────────────────────



/**

 * Optimisation d'image WebP (Lighthouse Image Delivery Optimization)

 * Convertit automatiquement les chemins .png/.jpg vers .webp s'ils existent

 */

function webpImage(?string $path): string {

    if (!$path) return 'assets/images/product_img1.webp';

    $webpPath = preg_replace('/\.(png|jpg|jpeg)$/i', '.webp', $path);

    if (file_exists(__DIR__ . '/../' . $webpPath)) {

        return $webpPath;

    }

    return $path;

}



/**

 * Formate un prix en FCFA avec séparateur de milliers

 */

function formatPrice($amount): string {

    return number_format((float)$amount, 0, ',', ' ') . APP_CURRENCY_SYMBOL;

}



/**

 * Sanitisation des entrées utilisateur contre les failles XSS

 */

function sanitize(?string $data): string {

    if ($data === null) return '';

    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');

}



/**

 * Vérifie si l'utilisateur courant est connecté

 */

function isLoggedIn(): bool {

    if (empty($_SESSION['user_id'])) {

        return false;

    }

    if (!SecurityShield::validateSessionFingerprint()) {

        return false;

    }

    return true;

}





/**

 * Retourne l'utilisateur connecté ou null

 */

function getCurrentUser(): ?array {

    if (!isLoggedIn()) return null;

    return $_SESSION['user'] ?? null;

}



/**

 * Vérifie si l'utilisateur est administrateur

 */

function isAdmin(): bool {

    $user = getCurrentUser();

    return $user !== null && ($user['role'] ?? '') === 'admin';

}



/**

 * Vérifie si l'utilisateur est vendeur

 */

function isSeller(): bool {

    $user = getCurrentUser();

    return $user !== null && (($user['role'] ?? '') === 'seller' || ($user['role'] ?? '') === 'admin');

}



/**

 * Gestion du Panier (Stocké en Session)

 */

function getCartItems(): array {

    if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {

        $_SESSION['cart'] = [];

    }

    return $_SESSION['cart'];

}



/**

 * Récupère le stock disponible pour un produit

 */

function getProductStock(string $productId): int {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $stmt = $pdo->prepare("SELECT stock FROM products WHERE id = :id");

            $stmt->execute([':id' => $productId]);

            $res = $stmt->fetchColumn();

            if ($res !== false) return max(0, (int)$res);

        } catch (Throwable $e) {}

    }

    return 25;

}



function addToCart(string $productId, int $qty = 1): int {

    $cart = getCartItems();

    $maxStock = getProductStock($productId);

    $currentQty = $cart[$productId] ?? 0;

    $newQty = min($maxStock, $currentQty + max(1, $qty));

    $cart[$productId] = $newQty;

    $_SESSION['cart'] = $cart;

    return $newQty;

}



function updateCartQuantity(string $productId, int $qty): int {

    $cart = getCartItems();

    if ($qty <= 0) {

        unset($cart[$productId]);

        $newQty = 0;

    } else {

        $maxStock = getProductStock($productId);

        $newQty = min($maxStock, $qty);

        $cart[$productId] = $newQty;

    }

    $_SESSION['cart'] = $cart;

    return $newQty;

}



function removeFromCart(string $productId): void {

    $cart = getCartItems();

    unset($cart[$productId]);

    $_SESSION['cart'] = $cart;

}



function getCartCount(): int {

    $cart = getCartItems();

    return array_sum($cart);

}



/**

 * Gestion de la Wishlist (Favoris)

 */

function getWishlistItems(): array {

    if (!isset($_SESSION['wishlist']) || !is_array($_SESSION['wishlist'])) {

        $_SESSION['wishlist'] = [];

    }

    return $_SESSION['wishlist'];

}



function toggleWishlist(string $productId): bool {

    $wishlist = getWishlistItems();

    if (in_array($productId, $wishlist, true)) {

        $wishlist = array_values(array_diff($wishlist, [$productId]));

        $added = false;

    } else {

        $wishlist[] = $productId;

        $added = true;

    }

    $_SESSION['wishlist'] = $wishlist;

    return $added;

}



function isWishlisted(string $productId): bool {

    return in_array($productId, getWishlistItems(), true);

}



// ─── CSRF Security Protection ───────────────────────────────────────────────



/**

 * Génère ou récupère le jeton CSRF de la session

 */

function generateCSRFToken(): string {

    if (empty($_SESSION['csrf_token'])) {

        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

    }

    return $_SESSION['csrf_token'];

}



/**

 * Vérifie si le jeton CSRF soumis correspond au jeton en session

 */

function verifyCSRFToken(?string $token): bool {

    if (empty($_SESSION['csrf_token']) || empty($token)) {

        return false;

    }

    return hash_equals($_SESSION['csrf_token'], $token);

}



/**

 * Retourne le champ HTML masqué du jeton CSRF pour les formulaires

 */

function getCSRFInputField(): string {

    $token = generateCSRFToken();

    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';

}



// ─── Système de Catégories & Sous-Catégories Hiérarchiques ────────────────────



/**

 * Assure la création automatique de la table categories si elle n'existe pas encore

 */

function ensureCategoriesTableExists(?PDO $pdo = null): void {

    if ($pdo === null) $pdo = getDBConnection();

    if (!$pdo) return;



    static $checked = false;

    if ($checked) return;

    $checked = true;



    try {

        $pdo->exec("CREATE TABLE IF NOT EXISTS categories (

            id VARCHAR(64) PRIMARY KEY,

            name VARCHAR(100) NOT NULL,

            slug VARCHAR(100) NOT NULL UNIQUE,

            description TEXT NULL,

            image VARCHAR(255) NULL,

            icon VARCHAR(50) NOT NULL DEFAULT 'box',

            parent_id VARCHAR(64) NULL,

            display_order INT NOT NULL DEFAULT 0,

            is_active TINYINT(1) NOT NULL DEFAULT 1,

            is_featured TINYINT(1) NOT NULL DEFAULT 0,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            INDEX idx_cat_parent (parent_id),

            INDEX idx_cat_active (is_active),

            INDEX idx_cat_order (display_order)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    } catch (Throwable $e) {}

}



/**

 * Retourne l'arborescence complète des catégories et sous-catégories (Mise en cache haute performance)

 */

function getAllCategoriesTree(): array {

    return FastCache::remember('global_categories_tree', 3600, function() {

        try {

            $pdo = getDBConnection();

            if ($pdo) {

                ensureCategoriesTableExists($pdo);

                $stmt = $pdo->query("SELECT id, name, slug, description, image, icon, parent_id, display_order, is_featured FROM categories WHERE is_active = 1 ORDER BY display_order ASC, name ASC");

                $all = $stmt ? $stmt->fetchAll() : [];

            } else {

                $all = [];

            }



            if (!empty($all)) {

                $parents = [];

                $children = [];

                foreach ($all as $cat) {

                    if (empty($cat['parent_id'])) {

                        $parents[$cat['id']] = $cat;

                        $parents[$cat['id']]['subcategories'] = [];

                    } else {

                        $children[$cat['parent_id']][] = $cat;

                    }

                }

                foreach ($children as $parentId => $subs) {

                    if (isset($parents[$parentId])) {

                        $parents[$parentId]['subcategories'] = $subs;

                    }

                }

                return array_values($parents);

            }

        } catch (Throwable $e) {}



        // Fallback tree structuré conforme aux 7 grandes catégories

        return [

            [

                'id' => 'cat_telephones',

                'name' => 'Téléphones & Accessoires',

                'slug' => 'telephones-accessoires',

                'icon' => 'smartphone',

                'image' => 'assets/images/product_img7.webp',

                'description' => 'Accessoires essentiels pour smartphones iPhone, Samsung et Android.',

                'display_order' => 1,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_supports_tel', 'name' => 'Supports téléphone', 'slug' => 'supports-telephone', 'icon' => 'smartphone'],

                    ['id' => 'sub_coques', 'name' => 'Coques & protections', 'slug' => 'coques-protections', 'icon' => 'shield'],

                    ['id' => 'sub_chargeurs_cables', 'name' => 'Chargeurs & câbles', 'slug' => 'chargeurs-cables', 'icon' => 'zap'],

                    ['id' => 'sub_batteries_ext', 'name' => 'Batteries externes', 'slug' => 'batteries-externes', 'icon' => 'battery-charging'],

                    ['id' => 'sub_verres_trempes', 'name' => 'Verres trempés', 'slug' => 'verres-trempes', 'icon' => 'square'],

                    ['id' => 'sub_accessoires_voiture', 'name' => 'Accessoires voiture', 'slug' => 'accessoires-voiture', 'icon' => 'car']

                ]

            ],

            [

                'id' => 'cat_audio',

                'name' => 'Audio & Écouteurs',

                'slug' => 'audio-ecouteurs',

                'icon' => 'headphones',

                'image' => 'assets/images/product_img4.webp',

                'description' => 'Le meilleur du son haute fidélité, écouteurs sans fil et casques.',

                'display_order' => 2,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_ecouteurs_sans_fil', 'name' => 'Écouteurs sans fil', 'slug' => 'ecouteurs-sans-fil', 'icon' => 'music'],

                    ['id' => 'sub_casques_audio', 'name' => 'Casques audio', 'slug' => 'casques-audio', 'icon' => 'headphones'],

                    ['id' => 'sub_casques_studio', 'name' => 'Casques studio', 'slug' => 'casques-studio', 'icon' => 'sliders'],

                    ['id' => 'sub_enceintes_bt', 'name' => 'Enceintes Bluetooth', 'slug' => 'enceintes-bluetooth', 'icon' => 'volume-2'],

                    ['id' => 'sub_barres_son', 'name' => 'Barres de son', 'slug' => 'barres-de-son', 'icon' => 'tv'],

                    ['id' => 'sub_micros_audio', 'name' => 'Micros & accessoires audio', 'slug' => 'micros-accessoires-audio', 'icon' => 'mic']

                ]

            ],

            [

                'id' => 'cat_montres',

                'name' => 'Montres & Objets Connectés',

                'slug' => 'montres-objets-connectes',

                'icon' => 'watch',

                'image' => 'assets/images/product_img13.webp',

                'description' => 'Smartwatches, bracelets sport et suivi de santé quotidien.',

                'display_order' => 3,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_montres_connectees', 'name' => 'Montres connectées', 'slug' => 'montres-connectees', 'icon' => 'watch'],

                    ['id' => 'sub_bracelets_connectes', 'name' => 'Bracelets connectés', 'slug' => 'bracelets-connectes', 'icon' => 'activity'],

                    ['id' => 'sub_accessoires_montres', 'name' => 'Accessoires montres', 'slug' => 'accessoires-montres', 'icon' => 'link'],

                    ['id' => 'sub_trackers_gadgets', 'name' => 'Trackers & gadgets connectés', 'slug' => 'trackers-gadgets-connectes', 'icon' => 'navigation']

                ]

            ],

            [

                'id' => 'cat_informatique',

                'name' => 'Informatique & Bureau',

                'slug' => 'informatique-bureau',

                'icon' => 'laptop',

                'image' => 'assets/images/product_img11.webp',

                'description' => 'Périphériques, connectique et équipement setup bureautique.',

                'display_order' => 4,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_souris', 'name' => 'Souris', 'slug' => 'souris', 'icon' => 'mouse'],

                    ['id' => 'sub_claviers', 'name' => 'Claviers', 'slug' => 'claviers', 'icon' => 'keyboard'],

                    ['id' => 'sub_supports_laptop', 'name' => 'Supports laptop', 'slug' => 'supports-laptop', 'icon' => 'maximize-2'],

                    ['id' => 'sub_hubs_adaptateurs', 'name' => 'Hubs & adaptateurs', 'slug' => 'hubs-adaptateurs', 'icon' => 'cpu'],

                    ['id' => 'sub_stockage_usb', 'name' => 'Stockage USB / cartes mémoire', 'slug' => 'stockage-usb-cartes-memoire', 'icon' => 'hard-drive'],

                    ['id' => 'sub_accessoires_pc', 'name' => 'Accessoires PC', 'slug' => 'accessoires-pc', 'icon' => 'monitor']

                ]

            ],

            [

                'id' => 'cat_gaming',

                'name' => 'Gaming',

                'slug' => 'gaming',

                'icon' => 'gamepad-2',

                'image' => 'assets/images/product_img14.webp',

                'description' => 'Équipements haute performance pour joueurs PC, PS5 et Xbox.',

                'display_order' => 5,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_casques_gaming', 'name' => 'Casques gaming', 'slug' => 'casques-gaming', 'icon' => 'headphones'],

                    ['id' => 'sub_souris_gaming', 'name' => 'Souris gaming', 'slug' => 'souris-gaming', 'icon' => 'mouse'],

                    ['id' => 'sub_claviers_gaming', 'name' => 'Claviers gaming', 'slug' => 'claviers-gaming', 'icon' => 'keyboard'],

                    ['id' => 'sub_manettes', 'name' => 'Manettes', 'slug' => 'manettes', 'icon' => 'gamepad'],

                    ['id' => 'sub_supports_console', 'name' => 'Supports & accessoires console', 'slug' => 'supports-accessoires-console', 'icon' => 'layers']

                ]

            ],

            [

                'id' => 'cat_maison',

                'name' => 'Maison & Énergie',

                'slug' => 'maison-energie',

                'icon' => 'zap',

                'image' => 'assets/images/product_img1.webp',

                'description' => 'Éclairage intelligent, solutions d’alimentation et domotique.',

                'display_order' => 6,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_lampes_led', 'name' => 'Lampes LED', 'slug' => 'lampes-led', 'icon' => 'sun'],

                    ['id' => 'sub_prises_multiprises', 'name' => 'Prises & multiprises', 'slug' => 'prises-multiprises', 'icon' => 'power'],

                    ['id' => 'sub_chargeurs_secteur', 'name' => 'Chargeurs secteur', 'slug' => 'chargeurs-secteur', 'icon' => 'plug'],

                    ['id' => 'sub_eclairage_deco', 'name' => 'Éclairage décoratif', 'slug' => 'eclairage-decoratif', 'icon' => 'sparkles'],

                    ['id' => 'sub_accessoires_domotique', 'name' => 'Accessoires maison connectée', 'slug' => 'accessoires-domotique', 'icon' => 'home']

                ]

            ],

            [

                'id' => 'cat_securite',

                'name' => 'Sécurité & Caméras',

                'slug' => 'securite-cameras',

                'icon' => 'camera',

                'image' => 'assets/images/product_img6.webp',

                'description' => 'Surveillance vidéo intelligente, caméras Wi-Fi et capteurs de sécurité.',

                'display_order' => 7,

                'is_featured' => 1,

                'subcategories' => [

                    ['id' => 'sub_cameras_wifi', 'name' => 'Caméras Wi-Fi', 'slug' => 'cameras-wi-fi', 'icon' => 'camera'],

                    ['id' => 'sub_cameras_bebe', 'name' => 'Caméras bébé', 'slug' => 'cameras-bebe', 'icon' => 'eye'],

                    ['id' => 'sub_mini_cameras', 'name' => 'Mini caméras', 'slug' => 'mini-cameras', 'icon' => 'video'],

                    ['id' => 'sub_accessoires_surveillance', 'name' => 'Accessoires surveillance', 'slug' => 'accessoires-surveillance', 'icon' => 'shield-check']

                ]

            ]

        ];

    });

}



/**

 * Retourne les catégories principales (top-level)

 */

function getMainCategories(): array {

    $tree = getAllCategoriesTree();

    $main = [];

    foreach ($tree as $parent) {

        $copy = $parent;

        unset($copy['subcategories']);

        $main[] = $copy;

    }

    return $main;

}



/**

 * Retourne les sous-catégories d'un parent donné (par ID, slug ou nom)

 */

function getSubcategories(string $parentIdentifier): array {

    $tree = getAllCategoriesTree();

    foreach ($tree as $parent) {

        if ($parent['id'] === $parentIdentifier || $parent['slug'] === $parentIdentifier || strcasecmp($parent['name'], $parentIdentifier) === 0) {

            return $parent['subcategories'] ?? [];

        }

    }

    return [];

}



/**

 * Trouve une catégorie ou sous-catégorie par son slug ou son nom

 */

function getCategoryBySlug(string $slug): ?array {

    $tree = getAllCategoriesTree();

    foreach ($tree as $parent) {

        if ($parent['slug'] === $slug || strcasecmp($parent['name'], $slug) === 0) {

            return $parent;

        }

        if (!empty($parent['subcategories'])) {

            foreach ($parent['subcategories'] as $sub) {

                if ($sub['slug'] === $slug || strcasecmp($sub['name'], $slug) === 0) {

                    $sub['parent_name'] = $parent['name'];

                    $sub['parent_slug'] = $parent['slug'];

                    return $sub;

                }

            }

        }

    }

    return null;

}



// ─── Système Produit Entreprise (Variantes, Fiches Techniques, Marques) ────────



/**

 * Calcule automatiquement le pourcentage de réduction

 */

function calculateDiscount(float $price, float $mrp): int {

    if ($mrp > $price && $mrp > 0) {

        return (int)round((($mrp - $price) / $mrp) * 100);

    }

    return 0;

}



/**

 * Récupère les variantes d'un produit (ex: couleurs, capacités, modèles)

 */

function getProductVariants(string $productId): array {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $stmt = $pdo->prepare("SELECT * FROM product_variants WHERE product_id = :pid ORDER BY is_default DESC, price ASC");

            $stmt->execute([':pid' => $productId]);

            $variants = $stmt->fetchAll();

            if (!empty($variants)) return $variants;

        } catch (Throwable $e) {}

    }



    // Zéro variante mockée : retour vide si aucune variante configurée en BDD
    return [];

}



/**

 * Récupère la fiche technique (Spécifications Clé / Valeur)

 */

function getProductSpecs(string $productId, ?string $rawDescription = null): array {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $stmt = $pdo->prepare("SELECT spec_key, spec_value FROM product_specs WHERE product_id = :pid ORDER BY display_order ASC");

            $stmt->execute([':pid' => $productId]);

            $specs = $stmt->fetchAll();

            if (!empty($specs)) return $specs;

        } catch (Throwable $e) {}

    }



    // Extraction automatique depuis la description si séparée par des points-virgules

    $specs = [];

    if (!empty($rawDescription) && strpos($rawDescription, ';') !== false) {

        $parts = explode(';', $rawDescription);

        foreach ($parts as $p) {

            $p = trim($p);

            if (empty($p)) continue;

            if (strpos($p, ':') !== false) {

                list($k, $v) = explode(':', $p, 2);

                $specs[] = ['spec_key' => trim($k), 'spec_value' => trim($v)];

            } else {

                $guessedKey = 'Caractéristique';
                if (preg_match('/\b(audio|son|watts?|\d+w\b|bass|sonore|stéréo|haut-parleur)/i', $p)) {
                    $guessedKey = 'Audio / Puissance';
                } elseif (preg_match('/\b(ipx\d*|étanche|waterproof|immersion|résistance|résistant)/i', $p)) {
                    $guessedKey = 'Étanchéité';
                } elseif (preg_match('/\b(autonomie|\d+h\b|heures?)/i', $p)) {
                    $guessedKey = 'Autonomie';
                } elseif (preg_match('/\b(powerbank|batterie|mah|charge|recharge)/i', $p)) {
                    $guessedKey = 'Batterie & Charge';
                } elseif (preg_match('/\b(bluetooth|wi-?fi|sans fil|portée|connexion|connectivité)/i', $p)) {
                    $guessedKey = 'Connectivité';
                } elseif (preg_match('/\b(finition|tissu|aluminium|poids|dimensions?|boîtier|conception)/i', $p)) {
                    $guessedKey = 'Conception & Matériaux';
                } elseif (preg_match('/\b(garantie|garanti|sav)/i', $p)) {
                    $guessedKey = 'Garantie';
                }
                $specs[] = ['spec_key' => $guessedKey, 'spec_value' => $p];

            }

        }

    }



    if (empty($specs)) {

        $defaultSpecs = [

            'prod_1' => [

                ['spec_key' => 'Autonomie', 'spec_value' => '40 heures de lecture continue (ANC activé)'],

                ['spec_key' => 'Connexion', 'spec_value' => 'Bluetooth 5.3 + Câble Jack 3.5mm détachable'],

                ['spec_key' => 'Réduction de Bruit', 'spec_value' => 'Active Noise Cancelling (ANC) hybride 38dB'],

                ['spec_key' => 'Compatibilité', 'spec_value' => 'iOS, Android, Windows, macOS, PS5'],

                ['spec_key' => 'Garantie', 'spec_value' => 'Garantie 30 jours SenTechPLUS']

            ],

            'prod_2' => [

                ['spec_key' => 'Écran', 'spec_value' => 'Écran tactile AMOLED HD 1.43 pouces (466x466 px)'],

                ['spec_key' => 'Capteurs', 'spec_value' => 'Cardiofréquencemètre 24/7, SpO2, Podomètre, Sommeil'],

                ['spec_key' => 'Étanchéité', 'spec_value' => 'Certification IP68 (résistant à l\'eau et transpiration)'],

                ['spec_key' => 'Autonomie', 'spec_value' => '7 à 10 jours en utilisation normale'],

                ['spec_key' => 'Appels', 'spec_value' => 'Haut-parleur & Micro intégrés pour appels Bluetooth']

            ],

            'prod_4' => [

                ['spec_key' => 'Drivers Audio', 'spec_value' => 'Transducteurs 10mm en graphène haute fidélité'],

                ['spec_key' => 'Microphones', 'spec_value' => '4 microphones ENC avec réduction de bruit ambiant'],

                ['spec_key' => 'Autonomie', 'spec_value' => '8h par charge + 24h avec le boîtier USB-C'],

                ['spec_key' => 'Recharge', 'spec_value' => 'Charge rapide USB-C (10 min = 2h d\'écoute)']

            ],

            'prod_6' => [

                ['spec_key' => 'Technologie', 'spec_value' => 'Composants GaN III (Nitrure de Gallium)'],

                ['spec_key' => 'Puissance Totale', 'spec_value' => '65W Max Power Delivery 3.0 & PPS'],

                ['spec_key' => 'Ports', 'spec_value' => '2 x USB-C (65W) + 1 x USB-A (30W)'],

                ['spec_key' => 'Sécurité', 'spec_value' => 'Protection surtension, surchauffe et court-circuit']

            ]

        ];

        $specs = $defaultSpecs[$productId] ?? [

            ['spec_key' => 'Garantie', 'spec_value' => 'Garantie 100% Original SenTechPLUS Dakar'],

            ['spec_key' => 'Livraison', 'spec_value' => 'Livraison Express Dakar sous 2h']

        ];

    }



    return $specs;

}



/**

 * Catalogue de référence officiel SenTechPLUS avec mise en cache

 */

function getOfficialCatalogProducts(): array {

    return FastCache::remember('official_catalog_products', 1800, function() {
        $pdo = getDBConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->query("SELECT id, name, price, mrp, category_id, images, in_stock, stock, description, sales_count 
                                     FROM products 
                                     WHERE is_active = 1 
                                     ORDER BY sales_count DESC");
                return $stmt ? $stmt->fetchAll() : [];
            } catch (Throwable $e) {}
        }
        return [];
    });

}



/**

 * Enregistrement et récupération des produits récemment consultés

 */

function addRecentlyViewedProduct(string $productId): void {

    if (!isset($_SESSION['recently_viewed']) || !is_array($_SESSION['recently_viewed'])) {

        $_SESSION['recently_viewed'] = [];

    }

    $_SESSION['recently_viewed'] = array_values(array_diff($_SESSION['recently_viewed'], [$productId]));

    array_unshift($_SESSION['recently_viewed'], $productId);

    $_SESSION['recently_viewed'] = array_slice($_SESSION['recently_viewed'], 0, 6);

}



function getRecentlyViewedProducts(): array {

    return $_SESSION['recently_viewed'] ?? [];

}



// ─── Système d'Annonces & Bannières Header & Pages ───────────────────────────



/**

 * Assure la création automatique de la table announcements si elle n'existe pas encore

 */

function ensureAnnouncementsTableExists(?PDO $pdo = null): void {

    if ($pdo === null) $pdo = getDBConnection();

    if (!$pdo) return;



    static $checked = false;

    if ($checked) return;

    $checked = true;



    try {

        $pdo->exec("CREATE TABLE IF NOT EXISTS announcements (

            id VARCHAR(64) PRIMARY KEY,

            title VARCHAR(255) NOT NULL,

            subtitle VARCHAR(255) NULL,

            type VARCHAR(50) NOT NULL DEFAULT 'text',

            placement VARCHAR(50) NOT NULL DEFAULT 'header_top_center',

            message TEXT NULL,

            button_text VARCHAR(100) NULL,

            button_url VARCHAR(255) NULL DEFAULT 'shop.php',

            target_blank TINYINT(1) NOT NULL DEFAULT 0,

            badge_text VARCHAR(100) NULL,

            discount_text VARCHAR(50) NULL,

            icon VARCHAR(50) NOT NULL DEFAULT 'sparkles',

            image_desktop VARCHAR(255) NULL,

            image_mobile VARCHAR(255) NULL,

            background_color VARCHAR(30) NULL DEFAULT '#FFFFFF',

            text_color VARCHAR(30) NULL DEFAULT '#182230',

            button_color VARCHAR(30) NULL DEFAULT '#1677FF',

            display_order INT NOT NULL DEFAULT 0,

            is_active TINYINT(1) NOT NULL DEFAULT 1,

            starts_at DATETIME NULL,

            ends_at DATETIME NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            INDEX idx_ann_placement (placement),

            INDEX idx_ann_active (is_active),

            INDEX idx_ann_order (display_order)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    } catch (Throwable $e) {}

}



/**

 * Récupère les annonces actives et non expirées pour un emplacement donné

 */

function getActiveAnnouncements(?string $placement = null): array {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            ensureAnnouncementsTableExists($pdo);

            $now = date('Y-m-d H:i:s');

            if ($placement) {

                $stmt = $pdo->prepare("SELECT * FROM announcements 

                                       WHERE is_active = 1 

                                       AND placement = :pl 

                                       AND (starts_at IS NULL OR starts_at <= :now1) 

                                       AND (ends_at IS NULL OR ends_at >= :now2) 

                                       ORDER BY display_order ASC, created_at DESC");

                $stmt->execute([':pl' => $placement, ':now1' => $now, ':now2' => $now]);

            } else {

                $stmt = $pdo->prepare("SELECT * FROM announcements 

                                       WHERE is_active = 1 

                                       AND (starts_at IS NULL OR starts_at <= :now1) 

                                       AND (ends_at IS NULL OR ends_at >= :now2) 

                                       ORDER BY display_order ASC, created_at DESC");

                $stmt->execute([':now1' => $now, ':now2' => $now]);

            }

            $results = $stmt->fetchAll();

            if (!empty($results)) return $results;

        } catch (Throwable $e) {}

    }



    // Zéro annonce mockée : retour vide si aucune annonce configurée en BDD
    return [];

}



// ─── Fonctions Tunnel de Commande & Gestion des Commandes ─────────────────────



/**

 * Récupère un produit complet par son ID (MySQL ou fallback catalogue de secours)

 */

function getProductById(string $productId): ?array {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $altId = is_numeric($productId) ? ('prod_' . $productId) : (str_starts_with($productId, 'prod_') ? preg_replace('/^prod_/', '', $productId) : ('prod_' . $productId));

            $stmt = $pdo->prepare("SELECT p.*, s.name as store_name, s.username as store_username, s.logo as store_logo 

                                   FROM products p 

                                   LEFT JOIN stores s ON p.store_id = s.id 

                                   WHERE p.id = :id OR p.id = :altId LIMIT 1");

            $stmt->execute([':id' => $productId, ':altId' => $altId]);

            $prod = $stmt->fetch();

            if ($prod) return $prod;

        } catch (Throwable $e) {}

    }



    // Zéro produit mocké : interrogation exclusive MySQL
    return null;
}

function calculateCartTotals(string $zoneId = 'zone_dakar', string $method = 'express'): array {

    $cartItems = getCartItems();

    $subtotal = 0.0;

    $itemsDetail = [];



    foreach ($cartItems as $pid => $qty) {

        $product = getProductById($pid);

        if ($product) {

            $price = (float)$product['price'];

            $lineSubtotal = $price * $qty;

            $subtotal += $lineSubtotal;

            $itemsDetail[] = [

                'product' => $product,

                'quantity' => $qty,

                'unit_price' => $price,

                'line_total' => $lineSubtotal

            ];

        }

    }



    // Réduction Coupon

    $discountTotal = 0.0;

    $appliedCoupon = $_SESSION['applied_coupon'] ?? null;

    if ($appliedCoupon && !empty($appliedCoupon['discount'])) {

        $discountPct = (float)$appliedCoupon['discount'];

        $discountTotal = round(($subtotal * $discountPct) / 100, 2);

        if ($discountTotal > $subtotal) $discountTotal = $subtotal;

    }



    // Frais de livraison selon zone

    $deliveryFees = [

        'zone_dakar' => ['standard' => 2000, 'express' => 3000],

        'zone_thies' => ['standard' => 3500, 'express' => 5000],

        'zone_stlouis' => ['standard' => 4500, 'express' => 7000],

        'zone_regions' => ['standard' => 5000, 'express' => 8000]

    ];

    $zoneRates = $deliveryFees[$zoneId] ?? $deliveryFees['zone_dakar'];

    $deliveryFee = (float)($zoneRates[$method] ?? $zoneRates['standard']);



    // Règle Commerciale Officielle : Livraison gratuite dès 50 000 FCFA à Dakar

    $isFreeShippingQualified = ($subtotal >= 50000);

    if ($isFreeShippingQualified && $zoneId === 'zone_dakar') {

        if ($method === 'standard') {

            $deliveryFee = 0.0;

        } elseif ($method === 'express') {

            // Remise de 2000 FCFA sur la livraison express

            $deliveryFee = max(0.0, $deliveryFee - 2000.0);

        }

    }



    $total = max(0, $subtotal - $discountTotal + $deliveryFee);



    return [

        'items' => $itemsDetail,

        'items_count' => getCartCount(),

        'subtotal' => $subtotal,

        'discount_total' => $discountTotal,

        'delivery_fee' => $deliveryFee,

        'total' => $total,

        'coupon' => $appliedCoupon

    ];

}



/**

 * Création d'une commande complète avec snapshots des produits et décrémentation des stocks

 */

function createOrder(array $customerData, array $cartItems, array $totals): array {

    $pdo = getDBConnection();

    $orderId = 'ord_' . uniqid();

    $orderNumber = 'ST-' . date('Y') . '-' . strtoupper(substr(uniqid(), -5));

    $user = getCurrentUser();

    $userId = $user['id'] ?? null;



    // Détermination du magasin vendeur rattaché (ou boutique principale)

    $storeId = 'store_main';

    foreach ($totals['items'] as $item) {

        if (!empty($item['product']['store_id'])) {

            $storeId = $item['product']['store_id'];

            break;

        }

    }



    $orderRecord = [

        'id' => $orderId,

        'order_number' => $orderNumber,

        'user_id' => $userId,

        'store_id' => $storeId,

        'customer_first_name' => $customerData['first_name'] ?? 'Client',

        'customer_last_name' => $customerData['last_name'] ?? '',

        'customer_email' => $customerData['email'] ?? ($user['email'] ?? null),

        'customer_phone' => $customerData['phone'] ?? '',

        'delivery_region' => $customerData['region'] ?? 'Dakar',

        'delivery_city' => $customerData['city'] ?? 'Dakar',

        'delivery_district' => $customerData['district'] ?? '',

        'delivery_address' => $customerData['address'] ?? '',

        'delivery_landmark' => $customerData['landmark'] ?? '',

        'delivery_instructions' => $customerData['instructions'] ?? '',

        'delivery_method' => $customerData['delivery_method'] ?? 'express',

        'delivery_fee' => $totals['delivery_fee'],

        'subtotal' => $totals['subtotal'],

        'discount_total' => $totals['discount_total'],

        'total' => $totals['total'],

        'coupon_code' => $totals['coupon']['code'] ?? null,

        'payment_method' => $customerData['payment_method'] ?? 'cod',

        'payment_status' => 'pending',

        'order_status' => 'pending',

        'created_at' => date('Y-m-d H:i:s')

    ];



    if ($pdo) {

        try {

            // Sécurisation Foreign Key user_id pour commandes invitées

            if (!$userId) {

                if (!empty($orderRecord['customer_email'])) {

                    $stmtUserCheck = $pdo->prepare("SELECT id FROM users WHERE email = :em LIMIT 1");

                    $stmtUserCheck->execute([':em' => $orderRecord['customer_email']]);

                    $userId = $stmtUserCheck->fetchColumn() ?: null;

                }

                if (!$userId) {

                    $userId = 'user_customer_1'; // Utilisateur client par défaut pour intégrité relationnelle

                }

            }



            // Vérification existence du store_id

            $stmtStCheck = $pdo->prepare("SELECT id FROM stores WHERE id = :sid LIMIT 1");

            $stmtStCheck->execute([':sid' => $storeId]);

            if (!$stmtStCheck->fetchColumn()) {

                $storeId = $pdo->query("SELECT id FROM stores LIMIT 1")->fetchColumn() ?: 'store_main';

            }



            // Génération de l'enregistrement d'adresse de livraison

            $addressId = $customerData['address_id'] ?? ('addr_' . uniqid());

            try {

                $fullName = trim(($orderRecord['customer_first_name'] ?? '') . ' ' . ($orderRecord['customer_last_name'] ?? '')) ?: 'Client Dakar';

                $stmtAddr = $pdo->prepare("INSERT INTO addresses 

                    (id, user_id, name, first_name, last_name, email, street, city, state, region, district, landmark, zip, country, phone, is_default, created_at)

                    VALUES 

                    (:aid, :uid, :name, :fn, :ln, :em, :str, :city, :st, :reg, :dist, :land, '00000', 'Sénégal', :phone, 0, NOW())");

                $stmtAddr->execute([

                    ':aid'   => $addressId,

                    ':uid'   => $userId,

                    ':name'  => $fullName,

                    ':fn'    => $orderRecord['customer_first_name'],

                    ':ln'    => $orderRecord['customer_last_name'],

                    ':em'    => $orderRecord['customer_email'] ?: 'client@sentechplus.com',

                    ':str'   => $orderRecord['delivery_address'] ?: 'Dakar',

                    ':city'  => $orderRecord['delivery_city'] ?: 'Dakar',

                    ':st'    => $orderRecord['delivery_region'] ?: 'Dakar',

                    ':reg'   => $orderRecord['delivery_region'] ?: 'Dakar',

                    ':dist'  => $orderRecord['delivery_district'] ?: '',

                    ':land'  => $orderRecord['delivery_landmark'] ?: '',

                    ':phone' => $orderRecord['customer_phone'] ?: '+221 78 131 64 97'

                ]);

            } catch (Throwable $eAddr) {}



            $stmtOrder = $pdo->prepare("INSERT INTO orders 

                (id, order_number, user_id, store_id, address_id, customer_first_name, customer_last_name, customer_email, customer_phone, 

                 delivery_region, delivery_city, delivery_district, delivery_address, delivery_landmark, delivery_instructions, 

                 delivery_method, delivery_fee, subtotal, discount_total, total, total_amount, coupon_code, payment_method, 

                 payment_status, order_status, status, created_at) 

                VALUES 

                (:id, :onum, :uid, :sid, :aid, :fn, :ln, :em, :ph, :reg, :city, :dist, :addr, :land, :inst, :dmet, :dfee, :sub, :disc, :tot, :tot2, :cpn, :pm, :pstat, :ostat, 'ORDER_PLACED', NOW())");

            

            $stmtOrder->execute([

                ':id'    => $orderId,

                ':onum'  => $orderNumber,

                ':uid'   => $userId,

                ':sid'   => $storeId,

                ':aid'   => $addressId,

                ':fn'    => $orderRecord['customer_first_name'],

                ':ln'    => $orderRecord['customer_last_name'],

                ':em'    => $orderRecord['customer_email'],

                ':ph'    => $orderRecord['customer_phone'],

                ':reg'   => $orderRecord['delivery_region'],

                ':city'  => $orderRecord['delivery_city'],

                ':dist'  => $orderRecord['delivery_district'],

                ':addr'  => $orderRecord['delivery_address'],

                ':land'  => $orderRecord['delivery_landmark'],

                ':inst'  => $orderRecord['delivery_instructions'],

                ':dmet'  => $orderRecord['delivery_method'],

                ':dfee'  => $orderRecord['delivery_fee'],

                ':sub'   => $orderRecord['subtotal'],

                ':disc'  => $orderRecord['discount_total'],

                ':tot'   => $orderRecord['total'],

                ':tot2'  => $orderRecord['total'],

                ':cpn'   => $orderRecord['coupon_code'],

                ':pm'    => $orderRecord['payment_method'],

                ':pstat' => $orderRecord['payment_status'],

                ':ostat' => $orderRecord['order_status']

            ]);



            // Snapshots des articles

            $stmtItem = $pdo->prepare("INSERT INTO order_items 

                (order_id, product_id, variant_id, product_name_snapshot, product_image_snapshot, unit_price, quantity, subtotal) 

                VALUES (:oid, :pid, :vid, :pname, :pimg, :uprice, :qty, :subt)");

            

            $stmtStockDec = $pdo->prepare("UPDATE products SET stock = GREATEST(0, stock - :qty) WHERE id = :pid");



            foreach ($totals['items'] as $item) {

                $p = $item['product'];

                $qty = $item['quantity'];

                $uprice = $item['unit_price'];

                $img = getProductMainImage($p, 'assets/images/product_img4.webp');



                $stmtItem->execute([

                    ':oid' => $orderId,

                    ':pid' => $p['id'],

                    ':vid' => null,

                    ':pname' => $p['name'],

                    ':pimg' => $img,

                    ':uprice' => $uprice,

                    ':qty' => $qty,

                    ':subt' => $item['line_total']

                ]);



                // Décrémenter le stock

                $stmtStockDec->execute([':qty' => $qty, ':pid' => $p['id']]);

            }



            // Historique de statut initial

            $stmtHist = $pdo->prepare("INSERT INTO order_status_history (order_id, status_from, status_to, note, created_by) VALUES (:oid, NULL, 'pending', 'Commande créée par le client', 'client')");

            $stmtHist->execute([':oid' => $orderId]);



        } catch (Throwable $e) {}

    }



    // Sauvegarde en session pour affichage immédiat

    $_SESSION['last_placed_order'] = array_merge($orderRecord, ['items' => $totals['items']]);

    

    // Vider le panier

    $_SESSION['cart'] = [];

    unset($_SESSION['applied_coupon']);



    return $orderRecord;

}



/**

 * Récupère une commande par son ID ou order_number

 */

function getOrderDetails(string $orderIdOrNumber, ?string $userId = null): ?array {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $stmt = $pdo->prepare("SELECT * FROM orders WHERE (id = :id OR order_number = :num) LIMIT 1");

            $stmt->execute([':id' => $orderIdOrNumber, ':num' => $orderIdOrNumber]);

            $order = $stmt->fetch();

            if ($order) {

                // Contrôle strict des permissions : Admin, Propriétaire acheteur, Vendeur concerné ou Session

                if (!isAdmin()) {

                    $isOwner = ($userId && !empty($order['user_id']) && $order['user_id'] === $userId);

                    $isSessionOwner = (isset($_SESSION['last_placed_order']['id']) && ($_SESSION['last_placed_order']['id'] === $order['id'] || $_SESSION['last_placed_order']['order_number'] === $order['order_number']));

                    

                    // Vérifier si l'utilisateur connecté est le vendeur du magasin

                    $isStoreOwner = false;

                    if ($userId && !empty($_SESSION['user']['role']) && $_SESSION['user']['role'] === 'seller') {

                        $stmtSellerStore = $pdo->prepare("SELECT id FROM stores WHERE user_id = :uid LIMIT 1");

                        $stmtSellerStore->execute([':uid' => $userId]);

                        $sellerStoreId = $stmtSellerStore->fetchColumn();

                        if ($sellerStoreId && !empty($order['store_id']) && $order['store_id'] === $sellerStoreId) {

                            $isStoreOwner = true;

                        }

                    }



                    // Si la commande appartient à un compte utilisateur et que le visiteur n'est ni propriétaire, ni vendeur, ni session active

                    if (!empty($order['user_id']) && !$isOwner && !$isSessionOwner && !$isStoreOwner) {

                        return null; // Accès non autorisé

                    }

                }



                $stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = :oid");

                $stmtItems->execute([':oid' => $order['id']]);

                $order['items'] = $stmtItems->fetchAll();



                $stmtHist = $pdo->prepare("SELECT * FROM order_status_history WHERE order_id = :oid ORDER BY created_at ASC");

                $stmtHist->execute([':oid' => $order['id']]);

                $order['history'] = $stmtHist->fetchAll();



                return $order;

            }

        } catch (Throwable $e) {}

    }



    if (isset($_SESSION['last_placed_order']) && ($_SESSION['last_placed_order']['id'] === $orderIdOrNumber || $_SESSION['last_placed_order']['order_number'] === $orderIdOrNumber)) {

        return $_SESSION['last_placed_order'];

    }



    return null;

}



// ─── Cockpit Administrateur & Helpers Paramètres CMS ─────────────────────────



/**

 * Récupère un paramètre du site avec valeur de secours (Mise en cache haute performance)

 */

function getSiteSetting(string $key, string $default = ''): string {

    $settingsMap = FastCache::remember('site_settings_map', 1800, function() {

        $map = [

            'site_name' => 'SenTechPLUS',

            'site_tagline' => 'Le Meilleur du High-Tech & Accessoires au Sénégal',

            'site_logo' => 'assets/images/sentech_logo.webp',

            'contact_email' => 'contact@sentechplus.com',

            'contact_phone' => '+221 78 131 64 97',

            'contact_whatsapp' => '+221 78 131 64 97',

            'contact_address' => 'Point E, Boulevard de l\'Est, Dakar, Sénégal',

            'opening_hours' => 'Lun - Sam : 08h30 - 20h00 | Dim : 10h00 - 18h00',

            'currency' => 'FCFA',

            'delivery_fee_dakar_std' => '2000',

            'delivery_fee_dakar_exp' => '3000',

            'delivery_notice' => 'Livraison Express en 2h à Dakar • Paiement à la livraison Wave, Orange Money & Espèces',

            'footer_copyright' => '© ' . date('Y') . ' SenTechPLUS. Tous droits réservés. Dakar, Sénégal.'

        ];



        $pdo = getDBConnection();

        if ($pdo) {

            try {

                $stmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");

                if ($stmt) {

                    while ($row = $stmt->fetch()) {

                        $map[$row['setting_key']] = (string)$row['setting_value'];

                    }

                }

            } catch (Throwable $e) {}

        }

        return $map;

    });



    return $settingsMap[$key] ?? $default;

}



/**

 * Met à jour un paramètre du site et invalide le cache

 */

function setSiteSetting(string $key, string $value, string $group = 'general'): bool {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value, setting_group) 

                                   VALUES (:k, :v, :g) 

                                   ON DUPLICATE KEY UPDATE setting_value = :v2, setting_group = :g2, updated_at = NOW()");

            $res = $stmt->execute([':k' => $key, ':v' => $value, ':g' => $group, ':v2' => $value, ':g2' => $group]);

            FastCache::forget('site_settings_map');

            return $res;

        } catch (Throwable $e) {}

    }

    return false;

}



/**

 * Journalise une action d'administration

 */

function logAdminActivity(string $action, string $description): void {

    $pdo = getDBConnection();

    $user = getCurrentUser();

    $adminName = $user['name'] ?? 'Administrateur';

    $adminId = $user['id'] ?? null;

    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';



    if ($pdo) {

        try {

            $stmt = $pdo->prepare("INSERT INTO admin_activity_logs (admin_id, admin_name, action, description, ip_address) 

                                   VALUES (:aid, :aname, :act, :desc, :ip)");

            $stmt->execute([':aid' => $adminId, ':aname' => $adminName, ':act' => $action, ':desc' => $description, ':ip' => $ip]);

        } catch (Throwable $e) {}

    }

}



// ─── SYSTÈME DE NOTIFICATIONS PROFESSIONNEL ──────────────────────────────────



/**

 * Assure la création automatique de la table notifications

 */

function ensureNotificationsTableExists(?PDO $pdo = null): void {

    $pdo = $pdo ?: getDBConnection();

    if (!$pdo) return;

    try {

        $pdo->exec("

            CREATE TABLE IF NOT EXISTS `notifications` (

              `id` VARCHAR(64) NOT NULL PRIMARY KEY,

              `user_id` VARCHAR(64) NULL,

              `type` VARCHAR(32) NOT NULL DEFAULT 'info',

              `title` VARCHAR(255) NOT NULL,

              `message` TEXT NOT NULL,

              `link_url` VARCHAR(255) NULL,

              `icon` VARCHAR(64) NOT NULL DEFAULT 'bell',

              `priority` ENUM('low', 'normal', 'high') NOT NULL DEFAULT 'normal',

              `is_read` TINYINT(1) NOT NULL DEFAULT 0,

              `read_at` DATETIME NULL,

              `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

              `expires_at` DATETIME NULL,

              INDEX `idx_notif_user` (`user_id`, `is_read`, `created_at`)

            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

        ");

    } catch (Throwable $e) {}

}



/**

 * Récupère les notifications pour un utilisateur (ou globales)

 */

function getUserNotifications(?string $userId = null, int $limit = 10, bool $unreadOnly = false, ?string $typeFilter = null): array {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            ensureNotificationsTableExists($pdo);

            $sql = "SELECT * FROM notifications 

                    WHERE (expires_at IS NULL OR expires_at >= NOW()) 

                    AND (user_id IS NULL " . ($userId ? "OR user_id = :uid" : "") . ") ";

            

            if ($unreadOnly) {

                $sql .= "AND is_read = 0 ";

            }

            if ($typeFilter && $typeFilter !== 'all') {

                $sql .= "AND type = :ftype ";

            }

            $sql .= "ORDER BY is_read ASC, created_at DESC LIMIT " . (int)$limit;



            $stmt = $pdo->prepare($sql);

            $params = [];

            if ($userId) $params[':uid'] = $userId;

            if ($typeFilter && $typeFilter !== 'all') $params[':ftype'] = $typeFilter;

            $stmt->execute($params);

            $results = $stmt->fetchAll();

            if (!empty($results)) {

                return $results;

            }

        } catch (Throwable $e) {}

    }



    // Zéro notification fictive
    return [];
}

function getUnreadNotificationsCount(?string $userId = null): int {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            ensureNotificationsTableExists($pdo);

            $sql = "SELECT COUNT(*) FROM notifications 

                    WHERE is_read = 0 

                    AND (expires_at IS NULL OR expires_at >= NOW()) 

                    AND (user_id IS NULL " . ($userId ? "OR user_id = :uid" : "") . ")";

            $stmt = $pdo->prepare($sql);

            $params = $userId ? [':uid' => $userId] : [];

            $stmt->execute($params);

            return (int)$stmt->fetchColumn();

        } catch (Throwable $e) {}

    }

    return 2;

}



/**

 * Marquer une notification comme lue

 */

function markNotificationAsRead(string $notifId, ?string $userId = null): bool {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            ensureNotificationsTableExists($pdo);

            $sql = "UPDATE notifications SET is_read = 1, read_at = NOW() 

                    WHERE id = :id " . ($userId ? "AND (user_id IS NULL OR user_id = :uid)" : "AND user_id IS NULL");

            $stmt = $pdo->prepare($sql);

            $params = [':id' => $notifId];

            if ($userId) $params[':uid'] = $userId;

            return $stmt->execute($params);

        } catch (Throwable $e) {}

    }

    return true;

}



/**

 * Marquer toutes les notifications comme lues

 */

function markAllNotificationsAsRead(?string $userId = null): bool {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            ensureNotificationsTableExists($pdo);

            $sql = "UPDATE notifications SET is_read = 1, read_at = NOW() 

                    WHERE is_read = 0 " . ($userId ? "AND (user_id IS NULL OR user_id = :uid)" : "AND user_id IS NULL");

            $stmt = $pdo->prepare($sql);

            $params = $userId ? [':uid' => $userId] : [];

            return $stmt->execute($params);

        } catch (Throwable $e) {}

    }

    return true;

}



/**

 * Crée une notification

 */

function createNotification(?string $userId, string $type, string $title, string $message, ?string $linkUrl = null, string $icon = 'bell', string $priority = 'normal', ?string $expiresAt = null): string {

    $id = 'notif_' . uniqid();

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            ensureNotificationsTableExists($pdo);

            $stmt = $pdo->prepare("INSERT INTO notifications (id, user_id, type, title, message, link_url, icon, priority, expires_at) 

                                   VALUES (:id, :uid, :t, :tit, :msg, :l, :ic, :p, :exp)");

            $stmt->execute([

                ':id' => $id,

                ':uid' => $userId,

                ':t' => $type,

                ':tit' => $title,

                ':msg' => $message,

                ':l' => $linkUrl,

                ':ic' => $icon,

                ':p' => $priority,

                ':exp' => $expiresAt

            ]);

        } catch (Throwable $e) {}

    }

    return $id;

}



/**

 * Supprime une notification

 */

function deleteNotification(string $notifId, ?string $userId = null): bool {

    $pdo = getDBConnection();

    if ($pdo) {

        try {

            $sql = "DELETE FROM notifications WHERE id = :id " . ($userId ? "AND (user_id IS NULL OR user_id = :uid)" : "");

            $stmt = $pdo->prepare($sql);

            $params = [':id' => $notifId];

            if ($userId) $params[':uid'] = $userId;

            return $stmt->execute($params);

        } catch (Throwable $e) {}

    }

    return true;

}



/**

 * Calcule le temps relatif en français (ex: "Il y a 10 min")

 */

function getRelativeTime(string $datetime): string {

    $time = strtotime($datetime);

    if (!$time) return 'Récemment';

    $diff = time() - $time;

    if ($diff < 60) return "À l'instant";

    if ($diff < 3600) return "Il y a " . round($diff / 60) . " min";

    if ($diff < 86400) return "Il y a " . round($diff / 3600) . " h";

    if ($diff < 604800) return "Il y a " . round($diff / 86400) . " j";

    return date('d/m/Y', $time);

}



/**

 * ─── Gestion des Médias Produits (Images Multi-Angles, Vidéos Démo & Lightbox) ───

 */



/**

 * Assure la création de la table product_media si elle n'existe pas encore

 */

function ensureProductMediaTableExists(?PDO $pdo = null): void {

    if ($pdo === null) $pdo = getDBConnection();

    if (!$pdo) return;



    static $checked = false;

    if ($checked) return;

    $checked = true;



    try {

        $pdo->exec("CREATE TABLE IF NOT EXISTS product_media (

            id INT AUTO_INCREMENT PRIMARY KEY,

            product_id VARCHAR(64) NOT NULL,

            media_type VARCHAR(20) NOT NULL DEFAULT 'image',

            media_role VARCHAR(30) NOT NULL DEFAULT 'gallery',

            file_path VARCHAR(255) NOT NULL,

            thumbnail_path VARCHAR(255) NULL,

            title VARCHAR(150) NULL,

            alt_text VARCHAR(255) NULL,

            display_order INT NOT NULL DEFAULT 0,

            is_active TINYINT(1) NOT NULL DEFAULT 1,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            INDEX idx_product_media_pid (product_id),

            INDEX idx_product_media_act (is_active),

            INDEX idx_product_media_order (display_order)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    } catch (Throwable $e) {}

}



/**

 * Récupère la liste complète des médias pour un produit donné avec fallback intelligent

 */

function getProductMediaList(string $productId, ?array $fallbackImages = [], string $productName = ''): array {

    $pdo = getDBConnection();

    $mediaList = [];



    if ($pdo && !empty($productId)) {

        try {

            ensureProductMediaTableExists($pdo);

            $stmt = $pdo->prepare("SELECT * FROM product_media 

                                   WHERE product_id = :pid AND is_active = 1 

                                   ORDER BY display_order ASC, id ASC");

            $stmt->execute([':pid' => $productId]);

            $mediaList = $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (Throwable $e) {

            $mediaList = [];

        }

    }



    // Fallback dynamique si aucun média en base

    if (empty($mediaList)) {

        $officialMap = getOfficialProductImageMap();
        $cleanImgs = !empty($fallbackImages) ? $fallbackImages : ['assets/images/product_img1.webp'];
        if (isset($officialMap[$productId]) && (empty($cleanImgs[0]) || str_starts_with($cleanImgs[0], 'assets/images/product_img'))) {
            $cleanImgs[0] = $officialMap[$productId];
        }

        foreach ($cleanImgs as $idx => $imgPath) {

            $role = ($idx === 0) ? 'main' : 'gallery';

            $mediaList[] = [

                'id'             => 'fallback_' . ($idx + 1),

                'product_id'     => $productId,

                'media_type'     => 'image',

                'media_role'     => $role,

                'file_path'      => $imgPath,

                'thumbnail_path' => $imgPath,

                'title'          => $productName ? ($productName . ' - Angle ' . ($idx + 1)) : 'Photo Produit',

                'alt_text'       => $productName ? ($productName . ' - Angle ' . ($idx + 1)) : 'Photo Produit',

                'display_order'  => $idx,

                'is_active'      => 1

            ];

        }

    }



    return $mediaList;

}



/**

 * Ajoute un média produit dans la table product_media

 */

function addProductMedia(string $productId, string $mediaType, string $mediaRole, string $filePath, ?string $thumbPath = null, ?string $title = null, ?string $altText = null, int $order = 0): bool {

    $pdo = getDBConnection();

    if (!$pdo) return false;



    try {

        ensureProductMediaTableExists($pdo);

        $stmt = $pdo->prepare("INSERT INTO product_media 

            (product_id, media_type, media_role, file_path, thumbnail_path, title, alt_text, display_order, is_active) 

            VALUES (:pid, :mtype, :mrole, :fpath, :tpath, :tit, :alt, :ord, 1)");

        return $stmt->execute([

            ':pid'   => $productId,

            ':mtype' => $mediaType,

            ':mrole' => $mediaRole,

            ':fpath' => $filePath,

            ':tpath' => $thumbPath ?: $filePath,

            ':tit'   => $title,

            ':alt'   => $altText,

            ':ord'   => $order

        ]);

    } catch (Throwable $e) {

        return false;

    }

}



/**

 * Supprime un média produit

 */

function deleteProductMedia(int $mediaId): bool {

    $pdo = getDBConnection();

    if (!$pdo) return false;



    try {

        ensureProductMediaTableExists($pdo);

        $stmt = $pdo->prepare("SELECT file_path FROM product_media WHERE id = :id");

        $stmt->execute([':id' => $mediaId]);

        $filePath = $stmt->fetchColumn();



        if ($filePath && file_exists(__DIR__ . '/../' . $filePath) && strpos($filePath, 'products/') !== false) {

            @unlink(__DIR__ . '/../' . $filePath);

        }



        $stmtDel = $pdo->prepare("DELETE FROM product_media WHERE id = :id");

        return $stmtDel->execute([':id' => $mediaId]);

    } catch (Throwable $e) {

        return false;

    }

}



/**
 * Génère le contenu dynamique interne du Cart Drawer (Body + Footer)
 * Utilisé au chargement initial (cart_drawer.php) ET lors des mises à jour AJAX (cart.php)
 */
function renderCartDrawerDynamicContent(): string {
    $cartItems = getCartItems();
    $productsInCart = [];
    $totalPrice = 0;

    if (!empty($cartItems)) {
        try {
            $pdo = getDBConnection();
            if ($pdo) {
                $placeholders = implode(',', array_fill(0, count($cartItems), '?'));
                $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
                $stmt->execute(array_keys($cartItems));
                $fetched = $stmt->fetchAll();

                foreach ($fetched as $p) {
                    $qty = (int)($cartItems[$p['id']] ?? 1);
                    $itemTotal = (float)$p['price'] * $qty;
                    $totalPrice += $itemTotal;
                    $p['cart_quantity'] = $qty;
                    $p['item_total'] = $itemTotal;
                    $p['main_image'] = getProductMainImage($p, 'assets/images/product_img1.webp');
                    $productsInCart[] = $p;
                }
            }
        } catch (Throwable $e) {
            $productsInCart = [];
        }
    }

    ob_start();
    ?>
    <!-- Drawer Body / Cart Items -->
    <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#F3F7FC]/30">
        <?php if (empty($productsInCart)): ?>
            <div class="h-full flex flex-col items-center justify-center text-center text-[#667085] py-12">
                <div class="w-20 h-20 bg-[#EAF3FF] text-[#1677FF] rounded-full flex items-center justify-center mb-6">
                    <i data-lucide="shopping-bag" class="w-10 h-10 stroke-1"></i>
                </div>
                <p class="text-xl font-extrabold text-[#182230] mb-2">Votre panier est vide</p>
                <p class="text-sm text-[#667085] max-w-[250px] mx-auto mb-8">Découvrez nos équipements high-tech certifiés et faites-vous plaisir !</p>
                <a href="shop.php" onclick="toggleCartDrawer(false)" class="cursor-pointer px-6 py-3 bg-[#1677FF] hover:bg-[#0B54C2] text-white font-bold text-sm rounded-xl transition-all duration-200 active:scale-[0.97] shadow-md inline-flex items-center gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    <span>Continuer les achats</span>
                </a>
            </div>
        <?php else: ?>
            <div class="space-y-3.5">
                <?php foreach ($productsInCart as $item): 
                    $maxStock = max(1, (int)($item['stock'] ?? 15));
                    $qty = (int)$item['cart_quantity'];
                ?>
                    <div class="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-[#E8EDF3] shadow-2xs hover:border-[#1677FF]/30 transition-colors">
                        <!-- Image -->
                        <a href="product.php?id=<?= urlencode($item['id']) ?>" class="w-18 h-18 sm:w-20 sm:h-20 bg-[#F8FAFD] rounded-xl p-2 flex items-center justify-center border border-[#E8EDF3] shrink-0 overflow-hidden">
                            <img src="<?= htmlspecialchars($item['main_image']) ?>" alt="<?= htmlspecialchars($item['name']) ?> - SenTechPLUS" width="76" height="76" loading="eager" decoding="async" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;" class="max-w-full max-h-full object-contain">
                        </a>
                        
                        <div class="flex-1 flex flex-col justify-between min-w-0">
                            <div class="flex justify-between items-start gap-2">
                                <h4 class="font-bold text-[#182230] text-xs sm:text-sm line-clamp-1 flex-1">
                                    <a href="product.php?id=<?= urlencode($item['id']) ?>" class="hover:text-[#1677FF] transition-colors"><?= htmlspecialchars($item['name']) ?></a>
                                </h4>
                                <!-- Bouton Supprimer AJAX -->
                                <form action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="shrink-0">
                                    <?= getCSRFInputField() ?>
                                    <input type="hidden" name="action" value="remove">
                                    <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['id']) ?>">
                                    <button type="submit" class="text-[#667085] hover:text-rose-600 hover:bg-rose-50 rounded-lg p-1.5 transition-all active:scale-90 cursor-pointer" title="Retirer" aria-label="Retirer du panier">
                                        <i data-lucide="x" class="w-4 h-4"></i>
                                    </button>
                                </form>
                            </div>
                            
                            <p class="text-[11px] font-bold text-[#667085] mt-0.5"><?= formatPrice($item['price']) ?> / unité</p>
                            
                            <div class="flex items-center justify-between mt-2">
                                <!-- Stepper Quantité Tactile -->
                                <div class="inline-flex items-center border border-[#E8EDF3] rounded-xl bg-[#F8FAFD] p-0.5">
                                    <form action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="inline">
                                        <?= getCSRFInputField() ?>
                                        <input type="hidden" name="action" value="update">
                                        <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['id']) ?>">
                                        <input type="hidden" name="quantity" value="<?= max(0, $qty - 1) ?>">
                                        <button type="submit" class="cursor-pointer w-6 h-6 flex items-center justify-center text-[#182230] hover:bg-white rounded-lg transition-all active:scale-90 text-xs font-bold" aria-label="Diminuer">−</button>
                                    </form>
                                    <span class="w-6 text-center text-xs font-extrabold text-[#182230] select-none"><?= $qty ?></span>
                                    <form action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="inline">
                                        <?= getCSRFInputField() ?>
                                        <input type="hidden" name="action" value="update">
                                        <input type="hidden" name="product_id" value="<?= htmlspecialchars($item['id']) ?>">
                                        <input type="hidden" name="quantity" value="<?= min($maxStock, $qty + 1) ?>">
                                        <button type="submit" <?= $qty >= $maxStock ? 'disabled' : '' ?> class="cursor-pointer w-6 h-6 flex items-center justify-center text-[#182230] hover:bg-white rounded-lg transition-all active:scale-90 text-xs font-bold disabled:opacity-30" aria-label="Augmenter">+</button>
                                    </form>
                                </div>
                                <p class="text-xs sm:text-sm font-black text-[#182230]"><?= formatPrice($item['item_total']) ?></p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <!-- Drawer Footer / Summary -->
    <?php if (!empty($productsInCart)): ?>
        <div class="p-5 sm:p-6 border-t border-[#E8EDF3] bg-white space-y-4">
            <div class="flex items-center justify-between">
                <span class="font-extrabold text-[#64748B] text-xs uppercase tracking-wider">Total estimé</span>
                <span class="text-xl font-black text-[#1677FF]"><?= formatPrice($totalPrice) ?></span>
            </div>

            <a href="checkout.php" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer w-full py-3.5 px-5 bg-[#1677FF] hover:bg-[#0B54C2] text-white font-extrabold text-sm rounded-2xl text-center shadow-[0_6px_20px_rgba(22,119,255,0.28)] transition-all active:scale-[0.98] flex justify-center items-center gap-2">
                <span>Commander maintenant</span>
                <i data-lucide="arrow-right" class="w-4 h-4 text-white"></i>
            </a>
            <button type="button" onclick="toggleCartDrawer(false)" class="cursor-pointer w-full py-1 text-[#64748B] hover:text-[#182230] font-bold text-xs text-center transition-colors">
                ← Continuer mes achats
            </button>
        </div>
    <?php endif; ?>
    <?php
    return (string)ob_get_clean();
}

// ─── Services de Paiement & Notifications SMS Automatisées ─────────────────

require_once __DIR__ . '/../includes/sms_service.php';

require_once __DIR__ . '/../includes/payment_service.php';















