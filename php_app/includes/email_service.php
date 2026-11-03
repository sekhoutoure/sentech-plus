<?php
/**
 * SenTechPLUS — Complete Automated Email & Verification Service
 * Multi-transport: SMTP SSL/TLS + Native PHP Mail fallback + Async Database Queue
 * 100% Mobile Responsive HTML Templates with High Deliverability
 */

if (!defined('APP_URL')) {
    require_once __DIR__ . '/../config/config.php';
}

class EmailService {

    /**
     * Récupère la configuration SMTP depuis la base de données ou les variables d'environnement
     */
    public static function getSmtpConfig(): array {
        $pdo = getDBConnection();
        $config = [
            'host'       => getenv('SMTP_HOST') ?: 'smtp.hostinger.com',
            'port'       => (int)(getenv('SMTP_PORT') ?: 465),
            'encryption' => getenv('SMTP_ENCRYPTION') ?: 'ssl',
            'user'       => getenv('SMTP_USER') ?: 'contact@sentechplus.com',
            'pass'       => getenv('SMTP_PASS') ?: '',
            'from_name'  => 'SenTechPLUS Dakar',
            'from_email' => getenv('FROM_EMAIL') ?: 'contact@sentechplus.com',
            'is_active'  => 1
        ];

        if ($pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM smtp_settings WHERE is_active = 1 LIMIT 1");
                $dbConfig = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($dbConfig) {
                    if (!empty($dbConfig['smtp_host']))       $config['host']       = $dbConfig['smtp_host'];
                    if (!empty($dbConfig['smtp_port']))       $config['port']       = (int)$dbConfig['smtp_port'];
                    if (!empty($dbConfig['smtp_encryption'])) $config['encryption'] = $dbConfig['smtp_encryption'];
                    if (!empty($dbConfig['smtp_user']))       $config['user']       = $dbConfig['smtp_user'];
                    if (!empty($dbConfig['smtp_pass']))       $config['pass']       = $dbConfig['smtp_pass'];
                    if (!empty($dbConfig['from_name']))       $config['from_name']  = $dbConfig['from_name'];
                    if (!empty($dbConfig['from_email']))      $config['from_email'] = $dbConfig['from_email'];
                }
            } catch (Throwable $e) {
                // Fallback aux valeurs par défaut
            }
        }

