<?php
/**
 * =============================================================================
 * SenTechPLUS — Page 404 Personnalisée (Page Non Trouvée)
 * =============================================================================
 */
http_response_code(404);
require_once __DIR__ . '/config/config.php';

$pageTitle = "404 — Page Introuvable | SenTechPLUS Dakar";
$metaDescription = "La page que vous recherchez n'existe pas ou a été déplacée. Découvrez nos produits High-Tech certifiés et profitez de la livraison rapide à Dakar.";
$breadcrumbs = [['label' => '404 — Page Introuvable', 'url' => null]];

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="bg-[#F4F7FB] px-4 py-8 sm:py-12">
  <div class="max-w-2xl mx-auto space-y-8">

    <?php require_once __DIR__ . '/includes/breadcrumb.php'; ?>

    <!-- Hero 404 - Visible immédiatement sans défilement -->
    <div class="card-clean p-8 sm:p-10 text-center space-y-5">

      <!-- Illustration 404 -->
      <div class="relative flex items-center justify-center h-28">
        <span class="text-8xl sm:text-9xl font-black text-[#1677FF]/10 tracking-tighter select-none">404</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-2xl bg-white shadow-lg border border-[#E8EDF3] flex items-center justify-center text-[#1677FF]">
            <i data-lucide="compass" class="w-8 h-8 animate-spin-slow"></i>
          </div>
        </div>
      </div>

      <!-- Titre & Explication -->
      <div class="space-y-1.5">
        <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">Oups ! Page introuvable</h1>
        <p class="text-sm text-[#667085] leading-relaxed">
          Le produit ou la page que vous recherchez a peut-être changé d'adresse ou n'est plus disponible.
        </p>
      </div>

      <!-- Boutons d'action CTAs VISIBLES immédiatement (above the fold) -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="index.php" class="btn-electric py-3 px-6 rounded-xl font-black text-sm inline-flex items-center gap-2 w-full sm:w-auto justify-center">
          <i data-lucide="home" class="w-4 h-4"></i>
          Retour à l'accueil
        </a>
        <a href="shop.php" class="py-3 px-6 rounded-xl bg-white border-2 border-[#1677FF] text-[#1677FF] font-black text-sm inline-flex items-center gap-2 hover:bg-[#EAF3FF] transition-colors w-full sm:w-auto justify-center">
          <i data-lucide="shopping-bag" class="w-4 h-4"></i>
          Voir le catalogue
        </a>
        <a href="https://wa.me/221781316497?text=Bonjour, j'ai un problème sur votre site"
           target="_blank" rel="noopener"
           class="py-3 px-6 rounded-xl bg-[#25D366] text-white font-black text-sm inline-flex items-center gap-2 hover:bg-[#1DA851] transition-colors w-full sm:w-auto justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Aide WhatsApp
        </a>
      </div>
    </div>

    <!-- Moteur de Recherche Rapide -->
    <form action="shop.php" method="GET" class="relative max-w-md mx-auto">
      <input type="text" name="q" placeholder="Rechercher un produit... écouteurs, chargeur, montre..."
             class="w-full bg-white border-2 border-[#E8EDF3] py-3.5 pl-11 pr-28 rounded-2xl text-sm font-semibold text-[#182230] shadow-sm focus:outline-none focus:border-[#1677FF]" required>
      <svg class="w-5 h-5 text-[#667085] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 btn-electric py-2 px-4 rounded-xl text-xs font-black cursor-pointer">Chercher</button>
    </form>

    <!-- Liens Internes Stratégiques (6 destinations clés) -->
    <div class="space-y-3">
      <p class="text-xs font-black text-[#667085] uppercase tracking-wider text-center">Où voulez-vous aller ?</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <?php foreach ([
          ['🏠','Accueil','index.php','Retour à l\'accueil'],
          ['🛍️','Boutique','shop.php','Tout le catalogue'],
          ['🎧','Audio','shop.php?category=audio','Casques & écouteurs'],
          ['⚡','Chargeurs','shop.php?category=chargeurs-cables','GaN & USB-C'],
          ['❓','FAQ & Aide','faq.php','Questions fréquentes'],
          ['📞','Contact','contact.php','Parler à l\'équipe'],
          ['📊','Cas Clients','case-studies.php','Témoignages réels'],
          ['📍','Suivi Colis','tracking.php','Suivre ma commande'],
          ['🔒','Confidentialité','privacy.php','Données & vie privée'],
        ] as [$icon,$label,$url,$desc]): ?>
        <a href="<?= $url ?>" class="card-clean p-3.5 flex items-center gap-2.5 hover:border-[#1677FF] hover:bg-[#F8FBFF] transition-colors group">
          <span class="text-xl flex-shrink-0"><?= $icon ?></span>
          <div class="min-w-0">
            <p class="text-xs font-black text-[#182230] group-hover:text-[#1677FF] transition-colors truncate"><?= $label ?></p>
            <p class="text-[10px] text-[#94A3B8] font-semibold truncate"><?= $desc ?></p>
          </div>
        </a>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Promesse de réponse -->
    <div class="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
      <span class="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse flex-shrink-0"></span>
      <p class="text-xs sm:text-sm font-bold text-[#0D7D53]">Notre équipe vous répond sur WhatsApp en <strong>moins de 2h</strong> (Lun–Sam 8h30→20h)</p>
    </div>

    <!-- Avis clients pour rassurer -->
    <div class="pt-2">
      <?php $reviewsTitle = "Nos clients nous font confiance"; $reviewsMax = 2; require_once __DIR__ . '/includes/reviews_widget.php'; ?>
    </div>

  </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>

