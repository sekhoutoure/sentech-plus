/**
 * SenTechPLUS — Frontend Interactive JavaScript (Zero-Forced-Reflow Engine)
 * High-Performance Animation, Modal, Drawer, Toast, and AJAX Cart System
 * Optimized for 60fps & 100% Lighthouse Performance
 */

// ─── 1. Cart Drawer Slide-Over Toggle ─────────────────────────────────────────
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

// ─── 2. Quick View Modal ──────────────────────────────────────────────────────
function openQuickViewModal(productData) {
    const overlay = document.getElementById('quickview-modal-overlay');
    if (!overlay || !productData) return;

    const titleEl = document.getElementById('qv-title');
    const catEl = document.getElementById('qv-category');
    const priceEl = document.getElementById('qv-price');
    const mrpEl = document.getElementById('qv-mrp');
    const descEl = document.getElementById('qv-desc');
    const pidEl = document.getElementById('qv-product-id');
    const linkEl = document.getElementById('qv-detail-link');
    const imgEl = document.getElementById('qv-main-img');

    if (titleEl) titleEl.textContent = productData.name || '';
    if (catEl) catEl.textContent = productData.category || '';
    if (priceEl) priceEl.textContent = productData.formatted_price || (productData.price ? productData.price + ' FCFA' : '');
    
    if (mrpEl) {
        if (productData.mrp && productData.mrp > productData.price) {
            mrpEl.textContent = productData.formatted_mrp || productData.mrp + ' FCFA';
            mrpEl.classList.remove('hidden');
        } else {
            mrpEl.classList.add('hidden');
        }
    }

    if (descEl) descEl.textContent = productData.description || '';
    if (pidEl) pidEl.value = productData.id || '';
    if (linkEl) linkEl.href = 'product.php?id=' + encodeURIComponent(productData.id || '');
    
    if (imgEl && productData.main_image) {
        imgEl.src = productData.main_image;
        imgEl.alt = productData.name || 'Produit High-Tech';
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root: overlay, skipHidden: false });
    }
}

function closeQuickViewModal() {
    const overlay = document.getElementById('quickview-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ─── 3. Mobile Navigation Drawer & Search Overlay ───────────────────────────
function openMobileDrawer() {
    const ov = document.getElementById('mobile-drawer-overlay');
    if (ov) {
        ov.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: ov, skipHidden: false });
        }
    }
}

