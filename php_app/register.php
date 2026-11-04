<?php
require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$pdo = getDBConnection();
$error = '';
$rawRedirect = $_GET['redirect'] ?? $_POST['redirect'] ?? '';
$redirect = getSafeRedirectUrl($rawRedirect, 'customer');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrf = $_POST['csrf_token'] ?? '';
    $name = sanitize($_POST['name'] ?? '');
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    $passwordConfirm = $_POST['password_confirm'] ?? '';

    // 0. Anti-Bot Honeypot
    if (!SecurityShield::verifyHoneypot('website_url_hp')) {
        $error = "Requête invalide détectée.";
    }
    // 1. Rate Limiting Check (5 registrations per 15 minutes)
    elseif (!checkRateLimit('register', 5, 900)) {
        $remainingMin = getRateLimitRemainingMinutes('register', 900);
        $error = "Trop de tentatives d'inscription. Veuillez patienter {$remainingMin} minute(s) avant de réessayer.";
    }
    // 2. CSRF Verification
    elseif (!verifyCSRFToken($csrf)) {
        $error = "Session de formulaire expirée. Veuillez recharger la page et réessayer.";
    }
    // 3. Input Validation
    elseif (empty($name) || empty($email) || empty($password)) {
        $error = "Veuillez remplir tous les champs obligatoires.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Format d'adresse email invalide.";
    } elseif (mb_strlen($name) < 2) {
        $error = "Le nom doit comporter au moins 2 caractères.";
    } elseif ($password !== $passwordConfirm) {
        $error = "Les mots de passe ne correspondent pas.";
    } elseif (strlen($password) < 8) {
        $error = "Pour votre sécurité, le mot de passe doit comporter au moins 8 caractères.";
    } elseif (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $error = "Le mot de passe doit comporter au moins une lettre et un chiffre.";
    } elseif (in_array(strtolower($password), ['12345678', 'password', 'azerty123', 'sentech123', 'passer123', 'motdepasse', 'qwerty123'])) {
        $error = "Ce mot de passe est trop facile à deviner. Choisissez un mot de passe plus robuste.";
    } else {
        // Check email uniqueness if DB connected
        $emailExists = false;
        if ($pdo) {
            try {
                $stmtCheck = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
                $stmtCheck->execute([':email' => $email]);
                if ($stmtCheck->fetch()) {
                    $emailExists = true;
                }
            } catch (Throwable $e) {}
        }

        if ($emailExists) {
            recordFailedAttempt('register', 900);
            $error = "Cette adresse email est déjà associée à un compte.";
        } else {
            $userId = 'user_' . bin2hex(random_bytes(8));
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $verificationToken = bin2hex(random_bytes(16));
            
            if ($pdo) {
                try {
                    $stmtInsert = $pdo->prepare("INSERT INTO users (id, name, email, password, role, image, email_verified, is_email_verified, verification_token) VALUES (:id, :name, :email, :pass, 'customer', 'assets/images/profile_pic1.webp', NOW(), 1, :token)");
                    $stmtInsert->execute([
                        ':id'    => $userId,
                        ':name'  => $name,
                        ':email' => $email,
                        ':pass'  => $hash,
                        ':token' => $verificationToken
                    ]);
                } catch (Throwable $e) {
                    // Fallback to basic schema if optional columns don't exist
                    try {
                        $stmtInsert = $pdo->prepare("INSERT INTO users (id, name, email, password, role, image) VALUES (:id, :name, :email, :pass, 'user', 'assets/images/profile_pic1.webp')");
                        $stmtInsert->execute([
                            ':id'    => $userId,
                            ':name'  => $name,
                            ':email' => $email,
                            ':pass'  => $hash
                        ]);
                    } catch (Throwable $e2) {}
                }
            }


            clearRateLimit('register');
            $_SESSION['user_id'] = $userId;
            $_SESSION['user'] = [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'role' => 'customer',
                'image' => 'assets/images/profile_pic1.webp',
                'is_email_verified' => true
            ];

            // Initialisation de l'empreinte de sécurité et rotation de session
            SecurityShield::initSessionSecurity($_SESSION['user']);
            SecurityShield::logSecurityEvent('USER_REGISTER', "Nouveau compte créé pour {$email}");

            setFlashMessage('success', "Bienvenue sur SenTechPLUS, {$name} ! Votre compte a été créé avec succès.");
            $targetRedirect = !empty($redirect) ? $redirect : 'account.php';
            header('Location: ' . $targetRedirect);
            exit;
        }
    }
}