        return $config;
    }

    /**
     * Envoie un email (directement ou via la file d'attente asynchrone)
     */
    public static function send(string $toEmail, string $toName, string $subject, string $htmlBody, string $templateType = 'general', bool $isAsync = false): bool {
        $pdo = getDBConnection();

        // Si mode asynchrone demandé et base disponible, on insère dans la queue
        if ($isAsync && $pdo) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO email_queue (recipient_email, recipient_name, subject, body_html, template_type, status, created_at)
                    VALUES (:email, :name, :subject, :body, :template, 'pending', NOW())
                ");
                return $stmt->execute([
                    ':email'    => $toEmail,
                    ':name'     => $toName,
                    ':subject'  => $subject,
                    ':body'     => $htmlBody,
                    ':template' => $templateType
                ]);
            } catch (Throwable $e) {
                // Si la queue échoue, on tente l'envoi synchrone direct
            }
        }

        return self::deliverDirectly($toEmail, $toName, $subject, $htmlBody);
    }

    /**
     * Envoi direct par SMTP avec fallback natif
     */
    public static function deliverDirectly(string $toEmail, string $toName, string $subject, string $htmlBody): bool {
        $smtp = self::getSmtpConfig();

        // 1. Tentative d'envoi SMTP Socket si mot de passe configuré
        if (!empty($smtp['host']) && !empty($smtp['pass']) && !empty($smtp['user'])) {
            try {
                $smtpSuccess = self::sendViaSmtpSocket($toEmail, $toName, $subject, $htmlBody, $smtp);
                if ($smtpSuccess) return true;
            } catch (Throwable $e) {
                error_log("SMTP Dispatch Failed, attempting mail() fallback: " . $e->getMessage());
            }
        }

        // 2. Fallback robuste via mail() natif de PHP (configuré sur Hostinger)
        return self::sendViaNativeMail($toEmail, $toName, $subject, $htmlBody, $smtp);
    }

    /**
     * Transport SMTP natif via socket sécurisé SSL/TLS
     */
    private static function sendViaSmtpSocket(string $toEmail, string $toName, string $subject, string $htmlBody, array $smtp): bool {
        $timeout = 10;
        $host = $smtp['host'];
        $port = (int)$smtp['port'];
        $prefix = ($smtp['encryption'] === 'ssl') ? 'ssl://' : '';

        $socket = @fsockopen($prefix . $host, $port, $errno, $errstr, $timeout);
        if (!$socket) {
            throw new Exception("Cannot connect to SMTP server {$host}:{$port} - {$errstr} ({$errno})");
        }

        stream_set_timeout($socket, $timeout);

        $read = function() use ($socket) {
            $data = '';
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') break;
            }
            return $data;
        };

        $write = function($cmd) use ($socket) {
            fputs($socket, $cmd . "\r\n");
        };

        $read(); // Bannière initiale

        $write("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'sentechplus.com'));
        $ehloRes = $read();

        // STARTTLS si configuré
        if ($smtp['encryption'] === 'tls') {
            $write("STARTTLS");
            $read();
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            $write("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'sentechplus.com'));
            $read();
        }

        // Authentification AUTH LOGIN
        $write("AUTH LOGIN");
        $read();
        $write(base64_encode($smtp['user']));
        $read();
        $write(base64_encode($smtp['pass']));
        $authRes = $read();

        if (strpos($authRes, '235') === false && strpos($authRes, '250') === false) {
            fclose($socket);
            throw new Exception("SMTP Authentication failed for {$smtp['user']}: {$authRes}");
        }

        // Envoi des commandes d'enveloppe
        $write("MAIL FROM: <" . $smtp['from_email'] . ">");
        $read();
        $write("RCPT TO: <" . $toEmail . ">");
        $read();
        $write("DATA");
        $read();

        // En-têtes MIME RFC 2822
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $fromHeader = '=?UTF-8?B?' . base64_encode($smtp['from_name']) . '?= <' . $smtp['from_email'] . '>';
        $toHeader = !empty($toName) ? '=?UTF-8?B?' . base64_encode($toName) . '?= <' . $toEmail . '>' : $toEmail;

        $msgHeaders  = "From: {$fromHeader}\r\n";
        $msgHeaders .= "To: {$toHeader}\r\n";
        $msgHeaders .= "Subject: {$encodedSubject}\r\n";
        $msgHeaders .= "MIME-Version: 1.0\r\n";
        $msgHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
        $msgHeaders .= "Content-Transfer-Encoding: base64\r\n";
        $msgHeaders .= "Date: " . date('r') . "\r\n";
        $msgHeaders .= "X-Mailer: SenTechPLUS-Automation/2.0\r\n\r\n";

        $bodyEncoded = chunk_split(base64_encode($htmlBody));

        $write($msgHeaders . $bodyEncoded . "\r\n.");
        $sendRes = $read();

        $write("QUIT");
        fclose($socket);

        return (strpos($sendRes, '250') !== false);
    }

    /**
     * Transport via mail() natif avec en-têtes UTF-8 optimisés
     */
    private static function sendViaNativeMail(string $toEmail, string $toName, string $subject, string $htmlBody, array $smtp): bool {
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $fromHeader = '=?UTF-8?B?' . base64_encode($smtp['from_name']) . '?= <' . $smtp['from_email'] . '>';
        $toHeader = !empty($toName) ? '=?UTF-8?B?' . base64_encode($toName) . '?= <' . $toEmail . '>' : $toEmail;

        $headers  = "From: {$fromHeader}\r\n";
        $headers .= "Reply-To: {$smtp['from_email']}\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . " (SenTechPLUS)\r\n";

        return @mail($toEmail, $encodedSubject, $htmlBody, $headers, "-f" . $smtp['from_email']);
    }

    // =========================================================================
    // 📧 TEMPLATES ET DÉCLENCHEURS D'AUTOMATISATION
    // =========================================================================

    /**
     * 1. Génère un token + code OTP et envoie l'email de vérification
     */
    public static function createAndSendVerification(array $user): array {
        $pdo = getDBConnection();

        $token = bin2hex(random_bytes(32)); // 64 caractères aléatoires
        $otp = sprintf("%06d", random_int(100000, 999999)); // Code à 6 chiffres
        $expiresAt = date('Y-m-d H:i:s', time() + (24 * 3600)); // Valable 24 heures

        if ($pdo) {
            try {
                // Invalider les anciens tokens non utilisés
                $stmt = $pdo->prepare("UPDATE email_verifications SET is_used = 1 WHERE user_id = :uid AND is_used = 0");
                $stmt->execute([':uid' => $user['id']]);

                // Insérer la nouvelle demande
                $ins = $pdo->prepare("
                    INSERT INTO email_verifications (user_id, email, token, otp_code, expires_at, created_at)
                    VALUES (:uid, :email, :token, :otp, :expires, NOW())
                ");
                $ins->execute([
                    ':uid'     => $user['id'],
                    ':email'   => $user['email'],
                    ':token'   => $token,
                    ':otp'     => $otp,
                    ':expires' => $expiresAt
                ]);

                // Mettre à jour l'utilisateur
                $uStmt = $pdo->prepare("UPDATE users SET verification_token = :token WHERE id = :uid");
                $uStmt->execute([':token' => $token, ':uid' => $user['id']]);
            } catch (Throwable $e) {
                error_log("DB Verification creation error: " . $e->getMessage());
            }
        }

        $verifyUrl = APP_URL . "/verify-email.php?token=" . urlencode($token);
        $html = self::buildVerificationTemplate($user['name'] ?: 'Client', $otp, $verifyUrl);

        $sent = self::send($user['email'], $user['name'] ?: 'Client', "Vérifiez votre compte SenTechPLUS — Code : {$otp}", $html, 'verification', false);

        return [
            'success'   => $sent,
            'token'     => $token,
            'otp'       => $otp,
            'verify_url'=> $verifyUrl
        ];
    }

    /**
     * 2. Envoie l'email automatique de confirmation de commande
     */
    public static function sendOrderConfirmation(array $order, array $items = []): bool {
        $orderId = $order['id'] ?? $order['order_id'] ?? 'CMD-' . time();
        $clientName = $order['customer_name'] ?? $order['name'] ?? 'Client';
        $clientEmail = $order['customer_email'] ?? $order['email'] ?? '';

        if (empty($clientEmail)) return false;

        $trackingUrl = APP_URL . "/tracking.php?order_id=" . urlencode($orderId);
        $html = self::buildOrderConfirmationTemplate($order, $items, $trackingUrl);

        return self::send(
            $clientEmail,
            $clientName,
            "Confirmation de votre commande #{$orderId} — SenTechPLUS",
            $html,
            'order_confirmation',
            false
        );
    }

    /**
     * 3. Envoie l'email automatique de mise à jour du statut de livraison
     */
    public static function sendOrderStatusNotification(array $order, string $newStatus): bool {
        $orderId = $order['id'] ?? $order['order_id'] ?? '';
        $clientName = $order['customer_name'] ?? $order['name'] ?? 'Client';
        $clientEmail = $order['customer_email'] ?? $order['email'] ?? '';

        if (empty($clientEmail)) return false;

        $trackingUrl = APP_URL . "/tracking.php?order_id=" . urlencode($orderId);
        $html = self::buildOrderStatusTemplate($order, $newStatus, $trackingUrl);

        $statusLabels = [
            'CONFIRMED'  => '✅ Confirmée et en préparation',
            'PREPARING'  => '📦 En cours de préparation dans notre hub Dakar',
            'SHIPPED'    => '🚚 En cours de livraison express Dakar',
            'DELIVERED'  => '🎉 Livrée avec succès !',
            'CANCELLED'  => '❌ Annulée'
        ];
        $label = $statusLabels[$newStatus] ?? $newStatus;

        return self::send(
            $clientEmail,
            $clientName,
            "Mise à jour de votre commande #{$orderId} : {$label}",
            $html,
            'status_update',
            false
        );
    }

    /**
     * 4. Envoie l'email de réinitialisation de mot de passe
     */
    public static function sendPasswordResetEmail(array $user, string $resetToken): bool {
        $resetUrl = APP_URL . "/reset-password.php?token=" . urlencode($resetToken);
        $html = self::buildPasswordResetTemplate($user['name'] ?: 'Client', $resetUrl);

        return self::send(
            $user['email'],
            $user['name'] ?: 'Client',
            "Réinitialisation de votre mot de passe — SenTechPLUS",
            $html,
            'password_reset',
            false
        );
    }

    // =========================================================================
    // 🎨 CONSTRUCTEUR DE TEMPLATES HTML RESPONSIVE ULTRA-MODERNES
    // =========================================================================

    /**
     * Enveloppe globale HTML commune avec header branding et footer légal
     */
    private static function wrapEmailLayout(string $title, string $contentHtml): string {
        $appUrl = rtrim(APP_URL, '/');
        $currentYear = date('Y');

        return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$title}</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F7FC; color: #182230; line-height: 1.6; }
        table { border-collapse: collapse; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #0A1937 0%, #1677FF 100%); padding: 32px 24px; text-align: center; }
        .content { padding: 36px 28px; }
        .footer { background: #F8FAFD; padding: 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
        .btn-primary { display: inline-block; background: #0B54C2; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(11,84,194,0.3); }
        .otp-box { background: #EEF4FB; border: 2px dashed #1677FF; border-radius: 14px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: monospace, monospace; font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0B54C2; }
        .item-row { border-bottom: 1px solid #F1F5F9; padding: 12px 0; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; }
        .badge-success { background: #DEF7EC; color: #03543F; }
        .badge-info { background: #E1EFFE; color: #1E429F; }
    </style>
</head>
<body style="background-color: #F3F7FC; padding: 24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
        <tr>
            <td align="center">
                <table role="presentation" class="wrapper" cellpadding="0" cellspacing="0">
                    <!-- HEADER -->
                    <tr>
                        <td class="header">
                            <table role="presentation" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{$appUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; display:inline-block;">
                                            <span style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">SenTech<span style="color: #60A5FA;">PLUS</span></span>
                                        </a>
                                        <div style="font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 600; margin-top: 4px;">High-Tech Certifié & Livraison Express Dakar</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- BODY CONTENT -->
                    <tr>
                        <td class="content">
                            {$contentHtml}
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td class="footer">
                            <p style="margin: 0 0 8px 0; font-weight: 700; color: #182230;">SenTechPLUS Sénégal — Point E, Boulevard de l'Est, Dakar</p>
                            <p style="margin: 0 0 12px 0;">📞 Support WhatsApp 7j/7 : <a href="https://wa.me/221781316497" style="color:#0B54C2; text-decoration:none; font-weight:700;">+221 78 131 64 97</a></p>
                            <p style="margin: 0; font-size: 11px; color: #94A3B8;">© {$currentYear} SenTechPLUS. Tous droits réservés. Paiements sécurisés Wave, Orange Money et Cash.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    /**
     * Template 1 : Vérification d'email & Code OTP
     */
    public static function buildVerificationTemplate(string $name, string $otp, string $verifyUrl): string {
        $content = <<<HTML
        <h2 style="font-size: 22px; font-weight: 900; color: #182230; margin-top: 0; margin-bottom: 12px;">Bienvenue sur SenTechPLUS, {$name} ! 👋</h2>
        <p style="font-size: 14px; color: #475467; margin-bottom: 20px;">
            Merci pour votre inscription ! Pour sécuriser votre compte et activer vos commandes en livraison express, veuillez confirmer votre adresse email.
        </p>

        <div class="otp-box">
            <div style="font-size: 12px; font-weight: 700; color: #475467; text-transform: uppercase; margin-bottom: 6px;">Votre code de vérification à 6 chiffres :</div>
            <div class="otp-code">{$otp}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 6px;">Ce code expire dans 24 heures.</div>
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="{$verifyUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">✅ Valider mon compte en 1 clic</a>
        </div>

        <p style="font-size: 12px; color: #64748B; line-height: 1.5; margin-top: 24px; border-top: 1px solid #F1F5F9; padding-top: 16px;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
            <a href="{$verifyUrl}" style="color: #0B54C2; word-break: break-all;">{$verifyUrl}</a>
        </p>
        <p style="font-size: 11px; color: #94A3B8; margin-top: 12px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
HTML;

        return self::wrapEmailLayout("Vérification de votre compte SenTechPLUS", $content);
    }

    /**
     * Template 2 : Confirmation de commande & Facture détaillée
     */
    public static function buildOrderConfirmationTemplate(array $order, array $items, string $trackingUrl): string {
        $orderId = htmlspecialchars($order['id'] ?? $order['order_id'] ?? 'CMD-' . time());
        $clientName = htmlspecialchars($order['customer_name'] ?? $order['name'] ?? 'Client');
        $phone = htmlspecialchars($order['customer_phone'] ?? $order['phone'] ?? '+221');
        $address = htmlspecialchars($order['delivery_address'] ?? $order['address'] ?? 'Dakar');
        $payMethod = strtoupper($order['payment_method'] ?? 'COD');
        $subtotal = formatPrice($order['subtotal'] ?? 0);
        $shipping = ($order['delivery_fee'] ?? 0) > 0 ? formatPrice($order['delivery_fee']) : 'Gratuit 🎉';
        $total = formatPrice($order['total'] ?? $order['total_amount'] ?? 0);

        $itemsRows = '';
        foreach ($items as $item) {
            $iName = htmlspecialchars($item['name'] ?? 'Article');
            $iQty = (int)($item['quantity'] ?? 1);
            $iPrice = formatPrice($item['price'] ?? $item['unit_price'] ?? 0);
            $iTotal = formatPrice(($item['price'] ?? 0) * $iQty);

            $itemsRows .= <<<HTML
            <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; font-size: 13px; font-weight: 700; color: #182230;">{$iName} <span style="color:#64748B; font-weight:500;">×{$iQty}</span></td>
                <td align="right" style="padding: 10px 0; font-size: 13px; font-weight: 800; color: #0B54C2;">{$iTotal}</td>
            </tr>
HTML;
        }

        $content = <<<HTML
        <div style="text-align: center; margin-bottom: 24px;">
            <span class="badge badge-success" style="font-size: 12px; padding: 6px 14px;">✓ Commande Reçue avec Succès</span>
            <h2 style="font-size: 22px; font-weight: 900; color: #182230; margin: 12px 0 4px 0;">Merci pour votre achat, {$clientName} ! 📦</h2>
            <p style="font-size: 13px; color: #475467; margin: 0;">Numéro de commande : <strong style="color:#0B54C2;">#{$orderId}</strong></p>
        </div>

        <div style="background: #F8FAFD; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 800; color: #182230; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">Récapitulatif des Articles :</div>
            <table width="100%" cellpadding="0" cellspacing="0">
                {$itemsRows}
                <tr>
                    <td style="padding: 8px 0 4px 0; font-size: 12px; color: #64748B;">Sous-total :</td>
                    <td align="right" style="padding: 8px 0 4px 0; font-size: 12px; font-weight: 700; color: #182230;">{$subtotal}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; font-size: 12px; color: #64748B;">Frais de livraison Dakar :</td>
                    <td align="right" style="padding: 4px 0; font-size: 12px; font-weight: 700; color: #065F46;">{$shipping}</td>
                </tr>
                <tr style="border-top: 2px solid #E2E8F0;">
                    <td style="padding: 12px 0 4px 0; font-size: 15px; font-weight: 900; color: #182230;">TOTAL À PAYER :</td>
                    <td align="right" style="padding: 12px 0 4px 0; font-size: 18px; font-weight: 900; color: #0B54C2;">{$total}</td>
                </tr>
            </table>
        </div>

        <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; margin-bottom: 24px; font-size: 12px;">
            <div style="margin-bottom: 6px;">📍 <strong>Adresse de Livraison :</strong> {$address}</div>
            <div style="margin-bottom: 6px;">📞 <strong>Téléphone :</strong> {$phone}</div>
            <div>💳 <strong>Mode de Paiement :</strong> {$payMethod}</div>
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="{$trackingUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">🚚 Suivre mon Colis en Direct</a>
        </div>
HTML;

        return self::wrapEmailLayout("Confirmation de commande #{$orderId} — SenTechPLUS", $content);
    }

    /**
     * Template 3 : Notification de Changement de Statut
     */
    public static function buildOrderStatusTemplate(array $order, string $newStatus, string $trackingUrl): string {
        $orderId = htmlspecialchars($order['id'] ?? $order['order_id'] ?? '');
        $clientName = htmlspecialchars($order['customer_name'] ?? $order['name'] ?? 'Client');

        $statusData = [
            'PREPARING' => [
                'title' => 'Votre colis est en cours de préparation 📦',
                'desc'  => 'Notre équipe logistique à Dakar emballe soigneusement vos articles certifiés.'
            ],
            'SHIPPED' => [
                'title' => 'Votre livreur est en route ! 🛵💨',
                'desc'  => 'Votre colis a été confié à notre coursier express pour une livraison rapide à votre adresse.'
            ],
            'DELIVERED' => [
                'title' => 'Votre colis a été livré ! 🎉',
                'desc'  => 'Nous espérons que vos nouveaux équipements High-Tech vous apportent entière satisfaction.'
            ],
            'CANCELLED' => [
                'title' => 'Commande Annulée',
                'desc'  => 'Votre commande a été annulée. Si vous avez des questions, notre support est à votre écoute.'
            ]
        ];

        $curr = $statusData[$newStatus] ?? [
            'title' => 'Mise à jour de votre commande',
            'desc'  => 'Le statut de votre commande #'.$orderId.' a été mis à jour.'
        ];

        $content = <<<HTML
        <h2 style="font-size: 22px; font-weight: 900; color: #182230; margin-top: 0; margin-bottom: 12px;">{$curr['title']}</h2>
        <p style="font-size: 14px; color: #475467; margin-bottom: 20px;">
            Bonjour {$clientName},<br>{$curr['desc']}
        </p>

        <div style="background: #F8FAFD; border-left: 4px solid #1677FF; border-radius: 8px; padding: 14px; margin: 20px 0; font-size: 13px;">
            <strong>Commande :</strong> #{$orderId}<br>
            <strong>Date :</strong> {$order['created_at']}
        </div>

        <div style="text-align: center; margin: 28px 0;">
            <a href="{$trackingUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">🔍 Consulter le Suivi en Temps Réel</a>
        </div>
HTML;

        return self::wrapEmailLayout("Statut Commande #{$orderId} — SenTechPLUS", $content);
    }

    /**
     * Template 4 : Réinitialisation de mot de passe
     */
    public static function buildPasswordResetTemplate(string $name, string $resetUrl): string {
        $content = <<<HTML
        <h2 style="font-size: 22px; font-weight: 900; color: #182230; margin-top: 0; margin-bottom: 12px;">Réinitialisation de Mot de Passe 🔒</h2>
        <p style="font-size: 14px; color: #475467; margin-bottom: 20px;">
            Bonjour {$name},<br>
            Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte SenTechPLUS.
        </p>

        <div style="text-align: center; margin: 28px 0;">
            <a href="{$resetUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">🔑 Changer mon mot de passe</a>
        </div>

        <p style="font-size: 12px; color: #64748B; margin-top: 24px; border-top: 1px solid #F1F5F9; padding-top: 16px;">
            Ce lien est sécurisé et expire dans <strong>1 heure</strong>.<br>
            Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer ce message ou contacter immédiatement notre service client.
        </p>
HTML;

        return self::wrapEmailLayout("Réinitialisation Mot de Passe — SenTechPLUS", $content);
    }

    // =========================================================================
    // 📧 PHASE 4 : SÉQUENCE D'EMAILS DE RÉTENTION & RÉENGAGEMENT (1 SEUL OBJECTIF)
    // =========================================================================

    /**
     * J0 : Email de Bienvenue & Première Valeur Immédiate
     * Objectif unique : Activer le premier achat avec le code promo de bienvenue.
     */
    public static function sendWelcomeRetentionEmail(array $user): bool {
        $name = htmlspecialchars(explode(' ', $user['name'] ?? 'Client')[0]);
        $email = $user['email'] ?? '';
        if (empty($email)) return false;

        $shopUrl = rtrim(APP_URL, '/') . "/shop.php?coupon=BIENVENUE10";
        $couponCode = "BIENVENUE10";

        $content = <<<HTML
        <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Bienvenue chez SenTechPLUS, {$name} ! 🎉</h2>
        <p style="font-size: 14px; color: #475467; margin-bottom: 20px; line-height: 1.6;">
            Votre compte est actif. Pour vous souhaiter la bienvenue, profitez dès maintenant de <strong>-10% de réduction immédiate</strong> sur toute votre première commande.
        </p>

        <div style="background: #F8FAFC; border: 2px dashed #0B54C2; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0;">
            <div style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Votre code promo exclusif :</div>
            <div style="font-family: monospace; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #0B54C2;">{$couponCode}</div>
            <div style="font-size: 11px; color: #065F46; font-weight: 700; margin-top: 8px;">✓ Valable sur tout le catalogue certifié</div>
        </div>

        <div style="text-align: center; margin: 32px 0 20px 0;">
            <a href="{$shopUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">🛍️ Activer mes 10% et Découvrir la Boutique</a>
        </div>

        <p style="font-size: 11px; color: #94A3B8; text-align: center; margin-top: 24px;">
            Garantie constructeur • Paiement sécurisé Wave, OM, Carte • Expédition soignée partout au Sénégal
        </p>
HTML;

        return self::send($email, $name, "Bienvenue {$name} ! Vos -10% de bienvenue vous attendent 🎁", self::wrapEmailLayout("Bienvenue sur SenTechPLUS", $content), 'welcome_retention');
    }

    /**
     * J+2 : Email de Relance & Rappel de Valeur (Inactif)
     * Objectif unique : Lever le doute et ramener l'utilisateur vers son premier succès.
     */
    public static function sendInactivityRecoveryEmail(array $user): bool {
        $name = htmlspecialchars(explode(' ', $user['name'] ?? 'Client')[0]);
        $email = $user['email'] ?? '';
        if (empty($email)) return false;

        $shopUrl = rtrim(APP_URL, '/') . "/shop.php";

        $content = <<<HTML
        <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Un équipement tech certifié pour votre quotidien ? ⚡</h2>
        <p style="font-size: 14px; color: #475467; margin-bottom: 20px; line-height: 1.6;">
            Bonjour {$name}, vous n'avez pas encore finalisé votre choix. Sur SenTechPLUS, nous levons tous les doutes habituels :
        </p>

        <div style="background: #F8FAFC; border-radius: 16px; padding: 18px; margin: 20px 0; border: 1px solid #E2E8F0; font-size: 13px; color: #334155; line-height: 1.7;">
            <div style="margin-bottom: 8px;">🛡️ <strong>100% Original & Garanti</strong> — Zéro risque de contrefaçon.</div>
            <div style="margin-bottom: 8px;">💳 <strong>Paiement 100% Sécurisé</strong> — Wave, Orange Money ou Carte Bancaire.</div>
            <div>🚚 <strong>Livraison Rapide</strong> — À domicile à Dakar ou expédié dans toutes les régions.</div>
        </div>

        <div style="text-align: center; margin: 32px 0 20px 0;">
            <a href="{$shopUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">👉 Explorer les Meilleures Ventes Certifiées</a>
        </div>
HTML;

        return self::send($email, $name, "{$name}, découvrez nos équipements certifiés au Sénégal 🇸🇳", self::wrapEmailLayout("Découvrez SenTechPLUS", $content), 'inactivity_recovery');
    }

    /**
     * J+7 : Email de Découverte Feature Clé (Assistance VIP WhatsApp & Alertes Prix)
     * Objectif unique : Faire adopter le canal de proximité et fidéliser.
     */
    public static function sendFeatureDiscoveryEmail(array $user): bool {
        $name = htmlspecialchars(explode(' ', $user['name'] ?? 'Client')[0]);
        $email = $user['email'] ?? '';
        if (empty($email)) return false;

        $waUrl = "https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20je%20suis%20{$name}%20et%20j'ai%20une%20question.";

        $content = <<<HTML
        <h2 style="font-size: 22px; font-weight: 900; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Une question sur un produit ? On est sur WhatsApp 7j/7 💬</h2>
        <p style="font-size: 14px; color: #475467; margin-bottom: 20px; line-height: 1.6;">
            Bonjour {$name}, saviez-vous que vous pouvez échanger directement avec un conseiller tech dédié en direct ?
        </p>

        <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 16px; padding: 18px; margin: 20px 0; font-size: 13px; color: #065F46; line-height: 1.6;">
            <strong>Ce que vous pouvez faire en 1 message WhatsApp :</strong>
            <ul style="margin: 8px 0 0 0; padding-left: 18px;">
                <li>Demander un conseil de compatibilité (chargeur, écouteurs, coque)</li>
                <li>Suivre l'acheminement exact de votre commande</li>
                <li>Bénéficier d'offres flash réservées aux membres</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 32px 0 20px 0;">
            <a href="{$waUrl}" class="btn-primary" style="background: #065F46;" target="_blank" rel="noopener noreferrer">📱 Enregistrer le Support WhatsApp SenTechPLUS</a>
        </div>
HTML;

        return self::send($email, $name, "{$name}, votre ligne directe WhatsApp SenTechPLUS 7j/7 💬", self::wrapEmailLayout("Support VIP SenTechPLUS", $content), 'feature_discovery');
    }

}
