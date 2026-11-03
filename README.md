# 🇸🇳 SenTechPLUS — Plateforme E-Commerce & Marketplace SaaS High-Tech

**SenTechPLUS** est une plateforme e-commerce et marketplace SaaS moderne, ultra-rapide et sécurisée, spécialement conçue pour le marché sénégalais et ouest-africain (Dakar).

---

## ⚡ Stack Technique & Performance

| Couche | Technologie |
| :--- | :--- |
| **Backend** | PHP 8.1+ natif (PDO MySQL, Sessions sécurisées, RBAC, CSRF, Bcrypt) |
| **Frontend** | HTML5 Sémantique + Vanilla JS (100% sans framework, 9 KB minifié) |
| **Styling** | Tailwind CSS CDN + Google Fonts **Inter** |
| **Base de données** | MySQL 8.0 / MariaDB (13 tables relationnelles, intégrité FK) |
| **Formats Médias** | WebP haute compression (2.66 MB pour toute l'application) |
| **Paiements** | **Wave**, **Orange Money**, **Paiement à la livraison**, **Commande 1-Clic WhatsApp** |
| **Serveur / Cache** | Apache (.htaccess GZIP + Browser Caching) / PHP CLI Router |

---

## 🚀 Démarrage Rapide en Local

### Prérequis
- **PHP 8.0+** installé (ex: XAMPP, Laragon, WAMP ou PHP CLI)
- **MySQL / MariaDB** (optionnel grâce au mode démo in-memory résilient)

### Lancer le serveur local :
```powershell
cd sentech-plus/php_app
php -S localhost:8000 router.php
```
👉 Ouvrez votre navigateur sur **[http://localhost:8000](http://localhost:8000)**.

---

## 📂 Structure du Projet

```
sentech-plus/
└── php_app/                       # 🚀 Application E-Commerce complète
    ├── admin/                     # 👑 Module d'administration (8 pages)
    │   ├── index.php              # Tableau de bord global KPI
    │   ├── products.php           # Gestion du catalogue et stocks
    │   ├── orders.php             # Pipeline de statut des commandes
    │   ├── stores.php             # Modération des boutiques vendeurs
    │   ├── categories.php         # Gestion des catégories
    │   ├── coupons.php            # Gestion des codes promo
    │   ├── delivery-slip.php      # Bordereaux de livraison A4 imprimables
    │   └── export-orders.php      # Export CSV comptable compatible Excel
    │
    ├── seller/                    # 💼 Portail Vendeur SaaS dédié
    │   ├── index.php              # Dashboard vendeur & gains boutique
    │   ├── products.php           # Gestionnaire de produits du vendeur
    │   └── orders.php             # Suivi des commandes reçues
    │
    ├── assets/                    # 🎨 Assets optimisés
    │   ├── images/                # Images produits WebP ultra-légères
    │   └── js/                    # app.js & app.min.js (Vanilla JS)
    │
    ├── config/                    # ⚙️ Configuration & Sessions
    │   └── config.php             # Connexion PDO, helpers, CSRF, paniers
    │
    ├── database/                  # 💾 Base de données
    │   └── schema.sql             # Schéma SQL 13 tables + données de démo
    │
    ├── includes/                  # 🧩 Composants partagés
    │   ├── header.php             # En-tête, SEO OpenGraph, polices Inter
    │   ├── navbar.php             # Navigation desktop, mobile drawer
    │   ├── footer.php             # Footer, barre 5 onglets, actions flottantes
    │   ├── cart_drawer.php        # Tiroir panier latéral slide-over
    │   └── quick_view_modal.php   # Modale d'aperçu rapide produit
    │
    ├── index.php                  # 🏠 Page d'accueil & Hero Carousel
    ├── shop.php                   # 🛍️ Catalogue, filtres de prix & pagination
    ├── product.php                # 🎧 Fiche produit interactive & avis
    ├── cart.php                   # 🛒 Panier & coupons de réduction
    ├── checkout.php               # 💳 Caisse Wave / Orange Money / COD
    ├── order-success.php          # 🧾 Reçu de commande numérique
    ├── store.php                  # 🏪 Page vitrine publique d'un vendeur
    ├── pricing.php                # 💼 Formules d'abonnement SaaS Vendeur
    ├── create-store.php           # 📝 Inscription & onboarding boutique
    ├── wishlist.php               # ❤️ Favoris
    ├── orders.php                 # 📦 Historique des commandes client
    ├── login.php / register.php   # 🔐 Authentification sécurisée Bcrypt
    ├── contact.php / about.php    # 📞 Support client & présentation
    ├── api-payment-webhook.php    # ⚡ Webhook Mobile Money instantané
    ├── sitemap.php / sitemap.xml  # 🗺️ Sitemap XML SEO dynamique
    ├── robots.txt                 # 🤖 Directives moteurs de recherche
    └── .htaccess                  # 🛡️ Sécurité & compression GZIP
```

---

## 🔑 Comptes & Accès de Démonstration

| Rôle | Email | Mot de passe | Accès |
| :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@sentechplus.sn` | `admin123` | `/admin/index.php` |
| **Vendeur Partenaire** | `vendeur@sentechplus.sn` | `vendeur123` | `/seller/index.php` |
| **Client** | `client@sentechplus.sn` | `client123` | `/orders.php` |

---

## 🌐 Déploiement en Production (Hostinger / cPanel / Apache)

1. **Uploadez** tout le contenu du dossier `php_app/` directement dans le dossier `public_html/` de votre hébergement via FTP ou le Gestionnaire de Fichiers.
2. **Créez une base MySQL** dans votre panneau d'hébergement et importez le fichier `database/schema.sql`.
3. **Mettez à jour** les identifiants de connexion MySQL dans `config/config.php` :
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'nom_de_votre_base');
   define('DB_USER', 'utilisateur_mysql');
   define('DB_PASS', 'mot_de_passe_mysql');
   ```
4. Votre boutique est immédiatement en ligne et prête pour vos clients ! 🚀
