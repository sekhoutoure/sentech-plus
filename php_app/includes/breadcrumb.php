<?php
/**
 * =============================================================================
 * SenTechPLUS — Composant Breadcrumb Universel
 * Schema.org BreadcrumbList pour Google Rich Snippets
 * Usage: $breadcrumbs = [['label'=>'Boutique','url'=>'shop.php'],['label'=>'Audio','url'=>null]];
 *        require_once 'includes/breadcrumb.php';
 * =============================================================================
 */
if (!isset($breadcrumbs) || !is_array($breadcrumbs)) {
    $breadcrumbs = [];
}
$allCrumbs   = array_merge([['label' => 'Accueil', 'url' => 'index.php']], $breadcrumbs);
$totalCrumbs = count($allCrumbs);

$schemaItems = [];
foreach ($allCrumbs as $i => $crumb) {
    $item = [
        "@type"    => "ListItem",
        "position" => $i + 1,
        "name"     => $crumb['label'],
    ];
    if (!empty($crumb['url'])) {
        $item["item"] = rtrim(APP_URL, '/') . '/' . ltrim($crumb['url'], '/');
    }
    $schemaItems[] = $item;
}
$breadcrumbSchema = json_encode([
    "@context"        => "https://schema.org",
    "@type"           => "BreadcrumbList",
    "itemListElement" => $schemaItems
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
<script type="application/ld+json"><?= $breadcrumbSchema ?></script>
<nav aria-label="Fil d'Ariane" class="flex items-center flex-wrap gap-1.5 text-[11px] sm:text-xs font-semibold text-[#667085] py-3 px-1">
    <?php foreach ($allCrumbs as $i => $crumb):
        $isLast = ($i === $totalCrumbs - 1);
    ?>
        <?php if ($i > 0): ?>
            <svg class="w-3 h-3 text-[#C4CBDA] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
        <?php endif; ?>
        <?php if (!$isLast && !empty($crumb['url'])): ?>
            <a href="<?= htmlspecialchars($crumb['url']) ?>"
               class="hover:text-[#1677FF] transition-colors truncate max-w-[120px] sm:max-w-none">
                <?= htmlspecialchars($crumb['label']) ?>
            </a>
        <?php else: ?>
            <span class="text-[#182230] font-bold truncate max-w-[160px] sm:max-w-none"
                  aria-current="page">
                <?= htmlspecialchars($crumb['label']) ?>
            </span>
        <?php endif; ?>
    <?php endforeach; ?>
</nav>
