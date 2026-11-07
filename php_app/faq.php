<?php
/**
 * SenTechPLUS — Page FAQ (5 Questions Frequemment Posees)
 */
require_once __DIR__ . '/config/config.php';
$pageTitle       = "FAQ — Questions Frequentes | SenTechPLUS Dakar";
$metaDescription = "Reponses a vos questions sur la livraison a Dakar, les modes de paiement Wave/Orange Money, la garantie 12 mois, les retours sous 7 jours et le support SenTechPLUS.";
$ogImage         = "assets/images/sentech_logo.webp";
$breadcrumbs     = [['label'=>'FAQ & Aide','url'=>null]];

$faqs = [];
$pdo = getDBConnection();
if ($pdo) {
    try {
        $stmtFaqs = $pdo->query("SELECT question as q, answer as a, category FROM faqs WHERE is_active = 1 ORDER BY display_order ASC, id ASC");
        $dbFaqs = $stmtFaqs ? $stmtFaqs->fetchAll(PDO::FETCH_ASSOC) : [];
        if (!empty($dbFaqs)) {
            $catIcons = [
                'Livraison' => '🚚',
                'Paiement'  => '💳',
                'Garantie'  => '🛡️',
                'Retours'   => '↩️',
                'Support'   => '💬'
            ];
            $defaultIcons = ['🚚', '💳', '🛡️', '↩️', '💬', '⚡', '📦', '📱'];
            foreach ($dbFaqs as $idx => $f) {
                $icon = $catIcons[$f['category'] ?? ''] ?? $defaultIcons[$idx % count($defaultIcons)];
                $faqs[] = [
                    'q'    => $f['q'],
                    'a'    => $f['a'],
                    'icon' => $icon
                ];
            }
        }
    } catch (Throwable $e) {}
}

if (empty($faqs)) {
    $faqs = [
        ['q'=>'Quels sont les delais de livraison a Dakar et en region ?',
         'a'=>'A Dakar intra-muros, nous livrons en 2h a 4h chrono apres confirmation de votre commande. Pour les regions senegalaises (Thies, Saint-Louis, Mbour, Ziguinchor, Touba), le delai est de 24h a 48h via nos partenaires logistiques. La livraison est gratuite pour toute commande superieure a 30 000 FCFA.',
         'icon'=>'🚚'],
        ['q'=>'Quels sont les modes de paiement acceptes ?',
         'a'=>'Nous acceptons tous les modes de paiement populaires au Senegal : Wave, Orange Money, Free Money, Carte Bancaire (Visa/Mastercard) via PayDunya, et le paiement en especes a la livraison. Tous les paiements en ligne sont cryptes et securises.',
         'icon'=>'💳'],
        ['q'=>'Quelle est la garantie sur les produits ?',
         'a'=>'Tous nos produits High-Tech sont certifies authentiques et couverts par une garantie 12 mois constructeur. En cas de panne dans ce delai, nous procedons a un echange immediat ou un remboursement intégral selon votre preference. Notre equipe technique est disponible pour tout diagnostic.',
         'icon'=>'🛡️'],
        ['q'=>'Comment fonctionne la politique de retour ?',
         'a'=>'Vous disposez de 7 jours ouvres apres reception pour retourner votre produit si vous n etes pas satisfait. Le produit doit etre dans son etat d origine avec tous ses accessoires. Le remboursement est effectue par le meme moyen de paiement que votre achat, dans un delai de 24h apres reception du retour.',
         'icon'=>'↩️'],
        ['q'=>'Comment contacter le support SenTechPLUS ?',
         'a'=>'Notre equipe est disponible du lundi au samedi de 8h30 a 20h00. Nous repondons sur WhatsApp au +221 78 131 64 97 en moins de 2h. Vous pouvez egalement nous ecrire via le formulaire de contact ou nous appeler directement. Nous nous engageons a repondre a toute demande dans un delai maximum de 4h ouvrées.',
         'icon'=>'💬'],
    ];
}

