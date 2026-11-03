<?php
/**
 * SenTechPLUS — Page de Remerciement (Thank You Page)
 * Affichee apres une commande, un formulaire de contact, ou une inscription
 */
require_once __DIR__ . '/config/config.php';

// Determiner le type d action (commande, contact, newsletter)
$type    = sanitize($_GET['type'] ?? 'order');
$orderId = sanitize($_GET['order'] ?? '');
$name    = sanitize($_GET['name'] ?? '');

$configs = [
    'order' => [
        'icon'     => '✅',
        'title'    => 'Commande confirmee !',
        'subtitle' => $orderId ? "Votre commande #".htmlspecialchars($orderId)." a ete recue." : "Votre commande a bien ete recue.",
        'promise'  => "Notre equipe vous contacte sous 30 minutes pour confirmer la livraison.",
        'color'    => '#0D7D53',
        'bg'       => '#F0FDF4',
        'border'   => '#BBF7D0',
    ],
    'contact' => [
        'icon'     => '📬',
        'title'    => 'Message bien recu !',
        'subtitle' => "Merci de nous avoir contactes. Nous avons bien recu votre message.",
        'promise'  => "Notre equipe vous repond sur WhatsApp ou par email dans les 2h ouvrables.",
        'color'    => '#1677FF',
        'bg'       => '#EAF3FF',
        'border'   => '#BFDBFE',
    ],
    'newsletter' => [
        'icon'     => '🎉',
        'title'    => 'Inscription confirmee !',
        'subtitle' => "Bienvenue dans la communaute SenTechPLUS.",
        'promise'  => "Vous recevrez en avant-premiere nos meilleures offres et nouveautes High-Tech.",
        'color'    => '#7C3AED',
        'bg'       => '#F5F3FF',
        'border'   => '#DDD6FE',
    ],
];
$cfg = $configs[$type] ?? $configs['order'];

$pageTitle       = "Merci ! — SenTechPLUS Dakar";
$metaDescription = "Votre demande a bien ete prise en compte par SenTechPLUS. Notre equipe vous repond dans les plus brefs delais.";
$noIndex = true; // Ne pas indexer cette page de conversion
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>
<main id="main-content" class="min-h-[80vh] flex items-center justify-center bg-[#F4F7FB] px-4 py-10">
  <div class="max-w-lg w-full space-y-6 text-center">

    <!-- Icone de succes animee -->
    <div class="flex items-center justify-center">
      <div class="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg border-2 animate-fade-in"
           style="background-color:<?= $cfg['bg'] ?>; border-color:<?= $cfg['border'] ?>">
        <?= $cfg['icon'] ?>
      </div>
    </div>

    <!-- Titre et sous-titre -->
    <div class="space-y-2 animate-fade-in">
      <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">
        <?php if ($name): ?>Merci <?= htmlspecialchars($name) ?> ! <?php endif; ?>
        <?= $cfg['title'] ?>
      </h1>
      <p class="text-sm text-[#667085] leading-relaxed"><?= $cfg['subtitle'] ?></p>
    </div>

    <!-- Promesse de reponse -->
    <div class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 animate-fade-in"
         style="background-color:<?= $cfg['bg'] ?>; border-color:<?= $cfg['border'] ?>; color:<?= $cfg['color'] ?>">
      <span class="w-2.5 h-2.5 rounded-full animate-pulse inline-block" style="background-color:<?= $cfg['color'] ?>"></span>
      <?= $cfg['promise'] ?>
    </div>

    <!-- Etapes rapides -->
    <?php if ($type === 'order'): ?>
    <div class="card-clean p-5 text-left space-y-3">
      <p class="text-xs font-black text-[#667085] uppercase tracking-wider">Prochaines etapes</p>
      <div class="space-y-2.5">
        <?php foreach ([
            ['🔔','Confirmation','SMS et WhatsApp sous 30 min'],
            ['📦','Preparation','Votre colis est prepare avec soin'],
            ['🚴','Livraison','Livraison express 2h a Dakar'],
        ] as [$icon,$step,$desc]): ?>
        <div class="flex items-center gap-3">
          <span class="text-xl w-8 flex-shrink-0"><?= $icon ?></span>
          <div>
            <p class="text-xs font-black text-[#182230]"><?= $step ?></p>
            <p class="text-[11px] text-[#667085]"><?= $desc ?></p>
          </div>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
    <?php endif; ?>

    <!-- Liens internes strategiques -->
    <div class="grid grid-cols-2 gap-3">
      <a href="shop.php"
         class="card-clean p-4 flex flex-col items-center gap-2 hover:border-[#1677FF] transition-colors group">
        <span class="text-2xl">🛍️</span>
        <span class="text-xs font-bold text-[#182230] group-hover:text-[#1677FF] transition-colors">Continuer mes achats</span>
      </a>
      <?php if ($orderId): ?>
      <a href="tracking.php?order=<?= urlencode($orderId) ?>"
         class="card-clean p-4 flex flex-col items-center gap-2 hover:border-[#0D7D53] transition-colors group">
        <span class="text-2xl">📍</span>
        <span class="text-xs font-bold text-[#182230] group-hover:text-[#0D7D53] transition-colors">Suivre ma commande</span>
      </a>
      <?php else: ?>
      <a href="index.php"
         class="card-clean p-4 flex flex-col items-center gap-2 hover:border-[#0D7D53] transition-colors group">
        <span class="text-2xl">🏠</span>
        <span class="text-xs font-bold text-[#182230] group-hover:text-[#0D7D53] transition-colors">Retour a l accueil</span>
      </a>
      <?php endif; ?>
      <a href="faq.php"
         class="card-clean p-4 flex flex-col items-center gap-2 hover:border-[#F97316] transition-colors group">
        <span class="text-2xl">❓</span>
        <span class="text-xs font-bold text-[#182230] group-hover:text-[#F97316] transition-colors">Consulter la FAQ</span>
      </a>
      <a href="contact.php"
         class="card-clean p-4 flex flex-col items-center gap-2 hover:border-[#7C3AED] transition-colors group">
        <span class="text-2xl">💬</span>
        <span class="text-xs font-bold text-[#182230] group-hover:text-[#7C3AED] transition-colors">Nous contacter</span>
      </a>
    </div>

    <!-- CTA WhatsApp mobile plein-largeur -->
    <a href="https://wa.me/221781316497?text=Bonjour SenTechPLUS, je viens de passer une commande"
       target="_blank" rel="noopener"
       class="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-sm px-6 py-4 rounded-2xl transition-colors shadow-lg">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Suivre sur WhatsApp (+221 78 131 64 97)
    </a>

    <!-- Mini avis -->
    <div class="pt-4 border-t border-[#E8EDF3]">
      <p class="text-xs text-[#94A3B8] font-semibold mb-4">Ils ont deja commande et sont satisfaits :</p>
      <?php $reviewsTitle=""; $reviewsMax=2; require_once __DIR__ . '/includes/reviews_widget.php'; ?>
    </div>

  </div>
</main>
<?php require_once __DIR__ . '/includes/footer.php'; ?>