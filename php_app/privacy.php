<?php
/**
 * =============================================================================
 * SenTechPLUS — Politique de Confidentialité & Protection des Données
 * Conforme à la loi sénégalaise n° 2008-12 (CDP) et aux normes RGPD
 * =============================================================================
 */
require_once __DIR__ . '/config/config.php';

$pageTitle = "Politique de Confidentialité & Données Personnelles — SenTechPLUS";
$metaDescription = "Découvrez comment SenTechPLUS protège vos données personnelles, vos transactions Wave/Orange Money et vos droits conformément à la législation sénégalaise.";
$canonicalUrl = "https://www.sentechplus.com/privacy.php";

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<div class="min-h-screen bg-[#F4F7FB] py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-xs font-bold text-[#667085]" aria-label="Fil d'Ariane">
            <a href="index.php" class="hover:text-[#1677FF] transition-colors">Accueil</a>
            <span>/</span>
            <span class="text-[#182230]">Confidentialité & Données</span>
        </nav>

        <!-- Hero Header -->
        <div class="card-clean p-6 sm:p-10 bg-gradient-to-br from-white to-[#F8FBFF] space-y-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#1677FF] text-xs font-black uppercase tracking-wider">
                <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
                Protection des Données Personnelles
            </span>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#182230] tracking-tight">
                Politique de Confidentialité & Sécurité
            </h1>
            <p class="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Chez <strong>SenTechPLUS</strong>, la sécurité de vos informations personnelles et la transparence de nos traitements sont au cœur de nos engagements. Dernière mise à jour : Août 2026.
            </p>
        </div>

        <!-- Corps de la politique -->
        <div class="card-clean p-6 sm:p-10 space-y-8 text-xs sm:text-sm text-[#475467] leading-relaxed">
            
            <!-- 1. Responsable de Traitement -->
            <section class="space-y-3">
                <h2 class="text-base sm:text-lg font-black text-[#182230] flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-black">1</span>
                    Responsable du Traitement des Données
                </h2>
                <p>
                    Les données collectées sur la plateforme <strong>SenTechPLUS</strong> sont traitées par la société <em>SenTech Solutions SARL</em>, immatriculée au RCCM de Dakar sous le numéro SN-DKR-2026-B-14892, ayant son siège social à Dakar, Sénégal.
                </p>
            </section>

            <!-- 2. Données Collectées -->
            <section class="space-y-3 pt-4 border-t border-[#E8EDF3]">
                <h2 class="text-base sm:text-lg font-black text-[#182230] flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-black">2</span>
                    Données Personnelles Collectées
                </h2>
                <p>Nous collectons uniquement les données strictement nécessaires au bon déroulement de vos achats et livraisons :</p>
                <ul class="list-disc pl-5 space-y-1 text-xs">
                    <li><strong>Identité & Contact :</strong> Nom, prénom, adresse email, numéro de téléphone (utilisé par le livreur à Dakar).</li>
                    <li><strong>Informations de Livraison :</strong> Ville, quartier, commune, point de repère et instructions d'accès.</li>
                    <li><strong>Données de Transaction :</strong> Numéro de référence de commande, montant et mode de règlement choisi (Wave, Orange Money, Carte Bancaire, Paiement à la livraison). <em>Note : Aucune coordonnée bancaire secrète n'est stockée sur nos serveurs.</em></li>
                    <li><strong>Données Techniques :</strong> Adresse IP (pour la protection anti-fraude et le rate limiting), type de navigateur et identifiants de session sécurisés.</li>
                </ul>
            </section>

            <!-- 3. Finalités du Traitement -->
            <section class="space-y-3 pt-4 border-t border-[#E8EDF3]">
                <h2 class="text-base sm:text-lg font-black text-[#182230] flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-black">3</span>
                    Finalités & Utilisation des Données
                </h2>
                <p>Vos informations sont utilisées exclusivement pour :</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div class="p-3 bg-[#F8FBFF] rounded-xl border border-[#E8EDF3] space-y-1">
                        <span class="font-bold text-[#182230] block">🚚 Gestion des Commandes</span>
                        <p class="text-xs">Préparation, emballage et acheminement express en 2h chrono à Dakar.</p>
                    </div>
                    <div class="p-3 bg-[#F8FBFF] rounded-xl border border-[#E8EDF3] space-y-1">
                        <span class="font-bold text-[#182230] block">🔒 Sécurité & Anti-Fraude</span>
                        <p class="text-xs">Prévention des tentatives de piratage et des attaques par force brute.</p>
                    </div>
                    <div class="p-3 bg-[#F8FBFF] rounded-xl border border-[#E8EDF3] space-y-1">
                        <span class="font-bold text-[#182230] block">💬 Service Client 7j/7</span>
                        <p class="text-xs">Assistance après-vente, gestion des garanties constructeur et retours.</p>
                    </div>
                    <div class="p-3 bg-[#F8FBFF] rounded-xl border border-[#E8EDF3] space-y-1">
                        <span class="font-bold text-[#182230] block">📢 Notifications Importantes</span>
                        <p class="text-xs">Mise à jour du statut de votre colis et facturation électronique.</p>
                    </div>
                </div>
            </section>

            <!-- 4. Durée de Conservation & Sécurité -->
            <section class="space-y-3 pt-4 border-t border-[#E8EDF3]">
                <h2 class="text-base sm:text-lg font-black text-[#182230] flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-black">4</span>
                    Durée de Conservation & Mesures de Sécurité
                </h2>
                <p>
                    Vos données de commande sont conservées pendant la durée légale applicable au Sénégal. Nos serveurs intègrent un chiffrement SSL/TLS de bout en bout (HTTPS), des mots de passe hashés avec des algorithmes modernes, et une isolation étanche des bases de données.
                </p>
            </section>

            <!-- 5. Vos Droits & Contact -->
            <section class="space-y-3 pt-4 border-t border-[#E8EDF3]">
                <h2 class="text-base sm:text-lg font-black text-[#182230] flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs font-black">5</span>
                    Vos Droits (Accès, Modification, Suppression)
                </h2>
                <p>
                    Conformément à la réglementation sur la protection des données à caractère personnel, vous disposez d'un droit permanent d'accès, de rectification, de portabilité et de suppression de l'ensemble de vos données.
                </p>
                <div class="p-4 bg-[#EEF4FB] rounded-2xl border border-[#DCE4EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                        <span class="font-black text-[#182230] block">Délégué à la Protection des Données (DPO)</span>
                        <span class="text-[#667085]">Email : <strong>privacy@sentechplus.com</strong> | Tél : <strong>+221 33 800 00 00</strong></span>
                    </div>
                    <a href="contact.php" class="btn-electric py-2.5 px-4 font-bold text-xs inline-flex items-center gap-1.5 shrink-0">
                        <i data-lucide="mail" class="w-3.5 h-3.5"></i>
                        <span>Exercer mes droits</span>
                    </a>
                </div>
            </section>

        </div>

    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
