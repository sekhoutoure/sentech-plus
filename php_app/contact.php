<?php
require_once __DIR__ . '/config/config.php';

$pageTitle = "Contact, Showroom Dakar & FAQ — SenTechPLUS";
$metaDescription = "Contactez le service client SenTechPLUS au Sénégal, visitez notre showroom à Dakar (Avenue Cheikh Anta Diop) et consultez les réponses à toutes vos questions.";
$canonicalUrl = "https://www.sentechplus.com/contact.php";

$contactPhone = getSiteSetting('support_phone', defined('WHATSAPP_DISPLAY') ? WHATSAPP_DISPLAY : '+221 78 131 64 97');
$contactEmail = getSiteSetting('support_email', 'contact@sentechplus.com');
$contactAddress = getSiteSetting('store_address', 'Avenue Cheikh Anta Diop, Dakar, Sénégal');
$waRaw = preg_replace('/[^0-9]/', '', $contactPhone) ?: '221781316497';

$schemaJsonLd = [
    "@context" => "https://schema.org",
    "@type" => "FAQPage",
    "mainEntity" => [
        [
            "@type" => "Question",
            "name" => "Quels sont les délais de livraison à Dakar et en région ?",
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => "À Dakar, la livraison s'effectue en 2h à 4h chrono. En région sénégalaise (Thiès, Saint-Louis, Mbour, Ziguinchor), le délai est de 24h à 48h."
            ]
        ],
        [
            "@type" => "Question",
            "name" => "Quels sont les modes de paiement acceptés ?",
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => "Paiement sécurisé par Wave, Orange Money, Carte Bancaire ou en espèces directement à la livraison."
            ]
        ],
        [
            "@type" => "Question",
            "name" => "Quelle est la garantie sur les produits ?",
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => "Tous nos produits High-Tech sont certifiés authentiques et garantis 12 mois constructeur avec échange immédiat en cas de panne."
            ]
        ],
        [
            "@type" => "Question",
            "name" => "Comment fonctionne la politique de retour ?",
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => "Vous disposez de 7 jours ouvrés pour essayer votre matériel et demander un remboursement ou un échange standard."
            ]
        ]
    ]
];

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$pdo = getDBConnection();
$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submittedCsrf = $_POST['csrf_token'] ?? '';
    if (!SecurityShield::verifyHoneypot('website_url_hp')) {
        $error = "Requête invalide détectée.";
    } elseif (!checkRateLimit('contact_form', 5, 600)) {
        $remainingMin = getRateLimitRemainingMinutes('contact_form', 600);
        $error = "Trop de messages envoyés récemment. Veuillez patienter {$remainingMin} minute(s) avant de renvoyer un message.";
    } elseif (!verifyCSRFToken($submittedCsrf)) {
        $error = "Session expirée ou jeton CSRF invalide. Veuillez réessayer.";
    } else {
        $name = sanitize($_POST['name'] ?? '');
        $email = strtolower(sanitize($_POST['email'] ?? ''));
        $subject = sanitize($_POST['subject'] ?? '');
        $message = sanitize($_POST['message'] ?? '');


        if (empty($name) || empty($email) || empty($subject) || empty($message)) {
            $error = "Veuillez remplir tous les champs du formulaire.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = "Veuillez saisir une adresse email valide.";
        } else {
            try {
                $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message, status) VALUES (:name, :email, :subject, :msg, 'unread')");
                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email,
                    ':subject' => $subject,
                    ':msg' => $message
                ]);
                $success = true;
            } catch (Exception $e) {
                $error = "Une erreur est survenue lors de l'envoi de votre message.";
            }
        }
    }
}
?>

