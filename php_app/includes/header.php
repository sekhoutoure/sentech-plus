<?php
if (!defined('SITE_NAME')) {
    require_once __DIR__ . '/../config/config.php';
}
$pageTitle = isset($pageTitle) ? (str_contains($pageTitle, SITE_NAME) ? $pageTitle : $pageTitle . ' — ' . SITE_NAME) : SITE_NAME . ' — ' . SITE_TAGLINE;
$metaDescription = $metaDescription ?? "Boutique en ligne officielle d'accessoires High-Tech certifiés au Sénégal (Dakar). Casques, écouteurs, montres connectées, enceintes avec livraison express 2h.";
$ogImage = $ogImage ?? "assets/images/og_cover.svg";
$ogType = $ogType ?? "website";


// Detect protocol and host for absolute social sharing URLs and canonical enforcement
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? "https://" : "http://";
$currentHost = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';
$currentUri = $_SERVER['REQUEST_URI'] ?? '/';
$isLocal = in_array($currentHost, ['localhost', '127.0.0.1']) || str_starts_with($currentHost, '192.168.');
$canonicalBase = (!$isLocal && defined('APP_URL') && !empty(APP_URL)) ? rtrim(APP_URL, '/') : ($protocol . $currentHost);
$reqPath = parse_url($currentUri, PHP_URL_PATH) ?: '/';
$reqQuery = parse_url($currentUri, PHP_URL_QUERY);
$canonicalUrl = $canonicalUrl ?? ($canonicalBase . $reqPath . ($reqQuery ? '?' . $reqQuery : ''));
$absoluteOgImage = (strpos($ogImage, 'http') === 0) ? $ogImage : $canonicalBase . '/' . ltrim($ogImage, '/');
?>
<!DOCTYPE html>
<html lang="fr" class="scroll-smooth overflow-x-hidden">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <meta name="description" content="<?= htmlspecialchars($metaDescription) ?>">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="<?= htmlspecialchars($canonicalUrl) ?>">
    <!-- Immediate Service Worker Auto-Purge (Prevents InfinityFree MIME Challenge Error) -->
    <script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(regs) {
            for (var i = 0; i < regs.length; i++) { regs[i].unregister(); }
        }).catch(function() {});
    }
    </script>

    
    <!-- Open Graph (WhatsApp, Facebook, LinkedIn Rich Previews) -->
    <meta property="og:site_name" content="SenTechPLUS Dakar">
    <meta property="og:type" content="<?= htmlspecialchars($ogType) ?>">
    <meta property="og:url" content="<?= htmlspecialchars($canonicalUrl) ?>">
    <meta property="og:title" content="<?= htmlspecialchars($pageTitle) ?>">
    <meta property="og:description" content="<?= htmlspecialchars($metaDescription) ?>">
    <meta property="og:image" content="<?= htmlspecialchars($absoluteOgImage) ?>">
    <meta property="og:image:secure_url" content="<?= htmlspecialchars($absoluteOgImage) ?>">
    <meta property="og:image:width" content="800">
    <meta property="og:image:height" content="800">
    <meta property="og:image:alt" content="<?= htmlspecialchars($pageTitle) ?>">
    <meta property="og:locale" content="fr_FR">

    <?php if (isset($ogPrice) && $ogPrice > 0): ?>
        <meta property="product:price:amount" content="<?= htmlspecialchars($ogPrice) ?>">
        <meta property="product:price:currency" content="XOF">
    <?php endif; ?>

    <!-- Twitter Cards (X) -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= htmlspecialchars($pageTitle) ?>">
    <meta name="twitter:description" content="<?= htmlspecialchars($metaDescription) ?>">
    <meta name="twitter:image" content="<?= htmlspecialchars($absoluteOgImage) ?>">

    <meta name="theme-color" content="#1677FF">
    <link rel="apple-touch-icon" href="assets/images/sentech_icon.webp">
    <link rel="icon" href="assets/images/sentech_icon.png" type="image/png">
    <script>
      (function(){
        var m = document.createElement('link');
        m.rel = 'manifest';
        m.href = 'manifest.json?v=20260907_v2';
        if ('requestIdleCallback' in window) {
          requestIdleCallback(function(){ document.head.appendChild(m); });
        } else {
          window.addEventListener('load', function(){ document.head.appendChild(m); });
        }
      })();
    </script>
    <noscript><link rel="manifest" href="manifest.json?v=20260907_v2"></noscript>

    <?php
    $baseAppUrl = defined('APP_URL') && !empty(APP_URL) ? rtrim(APP_URL, '/') : 'https://www.sentechplus.com';
    $rawContactAddress = defined('CONTACT_ADDRESS') ? CONTACT_ADDRESS : 'Point E, Boulevard de l\'Est, Dakar, Sénégal';
    $cleanContactAddress = strip_tags(html_entity_decode($rawContactAddress, ENT_QUOTES, 'UTF-8'));
    $rawContactPhone = defined('CONTACT_PHONE') ? CONTACT_PHONE : '+221 78 131 64 97';
    $cleanContactPhone = strip_tags(html_entity_decode($rawContactPhone, ENT_QUOTES, 'UTF-8'));

    $storeSchema = [
        "@context" => "https://schema.org",
        "@type" => "ElectronicsStore",
        "name" => "SenTechPLUS — High-Tech Sénégal",
        "image" => $absoluteOgImage,
        "@id" => $baseAppUrl . "/#store",
        "url" => $baseAppUrl . "/",
        "telephone" => $cleanContactPhone,
        "priceRange" => "5000 - 1500000 XOF",
        "currenciesAccepted" => "XOF",
        "paymentAccepted" => "Wave, Orange Money, Cash on Delivery, Carte Bancaire",
        "address" => [
            "@type" => "PostalAddress",
            "streetAddress" => $cleanContactAddress,
            "addressLocality" => "Dakar",
            "postalCode" => "18524",
            "addressCountry" => "SN"
        ],
        "geo" => [
            "@type" => "GeoCoordinates",
            "latitude" => 14.6928,
            "longitude" => -17.4467
        ],
        "openingHoursSpecification" => [
            [
                "@type" => "OpeningHoursSpecification",
                "dayOfWeek" => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens" => "08:30",
                "closes" => "20:00"
            ]
        ],
        "sameAs" => [
            "https://www.facebook.com/sentechplus",
            "https://www.instagram.com/sentechplus",
            "https://www.linkedin.com/company/sentechplus"
        ]
    ];

    $websiteSchema = [
        "@context" => "https://schema.org",
        "@type" => "WebSite",
        "name" => "SenTechPLUS",
        "url" => $baseAppUrl . "/",
        "potentialAction" => [
            "@type" => "SearchAction",
            "target" => [
                "@type" => "EntryPoint",
                "urlTemplate" => $baseAppUrl . "/search.php?q={search_term_string}"
            ],
            "query-input" => "required name=search_term_string"
        ]
    ];
    ?>
    <!-- Schema.org Global Organization & Store (Strict RFC 8259 Standard Compliant) -->
    <script type="application/ld+json">
    <?= json_encode($storeSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?>
    </script>

    <!-- Schema.org Sitelinks Search Box -->
    <script type="application/ld+json">
    <?= json_encode($websiteSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?>
    </script>

    <?php if (!empty($schemaJsonLd)): ?>
    <!-- Page Specific Schema.org JSON-LD (Product, Breadcrumbs, FAQ) -->
    <script type="application/ld+json">
    <?= is_array($schemaJsonLd) ? json_encode($schemaJsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) : $schemaJsonLd ?>
    </script>
    <?php endif; ?>

    <?php 
    $gaId = getenv('GA_TRACKING_ID') ?: '';
    if (!empty($gaId)): 
    ?>
    <!-- Google Analytics 4 (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?= htmlspecialchars($gaId) ?>"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?= htmlspecialchars($gaId) ?>');
    </script>
    <?php endif; ?>
    
    <!-- Contextual LCP Image Preload — only preloads image actually rendered on current view -->
    <?php 
    $currentScript = basename($_SERVER['PHP_SELF'] ?? '');
    if (!empty($preloadImage)):
    ?>
    <link rel="preload" as="image" href="<?= htmlspecialchars($preloadImage) ?>" type="image/webp" fetchpriority="high">
    <?php
    elseif ($currentScript === 'index.php' || $currentScript === ''): 
    ?>
    <link rel="preload" as="image" href="assets/images/banners/banner_smart_tech.webp" media="(min-width: 641px)" type="image/webp" fetchpriority="high">
    <link rel="preload" as="image" href="assets/images/banners/banner_smart_tech_mob.webp" media="(max-width: 640px)" type="image/webp" fetchpriority="high">
    <?php 
    elseif ($currentScript === 'shop.php'):
    ?>
    <link rel="preload" as="image" href="assets/images/product_img4.webp" type="image/webp" fetchpriority="high">
    <?php
    elseif ($currentScript === 'product.php'): 
        $preloadImg = !empty($mainImg) ? $mainImg : (!empty($product) ? getProductMainImage($product) : '');
        if (!empty($preloadImg) && strlen($preloadImg) > 3):
    ?>
    <link rel="preload" as="image" href="<?= htmlspecialchars($preloadImg) ?>" type="image/webp" fetchpriority="high">
    <?php 
        endif;
    else:
    ?>
    <link rel="preload" as="image" href="assets/images/sentech_logo.webp" type="image/webp" fetchpriority="high">
    <?php 
    endif; 
    ?>
    
    <!-- Optimized Preloaded Tailwind CSS (Single-Pass Layout, Zero Reflow Thrashing) -->
    <link rel="preload" as="style" href="assets/css/tailwind.min.css?v=<?= file_exists(__DIR__ . '/../assets/css/tailwind.min.css') ? filemtime(__DIR__ . '/../assets/css/tailwind.min.css') : 1 ?>">
    <link rel="stylesheet" href="assets/css/tailwind.min.css?v=<?= file_exists(__DIR__ . '/../assets/css/tailwind.min.css') ? filemtime(__DIR__ . '/../assets/css/tailwind.min.css') : 1 ?>">
    
    <!-- Local Self-Hosted Lucide Icons (Zero Tracking Warnings, 100% Offline Compatible) -->
    <script src="assets/js/lucide.min.js?v=<?= file_exists(__DIR__ . '/../assets/js/lucide.min.js') ? filemtime(__DIR__ . '/../assets/js/lucide.min.js') : time() ?>" defer></script>
    
    <style>
      /* Self-Hosted Poppins Fonts (Inlined to eliminate HTTP requests & chaining) */
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-display: optional;
        src: url('assets/fonts/poppins_2_pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      @font-face {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-display: optional;
        src: url('assets/fonts/poppins_5_pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }

      #mobile-drawer-overlay.hidden,
      #mobile-search-overlay.hidden,
      #desktop-mega-menu.hidden,
      #desktop-notifs-dropdown.hidden,
      #compact-notifs-dropdown.hidden {
        display: none !important;
      }

      :root{
        --brand-blue:#1677FF;
        --brand-blue-hover:#0F67E5;
        --brand-ice:#EEF4FB;
        --brand-fog:#F4F7FB;
        --brand-soft:#F8FAFD;
        --brand-text:#182230;
        --brand-text-muted:#64748B;
        --brand-border:rgba(226, 232, 240, 0.65);
        --brand-border-light:rgba(226, 232, 240, 0.4);
        
        /* ── Apple Design WWDC Springs & Physics ── */
        --ease-out:cubic-bezier(0.23,1,0.32,1);
        --ease-in-out:cubic-bezier(0.77,0,0.175,1);
        --ease-drawer:cubic-bezier(0.32,0.72,0,1);
        --ease-apple:cubic-bezier(0.25,1,0.5,1);
        --ease-apple-standard:cubic-bezier(0.25,1,0.5,1);       /* Damping 1.0, Response 0.35s */
        --ease-apple-spring:cubic-bezier(0.175,0.885,0.32,1.15); /* Momentum flick spring */
        --ease-apple-sheet:cubic-bezier(0.32,0.72,0,1);          /* iOS Sheet / Drawer curve */
        --ease-apple-bounce:cubic-bezier(0.34,1.56,0.64,1);      /* Badge / Pill Pop */
        --ease-smooth:cubic-bezier(0.16,1,0.3,1);
        --ease-spring:cubic-bezier(0.175,0.885,0.32,1.275);
      }
      html,body{overflow-x:hidden!important;width:100%!important;max-width:100%!important;margin:0;padding:0}
      body{
        background-color:var(--brand-fog);
        color:var(--brand-text);
        font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
        letter-spacing:-0.008em;
        line-height:1.55;
        font-optical-sizing:auto;
        -webkit-font-smoothing:antialiased;
        -moz-osx-font-smoothing:grayscale;
      }
      
      /* ── Apple Typography: Optical Sizing, Dynamic Tracking & Leading ── */
      h1, .text-3xl, .text-4xl, .text-5xl, .font-display {
        font-family:'Poppins',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
        letter-spacing:-0.028em !important;
        line-height:1.14 !important;
        font-optical-sizing:auto;
      }
      h2, .text-2xl {
        font-family:'Poppins',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
        letter-spacing:-0.02em !important;
        line-height:1.24 !important;
        font-optical-sizing:auto;
      }
      h3, .text-xl {
        font-family:'Poppins',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;
        letter-spacing:-0.015em !important;
        line-height:1.3 !important;
        font-optical-sizing:auto;
      }
      h4, h5, h6, .text-lg {
        letter-spacing:-0.01em !important;
        line-height:1.35 !important;
        font-optical-sizing:auto;
      }
      .badge-pill, .badge, [class*="badge-"] {
        letter-spacing:0.035em !important;
      }

      img,iframe,svg,video{max-width:100%;height:auto}
      button,a,input,select,textarea{touch-action:manipulation}
      .line-clamp-1,.line-clamp-2,.line-clamp-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
      .line-clamp-1{-webkit-line-clamp:1}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{-webkit-line-clamp:3}
      
      /* ── Apple Materials & Translucency ── */
      .glass-header{
        background:rgba(255,255,255,.88);
        backdrop-filter:blur(20px) saturate(190%);
        -webkit-backdrop-filter:blur(20px) saturate(190%);
        border-bottom:1px solid rgba(226,232,240,0.7);
        box-shadow:0 4px 20px -2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.02);
      }
      .glass-overlay{
        background:rgba(15,23,42,.40);
        backdrop-filter:blur(8px) saturate(130%);
        -webkit-backdrop-filter:blur(8px) saturate(130%);
      }
      
      /* ── Apple Response: Instantaneous tactile press feedback (< 100ms) ── */
      button:active:not([disabled]),
      a.btn:active,
      a.btn-electric:active,
      .btn-electric:active,
      .btn-press:active,
      .card-clean:active,
      .tab-btn:active,
      .chip:active,
      [role="button"]:active,
      .touch-press:active {
        transform:scale(0.965)!important;
        transition:transform 90ms var(--ease-apple-standard)!important;
      }
      .prod-card:active{
        transform:scale(0.978)!important;
        transition:transform 90ms var(--ease-apple-standard)!important;
      }

      .badge-pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700}
      input,select,textarea{outline:none!important;transition:border-color .2s ease,box-shadow .2s ease,background-color .2s ease;-webkit-tap-highlight-color:transparent!important;}
      .skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
      @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      
      /* ── Apple Card Architecture: Soft diffused layered ambient lighting ── */
      .card-clean{
        background:#FFFFFF;
        border:1px solid var(--brand-border);
        border-radius:1.25rem;
        box-shadow:0 2px 14px -2px rgba(15,23,42,0.035),0 1px 3px rgba(15,23,42,0.02);
        transition:border-color .2s var(--ease-apple-standard),box-shadow .2s var(--ease-apple-standard),transform .18s var(--ease-apple-standard);
        word-break:break-word;
      }
      .card-clean:hover{
        border-color:rgba(22,119,255,0.28);
        box-shadow:0 12px 30px -4px rgba(22,119,255,0.08);
        transform:translateY(-2px);
      }
      .bg-soft{background-color:var(--brand-soft)}
      .border-soft{border:1px solid var(--brand-border)}
      .border-subtle{border:1px solid var(--brand-border-light)}

      /* Off-Screen Layout & Style Calculation Optimizer */
      .content-auto {
        content-visibility: auto;
        contain-intrinsic-size: auto 500px;
      }
      .shadow-soft{box-shadow:0 2px 14px -2px rgba(15,23,42,0.035),0 1px 3px rgba(15,23,42,0.02)}
      
      .btn-electric{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        background-color:var(--brand-blue);
        color:#fff;
        font-family:'Poppins',sans-serif;
        font-weight:700;
        border-radius:.75rem;
        padding:.625rem 1.25rem;
        min-height:44px;
        box-shadow:0 3px 12px rgba(22,119,255,.24), inset 0 1px 0 rgba(255,255,255,0.25);
        transition:background-color .2s var(--ease-apple-standard),box-shadow .2s var(--ease-apple-standard),transform .12s var(--ease-apple-standard);
        cursor:pointer;
      }
      .btn-electric:hover{
        background-color:var(--brand-blue-hover);
        box-shadow:0 6px 18px rgba(22,119,255,.32);
      }

      /* ─── IHM & Ergonomie Cognitive Excellence (Lois de Fitts, Hick & Apple HIG) ─── */
      * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      ::selection { background-color: #1677FF; color: #FFFFFF; }
      ::-moz-selection { background-color: #1677FF; color: #FFFFFF; }
      
      /* Loi de Fitts : Cibles tactiles d'au moins 44px sur mobile (protège boutons circulaires et icônes) */
      @media (pointer: coarse) {
        button:not(.btn-compact):not(.btn-circle):not([class*="rounded-full"]):not([class*="w-"]):not([class*="h-"]),
        a.btn-electric,
        select,
        input[type="submit"]:not([class*="w-"]):not([class*="rounded-full"]),
        input[type="button"]:not([class*="w-"]):not([class*="rounded-full"]) {
          min-height: 44px;
        }
      }

      /* Règle stricte anti-déformation pour tous les boutons circulaires ou à dimensions explicites */
      .btn-pill-arrow,
      button.btn-pill-arrow {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        max-width: 32px !important;
        max-height: 32px !important;
        border-radius: 9999px !important;
        aspect-ratio: 1 / 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        margin: 0 2px 0 0 !important;
        border: none !important;
        flex-shrink: 0 !important;
        background-color: #1677FF !important;
        color: #FFFFFF !important;
        box-shadow: 0 2px 6px rgba(22, 119, 255, 0.28) !important;
      }
      .btn-pill-arrow:active {
        transform: scale(0.92) !important;
      }

      .btn-pill-arrow-lg,
      button.btn-pill-arrow-lg {
        width: 36px !important;
        height: 36px !important;
        min-width: 36px !important;
        min-height: 36px !important;
        max-width: 36px !important;
        max-height: 36px !important;
        border-radius: 9999px !important;
        aspect-ratio: 1 / 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        margin: 0 3px 0 0 !important;
        border: none !important;
        flex-shrink: 0 !important;
        background-color: #1677FF !important;
        color: #FFFFFF !important;
        box-shadow: 0 2px 6px rgba(22, 119, 255, 0.28) !important;
      }
      .btn-pill-arrow-lg:active {
        transform: scale(0.92) !important;
      }
      button.rounded-full,
      button[class*="w-"][class*="h-"],
      button.btn-circle,
      .btn-circle {
        min-height: unset !important;
        min-width: unset !important;
        aspect-ratio: 1 / 1 !important;
        box-sizing: border-box !important;
      }

      /* Anti-Zoom Mobile & Tactile Optimization */
      html, body {
        touch-action: manipulation;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      @media screen and (max-width: 768px) {
        input[type="text"],
        input[type="number"],
        input[type="email"],
        input[type="tel"],
        input[type="search"],
        input[type="password"],
        select,
        textarea {
          font-size: 16px !important;
        }
      }

      /* ─── Apple Design: Universal Form Input Ergonomics (Zero Double Outline) ─── */
      /* Supprime à 100% tout contour rectangulaire (outline) sur TOUS les champs de saisie du site */
      input,
      select,
      textarea,
      input:focus,
      select:focus,
      textarea:focus,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: none !important;
        outline-offset: 0 !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      /* Champs transparents intégrés dans des pilules ou conteneurs groupés */
      input.bg-transparent,
      input.bg-transparent:focus,
      input.bg-transparent:focus-visible,
      input[type="search"],
      input[type="search"]:focus,
      input[type="search"]:focus-visible,
      .no-focus-ring,
      .no-focus-ring:focus,
      .no-focus-ring:focus-visible,
      form[action*="search.php"] input,
      form[action*="search.php"] input:focus,
      form[action*="search.php"] input:focus-visible {
        outline: none !important;
        outline-offset: 0 !important;
        box-shadow: none !important;
        border: none !important;
        -webkit-appearance: none !important;
      }

      /* Champs de saisie standards : halo doux Apple (épouse la rondeur naturelle du champ) */
      input:not(.bg-transparent):not(.no-focus-ring):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):focus,
      textarea:not(.no-focus-ring):focus,
      select:not(.no-focus-ring):focus {
        border-color: #0071E3 !important;
        box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.15) !important;
        outline: none !important;
      }

      /* Indicateur d'accessibilité clavier réservé exclusivement aux boutons et liens (jamais aux champs texte) */
      button:focus-visible,
      a:focus-visible,
      [role="button"]:focus-visible,
      summary:focus-visible {
        outline: 2px solid #0071E3 !important;
        outline-offset: 2px !important;
        border-radius: 8px;
      }
      
      .contain-paint {
        contain: paint;
      }

      /* ─── Apple Fluid Modal & Drawer Architecture (Spring Physics & Velocity-Aware) ─── */
      .anim-drawer-overlay{display:none;opacity:0;visibility:hidden;transition:opacity 240ms var(--ease-apple-standard),visibility 240ms var(--ease-apple-standard);}
      .anim-drawer-overlay.active{display:block;opacity:1;visibility:visible;}
      .anim-drawer-panel{transform:translateX(100%);transition:transform 300ms var(--ease-apple-sheet);will-change:transform;}
      .anim-drawer-overlay.active .anim-drawer-panel{transform:translateX(0);}

      .anim-modal-overlay{display:none;opacity:0;visibility:hidden;transition:opacity 220ms var(--ease-apple-standard),visibility 220ms var(--ease-apple-standard);}
      .anim-modal-overlay.active{display:flex;opacity:1;visibility:visible;}
      .anim-modal-dialog{transform:scale(0.95) translateY(10px);opacity:0;transition:transform 260ms var(--ease-apple-spring),opacity 220ms var(--ease-apple-standard);will-change:transform,opacity;}
      .anim-modal-overlay.active .anim-modal-dialog{transform:scale(1) translateY(0);opacity:1;}

      /* ─── Apple Drag Handle (Grabber Pill for Sheets & Drawers) ──────── */
      .apple-drag-handle {
        width: 38px;
        height: 5px;
        border-radius: 9999px;
        background: rgba(148, 163, 184, 0.45);
        margin: 6px auto 2px;
        cursor: grab;
        transition: background-color 150ms ease;
      }
      .apple-drag-handle:active {
        background: rgba(100, 116, 139, 0.75);
        cursor: grabbing;
      }

      /* ─── Apple Dynamic Capsule Floating Toast ─────────────────────── */
      .apple-toast {
        position: fixed;
        bottom: 84px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 18px;
        border-radius: 9999px;
        background: rgba(18, 24, 38, 0.88);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        color: #FFFFFF;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: -0.01em;
        border: 1px solid rgba(255, 255, 255, 0.16);
        box-shadow: 0 16px 36px -6px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.25);
        animation: appleToastEnter 320ms var(--ease-apple-spring) forwards;
        max-width: calc(100vw - 32px);
        pointer-events: auto;
      }
      @media (min-width: 1024px) {
        .apple-toast { bottom: 28px; }
      }
      .apple-toast.toast-exit {
        animation: appleToastExit 240ms var(--ease-apple-standard) forwards;
      }
      @keyframes appleToastEnter {
        0% { opacity: 0; transform: translate(-50%, 20px) scale(0.92); }
        100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
      }
      @keyframes appleToastExit {
        0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        100% { opacity: 0; transform: translate(-50%, 14px) scale(0.94); }
      }

      /* Apple Spring Pop for Badges & Micro-Interactions */
      .animate-badge-pop {
        animation: appleBadgePop 340ms var(--ease-apple-bounce) !important;
      }
      @keyframes appleBadgePop {
        0% { transform: scale(1); }
        40% { transform: scale(1.35); }
        75% { transform: scale(0.92); }
        100% { transform: scale(1); }
      }

      /* ─── Ultra-Fluid Hero Slides Crossfade ─────────────────────────── */
      .hero-slide-item{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:scale(0.98);transition:opacity 400ms var(--ease-smooth),transform 400ms var(--ease-smooth),visibility 400ms;pointer-events:none;}
      .hero-slide-item.active{opacity:1!important;visibility:visible!important;transform:scale(1)!important;pointer-events:auto;}

      /* ─── Mobile Accordion Drawer (Closed by default) ─────────────── */
      #mobile-drawer{display:none;}
      #mobile-drawer.open{display:block;animation:smoothFadeIn 0.25s var(--ease-smooth);}
      @keyframes smoothFadeIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}

      /* ─── Apple-Style Glassmorphism & Soft Layered Shadows ───────────────── */
      .glass-nav {
        background: rgba(255, 255, 255, 0.94) !important;
        border-bottom: 1px solid rgba(226, 232, 240, 0.7) !important;
      }
      @media (min-width: 1024px) {
        .glass-nav {
          background: rgba(255, 255, 255, 0.84) !important;
          backdrop-filter: blur(20px) saturate(190%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.6) !important;
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02) !important;
        }
      }
      .glass-drawer {
        background: rgba(255, 255, 255, 0.94) !important;
        backdrop-filter: blur(24px) saturate(200%) !important;
        -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
        border-left: 1px solid rgba(255, 255, 255, 0.8) !important;
        box-shadow: -10px 0 35px -5px rgba(15, 23, 42, 0.12), inset 1px 0 0 rgba(255, 255, 255, 0.6) !important;
      }
      .shadow-apple-soft {
        box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02) !important;
      }
      .shadow-apple-hover {
        box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03) !important;
      }

      /* ─── Apple Reduced Motion & Transparency Accessibility (§14) ──────── */
      @media (prefers-reduced-motion: reduce) {
        *, ::before, ::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        .anim-drawer-panel, .anim-modal-dialog, .apple-toast {
          transform: none !important;
          animation: none !important;
          transition: opacity 180ms ease !important;
        }
      }
      @media (prefers-reduced-transparency: reduce) {
        .glass-nav, .glass-header, .glass-drawer, .apple-glass, .apple-pill-bar, .apple-toast {
          background: #FFFFFF !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        .glass-overlay {
          background: rgba(15, 23, 42, 0.85) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      }
      @media (prefers-contrast: more) {
        .prod-card, .card-clean, input, select, textarea, .glass-nav {
          border-color: #0F172A !important;
          border-width: 1.5px !important;
        }
      }

            /* ─── Apple Primary Action Button ─── */
      .btn-apple-primary {
        background-color: #1677FF !important;
        color: #ffffff !important;
        min-height: 48px !important;
        border-radius: 16px !important;
        font-weight: 800 !important;
        box-shadow: 0 4px 14px rgba(22, 119, 255, 0.35) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        cursor: pointer !important;
        width: 100% !important;
        transition: transform 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease !important;
      }
      .btn-apple-primary:hover {
        background-color: #0B54C2 !important;
        box-shadow: 0 6px 20px rgba(22, 119, 255, 0.45) !important;
      }
      .btn-apple-primary:active {
        transform: scale(0.97) !important;
      }

      /* ─── Apple iOS Frosted Glass Tab Bar (Anti-Transparency) ─── */
      .apple-pill-bar {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
        border-top: 1px solid rgba(226, 232, 240, 0.9) !important;
        box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.05) !important;
      }

      /* ─── Floating Action Stack (Strict Bottom-Right Pinning) ───────── */
      #floating-actions-stack{position:fixed;right:14px;bottom:74px;z-index:9999;}
      @media(min-width:1024px){#floating-actions-stack{bottom:20px!important;right:24px!important;}}

      /* ─── Apple-Style Clean & Airy Product Card Architecture ─── */
      .prod-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.6);
        border-radius: 20px;
        padding: 10px 10px 12px;
        box-shadow: 0 2px 10px -2px rgba(15, 23, 42, 0.03), 0 1px 3px rgba(15, 23, 42, 0.02);
        transition: transform 200ms var(--ease-out), box-shadow 200ms var(--ease-out), border-color 200ms var(--ease-out);
        text-decoration: none !important;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        min-width: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      @media (min-width: 640px) {
        .prod-card { padding: 12px 12px 14px; border-radius: 24px; }
      }
      @media (hover: hover) and (pointer: fine) {
        .prod-card:hover {
          border-color: rgba(22, 119, 255, 0.25);
          box-shadow: 0 14px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03);
          transform: translateY(-2px);
        }
      }
      .prod-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        margin-bottom: 6px;
        min-height: 20px;
        position: relative;
        z-index: 10;
      }
      .prod-badge-discount {
        background-color: #DC2626 !important;
        color: #ffffff !important;
        font-size: 9px !important;
        font-weight: 900 !important;
        letter-spacing: -0.01em !important;
        padding: 2px 7px !important;
        border-radius: 9999px !important;
        display: inline-flex !important;
        align-items: center !important;
        line-height: 1.1 !important;
        box-shadow: 0 2px 6px rgba(220, 38, 38, 0.25) !important;
      }
      .prod-badge-new {
        background-color: #EAF3FF !important;
        color: #0B54C2 !important;
        font-size: 9px !important;
        font-weight: 800 !important;
        padding: 2px 7px !important;
        border-radius: 9999px !important;
        border: 1px solid rgba(11,84,194,0.25) !important;
        display: inline-flex !important;
        align-items: center !important;
        line-height: 1.1 !important;
      }
      .prod-badge-stock {
        background-color: #E8F8F0 !important;
        color: #085237 !important;
        font-size: 9px !important;
        font-weight: 800 !important;
        padding: 2px 7px !important;
        border-radius: 9999px !important;
        border: 1px solid rgba(8,82,55,0.2) !important;
        display: inline-flex !important;
        align-items: center !important;
        line-height: 1.1 !important;
      }
      .prod-rating {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        font-size: 10.5px;
        font-weight: 800;
        color: #D97706;
        line-height: 1;
      }
      .prod-card-img-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        height: 125px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        margin-bottom: 8px;
        overflow: hidden;
        background: #F8FAFC !important;
        border-radius: 16px;
        transition: background 0.2s ease;
      }
      @media (min-width: 640px) {
        .prod-card-img-wrap { height: 150px; padding: 12px; border-radius: 18px; }
      }
      @media (min-width: 1024px) {
        .prod-card-img-wrap { height: 165px; padding: 14px; }
      }
      .prod-card-img-wrap img {
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
        margin: 0 auto;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05));
        transition: transform 220ms var(--ease-out);
      }
      .prod-card:hover .prod-card-img-wrap img {
        transform: scale(1.04);
      }
      .prod-card-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        min-width: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .prod-cat-text {
        font-size: 9.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #475467 !important;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .prod-name-text {
        font-size: 12.5px;
        font-weight: 700;
        color: #0F172A;
        line-height: 1.35;
        margin-top: 2px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 34px;
        transition: color 0.15s ease;
      }
      @media (min-width: 640px) {
        .prod-name-text { font-size: 13.5px; height: 36px; }
      }
      .prod-card:hover .prod-name-text {
        color: #0B54C2;
      }
      .prod-price-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 6px;
        padding-top: 8px;
        margin-top: 6px;
        border-top: 1px solid #F1F5F9;
      }
      .prod-price-val {
        font-size: 14px;
        font-weight: 900;
        color: #0F172A;
        letter-spacing: -0.02em;
        line-height: 1;
      }
      @media (min-width: 640px) {
        .prod-price-val { font-size: 15.5px; }
      }
      .prod-price-old {
        font-size: 11px;
        font-weight: 600;
        color: #596780 !important;
        text-decoration: line-through;
      }

      /* ─── Promo Banner Mid-Page Card ─── */
      .promo-banner-card {
        background: linear-gradient(135deg, #0B54C2 0%, #1677FF 50%, #2583FD 100%) !important;
        color: #ffffff !important;
        border-radius: 24px;
        padding: 22px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        box-shadow: 0 8px 24px -4px rgba(22, 119, 255, 0.28);
        position: relative;
        overflow: hidden;
      }
      @media (min-width: 640px) {
        .promo-banner-card {
          flex-direction: row;
          padding: 26px 34px;
          border-radius: 28px;
        }
      }
      .promo-mini-pill {
        background: rgba(255, 255, 255, 0.18) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        padding: 8px 14px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #ffffff !important;
      }
      .promo-mini-pill img {
        width: 38px !important;
        height: 38px !important;
        aspect-ratio: 1 / 1 !important;
        object-fit: contain !important;
        flex-shrink: 0 !important;
      }
      .promo-cta-btn {
        background: #ffffff !important;
        color: #0B54C2 !important;
        font-weight: 800 !important;
        font-size: 12px !important;
        padding: 10px 22px !important;
        border-radius: 9999px !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        text-decoration: none !important;
        transition: transform 0.15s ease, background 0.15s ease;
        cursor: pointer;
      }
      .promo-cta-btn:hover {
        background: #F3F8FF !important;
        transform: scale(1.02);
      }

      /* Mobile Micro Breakpoint Specific Adjustments (320px - 768px) */
      @media (max-width: 374px) {
        .px-4, .px-6 { padding-left: 0.625rem!important; padding-right: 0.625rem!important; }
        .p-4, .p-6 { padding: 0.75rem!important; }
        .text-2xl { font-size: 1.2rem!important; line-height: 1.5rem!important; }
        .text-3xl { font-size: 1.35rem!important; line-height: 1.7rem!important; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr))!important; gap: 0.5rem!important; }
      }
      @media (min-width: 375px) and (max-width: 430px) {
        .px-4 { padding-left: 0.875rem!important; padding-right: 0.875rem!important; }
        .grid-cols-2 { gap: 0.75rem!important; }
      }
      /* Accessible Skip Link (WCAG 2.1 AA Compliant) */
      .skip-link {
        position: absolute;
        top: -100px;
        left: 12px;
        z-index: 99999;
        background: #1677FF;
        color: #ffffff;
        font-weight: 800;
        font-size: 13px;
        padding: 10px 18px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(22, 119, 255, 0.4);
        text-decoration: none;
        transition: top 0.2s ease-in-out;
      }
      .skip-link:focus {
        top: 12px;
        outline: 3px solid #000000;
        outline-offset: 2px;
      }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-[#F3F7FC]">
<!-- Skip Navigation (Keyboard & Screen Reader Accessibility) -->
<a href="#main-content" class="skip-link">
    Aller au contenu principal
</a>
