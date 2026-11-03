<?php
/**
 * =============================================================================
 * SenTechPLUS — Moteur de Cache & Scalabilité Haute Performance (10 000+ Req/s)
 * =============================================================================
 * Niveau 1 : Mémoire RAM APCu (0.01ms sans accès disque) si disponible
 * Niveau 2 : Cache Disque Atomique avec sérialisation native et sharding
 * =============================================================================
 */

class FastCache {
    private static ?string $cacheDir = null;
    private static array $memoryCache = [];

    /**
     * Initialise le répertoire de cache
     */
    private static function getDir(): string {
        if (self::$cacheDir === null) {
            self::$cacheDir = __DIR__ . '/../storage/cache';
            if (!is_dir(self::$cacheDir)) {
                @mkdir(self::$cacheDir, 0755, true);
            }
        }
        return self::$cacheDir;
    }

    /**
     * Récupère une valeur ou l'exécute et la met en cache automatiquement
     *
     * @param string $key Identifiant unique de cache
     * @param int $ttl Durée de validité en secondes (ex: 300 = 5 min)
     * @param callable $callback Fonction génératrice si cache manquant
     * @return mixed
     */
    public static function remember(string $key, int $ttl, callable $callback): mixed {
        $cached = self::get($key);
        if ($cached !== null) {
            return $cached;
        }

        $freshValue = $callback();
        self::set($key, $freshValue, $ttl);
        return $freshValue;
    }

    /**
     * Récupère une valeur du cache
     */
    public static function get(string $key): mixed {
        // 1. RAM locale de l'exécution courante (Niveau 0)
        if (array_key_exists($key, self::$memoryCache)) {
            return self::$memoryCache[$key];
        }

        // 2. APCu In-Memory Cache (Niveau 1)
        if (function_exists('apcu_fetch')) {
            $success = false;
            $val = apcu_fetch('st_' . $key, $success);
            if ($success) {
                self::$memoryCache[$key] = $val;
                return $val;
            }
        }

        // 3. Cache Disque Atomique (Niveau 2)
        $hash = md5($key);
        $file = self::getDir() . '/' . substr($hash, 0, 2) . '/' . $hash . '.cache';
        if (!file_exists($file)) {
            return null;
        }

        $raw = @file_get_contents($file);
        if ($raw === false || strlen($raw) < 10) {
            return null;
        }

        $expire = (int)substr($raw, 0, 10);
        if (time() > $expire) {
            @unlink($file);
            return null;
        }

        $data = @unserialize(substr($raw, 10));
        if ($data === false && substr($raw, 10) !== serialize(false)) {
            return null;
        }

        self::$memoryCache[$key] = $data;
        return $data;
    }

    /**
     * Enregistre une valeur dans le cache
     */
    public static function set(string $key, mixed $value, int $ttl = 300): bool {
        self::$memoryCache[$key] = $value;

        // 1. APCu In-Memory Cache
        if (function_exists('apcu_store')) {
            apcu_store('st_' . $key, $value, $ttl);
        }

        // 2. Disque Atomique
        $hash = md5($key);
        $subDir = self::getDir() . '/' . substr($hash, 0, 2);
        if (!is_dir($subDir)) {
            @mkdir($subDir, 0755, true);
        }

        $file = $subDir . '/' . $hash . '.cache';
        $expire = str_pad((string)(time() + $ttl), 10, '0', STR_PAD_LEFT);
        $content = $expire . serialize($value);

        // Écriture atomique (tempnam + rename évite tout verrouillage ou corruption de fichier)
        $tmpFile = tempnam($subDir, 'tmp_');
        if ($tmpFile) {
            if (@file_put_contents($tmpFile, $content) !== false) {
                @rename($tmpFile, $file);
                return true;
            }
            @unlink($tmpFile);
        }
        return (bool)@file_put_contents($file, $content);
    }

    /**
     * Supprime une clé spécifique du cache (Invalidation instantanée)
     */
    public static function forget(string $key): bool {
        unset(self::$memoryCache[$key]);

        if (function_exists('apcu_delete')) {
            apcu_delete('st_' . $key);
        }

        $hash = md5($key);
        $file = self::getDir() . '/' . substr($hash, 0, 2) . '/' . $hash . '.cache';
        if (file_exists($file)) {
            return @unlink($file);
        }
        return true;
    }

    /**
     * Vide intégralement le cache de l'application
     */
    public static function flush(): void {
        self::$memoryCache = [];

        if (function_exists('apcu_clear_cache')) {
            apcu_clear_cache();
        }

        $dir = self::getDir();
        self::deleteTree($dir, false);
    }

    private static function deleteTree(string $dir, bool $removeRoot = true): void {
        if (!is_dir($dir)) return;
        $files = array_diff(scandir($dir) ?: [], ['.', '..']);
        foreach ($files as $file) {
            $p = $dir . '/' . $file;
            is_dir($p) ? self::deleteTree($p, true) : @unlink($p);
        }
        if ($removeRoot) @rmdir($dir);
    }
}

/**
 * En-tête HTTP de Micro-Cache Navigateur / Proxy pour pages publiques
 */
if (!function_exists('applyHttpMicroCache')) {
    function applyHttpMicroCache(int $maxAgeSeconds = 30): void {
        if (headers_sent()) return;
        
        // Uniquement pour les requêtes GET sans session utilisateur connectée
        if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isLoggedIn() && empty($_SESSION['cart'])) {
            header("Cache-Control: public, max-age={$maxAgeSeconds}, stale-while-revalidate=" . ($maxAgeSeconds * 2));
            header('Vary: Accept-Encoding');
        } else {
            header('Cache-Control: no-cache, private, must-revalidate');
        }
    }
}
