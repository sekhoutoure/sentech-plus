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
        $success = "Si un compte est associé à cette adresse email, un lien sécurisé vous a été envoyé. Vérifiez votre boîte de réception et vos spams.";
    }
}

$pageTitle = "Mot de passe oublié — SenTechPLUS";
require_once __DIR__ . '/includes/header.php';
?>

<div class="min-h-[75vh] flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8EDF3] shadow-xl space-y-6">

        <div class="text-center space-y-2">
            <div class="w-14 h-14 bg-[#F3F7FC] text-[#1677FF] rounded-2xl mx-auto flex items-center justify-center border border-[#E8EDF3]">
                <i data-lucide="key-round" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-black text-[#182230] tracking-tight">Mot de passe oublié ?</h1>
            <p class="text-xs text-[#667085] leading-relaxed">
                Entrez l'adresse email associée à votre compte SenTechPLUS. Nous vous enverrons un lien à usage unique valable 15 minutes.
            </p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="p-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 space-y-2">
                <p class="flex items-center gap-2 text-emerald-900">
                    <i data-lucide="check-circle" class="w-4 h-4 shrink-0 text-emerald-600"></i>
                    <span>Demande prise en compte</span>
                </p>
                <p class="font-normal text-emerald-700 leading-relaxed">
                    <?= htmlspecialchars($success) ?>
                </p>
            </div>
            <div class="pt-2 text-center">
                <a href="login.php" class="inline-flex items-center gap-2 text-xs font-bold text-[#1677FF] hover:underline cursor-pointer">
                    ← Retourner à la connexion
                </a>
            </div>
        <?php else: ?>
            <form method="POST" action="forgot-password.php" class="space-y-4 text-xs">
                <?= getCSRFInputField() ?>
                <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>

                <div>
                    <label for="fp-email" class="block font-bold text-[#182230] mb-1">Votre Adresse Email</label>
                    <input id="fp-email" type="email" name="email" required placeholder="nom@exemple.com" autocomplete="email" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/20">
                </div>

                <button type="submit" class="btn-electric w-full text-center py-3 text-xs uppercase tracking-wider font-extrabold cursor-pointer focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1677FF] transition-all duration-200">
                    Envoyer le lien sécurisé →
                </button>
            </form>

            <div class="pt-2 text-center border-t border-[#F1F5F9]">
                <a href="login.php" class="cursor-pointer text-xs font-bold text-[#667085] hover:text-[#182230] transition-colors duration-200">
                    ← Retour à la connexion
                </a>
            </div>
        <?php endif; ?>

        <div class="flex flex-wrap justify-center gap-4 text-[11px] font-bold text-[#667085] pt-2">
            <span>🔒 Protection SSL 256-bit</span>
            <span>⏱️ Lien 15 minutes</span>
            <span>🛡️ Anti-Brute Force</span>
        </div>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
