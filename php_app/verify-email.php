<?php
/**
 * SenTechPLUS — Page de Vérification d'Email & Activation de Compte (1-Click & Code OTP)
 */
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/email_service.php';
$pdo = getDBConnection();

$pageTitle = "Vérification de Compte — SenTechPLUS";
$metaDescription = "Validez votre adresse email pour sécuriser votre compte SenTechPLUS et activer vos commandes.";

$currentUser = getCurrentUser();
$message = '';
$messageType = '';
$isVerifiedSuccess = false;

// 1. Traitement par Token URL (Clic direct depuis l'email)
$token = filter_input(INPUT_GET, 'token', FILTER_DEFAULT);
if (!empty($token) && strlen($token) >= 32) {
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                SELECT ev.*, u.name, u.email as user_email 
                FROM email_verifications ev
                JOIN users u ON u.id = ev.user_id
                WHERE ev.token = :token AND ev.is_used = 0 AND ev.expires_at > NOW()
                LIMIT 1
            ");
            $stmt->execute([':token' => $token]);
            $verif = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($verif) {
                // Valider l'utilisateur
                $uUpdate = $pdo->prepare("UPDATE users SET is_email_verified = 1, email_verified = NOW(), verification_token = NULL WHERE id = :uid");
                $uUpdate->execute([':uid' => $verif['user_id']]);

                // Marquer la vérification comme consommée
                $vUpdate = $pdo->prepare("UPDATE email_verifications SET is_used = 1, verified_at = NOW() WHERE id = :id");
                $vUpdate->execute([':id' => $verif['id']]);

                $isVerifiedSuccess = true;
                $message = "🎉 Félicitations ! Votre adresse email <strong>" . htmlspecialchars($verif['email']) . "</strong> a été vérifiée avec succès.";
                $messageType = "success";
            } else {
                $message = "Ce lien de vérification est invalide ou a déjà expiré. Vous pouvez demander un nouveau code ci-dessous.";
                $messageType = "error";
            }
        } catch (Throwable $e) {
            $message = "Une erreur est survenue lors de la vérification. Veuillez réessayer.";
            $messageType = "error";
        }
    }
}

