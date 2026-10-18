# FactoryFlow 🏭

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://mongoosejs.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-orange.svg)](http://localhost:3000/api/docs)

**FactoryFlow** est une API REST de gestion de production industrielle et d'ateliers de fabrication. Elle permet d'orchestrer les matières premières, les nomenclatures produits, les stocks et le cycle de vie complet des ordres de fabrication avec déduction atomique.

---

## 📑 Sommaire
1. [Fonctionnalités](#-fonctionnalités)
2. [Architecture du Projet](#-architecture-du-projet)
3. [Prérequis](#-prérequis)
4. [Variables d'environnement](#-variables-denvironnement)
5. [Démarrage rapide avec Docker](#-démarrage-rapide-avec-docker)
6. [Démarrage local (sans Docker)](#-démarrage-local-sans-docker)
7. [Procédure d'installation initiale](#-procédure-dinstallation-initiale)
8. [Documentation des Endpoints (Swagger)](#-documentation-des-endpoints-swagger)
9. [Cycle de vie d'un Ordre de Fabrication](#-cycle-de-vie-dun-ordre-de-fabrication)

---

## 🚀 Fonctionnalités

- **Installation API** : Création sécurisée du compte administrateur initial (Singleton).
- **Authentification & Rôles (JWT)** : Contrôle d'accès basé sur les rôles (`admin`, `operateur`).
- **Gestion des Matières Premières & Stocks** :
  - CRUD des matières premières avec référence unique.
  - Entrées de stock avec suivi et historique chronologique des mouvements.
  - Système d'alertes automatiques pour les matières sous le seuil critique.
- **Gestion des Produits & Compositions** :
  - Définition de nomenclatures (recette de fabrication).
  - Validation de l'unicité et de l'existence des composants.
- **Ordres de Fabrication (OF)** :
  - Planification avec snapshot figé de la composition.
  - Démarrage par l'opérateur avec vérification et déduction atomique des stocks (session MongoDB).
  - Terminaison et consultation des ordres assignés.

---

## 🏗️ Architecture du Projet

Le projet suit une architecture en couches (**MVC / Repository-Service-Controller**) :

```text
src/
├── Models/             # Schémas Mongoose (User, MatierePremiere, Produit, Ordre, etc.)
├── repositories/       # Couche d'accès aux données (MongoDB/Mongoose)
├── services/           # Logique métier et règles de validation
├── controllers/        # Contrôleurs Express (gestion requêtes / réponses HTTP)
├── routes/             # Définition des routes et protection par rôles
├── middlewares/        # Authentification JWT, rôles et gestion centralisée des erreurs
├── config/             # Configuration JWT, Swagger et MongoDB
├── app.js              # Configuration de l'application Express
└── server.js           # Point d'entrée et démarrage du serveur
```

---

## 💻 Prérequis

- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur
- **Docker** et **Docker Compose** (recommandé)

---

## 🔑 Variables d'environnement

Créer un fichier `.env` à la racine en copiant le fichier `.env.example` :

```bash
cp .env.example .env
```

Contenu type du fichier `.env` :

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://mongodb:27017/factoryflow?replicaSet=rs0
JWT_SECRET=votre_cle_secrete_longue_et_aleatoire
JWT_EXPIRES_IN=1h
```

---

## 🐳 Démarrage rapide avec Docker

Pour lancer l'environnement complet (Backend Node.js + MongoDB ReplicaSet) :

```bash
# Démarrer les conteneurs en arrière-plan
docker compose up -d --build

# Consulter les logs en temps réel
docker compose logs -f

# Arrêter les conteneurs
docker compose down

# Arrêter et supprimer les volumes (réinitialisation complète)
docker compose down -v
```

---

## ⚙️ Démarrage local (sans Docker)

Si vous disposez déjà d'une instance MongoDB locale :

```bash
# Installer les dépendances
npm install

# Lancer en mode développement (avec nodemon)
npm run dev

# Lancer en mode production
npm start
```

---

## 🛠️ Procédure d'installation initiale

À la première mise en service, l'application doit être initialisée en créant le premier compte Administrateur :

1. **Vérifier l'état de l'installation** :
   ```http
   GET http://localhost:3000/api/installation/status
   ```
   *Réponse attendue* : `{ "installed": false }`

2. **Créer le premier administrateur** :
   ```http
   POST http://localhost:3000/api/installation
   Content-Type: application/json

   {
     "nom": "Administrateur",
     "email": "admin@factoryflow.com",
     "password": "Password123!"
   }
   ```

3. **Se connecter pour obtenir le token JWT** :
   ```http
   POST http://localhost:3000/api/auth/login
   Content-Type: application/json

   {
     "email": "admin@factoryflow.com",
     "password": "Password123!"
   }
   ```

---

## 📖 Documentation des Endpoints (Swagger)

Une documentation interactive complète OpenAPI / Swagger UI est accessible à l'adresse suivante :

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

### Synthèse des Endpoints

| Catégorie | Méthode | URL | Description | Rôle |
| :--- | :--- | :--- | :--- | :--- |
| **Installation** | `GET` | `/api/installation/status` | Statut d'installation | Public |
| | `POST` | `/api/installation` | Initialiser le compte Admin | Public |
| **Auth** | `POST` | `/api/auth/login` | Connexion et génération JWT | Public |
| | `GET` | `/api/auth/me` | Profil utilisateur connecté | Authentifié |
| **Admin** | `POST` | `/api/admin/users` | Créer un compte opérateur/admin | Admin |
| **Matières** | `POST` | `/api/matieres` | Créer une matière première | Admin |
| | `GET` | `/api/matieres` | Lister toutes les matières | Admin |
| | `GET` | `/api/matieres/alertes` | Matières sous le seuil d'alerte | Admin |
| | `GET` | `/api/matieres/:id` | Détail d'une matière | Admin |
| | `PUT` | `/api/matieres/:id` | Modifier une matière | Admin |
| | `POST` | `/api/matieres/:id/entrees` | Enregistrer une entrée de stock | Admin |
| | `GET` | `/api/matieres/:id/mouvements` | Historique des mouvements | Admin |
| **Produits** | `POST` | `/api/produits` | Créer un produit avec composition | Admin |
| | `GET` | `/api/produits` | Lister tous les produits | Admin |
| | `GET` | `/api/produits/:id` | Détail d'un produit | Admin |
| | `PUT` | `/api/produits/:id` | Modifier un produit | Admin |
| **Ordres** | `POST` | `/api/ordres` | Planifier un ordre (snapshot) | Admin |
| | `GET` | `/api/ordres` | Lister les ordres (filtres + pagination) | Admin |
| | `GET` | `/api/ordres/mes-ordres` | Ordres assignés à l'opérateur connecté | Opérateur |
| | `GET` | `/api/ordres/:id` | Détail complet d'un ordre | Authentifié |
| | `PUT` | `/api/ordres/:id` | Modifier un ordre planifié | Admin |
| | `DELETE` | `/api/ordres/:id` | Annuler un ordre planifié | Admin |
| | `POST` | `/api/ordres/:id/demarrer` | Démarrer l'ordre (déduction atomique) | Opérateur |
| | `POST` | `/api/ordres/:id/terminer` | Clôturer l'ordre de fabrication | Opérateur |

---

## 🔄 Cycle de vie d'un Ordre de Fabrication

```text
[ planifié ]  ──(démarrer : vérif & déduction stock)──>  [ en_cours ]  ──(terminer)──>  [ terminé ]
      │
      └──(annuler : aucune déduction)──>  [ annulé ]
```
