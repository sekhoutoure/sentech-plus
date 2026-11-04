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

<main id="main-content" class="min-h-[calc(100vh-120px)] flex-1 w-full flex items-center justify-center px-4 py-10 sm:py-16 relative overflow-hidden bg-[#F8FAFD]">

    <!-- Ambient Atmospheric Mesh Glow (Apple / Emil Kowalski) -->
    <div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div class="w-[660px] h-[520px] bg-gradient-to-tr from-[#1677FF]/12 via-[#1677FF]/6 to-transparent rounded-full blur-3xl opacity-75 transform -translate-y-12"></div>
    </div>

    <div class="w-full max-w-[460px] bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-9 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.08),0_1px_2px_rgba(0,0,0,0.04)] border border-white/80 space-y-6 transition-all duration-300">
        
        <!-- Apple Segmented Control (Switch Connexion / Inscription) -->
        <div class="p-1 bg-[#F1F3F7] rounded-2xl flex items-center gap-1 border border-[#E5E8EE]">
            <a href="login.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="flex-1 py-2 text-center text-xs font-semibold text-[#64748B] hover:text-[#1D1D1F] rounded-xl transition-all duration-150 hover:bg-white/50 active:scale-[0.98]">
                Se connecter
            </a>
            <a href="register.php<?= (!empty($redirect) && $redirect !== 'account.php') ? '?redirect=' . urlencode($redirect) : '' ?>" class="flex-1 py-2 text-center text-xs font-bold text-[#1D1D1F] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/[0.04] transition-all duration-150">
                Créer un compte
            </a>
        </div>

        <!-- Header avec Squircle Apple -->
        <div class="text-center space-y-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#0B57D0] text-white flex items-center justify-center mx-auto mb-3 shadow-[0_10px_25px_rgba(22,119,255,0.32)] ring-4 ring-[#1677FF]/10">
                <i data-lucide="user-plus" class="w-7 h-7"></i>
            </div>
            <h1 class="text-2xl font-black text-[#1D1D1F] tracking-[-0.025em]">Créer un compte</h1>
            <p class="text-xs text-[#64748B] font-medium leading-relaxed">Rejoignez le comptoir High-Tech officiel à Dakar</p>
        </div>

        <!-- Incentive Bienvenue VIP Wave -->
        <div class="p-3 rounded-2xl bg-gradient-to-r from-[#1677FF]/8 via-[#1677FF]/4 to-transparent border border-[#1677FF]/20 flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#1677FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <i data-lucide="gift" class="w-4 h-4"></i>
            </div>
            <div class="text-left text-xs">
                <p class="font-bold text-[#1D1D1F]">Offre de Bienvenue Immédiate</p>
                <p class="text-[#64748B] text-[11px]">Câble blindé 100W GaN offert sur votre 1ère commande</p>
            </div>
        </div>

        <?php if ($error): ?>
            <div class="p-3.5 rounded-2xl text-xs font-semibold bg-rose-50/90 text-rose-800 border border-rose-200/80 flex items-start gap-2.5 shadow-2xs">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0 mt-0.5"></i>
                <span class="leading-relaxed"><?= htmlspecialchars($error) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="register.php" id="auth-register-form" enctype="application/x-www-form-urlencoded" class="space-y-4">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
            <input type="hidden" name="redirect" value="<?= htmlspecialchars($redirect) ?>">

            <!-- Nom Complet -->
            <div class="space-y-1.5 text-left">
                <label for="reg-name" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Nom complet *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-4 h-[52px] transition-all duration-200">
                    <i data-lucide="user" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                    <input id="reg-name" type="text" name="name" required minlength="2" autocomplete="name" placeholder="Ex: Moussa Diop" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                </div>
            </div>

            <!-- Email -->
            <div class="space-y-1.5 text-left">
                <label for="reg-email" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Adresse Email *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl px-4 h-[52px] transition-all duration-200">
                    <i data-lucide="mail" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                    <input id="reg-email" type="email" name="email" required autocomplete="email" placeholder="nom@exemple.com" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                </div>
            </div>

            <!-- Mot de passe -->
            <div class="space-y-1.5 text-left">
                <label for="reg-password" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Mot de passe *</label>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-4 pr-2 h-[52px] transition-all duration-200">
                    <i data-lucide="lock" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                    <input id="reg-password" type="password" name="password" required minlength="8" autocomplete="new-password" placeholder="8+ caractères (lettres & chiffres)" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    <button type="button" onclick="togglePassword('reg-password', this)" aria-label="Afficher ou masquer le mot de passe" class="w-9 h-9 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Indicateur dynamique de force du mot de passe (Emil Kowalski Design) -->
                <div class="pt-1.5 space-y-1.5" id="pwd-strength-container">
                    <div class="grid grid-cols-4 gap-1.5 h-1.5">
                        <div id="pwd-bar-1" class="h-full rounded-full bg-slate-200 transition-all duration-200"></div>
                        <div id="pwd-bar-2" class="h-full rounded-full bg-slate-200 transition-all duration-200"></div>
                        <div id="pwd-bar-3" class="h-full rounded-full bg-slate-200 transition-all duration-200"></div>
                        <div id="pwd-bar-4" class="h-full rounded-full bg-slate-200 transition-all duration-200"></div>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span id="pwd-strength-label">Force : Non renseigné</span>
                        <div class="flex items-center gap-2">
                            <span id="crit-len" class="transition-colors">8+ car.</span>
                            <span id="crit-letter" class="transition-colors">Lettre</span>
                            <span id="crit-num" class="transition-colors">Chiffre</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Confirmation Mot de passe -->
            <div class="space-y-1.5 text-left">
                <div class="flex items-center justify-between">
                    <label for="reg-password-confirm" class="block text-[12px] font-bold text-[#1D1D1F] tracking-tight">Confirmer le mot de passe *</label>
                    <span id="match-status" class="hidden text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <i data-lucide="check" class="w-3 h-3"></i> Correspond
                    </span>
                </div>
                <div class="relative flex items-center bg-[#F5F5F7] hover:bg-[#EFEFF4] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#1677FF]/15 border border-[#E5E5EA] focus-within:border-[#1677FF] rounded-2xl pl-4 pr-2 h-[52px] transition-all duration-200">
                    <i data-lucide="check-shield" class="w-4 h-4 text-[#8E8E93] mr-3 shrink-0"></i>
                    <input id="reg-password-confirm" type="password" name="password_confirm" required minlength="8" autocomplete="new-password" placeholder="Répétez le mot de passe" class="w-full bg-transparent outline-none text-[15px] sm:text-sm font-semibold text-[#1D1D1F] placeholder:font-normal placeholder:text-[#8E8E93]">
                    <button type="button" onclick="togglePassword('reg-password-confirm', this)" aria-label="Afficher ou masquer le mot de passe" class="w-9 h-9 rounded-xl flex items-center justify-center text-[#8E8E93] hover:text-[#1D1D1F] hover:bg-black/5 active:scale-90 transition-all cursor-pointer shrink-0">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <!-- Conditions Générales -->
            <div class="pt-1">
                <label class="flex items-start gap-2.5 cursor-pointer text-[#1D1D1F] text-xs font-medium">
                    <input type="checkbox" name="accept_cgu" required class="mt-0.5 w-4 h-4 text-[#1677FF] border-[#D1D1D6] rounded-md focus:ring-[#1677FF] cursor-pointer">
                    <span class="leading-relaxed">J'accepte les <a href="contact.php" class="cursor-pointer text-[#1677FF] hover:underline font-bold">Conditions Générales</a> et la politique de confidentialité de SenTechPLUS.</span>
                </label>
            </div>

            <!-- Bouton Apple Sign Up avec état de chargement -->
            <button type="submit" id="btn-submit-reg" style="background-color: #1677FF !important; color: #ffffff !important;" class="w-full h-[52px] rounded-2xl bg-[#1677FF] hover:bg-[#0F67E5] active:scale-[0.98] text-white text-sm font-bold shadow-[0_8px_24px_rgba(22,119,255,0.28)] hover:shadow-[0_12px_28px_rgba(22,119,255,0.36)] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer mt-3 group">
                <span id="btn-reg-text">Créer mon compte</span>
                <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" id="btn-reg-icon"></i>
                <div id="btn-reg-spinner" class="hidden w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
        </form>

        <!-- Sécurité & Micro-engagements -->
        <div class="pt-5 border-t border-[#F1F3F7] space-y-3">
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                    <span class="text-[10px] font-bold text-[#475467]">100% Neuf</span>
                </div>
                <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                    <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i>
                    <span class="text-[10px] font-bold text-[#475467]">Dakar H+2</span>
                </div>
                <div class="p-2 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]/60 flex flex-col items-center justify-center gap-1">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-emerald-500"></i>
                    <span class="text-[10px] font-bold text-[#475467]">Échange 12M</span>
                </div>
            </div>

            <div class="text-center">
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j%27ai%20besoin%20d%27aide%20pour%20l%27inscription" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B] hover:text-[#0D7D53] transition-colors">
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

// Password Strength & Match Real-time feedback
(function() {
    const pwdInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-password-confirm');
    const bar1 = document.getElementById('pwd-bar-1');
    const bar2 = document.getElementById('pwd-bar-2');
    const bar3 = document.getElementById('pwd-bar-3');
    const bar4 = document.getElementById('pwd-bar-4');
    const label = document.getElementById('pwd-strength-label');
    const critLen = document.getElementById('crit-len');
    const critLetter = document.getElementById('crit-letter');
    const critNum = document.getElementById('crit-num');
    const matchStatus = document.getElementById('match-status');

    function checkStrength(val) {
        const hasLen = val.length >= 8;
        const hasLetter = /[A-Za-z]/.test(val);
        const hasNum = /[0-9]/.test(val);
        const hasSpecial = /[^A-Za-z0-9]/.test(val);

        if (critLen) critLen.className = hasLen ? 'text-emerald-600 font-bold' : 'text-[#8E8E93]';
        if (critLetter) critLetter.className = hasLetter ? 'text-emerald-600 font-bold' : 'text-[#8E8E93]';
        if (critNum) critNum.className = hasNum ? 'text-emerald-600 font-bold' : 'text-[#8E8E93]';

        let score = 0;
        if (hasLen) score++;
        if (hasLetter) score++;
        if (hasNum) score++;
        if (hasSpecial || val.length >= 12) score++;

        const bars = [bar1, bar2, bar3, bar4];
        bars.forEach(b => { if(b) b.className = 'h-full rounded-full bg-slate-200 transition-all duration-200'; });

        if (!val) {
            if (label) label.textContent = 'Force : Non renseigné';
            return;
        }

        if (score === 1) {
            if (bar1) bar1.className = 'h-full rounded-full bg-rose-500 transition-all duration-200';
            if (label) label.textContent = 'Force : Très faible';
        } else if (score === 2) {
            if (bar1) bar1.className = 'h-full rounded-full bg-amber-500 transition-all duration-200';
            if (bar2) bar2.className = 'h-full rounded-full bg-amber-500 transition-all duration-200';
            if (label) label.textContent = 'Force : Faible';
        } else if (score === 3) {
            if (bar1) bar1.className = 'h-full rounded-full bg-blue-500 transition-all duration-200';
            if (bar2) bar2.className = 'h-full rounded-full bg-blue-500 transition-all duration-200';
            if (bar3) bar3.className = 'h-full rounded-full bg-blue-500 transition-all duration-200';
            if (label) label.textContent = 'Force : Bon';
        } else if (score >= 4) {
            bars.forEach(b => { if(b) b.className = 'h-full rounded-full bg-emerald-500 transition-all duration-200'; });
            if (label) label.textContent = 'Force : Robuste ✓';
        }
    }

    function checkMatch() {
        if (!pwdInput || !confirmInput || !matchStatus) return;
        const p = pwdInput.value;
        const c = confirmInput.value;
        if (c.length > 0 && p === c) {
            matchStatus.classList.remove('hidden');
        } else {
            matchStatus.classList.add('hidden');
        }
    }

    pwdInput?.addEventListener('input', (e) => {
        checkStrength(e.target.value);
        checkMatch();
    });
    confirmInput?.addEventListener('input', checkMatch);
})();

// Perceived speed submission handler (Emil Kowalski feedback rule)
document.getElementById('auth-register-form')?.addEventListener('submit', function() {
    const btn = document.getElementById('btn-submit-reg');
    const txt = document.getElementById('btn-reg-text');
    const icon = document.getElementById('btn-reg-icon');
    const spinner = document.getElementById('btn-reg-spinner');
    if (btn && !btn.disabled) {
        btn.disabled = true;
        btn.classList.add('opacity-90', 'cursor-wait');
        if (txt) txt.textContent = 'Création du compte en cours...';
        if (icon) icon.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');
    }
});
</script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
