<?php
require_once __DIR__ . '/config/config.php';

$pageTitle = "Catégories & Rayons — SenTechPLUS";
$pageDescription = "Explorez toutes les catégories et rayons High-Tech de SenTechPLUS à Dakar : Audio, Téléphonie, Montres connectées, Informatique, Gaming.";

$categoriesTree = getAllCategoriesTree();
$pdo = getDBConnection();

// Active category selection
$activeSlug = sanitize($_GET['category'] ?? 'pour-vous');

// Includes base HTML head and CSS styles (no navbar)
require_once __DIR__ . '/includes/header.php';
$cartCount = getCartCount();
$wishCount = count(getWishlistItems());
?>

<div id="main-content" style="display: flex; flex-direction: column; width: 100%; height: 100vh; height: 100dvh; background: #ffffff; overflow: hidden;">

    <!-- ─── SLEEK APP TOP BAR (SANS HEADER GLOBAL ENCOMBRANT) ──────────────── -->
    <header style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background: #ffffff; border-bottom: 1px solid #E8EDF3; padding: 8px 12px; height: 52px; flex-shrink: 0; z-index: 30;">
        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <a href="index.php" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; color: #182230; text-decoration: none; transition: background 0.15s;" aria-label="Retour à l'accueil">
                <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
            </a>
            <h1 style="font-size: 15px; font-weight: 900; color: #182230; margin: 0; white-space: nowrap; letter-spacing: -0.01em;">Catégories</h1>
        </div>
        
        <!-- Search Input -->
        <form action="shop.php" method="GET" style="flex: 1; min-width: 0; margin: 0 4px;">
            <div style="position: relative; display: flex; align-items: center; width: 100%;">
                <i data-lucide="search" style="width: 14px; height: 14px; color: #64748B; position: absolute; left: 10px; pointer-events: none;"></i>
                <input 
                    type="text" 
                    name="search" 
                    placeholder="Rechercher..." 
                    style="width: 100%; background: #F3F7FC; border: 1px solid #E8EDF3; border-radius: 9999px; padding: 6px 12px 6px 30px; font-size: 12px; color: #182230; outline: none;"
                >
            </div>
        </form>

        <!-- Cart Quick Button -->
        <a href="cart.php" style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 10px; color: #182230; text-decoration: none; flex-shrink: 0;" aria-label="Mon Panier">
            <i data-lucide="shopping-cart" style="width: 20px; height: 20px;"></i>
            <?php if ($cartCount > 0): ?>
                <span class="cart-count-badge" style="position: absolute; top: 0; right: 0; min-width: 15px; height: 15px; background: #0B54C2; color: #ffffff; font-size: 8px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center; padding: 0 3px;">
                    <?= $cartCount ?>
                </span>
            <?php endif; ?>
        </a>
    </header>

    <!-- ─── 2-COLUMNS APP-STYLE SPLIT LAYOUT (ALIBABA / AMAZON STYLE) ─────────── -->
    <div id="cat-split-layout" style="display: flex !important; flex-direction: row !important; align-items: stretch !important; flex: 1 1 auto !important; width: 100% !important; height: calc(100% - 108px) !important; overflow: hidden !important;">
        
        <!-- ─── LEFT COLUMN: VERTICAL CATEGORY NAV ───────────────────────────── -->
        <aside id="cat-sidebar-nav" style="width: 110px !important; min-width: 110px !important; max-width: 110px !important; flex-shrink: 0 !important; background: #F5F7FA !important; border-right: 1px solid #E8EDF3 !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch; user-select: none; padding: 4px 0;">
            
            <!-- 1. Pour vous -->
            <button type="button" 
                    onclick="switchCategoryTab('pour-vous', this)" 
                    class="cat-tab-btn cursor-pointer"
                    style="width: 100%; text-align: left; padding: 12px 10px; font-size: 11px; transition: all 0.15s; border: none; outline: none; background: <?= $activeSlug === 'pour-vous' ? '#ffffff' : 'transparent' ?>; font-weight: <?= $activeSlug === 'pour-vous' ? '900' : '700' ?>; color: <?= $activeSlug === 'pour-vous' ? '#182230' : '#475467' ?>; border-left: <?= $activeSlug === 'pour-vous' ? '4px solid #1677FF' : '4px solid transparent' ?>;">
                <span style="display: block; line-height: 1.25;">Pour vous</span>
            </button>

            <!-- 2. En vedette -->
            <button type="button" 
                    onclick="switchCategoryTab('en-vedette', this)" 
                    class="cat-tab-btn cursor-pointer"
                    style="width: 100%; text-align: left; padding: 12px 10px; font-size: 11px; transition: all 0.15s; border: none; outline: none; background: <?= $activeSlug === 'en-vedette' ? '#ffffff' : 'transparent' ?>; font-weight: <?= $activeSlug === 'en-vedette' ? '900' : '700' ?>; color: <?= $activeSlug === 'en-vedette' ? '#182230' : '#475467' ?>; border-left: <?= $activeSlug === 'en-vedette' ? '4px solid #1677FF' : '4px solid transparent' ?>;">
                <span style="display: block; line-height: 1.25;">En vedette</span>
            </button>

            <!-- 3. Offres spéciales -->
            <button type="button" 
                    onclick="switchCategoryTab('offres-speciales', this)" 
                    class="cat-tab-btn cursor-pointer"
                    style="width: 100%; text-align: left; padding: 12px 10px; font-size: 11px; transition: all 0.15s; border: none; outline: none; background: <?= $activeSlug === 'offres-speciales' ? '#ffffff' : 'transparent' ?>; font-weight: <?= $activeSlug === 'offres-speciales' ? '900' : '700' ?>; color: <?= $activeSlug === 'offres-speciales' ? '#B91C1C' : '#475467' ?>; border-left: <?= $activeSlug === 'offres-speciales' ? '4px solid #B91C1C' : '4px solid transparent' ?>;">
                <span style="display: block; line-height: 1.25;">Offres spéciales</span>
            </button>

            <!-- Dynamic Categories Tree -->
            <?php foreach ($categoriesTree as $pCat): 
                $isSelected = ($activeSlug === $pCat['slug']);
            ?>
                <button type="button" 
                        onclick="switchCategoryTab('<?= htmlspecialchars($pCat['slug']) ?>', this)" 
                        class="cat-tab-btn cursor-pointer"
                        style="width: 100%; text-align: left; padding: 12px 10px; font-size: 11px; transition: all 0.15s; border: none; outline: none; background: <?= $isSelected ? '#ffffff' : 'transparent' ?>; font-weight: <?= $isSelected ? '900' : '700' ?>; color: <?= $isSelected ? '#182230' : '#475467' ?>; border-left: <?= $isSelected ? '4px solid #1677FF' : '4px solid transparent' ?>;">
                    <span style="display: block; line-height: 1.25;"><?= htmlspecialchars($pCat['name']) ?></span>
                </button>
            <?php endforeach; ?>

        </aside>

        <!-- ─── RIGHT COLUMN: PROMO BANNER + 3-COLS CIRCULAR BUBBLE GRID ──────── -->
        <section id="cat-content-area" style="flex: 1 1 0% !important; min-width: 0 !important; width: calc(100% - 110px) !important; background: #ffffff !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch; padding: 12px 14px !important;">
            
            <!-- 1. Sleek Emerald Local Stock Banner (Compact App-Style) -->
            <div style="background: linear-gradient(135deg, #15803d 0%, #16a34a 60%, #22c55e 100%); color: #ffffff; border-radius: 14px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);">
                <div style="min-width: 0; flex: 1;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <h2 style="font-size: 12px; font-weight: 900; text-transform: uppercase; margin: 0; color: #ffffff; line-height: 1; letter-spacing: -0.01em;">
                            Stock Local Dakar 🇸🇳
                        </h2>
                        <span style="background: rgba(255,255,255,0.22); color: #ffffff; font-size: 8px; font-weight: 900; padding: 1px 5px; border-radius: 9999px;">24h</span>
                    </div>
                    <p style="color: #dcfce7; font-size: 10px; font-weight: 600; margin: 3px 0 0 0; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ✓ 100% Original • Livraison express Dakar
                    </p>
                </div>
                <img width="44" height="44" loading="lazy" src="assets/images/hero_product_img1.webp" alt="" aria-hidden="true" style="width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">
            </div>

            <!-- ─── TAB 1: POUR VOUS (Recommandations) ────────────────────────── -->
            <div id="tab-content-pour-vous" class="cat-content-panel <?= $activeSlug === 'pour-vous' ? '' : 'hidden' ?>" style="display: <?= $activeSlug === 'pour-vous' ? 'block' : 'none' ?>;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid #F1F5F9; margin-bottom: 12px;">
                    <h3 style="font-size: 13px; font-weight: 900; color: #182230; margin: 0;">Recommandations</h3>
                    <a href="shop.php" style="font-size: 11px; font-weight: 800; color: #0B54C2; text-decoration: none;">Tout voir →</a>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 8px; text-align: center;">
                    
                    <!-- 1. Hot Product -->
                    <a href="shop.php?collection=flash" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #FFF7ED; border: 2px solid #EA580C; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <span style="font-size: 10px; font-weight: 900; color: #C2410C; text-transform: uppercase;">▲ HOT</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">À succès</span>
                    </a>

                    <!-- 2. Casque ANC -->
                    <a href="shop.php?category=audio-ecouteurs&subcategory=casques-audio" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img4.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Casques ANC</span>
                    </a>

                    <!-- 3. Montres AMOLED -->
                    <a href="shop.php?category=montres-objets-connectes" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img3.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Montres Sport</span>
                    </a>

                    <!-- 4. Écouteurs TWS -->
                    <a href="shop.php?category=audio-ecouteurs&subcategory=ecouteurs-sans-fil" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px; position: relative;">
                            <img src="assets/images/hero_product_img1.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                            <span style="position: absolute; top: -2px; right: -2px; font-size: 10px;">🔥</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Écouteurs TWS</span>
                    </a>

                    <!-- 5. Chargeurs GaN -->
                    <a href="shop.php?category=telephones-accessoires&subcategory=chargeurs-rapides" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px; position: relative;">
                            <img src="assets/images/product_img11.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                            <span style="position: absolute; top: -2px; right: -2px; font-size: 10px;">⚡</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Chargeurs GaN</span>
                    </a>

                    <!-- 6. Setup Gaming -->
                    <a href="shop.php?category=gaming" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px; position: relative;">
                            <img src="assets/images/product_img8.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                            <span style="position: absolute; top: -2px; right: -2px; font-size: 10px;">🔥</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Setup Gaming</span>
                    </a>

                    <!-- 7. Enceintes Nomades -->
                    <a href="shop.php?category=audio-ecouteurs&subcategory=enceintes-bluetooth" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img2.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Enceintes JBL</span>
                    </a>

                    <!-- 8. Domotique & LED -->
                    <a href="shop.php?category=maison-energie" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img1.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Lampes & LED</span>
                    </a>

                    <!-- 9. Caméras Wi-Fi -->
                    <a href="shop.php?category=securite-cameras" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img6.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Caméras 360°</span>
                    </a>

                </div>
            </div>

            <!-- ─── TAB 2: EN VEDETTE ────────────────────────────────────────── -->
            <div id="tab-content-en-vedette" class="cat-content-panel <?= $activeSlug === 'en-vedette' ? '' : 'hidden' ?>" style="display: <?= $activeSlug === 'en-vedette' ? 'block' : 'none' ?>;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid #F1F5F9; margin-bottom: 12px;">
                    <h3 style="font-size: 13px; font-weight: 900; color: #182230; margin: 0;">Articles en Vedette</h3>
                    <a href="shop.php?sort=sales" style="font-size: 11px; font-weight: 800; color: #0B54C2; text-decoration: none;">Voir les tops →</a>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 8px; text-align: center;">
                    <a href="shop.php?category=audio-ecouteurs" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img4.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Casques Studio</span>
                    </a>
                    <a href="shop.php?category=montres-objets-connectes" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/hero_product_img2.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Montres Sport</span>
                    </a>
                    <a href="shop.php?category=telephones-accessoires" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <img src="assets/images/product_img7.webp" alt="" aria-hidden="true" width="40" height="40" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Supports MagSafe</span>
                    </a>
                </div>
            </div>

            <!-- ─── TAB 3: OFFRES SPÉCIALES ──────────────────────────────────── -->
            <div id="tab-content-offres-speciales" class="cat-content-panel <?= $activeSlug === 'offres-speciales' ? '' : 'hidden' ?>" style="display: <?= $activeSlug === 'offres-speciales' ? 'block' : 'none' ?>;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid #F1F5F9; margin-bottom: 12px;">
                    <h3 style="font-size: 13px; font-weight: 900; color: #B91C1C; margin: 0;">Bons Plans & Réductions</h3>
                    <a href="shop.php?collection=flash" style="font-size: 11px; font-weight: 800; color: #B91C1C; text-decoration: none;">Ventes Flash →</a>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 8px; text-align: center;">
                    <a href="shop.php?collection=flash" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                        <div style="width: 54px; height: 54px; border-radius: 9999px; background: #FFF1F2; border: 2px solid #FDA4AF; display: flex; align-items: center; justify-content: center; padding: 6px;">
                            <span style="font-size: 10px; font-weight: 900; color: #E11D48;">⚡ -30%</span>
                        </div>
                        <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;">Ventes Flash</span>
                    </a>
                </div>
            </div>

            <!-- ─── DYNAMIC CATEGORIES PANELS ────────────────────────────────── -->
            <?php foreach ($categoriesTree as $pCat): 
                $isPanelActive = ($activeSlug === $pCat['slug']);
                $subcats = $pCat['subcategories'] ?? [];
            ?>
                <div id="tab-content-<?= htmlspecialchars($pCat['slug']) ?>" class="cat-content-panel <?= $isPanelActive ? '' : 'hidden' ?>" style="display: <?= $isPanelActive ? 'block' : 'none' ?>;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 6px; border-bottom: 1px solid #F1F5F9; margin-bottom: 12px;">
                        <h3 style="font-size: 13px; font-weight: 900; color: #182230; margin: 0;"><?= htmlspecialchars($pCat['name']) ?></h3>
                        <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>" style="font-size: 11px; font-weight: 800; color: #0B54C2; text-decoration: none;">Voir tout (<?= count($subcats) ?>) →</a>
                    </div>

                    <?php if (!empty($subcats)): ?>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 8px; text-align: center;">
                            <?php foreach ($subcats as $sCat): 
                                $catImg = $pCat['image'] ?: 'assets/images/product_img1.webp';
                            ?>
                                <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>&subcategory=<?= urlencode($sCat['slug']) ?>" class="group" style="display: flex; flex-direction: column; align-items: center; text-decoration: none;">
                                    <div style="width: 54px; height: 54px; border-radius: 9999px; background: #F5F7FA; border: 1px solid #E8EDF3; display: flex; align-items: center; justify-content: center; padding: 6px;">
                                        <img width="40" height="40" loading="lazy" src="<?= htmlspecialchars($catImg) ?>" alt="" aria-hidden="true" style="width: 100%; height: 100%; object-fit: contain; aspect-ratio: 1/1;">
                                    </div>
                                    <span style="font-size: 10px; font-weight: 700; color: #182230; margin-top: 4px; line-height: 1.2;"><?= htmlspecialchars($sCat['name']) ?></span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div style="padding: 24px; text-align: center; font-size: 12px; color: #344054; background: #F8FAFC; border-radius: 16px; border: 1px solid #E8EDF3;">
                            <p style="margin: 0;">Tous les articles de cette catégorie sont disponibles dans la boutique.</p>
                            <a href="shop.php?category=<?= urlencode($pCat['slug']) ?>" style="display: inline-block; margin-top: 8px; font-weight: 800; color: #0B54C2; text-decoration: underline;">Ouvrir le rayon →</a>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>

        </section>

    </div>

