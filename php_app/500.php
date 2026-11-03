<?php
/**
 * =============================================================================
 * SenTechPLUS — Page 500 Personnalisée (Erreur Serveur Temporaire)
 * =============================================================================
 */
http_response_code(500);
@require_once __DIR__ . '/config/config.php';

$pageTitle = "500 — Maintenance / Erreur Serveur | SenTechPLUS";
$metaDescription = "Nos serveurs rencontrent un léger ralentissement temporaire. Nos équipes techniques sont déjà mobilisées.";

if (file_exists(__DIR__ . '/includes/header.php')) {
    require_once __DIR__ . '/includes/header.php';
    require_once __DIR__ . '/includes/navbar.php';
}
?>

<main id="main-content" class="bg-[#F4F7FB] min-h-[70vh] flex items-center justify-center px-4 py-12">
  <div class="max-w-xl w-full mx-auto text-center space-y-6">

    <!-- Card 500 -->
    <div class="card-clean p-8 sm:p-12 text-center space-y-6 shadow-xl border border-[#E8EDF3]">

      <!-- Illustration -->
      <div class="relative flex items-center justify-center h-24">
        <span class="text-7xl sm:text-8xl font-black text-[#1677FF]/10 tracking-tighter select-none">500</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shadow-md">
            <i data-lucide="wrench" class="w-8 h-8 animate-pulse"></i>
          </div>
        </div>
      </div>

      <!-- Titre & Message -->
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">Intervention Technique en Cours</h1>
        <p class="text-xs sm:text-sm text-[#667085] leading-relaxed max-w-md mx-auto">
          Nos serveurs traitent une mise à jour d'optimisation. Vos données et vos commandes en cours sont 100% en sécurité.
        </p>
      </div>

      <!-- Actions Rapides -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button type="button" onclick="window.location.reload()" class="cursor-pointer btn-electric py-3 px-6 rounded-xl font-bold text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center active:scale-95 transition-all">
          <i data-lucide="refresh-cw" class="w-4 h-4"></i>
          <span>Réessayer maintenant</span>
        </button>

        <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20j'ai%20une%20question%20sur%20ma%20commande" target="_blank" rel="noopener noreferrer" class="cursor-pointer py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center shadow-xs transition-all">
          <i data-lucide="message-circle" class="w-4 h-4"></i>
          <span>Assistance WhatsApp</span>
        </a>
      </div>

      <!-- Footer Rassurance -->
      <div class="pt-6 border-t border-[#E8EDF3] grid grid-cols-2 gap-4 text-[11px] font-bold text-[#667085]">
        <div class="flex items-center justify-center gap-1.5">
          <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i>
          <span>Paiements Protégés</span>
        </div>
        <div class="flex items-center justify-center gap-1.5">
          <i data-lucide="truck" class="w-4 h-4 text-[#1677FF]"></i>
          <span>Livraisons Maintenues</span>
        </div>
      </div>

    </div>

  </div>
</main>

<?php 
if (file_exists(__DIR__ . '/includes/footer.php')) {
    require_once __DIR__ . '/includes/footer.php'; 
}
?>