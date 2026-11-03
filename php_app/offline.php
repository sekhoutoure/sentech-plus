<?php
$pageTitle = "Mode Hors-ligne — SenTechPLUS";
require_once __DIR__ . '/includes/header.php';
?>

<main class="max-w-[1000px] mx-auto px-4 sm:px-6 py-10 flex-1 space-y-8 text-center">

    <!-- Offline Header Banner -->
    <div class="card-clean p-8 sm:p-12 space-y-4 max-w-xl mx-auto border border-[#E8EDF3]">
        <div class="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <i data-lucide="wifi-off" class="w-8 h-8"></i>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#182230] tracking-tight">
            Vous êtes hors-ligne
        </h1>

        <p class="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Votre connexion Internet semble instable ou coupée. Grâce au <strong>Mode Hors-ligne SenTechPLUS</strong>, vous pouvez toujours consulter les fiches produits récemment visitées.
        </p>

        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onclick="window.location.reload()" class="cursor-pointer inline-flex items-center gap-2 bg-[#1677FF] hover:bg-[#0F67E5] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all">
                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                <span>Réessayer la connexion</span>
            </button>
            <a href="index.php" class="cursor-pointer inline-flex items-center gap-2 bg-[#F3F7FC] hover:bg-[#EAF3FF] text-[#182230] font-bold text-xs px-5 py-2.5 rounded-xl border border-[#E8EDF3] transition-colors">
                <i data-lucide="home" class="w-4 h-4"></i>
                <span>Accueil mis en cache</span>
            </a>
        </div>
    </div>

    <!-- Recently Viewed Products from LocalStorage -->
    <div id="offline-recent-container" class="space-y-4 text-left hidden">
        <div class="flex items-center justify-between pb-2 border-b border-[#E8EDF3]">
            <h2 class="text-lg font-extrabold text-[#182230] flex items-center gap-2">
                <i data-lucide="history" class="w-5 h-5 text-[#1677FF]"></i>
                <span>Fiches produits consultées (Disponibles hors-ligne)</span>
            </h2>
            <span class="text-xs font-bold text-[#0D7D53] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ⚡ En cache local
            </span>
        </div>

        <div id="offline-products-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            <!-- Dynamically populated from localStorage -->
        </div>
    </div>

</main>

<script>
document.addEventListener('DOMContentLoaded', () => {
    try {
        const raw = localStorage.getItem('sentech_recently_viewed');
        const items = raw ? JSON.parse(raw) : [];
        const container = document.getElementById('offline-recent-container');
        const grid = document.getElementById('offline-products-grid');

        if (items.length > 0 && container && grid) {
            container.classList.remove('hidden');
            grid.innerHTML = items.map(p => `
                <div class="card-clean p-3 sm:p-4 group flex flex-col justify-between">
                    <div>
                        <div class="aspect-square rounded-xl bg-[#F3F7FC] p-2 mb-3 flex items-center justify-center overflow-hidden border border-[#E8EDF3]">
                            <img src="${p.image || 'assets/images/product_img1.webp'}" alt="${p.name}" class="w-full h-full object-contain" width="160" height="160" loading="lazy">
                        </div>
                        <span class="text-[10px] font-bold text-[#0B54C2] uppercase">${p.category || 'High-Tech'}</span>
                        <h3 class="text-xs font-bold text-[#182230] line-clamp-2 mt-0.5">${p.name}</h3>
                    </div>
                    <div class="pt-3 border-t border-[#E8EDF3] mt-3 flex items-center justify-between">
                        <span class="text-xs font-extrabold text-[#182230]">${p.price}</span>
                        <a href="product.php?id=${p.id}" class="cursor-pointer text-[11px] font-extrabold text-[#1677FF] hover:underline">Voir →</a>
                    </div>
                </div>
            `).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    } catch (e) {
        console.error(e);
    }
});

// Auto-redirect if connection is restored
window.addEventListener('online', () => {
    window.location.reload();
});
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
