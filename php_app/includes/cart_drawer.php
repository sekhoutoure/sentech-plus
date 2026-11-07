<?php
// Cart Drawer Slide-Over Component (Live AJAX Synchronized)
?>

<div id="cart-drawer-overlay" class="fixed inset-0 overflow-hidden anim-drawer-overlay" style="z-index: 100000 !important;">
    <!-- Backdrop (Apple Glass Overlay) -->
    <div onclick="toggleCartDrawer(false)" class="absolute inset-0 z-0 glass-overlay cursor-pointer"></div>

    <div class="fixed inset-y-0 right-0 z-10 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <!-- Slide-over panel (Smooth Hardware Easing & Apple Glass) -->
        <div id="cart-drawer-panel" onclick="event.stopPropagation()" class="relative z-10 w-screen max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between anim-drawer-panel border-l border-white/60 pointer-events-auto h-full" style="pointer-events: auto !important; padding-bottom: max(12px, env(safe-area-inset-bottom));">
            
            <!-- Apple Sheet Grabber (Mobile touch target & visual anchor) -->
            <div class="sm:hidden pt-2 pb-1 flex justify-center bg-transparent">
                <div class="apple-drag-handle"></div>
            </div>

            <!-- Drawer Header -->
            <div class="p-5 sm:p-6 border-b border-[#E8EDF3] flex items-center justify-between bg-white/80 backdrop-blur-md">
                <div class="flex items-center gap-3 text-[#182230] font-extrabold text-lg">
                    <i data-lucide="shopping-cart" class="w-6 h-6 text-[#1677FF]"></i>
                    <span>Mon Panier (<span id="cart-drawer-count"><?= getCartCount() ?></span>)</span>
                </div>
                <button type="button" onclick="toggleCartDrawer(false)" aria-label="Fermer le panier" class="p-2 rounded-full text-[#667085] hover:text-[#182230] hover:bg-[#F3F7FC] transition-colors duration-200 cursor-pointer focus:ring-2 focus:ring-[#1677FF]">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            <!-- Dynamic Body + Footer (Auto-updated on every AJAX add/remove/update) -->
            <div id="cart-drawer-dynamic-content" class="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
                <?= renderCartDrawerDynamicContent() ?>
            </div>

        </div>
    </div>
</div>

<script>
function toggleCartDrawer(show) {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!overlay) return;
    
    if (show) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: overlay, skipHidden: false });
        }
    } else {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
</script>
