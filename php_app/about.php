<?php
require_once __DIR__ . '/config/config.php';

$pageTitle       = "À Propos — SenTechPLUS Dakar High-Tech";
$metaDescription = "SenTechPLUS, référence High-Tech au Sénégal : accessoires certifiés, livraison express 2h à Dakar et paiement Wave/OM. Découvrez notre mission et équipe.";
$canonicalUrl    = "https://www.sentechplus.com/about.php";

$pdo = getDBConnection();
$teamMembers = [];
if ($pdo) {
    try {
        $stmtTeam = $pdo->query("SELECT * FROM team_members WHERE is_active = 1 ORDER BY display_order ASC");
        $teamMembers = $stmtTeam ? $stmtTeam->fetchAll(PDO::FETCH_ASSOC) : [];
    } catch (Throwable $e) {}
}

if (empty($teamMembers)) {
    $teamMembers = [
        ['name' => 'Mamadou Ndiaye', 'role' => 'Fondateur & DG', 'image' => 'assets/images/profile_pic1.webp'],
        ['name' => 'Aïssatou Diop', 'role' => 'Resp. Expérience Client', 'image' => 'assets/images/profile_pic2.webp'],
        ['name' => 'Babacar Sarr', 'role' => 'Resp. Logistique & Express', 'image' => 'assets/images/profile_pic3.webp'],
    ];
}

