<?php
// Cart Drawer Slide-Over Component
$cartItems = getCartItems();
$productsInCart = [];
$totalPrice = 0;

if (!empty($cartItems)) {
    try {
        $pdo = getDBConnection();
        $placeholders = implode(',', array_fill(0, count($cartItems), '?'));
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
        $stmt->execute(array_keys($cartItems));
        $fetched = $stmt->fetchAll();

        foreach ($fetched as $p) {
            $qty = $cartItems[$p['id']] ?? 1;
            $itemTotal = $p['price'] * $qty;
            $totalPrice += $itemTotal;
            $p['cart_quantity'] = $qty;
            $p['item_total'] = $itemTotal;
            $p['main_image'] = getProductMainImage($p, 'assets/images/product_img1.webp');
            $productsInCart[] = $p;
        }
    } catch (Throwable $e) {
        $productsInCart = [];
    }
}
?>

<div id="cart-drawer-overlay" class="fixed inset-0 overflow-hidden anim-drawer-overlay" style="z-index: 100000 !important;">
    <!-- Backdrop (Apple Glass Overlay) -->
    <div onclick="toggleCartDrawer(false)" class="absolute inset-0 glass-overlay cursor-pointer"></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <!-- Slide-over panel (Smooth Hardware Easing & Apple Glass) -->
        <div id="cart-drawer-panel" class="w-screen max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between anim-drawer-panel border-l border-white/60 pointer-events-auto h-full" style="padding-bottom: max(12px, env(safe-area-inset-bottom));">
            
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

            <!-- Drawer Body / Cart Items -->
            <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#F3F7FC]/30">
                <?php if (empty($productsInCart)): ?>
                    <div class="h-full flex flex-col items-center justify-center text-center text-[#667085] py-12">
                        <div class="w-20 h-20 bg-[#EAF3FF] text-[#1677FF] rounded-full flex items-center justify-center mb-6">
                            <i data-lucide="shopping-bag" class="w-10 h-10 stroke-1"></i>
                        </div>
                        <p class="text-xl font-extrabold text-[#182230] mb-2">Votre panier est vide</p>
                        <p class="text-sm text-[#667085] max-w-[250px] mx-auto mb-8">Découvrez nos équipements high-tech certifiés et faites-vous plaisir !</p>
                        <a href="shop.php" onclick="toggleCartDrawer(false)" class="cursor-pointer px-6 py-3 bg-[#1677FF] hover:bg-[#0B54C2] text-white font-bold text-sm rounded-xl transition-colors duration-200 shadow-md inline-flex items-center gap-2">
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            Continuer les achats
                        </a>
                    </div>
                <?php else: ?>
                    <div class="space-y-4">
                        <?php foreach ($productsInCart as $item): ?>
                            <div class="flex gap-4 p-4 bg-white rounded-2xl border border-[#E8EDF3] shadow-sm hover:border-[#1677FF]/30 transition-colors">
                                <!-- Image -->
                                <div class="w-20 h-20 bg-[#F3F7FC] rounded-xl p-2 flex items-center justify-center border border-[#E8EDF3] shrink-0 overflow-hidden">
                                    <img src="<?= htmlspecialchars($item['main_image']) ?>" alt="<?= htmlspecialchars($item['name']) ?> - SenTechPLUS" width="80" height="80" loading="eager" decoding="async" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;" class="max-w-full max-h-full object-contain">
                                </div>
                                
                                <div class="flex-1 flex flex-col justify-between min-w-0">
                                    <div class="flex justify-between items-start gap-2">
                                        <h4 class="font-bold text-[#182230] text-sm line-clamp-1 flex-1">
                                            <a href="product.php?id=<?= $item['id'] ?>" class="hover:text-[#1677FF] transition-colors"><?= htmlspecialchars($item['name']) ?></a>
                                        </h4>
                                        <!-- Bouton Supprimer -->
                                        <form action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="shrink-0">
                                            <?= getCSRFInputField() ?>
                                            <input type="hidden" name="action" value="remove">
                                            <input type="hidden" name="product_id" value="<?= $item['id'] ?>">
                                            <button type="submit" class="text-[#667085] hover:text-rose-600 hover:bg-rose-50 rounded-lg p-1.5 transition-colors duration-200 cursor-pointer" title="Retirer" aria-label="Retirer du panier">
                                                <i data-lucide="x" class="w-4 h-4"></i>
                                            </button>
                                        </form>
                                    </div>
                                    
                                    <p class="text-xs font-bold text-[#667085] mt-1"><?= formatPrice($item['price']) ?> / unité</p>
                                    
                                    <div class="flex items-end justify-between mt-2">
                                        <div class="flex items-center gap-1 text-xs text-[#667085] bg-[#F3F7FC] px-2 py-1 rounded-lg">
                                            <span>Qté:</span>
                                            <span class="font-bold text-[#182230]"><?= $item['cart_quantity'] ?></span>
                                        </div>
                                        <p class="text-sm font-black text-[#182230]"><?= formatPrice($item['item_total']) ?></p>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Drawer Footer / Summary -->
            <?php if (!empty($productsInCart)): ?>
                <div class="p-5 sm:p-6 border-t border-[#E8EDF3] bg-white space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="font-extrabold text-[#64748B] text-xs uppercase tracking-wider">Total estimé</span>
                        <span class="text-xl font-black text-[#1677FF]"><?= formatPrice($totalPrice) ?></span>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5">
                        <a href="cart.php" class="cursor-pointer py-3 px-2.5 bg-[#F8FAFD] hover:bg-[#F1F5F9] text-[#1D1D1F] font-bold text-xs rounded-2xl text-center border border-slate-200 transition-all active:scale-[0.97] flex justify-center items-center gap-1.5 shadow-2xs">
                            <i data-lucide="shopping-bag" class="w-4 h-4 text-[#64748B]"></i>
                            <span>Voir le Panier</span>
                        </a>
                        <a href="checkout.php" style="background-color: #1677FF !important; color: #ffffff !important;" class="cursor-pointer py-3 px-2.5 bg-[#1677FF] hover:bg-[#0B54C2] text-white font-extrabold text-xs sm:text-sm rounded-2xl text-center shadow-[0_4px_16px_rgba(22,119,255,0.25)] transition-all active:scale-[0.97] flex justify-center items-center gap-1.5">
                            <span>Commander</span>
                            <i data-lucide="arrow-right" class="w-4 h-4 text-white"></i>
                        </a>
                    </div>
                    <button type="button" onclick="toggleCartDrawer(false)" class="cursor-pointer w-full py-1 text-[#64748B] hover:text-[#182230] font-bold text-xs text-center transition-colors">
                        ← Continuer mes achats
                    </button>
                </div>
            <?php endif; ?>

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
    } else {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
</script>
