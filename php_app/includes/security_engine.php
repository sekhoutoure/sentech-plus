<?php
/**
 * =============================================================================
 * SenTechPLUS — SecurityShield Engine (Anti-Brute Force, Rate Limiting, 
 * Anti-Session Hijacking, Anti-Bot Honeypot & Audit Logging)
 * Normes : OWASP Top 10, CWE-307, CWE-384, CWE-613
 * =============================================================================
 */

class SecurityShield {
    private static ?string $storageDir = null;

    /**
     * Initialise le dossier de stockage persistant pour le rate limiter
     */
    private static function getStorageDir(): string {
        if (self::$storageDir === null) {
            self::$storageDir = dirname(__DIR__) . '/storage/security_cache';
            if (!is_dir(self::$storageDir)) {
                @mkdir(self::$storageDir, 0750, true);
            }
        }
        return self::$storageDir;
    }

    /**
     * Récupère l'adresse IP réelle et assainie du client
     * Empêche l'usurpation d'IP via headers arbitraires
     */
    public static function getClientIP(): string {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        // Si Cloudflare authentifié
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            $cfIp = trim($_SERVER['HTTP_CF_CONNECTING_IP']);
            if (filter_var($cfIp, FILTER_VALIDATE_IP)) {
                return $cfIp;
            }
        }

