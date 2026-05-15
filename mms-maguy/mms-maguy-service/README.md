# MMS MAGUY SERVICE — ERP

Système de gestion complet pour imprimerie & centre de services.
Abidjan, Côte d'Ivoire.

## Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- MongoDB + Mongoose

## Installation

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd mms-maguy-service

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditez .env avec votre URI MongoDB

# 4. Lancer en développement
npm run dev
```

## Modules

| Module | Route |
|---|---|
| Dashboard | `/` |
| Agenda | `/agenda` |
| Clients | `/clients` |
| Commandes | `/commandes` |
| Kanban production | `/kanban` |
| Factures & Devis | `/factures` |
| Export CSV | `/export` |

## API Routes

```
GET/POST  /api/clients
GET/PUT/DELETE /api/clients/[id]

GET/POST  /api/commandes
GET/PUT/DELETE /api/commandes/[id]

GET/POST  /api/agenda
PUT/DELETE /api/agenda/[id]

GET/POST  /api/factures
GET/PUT/DELETE /api/factures/[id]

GET       /api/export?type=clients|commandes|factures
GET       /api/dashboard
```

## Variables d'environnement

```
MONGODB_URI=mongodb://localhost:27017/mms-maguy
```

---
Développé pour MMS MAGUY SERVICE — Production ready.
