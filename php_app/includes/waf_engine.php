<?php
/**
 * =============================================================================
 * SenTechPLUS — Web Application Firewall (WAF) & Deep Inspection Engine
 * Normes : OWASP Top 10 (A03 Injection, A01 Broken Access, A05 Sec Misconfig)
 * Détecte & Neutralise : SQLi, XSS, Path Traversal, LFI/RFI, RCE & Scanner Probes
 * =============================================================================
 */

class WebAppFirewall {
    // ─── Signatures d'attaque calibrées (Zéro Faux Positif) ─────────────────────
    private static array $attackSignatures = [
        'SQL_INJECTION' => [
            'pattern' => '/(\bUNION\s+(?:ALL\s+)?SELECT\b|\bSELECT\b.+?\bFROM\b.+?\b(?:WHERE|JOIN)\b|\b(?:INFORMATION_SCHEMA|TABLE_SCHEMA|SCHEMA_NAME)\b|\b(?:SLEEP|BENCHMARK)\s*\(\s*\d+\s*\)|\b(?:OR|AND)\b\s+[\'"]?\d+[\'"]?\s*=\s*[\'"]?\d+[\'"]?\s*(?:--|#|\/\*)|;\s*DROP\s+TABLE|;\s*UPDATE\s+\w+\s+SET)/i',
            'severity' => 'CRITICAL'
        ],
        'CROSS_SITE_SCRIPTING' => [
            'pattern' => '/(<script\b[^>]*>.*?<\/script>|<script\b|javascript\s*:\s*[^\s]+|<(?:svg|img|iframe|embed|object|audio|video|body|input)\b[^>]*\b(?:on\w+)\s*=\s*[\'"][^\'"]*[\'"]|<(?:svg|img|iframe)\b[^>]*\b(?:on\w+)\s*=[^>\s]+|document\.(?:cookie|location|write)\b|window\.location\b)/i',
            'severity' => 'HIGH'
        ],
        'PATH_TRAVERSAL_LFI' => [
            'pattern' => '/((?:\.\.[\/\\\\]){2,}|\b(?:etc[\/\\\\]passwd|etc[\/\\\\]shadow|boot\.ini|win\.ini|proc[\/\\\\]self)\b|php:\/\/(?:filter|input|stdin)|data:\/\/text\/html)/i',
            'severity' => 'CRITICAL'
        ],
        'REMOTE_CODE_EXECUTION' => [
            'pattern' => '/(;\s*(?:cat|ls|id|whoami|curl|wget|bash|sh|powershell|cmd\.exe)\b|\$\(\s*(?:cat|ls|id|whoami|curl|wget)\b|`\s*(?:cat|ls|id|whoami|curl|wget)\b)/i',
            'severity' => 'CRITICAL'
        ],
        'SENSITIVE_PROBING' => [
            'pattern' => '/(\.(?:env|git|htaccess|htpasswd|sql|bak|conf|log)\b|wp-config\.php|phpinfo\s*\(\s*\))/i',
            'severity' => 'MEDIUM'
        ]
    ];

    /**
     * Inspecte l'intégralité de la requête HTTP entrante (GET, POST, COOKIES, URI)
     */
    public static function inspectRequest(): void {
        // Exemptions pour requêtes internes de tests CLI
        if (php_sapi_name() === 'cli') {
            return;
        }

        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $ip = SecurityShield::getClientIP();

        // 1. Inspection de l'URI et de la Query String
        self::scanData('URI', $uri);

        // 2. Inspection récursive des paramètres GET
        if (!empty($_GET)) {
            self::scanArray('GET', $_GET);
        }

        // 3. Inspection récursive des paramètres POST (sauf zones CMS admin authentifiées)
        if (!empty($_POST) && !self::isExemptAdminContext()) {
            self::scanArray('POST', $_POST);
        }

        // 4. Inspection des cookies
        if (!empty($_COOKIE)) {
            self::scanArray('COOKIE', $_COOKIE);
        }
    }