// 2. Traitement par soumission manuelle de l'OTP
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['otp_code'])) {
    $rawOtp = trim($_POST['otp_code']);
    $emailInput = trim($_POST['email'] ?? ($currentUser['email'] ?? ''));

    if (strlen($rawOtp) === 6 && !empty($emailInput)) {
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("
                    SELECT ev.*, u.id as uid 
                    FROM email_verifications ev
                    JOIN users u ON u.id = ev.user_id
                    WHERE (ev.email = :email OR u.email = :email) 
                      AND ev.otp_code = :otp 
                      AND ev.is_used = 0 
                      AND ev.expires_at > NOW()
                    ORDER BY ev.id DESC LIMIT 1
                ");
                $stmt->execute([':email' => $emailInput, ':otp' => $rawOtp]);
                $verif = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($verif) {
                    $uUpdate = $pdo->prepare("UPDATE users SET is_email_verified = 1, email_verified = NOW(), verification_token = NULL WHERE id = :uid");
                    $uUpdate->execute([':uid' => $verif['uid']]);

                    $vUpdate = $pdo->prepare("UPDATE email_verifications SET is_used = 1, verified_at = NOW() WHERE id = :id");
                    $vUpdate->execute([':id' => $verif['id']]);

                    $isVerifiedSuccess = true;
                    $message = "🎉 Code validé ! Votre compte SenTechPLUS est désormais actif et vérifié.";
                    $messageType = "success";
                } else {
                    $message = "Code de vérification incorrect ou expiré. Veuillez vérifier votre boîte de réception.";
                    $messageType = "error";
                }
            } catch (Throwable $e) {
                $message = "Erreur de connexion à la base de données.";
                $messageType = "error";
            }
        }
    } else {
        $message = "Veuillez saisir un code à 6 chiffres valide.";
        $messageType = "error";
    }
}

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main class="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-[#F3F7FC]">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E2E8F0] p-6 sm:p-8 text-center">
        
        <?php if ($isVerifiedSuccess): ?>
            <!-- SUCCÈS -->
            <div class="w-20 h-20 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center text-[#065F46] border-2 border-emerald-200">
                <i data-lucide="check-circle" class="w-10 h-10"></i>
            </div>
            
            <h1 class="text-2xl font-black text-[#182230] mb-2 font-heading">Compte Vérifié !</h1>
            <p class="text-sm text-[#475467] mb-6"><?= $message ?></p>
            
            <div class="space-y-3">
                <a href="account" class="w-full inline-flex items-center justify-center gap-2 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all">
                    <span>Accéder à mon Compte</span>
                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
                <a href="shop" class="w-full inline-flex items-center justify-center gap-2 bg-[#EEF4FB] hover:bg-[#E2EDF8] text-[#0B54C2] font-bold text-sm py-3 px-6 rounded-2xl transition-all">
                    <span>Continuer mes Achats</span>
                </a>
            </div>

        <?php else: ?>
            <!-- FORMULAIRE DE SAISIE CODE OTP -->
            <div class="w-16 h-16 mx-auto mb-5 bg-[#EEF4FB] rounded-2xl flex items-center justify-center text-[#0B54C2]">
                <i data-lucide="mail-check" class="w-8 h-8"></i>
            </div>

            <h1 class="text-2xl font-black text-[#182230] mb-2 font-heading">Vérification de l'Email</h1>
            <p class="text-xs text-[#475467] mb-6">
                Saisissez le code à 6 chiffres envoyé à votre adresse email pour activer votre compte.
            </p>

            <?php if (!empty($message)): ?>
                <div class="mb-5 p-3.5 rounded-2xl text-xs font-bold <?= $messageType === 'success' ? 'bg-emerald-50 text-[#065F46] border border-emerald-200' : 'bg-rose-50 text-[#B91C1C] border border-rose-200' ?>">
                    <?= $message ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="verify-email.php" class="space-y-4 text-left">
                <?= getCSRFInputField() ?>
                <div>
                    <label for="ve-email" class="block text-xs font-black text-[#182230] mb-1.5 uppercase tracking-wide">Votre Adresse Email</label>
                    <input id="ve-email" type="email" name="email" autocomplete="email" required value="<?= htmlspecialchars($currentUser['email'] ?? $_POST['email'] ?? '') ?>" placeholder="nom@exemple.com" class="w-full px-4 py-3 text-sm bg-[#F8FAFD] border border-[#CBD5E1] rounded-2xl focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/20 transition-all outline-none font-semibold text-[#182230]">
                </div>

                <div>
                    <label for="ve-otp" class="block text-xs font-black text-[#182230] mb-1.5 uppercase tracking-wide">Code de Vérification (6 chiffres)</label>
                    <input id="ve-otp" type="text" name="otp_code" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required placeholder="123456" class="w-full px-4 py-3 text-center text-2xl font-mono font-black tracking-[8px] bg-[#F8FAFB] border-2 border-[#1677FF]/30 focus:border-[#1677FF] focus:ring-4 focus:ring-[#1677FF]/15 rounded-2xl transition-all outline-none text-[#0B54C2]">
                </div>

                <button type="submit" class="w-full inline-flex items-center justify-center gap-2 bg-[#0B54C2] hover:bg-[#09449E] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all cursor-pointer">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>Valider mon Compte</span>
                </button>
            </form>

            <div class="mt-6 pt-5 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                Vous n'avez pas reçu l'email ? 
                <button type="button" id="btn-resend-otp" onclick="resendVerificationCode()" class="text-[#0B54C2] font-black hover:underline cursor-pointer ml-1 inline-flex items-center gap-1">
                    <span>Renvoyer un nouveau code</span>
                </button>
                <div id="resend-feedback" class="mt-2 text-xs font-bold hidden"></div>
            </div>
        <?php endif; ?>

    </div>
</main>

<script>
async function resendVerificationCode() {
    const btn = document.getElementById('btn-resend-otp');
    const feedback = document.getElementById('resend-feedback');
    const emailInput = document.querySelector('input[name="email"]');
    
    if (!emailInput || !emailInput.value.includes('@')) {
        alert('Veuillez renseigner une adresse email valide.');
        return;
    }

    btn.disabled = true;
    btn.classList.add('opacity-50', 'pointer-events-none');
    feedback.classList.remove('hidden', 'text-emerald-600', 'text-rose-600');
    feedback.classList.add('text-blue-600');
    feedback.textContent = 'Envoi du nouveau code en cours...';

    try {
        const formData = new FormData();
        formData.append('action', 'resend_verification');
        formData.append('email', emailInput.value);

        const resp = await fetch('api-email-actions.php', {
            method: 'POST',
            body: formData
        });
        const data = await resp.json();

        if (data.success) {
            feedback.classList.remove('text-blue-600');
            feedback.classList.add('text-[#065F46]');
            feedback.textContent = '✅ Nouveau code envoyé ! Vérifiez votre boîte de réception.';
            
            // Cooldown de 60 secondes
            let count = 60;
            const timer = setInterval(() => {
                count--;
                btn.textContent = `Renvoyer (${count}s)`;
                if (count <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.classList.remove('opacity-50', 'pointer-events-none');
                    btn.textContent = 'Renvoyer un nouveau code';
                }
            }, 1000);
        } else {
            feedback.classList.remove('text-blue-600');
            feedback.classList.add('text-rose-600');
            feedback.textContent = data.message || "Erreur lors de l'envoi.";
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'pointer-events-none');
        }
    } catch (e) {
        feedback.textContent = "Erreur réseau. Veuillez réessayer.";
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'pointer-events-none');
    }
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>