<main id="main-content" class="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 flex-1 space-y-8">

    <!-- Breadcrumbs Navigation (Universelle) -->
    <?php $breadcrumbs = [['label'=>'Contact & Support','url'=>null]]; require_once __DIR__ . '/includes/breadcrumb.php'; ?>

    <div class="text-center space-y-2">
        <h1 class="text-3xl font-extrabold text-[#182230] tracking-tight">Contactez-nous</h1>
        <p class="text-xs sm:text-sm text-[#667085]">Une question sur un produit ou votre livraison à Dakar ? Notre équipe vous répond 7j/7.</p>
    </div>

    <!-- ─── Promesse de Délai de Réponse ─────────────────────────── -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
        <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse inline-block flex-shrink-0"></span>
            <span class="text-xs sm:text-sm font-black text-[#0D7D53]">🟢 En ligne — Lun–Sam 8h30 → 20h00</span>
        </div>
        <div class="hidden sm:block w-px h-5 bg-[#BBF7D0]"></div>
        <div class="flex items-center gap-2 text-xs font-bold text-[#0D7D53]">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Réponse WhatsApp garantie en <strong>&nbsp;moins de 2h&nbsp;</strong>
        </div>
        <a href="https://wa.me/221781316497?text=Bonjour SenTechPLUS, j'ai une question"
           target="_blank" rel="noopener"
           class="inline-flex items-center gap-1.5 bg-[#25D366] text-white font-black text-xs px-4 py-2 rounded-xl hover:bg-[#1DA851] transition-colors flex-shrink-0">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp direct
        </a>
    </div>

    <?php if ($success): ?>
        <div class="p-5 rounded-2xl text-sm font-bold bg-[#F0FDF4] text-[#0D7D53] border-2 border-[#BBF7D0] text-center space-y-2">
            <p class="text-lg">✅ Message envoyé avec succès !</p>
            <p class="font-semibold text-[#0D7D53]/80">Notre équipe vous répond dans <strong>moins de 2h ouvrables</strong> via WhatsApp ou email.</p>
            <a href="thank-you.php?type=contact" class="inline-block mt-2 text-xs text-[#1677FF] font-bold hover:underline">Voir la page de confirmation →</a>
        </div>
    <?php endif; ?>


    <?php if ($error): ?>
        <div class="p-4 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 text-center">
            <?= htmlspecialchars($error) ?>
        </div>
    <?php endif; ?>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        <!-- Contact Form (gauche) -->
        <form method="POST" action="contact.php" enctype="application/x-www-form-urlencoded" class="card-clean p-6 space-y-4 text-xs">
            <?= getCSRFInputField() ?>
            <?= SecurityShield::getHoneypotHtml('website_url_hp') ?>
            <div>

                <label for="contact-name" class="block font-bold text-[#182230] mb-1">Nom et Prénom</label>
                <input id="contact-name" type="text" name="name" required autocomplete="name" placeholder="Ex: Amadou Diallo" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>

            <div>
                <label for="contact-email" class="block font-bold text-[#182230] mb-1">Adresse Email</label>
                <input id="contact-email" type="email" name="email" required autocomplete="email" placeholder="nom@exemple.com" class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
            </div>

            <div>
                <label for="contact-subject" class="block font-bold text-[#182230] mb-1">Sujet</label>
                <select id="contact-subject" name="subject" required class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]">
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Suivi de commande">Suivi de commande</option>
                    <option value="Question sur un produit">Question sur un produit</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre</option>
                </select>
            </div>

            <div>
                <label for="contact-message" class="block font-bold text-[#182230] mb-1">Message</label>
                <textarea id="contact-message" name="message" rows="4" required placeholder="Écrivez votre message..." class="w-full bg-[#F3F7FC] border border-[#E8EDF3] p-3 rounded-xl font-medium focus:outline-none focus:border-[#1677FF]"></textarea>
            </div>

            <button type="submit" class="cursor-pointer btn-electric w-full text-center py-3 text-xs uppercase font-extrabold flex items-center justify-center gap-2 focus:ring-2 focus:ring-white transition-colors duration-200">
                <i data-lucide="send" class="w-4 h-4"></i> Envoyer le Message
            </button>
        </form>

        <!-- Infos (droite) -->
        <div class="space-y-4">
            
            <a href="https://wa.me/<?= $waRaw ?>" target="_blank" rel="noopener noreferrer" class="cursor-pointer block card-clean p-5 hover:border-[#25D366] transition-colors duration-200 border-2 border-transparent bg-white group">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:text-[#182230] transition-colors duration-200">
                        <i data-lucide="message-circle" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-[#182230]">WhatsApp Direct</h3>
                        <p class="text-xs text-[#667085]"><?= htmlspecialchars($contactPhone) ?> (Réponse rapide)</p>
                    </div>
                </div>
            </a>

            <div class="card-clean p-5 flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#0B54C2] flex items-center justify-center">
                    <i data-lucide="mail" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-[#182230]">Email Support</h3>
                    <p class="text-xs text-[#667085]"><?= htmlspecialchars($contactEmail) ?></p>
                </div>
            </div>

            <div class="card-clean p-5 flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-orange-100 text-[#C2410C] flex items-center justify-center">
                    <i data-lucide="clock" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-[#182230]">Horaires d'ouverture</h3>
                    <p class="text-xs text-[#667085]">Lun - Sam : 09h00 - 19h00</p>
                </div>
            </div>

            <div class="card-clean p-5 flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#F3F7FC] text-[#182230] flex items-center justify-center shrink-0">
                    <i data-lucide="map-pin" class="w-6 h-6"></i>
                </div>
                <div class="flex-1 space-y-2">
                    <div>
                        <h3 class="text-sm font-bold text-[#182230]">Notre Showroom & Retrait Express</h3>
                        <p class="text-xs text-[#667085]">Avenue Cheikh Anta Diop, Dakar, Sénégal</p>
                    </div>
                    
                    <!-- Carte Visuelle & Itinéraire -->
                    <div class="w-full bg-[#EAF3FF] rounded-2xl overflow-hidden border border-[#1677FF]/20 p-4 space-y-2 text-center">
                        <div class="flex items-center justify-center gap-2 text-[#0B54C2] font-black text-xs">
                            <i data-lucide="navigation" class="w-4 h-4"></i>
                            <span>Position GPS : 14.6928° N, 17.4467° W</span>
                        </div>
                        <p class="text-[11px] text-[#475467]">Showroom climatisé avec essai gratuit de tous les accessoires audio et chargeurs GaN.</p>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=14.6928,-17.4467" target="_blank" rel="noopener noreferrer" class="btn-electric py-2 px-4 rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-sm">
                            <i data-lucide="map" class="w-3.5 h-3.5"></i>
                            <span>Calculer mon itinéraire Google Maps →</span>
                        </a>
                    </div>
                </div>
            </div>
            
        </div>

    </div>

    <!-- ─── SECTION FAQ & QUESTIONS FRÉQUENTES (Schema.org FAQPage) ────────── -->
    <div class="card-clean p-6 sm:p-8 space-y-6">
        <div class="text-center space-y-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full inline-block">Assistance & Réponses Rapides</span>
            <h2 class="text-xl font-extrabold text-[#182230]">Foire Aux Questions (FAQ)</h2>
            <p class="text-xs text-[#667085]">Tout ce que vous devez savoir sur vos achats, livraisons et garanties.</p>
        </div>

        <div class="divide-y divide-[#E8EDF3] text-xs">
            
            <details class="py-3.5 group" open>
                <summary class="font-bold text-[#182230] cursor-pointer flex items-center justify-between group-hover:text-[#1677FF] transition-colors">
                    <span>⚡ Quels sont les délais de livraison à Dakar et en région ?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#667085] transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="pt-2 text-[#475467] leading-relaxed">
                    À <strong>Dakar (Plateau, Almadies, Mermoz, Maristes, Guédiawaye, etc.)</strong>, nos livreurs dédiés vous livrent en **2h à 4h chrono**. Pour les autres régions du Sénégal (Thiès, Saint-Louis, Mbour, Ziguinchor), la livraison s'effectue sous **24h à 48h** via nos partenaires logistiques certifiés.
                </p>
            </details>

            <details class="py-3.5 group">
                <summary class="font-bold text-[#182230] cursor-pointer flex items-center justify-between group-hover:text-[#1677FF] transition-colors">
                    <span>💵 Quels sont les modes de paiement acceptés ?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#667085] transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="pt-2 text-[#475467] leading-relaxed">
                    Vous pouvez régler directement en ligne ou à la réception de votre colis via <strong>Wave</strong>, <strong>Orange Money</strong>, <strong>Carte Bancaire (Visa/Mastercard)</strong> ou en <strong>espèces (Paiement à la livraison)</strong> sans frais supplémentaires.
                </p>
            </details>

            <details class="py-3.5 group">
                <summary class="font-bold text-[#182230] cursor-pointer flex items-center justify-between group-hover:text-[#1677FF] transition-colors">
                    <span>🛡️ Quelle est la garantie sur les produits ?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#667085] transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="pt-2 text-[#475467] leading-relaxed">
                    Tous nos produits sont <strong>100% originaux et certifiés</strong> avec une <strong>garantie constructeur de 12 mois</strong>. En cas de défaut de fabrication, nous effectuons un échange standard immédiat à neuf.
                </p>
            </details>

            <details class="py-3.5 group">
                <summary class="font-bold text-[#182230] cursor-pointer flex items-center justify-between group-hover:text-[#1677FF] transition-colors">
                    <span>🔄 Comment fonctionne la politique de retour ?</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#667085] transition-transform group-open:rotate-180"></i>
                </summary>
                <p class="pt-2 text-[#475467] leading-relaxed">
                    Vous disposez de <strong>7 jours</strong> à compter de la réception pour tester votre article. Si vous n'êtes pas entièrement satisfait, nous organisons la reprise et le remboursement intégral de votre commande.
                </p>
            </details>

        </div>
    </div>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
