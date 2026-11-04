<?php
require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$pdo = getDBConnection();
$error = '';
$success = '';
$token = trim($_GET['token'] ?? $_POST['token'] ?? '');
$validToken = false;
$resetRecord = null;

// 1. Verify token structure
if (empty($token) || strlen($token) < 32 || !ctype_xdigit($token)) {
    $error = "Ce lien de réinitialisation est invalide ou malformé.";
} elseif ($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE token = :token LIMIT 1");
        $stmt->execute([':token' => $token]);
        $resetRecord = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$resetRecord) {
            $error = "Ce lien de réinitialisation n'existe pas ou a été révoqué.";
        } elseif ((int)$resetRecord['is_used'] === 1) {
            $error = "Ce lien a déjà été utilisé pour réinitialiser un mot de passe. Chaque lien est à usage unique strict.";
        } elseif (strtotime($resetRecord['expires_at']) < time()) {
            $error = "Ce lien de réinitialisation a expiré (validité maximale de 15 minutes). Veuillez refaire une demande.";
        } else {
            $validToken = true;
        }
    } catch (Throwable $e) {
        $error = "Une erreur technique est survenue. Veuillez réessayer plus tard.";
    }
} else {
    $error = "Service momentanément indisponible.";
}

// 2. Handle Password Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validToken) {
    $csrf = $_POST['csrf_token'] ?? '';
    $password = $_POST['password'] ?? '';
    $passwordConfirm = $_POST['password_confirm'] ?? '';

    // Anti-Bot Honeypot
    if (!SecurityShield::verifyHoneypot('website_url_hp')) {
        $error = "Requête invalide détectée.";
    }
    // CSRF verification
    elseif (!verifyCSRFToken($csrf)) {
        $error = "Session expirée. Veuillez rafraîchir la page et réessayer.";
    }
    // Password match
    elseif ($password !== $passwordConfirm) {
        $error = "Les deux mots de passe saisis ne sont pas identiques.";
    }
    // Password complexity check
    elseif (strlen($password) < 8) {
        $error = "Pour votre sécurité, le mot de passe doit comporter au moins 8 caractères.";
    } elseif (!preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        $error = "Le mot de passe doit comporter au moins une lettre et un chiffre.";
    } elseif (in_array(strtolower($password), ['12345678', 'password', 'azerty123', 'sentech123', 'passer123', 'motdepasse', 'qwerty123'])) {
        $error = "Ce mot de passe est trop facile à deviner. Choisissez un mot de passe plus robuste.";
    } else {
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Update user's password
            $stmtUpUser = $pdo->prepare("UPDATE users SET password = :pass WHERE id = :uid OR email = :email");
            $stmtUpUser->execute([
                ':pass'  => $hashedPassword,
                ':uid'   => $resetRecord['user_id'],
                ':email' => $resetRecord['email']
            ]);

            // Invalidate current token and any other pending tokens
            $stmtBurn = $pdo->prepare("UPDATE password_resets SET is_used = 1 WHERE email = :email OR token = :token");
            $stmtBurn->execute([
                ':email' => $resetRecord['email'],
                ':token' => $token
            ]);

            // Clear any remember-me tokens
            try {
                $stmtClearRem = $pdo->prepare("UPDATE users SET remember_token = NULL WHERE email = :email");
                $stmtClearRem->execute([':email' => $resetRecord['email']]);
            } catch (Throwable $eRem) {}

            $success = "Votre mot de passe a été modifié avec succès ! Vous pouvez maintenant vous connecter.";
            $validToken = false;
        } catch (Throwable $e) {
            $error = "Erreur lors de la mise à jour du mot de passe : " . $e->getMessage();
        }
    }
}

