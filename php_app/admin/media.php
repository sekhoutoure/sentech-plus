<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$message = '';
$messageType = 'success';

// Traitement POST : Upload ou Suppression d'image
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Erreur de sécurité : Jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $action = $_POST['action'];

        if ($action === 'upload_media') {
            $category = sanitize($_POST['category'] ?? 'general');

            if (!empty($_FILES['media_file']['name'])) {
                $uploadRes = SecureUploader::processImageUpload($_FILES['media_file'], $category, 1920, 1920);
                if ($uploadRes['success']) {
                    $relPath = $uploadRes['path'];
                    $filename = basename($relPath);
                    if ($pdo) {
                        try {
                            $stmt = $pdo->prepare("INSERT INTO media_library (filename, original_name, file_path, file_type, file_size, category) VALUES (:fn, :on, :fp, :ft, :fs, :cat)");
                            $stmt->execute([
                                ':fn' => $filename,
                                ':on' => $_FILES['media_file']['name'],
                                ':fp' => $relPath,
                                ':ft' => 'image/webp',
                                ':fs' => (int)($_FILES['media_file']['size'] ?? 0),
                                ':cat' => $category
                            ]);
                        } catch (Throwable $e) {}
                    }
                    $message = "Image « " . htmlspecialchars($_FILES['media_file']['name']) . " » téléversée et sécurisée avec succès !";
                    $messageType = 'success';
                } else {
                    $message = $uploadRes['error'] ?? "Format invalide ou fichier trop volumineux (Max 5 Mo, Formats: JPG, PNG, WebP).";
                    $messageType = 'error';
                }
            }

        } elseif ($action === 'delete_media') {
            $mediaId = (int)($_POST['media_id'] ?? 0);
            if ($mediaId && $pdo) {
                try {
                    $stmt = $pdo->prepare("SELECT file_path FROM media_library WHERE id = :id");
                    $stmt->execute([':id' => $mediaId]);
                    $path = $stmt->fetchColumn();
                    if ($path && file_exists(__DIR__ . '/../' . $path) && strpos($path, 'uploads/') !== false) {
                        @unlink(__DIR__ . '/../' . $path);
                    }
                    $stmtDel = $pdo->prepare("DELETE FROM media_library WHERE id = :id");
                    $stmtDel->execute([':id' => $mediaId]);
                    $message = "Fichier supprimé de la médiathèque.";
                    $messageType = 'success';
                } catch (Throwable $e) {}
            }
        }
    }
}

// Fetch all media
$mediaList = [];
if ($pdo) {
    try {
        $stmtAll = $pdo->query("SELECT * FROM media_library ORDER BY created_at DESC");
        $mediaList = $stmtAll ? $stmtAll->fetchAll() : [];
    } catch (Throwable $e) {
        $mediaList = [];
    }
}

if (empty($mediaList)) {
    $mediaList = [
        ['id' => 1, 'filename' => 'product_img4.webp', 'original_name' => 'Casque Sony ANC', 'file_path' => 'assets/images/product_img4.webp', 'file_type' => 'image/webp', 'file_size' => 45000, 'category' => 'products'],
        ['id' => 2, 'filename' => 'product_img7.webp', 'original_name' => 'Chargeur GaN 65W', 'file_path' => 'assets/images/product_img7.webp', 'file_type' => 'image/webp', 'file_size' => 38000, 'category' => 'products'],
        ['id' => 3, 'filename' => 'product_img8.webp', 'original_name' => 'Montre Connectée Sport', 'file_path' => 'assets/images/product_img8.webp', 'file_type' => 'image/webp', 'file_size' => 52000, 'category' => 'products'],
        ['id' => 4, 'filename' => 'sentech_logo.webp', 'original_name' => 'Logo Officiel', 'file_path' => 'assets/images/sentech_logo.webp', 'file_type' => 'image/webp', 'file_size' => 18000, 'category' => 'general']
    ];
}