        // Si proxy inverse configuré
        $trustedProxies = getenv('TRUSTED_PROXIES') ?: '127.0.0.1';
        $trustedList = array_map('trim', explode(',', $trustedProxies));
        if (in_array($ip, $trustedList, true) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $forwarded = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $firstIp = trim($forwarded[0]);
            if (filter_var($firstIp, FILTER_VALIDATE_IP)) {
                return $firstIp;
            }
        }

        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '127.0.0.1';
    }

    /**
     * Sous-réseau IP pour tolérer les micro-changements de routeur mobile (/24 en IPv4)
     */
    public static function getIpSubnet(string $ip): string {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            $parts = explode('.', $ip);
            return $parts[0] . '.' . $parts[1] . '.' . $parts[2] . '.0';
        }
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            $parts = explode(':', $ip);
            return ($parts[0] ?? '') . ':' . ($parts[1] ?? '') . ':' . ($parts[2] ?? '');
        }
        return $ip;
    }

    /**
     * Clé de persistance sécurisée
     */
    private static function getStorageFilePath(string $key): string {
        $hash = hash('sha256', $key);
        $shard = substr($hash, 0, 2);
        $dir = self::getStorageDir() . '/' . $shard;
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }
        return $dir . '/' . $hash . '.json';
    }

    /**
     * Vérification de Rate Limit persistant et partagé (APCu + Disque Atomique)
     * Protège contre les attaques de force brute même sans session / cookies
     */
    public static function checkRateLimit(string $action = 'login', int $maxAttempts = 5, int $decaySeconds = 900, ?string $identifier = null): bool {
        $ip = self::getClientIP();
        $target = $identifier ? preg_replace('/[^a-zA-Z0-9_\-@.]/', '', $identifier) : $ip;
        $key = 'rl_' . $action . '_' . $target;

        // 1. Essai en mémoire APCu si dispo
        if (function_exists('apcu_fetch')) {
            $data = apcu_fetch($key);
            if ($data && is_array($data)) {
                if (time() - $data['start_time'] <= $decaySeconds) {
                    return $data['attempts'] < $maxAttempts;
                }
            }
        }

        // 2. Fichier atomique partagé
        $file = self::getStorageFilePath($key);
        if (file_exists($file)) {
            $raw = @file_get_contents($file);
            if ($raw) {
                $data = json_decode($raw, true);
                if ($data && is_array($data)) {
                    if (time() - ($data['start_time'] ?? 0) <= $decaySeconds) {
                        return ($data['attempts'] ?? 0) < $maxAttempts;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Enregistre une tentative échouée
     */
    public static function recordFailedAttempt(string $action = 'login', int $decaySeconds = 900, ?string $identifier = null): int {
        $ip = self::getClientIP();
        $target = $identifier ? preg_replace('/[^a-zA-Z0-9_\-@.]/', '', $identifier) : $ip;
        $key = 'rl_' . $action . '_' . $target;
        $now = time();

        $attempts = 1;
        $startTime = $now;

        // Lecture état actuel
        $file = self::getStorageFilePath($key);
        if (file_exists($file)) {
            $raw = @file_get_contents($file);
            if ($raw) {
                $data = json_decode($raw, true);
                if ($data && is_array($data)) {
                    if ($now - ($data['start_time'] ?? 0) <= $decaySeconds) {
                        $attempts = ($data['attempts'] ?? 0) + 1;
                        $startTime = $data['start_time'];
                    }
                }
            }
        }

        $payload = [
            'attempts'   => $attempts,
            'start_time' => $startTime,
            'last_ip'    => $ip,
            'updated_at' => $now
        ];

        // 1. Écriture APCu
        if (function_exists('apcu_store')) {
            @apcu_store($key, $payload, $decaySeconds);
        }

        // 2. Écriture atomique disque
        $tmp = $file . '.' . uniqid('tmp_', true);
        if (@file_put_contents($tmp, json_encode($payload), LOCK_EX)) {
            @rename($tmp, $file);
        }

        // Log audit en cas de blocage
        if ($attempts >= 5) {
            self::logSecurityEvent('BRUTE_FORCE_BLOCKED', "Rate limit atteint pour {$action} sur cible {$target} (Tentatives: {$attempts})", [
                'action' => $action,
                'target' => $target,
                'attempts' => $attempts,
                'ip' => $ip
            ]);
        }

        return $attempts;
    }

    /**
     * Réinitialise le compteur après succès
     */
    public static function clearRateLimit(string $action = 'login', ?string $identifier = null): void {
        $ip = self::getClientIP();
        $target = $identifier ? preg_replace('/[^a-zA-Z0-9_\-@.]/', '', $identifier) : $ip;
        $key = 'rl_' . $action . '_' . $target;

        if (function_exists('apcu_delete')) {
            @apcu_delete($key);
        }

        $file = self::getStorageFilePath($key);
        if (file_exists($file)) {
            @unlink($file);
        }
    }

    /**
     * Calcule le temps restant en minutes
     */
    public static function getRemainingMinutes(string $action = 'login', int $decaySeconds = 900, ?string $identifier = null): int {
        $ip = self::getClientIP();
        $target = $identifier ? preg_replace('/[^a-zA-Z0-9_\-@.]/', '', $identifier) : $ip;
        $key = 'rl_' . $action . '_' . $target;
        $file = self::getStorageFilePath($key);

        if (file_exists($file)) {
            $raw = @file_get_contents($file);
            if ($raw) {
                $data = json_decode($raw, true);
                if ($data && is_array($data)) {
                    $elapsed = time() - ($data['start_time'] ?? 0);
                    $remaining = max(1, ceil(($decaySeconds - $elapsed) / 60));
                    return (int)$remaining;
                }
            }
        }
        return 15;
    }

    /**
     * Génère une empreinte de sécurité pour la session utilisateur
     * Combine User-Agent + Sous-réseau IP + Clé secrète de l'application
     */
    public static function generateSessionFingerprint(): string {
        $ip = self::getClientIP();
        $subnet = self::getIpSubnet($ip);
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown_browser';
        $appSecret = defined('APP_SECRET') ? APP_SECRET : 'sentech_sec_default';
        return hash_hmac('sha256', "{$ua}|{$subnet}", $appSecret);
    }

    /**
     * Initialise la sécurité de session lors d'une connexion réussie
     */
    public static function initSessionSecurity(array $userData): void {
        self::rotateSession();
        $_SESSION['auth_fingerprint'] = self::generateSessionFingerprint();
        $_SESSION['auth_created_at']  = time();
        $_SESSION['auth_last_active'] = time();
        $_SESSION['auth_ip']          = self::getClientIP();
    }

    /**
     * Valide l'intégrité de la session contre le vol de cookies (Session Hijacking)
     */
    public static function validateSessionFingerprint(): bool {
        if (session_status() !== PHP_SESSION_ACTIVE || empty($_SESSION['user_id'])) {
            return true; // Non connecté
        }

        // Si aucune empreinte enregistrée, on l'initialise
        if (empty($_SESSION['auth_fingerprint'])) {
            $_SESSION['auth_fingerprint'] = self::generateSessionFingerprint();
            return true;
        }

        $currentFingerprint = self::generateSessionFingerprint();
        if (!hash_equals($_SESSION['auth_fingerprint'], $currentFingerprint)) {
            // ALERTE VOL DE SESSION : Empreinte divergente
            self::logSecurityEvent('SESSION_HIJACK_DETECTED', "Divergence d'empreinte de session détectée pour user {$_SESSION['user_id']}", [
                'user_id' => $_SESSION['user_id'],
                'stored_ip' => $_SESSION['auth_ip'] ?? 'N/A',
                'current_ip' => self::getClientIP(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A'
            ]);

            // Destruction immédiate de la session compromise
            $_SESSION = [];
            if (ini_get('session.use_cookies')) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params['path'], $params['domain'],
                    $params['secure'], $params['httponly']
                );
            }
            @session_destroy();
            return false;
        }

        return true;
    }

    /**
     * Rotation atomique de l'ID de session (Anti-Fixation)
     */
    public static function rotateSession(): void {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }

    /**
     * Vérification de pot de miel (Anti-Bot Honeypot)
     * Retourne TRUE si c'est un humain légitime (champ vide)
     * Retourne FALSE si c'est un robot spammeur (champ rempli)
     */
    public static function verifyHoneypot(string $fieldName = 'website_url_hp'): bool {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!empty($_POST[$fieldName])) {
                self::logSecurityEvent('BOT_HONEYPOT_TRIGGERED', "Bot piégé par le honeypot {$fieldName}", [
                    'ip' => self::getClientIP(),
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A',
                    'payload' => substr($_POST[$fieldName], 0, 50)
                ]);
                // Léger délai pour freiner le bot
                usleep(500000);
                return false;
            }
        }
        return true;
    }

    /**
     * Génère le balisage HTML pour le champ Honeypot invisible
     */
    public static function getHoneypotHtml(string $fieldName = 'website_url_hp'): string {
        return '<div style="display:none!important;visibility:hidden!important;opacity:0!important;position:absolute!important;left:-9999px!important;" aria-hidden="true">'
             . '<label for="' . $fieldName . '">Ne pas remplir</label>'
             . '<input type="text" id="' . $fieldName . '" name="' . $fieldName . '" value="" tabindex="-1" autocomplete="off">'
             . '</div>';
    }

    /**
     * Valide la robustesse d'un mot de passe (Norme ANSSI / OWASP)
     * Min 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre
     */
    public static function validatePasswordStrength(string $password): array {
        $errors = [];
        if (strlen($password) < 8) {
            $errors[] = "Le mot de passe doit comporter au moins 8 caractères.";
        }
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins une lettre majuscule (A-Z).";
        }
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins une lettre minuscule (a-z).";
        }
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins un chiffre (0-9).";
        }
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Vérification d'idempotence et protection anti-rejeu pour les Webhooks de paiement
     * Retourne ['is_duplicate' => bool, 'first_seen' => int]
     */
    public static function checkAndRegisterPaymentIdempotency(string $token, string $orderId, float $amount, string $provider): array {
        if (empty($token)) {
            return ['is_duplicate' => false, 'first_seen' => time()];
        }
        $key = 'pay_idemp_' . hash('sha256', "{$token}|{$orderId}");
        $file = self::getStorageFilePath($key);
        $now = time();

        if (file_exists($file)) {
            $raw = @file_get_contents($file);
            if ($raw) {
                $data = json_decode($raw, true);
                if ($data && is_array($data)) {
                    self::logSecurityEvent('PAYMENT_REPLAY_DETECTED', "Tentative de rejeu de webhook bloquée pour token {$token}", [
                        'order_id' => $orderId,
                        'provider' => $provider,
                        'first_seen' => date('Y-m-d H:i:s', $data['timestamp'] ?? $now)
                    ]);
                    return [
                        'is_duplicate' => true,
                        'first_seen' => $data['timestamp'] ?? $now
                    ];
                }
            }
        }

        $payload = [
            'token' => $token,
            'order_id' => $orderId,
            'amount' => $amount,
            'provider' => $provider,
            'ip' => self::getClientIP(),
            'timestamp' => $now
        ];
        $tmp = $file . '.' . uniqid('tmp_', true);
        if (@file_put_contents($tmp, json_encode($payload), LOCK_EX)) {
            @rename($tmp, $file);
        }

        return ['is_duplicate' => false, 'first_seen' => $now];
    }

    /**
     * Récupère les N derniers événements de sécurité pour le tableau de bord Admin
     */
    public static function getRecentSecurityEvents(int $limit = 50): array {
        $logFile = dirname(__DIR__) . '/storage/logs/security_audit.log';
        if (!file_exists($logFile)) {
            return [];
        }
        $lines = @file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!$lines) return [];

        $events = [];
        $reversed = array_reverse($lines);
        $count = 0;
        foreach ($reversed as $line) {
            if ($count >= $limit) break;
            if (preg_match('/^\[(.*?)\] \[SEC:(.*?)\] \[IP:(.*?)\] (.*?) \| (.*)$/', $line, $m)) {
                $events[] = [
                    'timestamp' => $m[1],
                    'type'      => $m[2],
                    'ip'        => $m[3],
                    'message'   => $m[4],
                    'context'   => json_decode($m[5], true) ?? []
                ];
                $count++;
            }
        }
        return $events;
    }

    /**
     * Journal d'audit de sécurité centralisé
     */
    public static function logSecurityEvent(string $type, string $message, array $context = []): void {
        $logDir = dirname(__DIR__) . '/storage/logs';
        if (!is_dir($logDir)) {
            @mkdir($logDir, 0750, true);
        }
        $logFile = $logDir . '/security_audit.log';
        $entry = sprintf(
            "[%s] [SEC:%s] [IP:%s] %s | %s\n",
            date('Y-m-d H:i:s'),
            $type,
            self::getClientIP(),
            $message,
            !empty($context) ? json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : ''
        );
        @file_put_contents($logFile, $entry, FILE_APPEND | LOCK_EX);
    }
}