$pageTitle = "Nouveau Mot de Passe — SenTechPLUS";
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
                <i data-lucide="shield-check" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-black text-[#1D1D1F] tracking-[-0.025em]">Nouveau mot de passe</h1>
            <p class="text-xs text-[#64748B] font-medium leading-relaxed">
                Définissez un mot de passe robuste d'au moins 8 caractères avec lettres et chiffres.
            </p>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-2xl text-xs font-semibold bg-rose-50/90 text-rose-800 border border-rose-200/80 flex items-start gap-2.5 shadow-2xs">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0 mt-0.5"></i>
                <div class="space-y-1.5 flex-1">
                    <p class="leading-relaxed"><?= htmlspecialchars($error) ?></p>
                    <?php if (!$validToken && empty($success)): ?>
                        <a href="forgot-password.php" class="inline-block text-[11px] font-bold text-[#1677FF] hover:underline">
                            Demander un nouveau lien de réinitialisation →
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="p-4 rounded-2xl text-xs bg-emerald-50/90 text-emerald-900 border border-emerald-200/80 space-y-3 text-center shadow-2xs">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                    <i data-lucide="check" class="w-6 h-6"></i>
                </div>
                <p class="text-sm font-bold text-emerald-900 leading-snug">
                    <?= htmlspecialchars($success) ?>
                </p>
                <div class="pt-2">
                    <a href="login.php" class="w-full h-[48px] rounded-2xl bg-[#1677FF] hover:bg-[#0F67E5] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2">
                        <span>Se connecter maintenant</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>
        <?php elseif ($validToken): ?>
            <form method="POST" action="reset-password.php?token=<?= htmlspecialchars($token) ?>" id="auth-reset-form" class="space-y-4 text-xs">
                <?= getCSRFInputField() ?>
                <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
                <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">

                <!-- Nouveau mot de passe -->
                <div class="space-y-1.5 text-left">
                    <label for="reset-pass" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Nouveau mot de passe</label>
                    <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-4 pr-2 h-[52px] transition-all duration-200">
                        <i data-lucide="lock" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                        <input id="reset-pass" type="password" name="password" required placeholder="Min. 8 caractères" autocomplete="new-password" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                        <button type="button" onclick="togglePassword('reset-pass', this)" aria-label="Afficher le mot de passe" class="w-9 h-9 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <!-- Confirmer mot de passe -->
                <div class="space-y-1.5 text-left">
                    <label for="reset-confirm" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Confirmer le nouveau mot de passe</label>
                    <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-4 pr-2 h-[52px] transition-all duration-200">
                        <i data-lucide="check-shield" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                        <input id="reset-confirm" type="password" name="password_confirm" required placeholder="Répéter le mot de passe" autocomplete="new-password" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                        <button type="button" onclick="togglePassword('reset-confirm', this)" aria-label="Afficher le mot de passe" class="w-9 h-9 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <div class="bg-[#F8FAFD] p-3 rounded-2xl border border-[#E8EDF3]/80 text-[11px] text-[#64748B] space-y-1">
                    <p class="font-bold text-[#1D1D1F]">Critères requis :</p>
                    <p>• Au moins 8 caractères</p>
                    <p>• Combinaison de lettres et de chiffres</p>
                </div>

                <button type="submit" id="btn-submit-reset" style="background-color: #1677FF !important; color: #ffffff !important;" class="w-full h-[52px] rounded-2xl bg-[#1677FF] hover:bg-[#0F67E5] active:scale-[0.98] text-white text-sm font-bold shadow-[0_8px_24px_rgba(22,119,255,0.28)] hover:shadow-[0_12px_28px_rgba(22,119,255,0.36)] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-3 group">
                    <span id="btn-reset-text">Enregistrer le nouveau mot de passe</span>
                    <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" id="btn-reset-icon"></i>
                    <div id="btn-reset-spinner" class="hidden w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
            </form>

            <div class="pt-4 border-t border-[#F1F3F7] text-center">
                <a href="login.php" class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#1D1D1F] transition-colors">
                    <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                    <span>Retour à la connexion</span>
                </a>
            </div>
        <?php endif; ?>

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

document.getElementById('auth-reset-form')?.addEventListener('submit', function() {
    const btn = document.getElementById('btn-submit-reset');
    const txt = document.getElementById('btn-reset-text');
    const icon = document.getElementById('btn-reset-icon');
    const spinner = document.getElementById('btn-reset-spinner');
    if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.classList.add('opacity-90', 'cursor-wait');
        if (txt) txt.textContent = 'Mise à jour du mot de passe...';
        if (icon) icon.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    }
});
</script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