    /**
     * Vérifie si le contexte correspond à un administrateur connecté éditant du HTML légitime
     */
    private static function isExemptAdminContext(): bool {
        if (session_status() === PHP_SESSION_ACTIVE && !empty($_SESSION['user']['role']) && $_SESSION['user']['role'] === 'admin') {
            $script = basename($_SERVER['PHP_SELF'] ?? '');
            if (in_array($script, ['pages.php', 'sections.php', 'products.php', 'announcements.php'], true)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Analyse récursive d'un tableau de données
     */
    private static function scanArray(string $source, array $data, string $prefix = ''): void {
        foreach ($data as $key => $val) {
            $fullKey = $prefix ? "{$prefix}.{$key}" : $key;
            if (is_array($val)) {
                self::scanArray($source, $val, $fullKey);
            } elseif (is_string($val)) {
                self::scanData("{$source}:{$fullKey}", $val);
            }
        }
    }

    /**
     * Analyse d'une chaîne de caractères contre la base de signatures WAF
     */
    private static function scanData(string $location, string $value): void {
        if (strlen($value) < 3) {
            return;
        }

        // Décodage des payloads obfusqués (URL encoding multiple)
        $decoded = rawurldecode(urldecode($value));

        foreach (self::$attackSignatures as $attackType => $rule) {
            if (preg_match($rule['pattern'], $value, $matches) || preg_match($rule['pattern'], $decoded, $matches)) {
                self::triggerBlock($attackType, $rule['severity'], $location, $matches[0] ?? $value);
            }
        }
    }

    /**
     * Déclenche le blocage immédiat et journalise l'attaque
     */
    private static function triggerBlock(string $attackType, string $severity, string $location, string $matchedSnippet): void {
        $ip = SecurityShield::getClientIP();
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

        // 1. Journalisation dans le SIEM Audit
        SecurityShield::logSecurityEvent('WAF_ATTACK_BLOCKED', "Attaque [{$attackType}] interceptée sur [{$location}]", [
            'severity' => $severity,
            'ip' => $ip,
            'location' => $location,
            'match' => substr($matchedSnippet, 0, 80),
            'uri' => $uri,
            'user_agent' => $ua
        ]);

        // 2. Incrément du compteur de menace de l'IP
        SecurityShield::recordFailedAttempt('waf_strike', 3600);

        // 3. Réponse HTTP 403 avec Page de Blocage WAF
        http_response_code(403);
        header('Content-Type: text/html; charset=UTF-8');
        header('X-WAF-Protection: SenTechPLUS-Shield-v2026');
        header('Retry-After: 3600');

        $incidentId = 'INC-' . strtoupper(substr(hash('sha256', $ip . time() . $attackType), 0, 10));

        echo <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 — Requête Bloquée par le Bouclier de Sécurité | SenTechPLUS</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0F172A; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { background: #1E293B; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 24px; padding: 40px; max-width: 560px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
        .icon { width: 64px; height: 64px; background: rgba(239, 68, 68, 0.15); border: 2px solid #EF4444; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 20px; }
        h1 { font-size: 22px; font-weight: 800; color: #F8FAFC; margin-bottom: 10px; }
        p { font-size: 13px; color: #94A3B8; line-height: 1.6; margin-bottom: 20px; }
        .box { background: #0F172A; border: 1px solid #334155; border-radius: 14px; padding: 14px; text-align: left; font-family: monospace; font-size: 11px; color: #E2E8F0; margin-bottom: 24px; }
        .box div { margin-bottom: 4px; }
        .box span { color: #EF4444; font-weight: bold; }
        .btn { display: inline-block; background: #1677FF; color: white; text-decoration: none; font-size: 12px; font-weight: 700; padding: 12px 24px; border-radius: 12px; transition: background 0.2s; }
        .btn:hover { background: #0B54C2; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">🛡️</div>
        <h1>Requête Interceptée par le WAF</h1>
        <p>Le pare-feu applicatif de <strong>SenTechPLUS</strong> a détecté un motif non conforme aux règles de sécurité dans votre requête.</p>
        <div class="box">
            <div>Type d'incident : <span>{$attackType}</span></div>
            <div>Identifiant incident : <strong>{$incidentId}</strong></div>
            <div>Votre IP : <strong>{$ip}</strong></div>
            <div>Horodatage : <strong>{$_SERVER['REQUEST_TIME']}</strong></div>
        </div>
        <p style="font-size:11px; color:#64748B;">Si vous pensez qu'il s'agit d'une erreur légitime, contactez notre équipe support avec votre identifiant d'incident.</p>
        <a href="index.php" class="btn">Retour à l'accueil sécurisé</a>
    </div>
</body>
</html>
HTML;
        exit;
    }
}