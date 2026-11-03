<?php
require_once __DIR__ . '/config/config.php';
$pageTitle = "Devenir Vendeur & Tarifs Marketplace — SenTechPLUS";
$metaDescription = "Ouvrez votre boutique high-tech sur SenTechPLUS. Découvrez nos formules gratuites et pro pour vendre vos smartphones et accessoires au Sénégal.";
$canonicalUrl = "https://www.sentechplus.com/pricing.php";

$pdo = getDBConnection();
$sellerPlans = [];
$faqsList = [];
$testimonialsList = [];

if ($pdo) {
    try {
        $stmtPlans = $pdo->query("SELECT * FROM seller_plans WHERE is_active = 1 ORDER BY display_order ASC");
        $sellerPlans = $stmtPlans ? $stmtPlans->fetchAll(PDO::FETCH_ASSOC) : [];
    } catch (Throwable $e) {}

    try {
        $stmtFaqs = $pdo->query("SELECT * FROM faqs WHERE is_active = 1 ORDER BY display_order ASC LIMIT 6");
        $faqsList = $stmtFaqs ? $stmtFaqs->fetchAll(PDO::FETCH_ASSOC) : [];
    } catch (Throwable $e) {}

    try {
        $stmtTesti = $pdo->query("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY display_order ASC LIMIT 4");
        $testimonialsList = $stmtTesti ? $stmtTesti->fetchAll(PDO::FETCH_ASSOC) : [];
    } catch (Throwable $e) {}
}

