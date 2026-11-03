<?php
require_once __DIR__ . '/config/config.php';
$pageTitle = "Charte d'Authenticité & Garantie 12 Mois — SenTechPLUS Dakar";
$metaDescription = "SenTechPLUS garantit 100% de produits certifiés d'origine sous scellé inviolable, sans intermédiaire, avec garantie constructeur 12 mois et livraison H+1 à Dakar.";
$canonicalUrl = "https://www.sentechplus.com/pricing.php";

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 flex-1 space-y-10">
    <!-- Breadcrumbs -->
    <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#667085] flex items-center gap-1.5">
        <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
        <span class="text-[#98A2B3]">/</span>
        <span class="text-[#182230] font-bold" aria-current="page">Charte de Confiance & Authenticité</span>
    </nav>

    <!-- Hero Header -->
    <div class="text-center space-y-3 max-w-2xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F8F0] text-[#085237] text-xs font-black uppercase tracking-wider border border-[#085237]/20">
            <i data-lucide="shield-check" class="w-4 h-4"></i> ZÉRO CONTREFAÇON • 100% DISTRIBUTEUR DIRECT
        </span>
        <h1 class="text-2xl sm:text-4xl font-black text-[#182230] tracking-tight">
            Le Sanctuaire de Confiance High-Tech de Dakar
        </h1>
        <p class="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Pour protéger nos clients du fléau des contrefaçons du marché informel, SenTechPLUS n'est <strong>pas une marketplace ouverte</strong> : nous sélectionnons et distribuons nous-mêmes chaque équipement directement auprès des marques mondiales.
        </p>
    </div>

    <!-- 4 Piliers Inviolables -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card-clean p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-apple-soft space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center font-black text-xl">
                🔒
            </div>
            <h3 class="text-sm font-black text-[#182230]">Scellé Inviolable</h3>
            <p class="text-xs text-[#667085] leading-relaxed">
                Tous nos colis sont scellés en entrepôt sous bande de sécurité thermique. Vous refusez le colis si le scellé est altéré.
            </p>
        </div>

        <div class="card-clean p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-apple-soft space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#085237] flex items-center justify-center font-black text-xl">
                ⚡
            </div>
            <h3 class="text-sm font-black text-[#182230]">Remplacement 24h</h3>
            <p class="text-xs text-[#667085] leading-relaxed">
                Garantie constructeur 12 mois intégrale (RMA direct). En cas de panne, un coursier passe vous déposer un neuf sous 24h.
            </p>
        </div>

        <div class="card-clean p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-apple-soft space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-[#FEF3F2] text-[#B42318] flex items-center justify-center font-black text-xl">
                🏆
            </div>
            <h3 class="text-sm font-black text-[#182230]">Marques Certifiées</h3>
            <p class="text-xs text-[#667085] leading-relaxed">
                Distribution officielle : Anker, Baseus, JBL, Oraimo, accessoires certifiés Apple MFi. Aucun produit tiers non vérifié.
            </p>
        </div>

        <div class="card-clean p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-apple-soft space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-black text-xl">
                🏍️
            </div>
            <h3 class="text-sm font-black text-[#182230]">Livraison H+1 Dakar</h3>
            <p class="text-xs text-[#667085] leading-relaxed">
                Flotte de motocyclistes dédiée à Dakar. Commandez en 1 clic Wave et recevez votre accessoire en moins de 90 minutes.
            </p>
        </div>
    </div>

    <!-- CTA Boutique -->
    <div class="card-clean p-8 rounded-3xl bg-gradient-to-r from-[#182230] to-[#0B54C2] text-white text-center space-y-4 shadow-xl">
        <h2 class="text-xl sm:text-2xl font-black">Découvrez nos Hero SKUs 100% Certifiés</h2>
        <p class="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
            Chargeurs rapides GaN 65W/100W, écouteurs à réduction active de bruit, montres connectées AMOLED sous garantie 1 an.
        </p>
        <div>
            <a href="shop.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-black text-xs px-6 py-3.5 rounded-full shadow-lg transition-transform active:scale-95">
                <span>Accéder à la boutique certifiée</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
