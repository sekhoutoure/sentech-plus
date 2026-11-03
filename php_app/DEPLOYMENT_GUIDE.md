# 🚀 Guide de Déploiement en Production — SenTechPLUS 2026

Ce guide détaille la procédure pas-à-pas pour déployer **SenTechPLUS** sur votre hébergement de production (**Hostinger Premium**, **cPanel**, **VPS Linux** ou serveur **Apache/Nginx**).

---

## 📋 1. Prérequis Serveur

- **PHP** : Version **8.1, 8.2 ou 8.3**
- **Extensions PHP requises** :
  - `pdo_mysql` (Base de données)
  - `gd` ou `imagick` (Génération et conversion WebP haute performance)
  - `fileinfo` (Validation MIME par Magic Bytes)
  - `mbstring`, `openssl`, `curl`, `json`
  - `apcu` (Optionnel mais recommandé pour le cache mémoire ultra-rapide)
- **Base de données** : MySQL 5.7+ ou MariaDB 10.3+
- **Serveur Web** : Apache avec `mod_rewrite`, `mod_headers`, `mod_deflate`, `mod_expires` (ou Nginx).

---

## 🗄️ 2. Étape 1 : Importation de la Base de Données

1. Rendez-vous sur votre espace d'hébergement (**hPanel Hostinger** ou **cPanel**).
2. Ouvrez **Bases de données MySQL** et créez une nouvelle base (ex: `u123456_sentech`).
3. Créez un utilisateur MySQL avec tous les privilèges et notez le mot de passe.
4. Ouvrez **phpMyAdmin**, sélectionnez votre base de données.
5. Cliquez sur **Importer** $\rightarrow$ **Choisir un fichier** :
   - Sélectionnez [`database/production_schema.sql`](database/production_schema.sql)
6. Cliquez sur **Exécuter**. En 1 clic, toutes les tables, index de performance et le catalogue initial sont créés !

---

## ⚙️ 3. Étape 2 : Configuration du Fichier `.env`

1. Sur le serveur, à la racine du dossier `public_html` (ou dossier web), copiez `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```
2. Éditez `.env` et renseignez vos informations réelles :
   ```ini
   APP_ENV=production
   APP_DEBUG=false
   APP_SECRET=generez_une_chaine_aleatoire_tres_longue_64_caracteres
   APP_URL=https://votre-domaine.com

   # Identifiants MySQL créés à l'étape 1
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=u123456_sentech
   DB_USER=u123456_sentech_user
   DB_PASS=VotreMotDePasseTresSecurise!

   # Contact officiel
   CONTACT_EMAIL=contact@sentechplus.com
   CONTACT_PHONE="+221 78 131 64 97"
   WHATSAPP_PHONE=221781316497
   WHATSAPP_DISPLAY="+221 78 131 64 97"

   # Passerelle PayDunya Sénégal (Passage en Live)
   PAYMENT_ENV=live
   PAYDUNYA_MASTER_KEY=votre_cle_master_paydunya
   PAYDUNYA_LIVE_PRIVATE_KEY=live_private_xxxxxxxxxxxxxxxxxxxx
   PAYDUNYA_LIVE_TOKEN=live_token_xxxxxxxxxxxxxxxxxxxx
   ```

---

## 🔒 4. Étape 3 : Permissions des Répertoires

Assurez-vous que les répertoires d'écriture ont les bons droits :
```bash
chmod 755 storage storage/logs storage/cache storage/security_cache storage/backups
chmod 755 assets/images/uploads assets/images/uploads/products assets/images/uploads/stores assets/images/uploads/banners
chmod 600 .env
```

---

## ⏰ 5. Étape 4 : Configuration des Tâches Cron (Automatisations)

Sur le panneau de contrôle de votre hébergeur (**Tâches Cron / Scheduled Tasks**) :

1. **Sauvegarde quotidienne automatique de la base de données (02h00 du matin)** :
   ```bash
   0 2 * * * php /home/u123456/public_html/cron/backup.php >/dev/null 2>&1
   ```
2. **Nettoyage automatique des caches expirés (Toutes les heures)** :
   ```bash
   0 * * * * php -r "require '/home/u123456/public_html/includes/cache_engine.php'; CacheEngine::clear();" >/dev/null 2>&1
   ```

---

## 🛡️ 6. Étape 5 : Vérification Post-Déploiement

Accédez aux URL suivantes pour valider l'installation :
1. **Boutique Publique** : `https://votre-domaine.com/` (Vérifiez l'affichage du hero, des bannières et des produits).
2. **Sitemap XML** : `https://votre-domaine.com/sitemap.xml` (Doit renvoyer un flux XML valide).
3. **Flux Google Shopping** : `https://votre-domaine.com/feed.xml`.
4. **Espace Admin** : `https://votre-domaine.com/admin/` :
   - Email : `admin@sentechplus.com`
   - Mot de passe initial : `password` *(À changer immédiatement dans votre profil !)*
5. **Cockpit de Sécurité** : `https://votre-domaine.com/admin/security.php` (Vérifiez que tous les boucliers sont au vert).

---

🎉 **Votre boutique SenTechPLUS est 100% prête pour la production et pour accueillir vos premiers clients sénégalais et internationaux !**