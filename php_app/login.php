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
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    $csrf = $_POST['csrf_token'] ?? '';

    // 0. Anti-Bot Honeypot
    if (!SecurityShield::verifyHoneypot('website_url_hp')) {
        $error = "Requête invalide détectée.";
    }
    // 1. Dual Rate Limiting Check (IP + Email cible)
    elseif (!checkRateLimit('login', 5, 900) || (!empty($email) && !checkRateLimit('login_user', 5, 900, $email))) {
        $remainingMin = max(
            getRateLimitRemainingMinutes('login', 900),
            !empty($email) ? getRateLimitRemainingMinutes('login_user', 900, $email) : 0
        );
        $error = "Trop de tentatives de connexion échouées. Par mesure de sécurité, l'accès est temporairement suspendu pour {$remainingMin} minute(s).";
    } 
    // 2. CSRF Token Verification
    elseif (!verifyCSRFToken($csrf)) {
        recordFailedAttempt('login', 900);
        SecurityShield::logSecurityEvent('CSRF_FAILURE', "Jeton CSRF invalide sur login.php pour email {$email}");
        $error = "Votre session a expiré. Veuillez rafraîchir la page et soumettre à nouveau le formulaire.";
    } 

    // 3. Input Validation
    elseif (empty($email) || empty($password)) {
        $error = "Veuillez renseigner votre email et mot de passe.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Format d'adresse email invalide.";
    } else {
        $user = null;
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => $email]);
                $user = $stmt->fetch();
            } catch (Throwable $e) {
                $user = null;
            }
        }

        if ($user && !empty($user['password']) && password_verify($password, $user['password'])) {
            // Success: Clear rate limiters and initialize airtight session fingerprinting
            clearRateLimit('login');
            clearRateLimit('login_user', $email);
            SecurityShield::rotateSession(); // Anti-Fixation session regeneration

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'image' => $user['image'] ?? 'assets/images/profile_pic1.webp',
                'is_email_verified' => (bool)($user['is_email_verified'] ?? 1)
            ];

            // If seller, fetch store ID
            if ($pdo && ($user['role'] === 'seller' || $user['role'] === 'admin')) {
                try {
                    $stmtStore = $pdo->prepare("SELECT id FROM stores WHERE user_id = :uid LIMIT 1");
                    $stmtStore->execute([':uid' => $user['id']]);
                    $st = $stmtStore->fetch();
                    if ($st) {
                        $_SESSION['user']['store_id'] = $st['id'];
                    }
                } catch (Throwable $e) {}
            }

            // Initialisation de la sécurité de session (Anti-Session Hijacking & Anti-Fixation)
            SecurityShield::initSessionSecurity($_SESSION['user']);

            SecurityShield::logSecurityEvent('AUTH_SUCCESS', "Connexion réussie pour {$email}", ['role' => $user['role']]);

            $targetRedirect = getSafeRedirectUrl($_POST['redirect'] ?? $_GET['redirect'] ?? '', $user['role'] ?? 'customer');
            header('Location: ' . $targetRedirect);
            exit;
        } else {
            // Failure: Record failed attempts on IP and targeted account
            $attemptsIp = recordFailedAttempt('login', 900);
            $attemptsUser = recordFailedAttempt('login_user', 900, $email);
            $maxAttempts = max($attemptsIp, $attemptsUser);
            $remaining = max(0, 5 - $maxAttempts);

            SecurityShield::logSecurityEvent('AUTH_FAILURE', "Échec de connexion pour {$email} (Essai {$maxAttempts}/5)");

            if ($remaining > 0) {
                $error = "Identifiants incorrects (adresse email ou mot de passe invalide). Il vous reste {$remaining} essai(s).";
            } else {
                $error = "Trop de tentatives échouées. Par mesure de sécurité, l'accès est bloqué pour 15 minutes.";
            }
        }
    }
}

$pageTitle = "Connexion Espace Client";
$layoutType = 'auth';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[480px] mx-auto px-4 py-12 flex-1 w-full">

    <div class="card-clean p-6 sm:p-8 space-y-6">
        <div class="text-center space-y-2">
            <h1 class="text-2xl font-extrabold text-[#182230] tracking-tight">Connexion Client</h1>
            <p class="text-xs text-[#667085]">Accédez à vos commandes et avantages SenTechPLUS.</p>
        </div>

        <?php if (isset($_GET['logged_out'])): ?>
            <div class="p-3.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                <span>Vous avez été déconnecté avec succès. À bientôt sur SenTechPLUS !</span>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" enctype="application/x-www-form-urlencoded" class="space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
            <input type="hidden" name="redirect" value="<?= htmlspecialchars($redirect) ?>">

            <div>
                <label for="login-email" class="block font-bold text-[#182230] mb-1">Adresse Email</label>
                <input id="login-email" type="email" name="email" required placeholder="nom@exemple.com" autocomplete="email" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
            </div>

            <div>
                <div class="flex justify-between items-center mb-1">
                    <label for="login-password" class="block font-bold text-[#182230]">Mot de passe</label>
                    <a href="forgot-password.php" class="cursor-pointer text-[11px] font-bold text-[#1677FF] hover:text-[#0B54C2] transition-colors duration-200 hover:underline">Mot de passe oublié ?</a>
                </div>
                <div class="relative">
                    <input id="login-password" type="password" name="password" required placeholder="••••••••" autocomplete="current-password" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF]">
                    <button type="button" onclick="togglePassword('login-password', this)" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#667085] hover:text-[#182230] transition-colors duration-200">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <button type="submit" class="btn-electric w-full text-center py-3 text-xs uppercase tracking-wider font-extrabold cursor-pointer focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1677FF] transition-colors duration-200">
                Se Connecter →
            </button>
        </form>

        <div class="flex flex-wrap justify-center gap-4 text-[11px] font-bold text-[#667085] py-2">
            <span>🔒 Paiement Sécurisé</span>
            <span>✅ 100% Original</span>
            <span>🚚 Livraison Dakar</span>
        </div>

        <div class="pt-4 border-t border-[#E8EDF3] text-center text-xs text-[#667085]">
            Vous n'avez pas encore de compte ? 
            <a href="register.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="cursor-pointer font-bold text-[#1677FF] hover:text-[#0B54C2] transition-colors duration-200 hover:underline">Créer un compte</a>
        </div>
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
