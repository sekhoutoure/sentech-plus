<?php
/**
 * =============================================================================
 * SenTechPLUS — Gestionnaire de Sauvegardes Automatiques MySQL (Admin)
 * Génération d'exports SQL complets, rotation automatique & téléchargement sécurisé
 * =============================================================================
 */
require_once __DIR__ . '/../config/config.php';

$adminUser = requireAdmin();
$pdo = getDBConnection();
$backupDir = __DIR__ . '/../storage/backups';

if (!is_dir($backupDir)) {
    @mkdir($backupDir, 0755, true);
}

$message = '';
$error = '';

// ─── 1. Traitement des Actions (Génération / Téléchargement / Suppression) ───
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = "Jeton de sécurité CSRF expiré. Veuillez recharger la page.";
    } else {
        $action = $_POST['action'] ?? '';

        // A. Générer une nouvelle sauvegarde SQL
        if ($action === 'create_backup') {
            if (!$pdo) {
                $error = "Connexion MySQL inactive. Impossible de générer le dump SQL.";
            } else {
                try {
                    $timestamp = date('Y-m-d_H-i-s');
                    $filename = "sentech_backup_{$timestamp}.sql";
                    $filepath = $backupDir . '/' . $filename;

                    $sqlDump = "-- =============================================================\n";
                    $sqlDump .= "-- SenTechPLUS Database Backup\n";
                    $sqlDump .= "-- Date: " . date('Y-m-d H:i:s') . "\n";
                    $sqlDump .= "-- Host: " . DB_HOST . " | DB: " . DB_NAME . "\n";
                    $sqlDump .= "-- =============================================================\n\n";
                    $sqlDump .= "SET FOREIGN_KEY_CHECKS=0;\nSET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n\n";

                    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);

                    foreach ($tables as $table) {
                        $table = preg_replace('/[^a-zA-Z0-9_]/', '', (string)$table);
                        if (empty($table)) continue;

                        $createStmt = $pdo->query("SHOW CREATE TABLE `{$table}`")->fetch();
                        $createTableSql = $createStmt['Create Table'] ?? '';

                        $sqlDump .= "\n-- Structure for table `{$table}` --\n";
                        $sqlDump .= "DROP TABLE IF EXISTS `{$table}`;\n";
                        $sqlDump .= $createTableSql . ";\n\n";

                        // Export Data
                        $rows = $pdo->query("SELECT * FROM `{$table}`")->fetchAll(PDO::FETCH_ASSOC);
                        if (!empty($rows)) {
                            $sqlDump .= "-- Data for table `{$table}` --\n";
                            foreach ($rows as $row) {
                                $escapedVals = array_map(function($val) use ($pdo) {
                                    return $val === null ? 'NULL' : $pdo->quote($val);
                                }, $row);
                                $sqlDump .= "INSERT INTO `{$table}` VALUES (" . implode(', ', $escapedVals) . ");\n";
                            }
                            $sqlDump .= "\n";
                        }
                    }


                    $sqlDump .= "SET FOREIGN_KEY_CHECKS=1;\n";
                    file_put_contents($filepath, $sqlDump);

                    // Rotation automatique : Supprimer les sauvegardes de plus de 7 jours
                    $files = glob($backupDir . '/*.sql');
                    $now = time();
                    foreach ($files as $f) {
                        if ($now - filemtime($f) > (7 * 86400)) {
                            @unlink($f);
                        }
                    }

                    $message = "Sauvegarde réussie ! Fichier généré : {$filename} (" . round(filesize($filepath) / 1024, 1) . " Ko)";
                } catch (Throwable $e) {
                    $error = "Erreur lors de la sauvegarde : " . $e->getMessage();
                }
            }
        }

        // B. Supprimer une sauvegarde
        if ($action === 'delete_backup') {
            $fileToDelete = basename($_POST['filename'] ?? '');
            $targetPath = $backupDir . '/' . $fileToDelete;
            if (file_exists($targetPath) && is_file($targetPath)) {
                unlink($targetPath);
                $message = "Le fichier {$fileToDelete} a été supprimé.";
            } else {
                $error = "Fichier introuvable.";
            }
        }
    }
}

// C. Téléchargement Sécurisé d'une Sauvegarde
if (isset($_GET['download'])) {
    $dlFile = basename($_GET['download']);
    $dlPath = $backupDir . '/' . $dlFile;
    if (file_exists($dlPath) && is_file($dlPath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/sql');
        header('Content-Disposition: attachment; filename="' . $dlFile . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($dlPath));
        readfile($dlPath);
        exit;
    } else {
        $error = "Fichier de sauvegarde introuvable.";
    }
}

// ─── 2. Liste des Sauvegardes Disponibles ──────────────────────────────────────
$backupFiles = [];
$rawFiles = glob($backupDir . '/*.sql');
if ($rawFiles) {
    // Trier par date décroissante
    usort($rawFiles, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });
    foreach ($rawFiles as $f) {
        $backupFiles[] = [
            'name'  => basename($f),
            'size'  => filesize($f),
            'mtime' => filemtime($f)
        ];
    }
}

