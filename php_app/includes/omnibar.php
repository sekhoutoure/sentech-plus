<!-- =============================================================================
     SenTechPLUS — Omnibar "Ask & Get" Zero-UI (Spotlight Ctrl+K)
     ============================================================================= -->
<div id="omnibar-overlay" style="display: none;" class="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-slate-900/50 backdrop-blur-md transition-all duration-200">
    
    <!-- Modal Container (Apple Spotlight Glass & Spring) -->
    <div id="omnibar-modal" class="bg-white/95 backdrop-blur-2xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[85vh] animate-fade-in origin-top">
        
        <!-- Header & Input -->
        <div class="p-4 sm:p-5 border-b border-[#E8EDF3] flex items-center gap-3 bg-[#F8FBFF]">
            <div class="w-9 h-9 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            
            <div class="flex-1 relative">
                <input 
                    type="text" 
                    id="omnibar-input" 
                    aria-label="Recherche et questions intelligentes"
                    placeholder="Posez une question ou cherchez un produit... (Ex: livraison, écouteurs ANC, Wave...)"
                    class="w-full bg-transparent border-0 text-sm sm:text-base font-bold text-[#182230] placeholder-[#98A2B3] focus:outline-none focus:ring-0 p-0"
                    autocomplete="off"
                    spellcheck="false"
                >
            </div>

            <div class="flex items-center gap-2">
                <span class="hidden sm:inline-block text-[10px] font-extrabold uppercase bg-white border border-[#E8EDF3] text-[#667085] px-2 py-0.5 rounded-lg shadow-2xs">ESC</span>
                <button type="button" onclick="closeOmnibar()" class="cursor-pointer text-[#667085] hover:text-[#182230] p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
        </div>

        <!-- Dynamic Results / Intent Container -->
        <div id="omnibar-results" class="p-4 sm:p-6 overflow-y-auto divide-y divide-slate-100 space-y-4 flex-1">
            
            <!-- Default Zero-UI Starter State -->
            <div id="omnibar-starter" class="space-y-4">
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] block">Raccourcis & Questions Fréquentes</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button type="button" onclick="setOmnibarQuery('combien coute la livraison')" class="cursor-pointer text-left p-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E8EDF3] hover:border-[#1677FF]/40 transition-colors flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-blue-100 text-[#1677FF] flex items-center justify-center shrink-0">
                            <i data-lucide="truck" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-[#182230] block">Frais & Délais de Livraison</span>
                            <span class="text-[10px] text-[#667085]">2h à Dakar, gratuit dès 50 000 F</span>
                        </div>
                    </button>

                    <button type="button" onclick="setOmnibarQuery('comment payer par Wave ou Orange Money')" class="cursor-pointer text-left p-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E8EDF3] hover:border-[#1677FF]/40 transition-colors flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-emerald-100 text-[#0D7D53] flex items-center justify-center shrink-0">
                            <i data-lucide="shield-check" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-[#182230] block">Paiement Mobile Money</span>
                            <span class="text-[10px] text-[#667085]">Wave, OM, Free & Cash</span>
                        </div>
                    </button>

                    <button type="button" onclick="setOmnibarQuery('suivre ma commande')" class="cursor-pointer text-left p-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E8EDF3] hover:border-[#1677FF]/40 transition-colors flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <i data-lucide="package" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-[#182230] block">Suivi de Commande en direct</span>
                            <span class="text-[10px] text-[#667085]">Localisez votre colis ST-XXXX</span>
                        </div>
                    </button>

                    <a href="https://wa.me/221781316497" target="_blank" rel="noopener noreferrer" class="cursor-pointer text-left p-3 rounded-2xl bg-[#F8FAFC] hover:bg-emerald-50 border border-[#E8EDF3] hover:border-emerald-200 transition-colors flex items-center gap-3">
                        <div class="w-8 h-8 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-[#182230] block">Assistance WhatsApp 7j/7</span>
                            <span class="text-[10px] text-[#667085]">+221 78 131 64 97</span>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Dynamic Results Injection Area -->
            <div id="omnibar-dynamic-content" class="space-y-4 pt-2" style="display: none;"></div>

        </div>

        <!-- Footer -->
        <div class="p-3 sm:p-3.5 bg-[#F8FAFC] border-t border-[#E8EDF3] flex items-center justify-between text-[11px] font-bold text-[#667085]">
            <div class="flex items-center gap-3">
                <span class="flex items-center gap-1"><kbd class="bg-white px-1.5 py-0.5 rounded border border-[#E8EDF3] text-[9px]">↑</kbd><kbd class="bg-white px-1.5 py-0.5 rounded border border-[#E8EDF3] text-[9px]">↓</kbd> Naviguer</span>
                <span class="flex items-center gap-1"><kbd class="bg-white px-1.5 py-0.5 rounded border border-[#E8EDF3] text-[9px]">↵</kbd> Ouvrir</span>
            </div>
            <span class="text-[#1677FF] flex items-center gap-1">
                <i data-lucide="zap" class="w-3.5 h-3.5"></i>
                <span>Zero-UI Engine SenTechPLUS</span>
            </span>
        </div>

    </div>
</div>

<script>
let omnibarDebounce = null;

function openOmnibar(initialQuery = '') {
    const overlay = document.getElementById('omnibar-overlay');
    const input = document.getElementById('omnibar-input');
    if (!overlay || !input) return;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    if (initialQuery) {
        input.value = initialQuery;
        triggerOmnibarSearch(initialQuery);
    }
    
    setTimeout(() => {
        input.focus();
        if (typeof lucide !== 'undefined') lucide.createIcons({ root: overlay, skipHidden: false });
    }, 50);
}

function closeOmnibar() {
    const overlay = document.getElementById('omnibar-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function setOmnibarQuery(q) {
    const input = document.getElementById('omnibar-input');
    if (input) {
        input.value = q;
        input.focus();
        triggerOmnibarSearch(q);
    }
}

function triggerOmnibarSearch(query) {
    const starter = document.getElementById('omnibar-starter');
    const dynamicArea = document.getElementById('omnibar-dynamic-content');
    if (!dynamicArea) return;

    const trimmed = query.trim();
    if (!trimmed) {
        if (starter) starter.style.display = 'block';
        dynamicArea.style.display = 'none';
        dynamicArea.innerHTML = '';
        return;
    }

    if (starter) starter.style.display = 'none';
    dynamicArea.style.display = 'block';
    dynamicArea.innerHTML = `
        <div class="py-8 text-center text-xs font-bold text-[#667085] flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-[#1677FF]/30 border-t-[#1677FF] rounded-full animate-spin"></div>
            <span>Recherche instantanée...</span>
        </div>
    `;

    fetch('api-ask-and-get.php?q=' + encodeURIComponent(trimmed))
        .then(res => res.json())
        .then(data => {
            renderOmnibarResults(data);
        })
        .catch(() => {
            dynamicArea.innerHTML = `
                <div class="p-4 rounded-2xl bg-slate-50 text-center text-xs font-bold text-[#667085]">
                    Consultez directement notre <a href="shop.php" class="text-[#1677FF] underline">catalogue complet</a> ou contactez-nous sur WhatsApp.
                </div>
            `;
        });
}

function renderOmnibarResults(data) {
    const dynamicArea = document.getElementById('omnibar-dynamic-content');
    if (!dynamicArea) return;

    let html = '';

    // 1. Cartes d'Intention Directe ("Ask & Get")
    if (data.intents && data.intents.length > 0) {
        html += '<div class="space-y-2.5 mb-4">';
        data.intents.forEach(it => {
            html += `
                <div class="p-4 rounded-2xl bg-[#F0F6FF] border border-[#D0E2FF] shadow-2xs space-y-2 animate-fade-in">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 font-black text-xs text-[#0B54C2]">
                            <i data-lucide="${it.icon || 'info'}" class="w-4 h-4"></i>
                            <span>${it.title}</span>
                        </div>
                        ${it.badge ? `<span class="text-[10px] font-extrabold bg-[#1677FF] text-white px-2 py-0.5 rounded-full uppercase">${it.badge}</span>` : ''}
                    </div>
                    <p class="text-xs text-[#344054] leading-relaxed">${it.content}</p>
                    ${it.action_url ? `
                        <div class="pt-1">
                            <a href="${it.action_url}" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1677FF] hover:underline">
                                <span>${it.action_label || 'En savoir plus'}</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    // 2. Suggestions de Catégories
    if (data.categories && data.categories.length > 0) {
        html += '<div class="space-y-2 mb-4">';
        html += '<span class="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] block">Rayons suggérés</span>';
        html += '<div class="flex flex-wrap gap-2">';
        data.categories.forEach(cat => {
            html += `
                <a href="${cat.url}" class="cursor-pointer text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#E8EDF3] hover:border-[#1677FF] text-[#182230] hover:text-[#1677FF] transition-colors flex items-center gap-1.5 shadow-2xs">
                    <i data-lucide="${cat.icon || 'tag'}" class="w-3.5 h-3.5 text-[#1677FF]"></i>
                    <span>${cat.name}</span>
                </a>
            `;
        });
        html += '</div></div>';
    }

    // 3. Produits Trouvés
    if (data.products && data.products.length > 0) {
        html += '<div class="space-y-2.5">';
        html += `<span class="text-[11px] font-extrabold uppercase tracking-wider text-[#667085] block">Produits correspondants (${data.products.length})</span>`;
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">';
        data.products.forEach(p => {
            html += `
                <a href="${p.url}" class="cursor-pointer group p-3 rounded-2xl bg-white hover:bg-[#F8FBFF] border border-[#E8EDF3] hover:border-[#1677FF]/40 transition-colors flex items-center gap-3 shadow-2xs">
                    <div class="w-14 h-14 rounded-xl bg-[#F3F7FC] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain">
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="text-xs font-bold text-[#182230] group-hover:text-[#1677FF] transition-colors line-clamp-1">${p.name}</h4>
                        <div class="flex items-center gap-2 pt-0.5">
                            <span class="text-xs font-black text-[#0B54C2]">${p.formatted_price}</span>
                            ${p.has_discount ? `<span class="text-[9px] font-extrabold bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded-md">-${p.discount_pct}%</span>` : ''}
                        </div>
                    </div>
                </a>
            `;
        });
        html += '</div></div>';
    }

    if ((!data.intents || data.intents.length === 0) && (!data.products || data.products.length === 0) && (!data.categories || data.categories.length === 0)) {
        html = `
            <div class="py-8 text-center space-y-3">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <i data-lucide="search-x" class="w-6 h-6"></i>
                </div>
                <div class="space-y-1">
                    <p class="text-xs font-bold text-[#182230]">Aucun résultat exact pour "${data.query || ''}"</p>
                    <p class="text-[11px] text-[#667085]">Essayez des termes plus généraux ou contactez notre conseiller sur WhatsApp.</p>
                </div>
                <a href="https://wa.me/221781316497?text=Bonjour%20SenTechPLUS,%20je%20cherche%20un%20produit." target="_blank" rel="noopener noreferrer" class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold bg-[#25D366] text-white px-4 py-2 rounded-xl">
                    <i data-lucide="message-circle" class="w-4 h-4"></i>
                    <span>Demander sur WhatsApp</span>
                </a>
            </div>
        `;
    }

    dynamicArea.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: dynamicArea, skipHidden: false });
}

// ─── Keyboard Shortcut Global Listener (Ctrl+K / Cmd+K / Esc) ───────────────
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const overlay = document.getElementById('omnibar-overlay');
        if (overlay && overlay.style.display === 'flex') {
            closeOmnibar();
        } else {
            openOmnibar();
        }
    }
    if (e.key === 'Escape') {
        closeOmnibar();
    }
});

// Input Listener avec Debounce
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('omnibar-input');
    const overlay = document.getElementById('omnibar-overlay');

    if (input) {
        input.addEventListener('input', function() {
            clearTimeout(omnibarDebounce);
            const val = this.value;
            omnibarDebounce = setTimeout(() => {
                triggerOmnibarSearch(val);
            }, 120);
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeOmnibar();
            }
        });
    }
});
</script>
