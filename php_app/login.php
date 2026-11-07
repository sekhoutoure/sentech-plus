<?php
require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    $dest = isAdmin() ? 'admin/index.php' : 'account.php';
    header("Location: {$dest}");
    exit;
}

$pdo = getDBConnection();
$error = '';
$rawRedirect = trim((string)($_GET['redirect'] ?? $_POST['redirect'] ?? ''));

// Si aucun paramètre redirect explicite n'a été passé, capturer le HTTP_REFERER pour renvoyer le client sur sa page d'origine
if (empty($rawRedirect) && !empty($_SERVER['HTTP_REFERER'])) {
    $refParsed = parse_url($_SERVER['HTTP_REFERER']);
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (empty($refParsed['host']) || $refParsed['host'] === $host) {
        $refPath = $refParsed['path'] ?? '';
        $refFile = basename($refPath);
        $forbidden = ['login.php', 'register.php', 'logout.php', 'forgot-password.php', 'reset-password.php'];
        if (!in_array($refFile, $forbidden, true) && !empty($refPath)) {
            $rawRedirect = ltrim($refPath, '/') . (!empty($refParsed['query']) ? '?' . $refParsed['query'] : '');
        }
    }
}

$redirect = !empty($rawRedirect) ? getSafeRedirectUrl($rawRedirect, 'customer') : '';

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

            // Redirection Intelligente selon le Rôle et l'Intention Client :
            if (($user['role'] ?? '') === 'admin') {
                // Pour un ADMINISTRATEUR : ouverture DIRECTE du Cockpit Admin
                $reqRedirect = trim((string)($_POST['redirect'] ?? $_GET['redirect'] ?? ''));
                if (!empty($reqRedirect) && (str_contains($reqRedirect, 'admin/') || str_starts_with($reqRedirect, 'admin/'))) {
                    $targetRedirect = getSafeRedirectUrl($reqRedirect, 'admin');
                } else {
                    $targetRedirect = 'admin/index.php';
                }
            } else {
                // Pour un CLIENT : le ramener exactement sur la page où il voulait aller ($redirect)
                $rawTarget = trim((string)($_POST['redirect'] ?? $_GET['redirect'] ?? ''));
                if (!empty($rawTarget) && $rawTarget !== 'index.php') {
                    $targetRedirect = getSafeRedirectUrl($rawTarget, 'customer');
                } else {
                    $targetRedirect = 'account.php';
                }
            }

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

