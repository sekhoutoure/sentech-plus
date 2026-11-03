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
            // Hash password with strong standard algorithm (Bcrypt / PASSWORD_DEFAULT)
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Update user's password
            $stmtUpUser = $pdo->prepare("UPDATE users SET password = :pass WHERE id = :uid OR email = :email");
            $stmtUpUser->execute([
                ':pass'  => $hashedPassword,
                ':uid'   => $resetRecord['user_id'],
                ':email' => $resetRecord['email']
            ]);

            // Invalidate current token (single-use guarantee) and any other pending tokens
            $stmtBurn = $pdo->prepare("UPDATE password_resets SET is_used = 1 WHERE email = :email OR token = :token");
            $stmtBurn->execute([
                ':email' => $resetRecord['email'],
                ':token' => $token
            ]);

            // Clear any remember-me tokens for this user in DB
            try {
                $stmtClearRem = $pdo->prepare("UPDATE users SET remember_token = NULL WHERE email = :email");
                $stmtClearRem->execute([':email' => $resetRecord['email']]);
            } catch (Throwable $eRem) {}

            $success = "Votre mot de passe a été modifié avec succès ! Vous pouvez maintenant vous connecter.";
            $validToken = false; // Hide form on success
        } catch (Throwable $e) {
            $error = "Erreur lors de la mise à jour du mot de passe : " . $e->getMessage();
        }
    }
}

$pageTitle = "Nouveau Mot de Passe — SenTechPLUS";
require_once __DIR__ . '/includes/header.php';
?>

<div class="min-h-[75vh] flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8EDF3] shadow-xl space-y-6">

        <div class="text-center space-y-2">
            <div class="w-14 h-14 bg-[#F3F7FC] text-[#1677FF] rounded-2xl mx-auto flex items-center justify-center border border-[#E8EDF3]">
                <i data-lucide="shield-check" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-black text-[#182230] tracking-tight">Nouveau mot de passe</h1>
            <p class="text-xs text-[#667085] leading-relaxed">
                Définissez un mot de passe robuste d'au moins 8 caractères avec des lettres et des chiffres.
            </p>
        </div>

        <?php if ($error): ?>
            <div class="p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 space-y-2">
                <p class="flex items-center gap-2">
                    <i data-lucide="alert-triangle" class="w-4 h-4 shrink-0 text-rose-600"></i>
                    <span><?= htmlspecialchars($error) ?></span>
                </p>
                <?php if (!$validToken && empty($success)): ?>
                    <div class="pt-2">
                        <a href="forgot-password.php" class="text-xs font-black text-[#1677FF] underline">
                            Demander un nouveau lien de réinitialisation →
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="p-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 space-y-3 text-center">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                    <i data-lucide="check" class="w-6 h-6"></i>
                </div>
                <p class="text-sm font-black text-emerald-900">
                    <?= htmlspecialchars($success) ?>
                </p>
                <div class="pt-2">
                    <a href="login.php" class="btn-electric inline-block w-full text-center py-3 text-xs uppercase tracking-wider font-extrabold cursor-pointer">
                        Se connecter maintenant →
                    </a>
                </div>
            </div>
        <?php elseif ($validToken): ?>
            <form method="POST" action="reset-password.php?token=<?= htmlspecialchars($token) ?>" class="space-y-4 text-xs">
                <?= getCSRFInputField() ?>
                <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
                <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">

                <div>
                    <label for="reset-pass" class="block font-bold text-[#182230] mb-1">Nouveau mot de passe</label>
                    <div class="relative">
                        <input id="reset-pass" type="password" name="password" required placeholder="Min. 8 caractères (lettres + chiffres)" autocomplete="new-password" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/20">
                        <button type="button" onclick="togglePassword('reset-pass', this)" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#667085] hover:text-[#182230]">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label for="reset-confirm" class="block font-bold text-[#182230] mb-1">Confirmer le nouveau mot de passe</label>
                    <div class="relative">
                        <input id="reset-confirm" type="password" name="password_confirm" required placeholder="Répéter le mot de passe" autocomplete="new-password" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium text-[#182230] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/20">
                        <button type="button" onclick="togglePassword('reset-confirm', this)" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#667085] hover:text-[#182230]">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <div class="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-[11px] text-[#64748B] space-y-1">
                    <p class="font-bold text-[#334155]">Exigences de sécurité :</p>
                    <p>• Au moins 8 caractères</p>
                    <p>• Combinaison de lettres et de chiffres</p>
                    <p>• Pas de suites évidentes (ex: 12345678)</p>
                </div>

                <button type="submit" class="btn-electric w-full text-center py-3 text-xs uppercase tracking-wider font-extrabold cursor-pointer focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1677FF] transition-all duration-200">
                    Enregistrer le nouveau mot de passe →
                </button>
            </form>
        <?php endif; ?>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
