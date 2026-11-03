<!-- =============================================================================
     POP-UP MODALE : CONFIRMATION AJOUT AU PANIER (SenTechPLUS High-Conversion)
     ============================================================================= -->
<div id="cart-added-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="cam-title" onclick="closeCartAddedModal()">
    <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 w-full max-w-md space-y-4 animate-fade-in relative text-left" onclick="event.stopPropagation()">
        
        <!-- Header : Succès + Titre + Bouton Fermer -->
        <div class="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-[#E8F8F0] text-[#15803D] flex items-center justify-center shrink-0">
                    <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 id="cam-title" class="text-sm sm:text-base font-black text-[#0F172A] leading-tight">Article ajouté au panier !</h3>
                    <p class="text-[11px] text-[#64748B] font-semibold">Disponible pour livraison immédiate à Dakar & Régions</p>
                </div>
            </div>
            <button type="button" onclick="closeCartAddedModal()" class="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#EEF4FB] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer" aria-label="Fermer la fenêtre">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>

        <!-- Fiche Produit Ajouté -->
        <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFD] border border-[#E8EDF3]">
            <div class="w-16 h-16 rounded-xl bg-white p-1 shrink-0 border border-slate-200/60 flex items-center justify-center overflow-hidden">
                <img id="cam-img" src="assets/images/product_img1.webp" alt="Produit" class="w-full h-full object-contain" width="64" height="64" style="width:64px;height:64px;aspect-ratio:1/1;object-fit:contain;">
            </div>
            <div class="min-w-0 flex-1 space-y-1">
                <h4 id="cam-name" class="text-xs sm:text-sm font-black text-[#0F172A] line-clamp-1">Équipement High-Tech</h4>
                <p id="cam-variant" class="text-[11px] text-[#0B54C2] font-bold hidden"></p>
                <div class="flex items-center justify-between text-xs">
                    <span id="cam-qty" class="text-[#475467] font-semibold">Quantité : 1</span>
                    <span id="cam-price" class="font-black text-[#0F172A]">0 FCFA</span>
                </div>
            </div>
        </div>

        <!-- Récapitulatif Panier & Jauge Livraison Gratuite -->
        <div class="p-3.5 rounded-2xl bg-[#F4F7FB] border border-[#E8EDF3] space-y-2.5">
            <div class="flex items-center justify-between text-xs font-black">
                <span class="text-[#334155]" id="cam-cart-count-text">Sous-total panier (1 article) :</span>
                <span class="text-[#0B54C2] text-sm font-black" id="cam-subtotal-val">0 FCFA</span>
            </div>
            
            <!-- Jauge Livraison Gratuite -->
            <div id="cam-shipping-bar-container" class="space-y-2 pt-1">
                <div class="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                    <div id="cam-shipping-progress" class="bg-[#16A34A] h-full rounded-full transition-all duration-500" style="width: 20%;"></div>
                </div>
                <div id="cam-shipping-text" class="text-[11.5px] font-bold text-[#15803D] flex items-center gap-2 leading-tight">
                    <span id="cam-shipping-icon" class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <i data-lucide="truck" class="w-3 h-3"></i>
                    </span>
                    <span id="cam-shipping-msg" class="flex-1">Plus que 50 000 FCFA pour la livraison GRATUITE à Dakar !</span>
                </div>
            </div>
        </div>

        <!-- Boutons d'Action Clairs -->
        <div class="space-y-2 pt-1">
            <a href="cart" class="w-full py-3.5 px-4 rounded-2xl bg-[#0B54C2] hover:bg-[#09449E] active:scale-[0.99] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all text-center cursor-pointer">
                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                <span>Voir le Panier & Commander</span>
            </a>
            <button type="button" onclick="closeCartAddedModal()" class="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#475467] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer text-center">
                Continuer mes achats
            </button>
        </div>

    </div>
</div>