</div>

<!-- ─── MOBILE BOTTOM APP BAR (5 Onglets Apple-Style) ─── -->
<nav aria-label="Navigation mobile principale" style="position: fixed; bottom: 0; left: 0; right: 0; height: 56px; z-index: 999; backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.94); border-top: 1px solid rgba(226, 232, 240, 0.8); display: flex; align-items: center; justify-content: space-around; padding: 0 4px; box-shadow: 0 -4px 20px rgba(0,0,0,0.04);">
    <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-around; width: 100%; max-width: 500px; margin: 0 auto;">
        
        <!-- 1. Accueil -->
        <a href="index.php" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px;">
            <i data-lucide="home" style="width: 20px; height: 20px; color: #475467;"></i>
            <span style="font-size: 10px; font-weight: 700; margin-top: 2px; color: #344054;">Accueil</span>
        </a>

        <!-- 2. Catégories & Rayons (Actif) -->
        <a href="categories.php" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px;" aria-current="page">
            <i data-lucide="layout-grid" style="width: 20px; height: 20px; color: #0B54C2;"></i>
            <span style="font-size: 10px; font-weight: 800; margin-top: 2px; color: #0B54C2;">Catégories</span>
        </a>

        <!-- 3. Panier -->
        <a href="cart.php" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px; position: relative;" aria-label="Mon Panier">
            <div style="position: relative; display: inline-flex;">
                <i data-lucide="shopping-cart" style="width: 20px; height: 20px; color: #475467;"></i>
                <?php if ($cartCount > 0): ?>
                    <span class="cart-count-badge" style="position: absolute; top: -6px; right: -9px; min-width: 16px; height: 16px; padding: 0 3px; background-color: #0B54C2; color: #ffffff; font-size: 8px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                        <?= $cartCount ?>
                    </span>
                <?php endif; ?>
            </div>
            <span style="font-size: 10px; font-weight: 700; margin-top: 2px; color: #344054;">Panier</span>
        </a>

        <!-- 4. Favoris -->
        <a href="wishlist.php" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; position: relative; min-height: 44px;">
            <div style="position: relative; display: inline-flex;">
                <i data-lucide="heart" style="width: 20px; height: 20px; color: #475467;"></i>
                <?php if ($wishCount > 0): ?>
                    <span style="position: absolute; top: -6px; right: -8px; min-width: 15px; height: 15px; padding: 0 3px; background-color: #B91C1C; color: #ffffff; font-size: 8px; font-weight: 900; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                        <?= $wishCount ?>
                    </span>
                <?php endif; ?>
            </div>
            <span style="font-size: 10px; font-weight: 700; margin-top: 2px; color: #344054;">Favoris</span>
        </a>

        <!-- 5. Compte Client -->
        <a href="<?= isLoggedIn() ? 'account.php' : 'login.php' ?>" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; min-height: 44px;">
            <i data-lucide="user" style="width: 20px; height: 20px; color: #475467;"></i>
            <span style="font-size: 10px; font-weight: 700; margin-top: 2px; color: #344054;"><?= isLoggedIn() ? htmlspecialchars(explode(' ', getCurrentUser()['name'])[0]) : 'Compte' ?></span>
        </a>

    </div>
</nav>

<script>
function switchCategoryTab(slug, btn) {
    // 1. Reset all sidebar buttons
    document.querySelectorAll('.cat-tab-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = '#475467';
        b.style.fontWeight = '700';
        b.style.borderLeft = '4px solid transparent';
    });

    // 2. Activate clicked button
    const isSpecial = (slug === 'offres-speciales');
    btn.style.background = '#ffffff';
    btn.style.color = isSpecial ? '#B91C1C' : '#182230';
    btn.style.fontWeight = '900';
    btn.style.borderLeft = isSpecial ? '4px solid #B91C1C' : '4px solid #1677FF';

    // 3. Toggle content panel
    document.querySelectorAll('.cat-content-panel').forEach(p => {
        p.style.display = 'none';
    });
    const target = document.getElementById('tab-content-' + slug);
    if (target) {
        target.style.display = 'block';
    }

    // 4. Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('category', slug);
    window.history.replaceState({}, '', url);

    if (window.lucide) lucide.createIcons();
}
</script>

<script src="assets/js/app.min.js" defer></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
</script>
</body>
</html>
