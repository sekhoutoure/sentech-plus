<?php
/**
 * SenTechPLUS — Banner Slider Component (Épuré & Fondu)
 * Usage: renderBannerSlider('hero_home', $pdo);
 * Affiche uniquement les affiches graphiques sans texte superposé parasite,
 * avec taille constante, animation fluide et navigation tactile.
 */

if (!function_exists('renderBannerSlider')) {

function renderBannerSlider(string $placement, ?PDO $pdo): string {
    // ── Fetch banners avec mise en cache haute performance ───────────────────
    $banners = FastCache::remember('banners_slider_' . $placement, 900, function() use ($placement, $pdo) {
        $list = [];
        if ($pdo) {
            try {
                $stmt = $pdo->prepare(
                    "SELECT * FROM banners
                     WHERE placement = :pl
                       AND is_active = 1
                       AND (starts_at IS NULL OR starts_at <= NOW())
                       AND (ends_at   IS NULL OR ends_at   >= NOW())
                     ORDER BY display_order ASC, id ASC"
                );
                $stmt->execute([':pl' => $placement]);
                $list = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } catch (Throwable $e) {}
        }

        // Fallback si la table est vide
        if (empty($list)) {
            $list = [
                [
                    'id'             => 1,
                    'title'          => 'Audio Haute Définition — Casques & Écouteurs Pro',
                    'image_desktop'  => 'assets/images/banners/banner_audio_fr.webp',
                    'image_mobile'   => 'assets/images/banners/banner_audio_fr_mob.webp',
                    'link_url'       => 'shop.php?category=audio-ecouteurs',
                ],
                [
                    'id'             => 2,
                    'title'          => 'Montres Connectées — Le Sommet de la Performance',
                    'image_desktop'  => 'assets/images/banners/banner_montres_fr.webp',
                    'image_mobile'   => 'assets/images/banners/banner_montres_fr_mob.webp',
                    'link_url'       => 'shop.php?category=montres-objets-connectes',
                ],
                [
                    'id'             => 3,
                    'title'          => 'Charge Ultra-Rapide GaN 65W & Accessoires',
                    'image_desktop'  => 'assets/images/banners/banner_telephones_fr.webp',
                    'image_mobile'   => 'assets/images/banners/banner_telephones_fr_mob.webp',
                    'link_url'       => 'shop.php?category=telephones-accessoires',
                ],
                [
                    'id'             => 4,
                    'title'          => 'Gaming & Setup — Précision & Réactivité Absolue',
                    'image_desktop'  => 'assets/images/banners/banner_gaming_fr.webp',
                    'image_mobile'   => 'assets/images/banners/banner_gaming_fr_mob.webp',
                    'link_url'       => 'shop.php?category=gaming',
                ],
                [
                    'id'             => 5,
                    'title'          => 'Ventes Flash Sénégal — Jusqu\'à -35% de Réduction',
                    'image_desktop'  => 'assets/images/banners/banner_flash_fr.webp',
                    'image_mobile'   => 'assets/images/banners/banner_flash_fr_mob.webp',
                    'link_url'       => 'shop.php?collection=flash',
                ],
            ];
        }
        return $list;
    });

    $count = count($banners);
    $uid   = 'bslider_' . substr(md5($placement . $count), 0, 8);

    ob_start();
    ?>
    <!-- SENTECH BANNER SLIDER (Affiches Graphiques 16:9 Plein Format Sans Bandes Noires) -->
    <style>
    #<?= $uid ?> {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        border-radius: 16px;
        overflow: hidden;
        background: transparent;
        border: 1px solid rgba(226, 232, 240, 0.8);
        box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06);
        user-select: none;
    }
    @media (min-width: 640px) {
        #<?= $uid ?> {
            border-radius: 22px;
        }
    }
    @media (min-width: 1024px) {
        #<?= $uid ?> {
            border-radius: 26px;
        }
    }

    #<?= $uid ?> .bsl-track {
        display: flex;
        height: 100%;
        width: 100%;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
    }

    #<?= $uid ?> .bsl-slide {
        flex: 0 0 100%;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
    }

    #<?= $uid ?> .bsl-link {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 100%;
        position: relative;
        text-decoration: none;
        cursor: pointer;
        overflow: hidden;
        touch-action: manipulation;
    }

    #<?= $uid ?> .bsl-link picture,
    #<?= $uid ?> .bsl-link img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
        display: block;
        aspect-ratio: 16 / 9;
    }

    /* Discrete Minimalist Dots — Accessible Touch Targets (WCAG 2.1 AA / 2.5.8 Target Size) */
    #<?= $uid ?> .bsl-dots {
        position: absolute;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 4px;
        z-index: 20;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        pointer-events: auto;
    }
    #<?= $uid ?> .bsl-dot {
        all: unset;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        min-height: 32px !important;
        cursor: pointer;
        touch-action: manipulation;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
        -webkit-tap-highlight-color: transparent;
    }
    #<?= $uid ?> .bsl-dot::before {
        content: '';
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.55);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #<?= $uid ?> .bsl-dot.active::before {
        width: 20px;
        background: #ffffff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
    }
    #<?= $uid ?> .bsl-dot:focus-visible::before {
        outline: 2px solid #1677FF;
        outline-offset: 2px;
    }
    </style>

    <div id="<?= $uid ?>" role="region" aria-label="Affiches promotionnelles cliquables" aria-roledescription="carousel">

        <!-- Track (slides) -->
        <div class="bsl-track" id="<?= $uid ?>-track">
        <?php foreach ($banners as $i => $b): ?>
            <?php
                $imgDesktop = htmlspecialchars($b['image_desktop'] ?: 'assets/images/hero_model_img.webp');
                $altText    = htmlspecialchars($b['title'] ?: 'Affiche Promotionnelle SenTechPLUS');
                $linkUrl    = htmlspecialchars(filter_var($b['link_url'] ?? '', FILTER_SANITIZE_URL) ?: 'shop.php');
                $isFirst    = ($i === 0);
                $cacheSuffix = $isFirst ? '' : '?v=20260918_v3';
                $imgMobileSrc = !empty($b['image_mobile']) ? htmlspecialchars($b['image_mobile']) . $cacheSuffix : '';
                $imgDesktopSrc = $imgDesktop . $cacheSuffix;
            ?>
            <div class="bsl-slide" role="group" aria-roledescription="slide" aria-label="<?= $altText ?>">
                <a href="<?= $linkUrl ?>" class="bsl-link" title="<?= $altText ?>">
                    <picture>
                        <?php if (!empty($imgMobileSrc)): ?>
                        <source media="(max-width: 640px)" srcset="<?= $imgMobileSrc ?>" width="600" height="338">
                        <?php endif; ?>
                        <img src="<?= $imgDesktopSrc ?>"
                             alt="<?= $altText ?> - SenTechPLUS"
                             <?= $isFirst ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"' ?>
                             decoding="async"
                             width="1200" height="675"
                             style="width:100%;height:100%;aspect-ratio:16/9;object-fit:cover;">
                    </picture>
                </a>
            </div>
        <?php endforeach; ?>
        </div>

        <?php if ($count > 1): ?>
        <!-- Minimal Dots -->
        <div class="bsl-dots" role="tablist">
        <?php for ($d = 0; $d < $count; $d++): ?>
            <button type="button"
                    class="bsl-dot <?= $d === 0 ? 'active' : '' ?>"
                    id="<?= $uid ?>-dot-<?= $d ?>"
                    onclick="bslGoto('<?= $uid ?>', <?= $d ?>)"
                    aria-label="Affiche <?= $d+1 ?>"
                    aria-selected="<?= $d === 0 ? 'true' : 'false' ?>"
                    role="tab"
                    tabindex="<?= $d === 0 ? '0' : '-1' ?>"></button>
        <?php endfor; ?>
        </div>
        <?php endif; ?>

    </div>

    <script>
    (function() {
        'use strict';
        var UID     = '<?= $uid ?>';
        var COUNT   = <?= $count ?>;
        var DELAY   = 5000;
        var current = 0;
        var timer   = null;
        var paused  = false;

        var el    = document.getElementById(UID);
        var track = document.getElementById(UID + '-track');
        if (!el || !track || COUNT <= 1) return;

        function goto(idx) {
            idx = ((idx % COUNT) + COUNT) % COUNT;
            current = idx;
            track.style.transform = 'translateX(-' + (idx * 100) + '%)';
            for (var d = 0; d < COUNT; d++) {
                var dot = document.getElementById(UID + '-dot-' + d);
                if (!dot) continue;
                if (d === idx) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                    dot.setAttribute('tabindex', '0');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                    dot.setAttribute('tabindex', '-1');
                }
            }
        }

        function startAutoplay() {
            stopAutoplay();
            timer = setInterval(function() {
                if (!paused) goto(current + 1);
            }, DELAY);
        }
        function stopAutoplay() {
            if (timer) clearInterval(timer);
        }

        window.bslGoto = function(uid, idx) {
            if (uid !== UID) return;
            paused = true;
            goto(idx);
            stopAutoplay();
            clearTimeout(window['_bslResume_' + UID]);
            window['_bslResume_' + UID] = setTimeout(function() {
                paused = false;
                startAutoplay();
            }, 8000);
        };

        el.addEventListener('mouseenter', function() { paused = true; });
        el.addEventListener('mouseleave', function() { paused = false; });

        // Touch swipe
        var touchStartX = 0;
        el.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            paused = true;
        }, { passive: true });
        el.addEventListener('touchend', function(e) {
            var dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 40) {
                bslGoto(UID, dx < 0 ? current + 1 : current - 1);
            } else {
                paused = false;
            }
        }, { passive: true });

        // Keyboard navigation
        el.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft')  bslGoto(UID, current - 1);
            if (e.key === 'ArrowRight') bslGoto(UID, current + 1);
        });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function(entries) {
                paused = !entries[0].isIntersecting;
            }, { threshold: 0.25 }).observe(el);
        }

        goto(0);
        startAutoplay();
    })();
    </script>
    <?php
    return ob_get_clean();
}

} // end if !function_exists