$pageTitle = "Inscription Nouveau Client";
$layoutType = 'auth';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[440px] mx-auto px-4 py-8 sm:py-14 flex-1 w-full flex items-center justify-center">

    <div class="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-[#E8EDF3] space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-1.5">
            <div class="w-12 h-12 rounded-2xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <i data-lucide="user-plus" class="w-6 h-6"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight">Créer un compte</h1>
            <p class="text-xs text-[#86868B] font-medium">Rejoignez SenTechPLUS pour commander facilement</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600 shrink-0"></i>
                <span><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="register.php" enctype="application/x-www-form-urlencoded" class="space-y-4">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
            <input type="hidden" name="redirect" value="<?= htmlspecialchars($redirect) ?>">

            <!-- Nom & Prénom -->
            <div class="space-y-1.5 text-left">
                <label for="reg-name" class="block text-xs font-bold text-[#1D1D1F]">Nom complet *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EBEBF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/20 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-3.5 h-[48px] transition-all">
                    <i data-lucide="user" class="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0"></i>
                    <input id="reg-name" type="text" name="name" required minlength="2" autocomplete="name" placeholder="Ex: Moussa Diop" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                </div>
            </div>

            <!-- Email -->
            <div class="space-y-1.5 text-left">
                <label for="reg-email" class="block text-xs font-bold text-[#1D1D1F]">Adresse Email *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EBEBF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/20 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-3.5 h-[48px] transition-all">
                    <i data-lucide="mail" class="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0"></i>
                    <input id="reg-email" type="email" name="email" required autocomplete="email" placeholder="nom@exemple.com" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                </div>
            </div>

            <!-- Mot de passe (Apple Design Ergonomique) -->
            <div class="space-y-1.5 text-left">
                <label for="reg-password" class="block text-xs font-bold text-[#1D1D1F]">Mot de passe *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EBEBF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/20 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-3.5 pr-2 h-[48px] transition-all">
                    <i data-lucide="lock" class="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0"></i>
                    <input id="reg-password" type="password" name="password" required minlength="8" autocomplete="new-password" placeholder="8+ caractères (lettres & chiffres)" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    <button type="button" onclick="togglePassword('reg-password', this)" aria-label="Afficher le mot de passe" class="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Confirmation Mot de passe -->
            <div class="space-y-1.5 text-left">
                <label for="reg-password-confirm" class="block text-xs font-bold text-[#1D1D1F]">Confirmer le mot de passe *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EBEBF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/20 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-3.5 pr-2 h-[48px] transition-all">
                    <i data-lucide="check-shield" class="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0"></i>
                    <input id="reg-password-confirm" type="password" name="password_confirm" required minlength="8" autocomplete="new-password" placeholder="Répétez le mot de passe" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    <button type="button" onclick="togglePassword('reg-password-confirm', this)" aria-label="Afficher le mot de passe" class="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Conditions -->
            <div class="pt-1">
                <label class="flex items-center gap-2.5 cursor-pointer text-[#1D1D1F] text-xs font-medium">
                    <input type="checkbox" name="accept_cgu" required class="w-4 h-4 text-[#1677FF] border-[#D1D1D6] rounded-md focus:ring-[#1677FF]">
                    <span>J'accepte les <a href="contact.php" class="cursor-pointer text-[#1677FF] hover:underline font-bold">Conditions Générales</a></span>
                </label>
            </div>

            <!-- Bouton Apple Sign Up -->
            <button type="submit" class="btn-apple-primary text-xs sm:text-sm mt-3" style="background-color: #1677FF !important; color: #ffffff !important; min-height: 48px; border-radius: 16px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>Créer mon compte</span>
                <i data-lucide="arrow-right" class="w-4 h-4 text-white"></i>
            </button>
        </form>

        <div class="pt-4 border-t border-[#F2F2F7] text-center text-xs text-[#86868B]">
            Vous avez déjà un compte ? 
            <a href="login.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="cursor-pointer font-bold text-[#1677FF] hover:text-[#0077ED] transition-colors hover:underline">Se connecter</a>
        </div>
    </div>

</main>

<script>
function togglePassword(id, btn) {
    const input = document.getElementById(id);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword 
        ? '<i data-lucide="eye-off" class="w-4 h-4"></i>' 
        : '<i data-lucide="eye" class="w-4 h-4"></i>';
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root: btn, skipHidden: false });
    }
}
</script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
