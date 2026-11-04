<?php
require_once __DIR__ . '/config/config.php';
applyHttpMicroCache(30);

$pageTitle = "Boutique High-Tech & Accessoires Smartphone Sénégal";
$metaDescription = "Boutique en ligne officielle de vente de gadgets et équipements High-Tech certifiés au Sénégal (Dakar). Casques audio, montres connectées, écouteurs sans fil avec livraison express 2h.";
$schemaJsonLd = [
    "@context" => "https://schema.org",
    "@graph" => [
        [
            "@type" => "Organization",
            "@id" => "https://www.sentechplus.com/#organization",
            "name" => "SenTechPLUS",
            "url" => "https://www.sentechplus.com/",
            "logo" => "https://www.sentechplus.com/assets/images/sentech_logo.webp",
            "contactPoint" => [
                "@type" => "ContactPoint",
                "telephone" => getSiteSetting('support_phone', defined('WHATSAPP_DISPLAY') ? WHATSAPP_DISPLAY : '+221 78 131 64 97'),
                "contactType" => "customer service",
                "areaServed" => "SN",
                "availableLanguage" => "French"
            ]
        ],
        [
            "@type" => "WebSite",
            "@id" => "https://www.sentechplus.com/#website",
            "url" => "https://www.sentechplus.com/",
            "name" => "SenTechPLUS",
            "potentialAction" => [
                "@type" => "SearchAction",
                "target" => "https://www.sentechplus.com/shop.php?search={search_term_string}",
                "query-input" => "required name=search_term_string"
            ]
        ]
    ]
];

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

// Connexion DB et récupération des produits
$bestSellingProducts = [];
$latestProducts = [];
$popularCategories = [];
$promoBanner = null;
$dbAvailable = false;

try {
    $pdo = getDBConnection();
    if ($pdo) {
        $dbAvailable = true;

        // Meilleures Ventes (Top 8 par ventes)
        $stmtBest = $pdo->query("SELECT * FROM products WHERE in_stock = 1 ORDER BY sales_count DESC LIMIT 8");
        $bestSellingProducts = $stmtBest ? $stmtBest->fetchAll() : [];

        // Dernières arrivées (Top 8 récents)
        $stmtLatest = $pdo->query("SELECT * FROM products WHERE in_stock = 1 ORDER BY created_at DESC LIMIT 8");
        $latestProducts = $stmtLatest ? $stmtLatest->fetchAll() : [];

        // Catégories Populaires depuis MySQL
        $stmtCats = $pdo->query("SELECT name, slug, image FROM categories WHERE is_active = 1 ORDER BY display_order ASC LIMIT 6");
        $dbCategories = $stmtCats ? $stmtCats->fetchAll() : [];
        if (!empty($dbCategories)) {
            foreach ($dbCategories as $cat) {
                $popularCategories[] = [
                    "name"  => $cat['name'],
                    "image" => $cat['image'] ?: "assets/images/product_img1.webp",
                    "query" => $cat['name']
                ];
            }
        }

        // Bannière Promotionnelle Accueil depuis MySQL
        $stmtPromo = $pdo->prepare("SELECT * FROM banners WHERE placement = 'promo_home' AND is_active = 1 AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW()) ORDER BY display_order ASC LIMIT 1");
        $stmtPromo->execute();
        $promoBanner = $stmtPromo->fetch();
    }
} catch (Throwable $e) {
    $dbAvailable = false;
}

// Catégories par défaut
if (empty($popularCategories)) {
    $popularCategories = [
        ["name" => "Smartphones",          "image" => "assets/images/product_img8.webp",  "query" => "Smartphones"],
        ["name" => "Enceintes & Casques",   "image" => "assets/images/product_img2.webp",  "query" => "Enceintes"],
        ["name" => "Montres Connectées",    "image" => "assets/images/product_img3.webp",  "query" => "Montres"],
        ["name" => "Gaming & Equip.",       "image" => "assets/images/product_img6.webp",  "query" => "Gaming"],
        ["name" => "Ordinateurs & Laptops", "image" => "assets/images/product_img1.webp",  "query" => "Souris"],
        ["name" => "Maison & Énergie",      "image" => "assets/images/product_img7.webp",  "query" => "Décoration"],
    ];
}

