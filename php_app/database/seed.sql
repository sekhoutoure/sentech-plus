-- =============================================================================
-- SenTechPLUS — Données de Départ Professionnelles & Catalogue Réaliste
-- Fichier : database/seed.sql
-- Importation : phpMyAdmin -> Importer -> Sélectionner database/seed.sql
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── 1. UTILISATEURS & BOUTIQUE OFFICIELLE ───────────────────────────────────

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `image`) VALUES
('usr_admin_1', 'Administrateur SenTechPLUS', 'admin@sentechplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'assets/images/profile_pic1.webp'),
('usr_seller_1', 'SenTech Official Store', 'store@sentechplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'seller', 'assets/images/profile_pic2.webp'),
('usr_client_1', 'Moussa Diallo', 'client@sentechplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'assets/images/profile_pic3.webp')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `role`=VALUES(`role`);

INSERT INTO `stores` (`id`, `user_id`, `name`, `description`, `username`, `address`, `status`, `is_active`, `logo`, `email`, `contact`) VALUES
('store_sentech_main', 'usr_seller_1', 'SenTechPLUS Official', 'Boutique officielle certifiée spécialisée dans les équipements et accessoires high-tech originaux à Dakar.', 'sentech-official', 'Sacré-Cœur 3 / VDN, Dakar, Sénégal', 'approved', 1, 'assets/images/sentech_logo.webp', 'contact@sentechplus.com', '+221 78 131 64 97')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `status`=VALUES(`status`), `is_active`=1;

-- ─── 2. CATÉGORIES PRINCIPALES (8) & SOUS-CATÉGORIES (26) ───────────────────

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `parent_id`, `display_order`, `is_active`, `is_featured`) VALUES
-- 8 Catégories Principales
('cat_telephones', 'Téléphones & Accessoires', 'telephones-accessoires', 'Coques, chargeurs rapides, câbles renforcés et supports voiture.', 'smartphone', NULL, 1, 1, 1),
('cat_audio', 'Audio & Écouteurs', 'audio-ecouteurs', 'Écouteurs sans fil ANC, casques studio et enceintes Bluetooth haute fidélité.', 'headphones', NULL, 2, 1, 1),
('cat_montres', 'Montres & Objets Connectés', 'montres-objets-connectes', 'Montres intelligentes, bracelets sport et traqueurs d''activité.', 'watch', NULL, 3, 1, 1),
('cat_informatique', 'Informatique & Bureau', 'informatique-bureau', 'Souris ergonomiques, claviers sans fil, hubs USB-C et supports laptop.', 'laptop', NULL, 4, 1, 1),
('cat_gaming', 'Gaming & Jeux Vidéo', 'gaming-jeux-video', 'Casques surround 7.1, souris RGB ultra-réactives et accessoires gamer.', 'gamepad-2', NULL, 5, 1, 1),
('cat_energie', 'Maison & Énergie', 'maison-energie', 'Batteries externes solaires, lampes LED d''ambiance et prises intelligentes.', 'zap', NULL, 6, 1, 1),
('cat_securite', 'Sécurité & Caméras', 'securite-cameras', 'Caméras de surveillance Wi-Fi, baby monitors et systèmes d''alerte.', 'shield-check', NULL, 7, 1, 1),
('cat_promos', 'Promos & Bons Plans', 'promos-bons-plans', 'Ventes flash et remises exceptionnelles jusqu''à -40% sur le high-tech.', 'tag', NULL, 8, 1, 1),

-- Sous-catégories Téléphones
('sub_supports', 'Supports Voiture & Bureau', 'supports-voiture-bureau', 'Supports magnétiques MagSafe et pinces grille aération.', 'smartphone', 'cat_telephones', 1, 1, 0),
('sub_chargeurs', 'Chargeurs & Câbles', 'chargeurs-cables', 'Chargeurs GaN rapides et câbles tressés 100W.', 'zap', 'cat_telephones', 2, 1, 0),
('sub_powerbanks', 'Batteries Externes', 'batteries-externes', 'Power banks haute capacité 10000mAh à 30000mAh.', 'battery-charging', 'cat_telephones', 3, 1, 0),
('sub_protections', 'Coques & Verres Trempés', 'coques-verres-trempes', 'Protection intégrale anti-chocs et anti-rayures.', 'shield', 'cat_telephones', 4, 1, 0),

-- Sous-catégories Audio
('sub_ecouteurs', 'Écouteurs Sans Fil (TWS)', 'ecouteurs-sans-fil-tws', 'True wireless avec réduction active du bruit.', 'headphones', 'cat_audio', 1, 1, 0),
('sub_casques', 'Casques Audio Bluetooth', 'casques-audio-bluetooth', 'Casques arceau supra et circum-auriculaires.', 'headphones', 'cat_audio', 2, 1, 0),
('sub_enceintes', 'Enceintes Portables', 'enceintes-portables', 'Enceintes Bluetooth étanches et nomades.', 'volume-2', 'cat_audio', 3, 1, 0),

-- Sous-catégories Montres
('sub_smartwatches', 'Montres Connectées Sport', 'montres-connectees-sport', 'Suivi cardiaque, GPS et autonomie longue durée.', 'watch', 'cat_montres', 1, 1, 0),
('sub_bracelets', 'Bracelets Connectés', 'bracelets-connectes', 'Compteurs de pas légers et étanches.', 'activity', 'cat_montres', 2, 1, 0),
('sub_accessoires_montres', 'Accessoires Montres', 'accessoires-montres', 'Bracelets en silicone, cuir et chargeurs magnétiques.', 'watch', 'cat_montres', 3, 1, 0),

-- Sous-catégories Informatique
('sub_souris_clavier', 'Souris & Claviers Sans Fil', 'souris-claviers-sans-fil', 'Périphériques bureautiques silencieux et ergonomiques.', 'mouse', 'cat_informatique', 1, 1, 0),
('sub_hubs_adaptateurs', 'Hubs & Adaptateurs USB-C', 'hubs-adaptateurs-usb-c', 'Stations d''accueil HDMI 4K, ports SD et Ethernet.', 'cpu', 'cat_informatique', 2, 1, 0),
('sub_supports_pc', 'Supports Laptop & Ergonomie', 'supports-laptop-ergonomie', 'Rehausseurs ventilés en aluminium.', 'monitor', 'cat_informatique', 3, 1, 0),
('sub_webcams', 'Webcams & Ring Lights', 'webcams-ring-lights', 'Caméras Full HD et éclairages pour visio et streaming.', 'video', 'cat_informatique', 4, 1, 0),

-- Sous-catégories Gaming
('sub_souris_gaming', 'Souris Gaming RGB', 'souris-gaming-rgb', 'Capteurs optiques haute précision et rétroéclairage.', 'mouse-pointer', 'cat_gaming', 1, 1, 0),
('sub_casques_gaming', 'Casques Gaming Surround', 'casques-gaming-surround', 'Immersion sonore spatiale et micro anti-bruit.', 'headphones', 'cat_gaming', 2, 1, 0),

-- Sous-catégories Maison & Énergie
('sub_eclairage', 'Lampes & Éclairage LED', 'lampes-eclairage-led', 'Rubans LED et veilleuses d''ambiance intelligentes.', 'sun', 'cat_energie', 1, 1, 0),
('sub_domotique', 'Prises & Domotique Wi-Fi', 'prises-domotique-wifi', 'Prises programmables et contrôle à distance.', 'wifi', 'cat_energie', 2, 1, 0),

-- Sous-catégories Sécurité
('sub_cameras_interieur', 'Caméras Intérieures Wi-Fi', 'cameras-interieures-wifi', 'Surveillance 1080p avec vision nocturne et détection.', 'camera', 'cat_securite', 1, 1, 0),
('sub_cameras_bebe', 'Babyphones & Caméras Bébé', 'babyphones-cameras-bebe', 'Audio bidirectionnel et capteur de température.', 'eye', 'cat_securite', 2, 1, 0)

ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `parent_id`=VALUES(`parent_id`), `is_active`=1;

-- ─── 3. COLLECTIONS MARKETING ────────────────────────────────────────────────

INSERT INTO `collections` (`id`, `title`, `slug`, `description`, `is_active`) VALUES
('col_bestsellers', 'Meilleures Ventes', 'meilleures-ventes', 'Les produits les plus plébiscités par nos clients au Sénégal.', 1),
('col_new', 'Dernières Arrivées', 'nouveautes', 'Les nouveautés technologiques tout juste arrivées en stock à Dakar.', 1),
('col_flash', 'Ventes Flash', 'flash-sale', 'Offres limitées dans le temps avec réductions immédiates.', 1),
('col_express', 'Livraison Express 2h', 'livraison-express', 'Disponibles immédiatement pour livraison express à Dakar.', 1),
('col_under_10k', 'Moins de 10 000 FCFA', 'petits-prix-10k', 'Accessoires essentiels à prix très doux.', 1),
('col_under_25k', 'Moins de 25 000 FCFA', 'budget-25k', 'Équipements haute performance à prix accessible.', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `is_active`=1;

-- ─── 4. CATALOGUE DES 26 PRODUITS RÉALISTES ─────────────────────────────────

INSERT INTO `products` 
(`id`, `store_id`, `category_id`, `subcategory_id`, `category`, `subcategory`, `brand`, `name`, `slug`, `description`, `mrp`, `price`, `discount_percent`, `images`, `in_stock`, `stock`, `sales_count`, `is_active`, `is_featured`, `is_new`, `is_flash_sale`, `is_express_delivery`, `connection_type`, `compatibility`, `color`, `rating`, `review_count`) 
VALUES

-- 1. Téléphones & Accessoires
('prod_magsafe_car', 'store_sentech_main', 'cat_telephones', 'sub_supports', 'Téléphones & Accessoires', 'Supports Voiture & Bureau', 'Baseus', 'Support Smartphone Voiture MagSafe 15W', 'support-smartphone-voiture-magsafe', 'Support magnétique ultra-puissant pour grille d''aération. Compatible MagSafe iPhone et smartphones avec anneau magnétique. Rotation 360° fluide et maintien sécurisé sur les routes de Dakar.', 16000.00, 12500.00, 22, '["assets/images/product_img1.webp", "assets/images/product_img2.webp"]', 1, 24, 85, 1, 1, 0, 1, 1, 'Magnétique / Sans fil', 'iPhone 12 à 16, Android avec coque MagSafe', 'Noir Mat', 4.9, 18),

('prod_charger_gan65w', 'store_sentech_main', 'cat_telephones', 'sub_chargeurs', 'Téléphones & Accessoires', 'Chargeurs & Câbles', 'Anker', 'Chargeur Rapide 65W GaN Dual USB-C', 'chargeur-rapide-65w-gan-dual-usbc', 'Chargeur ultra-compact technologie Gallium Nitride (GaN). Permet de recharger simultanément un ordinateur portable (MacBook, Dell) et un smartphone à pleine vitesse.', 28000.00, 22000.00, 21, '["assets/images/product_img7.webp", "assets/images/product_img1.webp"]', 1, 35, 140, 1, 1, 1, 1, 1, 'USB-C / GaN', 'MacBook, iPhone, Samsung Galaxy, iPad, PC USB-C', 'Blanc Titane', 5.0, 32),

('prod_charger_20w_apple', 'store_sentech_main', 'cat_telephones', 'sub_chargeurs', 'Téléphones & Accessoires', 'Chargeurs & Câbles', 'Apple', 'Adaptateur Secteur 20W USB-C Original', 'adaptateur-secteur-20w-usbc-original', 'Bloc de charge rapide 20W certifié Apple. Recharge 50% de batterie en seulement 30 minutes sur tous les iPhone récents.', 15000.00, 11500.00, 23, '["assets/images/product_img7.webp"]', 1, 40, 210, 1, 1, 0, 0, 1, 'USB-C', 'iPhone 8 à iPhone 16 Pro Max, iPad Pro', 'Blanc', 4.8, 45),

('prod_cable_usbc_100w', 'store_sentech_main', 'cat_telephones', 'sub_chargeurs', 'Téléphones & Accessoires', 'Chargeurs & Câbles', 'Baseus', 'Câble USB-C vers USB-C Renforcé 100W 2M', 'cable-usbc-renforce-100w-2m', 'Câble blindé tressé en nylon avec affichage digital LED de la puissance en temps réel. Supporte le transfert de données et la charge ultra-rapide jusqu''à 100W.', 9000.00, 6500.00, 28, '["assets/images/product_img1.webp"]', 1, 50, 95, 1, 0, 0, 1, 1, 'USB-C Filaire', 'Tous appareils avec port USB-C', 'Gris Sidéral', 4.9, 14),

('prod_powerbank_20k', 'store_sentech_main', 'cat_telephones', 'sub_powerbanks', 'Téléphones & Accessoires', 'Batteries Externes', 'Oraimo', 'Power Bank 20 000 mAh Fast Charge 22.5W', 'power-bank-20000mah-fast-charge-oraimo', 'Batterie externe grande capacité avec double sortie USB-A et entrée/sortie USB-C Power Delivery. Écran numérique indiquant le pourcentage précis de batterie restante.', 22000.00, 17500.00, 20, '["assets/images/product_img10.webp", "assets/images/product_img11.webp"]', 1, 18, 62, 1, 1, 0, 0, 1, 'USB-A / USB-C', 'Android, iPhone, Tablettes, Écouteurs', 'Noir Texturé', 4.7, 21),

('prod_pack_accessoires', 'store_sentech_main', 'cat_telephones', 'sub_protections', 'Téléphones & Accessoires', 'Coques & Verres Trempés', 'SenTech', 'Pack Essentiel Protection & Câble Smartphone', 'pack-essentiel-protection-cable', 'Kit complet comprenant un câble de charge rapide 60W, un verre trempé 9D haute résistance et un support de bureau pliable.', 12000.00, 8500.00, 29, '["assets/images/product_img2.webp"]', 1, 30, 48, 1, 0, 1, 0, 1, 'Filaire', 'Universel Android / iPhone', 'Noir / Transparent', 4.8, 9),

-- 2. Audio & Écouteurs
('prod_earbuds_anc_pro', 'store_sentech_main', 'cat_audio', 'sub_ecouteurs', 'Audio & Écouteurs', 'Écouteurs Sans Fil (TWS)', 'Sony', 'Écouteurs Pro ANC Sans Fil Haute Définition', 'ecouteurs-pro-anc-sans-fil-hd', 'Écouteurs true wireless avec réduction active du bruit ambiant jusqu''à -35dB. Transducteurs dynamiques 11mm pour des basses profondes et des voix cristallines. 32h d''autonomie.', 42000.00, 32500.00, 23, '["assets/images/product_img3.webp", "assets/images/product_img5.webp"]', 1, 20, 115, 1, 1, 1, 1, 1, 'Bluetooth 5.3', 'iOS, Android, Windows, Mac', 'Noir Mat', 5.0, 27),

('prod_headphones_studio', 'store_sentech_main', 'cat_audio', 'sub_casques', 'Audio & Écouteurs', 'Casques Audio Bluetooth', 'Sony', 'Casque Audio Sans Fil Studio ANC Over-Ear', 'casque-audio-sans-fil-studio-anc', 'Casque arceau supra-auriculaire avec coussinets à mémoire de forme. Réduction active de bruit, mode transparence et autonomie marathon de 50 heures. Idéal pour studio et voyages.', 58000.00, 45000.00, 22, '["assets/images/product_img4.webp", "assets/images/hero_product_img1.webp"]', 1, 15, 78, 1, 1, 0, 0, 1, 'Bluetooth 5.3 + Jack 3.5mm', 'Smartphones, PC, Consoles de jeux', 'Gris Anthracite', 4.9, 39),

('prod_speaker_smart_gray', 'store_sentech_main', 'cat_audio', 'sub_enceintes', 'Audio & Écouteurs', 'Enceintes Portables', 'JBL', 'Enceinte Bluetooth Smart Gray 20W Waterproof', 'enceinte-bluetooth-smart-gray-20w', 'Enceinte portable certifiée IPX7 résistante à l''eau et à la poussière. Son à 360° percutant et autonomie de 14h pour vos soirées et sorties plage à Dakar.', 35000.00, 27000.00, 23, '["assets/images/product_img6.webp", "assets/images/product_img12.webp"]', 1, 22, 90, 1, 1, 0, 1, 1, 'Bluetooth 5.2', 'Tous smartphones et tablettes', 'Gris Tissé', 4.8, 19),

('prod_speaker_outdoor', 'store_sentech_main', 'cat_audio', 'sub_enceintes', 'Audio & Écouteurs', 'Enceintes Portables', 'Oraimo', 'Enceinte Portable Outdoor Extra Bass 10W', 'enceinte-portable-outdoor-extra-bass', 'Enceinte compacte avec dragonne intégrée. Basses renforcées BassUp, lecteur carte TF et radio FM intégrée.', 18000.00, 13500.00, 25, '["assets/images/product_img12.webp"]', 1, 28, 54, 1, 0, 0, 0, 1, 'Bluetooth 5.0 / MicroSD', 'Android, iOS, PC', 'Noir / Rouge', 4.6, 12),

-- 3. Montres & Objets Connectés
('prod_smartwatch_sport_pro', 'store_sentech_main', 'cat_montres', 'sub_smartwatches', 'Montres & Objets Connectés', 'Montres Connectées Sport', 'Xiaomi', 'Montre Connectée Sport Pro Écran AMOLED', 'montre-connectee-sport-pro-amoled', 'Montre intelligente avec magnifique écran AMOLED 1.43 pouce Always-On. Capteur cardiaque, SpO2 oxygène sanguin, GPS multisport et réception d''appels Bluetooth en direct.', 48000.00, 38000.00, 21, '["assets/images/product_img8.webp", "assets/images/product_img13.webp"]', 1, 16, 88, 1, 1, 1, 1, 1, 'Bluetooth 5.2 / GPS', 'Android 6.0+ et iOS 11.0+', 'Noir Sport', 4.9, 31),

('prod_smartwatch_elegance', 'store_sentech_main', 'cat_montres', 'sub_smartwatches', 'Montres & Objets Connectés', 'Montres Connectées Sport', 'Xiaomi', 'Montre Connectée Élégance Boîtier Métal', 'montre-connectee-elegance-metal', 'Montre connectée au design fin et élégant avec cadran en alliage d''aluminium et bracelet en cuir végétal. Suivi du sommeil, suivi du stress et notifications WhatsApp.', 45000.00, 34500.00, 23, '["assets/images/product_img13.webp", "assets/images/product_img8.webp"]', 1, 12, 42, 1, 0, 0, 0, 1, 'Bluetooth 5.1', 'iPhone et Android', 'Argent & Cuir Brun', 4.8, 15),

-- 4. Informatique & Bureau
('prod_mouse_ergo_wireless', 'store_sentech_main', 'cat_informatique', 'sub_souris_clavier', 'Informatique & Bureau', 'Souris & Claviers Sans Fil', 'Logitech', 'Souris Ergonomique Sans Fil Silencieuse', 'souris-ergonomique-sans-fil-silencieuse', 'Conception ergonomique profilée réduisant la fatigue du poignet. Clics ultra-silencieux, molette de défilement fluide et double connectivité Bluetooth + Dongle USB 2.4GHz.', 18000.00, 14000.00, 22, '["assets/images/product_img14.webp"]', 1, 25, 76, 1, 1, 0, 1, 1, 'Bluetooth + Sans fil 2.4GHz', 'Windows, MacOS, Linux, ChromeOS', 'Noir Mat', 4.9, 23),

('prod_keyboard_bt_compact', 'store_sentech_main', 'cat_informatique', 'sub_souris_clavier', 'Informatique & Bureau', 'Souris & Claviers Sans Fil', 'Logitech', 'Clavier Bluetooth Multi-Device Compact', 'clavier-bluetooth-multidevice-compact', 'Clavier sans fil ultra-fin permettant de basculer instantanément entre 3 appareils (PC, Tablette, Smartphone). Touches douces et silencieuses.', 26000.00, 19500.00, 25, '["assets/images/product_img14.webp"]', 1, 18, 38, 1, 0, 1, 0, 1, 'Bluetooth Multi-Appareils', 'Windows, Mac, iPadOS, Android', 'Gris Clair', 4.7, 11),

('prod_stand_laptop_alu', 'store_sentech_main', 'cat_informatique', 'sub_supports_pc', 'Informatique & Bureau', 'Supports Laptop & Ergonomie', 'Baseus', 'Support Laptop Aluminium Pliable & Réglable', 'support-laptop-aluminium-pliable', 'Support pour ordinateur portable en aluminium brossé premium. 6 angles d''inclinaison pour une posture ergonomique et une meilleure dissipation thermique.', 15000.00, 11000.00, 27, '["assets/images/product_img9.webp"]', 1, 30, 92, 1, 1, 0, 0, 1, 'Mécanique réglable', 'Laptops 10 à 17 pouces, MacBook, iPad', 'Gris Sidéral', 4.9, 26),

('prod_hub_usbc_7in1', 'store_sentech_main', 'cat_informatique', 'sub_hubs_adaptateurs', 'Informatique & Bureau', 'Hubs & Adaptateurs USB-C', 'Ugreen', 'Hub Adaptateur USB-C Multiport 7-en-1 HDMI 4K', 'hub-adaptateur-usbc-7en1-hdmi4k', 'Station d''accueil compacte comprenant 1 port HDMI 4K 60Hz, 3 ports USB 3.0, 1 lecteur de carte SD/TF et 1 port de charge USB-C Power Delivery 100W.', 25000.00, 19500.00, 22, '["assets/images/product_img1.webp"]', 1, 22, 65, 1, 1, 0, 1, 1, 'USB-C vers Multi-ports', 'MacBook Pro/Air, Dell XPS, Lenovo, iPad Pro', 'Aluminium Gris', 4.8, 17),

('prod_webcam_fhd_1080p', 'store_sentech_main', 'cat_informatique', 'sub_webcams', 'Informatique & Bureau', 'Webcams & Ring Lights', 'Logitech', 'Webcam Full HD 1080p avec Micro Réducteur de Bruit', 'webcam-full-hd-1080p-micro', 'Caméra web avec lentille en verre Full HD 1080p à 30fps. Autofocus rapide, correction automatique de faible luminosité et microphone stéréo intégré.', 32000.00, 24500.00, 23, '["assets/images/product_img15.webp"]', 1, 14, 33, 1, 0, 0, 0, 1, 'USB Plug & Play', 'Zoom, Teams, Google Meet, Skype, OBS', 'Noir', 4.7, 8),

('prod_ringlight_led_desk', 'store_sentech_main', 'cat_informatique', 'sub_webcams', 'Informatique & Bureau', 'Webcams & Ring Lights', 'SenTech', 'Ring Light LED de Bureau avec Trépied Réglable', 'ring-light-led-bureau-trepied', 'Anneau lumineux LED 10 pouces avec 3 modes de couleur (chaud, neutre, froid) et 10 niveaux d''intensité. Idéal pour streaming, maquillage et visioconférences.', 16000.00, 11500.00, 28, '["assets/images/product_img9.webp"]', 1, 26, 44, 1, 0, 0, 1, 1, 'Alimentation USB', 'Smartphones et appareils photo', 'Noir', 4.8, 14),

('prod_sdcard_128gb', 'store_sentech_main', 'cat_informatique', 'sub_hubs_adaptateurs', 'Informatique & Bureau', 'Hubs & Adaptateurs USB-C', 'Samsung', 'Carte Mémoire MicroSD EVO Plus 128 Go Class 10', 'carte-memoire-microsd-128go-samsung', 'Vitesse de transfert jusqu''à 130 Mo/s. Résistante à l''eau, aux températures extrêmes et aux rayons X. Adaptateur SD inclus.', 14000.00, 9500.00, 32, '["assets/images/product_img10.webp"]', 1, 45, 120, 1, 0, 0, 1, 1, 'MicroSDXC UHS-I U3', 'Smartphones, Caméras, Drones, Nintendo Switch', 'Blanc & Bleu', 5.0, 35),

-- 5. Gaming
('prod_mouse_gaming_rgb', 'store_sentech_main', 'cat_gaming', 'sub_souris_gaming', 'Gaming', 'Souris Gaming RGB', 'Logitech', 'Souris Gaming RGB Pro Haute Précision 12800 DPI', 'souris-gaming-rgb-pro-12800dpi', 'Souris gamer ultra-légère avec capteur optique haute précision réglable jusqu''à 12800 DPI, 7 boutons programmables et rétroéclairage RGB 16.8 millions de couleurs.', 22000.00, 16500.00, 25, '["assets/images/product_img16.webp"]', 1, 20, 58, 1, 1, 1, 1, 1, 'Filaire USB tressé', 'PC Windows, PS5, Xbox Series', 'Noir RGB', 4.9, 19),

('prod_headset_gaming_71', 'store_sentech_main', 'cat_gaming', 'sub_casques_gaming', 'Gaming', 'Casques Gaming Surround', 'Sony', 'Casque Gaming Surround 7.1 avec Micro Anti-Bruit', 'casque-gaming-surround-71', 'Casque gaming immersif avec son spatial 7.1, haut-parleurs néodyme 50mm, arceau rembourré ajustable et micro rétractable à réduction de bruit.', 38000.00, 29000.00, 24, '["assets/images/hero_product_img2.webp", "assets/images/product_img4.webp"]', 1, 12, 47, 1, 1, 0, 0, 1, 'USB + Jack 3.5mm', 'PlayStation 4/5, Xbox, PC, Nintendo Switch', 'Noir & Bleu Néon', 4.8, 22),

-- 6. Maison & Énergie
('prod_lamp_rgb_ambiance', 'store_sentech_main', 'cat_energie', 'sub_eclairage', 'Maison & Énergie', 'Lampes & Éclairage LED', 'Xiaomi', 'Lampe d''Ambiance LED Intelligente RGB Touch', 'lampe-ambiance-led-rgb-touch', 'Lampe de chevet tactile avec 16 millions de teintes colorées, variateur d''intensité et minuterie sommeil. Compatible contrôle tactile et application smartphone.', 24000.00, 18500.00, 23, '["assets/images/product_img9.webp"]', 1, 18, 36, 1, 0, 0, 0, 1, 'Sans fil / USB-C', 'Application Android et iOS', 'Blanc Dépoli', 4.7, 10),

('prod_plug_smart_wifi', 'store_sentech_main', 'cat_energie', 'sub_domotique', 'Maison & Énergie', 'Prises & Domotique Wi-Fi', 'Xiaomi', 'Prise Connectée Wi-Fi avec Compteur d''Énergie', 'prise-connectee-wifi-compteur-energie', 'Permet d''allumer ou éteindre vos appareils électriques à distance depuis votre téléphone. Suivi en temps réel de votre consommation électrique en kWh.', 12000.00, 8500.00, 29, '["assets/images/product_img1.webp"]', 1, 35, 75, 1, 0, 0, 1, 1, 'Wi-Fi 2.4GHz', 'Tuya, Smart Life, Google Assistant, Alexa', 'Blanc', 4.9, 16),

-- 7. Sécurité & Caméras
('prod_camera_wifi_indoor', 'store_sentech_main', 'cat_securite', 'sub_cameras_interieur', 'Sécurité & Caméras', 'Caméras Intérieures Wi-Fi', 'Xiaomi', 'Mini Caméra de Surveillance Wi-Fi 360° Full HD', 'mini-camera-surveillance-wifi-360', 'Caméra rotative motorisée à 360° avec vision nocturne infrarouge, détection humaine par IA et alertes instantanées sur smartphone. Audio bidirectionnel.', 28000.00, 21500.00, 23, '["assets/images/product_img15.webp", "assets/images/product_img11.webp"]', 1, 15, 68, 1, 1, 0, 1, 1, 'Wi-Fi 2.4GHz', 'iOS et Android', 'Blanc Compact', 4.9, 25),

('prod_camera_baby_monitor', 'store_sentech_main', 'cat_securite', 'sub_cameras_bebe', 'Sécurité & Caméras', 'Babyphones & Caméras Bébé', 'Xiaomi', 'Caméra Bébé Connectée Wi-Fi avec Détection de Pleurs', 'camera-bebe-connectee-wifi', 'Babyphone intelligent avec notification immédiate en cas de pleurs, veilleuse apaisante et berceuses intégrées pilotables depuis le smartphone.', 32000.00, 24000.00, 25, '["assets/images/product_img15.webp"]', 1, 10, 29, 1, 0, 1, 0, 1, 'Wi-Fi / Audio bidirectionnel', 'Application iOS & Android', 'Blanc & Rose Pâle', 4.8, 13)

ON DUPLICATE KEY UPDATE 
`price`=VALUES(`price`), `mrp`=VALUES(`mrp`), `stock`=VALUES(`stock`), `images`=VALUES(`images`), `category_id`=VALUES(`category_id`), `subcategory_id`=VALUES(`subcategory_id`);

-- ─── 5. GALERIE MULTI-IMAGES (PRODUCT_IMAGES) ────────────────────────────────

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`) VALUES
('prod_magsafe_car', 'assets/images/product_img1.webp', 1, 1),
('prod_magsafe_car', 'assets/images/product_img2.webp', 0, 2),
('prod_charger_gan65w', 'assets/images/product_img7.webp', 1, 1),
('prod_charger_gan65w', 'assets/images/product_img1.webp', 0, 2),
('prod_earbuds_anc_pro', 'assets/images/product_img3.webp', 1, 1),
('prod_earbuds_anc_pro', 'assets/images/product_img5.webp', 0, 2),
('prod_headphones_studio', 'assets/images/product_img4.webp', 1, 1),
('prod_headphones_studio', 'assets/images/hero_product_img1.webp', 0, 2),
('prod_smartwatch_sport_pro', 'assets/images/product_img8.webp', 1, 1),
('prod_smartwatch_sport_pro', 'assets/images/product_img13.webp', 0, 2),
('prod_speaker_smart_gray', 'assets/images/product_img6.webp', 1, 1),
('prod_speaker_smart_gray', 'assets/images/product_img12.webp', 0, 2),
('prod_camera_wifi_indoor', 'assets/images/product_img15.webp', 1, 1),
('prod_camera_wifi_indoor', 'assets/images/product_img11.webp', 0, 2)
ON DUPLICATE KEY UPDATE `image_url`=VALUES(`image_url`);

-- ─── 6. LIAISON PRODUITS & COLLECTIONS MARKETING ─────────────────────────────

INSERT IGNORE INTO `collection_products` (`collection_id`, `product_id`) VALUES
-- Meilleures Ventes
('col_bestsellers', 'prod_charger_gan65w'),
('col_bestsellers', 'prod_earbuds_anc_pro'),
('col_bestsellers', 'prod_headphones_studio'),
('col_bestsellers', 'prod_smartwatch_sport_pro'),
('col_bestsellers', 'prod_magsafe_car'),
('col_bestsellers', 'prod_stand_laptop_alu'),

-- Nouveautés
('col_new', 'prod_charger_gan65w'),
('col_new', 'prod_earbuds_anc_pro'),
('col_new', 'prod_smartwatch_sport_pro'),
('col_new', 'prod_keyboard_bt_compact'),
('col_new', 'prod_mouse_gaming_rgb'),
('col_new', 'prod_camera_baby_monitor'),

-- Ventes Flash
('col_flash', 'prod_magsafe_car'),
('col_flash', 'prod_charger_gan65w'),
('col_flash', 'prod_earbuds_anc_pro'),
('col_flash', 'prod_speaker_smart_gray'),
('col_flash', 'prod_smartwatch_sport_pro'),
('col_flash', 'prod_hub_usbc_7in1'),

-- Moins de 10 000 FCFA
('col_under_10k', 'prod_cable_usbc_100w'),
('col_under_10k', 'prod_pack_accessoires'),
('col_under_10k', 'prod_sdcard_128gb'),
('col_under_10k', 'prod_plug_smart_wifi'),

-- Moins de 25 000 FCFA
('col_under_25k', 'prod_magsafe_car'),
('col_under_25k', 'prod_charger_gan65w'),
('col_under_25k', 'prod_charger_20w_apple'),
('col_under_25k', 'prod_powerbank_20k'),
('col_under_25k', 'prod_mouse_ergo_wireless'),
('col_under_25k', 'prod_keyboard_bt_compact'),
('col_under_25k', 'prod_stand_laptop_alu'),
('col_under_25k', 'prod_hub_usbc_7in1'),
('col_under_25k', 'prod_webcam_fhd_1080p'),
('col_under_25k', 'prod_ringlight_led_desk'),
('col_under_25k', 'prod_mouse_gaming_rgb'),
('col_under_25k', 'prod_lamp_rgb_ambiance'),
('col_under_25k', 'prod_camera_wifi_indoor'),
('col_under_25k', 'prod_camera_bebe_connectee');

-- ─── 7. AVIS CLIENTS VÉRIFIÉS ────────────────────────────────────────────────

INSERT INTO `product_reviews` (`id`, `product_id`, `user_name`, `rating`, `comment`, `status`) VALUES
('rev_1', 'prod_headphones_studio', 'Moussa Diallo', 5, 'Excellente qualité sonore et réduction de bruit impressionnante pour les trajets à Dakar ! Livraison reçue en 1h30.', 'published'),
('rev_2', 'prod_charger_gan65w', 'Awa Ndiaye', 5, 'Charge mon MacBook Pro et mon iPhone en même temps à vitesse grand V. Produit 100% original, je recommande vivement !', 'published'),
('rev_3', 'prod_earbuds_anc_pro', 'Cheikh Tidiane Sène', 5, 'Basses bien rondes, les micros en appel sont parfaits même dans le vent. Très satisfait.', 'published'),
('rev_4', 'prod_smartwatch_sport_pro', 'Fatou Kiné Sow', 5, 'L''écran AMOLED est sublime et la batterie tient facilement 8 jours. Reçu avec le livreur très courtois.', 'published'),
('rev_5', 'prod_magsafe_car', 'Ibrahima Ba', 5, 'L''aimant tient fermement mon iPhone même sur les dos d''âne. Super achat !', 'published')
ON DUPLICATE KEY UPDATE `rating`=VALUES(`rating`), `status`='published';

SET FOREIGN_KEY_CHECKS = 1;
