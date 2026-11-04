<?php
require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$pdo = getDBConnection();
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrf = $_POST['csrf_token'] ?? '';
    $email = strtolower(trim($_POST['email'] ?? ''));

    // 0. Anti-Bot Honeypot
    if (!SecurityShield::verifyHoneypot('website_url_hp')) {
        $error = "Requête invalide détectée.";
    }
    // 1. Rate Limiting Check (max 4 requests per 15 minutes per IP)
    elseif (!checkRateLimit('forgot_password', 4, 900)) {
        $remainingMin = getRateLimitRemainingMinutes('forgot_password', 900);
        $error = "Trop de demandes de réinitialisation. Veuillez patienter {$remainingMin} minute(s) avant de réessayer.";
    }
    // 2. CSRF Verification
    elseif (!verifyCSRFToken($csrf)) {
        $error = "Session expirée. Veuillez recharger la page et réessayer.";
    }
    // 3. Email validation
    elseif (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Veuillez saisir une adresse email valide.";
    } else {
        recordFailedAttempt('forgot_password', 900);

        // Anti-enumeration: verify user silently
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE email = :email LIMIT 1");
                $stmt->execute([':email' => $email]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user) {
                    // Generate 64-char cryptographically secure token
                    $token = bin2hex(random_bytes(32));

                    // Invalidate previous unused tokens for this email
                    $stmtInv = $pdo->prepare("UPDATE password_resets SET is_used = 1 WHERE email = :email AND is_used = 0");
                    $stmtInv->execute([':email' => $email]);

                    // Insert fresh token with 15-minute expiration
                    $stmtIns = $pdo->prepare("INSERT INTO password_resets (user_id, email, token, is_used, expires_at, created_at) VALUES (:uid, :email, :token, 0, DATE_ADD(NOW(), INTERVAL 15 MINUTE), NOW())");
                    $stmtIns->execute([
                        ':uid'   => (string)$user['id'],
                        ':email' => $user['email'],
                        ':token' => $token
                    ]);

                    // Dispatch password reset email
                    require_once __DIR__ . '/includes/email_service.php';
                    EmailService::sendPasswordResetEmail($user['email'], $user['name'] ?? 'Client', $token);
                }
            } catch (Throwable $e) {
                error_log("Password reset error: " . $e->getMessage());
            }
        }

        // Always show the same reassuring success message to prevent user enumeration
        $success = "Si un compte est associé à cette adresse email, un lien sécurisé vous a été envoyé. Vérifiez votre boîte de réception et vos courriers indésirables (spams).";
    }
}

$pageTitle = "Mot de passe oublié — SenTechPLUS";
$layoutType = 'auth';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="min-h-[calc(100vh-120px)] flex-1 w-full flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden bg-[#F8FAFD]">

    <!-- Ambient Atmospheric Mesh Glow -->
    <div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div class="w-[620px] h-[480px] bg-gradient-to-tr from-[#1677FF]/12 via-[#1677FF]/6 to-transparent rounded-full blur-3xl opacity-75 transform -translate-y-12"></div>
    </div>

    <div class="w-full max-w-[440px] bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-9 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-white/80 space-y-6 transition-all duration-300">

        <!-- Header avec Squircle Apple -->
        <div class="text-center space-y-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#0B57D0] text-white flex items-center justify-center mx-auto mb-3 shadow-[0_10px_25px_rgba(22,119,255,0.32)] ring-4 ring-[#1677FF]/10">
                <i data-lucide="key-round" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-black text-[#1D1D1F] tracking-[-0.025em]">Récupération</h1>
            <p class="text-xs text-[#64748B] font-medium leading-relaxed">
                Entrez votre adresse email pour recevoir un lien d'accès sécurisé valable 15 minutes.
            </p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-2xl text-xs font-semibold bg-rose-50/90 text-rose-800 border border-rose-200/80 flex items-start gap-2.5 shadow-2xs">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0 mt-0.5"></i>
                <span class="leading-relaxed"><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="p-4 rounded-2xl text-xs bg-emerald-50/90 text-emerald-900 border border-emerald-200/80 space-y-2 shadow-2xs">
                <p class="flex items-center gap-2 font-bold text-emerald-900">
                    <i data-lucide="check-circle" class="w-4 h-4 shrink-0 text-emerald-600"></i>
                    <span>Lien sécurisé envoyé</span>
                </p>
                <p class="font-normal text-emerald-700 leading-relaxed text-[12px]">
                    <?= htmlspecialchars($success) ?>
                </p>
            </div>
            <div class="pt-2 text-center">
                <a href="login.php" class="inline-flex items-center gap-2 text-xs font-bold text-[#1677FF] hover:text-[#0F67E5] transition-colors py-2 px-4 rounded-xl hover:bg-[#F0F6FF]">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    <span>Retourner à la connexion</span>
                </a>
            </div>
        <?php else: ?>
            <form method="POST" action="forgot-password.php" id="auth-fp-form" class="space-y-4 text-xs">
                <?= getCSRFInputField() ?>
                <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>

                <!-- Email -->
                <div class="space-y-1.5 text-left">
                    <label for="fp-email" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Votre Adresse Email</label>
                    <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-4 h-[52px] transition-all duration-200">
                        <i data-lucide="mail" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                        <input id="fp-email" type="email" name="email" required placeholder="nom@exemple.com" autocomplete="email" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    </div>
                </div>

                <button type="submit" id="btn-submit-fp" style="background-color: #1677FF !important; color: #ffffff !important;" class="w-full h-[52px] rounded-2xl bg-[#1677FF] hover:bg-[#0F67E5] active:scale-[0.98] text-white text-sm font-bold shadow-[0_8px_24px_rgba(22,119,255,0.28)] hover:shadow-[0_12px_28px_rgba(22,119,255,0.36)] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-3 group">
                    <span id="btn-fp-text">Envoyer le lien sécurisé</span>
                    <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" id="btn-fp-icon"></i>
                    <div id="btn-fp-spinner" class="hidden w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
            </form>

            <div class="pt-4 border-t border-[#F1F3F7] text-center">
                <a href="login.php" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1D1D1F] transition-colors">
                    <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                    <span>Retour à la connexion</span>
                </a>
            </div>
        <?php endif; ?>

        <!-- Micro badges de sécurité -->
        <div class="grid grid-cols-3 gap-2 text-center pt-2">
            <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                <i data-lucide="lock" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                <span class="text-[10px] font-bold text-[#475467]">SSL 256-bit</span>
            </div>
            <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-500"></i>
                <span class="text-[10px] font-bold text-[#475467]">15 Minutes</span>
            </div>
            <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                <i data-lucide="shield" class="w-3.5 h-3.5 text-emerald-500"></i>
                <span class="text-[10px] font-bold text-[#475467]">Anti-Brute</span>
            </div>
        </div>

    </div>

</main>

<script>
document.getElementById('auth-fp-form')?.addEventListener('submit', function() {
    const btn = document.getElementById('btn-submit-fp');
    const txt = document.getElementById('btn-fp-text');
    const icon = document.getElementById('btn-fp-icon');
    const spinner = document.getElementById('btn-fp-spinner');
    if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.classList.add('opacity-90', 'cursor-wait');
        if (txt) txt.textContent = 'Génération du lien sécurisé...';
        if (icon) icon.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    }
});
</script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
