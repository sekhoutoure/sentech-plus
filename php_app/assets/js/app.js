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
    const ov = document.getElementById('mobile-search-overlay');
    if (ov) {
        ov.classList.remove('hidden');
        ov.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: ov, skipHidden: false });
        }
        setTimeout(() => document.getElementById('overlay-search-input')?.focus(), 80);
    }
}

function closeMobileSearch() {
    const ov = document.getElementById('mobile-search-overlay');
    if (ov) {
        ov.classList.add('hidden');
        ov.classList.remove('flex');
        document.body.style.overflow = '';
    }
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

        // Intercept Cart Additions
        if (form.action.includes('cart.php')) {
            const formData = new FormData(form);
            const action = formData.get('action');
            if (action === 'add') {
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
                        document.querySelectorAll('.cart-count-badge, #cart-drawer-count').forEach(badge => {
                            badge.textContent = data.cart_count;
                            badge.classList.remove('animate-badge-pop');
                            void badge.offsetWidth; // Trigger reflow for animation restart
                            badge.classList.add('animate-badge-pop');
                        });

                        // Rich Toast with View Cart Action
                        showToast(data.message || 'Produit ajouté à votre panier !', 'success', {
                            text: 'Voir le panier →',
                            onClick: () => {
                                toggleCartDrawer(true);
                            }
                        });
                        closeQuickViewModal();
                    } else {
                        showToast(data.message || 'Erreur lors de l\'ajout au panier', 'error');
                    }
                })
                .catch(() => {
                    form.submit();
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.innerHTML = origHtml;
                    }
                });
            }
        }
    });

    // ─── 7. Ultra-Fast Search Autocomplete & Voice Search Engine ─────────────────
    const searchInputs = document.querySelectorAll('input[name="search"], input[name="q"]');
    searchInputs.forEach(input => {
        const parentForm = input.closest('form');
        if (!parentForm) return;
        
        let dropdown = null;
        let debounceTimer = null;
        let activeIndex = -1;

        const getDropdown = () => {
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.className = 'absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E8EDF3] shadow-2xl p-2 z-50 hidden text-left space-y-1 max-h-[380px] overflow-y-auto';
                parentForm.appendChild(dropdown);
            }
            return dropdown;
        };

        const renderSuggestions = () => {
            const dd = getDropdown();
            dd.innerHTML = `
                <div class="p-2.5 pb-1 text-[11px] font-bold text-[#667085] uppercase tracking-wider">Recherches Populaires à Dakar 🔥</div>
                <div class="flex flex-wrap gap-1.5 p-2 pt-0">
                    <a href="search.php?q=Casque" class="px-2.5 py-1 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">🎧 Casques Pro</a>
                    <a href="search.php?q=Écouteurs" class="px-2.5 py-1 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">🎵 Écouteurs Bass</a>
                    <a href="search.php?q=Montre" class="px-2.5 py-1 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">⌚ Montres AMOLED</a>
                    <a href="search.php?q=Chargeur" class="px-2.5 py-1 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">⚡ Chargeurs GaN</a>
                    <a href="search.php?q=Enceinte" class="px-2.5 py-1 rounded-full bg-[#F3F7FC] hover:bg-[#1677FF] hover:text-white text-xs font-bold text-[#182230] transition-colors">🔊 Enceintes Bluetooth</a>
                </div>
            `;
            dd.classList.remove('hidden');
        };

        input.addEventListener('focus', function() {
            if (input.value.trim().length === 0) {
                renderSuggestions();
            }
        });

        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            const dd = getDropdown();
            activeIndex = -1;
            
            if (query.length < 1) {
                renderSuggestions();
                return;
            }

            debounceTimer = setTimeout(() => {
                fetch('api-search.php?q=' + encodeURIComponent(query))
                    .then(res => res.json())
                    .then(data => {
                        if (!data || data.length === 0) {
                            dd.innerHTML = `
                                <div class="p-4 text-xs text-[#667085] text-center space-y-1">
                                    <p class="font-bold text-[#182230]">Aucun résultat pour "${query}"</p>
                                    <p class="text-[11px]">Essayez avec un autre mot-clé ou consultez <a href="shop.php" class="text-[#1677FF] underline font-bold">tous nos produits</a>.</p>
                                </div>
                            `;
                        } else {
                            let html = `<div class="p-1.5 text-[10px] font-extrabold text-[#667085] uppercase tracking-wider">Produits Suggérés (${data.length})</div>`;
                            data.forEach((item, idx) => {
                                html += `
                                    <a href="product.php?id=${encodeURIComponent(item.id)}" data-index="${idx}" class="search-result-item flex items-center gap-3 p-2 hover:bg-[#EAF3FF] rounded-xl transition-colors group">
                                        <div class="w-10 h-10 rounded-lg bg-[#F3F7FC] p-1 border border-[#E8EDF3] flex items-center justify-center shrink-0">
                                            <img src="${item.image}" width="36" height="36" loading="lazy" class="max-w-full max-h-full object-contain" alt="${item.name}">
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-xs font-bold text-[#182230] group-hover:text-[#0B54C2] truncate">${item.name}</p>
                                            <span class="text-[10px] font-bold text-[#0D7D53] bg-[#0D7D53]/10 px-1.5 py-0.5 rounded-full">${item.category}</span>
                                        </div>
                                        <span class="text-xs font-black text-[#182230] shrink-0">${item.formatted_price}</span>
                                    </a>
                                `;
                            });
                            html += `
                                <div class="pt-2 mt-1 border-t border-[#E8EDF3]">
                                    <a href="search.php?q=${encodeURIComponent(query)}" class="block text-center py-2 text-xs font-extrabold text-[#1677FF] hover:text-[#0B54C2] hover:bg-[#EAF3FF] rounded-xl transition-all">
                                        Voir tous les résultats pour "${query}" →
                                    </a>
                                </div>
                            `;
                            dd.innerHTML = html;
                        }
                        dd.classList.remove('hidden');
                    })
                    .catch(() => {
                        dd.classList.add('hidden');
                    });
            }, 180);
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
                    it.classList.add('bg-[#EAF3FF]', 'ring-1', 'ring-[#1677FF]');
                    it.scrollIntoView({ block: 'nearest' });
                } else {
                    it.classList.remove('bg-[#EAF3FF]', 'ring-1', 'ring-[#1677FF]');
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
                if (e.target.closest('button, a, input, select, textarea, form')) return;
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

// ─── 7. Service Worker Registration & PWA Sync ──────────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.getRegistrations().then((regs) => {
            for (let r of regs) {
                if (r.active && !r.active.scriptURL.includes('v=2.0')) {
                    r.unregister();
                }
            }
            navigator.serviceWorker.register('sw.js?v=3.2').then((reg) => {
                if (reg) reg.update();
            }).catch(() => {});
        }).catch(() => {
            navigator.serviceWorker.register('sw.js?v=3.2').catch(() => {});
        });
    });
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