<main id="main-content" class="min-h-[calc(100vh-120px)] flex-1 w-full flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden bg-[#F8FAFD]">

    <!-- Ambient Atmospheric Mesh Glow (Apple / Emil Kowalski) -->
    <div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div class="w-[620px] h-[480px] bg-gradient-to-tr from-[#1677FF]/12 via-[#1677FF]/6 to-transparent rounded-full blur-3xl opacity-75 transform -translate-y-12"></div>
    </div>

    <div class="w-full max-w-[440px] bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-9 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-white/80 space-y-6 transition-all duration-300">
        
        <!-- Apple Segmented Control (Switch Connexion / Inscription) -->
        <div class="p-1 bg-[#F1F3F7] rounded-2xl flex items-center gap-1 border border-[#E5E8EE]">
            <a href="login.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="flex-1 py-2 text-center text-xs font-bold text-[#1D1D1F] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/[0.04] transition-all duration-150">
                Se connecter
            </a>
            <a href="register.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="flex-1 py-2 text-center text-xs font-semibold text-[#64748B] hover:text-[#1D1D1F] rounded-xl transition-all duration-150 hover:bg-white/50 active:scale-[0.98]">
                Créer un compte
            </a>
        </div>

        <!-- Header avec Squircle Apple -->
        <div class="text-center space-y-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#0B57D0] text-white flex items-center justify-center mx-auto mb-3 shadow-[0_10px_25px_rgba(22,119,255,0.32)] ring-4 ring-[#1677FF]/10">
                <i data-lucide="shield-check" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-black text-[#1D1D1F] tracking-[-0.025em]">Bienvenue</h1>
            <p class="text-xs text-[#64748B] font-medium leading-relaxed">Accédez à vos commandes et au suivi express H+2 Dakar</p>
        </div>

        <?php if (isset($_GET['logged_out'])): ?>
            <div class="p-3.5 rounded-2xl text-xs font-semibold bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 flex items-center gap-2.5 shadow-2xs">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                <span>Vous avez été déconnecté avec succès.</span>
            </div>
        <?php endif; ?>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-2xl text-xs font-semibold bg-rose-50/90 text-rose-800 border border-rose-200/80 flex items-start gap-2.5 shadow-2xs">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0 mt-0.5"></i>
                <span class="leading-relaxed"><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" id="auth-login-form" enctype="application/x-www-form-urlencoded" class="space-y-4">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
            <input type="hidden" name="redirect" value="<?= htmlspecialchars($redirect) ?>">

            <!-- Email -->
            <div class="space-y-1.5 text-left">
                <label for="login-email" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Adresse Email</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-4 h-[52px] transition-all duration-200">
                    <i data-lucide="mail" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                    <input id="login-email" type="email" name="email" required placeholder="nom@exemple.com" autocomplete="email" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                </div>
            </div>

            <!-- Mot de passe (Apple Design Ergonomique) -->
            <div class="space-y-1.5 text-left">
                <div class="flex justify-between items-center">
                    <label for="login-password" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Mot de passe</label>
                    <a href="forgot-password.php" class="cursor-pointer text-[12px] font-bold text-[#1677FF] hover:text-[#0F67E5] transition-colors hover:underline">Mot de passe oublié ?</a>
                </div>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-4 pr-2 h-[52px] transition-all duration-200">
                    <i data-lucide="lock" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                    <input id="login-password" type="password" name="password" required placeholder="••••••••" autocomplete="current-password" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    <button type="button" onclick="togglePassword('login-password', this)" aria-label="Afficher ou masquer le mot de passe" class="w-9 h-9 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Bouton Apple Sign In avec état de chargement -->
            <button type="submit" id="btn-submit-login" style="background-color: #1677FF !important; color: #ffffff !important;" class="w-full h-[52px] rounded-2xl bg-[#1677FF] hover:bg-[#0F67E5] active:scale-[0.98] text-white text-sm font-bold shadow-[0_8px_24px_rgba(22,119,255,0.28)] hover:shadow-[0_12px_28px_rgba(22,119,255,0.36)] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-2 group">
                <span id="btn-login-text">Se connecter</span>
                <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" id="btn-login-icon"></i>
                <div id="btn-login-spinner" class="hidden w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
        </form>

        <!-- Sécurité & Micro-engagements -->
        <div class="pt-5 border-t border-[#F1F3F7] space-y-3">
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                    <i data-lucide="lock" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                    <span class="text-[10px] font-bold text-[#475467]">SSL 256-bit</span>
                </div>
                <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                    <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
                    <span class="text-[10px] font-bold text-[#475467]">Livraison H+2</span>
                </div>
                <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                    <i data-lucide="award" class="w-3.5 h-3.5 text-emerald-500"></i>
                    <span class="text-[10px] font-bold text-[#475467]">Garantie 12M</span>
                </div>
            </div>

            <div class="text-center">
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j%27ai%20besoin%20d%27aide%20pour%20me%20connecter" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B] hover:text-[#0D7D53] transition-colors">
                    <i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-500"></i>
                    <span>Besoin d'aide ? Assistance WhatsApp en direct</span>
                </a>
            </div>
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

// Perceived speed submission handler (Emil Kowalski feedback rule)
document.getElementById('auth-login-form')?.addEventListener('submit', function() {
    const btn = document.getElementById('btn-submit-login');
    const txt = document.getElementById('btn-login-text');
    const icon = document.getElementById('btn-login-icon');
    const spinner = document.getElementById('btn-login-spinner');
    if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.classList.add('opacity-90', 'cursor-wait');
        if (txt) txt.textContent = 'Connexion sécurisée en cours...';
        if (icon) icon.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    }
});
</script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
