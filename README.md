# SenTechPLUS — Boutique High-Tech & Accessoires Smartphone Sénégal

Plateforme e-commerce multi-vendeurs dédiée aux accessoires High-Tech au Sénégal (Dakar).

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript 5 |
| Auth | NextAuth.js v5 (Auth.js) |
| Base de données | PostgreSQL via Supabase |
| ORM | Prisma 6 |
| Cache / Rate-limiting | Upstash Redis |
| State management | Zustand |
| Styles | Tailwind CSS 4 |
| Déploiement | Vercel |

---

## Setup local

### Prérequis

- Node.js ≥ 20
- npm ≥ 10
- Compte Supabase (PostgreSQL)
- Compte Upstash (Redis)

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/sekhoutoure/sentech-plus.git
cd sentech-plus

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Ouvrir .env.local et remplir toutes les valeurs

# 4. Générer le client Prisma & migrer la base de données
npx prisma generate
npx prisma db push

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner :

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CURRENCY_SYMBOL` | Devise affichée (ex: ` FCFA`) |
| `ADMIN_SECRET_KEY` | Clé pour les routes admin (`openssl rand -hex 32`) |
| `NEXTAUTH_SECRET` | Secret JWT NextAuth (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL de base (ex: `http://localhost:3000`) |
| `DATABASE_URL` | URL poolée Supabase (pgBouncer) |
| `DIRECT_URL` | URL directe Supabase (pour migrations) |
| `UPSTASH_REDIS_REST_URL` | URL REST Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST Upstash Redis |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | (Optionnel) ID Google Analytics GA4 |

> ⚠️ Ne jamais committer `.env.local` dans git. Il est dans `.gitignore`.

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (http://localhost:3000) |
| `npm run build` | Build de production (inclut `prisma generate`) |
| `npm run start` | Démarrer le serveur de production |
| `npm run lint` | Vérification ESLint |

---

## Architecture

```
sentech-plus/
├── app/                    # Routes Next.js App Router
│   ├── (auth)/             # Pages d'authentification
│   ├── (public)/           # Pages publiques (home, shop, product…)
│   ├── admin/              # Tableau de bord admin
│   └── api/                # Routes API (auth, produits, commandes…)
├── components/             # Composants React réutilisables
├── lib/
│   ├── stores/             # Stores Zustand (state global)
│   ├── db.ts               # Repositories Prisma
│   └── prisma.ts           # Client Prisma singleton
├── prisma/
│   └── schema.prisma       # Schéma de base de données
└── .github/workflows/      # CI GitHub Actions
```

---

## CI / Déploiement

Un workflow GitHub Actions (`ci.yml`) s'exécute sur chaque push vers `main` :
1. Install des dépendances (`npm ci`)
2. Lint ESLint (`npm run lint`)
3. Build de production (`npm run build`)

Les secrets de production doivent être ajoutés dans **Settings → Secrets and variables → Actions** du repository GitHub.

---

## Licence

Propriétaire — © 2026 SenTechPLUS. Tous droits réservés.
