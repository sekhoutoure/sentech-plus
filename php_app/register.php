<?php
require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$pdo = getDBConnection();
$error = '';

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
                    $stmtInsert = $pdo->prepare("INSERT INTO users (id, name, email, password, role, image, email_verified, is_email_verified, verification_token) VALUES (:id, :name, :email, :pass, 'user', 'assets/images/profile_pic1.webp', NOW(), 1, :token)");
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
            header('Location: index.php');
            exit;
        }
    }
}

$pageTitle = "Inscription Nouveau Client";
$layoutType = 'auth';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[480px] mx-auto px-4 py-12 flex-1 w-full">

    <div class="card-clean overflow-hidden">
        <div class="bg-[#1677FF] py-5 px-4 flex justify-center items-center mb-6">
            <span class="text-white text-xl font-extrabold tracking-wider">SenTechPLUS</span>
        </div>
        
        <div class="px-6 sm:px-8 pb-6 sm:pb-8 space-y-6">
            <div class="text-center space-y-2">
            <h1 class="text-2xl font-extrabold text-[#182230] tracking-tight">Créer un compte</h1>
            <p class="text-xs text-[#667085]">Rejoignez SenTechPLUS pour suivre vos commandes à Dakar.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="register.php" enctype="application/x-www-form-urlencoded" class="space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>

            <div>
                <label for="reg-name" class="block font-bold text-[#182230] mb-1">Nom et Prénom *</label>
                <input id="reg-name" type="text" name="name" required minlength="3" autocomplete="name" placeholder="Prénom Nom" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
            </div>

            <div>
                <label for="reg-email" class="block font-bold text-[#182230] mb-1">Adresse Email *</label>
                <input id="reg-email" type="email" name="email" required autocomplete="email" placeholder="nom@exemple.com" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
            </div>

            <div>
                <label for="reg-password" class="block font-bold text-[#182230] mb-1">Mot de passe *</label>
                <div class="relative">
                    <input id="reg-password" type="password" name="password" required autocomplete="new-password" placeholder="••••••••" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                    <button type="button" onclick="togglePassword('reg-password', this)" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#667085] hover:text-[#182230] transition-colors duration-200">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div>
                <label for="reg-password-confirm" class="block font-bold text-[#182230] mb-1">Confirmer le mot de passe *</label>
                <div class="relative">
                    <input id="reg-password-confirm" type="password" name="password_confirm" required autocomplete="new-password" placeholder="••••••••" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                    <button type="button" onclick="togglePassword('reg-password-confirm', this)" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#667085] hover:text-[#182230] transition-colors duration-200">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div>
                <label class="flex items-center gap-2 cursor-pointer text-[#182230] font-medium">
                    <input type="checkbox" name="accept_cgu" required class="w-4 h-4 text-[#1677FF] border-[#E8EDF3] rounded focus:ring-[#1677FF]">
                    <span>J'accepte les <a href="contact.php" class="cursor-pointer text-[#1677FF] hover:text-[#0B54C2] transition-colors duration-200 hover:underline font-bold">Conditions Générales</a></span>
                </label>
            </div>

            <button type="submit" class="btn-electric w-full text-center py-3 text-xs uppercase tracking-wider font-extrabold cursor-pointer focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1677FF] transition-colors duration-200">
                S'inscrire maintenant →
            </button>
        </form>

        <div class="flex flex-wrap justify-center gap-4 text-[11px] font-bold text-[#667085] py-2">
            <span>🔒 Paiement Sécurisé</span>
            <span>✅ 100% Original</span>
            <span>🚚 Livraison Dakar</span>
        </div>

        <div class="pt-4 border-t border-[#E8EDF3] text-center text-xs text-[#667085]">
            Vous avez déjà un compte ? 
            <a href="login.php" class="cursor-pointer font-bold text-[#1677FF] hover:text-[#0B54C2] transition-colors duration-200 hover:underline">Se connecter</a>
        </div>
    </div>

        </div> <!-- End of inner padding container -->
    </div>

</main>

<script>
function togglePassword(id, btn) {
    const i = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (i.type === 'password') {
        i.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        i.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
