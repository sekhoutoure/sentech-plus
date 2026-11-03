<?php
/**
 * SenTechPLUS — Page Etudes de Cas (Case Studies)
 */
require_once __DIR__ . '/config/config.php';
$pageTitle       = "Etudes de Cas — Succes Clients SenTechPLUS Dakar";
$metaDescription = "Decouvrez comment SenTechPLUS livre en 2h a Dakar, garantit 12 mois et rembourse en 24h. Vrais temoignages de clients satisfaits a travers tout le Senegal.";
$ogImage         = "assets/images/sentech_logo.webp";
$breadcrumbs     = [['label'=>'Etudes de Cas','url'=>null]];

$cases = [
    [
        'emoji'   => '🎧',
        'title'   => 'Livraison Express : 1h47 chrono a Dakar',
        'client'  => 'Moussa Diallo, Chef de Projet IT',
        'city'    => 'Plateau, Dakar',
        'context' => 'Moussa avait besoin d ecouteurs antibruit pour une visioconference importante a 14h. Il a commande a 11h45 sur SenTechPLUS.',
        'result'  => 'Livre a 13h32 — soit 1h47 apres sa commande. Les Sony WH-1000XM5 etaient authentiques, avec garantie et facture.',
        'metrics' => ['1h47','Delai de livraison'],
        'metrics2'=> ['100%','Authentique certifie'],
        'metrics3'=> ['0 FCFA','Frais de livraison'],
        'tags'    => ['Livraison express','Dakar','Sony'],
        'color'   => '#1677FF',
        'link'    => 'shop.php?category=audio',
    ],
    [
        'emoji'   => '⌚',
        'title'   => 'Echange Garanti en 18h sur une Montre Connectee',
        'client'  => 'Aminata Ndiaye, Enseignante',
        'city'    => 'Mermoz, Dakar',
        'context' => 'Aminata a recu une Galaxy Watch avec un bracelet legerement defectueux. Elle a contacte le support WhatsApp le lendemain matin.',
        'result'  => 'Une nouvelle montre parfaite lui a ete livree en 18h. Aucune question, aucun formulaire complexe. Juste un echange immediat.',
        'metrics' => ['18h','Echange realise'],
        'metrics2'=> ['5/5','Note donnee'],
        'metrics3'=> ['12 mois','Garantie active'],
        'tags'    => ['Garantie','SAV','Samsung'],
        'color'   => '#0D7D53',
        'link'    => 'shop.php?category=montres-connectees',
    ],
    [
        'emoji'   => '📦',
        'title'   => 'Livraison Interurbaine : Dakar → Thies en 22h',
        'client'  => 'Cheikh Toure, Etudiant en Informatique',
        'city'    => 'Thies',
        'context' => 'Cheikh vit a Thies et cherchait un chargeur GaN 65W introuvable dans sa ville. Il a commande le soir sur SenTechPLUS.',
        'result'  => 'Le chargeur est arrive a Thies le lendemain a 10h30, soit 22h apres sa commande. Paiement Wave, suivi SMS en temps reel.',
        'metrics' => ['22h','Livraison Thies'],
        'metrics2'=> ['Wave','Paiement fluide'],
        'metrics3'=> ['SMS','Suivi en temps reel'],
        'tags'    => ['Region','Thies','Chargeur GaN'],
        'color'   => '#F97316',
        'link'    => 'shop.php?category=chargeurs-cables',
    ],
];
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>
<main id="main-content" class="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-10">

  <?php require_once __DIR__ . '/includes/breadcrumb.php'; ?>

  <!-- Hero -->
  <div class="card-clean p-6 sm:p-10 bg-gradient-to-br from-white to-[#F0F6FF] text-center space-y-3">
    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-xs font-black uppercase tracking-wider">
      📊 Etudes de Cas Reelles
    </span>
    <h1 class="text-2xl sm:text-4xl font-black text-[#182230] tracking-tight">Ils nous ont fait confiance — et racontent</h1>
    <p class="text-sm text-[#667085] max-w-xl mx-auto">Des histoires vraies, des chiffres reels, des clients satisfaits. Voici pourquoi SenTechPLUS est la reference High-Tech au Senegal.</p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <div class="flex items-center gap-1.5 text-xs font-bold text-[#182230]">
        <span class="text-[#F59E0B]">★★★★★</span> 4.9/5 sur 200+ avis
      </div>
      <div class="w-px h-4 bg-[#E2E8F0]"></div>
      <div class="text-xs font-bold text-[#182230]">⚡ Livraison 2h Dakar</div>
      <div class="w-px h-4 bg-[#E2E8F0]"></div>
      <div class="text-xs font-bold text-[#182230]">🛡️ Garantie 12 mois</div>
    </div>
  </div>

  <!-- Etudes de cas -->
  <div class="space-y-8">
    <?php foreach ($cases as $i => $case): ?>
    <article class="card-clean overflow-hidden">
      <div class="flex flex-col lg:flex-row">
        <!-- Panneau couleur -->
        <div class="lg:w-72 p-6 flex flex-col gap-4 text-white" style="background-color:<?= $case['color'] ?>">
          <div class="text-4xl"><?= $case['emoji'] ?></div>
          <h2 class="text-lg font-black leading-snug"><?= htmlspecialchars($case['title']) ?></h2>
          <div class="space-y-1 mt-auto">
            <p class="text-sm font-bold opacity-90"><?= htmlspecialchars($case['client']) ?></p>
            <p class="text-xs opacity-75 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <?= htmlspecialchars($case['city']) ?>
            </p>
          </div>
        </div>
        <!-- Contenu -->
        <div class="flex-1 p-6 space-y-5">
          <!-- Metriques -->
          <div class="grid grid-cols-3 gap-3">
            <?php foreach ([[$case['metrics'],$case['metrics2'],$case['metrics3']]] as $mgroups): foreach ($mgroups as $m): ?>
            <div class="text-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E8EDF3]">
              <p class="text-lg sm:text-xl font-black text-[#182230]"><?= $m[0] ?></p>
              <p class="text-[10px] text-[#667085] font-semibold mt-0.5"><?= $m[1] ?></p>
            </div>
            <?php endforeach; endforeach; ?>
          </div>
          <!-- Histoire -->
          <div class="space-y-2">
            <h3 class="text-xs font-black text-[#667085] uppercase tracking-wider">Le contexte</h3>
            <p class="text-sm text-[#475569] leading-relaxed"><?= htmlspecialchars($case['context']) ?></p>
          </div>
          <div class="space-y-2">
            <h3 class="text-xs font-black text-[#0D7D53] uppercase tracking-wider">✅ Le resultat</h3>
            <p class="text-sm text-[#182230] font-semibold leading-relaxed"><?= htmlspecialchars($case['result']) ?></p>
          </div>
          <!-- Tags + CTA -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
            <div class="flex flex-wrap gap-1.5">
              <?php foreach ($case['tags'] as $tag): ?>
              <span class="px-2.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] text-[10px] font-bold"><?= htmlspecialchars($tag) ?></span>
              <?php endforeach; ?>
            </div>
            <a href="<?= htmlspecialchars($case['link']) ?>"
               class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1677FF] hover:underline underline-offset-2">
              Voir les produits →
            </a>
          </div>
        </div>
      </div>
    </article>
    <?php endforeach; ?>
  </div>

  <!-- Avis clients -->
  <div class="pt-4">
    <?php $reviewsTitle="200+ clients parlent de nous"; $reviewsMax=3; require_once __DIR__ . '/includes/reviews_widget.php'; ?>
  </div>

  <!-- CTA final -->
  <div class="card-clean p-6 sm:p-10 bg-gradient-to-r from-[#1677FF] to-[#0B54C2] text-white text-center space-y-4">
    <h2 class="text-xl sm:text-2xl font-black">Ecrivez votre propre histoire avec SenTechPLUS</h2>
    <p class="text-sm text-blue-100">Rejoignez plus de 200 clients satisfaits a Dakar et dans tout le Senegal.</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="shop.php" class="btn-electric bg-white !text-[#1677FF] hover:bg-blue-50 font-black text-sm px-8 py-3 rounded-xl w-full sm:w-auto text-center">
        Decouvrir le catalogue
      </a>
      <a href="https://wa.me/221781316497?text=Bonjour, je veux commander"
         target="_blank" rel="noopener"
         class="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-black text-sm px-6 py-3 rounded-xl w-full sm:w-auto">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Commander par WhatsApp
      </a>
    </div>
  </div>

</main>
<?php require_once __DIR__ . '/includes/footer.php'; ?>