// Catalogue officiel SenTechPLUS
if (empty($bestSellingProducts)) {
    $catalogProducts = [
        [
            'id' => 'prod_charger_gan65w',
            'name' => 'Chargeur Rapide 65W GaN Dual USB-C',
            'category' => 'Téléphones & Accessoires',
            'price' => 22000,
            'mrp' => 28000,
            'images' => json_encode(['assets/images/product_img7.webp']),
            'in_stock' => 1,
            'stock' => 35,
            'sales_count' => 140,
            'is_featured' => 1,
            'is_new' => 1,
            'description' => 'Chargeur ultra-compact technologie Gallium Nitride 65W.',
            'rating' => 5.0,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_earbuds_anc_pro',
            'name' => 'Écouteurs Pro ANC Sans Fil Haute Définition',
            'category' => 'Audio & Écouteurs',
            'price' => 32500,
            'mrp' => 42000,
            'images' => json_encode(['assets/images/hero_product_img1.webp']),
            'in_stock' => 1,
            'stock' => 20,
            'sales_count' => 115,
            'is_featured' => 1,
            'is_new' => 1,
            'description' => 'Écouteurs true wireless avec réduction active du bruit ambiant 35dB.',
            'rating' => 5.0,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_headphones_studio',
            'name' => 'Casque Audio Sans Fil Studio ANC Over-Ear',
            'category' => 'Audio & Écouteurs',
            'price' => 45000,
            'mrp' => 58000,
            'images' => json_encode(['assets/images/product_img4.webp']),
            'in_stock' => 1,
            'stock' => 15,
            'sales_count' => 78,
            'is_featured' => 1,
            'is_new' => 0,
            'description' => 'Casque arceau supra-auriculaire avec réduction active de bruit et 50h d autonomie.',
            'rating' => 4.9,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_smartwatch_sport_pro',
            'name' => 'Montre Connectée Sport Pro Écran AMOLED',
            'category' => 'Montres & Objets Connectés',
            'price' => 38000,
            'mrp' => 48000,
            'images' => json_encode(['assets/images/hero_product_img2.webp', 'assets/images/product_img3.webp']),
            'in_stock' => 1,
            'stock' => 16,
            'sales_count' => 88,
            'is_featured' => 1,
            'is_new' => 1,
            'description' => 'Écran AMOLED 1.43 pouce Always-On, GPS multisport et appels Bluetooth.',
            'rating' => 4.9,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_soundbar_gaming',
            'name' => 'Barre de Son Home Cinema 7.1 Bass Immersion',
            'category' => 'Gaming & Setup',
            'price' => 49000,
            'mrp' => 65000,
            'images' => json_encode(['assets/images/product_img8.webp']),
            'in_stock' => 1,
            'stock' => 12,
            'sales_count' => 85,
            'is_featured' => 1,
            'is_new' => 0,
            'description' => 'Système audio immersif avec caisson de basses sans fil et Bluetooth 5.3.',
            'rating' => 4.9,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_speaker_smart_gray',
            'name' => 'Enceinte Bluetooth Smart HD 360° Waterproof',
            'category' => 'Audio & Écouteurs',
            'price' => 27000,
            'mrp' => 35000,
            'images' => json_encode(['assets/images/product_img2.webp']),
            'in_stock' => 1,
            'stock' => 22,
            'sales_count' => 90,
            'is_featured' => 1,
            'is_new' => 0,
            'description' => 'Enceinte portable certifiée IPX7 résistante à l eau et autonomie 14h.',
            'rating' => 4.8,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_camera_security_4k',
            'name' => 'Caméra de Surveillance Wi-Fi 4K Vision Nocturne',
            'category' => 'Sécurité & Caméras',
            'price' => 34000,
            'mrp' => 45000,
            'images' => json_encode(['assets/images/product_img6.webp']),
            'in_stock' => 1,
            'stock' => 18,
            'sales_count' => 76,
            'is_featured' => 0,
            'is_new' => 1,
            'description' => 'Caméra de sécurité motorisée 360° avec détection humaine par IA.',
            'rating' => 4.9,
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => 'prod_smart_lamp_led',
            'name' => 'Lampe LED Tactile Intelligente Sans Fil',
            'category' => 'Maison & Énergie',
            'price' => 18500,
            'mrp' => 24000,
            'images' => json_encode(['assets/images/product_img1.webp']),
            'in_stock' => 1,
            'stock' => 28,
            'sales_count' => 65,
            'is_featured' => 0,
            'is_new' => 0,
            'description' => 'Lampe de bureau tactile avec variateur de température et charge sans fil.',
            'rating' => 4.8,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ];
    $bestSellingProducts = $catalogProducts;
    $latestProducts = array_reverse($catalogProducts);
}
?>

<main id="main-content" class="flex-1 space-y-6 sm:space-y-10 pb-20 md:pb-10 lg:pb-12">

    <!-- 1. HERO BANNER SLIDER (géré depuis Admin → Affiches) -->
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 pt-2 sm:pt-4">
        <h1 class="sr-only">Boutique High-Tech, Écouteurs sans fil & Accessoires Smartphone au Sénégal — SenTechPLUS Dakar</h1>
        <?php
        require_once __DIR__ . '/includes/banner_slider.php';
        echo renderBannerSlider('hero_home', $pdo ?? null);
        ?>
    </section>


    <!-- 2. CATÉGORIES POPULAIRES (Grille Minimaliste App Store) -->
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 content-auto">
        <div class="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-[#E8EDF3]">
            <div>
                <h2 class="text-lg sm:text-xl font-black text-[#182230] tracking-tight">Catégories</h2>
            </div>
            <a href="categories.php" class="text-xs font-bold text-[#0B54C2] hover:text-[#09449E] flex items-center gap-1 shrink-0">
                <span>Voir tout</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>

        <?php
        $curatedCats = [
            ['badge' => 'iPhone & Android', 'name' => 'Téléphones & Acc.', 'img' => 'assets/images/categories/cat_thumb_phones.webp', 'slug' => 'telephones-accessoires'],
            ['badge' => 'Hi-Res & ANC', 'name' => 'Audio & Écouteurs', 'img' => 'assets/images/categories/cat_thumb_audio.webp', 'slug' => 'audio-ecouteurs'],
            ['badge' => 'Santé & AMOLED', 'name' => 'Montres Connectées', 'img' => 'assets/images/categories/cat_thumb_watches.webp', 'slug' => 'montres-objets-connectes'],
            ['badge' => 'Bureautique & Hubs', 'name' => 'Informatique & Bureau', 'img' => 'assets/images/categories/cat_thumb_computing.webp', 'slug' => 'informatique-bureau'],
            ['badge' => 'RGB 7.1 & PS5', 'name' => 'Gaming & Setup', 'img' => 'assets/images/categories/cat_thumb_gaming.webp', 'slug' => 'gaming'],
            ['badge' => 'LED & Domotique', 'name' => 'Maison & Énergie', 'img' => 'assets/images/categories/cat_thumb_home.webp', 'slug' => 'maison-energie'],
            ['badge' => 'Wi-Fi 2K & 360°', 'name' => 'Sécurité & Caméras', 'img' => 'assets/images/categories/cat_thumb_security.webp', 'slug' => 'securite-cameras'],
            ['badge' => 'Jusqu\'à -25%', 'name' => 'Promos & Bons Plans', 'img' => 'assets/images/categories/cat_thumb_flash.webp', 'slug' => '', 'collection' => 'flash'],
        ];
        ?>

        <!-- Mobile: Horizontal Smooth Swipeable Reel / Desktop: 8-Cols Compact Grid -->
        <div class="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            <?php foreach ($curatedCats as $cat): 
                $link = !empty($cat['collection']) ? "shop.php?collection={$cat['collection']}" : "shop.php?category={$cat['slug']}";
            ?>
                <a href="<?= $link ?>" class="cursor-pointer bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/60 shadow-apple-soft hover:shadow-apple-hover hover:border-[#1677FF]/40 transition-all flex flex-col items-center justify-between text-center group min-w-[92px] sm:min-w-0 shrink-0">
                    <span class="text-[8px] sm:text-[8.5px] font-black text-[#0B54C2] bg-[#EAF3FF] px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-full block">
                        <?= htmlspecialchars($cat['badge']) ?>
                    </span>

                    <div class="my-1.5 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center p-1.5 group-hover:bg-[#EAF3FF]/40 transition-colors">
                        <img src="<?= htmlspecialchars($cat['img']) ?>" alt="<?= htmlspecialchars($cat['name']) ?> - SenTechPLUS" width="48" height="48" style="width:48px;height:48px;aspect-ratio:1/1;object-fit:contain;" loading="lazy" decoding="async" class="group-hover:brightness-95 transition-all duration-200">
                    </div>

                    <h3 class="text-[11px] sm:text-xs font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight line-clamp-1" title="<?= htmlspecialchars($cat['name']) ?>">
                        <?= htmlspecialchars($cat['name']) ?>
                    </h3>
                </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- 3. MEILLEURES VENTES (Cartes Produits Style App Store - Images Fondues) -->
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 content-auto">
        <div class="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-[#E8EDF3]">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse"></span>
                <h2 class="text-lg sm:text-xl font-black text-[#182230] tracking-tight">Meilleures ventes</h2>
            </div>
            <a href="shop.php" class="text-xs font-bold text-[#0B54C2] hover:text-[#09449E] flex items-center gap-1">
                <span>Voir tout</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <?php foreach ($bestSellingProducts as $idx => $product): 
                $images = getProductImages($product['images'] ?? null, 'assets/images/hero_product_img1.webp');
                $mainImg = $images[0] ?? 'assets/images/hero_product_img1.webp';
                $discount = $product['mrp'] > $product['price'] ? round((($product['mrp'] - $product['price']) / $product['mrp']) * 100) : 0;
            ?>
                <a href="product.php?id=<?= urlencode($product['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($product['name']) ?> - <?= formatPrice($product['price']) ?>">
                    
                    <!-- Top row: Badge Reduction / Stock & Rating -->
                    <div class="prod-card-top">
                        <div class="flex items-center gap-1">
                            <?php if ($discount > 0): ?>
                                <span class="prod-badge-discount">-<?= $discount ?>%</span>
                            <?php else: ?>
                                <span class="prod-badge-stock">En stock</span>
                            <?php endif; ?>
                        </div>

                        <?php $pRating = !empty($product['rating']) && (float)$product['rating'] > 0 ? number_format((float)$product['rating'], 1) : null; ?>
                        <?php if ($pRating): ?>
                            <div class="prod-rating">
                                <span>★</span>
                                <span style="color:#344054;font-size:10px;font-weight:700;"><?= $pRating ?></span>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Product Image (Fondue sans cadre) -->
                    <div class="prod-card-img-wrap">
                        <img src="<?= htmlspecialchars($mainImg) ?>" alt="<?= htmlspecialchars($product['name']) ?> - SenTechPLUS" width="180" height="180" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;" loading="lazy" decoding="async">
                    </div>

                    <!-- Product Details -->
                    <div class="prod-card-body">
                        <div>
                            <span class="prod-cat-text">
                                <?= htmlspecialchars($product['category']) ?>
                            </span>
                            <h3 class="prod-name-text">
                                <?= htmlspecialchars($product['name']) ?>
                            </h3>
                        </div>

                        <!-- Price Section (No Button) -->
                        <div class="prod-price-row">
                            <span class="prod-price-val">
                                <?= number_format($product['price'], 0, ',', ' ') ?> F
                            </span>
                            <?php if ($discount > 0): ?>
                                <span class="prod-price-old">
                                    <?= number_format($product['mrp'], 0, ',', ' ') ?> F
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>

                </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- 4. BANNIÈRE PROMO (Design Carte Apple iOS) -->
    <?php
    $pTitle = !empty($promoBanner['title']) ? $promoBanner['title'] : "Jusqu'à -30% sur les nouveautés";
    $pSubtitle = !empty($promoBanner['subtitle']) ? $promoBanner['subtitle'] : "Audio haute fidélité, chargeurs 65W et montres AMOLED.";
    $pBtnText = !empty($promoBanner['button_text']) ? $promoBanner['button_text'] : "Profiter des offres";
    $pLink = !empty($promoBanner['link_url']) ? $promoBanner['link_url'] : "shop.php?collection=flash";
    $pImg1 = !empty($promoBanner['image_desktop']) ? $promoBanner['image_desktop'] : "assets/images/product_img2.webp";
    $pImg2 = !empty($promoBanner['image_mobile']) ? $promoBanner['image_mobile'] : "assets/images/product_img4.webp";
    ?>
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 content-auto">
        <div class="promo-banner-card">
            <div class="space-y-2 text-center sm:text-left relative z-10">
                <span style="display:inline-block; background:rgba(255,255,255,0.2); color:#ffffff; font-size:10px; font-weight:900; padding:3px 10px; border-radius:9999px; border:1px solid rgba(255,255,255,0.3);">
                    ⚡ OFFRE SPÉCIALE DAKAR
                </span>
                <h2 style="font-size:22px; font-weight:900; color:#ffffff; letter-spacing:-0.02em; line-height:1.2; margin:0;">
                    <?= htmlspecialchars($pTitle) ?>
                </h2>
                <p style="font-size:12px; color:rgba(255,255,255,0.85); margin:0; max-width:380px;">
                    <?= htmlspecialchars($pSubtitle) ?>
                </p>
                <div style="padding-top:4px;">
                    <a href="<?= htmlspecialchars($pLink) ?>" class="promo-cta-btn">
                        <span><?= htmlspecialchars($pBtnText) ?></span>
                        <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
                    </a>
                </div>
            </div>

            <!-- Mini visual pills fondues sans fond carré -->
            <div class="flex items-center gap-2 relative z-10 shrink-0">
                <div class="promo-mini-pill">
                    <img src="<?= htmlspecialchars($pImg1) ?>" alt="Promo 1" width="44" height="44" loading="lazy" decoding="async" style="width:38px;height:38px;aspect-ratio:1/1;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.15));">
                    <div style="font-size:11px; font-weight:700; color:#ffffff;">
                        <span class="prod-badge-discount" style="font-size:8px !important; padding:1px 5px !important; margin-bottom:2px; display:inline-block;">-30%</span>
                        <p style="margin:0; line-height:1.2;">Enceinte Smart</p>
                    </div>
                </div>

                <div class="promo-mini-pill hidden sm:flex">
                    <img src="<?= htmlspecialchars($pImg2) ?>" alt="Promo 2" width="44" height="44" loading="lazy" decoding="async" style="width:38px;height:38px;aspect-ratio:1/1;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.15));">
                    <div style="font-size:11px; font-weight:700; color:#ffffff;">
                        <span class="prod-badge-discount" style="font-size:8px !important; padding:1px 5px !important; margin-bottom:2px; display:inline-block;">-25%</span>
                        <p style="margin:0; line-height:1.2;">Casque Studio</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. DERNIÈRES ARRIVÉES (Grille 4 colonnes) -->
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 content-auto">
        <div class="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-[#E8EDF3]">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#16C784]"></span>
                <h2 class="text-lg sm:text-xl font-black text-[#182230] tracking-tight">Nouveautés</h2>
            </div>
            <a href="shop.php" class="text-xs font-bold text-[#0B54C2] hover:text-[#09449E] flex items-center gap-1">
                <span>Voir tout</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <?php foreach ($latestProducts as $idxLatest => $product):
                $imgs = getProductImages($product['images'] ?? null, 'assets/images/product_img1.webp');
                $mainImg = $imgs[0] ?? 'assets/images/product_img1.webp';
                $discount = calculateDiscount((float)$product['price'], (float)$product['mrp']);
            ?>
                <a href="product.php?id=<?= urlencode($product['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($product['name']) ?> - <?= number_format($product['price'], 0, ',', ' ') ?> F">
                    
                    <!-- Top row: Badge Reduction / Nouveau & Rating -->
                    <div class="prod-card-top">
                        <div class="flex items-center gap-1">
                            <span class="prod-badge-new">Nouveau</span>
                            <?php if ($discount > 0): ?>
                                <span class="prod-badge-discount">-<?= $discount ?>%</span>
                            <?php endif; ?>
                        </div>

                        <?php $pRatingLatest = !empty($product['rating']) && (float)$product['rating'] > 0 ? number_format((float)$product['rating'], 1) : null; ?>
                        <?php if ($pRatingLatest): ?>
                            <div class="prod-rating">
                                <span>★</span>
                                <span style="color:#344054;font-size:10px;font-weight:700;"><?= $pRatingLatest ?></span>
                            </div>
                        <?php endif; ?>
                    </div>

                    <!-- Product Image (Fondue sans cadre) -->
                    <div class="prod-card-img-wrap">
                        <img src="<?= htmlspecialchars($mainImg) ?>" alt="<?= htmlspecialchars($product['name']) ?> - SenTechPLUS" width="180" height="180" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;" loading="lazy" decoding="async">
                    </div>
                    <div class="prod-card-body">
                        <div>
                            <span class="prod-cat-text">
                                <?= htmlspecialchars($product['category']) ?>
                            </span>
                            <h3 class="prod-name-text">
                                <?= htmlspecialchars($product['name']) ?>
                            </h3>
                        </div>

                        <!-- Price Section (No Button) -->
                        <div class="prod-price-row">
                            <span class="prod-price-val">
                                <?= number_format($product['price'], 0, ',', ' ') ?> F
                            </span>
                            <?php if ($discount > 0): ?>
                                <span class="prod-price-old">
                                    <?= number_format($product['mrp'], 0, ',', ' ') ?> F
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>

                </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- 6. ENGAGEMENTS (4 Piliers Épurés) -->
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 content-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            <div class="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8EDF3] flex items-center gap-3 shadow-2xs">
                <div class="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                    <i data-lucide="truck" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-xs sm:text-sm font-black text-[#182230]">Livraison H+1 Dakar</h3>
                    <p class="text-[10px] text-[#1677FF] font-bold">Chrono sous scellé</p>
                </div>
            </div>

            <div class="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8EDF3] flex items-center gap-3 shadow-2xs">
                <div class="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                    <i data-lucide="lock" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-xs sm:text-sm font-black text-[#182230]">Paiement Sécurisé</h3>
                    <p class="text-[10px] text-[#64748B]">Wave, OM, Cash</p>
                </div>
            </div>

            <div class="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8EDF3] flex items-center gap-3 shadow-2xs">
                <div class="w-10 h-10 rounded-2xl bg-[#E8F8F0] text-[#0D7D53] flex items-center justify-center shrink-0">
                    <i data-lucide="shield-check" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-xs sm:text-sm font-black text-[#182230]">100% Certifié</h3>
                    <p class="text-[10px] text-[#0D7D53] font-bold">Échange neuf 12 mois</p>
                </div>
            </div>

            <div class="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8EDF3] flex items-center gap-3 shadow-2xs">
                <div class="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                    <i data-lucide="headphones" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-xs sm:text-sm font-black text-[#182230]">Support 7j/7</h3>
                    <p class="text-[10px] text-[#64748B]">WhatsApp direct</p>
                </div>
            </div>

        </div>
    </section>

    <!-- 7. VIP NEWSLETTER (Barre Pilule Intégrée) -->
    <section class="max-w-[1400px] mx-auto px-3 sm:px-6 content-auto">
        <div class="bg-white rounded-[32px] p-6 sm:p-10 text-center space-y-3 max-w-2xl mx-auto border border-[#E8EDF3] shadow-2xs">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#0B54C2] text-[10px] font-black uppercase">
                <i data-lucide="mail" class="w-3.5 h-3.5"></i>
                CLUB SENTECH
            </span>
            <h2 class="text-xl sm:text-2xl font-black text-[#182230]">Offres VIP & Ventes Privées</h2>
            <p class="text-xs text-[#64748B] max-w-sm mx-auto">Recevez nos réductions exclusives directement par email.</p>

            <form action="index.php" method="POST" enctype="application/x-www-form-urlencoded" class="pt-2 max-w-md mx-auto">
                <?= getCSRFInputField() ?>
                <div class="relative h-[48px] flex items-center bg-[#F1F3F7] focus-within:bg-white pl-4 pr-1.5 rounded-full border border-[#DCE4EE] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 shadow-2xs transition-all">
                    <input type="email" name="newsletter_email" aria-label="Votre adresse email pour les offres VIP" placeholder="Votre email..." required autocomplete="email" class="w-full bg-transparent outline-none text-xs sm:text-sm font-semibold text-[#182230] placeholder:text-[#64748B]" style="outline: none !important; border: none !important; box-shadow: none !important;">
                    <button type="submit" class="w-9 h-9 rounded-full bg-[#1677FF] hover:bg-[#0F67E5] active:scale-90 text-white flex items-center justify-center shrink-0 shadow-2xs transition-all cursor-pointer mr-0.5" style="width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; max-width: 36px !important; max-height: 36px !important; aspect-ratio: 1 / 1 !important; padding: 0 !important;" aria-label="S'inscrire">
                        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </button>
                </div>
            </form>
        </div>
    </section>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
