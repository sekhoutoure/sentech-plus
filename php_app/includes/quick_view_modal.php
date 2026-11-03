<!-- Quick View Modal Component (Emil Kowalski & Apple Design Principles) -->
<div id="quickview-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 glass-overlay anim-modal-overlay">
    <div onclick="closeQuickViewModal()" class="absolute inset-0 cursor-pointer"></div>

    <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 z-10 anim-modal-dialog origin-center pointer-events-auto">
        
        <!-- Close button -->
        <button type="button" onclick="closeQuickViewModal()" aria-label="Fermer la fenêtre d'aperçu" class="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#F3F7FC] text-[#667085] hover:text-[#182230] hover:bg-slate-200 transition-colors cursor-pointer">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 p-6 sm:p-8 gap-6 items-center">
            <!-- Modal Image Gallery -->
            <div class="space-y-3">
                <div class="aspect-square bg-[#F3F7FC] rounded-2xl p-4 border border-[#E8EDF3] flex items-center justify-center">
                    <img id="qv-main-img" src="assets/images/product_img1.webp" alt="Product" width="300" height="300" loading="eager" decoding="async" style="width:100%;height:100%;aspect-ratio:1/1;object-fit:contain;" class="w-full h-full object-contain">
                </div>
            </div>

            <!-- Modal Info & Actions -->
            <div class="space-y-4 text-left">
                <div class="space-y-1">
                    <span id="qv-category" class="text-[10px] font-bold text-[#0B54C2] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full">Écouteurs</span>
                    <h2 id="qv-title" class="text-xl font-extrabold text-[#182230]">Nom du produit</h2>
                </div>

                <div class="flex items-center gap-3">
                    <span id="qv-price" class="text-2xl font-black text-[#182230]">0 FCFA</span>
                    <span id="qv-mrp" class="text-xs text-[#667085] line-through"></span>
                </div>

                <p id="qv-desc" class="text-xs text-[#667085] leading-relaxed line-clamp-3">Description...</p>

                <form action="cart.php" method="POST" enctype="application/x-www-form-urlencoded" class="pt-2 space-y-3">
                    <?= getCSRFInputField() ?>
                    <input type="hidden" name="action" value="add">
                    <input type="hidden" id="qv-product-id" name="product_id" value="">
                    
                    <div class="flex items-center gap-3">
                        <input type="number" name="quantity" value="1" min="1" max="20" aria-label="Quantité" autocomplete="off" class="w-16 border border-[#E8EDF3] bg-[#F3F7FC] text-center text-xs font-bold py-2.5 rounded-xl">
                        <button type="submit" class="btn-electric flex-1 py-2.5 text-xs inline-flex items-center justify-center gap-2">
                            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                            <span>Ajouter au panier</span>
                        </button>
                    </div>
                </form>

                <div class="pt-2 border-t border-[#E8EDF3] flex items-center justify-between text-xs text-[#667085]">
                    <a id="qv-detail-link" href="#" class="font-bold text-[#1677FF] hover:underline">Voir la fiche détaillée →</a>
                </div>
            </div>
        </div>

    </div>
</div>