$schemaJson = json_encode([
    "@context" => "https://schema.org",
    "@type"    => "AboutPage",
    "name"     => "À Propos de SenTechPLUS",
    "description" => $metaDescription,
    "url"      => "https://www.sentechplus.com/about.php",
    "publisher" => [
        "@type" => "Organization",
        "name"  => "SenTechPLUS",
        "url"   => "https://www.sentechplus.com/",
        "logo"  => ["@type" => "ImageObject", "url" => "https://www.sentechplus.com/assets/images/sentech_logo.webp"],
        "contactPoint" => ["@type" => "ContactPoint", "telephone" => getSiteSetting('support_phone', defined('WHATSAPP_DISPLAY') ? WHATSAPP_DISPLAY : '+221 78 131 64 97'), "contactType" => "customer service"]
    ]
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
// Inject Schema.org JSON-LD
echo "<script type=\"application/ld+json\">{$schemaJson}</script>\n";
?>


<!-- Hero Section -->
<div class="bg-gradient-to-br from-[#1677FF] to-[#0B54C2] text-white py-16 px-4">
    <div class="max-w-[1000px] mx-auto text-center space-y-4">
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight">Redéfinir le High-Tech au Sénégal</h1>
        <p class="text-sm md:text-base text-blue-100 max-w-2xl mx-auto">
            SenTechPLUS est votre partenaire de confiance pour les meilleurs produits électroniques, combinant qualité, authenticité et service exceptionnel.
        </p>
    </div>
</div>

<main id="main-content" class="max-w-[1000px] mx-auto px-4 sm:px-6 py-6 flex-1 space-y-10">

    <!-- Breadcrumbs Navigation -->
    <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#667085] flex items-center gap-1.5">
        <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
        <span class="text-[#98A2B3]">/</span>
        <span class="text-[#182230] font-bold" aria-current="page">À Propos de Nous</span>
    </nav>

    <!-- Mission & Vision -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="space-y-4">
            <h2 class="text-2xl font-extrabold text-[#182230]">Notre Mission</h2>
            <p class="text-sm text-[#667085] leading-relaxed">
                Créé avec une vision claire, SenTechPLUS s'engage à fournir les meilleures innovations technologiques directement à votre porte. Nous sélectionnons rigoureusement nos fournisseurs pour vous garantir des produits originaux et performants.
            </p>
            <p class="text-sm text-[#667085] leading-relaxed">
                Notre objectif est de bâtir une communauté de passionnés de technologie, où la confiance et la satisfaction client sont nos priorités absolues.
            </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <!-- Stats -->
            <div class="card-clean p-4 text-center space-y-1">
                <div class="text-2xl font-black text-[#1677FF]">500+</div>
                <div class="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Produits</div>
            </div>
            <div class="card-clean p-4 text-center space-y-1">
                <div class="text-2xl font-black text-[#0D7D53]">1000+</div>
                <div class="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Clients</div>
            </div>
            <div class="card-clean p-4 text-center space-y-1">
                <div class="text-2xl font-black text-[#C2410C] flex justify-center"><i data-lucide="truck" class="w-8 h-8"></i></div>
                <div class="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Livraison Express</div>
            </div>
            <div class="card-clean p-4 text-center space-y-1">
                <div class="text-2xl font-black text-[#0B54C2] flex justify-center"><i data-lucide="headphones" class="w-8 h-8"></i></div>
                <div class="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Support 7j/7</div>
            </div>
        </div>
    </div>

    <!-- ─── ÉTUDES DE CAS & DÉPLOIEMENTS B2B AU SÉNÉGAL ─────────────────── -->
    <div class="space-y-6 pt-4 border-t border-[#E8EDF3]">
        <div class="text-center space-y-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full inline-block">Succès Clients & Partenaires Pro</span>
            <h2 class="text-2xl font-extrabold text-[#182230]">Études de Cas & Déploiements d'Entreprises</h2>
            <p class="text-xs text-[#667085]">Découvrez comment SenTechPLUS équipe les startups, cabinets et PME au Sénégal.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            <!-- Cas 1 -->
            <div class="card-clean p-5 space-y-3 bg-white hover:border-[#1677FF] transition-all">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#1677FF] flex items-center justify-center font-bold">
                    <i data-lucide="building-2" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold text-[#1677FF] uppercase tracking-wider block">Coworking Dakar Plateau</span>
                    <h3 class="font-extrabold text-sm text-[#182230] mt-0.5">Équipement Haute Densité en Stations GaN</h3>
                </div>
                <p class="text-[#667085] leading-relaxed">
                    Déploiement de 45 chargeurs 100W GaN et hubs USB-C 10-en-1 pour 120 postes de travail nomades. Zéro surchauffe et charge ultra-rapide multi-appareils.
                </p>
                <div class="pt-2 border-t border-[#E8EDF3] flex items-center justify-between text-[11px] font-bold text-[#0D7D53]">
                    <span>Gain productivité +40%</span>
                    <span>100% Satisfait ★★★★★</span>
                </div>
            </div>

            <!-- Cas 2 -->
            <div class="card-clean p-5 space-y-3 bg-white hover:border-[#0D7D53] transition-all">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-[#0D7D53] flex items-center justify-center font-bold">
                    <i data-lucide="headset" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold text-[#0D7D53] uppercase tracking-wider block">Centre d'Appels & BPO Mermoz</span>
                    <h3 class="font-extrabold text-sm text-[#182230] mt-0.5">Casques ANC & Réduction de Bruit Active</h3>
                </div>
                <p class="text-[#667085] leading-relaxed">
                    Fourniture de 80 casques certifiés avec isolation acoustique et microphones directionnels pour téléconseillers. Clarté vocale cristalline garantie.
                </p>
                <div class="pt-2 border-t border-[#E8EDF3] flex items-center justify-between text-[11px] font-bold text-[#0D7D53]">
                    <span>Livraison 24h à Dakar</span>
                    <span>Garantie 12 mois</span>
                </div>
            </div>

            <!-- Cas 3 -->
            <div class="card-clean p-5 space-y-3 bg-white hover:border-[#C2410C] transition-all">
                <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center font-bold">
                    <i data-lucide="laptop" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="text-[10px] font-extrabold text-[#C2410C] uppercase tracking-wider block">Cabinet Conseil & Audit Almadies</span>
                    <h3 class="font-extrabold text-sm text-[#182230] mt-0.5">Kits Mobiles Cadres & Écrans Nomades</h3>
                </div>
                <p class="text-[#667085] leading-relaxed">
                    Kits exécutifs composés de powerbanks 20000mAh 65W, claviers sans fil rétroéclairés et supports ergonomiques pour consultants en déplacement.
                </p>
                <div class="pt-2 border-t border-[#E8EDF3] flex items-center justify-between text-[11px] font-bold text-[#0D7D53]">
                    <span>Autonomie 72h</span>
                    <span>Paiement Wave Pro</span>
                </div>
            </div>

        </div>
    </div>

    <!-- Team -->
    <div class="space-y-6 pt-4 border-t border-[#E8EDF3]">
        <div class="text-center space-y-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full inline-block">L'Équipe SenTechPLUS</span>
            <h2 class="text-2xl font-extrabold text-[#182230]">Des Passionnés au Service de Votre Expérience</h2>
            <p class="text-xs text-[#667085]">Basés à Dakar, nos experts sélectionnent et testent chaque équipement avant livraison.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <?php foreach ($teamMembers as $tm): 
                $tmImg = !empty($tm['image']) ? $tm['image'] : 'assets/images/profile_pic1.webp';
                $tmRole = $tm['role'] ?? 'Équipe SenTechPLUS';
            ?>
                <div class="card-clean p-5 text-center space-y-3 bg-white rounded-2xl border border-[#E8EDF3]">
                    <div class="w-20 h-20 mx-auto rounded-full bg-[#EAF3FF] overflow-hidden border border-[#E8EDF3]">
                        <img src="<?= htmlspecialchars($tmImg) ?>" alt="<?= htmlspecialchars($tm['name']) ?> - SenTechPLUS" style="aspect-ratio:1/1;" class="w-full h-full object-cover" loading="lazy" width="80" height="80">
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-[#182230]"><?= htmlspecialchars($tm['name']) ?></h3>
                        <p class="text-xs text-[#1677FF] font-medium"><?= htmlspecialchars($tmRole) ?></p>
                    </div>
                    <?php if (!empty($tm['bio'])): ?>
                        <p class="text-[11px] text-[#667085] leading-relaxed line-clamp-2"><?= htmlspecialchars($tm['bio']) ?></p>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- ─── Etudes de Cas ────────────────────────────────────── -->
    <div class="space-y-5 pt-4">
        <div class="flex items-center justify-between">
            <h2 class="text-xl sm:text-2xl font-black text-[#182230] tracking-tight">📊 Nos Clients en Action</h2>
            <a href="case-studies.php" class="text-xs font-bold text-[#1677FF] hover:underline underline-offset-2">Voir tous les cas →</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <?php foreach ([
                ['🚴','1h47 Chrono','Livraison express a Dakar Plateau','#1677FF','#EAF3FF'],
                ['🔄','18h SAV','Echange garanti sans friction','#0D7D53','#F0FDF4'],
                ['📦','22h Region','Livraison Dakar → Thies','#F97316','#FFF7ED'],
            ] as [$icon,$metric,$desc,$c,$bg]): ?>
            <a href="case-studies.php"
               class="card-clean p-5 flex items-start gap-3 hover:border-[<?= $c ?>] transition-colors group">
                <span class="text-3xl flex-shrink-0"><?= $icon ?></span>
                <div>
                    <p class="text-lg font-black" style="color:<?= $c ?>"><?= $metric ?></p>
                    <p class="text-xs text-[#667085] font-semibold mt-0.5"><?= $desc ?></p>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- ─── Avis Clients ─────────────────────────────────────── -->
    <div class="pt-2">
        <?php $reviewsTitle = "Ils parlent de nous"; $reviewsMax = 3; require_once __DIR__ . '/includes/reviews_widget.php'; ?>
    </div>

    <!-- ─── Liens Internes + CTA ─────────────────────────────── -->
    <div class="card-clean p-6 sm:p-8 bg-gradient-to-r from-[#1677FF] to-[#0B54C2] text-white text-center space-y-4">
        <h2 class="text-xl font-black">Pret a decouvrir notre catalogue ?</h2>
        <p class="text-sm text-blue-100">Livraison 2h Dakar · Paiement Wave & Orange Money · Garantie 12 mois</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="shop.php" class="bg-white text-[#1677FF] font-black text-sm px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors w-full sm:w-auto text-center">
                Voir le catalogue →
            </a>
            <a href="contact.php" class="bg-white/15 border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/25 transition-colors w-full sm:w-auto text-center">
                Nous contacter
            </a>
            <a href="faq.php" class="bg-white/15 border border-white/30 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/25 transition-colors w-full sm:w-auto text-center">
                FAQ & Aide
            </a>
        </div>
    </div>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
