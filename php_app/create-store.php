<?php
require_once __DIR__ . '/config/config.php';

if (!isLoggedIn()) {
    header('Location: login.php?redirect=create-store.php');
    exit;
}

$pdo = getDBConnection();
$user = getCurrentUser();
$message = '';
$messageType = '';

// Check existing store
$stmtCheck = $pdo->prepare("SELECT * FROM stores WHERE user_id = :uid");
$stmtCheck->execute([':uid' => $user['id']]);
$existingStore = $stmtCheck->fetch();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$existingStore) {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $message = "Session expirée ou jeton CSRF invalide.";
        $messageType = 'error';
    } else {
        $name = sanitize($_POST['name'] ?? '');
    $username = strtolower(sanitize($_POST['username'] ?? ''));
    $email = sanitize($_POST['email'] ?? '');
    $contact = sanitize($_POST['contact'] ?? '');
    $address = sanitize($_POST['address'] ?? '');
    $description = sanitize($_POST['description'] ?? '');
    $category = sanitize($_POST['category'] ?? '');

    // Logo upload via SecureUploader (Validation Magic Bytes & Re-compression WebP)
    $logoPath = 'assets/images/happy_store.webp'; // Default
    if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
        $uploadResult = SecureUploader::processImageUpload($_FILES['logo'], 'logos', 600, 600);
        if ($uploadResult['success']) {
            $logoPath = $uploadResult['path'];
        } else {
            $message = $uploadResult['error'] ?? "Erreur lors du téléversement du logo.";
            $messageType = 'error';
        }
    }


    if (empty($name) || empty($username) || empty($email) || empty($contact) || empty($category)) {
        $message = "Veuillez remplir tous les champs obligatoires.";
        $messageType = 'error';
    } elseif (!preg_match('/^[a-z0-9_-]+$/', $username)) {
        $message = "Le nom d'utilisateur n'est pas valide (lettres minuscules, chiffres, tirets uniquement).";
        $messageType = 'error';
    } else {
        // Check username uniqueness
        $stmtUser = $pdo->prepare("SELECT id FROM stores WHERE username = :u");
        $stmtUser->execute([':u' => $username]);
        if ($stmtUser->fetch()) {
            $message = "Ce nom d'utilisateur de boutique est déjà pris.";
            $messageType = 'error';
        } else {
            $storeId = 'store_' . uniqid();
            
            $fullDesc = trim("Catégorie : $category\n\n$description");

            $stmtInsert = $pdo->prepare("INSERT INTO stores (id, user_id, name, description, username, address, status, is_active, logo, email, contact) 
                                       VALUES (:id, :uid, :name, :desc, :u, :addr, 'pending', 0, :logo, :email, :contact)");
            $stmtInsert->execute([
                ':id' => $storeId,
                ':uid' => $user['id'],
                ':name' => $name,
                ':desc' => $fullDesc,
                ':u' => $username,
                ':addr' => $address,
                ':logo' => $logoPath,
                ':email' => $email,
                ':contact' => $contact
            ]);

            // Update user role to seller
            $pdo->prepare("UPDATE users SET role = 'seller' WHERE id = :uid")->execute([':uid' => $user['id']]);
            $_SESSION['user']['role'] = 'seller';
            $_SESSION['user']['store_id'] = $storeId;

            $message = "Votre demande a été envoyée ! Elle sera examinée sous 24h.";
            $messageType = 'success';

            // Refresh existing store
            $stmtCheck->execute([':uid' => $user['id']]);
            $existingStore = $stmtCheck->fetch();
        }
    }
    }
}