$pageTitle = "Médiathèque & Images — Admin SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F3F7FC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-[#E8EDF3] py-4 px-6 flex items-center justify-between shadow-2xs sticky top-0 z-20">
            <h1 class="text-sm font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="image" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Médiathèque Centrale des Images & Bannières</span>
            </h1>
            <a href="../logout.php" class="text-rose-500 text-xs font-bold hover:underline lg:hidden cursor-pointer">Déconnexion</a>
        </header>

        <div class="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            <?php if ($message): ?>
                <div class="p-4 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200' ?> flex items-center justify-between shadow-2xs">
                    <span><?= htmlspecialchars($message) ?></span>
                    <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
                </div>
            <?php endif; ?>

            <!-- Upload Card -->
            <div class="bg-white rounded-3xl p-6 border border-[#E8EDF3] shadow-2xs space-y-4">
                <h2 class="text-base font-black text-[#182230] flex items-center gap-2">
                    <i data-lucide="upload-cloud" class="w-5 h-5 text-[#1677FF]"></i>
                    <span>Téléverser une Nouvelle Image</span>
                </h2>
                
                <form method="POST" action="media.php" enctype="multipart/form-data" class="flex flex-col sm:flex-row items-center gap-3 text-xs">
                    <?= getCSRFInputField() ?>
                    <input type="hidden" name="action" value="upload_media">
                    
                    <div class="flex-1 w-full">
                        <input type="file" name="media_file" required accept="image/webp,image/png,image/jpeg" class="w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EAF3FF] file:text-[#0B54C2] hover:file:bg-blue-100 cursor-pointer">
                    </div>

                    <select name="category" class="w-full sm:w-auto p-2.5 rounded-xl border border-[#E8EDF3] bg-white font-bold outline-none cursor-pointer">
                        <option value="products">📦 Produits</option>
                        <option value="banners">🖼️ Bannières</option>
                        <option value="categories">🏷️ Catégories</option>
                        <option value="general">✨ Général</option>
                    </select>

                    <button type="submit" class="cursor-pointer w-full sm:w-auto bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap">
                        Téléverser
                    </button>
                </form>
                <span class="text-[10px] text-[#667085] block">Formats acceptés : WebP, PNG, JPG (Max 5 Mo). Optimisation automatique.</span>
            </div>

            <!-- Media Grid -->
            <div>
                <h3 class="text-sm font-black text-[#182230] uppercase tracking-wider mb-4">Images dans la Médiathèque (<?= count($mediaList) ?>)</h3>

                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <?php foreach ($mediaList as $m): ?>
                        <div class="bg-white rounded-2xl p-3 border border-[#E8EDF3] shadow-2xs space-y-2 flex flex-col justify-between group">
                            <div class="w-full h-32 bg-[#F3F7FC] rounded-xl flex items-center justify-center p-2 overflow-hidden relative">
                                <img src="../<?= htmlspecialchars($m['file_path']) ?>" alt="<?= htmlspecialchars($m['original_name']) ?>" width="128" height="128" style="aspect-ratio:1/1;" class="w-full h-full object-contain" loading="lazy">
                                <span class="absolute top-2 left-2 text-[9px] font-extrabold bg-[#182230]/80 text-white px-2 py-0.5 rounded-full uppercase">
                                    <?= htmlspecialchars($m['category'] ?? 'media') ?>
                                </span>
                            </div>

                            <div class="min-w-0">
                                <span class="text-xs font-bold text-[#182230] truncate block" title="<?= htmlspecialchars($m['original_name']) ?>">
                                    <?= htmlspecialchars($m['original_name']) ?>
                                </span>
                                <span class="text-[10px] text-[#667085] font-mono block truncate"><?= htmlspecialchars($m['file_path']) ?></span>
                            </div>

                            <div class="pt-2 border-t border-[#E8EDF3] flex items-center justify-between gap-2">
                                <button type="button" onclick="copyMediaUrl('<?= htmlspecialchars($m['file_path']) ?>', this)" class="cursor-pointer text-[10px] font-bold text-[#1677FF] hover:text-[#0B54C2] flex items-center gap-1 bg-[#EAF3FF] px-2.5 py-1 rounded-lg">
                                    <i data-lucide="copy" class="w-3 h-3"></i>
                                    <span>Copier URL</span>
                                </button>
                                <?php if (!empty($m['id'])): ?>
                                    <form method="POST" action="media.php" onsubmit="return confirm('Supprimer ce fichier ?');" class="inline">
                                        <?= getCSRFInputField() ?>
                                        <input type="hidden" name="action" value="delete_media">
                                        <input type="hidden" name="media_id" value="<?= (int)$m['id'] ?>">
                                        <button type="submit" class="cursor-pointer p-1 text-[#667085] hover:text-rose-600 rounded-lg hover:bg-rose-50" title="Supprimer">
                                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </main>
</div>

<script>
function copyMediaUrl(url, btn) {
    navigator.clipboard.writeText(url).then(() => {
        const origText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" class="w-3 h-3 text-[#0D7D53]"></i> <span class="text-[#0D7D53]">Copié !</span>';
        lucide.createIcons();
        setTimeout(() => { btn.innerHTML = origText; lucide.createIcons(); }, 2000);
    });
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