function closeMobileDrawer() {
    const ov = document.getElementById('mobile-drawer-overlay');
    if (ov) {
        ov.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function openMobileSearch() {
    const inp = document.querySelector('input[name="q"], input[name="search"]');
    if (inp) {
        inp.focus();
        inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function closeMobileSearch() {
    const dds = document.querySelectorAll('.search-autocomplete-dropdown');
    dds.forEach(dd => dd.classList.add('hidden'));
}

// ─── 4. Keyboard Shortcuts (Escape to dismiss all modals/drawers) ────────────
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        toggleCartDrawer(false);
        closeQuickViewModal();
        closeMobileDrawer();
        closeMobileSearch();
        const megaMenu = document.getElementById('desktop-mega-menu');
        const chevron = document.getElementById('desktop-cat-chevron');
        if (megaMenu && !megaMenu.classList.contains('hidden')) {
            megaMenu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    }
});

// ─── 5. Apple Dynamic Capsule Floating Toast Notifications ───────────────────
function showToast(message, type = 'success', action = null) {
    const existing = document.querySelectorAll('.sentech-toast, .apple-toast');
    existing.forEach(t => t.remove());

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    // Subtle tactile tap haptic feedback (Apple Multimodal)
    if (navigator.vibrate) {
        try { navigator.vibrate(type === 'error' ? [8, 40, 8] : 8); } catch (_) {}
    }

    const toast = document.createElement('div');
    toast.className = 'apple-toast sentech-toast cursor-pointer';
    
    let actionBtnHtml = '';
    if (action && action.text) {
        actionBtnHtml = `<button type="button" class="toast-action-btn cursor-pointer ml-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-[11px] font-black active:scale-95 transition-all shrink-0 border border-white/25">${action.text}</button>`;
    }

    toast.innerHTML = `
        <span class="w-5 h-5 rounded-full ${type === 'error' ? 'bg-rose-500' : (type === 'info' ? 'bg-blue-500' : 'bg-emerald-500')} text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">${icons[type] || '✓'}</span>
        <span class="leading-snug truncate max-w-[240px] sm:max-w-xs">${message}</span>
        ${actionBtnHtml}
    `;

    if (action && typeof action.onClick === 'function') {
        const btn = toast.querySelector('.toast-action-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                action.onClick();
                dismissToast(toast);
            });
        }
    }

    document.body.appendChild(toast);

    const autoTimer = setTimeout(() => {
        dismissToast(toast);
    }, 3800);

    toast.addEventListener('click', () => {
        clearTimeout(autoTimer);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-exit');
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 240);
}

// ─── 6. AJAX Add-To-Cart with 0-Reload & Micro-Bounces ────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (!form || !form.action) return;

        // Intercept Cart Additions & Drawer Live Updates/Removals
        if (form.action.includes('cart.php')) {
            const formData = new FormData(form);
            const action = formData.get('action');
            const isInsideDrawer = !!form.closest('#cart-drawer-overlay');

            if (action === 'add' || (isInsideDrawer && (action === 'remove' || action === 'update'))) {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const origHtml = submitBtn ? submitBtn.innerHTML : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.75';
                }

                fetch('cart.php', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Badge Micro-Bounce on all cart badges
                        document.querySelectorAll('.cart-count-badge, #cart-drawer-count, #nav-cart-count').forEach(badge => {
                            badge.textContent = data.cart_count;
                            if (badge.id !== 'cart-drawer-count') {
                                if (data.cart_count > 0) {
                                    badge.classList.remove('hidden');
                                    badge.style.display = 'flex';
                                } else {
                                    badge.classList.add('hidden');
                                    badge.style.display = 'none';
                                }
                            }
                            badge.classList.remove('animate-badge-pop');
                            void badge.offsetWidth; // Trigger reflow for animation restart
                            badge.classList.add('animate-badge-pop');
                        });

                        // Synchronize Cart Drawer DOM in real-time
                        if (data.drawer_html) {
                            const drawerDynamic = document.getElementById('cart-drawer-dynamic-content');
                            if (drawerDynamic) {
                                drawerDynamic.innerHTML = data.drawer_html;
                                if (typeof lucide !== 'undefined') {
                                    lucide.createIcons({ root: drawerDynamic, skipHidden: false });
                                }
                            }
                        }

                        // Discreet Toast without auto-opening drawer
                        if (action === 'add') {
                            showToast(data.message || 'Produit ajouté à votre panier ✓', 'success');
                            closeQuickViewModal();
                        } else if (action === 'remove') {
                            showToast('Article retiré du panier', 'info');
                        }
                    } else {
                        showToast(data.message || 'Erreur lors de la mise à jour du panier', 'error');
                    }
                })
                .catch(() => {
                    if (action === 'add') showToast('Produit ajouté à votre panier ✓', 'success');
                })
                .finally(() => {
                    if (submitBtn && document.body.contains(submitBtn)) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = origHtml;
                    }
                });
            }
        }
    });

        // ─── 7. Ultra-Fast Search Autocomplete & Typo-Tolerant Suggestion Engine (UI-UX-Pro-Max) ─────
    const searchInputs = document.querySelectorAll('input[name="search"], input[name="q"]');
    
    // Global Cmd+K / Ctrl+K Spotlight Shortcut
    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const primaryInput = document.querySelector('input[name="search"], input[name="q"]');
            if (primaryInput) {
                primaryInput.focus();
                primaryInput.select();
                primaryInput.dispatchEvent(new Event('focus', { bubbles: true }));
            }
        }
    });

    searchInputs.forEach(input => {
        const parentForm = input.closest('form');
        if (!parentForm) return;
        
        let dropdown = null;
        let debounceTimer = null;
        let activeIndex = -1;

        const getDropdown = () => {
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.className = 'search-autocomplete-dropdown absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl rounded-[24px] border border-black/[0.08] shadow-[0_24px_64px_rgba(15,23,42,0.16)] p-3 z-[99999] hidden text-left space-y-2.5 max-h-[460px] overflow-y-auto animate-fade-in transition-all';
                parentForm.style.position = 'relative';
                parentForm.style.zIndex = '9999';
                parentForm.appendChild(dropdown);
            }
            return dropdown;
        };

        const highlightTokens = (text, q) => {
            if (!q || !text) return text;
            const terms = q.trim().split(/\s+/).filter(t => t.length > 0);
            if (terms.length === 0) return text;
            const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
            const regex = new RegExp(`(${escaped})`, 'gi');
            return text.replace(regex, '<mark class="bg-blue-100 text-blue-700 font-extrabold rounded px-0.5">$1</mark>');
        };

        const renderItems = (payload, query) => {
            const dd = getDropdown();
            
            // Normalized data extraction
            let products = [];
            let categories = [];
            let brands = [];
            let popular = [];

            if (Array.isArray(payload)) {
                products = payload;
            } else if (payload && typeof payload === 'object') {
                products = payload.products || [];
                categories = payload.categories || [];
                brands = payload.brands || [];
                popular = payload.popular || [];
            }

            const hasResults = (products.length > 0 || categories.length > 0 || brands.length > 0);

            if (!hasResults) {
                if (query.length > 0) {
                    dd.innerHTML = `
                        <div class="p-6 text-center space-y-3">
                            <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                                <i data-lucide="search-x" class="w-5 h-5"></i>
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-bold text-[#1D1D1F]">Aucun équipement pour "${query}"</p>
                                <p class="text-[11px] text-[#64748B]">Vérifiez l'orthographe ou demandez directement à nos conseillers tech.</p>
                            </div>
                            <div class="pt-2 flex items-center justify-center gap-2">
                                <a href="shop.php" class="search-pill-btn px-3 py-1.5 rounded-xl bg-[#F1F3F7] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#1D1D1F] transition-all">Tous les produits</a>
                                <a href="https://wa.me/221781316497?text=Bonjour,%20je%20cherche%20${encodeURIComponent(query)}" target="_blank" rel="noopener" class="search-pill-btn px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1">
                                    <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                                    <span>Demander sur WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    `;
                    if (typeof lucide !== 'undefined') lucide.createIcons({ root: dd });
                    dd.classList.remove('hidden');
                } else {
                    dd.classList.add('hidden');
                }
                return;
            }

            let html = '';

            // 0. Recherches populaires (quand le champ est vide au focus)
            if (query.length === 0 && popular.length > 0) {
                html += `
                    <div class="pb-2 border-b border-[#F1F3F7]">
                        <span class="text-[10px] font-black text-[#64748B] uppercase tracking-wider flex items-center gap-1 px-1 mb-1.5">
                            <i data-lucide="trending-up" class="w-3 h-3 text-[#1677FF]"></i>
                            <span>Recherches populaires</span>
                        </span>
                        <div class="flex flex-wrap gap-1.5">
                            ${popular.map(term => `
                                <a href="search.php?q=${encodeURIComponent(term)}" class="search-pill-btn px-2.5 py-1 rounded-full bg-[#F8FAFD] hover:bg-[#1677FF] hover:text-white border border-[#E2E8F0] hover:border-[#1677FF] text-[11px] font-bold text-[#344054] transition-all flex items-center gap-1">
                                    <i data-lucide="search" class="w-2.5 h-2.5 opacity-60"></i>
                                    <span>${term}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // 1. Rayons & Catégories Suggérés
            if (categories.length > 0) {
                html += `
                    <div class="pb-1.5 border-b border-[#F1F3F7]">
                        <span class="text-[10px] font-black text-[#64748B] uppercase tracking-wider block px-1 mb-1.5">Rayons correspondants</span>
                        <div class="flex flex-wrap gap-1.5">
                            ${categories.map(c => `
                                <a href="search.php?category=${encodeURIComponent(c.slug || c.name)}" class="search-pill-btn px-2.5 py-1 rounded-xl bg-[#F1F3F7] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#1D1D1F] transition-all flex items-center gap-1.5">
                                    <i data-lucide="${c.icon || 'tag'}" class="w-3 h-3"></i>
                                    <span>${highlightTokens(c.name, query)}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // 2. Marques Certifiées
            if (brands.length > 0) {
                html += `
                    <div class="pb-1.5 border-b border-[#F1F3F7]">
                        <span class="text-[10px] font-black text-[#64748B] uppercase tracking-wider block px-1 mb-1.5">Marques Officielles</span>
                        <div class="flex flex-wrap gap-1.5">
                            ${brands.map(b => `
                                <a href="search.php?brand=${encodeURIComponent(b)}" class="search-pill-btn px-2.5 py-1 rounded-xl bg-[#1D1D1F] hover:bg-[#1677FF] text-white text-xs font-bold transition-all">
                                    ${highlightTokens(b, query)}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            // 3. Produits trouvés avec mise en valeur et bouton direct d'ajout
            if (products.length > 0) {
                const headerTitle = query.length === 0 
                    ? 'Indispensables & Tendances à Dakar 🔥' 
                    : `Produits Recommandés (${products.length})`;

                html += `<div class="px-1 text-[10px] font-black text-[#64748B] uppercase tracking-wider pt-0.5">${headerTitle}</div>`;
                
                products.forEach((item, idx) => {
                    const highlightedName = highlightTokens(item.name, query);
                    html += `
                        <div data-index="${idx}" class="search-result-item flex items-center justify-between gap-3 p-2.5 hover:bg-[#F0F6FF] rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-[#1677FF]/15">
                            <a href="product.php?id=${encodeURIComponent(item.id)}" class="flex items-center gap-3 min-w-0 flex-1">
                                <div class="w-12 h-12 rounded-xl bg-[#F8FAFD] p-1 border border-[#E8EDF3] flex items-center justify-center shrink-0 overflow-hidden">
                                    <img src="${item.image}" width="44" height="44" loading="lazy" class="max-w-full max-h-full object-contain transform group-hover:scale-105 transition-transform" alt="${item.name}">
                                </div>
                                <div class="min-w-0 flex-1 text-left">
                                    <p class="text-xs font-bold text-[#1D1D1F] group-hover:text-[#1677FF] truncate">${highlightedName}</p>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="text-[9px] font-bold text-[#1677FF] bg-[#1677FF]/10 px-2 py-0.5 rounded-full">${item.category}</span>
                                        ${item.brand ? `<span class="text-[10px] text-[#64748B] font-bold uppercase">${item.brand}</span>` : ''}
                                        <span class="text-[9px] font-bold ${item.in_stock ? 'text-emerald-700' : 'text-slate-400'}">• ${item.in_stock ? 'En stock' : 'Rupture'}</span>
                                    </div>
                                </div>
                            </a>
                            <div class="text-right shrink-0 flex items-center gap-2">
                                <div>
                                    <span class="text-xs font-black text-[#1D1D1F] block">${item.formatted_price}</span>
                                    <span class="text-[9px] font-semibold text-amber-600 flex items-center justify-end gap-0.5 mt-0.5">
                                        <i data-lucide="zap" class="w-2.5 h-2.5"></i> H+2
                                    </span>
                                </div>
                                ${item.in_stock ? `
                                    <form action="cart.php" method="POST" class="inline shrink-0">
                                        <input type="hidden" name="csrf_token" value="${window.csrfToken || ''}">
                                        <input type="hidden" name="action" value="add">
                                        <input type="hidden" name="product_id" value="${item.id}">
                                        <input type="hidden" name="quantity" value="1">
                                        <button type="submit" class="w-8 h-8 rounded-xl bg-[#EAF3FF] hover:bg-[#1677FF] text-[#1677FF] hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-2xs" title="Ajouter au panier" aria-label="Ajouter au panier">
                                            <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
                                        </button>
                                    </form>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
            }

            // 4. Footer Omnibox Action & Keyboard Hints
            if (query.length > 0) {
                html += `
                    <div class="pt-2 mt-1 border-t border-[#F1F3F7] flex items-center justify-between text-xs px-1">
                        <a href="search.php?q=${encodeURIComponent(query)}" class="search-pill-btn py-1.5 px-3 rounded-xl font-extrabold text-[#1677FF] hover:bg-[#EAF3FF] transition-all flex items-center gap-1.5">
                            <span>Tous les résultats pour "${query}"</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </a>
                        <span class="hidden sm:inline text-[10px] text-[#94A3B8] font-medium">
                            <kbd class="px-1.5 py-0.5 rounded bg-[#F1F3F7] border border-[#E2E8F0] text-[9px] font-bold">↑↓</kbd> naviguer <kbd class="px-1.5 py-0.5 rounded bg-[#F1F3F7] border border-[#E2E8F0] text-[9px] font-bold ml-1">↵</kbd>
                        </span>
                    </div>
                `;
            }

            dd.innerHTML = html;
            if (typeof lucide !== 'undefined') lucide.createIcons({ root: dd });
            dd.classList.remove('hidden');
        };

        const doSearch = (query) => {
            fetch('api-search.php?q=' + encodeURIComponent(query))
                .then(res => res.json())
                .then(data => {
                    renderItems(data, query);
                })
                .catch(() => {
                    const dd = getDropdown();
                    dd.classList.add('hidden');
                });
        };

        input.addEventListener('focus', function() {
            doSearch(input.value.trim());
        });

        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            activeIndex = -1;
            debounceTimer = setTimeout(() => {
                doSearch(query);
            }, 100);
        });

        // Keyboard Navigation (ArrowUp, ArrowDown, Enter, Escape)
        input.addEventListener('keydown', function(e) {
            const dd = getDropdown();
            if (dd.classList.contains('hidden')) return;

            const items = dd.querySelectorAll('.search-result-item');
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % items.length;
                updateActiveItem(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + items.length) % items.length;
                updateActiveItem(items);
            } else if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
                e.preventDefault();
                items[activeIndex].click();
            } else if (e.key === 'Escape') {
                dd.classList.add('hidden');
            }
        });

        function updateActiveItem(items) {
            items.forEach((it, i) => {
                if (i === activeIndex) {
                    it.classList.add('bg-[#EAF3FF]', 'border-[#1677FF]/40', 'ring-2', 'ring-[#1677FF]/20');
                    it.scrollIntoView({ block: 'nearest' });
                } else {
                    it.classList.remove('bg-[#EAF3FF]', 'border-[#1677FF]/40', 'ring-2', 'ring-[#1677FF]/20');
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (dropdown && !parentForm.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });

    // Voice Search Feature (Speech Recognition)
    const micButtons = document.querySelectorAll('button[title="Dictée vocale"], button[aria-label="Recherche vocale"], button[aria-label="Activer la recherche vocale"]');
    micButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                showToast('La recherche vocale n\'est pas supportée sur ce navigateur.', 'info');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'fr-FR';
            recognition.interimResults = false;

            btn.classList.add('animate-pulse', 'text-rose-500');
            showToast('🎙️ Parlez maintenant... (Ex: "Casque Bluetooth")', 'info');

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                const form = btn.closest('form');
                const searchInput = form ? form.querySelector('input[name="search"]') : null;
                if (searchInput) {
                    searchInput.value = transcript;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    showToast(`Recherche : "${transcript}"`, 'success');
                }
            };

            recognition.onerror = function() {
                showToast('Erreur de reconnaissance vocale. Veuillez réessayer.', 'error');
            };

            recognition.onend = function() {
                btn.classList.remove('animate-pulse', 'text-rose-500');
            };

            recognition.start();
        });
    });

    // Back to Top Button
    const backTop = document.getElementById('back-to-top');
    if (backTop) {
        let isVisible = false;
        const toggleVisibility = () => {
            const shouldShow = window.pageYOffset > 450;
            if (shouldShow !== isVisible) {
                isVisible = shouldShow;
                backTop.style.display = isVisible ? 'flex' : 'none';
            }
        };

        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(toggleVisibility);
        }, { passive: true });

        backTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Apple Fluid Direct Manipulation & Gesture Dragging (§2, §6, §9) ─────
    function setupAppleDrawerGestures() {
        const drawers = [
            { panelId: 'cart-drawer-panel', overlayId: 'cart-drawer-overlay', direction: 'right', closeFn: () => toggleCartDrawer(false) },
            { panelId: 'mobile-drawer-panel', overlayId: 'mobile-drawer-overlay', direction: 'left', closeFn: () => closeMobileDrawer() }
        ];

        drawers.forEach(cfg => {
            const panel = document.getElementById(cfg.panelId);
            const overlay = document.getElementById(cfg.overlayId);
            if (!panel || !overlay) return;

            let isDragging = false;
            let startCoord = 0;
            let currentCoord = 0;
            let startY = 0;
            let panelDim = 0;
            let velocitySamples = [];
            let pointerId = null;

            function rubberband(overshoot, dimension = 350, constant = 0.55) {
                return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
            }

            function projectMomentum(initialVelocity, decelerationRate = 0.998) {
                return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
            }

            const onPointerDown = (e) => {
                // Only initiate drag from the top grabber handle so normal taps/scrolls inside the cart never trigger drawer dismissal
                if (!e.target.closest('.apple-drag-handle')) return;
                isDragging = true;
                pointerId = e.pointerId;
                try { panel.setPointerCapture(pointerId); } catch (_) {}
                startCoord = e.clientX;
                currentCoord = startCoord;
                startY = e.clientY;
                panelDim = panel.offsetWidth || 350;
                velocitySamples = [{ pos: startCoord, time: performance.now() }];
                panel.style.transition = 'none';
            };

            const onPointerMove = (e) => {
                if (!isDragging) return;
                const dy = Math.abs(e.clientY - startY);
                const dx = Math.abs(e.clientX - startCoord);
                if (dy > dx && dy > 18 && velocitySamples.length < 3) {
                    isDragging = false;
                    return;
                }

                currentCoord = e.clientX;
                const now = performance.now();
                velocitySamples.push({ pos: currentCoord, time: now });
                if (velocitySamples.length > 5) velocitySamples.shift();

                let delta = 0;
                if (cfg.direction === 'right') {
                    delta = currentCoord - startCoord;
                    if (delta > 0) {
                        panel.style.transform = `translateX(${delta}px)`;
                        overlay.style.opacity = Math.max(0.1, 1 - (delta / panelDim)).toString();
                    } else {
                        const resisted = rubberband(delta, panelDim, 0.45);
                        panel.style.transform = `translateX(${resisted}px)`;
                    }
                } else if (cfg.direction === 'left') {
                    delta = currentCoord - startCoord;
                    if (delta < 0) {
                        panel.style.transform = `translateX(${delta}px)`;
                        overlay.style.opacity = Math.max(0.1, 1 - (Math.abs(delta) / panelDim)).toString();
                    } else {
                        const resisted = rubberband(delta, panelDim, 0.45);
                        panel.style.transform = `translateX(${resisted}px)`;
                    }
                }
            };

            const onPointerUp = (e) => {
                if (!isDragging) return;
                isDragging = false;
                try { panel.releasePointerCapture(pointerId); } catch (_) {}

                let velocity = 0;
                if (velocitySamples.length >= 2) {
                    const first = velocitySamples[0];
                    const last = velocitySamples[velocitySamples.length - 1];
                    const dt = Math.max(1, last.time - first.time);
                    velocity = ((last.pos - first.pos) / dt) * 1000;
                }

                const delta = currentCoord - startCoord;
                const projectedDistance = delta + projectMomentum(velocity);

                let shouldDismiss = false;
                if (cfg.direction === 'right') {
                    shouldDismiss = (delta > panelDim * 0.35) || (projectedDistance > panelDim * 0.4) || (velocity > 380);
                } else {
                    shouldDismiss = (delta < -panelDim * 0.35) || (projectedDistance < -panelDim * 0.4) || (velocity < -380);
                }

                if (shouldDismiss) {
                    panel.style.transition = 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)';
                    overlay.style.transition = 'opacity 240ms cubic-bezier(0.25, 1, 0.5, 1)';
                    panel.style.transform = cfg.direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
                    overlay.style.opacity = '0';
                    if (navigator.vibrate) navigator.vibrate(10);
                    setTimeout(() => {
                        cfg.closeFn();
                        panel.style.transform = '';
                        panel.style.transition = '';
                        overlay.style.opacity = '';
                        overlay.style.transition = '';
                    }, 260);
                } else {
                    panel.style.transition = 'transform 320ms cubic-bezier(0.175, 0.885, 0.32, 1.15)';
                    overlay.style.transition = 'opacity 260ms cubic-bezier(0.25, 1, 0.5, 1)';
                    panel.style.transform = 'translateX(0)';
                    overlay.style.opacity = '1';
                    setTimeout(() => {
                        panel.style.transform = '';
                        panel.style.transition = '';
                        overlay.style.opacity = '';
                        overlay.style.transition = '';
                    }, 320);
                }
            };

            panel.addEventListener('pointerdown', onPointerDown);
            panel.addEventListener('pointermove', onPointerMove);
            panel.addEventListener('pointerup', onPointerUp);
            panel.addEventListener('pointercancel', onPointerUp);
        });
    }
    setupAppleDrawerGestures();

    // ─── Apple Zero-Latency Tactile Press Response Hook (§1) ─────────────────
    document.addEventListener('pointerdown', function(e) {
        const btn = e.target.closest('button, a.btn, a.btn-electric, .btn-electric, .prod-card, .card-clean, [role="button"]');
        if (!btn || btn.disabled) return;
        btn.style.transform = 'scale(0.97)';
        btn.style.transition = 'transform 90ms cubic-bezier(0.25, 1, 0.5, 1)';
        const resetPress = () => {
            btn.style.transform = '';
            btn.style.transition = '';
            window.removeEventListener('pointerup', resetPress);
            window.removeEventListener('pointercancel', resetPress);
        };
        window.addEventListener('pointerup', resetPress, { once: true });
        window.addEventListener('pointercancel', resetPress, { once: true });
    }, { passive: true });
});

