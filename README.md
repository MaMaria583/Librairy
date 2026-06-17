# GestionLibrairy 📚

Application complète de gestion de librairie et papeterie — Next.js 15 + Prisma + SQLite.

## Stack technique

- **Frontend** : Next.js 15 (App Router), React 19, Tailwind CSS
- **Base de données** : SQLite via Prisma ORM
- **API** : Server Actions Next.js
- **Graphiques** : Recharts
- **Icônes** : Lucide React

## Fonctionnalités

- 📊 **Tableau de bord** — KPIs, graphique des ventes, alertes stock bas, top ventes
- 🛒 **Caisse (POS)** — Scanner de codes-barres, panier, remises, rendu monnaie
- 📚 **Catalogue Livres** — ISBN, auteur, éditeur, genre, emplacement
- 🖊️ **Catalogue Fournitures** — SKU, marque, catégorie
- 📦 **Alertes stock** — Stock bas, suggestions de réapprovisionnement, invendus
- 🏭 **Fournisseurs** — Annuaire, association produits
- 🗂️ **Historique des ventes**

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/MaMaria583/Librairy.git
cd Librairy

# 2. Installer les dépendances
npm install

# 3. Configurer la base de données
cp .env.example .env
# DATABASE_URL="file:./dev.db" est déjà configuré

# 4. Créer la base de données
npm run db:push

# 5. Injecter les données de test
npm run db:seed

# 6. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run db:push` | Créer/mettre à jour la BDD |
| `npm run db:seed` | Injecter les données de test |
| `npm run db:studio` | Ouvrir Prisma Studio |

## Structure du projet

```
src/
├── app/                    # Pages (App Router)
│   ├── dashboard/          # Tableau de bord
│   ├── caisse/             # Point de vente
│   ├── stock/
│   │   ├── livres/         # Catalogue livres
│   │   ├── fournitures/    # Catalogue fournitures
│   │   └── alertes/        # Alertes & réapprovisionnement
│   ├── ventes/             # Historique des ventes
│   ├── fournisseurs/       # Gestion fournisseurs
│   └── parametres/         # Paramètres
├── components/             # Composants React
│   ├── Sidebar.tsx
│   ├── caisse/
│   ├── dashboard/
│   ├── fournisseurs/
│   └── stock/
└── lib/
    ├── prisma.ts           # Client Prisma singleton
    ├── utils.ts            # Utilitaires
    └── actions/            # Server Actions
        ├── products.ts
        ├── sales.ts
        └── suppliers.ts
prisma/
├── schema.prisma           # Schéma BDD
└── seed.ts                 # Données de test
```