// Fallback plans if DB empty
if (empty($sellerPlans)) {
    $sellerPlans = [
        [
            'id' => 'plan_starter',
            'name' => 'Formule Découverte',
            'price' => 0,
            'badge_text' => 'Gratuit',
            'description' => 'Idéal pour tester la plateforme.',
            'features' => json_encode(["Jusqu'à 15 produits au catalogue", "Commission 8% par vente", "Paiements Wave et Orange Money", "Support standard"]),
            'is_popular' => 0,
            'slug' => 'starter'
        ],
        [
            'id' => 'plan_pro',
            'name' => 'Boutique Pro Dakar',
            'price' => 15000,
            'badge_text' => 'Recommandé 🔥',
            'description' => 'La formule la plus choisie par les boutiques tech.',
            'features' => json_encode(["Jusqu'à 100 produits au catalogue", "Commission réduite à 4%", "Mise en avant sur l'accueil", "Support prioritaire WhatsApp 7j/7"]),
            'is_popular' => 1,
            'slug' => 'pro'
        ],
        [
            'id' => 'plan_enterprise',
            'name' => 'Vendeur Élite & Marque',
            'price' => 35000,
            'badge_text' => 'VIP Exclusive',
            'description' => 'Pour les grossistes et distributeurs officiels.',
            'features' => json_encode(["Catalogue illimité de produits", "Commission ultra-réduite de 2%", "Bannières personnalisées & Slider", "Gestionnaire de compte dédié"]),
            'is_popular' => 0,
            'slug' => 'enterprise'
        ]
    ];
}

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="flex-1">
    <!-- Breadcrumbs Navigation -->
    <div class="max-w-[1000px] mx-auto px-4 pt-4">
        <nav aria-label="Fil d'Ariane" class="text-xs font-semibold text-[#667085] flex items-center gap-1.5">
            <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
            <span class="text-[#98A2B3]">/</span>
            <span class="text-[#182230] font-bold" aria-current="page">Devenir Vendeur</span>
        </nav>
    </div>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-[#0B54C2] to-[#1677FF] text-white py-16 px-4">
        <div class="max-w-[1000px] mx-auto text-center space-y-4">
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Lancez votre boutique High-Tech sur SenTechPLUS</h1>
            <p class="text-sm sm:text-base text-[#EAF3FF] max-w-2xl mx-auto">
                Rejoignez la plus grande marketplace tech au Sénégal. Vendez plus, plus rapidement.
            </p>
            <a href="create-store.php" class="cursor-pointer inline-block mt-4 bg-white text-[#1677FF] font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wide hover:bg-[#EAF3FF] focus:ring-2 focus:ring-[#1677FF] transition-colors duration-200 shadow-sm">
                Créer ma boutique maintenant
            </a>
        </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-12 px-4 max-w-[1000px] mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <?php foreach ($sellerPlans as $plan):
                $isPop = !empty($plan['is_popular']);
                $priceVal = (float)($plan['price'] ?? 0);
                $priceStr = $priceVal <= 0 ? 'Gratuit' : number_format($priceVal, 0, ',', ' ') . ' FCFA <span class="text-xs font-normal text-[#667085]">/' . htmlspecialchars($plan['billing_period'] ?? 'mois') . '</span>';
                $features = is_string($plan['features']) ? json_decode($plan['features'], true) : ($plan['features'] ?? []);
                if (!is_array($features)) $features = [];
                $badge = $plan['badge_text'] ?: ($isPop ? 'Populaire' : 'Formule');
                $planSlug = $plan['slug'] ?? $plan['id'];
            ?>
            <div class="card-clean p-6 flex flex-col justify-between space-y-4 bg-white rounded-xl <?= $isPop ? 'border-2 border-[#1677FF] shadow-lg relative' : 'border border-[#E8EDF3]' ?>">
                <?php if ($isPop): ?>
                    <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1677FF] text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-2xs">
                        <?= htmlspecialchars($badge) ?>
                    </span>
                <?php endif; ?>
                <div class="space-y-3">
                    <?php if (!$isPop): ?>
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-[#667085]">
                            <?= htmlspecialchars($badge) ?>
                        </span>
                    <?php endif; ?>
                    <h3 class="text-xl font-bold text-[#182230]"><?= htmlspecialchars($plan['name']) ?></h3>
                    <div class="text-xl font-bold text-[#182230]"><?= $priceStr ?></div>
                    <p class="text-xs text-[#667085]"><?= htmlspecialchars($plan['description'] ?? '') ?></p>
                    <hr class="border-[#E8EDF3]">
                    <ul class="space-y-2 text-xs text-[#182230]">
                        <?php foreach ($features as $feat): ?>
                            <li class="flex items-center gap-2">
                                <i data-lucide="check" class="w-4 h-4 text-[#0D7D53] shrink-0"></i>
                                <span><?= htmlspecialchars($feat) ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <a href="create-store.php?plan=<?= urlencode($planSlug) ?>" class="cursor-pointer <?= $isPop ? 'btn-electric bg-[#1677FF] text-white hover:bg-[#0F67E5]' : 'btn-clean border border-[#E8EDF3] hover:bg-[#E8EDF3]' ?> w-full text-center text-xs py-2.5 mt-4 block rounded-lg focus:ring-2 focus:ring-[#1677FF] transition-colors duration-200">
                    <?= $isPop ? 'Choisir ' . htmlspecialchars($plan['name']) : 'Commencer' ?>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- FAQ -->
    <?php if (!empty($faqsList)): ?>
    <section class="py-12 bg-[#F3F7FC] px-4">
        <div class="max-w-[800px] mx-auto">
            <h2 class="text-2xl font-bold text-center text-[#182230] mb-8">Questions Fréquentes</h2>
            <div class="space-y-4">
                <?php foreach ($faqsList as $faq): ?>
                    <div class="faq-item bg-white rounded-lg shadow-sm border border-[#E8EDF3] overflow-hidden">
                        <button type="button" aria-expanded="false" class="cursor-pointer faq-btn w-full text-left p-4 flex justify-between items-center font-bold text-[#182230] text-sm hover:text-[#1677FF] transition-colors duration-200">
                            <span><?= htmlspecialchars($faq['question']) ?></span>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-[#667085] transition-transform shrink-0 ml-2"></i>
                        </button>
                        <div class="faq-content hidden p-4 pt-0 text-xs text-[#667085] leading-relaxed">
                            <?= nl2br(htmlspecialchars($faq['answer'])) ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Testimonials -->
    <?php if (!empty($testimonialsList)): ?>
    <section class="py-12 px-4 max-w-[1000px] mx-auto">
        <h2 class="text-2xl font-bold text-center text-[#182230] mb-8">Ils nous font confiance</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <?php foreach ($testimonialsList as $testi): 
                $initial = strtoupper(substr($testi['customer_name'] ?? 'C', 0, 1));
                $avatar = !empty($testi['avatar']) ? $testi['avatar'] : null;
            ?>
                <div class="bg-white p-6 rounded-xl border border-[#E8EDF3] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <?php if ($avatar && file_exists(__DIR__ . '/' . $avatar)): ?>
                                <img src="<?= htmlspecialchars($avatar) ?>" alt="<?= htmlspecialchars($testi['customer_name']) ?>" width="40" height="40" class="w-10 h-10 rounded-full object-cover border border-[#E8EDF3]">
                            <?php else: ?>
                                <div class="w-10 h-10 bg-[#EAF3FF] rounded-full flex items-center justify-center text-[#1677FF] font-bold">
                                    <?= $initial ?>
                                </div>
                            <?php endif; ?>
                            <div>
                                <h4 class="font-bold text-sm text-[#182230]"><?= htmlspecialchars($testi['customer_name']) ?></h4>
                                <p class="text-[10px] text-[#667085]"><?= htmlspecialchars($testi['customer_role'] ?? 'Client vérifié') ?> — <?= htmlspecialchars($testi['customer_location'] ?? 'Dakar') ?></p>
                            </div>
                        </div>
                        <p class="text-xs text-[#667085] italic leading-relaxed">"<?= htmlspecialchars($testi['comment']) ?>"</p>
                    </div>
                    <?php if (!empty($testi['product_name'])): ?>
                        <div class="mt-3 pt-2 border-t border-[#F1F5F9] text-[10px] text-[#94A3B8] font-semibold flex items-center gap-1">
                            <i data-lucide="check" class="w-3 h-3 text-emerald-600"></i>
                            <span>Article : <?= htmlspecialchars($testi['product_name']) ?></span>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    </section>
    <?php endif; ?>
</main>

<script>
document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        content.classList.toggle('hidden');
        if(content.classList.contains('hidden')) {
            icon.style.transform = 'rotate(0deg)';
        } else {
            icon.style.transform = 'rotate(180deg)';
        }
    });
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