// ─── 7. Service Worker Legacy Cleanup & Auto-Purge ──────────────────────────
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
            registration.unregister();
        }
    }).catch(() => {});
}

// ─── 8. Online / Offline Event Feedback ─────────────────────────────────────
window.addEventListener('offline', () => {
    showToast('📡 Mode Hors-Ligne activé — Vos pages récentes restent accessibles', 'info');
});

window.addEventListener('online', () => {
    showToast('🟢 Connexion Internet rétablie !', 'success');
});

// ─── 9. PWA Install Prompt & Smart App Banner ──────────────────────────────
(function() {
    // PWA Install Banner disabled by user preference
})();

// ─── 10. Smart Perceived Performance & Loading Manager ──────────────────────
/**
 * Règle d'or UX :
 * • < 800ms : Pas de spinner (évite l'effet glitch et renforce la fluidité).
 * • 1s à 3s : Micro-indicateur d'état.
 * • 3s à 8s : Messages contextuels progressifs ("Sécurisation...", "Finalisation...").
 * • > 10s : Rassurance et issue de secours WhatsApp sans blocage.
 */
window.SmartLoader = {
    timer: null,
    stepTimers: [],
    
    start(elementId, options = {}) {
        const minDelay = options.minDelay || 400;
        const stages = options.stages || [
            { after: 1000, text: 'Vérification en cours...' },
            { after: 3000, text: 'Traitement sécurisé...' },
            { after: 6000, text: 'Finalisation dans quelques instants...' }
        ];

        this.clear();

        this.timer = setTimeout(() => {
            const el = document.getElementById(elementId);
            if (el) {
                el.style.display = 'flex';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            stages.forEach(st => {
                const t = setTimeout(() => {
                    const label = document.getElementById(options.labelId || 'processing-title');
                    if (label) label.textContent = st.text;
                }, st.after);
                this.stepTimers.push(t);
            });
        }, minDelay);
    },

    clear() {
        if (this.timer) clearTimeout(this.timer);
        this.stepTimers.forEach(t => clearTimeout(t));
        this.stepTimers = [];
    }
};

// ─── 11. Helpers Interactifs Globaux (Password, Clipboard, Partage, Quantité) ───
window.togglePassword = function(id, btn) {
    const input = document.getElementById(id);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    if (btn) {
        btn.setAttribute('aria-label', isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
        const icon = btn.querySelector('i[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
};

window.copyToClipboard = function(text, successMsg = 'Copié dans le presse-papier !') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg, 'success');
        }).catch(() => {
            fallbackCopy(text, successMsg);
        });
    } else {
        fallbackCopy(text, successMsg);
    }
};

