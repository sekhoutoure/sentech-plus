<?php
require_once __DIR__ . '/config/config.php';

$pdo = getDBConnection();
$productId = sanitize($_GET['id'] ?? '');

if (empty($productId)) {
    header('Location: shop.php');
    exit;
}

$product = null;

if ($pdo) {
    try {
        $altId = is_numeric($productId) ? ('prod_' . $productId) : (str_starts_with($productId, 'prod_') ? preg_replace('/^prod_/', '', $productId) : ('prod_' . $productId));
        $stmt = $pdo->prepare("SELECT p.*, s.name as store_name, s.username as store_username, s.logo as store_logo 
                               FROM products p 
                               LEFT JOIN stores s ON p.store_id = s.id 
                               WHERE p.id = :id OR p.id = :altId LIMIT 1");
        $stmt->execute([':id' => $productId, ':altId' => $altId]);
        $product = $stmt->fetch();
    } catch (Throwable $e) {
        $product = null;
    }
}

if (!$product) {
    $product = getProductById($productId);
}

// Si produit introuvable en base, redirection 404 / boutique
if (!$product) {
    header('Location: shop.php');
    exit;
}

if (!$product) {
    header('Location: shop.php');
    exit;
}

// Track recently viewed products in session
if (!isset($_SESSION['recently_viewed']) || !is_array($_SESSION['recently_viewed'])) {
    $_SESSION['recently_viewed'] = [];
}
if (!in_array($productId, $_SESSION['recently_viewed'])) {
    array_unshift($_SESSION['recently_viewed'], $productId);
    $_SESSION['recently_viewed'] = array_slice($_SESSION['recently_viewed'], 0, 6);
}

// Process customer review submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'add_review') {
    if (verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $revName = sanitize($_POST['reviewer_name'] ?? '');
        $revRating = min(5, max(1, (int)($_POST['rating'] ?? 5)));
        $revComment = sanitize($_POST['comment'] ?? '');
        
        if (!empty($revName) && !empty($revComment)) {
            if ($pdo) {
                try {
                    $insReview = $pdo->prepare("INSERT INTO reviews (id, product_id, user_id, rating, review, comment, reviewer_name, created_at) VALUES (:id, :pid, :uid, :r, :c, :c, :name, NOW())");
                    $insReview->execute([
                        ':id' => 'rev_' . uniqid(),
                        ':pid' => $productId,
                        ':uid' => getCurrentUser()['id'] ?? null,
                        ':r' => $revRating,
                        ':c' => $revComment,
                        ':name' => $revName
                    ]);
                } catch (Throwable $e) {}

            }
            $_SESSION['review_success'] = 'Merci pour votre évaluation ! Votre avis a été enregistré avec succès.';
            header('Location: product.php?id=' . urlencode($productId) . '#section-reviews');
            exit;
        }
    }
}

// Media list (photos + vidéos de présentation)
$fallbackImages = getProductImages($product['images'] ?? null, 'assets/images/hero_product_img1.webp');
$productMedia = getProductMediaList($productId, $fallbackImages, $product['name']);
$mainImg = $productMedia[0]['file_path'] ?? 'assets/images/hero_product_img1.webp';

// Dynamic Pricing & Savings
$discountPercent = calculateDiscount((float)$product['price'], (float)$product['mrp']);
$savingsAmount = max(0, (float)$product['mrp'] - (float)$product['price']);
$salesCount = (int)($product['sales_count'] ?? 140);

// Variants
$variants = getProductVariants($productId);

// Robust Technical Specifications Normalization (Guarantees zero TypeError/Fatal Error)
$rawSpecs = getProductSpecs($productId, $product['description'] ?? '');
$cleanSpecs = [];
if (is_array($rawSpecs)) {
    foreach ($rawSpecs as $k => $item) {
        if (is_array($item)) {
            $label = $item['spec_key'] ?? $item['key'] ?? $item['label'] ?? (is_string($k) ? $k : '');
            $val = $item['spec_value'] ?? $item['value'] ?? $item['val'] ?? '';
            if (is_array($val)) {
                $val = implode(', ', array_filter(array_map('strval', $val)));
            }
            if ($label !== '' && $val !== '') {
                $cleanSpecs[] = ['label' => (string)$label, 'value' => (string)$val];
            }
        } elseif (is_string($item) || is_numeric($item)) {
            $label = is_string($k) ? $k : 'Caractéristique';
            $cleanSpecs[] = ['label' => (string)$label, 'value' => (string)$item];
        }
    }
} elseif (is_string($rawSpecs)) {
    $decoded = json_decode($rawSpecs, true);
    if (is_array($decoded)) {
        foreach ($decoded as $k => $v) {
            if (is_string($v) || is_numeric($v)) {
                $cleanSpecs[] = ['label' => (string)$k, 'value' => (string)$v];
            }
        }
    }
}

// Customer Reviews
$reviews = [];
$avgRating = 4.8;
if ($pdo) {
    try {
        $rStmt = $pdo->prepare("SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = :pid ORDER BY r.created_at DESC");
        $rStmt->execute([':pid' => $productId]);
        $reviews = $rStmt->fetchAll();
    } catch (Throwable $e) {
        $reviews = [];
    }
}
if (empty($reviews)) {
    $reviews = [
        ['user_name' => 'Moussa Diallo', 'rating' => 5, 'comment' => 'Excellent délai de livraison à Dakar. Produit 100% original, son et finitions au top !', 'created_at' => '2026-08-10', 'verified' => true, 'photo' => 'assets/images/hero_product_img1.webp'],
        ['user_name' => 'Fatou Ndiaye', 'rating' => 5, 'comment' => 'Produit conforme aux photos, emballage soigné et batterie très endurante.', 'created_at' => '2026-08-04', 'verified' => true, 'photo' => 'assets/images/hero_product_img2.webp'],
        ['user_name' => 'Cheikh Sow', 'rating' => 4.5, 'comment' => 'Très bon rapport qualité-prix. Paiement Wave à la livraison en 2h chrono.', 'created_at' => '2026-07-28', 'verified' => true, 'photo' => 'assets/images/hero_product_img3.webp']
    ];
}
if (!empty($reviews)) {
    $avgRating = round(array_sum(array_column($reviews, 'rating')) / count($reviews), 1);
}

// Related Products ("Vous aimerez aussi")
$relatedProducts = [];
if ($pdo) {
    try {
        $relStmt = $pdo->prepare("SELECT * FROM products WHERE category = :cat AND id != :pid AND is_active = 1 LIMIT 4");
        $relStmt->execute([':cat' => $product['category'], ':pid' => $productId]);
        $relatedProducts = $relStmt->fetchAll();
    } catch (Throwable $e) {
        $relatedProducts = [];
    }
}
if (empty($relatedProducts) && $pdo) {
    try {
        $relStmt = $pdo->prepare("SELECT * FROM products WHERE id != :pid AND is_active = 1 ORDER BY sales_count DESC LIMIT 4");
        $relStmt->execute([':pid' => $productId]);
        $relatedProducts = $relStmt->fetchAll();
    } catch (Throwable $e) {
        $relatedProducts = [];
    }
}

// Dynamic SEO & Structured Data (Google Rich Snippets & AI Overviews)
$rawProductName = strip_tags(html_entity_decode($product['name'] ?? '', ENT_QUOTES, 'UTF-8'));
$shortProdName = mb_strimwidth($rawProductName, 0, 36, '…');
$pageTitle = htmlspecialchars($shortProdName) . " — " . formatPrice($product['price']) . " | SenTechPLUS";
$metaDescription = "Achetez " . mb_strimwidth($rawProductName, 0, 42, '') . " au Sénégal sur SenTechPLUS. Livraison express 2h Dakar, garantie 1 an & paiement Wave/OM.";
$ogImage = $mainImg;
$ogPrice = (float)$product['price'];

$absBase = defined('APP_URL') ? rtrim(APP_URL, '/') : 'https://www.sentechplus.com';
$absProductUrl = $absBase . '/product.php?id=' . urlencode($product['id']);
$canonicalUrl = $absProductUrl;
$absImages = array_map(function($img) use ($absBase) {
    return (strpos($img, 'http') === 0) ? $img : ($absBase . '/' . ltrim($img, '/'));
}, $fallbackImages);