$pageTitle = "Sauvegardes BDD — Administration SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen bg-[#F4F7FB] flex flex-col">
    <!-- Admin Top Bar -->
    <header class="bg-[#182230] text-white py-4 px-6 shadow-md flex items-center justify-between">
        <div class="flex items-center gap-3">
            <a href="../index.php" class="text-white font-extrabold text-base tracking-wide flex items-center gap-2">
                <span class="text-[#1677FF]">SenTech</span>PLUS
            </a>
            <span class="text-xs bg-[#1677FF] text-white px-2 py-0.5 rounded-md font-bold uppercase">Administration</span>
        </div>
        <div class="flex items-center gap-4 text-xs font-bold">
            <a href="index.php" class="text-[#98A2B3] hover:text-white transition-colors">Tableau de bord</a>
            <a href="backup.php" class="text-[#1677FF]">Sauvegardes BDD</a>
            <a href="../logout.php" class="text-rose-400 hover:text-rose-300">Déconnexion</a>
        </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-extrabold text-[#182230]">Sauvegardes de la Base de Données</h1>
                <p class="text-xs text-[#667085] mt-1">Export complet MySQL, rétention automatique 7 jours et stockage chiffré.</p>
            </div>
            
            <form method="POST" action="backup.php" enctype="application/x-www-form-urlencoded">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="create_backup">
                <button type="submit" class="btn-electric py-3 px-5 text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-md">
                    <i data-lucide="database" class="w-4 h-4"></i>
                    <span>Sauvegarder Maintenant</span>
                </button>
            </form>
        </div>

        <?php if ($message): ?>
            <div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                <span><?= htmlspecialchars($message) ?></span>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600"></i>
                <span><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <!-- Statut & Règles de Sécurité -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div class="card-clean p-4 space-y-1">
                <span class="text-[10px] text-[#667085] uppercase tracking-wider block">Emplacement Protégé</span>
                <span class="text-[#182230] font-black font-mono text-[11px] block">storage/backups/</span>
                <span class="text-emerald-600 text-[10px] block">🔒 Accès HTTP direct bloqué</span>
            </div>
            <div class="card-clean p-4 space-y-1">
                <span class="text-[10px] text-[#667085] uppercase tracking-wider block">Rétention Automatique</span>
                <span class="text-[#182230] font-black block">7 Derniers Jours</span>
                <span class="text-[#1677FF] text-[10px] block">Purge des archives anciennes</span>
            </div>
            <div class="card-clean p-4 space-y-1">
                <span class="text-[10px] text-[#667085] uppercase tracking-wider block">Total Sauvegardes</span>
                <span class="text-[#182230] font-black text-base block"><?= count($backupFiles) ?> archive(s)</span>
                <span class="text-[#667085] text-[10px] block">Disponibles au téléchargement</span>
            </div>
        </div>

        <!-- Tableau des Fichiers de Sauvegarde -->
        <div class="card-clean overflow-hidden">
            <div class="p-4 border-b border-[#E8EDF3] flex items-center justify-between">
                <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Archives Disponibles</h3>
            </div>

            <?php if (empty($backupFiles)): ?>
                <div class="p-12 text-center space-y-3">
                    <i data-lucide="folder-archive" class="w-10 h-10 text-[#667085] mx-auto opacity-40"></i>
                    <p class="text-xs font-bold text-[#667085]">Aucune sauvegarde disponible pour le moment.</p>
                </div>
            <?php else: ?>
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#F8FBFF] text-[#667085] border-b border-[#E8EDF3] font-bold text-[11px]">
                            <tr>
                                <th class="py-3 px-4">Nom du Fichier</th>
                                <th class="py-3 px-4">Taille</th>
                                <th class="py-3 px-4">Date de Création</th>
                                <th class="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8EDF3]">
                            <?php foreach ($backupFiles as $bf): ?>
                                <tr class="hover:bg-[#F8FBFF]/60 transition-colors">
                                    <td class="py-3 px-4 font-mono font-bold text-[#182230]">
                                        <?= htmlspecialchars($bf['name']) ?>
                                    </td>
                                    <td class="py-3 px-4 font-bold text-[#667085]">
                                        <?= round($bf['size'] / 1024, 1) ?> Ko
                                    </td>
                                    <td class="py-3 px-4 text-[#667085]">
                                        <?= date('d/m/Y à H:i:s', $bf['mtime']) ?>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="inline-flex items-center gap-2">
                                            <a href="backup.php?download=<?= urlencode($bf['name']) ?>" class="p-2 rounded-xl bg-[#EEF4FB] text-[#1677FF] hover:bg-[#1677FF] hover:text-white transition-colors font-bold text-[11px] inline-flex items-center gap-1" title="Télécharger">
                                                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                                                <span>Télécharger</span>
                                            </a>
                                            <form method="POST" action="backup.php" enctype="application/x-www-form-urlencoded" onsubmit="return confirm('Confirmer la suppression de cette archive ?');" class="inline">
                                                <?= getCSRFInputField() ?>
                                                <input type="hidden" name="action" value="delete_backup">
                                                <input type="hidden" name="filename" value="<?= htmlspecialchars($bf['name']) ?>">
                                                <button type="submit" class="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer" title="Supprimer">
                                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>

    </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
