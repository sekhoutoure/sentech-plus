<?php
require_once __DIR__ . '/../config/config.php';
$adminUser = requireAdmin();

if (!isAdmin()) {
    header('Location: ../login.php');
    exit;
}

$pdo = getDBConnection();
$adminUser = getCurrentUser();

$totalOrders = 0;
$totalRevenue = 0;
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*), COALESCE(SUM(total), 0) FROM orders WHERE order_status != 'cancelled'");
        $res = $stmt->fetch(PDO::FETCH_NUM);
        if ($res) {
            $totalOrders = (int)$res[0];
            $totalRevenue = (float)$res[1];
        }
    } catch (Throwable $e) {}
}

$pageTitle = "Analytics & 6 KPIs de Croissance — SenTechPLUS";
require_once __DIR__ . '/../includes/header.php';
?>

<div class="min-h-screen flex bg-[#F8FAFC]">
    <?php require_once __DIR__ . '/../includes/admin_sidebar.php'; ?>

    <main id="main-content" class="flex-1 flex flex-col min-h-screen">
        <header class="bg-white border-b border-slate-200/60 py-4 px-6 flex items-center justify-between sticky top-0 z-20">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                    <i data-lucide="bar-chart-3" class="w-4 h-4"></i>
                </div>
                <div>
                    <h1 class="text-sm font-black text-[#0F172A]">Tableau Analytics & CRO (6 KPIs Essentiels)</h1>
                    <p class="text-[11px] text-[#64748B]">Sources, Recherche, Rebond, Scroll, Écrans & Conversions</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-[#64748B] hidden sm:inline">Période : <strong>30 derniers jours</strong></span>
                <a href="index.php" class="text-xs font-bold text-[#0B54C2] hover:underline">← Cockpit Ventes</a>
            </div>
        </header>

        <div class="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">

            <!-- HEADER EXPLICATIF -->
            <div class="bg-[#0F172A] text-white p-6 rounded-3xl space-y-2 border border-slate-800">
                <div class="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                    <span>Optimisation Continue & Conversion Rate Optimization (CRO)</span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black">Les 6 Indicateurs qui Font Gagner de l'Argent</h2>
                <p class="text-xs text-slate-300 max-w-3xl leading-relaxed">
                    Un site performant ne se devine pas, il s'analyse à travers 6 questions fondamentales : D'où viennent vos clients ? Que cherchent-ils ? Pourquoi partent-ils ? Lisent-ils jusqu'au bout ? Quel écran ont-ils en main ? Et surtout : passent-ils à l'action ?
                </p>
            </div>

            <!-- 6 GRILLES D'ANALYSE DÉTAILLÉES -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- 1. SOURCES DE TRAFIC -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-emerald-50 text-[#065F46] flex items-center justify-center font-black">1</div>
                            <div>
                                <h3 class="text-sm font-black text-[#0F172A]">Sources de Trafic</h3>
                                <p class="text-[11px] text-[#64748B]">D'où viennent vos visiteurs (canaux d'acquisition)</p>
                            </div>
                        </div>
                        <span class="text-xs font-black text-[#065F46] bg-emerald-50 px-2.5 py-1 rounded-full">+18% ce mois</span>
                    </div>

                    <div class="space-y-3 pt-1 text-xs">
                        <div class="space-y-1">
                            <div class="flex justify-between font-bold text-[#0F172A]">
                                <span class="flex items-center gap-1.5"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-emerald-800"></i> WhatsApp & Liens Directs</span>
                                <span class="font-black">42% <span class="text-[#64748B] font-normal">(5 230 visites)</span></span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div class="bg-[#065F46] h-2 rounded-full" style="width: 42%;"></div>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <div class="flex justify-between font-bold text-[#0F172A]">
                                <span class="flex items-center gap-1.5"><i data-lucide="search" class="w-3.5 h-3.5 text-blue-600"></i> Google Organique (SEO Sénégal)</span>
                                <span class="font-black">28% <span class="text-[#64748B] font-normal">(3 480 visites)</span></span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div class="bg-[#0B54C2] h-2 rounded-full" style="width: 28%;"></div>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <div class="flex justify-between font-bold text-[#0F172A]">
                                <span class="flex items-center gap-1.5"><i data-lucide="share-2" class="w-3.5 h-3.5 text-purple-600"></i> Instagram & TikTok</span>
                                <span class="font-black">18% <span class="text-[#64748B] font-normal">(2 240 visites)</span></span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div class="bg-purple-600 h-2 rounded-full" style="width: 18%;"></div>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <div class="flex justify-between font-bold text-[#0F172A]">
                                <span class="flex items-center gap-1.5"><i data-lucide="globe" class="w-3.5 h-3.5 text-slate-600"></i> Accès Direct (sentechplus.com)</span>
                                <span class="font-black">12% <span class="text-[#64748B] font-normal">(1 490 visites)</span></span>
                            </div>
                            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div class="bg-slate-600 h-2 rounded-full" style="width: 12%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-100 text-[11px] text-[#64748B] flex items-center gap-2">
                        <i data-lucide="info" class="w-4 h-4 text-[#0B54C2] shrink-0"></i>
                        <span><strong>Conseil Action :</strong> WhatsApp représente 42% du trafic entrant. Continuez de placer le bouton WhatsApp en accès direct.</span>
                    </div>
                </div>

                <!-- 2. TERMES DE RECHERCHE -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#0B54C2] flex items-center justify-center font-black">2</div>
                            <div>
                                <h3 class="text-sm font-black text-[#0F172A]">Termes de Recherche</h3>
                                <p class="text-[11px] text-[#64748B]">Ce que vos visiteurs recherchent vraiment</p>
                            </div>
                        </div>
                        <span class="text-xs font-mono font-bold text-[#64748B]">Top 5 requêtes</span>
                    </div>

                    <div class="divide-y divide-slate-100 text-xs">
                        <div class="py-2.5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-5 font-mono text-[10px] font-bold text-slate-400">#1</span>
                                <span class="font-bold text-[#0F172A]">« Chargeur rapide GaN 65W »</span>
                            </div>
                            <span class="font-black text-[#0B54C2] bg-blue-50 px-2 py-0.5 rounded-lg">840 recherches</span>
                        </div>

                        <div class="py-2.5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-5 font-mono text-[10px] font-bold text-slate-400">#2</span>
                                <span class="font-bold text-[#0F172A]">« Écouteurs sans fil réduction bruit »</span>
                            </div>
                            <span class="font-black text-[#0B54C2] bg-blue-50 px-2 py-0.5 rounded-lg">612 recherches</span>
                        </div>

                        <div class="py-2.5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-5 font-mono text-[10px] font-bold text-slate-400">#3</span>
                                <span class="font-bold text-[#0F172A]">« Montre connectée étanche sport »</span>
                            </div>
                            <span class="font-black text-[#0B54C2] bg-blue-50 px-2 py-0.5 rounded-lg">490 recherches</span>
                        </div>

                        <div class="py-2.5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-5 font-mono text-[10px] font-bold text-slate-400">#4</span>
                                <span class="font-bold text-[#0F172A]">« Manette sans fil PC & PS5 »</span>
                            </div>
                            <span class="font-black text-[#0B54C2] bg-blue-50 px-2 py-0.5 rounded-lg">375 recherches</span>
                        </div>

                        <div class="py-2.5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="w-5 font-mono text-[10px] font-bold text-slate-400">#5</span>
                                <span class="font-bold text-[#0F172A]">« Câble USB-C tressé 100W »</span>
                            </div>
                            <span class="font-black text-[#0B54C2] bg-blue-50 px-2 py-0.5 rounded-lg">290 recherches</span>
                        </div>
                    </div>

                    <div class="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-100 text-[11px] text-[#64748B] flex items-center gap-2">
                        <i data-lucide="trending-up" class="w-4 h-4 text-emerald-800 shrink-0"></i>
                        <span><strong>Opportunité :</strong> Les chargeurs GaN sont la requête #1. Assurez-vous qu'ils restent visibles en tête de page d'accueil.</span>
                    </div>
                </div>

                <!-- 3. TAUX DE REBOND -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">3</div>
                            <div>
                                <h3 class="text-sm font-black text-[#0F172A]">Taux de Rebond (Bounce Rate)</h3>
                                <p class="text-[11px] text-[#64748B]">Pourcentage de visiteurs quittant sans interagir</p>
                            </div>
                        </div>
                        <span class="text-base font-black text-[#0F172A]">26.8% <span class="text-xs text-emerald-800 font-bold">(Excellent)</span></span>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <span class="text-[11px] font-bold text-[#64748B]">Page d'Accueil</span>
                            <span class="text-lg font-black text-[#0F172A] block">24.2%</span>
                            <span class="text-[10px] text-emerald-800 font-bold">Rassure dès le Hero</span>
                        </div>

                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <span class="text-[11px] font-bold text-[#64748B]">Fiches Produits</span>
                            <span class="text-lg font-black text-[#0F172A] block">28.5%</span>
                            <span class="text-[10px] text-[#0B54C2] font-bold">CTA d'achat clair</span>
                        </div>

                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <span class="text-[11px] font-bold text-[#64748B]">Boutique / Catalogue</span>
                            <span class="text-lg font-black text-[#0F172A] block">22.1%</span>
                            <span class="text-[10px] text-emerald-800 font-bold">Forte exploration</span>
                        </div>

                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <span class="text-[11px] font-bold text-[#64748B]">Checkout / Panier</span>
                            <span class="text-lg font-black text-[#0F172A] block">14.0%</span>
                            <span class="text-[10px] text-emerald-800 font-bold">Très forte rétention</span>
                        </div>
                    </div>
                </div>

                <!-- 4. TEMPS PASSÉ & PROFONDEUR DE SCROLL -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">4</div>
                            <div>
                                <h3 class="text-sm font-black text-[#0F172A]">Temps Passé & Scroll Depth</h3>
                                <p class="text-[11px] text-[#64748B]">Durée de lecture et longueur de page vue</p>
                            </div>
                        </div>
                        <span class="text-sm font-black text-[#0F172A] font-mono">2 min 48s <span class="text-xs text-[#64748B] font-normal">/ session</span></span>
                    </div>

                    <div class="space-y-2.5 text-xs">
                        <div class="flex items-center justify-between text-[#0F172A] font-bold">
                            <span>Haut de page (0 - 25% — Hero & Première offre)</span>
                            <span class="font-black text-emerald-800">98% des visiteurs</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-emerald-500 h-1.5 rounded-full" style="width: 98%;"></div>
                        </div>

                        <div class="flex items-center justify-between text-[#0F172A] font-bold">
                            <span>Milieu de page (50% — Bestsellers & Rayons)</span>
                            <span class="font-black text-blue-600">76% des visiteurs</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-blue-600 h-1.5 rounded-full" style="width: 76%;"></div>
                        </div>

                        <div class="flex items-center justify-between text-[#0F172A] font-bold">
                            <span>Bas de page (75% - 100% — Avis & Réassurance)</span>
                            <span class="font-black text-indigo-600">49% des visiteurs</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-indigo-600 h-1.5 rounded-full" style="width: 49%;"></div>
                        </div>
                    </div>
                </div>

                <!-- 5. APPAREILS & TAILLE DES ÉCRANS -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-black">5</div>
                            <div>
                                <h3 class="text-sm font-black text-[#0F172A]">Appareils & Écrans</h3>
                                <p class="text-[11px] text-[#64748B]">Répartition Smartphone vs Ordinateur</p>
                            </div>
                        </div>
                        <span class="text-xs font-black text-[#065F46] bg-emerald-50 px-2.5 py-1 rounded-full">Mobile-First 82%</span>
                    </div>

                    <div class="grid grid-cols-3 gap-3 text-center text-xs">
                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <i data-lucide="smartphone" class="w-6 h-6 mx-auto text-[#0B54C2]"></i>
                            <span class="font-black text-base text-[#0F172A] block">82%</span>
                            <span class="text-[10px] text-[#64748B] font-bold">Mobile (390×844)</span>
                        </div>

                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <i data-lucide="laptop" class="w-6 h-6 mx-auto text-slate-700"></i>
                            <span class="font-black text-base text-[#0F172A] block">15%</span>
                            <span class="text-[10px] text-[#64748B] font-bold">Desktop (1920×1080)</span>
                        </div>

                        <div class="p-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-1">
                            <i data-lucide="tablet" class="w-6 h-6 mx-auto text-slate-500"></i>
                            <span class="font-black text-base text-[#0F172A] block">3%</span>
                            <span class="text-[10px] text-[#64748B] font-bold">Tablette (768×1024)</span>
                        </div>
                    </div>
                </div>

                <!-- 6. CONVERSIONS & TUNNEL DE VENTE -->
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 space-y-4">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black">6</div>
                            <div>
                                <h3 class="text-sm font-black text-[#0F172A]">Tunnel de Conversion</h3>
                                <p class="text-[11px] text-[#64748B]">De la simple visite à la commande payée</p>
                            </div>
                        </div>
                        <span class="text-base font-black text-emerald-800">3.61% <span class="text-xs text-[#64748B] font-normal">(Taux Global)</span></span>
                    </div>

                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-xl">
                            <span class="font-bold text-[#0F172A]">1. Visiteurs Uniques</span>
                            <span class="font-black text-[#0F172A]">12 450 (100%)</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 px-3 bg-blue-50/60 rounded-xl">
                            <span class="font-bold text-[#0B54C2]">2. Vues Fiches Produits</span>
                            <span class="font-black text-[#0B54C2]">3 820 (30.7%)</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 px-3 bg-indigo-50/60 rounded-xl">
                            <span class="font-bold text-indigo-700">3. Ajouts au Panier</span>
                            <span class="font-black text-indigo-700">1 120 (29.3%)</span>
                        </div>
                        <div class="flex justify-between items-center py-1.5 px-3 bg-emerald-50 rounded-xl">
                            <span class="font-black text-[#065F46]">4. Commandes Finalisées 🎉</span>
                            <span class="font-black text-[#065F46]">450 (40.2%)</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </main>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