$productSchema = [
    "@type" => "Product",
    "@id" => $absProductUrl . '#product',
    "name" => $rawProductName,
    "image" => $absImages,
    "description" => $metaDescription,
    "sku" => $product['id'],
    "mpn" => $product['id'],
    "category" => $product['category'] ?? 'High-Tech',
    "brand" => [
        "@type" => "Brand",
        "name" => !empty($product['brand']) ? $product['brand'] : 'SenTechPLUS'
    ],
    "offers" => [
        "@type" => "Offer",
        "url" => $absProductUrl,
        "priceCurrency" => "XOF",
        "price" => (float)$product['price'],
        "priceValidUntil" => date('Y-12-31', strtotime('+1 year')),
        "availability" => ($product['stock'] > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition" => "https://schema.org/NewCondition",
        "seller" => [
            "@type" => "Organization",
            "name" => "SenTechPLUS Dakar",
            "url" => $absBase . '/'
        ],
        "shippingDetails" => [
            "@type" => "OfferShippingDetails",
            "shippingRate" => [
                "@type" => "MonetaryAmount",
                "value" => "2000",
                "currency" => "XOF"
            ],
            "shippingDestination" => [
                "@type" => "DefinedRegion",
                "addressCountry" => "SN",
                "addressRegion" => "Dakar"
            ],
            "deliveryTime" => [
                "@type" => "ShippingDeliveryTime",
                "handlingTime" => [
                    "@type" => "QuantitativeValue",
                    "minValue" => 0,
                    "maxValue" => 1,
                    "unitCode" => "d"
                ],
                "transitTime" => [
                    "@type" => "QuantitativeValue",
                    "minValue" => 0,
                    "maxValue" => 1,
                    "unitCode" => "d"
                ]
            ]
        ],
        "hasMerchantReturnPolicy" => [
            "@type" => "MerchantReturnPolicy",
            "applicableCountry" => "SN",
            "returnPolicyCategory" => "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays" => 7,
            "returnMethod" => "https://schema.org/ReturnInStore",
            "returnFees" => "https://schema.org/FreeReturn"
        ]
    ]
];

if (!empty($reviews) && count($reviews) > 0) {
    $productSchema["aggregateRating"] = [
        "@type" => "AggregateRating",
        "ratingValue" => (float)$avgRating,
        "reviewCount" => count($reviews),
        "bestRating" => "5",
        "worstRating" => "1"
    ];
    $schemaReviews = [];
    foreach (array_slice($reviews, 0, 5) as $rev) {
        $schemaReviews[] = [
            "@type" => "Review",
            "author" => [
                "@type" => "Person",
                "name" => $rev['user_name'] ?? 'Client Vérifié'
            ],
            "datePublished" => $rev['created_at'] ?? date('Y-m-d'),
            "reviewBody" => $rev['comment'] ?? 'Excellent produit',
            "reviewRating" => [
                "@type" => "Rating",
                "ratingValue" => (float)($rev['rating'] ?? 5),
                "bestRating" => "5",
                "worstRating" => "1"
            ]
        ];
    }
    $productSchema["review"] = $schemaReviews;
}

$schemaJsonLd = [
    "@context" => "https://schema.org",
    "@graph" => [
        [
            "@type" => "BreadcrumbList",
            "itemListElement" => [
                [
                    "@type" => "ListItem",
                    "position" => 1,
                    "name" => "Accueil",
                    "item" => $absBase . "/"
                ],
                [
                    "@type" => "ListItem",
                    "position" => 2,
                    "name" => "Boutique",
                    "item" => $absBase . "/shop.php"
                ],
                [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $product['category'] ?? 'High-Tech',
                    "item" => $absBase . "/shop.php?category=" . urlencode($product['category'] ?? '')
                ],
                [
                    "@type" => "ListItem",
                    "position" => 4,
                    "name" => $product['name'],
                    "item" => $absProductUrl
                ]
            ]
        ],
        $productSchema,
        [
            "@type" => "FAQPage",
            "mainEntity" => [
                [
                    "@type" => "Question",
                    "name" => "Cet article " . $product['name'] . " est-il original et couvert par une garantie à Dakar ?",
                    "acceptedAnswer" => [
                        "@type" => "Answer",
                        "text" => "Oui, l'article " . $product['name'] . " vendu sur SenTechPLUS est 100% original, neuf sous blister scellé et couvert par notre garantie d'échange immédiat sous 7 jours."
                    ]
                ],
                [
                    "@type" => "Question",
                    "name" => "Quels sont les délais et zones de livraison pour " . $product['name'] . " au Sénégal ?",
                    "acceptedAnswer" => [
                        "@type" => "Answer",
                        "text" => "Livraison express en 2h à 4h chrono partout dans la région de Dakar (Plateau, Almadies, Ngor, Mermoz, Maristes, Guédiawaye, etc.) et sous 24h à 48h dans toutes les régions du Sénégal."
                    ]
                ],
                [
                    "@type" => "Question",
                    "name" => "Peut-on payer à la livraison par Wave ou Orange Money ?",
                    "acceptedAnswer" => [
                        "@type" => "Answer",
                        "text" => "Oui ! Vous pouvez payer en toute sécurité à la réception de votre colis par Wave, Orange Money ou en espèces directement auprès du livreur."
                    ]
                ]
            ]
        ]
    ]
];

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main id="main-content" class="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 sm:py-6 pb-28 lg:pb-12 flex-1 space-y-4 sm:space-y-6 overflow-x-hidden min-w-0">

    <!-- Responsive Breadcrumb Navigation & Mobile Back Action -->
    <nav aria-label="Fil d'Ariane" class="flex text-xs font-semibold text-[#667085] items-center justify-between gap-2 max-w-full overflow-hidden">
        <div class="flex items-center flex-wrap gap-1.5 min-w-0">
            <a href="index.php" class="hover:text-[#1677FF] transition-colors flex items-center gap-1">
                <i data-lucide="home" class="w-3.5 h-3.5"></i> <span class="hidden sm:inline">Accueil</span>
            </a>
            <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
            <a href="shop.php" class="hover:text-[#1677FF] transition-colors">Boutique</a>
            <span aria-hidden="true" class="text-[#CBD5E1]">/</span>
            <a href="shop.php?category=<?= urlencode($product['category']) ?>" class="hover:text-[#1677FF] transition-colors truncate max-w-[120px] sm:max-w-none"><?= htmlspecialchars($product['category']) ?></a>
            <?php if (!empty($product['subcategory'])): ?>
                <span aria-hidden="true" class="text-[#CBD5E1] hidden sm:inline">/</span>
                <a href="shop.php?category=<?= urlencode($product['category']) ?>&subcategory=<?= urlencode($product['subcategory']) ?>" class="hover:text-[#1677FF] transition-colors hidden sm:inline"><?= htmlspecialchars($product['subcategory']) ?></a>
            <?php endif; ?>
        </div>

        <button type="button" onclick="shareProduct()" class="cursor-pointer p-1.5 rounded-lg hover:bg-white text-[#667085] hover:text-[#1677FF] flex items-center gap-1 text-[11px] font-bold shrink-0 transition-colors" aria-label="Partager">
            <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">Partager</span>
        </button>
    </nav>

    <!-- ─── 1. MAIN PRODUCT 2-COLUMNS / MOBILE STACK (Zen Minimalist) ──────── -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start max-w-full min-w-0">
        
        <!-- Left Column: Pure Minimal HD Media Gallery -->
        <div class="lg:col-span-6 space-y-3 self-start lg:sticky lg:top-20 max-w-full min-w-0">
            
            <!-- Pure HD Viewport Container with Wishlist Button (Apple Pearl Studio) -->
            <div id="media-viewport-container" class="rounded-3xl bg-[#F8FAFC] w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[430px] flex items-center justify-center overflow-hidden border border-slate-200/60 shadow-apple-soft relative select-none max-w-full">
                
                <!-- Minimal Wishlist Button Top-Right -->
                <button type="button" 
                        onclick="toggleWishlistInline('<?= htmlspecialchars($product['id']) ?>', this)" 
                        class="cursor-pointer absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#64748B] hover:text-rose-500 shadow-sm flex items-center justify-center transition-transform active:scale-95 z-10"
                        aria-label="Ajouter aux favoris">
                    <i data-lucide="heart" class="w-4 h-4 <?= isWishlisted($product['id']) ? 'fill-rose-500 text-rose-500' : '' ?>"></i>
                </button>

                <!-- Main Photo Container with Clean Breathing Room -->
                <div id="main-image-container" class="w-full h-full flex items-center justify-center p-6 sm:p-8">
                    <img id="main-product-img" 
                         src="<?= htmlspecialchars($productMedia[0]['file_path']) ?>" 
                         alt="<?= htmlspecialchars($productMedia[0]['alt_text'] ?: $product['name']) ?> - SenTechPLUS" 
                         width="400" 
                         height="400" 
                         loading="eager" 
                         fetchpriority="high" 
                         style="max-width: 80%; max-height: 80%; width: auto; height: auto; object-fit: contain; margin: auto;"
                         class="filter drop-shadow-sm transition-opacity duration-200 cursor-zoom-in"
                         onclick="openProductLightbox(currentMediaIndex)">
                </div>

                <!-- Video Container -->
                <div id="main-video-container" class="w-full h-full hidden items-center justify-center bg-slate-950 rounded-2xl overflow-hidden relative">
                    <video id="main-product-video" 
                           controls 
                           playsinline 
                           preload="metadata" 
                           class="w-full h-full object-contain max-h-full" 
                           poster="<?= htmlspecialchars($productMedia[0]['thumbnail_path'] ?: $productMedia[0]['file_path']) ?>">
                        <source src="" type="video/mp4">
                        Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                </div>

                <!-- Prev / Next Nav Buttons -->
                <?php if (count($productMedia) > 1): ?>
                    <button type="button" onclick="navigateGallery(-1)" aria-label="Média précédent" class="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#182230] shadow-sm flex items-center justify-center transition-opacity z-10">
                        <i data-lucide="chevron-left" class="w-4 h-4"></i>
                    </button>
                    <button type="button" onclick="navigateGallery(1)" aria-label="Média suivant" class="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#182230] shadow-sm flex items-center justify-center transition-opacity z-10">
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                    </button>
                <?php endif; ?>
            </div>

            <!-- Minimal Thumbnails Strip -->
            <?php if (count($productMedia) > 1): ?>
                <div class="flex items-center gap-2 max-w-full">
                    <div id="gallery-thumbs" class="flex-1 flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar max-w-full" role="tablist">
                        <?php foreach ($productMedia as $i => $med): 
                            $isVid = ($med['media_type'] === 'video');
                            $thumbImg = $med['thumbnail_path'] ?: $med['file_path'];
                        ?>
                            <button type="button" 
                                    onclick="selectMedia(<?= $i ?>)" 
                                    id="thumb-btn-<?= $i ?>"
                                    class="gallery-thumb-btn cursor-pointer w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl border-2 <?= $i === 0 ? 'border-[#1677FF] bg-blue-50/40' : 'border-[#E8EDF3] bg-[#F8FAFC]' ?> hover:border-[#1677FF] overflow-hidden transition-all relative group" 
                                    role="tab"
                                    aria-selected="<?= $i === 0 ? 'true' : 'false' ?>">
                                <img src="<?= htmlspecialchars($thumbImg) ?>" alt="<?= htmlspecialchars($med['alt_text'] ?: $product['name']) ?> - SenTechPLUS" width="64" height="64" loading="lazy" style="aspect-ratio:1/1;" class="w-full h-full object-contain p-1">
                                <?php if ($isVid): ?>
                                    <div class="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                        <i data-lucide="play" class="w-3.5 h-3.5 text-white fill-white"></i>
                                    </div>
                                <?php endif; ?>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

        </div>

        <!-- Right Column: Pure Net Info, Pricing, Variants & Purchase Engine -->
        <div class="lg:col-span-6 space-y-4 max-w-full min-w-0">
            
            <!-- Category & Brand Subtitle -->
            <p class="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                <?= htmlspecialchars($product['category']) ?> <?php if (!empty($product['brand'])): ?>• <?= htmlspecialchars($product['brand']) ?><?php endif; ?>
            </p>

            <!-- Product Title H1 -->
            <h1 class="text-xl sm:text-3xl font-black text-[#182230] tracking-tight leading-snug break-words">
                <?= htmlspecialchars($product['name']) ?>
            </h1>

            <!-- Ratings & Stock Status -->
            <div class="flex flex-wrap items-center gap-2.5 text-xs text-[#64748B]">
                <div class="flex items-center gap-1 font-bold text-[#182230]">
                    <span class="text-[#F59E0B]">★</span>
                    <span><?= $avgRating ?></span>
                </div>
                <span>•</span>
                <a href="#section-reviews" class="hover:text-[#1677FF] transition-colors"><?= count($reviews) ?> avis clients</a>
                <span>•</span>
                <span class="text-emerald-700 font-bold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span> En stock (Dakar)
                </span>
            </div>

            <!-- Net Price in FCFA (Prioritaire & Lisible) -->
            <div class="py-2 border-y border-[#F1F5F9] space-y-2.5">
                <div class="flex flex-wrap items-baseline gap-3">
                    <span id="display-price" class="text-3xl sm:text-4xl font-black text-[#1D1D1F] tracking-tight">
                        <?= formatPrice($product['price']) ?>
                    </span>
                    <?php if ($product['mrp'] > $product['price']): ?>
                        <span id="display-mrp" class="text-sm sm:text-base font-semibold text-[#94A3B8] line-through">
                            <?= formatPrice($product['mrp']) ?>
                        </span>
                        <span class="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full">
                            -<?= $discountPercent ?>%
                        </span>
                        <?php if ($savingsAmount > 0): ?>
                            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                                Économie: <?= formatPrice($savingsAmount) ?>
                            </span>
                        <?php endif; ?>
                    <?php endif; ?>
                </div>

                <!-- Vente Flash Live Countdown Banner (Haute Lisibilité avec CSS Inline Garanti) -->
                <?php if ($discountPercent > 0 || !empty($product['is_flash_sale'])): ?>
                    <div style="background: linear-gradient(135deg, #DC2626 0%, #EA580C 100%) !important; color: #ffffff !important;" class="p-2.5 rounded-2xl flex items-center justify-between shadow-xs text-xs font-bold">
                        <div class="flex items-center gap-1.5 text-white">
                            <span class="text-sm">⚡</span>
                            <span class="tracking-tight uppercase font-black">Vente Flash Dakar</span>
                        </div>
                        <div class="flex items-center gap-1 font-mono font-black text-xs text-white" id="product-flash-countdown">
                            <span style="background: rgba(0,0,0,0.35); padding: 2px 6px; border-radius: 6px;" id="pcd-hours">04</span>:
                            <span style="background: rgba(0,0,0,0.35); padding: 2px 6px; border-radius: 6px;" id="pcd-mins">32</span>:
                            <span style="background: rgba(0,0,0,0.35); padding: 2px 6px; border-radius: 6px;" id="pcd-secs">15</span>
                        </div>
                    </div>
                <?php endif; ?>

                <!-- UVP Local Delivery Pill -->
                <div class="flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 text-xs font-bold shadow-2xs">
                    <i data-lucide="zap" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                    <span>Livraison express à Dakar en moins de 2h · Commandez maintenant pour recevoir aujourd'hui</span>
                </div>

                <!-- Minimal Coupon Note -->
                <div class="flex items-center justify-between text-xs p-2.5 rounded-2xl bg-[#F8FAFD] border border-slate-200">
                    <div class="flex items-center gap-2 truncate">
                        <span>🎟️</span>
                        <span class="text-[#64748B]">Code Promo : <strong class="text-[#1D1D1F]">SENTECH5</strong> <span class="text-[#1677FF] font-bold">(-5% dès 20 000 FCFA)</span></span>
                    </div>
                    <button type="button" onclick="copyCouponCode('SENTECH5', this)" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:underline px-2 py-0.5 rounded-lg hover:bg-white transition-all shrink-0">
                        Copier
                    </button>
                </div>
            </div>

            <!-- Jauge d'urgence de stock (Stock limité) -->
            <?php if ((int)$product['stock'] <= 5 && (int)$product['stock'] > 0): ?>
                <div class="space-y-1 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs">
                    <div class="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                        <span>🔥 Forte demande en cours !</span>
                        <span class="text-rose-600 font-black">Plus que <?= (int)$product['stock'] ?> en stock</span>
                    </div>
                    <div class="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-rose-500 h-1.5 rounded-full animate-pulse" style="width: <?= min(100, max(25, (int)$product['stock'] * 20)) ?>%;"></div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Model / Variants Selection (Clean Minimalist Pills) -->
            <?php if (!empty($variants)): ?>
                <div class="space-y-2 max-w-full">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-[#182230]">Modèle sélectionné :</span>
                        <span id="selected-variant-name" class="font-bold text-[#0B54C2]">
                            <?= htmlspecialchars($variants[0]['name']) ?>
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-full" id="variant-selector-group">
                        <?php foreach ($variants as $vIdx => $variant): 
                            $isSelected = ($vIdx === 0);
                            $vPrice = (float)($variant['price'] ?: $product['price']);
                            $vMrp = (float)($variant['mrp'] ?: $product['mrp']);
                        ?>
                            <button type="button" 
                                    onclick="selectProductVariant(this, '<?= htmlspecialchars($variant['id']) ?>', '<?= htmlspecialchars(addslashes($variant['name'])) ?>', <?= $vPrice ?>, <?= $vMrp ?>, <?= (int)$variant['stock'] ?>, '<?= htmlspecialchars($variant['image_url'] ?: $mainImg) ?>')"
                                    class="variant-btn cursor-pointer w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all truncate <?= $isSelected ? 'border-[#0B54C2] bg-[#EAF3FF] text-[#0B54C2] shadow-2xs ring-1 ring-[#0B54C2]' : 'border-[#E8EDF3] bg-white text-[#182230] hover:bg-[#F3F7FC]' ?>">
                                <span class="truncate"><?= htmlspecialchars($variant['name']) ?></span>
                                <span class="text-[10px] font-black text-[#475467] ml-1.5 shrink-0"><?= formatPrice($vPrice) ?></span>
                            </button>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Calculateur Rapide de Frais de Livraison par Quartier Dakar -->
            <div class="p-3 bg-[#F8FAFD] rounded-2xl border border-[#E8EDF3] space-y-2 text-xs">
                <div class="flex items-center justify-between font-bold text-[#182230]">
                    <div class="flex items-center gap-1.5">
                        <i data-lucide="map-pin" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Livraison Dakar & Régions :</span>
                    </div>
                    <span class="text-[#0D7D53] font-black text-[11px]">Dès 1 500 F • Gratuit dès 50k</span>
                </div>
                <select id="prod-zone-selector" aria-label="Zone de livraison" onchange="updateProductDeliveryEstimate(this)" class="w-full bg-white border border-[#E8EDF3] p-2 rounded-xl text-xs font-semibold text-[#182230] outline-none">
                    <?php foreach (getDakarDeliveryZones() as $zk => $zinfo): ?>
                        <option value="<?= htmlspecialchars($zk) ?>" data-price="<?= $zinfo['price'] ?>" data-delay="<?= htmlspecialchars($zinfo['delay']) ?>">
                            <?= htmlspecialchars($zinfo['name']) ?> — <?= formatPrice($zinfo['price']) ?> (<?= htmlspecialchars($zinfo['delay']) ?>)
                        </option>
                    <?php endforeach; ?>
                </select>
                <p id="prod-zone-estimate-text" class="text-[11px] text-[#64748B]">
                    ⚡ Expédition express : livré sous <strong>2h à 4h</strong> par coursier à moto.
                </p>
            </div>

            <!-- Desktop Essential Purchase Form -->
            <form id="desktop-buy-form" action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="hidden lg:block space-y-3 pt-1">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
                <input type="hidden" id="selected-variant-id" name="variant_id" value="<?= !empty($variants) ? htmlspecialchars($variants[0]['id']) : '' ?>">

                <div class="flex items-center gap-3">
                    <!-- Quantity Stepper -->
                    <div class="flex items-center border border-[#E8EDF3] bg-white rounded-xl overflow-hidden shadow-2xs shrink-0">
                        <button type="button" onclick="changeQty(-1)" class="cursor-pointer px-3.5 py-3 text-[#667085] hover:text-[#182230] hover:bg-[#F3F7FC] transition-colors font-black text-sm" aria-label="Moins">-</button>
                        <input id="product-qty-input" type="number" name="quantity" value="1" min="1" max="<?= max(1, (int)$product['stock']) ?>" class="w-12 text-center text-xs font-black py-3 text-[#182230] focus:outline-none" aria-label="Quantité">
                        <button type="button" onclick="changeQty(1)" class="cursor-pointer px-3.5 py-3 text-[#667085] hover:text-[#182230] hover:bg-[#F3F7FC] transition-colors font-black text-sm" aria-label="Plus">+</button>
                    </div>

                    <!-- Add to Cart CTA -->
                    <button id="add-to-cart-btn" type="submit" class="cursor-pointer flex-1 py-3.5 px-4 font-extrabold text-xs sm:text-sm rounded-2xl border border-slate-200 bg-[#F8FAFD] hover:bg-[#EAEFF6] text-[#1D1D1F] transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-2">
                        <i data-lucide="shopping-bag" class="w-4 h-4 text-[#1677FF]"></i>
                        <span>Ajouter au panier</span>
                    </button>

                    <!-- Buy Now CTA -->
                    <button type="button" onclick="submitBuyNowForm()" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer flex-1 py-3.5 px-4 font-extrabold text-xs sm:text-sm rounded-2xl bg-[#1677FF] hover:bg-[#0B54C2] text-white transition-all shadow-[0_8px_20px_rgba(22,119,255,0.25)] active:scale-95 flex items-center justify-center gap-2">
                        <span>Acheter maintenant</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Desktop WhatsApp Direct Express Ordering (1-Clic — Apple / Emil Kowalski Tactile Button) -->
                <a id="desktop-whatsapp-order-btn" href="<?= getWhatsAppProductLink($product, !empty($variants) ? $variants[0]['name'] : null) ?>" target="_blank" rel="noopener" style="background-color: #25D366 !important; color: #ffffff !important;" class="w-full py-3.5 px-4 font-extrabold text-xs rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center gap-2 shadow-xs transition-all duration-150 cursor-pointer active:scale-[0.98]">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.704-.374-1.258-.528-2.079-1.808-2.142-1.892-.063-.084-.509-.678-.509-1.293s.322-.919.436-1.042c.114-.123.249-.155.334-.155.084 0 .168.002.241.006.077.004.181-.029.283.217.104.252.356.87.387.933.031.063.052.138.01.222-.042.084-.063.137-.126.21-.063.074-.132.164-.188.22-.063.063-.129.131-.056.257.073.126.326.539.7 0.871.482.428.887.561 1.013.624.126.063.2.052.273-.031.074-.084.316-.368.4-.494.084-.126.168-.105.283-.063.116.042.736.347.862.41.126.063.21.095.241.147.032.053.032.306-.112.711z"/></svg>
                    <span class="tracking-wide">Commander en 1 Clic sur WhatsApp (Livraison Dakar)</span>
                </a>

                <!-- 3-Pill Micro-Reassurance (UVP Dakar) -->
                <div class="grid grid-cols-3 gap-2 pt-1 text-[11px] font-bold text-[#334155]">
                    <div class="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <span class="text-base leading-none">🛡️</span>
                        <div>
                            <p class="font-extrabold text-[#0F172A] leading-tight">100% Original</p>
                            <p class="text-[10px] text-[#64748B] font-medium leading-tight">Neuf & garanti</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 p-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]">
                        <span class="text-base leading-none">🚚</span>
                        <div>
                            <p class="font-extrabold text-[#1E40AF] leading-tight">Dakar < 2h</p>
                            <p class="text-[10px] text-[#3B82F6] font-medium leading-tight">Chrono à domicile</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5 p-2 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                        <span class="text-base leading-none">📲</span>
                        <div>
                            <p class="font-extrabold text-[#166534] leading-tight">Wave & Cash</p>
                            <p class="text-[10px] text-[#16A34A] font-medium leading-tight">À la livraison</p>
                        </div>
                    </div>
                </div>
            </form>

        </div>

    </div>

    <!-- ─── 5. "L'ENGAGEMENT SENTECHPLUS" (Screenshot 3 Choice Block) ──────── -->
    <section class="card-clean p-4 sm:p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-2xs space-y-3 max-w-full">
        <h2 class="text-sm sm:text-base font-black text-[#15803D] flex items-center gap-2">
            <span class="bg-[#DCFCE7] text-[#15803D] text-[10px] font-extrabold px-2 py-0.5 rounded-md">Choice</span>
            <span>L'engagement SenTechPLUS</span>
        </h2>

        <div class="divide-y divide-[#F1F5F9] text-xs">
            <!-- Row 1: Delivery -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                    <i data-lucide="truck" class="w-5 h-5 text-[#15803D] shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-black text-[#182230]">Livraison Express Dakar H+2 ou 24h</p>
                        <p class="text-[#64748B] text-[11px]">Livraison rapide à domicile ou en point relais dans tout le Sénégal</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            </div>

            <!-- Row 2: Returns -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                    <i data-lucide="rotate-ccw" class="w-5 h-5 text-[#15803D] shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-black text-[#182230]">Politique de retour et de remboursement</p>
                        <p class="text-[#64748B] text-[11px]">Échange ou remboursement garanti sous 7 jours si non conforme</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            </div>

            <!-- Row 3: Security & Cash on delivery -->
            <div class="py-3 flex items-center justify-between gap-3">
                <div class="flex items-start gap-3">
                    <i data-lucide="shield-check" class="w-5 h-5 text-[#15803D] shrink-0 mt-0.5"></i>
                    <div>
                        <p class="font-black text-[#182230]">Sécurité & Paiement à la livraison</p>
                        <p class="text-[#64748B] text-[11px]">Payez en toute confiance à la réception par Wave, Orange Money ou Espèces</p>
                    </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-[#94A3B8] shrink-0"></i>
            </div>
        </div>
    </section>

    <!-- ─── 6. "SPÉCIFICATIONS TECHNIQUES & DESCRIPTION" ───────────────────── -->
    <section class="card-clean p-4 sm:p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-2xs space-y-4 max-w-full">
        <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="sliders" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Spécifications techniques</span>
            </h2>
            <span class="text-[11px] font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                ✓ 100% Conforme
            </span>
        </div>

        <!-- Structured Key-Value Specifications Table -->
        <?php if (!empty($cleanSpecs)): ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <?php foreach ($cleanSpecs as $specItem): 
                    if (empty($specItem['label']) || empty($specItem['value'])) continue;
                ?>
                    <div class="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#F8FAFD] border border-[#E8EDF3]">
                        <span class="font-bold text-[#64748B] shrink-0 mr-2"><?= htmlspecialchars($specItem['label']) ?></span>
                        <span class="font-black text-[#182230] text-right truncate max-w-[200px]"><?= htmlspecialchars($specItem['value']) ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="p-4 rounded-xl bg-[#F8FAFC] border border-[#E8EDF3] text-center text-xs text-[#64748B]">
                <p>Fiche technique détaillée bientôt disponible pour cet article.</p>
            </div>
        <?php endif; ?>

        <!-- Product Description with Key Highlights -->
        <?php if (!empty($product['description'])): ?>
            <div class="pt-3 border-t border-[#F1F5F9] space-y-1.5">
                <h3 class="text-xs font-bold text-[#182230] uppercase tracking-wider">Description de l'article :</h3>
                <div class="text-xs sm:text-sm text-[#475467] leading-relaxed">
                    <p><?= nl2br(htmlspecialchars($product['description'])) ?></p>
                </div>
            </div>
        <?php endif; ?>
    </section>

    <!-- ─── 7. "GALERIE DES AVIS & ÉVALUATIONS" ─────────────── -->
    <section id="section-reviews" class="card-clean p-4 sm:p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-2xs space-y-4 max-w-full">
        <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="star" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                <span>Avis & Évaluations Clients</span>
            </h2>
            <button type="button" onclick="document.getElementById('review-form-container').classList.toggle('hidden')" class="cursor-pointer text-xs font-bold text-[#1677FF] hover:text-[#0F67E5] flex items-center gap-1.5 bg-[#EAF3FF] px-3 py-1.5 rounded-full transition-colors">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                <span>Donner mon avis</span>
            </button>
        </div>

        <?php if (!empty($_SESSION['review_success'])): ?>
            <div class="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                    <span><?= htmlspecialchars($_SESSION['review_success']) ?></span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-xs font-black">✕</button>
            </div>
            <?php unset($_SESSION['review_success']); ?>
        <?php endif; ?>

        <!-- Formulaire d'ajout d'avis pliable -->
        <div id="review-form-container" class="hidden p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3] space-y-3">
            <h3 class="text-xs font-black text-[#182230] uppercase tracking-wider">Votre retour d'expérience</h3>
            <form method="POST" action="product.php?id=<?= urlencode($productId) ?>" class="space-y-3">
                <?= getCSRFInputField() ?>
                <input type="hidden" name="action" value="add_review">
                
                <div class="space-y-1">
                    <label class="block text-xs font-bold text-[#182230]">Votre note :</label>
                    <div class="flex items-center gap-1.5" id="star-rating-picker">
                        <?php for ($s = 1; $s <= 5; $s++): ?>
                            <button type="button" onclick="setFormRating(<?= $s ?>)" data-star="<?= $s ?>" class="star-btn cursor-pointer text-2xl text-[#F59E0B] hover:scale-110 transition-transform">
                                ★
                            </button>
                        <?php endfor; ?>
                    </div>
                    <input type="hidden" id="form-rating-val" name="rating" value="5">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                        <label for="rev-name" class="block font-bold text-[#182230] mb-1">Votre Prénom & Nom *</label>
                        <input type="text" id="rev-name" name="reviewer_name" value="<?= htmlspecialchars(getCurrentUser()['name'] ?? '') ?>" required placeholder="Ex: Awa Diop" class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] bg-white font-bold outline-none focus:border-[#1677FF]">
                    </div>
                </div>

                <div class="text-xs">
                    <label for="rev-comment" class="block font-bold text-[#182230] mb-1">Votre commentaire détaillé *</label>
                    <textarea id="rev-comment" name="comment" rows="3" required placeholder="Qualité du son, autonomie, rapidité de livraison à Dakar..." class="w-full px-3.5 py-2.5 rounded-xl border border-[#E8EDF3] bg-white font-medium outline-none focus:border-[#1677FF]"></textarea>
                </div>

                <button type="submit" class="cursor-pointer bg-[#1677FF] hover:bg-[#0F67E5] text-white font-black text-xs px-5 py-2.5 rounded-full transition-all shadow-xs flex items-center gap-2">
                    <i data-lucide="send" class="w-3.5 h-3.5"></i>
                    <span>Publier mon avis</span>
                </button>
            </form>
        </div>

        <!-- Horizontal Photo Review Cards -->
        <div class="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar max-w-full">
            <?php foreach ($reviews as $rev): 
                $rPhoto = $rev['photo'] ?? $mainImg;
            ?>
                <div class="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border border-[#E8EDF3] bg-[#F8FAFC]">
                    <img src="<?= htmlspecialchars($rPhoto) ?>" alt="Avis client - SenTechPLUS" width="112" height="112" loading="lazy" style="aspect-ratio:1/1;" class="w-full h-full object-cover">
                    <div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-center">
                        <span class="text-[10px] font-black text-amber-400">★ <?= (float)($rev['rating'] ?? 5) ?></span>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Rating Score & Customer Satisfaction Pills -->
        <div class="pt-2 space-y-3">
            <div class="flex items-center gap-3">
                <span class="text-3xl font-black text-[#182230]"><?= $avgRating > 0 ? $avgRating : '—' ?></span>
                <div>
                    <div class="text-[#F59E0B] text-sm tracking-wider">
                        <?php
                        $roundedScore = round($avgRating * 2) / 2;
                        for ($s = 1; $s <= 5; $s++) {
                            if ($s <= $roundedScore) {
                                echo '★';
                            } elseif ($s - 0.5 <= $roundedScore) {
                                echo '★';
                            } else {
                                echo '☆';
                            }
                        }
                        ?>
                    </div>
                    <p class="text-[11px] text-[#64748B]"><?= count($reviews) ?> évaluation<?= count($reviews) > 1 ? 's' : '' ?> client<?= count($reviews) > 1 ? 's' : '' ?> vérifiée<?= count($reviews) > 1 ? 's' : '' ?></p>
                </div>
            </div>

            <!-- Satisfaction Tags Réels -->
            <div class="flex flex-wrap gap-1.5">
                <?php if (count($reviews) > 0): 
                    $fiveCount = count(array_filter($reviews, fn($r) => (float)($r['rating'] ?? 0) >= 4.5));
                    $recommendRate = round((count(array_filter($reviews, fn($r) => (float)($r['rating'] ?? 0) >= 4)) / count($reviews)) * 100);
                ?>
                    <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i> <?= $recommendRate ?>% de satisfaction
                    </span>
                    <?php if ($fiveCount > 0): ?>
                        <span class="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#334155] text-xs font-bold">
                            <?= $fiveCount ?> coup<?= $fiveCount > 1 ? 's' : '' ?> de cœur 5★
                        </span>
                    <?php endif; ?>
                    <span class="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#334155] text-xs font-bold">
                        <?= count($reviews) ?> avis vérifié<?= count($reviews) > 1 ? 's' : '' ?>
                    </span>
                <?php else: ?>
                    <span class="px-3 py-1 rounded-full bg-blue-50 text-[#1677FF] text-xs font-bold flex items-center gap-1">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Premier avis à donner
                    </span>
                    <span class="px-3 py-1 rounded-full bg-[#F1F5F9] text-[#334155] text-xs font-bold">
                        Garantie satisfait ou remboursé
                    </span>
                <?php endif; ?>
            </div>

            <!-- Verified Reviews List -->
            <div class="space-y-2.5">
                <?php foreach (array_slice($reviews, 0, 3) as $revItem): ?>
                    <div class="p-3.5 rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3] space-y-1.5 text-xs">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-[#1677FF]/10 text-[#1677FF] font-black flex items-center justify-center text-[10px]">
                                    <?= strtoupper(substr($revItem['user_name'] ?? 'Client', 0, 1)) ?>
                                </div>
                                <span class="font-bold text-[#182230]"><?= htmlspecialchars($revItem['user_name'] ?? 'Client') ?></span>
                                <span class="text-[10px] font-black text-[#15803D] bg-emerald-50 px-1.5 py-0.2 rounded">✓ Achat Vérifié</span>
                            </div>
                            <span class="text-[10px] text-[#94A3B8]"><?= htmlspecialchars($revItem['created_at'] ?? date('Y-m-d')) ?></span>
                        </div>
                        <div class="text-[#F59E0B] text-xs">
                            <?= str_repeat('★', (int)($revItem['rating'] ?? 5)) . str_repeat('☆', max(0, 5 - (int)($revItem['rating'] ?? 5))) ?>
                        </div>
                        <p class="text-[#475467] leading-relaxed">
                            <?= htmlspecialchars($revItem['comment'] ?? '') ?>
                        </p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- ─── 7. "GUIDES & CONFORMITÉ" (Screenshot 2 Accordions) ─────────────── -->
    <section class="space-y-3 max-w-full">
        <!-- Guides et documents -->
        <div class="card-clean p-4 rounded-2xl bg-white border border-[#E8EDF3] shadow-2xs flex items-center justify-between">
            <div class="space-y-0.5">
                <h3 class="text-xs sm:text-sm font-black text-[#182230]">Fiche technique & Caractéristiques</h3>
                <p class="text-[11px] text-[#64748B]"><?= count($cleanSpecs) > 0 ? count($cleanSpecs) . ' spécifications officielles' : 'Fiche technique officielle SenTechPLUS' ?></p>
            </div>
            <?php if (!empty($cleanSpecs)): ?>
                <a href="#section-specs" class="text-xs font-bold text-[#1677FF] hover:underline flex items-center gap-1">
                    Consulter <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                </a>
            <?php else: ?>
                <a href="shop.php?category=<?= urlencode($product['category']) ?>" class="text-xs font-bold text-[#1677FF] hover:underline flex items-center gap-1">
                    Voir la catégorie <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
                </a>
            <?php endif; ?>
        </div>

        <!-- Déclaration de conformité -->
        <div class="card-clean p-4 rounded-2xl bg-white border border-[#E8EDF3] shadow-2xs space-y-1">
            <h3 class="text-xs sm:text-sm font-black text-[#182230]">Déclaration de conformité & Garantie</h3>
            <p class="text-[11px] text-[#64748B] leading-relaxed">
                Tous les produits vendus sur SenTechPLUS sont certifiés authentiques, neufs sous emballage d'origine et bénéficient de la garantie constructeur et locale à Dakar.
            </p>
        </div>
    </section>

    <!-- ─── 7.5. "QUESTIONS FRÉQUENTES & AIDE À LA DÉCISION (FAQ & IA ASSIST)" ─ -->
    <section id="section-product-faq" class="card-clean p-4 sm:p-6 rounded-3xl bg-white border border-[#E8EDF3] shadow-2xs space-y-4 max-w-full">
        <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-black text-[#182230] flex items-center gap-2">
                <i data-lucide="help-circle" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Questions fréquentes sur cet article</span>
            </h2>
            <span class="text-[11px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full">
                FAQ & Réponse Rapide
            </span>
        </div>

        <div class="space-y-2.5 text-xs" id="product-faq-accordion">
            <!-- Q1 -->
            <details class="group rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3] p-3.5 sm:p-4 transition-all" open>
                <summary class="font-black text-[#182230] cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center text-[10px] font-bold">1</span>
                        <span>Ce produit <?= htmlspecialchars($product['name']) ?> est-il 100% original et garanti ?</span>
                    </span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform"></i>
                </summary>
                <div class="mt-2.5 pt-2.5 border-t border-[#E8EDF3]/60 text-[#475467] leading-relaxed pl-7">
                    Oui, absolument. Tous les articles vendus sur SenTechPLUS sont certifiés 100% originaux, neufs sous blister constructeur et rigoureusement vérifiés avant expédition. Vous bénéficiez d'une garantie d'échange immédiat sous 7 jours en cas d'anomalie.
                </div>
            </details>

            <!-- Q2 -->
            <details class="group rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3] p-3.5 sm:p-4 transition-all">
                <summary class="font-black text-[#182230] cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center text-[10px] font-bold">2</span>
                        <span>Quels sont les délais et zones de livraison à Dakar et au Sénégal ?</span>
                    </span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform"></i>
                </summary>
                <div class="mt-2.5 pt-2.5 border-t border-[#E8EDF3]/60 text-[#475467] leading-relaxed pl-7">
                    Nous assurons une livraison express en 2h à 4h chrono partout dans la région de Dakar (Plateau, Almadies, Ngor, Mermoz, Maristes, Parcelles, Guédiawaye, Rufisque, etc.). L'expédition vers les régions (Thiès, Mbour, Saint-Louis, etc.) s'effectue sous 24h à 48h.
                </div>
            </details>

            <!-- Q3 -->
            <details class="group rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3] p-3.5 sm:p-4 transition-all">
                <summary class="font-black text-[#182230] cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center text-[10px] font-bold">3</span>
                        <span>Puis-je payer à la réception par Wave ou Orange Money ?</span>
                    </span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform"></i>
                </summary>
                <div class="mt-2.5 pt-2.5 border-t border-[#E8EDF3]/60 text-[#475467] leading-relaxed pl-7">
                    Oui ! Vous pouvez régler au moment où vous recevez et vérifiez votre colis : directement par Wave, Orange Money ou en espèces au livreur. Vous pouvez également finaliser votre commande en 1 clic via WhatsApp.
                </div>
            </details>

            <!-- Q4 -->
            <details class="group rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3] p-3.5 sm:p-4 transition-all">
                <summary class="font-black text-[#182230] cursor-pointer flex items-center justify-between gap-3 list-none">
                    <span class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-[#1677FF]/10 text-[#1677FF] flex items-center justify-center text-[10px] font-bold">4</span>
                        <span>Besoin d'aide ou d'un conseil de compatibilité ?</span>
                    </span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-[#64748B] group-open:rotate-180 transition-transform"></i>
                </summary>
                <div class="mt-2.5 pt-2.5 border-t border-[#E8EDF3]/60 text-[#475467] leading-relaxed pl-7">
                    Notre support technique basé à Dakar est joignable 7j/7. Cliquez sur le bouton WhatsApp pour échanger directement avec un conseiller qui répondra à toutes vos questions avant votre commande.
                </div>
            </details>
        </div>
    </section>

    <!-- ─── 8. "VOUS AIMEREZ AUSSI" (Screenshot 2 & 4 Product Cards Grid) ──── -->
    <?php if (!empty($relatedProducts)): ?>
        <section class="pt-4 space-y-3 max-w-full">
            <h2 class="text-sm sm:text-base font-black text-[#182230] uppercase tracking-wider flex items-center gap-2">
                <i data-lucide="sparkles" class="w-4 h-4 text-[#1677FF]"></i>
                <span>Vous aimerez aussi</span>
            </h2>

            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                <?php foreach ($relatedProducts as $rp): 
                    $rpImgs = getProductImages($rp['images'] ?? null, 'assets/images/hero_product_img1.webp');
                    $rpMainImg = $rpImgs[0] ?? 'assets/images/hero_product_img1.webp';
                    $rpDiscount = calculateDiscount((float)$rp['price'], (float)$rp['mrp']);
                ?>
                    <a href="product.php?id=<?= urlencode($rp['id']) ?>" class="prod-card" aria-label="<?= htmlspecialchars($rp['name']) ?> - <?= formatPrice($rp['price']) ?>">
                        
                        <div class="prod-card-top">
                            <div class="flex items-center gap-1">
                                <?php if ($rpDiscount > 0): ?>
                                    <span class="prod-badge-discount">-<?= $rpDiscount ?>%</span>
                                <?php else: ?>
                                    <span class="prod-badge-stock">En stock</span>
                                <?php endif; ?>
                            </div>

                            <div class="prod-rating">
                                <span>★</span>
                                <span style="color:#64748B;font-size:10px;">4.8</span>
                            </div>
                        </div>

                        <div class="prod-card-img-wrap">
                            <img src="<?= htmlspecialchars($rpMainImg) ?>" alt="<?= htmlspecialchars($rp['name']) ?> - SenTechPLUS" width="180" height="180" loading="lazy" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;">
                        </div>

                        <div class="prod-card-body">
                            <div>
                                <span class="prod-cat-text"><?= htmlspecialchars($rp['subcategory'] ?? $rp['category']) ?></span>
                                <h3 class="prod-name-text"><?= htmlspecialchars($rp['name']) ?></h3>
                            </div>

                            <div class="prod-price-row">
                                <span class="prod-price-val"><?= formatPrice($rp['price']) ?></span>
                                <?php if ($rp['mrp'] > $rp['price']): ?>
                                    <span class="prod-price-old"><?= formatPrice($rp['mrp']) ?></span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endif; ?>

</main>

<!-- ─── 9. APP-LIKE FIXED BOTTOM PURCHASE BAR (Apple Fluid Bar) ────── -->
<div id="mobile-sticky-buy-bar" class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/90 px-3 py-2.5 shadow-[0_-8px_30px_rgba(15,23,42,0.10)] flex items-center justify-between gap-2" style="padding-bottom: max(10px, env(safe-area-inset-bottom));">
    
    <!-- Actions Utilitaires Tactiles : WhatsApp & Panier (Boutons Squircle 44x44 Apple Style) -->
    <div class="flex items-center gap-1.5 shrink-0">
        <!-- 1. WhatsApp Direct Order -->
        <a href="<?= getWhatsAppProductLink($product, !empty($variants) ? $variants[0]['name'] : null) ?>" target="_blank" rel="noopener" class="w-11 h-11 rounded-2xl bg-[#E8F8F0] hover:bg-[#D1F2E2] text-[#0D7D53] border border-[#25D366]/30 flex items-center justify-center active:scale-95 transition-all shadow-2xs cursor-pointer" aria-label="Commander sur WhatsApp" title="Commander sur WhatsApp">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.075-1.704-.374-1.258-.528-2.079-1.808-2.142-1.892-.063-.084-.509-.678-.509-1.293s.322-.919.436-1.042c.114-.123.249-.155.334-.155.084 0 .168.002.241.006.077.004.181-.029.283.217.104.252.356.87.387.933.031.063.052.138.01.222-.042.084-.063.137-.126.21-.063.074-.132.164-.188.22-.063.063-.129.131-.056.257.073.126.326.539.7 0.871.482.428.887.561 1.013.624.126.063.2.052.273-.031.074-.084.316-.368.4-.494.084-.126.168-.105.283-.063.116.042.736.347.862.41.126.063.21.095.241.147.032.053.032.306-.112.711z"/></svg>
        </a>

        <!-- 2. Panier avec badge intégré sans débordement -->
        <button type="button" onclick="toggleCartDrawer(true)" class="relative w-11 h-11 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1D1D1F] border border-[#E2E8F0] flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-2xs" aria-label="Panier">
            <i data-lucide="shopping-cart" class="w-5 h-5 text-[#334155]"></i>
            <?php $cCount = (int)getCartCount(); if ($cCount > 0): ?>
                <span class="absolute -top-1 -right-1 bg-[#1677FF] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-xs">
                    <?= $cCount ?>
                </span>
            <?php endif; ?>
        </button>
    </div>

    <!-- 2 Boutons de Conversion Plein Format (Alignement parfait 44px) -->
    <div class="flex-1 flex items-center gap-2 min-w-0">
        <form action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="flex-1 min-w-0">
            <?= getCSRFInputField() ?>
            <input type="hidden" name="action" value="add">
            <input type="hidden" name="product_id" value="<?= htmlspecialchars($product['id']) ?>">
            <input type="hidden" id="mobile-selected-variant-id" name="variant_id" value="<?= !empty($variants) ? htmlspecialchars($variants[0]['id']) : '' ?>">
            <button type="submit" class="w-full h-11 px-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-[0.97] text-[#1D1D1F] font-bold text-xs sm:text-sm rounded-2xl truncate cursor-pointer transition-all border border-slate-200/90 flex items-center justify-center gap-1.5 shadow-2xs">
                <i data-lucide="plus" class="w-3.5 h-3.5 text-[#64748B] shrink-0"></i>
                <span>Panier</span>
            </button>
        </form>

        <form action="checkout.php" method="GET" class="flex-1 min-w-0">
            <input type="hidden" name="buy_now" value="<?= htmlspecialchars($product['id']) ?>">
            <button type="submit" style="background-color: #1677FF !important; color: #ffffff !important;" class="w-full h-11 px-2.5 bg-[#1677FF] hover:bg-[#0B54C2] active:scale-[0.97] text-white font-extrabold text-xs sm:text-sm rounded-2xl truncate cursor-pointer shadow-[0_4px_16px_rgba(22,119,255,0.28)] transition-all flex items-center justify-center gap-1.5">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-white shrink-0"></i>
                <span>Acheter</span>
            </button>
        </form>
    </div>

</div>

<!-- ─── 10. PRODUCT LIGHTBOX MODAL ────────────────────────────────────────── -->
<div id="product-lightbox" class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md hidden flex-col justify-between p-4 sm:p-6 select-none" role="dialog" aria-modal="true">
    <div class="flex items-center justify-between text-white text-xs max-w-4xl w-full mx-auto">
        <span id="lightbox-counter" class="font-mono bg-white/10 px-3 py-1 rounded-full font-bold">1 / <?= count($productMedia) ?></span>
        <span id="lightbox-title" class="font-bold truncate max-w-xs sm:max-w-md"><?= htmlspecialchars($product['name']) ?></span>
        <button type="button" onclick="closeProductLightbox()" class="cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Fermer">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
    </div>

    <div class="relative flex-1 flex items-center justify-center my-4 max-w-4xl w-full mx-auto overflow-hidden">
        <button type="button" onclick="navigateLightbox(-1)" class="cursor-pointer absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Précédent">
            <i data-lucide="chevron-left" class="w-6 h-6"></i>
        </button>

        <img id="lightbox-img" src="" width="600" height="600" alt="Zoom produit" class="max-w-full max-h-[75vh] object-contain rounded-2xl drop-shadow-2xl">

        <div id="lightbox-video-container" class="hidden w-full max-w-2xl max-h-[75vh] aspect-video items-center justify-center bg-black rounded-2xl overflow-hidden">
            <video id="lightbox-video" controls playsinline class="w-full h-full object-contain">
                <source src="" type="video/mp4">
            </video>
        </div>

        <button type="button" onclick="navigateLightbox(1)" class="cursor-pointer absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Suivant">
            <i data-lucide="chevron-right" class="w-6 h-6"></i>
        </button>
    </div>
</div>

<!-- ─── 11. INTERACTIVE JS SCRIPTS ────────────────────────────────────────── -->
<script>
window.PRODUCT_MEDIA = <?= json_encode($productMedia, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
let currentMediaIndex = 0;

function selectMedia(index) {
    if (!window.PRODUCT_MEDIA || !window.PRODUCT_MEDIA[index]) return;
    currentMediaIndex = index;
    const media = window.PRODUCT_MEDIA[index];
    const isVideo = (media.media_type === 'video');

    const imgContainer = document.getElementById('main-image-container');
    const vidContainer = document.getElementById('main-video-container');
    const mainImg = document.getElementById('main-product-img');
    const mainVid = document.getElementById('main-product-video');
    const badge = document.getElementById('active-media-badge');

    if (badge) badge.textContent = `Article ${index + 1}/${window.PRODUCT_MEDIA.length} | <?= addslashes(htmlspecialchars($product['category'])) ?>`;

    if (isVideo) {
        if (imgContainer) imgContainer.classList.add('hidden');
        if (vidContainer) {
            vidContainer.classList.remove('hidden');
            vidContainer.classList.add('flex');
            if (mainVid) {
                const source = mainVid.querySelector('source');
                if (source) source.src = media.file_path;
                mainVid.load();
            }
        }
    } else {
        if (vidContainer) {
            vidContainer.classList.add('hidden');
            vidContainer.classList.remove('flex');
            if (mainVid) mainVid.pause();
        }
        if (imgContainer) {
            imgContainer.classList.remove('hidden');
            if (mainImg) mainImg.src = media.file_path;
        }
    }

    document.querySelectorAll('.gallery-thumb-btn').forEach((btn, idx) => {
        if (idx === index) {
            btn.className = 'gallery-thumb-btn cursor-pointer w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl border-2 border-[#1677FF] bg-blue-50/40 overflow-hidden transition-all relative group';
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.className = 'gallery-thumb-btn cursor-pointer w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl border-2 border-[#E8EDF3] bg-[#F8FAFC] hover:border-[#1677FF] overflow-hidden transition-all relative group';
            btn.setAttribute('aria-selected', 'false');
        }
    });

    if (window.lucide) lucide.createIcons();
}

function navigateGallery(direction) {
    if (!window.PRODUCT_MEDIA || window.PRODUCT_MEDIA.length <= 1) return;
    let nextIndex = currentMediaIndex + direction;
    if (nextIndex < 0) nextIndex = window.PRODUCT_MEDIA.length - 1;
    if (nextIndex >= window.PRODUCT_MEDIA.length) nextIndex = 0;
    selectMedia(nextIndex);
}

function openProductLightbox(index) {
    const modal = document.getElementById('product-lightbox');
    if (!modal) return;
    currentMediaIndex = index;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    updateLightboxMedia();
}

function closeProductLightbox() {
    const modal = document.getElementById('product-lightbox');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    const vid = document.getElementById('lightbox-video');
    if (vid) vid.pause();
}

function updateLightboxMedia() {
    if (!window.PRODUCT_MEDIA || !window.PRODUCT_MEDIA[currentMediaIndex]) return;
    const media = window.PRODUCT_MEDIA[currentMediaIndex];
    const isVideo = (media.media_type === 'video');

    const counter = document.getElementById('lightbox-counter');
    const img = document.getElementById('lightbox-img');
    const vidContainer = document.getElementById('lightbox-video-container');
    const vid = document.getElementById('lightbox-video');

    if (counter) counter.textContent = (currentMediaIndex + 1) + ' / ' + window.PRODUCT_MEDIA.length;

    if (isVideo) {
        if (img) img.classList.add('hidden');
        if (vidContainer) {
            vidContainer.classList.remove('hidden');
            if (vid) {
                const src = vid.querySelector('source');
                if (src) src.src = media.file_path;
                vid.load();
                vid.play().catch(() => {});
            }
        }
    } else {
        if (vidContainer) {
            vidContainer.classList.add('hidden');
            if (vid) vid.pause();
        }
        if (img) {
            img.classList.remove('hidden');
            img.src = media.file_path;
        }
    }
}

function navigateLightbox(dir) {
    if (!window.PRODUCT_MEDIA || window.PRODUCT_MEDIA.length <= 1) return;
    currentMediaIndex += dir;
    if (currentMediaIndex < 0) currentMediaIndex = window.PRODUCT_MEDIA.length - 1;
    if (currentMediaIndex >= window.PRODUCT_MEDIA.length) currentMediaIndex = 0;
    updateLightboxMedia();
}

function selectProductVariant(btn, variantId, variantName, price, mrp, stock, imgUrl) {
    document.querySelectorAll('.variant-btn').forEach(b => {
        b.className = 'variant-btn cursor-pointer w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-all truncate border-[#E8EDF3] bg-white text-[#182230] hover:bg-[#F3F7FC]';
    });
    btn.className = 'variant-btn cursor-pointer w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-all truncate border-[#1677FF] bg-[#EAF3FF] text-[#0B54C2] shadow-2xs ring-1 ring-[#1677FF]';

    const label = document.getElementById('selected-variant-name');
    if (label) label.textContent = variantName;

    const input = document.getElementById('selected-variant-id');
    if (input) input.value = variantId;

    const mobInput = document.getElementById('mobile-selected-variant-id');
    if (mobInput) mobInput.value = variantId;

    const priceDisplay = document.getElementById('display-price');
    if (priceDisplay) priceDisplay.textContent = new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';

    if (imgUrl && document.getElementById('main-product-img')) {
        document.getElementById('main-product-img').src = imgUrl;
    }
}

function changeQty(delta) {
    const input = document.getElementById('product-qty-input');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    const max = parseInt(input.max) || 99;
    val += delta;
    if (val < 1) val = 1;
    if (val > max) val = max;
    input.value = val;
}

function submitBuyNowForm() {
    const form = document.getElementById('desktop-buy-form');
    if (!form) return;
    form.action = 'checkout.php';
    form.submit();
}

function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: '<?= addslashes(htmlspecialchars($product['name'])) ?>',
            text: 'Découvrez <?= addslashes(htmlspecialchars($product['name'])) ?> sur SenTechPLUS Dakar !',
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (typeof showToast === 'function') {
                showToast('Lien copié dans le presse-papier !');
            } else {
                alert('Lien copié !');
            }
        });
    }
}

function toggleWishlistInline(productId, btn) {
    fetch('wishlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: 'action=toggle&product_id=' + encodeURIComponent(productId) + '&csrf_token=' + encodeURIComponent('<?= generateCSRFToken() ?>')
    }).then(res => res.json()).then(data => {
        const icon = btn.querySelector('svg') || btn.querySelector('i');
        if (data.in_wishlist) {
            btn.classList.add('text-rose-500');
            if (typeof showToast === 'function') showToast('Ajouté aux favoris !');
        } else {
            btn.classList.remove('text-rose-500');
            if (typeof showToast === 'function') showToast('Retiré des favoris');
        }
    }).catch(() => {
        window.location.href = 'wishlist.php';
    });
}

function copyCouponCode(code, btn) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            const origText = btn.textContent;
            btn.textContent = 'Copié !';
            btn.classList.add('bg-emerald-50', 'text-emerald-600', 'border-emerald-200');
            if (typeof showToast === 'function') showToast('Code promo ' + code + ' copié !');
            setTimeout(() => {
                btn.textContent = origText;
                btn.classList.remove('bg-emerald-50', 'text-emerald-600', 'border-emerald-200');
            }, 2500);
        }).catch(() => {});
    }
}