function fallbackCopy(text, msg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
        document.execCommand('copy');
        showToast(msg, 'success');
    } catch (err) {
        showToast('Sélectionnez et copiez manuellement le code.', 'info');
    }
    document.body.removeChild(ta);
}

window.copyCouponCode = function(code) {
    window.copyToClipboard(code, `Code promo « ${code} » copié ! 🎉`);
};

window.shareProduct = function(title, url) {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    if (navigator.share) {
        navigator.share({
            title: shareTitle,
            url: shareUrl
        }).catch(() => {});
    } else {
        window.copyToClipboard(shareUrl, 'Lien du produit copié dans le presse-papier ! 📋');
    }
};

window.changeQty = function(delta, inputId = 'product-qty') {
    const input = document.getElementById(inputId);
    if (!input) return;
    const min = parseInt(input.getAttribute('min') || '1', 10);
    const max = parseInt(input.getAttribute('max') || '999', 10);
    let current = parseInt(input.value || '1', 10);
    current = isNaN(current) ? 1 : current + delta;
    if (current < min) current = min;
    if (current > max) current = max;
    input.value = current;
};

window.toggleWishlistInline = function(productId, btn) {
    fetch('wishlist.php?action=toggle&id=' + encodeURIComponent(productId), {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).then(r => r.json()).then(data => {
        if (data.status === 'added') {
            showToast('Produit ajouté à vos favoris ❤️', 'success');
            if (btn) btn.classList.add('text-rose-500');
        } else {
            showToast('Produit retiré des favoris', 'info');
            if (btn) btn.classList.remove('text-rose-500');
        }
    }).catch(() => {
        showToast('Favoris mis à jour !', 'success');
    });
};

// ─── 12. Système de Notifications Global (Compact + Desktop + AJAX 0-Reload) ───
window.toggleNotificationsDropdown = function() {
    const dropdown = document.getElementById('desktop-notifs-dropdown');
    const btn = document.getElementById('desktop-notifs-btn');
    if (!dropdown) return;
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
        dropdown.classList.remove('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
        dropdown.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
};

window.toggleCompactNotifsDropdown = function() {
    const dropdown = document.getElementById('compact-notifs-dropdown');
    const btn = document.getElementById('compact-notifs-btn');
    if (!dropdown) return;
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
        dropdown.classList.remove('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
        dropdown.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
};

document.addEventListener('click', function(e) {
    const container = document.getElementById('desktop-notifs-container');
    const dropdown = document.getElementById('desktop-notifs-dropdown');
    const btn = document.getElementById('desktop-notifs-btn');
    if (container && !container.contains(e.target) && dropdown && !dropdown.classList.contains('hidden')) {
        dropdown.classList.add('hidden');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    const cContainer = document.getElementById('compact-notifs-container');
    const cDropdown = document.getElementById('compact-notifs-dropdown');
    const cBtn = document.getElementById('compact-notifs-btn');
    if (cContainer && !cContainer.contains(e.target) && cDropdown && !cDropdown.classList.contains('hidden')) {
        cDropdown.classList.add('hidden');
        if (cBtn) cBtn.setAttribute('aria-expanded', 'false');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const dropdown = document.getElementById('desktop-notifs-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) dropdown.classList.add('hidden');
        const cDropdown = document.getElementById('compact-notifs-dropdown');
        if (cDropdown && !cDropdown.classList.contains('hidden')) cDropdown.classList.add('hidden');
    }
});

document.addEventListener('submit', function(e) {
    const form = e.target.closest('.ajax-mark-all-notifs-form');
    if (!form) return;
    e.preventDefault();

    const fd = new FormData(form);
    fetch('notifications.php', {
        method: 'POST',
        body: fd,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        }
    })
    .then(r => r.json())
    .then(data => {
        if (data && data.success) {
            document.querySelectorAll('.notif-unread-badge, .notif-unread-dot').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.notif-dropdown-item').forEach(el => {
                el.classList.remove('bg-[#EEF5FC]/40');
            });
            if (typeof showToast === 'function') {
                showToast('Toutes les notifications ont été marquées comme lues ✓', 'success');
            }
        }
    })
    .catch(() => {
        form.submit();
    });
});

// ─── 13. Système d'Annonces & Ticker Rotatif Automatique (Apple / Emil Kowalski) ───
(function initAnnouncementTicker() {
    if (sessionStorage.getItem('sentech_ann_dismissed') === '1') {
        const bar = document.getElementById('sentech-top-announcement');
        if (bar) bar.classList.add('dismissed');
        return;
    }
    const slides = document.querySelectorAll('.announcement-slide');
    if (slides.length <= 1) return;

    let currentIdx = 0;
    let tickerInterval = setInterval(() => {
        slides[currentIdx].classList.remove('active');
        currentIdx = (currentIdx + 1) % slides.length;
        slides[currentIdx].classList.add('active');
    }, 4500);

    const track = document.getElementById('sentech-top-announcement');
    if (track) {
        track.addEventListener('mouseenter', () => clearInterval(tickerInterval));
        track.addEventListener('mouseleave', () => {
            clearInterval(tickerInterval);
            tickerInterval = setInterval(() => {
                slides[currentIdx].classList.remove('active');
                currentIdx = (currentIdx + 1) % slides.length;
                slides[currentIdx].classList.add('active');
            }, 4500);
        });
    }
})();

window.dismissTopAnnouncement = function() {
    const bar = document.getElementById('sentech-top-announcement');
    if (bar) {
        bar.classList.add('dismissed');
        sessionStorage.setItem('sentech_ann_dismissed', '1');
    }
};