$schemaJsonLd = [
    "@context"   => "https://schema.org",
    "@type"      => "FAQPage",
    "mainEntity" => array_map(fn($f) => [
        "@type"          => "Question",
        "name"           => $f['q'],
        "acceptedAnswer" => ["@type"=>"Answer","text"=>$f['a']]
    ], $faqs)
];
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>
<main id="main-content" class="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex-1">

  <?php require_once __DIR__ . '/includes/breadcrumb.php'; ?>

  <!-- Hero -->
  <div class="card-clean p-6 sm:p-10 mb-8 bg-gradient-to-br from-white to-[#F0F6FF] text-center space-y-3">
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-xs font-black uppercase tracking-wider">
      ❓ Questions Frequentes
    </span>
    <h1 class="text-2xl sm:text-4xl font-black text-[#182230] tracking-tight">Tout ce que vous voulez savoir</h1>
    <p class="text-sm text-[#667085] max-w-xl mx-auto">Retrouvez les reponses aux questions les plus posees par nos clients. Besoin d'une aide specifique ?
      <a href="contact.php" class="text-[#1677FF] font-bold hover:underline">Contactez-nous →</a>
    </p>
    <!-- Promesse reponse -->
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#0D7D53] text-xs font-bold">
      <span class="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse inline-block"></span>
      Reponse garantie en moins de 2h ouvrables via WhatsApp
    </div>
  </div>

  <!-- Accordeon FAQ -->
  <div class="space-y-3 mb-10" id="faq-list">
    <?php foreach ($faqs as $i => $faq): ?>
    <div class="card-clean overflow-hidden" x-data="{open:<?= $i===0?'true':'false' ?>}">
      <button type="button" @click="open=!open"
              class="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#F8FAFC] transition-colors"
              :aria-expanded="open.toString()"
              aria-controls="faq-answer-<?= $i ?>">
        <div class="flex items-center gap-3">
          <span class="text-xl flex-shrink-0"><?= $faq['icon'] ?></span>
          <span class="text-sm sm:text-base font-bold text-[#182230]"><?= htmlspecialchars($faq['q']) ?></span>
        </div>
        <svg class="w-5 h-5 text-[#667085] flex-shrink-0 transition-transform duration-200" :class="open ? 'rotate-180' : ''"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="faq-answer-<?= $i ?>" x-show="open" x-collapse class="px-5 pb-5">
        <div class="flex gap-3">
          <div class="w-0.5 bg-[#1677FF]/20 rounded-full flex-shrink-0 ml-4"></div>
          <p class="text-sm text-[#475569] leading-relaxed"><?= htmlspecialchars($faq['a']) ?></p>
        </div>
      </div>
    </div>
    <?php endforeach; ?>
  </div>

  <!-- Bloc "Pas trouve la reponse ?" -->
  <div class="card-clean p-6 sm:p-8 bg-gradient-to-r from-[#1677FF] to-[#0B54C2] text-white text-center space-y-4">
    <h2 class="text-xl font-black">Pas trouve la reponse ?</h2>
    <p class="text-sm text-blue-100">Notre equipe repond sur WhatsApp en moins de 2h du lundi au samedi.</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="https://wa.me/221781316497?text=Bonjour SenTechPLUS, j'ai une question"
         target="_blank" rel="noopener"
         class="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-sm px-6 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp — Reponse en 2h
      </a>
      <a href="contact.php"
         class="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors w-full sm:w-auto justify-center border border-white/30">
        Formulaire de contact →
      </a>
    </div>
  </div>

  <!-- Avis clients -->
  <div class="mt-10">
    <?php $reviewsTitle="Nos clients satisfaits"; $reviewsMax=3; require_once __DIR__ . '/includes/reviews_widget.php'; ?>
  </div>

</main>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
<script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>