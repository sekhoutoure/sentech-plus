<?php
/**
 * =============================================================================
 * SenTechPLUS — Automated Scheduled MySQL Backup (Cron Script)
 * Usage:
 *   CLI:  php cron/backup.php
 *   HTTP: https://sentechplus.com/cron/backup.php?key=YOUR_SECRET_KEY
 * =============================================================================
 */

require_once __DIR__ . '/../config/config.php';

$isCli = (php_sapi_name() === 'cli' || empty($_SERVER['REMOTE_ADDR']));
$secretKey = getenv('CRON_KEY') ?: getenv('APP_SECRET') ?: 'sentech_cron_secure_key_2026';

// 1. Authentication Check (if called via Web HTTP)
if (!$isCli) {
    header('Content-Type: application/json; charset=UTF-8');
    $providedKey = $_GET['key'] ?? $_SERVER['HTTP_X_CRON_KEY'] ?? '';

    if (empty($providedKey) || !hash_equals($secretKey, $providedKey)) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Accès refusé. Clé de sécurité Cron invalide.'
        ]);
        exit;
    }
}

$pdo = getDBConnection();
$backupDir = __DIR__ . '/../storage/backups';
$logDir = __DIR__ . '/../storage/logs';

if (!is_dir($backupDir)) {
    @mkdir($backupDir, 0755, true);
}
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

$logFile = $logDir . '/cron_backup.log';

function writeCronLog(string $msg, string $logFile): void {
    $timestamp = date('Y-m-d H:i:s');
    @file_put_contents($logFile, "[{$timestamp}] {$msg}\n", FILE_APPEND);
}

if (!$pdo) {
    $errMsg = "ÉCHEC: Impossible d'établir la connexion MySQL pour la sauvegarde.";
    writeCronLog($errMsg, $logFile);
    if ($isCli) {
        fwrite(STDERR, "❌ {$errMsg}\n");
        exit(1);
    } else {
        echo json_encode(['success' => false, 'message' => $errMsg]);
        exit;
    }
}

try {
    $timestamp = date('Y-m-d_H-i-s');
    $filename = "sentech_backup_{$timestamp}.sql";
    $filepath = $backupDir . '/' . $filename;

    $sqlDump = "-- =============================================================\n";
    $sqlDump .= "-- SenTechPLUS Automated Scheduled MySQL Dump\n";
    $sqlDump .= "-- Date: " . date('Y-m-d H:i:s') . "\n";
    $sqlDump .= "-- Host: " . DB_HOST . " | Database: " . DB_NAME . "\n";
    $sqlDump .= "-- Mode: " . ($isCli ? 'CLI Cron' : 'HTTP Webhook') . "\n";
    $sqlDump .= "-- =============================================================\n\n";
    $sqlDump .= "SET FOREIGN_KEY_CHECKS=0;\n";
    $sqlDump .= "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n";
    $sqlDump .= "SET time_zone = '+00:00';\n\n";

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $table) {
        $table = preg_replace('/[^a-zA-Z0-9_]/', '', (string)$table);
        if (empty($table)) continue;

        $createStmt = $pdo->query("SHOW CREATE TABLE `{$table}`")->fetch();
        $createTableSql = $createStmt['Create Table'] ?? '';


        $sqlDump .= "\n-- -------------------------------------------------------------\n";
        $sqlDump .= "-- Table structure for `{$table}`\n";
        $sqlDump .= "-- -------------------------------------------------------------\n";
        $sqlDump .= "DROP TABLE IF EXISTS `{$table}`;\n";
        $sqlDump .= $createTableSql . ";\n\n";

        // Export Table Data
        $rows = $pdo->query("SELECT * FROM `{$table}`")->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($rows)) {
            $sqlDump .= "-- Dumping data for table `{$table}` (" . count($rows) . " rows) --\n";
            $columns = array_keys($rows[0]);
            $colList = '`' . implode('`, `', $columns) . '`';

            $valuesList = [];
            foreach ($rows as $row) {
                $escapedVals = array_map(function($val) use ($pdo) {
                    if ($val === null) return 'NULL';
                    return $pdo->quote($val);
                }, array_values($row));
                $valuesList[] = '(' . implode(', ', $escapedVals) . ')';
            }

            // Chunk inserts by 100
            $chunks = array_chunk($valuesList, 100);
            foreach ($chunks as $chunk) {
                $sqlDump .= "INSERT INTO `{$table}` ({$colList}) VALUES\n" . implode(",\n", $chunk) . ";\n";
            }
            $sqlDump .= "\n";
        }
    }

    $sqlDump .= "SET FOREIGN_KEY_CHECKS=1;\n";
    $sqlDump .= "-- End of Dump --\n";

    file_put_contents($filepath, $sqlDump);
    $filesizeKb = round(filesize($filepath) / 1024, 2);

    // ─── Rolling Backup Retention (Purge files older than 7 days) ───────────
    $purgedCount = 0;
    $retentionDays = 7;
    $files = glob($backupDir . '/sentech_backup_*.sql');
    $now = time();

    foreach ($files as $f) {
        if (is_file($f)) {
            if ($now - filemtime($f) > ($retentionDays * 86400)) {
                @unlink($f);
                $purgedCount++;
            }
        }
    }

    $successMsg = "SUCCÈS: Sauvegarde générée ({$filename}, {$filesizeKb} KB, " . count($tables) . " tables, {$purgedCount} ancienne(s) purge(s)).";
    writeCronLog($successMsg, $logFile);

    if ($isCli) {
        echo "✅ {$successMsg}\n";
    } else {
        echo json_encode([
            'success' => true,
            'message' => $successMsg,
            'filename' => $filename,
            'size_kb' => $filesizeKb,
            'tables_count' => count($tables),
            'purged_old_backups' => $purgedCount
        ], JSON_PRETTY_PRINT);
    }

} catch (Throwable $e) {
    $err = "ERREUR lors de la sauvegarde: " . $e->getMessage();
    writeCronLog($err, $logFile);
    if ($isCli) {
        fwrite(STDERR, "❌ {$err}\n");
        exit(1);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $err]);
    }
}