$pageTitle = "Créer ma Boutique Vendeur";
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[800px] mx-auto px-4 sm:px-6 py-8 flex-1 space-y-6">

    <!-- Breadcrumbs Navigation -->
    <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#667085] flex items-center gap-1.5">
        <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
        <span class="text-[#98A2B3]">/</span>
        <a href="pricing.php" class="hover:text-[#1677FF] transition-colors">Formules</a>
        <span class="text-[#98A2B3]">/</span>
        <span class="text-[#182230] font-bold" aria-current="page">Créer ma Boutique</span>
    </nav>

    <div class="text-center space-y-2">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#182230] tracking-tight">Devenir Vendeur SenTechPLUS</h1>
        <p class="text-xs sm:text-sm text-[#667085]">Vendez vos produits High-Tech à des milliers de clients à Dakar et au Sénégal.</p>
    </div>

    <?php if ($message): ?>
        <div class="p-4 rounded-xl text-xs font-bold flex items-center gap-2 <?= $messageType === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-[#0D7D53] border border-emerald-200' ?>">
            <i data-lucide="<?= $messageType === 'error' ? 'alert-circle' : 'check-circle-2' ?>" class="w-4 h-4 shrink-0"></i>
            <span><?= htmlspecialchars($message) ?></span>
        </div>
    <?php endif; ?>

    <?php if ($existingStore): ?>
        <div class="card-clean p-6 sm:p-8 space-y-4 text-center">
            <div class="w-14 h-14 mx-auto rounded-full bg-[#EAF3FF] overflow-hidden flex items-center justify-center border border-[#E8EDF3]">
                <?php if($existingStore['logo']): ?>
                    <img src="<?= htmlspecialchars($existingStore['logo']) ?>" alt="Store logo" width="56" height="56" class="w-full h-full object-cover" loading="lazy">
                <?php else: ?>
                    <i data-lucide="store" class="w-7 h-7 text-[#0B54C2]"></i>
                <?php endif; ?>
            </div>
            <h2 class="text-lg font-bold text-[#182230]"><?= htmlspecialchars($existingStore['name']) ?></h2>
            <p class="text-xs text-[#667085]">Statut de la boutique : 
                <span class="font-extrabold px-2 py-0.5 rounded-full text-[10px] uppercase <?= $existingStore['status'] === 'approved' ? 'bg-emerald-100 text-[#0D7D53]' : 'bg-amber-100 text-amber-800' ?>">
                    <?= $existingStore['status'] === 'approved' ? 'Approuvée & Active' : 'En cours d\'examen' ?>
                </span>
            </p>
            <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a href="store.php?username=<?= htmlspecialchars($existingStore['username']) ?>" class="btn-electric inline-block text-xs">
                    Voir ma Boutique Publique →
                </a>
                <?php if ($existingStore['status'] === 'approved'): ?>
                    <a href="seller/index.php" class="bg-[#182230] hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl inline-block text-xs transition-colors">
                        Accéder à mon Espace Vendeur →
                    </a>
                <?php endif; ?>
            </div>
        </div>
    <?php else: ?>

        <form method="POST" action="create-store.php" enctype="multipart/form-data" class="card-clean p-6 sm:p-8 space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            
            <div class="flex flex-col items-center justify-center w-full mb-6">
                <label for="logo-upload" class="cursor-pointer group flex flex-col items-center">
                    <div id="logo-preview-container" class="w-20 h-20 rounded-full bg-[#F3F7FC] border-2 border-dashed border-[#E8EDF3] flex items-center justify-center overflow-hidden group-hover:border-[#1677FF] transition-colors mb-2">
                        <i data-lucide="camera" class="w-6 h-6 text-[#667085] group-hover:text-[#1677FF]" id="camera-icon"></i>
                        <img id="logo-preview" class="w-full h-full object-cover hidden" alt="Logo preview" loading="lazy" width="214" height="214">
                    </div>
                    <span class="text-[10px] text-[#667085] font-bold uppercase">Ajouter un logo</span>
                    <input id="logo-upload" type="file" name="logo" accept="image/*" class="hidden" onchange="previewLogo(this)">
                </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="store-name" class="block font-bold text-[#182230] mb-1">Nom de la Boutique *</label>
                    <input id="store-name" type="text" name="name" required autocomplete="organization" value="<?= htmlspecialchars($user['name'] ?? '') ?>" placeholder="Ex: Dakar High-Tech Store" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                </div>

                <div>
                    <label for="store-username" class="block font-bold text-[#182230] mb-1">Identifiant Unique (Username) *</label>
                    <input id="store-username" type="text" name="username" required autocomplete="username" pattern="^[a-z0-9_-]+$" placeholder="Ex: dakar-hightech" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]" title="Lettres minuscules, chiffres, tirets uniquement">
                </div>

                <div>
                    <label for="store-email" class="block font-bold text-[#182230] mb-1">Email Professionnel *</label>
                    <input id="store-email" type="email" name="email" required autocomplete="email" value="<?= htmlspecialchars($user['email'] ?? '') ?>" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                </div>

                <div>
                    <label for="store-contact" class="block font-bold text-[#182230] mb-1">Téléphone Vendeur (WhatsApp) *</label>
                    <input id="store-contact" type="tel" name="contact" required autocomplete="tel" pattern="^\+221[0-9 ]+$" placeholder="+221 78 131 64 97" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]" title="Doit commencer par +221">
                </div>

                <div class="sm:col-span-2">
                    <label for="store-category" class="block font-bold text-[#182230] mb-1">Catégorie Principale *</label>
                    <select id="store-category" name="category" required class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="Smartphones">Smartphones & Téléphones</option>
                        <option value="Informatique">Ordinateurs & Informatique</option>
                        <option value="Accessoires">Accessoires & Gadgets</option>
                        <option value="Audio">Audio & Son</option>
                        <option value="Jeux Vidéo">Jeux Vidéo & Consoles</option>
                    </select>
                </div>

                <div class="sm:col-span-2">
                    <label for="store-address" class="block font-bold text-[#182230] mb-1">Adresse de la Boutique</label>
                    <input id="store-address" type="text" name="address" autocomplete="street-address" placeholder="Ex: Avenue Cheikh Anta Diop, Dakar" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                </div>

                <div class="sm:col-span-2">
                    <label for="store-description" class="block font-bold text-[#182230] mb-1">Description de la boutique</label>
                    <textarea id="store-description" name="description" rows="4" placeholder="Présentez vos produits et spécialités..." class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]"></textarea>
                </div>
            </div>

            <button type="submit" class="btn-electric w-full text-center py-3 text-xs uppercase tracking-wider font-extrabold mt-4">
                Soumettre ma candidature
            </button>
        </form>

    <?php endif; ?>

</main>

<script>
function previewLogo(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('logo-preview').src = e.target.result;
            document.getElementById('logo-preview').classList.remove('hidden');
            document.getElementById('camera-icon').classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
