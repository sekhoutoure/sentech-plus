<?php
/**
 * =============================================================================
 * SenTechPLUS — Page 403 Personnalisée (Accès Refusé / Privilèges Insuffisants)
 * =============================================================================
 */
http_response_code(403);
@require_once __DIR__ . '/config/config.php';

$pageTitle = "403 — Accès Refusé | SenTechPLUS";
$metaDescription = "Vous n'avez pas les autorisations nécessaires pour accéder à cette ressource.";

if (file_exists(__DIR__ . '/includes/header.php')) {
    require_once __DIR__ . '/includes/header.php';
    require_once __DIR__ . '/includes/navbar.php';
}
?>

<main id="main-content" class="bg-[#F4F7FB] min-h-[70vh] flex items-center justify-center px-4 py-12">
  <div class="max-w-xl w-full mx-auto text-center space-y-6">

    <!-- Card 403 -->
    <div class="card-clean p-8 sm:p-12 text-center space-y-6 shadow-xl border border-[#E8EDF3]">

      <!-- Illustration -->
      <div class="relative flex items-center justify-center h-24">
        <span class="text-7xl sm:text-8xl font-black text-[#1677FF]/10 tracking-tighter select-none">403</span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-md">
            <i data-lucide="lock" class="w-8 h-8"></i>
          </div>
        </div>
      </div>

      <!-- Titre & Message -->
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-black text-[#182230] tracking-tight">Accès Restreint ou Protégé</h1>
        <p class="text-xs sm:text-sm text-[#667085] leading-relaxed max-w-md mx-auto">
          Cette zone nécessite des privilèges d'accès spécifiques ou une authentification valide.
        </p>
      </div>

      <!-- Actions Rapides -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a href="login.php" class="cursor-pointer btn-electric py-3 px-6 rounded-xl font-bold text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center active:scale-95 transition-all">
          <i data-lucide="log-in" class="w-4 h-4"></i>
          <span>Se connecter</span>
        </a>

        <a href="index.php" class="cursor-pointer py-3 px-6 rounded-xl bg-white border border-[#E8EDF3] hover:bg-[#F3F7FC] text-[#182230] font-bold text-xs inline-flex items-center gap-2 w-full sm:w-auto justify-center transition-all">
          <i data-lucide="home" class="w-4 h-4"></i>
          <span>Retour à l'accueil</span>
        </a>
      </div>

    </div>

  </div>
</main>

<?php 
if (file_exists(__DIR__ . '/includes/footer.php')) {
    require_once __DIR__ . '/includes/footer.php'; 
}
?>