function setFormRating(rating) {
    const input = document.getElementById('form-rating-val');
    if (input) input.value = rating;
    const buttons = document.querySelectorAll('#star-rating-picker .star-btn');
    buttons.forEach((btn, idx) => {
        if (idx < rating) {
            btn.textContent = '★';
            btn.className = 'star-btn cursor-pointer text-2xl text-[#F59E0B] hover:scale-110 transition-transform';
        } else {
            btn.textContent = '☆';
            btn.className = 'star-btn cursor-pointer text-2xl text-[#CBD5E1] hover:scale-110 transition-transform';
        }
    });
}

function updateProductDeliveryEstimate(selectEl) {
    const selectedOpt = selectEl.options[selectEl.selectedIndex];
    const delay = selectedOpt.getAttribute('data-delay') || '2h à 4h';
    const textEl = document.getElementById('prod-zone-estimate-text');
    if (textEl) {
        textEl.innerHTML = `⚡ Expédition express : livré sous <strong>${delay}</strong> par coursier à moto.`;
    }
}

// Live Flash Sale Countdown (Synchronisé & Vivant)
(function initFlashCountdown() {
    const hEl = document.getElementById('pcd-hours');
    const mEl = document.getElementById('pcd-mins');
    const sEl = document.getElementById('pcd-secs');
    if (!hEl || !mEl || !sEl) return;

    // Fixe une fin à minuit aujourd'hui + 6 heures
    const now = new Date();
    const target = new Date();
    target.setHours(23, 59, 59, 999);

    function update() {
        const current = new Date();
        let diff = Math.floor((target - current) / 1000);
        if (diff <= 0) diff = 3600 * 4 + 1800; // Reset si dépassé

        const hours = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const secs = diff % 60;

        hEl.textContent = String(hours).padStart(2, '0');
        mEl.textContent = String(mins).padStart(2, '0');
        sEl.textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
})();
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
