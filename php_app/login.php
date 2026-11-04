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

<main id="main-content" class="max-w-[420px] mx-auto px-4 py-8 sm:py-14 flex-1 w-full flex items-center justify-center">

    <div class="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-[#E8EDF3] space-y-6">
        
        <!-- Header -->
        <div class="text-center space-y-1.5">
            <div class="w-12 h-12 rounded-2xl bg-[#F0F6FF] text-[#1677FF] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <i data-lucide="user" class="w-6 h-6"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight">Connexion Client</h1>
            <p class="text-xs text-[#86868B] font-medium">Accédez à votre espace SenTechPLUS</p>
        </div>

        <?php if (isset($_GET['logged_out'])): ?>
            <div class="p-3.5 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                <span>Vous avez été déconnecté avec succès.</span>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                <i data-lucide="alert-circle" class="w-4 h-4 text-rose-600 shrink-0"></i>
                <span><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" enctype="application/x-www-form-urlencoded" class="space-y-4">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
            <input type="hidden" name="redirect" value="<?= htmlspecialchars($redirect) ?>">

            <!-- Email -->
            <div class="space-y-1.5 text-left">
                <label for="login-email" class="block text-xs font-bold text-[#1D1D1F]">Adresse Email</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EBEBF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/20 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-3.5 h-[48px] transition-all">
                    <i data-lucide="mail" class="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0"></i>
                    <input id="login-email" type="email" name="email" required placeholder="nom@exemple.com" autocomplete="email" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                </div>
            </div>

            <!-- Password (Apple Design Ergonomique) -->
            <div class="space-y-1.5 text-left">
                <div class="flex justify-between items-center">
                    <label for="login-password" class="block text-xs font-bold text-[#1D1D1F]">Mot de passe</label>
                    <a href="forgot-password.php" class="cursor-pointer text-[11px] font-bold text-[#1677FF] hover:text-[#0077ED] transition-colors hover:underline">Oublié ?</a>
                </div>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EBEBF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1677FF]/20 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-3.5 pr-2 h-[48px] transition-all">
                    <i data-lucide="lock" class="w-4 h-4 text-[#8E8E93] mr-2.5 shrink-0"></i>
                    <input id="login-password" type="password" name="password" required placeholder="••••••••" autocomplete="current-password" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    <button type="button" onclick="togglePassword('login-password', this)" aria-label="Afficher le mot de passe" class="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Bouton Apple Sign In -->
            <button type="submit" class="btn-apple-primary text-xs sm:text-sm mt-3" style="background-color: #1677FF !important; color: #ffffff !important; min-height: 48px; border-radius: 16px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>Se connecter</span>
                <i data-lucide="arrow-right" class="w-4 h-4 text-white"></i>
            </button>
        </form>

        <div class="pt-4 border-t border-[#F2F2F7] text-center text-xs text-[#86868B]">
            Pas encore de compte ? 
            <a href="register.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="cursor-pointer font-bold text-[#1677FF] hover:text-[#0077ED] transition-colors hover:underline">Créer un compte</a>
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
