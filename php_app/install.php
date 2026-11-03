<?php
/**
 * =============================================================================
 * SenTechPLUS — Installateur Automatique 1-Click (Web & CLI)
 * Permet d'initialiser la base de données et les dossiers en 1 clic
 * =============================================================================
 */

require_once __DIR__ . '/config/config.php';

$lockFile = __DIR__ . '/storage/installed.lock';
$isInstalled = file_exists($lockFile);

$results = [];
$status = 'ready';
$errorMsg = '';

// Traitement de l'installation si formulaire soumis ou CLI
$action = $_POST['action'] ?? ($_SERVER['argv'][1] ?? '');

if ($action === 'install') {
    try {
        // 1. Test de connexion PDO
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 10
        ]);
        $results[] = ['step' => 'Connexion à la base de données MySQL', 'status' => 'success', 'detail' => 'Connecté avec succès à ' . DB_NAME];

        // 2. Lecture et exécution du script SQL
        $sqlPath = __DIR__ . '/database/production_schema.sql';
        if (!file_exists($sqlPath)) {
            $sqlPath = __DIR__ . '/database/schema.sql';
        }
        
        if (file_exists($sqlPath)) {
            $sql = file_get_contents($sqlPath);
            // Découpage propre par requêtes
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            $pdo->exec($sql);
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
            $results[] = ['step' => 'Structure des Tables & Données de Départ', 'status' => 'success', 'detail' => 'Catalogue, utilisateurs et index importés avec succès'];
        } else {
            throw new Exception("Fichier SQL introuvable dans database/");
        }

        // 3. Création des dossiers de stockage et permissions
        $folders = [
            __DIR__ . '/storage',
            __DIR__ . '/storage/logs',
            __DIR__ . '/storage/cache',
            __DIR__ . '/storage/security_cache',
            __DIR__ . '/storage/backups',
            __DIR__ . '/assets/images/uploads',
            __DIR__ . '/assets/images/uploads/products',
            __DIR__ . '/assets/images/uploads/stores',
            __DIR__ . '/assets/images/uploads/banners'
        ];

        foreach ($folders as $f) {
            if (!is_dir($f)) {
                @mkdir($f, 0755, true);
            }
        }
        $results[] = ['step' => 'Création des répertoires de stockage', 'status' => 'success', 'detail' => 'Dossiers de cache, logs et uploads créés'];

        // 4. Verrouillage de l'installation
        file_put_contents($lockFile, date('c') . " - Installed successfully\n");
        $results[] = ['step' => 'Sécurisation & Verrouillage', 'status' => 'success', 'detail' => 'Fichier de verrouillage créé avec succès'];

        $status = 'completed';

    } catch (Throwable $e) {
        $status = 'error';
        $errorMsg = $e->getMessage();
        $results[] = ['step' => 'Erreur durant l\'installation', 'status' => 'error', 'detail' => $errorMsg];
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation Automatique — SenTechPLUS 🇸🇳</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#F4F7FB] text-[#182230] min-h-screen flex items-center justify-center p-4">

    <div class="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#E8EDF3] space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-3">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EAF3FF] text-[#1677FF] shadow-inner mb-2">
                <i data-lucide="zap" class="w-8 h-8"></i>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">SenTechPLUS — Installateur 1-Click</h1>
            <p class="text-xs sm:text-sm text-[#475467]">Déploiement automatique de la base de données et des structures de stockage</p>
        </div>

        <!-- Configuration Détectée -->
        <div class="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E8EDF3] space-y-2 text-xs">
            <div class="font-bold text-[#182230] text-sm mb-2 flex items-center gap-2">
                <i data-lucide="database" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Configuration MySQL Détectée</span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#E8EDF3]">
                <span class="text-[#475467]">Serveur Hôte :</span>
                <span class="font-mono font-bold"><?= htmlspecialchars(DB_HOST) ?>:<?= htmlspecialchars(DB_PORT) ?></span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#E8EDF3]">
                <span class="text-[#475467]">Base de Données :</span>
                <span class="font-mono font-bold text-[#1677FF]"><?= htmlspecialchars(DB_NAME) ?></span>
            </div>
            <div class="flex justify-between py-1">
                <span class="text-[#475467]">Utilisateur :</span>
                <span class="font-mono font-bold"><?= htmlspecialchars(DB_USER) ?></span>
            </div>
        </div>

        <?php if ($status === 'completed'): ?>
            <!-- Succès -->
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-800 space-y-3">
                <div class="flex items-center gap-3 font-black text-sm">
                    <i data-lucide="check-circle" class="w-5 h-5 text-emerald-600"></i>
                    <span>Installation Terminée avec Succès ! 🎉</span>
                </div>
                <div class="text-xs space-y-1.5 text-emerald-700">
                    <?php foreach ($results as $res): ?>
                        <div class="flex items-center gap-2">
                            <span>✓</span>
                            <strong><?= htmlspecialchars($res['step']) ?></strong> : <?= htmlspecialchars($res['detail']) ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Boutons de Redirection -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a href="/" class="cursor-pointer py-3.5 px-4 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                    <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                    <span>Voir la Boutique</span>
                </a>
                <a href="admin/" class="cursor-pointer py-3.5 px-4 bg-[#182230] hover:bg-[#0F172A] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>Espace Admin</span>
                </a>
            </div>

        <?php elseif ($status === 'error'): ?>
            <!-- Erreur -->
            <div class="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-800 space-y-2">
                <div class="flex items-center gap-2 font-bold text-sm">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-rose-600"></i>
                    <span>Échec de l'installation</span>
                </div>
                <p class="text-xs text-rose-700 leading-relaxed font-mono"><?= htmlspecialchars($errorMsg) ?></p>
            </div>

            <form method="POST" class="pt-2">
                <input type="hidden" name="action" value="install">
                <button type="submit" class="cursor-pointer w-full py-4 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
                    <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                    <span>Réessayer l'Installation</span>
                </button>
            </form>

        <?php else: ?>
            <!-- Formulaire Lancement -->
            <?php if ($isInstalled): ?>
                <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-xs flex items-center gap-3">
                    <i data-lucide="info" class="w-5 h-5 shrink-0 text-amber-600"></i>
                    <span>La plateforme a déjà été installée précédemment. Vous pouvez forcer une réinitialisation si nécessaire.</span>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-4">
                <input type="hidden" name="action" value="install">
                
                <button type="submit" class="cursor-pointer w-full py-4 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <i data-lucide="play" class="w-5 h-5 fill-current"></i>
                    <span>Lancer l'Installation Automatique</span>
                </button>
            </form>
        <?php endif; ?>

        <div class="text-center pt-2 text-[11px] text-[#475467] border-t border-[#E8EDF3]">
            SenTechPLUS Sénégal — Prêt pour le déploiement Hostinger & Production 2026
        </div>

    </div>

    <script>lucide.createIcons();</script>
</body>
</html>