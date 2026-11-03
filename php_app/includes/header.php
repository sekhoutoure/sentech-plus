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
    <link rel="preload" as="image" href="assets/images/sentech_logo_v2.webp" type="image/webp" fetchpriority="high">
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
        --ease-out:cubic-bezier(0.23,1,0.32,1);
        --ease-in-out:cubic-bezier(0.77,0,0.175,1);
        --ease-drawer:cubic-bezier(0.32,0.72,0,1);
        --ease-apple:cubic-bezier(0.25,1,0.5,1);
        --ease-smooth:cubic-bezier(0.16,1,0.3,1);
        --ease-spring:cubic-bezier(0.175,0.885,0.32,1.275);
      }
      html,body{overflow-x:hidden!important;width:100%!important;max-width:100%!important;margin:0;padding:0}
      body{background-color:var(--brand-fog);color:var(--brand-text);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
      h1,h2,h3,h4,h5,h6,.font-heading{font-family:'Poppins',system-ui,-apple-system,sans-serif}
      img,iframe,svg,video{max-width:100%;height:auto}
      button,a,input,select,textarea{touch-action:manipulation}
      .line-clamp-1,.line-clamp-2,.line-clamp-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
      .line-clamp-1{-webkit-line-clamp:1}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{-webkit-line-clamp:3}
      .glass-header{background:rgba(255,255,255,.92);backdrop-filter:blur(16px) saturate(180%);-webkit-backdrop-filter:blur(16px) saturate(180%)}
      .glass-overlay{background:rgba(15,23,42,.45);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
      /* Emil Kowalski Press Feedback: Tactile, physical scale on press */
      button:active:not([disabled]),a.btn-electric:active,.btn-electric:active,.btn-press:active,.card-clean:active{transform:scale(0.97)!important;transition:transform 160ms var(--ease-out)!important}
      .prod-card:active{transform:scale(0.985)!important;transition:transform 140ms var(--ease-out)!important}
      .badge-pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700}
      input,select,textarea{outline:0;transition:border-color .15s,box-shadow .15s}
      input:focus,select:focus,textarea:focus{border-color:#1677FF;box-shadow:0 0 0 3px rgba(22,119,255,.12)}
      .skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
      @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @media(prefers-reduced-motion:reduce){*,::before,::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
      
      /* Card Architecture: Soft, diffused and blended into background */
      .card-clean{background:#FFFFFF;border:1px solid var(--brand-border);border-radius:1.25rem;box-shadow:0 2px 14px -2px rgba(15,23,42,0.035),0 1px 3px rgba(15,23,42,0.02);transition:border-color .2s var(--ease-out),box-shadow .2s var(--ease-out),transform .15s var(--ease-out);word-break:break-word}
      .card-clean:hover{border-color:rgba(22,119,255,0.25);box-shadow:0 8px 25px -4px rgba(22,119,255,0.08);transform:translateY(-2px)}
      .bg-soft{background-color:var(--brand-soft)}
      .border-soft{border:1px solid var(--brand-border)}
      .border-subtle{border:1px solid var(--brand-border-light)}

      /* Off-Screen Layout & Style Calculation Optimizer (Drastically reduces Main-Thread work) */
      .content-auto {
        content-visibility: auto;
        contain-intrinsic-size: auto 500px;
      }
      .shadow-soft{box-shadow:0 2px 14px -2px rgba(15,23,42,0.035),0 1px 3px rgba(15,23,42,0.02)}
      
      .btn-electric{display:inline-flex;align-items:center;justify-content:center;background-color:var(--brand-blue);color:#fff;font-family:'Poppins',sans-serif;font-weight:700;border-radius:.75rem;padding:.625rem 1.25rem;min-height:44px;box-shadow:0 3px 10px rgba(22,119,255,.2);transition:background-color .2s var(--ease-out),box-shadow .2s var(--ease-out),transform .15s var(--ease-out);cursor:pointer}
      .btn-electric:hover{background-color:var(--brand-blue-hover);box-shadow:0 5px 16px rgba(22,119,255,.3)}
      /* ─── IHM & Ergonomie Cognitive Excellence (Lois de Fitts, Hick, Jakob & WCAG AAA) ─── */
      * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      ::selection { background-color: #1677FF; color: #FFFFFF; }
      ::-moz-selection { background-color: #1677FF; color: #FFFFFF; }
      
      /* Loi de Fitts : Cibles tactiles d'au moins 44px sur mobile */
      @media (pointer: coarse) {
        button, a.btn-electric, select, input[type="submit"], input[type="button"] { min-height: 44px; }
      }

      /* Anti-Zoom Mobile & Tactile Optimization */
      html, body {
        touch-action: manipulation;
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }
      a, button, input, select, textarea {
        touch-action: manipulation;
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

      /* Focus Ring WCAG 2.1 AAA Haute Précision */
      *:focus-visible {
        outline: 2px solid #1677FF !important;
        outline-offset: 2px !important;
        border-radius: 6px;
      }
      
      /* ─── Performance Containment: Off-Screen Layout Skipping ─────── */
      .contain-paint {
        contain: paint;
      }

      /* ─── Ultra-Smooth Modal & Drawer Architecture (Emil Kowalski Physics & Sub-300ms) ─── */
      .anim-drawer-overlay{display:none;opacity:0;visibility:hidden;transition:opacity 240ms var(--ease-out),visibility 240ms var(--ease-out);}
      .anim-drawer-overlay.active{display:block;opacity:1;visibility:visible;}
      .anim-drawer-panel{transform:translateX(100%);transition:transform 260ms var(--ease-drawer);}
      .anim-drawer-overlay.active .anim-drawer-panel{transform:translateX(0);}

      .anim-modal-overlay{display:none;opacity:0;visibility:hidden;transition:opacity 200ms var(--ease-out),visibility 200ms var(--ease-out);}
      .anim-modal-overlay.active{display:flex;opacity:1;visibility:visible;}
      .anim-modal-dialog{transform:scale(0.95) translateY(8px);opacity:0;transition:transform 220ms var(--ease-out),opacity 200ms var(--ease-out);}
      .anim-modal-overlay.active .anim-modal-dialog{transform:scale(1) translateY(0);opacity:1;}

      /* ─── Ultra-Fluid Hero Slides Crossfade ─────────────────────────── */
      .hero-slide-item{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transform:scale(0.98);transition:opacity 400ms var(--ease-smooth),transform 400ms var(--ease-smooth),visibility 400ms;pointer-events:none;}
      .hero-slide-item.active{opacity:1!important;visibility:visible!important;transform:scale(1)!important;pointer-events:auto;}

      /* ─── Mobile Accordion Drawer (Closed by default) ─────────────── */
      #mobile-drawer{display:none;}
      #mobile-drawer.open{display:block;animation:smoothFadeIn 0.25s var(--ease-smooth);}
      @keyframes smoothFadeIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}

      /* ─── Apple-Style Glassmorphism & Soft Layered Shadows ───────────────── */
      .glass-nav {
        background: rgba(255, 255, 255, 0.98) !important;
        border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
      }
      @media (min-width: 1024px) {
        .glass-nav {
          background: rgba(255, 255, 255, 0.88) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
        }
      }
      .glass-drawer {
        background: rgba(255, 255, 255, 0.94) !important;
        backdrop-filter: blur(20px) saturate(190%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
      }
      .shadow-apple-soft {
        box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02) !important;
      }
      .shadow-apple-hover {
        box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03) !important;
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
